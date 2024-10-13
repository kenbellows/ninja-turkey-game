import { Player } from './sprites/Player.js'

type HUDConfig = {
  players: Player[]
}

export class HUD {
  public static padding = 10

  public players: Player[]
  constructor({ players }: HUDConfig) {
    this.players = players
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.drawHealthBar(ctx, this.players[0], 'left')
    this.drawHealthBar(ctx, this.players[1], 'right')
  }

  private drawHealthBar(
    ctx: CanvasRenderingContext2D,
    player: Player,
    side: 'left' | 'right'
  ) {
    ctx.save()
    ctx.strokeStyle = player.color
    ctx.fillStyle = player.color
    const xPos =
      side === 'left' ? HUD.padding : ctx.canvas.width * 0.6 - HUD.padding
    const barWidth = ctx.canvas.width * 0.4
    ctx.strokeRect(xPos, HUD.padding, barWidth, HUD.padding * 3)
    ctx.fillRect(
      xPos,
      HUD.padding,
      barWidth * (player.health / 100),
      HUD.padding * 3
    )
    ctx.restore()
  }
}
