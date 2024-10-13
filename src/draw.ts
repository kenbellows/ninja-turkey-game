import { Number2D } from './math.js'

type Drawable = { color: string; position: Number2D; size: Number2D }

/**
 * @this {import("./Sprite").Sprite}
 * @param {CanvasRenderingContext2D} ctx
 */
export function drawRect(ctx, { color, position, size }: Drawable) {
  ctx.save()
  ctx.fillStyle = color
  ctx.fillRect(position.x, position.y, size.x, size.y)
  ctx.restore()
}

/**
 * @this {import("./Sprite").Sprite}
 * @param {CanvasRenderingContext2D} ctx
 */
export function drawCircle(ctx, { color, position, size }: Drawable) {
  ctx.save()
  ctx.fillStyle = color
  const radius = Math.min(size.x, size.y)
  fillCircle(ctx, position.x + size.x / 2, position.y + size.y / 2, radius)
  ctx.restore()
}
/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} cy
 * @param {number} radius
 */
export function strokeCircle(ctx, cx, cy, radius) {
  ctx.beginPath()
  ctx.ellipse(cx, cy, radius, radius, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.closePath()
}
/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} cy
 * @param {number} radius
 */
export function fillCircle(ctx, cx, cy, radius) {
  ctx.beginPath()
  ctx.ellipse(cx, cy, radius, radius, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.closePath()
}
