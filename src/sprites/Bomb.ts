import { drawCircle } from '../draw.js'
import { Thing, ThingConfig } from './Thing.js'

type BombConfig = ThingConfig & { power: number; things: Thing[] }

export class Bomb extends Thing {
  public exploded: boolean
  public sprites: any
  public power: any
  /**
   * @param {BombConfig} opts
   */
  constructor({ power, things: sprites, ...spriteConfig }: BombConfig) {
    super({ ...spriteConfig })

    this.exploded = false
    this.sprites = sprites
    this.power = power
  }

  draw(ctx: any): void {
    drawCircle(ctx, this)
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  update(ctx) {
    super.update(ctx)

    if (
      !this.exploded &&
      this.velocity.y !== 0 &&
      (this.position.y >= ctx.canvas.height - this.size.height ||
        this.position.x >= ctx.canvas.width - this.size.width ||
        this.position.x <= 0)
    ) {
      for (const sprite of this.sprites) {
        const distance = {
          x: sprite.position.x - this.position.x,
          y: sprite.position.y - this.position.y
        }
        sprite.velocity.x += this.power / distance.x
        sprite.velocity.y += this.power / distance.y
      }
      this.exploded = true
    }
  }
}
