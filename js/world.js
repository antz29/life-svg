var life = {};

life.World = function(width,height) {
	var r = new life.Renderer(width,height);
	var width = width;
	var height = height;
	var objects = {};
	var tick_length = 25;
	var timer = false;
		
	var getDistance = function(point1,point2)
	{
		
	};
	
	var tick = function()
	{
		for (var i in objects) {
			objects[i].thing.tick();
			
			var offset = objects[i].thing.getMovement();
			var speed = objects[i].thing.getSpeed();
			
			if (speed && (offset.x || offset.y)) {
				objects[i].pos.x += (offset.x * speed);
				objects[i].pos.y += (offset.y * speed);
				
				var obj = false;
				if (obj = collisionTest(objects[i].thing)) {
					if (obj.obj == 'wall') {
						objects[i].thing.bumps('wall',obj.mdir);
					}
					else {
						obj.obj.bumped(objects[i].thing,obj.tdir);
						objects[i].thing.bumps(obj.obj,obj.mdir);
					}
				}
			}
		}
	};
	
	var render = function()
	{
		r.getCanvas().clear();
		for (var i in objects) {
			r.render(objects[i].thing.render,{pos:objects[i].pos},{});
		}
	};
	
	var getObjectBounds = function(name)
	{
		var obj = objects[name];
		var bnds = obj.thing.getBounds();
		for (var i in bnds) {
			bnds[i].y = bnds[i].y + obj.pos.y; 
			bnds[i].x = bnds[i].x + obj.pos.x; 
		}
		return bnds;
	};
	
	var collisionTest = function(obj)
	{
		var sbnds = getObjectBounds(obj.getName());
		
		for (var i in sbnds) {
			if ((sbnds[i].x <= 0 || sbnds[i].x >= width) || (sbnds[i].y <= 0 || sbnds[i].y >= height)) {
				return {obj : 'wall',mdir : i};
			}
		}
		
		for (var i in objects) {
			if (i == obj.getName()) continue;
			var bnds = getObjectBounds(i);
			for (var j in bnds) {
				for (var k in sbnds) {
					for (var l in sbnds) {
						if (l == k) continue;
						if (isBetween(bnds[j],sbnds[k],sbnds[l])) {
							return {obj : objects[i].thing,mdir : l,tdir:j};
						}
					}
				}
			}
		}
		
		return false;
	};
	
	var isBetween = function(point,point1,point2) {
		var match = 0;
		
		if (point1.x > point2.x) {
			if (point.x >= point2.x && point.x <= point1.x) match++;
		}
		else {
			if (point.x >= point1.x && point.x <= point2.x) match++;
		}
		
		if (point1.y > point2.y) {
			if (point.y >= point2.y && point.y <= point1.y) match++;
		}
		else {
			if (point.y >= point1.y && point.y <= point2.y) match++;
		}
		
		return (match == 2);
	};
	
	var clock = function()
	{
		tick();
		render();
		timer = setTimeout(clock,tick_length);
	};
	
	var getRandomPosition = function()
	{
		var pos = {};
		pos.x = Math.round(Math.random() * (width - 150));
		pos.y = Math.round(Math.random() * (height - 150));
		
		if (pos.x < 150) pos.x = 150;
		if (pos.y < 150) pos.y = 150;
		
		return pos;
	};
	
	return {
		setTick : function(new_tick) 
		{
			tick_length = new_tick;
		},
		getTick : function()
		{
			return tick_length;
		},
		newObject : function()
		{
			return new life.Object(this);
		},
		registerObject : function(obj,pos)
		{			
			if (!pos) {
				var pos = getRandomPosition();
			}
						
			objects[obj.getName()] = 
			{
				thing : obj,
				pos : {x : pos.x, y : pos.y}
			};
			while(collisionTest(obj)) {
				objects[obj.getName()].pos = getRandomPosition();
			}
		},
		killObject : function(name) 
		{
			objects[name] = null;
		},
		getObject : function(name)
		{
			return objects[name];
		},
		getObjectBounds : function(name)
		{
			return getObjectBounds(name);
		},
		start : function()
		{
			clock();
		},
		stop : function()
		{
			clearTimeout(timer);
		}
	};
};

life.Object = function(wrl) {
	
	var bounds = {
		tl : {x:0, y:0},
		tr : {x:0, y:0},
		bl : {x:0, y:0},
		br : {x:0, y:0}
	};
	
	var movement = {x:0,y:0};
	var age = 0;
	var name = "";
	var speed = 1;
	
	var sense = new life.Sense(this,wrl);
	
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
		getSense : function() {
			return sense;
		},
		getBounds : function() {
			return jQuery.extend(true, {}, bounds);
		},
		setBounds : function(bnds) {
			bounds = bnds;
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
		},
		drawBounds : function(r) {
			var bnds = this.getBounds();
			var pnts = [];
			for (var i in bnds) {
				pnts.push(bnds[i]);
			}
			r.shape('poly',{points : pnts},{strokeStyle:'#ff0000'},true,false);
		}
	};
}

life.Canvas = function(width,height) {
	
	var newCanvas = function(width,height)
	{
		return $('<canvas/>').attr({height:height,width:width}).height(height).width(width);
	};
	
	var getMid = function(start,end)
	{
		var mid = {};
		mid.x = (start.x + end.x) / 2;
		mid.y = (start.y + end.y) / 2;
		
		return mid;
	};
	
	var getNormal = function(start,end,distance)
	{		
		var mid = getMid(start,end);
		
		var dir = [(end.y - mid.y),(end.x - mid.x)];
		dir[1] = dir[1] * -1; 
		
		var dis = Math.sqrt(Math.pow((mid.x - end.x), 2) + Math.pow((mid.y - end.y), 2));
		
		dir[0] = dir[0] / dis;
		dir[1] = dir[1] / dis;
		
		var crv = {};
		crv.x = mid.x + (distance * dir[0]);
		crv.y = mid.y + (distance * dir[1]);
		
		return crv;
	};
	
	var line = function(start,end)
	{
		arena.moveTo(start.x,start.y);
		arena.beginPath();
		arena.lineTo(end.x,end.y);
		arena.stroke();		
		arena.closePath();
	};
	
	var shapes = {
		curve : function(opt)
		{
			opt.size = opt.size * 2;
			
			var mid = getMid(opt.start,opt.end);
			
			var c1 = getNormal(opt.start,mid,opt.size);	
			var c2 = getNormal(mid,opt.end,opt.size);
			
			arena.moveTo(opt.start.x,opt.start.y);
			
			arena.beginPath();
			arena.bezierCurveTo(c1.x,c1.y,c2.x,c2.y,opt.end.x,opt.end.y);
			arena.closePath();
		},
		arc : function(opt)
		{
			var start = (Math.PI/180) * opt.start;
			var end = (Math.PI/180) * opt.end;
			
			arena.moveTo(opt.center.x,opt.center.y);
			
			arena.beginPath();
			arena.arc(opt.center.x,opt.center.y,opt.radius,start,end,false);
			arena.closePath();	
		},
		line : function(opt)
		{
			var start = opt.points.shift();
			arena.moveTo(start.x,start.y);
			arena.beginPath();
			
			while(point = opt.points.shift()) {
				arena.lineTo(point.x,point.y);
			}
			
			arena.closePath();
		},
		poly : function(opt)
		{
			opt.points.push(opt.points[0]);
			shapes.line(opt);
		}
	};
	
	var canvas = newCanvas(width,height);
	var arena = canvas.get(0).getContext('2d'); 
	
	return {
		shape : function(shape,options,style,stroke,fill)
		{	
			if (style) {
				arena.save();
				for (var i in style) {
					arena[i] = style[i];
				}
			}
			
			shapes[shape](options);
			
			if (fill) arena.fill();
			if (stroke) arena.stroke();
			
			if (style) arena.restore();
		},
		clear : function()
		{
			arena.clearRect(0,0,width,height);
		},
		setShape : function(name,func)
		{
			shapes[name] = func;
		},
		getCanvas : function()
		{
			return canvas;
		},
		getArena : function()
		{
			return arena;
		}
	};
};

life.Renderer = function(width,height) {
	
	var r = new life.Canvas(width,height);
	
	var arena = r.getArena();
	
	$('body').append(r.getCanvas().css('border','1px solid #000'));
	
	return {
		render : function(func,opt,shape_options)
		{		
			arena.save();
						
			arena.translate(opt.pos.x,opt.pos.y);		
			
			func(r,shape_options);
			
			arena.restore();
		},
		getCanvas : function()
		{
			return r;
		}
	}
}

