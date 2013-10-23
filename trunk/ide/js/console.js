/**
 * @author Wuliang
 */

var manager = {
	_players : [],
	ready : {},
	simulators : [],
	contents : '',
	ready : [],
	_msgListeners : {},
	open : function(url, name, options) {
		var win = window.open(url, name, options), simulator = {
			win : win
		};
		var self = this.simulators.length, forward = self - 1, backward = self + 1;
		
		if (forward < 0) {//first
			forward = this._players.length - 1;
		}

		if (backward = this._players.length) {
			backward = 0;
		}
		simulator.self = this._players[self];
		this.simulators[this.simulators.length] = simulator ;
		var data = {
			players : this._players,
			self:this._players[self],
			forward : this._players[forward],
			backward : this._players[backward],
			playNum : this._players.length,
		};
		setTimeout(function() {
			win.postMessage(JSON.stringify(data), "*");
		}, 400);
	},
	build : function(option) {
		var size = option.size || 0;
		for (var i = 0; i < size; i++) {
			this._players.push({
				ip : '192.168.0.10' + i,
				position : i,
				name : 'player_' + i
			});
		}
	},
	size : function() {
		return this._players.length;
	},
	debug : function(msg) {
		manager.contents = document.getElementById("text").innerHTML + "<p class='debug'>" + msg +'</p>';
		document.getElementById("text").innerHTML = manager.contents;
	},
	info : function(msg) {
		manager.contents = document.getElementById("text").innerHTML + "<p class='info'>" + msg +'</p>';
		document.getElementById("text").innerHTML = manager.contents;
	},
	warn : function(msg) {
		manager.contents = document.getElementById("text").innerHTML + "<p class='warn'>" + msg +'</p>';
		document.getElementById("text").innerHTML = manager.contents;
	},
	error : function(msg) {
		manager.contents = document.getElementById("text").innerHTML + "<p class='error'>" + msg +'</p>';
		document.getElementById("text").innerHTML = manager.contents;
	},
	listeners : function(action) {
		return this._msgListeners[action] || [];
	},
	addMessageListener : function(action, fn) {
		console.log(action);
		var listeners = this._msgListeners[action] || [];
		listeners.push(fn);
		this._msgListeners[action] = listeners;
	},
	close : function() {
		for (var i = 0; i < this.simulators.length; i++) {
			var simulator = this.simulators[i];
			simulator.win.close();
		}
	}
};

window.addEventListener('message', function(event) {
	var data = JSON.parse(event.data);
	
	if(data.action) {
		var listeners = manager.listeners(data.action);
		for (var i = 0; i < listeners.length; i++) {
			listeners[i](data);
		}
	}
}, false);

// 主窗体关闭,附属子窗体都关闭。
window.addEventListener('unload', function(e) {
	manager.close();
}, false);
manager.addMessageListener('open', function(data) {
	manager.info( data.name + "就绪");
});

manager.addMessageListener('closed', function(data) {
	manager.warn(data.name + "关闭");
});

manager.addMessageListener('getMsg', function(data) {
	manager.info(data.name + "已收到通知");
});

manager.addMessageListener('onReady', function(data) {
	
	var readyStatu = manager.ready.some(function(item){ return ( item == data.name) });
	if(readyStatu){
		manager.warn(data.name + "重新ready");
	}else{
		manager.ready.push(data.name);
		manager.info(data.name + "--ready");
	}
	
	if(manager.ready.length == manager.simulators.length){
		manager.info("所有玩家ready");
		for(var i=0;i<manager.simulators.length ;i++){
			var postData = JSON.stringify({
				action:'allReady',
				});
			manager.simulators[i].win.postMessage(postData,"*");
			manager.debug("控制台发送all-ready信息给" + manager.simulators[i].self.name);
		}
	}
	
});

manager.addMessageListener('postAll', function(data) {
	for(var i=0;i<manager.simulators.length ;i++){
		if(manager.simulators[i].self.name == data.name){
			manager.info( manager.simulators[i].self.name + "发出通知");
			break;
		};
	}
	for(var i=0;i<manager.simulators.length ;i++){
		if(manager.simulators[i].self.name != data.name){
			manager.simulators[i].win.postMessage(JSON.stringify(data),"*");
			manager.debug("控制台发通知给" + manager.simulators[i].self.name  );
		} ;
	}
});

manager.addMessageListener('shake', function(data) { 
	manager.info( data.name +'震动'+data.msg + "毫秒");
});

manager.addMessageListener('orientation', function(data) { 
	var echoMsg = "";
	if(data.msg == -1){ echoMsg = "屏幕跟随系统"
	}else if(data.msg == 0){echoMsg = "强制横屏"
	}else if(data.msg == 1){echoMsg = "强制竖屏"}
	manager.info( data.name + echoMsg);
});
//------------------------上面是基础框架，下面是配合服务器端自动生成的代码------------------------------------------
var windows = [{url : 'debug1.html', name : 'debug1', option :'height=400,width=400,top=0,left=300'},
				{url : 'debug2.html', name : 'debug2', option :'height=400,width=400,top=0,left=600'},
				{url : 'debug3.html', name : 'debug3', option :'height=400,width=400,top=0,left=900'}];
window.onload = function() {
	manager.build({
		size : 3
	});
	
	openAll(0);
};

function openAll(index){
	if(index < windows.length){
		var w = windows[index];
		manager.open(w.url,w.name,w.option);
		setTimeout(function(){
			index++;
			openAll(index);
		},500);
	}
}