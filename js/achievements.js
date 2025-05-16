addLayer("a", {
    name: "achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true, // Whether the layer is unlocked
		//points: new Decimal(0),
    }},
    color: "#848d94",
    row: "side", // Row the layer is in on the tree (0 is the first row)
    type: "none",
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    layerShown(){return true }, // Show the layer if you have at least 1 point
    achievements: {
        11: {
            name: "First Steps",
            done() { return player.points.gte(10) },
            tooltip: "You have taken your first steps into the world of mana.",
            unlocked() { return true }
        },
        12: {
            name: "A Drop in the Bucket",
            done() { return player.d.points.gte(1) },
            tooltip: "You have collected your first droplet of mana.",
            unlocked() { return true }
        },
        

    }
})