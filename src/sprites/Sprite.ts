import { drawRect } from '../draw.js'
import { Number2D } from '../math.js'
import { SpriteSheet } from './SpriteSheet.js'

export type SpriteConfig = {
  bounceFactor?: number
  color?: string
  floorPadding?: number
  position: Number2D
  size: Number2D
  spriteSheet: SpriteSheet
  velocity?: Number2D
}

const GRAVITY = 0.4
const FRICTION = 0
export class Sprite {
  public bounceFactor: number
  public color: string
  public floorPadding?: number
  public position: Number2D
  public size: Number2D
  public spriteSheet: SpriteSheet
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
    floorPadding,
    position,
    size,
    spriteSheet,
    velocity = { x: 0, y: 0 }
  }: SpriteConfig) {
    this.bounceFactor = bounceFactor
    this.color = color
    this.floorPadding = floorPadding
    this.position = position
    this.size = size
    this.spriteSheet = spriteSheet
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

    const floor = ctx.canvas.height - (this.floorPadding ?? 0) - this.size.y
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
