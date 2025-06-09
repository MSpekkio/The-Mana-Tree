var layoutInfo = {
    startTab: "none",
    startNavTab: "tree-tab",
    showTree: true,

    treeLayout: ""


}


// A "ghost" layer which offsets other layers in the tree
addNode("blank1", {
    layerShown: "ghost",
    position: 3,
    row: 0
},
)


addLayer("tree-tab", {
    tabFormat: [["tree", function () { return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS) }]],
    previousTab: "",
    leftTab: true,
})