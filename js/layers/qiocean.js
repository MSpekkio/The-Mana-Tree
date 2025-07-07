addLayer("qiocean", {
    name: "Ocean",
    symbol: "🐠",
    position: 0,
    startData() {
        return {
            unlocked: false,
            unlockOrder: 0,
            points: new Decimal(0),
            exploredTotal: new Decimal(0),
            explored: new Decimal(0),
            exploredGain: new Decimal(0),
        }
    },
    color: "#00bfff",
    requires() {
        let req = new Decimal("1e13")
        if (player.qiocean.unlockOrder && player.qiocean.unlockOrder >= 1) req = req.times(3500)
        if (player.qiocean.unlockOrder && player.qiocean.unlockOrder >= 2) req = req.times(3500)
        return req
    },
    layerShown(){ return hasUpgrade("c", 11) || player.a.achievements.includes("25") },
    resource: "Ocean Qi",
    baseResource: "droplets of mana",
    baseAmount() { return player.d.points },
    type: "normal",
    exponent: 0.5,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasUpgrade("qiocean", 31)) mult = mult.times(upgradeEffect("qiocean", 31))

        return mult
    },
    row: 2,
    branches: ["c"],
    increaseUnlockOrder: ["qisky"],//, "qiearth"],
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
            let effectBase = new Decimal(1.00976)
            effect = effectBase.pow(player[this.layer].explored).add(1.75)
        }
        return softcap(softcap(effect, new Decimal(50), 0.1), new Decimal(100), 0.1)
    },
    update(diff) { // Called every tick, to update the layer
        let gain = new Decimal(player[this.layer].points).times(0.24)
        gain = gain.add(buyableEffect("qiocean", 11))

        player[this.layer].exploredTotal = player[this.layer].exploredTotal.add(gain.times(diff))
        player[this.layer].exploredGain = gain
        player[this.layer].explored = player[this.layer].exploredTotal.pow(0.463)
    },
    buyables: {
        11: {
            title: "Delve Deeper",
            cost(x) {
                let base = new Decimal(1.81)

                return base.pow(x).floor()
            },
            effect(x) {
                if (!x || x.lte(0.0)) return new Decimal(0)
                let effect = x.add(1).pow(2)
                return effect
            },
            display(x) {
                let data = tmp[this.layer].buyables[this.id]
                return "Explore the depths of your Qi Ocean.\n\
                Cost: " + format(data.cost) + " Ocean Qi\n\
                Amount: " + player[this.layer].buyables[this.id] + " of " + format(this.purchaseLimit) + "\n\
                Currently: +" + format(data.effect) + " explore power.\n"
            },
            canAfford() { return player.qiocean.points.gte(this.cost(player[this.layer].buyables[this.id])) },
            buy() {
                player.qiocean.points = player.qiocean.points.sub(this.cost(player[this.layer].buyables[this.id]))
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            unlocked() { return true },
            style: { 'height': '222px' },
            purchaseLimit: new Decimal(20),
        },
    },
    upgrades: {
        11: {
            title: "Plankton",
            description: "Increase life force gain by fathoms explored",
            cost: new Decimal(5),
            unlocked() { return true },
            effect() {
                return softcap(player.qiocean.explored.add(1).ln().times(176.5).add(16.49), new Decimal(5e3), 0.5)
            },
            effectDisplay() {
                return format(this.effect()) + "x"
            },
        },
        21: {
            title: "Coral",
            description: "Increase droplet gain by fathoms explored",
            cost: new Decimal(10),
            unlocked() { return true },
            effect() {
                return softcap(player.qiocean.explored.add(1).log10().times(136.5).add(16.49), new Decimal(5e2), 0.5)
            },
            effectDisplay() {
                return format(this.effect()) + "x"
            },
        },
        31: {
            title: "Fish",
            description: "Increase Ocean Qi by droplets of mana",
            cost: new Decimal(150),
            unlocked() { return true },
            effect() {
                return softcap(player.d.points.add(1).log10().times(0.13).add(1.00), new Decimal(5.0), 0.5)
            },
            effectDisplay() {
                return format(this.effect()) + "x"
            },
        },
        41: {
            title: "Man",
            description: "Ocean Qi increases gain of droplets of mana",
            cost: new Decimal(150),
            unlocked() { return true },
            effect() {
                return softcap(player.qiocean.points.add(1).log10().times(0.348).add(2.00), new Decimal(5.0), 0.5)
            },
            effectDisplay() {
                return format(this.effect()) + "x"
            },
        },
    },
})