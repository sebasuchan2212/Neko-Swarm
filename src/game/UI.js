import { AllPerks } from './Skills.js';
import { I18N } from './Assets.js';

export class UI{
  constructor(world){
    this.world=world;
    this.hpVal=document.getElementById('hpVal');
    this.lvlVal=document.getElementById('lvlVal');
    this.xpVal=document.getElementById('xpVal');
    this.formVal=document.getElementById('formVal');
    this.skinSelect=document.getElementById('skinSelect');
    this.langSelect=document.getElementById('langSelect');
    this.levelUp=document.getElementById('levelUp');
    this.perkButtons=document.getElementById('perkButtons');
    this.skipBtn=document.getElementById('skipBtn');
    this.levelUpTitle=document.getElementById('levelUpTitle');
    this.levelUpDesc=document.getElementById('levelUpDesc');
    this.collections=document.getElementById('collections');
    this.collectionBody=document.getElementById('collectionBody');
    this.btnCollections=document.getElementById('btnCollections');
    this.closeCollections=document.getElementById('closeCollections');
    this.tabs=[...document.querySelectorAll('.tab')];
    this.missions=document.getElementById('missions');
    this.missionBody=document.getElementById('missionBody');
    this.btnMissions=document.getElementById('btnMissions');
    this.closeMissions=document.getElementById('closeMissions');
    this.btnClaimAll=document.getElementById('btnClaimAll');
    this.leaderboard=document.getElementById('leaderboard');
    this.lbBody=document.getElementById('lbBody');
    this.btnLeaderboard=document.getElementById('btnLeaderboard');
    this.closeLeaderboard=document.getElementById('closeLeaderboard');
    this.settings=document.getElementById('settings');
    this.btnSettings=document.getElementById('btnSettings');
    this.closeSettings=document.getElementById('closeSettings');
    this.musicVol=document.getElementById('musicVol');
    this.sfxVol=document.getElementById('sfxVol');
    this.langSelect2=document.getElementById('langSelect2');
    this.btnReset=document.getElementById('btnReset');
    this.btnReward=document.getElementById('btnReward');
    this.btnIAP=document.getElementById('btnIAP');
    this.spMilk=document.getElementById('spMilk');
    this.spPunch=document.getElementById('spPunch');
    this.spCheese=document.getElementById('spCheese');
    this.cdMilk=document.getElementById('cdMilk');
    this.cdPunch=document.getElementById('cdPunch');
    this.cdCheese=document.getElementById('cdCheese');

    this.skinSelect.addEventListener('change',()=>world.player.setSkin(this.skinSelect.value));
    this.langSelect.addEventListener('change',()=>world.setLang(this.langSelect.value));
    this.langSelect2.addEventListener('change',()=>world.setLang(this.langSelect2.value));
    this.skipBtn.addEventListener('click',()=>this.hideLevelUp());
    this.btnCollections.addEventListener('click',()=>{ this.renderCollections('enemies'); this.collections.classList.remove('hidden'); });
    this.closeCollections.addEventListener('click',()=>this.collections.classList.add('hidden'));
    this.tabs.forEach(t=>t.addEventListener('click',()=>{ this.tabs.forEach(x=>x.classList.remove('active')); t.classList.add('active'); this.renderCollections(t.dataset.tab);}));
    this.btnMissions.addEventListener('click',()=>{ this.renderMissions(); this.missions.classList.remove('hidden'); });
    this.closeMissions.addEventListener('click',()=>this.missions.classList.add('hidden'));
    this.btnClaimAll.addEventListener('click',()=>{ world.missions.claimAll(); this.renderMissions(); });
    this.btnLeaderboard.addEventListener('click',()=>{ this.renderLeaderboard(); this.leaderboard.classList.remove('hidden'); });
    this.closeLeaderboard.addEventListener('click',()=>this.leaderboard.classList.add('hidden'));
    this.btnSettings.addEventListener('click',()=>{ this.settings.classList.remove('hidden'); });
    this.closeSettings.addEventListener('click',()=>this.settings.classList.add('hidden'));
    this.musicVol.addEventListener('input',()=>world.audio.setMusicVol(parseFloat(this.musicVol.value)));
    this.sfxVol.addEventListener('input',()=>world.audio.setSFXVol(parseFloat(this.sfxVol.value)));
    this.btnReset.addEventListener('click',()=>world.resetProgress());
    this.btnReward.addEventListener('click',()=>world.monetization.showReward(()=>world.player.hp=Math.min(world.player.maxHp, world.player.hp+60)));
    this.btnIAP.addEventListener('click',()=>world.monetization.purchase('skin_pack', ()=>world.collections.unlockSkin('samurai')));

    this.spMilk.onclick=()=>world.specials.castMilk();
    this.spPunch.onclick=()=>world.specials.castPunch();
    this.spCheese.onclick=()=>world.specials.castCheese();
  }
  t(key){ return I18N[this.world.lang][key] || key; }
  showLevelUp(){
    const p=this.world.player; const canEvolve=(p.level%3===0) && (p.formStage<3);
    this.perkButtons.innerHTML='';
    if(canEvolve){
      this.levelUpTitle.textContent=this.t('evolution');
      this.levelUpDesc.textContent=this.t('choose');
      const picks=p.evolutionChoices();
      for(const f of picks){
        const btn=document.createElement('button'); btn.className='perk-card';
        btn.innerHTML=`<h3>${cap(f)}</h3><p>Power up & change look</p>`;
        btn.onclick=()=>{ p.applyEvolution(f); this.hideLevelUp(); };
        this.perkButtons.appendChild(btn);
      }
    }else{
      this.levelUpTitle.textContent=this.t('levelUp');
      this.levelUpDesc.textContent=this.t('choose');
      const picks=[...AllPerks].sort(()=>0.5-Math.random()).slice(0,3);
      for(const pk of picks){
        const btn=document.createElement('button'); btn.className='perk-card';
        btn.innerHTML=`<h3>${pk.name}</h3><p>${pk.desc}</p>`;
        btn.onclick=()=>{ pk.apply(p,this.world); this.hideLevelUp(); };
        this.perkButtons.appendChild(btn);
      }
    }
    this.levelUp.classList.remove('hidden');
  }
  hideLevelUp(){ this.levelUp.classList.add('hidden'); }
  update(){
    const p=this.world.player;
    this.hpVal.textContent = `${this.t('hp')} ${Math.max(0,Math.ceil(p.hp))}/${p.maxHp}`;
    this.lvlVal.textContent = `${this.t('lv')} ${p.level}`;
    this.xpVal.textContent = `${this.t('xp')} ${Math.floor( (p.xp/p.xpToNext)*100 )}%`;
    this.formVal.textContent = (this.t('form')+': '+cap(p.form));
    const s=this.world.specials;
    this.cdMilk.textContent=s.cooldowns.milk>0? s.cooldowns.milk.toFixed(0)+'s':this.t('ready');
    this.cdPunch.textContent=s.cooldowns.punch>0? s.cooldowns.punch.toFixed(0)+'s':this.t('ready');
    this.cdCheese.textContent=s.cooldowns.cheese>0? s.cooldowns.cheese.toFixed(0)+'s':this.t('ready');
  }
  renderCollections(tab){
    const c=this.world.collections; const el=this.collectionBody; el.innerHTML='';
    if(tab==='enemies'){
      for(const k of ['zombie','zAlien','balloon','slime','camera','boss']){
        const d=c.enemies[k]; const card=document.createElement('div'); card.className='card';
        const text = (this.world.lang==='ja'? (window.EnemyInfoJA?.[k]||'') : (window.EnemyInfoEN?.[k]||''));
        card.innerHTML=`<div class="name">${cap(k)}</div><div class="desc">${text||''}</div><div class="desc">Defeated: ${d||0}</div>`; el.appendChild(card);
      }
    }else if(tab==='weapons'){
      for(const k of ['bullet','milk','punch','cheese']){
        const d=c.weapons[k]; const card=document.createElement('div'); card.className='card';
        card.innerHTML=`<div class="name">${cap(k)}</div><div class="desc">${(this.world.lang==='ja'?(window.WeaponInfoJA?.[k]||''):(window.WeaponInfoEN?.[k]||''))}</div><div class="desc">Used: ${d||0}</div>`; el.appendChild(card);
      }
    }else{
      const skins=['default','ninja','astro','cowboy','samurai'];
      for(const k of skins){
        const unlocked = c.skins[k]?'Unlocked':'Locked';
        const card=document.createElement('div'); card.className='card';
        card.innerHTML=`<div class="name">${cap(k)}</div><div class="desc">${unlocked}</div>`; el.appendChild(card);
      }
    }
  }
  renderMissions(){
    const el=this.missionBody; el.innerHTML='';
    for(const m of this.world.missions.list()){
      const card=document.createElement('div'); card.className='card';
      const prog=Math.min(100, Math.floor((m.progress/m.target)*100));
      card.innerHTML=`<div class="name">${m.title}</div><div class="desc">${m.desc}</div><div class="desc">Progress: ${m.progress}/${m.target} (${prog}%)</div><div class="desc">Reward: ${m.reward}</div>`;
      el.appendChild(card);
    }
  }
  renderLeaderboard(){
    const el=this.lbBody; el.innerHTML='';
    const lb=this.world.leaderboard.get();
    lb.forEach((row,i)=>{ const card=document.createElement('div'); card.className='card'; card.innerHTML=`<div class="name">#${i+1} ${row.name}</div><div class="desc">Score: ${row.score}</div>`; el.appendChild(card); });
  }
}
function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
