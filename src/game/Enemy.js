import { Entity } from '../core/Entity.js';

export class Enemy extends Entity{
  constructor(x,y,kind='zombie', gen=0){
    super(x,y,14);
    this.type='enemy'; this.kind=kind; this.gen=gen;
    this.hp = kind==='zombie'?28 : kind==='zAlien'?30 : kind==='balloon'?22 : kind==='slime'?20 : kind==='camera'?26 : 30;
    this.speed = kind==='zAlien'?75 : kind==='balloon'?20 : 55;
    this.damage = 10;
    this.timer=0;
  }
  update(dt, world){
    this.timer+=dt;
    const pl=world.player;
    if(this.kind==='balloon'){
      const angle=Math.sin(this.timer*2)*20;
      this.pos.x += Math.cos(angle)*12*dt + (pl.pos.x>this.pos.x?8:-8)*dt;
      this.pos.y += 26*dt;
    }else{
      const dx=pl.pos.x-this.pos.x, dy=pl.pos.y-this.pos.y;
      const len=Math.hypot(dx,dy)||1; this.pos.x+=dx/len*this.speed*dt; this.pos.y+=dy/len*this.speed*dt;
    }
    if(this.kind==='camera' && this.timer>3){ this.timer=0; world.triggerFlash(0.9, 0.8); }
    if(this.collides(pl)){ pl.takeDamage(this.damage, world); this.dead=true; }
  }
  onDeath(world){
    if(this.kind==='slime' && this.gen<2){
      for(let i=0;i<2;i++){ const s=new Enemy(this.pos.x+(i?8:-8), this.pos.y, 'slime', this.gen+1); s.r=this.r*0.75; s.hp=Math.max(8, this.hp*0.5); s.speed=60; world.enemies.push(s); }
    }
  }
  draw(ctx){
    ctx.save(); ctx.translate(this.pos.x,this.pos.y);
    if(this.kind==='zombie'){ ctx.fillStyle='#84cc16'; ctx.beginPath(); ctx.arc(0,0,this.r,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#1a2e05'; ctx.fillRect(-6,-4,4,4); ctx.fillRect(2,-4,4,4); }
    else if(this.kind==='zAlien'){ ctx.fillStyle='#22d3ee'; ctx.beginPath(); ctx.ellipse(0,0,this.r, this.r*0.7, 0, 0, Math.PI*2); ctx.fill(); ctx.fillStyle='#0e7490'; ctx.fillRect(-4,-3,8,6); }
    else if(this.kind==='balloon'){ ctx.fillStyle='#fde68a'; ctx.beginPath(); ctx.arc(0,0,this.r,0,Math.PI*2); ctx.fill(); ctx.strokeStyle='#fbbf24'; ctx.stroke(); ctx.beginPath(); ctx.moveTo(0,this.r); ctx.lineTo(0,this.r+8); ctx.stroke(); }
    else if(this.kind==='slime'){ ctx.fillStyle='#34d399'; ctx.beginPath(); ctx.ellipse(0,0,this.r, this.r*0.6, 0, 0, Math.PI*2); ctx.fill(); }
    else if(this.kind==='camera'){ ctx.fillStyle='#f87171'; ctx.fillRect(-10,-8,20,16); ctx.fillStyle='#111827'; ctx.fillRect(-5,-5,10,10); }
    else if(this.kind==='boss'){ ctx.fillStyle='#f472b6'; ctx.beginPath(); ctx.arc(0,0,this.r*1.2,0,Math.PI*2); ctx.fill(); ctx.strokeStyle='#be185d'; ctx.lineWidth=3; ctx.stroke(); }
    ctx.restore();
  }
}

export class Boss extends Enemy{
  constructor(x,y){
    super(x,y,'boss'); this.r=28; this.hp=900; this.speed=40; this.damage=20; this.phase=0; this.t=0;
  }
  update(dt, world){
    this.t+=dt;
    if(this.phase===0){
      const dx=world.player.pos.x-this.pos.x, dy=world.player.pos.y-this.pos.y; const len=Math.hypot(dx,dy)||1;
      this.pos.x+=dx/len*this.speed*dt; this.pos.y+=dy/len*this.speed*dt;
      if(this.t>1.2){ this.t=0; for(let i=0;i<8;i++){ const a=(i/8)*Math.PI*2; const dir={x:Math.cos(a),y:Math.sin(a)}; world.fireBullet({pos:this.pos}, dir, 14, 1, true); } }
      if(this.hp<600) this.phase=1;
    }else if(this.phase===1){
      if(this.t<0.5){
        const dx=world.player.pos.x-this.pos.x, dy=world.player.pos.y-this.pos.y; const len=Math.hypot(dx,dy)||1;
        this.pos.x+=dx/len*(this.speed*2.5)*dt; this.pos.y+=dy/len*(this.speed*2.5)*dt;
      }else if(this.t>1){ this.t=0; }
      if(this.hp<300) this.phase=2;
    }else{
      if(this.t>1.4){ this.t=0; for(let i=0;i<3;i++){ const ex=Math.random()*world.w, ey=Math.random()*world.h; world.enemies.push(new Enemy(ex,ey,'zAlien')); } world.explode(this.pos.x,this.pos.y,120,90); }
    }
    if(this.collides(world.player)){ world.player.takeDamage(this.damage, world); }
  }
}
