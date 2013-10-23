/**
 * @author Yue Lv
 */
// browser checked
$.extend({
	_remoteEventListeners : {}, // with onmessage function
	addRemoteEventListener : function(eventTag, fn) {
		if (eventTag in this._remoteEventListeners) {
			this._remoteEventListeners[eventTag].push(fn);
		} else {
			this._remoteEventListeners[eventTag] = [ fn ];
		}
	},
	lc : {
		webClient : {},
		_players : [],
		_self : {},
		_backward : {},
		_forward : {},
		_playerNum : 0,
		notify : function(w, data) {
			if ($.lc.webClient) {
				if (w === 'all') {
					$.lc.webClient.send(JSON.stringify({
						action : "postAll",
						msg : data
					}));
					// TODO
				}
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
			// TODO
			var msg = {
				type : "orientation",
				value : requestedOrientation
			};
			window.parent.postMessage(msg, '*');
		},
		shake : function(time) {// unit ms
			// TODO
			var msg = {
				type : "shake",
				value : time
			};
			window.parent.postMessage(msg, '*');
		},
		width : function() {
			return 480;
		},
		height : function() {
			return 800;
		},
		ready : function() {
			if ($.lc.webClient) {
				console.log("send onReady message ...");
				if ($.lc.webClient.readyState == WebSocket.OPEN) {
					$.lc.webClient.send(JSON.stringify({
						action : 'onReady'
					}));
				} else {
					console.info("waiting for websocket open");
					setTimeout(function() {
						$.lc.ready();
					}, 500);
				}
			} else {
				console.info("waiting for websocket connected");
				setTimeout(function() {
					$.lc.ready();
				}, 500);
			}
		}
	}
});

(function() {
	var href = window.location.href;
	var socket = href.substring(href.indexOf("?socket=") + "?socket=".length, href.indexOf("&ip="));
	var ip = href.substring(href.indexOf("&ip=") + "&ip=".length);
	console.info("socket:" + socket + " ip:" + ip);
	// 121.101.219.102
	var domain = window.location.host;
	console.info("domain:" + domain);
	// var domain = "127.0.0.1";
	$.lc.webClient = new WebSocket("ws://" + domain + ":9999/websocket/" + socket + "/start");
	$.lc.webClient.onmessage = function(event) {
		var data = JSON.parse(event.data);
		console.info(data);
		if (data.action) {
			if (data.action == "getInfo") {
				$.lc.webClient.send(JSON.stringify({
					action : "getInfo",
					msg : ip
				}));
			} else if (data.action == "allReady") {
				console.info("received allReady message ...");
				window.onready();
			} else if (data.action == "postAll") {
				console.info("received postAll message[" + data.msg + "] ...");
				window.onmessage(data.msg);
			}
		} else {
			$.lc._players = data.players;
			$.lc._self = JSON.parse(data.self);
			$.lc._forward = JSON.parse(data.forward);
			$.lc._backward = JSON.parse(data.backward);
			$.lc._playerNum = parseInt(data.playerNum);
		}
	};

	$.lc.webClient.onopen = function(event) {
		$.lc.webClient.send(JSON.stringify({
			action : "getInfo",
			msg : ip
		}));
	};

	$.lc.webClient.onclose = function(event) {
		$.lc.webClient.send(JSON.stringify({
			action : "offline"
		}));
	};

	window.onmessage = function(msg) {
		var data = msg, onFireEvents = $._remoteEventListeners[data.eventTag];
		for ( var i = 0; onFireEvents && i < onFireEvents.length; i++) {
			onFireEvents[i](data);
		}
	};
})();