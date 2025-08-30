import { Entity } from '../core/Entity.js';
import { Vec2 } from '../util/Vec2.js';
import { Skins } from './Assets.js';

export class Player extends Entity{
  constructor(x,y){
    super(x,y,18);
    this.type='player';
    this.speed=160;
    this.hp=100; this.maxHp=100;
    this.level=1; this.xp=0; this.xpToNext=50;
    this.fireRate=3; // bullets per second
    this.fireTimer=0;
    this.bulletSpeed=360;
    this.bulletDamage=10;
    this.pierce=0;
    this.skin='default';
  }
  setSkin(k){ if(Skins[k]) this.skin=k; }
  gainXP(v){
    this.xp+=v;
    while(this.xp>=this.xpToNext){
      this.xp-=this.xpToNext;
      this.level++; this.xpToNext = Math.floor(this.xpToNext*1.2 + 10);
      if(this.onLevelUp) this.onLevelUp();
    }
  }
  update(dt, world){
    // movement
    const d=world.input.dirFrom(this.pos.x,this.pos.y);
    this.vel.set(d.x*this.speed,d.y*this.speed);
    this.pos.add(this.vel.clone().mul(dt));
    // clamp to world
    this.pos.x=Math.max(this.r, Math.min(world.w-this.r, this.pos.x));
    this.pos.y=Math.max(this.r, Math.min(world.h-this.r, this.pos.y));

    // auto-fire
    this.fireTimer+=dt;
    const interval=1/this.fireRate;
    if(this.fireTimer>=interval){
      const target=world.findNearestEnemy(this.pos);
      if(target){
        this.fireTimer=0;
        world.fireBullet(this, target.pos.clone().sub(this.pos).normalize());
      }
    }
  }
  takeDamage(dmg, world){
    this.hp-=dmg;
    if(this.hp<=0){ world.gameOver=true; }
  }
  draw(ctx){
    const p=Skins[this.skin];
    ctx.save();
    ctx.translate(this.pos.x,this.pos.y);
    // body
    ctx.fillStyle=p.body;
    ctx.beginPath(); ctx.arc(0,0,this.r,0,Math.PI*2); ctx.fill();
    // ears
    ctx.fillStyle=p.ear;
    ctx.beginPath(); ctx.moveTo(-8,-10); ctx.lineTo(-2,-22); ctx.lineTo(4,-10); ctx.fill();
    ctx.beginPath(); ctx.moveTo(8,-10); ctx.lineTo(2,-22); ctx.lineTo(-4,-10); ctx.fill();
    // eyes
    ctx.fillStyle=p.eye;
    ctx.beginPath(); ctx.arc(-5,-2,3,0,Math.PI*2); ctx.arc(5,-2,3,0,Math.PI*2); ctx.fill();
    // accent collar
    ctx.strokeStyle=p.acc; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(0,8,10,0,Math.PI); ctx.stroke();
    ctx.restore();
  }
}
