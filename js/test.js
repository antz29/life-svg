// Creates canvas 320 × 200 at 10, 50
var paper = Raphael(10, 50, 320, 200);

var c = paper.circle(10, 10, 10);
c.animate({cx: 20, r: 20}, 2000);
c.animate({cx: 20, r: 20}, 2000, "bounce");