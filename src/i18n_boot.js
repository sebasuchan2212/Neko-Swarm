import { EnemyInfo, WeaponInfo } from './game/Assets.js';
window.EnemyInfoEN = Object.fromEntries(Object.entries(EnemyInfo).map(([k,v])=>[k,v.en]));
window.EnemyInfoJA = Object.fromEntries(Object.entries(EnemyInfo).map(([k,v])=>[k,v.ja]));
window.WeaponInfoEN = Object.fromEntries(Object.entries(WeaponInfo).map(([k,v])=>[k,v.en]));
window.WeaponInfoJA = Object.fromEntries(Object.entries(WeaponInfo).map(([k,v])=>[k,v.ja]));
