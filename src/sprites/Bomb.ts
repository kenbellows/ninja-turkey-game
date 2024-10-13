import { drawCircle } from '../draw.js'
import { Sprite, SpriteConfig } from './Sprite.js'

type BombConfig = SpriteConfig & { power: number; sprites: Sprite[] }

export class Bomb extends Sprite {
  public exploded: boolean
  public sprites: any
  public power: any
  /**
   * @param {BombConfig} opts
   */
  constructor({ power, sprites, ...spriteConfig }: BombConfig) {
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
      (this.position.y >= ctx.canvas.height - this.size.y ||
        this.position.x >= ctx.canvas.width - this.size.x ||
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
