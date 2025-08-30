export class Monetization{
  constructor(world){ this.world=world; }
  showReward(onReward){ alert('Reward Ad (mock) viewed!'); onReward && onReward(); }
  purchase(sku, onSuccess){ alert('Purchased '+sku+' (mock)'); onSuccess && onSuccess(); }
}