import { Number2D } from '../math.js'

type SpriteSheetConfig = {
  sheetSrc: string
  size: Number2D
  states: { [state: string]: { frames: Number2D[] } }
}

export class SpriteSheet {
  public loaded: boolean
  public sheet: HTMLImageElement
  public size: Number2D
  public states: { [state: string]: { frames: Number2D[] } }
  constructor({ sheetSrc, size, states }: SpriteSheetConfig) {
    this.loaded = false
    this.sheet = new Image()
    this.sheet.addEventListener('load', () => (this.loaded = true))
    this.sheet.src = sheetSrc
    this.size = size
    this.states = states
  }
}
