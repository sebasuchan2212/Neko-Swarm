import { Renderer } from '../engine/Renderer.js';
import { Input } from '../engine/Input.js';
import { GameEngine } from '../engine/GameEngine.js';
import { Player } from './Player.js';
import { Bullet } from './Bullet.js';
import { Spawner } from './Spawner.js';
import { XPGem } from './XPGem.js';
import { Pool } from '../util/Pool.js';
import { UI } from './UI.js';

export class World{
  constructor(canvas){
    this.canvas=canvas; this.ctx=canvas.getContext('2d');
    this.w=canvas.width; this.h=canvas.height;
    this.renderer=new Renderer(canvas);
    this.input=new Input(canvas);
    this.player=new Player(this.w/2, this.h/2);
    this.ui=new UI(this);
    this.enemies=[]; this.bullets=[]; this.gems=[];
    this.spawner=new Spawner(this);
    this.bulletPool=new Pool(()=>new Bullet());
    this.gameOver=false;

    this.player.onLevelUp=()=>{ this.ui.showLevelUp(); };

    this.engine=new GameEngine(this.update.bind(this), this.draw.bind(this));
  }
  fireBullet(owner, dir){
    const b=this.bulletPool.acquire();
    b.fire(owner.pos.x, owner.pos.y, dir.x, dir.y, owner.bulletSpeed, owner.bulletDamage, owner.pierce);
    this.bullets.push(b);
  }
  findNearestEnemy(pos){
    let best=null, bd=1e9;
    for(const e of this.enemies){
      if(e.dead) continue;
      const dx=pos.x-e.pos.x, dy=pos.y-e.pos.y;
      const d=dx*dx+dy*dy;
      if(d<bd){ bd=d; best=e; }
    }
    return best;
  }
  onEnemyKilled(e){
    // drop XP
    const v = 8 + Math.floor(Math.random()*8);
    this.gems.push(new XPGem(e.pos.x, e.pos.y, v));
  }
  update(dt){
    if(this.gameOver) return;
    // update
    this.player.update(dt, this);
    this.spawner.update(dt);
    for(const e of this.enemies) e.update(dt,this);
    for(const b of this.bullets) b.update(dt,this);
    for(const g of this.gems) g.update(dt,this);
    // cleanup
    this.enemies=this.enemies.filter(o=>!o.dead);
    for(const b of this.bullets){ if(b.dead) this.bulletPool.release(b); }
    this.bullets=this.bullets.filter(o=>!o.dead);
    this.gems=this.gems.filter(o=>!o.dead);
    // UI
    this.ui.update();
  }
  draw(){
    const c=this.ctx;
    c.clearRect(0,0,this.w,this.h);
    // background grid
    c.save(); c.strokeStyle='rgba(255,255,255,.05)';
    for(let x=0;x<this.w;x+=40){ c.beginPath(); c.moveTo(x,0); c.lineTo(x,this.h); c.stroke(); }
    for(let y=0;y<this.h;y+=40){ c.beginPath(); c.moveTo(0,y); c.lineTo(this.w,y); c.stroke(); }
    c.restore();
    // draw order
    for(const g of this.gems) g.draw(c);
    for(const e of this.enemies) e.draw(c);
    for(const b of this.bullets) b.draw(c);
    this.player.draw(c);

    if(this.gameOver){
      c.save();
      c.fillStyle='rgba(0,0,0,.5)'; c.fillRect(0,0,this.w,this.h);
      c.fillStyle='#fff'; c.font='bold 48px system-ui, sans-serif'; c.textAlign='center';
      c.fillText('GAME OVER', this.w/2, this.h/2);
      c.font='16px system-ui, sans-serif';
      c.fillText('Reload page to retry', this.w/2, this.h/2+34);
      c.restore();
    }
  }
}
