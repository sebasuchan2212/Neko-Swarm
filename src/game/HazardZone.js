import { Entity } from '../core/Entity.js';
export class HazardZone extends Entity{
  constructor(x,y,r){ super(x,y,r); this.type='hazard'; this.t=0; this.phase='warn'; }
  update(dt, world){
    this.t+=dt;
    if(this.phase==='warn' && this.t>1.2){ this.phase='active'; this.t=0; }
    else if(this.phase==='active' && this.t>2){ this.phase='fade'; this.t=0; }
    else if(this.phase==='fade' && this.t>0.6){ this.dead=true; }
    if(this.phase==='active'){
      if(this.collides(world.player)) world.player.takeDamage(15*dt, world);
      for(const e of world.enemies){ if(!e.dead && this.collides(e)){ e.hp-=30*dt; if(e.hp<=0){ e.dead=true; e.onDeath?.(world); world.onEnemyKilled(e); } } }
      if(world.boss && !world.boss.dead && this.collides(world.boss)){ world.boss.hp-=40*dt; if(world.boss.hp<=0){ world.boss.dead=true; world.onBossDefeated(); } }
    }
  }
  draw(ctx){
    ctx.save(); ctx.translate(this.pos.x,this.pos.y);
    let a=this.phase==='warn'?0.25: this.phase==='active'?0.5:0.2;
    ctx.fillStyle='rgba(139,92,246,'+a+')'; ctx.beginPath(); ctx.arc(0,0,this.r,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
}