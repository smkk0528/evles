/**
 * @author Yue Lv
 */
// browser checked
$.extend({
	_remoteEventListeners : {},
	addRemoteEventListener : function(eventTag, fn) {
		if (eventTag in this._remoteEventListeners) {
			this._remoteEventListeners[eventTag].push(fn);
		} else {
			this._remoteEventListeners[eventTag] = [ fn ];
		}
	},
	lc : {
		_source:{},
		_players : [],
		_self : {},
		_backward : {},
		_forward : {},
		_playerNum : 0,
		notify : function(w, data) {
			if (w === 'all') {
				var postData = JSON.stringify({
					action : "postAll",
					name : $.lc._self.name,
					msg : data
				})
				this._source.postMessage(postData, '*');
			}
		},
		players : function() {
			return this._players;
		},
		self : function() {
			return this._self;
		},
		getBackward : function() {
			return this._backward;
		},
		getForward : function() {
			return this._forward;
		},
		userCount : function() {
			return this._playerNum;
		},
		setRequestedOrientation : function(requestedOrientation) {
			// 参数：-1：跟随系统
			// 0：强制横屏
			// 1：强制竖屏
			var msg = JSON.stringify({
				action : "orientation",
				name : $.lc._self.name,
				msg : requestedOrientation
			});
			$.lc._source.postMessage(msg, '*');
		},
		shake : function(time) {
			var msg = JSON.stringify({
				action : "shake",
				name : $.lc._self.name ,
				msg : time
			});
			$.lc._source.postMessage(msg, '*');
		},
		width : function() {
			return 480;
		},
		height : function() {
			return 800;
		},
		ready : function() {
			if ($.lc._source) {
				$.lc._source.postMessage(JSON.stringify({
						action : 'onReady',
						name : $.lc._self.name
					}),'*');
			} else {
				setTimeout(function() {
					$.lc.ready();
				}, 500);
			}
		}
	}
});

(function() {

	window.addEventListener('message', function(event){ 
		var data =JSON.parse(event.data);
		
		if(data.action) {
			if(data.action=='postAll'){
				window.onmessage(data.name);
				var postData = JSON.stringify({name:$.lc._self.name,action:'getMsg'})
				$.lc._source.postMessage(postData, '*');
			}
			if(data.action=='allReady'){
				window.onready();
				var postData = JSON.stringify({name:$.lc._self.name,action:'getMsg'})
				$.lc._source.postMessage(postData, '*');
			}
		}else{
			$.lc._source = event.source;
			$.lc._self = data.self;
			$.lc._players = data.players;
			$.lc._forward = data.forward;
			$.lc._backward= data.backward;
			
			var postData = JSON.stringify({name:$.lc._self.name,action:'open'})
			$.lc._source.postMessage(postData, '*');
		};
	},false);


	// 窗体关闭,通知通知主窗体。
	window.addEventListener('unload', function(){
			var postData = JSON.stringify({name:$.lc._self.name,action:'closed'})
			$.lc._source.postMessage(postData, '*');
	}, false);
	
	window.onmessage = function(msg) {
		var data = msg, onFireEvents = $._remoteEventListeners[data.eventTag];
		for ( var i = 0; onFireEvents && i < onFireEvents.length; i++) {
			onFireEvents[i](data);
		}
	};
})();