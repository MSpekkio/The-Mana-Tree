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
        let mult = new Decimal(1)
        if (hasUpgrade("d", 13)) mult = mult.times(upgradeEffect("d", 13))
        if (hasUpgrade("d", 23)) mult = mult.times(upgradeEffect("d", 23))
        if (hasUpgrade("d", 32)) mult = mult.times(upgradeEffect("d", 32))

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        return exp
    },
    directMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasUpgrade("d", 14)) mult = mult.times(upgradeEffect("d", 14).gain)
        if (hasUpgrade("d", 24)) mult = mult.times(upgradeEffect("d", 24).gain)
        return mult
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "d", description: "D: Reset for droplets of mana", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){ return player.points.gte(5) || player.a.achievements.includes("11") }, // Show the layer if you have at least 5 point
    upgrades: {
        11: {
            title: "Take a deep breath",
            description: "Refine your breathing to increase mana gain.",
            cost: new Decimal(2),
            unlocked() { return true},
            effect() { 
                let effect = new Decimal(2.00 + hasUpgrade(this.layer, "12")
                                               + hasUpgrade(this.layer, "13")
                                               + hasUpgrade(this.layer, "14"))

                if (hasUpgrade("d", 21)) {
                    effect = effect.add(new Decimal(2.00 
                                               + hasUpgrade(this.layer, "22")
                                               + hasUpgrade(this.layer, "23")
                                               + hasUpgrade(this.layer, "24")))
                }

                if (hasUpgrade("d", 34)) effect = effect.times(2)
                return effect},
            effectDisplay() { return "+"+format(this.effect()) },
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
            description: "Each droplet you form increases droplet gain by 1%.",
            cost: new Decimal(10),
            unlocked() { return true },
            effect() { 
                let effect = new Decimal(0.01).times(player[this.layer].total).add(1)
                return softcap(softcap(effect, new Decimal(2.5), 0.3), new Decimal(10.0), 0.3)
            },
            effectDisplay() { return format(this.effect())+"x" }
        },
        14: {
            title: "Deep Breathing I",
            description: "Increase droplet cost by 90%, but double gain.",
            cost: new Decimal(15),
            unlocked() { return true },
            effect() { return { cost: new Decimal(1.90), gain: new Decimal(2.0) } },
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
        //unlocked by Wandering Sage I
        21: {
            title: "Take a deeper breath",
            description: "Refine your breathing to increase mana gain.",
            cost: new Decimal(50),
            unlocked() { return hasUpgrade("t", "11") },
        },
        22: {
            title: "Efficient Breathing II",
            description: "Reduce the mana cost of droplets by another 10%.",
            cost: new Decimal(100),
            unlocked() { return hasUpgrade("t", "11") },
            effect() { return new Decimal(1.10) },
        },
        23: {
            title: "Rythmic Breathing II",
            description: "Increases droplet gain based on mana.",
            cost: new Decimal(200),
            unlocked() { return hasUpgrade("t", "11") },
            effect() {
                let effect = new Decimal(player.points).add(1).log10().times(0.13).add(1)
                return softcap(softcap(effect, new Decimal(2.5), new Decimal(0.3)), new Decimal(10.0), 0.3)
            },
            effectDisplay() { return format(this.effect())+"x" }
        },
        24: {
            title: "Deep Breathing II",
            description: "Increases droplet cost by 90%, but quaduple gain again.",
            cost: new Decimal(400),
            unlocked() { return hasUpgrade("t", "11") },
            effect() { return { cost: new Decimal(1.90), gain: new Decimal(4.0) } },
        },
        25: {
            title: "Breathing isn't enough",
            description: "Unlock new Travel upgrades.",
            cost: new Decimal(800),
            unlocked() { return hasUpgrade("d", "24") },
        },
        //unlocked by Wandering Sage II
        31: {
            title: "Body of mana",
            description: "Increase droplet gain by droplets.",
            cost: new Decimal(1500),
            unlocked() { return hasUpgrade("t", "21") },
            effect() { 
                let effect = player[this.layer].points.add(1).log10().times(0.22).add(1)
                return softcap(effect, new Decimal(5.0), new Decimal(0.3))
            },
            effectDisplay() { return format(this.effect())+"x" }
        },
        32: {
            title: "Mind of mana",
            description: "Increase mana cap by droplets.",
            cost: new Decimal(5000),
            unlocked() { return hasUpgrade("t", "21") },
            effect() { 
                let effect = player[this.layer].points.add(1).log10().times(0.92).add(1)
                return softcap(effect, new Decimal(5.0), new Decimal(0.3))
            },
            effectDisplay() { return format(this.effect())+"x" }
        },
        33: {
            title: "Spirit of mana",
            description: "Increase main gain by droplets.",
            cost: new Decimal(8000),
            unlocked() { return hasUpgrade("t", "21") },
            effect() { 
                let effect = player[this.layer].points.add(1).log10().times(0.13).add(1)
                return softcap(effect, new Decimal(5.0), new Decimal(0.3))
            },
            effectDisplay() { return format(this.effect())+"x" }
        },
        34: {
            title: "Soul of mana",
            description: "Double deep breath effect.",
            cost: new Decimal(15000),
            unlocked() { return hasUpgrade("t", "21") },
        },
        35: {
            title: "Core of mana",
            description: "Unlock your Core",
            cost: new Decimal(50000),
            unlocked() { return hasUpgrade("t", "21") },
            onPurchased() {
                player.t.unlocked = true
            },
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
        let req = new Decimal(80)
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "spirit stone", // Name of prestige currency
    baseResource: "mana", // Name of resource prestige is based on
    row: 0,
    resetsNothing: true,
    branches: ["d"], // This layer is a branch of the drops layer
    clickables:
    {
        11: {
            title: "Spirit Stone",
            cost: new Decimal(80),
            amount: new Decimal(1),
            display() { return "Purchase a spirit stone.<br>Cost: "+format(this.cost)+" mana" },
            canClick() { return player.points.gte(this.cost) },
            onClick() {
                let cost = this.cost
                if (player.points.gte(cost)) {
                    player.points = player.points.sub(cost)
                    player[this.layer].points = player[this.layer].points.add(this.amount)
                    player[this.layer].total = player[this.layer].points.add(this.amount)
                }
            },
        },
        12: {
            title: "Spirit Stone x5",
            cost: new Decimal(400),
            amount: new Decimal(5),
            display() { return "Purchase ten spirit stones.<br>Cost: "+format(this.cost)+" mana" },
            unlocked() { return hasUpgrade("d", "25") },
            canClick() { return player.points.gte(this.cost) },
            onClick() {
                let cost = this.cost
                if (player.points.gte(cost)) {
                    player.points = player.points.sub(cost)
                    player[this.layer].points = player[this.layer].points.add(this.amount)
                    player[this.layer].total = player[this.layer].points.add(this.amount)
                }
            },
        },
    },
    upgrades: {
        11: {
            title: "Wisdom from a traveler I",
            description: "New breathing techniques allow more mana, more upgrades.",
            cost() { return new Decimal(3).pow(player[this.layer].upgrades.length) },
            effect() { return new Decimal(5.0) },
            effectDisplay() { return format(this.effect())+"x mana cap" },
            unlocked() { return true },
        },
        12: {
            title: "Calming Grotto",
            description: "Discover a calming grotto with increased mana gain.",
            cost() { return new Decimal(3).pow(player[this.layer].upgrades.length) },
            effect() { return new Decimal(3.0) },
            effectDisplay() { return format(this.effect())+"x mana gain" },
            unlocked() { return true },
        },
        13: {
            title: "Resonance Stone",
            description: "Increase mana gain by 1% per spirit stone.",
            cost() { return new Decimal(3).pow(player[this.layer].upgrades.length) },
            effect() {
                let effect = new Decimal(0.01).times(player[this.layer].points).add(1)
                return softcap(effect, new Decimal(2.5), 0.3)
             },
            effectDisplay() { return format(this.effect())+"x mana gain" },
            unlocked() { return true },
        },
        21: {
            title: "Wisdom from a traveler II",
            description: "Unlock more mana and more upgrades.",
            cost() { return new Decimal(3).pow(player[this.layer].upgrades.length) },
            effect() { return new Decimal(6.0) },
            effectDisplay() { return format(this.effect())+"x mana cap" },
            unlocked() { return hasUpgrade("d", "25") || player.c.milestones.includes("0") },
        },
        22: {
            title: "Climb a mountain",
            description: "The further you go, the more you find.",
            cost() { return new Decimal(3).pow(player[this.layer].upgrades.length) },
            effect() { return new Decimal(5) },
            effectDisplay() { return format(this.effect())+"x mana gain" },
            unlocked() { return hasUpgrade("d", "25") || player.c.milestones.includes("0") },
        },
    },
    layerShown() { return hasUpgrade("d", "15") || player.a.achievements.includes("13") }, // Show the layer if you have at least 5 point
    doReset(resettingLayer) {
        if (layers[resettingLayer].row <= this.row) return;
        let keep = [];
        if (resettingLayer = "c") {
            if (hasMilestone("c", 0)) keep.push("upgrades");
        }
        layerDataReset(this.layer, keep);
    }
})
addLayer("c", {
    name: "core", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🔥", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false, // Whether the layer is unlocked
		points: new Decimal(0),
        condensed: new Decimal(0),
    }},
    color: "#ed07e5",
    requires() {
        let req = new Decimal(100000)
        return req
    }, // Can be a function that takes requirement increases into account
    effect() { return new Decimal(2).pow(player[this.layer].points) },
    effectDescription() { return "which multiplies mana gain and cap by "+format(this.effect()) },
    resource: "core layers", // Name of prestige currency
    baseResource: "droplets of mana", // Name of resource prestige is based on
    baseAmount() {return player.d.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
    base: 0.5,
    row: 1, // Row the layer is in on the tree (0 is the first row)
    branches: ["d"], // This layer is a branch of the drops layer
    layerShown(){ return hasUpgrade("d", 35) || player.a.achievements.includes("15") }, // Show the layer if you have at least 5 point
    milestones: {
        0: {
            requirementDescription: "1 core layer",
            effectDescription: "Keep all travel upgrades on reset.",
            done() { return player[this.layer].points.gte(1) },
            effect() { return new Decimal(1) },
            unlocked() { return true },
        },
        1: {
            requirementDescription: "2 core layers",
            effectDescription: "Unlock Condensed Mana. Not Implemented yet.",
            done() { return player[this.layer].points.gte(2) },
            effect() { return new Decimal(1) },
            unlocked() { return true },
        },
    },
})