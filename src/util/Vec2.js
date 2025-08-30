export class Vec2{
  constructor(x=0,y=0){ this.x=x; this.y=y; }
  set(x,y){ this.x=x; this.y=y; return this; }
  copy(v){ this.x=v.x; this.y=v.y; return this; }
  add(v){ this.x+=v.x; this.y+=v.y; return this; }
  sub(v){ this.x-=v.x; this.y-=v.y; return this; }
  mul(s){ this.x*=s; this.y*=s; return this; }
  len(){ return Math.hypot(this.x,this.y); }
  normalize(){ const l=this.len()||1; this.x/=l; this.y/=l; return this; }
  clone(){ return new Vec2(this.x,this.y); }
  static fromAngle(a){ return new Vec2(Math.cos(a),Math.sin(a)); }
}
