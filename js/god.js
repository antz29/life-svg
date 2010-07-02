$(function() {
	var world = new life.World(900,600);
	
	var ichi = function(name,color)
	{
		var that = world.newObject();
		var bumped = false;
		
		that.setName(name);
		that.setSpeed(2);
		that.setMovement({ x : -1,y : -1 });
		
		that.setBounds({
			tl : {x:13, y:13},
			t : {x:50, y:-2},
			tr : {x:87, y:13},
			r : {x:102, y:50}, 
			br : {x:87, y:87},
			b : {x:50, y:102},
			bl : {x:13, y:87},
			l : {x:-2, y:50}
		});
		
		var color = color;
		
		return $.extend({},that,{
			render : function(r) {
				var col = 'rgb('+color.join(',')+')';
				r.shape('arc',{center:{x:50,y:50},radius:50,start:0,end:360},{fillStyle:col},true,true);
			},
			tick : function() {
				that.tick();
			},
			getColor : function() {
				return color;
			},
			setColor : function(new_color) {
				color = new_color;
			},
			bumps : function(obj,dir) {
				if (bumped) return;
				bumped = true;
				setTimeout(function() {
					bumped = false;
				},50);
				
				if (obj !== 'wall') {
					if (obj.getColor) {
						var col = obj.getColor(); 
						obj.setColor(this.getColor());
						this.setColor(col);
					}
				}
				
				switch (dir) {
					case 'tl':
						that.setMovement({ x : 1,y : 1 });
						break;
					case 't':
						that.setMovement({ x : 0,y : 1 });
						break;
					case 'tr':
						that.setMovement({ x : -1,y : 1 });
						break;
					case 'r':
						that.setMovement({ x : -1,y : 0 });
						break;
					case 'br':
						that.setMovement({ x : -1,y : -1 });
						break;
					case 'b':
						that.setMovement({ x : 0,y : -1 });
						break;
					case 'bl':
						that.setMovement({ x : 1,y : -1 });
						break;
					case 'l':
						that.setMovement({ x : 1,y : 0 });
						break;
				}
			}
		});
	};
	
	var ichi2 = function(name,color)
	{
		var that = new ichi(name,color);
		
		that.setSpeed(3);
		
		that.setBounds({
			tl : {x:-5, y:0},
			t : {x:25, y:0},
			tr : {x:55, y:0},
			r : {x:50, y:25}, 
			br : {x:55, y:50},
			b : {x:25, y:50},
			bl : {x:-5, y:50},
			l : {x:0, y:25}
		});
				
		return $.extend({},that,{
			render : function(r) {
				var col = 'rgb('+that.getColor().join(',')+')';
				r.shape('poly',{points:[{x:0,y:0},{x:50,y:0},{x:50,y:50},{x:0,y:50}]},{fillStyle:col},true,true);
				that.drawBounds(r);
			}
		});
	};
	
	var tree = function(name)
	{
		var that = world.newObject();
		
		that.setName(name);
		that.setSpeed(0);
		
		that.setBounds({
			tl : {x:13, y:13},
			t : {x:50, y:-2},
			tr : {x:87, y:13},
			r : {x:102, y:50}, 
			br : {x:87, y:87},
			b : {x:50, y:102},
			bl : {x:13, y:87},
			l : {x:-2, y:50}
		});
		
		var currentColor = name;
		
		return $.extend({},that,{
			render : function(r) {
				r.shape('arc',{center:{x:50,y:50},radius:50,start:0,end:360},{fillStyle:currentColor,strokeStyle:'#555'},true,true);
			},
			bumped : function(obj,dir) {
				var old = currentColor;
				currentColor = 'red';
				setTimeout(function() {
					currentColor = old;
				},5000)
			}
			
		});
	};
	
	//world.registerObject(new ichi('fred',[0,0,0]));
	world.registerObject(new ichi('jane',[0,0,0]));
	world.registerObject(new ichi2('mike',[0,0,200]));
	//world.registerObject(new ichi('paul',[0,200,0]));
	//world.registerObject(new ichi('mike',[0,20,150]));
	//world.registerObject(new ichi('alf',[200,200,0]));
	world.registerObject(new tree('green'));
	world.registerObject(new tree('pink'));
	world.registerObject(new tree('blue'));
	world.registerObject(new tree('purple'));
	
	world.start();
	
});