import { Meteor } from './Meteor.js'; import { HazardZone } from './HazardZone.js';
export class Environment{
  constructor(world){ this.world=world; this.timer=0; this.weather='none'; this.weatherTimer=0; this.rainAlpha=0; }
  update(dt){
    const w=this.world;
    this.weatherTimer+=dt;
    if(this.weather==='none' && this.weatherTimer>12){ this.weather = Math.random()<0.6?'rain':'storm'; this.weatherTimer=0; }
    else if((this.weather==='rain' || this.weather==='storm') && this.weatherTimer>14){ this.weather='none'; this.weatherTimer=0; }
    if(this.weather==='rain' || this.weather==='storm'){ this.rainAlpha = Math.min(0.35, this.rainAlpha+dt*0.3); } else { this.rainAlpha = Math.max(0, this.rainAlpha-dt*0.3); }
    this.timer+=dt;
    if(this.timer>3){ this.timer=0; if(Math.random()<0.5){ w.meteors.push(new Meteor(Math.random()*w.w)); } else { w.hazards.push(new HazardZone(Math.random()*w.w, Math.random()*w.h, 60+Math.random()*50)); } }
    if(this.weather==='storm' && Math.random()<0.01){ const x=Math.random()*w.w, y=Math.random()*w.h; w.explode(x,y,70,80); w.flash=0.9; w.flashT=0.2; }
  }
  draw(ctx){
    if(this.rainAlpha>0){
      ctx.save(); ctx.globalAlpha=this.rainAlpha; ctx.fillStyle='#0a0f23'; ctx.fillRect(0,0,this.world.w,this.world.h);
      ctx.strokeStyle='rgba(255,255,255,.15)'; for(let i=0;i<40;i++){ const x=Math.random()*this.world.w; const y=Math.random()*this.world.h; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+6,y+18); ctx.stroke(); }
      ctx.restore();
    }
  }
}