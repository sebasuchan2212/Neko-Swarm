export class Missions{
  constructor(){ const raw=localStorage.getItem('neko-sw-missions'); this.data = raw? JSON.parse(raw): this._seed(); this._rollover(); }
  _seed(){ return { date: new Date().toDateString(), daily:[
      {id:'kill50', title:'Eliminate 50', desc:'Defeat 50 enemies', target:50, progress:0, reward:'50 Gold'},
      {id:'xp200', title:'Collect 200 XP', desc:'Pick up XP gems', target:200, progress:0, reward:'1 Key'},
    ], weekly:[
      {id:'boss3', title:'Boss Hunter', desc:'Defeat 3 bosses', target:3, progress:0, reward:'Samurai Skin Trial'},
    ] }; }
  _rollover(){ const today=new Date().toDateString(); if(this.data.date!==today){ this.data=this._seed(); this.save(); } }
  list(){ return [...this.data.daily, ...this.data.weekly]; }
  update(ev){
    if(ev.type==='enemy_kill'){ const m=this.data.daily.find(x=>x.id==='kill50'); if(m) m.progress++; }
    if(ev.type==='xp_pick'){ const m=this.data.daily.find(x=>x.id==='xp200'); if(m) m.progress+=ev.amount; }
    if(ev.type==='boss_kill'){ const m=this.data.weekly.find(x=>x.id==='boss3'); if(m) m.progress++; }
    this.save();
  }
  claimAll(){ /* rewards hook */ }
  save(){ localStorage.setItem('neko-sw-missions', JSON.stringify(this.data)); }
}