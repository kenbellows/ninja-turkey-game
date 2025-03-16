import { drawRect } from '../draw.js'
import { closeTo, makeRect, Rect, rectsIntersect } from '../math.js'
import { Thing, ThingConfig } from './Thing.js'

type BlockConfig = ThingConfig & {
  hops?: number
  keys: Keys
  name: string
  speed?: number
  players: Block[]
}

export type Keys = {
  attack?: string
  left: string
  right: string
  jump: string
  duck: string
}

export class Block extends Thing {
  public hops: number
  public keys: Keys
  public speed: number
  public name: string
  public players: Block[]

  public health: number
  public dead: boolean = false

  private ducking: boolean = false
  private keysPressed: { [key: string]: boolean } = {}
  private keyStack: string[] = []

  constructor({
    hops = 10,
    keys,
    name,
    speed = 8,
    players,
    ...thingConfig
  }: BlockConfig) {
    super(thingConfig)

    this.hops = hops
    this.keys = keys
    this.name = name
    this.speed = speed
    this.players = players

    this.health = 100
  }

  draw(ctx: CanvasRenderingContext2D) {
    const rect = {
      color: this.color,
      position: { ...this.position },
      size: { ...this.size }
    }
    if (this.ducking) {
      rect.size.height /= 2
      rect.position.y += this.size.height - rect.size.height
    }
    drawRect(ctx, rect)
  }

  duck() {
    this.ducking = true
    this.velocity.x = 0
  }

  unduck() {
    this.ducking = false
  }

  walk(sign: 1 | -1 = 1) {
    this.velocity.x = this.speed * sign
  }

  jump() {
    if (this.position.y >= this.ctx.canvas.height - this.getFloor() - 5) {
      this.velocity.y = -1 * this.hops
    }
  }

  landOnFloor() {
    if (this.keyStack.at(-1) === this.keys.right) {
      this.facing = 'right'
      this.walk(1)
    } else if (this.keyStack.at(-1) === this.keys.left) {
      this.facing = 'left'
      this.walk(-1)
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
    const attackRect: Rect = this.getAttackRect()

    for (const block of this.players) {
      if (block === this) {
        continue
      }

      let hitBoxHeight: number = block.size.height
      if (block.ducking) {
        hitBoxHeight *= block.size.height / 2
      }

      const playerRect = {
        x1: block.position.x,
        y1: block.position.y + block.size.height - hitBoxHeight,
        x2: block.position.x + block.size.width,
        y2: block.position.y + hitBoxHeight
      }
      if (rectsIntersect(attackRect, playerRect)) {
        block.velocity.x = block.position.x > this.position.x ? 10 : -10
        block.health -= 10
        if (block.health <= 0) {
          block.die()
        }
      }
    }
  }

  die() {
    this.dead = true
    this.ignoreBoundaries.floor = true
    this.velocity.y = -1 * this.hops
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

    if (!this.ducking) {
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
      } else if ([this.keys.left, this.keys.right].includes(key)) {
        this.velocity.x = 0
      }
    }
  }
}
