addLayer("qisky", {
    name: "Sky",
    symbol: "🦅",
    position: 1,
    startData() {
        return {
            unlocked: false,
            unlockOrder: 0,
            points: new Decimal(0),
            acceleration: new Decimal(0),
            speed: new Decimal(0),
            resistance: new Decimal(0),
        }
    },
    color: "#bfd9d8",
    requires() {
        let req = new Decimal("1e13")
        if (player.qisky.unlockOrder && player.qisky.unlockOrder >= 1) req = req.times(5500)
        if (player.qisky.unlockOrder && player.qisky.unlockOrder >= 2) req = req.times(7000)
        return req
    },
    layerShown(){ return hasUpgrade("c", 11) || player.a.achievements.includes("25") },
    resource: "Sky Qi",
    baseResource: "droplets of mana",
    baseAmount() { return player.d.points },
    type: "normal",
    exponent: 0.5,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)

        return mult
    },
    row: 2,
    branches: ["c"],
    increaseUnlockOrder: ["qiocean", "qiearth"],
    doReset(resettingLayer) { // What happens when you reset this layer)
        if (layers[resettingLayer].row > this.row) {
            this.acceleration = new Decimal(0)
            this.speed = new Decimal(0)
            this.resistance = new Decimal(0)
        }
        if (layers[resettingLayer].row <= this.row) return

        doLayerReset(this.layer, resettingLayer)
    },
    effectDescription() {
        return "and your winds are moving at " + format(player.qisky.speed) + " m/s (" + format(player.qisky.acceleration) + " m/s² with " + format(player.qisky.resistance.times(100)) + "% resistance). \n"+
                "This increases your mana cap by " + format(this.effect()) + "x"
    },
    effect() {
        let effect = new Decimal(1.0)
        if (player[this.layer].speed.gt(0)) {
            effect = effect.add(player[this.layer].speed.times(100).log(1.2))
        }

        return softcap(effect, new Decimal(1e3), 0.1)
    },
    update(diff) { // Called every tick, to update the layer
        let accel = new Decimal(player[this.layer].points).times(9.8876)
        let resist = new Decimal(0.40)

        let resistMult = resist.negate().add(1)
        let speed = player[this.layer].speed.add(accel).times(resistMult)
        if (speed.lt(player[this.layer].speed))
            speed = player[this.layer].speed
        player[this.layer].acceleration = accel
        player[this.layer].resistance = resist
        player[this.layer].speed = speed
    },
    buyables: {
        
    },
    upgrades: {
       
    },
})