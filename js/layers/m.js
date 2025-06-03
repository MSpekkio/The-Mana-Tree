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
        let req = new Decimal(40000000)
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
    layerShown() { return false && (hasMilestone("c", 2) || player.a.achievements.includes(20)) },
    canReset() {
        if (player[this.layer].points.lt(10)) {
            return tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt)
        }
        return false;
    },
    getResetGain() {
        if (player[this.layer].points.lt(10)) getResetGain(this.layer, useType = "static")
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
            effectDescription: "Unlock Crystalized Mana",
            done() { return player[this.layer].points.gte(2) },
            unlocked() { return true },
        },
    },
    buyables: {
        11: {
            title: "Crystalize Mana",
            cost(x) {
                let base = new Decimal(10)
                let mult = new Decimal("1e7")

                return base.pow(x).mul(mult)
            },
            effect(x) { return x.add(1).pow(2) },
            display(x) {
                return "Increase base mana gain and base mana capacity.\n" + format(player[this.layer].buyables[11]) + " of 100 \n +" + format(this.effect(x))
            },
            canAfford() { return player.d.points.gte(this.cost(player[this.layer].buyables[11])) },
            buy() {
                player.d.points = player.d.points.sub(this.cost(player[this.layer].buyables[11]))
                player[this.layer].buyables[11] = player[this.layer].buyables[11].add(1)
            },
            unlocked() { return hasMilestone("m", 1) }
        },
    },
})