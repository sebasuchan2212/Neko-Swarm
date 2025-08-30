import { Renderer } from '../engine/Renderer.js';
import { Input } from '../engine/Input.js';
import { GameEngine } from '../engine/GameEngine.js';
import { Player } from './Player.js';
import { Bullet } from './Bullet.js';
import { Enemy } from './Enemy.js';
import { Spawner } from './Spawner.js';
import { XPGem } from './XPGem.js';
import { Minion } from './Minion.js';
import { Environment } from './Environment.js';
import { HazardZone } from './HazardZone.js';
import { Collections } from './Collections.js';
import { Leaderboard } from './Leaderboard.js';
import { Missions } from './Missions.js';
import { Pool } from '../util/Pool.js';
import { UI } from './UI.js';
import { Specials } from './Specials.js';
import { AudioSys } from './Audio.js';
import { Monetization } from './Monetization.js';

export class World{
  constructor(canvas){
    this.canvas=canvas; this.ctx=canvas.getContext('2d');
    this.w=canvas.width; this.h=canvas.height;
    this.renderer=new Renderer(canvas);
    this.input=new Input(canvas);
    this.player=new Player(this.w/2, this.h/2);
    this.ui=new UI(this);
    this.enemies=[]; this.bullets=[]; this.gems=[]; this.minions=[]; this.meteors=[]; this.hazards=[];
    this.spawner=new Spawner(this);
    this.bulletPool=new Pool(()=>new Bullet());
    this.env=new Environment(this);
    this.gameOver=false; this.score=0; this.time=0;
    this.flash=0; this.flashT=0; this.beam=null; this.expl=null;
    this.collections=new Collections();
    this.leaderboard=new Leaderboard();
    this.missions=new Missions();
    this.specials=new Specials(this);
    this.HazardZone=HazardZone;
    this.audio=new AudioSys();
    this.monetization=new Monetization(this);
    this.lang = localStorage.getItem('neko-sw-lang') || 'en';
    this.boss=null;

    this.player.onLevelUp=()=>{ this.ui.showLevelUp(); };
    this.engine=new GameEngine(this.update.bind(this), this.draw.bind(this));
  }
  setLang(l){ this.lang=l; localStorage.setItem('neko-sw-lang', l); }
  fireBullet(owner, dir, damageOverride=null, pierceOverride=null, fromMinion=false){
    const b=this.bulletPool.acquire();
    const dmg=damageOverride??this.player.bulletDamage; const pr=pierceOverride??this.player.pierce;
    b.fire(owner.pos.x, owner.pos.y, dir.x, dir.y, this.player.bulletSpeed, dmg, pr);
    this.bullets.push(b); this.collections.addWeapon('bullet'); this.audio.shot();
  }
  addMinion(){ const angle=this.minions.length*1.2; const m=new Minion(this.player, angle); this.minions.push(m); }
  onEnemyKilled(e){ this.gems.push(new XPGem(e.pos.x, e.pos.y, 10+Math.floor(Math.random()*10))); this.collections.addEnemy(e.kind); this.missions.update({type:'enemy_kill'}); this.score+=5; }
  onBossDefeated(){ this.missions.update({type:'boss_kill'}); this.score+=500; this.triggerFlash(0.9,0.4); }
  findNearestEnemy(pos){
    let best=null, bd=1e9;
    for(const e of this.enemies){ if(e.dead) continue; const dx=pos.x-e.pos.x, dy=pos.y-e.pos.y; const d=dx*dx+dy*dy; if(d<bd){ bd=d; best=e; } } return best;
  }
  ray(x,y,dir,len,damage,time){ const end={ x: x+dir.x*len, y:y+dir.y*len };
    const hitSeg=(objR,objX,objY)=>{ const t=projectPointToSegment(objX,objY, x,y, end.x,end.y); return (t.dist<objR+6); };
    for(const e of this.enemies){ if(e.dead) continue; if(hitSeg(e.r,e.pos.x,e.pos.y)){ e.hp-=damage; if(e.hp<=0){ e.dead=true; e.onDeath?.(this); this.onEnemyKilled(e); } } }
    if(this.boss && !this.boss.dead){ if(hitSeg(this.boss.r,this.boss.pos.x,this.boss.pos.y)){ this.boss.hp-=damage; if(this.boss.hp<=0){ this.boss.dead=true; this.onBossDefeated(); } } }
    this.flash=0.6; this.flashT=time; this.beam={x1:x,y1:y,x2:end.x,y2:end.y,t:time};
  }
  explode(x,y,r,damage){
    for(const e of this.enemies){ if(e.dead) continue; const dx=e.pos.x-x, dy=e.pos.y-y; if(dx*dx+dy*dy<=r*r){ e.hp-=damage; if(e.hp<=0){ e.dead=true; e.onDeath?.(this); this.onEnemyKilled(e); } } }
    if(this.boss && !this.boss.dead){ const dx=this.boss.pos.x-x, dy=this.boss.pos.y-y; if(dx*dx+dy*dy<=r*r){ this.boss.hp-=damage; if(this.boss.hp<=0){ this.boss.dead=true; this.onBossDefeated(); } } }
    this.expl={x,y,r,t:0.3}; this.audio.boom();
  }
  triggerFlash(intensity,duration){ this.flash=Math.max(this.flash,intensity); this.flashT=Math.max(this.flashT,duration); }
  onGameOver(){
    this.gameOver=true;
    const name='YOU'; this.leaderboard.submit(name, Math.floor(this.score + this.time*10));
  }
  resetProgress(){
    localStorage.removeItem('neko-sw-collections'); localStorage.removeItem('neko-sw-missions'); localStorage.removeItem('neko-sw-leaderboard'); localStorage.removeItem('neko-sw-lang'); location.reload();
  }
  update(dt){
    if(this.gameOver) return;
    this.time+=dt;
    this.specials.update(dt);
    this.player.update(dt, this);
    this.spawner.update(dt);
    for(const e of this.enemies) e.update(dt,this);
    for(const b of this.bullets) b.update(dt,this);
    for(const g of this.gems) g.update(dt,this);
    for(const m of this.minions) m.update(dt,this);
    for(const m of this.meteors) m.update(dt,this);
    for(const hz of this.hazards) hz.update(dt,this);
    if(this.boss && !this.boss.dead) this.boss.update(dt,this);
    this.enemies=this.enemies.filter(o=>!o.dead);
    for(const b of this.bullets){ if(b.dead) this.bulletPool.release(b); } this.bullets=this.bullets.filter(o=>!o.dead);
    this.gems=this.gems.filter(o=>!o.dead); this.meteors=this.meteors.filter(o=>!o.dead); this.hazards=this.hazards.filter(o=>!o.dead);
    this.env.update(dt);
    if(this.flashT>0){ this.flashT-=dt; } else { this.flash = Math.max(0, this.flash - dt*2); }
    if(this.beam){ this.beam.t-=dt; if(this.beam.t<=0) this.beam=null; }
    if(this.expl){ this.expl.t-=dt; if(this.expl.t<=0) this.expl=null; }
    this.ui.update();
  }
  draw(){
    const ctx=this.ctx; ctx.clearRect(0,0,this.w,this.h);
    // background grid
    ctx.save(); ctx.strokeStyle='rgba(255,255,255,.05)'; for(let x=0;x<this.w;x+=40){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,this.h); ctx.stroke(); } for(let y=0;y<this.h;y+=40){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(this.w,y); ctx.stroke(); } ctx.restore();
    // environment
    this.env.draw(ctx);
    // hazards & meteors
    for(const hz of this.hazards) hz.draw(ctx);
    for(const m of this.meteors) m.draw(ctx);
    // bullets
    for(const b of this.bullets) b.draw(ctx);
    // enemies
    for(const e of this.enemies) e.draw(ctx);
    // boss
    if(this.boss && !this.boss.dead){ this.boss.draw(ctx);
      // boss hp
      ctx.save(); ctx.fillStyle='rgba(0,0,0,.4)'; ctx.fillRect(this.w*0.2, 8, this.w*0.6, 16);
      ctx.fillStyle='#f472b6'; const w=(this.boss.hp/900); ctx.fillRect(this.w*0.2, 8, this.w*0.6*w, 16); ctx.restore();
    }
    // gems & minions
    for(const g of this.gems) g.draw(ctx);
    for(const m of this.minions) m.draw(ctx);
    // player
    this.player.draw(ctx);
    // effects
    if(this.beam){ ctx.save(); ctx.strokeStyle='rgba(255,255,255,.9)'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(this.beam.x1,this.beam.y1); ctx.lineTo(this.beam.x2,this.beam.y2); ctx.stroke(); ctx.restore(); }
    if(this.expl){ ctx.save(); ctx.globalAlpha=this.expl.t/0.3; ctx.fillStyle='rgba(250,204,21,.4)'; ctx.beginPath(); ctx.arc(this.expl.x,this.expl.y,this.expl.r*(1.2-(this.expl.t/0.3)),0,Math.PI*2); ctx.fill(); ctx.restore(); }
    if(this.flash>0){ ctx.save(); ctx.globalAlpha=this.flash; ctx.fillStyle='white'; ctx.fillRect(0,0,this.w,this.h); ctx.restore(); }
    if(this.gameOver){
      ctx.save(); ctx.fillStyle='rgba(0,0,0,.6)'; ctx.fillRect(0,0,this.w,this.h); ctx.fillStyle='white'; ctx.font='bold 28px sans-serif'; ctx.fillText('Game Over', this.w/2-80, this.h/2-10); ctx.font='16px sans-serif'; ctx.fillText('Open 🏆 to see your score', this.w/2-110, this.h/2+18); ctx.restore();
    }
  }
}
function projectPointToSegment(px,py, x1,y1, x2,y2){
  const A=px-x1, B=py-y1, C=x2-x1, D=y2-y1; const dot=A*C+B*D; const len=C*C+D*D; let t=dot/len; t=Math.max(0,Math.min(1,t)); const X=x1+t*C, Y=y1+t*D; const dx=px-X, dy=py-Y; return {x:X,y:Y, dist:Math.hypot(dx,dy)};
}
