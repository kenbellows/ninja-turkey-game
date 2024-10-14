export type Number2D = { x: number; y: number }
export type Rect = { x1: number; y1: number; x2: number; y2: number }

export function makeRect(
  x1: number,
  y1: number,
  width: number,
  height: number
): Rect {
  return {
    x1,
    y1,
    x2: x1 + width,
    y2: y1 + height
  }
}

export function rectsIntersect(r1: Rect, r2: Rect): boolean {
  return [
    { x: r1.x1, y: r1.y1 },
    { x: r1.x1, y: r1.y2 },
    { x: r1.x2, y: r1.y1 },
    { x: r1.x2, y: r1.y2 }
  ].some((p) => pointIsInRect(p, r2))
}

export function pointIsInRect(point: Number2D, rect: Rect): boolean {
  return (
    point.x > rect.x1 &&
    point.x < rect.x2 &&
    point.y > rect.y1 &&
    point.y < rect.y2
  )
}

export function cover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement
): Number2D {
  const widthRatio = ctx.canvas.width / img.width
  if (img.height * widthRatio >= ctx.canvas.height) {
    return {
      x: ctx.canvas.width,
      y: img.height * widthRatio
    }
  } else {
    const heightRatio = ctx.canvas.height / img.height
    return {
      x: img.height * heightRatio,
      y: ctx.canvas.height
    }
  }
}
