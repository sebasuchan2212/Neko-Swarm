import { World } from './game/World.js';

const canvas=document.getElementById('game');
const world=new World(canvas);

document.getElementById('skinSelect').addEventListener('change', e=>{
  world.player.setSkin(e.target.value);
});
