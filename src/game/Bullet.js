import { Entity } from '../core/Entity.js';

export class Bullet extends Entity{
  constructor(){ super(0,0,5); this.type='bullet'; this.speed=360; this.damage=10; this.life=0; this.maxLife=1.8; this.pierce=0; }
  fire(x,y,dx,dy,speed,damage,pierce){ this.pos.set(x,y); this.vel.set(dx*speed,dy*speed); this.damage=damage; this.pierce=pierce; this.dead=false; this.life=0; }
  update(dt, world){
    this.life+=dt; if(this.life>this.maxLife){ this.dead=true; return; }
    this.pos.add(this.vel.clone().mul(dt));
    // collide with enemies
    for(const e of world.enemies){
      if(!e.dead && this.collides(e)){
        e.hp-=this.damage;
        if(e.hp<=0){ e.dead=true; world.onEnemyKilled(e); }
        if(this.pierce>0){ this.pierce--; } else { this.dead=true; break; }
      }
    }
  }
  draw(ctx){
    ctx.save(); ctx.translate(this.pos.x,this.pos.y);
    ctx.fillStyle='#f97316';
    ctx.beginPath(); ctx.arc(0,0,this.r,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
}
