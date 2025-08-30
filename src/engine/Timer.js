export class Timer{
  constructor(){ this.t=0; }
  update(dt){ this.t+=dt; }
  every(sec){ if(this.t>=sec){ this.t-=sec; return true;} return false; }
}
