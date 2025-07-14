addLayer("qiearth", {
    name: "Earth",
    symbol: "🦬",
    position: 2,
    startData() {
        return {
            unlocked: false,
            unlockOrder: 0,
            points: new Decimal(0),
        }
    },
    color: "#32b828",
    requires() {
        let req = new Decimal("1e13")
        if (player.qiearth.unlockOrder && player.qiearth.unlockOrder >= 1) req = req.times(5500)
        if (player.qiearth.unlockOrder && player.qiearth.unlockOrder >= 2) req = req.times(7000)
        return req
    },
    layerShown() { return hasUpgrade("c", 11) || player.a.achievements.includes("25") },
    resource: "Earth Qi",
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
    increaseUnlockOrder: ["qiocean", "qisky"],
    doReset(resettingLayer) { // What happens when you reset this layer)
        if (layers[resettingLayer].row > this.row) {

        }
        if (layers[resettingLayer].row <= this.row) return

        doLayerReset(this.layer, resettingLayer)
    },
    buyables: {

    },
    upgrades: {

    },
})