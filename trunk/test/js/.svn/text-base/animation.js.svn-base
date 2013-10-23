/**
 * @author Alex Wu
 */
$(function(){
	$('#test').asCanvas({name : 'test'}).start();
	$.cacheImg('chupai','img/chupai.png',function(){
		$('$test').entity({name : "box",dx:0,dy:0,type:'img',res:'chupai'}).animation().to( { dx: 200 }, 700 ).easing( $.Easing.Elastic.InOut ).onUpdate( function () {
			// $('#log')[0].innerHTML += '|'+this.dx;
		}).start();
	});
	
});
