import { Entity } from '../core/Entity.js';
export class Meteor extends Entity{
  constructor(x){ super(x,-20,10); this.type='meteor'; this.vel.set(0,260); this.aoe=60; this.life=5; }
  update(dt,world){ this.pos.add(this.vel.clone().mul(dt)); if(this.pos.y>world.h-10){ this.dead=true; world.explode(this.pos.x, this.pos.y-6, this.aoe, 50); } }
  draw(ctx){ ctx.save(); ctx.translate(this.pos.x,this.pos.y); ctx.fillStyle='#fca5a5'; ctx.beginPath(); ctx.arc(0,0,this.r,0,Math.PI*2); ctx.fill(); ctx.restore(); }
}