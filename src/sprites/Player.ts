import { drawCircle, drawRect } from '../draw.js'
import { makeRect, Rect, rectsIntersect } from '../math.js'
import { Sprite, SpriteConfig } from './Sprite.js'

type PlayerConfig = SpriteConfig & {
  facing: 'left' | 'right'
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
  public facing: 'right' | 'left'
  public hops: number
  public keys: Keys
  public speed: number
  public health: number
  public name: string
  public attackingCountdown: number
  public hitCountdown: number

  public players: Player[]
  public dead = false

  constructor({
    facing,
    hops = 10,
    keys,
    name,
    speed = 8,
    players,
    ...spriteConfig
  }: PlayerConfig) {
    super(spriteConfig)

    this.facing = facing
    this.hops = hops
    this.keys = keys
    this.name = name
    this.speed = speed
    this.players = players

    this.health = 100

    this.attackingCountdown = 0
    this.hitCountdown = 0
  }

  draw(ctx: CanvasRenderingContext2D) {
    drawRect(ctx, this)

    drawCircle(ctx, {
      color: 'white',
      position: {
        x:
          this.position.x +
          (this.facing === 'right' ? 0.75 : 0.25) * this.size.x,
        y: this.position.y + this.size.y * 0.2
      },
      size: {
        x: this.size.x * 0.1,
        y: this.size.x * 0.1
      }
    })
    drawCircle(ctx, {
      color: 'black',
      position: {
        x:
          this.position.x +
          (this.facing === 'right' ? 0.75 : 0.25) * this.size.x +
          (this.facing === 'right' ? this.size.x * 0.05 : 0),
        y: this.position.y + this.size.y * 0.2 + this.size.x * 0.025
      },
      size: {
        x: this.size.x * 0.05,
        y: this.size.x * 0.05
      }
    })

    if (this.attackingCountdown > 0) {
      const attackRect = this.getAttackRect()
      drawRect(ctx, {
        color: this.color,
        position: {
          x: attackRect.x1,
          y: attackRect.y1
        },
        size: {
          x: attackRect.x2 - attackRect.x1,
          y: attackRect.y2 - attackRect.y1
        }
      })
    }
  }

  update(ctx: CanvasRenderingContext2D) {
    super.update(ctx)
    if (this.attackingCountdown > 0) {
      this.attackingCountdown -= 1
    }
    if (this.hitCountdown > 0) {
      this.hitCountdown -= 1
    }
  }

  walk(sign: 1 | -1 = 1) {
    this.velocity.x = this.speed * sign
  }

  jump(ctx: CanvasRenderingContext2D) {
    const floor = ctx.canvas.height - this.size.y
    if (this.position.y >= floor - 10) {
      this.velocity.y = -1 * this.hops
    }
  }

  getAttackRect(): Rect {
    return makeRect(
      this.position.x +
        (this.facing === 'right' ? this.size.x : -this.size.x * 0.5),
      this.position.y + this.size.y * 0.2,
      this.size.x * 0.5,
      this.size.y * 0.2
    )
  }

  attack() {
    this.attackingCountdown = 10

    const attackRect: Rect = this.getAttackRect()

    for (const player of this.players) {
      if (player === this) {
        continue
      }
      const playerRect = {
        x1: player.position.x,
        y1: player.position.y,
        x2: player.position.x + player.size.x,
        y2: player.position.y + player.size.y
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
  }

  /**
   * @param {string} key
   * @param {CanvasRenderingContext2D} ctx
   */
  handleKeydown(key: string, ctx: CanvasRenderingContext2D) {
    if (this.dead) {
      return
    }
    if (key === this.keys.right) {
      this.facing = 'right'
      this.walk()
    } else if (key === this.keys.left) {
      this.facing = 'left'
      this.walk(-1)
    } else if (key === this.keys.jump) {
      this.jump(ctx)
    } else if (key === this.keys.duck) {
      this.size.y /= 2
      this.position.y += this.size.y
    } else if (key === this.keys.attack) {
      this.attack()
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
    if (key === this.keys.right && this.velocity.x > 0) {
      this.velocity.x = 0
    } else if (key === this.keys.left && this.velocity.x < 0) {
      this.velocity.x = 0
    } else if (key === this.keys.duck) {
      this.position.y -= this.size.y
      this.size.y *= 2
    }
  }
}
