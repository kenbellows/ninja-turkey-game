import { HUD } from './HUD.js'
import { Scene } from './Scene.js'
import { Block } from './sprites/Block.js'
import { Bomb } from './sprites/Bomb.js'
import { Thing } from './sprites/Thing.js'

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

const players = []

const player1 = new Block({
  bounceFactor: 0,
  color: 'blue',
  ctx,
  facing: 'right',
  floorPadding,
  keys: {
    attack: ' ',
    jump: 'w',
    duck: 's',
    left: 'a',
    right: 'd'
  },
  name: 'player1',
  players,
  position: {
    x: canvas.width * 0.25 + 10,
    y: 0
  },
  size: {
    ...PLAYER_SIZE
  },
  velocity: {
    x: 0,
    y: 0
  }
})

const player2 = new Block({
  bounceFactor: 0,
  color: 'red',
  ctx,
  facing: 'left',
  floorPadding,
  keys: {
    attack: '/',
    jump: 'arrowup',
    duck: 'arrowdown',
    left: 'arrowleft',
    right: 'arrowright'
  },
  name: 'player2',
  players,
  position: {
    x: (canvas.width - PLAYER_SIZE.width) * 0.75 - 10,
    y: 0
  },
  size: {
    ...PLAYER_SIZE
  },
  velocity: {
    x: 0,
    y: 0
  }
})

players.push(player1, player2)

const things: Thing[] = [player1, player2]
const hud = new HUD({ players })
const scene = new Scene({})
function animate() {
  window.requestAnimationFrame(animate)
  scene.draw(ctx)
  if (!scene.loaded) {
    return
  }
  for (const sprite of things) {
    sprite.update(ctx)
  }
  hud.draw(ctx)
}
animate()

window.addEventListener('keydown', (e) => {
  if (e.repeat) {
    return
  }
  const key = e.key.toLowerCase()
  player1.handleKeydown(key)
  player2.handleKeydown(key)
  handlePlatformKeydown(key, ctx)
})
window.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase()
  player1.handleKeyup(key)
  player2.handleKeyup(key)
})

function handlePlatformKeydown(key: string, ctx: CanvasRenderingContext2D) {
  if (key === 'b') {
    things.push(
      new Bomb({
        ctx,
        power: 1000,
        things: [...things],
        color: 'silver',
        size: {
          height: 25,
          width: 25
        },
        position: {
          x: (Math.random() * canvas.width * 3) / 4 + canvas.width / 8,
          y: -25
        }
      })
    )
  }
}
