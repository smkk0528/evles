$.lc.setRequestedOrientation(0);
$.cacheImg('porker', 'img/cards4.png');

var pai = {
	cards : [],
	backcard : NormalPorker.back,
	mycards : [],
	position : 0,
	isdizhu : false,
	me : $.lc.self(), //自己参数
	left : $.lc.getBackward(), //左侧玩家
	right : $.lc.getForward(),
	shangjiachupai : [],
	zijichupai : [],
	mycardindex : 0,
	dizhu : {},
}, game = {
	xipai : function() {
		for (var card in NormalPorker.data ) {
			if (card.num === 1) {
				card.num = 14;
			}
			if (card.num === 2) {
				card.num = 15;
			}
			card.dx = 200;
			card.dy = 50;
			card.dh = card.sh;
			card.dw = card.sw;
			card.name = card.color + "_" + card.type + "_" + card.num;
		}
		pai.cards = $.mess(NormalPorker);
		pai.mycards = $.minePorker(pai.cards, pai.position, 3, 51);

		pai.backcard.dh = pai.backcard.sh;
		pai.backcard.dw = pai.backcard.sw;
	},
	fapai : function() {
		//画中心牌
		var centercard = {
			dx : 200,
			dy : 50,
		};
		$.extend(centercard, pai.backcard);
		$('$desk').entity('back-0', centercard).res('porker');

		game.fapaiAnimation(0, 0);
	},
	fapaiAnimation : function(position, index) {
		if (position > 2) {
			position = 0;
		}
		if (index < pai.cards.length - 3) {
			if (position === pai.position) {
				var card = pai.mycards[pai.mycardindex];
				$('$desk').entity(card.name, card).res('porker').bind('touchstart', function(x, y) {
					if (this.dy === 240) {
						this.dy = 200;
					} else {
						this.dy = 240;
					}
					$('$desk').update();
				}, false).animation().to({
					dx : 30 + pai.mycardindex * 25,
					dy : 240
				}, 300).onComplete(function() {
					game.fapaiAnimation(position++, index++);
				}).start();
				pai.mycardindex++;
			}

			if (position === pai.left.position) {
				var card = {
					name : "back-left-" + index,
					dx : 0,
					dy : 0,
				};
				$.extend(card, pai.backcard);
				$('$desk').entity(card.name, card).res('porker').translate(200, 50).rotate(90).animation().to({
					translateX : 80,
					translateY : 50,
				}, 300).onComplete(function() {
					$('$desk').entity(card.name).remove();
					game.fapaiAnimation(position++, index++);
				}).start();
			}

			if (position === pai.right.position) {
				var card = {
					name : "back-right-" + index,
					dx : 0,
					dy : 0,
				};
				$.extend(card, pai.backcard);
				$('$desk').entity(card.name, card).res('porker').translate(200, 90).rotate(-90).animation().to({
					translateX : 350,
					translateY : 90,
				}, 300).onComplete(function() {
					$('$desk').entity(card.name).remove();
					game.fapaiAnimation(position++, index++);
				}).start();
			}
		} else {
			//发牌结束，开始抢地主
			game.paixu();
			game.liangdipai();
			if (pai.position === 0) {
				game.qiangdizhu();
			}
		}
	},
	paixu : function() {
		$.porkerDesc(pai.mycards);

		$('$desk@back-0').remove();

		for (var i = 0; i < pai.mycards.length; i++) {
			var card = pai.mycards[i];
			card.dx = 30 + i * 25;
			$('$desk').entity(card.name).up();
		}
	},
	liangdipai : function() {
		//亮底牌
		for (var i = pai.cards.length - 3; i < pai.cards.length; i++) {
			var card = pai.cards[i];
			card.dx = 80 + 30 * (pai.cards.length - i);
			card.dy = 60;
			$('$desk').entity("dipai_" + card.name, card).res('porker');
		}

		$('$desk').update();
	},
	qiangdizhu : function() {
		$('#jiaofen').show();
	},
	jiaofen : function(f) {
		pai.fen = f;
		if (f === 3 || pai.position === 2) {
			//直接就是地主了
			$.lc.notify('all', {
				eventTag : 'onDizhuOK',
				dizhu : me,
				fen : pai.fen,
			});
			game.nadipai();
		} else {
			$.notify('all', {
				eventTag : 'onQiangdizhu',
				from : me,
				fen : pai.fen,
			});
		}
		$('#jiaofen').hide();
	},
	nadipai : function() {
		for (var i = pai.cards.length - 3; i < pai.cards.length; i++) {
			var card = {};
			$.extend(card, pai.cards[i]);
			card.dx = 30 + pai.mycards.length * 25;
			card.dy = 60;
			pai.mycards.push(card);
			$('$desk').entity(card.name, card).res('porker');
		}
		game.paixu();
		$('#chupai').show();
	},
	buchu : function() {
		$('#chupai').hide();
		$.notify('all', {
			eventTag : 'onChupai',
			from : pai.me,
		});
	},
	chupai : function() {
		game.clearShangJiaPai();
		game.clearZiJiChuPai();
		for (var i = 0; i < pai.mycards.length; i++) {
			var card = pai.mycards[i];
			if (card.dy == 200) {
				pai.mycards.splice(i, 1);
				pai.zijichupai.push(card);
			}
		}

		if (chupaiArr.length > 0) {
			$.notify('all', {
				eventTag : 'onChupai',
				from : pai.me,
				chupai : pai.zijichupai,
			});
		} else {
			alert("选择要出的牌");
		}

		for (var i = 0; i < pai.zijichupai.length; i++) {
			var card = pai.zijichupai[i];

			card.dx = 150;
			card.dy = 180;

			$('#desk').entity(card.name).animation().to({
				dx : 150,
				dy : 180
			}, 200).start();
		}

		$('#chupai').hide();
	},
	tishi : function() {
		alert("this is not work");
	},
	clearShangJiaPai : function() {
		//清除上一家的牌
		for (var i = 0; i < pai.shangjiachupai.length; i++) {
			$('$desk@' + pai.shangjiachupai[i].name).remove();
		}
	},
	clearZiJiChuPai : function() {
		//清除上一家的牌
		for (var i = 0; i < pai.zijichupai.length; i++) {
			$('$desk@' + pai.zijichupai[i].name).remove();
		}
		pai.zijichupai = [];
	}
};

function onready() {
	if (pai.position === 0) {
		game.xipai();
		$.lc.notify('all', {
			eventTag : 'onFapai',
			from : pai.me,
			cards : pai.cards,
		});
		game.fapai();
	}
}

$.addRemoteEventListener('onFapai', function(data) {
	pai.cards = data.cards;
	if (pai.right.position > pai.me.position) {
		pai.position = 1;
		pai.left.position = 0;
		pai.right.position = 2;
	} else {
		pai.position = 2;
		pai.left.position = 1;
		pai.right.position = 0;
	}
	//发牌前先洗牌
	pai.mycards = $.minePorker(pai.cards, pai.position, 3, 51);
	//领取自己的牌
	game.fapai();
});

$.addRemoteEventListener('onDizhuOK', function(data) {
	pai.dizhu = data.dizhu;
	$('#log').html("onDizhuOK,data:" + JSON.stringify(data));
});

$.addRemoteEventListener('onQiangdizhu', function(data) {
	var num = data.fen;
	for (var i = 0; i < num; i++) {
		$('#fen' + i).hide();
	}

	if (data.from.position == pai.me.position - 1) {
		$('#jiaofen').show();
	}

});

$.addRemoteEventListener('onChupai', function(data) {
	pai.shangjiachupai = data.chupai;
	if (data.from.position === pai.me.position - 1) {
		$('#chupai').show();
	}
	alert(JSON.stringify(data));
});

$(function() {
	$("#test").canvas('desk');
	$.lc.ready();
}); 