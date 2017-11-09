$(function(){
//	--------------------首页-----------------------------
	//首页swiper 调用
	var swiper = new Swiper('.swiper-container', {
      spaceBetween: 30,
      centeredSlides: true,
      observer:true,
      observeParents:true,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false
      }
    });
    //点击 返回首页 跳转到首页
    $(".backToIndex").click(function(){
		//再次初始化swiper
		var swiper = new Swiper('.swiper-container', {
	      spaceBetween: 30,
	      centeredSlides: true,
	      observer:true,
	      observeParents:true,
	      autoplay: {
	        delay: 6000,
	        disableOnInteraction: false
	      }
	    });
    });
    //点击首页任意位置，跳转到登录页
    $(".mainIndex").click(function(){
    	window.location.href = "login.html";
    });
//	-----------------------登录页--------------------------------------
    //登录 ajax 请求
    function loginFun(){
    	var username = $("#userName").val();
    	//设置cookie 工号
    	$.cookie('username', username, {
    		expires: 7,
    		path: '/' 
    	});
    	if(userName == ""){
    		alert("请输入工号！");
    		return false;
    	}else{
    		//window.location.href = "allData.html";
	    	$.ajax({
	    		type:"get",
	    		url:"http://bpmdev.boe.com.cn/boePortalIntegrator/freqDraft/getUserName",
	    		data:{
	    			username:username
	    		},
	    		dataType: "jsonp",
	    		jsonp:"jsonp",
	    		success:function(data,status){
			 		// 判断用户工号是否存在
			 		var userName = data.userName; 
				  	if(userName){
				  		//如果用户的工号存在
				  		//设置cookie 用户名
				    	$.cookie('userName', userName, {
				    		expires: 7,
				    		path: '/' 
				    	});
				  		window.location.href = "allData.html" ;
				  	}else{
				  		//如果用户的工号不存在
				  		alert("您输入的工号不存在，请重新输入！");
				  	}
	    		},
	    		error:function(data,status){
	    			alert("数据请求错误，请稍候重试！");
	    		}
	    	});
    	}
    }
    $("#submitBtn").click(function(){	
    	loginFun();
    });
    //工号键盘事件
    $("#userName").keydown(function(event){
    	if(event.keyCode == 13){
    		loginFun();
    	}
	});
//	-------------------------个人数据展示--------------------------------
    //获取 默认时间，根据默认时间截取默认值
   var selectTime = $("#selectTime").val();
   var startTime = selectTime.slice(0,7);
   $("#startTime").val(startTime);
   var endTime = selectTime.slice(10,18);
   $("#endTime").val(endTime);
//	laydate
	laydate.render({ 
		elem: '#selectTime',
		type: 'month',
		theme: '#313235',
		value: '2012-01 至 2017-12',
		range:'至',
		  // 控件选择完毕后回调函数
		done: function(value){
			//重置检索的时间
			$("#selectTime").val(value);
			selectTime = $("#selectTime").val();
			//重置开始时间
			startTime = selectTime.slice(0,7);
			$("#startTime").val(startTime);
			startTime = $("#startTime").val();
			//重置结束时间
			endTime = selectTime.slice(10,18);
			$("#endTime").val(endTime);
			endTime = $("#endTime").val();
	  	}
	});
	//点击出现检索筛选
	$(".BPMzj em").click(function(){
		$(this).parent().hide();
		$(".dataSearch_bg,.dataSearch").show();
	});
	 //点击隐藏检索筛选框
	$(".dataSearchCon em,#cancelClick").click(function(){
		$(".BPMzj").show();
		$(".dataSearch_bg,.dataSearch").hide();
	}); 
	//动态生成 starBg 下 的 li
	function starBgLine(){
		for(var s = 0; s < 5; s++){
			var starBgLi = "<li></li>";  
			$(".starBg ul").append(starBgLi);
		}
	}
    //个人数据ajax 请求
    var username = $.cookie('username');
    var userName = $.cookie('userName');
    $(".mainTitle p span").html('');
    $(".mainTitle p span").html(userName);
    personageData();
    function personageData(){
		$.ajax({
			type:"get",
			url:"http://bpmdev.boe.com.cn/boePortalIntegrator/freqDraft/getPersonalBPMInfo",
			data:{
				username:username
			},
			dataType: "jsonp",
			jsonp:"jsonp",
			success:function(data,status){
				starBgLine();
				var data = data;
				//如果帐号没有数据，则提示没有数据
				if($.isEmptyObject(data)){
					$(".BPMslot_bg,.BPMslot").hide();
					console.log("该账户没有数据");
				}else{
					//处理时间格式  起草第一个审批单的时间  2017-06-26T02:41:35Z
					if(data.firstDraftProcessTime == null){
						var firstDraftTime = data.firstDraftProcessTime;
						firstDraftTime = 0;
					}else{
						var firstDraft = data.firstDraftProcessTime.slice(0,16);
						var firstDraftYear= firstDraft.slice(0,4);//年
		                var firstDraftMonth=firstDraft.slice(5,7);//月
		                var firstDraftDate=firstDraft.slice(8,10);//日
		                var firstDraftHour=firstDraft.slice(11,13);//小时
		                var firstDraftMinute=firstDraft.slice(14,16);//分
		                var firstDraftTime = firstDraftYear+'年'+firstDraftMonth+'月'+firstDraftDate+'日'+firstDraftHour+'时'+firstDraftMinute+'分';
					}
	                //处理时间格式 -办理任务平均耗时 handleTaskAverageTime  1500000ms
	                if(data.handleTaskAverageTime == null){
	                	var handleTaskTimes = data.handleTaskAverageTime; 
	                	handleTaskTimes = 0;
	                }else{
		                var handleTask = data.handleTaskAverageTime/1000;
						var handleTaskDays = handleTask/60/60/24;
						var daysRound= Math.floor(handleTaskDays);
						var handleTaskHours = handleTask/60/60 - (24 * daysRound);
						var hoursRound= Math.floor(handleTaskHours);
						var handleTaskMinutes= handleTask/60-(24 * 60 * daysRound)-(60 * hoursRound);
						var minutesRound = Math.floor(handleTaskMinutes);
						var handleTaskSeconds = (handleTask-(24 * 60 * 60 * daysRound)-(60 * 60 * hoursRound)-(60 * minutesRound)).toFixed(0);
						//判断天数是否为0
						var handleTaskTimes = daysRound+'日'+hoursRound+'时'+minutesRound+'分'+handleTaskSeconds+'秒';
						if(daysRound>0){
							handleTaskTimes = daysRound+'日'+hoursRound+'时'+minutesRound+'分'+handleTaskSeconds+'秒';
						}else{
							if(hoursRound>0){
								handleTaskTimes = hoursRound+'时'+minutesRound+'分'+handleTaskSeconds+'秒';
							}else{
								if(minutesRound>0){
									handleTaskTimes = minutesRound+'分'+handleTaskSeconds+'秒';
								}else{
									handleTaskTimes = handleTaskSeconds+'秒';
								}
							}
						}
	                }
					//处理时间格式 -审批最长时间审批单耗时 longestTimeProcessCost  360000000ms
					if(data.longestTimeProcessCost == null){
						var longestTimes = data.longestTimeProcessCost;
						longestTimes = 0;
					}else{
		                var longestTime = data.longestTimeProcessCost/1000;
						var longestDays = longestTime/60/60/24;
						var daysRound= Math.floor(longestDays);
						var longestHours = longestTime/60/60 - (24 * daysRound);
						var hoursRound= Math.floor(longestHours);
						var longestMinutes= longestTime/60-(24 * 60 * daysRound)-(60 * hoursRound);
						var minutesRound = Math.floor(longestMinutes);
						var longestSeconds = (longestTime-(24 * 60 * 60 * daysRound)-(60 * 60 * hoursRound)-(60 * minutesRound)).toFixed(0);
						//判断天数是否为0
						var longestTimes = daysRound+'日'+hoursRound+'时'+minutesRound+'分'+longestSeconds+'秒';
						if(daysRound>0){
							longestTimes = daysRound+'日'+hoursRound+'时'+minutesRound+'分'+longestSeconds+'秒';
						}else{
							if(hoursRound>0){
								longestTimes = hoursRound+'时'+minutesRound+'分'+longestSeconds+'秒';
							}else{
								if(minutesRound>0){
									longestTimes = minutesRound+'分'+longestSeconds+'秒';
								}else{
									longestTimes = longestSeconds+'秒';
								}
							}
						}
					}
					//处理时间格式  审批时间最长审批单开始时间  2017-06-26T02:41:35Z
					if(data.startLongestTimeProcess==null){
						var startLongestTime = data.startLongestTimeProcess; 
						startLongestTime = 0;
					}else{
						var startLongest = data.startLongestTimeProcess.slice(0,16);
						var startLongestYear= startLongest.slice(0,4);//年
		                var startLongestMonth=startLongest.slice(5,7);//月
		                var startLongestDate=startLongest.slice(8,10);//日
		                var startLongestHour=startLongest.slice(11,13);//小时
		                var startLongestMinute=startLongest.slice(14,16);//分
		                var startLongestTime = startLongestYear+'年'+startLongestMonth+'月'+startLongestDate+'日'+startLongestHour+'时'+startLongestMinute+'分';
					}
	                //处理时间格式  审批时间最长审批单结束时间  2017-06-26T02:41:35Z
	                if(data.endLongestTimeProcess==null){
	                	var endLongestTime = data.endLongestTimeProcess; 
	                	endLongestTime = 0;
	                }else{
						var endLongest = data.endLongestTimeProcess.slice(0,16);
						var endLongestYear= endLongest.slice(0,4);//年
		                var endLongestMonth=endLongest.slice(5,7);//月
		                var endLongestDate=endLongest.slice(8,10);//日
		                var endLongestHour=endLongest.slice(11,13);//小时
		                var endLongestMinute=endLongest.slice(14,16);//小时
		                var endLongestTime = endLongestYear+'年'+endLongestMonth+'月'+endLongestDate+'日'+endLongestHour+'时'+endLongestMinute+'分';
	                }
	                //判断数据是否为空
					//第二条数据
					if(data.sumDraftProcess == null){
						data.sumDraftProcess = 0;
					}
					if(data.sumTodoProcess == null){
						data.sumTodoProcess = 0;
					}
					if(data.yearSumDraftProcess == null){
						data.yearSumDraftProcess = 0;
					}
					if(data.yearSumTodoProcess == null){
						data.yearSumTodoProcess = 0;
					}
					 //定义追加的内容
					var BPMcontent = "<p class='bcOne'><em></em><a href='javascript:;' ></a><span>你在BPM起草的第一个审批单是"+firstDraftTime+"提交的《"+data.firstDraftProcessName+"》</span></p>"+
						"<p class='bcTwo'><em></em><a href='javascript:;'></a><span>截止到2017年11月30日，你在BPM上一共起草了"+
						data.sumDraftProcess+"个审批单，审批了"+data.sumTodoProcess+"个审批单</span></p>"+
						"<p class='bcThree'><em></em><a href='javascript:;'></a><span>近一年，起草了"+data.yearSumDraftProcess+"个审批单，审批了"+data.yearSumTodoProcess+"个审批单</span></p>"+
						"<p class='bcFour'><em></em><a href='javascript:;'></a><span>你使用最频繁的审批单Top3分别是："+
							"<b><i>"+data.firstUsedProcess+"</i><i>"+data.sumFirstUsedProcess+"</i></b>"+
							"<b><i>"+data.secondUsedProcess+"</i><i>"+data.sumSecondUsedProcess+"</i></b>"+
							"<b><i>"+data.thirdUsedProcess+"</i><i>"+data.sumThirdUsedProcess+"</i></b></span></p>"+
						"<p class='bcFive'><em></em><a href='javascript:;'></a><span>你办理审批平均耗时"+handleTaskTimes+"，你的处理效率在全公司排名"+data.handleTaskRanking+"</span></p>"+
						"<p class='bcSix'><em></em><a href='javascript:;'></a><span>与你相关的审批单中，审批时间最长的一个是《"+data.longestTimeProcess+"》，提交审批时间是"+startLongestTime+"，结束审批时间是"+endLongestTime+"，共历时"+longestTimes+"</span></p>";
					$(".BPMcontent").append(BPMcontent);
					//起草的第一个审批单如果为空
					if(data.firstDraftProcessName==null){
						$(".BPMcontent").find('p.bcOne').children('span').html('');
						$(".BPMcontent").find('p.bcOne').children('span').html('很遗憾，你在BPM暂未起草过审批单');
					}
					//你使用最频繁的审批单Top3 如果数据不足三条
					if(data.firstUsedProcess==null){
						$(".BPMcontent").find('p.bcFour b').html('');
						$(".BPMcontent").find('p.bcFour span').html('你使用最频繁的审批单Top3分别是：<b>很遗憾，你在BPM暂未起草过审批单</b>');
					}else if(data.secondUsedProcess==null){
						$(".BPMcontent").find('b:eq(1)').html('');
						$(".BPMcontent").find('b:eq(2)').html('');
					}else if(data.thirdUsedProcess == null){
						$(".BPMcontent").find('b:eq(2)').html('');
					}
					//如果处理时间或者排名为null
					if(handleTaskTimes == null || data.handleTaskRanking == null){
						$(".BPMcontent").find('p.bcFive span').html('');
						$(".BPMcontent").find('p.bcFive span').html('很遗憾，你在BPM暂未审批过审批单');
					}
					//如果最长的审批单为null
					if(data.longestTimeProcess== null ){
						$(".BPMcontent").find('p.bcSix span').html('');
						$(".BPMcontent").find('p.bcSix span').html('很遗憾，你在BPM暂未审批过审批单');
					}
				}
				//document.domain='boe.com.cn';
			},
			error:function(data,ststus){
				alert("数据错误，请稍后重试");
			}
		});
    }
	//个人数据检索
	 function personageCheckData(){
	 	var startTime = $("#startTime").val();
	 	var endTime = $("#endTime").val();
	 	var checkStartTime = $("#startTime").val().slice(0,4) + "年" + $("#startTime").val().slice(5,7) + "月";
	 	var checkEndTime = $("#endTime").val().slice(0,4) + "年" + $("#endTime").val().slice(5,7) + "月";
		$.ajax({
			type:"get",
			//url:"http://bpm.boe.com.cn/boePortalIntegrator/freqDraft/getPersonalBPMInfo",
			url:"http://bpmdev.boe.com.cn/boePortalIntegrator/freqDraft/getPersonalBPMInfo",
			data:{
				username:username,
				startTime:startTime,
				endTime:endTime
			},
			dataType: "jsonp",
			jsonp:"jsonp",
			success:function(data,status){
				starBgLine();
				var data = data;
				//如果帐号没有数据，则提示没有数据
				if($.isEmptyObject(data)){
					$(".BPMslot_bg,.BPMslot").hide();
					console.log("该账户没有数据");
				}else{
					//处理时间格式 -审批最长时间审批单耗时 longestTimeProcessCost  360000000ms
					if(data.longestTimeProcessCost == null){
						var longestTimes = data.longestTimeProcessCost;
						longestTimes = 0;
					}else{
		                var longestTime = data.longestTimeProcessCost/1000;
						var longestDays = longestTime/60/60/24;
						var daysRound= Math.floor(longestDays);
						var longestHours = longestTime/60/60 - (24 * daysRound);
						var hoursRound= Math.floor(longestHours);
						var longestMinutes= longestTime/60-(24 * 60 * daysRound)-(60 * hoursRound);
						var minutesRound = Math.floor(longestMinutes);
						var longestSeconds = (longestTime-(24 * 60 * 60 * daysRound)-(60 * 60 * hoursRound)-(60 * minutesRound)).toFixed(0);
						//判断天数是否为0
						var longestTimes = daysRound+'日'+hoursRound+'时'+minutesRound+'分'+longestSeconds+'秒';
						if(daysRound>0){
							longestTimes = daysRound+'日'+hoursRound+'时'+minutesRound+'分'+longestSeconds+'秒';
						}else{
							if(hoursRound>0){
								longestTimes = hoursRound+'时'+minutesRound+'分'+longestSeconds+'秒';
							}else{
								if(minutesRound>0){
									longestTimes = minutesRound+'分'+longestSeconds+'秒';
								}else{
									longestTimes = longestSeconds+'秒';
								}
							}
						}
					}
					//处理时间格式  审批时间最长审批单开始时间  2017-06-26T02:41:35Z
					if(data.startLongestTimeProcess==null){
						var startLongestTime = data.startLongestTimeProcess; 
						startLongestTime = 0;
					}else{
						var startLongest = data.startLongestTimeProcess.slice(0,16);
						var startLongestYear= startLongest.slice(0,4);//年
		                var startLongestMonth=startLongest.slice(5,7);//月
		                var startLongestDate=startLongest.slice(8,10);//日
		                var startLongestHour=startLongest.slice(11,13);//小时
		                var startLongestMinute=startLongest.slice(14,16);//分
		                var startLongestTime = startLongestYear+'年'+startLongestMonth+'月'+startLongestDate+'日'+startLongestHour+'时'+startLongestMinute+'分';
					}
	                //处理时间格式  审批时间最长审批单结束时间  2017-06-26T02:41:35Z
	                if(data.endLongestTimeProcess==null){
	                	var endLongestTime = data.endLongestTimeProcess; 
	                	endLongestTime = 0;
	                }else{
						var endLongest = data.endLongestTimeProcess.slice(0,16);
						var endLongestYear= endLongest.slice(0,4);//年
		                var endLongestMonth=endLongest.slice(5,7);//月
		                var endLongestDate=endLongest.slice(8,10);//日
		                var endLongestHour=endLongest.slice(11,13);//小时
		                var endLongestMinute=endLongest.slice(14,16);//小时
		                var endLongestTime = endLongestYear+'年'+endLongestMonth+'月'+endLongestDate+'日'+endLongestHour+'时'+endLongestMinute+'分';
	                }
	                //判断数据是否为空
					//第二条数据
					if(data.sumDraftProcess == null){
						data.sumDraftProcess = 0;
					}
					if(data.sumTodoProcess == null){
						data.sumTodoProcess = 0;
					}
					if(data.yearSumDraftProcess == null){
						data.yearSumDraftProcess = 0;
					}
					if(data.yearSumTodoProcess == null){
						data.yearSumTodoProcess = 0;
					}
					 //定义追加的内容
					var BPMcontent = "<p class='bcOne'><em></em><a href='javascript:;' ></a><span>在"+ checkStartTime +"到"+ checkEndTime +"时间内，你在BPM上一共起草了"+ data.sumDraftProcess +"个审批单</span></p>"+
						"<p class='bcTwo'><em></em><a href='javascript:;'></a><span>在"+ checkStartTime +"到"+ checkEndTime +"时间内，你在BPM上审批了"+ data.sumTodoProcess +"个审批单</span></p>"+
						"<p class='bcThree'><em></em><a href='javascript:;'></a><span>在"+ checkStartTime +"到"+ checkEndTime +"时间内，你使用最频繁的审批单Top1是：<b><i>"+data.firstUsedProcess+"</i><i>"+data.sumFirstUsedProcess+"</i></b></span></p>"+
						"<p class='bcFour'><em></em><a href='javascript:;'></a><span>在"+ checkStartTime +"到"+ checkEndTime +"时间内，你使用最频繁的审批单Top2是：<b><i>"+data.secondUsedProcess+"</i><i>"+data.sumSecondUsedProcess+"</i></b></span></p>"+
						"<p class='bcFive'><em></em><a href='javascript:;'></a><span>在"+ checkStartTime +"到"+ checkEndTime +"时间内，你使用最频繁的审批单Top3是：<b><i>"+data.thirdUsedProcess+"</i><i>"+data.sumThirdUsedProcess+"</i></b></span></p>"+
						"<p class='bcSix'><em></em><a href='javascript:;'></a><span>在"+ checkStartTime +"到"+ checkEndTime +"时间内，与你相关的审批单中，审批时间最长的一个是《"+data.longestTimeProcess+"》，提交审批时间是"+startLongestTime+"，结束审批时间是"+endLongestTime+"，共历时"+longestTimes+"</span></p>";
					$(".BPMcontent").append(BPMcontent);
					//你使用最频繁的审批单Top3 如果数据不足三条
					if(data.firstUsedProcess==null){
						$(".BPMcontent").find('p.bcThree b,p.bcFour b,p.bcFive b').html('');
						$(".BPMcontent").find('p.bcThree b').html('很遗憾，你在该时间段暂未起草过审批单');
						$(".BPMcontent").find('p.bcFour b').html('很遗憾，你在该时间段暂未起草过审批单');
						$(".BPMcontent").find('p.bcFive b').html('很遗憾，你在该时间段暂未起草过审批单');
					}else if(data.secondUsedProcess==null){
						$(".BPMcontent").find('p.bcFour b,p.bcFive b').html('');
						$(".BPMcontent").find('p.bcFour b').html('很遗憾，你在该时间段暂未起草过审批单');
						$(".BPMcontent").find('p.bcFive b').html('很遗憾，你在该时间段暂未起草过审批单');
					}else if(data.thirdUsedProcess == null){
						$(".BPMcontent").find('p.bcFive b').html('');
						$(".BPMcontent").find('p.bcFive b').html('很遗憾，你在该时间段暂未起草过审批单');
					}
					//如果最长的审批单为null
					if(data.longestTimeProcess== null ){
						$(".BPMcontent").find('p.bcSix span').html('');
						var longestHtml = "很遗憾，你在" + checkStartTime +"到"+ checkEndTime +"时间内，暂未起草过审批单";
						$(".BPMcontent").find('p.bcSix span').html("很遗憾，你在" + checkStartTime +"到"+ checkEndTime +"时间内，暂未起草过审批单");
					}
				}
				//document.domain='boe.com.cn';
			},
			error:function(data,ststus){
				alert("数据错误，请稍后重试");
			}
		});
    }
	//检索点击确定后，部分个人数据展示 ajax
	$("#sureClick").click(function(){
		//先清空数据
		$(".BPMslot").removeClass("BPMStarShow");
		$(".BPMcontent,.starBg ul").html("");
		$(".BPMzj").show();
		$(".dataSearch_bg,.dataSearch").hide();
		$(".BPMslot").addClass("BPMStarShow");
		$(".mainTitle h2").html("");
		$(".mainTitle h2").html("个人数据检索展示");
		personageCheckData();
	});
});
