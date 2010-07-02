var life = {};

life.World = function(width,height,grid_size) {
	
	if (!grid_size) var grid_size = 256;
	
	var width = Math.round(width / grid_size) * grid_size;
	var height = Math.round(height / grid_size) * grid_size;
	
	var objects = {};
	var tick_length = 25;
	var timer = false;
	
	var rap = Raphael.ninja();
	var r = rap(10,10,width,height);
	var grid = r.set();
	
	var renderGrid = function()
	{
		var grids_x = (width / grid_size);
		var grids_y = (height / grid_size);
		
		var grid_sq = r.rect(0,0,grid_size,grid_size).attr('opacity',0);
		
		var y = 0;
		var x = 0;
		
		for (y = 0;y <= grids_y;y++) 
		{
			for (x = 0;x <= grids_x;x++) 
			{				
				var new_g = grid_sq.clone();
								
				new_g.attr({
					'x' : (x * grid_size),
					'y' : (y * grid_size),
					'stroke' : "#000",
					'opacity' : 0.1
				});
				
				grid.push(new_g);
			}
		}
		
		grid_sq.remove();
	};
	
	var clock = function()
	{
		tick();
		render();
		timer = setTimeout(clock,tick_length);
	};
	
	var getObjectPosition = function(obj)
	{
		
	};
	
	var getCloseObjects = function(obj)
	{
		var grids_x = (width / grid_size);
		var grids_y = (height / grid_size);
		
		
		
	};
	
	var collisionCheck = function(obj)
	{
		
	};
	
	renderGrid();
	
	return {
		start : function()
		{
			clock();
		},
		stop : function()
		{
			clearTimeout(timer);
		},
		getGrid : function()
		{
			return grid;
		}
	};
};

life.Object = function(wrl) {
	
	var movement = {x:0,y:0};
	var age = 0;
	var name = "";
	var speed = 1;
		
	return {
		render : function(renderer) {
			
		},
		tick : function() {
			age++;
		},
		bumps : function(obj) {
			
		},
		bumped : function(obj) {
			
		},
		getAge : function() {
			return age;
		},
		getMovement : function() {
			return movement;
		},
		setMovement : function(mov) {
			if (mov.x > 1) mov.x = 1;
			if (mov.y > 1) mov.y = 1;
			if (mov.x < -1) mov.x = -1;
			if (mov.y < -1) mov.y = -1;
			
			movement = mov;
		},
		getName : function() {
			return name;
		},
		setName : function(new_name) {
			name = new_name;
		},
		setSpeed : function(spd) {
			speed = spd;
		},
		getSpeed : function() {
			return speed;
		}
	};
};

var l = new life.World(1400,500);