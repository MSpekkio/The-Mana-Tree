addLayer("d", {
    name: "drops", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "💧", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false, // Whether the layer is unlocked
		points: new Decimal(0),
    }},
    color: "#aec8f2",
    requires() {
        let req = new Decimal(10)
        if (hasUpgrade("d", 12)) req = req.div(upgradeEffect("d", 12))
        if (hasUpgrade("d", 14)) req = req.times(upgradeEffect("d", 14).cost)
        if (hasUpgrade("d", 22)) req = req.div(upgradeEffect("d", 22))
        if (hasUpgrade("d", 24)) req = req.times(upgradeEffect("d", 24).cost)
         return req
    }, // Can be a function that takes requirement increases into account
    resource: "droplets of mana", // Name of prestige currency
    baseResource: "mana", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("d", 13)) mult = mult.times(upgradeEffect("d", 13))

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    directMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("d", 14)) mult = mult.times(upgradeEffect("d", 14).gain)
        if (hasUpgrade("d", 24)) mult = mult.times(upgradeEffect("d", 24).gain)
        return mult
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "d", description: "D: Reset for droplets of mana", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.points.gte(5) || player.d.points.gte(1) || hasUpgrade(this.layer, "11") }, // Show the layer if you have at least 10 point
    upgrades: {
        11: {
            title: "Take a breath",
            description: "Refine your breathing to increase mana gain.",
            cost: new Decimal(2),
            unlocked() { return true},
            effect() { return new Decimal(2.00 + hasUpgrade(this.layer, "12")
                                               + hasUpgrade(this.layer, "13")
                                               + hasUpgrade(this.layer, "14")) },
            effectDisplay() { return format(this.effect())+"x" }
        },
        12: {
            title: "Efficient Breathing I",
            description: "Reduce the mana cost of droplets by 10%.",
            cost: new Decimal(5),
            unlocked() { return true },
            effect() { return new Decimal(1.10) },
        },
        13: {
            title: "Rythmic Breathing I",
            description: "Each droplet you form increases mana gain by 1%.",
            cost: new Decimal(10),
            unlocked() { return true },
            effect() { return softcap(new Decimal(1.0).add(new Decimal(0.01).times(player[this.layer].total)), new Decimal(1.5), 0.3) },
            effectDisplay() { return format(this.effect())+"x" }
        },
        14: {
            title: "Deep Breathing I",
            description: "Increase droplet cost by 60%, but double gain.",
            cost: new Decimal(15),
            unlocked() { return true },
            effect() { return { cost: new Decimal(1.60), gain: new Decimal(2.0) } },
        },
        15: {
            title: "Look for a better way",
            description: "Unlock Travel.",
            cost: new Decimal(35),
            unlocked() { return hasUpgrade(this.layer, "14") },
            onPurchased() {
                player.t.unlocked = true
            },
        },
        //unlocked by Wandering Sage
        21: {
            title: "Take a deeper breath",
            description: "Refine your breathing to increase mana gain.",
            cost: new Decimal(50),
            unlocked() { return hasUpgrade("t", "11") },
            effect() { return new Decimal(2.00 + hasUpgrade(this.layer, "22")
                                               + hasUpgrade(this.layer, "23")
                                               + hasUpgrade(this.layer, "24")) },
            effectDisplay() { return format(this.effect())+"x" }
        },
        22: {
            title: "Efficient Breathing II",
            description: "Reduce the mana cost of droplets by another 10%.",
            cost: new Decimal(250),
            unlocked() { return hasUpgrade("t", "11") },
            effect() { return new Decimal(1.10) },
        },
        23: {
            title: "Rythmic Breathing II",
            description: "Increases droplet gain based on mana gain.",
            cost: new Decimal(500),
            unlocked() { return hasUpgrade("t", "11") },
            effect() {
                effect = new Decimal(tmp.pointGen).log10().times(2.47)
                return softcap(effect, new Decimal(10.0, new Decimal(0.5)))
            },
            effectDisplay() { return format(this.effect())+"x" }
        },
        24: {
            title: "Deep Breathing II",
            description: "Increases droplet cost by 60%, but quaduple gain again.",
            cost: new Decimal(1000),
            unlocked() { return hasUpgrade("t", "11") },
            effect() { return { cost: new Decimal(1.60), gain: new Decimal(4.0) } },
        },
        25: {
            title: "Breathing isn't enough",
            description: "Find new things in your travels.",
            cost: new Decimal(2500),
            unlocked() { return hasUpgrade("d", "24") },
        },
    }
})
addLayer("t", {
    name: "travel", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🚶🏼‍♂️", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    type: "none",
    startData() { return {
        unlocked: false, // Whether the layer is unlocked
        points: new Decimal(0),
    }},
    color: "#f2c8ae",
    requires() {
        let req = new Decimal(100)
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "spirit stone", // Name of prestige currency
    baseResource: "mana", // Name of resource prestige is based on
    row: 0,
    base: 5,
    exponent: 0.5,
    resetsNothing: true,
    clickables:
    {
        11: {
            title: "Spirit Stone",
            display() { return "Purchase a spirit stone.<br>Cost: "+format(new Decimal(100))+" mana" },
            canClick() { return player.points.gte(new Decimal(100)) },
            onClick() {
                let cost = new Decimal(100)
                if (player.points.gte(cost)) {
                    player.points = player.points.sub(cost)
                    player[this.layer].points = player[this.layer].points.add(new Decimal(1))
                    player[this.layer].total = player[this.layer].points.add(new Decimal(1))
                }
            },
        },
        12: {
            title: "Spirit Stone x10",
            display() { return "Purchase ten spirit stones.<br>Cost: "+format(new Decimal(1000))+" mana" },
            unlocked() { return hasUpgrade("d", "25") },
            canClick() { return player.points.gte(new Decimal(1000)) },
            onClick() {
                let cost = new Decimal(1000)
                if (player.points.gte(cost)) {
                    player.points = player.points.sub(cost)
                    player[this.layer].points = player[this.layer].points.add(new Decimal(10))
                    player[this.layer].total = player[this.layer].points.add(new Decimal(10))
                }
            },
        },
    },
    upgrades: {
        11: {
            title: "Wisdom from a traveler I",
            description: "Unlock new breathing techniques for forming droplets.",
            cost() { return new Decimal(5).pow(player[this.layer].upgrades.length) },
            unlocked() { return true },
        },
        12: {
            title: "Calming Grotto",
            description: "Discover a calming grotto with increased mana gain.",
            cost() { return new Decimal(5).pow(player[this.layer].upgrades.length) },
            effect() { return new Decimal(10.0) },
            effectDisplay() { return format(this.effect())+"x" },
            unlocked() { return true },
        },
        21: {
            title: "Wisdom from a traveler II",
            description: "Meditation is more than just breathing.",
            cost() { return new Decimal(10).pow(player[this.layer].upgrades.length) },
            unlocked() { return hasUpgrade("d", "25") },
        },
    },
    layerShown() { return hasUpgrade("d", "15") },
})