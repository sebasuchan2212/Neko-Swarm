import './i18n_boot.js';
import { World } from './game/World.js';

const canvas = document.getElementById('game');
const world = new World(canvas);

// Expose for debugging
window.__world = world;

// Touchstart to resume audio contexts on mobile
window.addEventListener('pointerdown', ()=>world.audio._ensure(), {once:true});
