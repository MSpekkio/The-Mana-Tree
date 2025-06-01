addLayer("b", {
    name: "body", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "💪", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false, // Whether the layer is unlocked
            points: new Decimal(0),
            lifeForce: new Decimal(0),
        }
    },
    color: "#f2f2ae",
    requires() { return new Decimal(100000) }, // Can be a function that takes requirement increases into account
    effect() {
        if (player[this.layer].points.lt(1)) return new Decimal(0)
        let gain = new Decimal(2).pow(player[this.layer].points.sub(1))
        if (hasUpgrade("b", 11)) gain = gain.times(upgradeEffect("b", 11))
        if (hasUpgrade("b", 12)) gain = gain.times(upgradeEffect("b", 12))
        if (hasUpgrade("b", 13)) gain = gain.times(upgradeEffect("b", 13))
        if (hasUpgrade("b", 32)) gain = gain.pow(upgradeEffect("b", 32))

        return gain
    },
    effectDescription() {
        return "which increases the core effect by +" + format(player.b.points) + " and " + format(player.b.lifeForce) + " total life force (+" + format(this.effect()) + " per second)"
    },
    update(diff) { // Called every tick, to update the layer
        if (player[this.layer].points.gte(1)) {
            let gain = this.effect()

            player[this.layer].lifeForce = player[this.layer].lifeForce.add(gain.times(diff))
        }
    },
    resource: "body ★", // Name of prestige currency
    baseResource: "droplets of mana", // Name of resource prestige is based on
    baseAmount() { return player.d.points }, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.85, // Prestige currency exponent
    base: 0.5, // Base for the cost calculation
    row: 1, // Row the layer is in on the tree (0 is the first row)
    branches: ["c"], // This layer is a branch of the core layer
    layerShown() { return player.c.milestones.includes("1") || player.a.achievements.includes("16") }, // Show the layer if you have at least 5 point
    doReset(resettingLayer) { // What happens when you reset this layer)
        if (layers[resettingLayer].row == this.row) this.lifeForce = new Decimal(0)
        if (layers[resettingLayer].row <= this.row) return
        
        doLayerReset(this.layer, resettingLayer)
    },
    milestones: {
        0: {
            requirementDescription: "1★ body",
            effectDescription: "Unlock new Travel upgrades.",
            done() { return player[this.layer].points.gte(1) },
            unlocked() { return true },
        },
    },
    upgrades: {
        11: {
            title: "Exercise",
            description: "Increase life force gain by mana",
            cost() { return new Decimal(100) },
            currencyDisplayName: "life force",
            currencyInternalName: "lifeForce",
            currencyLayer: "b",
            effect() {
                let effect = player.points.add(1).log10().times(0.06).add(1)
                return softcap(effect, new Decimal(5.0), 0.3)
            },
            effectDisplay() { return format(this.effect()) + "x life force" },
            unlocked() { return true },
        },
        12: {
            title: "Weight Training",
            description: "Increase life force gain by ★s.",
            cost() { return new Decimal(200) },
            currencyDisplayName: "life force",
            currencyInternalName: "lifeForce",
            currencyLayer: "b",
            effect() {
                let effectivepoints = player[this.layer].points
                if (hasUpgrade("b", 51)) effectivepoints = effectivepoints.times(2)

                let effect = player.c.points.add(effectivepoints)
                return effect
            },
            effectDisplay() { return "+" + format(this.effect()) + " life force gain" },
            unlocked() { return true },
        },
        13: {
            title: "Sparring",
            description: "Increase life force gain by droplets",
            cost() { return new Decimal(300) },
            currencyDisplayName: "life force",
            currencyInternalName: "lifeForce",
            currencyLayer: "b",
            effect() {
                let effect = player.points.add(1).log10().times(0.07).add(1)
                return softcap(effect, new Decimal(5.0), 0.3)
            },
            effectDisplay() { return format(this.effect()) + "x life force" },
            unlocked() { return true },
        },
        //Five Fiery Demon Hounds method
        21: {
            title: "Bed of hot coals",
            description: "Increase mana gain by 3% per body ★.",
            cost() { return new Decimal(500) },
            currencyDisplayName: "life force",
            currencyInternalName: "lifeForce",
            currencyLayer: "b",
            effect() {
                let effectivepoints = player[this.layer].points
                if (hasUpgrade("b", 51)) effectivepoints = effectivepoints.times(2)

                let effect = new Decimal(0.03).times(effectivepoints).add(1)
                return softcap(effect, new Decimal(2.5), 0.3)
            },
            effectDisplay() { return format(this.effect()) + "x mana gain" },
            unlocked() { return hasUpgrade("t", 31) },
        },
        22: {
            title: "Consume Salamander Blood",
            description: "Increase 'Body of Mana' base effect by +0.02.",
            cost() { return new Decimal(5000) },
            currencyDisplayName: "life force",
            currencyInternalName: "lifeForce",
            currencyLayer: "b",
            effect() {
                return new Decimal(0.02)
            },
            unlocked() { return hasUpgrade("t", 31) },
        },
        23: {
            title: "Demon Hound Dance",
            description: "Increase 'Soul of Mana' effect by +0.20.",
            cost() { return new Decimal(50000) },
            currencyDisplayName: "life force",
            currencyInternalName: "lifeForce",
            currencyLayer: "b",
            effect() {
                return new Decimal(0.20)
            },
            unlocked() { return hasUpgrade("t", 31) },
        },
        //Placid Lake, Sun and Moon Reflected method
        31: {
            title: "Mediate in a freezing lake",
            description: "Increase mana cap by 1% per body ★.",
            cost() { return new Decimal(600) },
            currencyDisplayName: "life force",
            currencyInternalName: "lifeForce",
            currencyLayer: "b",
            effect() {
                let effectivepoints = player[this.layer].points
                if (hasUpgrade("b", 51)) effectivepoints = effectivepoints.times(2)

                let effect = new Decimal(0.01).times(effectivepoints).add(1)
                return softcap(effect, new Decimal(2.5), 0.3)
            },
            effectDisplay() { return format(this.effect()) + "x mana cap" },
            unlocked() { return hasUpgrade("t", 32) },
        },
        32: {
            title: "Let the Light in",
            description: "Raise life force gain by ^1.05.",
            cost() { return new Decimal(6000) },
            currencyDisplayName: "life force",
            currencyInternalName: "lifeForce",
            currencyLayer: "b",
            effect() {
                return new Decimal(1.05)
            },
            unlocked() { return hasUpgrade("t", 32) },
        },
        33: {
            title: "Drown in the Moon",
            description: "Raise 'Mind of Mana' effect by +0.56 and increase the soft cap.",
            cost() { return new Decimal(60000) },
            currencyDisplayName: "life force",
            currencyInternalName: "lifeForce",
            currencyLayer: "b",
            effect() {
                return new Decimal(0.15)
            },
            unlocked() { return hasUpgrade("t", 32) },
        },
        //Jin Ro, the Blood Flower
        41: {
            title: "Planting the brush",
            description: "Increase droplet gain by 3% per body ★.",
            cost() { return new Decimal(700) },
            currencyDisplayName: "life force",
            currencyInternalName: "lifeForce",
            currencyLayer: "b",
            effect() {
                let effectivepoints = player[this.layer].points
                if (hasUpgrade("b", 51)) effectivepoints = effectivepoints.times(2)

                let effect = new Decimal(0.03).times(effectivepoints).add(1)
                return softcap(effect, new Decimal(2.5), 0.3)
            },
            effectDisplay() { return format(this.effect()) + "x droplet gain" },
            unlocked() { return hasUpgrade("t", 33) },
        },
        42: {
            title: "Cultivate the canvas",
            description: "Increase 'Spirit of Mana' effect by +0.13.",
            cost() { return new Decimal(7000) },
            currencyDisplayName: "life force",
            currencyInternalName: "lifeForce",
            currencyLayer: "b",
            effect() {
                return new Decimal(0.13)
            },
            unlocked() { return hasUpgrade("t", 33) },
        },
        43: {
            title: "Harvest the portrait",
            description: "Increase droplet gain by life force.",
            cost() { return new Decimal(70000) },
            currencyDisplayName: "life force",
            currencyInternalName: "lifeForce",
            currencyLayer: "b",
            effect() {
                let effect = player.b.lifeForce.add(1).log10().times(0.05).add(1)
                return softcap(effect, new Decimal(5.0), 0.3)
            },
            effectDisplay() { return format(this.effect()) + "x droplet gain" },
            unlocked() { return hasUpgrade("t", 33) },
        },
        51: {
            title: "Synthesis",
            description: "Double effective body ★'s for other upgrades.",
            cost() { return new Decimal(500000) },
            currencyDisplayName: "life force",
            currencyInternalName: "lifeForce",
            currencyLayer: "b",
            effect() {
                let effect = new Decimal(2.0)
                return effect
            },
            unlocked() { return hasUpgrade("b", 23) && hasUpgrade("b", 33) && hasUpgrade("b", 43) },
        },
        51: {
            title: "Innovate",
            description: "Increase mana gain by life force.",
            cost() { return new Decimal(500000) },
            currencyDisplayName: "life force",
            currencyInternalName: "lifeForce",
            currencyLayer: "b",
            effect() {
                let effect = player.b.lifeForce.add(1).log10().times(0.045).add(1)
                return softcap(effect, new Decimal(5.0), 0.3)
            },
            effectDisplay() { return format(this.effect()) + "x mana gain" },
            unlocked() { return hasUpgrade("b", 23) && hasUpgrade("b", 33) && hasUpgrade("b", 43) },
        },

    }
})