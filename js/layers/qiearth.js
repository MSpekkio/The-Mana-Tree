addLayer("qiearth", {
    name: "Earth",
    symbol: "🦬",
    position: 2,
    startData() {
        return {
            unlocked: false,
            unlockOrder: 0,
            points: new Decimal(0),
            pointsSpent: new Decimal(0),
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
    type: "static",
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
            player[this.layer].pointsSpent = new Decimal(0)
            player[this.layer].buyables["11"] = new Decimal(0)
            player[this.layer].buyables["12"] = new Decimal(0)
            player[this.layer].buyables["21"] = new Decimal(0)
        }
        if (layers[resettingLayer].row <= this.row) return

        doLayerReset(this.layer, resettingLayer)
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                ["display-text", function () {
                    const free = player.qiearth.points.sub(player.qiearth.pointsSpent)
                    return "You have " + format(free, 0) + " free Foundation Point" + (free.gt(1) ? "s" : "") + "."
                }],
                "blank",
                "buyables",
            ]
        },
    },
    buyables: {
        showRespec: true,
        respec() { // Optional, reset things and give back your currency. Having this function makes a respec button appear
            player[this.layer].pointsSpent = new Decimal(0)
            player[this.layer].buyables["11"] = new Decimal(0)
            player[this.layer].buyables["12"] = new Decimal(0)
            player[this.layer].buyables["21"] = new Decimal(0)
            doReset(this.layer, true) // Force a reset
        },
        11: {
            title: "Earth Spirit",
            cost(x) { return new Decimal(1) },
            effect(x) {
                if (!x || x.lte(0.0)) return new Decimal(0)
                return player[this.layer].points.times(27).sqrt()
            },
            display() {
                const data = tmp[this.layer].buyables[this.id]
                return "Produce Spirit Stones based on Earth Qi.\n\
                Cost: " + format(data.cost) + " Foundation Point\n\
                Currently: +" + format(data.effect) + "/s.\n"
            },
            canAfford() {
                const free = player[this.layer].points.sub(player[this.layer].pointsSpent)
                return free.gte(this.cost(player[this.layer].buyables[this.id]))
            },
            buy() {
                const layer = player[this.layer]
                layer.pointsSpent = layer.pointsSpent.add(this.cost(layer.buyables[this.id]))
                layer.buyables[this.id] = layer.buyables[this.id].add(1)
            },
            unlocked() { return true },
            purchaseLimit: new Decimal(1),
            style: { 'height': '122px', 'width': '122px' },
        },
        12: {
            title: "Earth 2",
            cost(x) { return new Decimal(1) },
            effect(x) {
                if (!x || x.lte(0.0)) return new Decimal(1.00)
                let effect = new Decimal(0.915).pow(x)
                return effect
            },
            display() {
                const data = tmp[this.layer].buyables[this.id]
                return "TODO.\n\
                Cost: " + format(data.cost) + " Foundation Point\n\
                Currently: +" + format(data.effect.times(100)) + "%.\n"
            },
            canAfford() {
                const free = player[this.layer].points.sub(player[this.layer].pointsSpent)
                return free.gte(this.cost(player[this.layer].buyables[this.id]))
            },
            buy() {
                const layer = player[this.layer]
                layer.pointsSpent = layer.pointsSpent.add(this.cost(layer.buyables[this.id]))
                layer.buyables[this.id] = layer.buyables[this.id].add(1)
            },
            unlocked() { return true },
            purchaseLimit: new Decimal(1),
            style: { 'height': '122px', 'width': '122px' },
        },
        21: {
            title: "Earth 3",
            cost(x) { return new Decimal(2) },
            effect(x) {
                if (!x || x.lte(0.0)) return new Decimal(1.00)
                let effect = new Decimal(0.915).pow(x)
                return effect
            },
            display() {
                const data = tmp[this.layer].buyables[this.id]
                return "TODO.\n\
                Cost: " + format(data.cost) + " Foundation Point\n\
                Currently: +" + format(data.effect.times(100)) + "%.\n"
            },
            canAfford() {
                if (getBuyableAmount(this.layer, "11").eq(0) || getBuyableAmount(this.layer, "12").eq(0))
                    return false
                const free = player[this.layer].points.sub(player[this.layer].pointsSpent)
                return free.gte(this.cost(player[this.layer].buyables[this.id]))
            },
            buy() {
                const layer = player[this.layer]
                layer.pointsSpent = layer.pointsSpent.add(this.cost(layer.buyables[this.id]))
                layer.buyables[this.id] = layer.buyables[this.id].add(1)
            },
            unlocked() { return true },
            purchaseLimit: new Decimal(1),
            style: { 'height': '122px', 'width': '122px' },
        },
    },
})