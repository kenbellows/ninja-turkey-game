import { closeTo, makeRect, Rect, rectsIntersect } from '../math.js'
import { Sprite, SpriteConfig } from './Sprite.js'
import { SpriteState } from './SpriteSheet.js'

type PlayerConfig = SpriteConfig & {
  hops?: number
  keys: Keys
  name: string
  speed?: number
  players: Player[]
}

export type Keys = {
  attack?: string
  left: string
  right: string
  jump: string
  duck: string
}

export class Player extends Sprite {
  public hops: number
  public keys: Keys
  public speed: number
  public name: string
  public players: Player[]

  public health: number
  public dead: boolean = false

  private ducking: boolean = false
  private hitCountdown: number
  private keysPressed: { [key: string]: boolean } = {}
  private keyStack: string[] = []

  constructor({
    hops = 10,
    keys,
    name,
    speed = 8,
    players,
    ...spriteConfig
  }: PlayerConfig) {
    super(spriteConfig)

    this.hops = hops
    this.keys = keys
    this.name = name
    this.speed = speed
    this.players = players

    this.health = 100

    this.hitCountdown = 0
  }

  update(ctx: CanvasRenderingContext2D) {
    super.update(ctx)
    const floor = ctx.canvas.height - this.getFloor()
    if (
      this.spriteState === SpriteState.JUMP &&
      closeTo(this.position.y, floor) &&
      this.health > 0
    ) {
      if (this.velocity.x !== 0) {
        this.spriteState = SpriteState.WALK
      } else {
        this.spriteState = SpriteState.IDLE
      }
    }
    if (this.hitCountdown > 0) {
      this.hitCountdown -= 1
    } else if (
      this.spriteState === SpriteState.HIT &&
      this.hitCountdown === 0
    ) {
      this.revertState()
    }
  }

  revertState() {
    if (this.position.y < this.ctx.canvas.height - this.getFloor() - 5) {
      this.spriteState = SpriteState.JUMP
    } else if (this.keysPressed[this.keys.right]) {
      this.facing = 'right'
      this.walk(1)
    } else if (this.keysPressed[this.keys.left]) {
      this.facing = 'left'
      this.walk(-1)
    } else {
      this.spriteState = SpriteState.IDLE
    }
  }

  duck() {
    this.ducking = true
    this.spriteState = SpriteState.DUCK
    this.velocity.x = 0
  }

  unduck() {
    this.ducking = false
    this.revertState()
  }

  walk(sign: 1 | -1 = 1) {
    this.velocity.x = this.speed * sign
    if (this.position.y === this.ctx.canvas.height - this.getFloor()) {
      this.spriteState = SpriteState.WALK
    }
  }

  jump() {
    if (this.position.y >= this.ctx.canvas.height - this.getFloor() - 5) {
      this.velocity.y = -1 * this.hops
      this.spriteState = SpriteState.JUMP
    }
  }

  landOnFloor() {
    if (this.keyStack.at(-1) === this.keys.right) {
      this.facing = 'right'
      this.walk(1)
    } else if (this.keyStack.at(-1) === this.keys.left) {
      this.facing = 'left'
      this.walk(-1)
    } else {
      this.spriteState = SpriteState.IDLE
    }
  }

  getAttackRect(): Rect {
    return makeRect(
      this.position.x +
        (this.facing === 'right' ? this.size.width : -this.size.width),
      this.position.y + this.size.height * 0.2,
      this.size.width,
      this.size.height * 0.5
    )
  }

  attack() {
    this.spriteState = SpriteState.ATTACK

    const attackRect: Rect = this.getAttackRect()

    for (const player of this.players) {
      if (player === this) {
        continue
      }

      let hitBoxHeight: number = player.size.height
      if (player.ducking) {
        if (
          player.spriteSheet.states[SpriteState.DUCK] &&
          player.spriteSheet.states[SpriteState.IDLE]
        ) {
          hitBoxHeight *=
            player.spriteSheet.states[SpriteState.DUCK].size.height /
            player.spriteSheet.states[SpriteState.IDLE].size.height
        } else {
          hitBoxHeight *= 0.6
        }
      }
      const playerRect = {
        x1: player.position.x,
        y1: player.position.y + player.size.height - hitBoxHeight,
        x2: player.position.x + player.size.width,
        y2: player.position.y + hitBoxHeight
      }
      if (rectsIntersect(attackRect, playerRect)) {
        player.velocity.x = player.position.x > this.position.x ? 10 : -10
        player.health -= 10
        player.hitCountdown = 10
        if (player.health <= 0) {
          player.die()
        }
      }
    }
  }

  die() {
    this.dead = true
    this.ignoreBoundaries.floor = true
    this.velocity.y = -1 * this.hops
    this.spriteState = SpriteState.HIT
    this.keysPressed = {}
    this.keyStack = []
  }

  /**
   * @param {string} key
   * @param {CanvasRenderingContext2D} ctx
   */
  handleKeydown(key: string) {
    if (this.dead) {
      return
    }

    if (!(this.spriteSheet.states[this.spriteState].oneShot || this.ducking)) {
      if (key === this.keys.right) {
        this.facing = 'right'
        this.walk(1)
      } else if (key === this.keys.left) {
        this.facing = 'left'
        this.walk(-1)
      } else if (key === this.keys.jump) {
        this.jump()
      } else if (key === this.keys.attack) {
        this.attack()
      } else if (
        key === this.keys.duck &&
        closeTo(this.position.y, this.ctx.canvas.height - this.getFloor())
      ) {
        this.duck()
      }
    }

    if (Object.values(this.keys).includes(key)) {
      this.keysPressed[key] = true
      this.keyStack.push(key)
    }
  }

  /**
   * @param {string} key
   * @param {CanvasRenderingContext2D} ctx
   */
  handleKeyup(key: string) {
    if (this.dead) {
      return
    }
    const poppingStack = key === this.keyStack.at(-1)

    if (delete this.keysPressed[key]) {
      this.keyStack = this.keyStack.filter((k) => k !== key)
    }

    if (key === this.keys.duck) {
      this.unduck()
    }

    if (poppingStack) {
      if (this.keyStack.length > 0) {
        this.handleKeydown(this.keyStack.pop())
      } else if (
        [this.keys.left, this.keys.right].includes(key) &&
        this.spriteState === SpriteState.WALK
      ) {
        this.velocity.x = 0
        this.spriteState = SpriteState.IDLE
      }
    }
  }
}
