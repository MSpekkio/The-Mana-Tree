let modInfo = {
	name: "The Mana Tree",
	author: "MSpekkio",
	pointsName: "mana",
	modFiles: ["layers/t.js", "layers/d.js", "layers/c.js", "layers/b.js", "layers/achievements.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal(0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "The bare minimum",
}
// If you change anything in the game, make sure to keep it up to date
let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1</h3><br>
		- 3 layers.<br>
		- 20 upgrades.<br>
		- 5 achievements.<br>
		- 2 milestones.<br>
		- self-doubt.<br>
	<h3>v0.0</h3><br>
		- We all start life at zero.<br>`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = []

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	//add
	if (hasUpgrade("d", 11)) gain = gain.add(upgradeEffect("d", 11))
	//mult
	if (hasUpgrade("t", 12)) gain = gain.times(upgradeEffect("t", 12))
	if (hasUpgrade("t", 13)) gain = gain.times(upgradeEffect("t", 13))
	if (hasUpgrade("t", 22)) gain = gain.times(upgradeEffect("t", 22))
	if (hasUpgrade("d", 33)) gain = gain.times(upgradeEffect("d", 33))
	if (player.c.points.gte(1)) gain = gain.times(tmp.c.effect)
    if (hasUpgrade("b", 21)) gain = gain.times(upgradeEffect("b", 21))
	

	let cap = new Decimal(100)
	if (hasUpgrade("t", 11)) cap = cap.times(upgradeEffect("t", 11))
	if (hasUpgrade("t", 21)) cap = cap.times(upgradeEffect("t", 21))
	if (hasUpgrade("d", 31)) cap = cap.times(upgradeEffect("d", 31))
    if (hasUpgrade("b", 13)) cap = cap.times(upgradeEffect("b", 13))
	if (hasUpgrade("b", 31)) cap = cap.times(upgradeEffect("b", 31))
	cap = cap.times(tmp.c.effect)
	player.manaCap = cap

	if (player.points.gte(cap))	{
		//1 / (x / 100)^3
		let reduction = player.points.div(cap).pow(3)
		if (reduction.lte(1)) reduction = new Decimal(1)
		gain = gain.div(reduction)
		if (gain.lte(0)) gain = new Decimal(0)
	}

	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	manaCap: new Decimal(100), // Default mana cap
}}

// Display extra things at the top of the page
var displayThings = [
	() => `Mana gain is reduced above ${format(player.manaCap)} mana`
 ]

// Determines when the game "ends"
function isEndgame() {
	return player.c.points.gte(new Decimal("2"))
}

// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}