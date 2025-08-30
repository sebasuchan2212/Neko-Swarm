import { Vec2 } from '../util/Vec2.js';
export class Entity{
  constructor(x=0,y=0,r=10){ this.pos=new Vec2(x,y); this.vel=new Vec2(0,0); this.r=r; this.dead=false; this.type='entity'; }
  update(dt, world) {}
  draw(ctx) { ctx.save(); ctx.translate(this.pos.x,this.pos.y); ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(0,0,this.r,0,Math.PI*2); ctx.fill(); ctx.restore(); }
  collides(other){ const dx=this.pos.x-other.pos.x, dy=this.pos.y-other.pos.y; return dx*dx+dy*dy <= (this.r+other.r)*(this.r+other.r); }
}