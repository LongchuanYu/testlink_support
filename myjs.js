/*
1.监听frame的刷新
2.每次刷新前轮询frame的加载是否完毕
3.加载完毕后注入js





var t = setTimeout(function(){
	let treeWindow = window.frames[1].frames[0].window;
	console.log(doc);
	doc.onbeforeunload = function(){
		console.log('refresh')
	}
	
	return;
	$(doc).on('DOMSubtreeModified',e=>{
		console.log("mod");
	})
},5000)


function injectit(pos,act){
	
}
do_update
*/

var treedoc,workdoc;

//*9*******************   Tools ***************
function prePage(treedoc,workdoc){
	let selected = $(".x-tree-node-leaf.x-tree-selected",treedoc).parent().prev().children("div").children("a").children("span");
	console.log("pre_page");
	if (!selected.length) return ;
	selected.click();
	
}
function nextPage(treedoc,workdoc){
	let selected = $(".x-tree-node-leaf.x-tree-selected",treedoc).parent().next().children("div").children("a").children("span");
	console.log("next_page");
	if (!selected.length) return ;
	selected.click();
	
}

function editBtn(treedoc,workdoc){
	try{
		//edit_testsuite
		//do_update_step_and_exit
		let docEdit = $("input[name='edit_tc']",workdoc);
		let fileEdit = $("#edit_testsuite",workdoc);
		let saveBtn = $("#do_update",workdoc);
		let saveAndExit = $("#do_update_step_and_exit",workdoc);
		if(docEdit.length){
			console.log("docEdit")
			docEdit[0].click();
		}else if(fileEdit.length){
			console.log("fileEdit")
			fileEdit.click();
		}else if(saveBtn.length){
			console.log("saveButton")
			saveBtn.click();
		}else if(saveAndExit.length){
			console.log("saveAndExit")
			saveAndExit.click();
		}else{
			throw new Error("Edit btn is not found")
		}
	}
	catch(e){
		console.log(e)
	}
}

function toolForListenText(event){
	e = event || window.event || arguments.callee.caller.arguments[0];
	if(e && e.altKey){
		if(e.keyCode==50){
			editBtn(treedoc,workdoc);
		}else if (e.keyCode ==51){
			nextPage(treedoc,workdoc);
		}else if(e.keyCode ==49){
			prePage(treedoc,workdoc);
		}
	}
}

//********************   Tools end ***************

function listenText(){
	setTimeout(function(){
		let t = window.top.document.getElementById("page_iframe").contentWindow
		if(t&&t.frames[1]&&t.frames[1].frames[1]){
			let t0 = window.top.document.getElementById("page_iframe").contentWindow.frames[1].frames[0].document;	
			let t1 = window.top.document.getElementById("page_iframe").contentWindow.frames[1].frames[1].document;

			treedoc = window.top.document.getElementById("page_iframe").contentWindow.frames[0].document || null;
			workdoc =  window.top.document.getElementById("page_iframe").contentWindow.frames[1].document || null;
			
			$(t0).keydown(event=>{
				toolForListenText(event);
			});
			
			$(t1).keydown(event=>{
				toolForListenText(event);
			})
			
			
		}
	},1000)
}
function listenMain(){
	document.onkeydown=function(event){
		let e = event || window.event || arguments.callee.caller.arguments[0];
		treedoc = window.top.document.getElementById("page_iframe").contentWindow.frames[0].document || null;
		workdoc =  window.top.document.getElementById("page_iframe").contentWindow.frames[1].document || null;
		if(e && e.altKey){
			switch(e.keyCode){
				case 50: //edit btn
					editBtn(treedoc,workdoc);
					break;
				case 51:
					nextPage(treedoc,workdoc);
					break;
				case 49:
					prePage(treedoc,workdoc);
					break;
			}
		}		
	}; 
}
workdoc = window.top.document.getElementById("page_iframe").contentWindow.frames[1].document||null;
if(workdoc){
	window.top.document.getElementById("page_iframe").contentWindow.frames[1].onload=function(){
		window.top.document.getElementById("page_iframe").contentWindow.frames[1].focus();
	}
}

//***********---------main----------*******************
listenMain();
listenText();