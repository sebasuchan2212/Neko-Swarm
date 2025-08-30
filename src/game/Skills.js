export const AllPerks=[
  { key:'firerate', name:'Rapid Fire', desc:'+20% fire rate', apply:p=>p.fireRate*=1.2 },
  { key:'bullet', name:'Power Bullets', desc:'+25% bullet dmg', apply:p=>p.bulletDamage=Math.round(p.bulletDamage*1.25) },
  { key:'speed', name:'Quick Paws', desc:'+15% move speed', apply:p=>p.speed=Math.round(p.speed*1.15) },
  { key:'pierce', name:'Sharp Claws', desc:'+1 bullet pierce', apply:p=>p.pierce+=1 },
  { key:'vital', name:'Thick Fur', desc:'+20 max HP', apply:p=>{ p.maxHp+=20; p.hp+=20; } },
];
