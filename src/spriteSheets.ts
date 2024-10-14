import { SpriteSheet } from './sprites/SpriteSheet.js'

export const LINK = new SpriteSheet({
  characterHeight: 48,
  sheetSrc: './assets/Custom Edited - Super Smash Bros Customs - Link.png',
  states: {
    attack: {
      size: { height: 47, width: 40 },
      frames: [
        { height: 59, width: 40, x: 467, y: 32 },
        { height: 67, width: 33, x: 511, y: 24 },
        { height: 73, width: 59, x: 347, y: 102 }
      ]
    },
    idle: {
      frames: [{ x: 376, y: 42 }],
      size: { height: 48, width: 37 }
    },
    jump: {
      frames: [{ x: 477, y: 957 }],
      size: { height: 61, width: 32 }
    },
    walk: {
      frames: [
        { x: 10, y: 1480 },
        { x: 68, y: 1480 },
        { x: 124, y: 1480 },
        { x: 184, y: 1480 },
        { x: 230, y: 1480 },
        { x: 284, y: 1480 }
      ],
      size: { height: 54, width: 44 }
    }
  }
})
