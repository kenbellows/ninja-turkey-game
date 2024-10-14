import { cover } from './math.js'

type SceneConfig = { backgroundImg?: string }

export class Scene {
  public background?: HTMLImageElement
  public loaded = false
  constructor({ backgroundImg }: SceneConfig = {}) {
    if (backgroundImg) {
      this.setBackground(backgroundImg)
    } else {
      this.loaded = true
    }
  }
  setBackground(backgroundImg: string) {
    this.loaded = false
    this.background = new Image()
    this.background.addEventListener('load', () => (this.loaded = true))
    this.background.src = backgroundImg
  }
  draw(ctx: CanvasRenderingContext2D) {
    if (this.loaded && this.background) {
      const { x: width, y: height } = cover(ctx, this.background)
      let top = 0
      if (height > ctx.canvas.height) {
        top = -(height - ctx.canvas.height)
      }
      ctx.drawImage(this.background, 0, top, width, height)
    } else {
      ctx.save()
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      if (!this.loaded) {
        ctx.fillStyle = 'white'
        ctx.font = 'bold 48px "Jersey 10 Charted"'
        ctx.fillText(
          'Loading...',
          ctx.canvas.width / 2 - 100,
          ctx.canvas.height / 2 - 50,
          200
        )
      }
      ctx.restore()
    }
  }
}
