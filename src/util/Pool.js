export class Pool{
  constructor(create){ this.create=create; this.items=[]; }
  acquire(){ return this.items.pop() || this.create(); }
  release(obj){ this.items.push(obj); }
}
