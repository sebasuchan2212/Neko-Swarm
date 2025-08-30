import { AllPerks } from './Skills.js';
export class UI{
  constructor(world){
    this.world=world;
    this.hpVal=document.getElementById('hpVal');
    this.lvlVal=document.getElementById('lvlVal');
    this.xpVal=document.getElementById('xpVal');
    this.skinSelect=document.getElementById('skinSelect');
    this.levelUp=document.getElementById('levelUp');
    this.perkButtons=document.getElementById('perkButtons');
    this.skipBtn=document.getElementById('skipBtn');

    this.skinSelect.addEventListener('change',e=>{
      world.player.setSkin(this.skinSelect.value);
    });

    this.skipBtn.addEventListener('click',()=>this.hideLevelUp());
  }
  showLevelUp(){
    this.perkButtons.innerHTML='';
    const picks=[...AllPerks].sort(()=>0.5-Math.random()).slice(0,3);
    for(const p of picks){
      const btn=document.createElement('button');
      btn.className='perk-card';
      btn.innerHTML=`<h3>${p.name}</h3><p>${p.desc}</p>`;
      btn.onclick=()=>{ p.apply(this.world.player); this.hideLevelUp(); };
      this.perkButtons.appendChild(btn);
    }
    this.levelUp.classList.remove('hidden');
  }
  hideLevelUp(){ this.levelUp.classList.add('hidden'); }
  update(){
    const p=this.world.player;
    this.hpVal.textContent = Math.max(0,Math.ceil(p.hp)) + '/' + p.maxHp;
    this.lvlVal.textContent = p.level;
    this.xpVal.textContent = Math.floor( (p.xp/p.xpToNext)*100 ) + '%';
  }
}
