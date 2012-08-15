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
	var datatypehash={3043:"推荐单曲",1025:"上传照片",1026:"相册推荐",1013:"推荐小组话题",1018:"我说",1015:"推荐/新日记",1022:"推荐网址",1012:"推荐书评",1002:"看过电影",3049:"读书笔记",1011:"活动兴趣",3065:"东西",1001:"想读/读过",1003:"想听/听过"};
//====================================================================
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
	reshare_btn.each(function(){
		var hd=$(this).parent().parent().parent().parent();
		var user_url=hd.find("div.hd>a").attr("href");
		if(user_url==undefined){

		}else{
			$(this).after("&nbsp;&nbsp;<a class='ban_temply_btn'>暂时关到小黑屋</a>");
		}
	});

	//在Action条下运行的，暂时关小黑屋功能
	ban_temply_btn=$("a.ban_temply_btn");
	ban_temply_btn.click(function(event){
		
		//这里的代码逻辑没有任何问题，只在有HD的情况下出现
		//功能按钮，并抽取用户信息，问题出在过滤那部分
		var hd=$(this).parent().parent().parent().parent();
		//console.log("谁发起的该点击？"+hd.html());
		var message_url=hd.find("div.bd a:eq(1)").attr("href");
		var user_url=hd.find("div.hd>a").attr("href");
		var user_uid=user_url.slice(29,-1);
		var user_name=hd.find("div.hd>a").attr("title");
		var user_icon=hd.find("div.hd>a>img").attr("src");
		var data_type=hd.attr("data-object-kind");
		console.log(message_url);
		console.log(data_type);
		console.log(user_url);
		console.log(user_uid);
		console.log(user_name);
		console.log(user_icon);
		var user=new Object();
		user.url=user_url;
		user.uid=user_uid;
		user.name=user_name;
		user.icon=user_icon;
		user.data_type=data_type;

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
//精确定位到用户的超链接而非头像处
var people=$("div.status-item p.text a[href*='"+user.url+"']");
//console.log(people.parent().parent().parent().html());
//people.parent().parent().parent().parent(['data-object-kind=1022']).hide();
//console.log(people.parent().parent().parent().parent());
people.parent().parent().parent().parent("[data-object-kind='"+user.data_type+"']").hide();

//Add hyplink to 过滤器名单
	var name_img="<p><img src='"+user.icon+"'>";
	var name_link="<a href='"+user.url+"'>"+user.name+"</a>";
	var action=datatypehash[user.data_type]==undefined?user.data_type:datatypehash[user.data_type];
	//console.log(action);
	var data_type="&nbsp;只屏蔽了该用户的<span>"+action+"</span>"
	var clear_oneperson_ban="<a class='clear_oneperson_ban'>X</a></p>";
	ban_list_content.prepend(name_img+name_link+data_type+clear_oneperson_ban);      

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
