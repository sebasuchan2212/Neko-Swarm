import { Entity } from '../core/Entity.js';
export class Minion extends Entity{
  constructor(owner, angle=0){ super(owner.pos.x, owner.pos.y, 8); this.type='minion'; this.owner=owner; this.angle=angle; this.range=36; this.timer=0; }
  update(dt, world){
    this.angle += dt*1.5;
    const ox=Math.cos(this.angle)*this.range, oy=Math.sin(this.angle)*this.range;
    this.pos.x = this.owner.pos.x + ox; this.pos.y = this.owner.pos.y + oy;
    this.timer+=dt;
    if(this.timer>0.8){ this.timer=0; const t=world.findNearestEnemy(this.pos) || world.boss; if(t){ const dx=t.pos.x-this.pos.x, dy=t.pos.y-this.pos.y; const d=Math.hypot(dx,dy)||1; world.fireBullet({pos:this.pos}, {x:dx/d,y:dy/d}, 6, 0, true); } }
  }
  draw(ctx){ ctx.save(); ctx.translate(this.pos.x,this.pos.y); ctx.fillStyle='#e5e7eb'; ctx.beginPath(); ctx.arc(0,0,this.r,0,Math.PI*2); ctx.fill(); ctx.restore(); }
}
