addLayer("m", {
    name: "merdians", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🌊", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false, // Whether the layer is unlocked
		points: new Decimal(0),
    }},
    color: "#023b96",
    requires() {
        let req = new Decimal(20000000)
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "meridian ★", // Name of prestige currency
    baseResource: "droplets of mana", // Name of resource prestige is based on
    baseAmount() {return player.d.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75, // Prestige currency exponent
    base: 0.5,
    row: 2, // Row the layer is in on the tree (0 is the first row)
    branches: ["b"], // This layer is a branch of the drops layer
    layerShown() { return hasMilestone("c", 2) || player.a.achievements.includes(20) },
    canReset() {
        if (player[this.layer].points.lt(10)) {
            return tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt)
        }
        return false;
    },
    getResetGain() {
        if (player[this.layer].points.lt(10)) return getResetGain(this.layer, useType = "static")
        return new Decimal(0);
    },
    getNextAt(canMax) {
        if (player[this.layer].points.lt(10)) return getNextAt(this.layer, canMax, useType = "static")
        return new Decimal(Number.POSITIVE_INFINITY);
    },
    milestones: {
        0: {
            requirementDescription: "1★ meridian",
            effectDescription: "Gain 10% of droplets per second.",
            done() { return player[this.layer].points.gte(1) },
            unlocked() { return true },
        },
        1: {
            requirementDescription: "2★ meridian",
            effectDescription: "Unlock 2 Meridian Buyables",
            done() { return player[this.layer].points.gte(2) },
            unlocked() { return true },
        },
    },
    buyables: {
        11: {
            title: "Crystalize Mana",
            cost(x) {
                let base = new Decimal(2.632)
                let mult = new Decimal("1e5")

                return base.pow(x).mul(mult)
            },
            effect(x) {
                if (!x || x.lte(0.0)) return new Decimal(0)
                return x.add(1).pow(2).add(player.m.points)
            },
            display(x) {
                let data = tmp[this.layer].buyables[this.id]
                return "Begin crystalizaing mana around your core.\n\
                Cost: " + format(data.cost) + " droplets of mana\n\
                Amount: " + player[this.layer].buyables[this.id] + " of 100\n\
                Adds +" + format(data.effect) + " to base mana gain and capacity.\n"
            },
            canAfford() { return player.d.points.gte(this.cost(player[this.layer].buyables[this.id])) },
            buy() {
                player.d.points = player.d.points.sub(this.cost(player[this.layer].buyables[this.id]))
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            unlocked() { return hasMilestone("m", 1) },
            style: { 'height': '222px' },
            purchaseLimit: new Decimal(100),
        },
        12: {
            title: "Carve Mana Channel",
            cost(x) {
                let base = new Decimal(1.43429)
                let mult = new Decimal("1e5")

                return base.pow(x).mul(mult)
            },
            effect(x) {
                if (!x || x.lte(0.0)) return new Decimal(0)
                return x.times(10000).times(player.m.points.div(100.0).add(1))
            },
            display(x) {
                let data = tmp[this.layer].buyables[this.id]
                return "Mana channels improve mana capacity.\n\
                Cost: " + format(data.cost) + " droplets of mana\n\
                Amount: " + player[this.layer].buyables[this.id] + " of 100\n\
                Adds +" + format(data.effect) + " to mana capacity.\n"
            },
            canAfford() { return player.d.points.gte(this.cost(player[this.layer].buyables[this.id])) },
            buy() {
                player.d.points = player.d.points.sub(this.cost(player[this.layer].buyables[this.id]))
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            unlocked() { return hasMilestone("m", 1) },
            style: { 'height': '222px' },
            purchaseLimit: new Decimal(100),
        },
    },
})