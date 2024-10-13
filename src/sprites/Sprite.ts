import { drawRect } from '../draw.js'
import { Number2D } from '../math.js'

export type SpriteConfig = {
  bounceFactor?: number
  color?: string
  position: Number2D
  size: Number2D
  velocity?: Number2D
}

const GRAVITY = 0.4
const FRICTION = 0
export class Sprite {
  public bounceFactor: number
  public color: string
  public position: Number2D
  public size: Number2D
  public velocity: Number2D

  ignoreBoundaries = {
    ceiling: true,
    floor: false,
    left: false,
    right: false
  }

  constructor({
    bounceFactor = 0.5,
    color = 'black',
    position,
    size,
    velocity = { x: 0, y: 0 }
  }: SpriteConfig) {
    this.bounceFactor = bounceFactor
    this.color = color
    this.position = position
    this.size = size
    this.velocity = velocity
  }

  draw(ctx) {
    drawRect(ctx, this)
  }

  update(ctx: CanvasRenderingContext2D) {
    this.draw(ctx)
    this.velocity.y += GRAVITY
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (!this.ignoreBoundaries.right) {
      const rightWall = ctx.canvas.width - this.size.x
      this.handleBoundary('x', rightWall)
    }

    if (!this.ignoreBoundaries.left) {
      const leftWall = 0
      this.handleBoundary('x', leftWall, -1)
    }

    const floor = ctx.canvas.height - this.size.y
    if (!this.ignoreBoundaries.floor) {
      this.handleBoundary('y', floor, 1, true)
    }

    if (!this.ignoreBoundaries.ceiling) {
      const ceiling = 0
      this.handleBoundary('y', ceiling, -1)
    }

    if (this.position.y === floor && !this.ignoreBoundaries.floor) {
      if (this.velocity.x > 0) {
        this.velocity.x -= FRICTION
        if (this.velocity.x < 0) {
          this.velocity.x = 0
        }
      } else if (this.velocity.x < 0) {
        this.velocity.x += FRICTION
        if (this.velocity.x > 0) {
          this.velocity.x = 0
        }
      }
    }
  }

  handleBoundary(
    d: 'x' | 'y',
    boundary: number,
    sign: 1 | -1 = 1,
    bounce: boolean = false
  ) {
    if (this.position[d] * sign > boundary) {
      this.position[d] = boundary
      if (bounce && this.bounceFactor > 0) {
        this.velocity[d] =
          -Math.abs(this.velocity[d]) * this.bounceFactor * sign
      } else {
        this.velocity[d] = 0
      }
    }
  }
}
