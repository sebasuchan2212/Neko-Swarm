export class Renderer{
  constructor(canvas){ this.canvas=canvas; this.ctx=canvas.getContext('2d'); this.w=canvas.width; this.h=canvas.height; window.addEventListener('resize',()=>this._fit(),{passive:true}); this._fit(); }
  _fit(){ const ratio=this.w/this.h; const rw=window.innerWidth,rh=window.innerHeight; let cw=rw,ch=rw/ratio; if(ch>rh){ ch=rh; cw=rh*ratio; } this.canvas.style.width=cw+'px'; this.canvas.style.height=ch+'px'; }
  clear(){ this.ctx.clearRect(0,0,this.w,this.h); }
}