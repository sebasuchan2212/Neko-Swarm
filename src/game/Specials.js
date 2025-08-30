export class Specials{
  constructor(world){ this.world=world; this.cooldowns={ milk:0, punch:0, cheese:0 }; this.max={ milk:10, punch:8, cheese:7 }; }
  update(dt){ for(const k in this.cooldowns){ if(this.cooldowns[k]>0) this.cooldowns[k]-=dt; } }
  castMilk(){ if(this.cooldowns.milk>0) return false; this.cooldowns.milk=this.max.milk; const w=this.world, p=w.player; const t=w.findNearestEnemy(p.pos) || w.boss || {pos:{x:p.pos.x+1,y:p.pos.y}}; const dx=t.pos.x-p.pos.x, dy=t.pos.y-p.pos.y; const d=Math.hypot(dx,dy)||1; const dir={x:dx/d,y:dy/d}; w.ray(p.pos.x, p.pos.y, dir, 520, 110, 0.2); w.collections.addWeapon('milk'); return true; }
  castPunch(){ if(this.cooldowns.punch>0) return false; this.cooldowns.punch=this.max.punch; const w=this.world, p=w.player; w.explode(p.pos.x, p.pos.y, 110, 140); w.collections.addWeapon('punch'); return true; }
  castCheese(){ if(this.cooldowns.cheese>0) return false; this.cooldowns.cheese=this.max.cheese; const w=this.world, p=w.player; w.hazards.push(new w.HazardZone(p.pos.x, p.pos.y, 70)); w.collections.addWeapon('cheese'); return true; }
}