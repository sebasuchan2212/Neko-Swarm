import { Entity } from '../core/Entity.js';

export class XPGem extends Entity{
  constructor(x,y,value=10){ super(x,y,6); this.type='xpgem'; this.value=value; }
  update(dt, world){
    // attract to player if close
    const pl=world.player;
    const dx=pl.pos.x-this.pos.x, dy=pl.pos.y-this.pos.y;
    const dist=Math.hypot(dx,dy);
    if(dist<140){
      const f= (140-dist)/140 * 180;
      this.pos.x += (dx/dist)*f*dt;
      this.pos.y += (dy/dist)*f*dt;
    }
    if(this.collides(pl)){ world.player.gainXP(this.value); this.dead=true; }
  }
  draw(ctx){
    ctx.save(); ctx.translate(this.pos.x,this.pos.y);
    ctx.fillStyle='#38bdf8';
    ctx.beginPath(); ctx.moveTo(0,-6); ctx.lineTo(6,0); ctx.lineTo(0,6); ctx.lineTo(-6,0); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
}
