export class Leaderboard{
  constructor(){ const raw=localStorage.getItem('neko-sw-leaderboard'); this.rows = raw? JSON.parse(raw): [{name:'YOU',score:0},{name:'Neko#1024',score:1200},{name:'Mimi#7',score:950}]; }
  submit(name,score){ this.rows.push({name,score}); this.rows.sort((a,b)=>b.score-a.score); this.rows=this.rows.slice(0,50); localStorage.setItem('neko-sw-leaderboard', JSON.stringify(this.rows)); }
  get(){ return this.rows; }
}