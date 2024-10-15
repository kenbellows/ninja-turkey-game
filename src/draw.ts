import { Number2D, Size } from './math.js'

type Drawable = { color: string; position: Number2D; size: Size }

export function drawRect(
  ctx: CanvasRenderingContext2D,
  { color, position, size }: Drawable
) {
  ctx.save()
  ctx.fillStyle = color
  ctx.fillRect(position.x, position.y, size.width, size.height)
  ctx.restore()
}

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  { color, position, size }: Drawable
) {
  ctx.save()
  ctx.fillStyle = color
  const radius = Math.min(size.width, size.height)
  fillCircle(
    ctx,
    position.x + size.width / 2,
    position.y + size.height / 2,
    radius
  )
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
