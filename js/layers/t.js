addLayer("t", {
    name: "travel", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🚶🏼‍", // This appears on the layer's node. Default is the id with the first letter capitalized
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
            display() { return "Purchase five spirit stones.<br>Cost: "+format(this.cost)+" mana" },
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
        13: {
            title: "Spirit Stone x10",
            cost: new Decimal(800),
            amount: new Decimal(10),
            display() { return "Purchase ten spirit stones.<br>Cost: " + format(this.cost) + " mana" },
            unlocked() { return player.c.milestones.includes("1") },
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
        31: {
            title: "Body Tempering Manual",
            description: "Explains the 'Five Fiery Demon Hounds' method",
            cost()
            {
                let cost = new Decimal(150)
                if (hasUpgrade("t", "32")) cost = cost.times(2)
                if (hasUpgrade("t", "33")) cost = cost.times(2)
                return new Decimal(150)
            },
            unlocked() { player.c.milestones.includes("1") },
        },
        32: {
            title: "Body Tempering Manual",
            description: "Explains the 'Placid Lake, Sun and Moon Reflected' method",
            cost() {
                let cost = new Decimal(150)
                if (hasUpgrade("t", "31")) cost = cost.times(2)
                if (hasUpgrade("t", "33")) cost = cost.times(2)
                return new Decimal(150)
            },
            unlocked() { player.c.milestones.includes("1") },
        },
        33: {
            title: "Body Tempering Manual",
            description: "Explains the method of 'Jin Ro, the Blood Flower'",
            cost() {
                let cost = new Decimal(150)
                if (hasUpgrade("t", "31")) cost = cost.times(2)
                if (hasUpgrade("t", "32")) cost = cost.times(2)
                return new Decimal(150)
            },
            unlocked() { player.c.milestones.includes("1") },
        },
    },
    layerShown() { return hasUpgrade("d", "15") || player.a.achievements.includes("13") },
    doReset(resettingLayer) {
        if (layers[resettingLayer].row <= this.row) return;
        let keep = [];
        if (hasMilestone("c", 0) && layers[resettingLayer].row == player.c.row) { //core, body, meridans
            keep.push("upgrades");
        }
        layerDataReset(this.layer, keep);
    }
})