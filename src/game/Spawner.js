import { Enemy, Boss } from './Enemy.js';
export class Spawner{
  constructor(world){ this.world=world; this.timer=0; this.interval=1.2; this.elapsed=0; this.bossSpawned=false; }
  update(dt){
    this.timer+=dt; this.elapsed+=dt;
    const curInt = Math.max(0.35, this.interval - this.elapsed*0.01);
    if(this.timer>=curInt){
      this.timer=0;
      const side=Math.floor(Math.random()*4); let x=0,y=0, w=this.world.w, h=this.world.h;
      if(side===0){ x=0; y=Math.random()*h; } if(side===1){ x=w; y=Math.random()*h; } if(side===2){ y=0; x=Math.random()*w; } if(side===3){ y=h; x=Math.random()*w; }
      const t=this.elapsed;
      const weights=[ ['zombie', 50], ['zAlien', 45], ['balloon', 22 + t*0.5], ['slime', 28 + t*0.6], ['camera', 12 + t*0.4] ];
      const kind=pickWeighted(weights);
      this.world.enemies.push(new Enemy(x,y,kind));
    }
    if(!this.bossSpawned && this.elapsed>90){ this.bossSpawned=true; this.world.boss=new Boss(this.world.w/2, -40); }
  }
}
function pickWeighted(list){ const sum=list.reduce((a,[_k,w])=>a+w,0); let r=Math.random()*sum; for(const [k,w] of list){ if((r-=w)<=0) return k; } return list[0][0]; }
