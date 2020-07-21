/*
mainframe - treeframe - workframe
富文本编辑器，summary    リッチテキストエディタ, summary
富文本编辑器，preconditions

Edit Btn: "input[name='edit_tc']",Funwork        res.click();

Resource Btn: "#cke_19" , "#cke_68",Funwork      res[0].click();
                cke_9       cke_54
data2: "textarea[aria-label='リッチテキストエディタ, preconditions']",Funwork    
                             
body2:"body",Funcontent2

*/
const outTime = 500;
const cycleTime = 10;
const EDIT_NAME="edit_tc";
const RES1_NAME="cke_19";
const RES2_NAME="cke_68";
const TEXTAREA1_NAME="リッチテキストエディタ, summary";
const TEXTAREA2_NAME="リッチテキストエディタ, preconditions";
const UPDATE_NAME ="do_update";
const SELECT_NAME="body";  //注入到顶层元素 的 名字
const TESTCASE_NAME = "testcase_name"; //改title的按钮
const Funtree =()=> document.getElementById("page_iframe").contentWindow.frames[0];
const Funwork =()=> document.getElementById("page_iframe").contentWindow.frames[1];
const Funcontent1 =()=> document.getElementById("page_iframe").contentWindow.frames[1].frames[0];
const Funcontent2 = ()=> document.getElementById("page_iframe").contentWindow.frames[1].frames[1];

var global_stop=0;
//******Tools  *****************
function delayit(t){
	return new Promise((resolve,reject)=>{
		setTimeout(()=>{resolve(1)},t)
	})
}
function delayBody(frame,node){
	let limitit = cycleTime;
	let p = new Promise((resolve,reject)=>{
		let int = setInterval(()=>{
			//console.log("delayBOdy")
			let doc = frame();
			if(doc && doc.document.readyState=="complete"){
				resolve(doc.document);
				clearInterval(int);
			}
			if(!limitit){
				reject(node)
				clearInterval(int); 
			}
			limitit--;
		},outTime)
	});
	return p;	
}
function fixzero(num){
	return (Array(3).join(0)+num).slice(-3);
}
function delayDOM(selector,frame,node){
	let limitit = cycleTime;
	let p = new Promise((resolve,reject)=>{
		let int = setInterval(()=>{
			//console.log("delayDOM")
			let doc = frame();
			if(doc){
				let query = $(selector,doc.document);
				if(query.length){
					
					resolve(query);
					clearInterval(int);
				}
			}
			if(!limitit){
				reject(node)
				clearInterval(int); 
			}
			limitit--;
		},outTime)
	});
	return p;	
}
function msgToInjectHtml(role,msg){
	let doc = document.getElementById('inject_frame')
	if(doc){
		doc.contentWindow.postMessage({role:role,data:msg},"*");
	}
}
function msgToBack(msg){
	chrome.runtime.sendMessage(msg,res=>{
		
	})
}


function injectShortcutKey(e){
	let myjs = `
		
	`;
	//msgToBack({data:myjs});
	
	
}
//******Tools end*****************





//*******************    page1    ********************/
async function doPage1(e){
	global_stop=0;
	let collections = $(".x-tree-selected.x-tree-node-expanded",Funtree().document).next().children();
	let check = $("#cbsetting_refresh_tree_on_action",Funtree().document)[0].checked;
	let limit =collections.length||0;
	let sec1,sec2;
	if(e.ck){ //cover
		sec1=e.sec1;
		sec2=e.sec2;
	}else{
		sec1=e.sec1==""?e.sec1:"<br />"+e.sec1;
		sec2=e.sec2==""?e.sec2:"<br />"+e.sec2;
	}
	if(!collections.length){
		msgToInjectHtml("inject-page1","View Error!")
		return ;
	}

	if(check){
		msgToInjectHtml("inject-page1","Error:refresh checkbox is on");
		return ;
	}

	for(let add =0;add<limit;++add){
		if(global_stop) {
			msgToInjectHtml("inject-page1","stop!")
			return;
		}
		$("a",collections[add])[0].click();
		msgToInjectHtml("inject-page1",`[${add}]`)
		//等待Tree Frame complete
		try{
			await delayDOM(".x-tree-selected",Funtree,'Tree_Frame').then(res=>{
				msgToInjectHtml("inject-page1",`[${add}]: Tree_Frame: OK!`)
			}) }catch(e){
				msgToInjectHtml("inject-page1",`[${add}]: Tree_Frame: Failed!`);
				return ;
		}
		//等待 Edit Btn
		try{
			await delayDOM(`input[name='${EDIT_NAME}']`,Funwork,'Edit_Button').then(res=>{
				//Edit Click
				if(res.length>1){
					res=res[1];
				}
				res.click();
				msgToInjectHtml("inject-page1",`[${add}]: Edit_Button: OK!`)
			}) }catch(e){
				console.log(e);
				msgToInjectHtml("inject-page1",`[${add}]: Edit_Button: Failed!`);
				return ;
		}
		
		await delayit(200);
		
		//等待Resource
		try{
			await delayBody(Funcontent2,'findResource').then(res=>{
				//Resource Click
				let res1 = $(`#${RES1_NAME}`,Funwork().document);
				let res2 = $(`#${RES2_NAME}`,Funwork().document);
				res1[0].click();
				res2[0].click();
				msgToInjectHtml("inject-page1",`[${add}]: Resource_Button: OK!`)
			}) }catch(e){
				console.log(e);
				msgToInjectHtml("inject-page1",`[${add}]: Resource_Button: Failed!`);
				return ;
		}

		
		
		//Insert Data
		try{
			await delayDOM(`textarea[aria-label='${TEXTAREA2_NAME}']`,Funwork,"Data Frame").then((res)=>{
				let data1 = $(`textarea[aria-label='${TEXTAREA1_NAME}']`,Funwork().document);
				let data2 = res;
				if(e.ck){
					if(sec1!=""){data1.val(sec1);}
					if(sec2!="")data2.val(sec2);
				}else{
					if(sec1!="")data1.val(data1.val()+"\n"+sec1);
					if(sec2!="")data2.val(data2.val()+"\n"+sec2);
				}
				msgToInjectHtml("inject-page1",`[${add}]: Insert OK!`)
				return Promise.resolve(1);
			})}catch(e){
				console.log(e);
				msgToInjectHtml("inject-page1",`[${add}]: Insert Failed!`);
				return ;
		}
		
		try{
		await delayit(200).then(res=>{
			let work = Funwork().document;
			$(`#${UPDATE_NAME}`,work).click();
		}).then(res=>{
			msgToInjectHtml("inject-page1",`[${add}]: Update OK!`)
		})}catch(e){
			msgToInjectHtml("inject-page1",`[${add}]: Update Failed!`)	;
			return ;
		}
		await delayit(1000);
	}
}

//****************   page2   *********** */
async function doPage2(e){	
	global_stop=0;
	let collections = $(".x-tree-selected.x-tree-node-expanded",Funtree().document).next().children();
	let check = $("#cbsetting_refresh_tree_on_action",Funtree().document)[0].checked;
	let limit =collections.length||0;
	let input,sign,_input;
	if(!collections.length){
		msgToInjectHtml("inject-page2","View Error!")
		return ;
	}
	if(check){
		msgToInjectHtml("inject-page2","Error:refresh checkbox is on");
		return ;
	}
	for(let add =0;add<limit;++add){
		if(global_stop) {
			msgToInjectHtml("inject-page2","stop!")
			return;
		}
		$("a",collections[add])[0].click();
		//等待Tree Frame complete
		try{
			await delayDOM(".x-tree-selected",Funtree,'Tree_Frame').then(res=>{
				msgToInjectHtml("inject-page2",`[${add}]: Tree_Frame: OK!`)
			}) }catch(e){
				msgToInjectHtml("inject-page2",`[${add}]: Tree_Frame: Failed!`);
				return ;
		}
		//等待 Edit Btn
		try{
			await delayDOM(`input[name='${EDIT_NAME}']`,Funwork,'Edit_Button').then(res=>{
				
				input = e.input;
				sign = e.sign;
				_input = input.split(sign);
				_input[_input.length-1] = fixzero(parseInt(add+1));
				
				
				//Edit Click
				if(res.length>1){
					res=res[1];
				}
				res.click();
				msgToInjectHtml("inject-page2",`[${add}]: Edit_Button: OK!`)
		}) }
		catch(e){
			console.log(e);
			msgToInjectHtml("inject-page2",`[${add}]: Edit_Button: Failed!`);
			return ;
		}
		await delayit(200);
		
		try{
			await delayDOM(`#${TESTCASE_NAME}`,Funwork,"Testcase_Name").then(res=>{
				res.val(_input.join(sign));
			})
		}catch(e){
			console.log(e);
		}
						
		try{
			await delayit(200).then(res=>{
				let work = Funwork().document;
				$(`#${UPDATE_NAME}`,work).click();
			}).then(res=>{
				msgToInjectHtml("inject-page2",`[${add}]: Update OK!`)
			})}catch(e){
				msgToInjectHtml("inject-page2",`[${add}]: Update Failed!`);
				return ;
		}

		await delayit(1000);
		
	}
}



//inject iframe
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	var frameUrl = chrome.extension.getURL('inject.html');
	var framejsUrl = chrome.extension.getURL('inject.js');
	sendResponse("ok");
	if( !$("#inject_frame").length){ //不存在
		let inject =`<iframe
			id="inject_frame"
			src="${frameUrl} "
			style="
				display:block;
				position:fixed;
				right:20px;
				top:20px;
				border:none;
				margin:0;
				z-index: 5000;
				width: 550px;
				height: 400px;
				max-width: none;
				max-height: none;
				min-width: 0;
				min-height: 0;
			"
		></iframe>`
		$(`${SELECT_NAME}`).after(inject);
	}else{ //存在
		var show = $("#inject_frame").css("display");
		if(show==='none'){
			$("#inject_frame").show(200);
		}else{
			$("#inject_frame").hide(200);
		}
	}
	
});


//监听inject的动作
window.addEventListener("message", function(e){
	if(e && e.data){
		console.log(e.data.role);
		switch(e.data.role){
			case 'page1-click':
				doPage1(e.data);
				break;
			case 'page-stop':
				global_stop=1;
				break;
			case 'page2-click':
				doPage2(e.data);
				break;

			case 'page3-ck':
				injectShortcutKey();
				break;
			
		}
	}

	
  	
}, false);


//<script src="inject.js"></script>


