export class GameEngine{
  constructor(update,draw){
    this.update=update; this.draw=draw; this.last=0; this.acc=0;
    this.step=1/60;
    requestAnimationFrame(this.loop.bind(this));
  }
  loop(ts){
    const t=ts/1000;
    if(!this.last) this.last=t;
    let dt=t-this.last; this.last=t;
    // clamp dt to avoid spiral after tab inactive
    if(dt>0.1) dt=0.1;
    this.acc+=dt;
    while(this.acc>=this.step){
      this.update(this.step);
      this.acc-=this.step;
    }
    this.draw();
    requestAnimationFrame(this.loop.bind(this));
  }
}
