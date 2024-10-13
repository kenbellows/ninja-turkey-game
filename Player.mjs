import { rectsIntersect } from './src/math.mjs'
import { Sprite } from './Sprite.mjs'

/** @typedef {{x: number, y: number}} Number2D */

/**
 * @typedef {{
 *   bounceFactor?: number,
 *   color: string,
 *   facing: 'left' | 'right',
 *   hops?: number,
 *   keys: {left: string, right: string, jump: string, duck: string},
 *   position: Number2D,
 *   size: Number2D,
 *   speed?: number,
 *   velocity?: Number2D
 * }} PlayerConfig
 */
const GRAVITY = 0.4
const FRICTION = 0
export class Player extends Sprite {
  /**
   * @param {PlayerConfig} opts
   */
  constructor({ facing, hops = 10, keys, speed = 8, ...spriteConfig }) {
    super(spriteConfig)

    this.facing = facing
    this.hops = hops
    this.keys = keys
    this.speed = speed

    this.health = 100

    this.attackingCountdown = 0
    this.hitCountdown = 0
  }

  /**
   * @param {1 | -1} [sign=1]   set to -1 to move left
   */
  walk(sign = 1) {
    this.velocity.x = this.speed * sign
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  jump(ctx) {
    const floor = ctx.canvas.height - this.size.y
    if (this.position.y >= floor - 10) {
      this.velocity.y = -1 * this.hops
    }
  }

  /**
   * @param {Player[]} players
   */
  attack(players) {
    this.attackingCountdown = 10
    const attackRect = {
      x1: this.position.x + (this.facing === 'right' ? this.size.x : 0),
      y1: this.position.y + this.size.y * 0.2
    }
    attackRect.x2 = attackRect.x1 + this.size.x * 0.5
    attackRect.x2 = attackRect.y1 + this.size.y * 0.2

    for (const player of players) {
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
      }
    }
  }

  /**
   * @param {string} key
   * @param {CanvasRenderingContext2D} ctx
   */
  handleKeydown(key, ctx) {
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
    }
  }

  /**
   * @param {string} key
   * @param {CanvasRenderingContext2D} ctx
   */
  handleKeyup(key) {
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
