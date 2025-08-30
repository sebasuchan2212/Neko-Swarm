import { Entity } from '../core/Entity.js';

export class Enemy extends Entity{
  constructor(x,y,kind='zAlien'){
    super(x,y,14);
    this.type='enemy';
    this.kind=kind;
    this.hp=30;
    this.speed=60;
    this.damage=10;
  }
  update(dt, world){
    const pl=world.player;
    const dx=pl.pos.x-this.pos.x, dy=pl.pos.y-this.pos.y;
    const len=Math.hypot(dx,dy)||1;
    this.pos.x+=dx/len*this.speed*dt;
    this.pos.y+=dy/len*this.speed*dt;

    if(this.collides(pl)){
      pl.takeDamage(this.damage, world);
      this.dead=true;
    }
  }
  draw(ctx){
    ctx.save(); ctx.translate(this.pos.x,this.pos.y);
    if(this.kind==='zombie'){
      ctx.fillStyle='#84cc16';
      ctx.beginPath(); ctx.arc(0,0,this.r,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#1a2e05'; ctx.fillRect(-6,-4,4,4); ctx.fillRect(2,-4,4,4);
    }else{ // zAlien
      ctx.fillStyle='#22d3ee';
      ctx.beginPath(); ctx.ellipse(0,0,this.r, this.r*0.7, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle='#0e7490'; ctx.fillRect(-4,-3,8,6);
    }
    ctx.restore();
  }
}
