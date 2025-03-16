import { Number2D, Size } from '../math.js'

export type Frame = Number2D & Partial<Size>

export type GetFrameResult = Required<Frame> | { oneShotComplete: true }
export function isOneShotComplete(
  r: GetFrameResult
): r is { oneShotComplete: true } {
  return 'oneShotComplete' in r && r.oneShotComplete
}

type SpriteStateDetails = {
  size: Size
  oneShot?: number
  oneShotCounter?: number
  frames: Frame[]
}

export enum SpriteState {
  ATTACK = 'attack',
  DUCK = 'duck',
  HIT = 'hit',
  IDLE = 'idle',
  JUMP = 'jump',
  WALK = 'walk'
}

export type SpriteSheetConfig = {
  characterSize: Size
  fps?: number
  initialState?: SpriteState
  sheetSrc: string
  states: Partial<Record<SpriteState, SpriteStateDetails>>
}

export class SpriteSheet {
  public characterSize: Size
  public loaded: boolean
  public sheet: HTMLImageElement
  public states: { [state: string]: SpriteStateDetails }

  fps: number
  currentState: SpriteState
  currentFrame: number
  lastFrameTick: number

  constructor({
    characterSize,
    fps = 10,
    sheetSrc,
    states,
    initialState = SpriteState.IDLE
  }: SpriteSheetConfig) {
    this.characterSize = characterSize
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
    if (this.states[state].oneShot) {
      this.states[state].oneShotCounter = this.states[state].oneShot
    }
    this.lastFrameTick = new Date().getTime()
  }

  public getFrame(): (Size & Frame) | { oneShotComplete: true } {
    const state = this.states[this.currentState]
    const now = new Date().getTime()
    const step = Math.round(1000 / this.fps)
    const nextTick = this.lastFrameTick + step
    if (now >= nextTick) {
      this.currentFrame = (this.currentFrame + 1) % state.frames.length
      this.lastFrameTick = now > nextTick + step ? now : nextTick
      if (state.oneShot && this.currentFrame === 0) {
        state.oneShotCounter -= 1
        if (state.oneShotCounter === 0) {
          return { oneShotComplete: true }
        }
      }
    }
    return {
      ...state.size,
      ...state.frames[this.currentFrame]
    }
  }
}
