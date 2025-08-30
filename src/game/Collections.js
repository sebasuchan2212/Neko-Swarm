export class Collections{
  constructor(){ const raw=localStorage.getItem('neko-sw-collections'); this.data = raw? JSON.parse(raw): { enemies:{}, weapons:{}, skins:{ default:true } }; }
  get enemies(){ return this.data.enemies; } get weapons(){ return this.data.weapons; } get skins(){ return this.data.skins; }
  addEnemy(k){ this.data.enemies[k]=(this.data.enemies[k]||0)+1; this.save(); }
  addWeapon(k){ this.data.weapons[k]=(this.data.weapons[k]||0)+1; this.save(); }
  unlockSkin(k){ this.data.skins[k]=true; this.save(); }
  save(){ localStorage.setItem('neko-sw-collections', JSON.stringify(this.data)); }
}