import { Enemy } from './Enemy.js';

export class Spawner{
  constructor(world){ this.world=world; this.timer=0; this.interval=1.2; this.elapsed=0; }
  update(dt){
    this.timer+=dt; this.elapsed+=dt;
    // speed up spawn over time
    const curInt = Math.max(0.35, this.interval - this.elapsed*0.01);
    if(this.timer>=curInt){
      this.timer=0;
      const side=Math.floor(Math.random()*4);
      let x=0,y=0, w=this.world.w, h=this.world.h;
      if(side===0){ x=0; y=Math.random()*h; }
      if(side===1){ x=w; y=Math.random()*h; }
      if(side===2){ y=0; x=Math.random()*w; }
      if(side===3){ y=h; x=Math.random()*w; }
      const kind = Math.random()<0.4 ? 'zombie' : 'zAlien';
      this.world.enemies.push(new Enemy(x,y,kind));
    }
  }
}
