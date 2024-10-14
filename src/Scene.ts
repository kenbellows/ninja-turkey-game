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
  draw() {
    if (this.background) {
    }
  }
}
