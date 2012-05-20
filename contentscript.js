/*
 * Copyright (c) 2010 The Chromium Authors. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */
 
(function(){
	var cur_location=location.href;
	var ifpeople_url=cur_location.slice(0,29)=="http://www.douban.com/people/";
	var ifupdate_url=cur_location.slice(0,29)=="http://www.douban.com/update/";
	var people=cur_location.slice(29,-1);
	//判断是否是第一次运行
	var firstRun = (localStorage['douban_first'] == 'true');
		if (!firstRun) {
		//是第一次，则设置标记,初始化一个空数组，并设置给localStorage
  		localStorage['douban_first'] = 'true';
  		var empty_array=new Array();
  		localStorage.setItem('douban_banlist', JSON.stringify(empty_array));
		}


//========================================================================
	//console.log("ifpeople?:"+ifpeople);
	//如果是在豆瓣个人页面
	// if(ifpeople_url){
	// 	console.log("我正在豆瓣个人页面");
	// 	var ifexist=false;
	// 	var banindex=0;
	// 	var retrievedObject = localStorage.getItem('douban_banlist');
	// 	var banlist=JSON.parse(retrievedObject);
	// 	//取出保存在游览器内的名单,并判断是否存在
	// 	jQuery.each(banlist,function(index, name){
	// 		if(people==name){
	// 			ifexist=true;
	// 			banindex=index;//记录INDEX值
	// 		};
	// 	});
	// 	//console.log(banlist.indexof(people));
	// 	//定位到已关注这三个字
	// 	var doumail=$("div.user-group span.user-cs");
	// 	console.log("doumail状态:"+doumail.length);
	// 	if(doumail.length==0){
	// 		console.log("Hi,我已经运行到空判断了");
	// 		doumail=$("div.user-opt a:first");
	// 		console.log("doupeople状态:"+doumail.length);		
	// 	}else{

	// 		console.log("已关注");
	// 	}
	// 	console.log("11doumail状态:"+doumail.length);
	// 	if(ifexist==false){
	// 	//加入我们自己的功能性按钮		
	// 		doumail.after("<span >&nbsp;X&nbsp;<a id='ban-temply'>暂时屏蔽</a></span>");
	// 	}else{
	// 		doumail.after("<span >&nbsp;X&nbsp;<a id='ban-temply'>取消暂时屏蔽</a></span>");
	// 	}
		

	// 	//建立好功能连接的缓存
	// 	var ban_temply_btn=$("#ban-temply");
	// 	console.log("BANLIST："+banlist);
	// 	//暂时屏蔽按钮
	// 	ban_temply_btn.click(function(event){
	// 			var ifexist=false;
	// 			var banindex=0;
	// 	var retrievedObject = localStorage.getItem('douban_banlist');
	// 	var banlist=JSON.parse(retrievedObject);
	// 			//取出保存在游览器内的名单,并判断是否存在
	// 			jQuery.each(banlist,function(index, name){
	// 				if(people==name){
	// 					ifexist=true;
	// 					banindex=index;//记录INDEX值
	// 				};
	// 			});
	// 		console.log("判断是否存在的bool:"+ifexist);
	// 		console.log("PEOPLE:"+people);
	// 			if(ifexist==false){
	// 				banlist.push(people);
	// 				$(this).html("取消暂时屏蔽");
	// 			}else{
	// 				banlist.splice(banindex, 1);
	// 				$(this).html("暂时屏蔽");
	// 			}
	// 		console.log("处理过的BANLIST："+banlist);
	// 		localStorage.setItem('douban_banlist', JSON.stringify(banlist));
	// 	});//End of 读入所有黑名单并保存到LocalStorage
		
	// }
//=========================================================================
	//如果是在黑名单管理界面
	if(location.href=="http://www.douban.com/contacts/blacklist"){
		console.log("我正在黑名单设置页面");
		//定位到黑名单设置界面的第三个“我的收件箱”元素
		var doumail=$("a[href='/doumail/']");
		//加入我们自己的功能性按钮
		doumail.after("<p class='pl2 mb20'>&gt;&nbsp;<a id='import-blacklist' href=''>将黑名单导入插件</a></p>");
		//建立好功能连接的缓存
		var import_blacklist_btn=$("#import-blacklist");

		//读入所有的黑名单ID
		import_blacklist_btn.click(function(event){
				var lists=$("dl.obu dd a");
			//http://ww w   .  d  o  u  b  a  n  .  c  o  m  /  p  e  o 
			//123456789 10  11 12 13 14 15 16 17 18 19 20 21 22 23 24 25
			// p  l  e  /   Mstmol/
			//26  27 28 29  30
			var banlist=new Array();
				lists.each(function(){
					var o=$(this);
					var name=o.attr("href").toString().slice(29,-1);					
					console.log(name);
					banlist.push(name);
				});
			localStorage.setItem('douban_banlist', JSON.stringify(banlist));
		});//End of 读入所有黑名单并保存到LocalStorage
		
	}
//===============================================================================
	//如果是在广播界面
	if(ifupdate_url){
		//console.log("我正在处理广播页面");
		//console.log('retrievedObject: ', banlist);
		var retrievedObject = localStorage.getItem('douban_banlist');
		var banlist=JSON.parse(retrievedObject);



	//加入过滤器标示并建立好对象	
	var doumail=$("a[href*='http://www.douban.com/doumail/']");
	doumail.after("<a id='douban-filter-btn' href='#'>过滤名单</a>");

	var overlay_html="<div id='lemon-overlay' style='position:absolute;left: 0px;top: 0px;width:100%;height:100%;z-index: 1000;'>";
	var overlaydiv_html="<div id='lemon-overlaydiv' style='width:250px;height:400px;margin: 30px 0px 0px 70%;background-color: #fff;border:1px solid #000;padding:15px;overflow-y:scroll;'>";
	var closelnk_html="<a href='#'' class='overlay-lnk-close'>关闭[X]</a>";
	var clearlnk_html="<a href='#'' class='clear-all-banlist'>清空全部</a>";
	var content_html="<div id='ban-content'></div>";
	var overlayend_html="</div></div>";
	doumail.after(overlay_html+overlaydiv_html+closelnk_html+clearlnk_html+content_html+overlayend_html);

	//缓存好【过滤器】这个关键的按钮对象
	var db_filter_btn=$("#douban-filter-btn");
	//缓存好【弹出窗口的CLOSE对象】
	var overlay_close_btn=$(".overlay-lnk-close");
	//缓存好【清空全部对象】
	var clear_all_banlist_btn=$(".clear-all-banlist");
	//缓存设置窗口的遮罩层
	var overlay_background=$("#lemon-overlay");
	//缓存设置窗口本身
	var overlay_win=$("#lemon-overlaydiv");
	//缓存bancontent-div
	var ban_list_content=$("#ban-content");
	//设置【清空全部对象】行为
	clear_all_banlist_btn.click(function(event){
		event.stopPropagation();
		var empty_array=new Array();
  		localStorage.setItem('douban_banlist', JSON.stringify(empty_array));
  		ban_list_content.html("");
  		window.location.reload();
	});

	//当设置菜单隐藏后，取得指定的ID并隐藏
	//TODO：将设置的ID保存在LOCALSTORAGE里面去
	
	jQuery.fn.hideandban = function() {
    	var o = $(this[0]); 
    	o.hide();    	
	};
	//设置窗口的关闭按钮行为
	overlay_close_btn.click(function(event){
		event.stopPropagation();
		overlay_background.hideandban();	
	});
	//如果在设置框外点击，则立即隐藏整个遮罩层
	overlay_background.click(function(){
		overlay_background.hideandban();	
	});
	//点击设置窗口本身就别冒泡了，好不？
	overlay_win.click(function(event){
		event.stopPropagation();
		overlay_background.show();	
	});
	//过滤器链接的点击事件响应
	db_filter_btn.click(function(){
			console.log("db_filter_btn click!");
			overlay_background.show();
		}
	);


	//初始化的一些代码
	overlay_background.hide();
	var reshare_btn=$("div.actions a.btn-reshare");
	reshare_btn.after("&nbsp;&nbsp;<a class='ban_temply_btn'>暂时关到小黑屋</a>");

	//在Action条下运行的，暂时关小黑屋功能
	ban_temply_btn=$("a.ban_temply_btn");
	ban_temply_btn.click(function(event){
		console.log("谁发起的该点击？"+$(this).parent().parent().parent().parent().html());
		var hd=$(this).parent().parent().parent().parent();
		var user_url=hd.find("div.hd a").attr("href");
		var user_uid=user_url.slice(29,-1);
		var user_name=hd.find("div.hd a").attr("title");
		var user_icon=hd.find("div.hd a img").attr("src");
		//console.log(user_url);
		//console.log(user_uid);
		//console.log(user_name);
		//console.log(user_icon);
		var user=new Object();
		user.url=user_url;
		user.uid=user_uid;
		user.name=user_name;
		user.icon=user_icon;

		var retrievedObject = localStorage.getItem('douban_banlist');
		var banlist=JSON.parse(retrievedObject);
		banlist.push(user);
		console.log("暂时关小黑屋功能处理过的BANLIST："+banlist);
		localStorage.setItem('douban_banlist', JSON.stringify(banlist));
		window.location.reload();
	});//End of 暂时关小黑屋功能LocalStorage

//实际的隐藏工作的核心代码
jQuery.each(banlist,function(index, user){
//console.log('banstats-name: ', name);
	var people=$("div.status-item a[href*='"+user.url+"']");
	people.parent().parent().parent().hide();

//Add hyplink to 过滤器名单
	var name_img="<p><img src='"+user.icon+"'>";
	var name_link="<a href='"+user.url+"'>"+user.name+"</a>";
	var clear_oneperson_ban="<a class='clear_oneperson_ban'>X</a></p>";
	ban_list_content.prepend(name_img+name_link+clear_oneperson_ban);      

});//End of 实际的过滤代码.....就这么一小段而已

	//缓存bancontent-div
	var clear_oneperson_ban=$(".clear_oneperson_ban");
	//删除某个用户的BAN行为
	clear_oneperson_ban.click(function(event){
		// event.stopPropagation();
		// var ifexist=false;
		// var banindex=0;
		// var get_name=$(this).parent().find('a').html();
		// console.log($(this).parent().find('a').html());
		// //取出保存在游览器内的名单,并判断是否存在
		// 		jQuery.each(banlist,function(index, name){
		// 			if(get_name==name){
		// 				ifexist=true;
		// 				banindex=index;//记录INDEX值
		// 			};
		// 		});
		// console.log("判断是否存在的bool:"+ifexist);
		// console.log("PEOPLE:"+get_name);
		// 	if(ifexist==true){
		// 		banlist.splice(banindex, 1);
		// 	}
		// console.log("处理过的BANLIST："+banlist);
		// localStorage.setItem('douban_banlist', JSON.stringify(banlist));
		// $(this).parent().html("");
  // 		window.location.reload();
	});
		
	}
 
} )();
