$(document).ready(()=>{
	//nav
	//$(".inject-nav li").first().addClass("active");
	
	//page
	
})
function sendMsg(msg){
	parent.window.postMessage(msg, '*');
}

function appendLog(logname,e){
	let msg = e.data.data;
	if(msg.match(reg)){
		$(logname).append(`<span style="color:red;">${msg}</span>`)
	}else{
		$(logname).append(`<span>${msg}</span>`)
	}
	
	$(logname).scrollTop( $(logname)[0].scrollHeight );
}









//*************************** */page1 button click
$("#inject-page1-btn").click(()=>{
	let _sec1=$("#inject-page1-sec1").val();
	let _sec2=$("#inject-page2-sec2").val();
	let _ck =  $("#inject-page1-ck").prop('checked');
	let msg = {
		role:'page1-click',
		ck:_ck,
		sec1:_sec1,
		sec2:_sec2
	}
	$(".inject-log").empty();
	sendMsg(msg);
})
//page1 stop button
$("#inject-page1-stop").click(()=>{
	sendMsg({
		role:'page-stop'
	})
})



//*************************** */page2 button click
$("#inject-page2-btn").click(()=>{
	let _input = $(".page2-input").val();
	let _sign =$(".page2-sign").val();
	let msg = {
		role:'page2-click',
		input:_input,
		sign:_sign
	}
	$(".inject-log").empty();
	sendMsg(msg);
})
//page2 stop button
$("#inject-page2-stop").click(()=>{
	sendMsg({
		role:'page-stop'
	})
})

//******************************** */page3 button click
$("#inject-page3-ck").change((e)=>{
	let isCk = $("#inject-page3-ck").prop('checked');
	let msg = {
		role:'page3-ck',
		isck:isCk
	}

	sendMsg(msg);
})

//选项卡切换
$(".layui-tab-title li").each(function(index) {
	$(this).on('click',function(){
		$(this).addClass("layui-this").siblings().removeClass("layui-this");
		$(".inject-page").eq(index).show().siblings(".inject-page").hide();
	})
})


//监听log消息
var reg = RegExp(/Failed|Error|stop!/)
window.addEventListener("message",(e)=>{
	if(e&&e.data.role=="inject-page1"){
		appendLog(".inject-page1-log",e);
	}else if(e&&e.data.role=="inject-page2"){
		appendLog(".inject-page2-log",e);
	}
})