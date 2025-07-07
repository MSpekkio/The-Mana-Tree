addLayer("qiocean", {
    name: "Ocean",
    symbol: "🐠",
    position: 0,
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            exploredTotal: new Decimal(0),
            explored: new Decimal(0),
            exploredGain: new Decimal(0),
        }
    },
    color: "#00bfff",
    requires() {
        let req = new Decimal("1e13")
        if (tmp.qiocean.unlockOrder.length >= 1) req = req.times(3500)
        if (tmp.qiocean.unlockOrder.length >= 2) req = req.times(3500)
        return req
    },
    layerShown(){ return hasUpgrade("c", 11) || player.a.achievements.includes("25") },
    resource: "Ocean Qi",
    baseResource: "droplets of mana",
    baseAmount() { return player.d.points },
    type: "normal",
    exponent: 0.5,
    row: 2,
    branches: ["c"],
    increaseUnlockOrder: ["qisky", "qiearth"],
    doReset(resettingLayer) { // What happens when you reset this layer)
        if (layers[resettingLayer].row > this.row) {
            this.exploredTotal = new Decimal(0)
            this.explored = new Decimal(0)
            this.exploredGain = new Decimal(0)
        }
        if (layers[resettingLayer].row <= this.row) return

        doLayerReset(this.layer, resettingLayer)
    },
    effectDescription() {
        return "and you've explored " + format(player.qiocean.explored) + " fathoms (" + format(player.qiocean.exploredGain) + " explore power per second) which increases the core effect by " + format(this.effect()) + "x"
    },
    effect() {
        let effect = new Decimal(1.0)
        if (player[this.layer].explored.gt(0)) {
            let effectBase = new Decimal(1.00526)
            effect = effectBase.pow(player[this.layer].explored).add(1.75)
        }
        return effect
    },
    update(diff) { // Called every tick, to update the layer
        if (player[this.layer].points.gte(1)) {
            let gain = new Decimal(player[this.layer].points).div(10)
            if (hasUpgrade(this.layer, 11)) gain = gain.times(5)

            player[this.layer].exploredTotal = player[this.layer].exploredTotal.add(gain.times(diff))
            player[this.layer].exploredGain = gain
            player[this.layer].explored = player[this.layer].exploredTotal.pow(0.463)
        }
    },
    upgrades: {
        11: {
            title: "The Shallows",
            description: "Increase explore power by 5x",
            cost: new Decimal(3),
            unlocked() { return true },
        },
        12: {
            title: "Plankton",
            description: "Increase life force gain by fathoms explored",
            cost: new Decimal(5),
            unlocked() { return true },
            effect() {
                return player.qiocean.exploredTotal.times(11.5).ln().add(16.49)
            },
            effectDisplay() {
                return format(this.effect()) + "x"
            },
        },
    },
})