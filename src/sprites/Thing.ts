import { Number2D, Size } from '../math.js'

export type ThingConfig = {
  ctx: CanvasRenderingContext2D
  bounceFactor?: number
  color?: string
  facing?: 'left' | 'right'
  floorPadding?: number
  position: Number2D
  size: Size
  velocity?: Number2D
}

const GRAVITY = 0.4
const FRICTION = 0
export class Thing {
  public bounceFactor: number
  public color: string
  public ctx: CanvasRenderingContext2D
  public facing: 'right' | 'left'
  public floorPadding?: number
  public position: Number2D
  public size: Size
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
    ctx,
    facing = 'right',
    floorPadding,
    position,
    size,
    velocity = { x: 0, y: 0 }
  }: ThingConfig) {
    this.bounceFactor = bounceFactor
    this.color = color
    this.ctx = ctx
    this.facing = facing
    this.floorPadding = floorPadding
    this.position = position
    this.size = size
    this.velocity = velocity
  }

  getFloor() {
    return (this.floorPadding ?? 0) + this.size.height
  }

  draw(ctx: CanvasRenderingContext2D) {
    throw new Error('Unimplemented: Subclass must implement the draw() method')
  }

  update(ctx: CanvasRenderingContext2D) {
    this.draw(ctx)
    this.velocity.y += GRAVITY
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (!this.ignoreBoundaries.right) {
      const rightWall = ctx.canvas.width - this.size.width
      this.handleBoundary('x', rightWall)
    }

    if (!this.ignoreBoundaries.left) {
      const leftWall = 0
      this.handleBoundary('x', leftWall, -1)
    }

    const floor = ctx.canvas.height - this.getFloor()

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
