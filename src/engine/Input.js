export class Input{
  constructor(canvas){
    this.down=false; this.pos={x:0,y:0};
    const upd=(x,y)=>{ const r=canvas.getBoundingClientRect();
      const sx=canvas.width/r.width, sy=canvas.height/r.height;
      this.pos.x=(x-r.left)*sx; this.pos.y=(y-r.top)*sy; };
    canvas.addEventListener('pointerdown',e=>{ this.down=true; upd(e.clientX,e.clientY); canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove',e=>{ if(this.down) upd(e.clientX,e.clientY); });
    canvas.addEventListener('pointerup',e=>{ this.down=false; });
    // desktop support
    window.addEventListener('keydown',e=>{
      if(e.key===' '){ this.down=true; this.pos.x=canvas.width/2; this.pos.y=canvas.height/2; }
      if(e.key==='ArrowUp'){ this.pos.y-=20; }
      if(e.key==='ArrowDown'){ this.pos.y+=20; }
      if(e.key==='ArrowLeft'){ this.pos.x-=20; }
      if(e.key==='ArrowRight'){ this.pos.x+=20; }
    });
    window.addEventListener('keyup',e=>{ if(e.key===' ') this.down=false; });
  }
  dirFrom(px,py){
    if(!this.down) return {x:0,y:0};
    let dx=this.pos.x-px, dy=this.pos.y-py;
    const len=Math.hypot(dx,dy)||1; dx/=len; dy/=len;
    return {x:dx,y:dy};
  }
}
