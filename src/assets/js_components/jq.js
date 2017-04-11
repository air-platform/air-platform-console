;(function($){
	my()
	function my(){
		$("#cvs").outerWidth($("#box").outerWidth())
		$("#cvs").outerHeight($("#box").outerHeight())
		var arr=[];
		var a,b,c,d,e;
		function highlights(){/*移入移除一些样式*/
			$("#left h3").on("mouseover",function(){$(this).addClass("bg")}).on("mouseout",function(){$(this).removeClass("bg")})
			$("#left ul li input").on("mouseover",function(){$(this).addClass("bg")}).on("mouseout",function(){$(this).removeClass("bg")})
			$("#left ul li select").on("mouseover",function(){$(this).addClass("bg")}).on("mouseout",function(){$(this).removeClass("bg")})
			$("#left ul li i").on("mouseover",function(){$(this).addClass("bg")}).on("mouseout",function(){$(this).removeClass("bg")})
			$("#box").on("mouseover",".Enumerationchild h3",function(){$(this).addClass("bg")}).on("mouseout","h3",function(){$(this).removeClass("bg")})
			$("#box").on("mouseover",".Enumerationchild ul input",function(){$(this).addClass("bg")}).on("mouseout",".Enumerationchild ul input",function(){$(this).removeClass("bg")})
			$("#box").on("mouseover",".Enumerationchild ul i",function(){$(this).addClass("bg")}).on("mouseout",".Enumerationchild ul i",function(){$(this).removeClass("bg")}).on("click",".Enumerationchild ul i",function(){$(this).parents("li").remove()})
			$("#box").on("mouseover",".Recordchild h3",function(){$(this).addClass("bg")}).on("mouseout","h3",function(){$(this).removeClass("bg")})
			$("#box").on("mouseover",".Recordchild ul input",function(){$(this).addClass("bg")}).on("mouseout",".Recordchild ul input",function(){$(this).removeClass("bg")})
			$("#box").on("mouseover",".Recordchild ul select",function(){$(this).addClass("bg")}).on("mouseout",".Recordchild ul select",function(){$(this).removeClass("bg")})
			$("#box").on("mouseover",".Recordchild ul i",function(){$(this).addClass("bg")}).on("mouseout",".Recordchild ul i",function(){$(this).removeClass("bg")}).on("click",".Recordchild ul i",function(){$(this).parents("li").remove()})
		}
		highlights()
		function clone(){/*left盒子里的添加删除*/
			$("#clones").on("click",function(){ctx.clearRect(0,0,800,500);
				$('<li>'+'<em><input type="text"></em>'+'<strong>'+'<select name="" id="">'+'<option value="String">String</option>'+'<option value="Integer">Integer</option>'+'<option value="Long">Long</option>'+'<option value="Float">Float</option>'+'<option value="Double">Double</option>'+'<option value="Boolean">Boolean</option>'+'<option value="Bytes">Bytes</option>'+'<option value="Enumeration">Enumeration</option>'+'<option value="Record">Record</option>'+'</select>'+'</strong>'+'<i class="glyphicon glyphicon-remove"></i>'+'</li>').appendTo($("#left ul"));
			});
			$("#left ul").on("click","i",function(){$(this).parents("li").remove();ctx.clearRect(0,0,800,500);})
		}
		clone()
		function juDgement(){
			$("#left ul").on("change","select",function(){/*在这里是创建右边的盒子总共创建两个盒子*/
				ctx.clearRect(0,0,800,500);
				var idx=$(this).parents("li").index();/*如果创建成功的话我们要开始画线  画线 要一个开始的xy坐标和结束点的xy坐标*/
				if($(this).val()=="Enumeration"){
					$(this).parents("li").attr("name","Enumeration");
					if($(this).attr("name","Enumeration")){
						$("#a"+(idx+1)).remove();$("#b"+(idx+1)).remove();
						var ste1=$('<div class="Enumerationchild draFting" id="Enumerationchild">'+'<h3>请双击输入<i class="glyphicon glyphicon-plus"></i></h3>'+'<ul>'+'<li><input type="text" /><i class="glyphicon glyphicon-remove"></i></i></li>'+'<li><input type="text" /><i class="glyphicon glyphicon-remove"></i></i></li>'+'<li><input type="text" /><i class="glyphicon glyphicon-remove"></i></i></li>'+'</ul>'+'</div>');
						ste1.appendTo($(".box"));
						ste1.attr("id","a"+(idx+1));
						var a1=$(this).parents("li").attr("class","a"+(idx+1));
						$(this).parent().next().on("click",function(){$(this).parents("li").remove();$("#a"+(idx+1)).remove()});
						$("#box").on("click","#a"+(idx+1)+" h3 i",function(){$('<li><input type="text" /><i class="glyphicon glyphicon-remove"></i></i></li>').appendTo($(this).parents("h3").next())});
					}
				}else if($(this).val()=="Record"){
					$(this).parents("li").attr("name","Record");
					if($(this).attr("name","Record")){
						$("#a"+(idx+1)).remove();$("#b"+(idx+1)).remove();
						var ste2=$('<div class="Recordchild draFting" id="Recordchild">'+'<h3>请双击输入<i class="glyphicon glyphicon-plus"></i></h3>'+'<ul>'+'<li>'+'<em><input type="text"></em>'+'<strong>'+'<select name="" id="">'+'<option value="String">String</option>'+'<option value="Integer">Integer</option>'+'<option value="Long">Long</option>'+'<option value="Float">Float</option>'+'<option value="Double">Double</option>'+'<option value="Boolean">Boolean</option>'+'<option value="Bytes">Bytes</option>'+'<option value="Enumeration">Enumeration</option>'+'<option value="Record">Record</option>'+'</select>'+'</strong>'+'<i class="glyphicon glyphicon-remove"></i>'+'</li>'+'</ul>'+'</div>');
						ste2.appendTo($("#box"));
						ste2.attr("id","b"+(idx+1));
						var b1=$(this).parents("li").attr("class","b"+(idx+1));
						$(this).parent().next().on("click",function(){$(this).parents("li").remove();$("#b"+(idx+1)).remove()});
						$("#box").on("click","#b"+(idx+1)+" h3 i",function(){$('<li>'+'<em><input type="text"></em>'+'<strong>'+'<select name="" id="">'+'<option value="String">String</option>'+'<option value="Integer">Integer</option>'+'<option value="Long">Long</option>'+'<option value="Float">Float</option>'+'<option value="Double">Double</option>'+'<option value="Boolean">Boolean</option>'+'<option value="Bytes">Bytes</option>'+'<option value="Enumeration">Enumeration</option>'+'<option value="Record">Record</option>'+'</select>'+'</strong>'+'<i class="glyphicon glyphicon-remove"></i>'+'</li>').appendTo($(this).parents("h3").next())});
					}
				}else{$("#a"+(idx+1)).remove();$("#b"+(idx+1)).remove();$(this).parents("li").attr("class","");}
			})
			 
		}
		juDgement()
		function Moappend(){/*这里是默认的ol----》li里面的东西是系统自动生成   如果值为Enumeration或Record就往里面追加div*/
			$.each($("#left ol li"),function(i,val){
				if($(this).find("select").val()=="Enumeration"){
					$('<div class="Enumerationchild draFting" id="a0">'+'<h3>请双击输入<i class="glyphicon glyphicon-plus"></i></h3>'+'<ul>'+'<li><input type="text" /><i class="glyphicon glyphicon-remove"></i></i></li>'+'<li><input type="text" /><i class="glyphicon glyphicon-remove"></i></i></li>'+'<li><input type="text" /><i class="glyphicon glyphicon-remove"></i></i></li>'+'</ul>'+'</div>').appendTo($(".box"));
				}else if($(this).find("select").val()=="Record"){
					$('<div class="Recordchild draFting" id="b0">'+'<h3>请双击输入<i class="glyphicon glyphicon-plus"></i></h3>'+'<ul>'+'<li>'+'<em><input type="text"></em>'+'<strong>'+'<select name="" id="">'+'<option value="String">String</option>'+'<option value="Integer">Integer</option>'+'<option value="Long">Long</option>'+'<option value="Float">Float</option>'+'<option value="Double">Double</option>'+'<option value="Boolean">Boolean</option>'+'<option value="Bytes">Bytes</option>'+'<option value="Enumeration">Enumeration</option>'+'<option value="Record">Record</option>'+'</select>'+'</strong>'+'<i class="glyphicon glyphicon-remove"></i>'+'</li>'+'</ul>'+'</div>').appendTo($("#box"));
				}
			})
		}
		Moappend()
		function buer(){ 
			$.each($("#left ol li"),function(i,val){
				if($(this).find("select").val()=="Enumeration")
				{
					$(this).attr("name","Enumeration")

				} else if($(this).find("select").val()=="Record")
				{
					$(this).attr("name","Record")
				}
			})
		}
		buer()
        function  draFting(){/*拖拽所有的盒子*/
			$("#box").on("mousedown",".draFting",function(e){
				$(this).css({"z-index":1000,"opacity":1}).siblings().css({"z-index":100,"opacity":0.5})
				var oevent=e||window.event
				var L=oevent.clientX-$(this).position().left
				var T=oevent.clientY-$(this).position().top
				var that=$(this);
				var opt=that.attr("id");
				$(document).on("mousemove",function(ev){
					var aevent=ev||window.event
					var left=aevent.clientX-L
					var top=aevent.clientY-T
					if(left<0){left=0}else if(left>$("#box").outerWidth()-that.outerWidth()){left=$("#box").outerWidth()-that.outerWidth()}
					if(top<0){top=0}else if(top>$("#box").outerHeight()-that.outerHeight()){top=$("#box").outerHeight()-that.outerHeight()}
					that.css("left",left)
					that.css("top",top);
					arr[0]=$("#left").outerWidth()+$("#left").position().left;
					arr[1]=$("#moren").offset().top-$("#box").offset().top+15;
					ctx.clearRect(0,0,800,500);
					var line=new Line(arr[0],arr[1],arr[2],arr[3]);line.drawWithArrowheads(ctx);/*调用*/
					var a=$(that).attr("id")
					if(that.attr("id")=="left"){
						ctx.clearRect(0,0,800,500);
						/*var line=new Line(arr[0],arr[1],arr[2],arr[3]);line.drawWithArrowheads(ctx);调用*/
					}else if(that.attr("id")=="a0"){
						arr[2]=that.position().left
						arr[3]=that.position().top+20
						ctx.clearRect(0,0,800,500)
						var line=new Line(arr[0],arr[1],arr[2],arr[3]);line.drawWithArrowheads(ctx);/*调用*/
					}else{
						arr[1]=$("."+opt+"").offset().top-$("#box").offset().top+15;
						ctx.clearRect(0,0,800,500)
						arr[2]=that.position().left
						arr[3]=that.position().top+20
						ctx.clearRect(0,0,800,500)
						var line=new Line(arr[0],arr[1],arr[2],arr[3]);line.drawWithArrowheads(ctx);/*调用*/
					}
				})
				$(document).on("mouseup",function(){
					$(that).css({"opacity":1});
					$(".draFting").each(function(i,val){
						if($(this).attr("id")=="left"){} else{
							 a=$(this).attr("id");/*显示出来的每个id*/
							 b=$(this).position().left/*显示出来的id名和他自己对应的left*/
							 c=$(this).position().top+20/*显示出来的id名和他自己对应的top*/
							 d=$("#left").outerWidth()+$("#left").position().left;
							 e=$("."+a+"").offset().top-$("#box").offset().top+15;
							console.log(a+"------"+b+"------"+c+"------"+d+"------"+e)
							var line=new Line(b,c,d,e);line.drawWithArrowheads(ctx);
						}
					});
					$(this).off("mousemove")
				})
			})
		}
		draFting();
	};
})(jQuery)