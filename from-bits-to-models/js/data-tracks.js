/* Categories. Colour marks which category a concept belongs to — it is the
   node's border on the map and its swatch in the legend. Edges carry no
   category of their own: every edge means the same thing, so they all look
   the same.

   The ramp runs dim to bright through the six categories. On a light page it
   has to run the other way — a white border is invisible on white — so each
   category carries both, and trackColor() picks. The ordering is the same in
   both, so a category sits in the same place on the ramp either way. */
const TRACKS = {
  found: { name:"Foundations",             color:"#6B7278", light:"#969EA5" },
  dsa:   { name:"Structures & algorithms", color:"#838B91", light:"#7F878E" },
  math:  { name:"Mathematics",             color:"#9BA3A9", light:"#697178" },
  sys:   { name:"Systems & computing",     color:"#B3BBC1", light:"#535B62" },
  ml:    { name:"Machine learning",        color:"#D2D8DC", light:"#3C444B" },
  ai:    { name:"AI in practice",          color:"#FFFFFF", light:"#16181B" }
};

function trackColor(t){
  return document.documentElement.dataset.theme === "light" ? t.light : t.color;
}
