import { Sprite } from './sprites/Sprite.js'
import { SpriteSheet, SpriteState } from './sprites/SpriteSheet.js'
import { LINK } from './spriteSheetConfigs.js'

const canvas = document.querySelector('canvas')
if (!canvas) {
  throw new Error('Could not find Canvas element')
}
canvas.width = 1024
canvas.height = 576

const ctx = canvas.getContext('2d')
if (!ctx) {
  throw new Error('Could not get CanvasRenderingContext2D')
}

const PLAYER_SIZE = {
  height: 175,
  width: 100
}

const floorPadding = 20

const myLink = structuredClone(LINK)
myLink.states.attack.oneShot = false
myLink.fps = 1
myLink.initialState = SpriteState.ATTACK

const link = new Sprite({
  position: {
    x: canvas.width * 0.5 - 50,
    y: 0
  },
  size: {
    ...PLAYER_SIZE
  },
  spriteSheet: new SpriteSheet(myLink),
  velocity: {
    x: 0,
    y: 0
  },
  ctx,
  facing: 'right',
  floorPadding
})

function animate() {
  window.requestAnimationFrame(animate)
  clear()
  link.update(ctx)
}
animate()

function clear() {
  ctx.save()
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.restore()
}
