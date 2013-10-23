//$.lc.setRequestedOrientation(0);

// 地图
var map = {
	data : [[100,5   ,50  ,0  ,0  ,0   ,0   ,0],//?=2;star=5;back=4;final=999;3=50;1=start;
		   [2   ,0   ,3 ,0  ,5  ,50  ,100 ,2], 
		   [4  ,0   ,150   ,4  ,2  ,0   ,0   ,3],
		   [50   ,0   ,0   ,0  ,0  ,3	,50  ,4],
		   [100  ,0   ,0   ,0  ,0  ,5   ,0   ,0],
		   [5 ,1   ,0   ,0  ,0  ,150 ,2   ,999]
	],
	cacheImg: function(){
		for(var i=0;i<6;i++){
			for (var j=0;j<8;j++){
				$.cacheImg('map'+this.data[i][j]+'Res', 'img/map'+this.data[i][j]+'.png');
			}
		}
	},
	
	show : function(){
		
		for(var i=0;i<6;i++){
			for (var j=0;j<8;j++){
				$("$mapC").entity('map'+this.data[i][j]+'ImgEntity',{dx :100+45*j,dy :30+45*i}).res('map'+this.data[i][j]+'Res').draw(); 
			}
		}
	},
	
};

map.cacheImg();


// 骰子
$.cacheImg('shaiziImg', 'img/shaizi.png');

var point = {
	point1 : {
		name : 'point1',
		point : {
			sx : 0,
			sy : 0,
			sw : 44,
			sh : 28,
			dx : 0,
			dy : 0,
			dw : 44,
			dh : 28
		}
	},
	point2 : {
		name : 'point2',
		point : {
			sx : 0,
			sy : 30,
			sw : 44,
			sh : 28,
			dx : 0,
			dy : 0,
			dw : 44,
			dh : 28
		}
	},
	point3 : {
		name : 'point3',
		point : {
			sx : 0,
			sy : 60,
			sw : 44,
			sh : 28,
			dx : 0,
			dy : 0,
			dw : 44,
			dh : 28
		}
	},
	point4 : {
		name : 'point4',
		point : {
			sx : 0,
			sy : 90,
			sw : 44,
			sh : 28,
			dx : 0,
			dy : 0,
			dw : 44,
			dh : 28
		}
	},
	point5 : {
		name : 'point5',
		point : {
			sx : 0,
			sy : 120,
			sw : 44,
			sh : 28,
			dx : 0,
			dy : 0,
			dw : 44,
			dh : 28
		}
	},
	point6 : {
		name : 'point6',
		point : {
			sx : 0,
			sy : 150,
			sw : 44,
			sh : 28,
			dx : 0,
			dy : 0,
			dw : 44,
			dh : 28
		}
	},
};



var shaizi = {
	point : 0,
	pre : "",
	load : function(){
		$("$desk").entity("shaizi",{  
			sx : 60,
			sy : 0,
			sw : 40,
			sh : 40,
			dx : -20,
			dy : -20,
			dw : 40,
			dh : 40
		}).res("shaiziImg").translate(40,280).draw(); 
		$("$desk@shaizi").bind('touchstart',this.show,false);
	},
	show : function(){
		$("$desk@shaizi").rotate(0).animation().to({rotate:-1800},500).start();
		this.point = Math.floor(Math.random()*6+1);
		shaizi.showPoint(this.point)
	},
	showPoint : function(n){
		if(this.pre){
			$(this.pre).remove();
		}
		setTimeout(function(){$("$desk").entity( point['point'+n].name,point['point'+n].point).res("shaiziImg").draw()},450);
		this.pre = "$desk@point"+n ;
	}
}

//玩家
$.cacheImg('playerImg', 'img/down.png');

 
var pose = "";
var lastGrid = {};

var player = {
	x : 0,
	y : 0,
	pose : 'left',
	step : 0,
	route : [{x:5,y:1}],
	location : [{x:5,y:1}],
	lastGrid : {x:5,y:2} ,
	show : function(){ $("$desk").entity("player",{  
			dx : 145,
			dy : 255
		}).res("playerImg").draw(); 
	},
	move : function(){
		$("$desk@player").animation().to().start();
	},
	status : function(){
		var currentPosition = {x:this.route[this.route.length].x,y:this.route[this.route.length].y};
		//var lastGrid = player.lastGrid ;
		
		m =currentPosition.x;
		n =currentPosition.y;
		if((m-1)>-1&&map.data[m-1][n]!=0&&(lastGrid.x!=(m-1)||lastGrid.y!=n)){
			this.nextPosition.x =m-1;
			this.nextPosition.y =n;	
			pose='up';
		}else if((m+1)<6&&map.data[m+1][n]!=0&&(lastGrid.x!=(m+1)||lastGrid.y!=n)){
			this.nextPosition.x =m+1;
			this.nextPosition.y =n;	
			pose='down';
		}else if((n-1)>-1&&map.data[m][n-1]!=0&&(lastGrid.x!=m||lastGrid.y!=(n-1))){
			this.nextPosition.x =m;
			this.nextPosition.y =n-1;	
			pose='left';
		}else if((n+1)<8&&map.data[m][n+1]!=0&&(lastGrid.x!=m||lastGrid.y!=(n+1))){
			this.nextPosition.x =m;
			this.nextPosition.y =n+1;
			pose='right';
		}
		
		
	}
}



/*var  location = {
	calcLocation : function(step){
		var currentPosition = {x:players[0].grid.x,y:players[0].grid.y};
		lastGrid = players[0].lastGrid;//先取出上次走的格子
		for(var i=step;i>0;i--){
			if(map.data[lastGrid.x][lastGrid.y]!=999){
				if(currentPosition.x == this.startGrid.x && currentPosition.y == this.startGrid.y){
					this.nextPosition.x=this.startGrid.x;
					this.nextPosition.y=this.startGrid.y-1;
					this.pose[0]='left';
				}else{//根据cuurentPosition循环周围4个方向，排除上次走的格子,计算应该往哪个方向
					m =currentPosition.x;
					n =currentPosition.y;
					if((m-1)>-1&&map.data[m-1][n]!=0&&(lastGrid.x!=(m-1)||lastGrid.y!=n)){
						this.nextPosition.x =m-1;
						this.nextPosition.y =n;	
						pose='up';
					}else if((m+1)<6&&map.data[m+1][n]!=0&&(lastGrid.x!=(m+1)||lastGrid.y!=n)){
						this.nextPosition.x =m+1;
						this.nextPosition.y =n;	
						pose='down';
					}else if((n-1)>-1&&map.data[m][n-1]!=0&&(lastGrid.x!=m||lastGrid.y!=(n-1))){
						this.nextPosition.x =m;
						this.nextPosition.y =n-1;	
						pose='left';
					}else if((n+1)<8&&map.data[m][n+1]!=0&&(lastGrid.x!=m||lastGrid.y!=(n+1))){
						this.nextPosition.x =m;
						this.nextPosition.y =n+1;
						pose='right';
					}
					this.pose.unshift(pose);
				}								
				lastGrid={x:currentPosition.x,y:currentPosition.y};//	构造location对象，返回 
				currentPosition={x:this.nextPosition.x,y:this.nextPosition.y};
				this.mapLocation.unshift({x:currentPosition.x,y:currentPosition.y});
			}
		}
		//return this.mapLocation;
	}
}*/

/*function Player(){	
	this.x ;				
	this.y ;
	this.moveTime=30;
	this.pose='left';
	this.step=0;
	this.location = [{x:5,y:1}];
	this.grid={x:5,y:1};
	this.lastGrid = {x:5,y:2};
}
Player.prototype = {
	show :function(){
		
	},
	move : function(step){ 
		this.step = step;
		this.location=map.calcLocation(step);
		this.lastGrid =lastGrid;
	}
}*/



$(function(){
	$("#map").canvas('mapC');
	$("$mapC").autoAnimation(false);
	map.show();
	
	$("#canvasBox").canvas('desk');
	shaizi.load();
	player.show();
})