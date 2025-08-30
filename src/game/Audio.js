export class AudioSys{
  constructor(){ this.ctx=null; this.musicGain=0.2; this.sfxGain=0.7; this._ensure(); }
  _ensure(){ if(!this.ctx){ const AC=window.AudioContext||window.webkitAudioContext; if(AC) this.ctx=new AC(); } }
  setMusicVol(v){ this.musicGain=v; } setSFXVol(v){ this.sfxGain=v; }
  beep(freq=440, dur=0.1, type='sine', gain=0.2){ this._ensure(); if(!this.ctx) return; const o=this.ctx.createOscillator(); const g=this.ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.value=this.sfxGain*gain; o.connect(g); g.connect(this.ctx.destination); o.start(); o.stop(this.ctx.currentTime+dur); }
  shot(){ this.beep(660,0.05,'square',0.25); }
  hit(){ this.beep(220,0.06,'sawtooth',0.3); }
  boom(){ this.beep(120,0.2,'triangle',0.35); }
}