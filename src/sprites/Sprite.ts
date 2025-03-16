import { Size } from '../math.js'
import {
  Frame,
  isOneShotComplete,
  SpriteSheet,
  SpriteState
} from './SpriteSheet.js'
import { Thing, ThingConfig } from './Thing.js'

export type SpriteConfig = ThingConfig & {
  spriteSheet: SpriteSheet
}

const GRAVITY = 0.4
const FRICTION = 0
export class Sprite extends Thing {
  public spriteSheet: SpriteSheet

  get spriteState() {
    return this.spriteSheet.currentState
  }
  set spriteState(state: SpriteState) {
    this.spriteSheet.setState(state)
  }

  ignoreBoundaries = {
    ceiling: true,
    floor: false,
    left: false,
    right: false
  }

  constructor({ spriteSheet, ...spriteConfig }: SpriteConfig) {
    super(spriteConfig)
    this.spriteSheet = spriteSheet
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.drawSprite(ctx)
  }

  drawSprite(ctx: CanvasRenderingContext2D) {
    const frame: (Size & Frame) | { oneShotComplete: true } =
      this.spriteSheet.getFrame()
    if (isOneShotComplete(frame)) {
      this.revertState()
      return this.drawSprite(ctx)
    }

    const { height } = this.size
    const { characterSize } = this.spriteSheet

    const canvasRatio = height / characterSize.height

    const yDiff = (frame.height - characterSize.height) * canvasRatio
    const yPos = this.position.y - yDiff
    const width = frame.width * canvasRatio
    ctx.save()
    if (this.facing === 'left') {
      ctx.translate(this.position.x + characterSize.width, yPos)
      ctx.scale(-1, 1)
    } else {
      ctx.translate(this.position.x, yPos)
    }
    ctx.drawImage(
      this.spriteSheet.sheet,
      frame.x,
      frame.y,
      frame.width,
      frame.height,
      0,
      0,
      width,
      height + yDiff
    )
    ctx.restore()
  }

  update(ctx: CanvasRenderingContext2D) {
    super.update(ctx)

    const floor = ctx.canvas.height - this.getFloor()
    if (
      this.spriteState === SpriteState.JUMP &&
      !this.ignoreBoundaries.floor &&
      this.position.y === floor
    ) {
      this.landOnFloor()
    }
  }

  revertState() {
    this.spriteState = SpriteState.IDLE
  }

  landOnFloor() {
    // no op -- override in subclasses
  }
}
