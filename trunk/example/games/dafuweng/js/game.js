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
				$("$mapCanvas").entity('map'+this.data[i][j]+'ImgEntity',{dx :100+45*j,dy :30+45*i}).res('map'+this.data[i][j]+'Res').draw(); 
			}
		}
	}
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
	roll : false,
	point : 0,
	pre : "",
	show : function(){
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
		$("$desk@shaizi").bind('touchstart',this.init,false);
	},
	init : function(){
		$("$desk@shaizi").rotate(0).animation().to({rotate:-1800},300).start();
		this.point = Math.floor(Math.random()*6+1);
		shaizi.showPoint(this.point)
		var point = this.point;
		setTimeout(function(){ player.move(point); },400)
	},
	showPoint : function(n){
		if(this.pre){
			$(this.pre).remove();
		}
		setTimeout(function(){$("$desk").entity( point['point'+n].name,point['point'+n].point).res("shaiziImg").draw()},350);
		this.pre = "$desk@point"+n ;
	}
}

//玩家
$.cacheImg('playerImg', 'img/down.png');
var player = {
	x : 0,
	y : 0,
	pose : 'left',
	route : [{x:5,y:1}],
	nextPosition : {},
	
	show : function(){ $("$desk").entity("player",{  
			dx : 155,
			dy : 235
		}).res("playerImg").draw(); 
	},
	status : function(){
		var currentPosition = {};
		var lastGrid = {};
		
		if( this.route.length < 2 ){
			currentPosition = {x:this.route[0].x,y:this.route[0].y};
			lastGrid = currentPosition ;
		}else{
			currentPosition = {x:this.route[this.route.length-1].x,y:this.route[this.route.length-1].y};
			lastGrid = {x:this.route[this.route.length-2].x,y:this.route[this.route.length-2].y} ;
		}
		
		m =currentPosition.x;
		n =currentPosition.y;
		if((m-1)>-1&&map.data[m-1][n]!=0&&(lastGrid.x!=(m-1)||lastGrid.y!=n)){
			this.nextPosition.x =m-1;
			this.nextPosition.y =n;	
			this.pose='up';
		}else if((m+1)<6&&map.data[m+1][n]!=0&&(lastGrid.x!=(m+1)||lastGrid.y!=n)){
			this.nextPosition.x =m+1;
			this.nextPosition.y =n;	
			this.pose='down';
		}else if((n-1)>-1&&map.data[m][n-1]!=0&&(lastGrid.x!=m||lastGrid.y!=(n-1))){
			this.nextPosition.x =m;
			this.nextPosition.y =n-1;	
			this.pose='left';
		}else if((n+1)<8&&map.data[m][n+1]!=0&&(lastGrid.x!=m||lastGrid.y!=(n+1))){
			this.nextPosition.x =m;
			this.nextPosition.y =n+1;
			this.pose='right';
		}
	},
	move : function(point){
			//console.log(this.nextPosition);
			if(point > 0){
				point--;
				this.status();
				$("$desk@player").animation()
				.to({dx :100+45*this.nextPosition.y,dy :10+45*this.nextPosition.x },100)
				.onComplete(function(){ 
					player.move(point);
				}).start();
				this.route.push({x:this.nextPosition.x,y:this.nextPosition.y});
				
			}
	},
	
}


$(function(){
	$("#map").canvas('mapCanvas');
	$("$mapCanvas").autoAnimation(false);
	map.show();
	
	$("#canvasBox").canvas('desk');
	shaizi.show();
	player.show();
})