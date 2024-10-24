import { Number2D, Size } from '../math.js'

type SpriteStateDetails = {
  size: Size
  oneShot?: boolean
  frames: (Number2D & Partial<Size>)[]
}

export enum SpriteState {
  ATTACK = 'attack',
  DUCK = 'duck',
  HIT = 'hit',
  IDLE = 'idle',
  JUMP = 'jump',
  WALK = 'walk'
}

type SpriteSheetConfig = {
  characterHeight: number
  fps?: number
  initialState?: SpriteState
  sheetSrc: string
  states: Partial<Record<SpriteState, SpriteStateDetails>>
}

export class SpriteSheet {
  public characterHeight: number
  public loaded: boolean
  public sheet: HTMLImageElement
  public states: { [state: string]: SpriteStateDetails }

  fps: number
  currentState: SpriteState
  currentFrame: number
  lastFrameTick: number

  constructor({
    characterHeight,
    fps = 10,
    sheetSrc,
    states,
    initialState = SpriteState.IDLE
  }: SpriteSheetConfig) {
    this.characterHeight = characterHeight
    this.fps = fps
    this.states = states

    this.sheet = new Image()
    this.loaded = false
    this.sheet.addEventListener('load', () => (this.loaded = true))
    this.sheet.src = sheetSrc

    this.setState(initialState)
  }

  setState(state: SpriteState) {
    this.currentState = state
    this.currentFrame = 0
    this.lastFrameTick = new Date().getTime()
  }

  public getFrame() {
    const state = this.states[this.currentState]
    const nextTick = this.lastFrameTick + Math.round(1000 / this.fps)
    if (new Date().getTime() >= nextTick) {
      this.currentFrame = (this.currentFrame + 1) % state.frames.length
      this.lastFrameTick = nextTick
    }
    return { ...state.size, ...state.frames[this.currentFrame] }
  }
}
