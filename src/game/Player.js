import { Entity } from '../core/Entity.js';
import { Skins } from './Assets.js';

export class Player extends Entity{
  constructor(x,y){
    super(x,y,18);
    this.type='player';
    this.baseSpeed=160; this.speed=this.baseSpeed;
    this.hp=120; this.maxHp=120;
    this.level=1; this.xp=0; this.xpToNext=60;
    this.fireRate=3; this.fireTimer=0;
    this.bulletSpeed=360; this.bulletDamage=12; this.pierce=0;
    this.skin='default';
    this.form='cat';
    this.formStage=0;
  }
  setSkin(k){ if(Skins[k]) this.skin=k; }
  gainXP(v){ this.xp+=v; while(this.xp>=this.xpToNext){ this.xp-=this.xpToNext; this.level++; this.xpToNext=Math.floor(this.xpToNext*1.2+12); if(this.onLevelUp) this.onLevelUp(); } }
  evolutionChoices(){
    if(this.formStage===0) return ['armor','mecha'];
    if(this.formStage===1) return Math.random()<0.5? ['mecha','dread']:['dread','armor+'];
    if(this.formStage===2) return ['dread'];
    return [];
  }
  applyEvolution(form){
    this.form=form;
    if(form==='armor'){ this.formStage=1; this.maxHp+=60; this.hp+=60; this.speed=this.baseSpeed*0.95; this.bulletDamage+=6; }
    if(form==='armor+'){ this.formStage=2; this.maxHp+=120; this.hp+=120; this.speed=this.baseSpeed*0.9; this.pierce+=1; }
    if(form==='mecha'){ this.formStage=2; this.maxHp+=80; this.hp+=80; this.speed=this.baseSpeed*1.05; this.fireRate+=0.8; this.bulletDamage+=10; this.pierce+=1; }
    if(form==='dread'){ this.formStage=3; this.maxHp+=140; this.hp+=140; this.speed=this.baseSpeed*1.1; this.fireRate+=1.2; this.bulletDamage+=18; this.pierce+=2; }
  }
  update(dt, world){
    const d=world.input.dirFrom(this.pos.x,this.pos.y);
    this.vel.set(d.x*this.speed,d.y*this.speed);
    this.pos.add(this.vel.clone().mul(dt));
    this.pos.x=Math.max(this.r, Math.min(world.w-this.r, this.pos.x));
    this.pos.y=Math.max(this.r, Math.min(world.h-this.r, this.pos.y));
    this.fireTimer+=dt;
    const interval=1/this.fireRate;
    if(this.fireTimer>=interval){
      const target=world.findNearestEnemy(this.pos) || world.boss;
      if(target){
        this.fireTimer=0;
        const dir={ x: (target.pos.x-this.pos.x), y:(target.pos.y-this.pos.y)};
        const l=Math.hypot(dir.x,dir.y)||1; dir.x/=l; dir.y/=l;
        world.fireBullet(this, dir, null, null, false);
      }
    }
  }
  takeDamage(dmg, world){ this.hp-=dmg; if(this.hp<=0){ world.onGameOver(); } }
  draw(ctx){
    const p=Skins[this.skin]; ctx.save(); ctx.translate(this.pos.x,this.pos.y);
    ctx.fillStyle=p.body; ctx.beginPath(); ctx.arc(0,0,this.r,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=p.ear; ctx.beginPath(); ctx.moveTo(-8,-10); ctx.lineTo(-2,-22); ctx.lineTo(4,-10); ctx.fill();
    ctx.beginPath(); ctx.moveTo(8,-10); ctx.lineTo(2,-22); ctx.lineTo(-4,-10); ctx.fill();
    ctx.fillStyle=p.eye; ctx.beginPath(); ctx.arc(-5,-2,3,0,Math.PI*2); ctx.arc(5,-2,3,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle=p.acc; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(0,8,10,0,Math.PI); ctx.stroke();
    if(this.form==='armor' || this.form==='armor+'){ ctx.strokeStyle='#93c5fd'; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(0,0,this.r+2,0,Math.PI*2); ctx.stroke(); }
    if(this.form==='mecha'){ ctx.fillStyle='#94a3b8'; ctx.fillRect(-this.r-4,-4,8,8); ctx.fillRect(this.r-4,-4,8,8); }
    if(this.form==='dread'){ ctx.fillStyle='#a78bfa'; ctx.beginPath(); ctx.arc(0,0,this.r+4,0,Math.PI*2); ctx.globalAlpha=.15; ctx.fill(); ctx.globalAlpha=1; }
    ctx.restore();
  }
}
