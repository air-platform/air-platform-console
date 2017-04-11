
(function () {
    'use strict';

    angular.module('iot').controller('SdkEditNotificationCtrl', SdkEditNotificationCtrl);

    /** @ngInject */
    function SdkEditNotificationCtrl($scope, $uibModal,logger, $log, $state, $stateParams,StorageService, NetworkService, constdata, toastr,UserInfoServer) {
        /* jshint validthis: true */
        var vm = this;
        //接收的参数
        var argsProduct = $stateParams.args.product;
        var argsSdk = $stateParams.args.sdk;
        var ProductName = argsProduct.name;
        //var canvas = new draw2d.Canvas("gfx_holder_notification");
        var figure1 = null;

        vm.enumProList = [];
        vm.myProData = [];

        //canvas.installEditPolicy(Draw2dConnection);
        //canvas.uninstallEditPolicy(new draw2d.policy.canvas.DefaultKeyboardPolicy());
        
       /*// getProData();
        //保存数据
        vm.saveNotification = function() {
            var schemaData = figure1.collectData();
            if(schemaData&&schemaData.isValid) {
                var savedData = {
                    "schema":JSON.stringify(schemaData.data)
                };
                var submitData = function() {
                    NetworkService.put(constdata.api.product.notificationUpdatePath+'/'+argsProduct.name+'/profiles/v'+argsSdk.version+'/schemas/notification',savedData,function (response) {  
                        // console.log('modify success');
                        toastr.success('修改成功!');
                    },function (response) {
                        toastr.error('修改失败!');
                        console.log('Error');
                        console.log(response);
                        // console.log('Status' + response.status);
                    });
                }
                submitData();
            } else {
                //不合法
                console.log(schemaData);
                toastr.error("数据不合法，请检查");
            }
        }*/


        function submitData2(savedData) {
                    NetworkService.put(constdata.api.product.notificationUpdatePath+'/'+argsProduct.name+'/profiles/v'+argsSdk.version+'/schemas/notification',savedData,function (response) {  
                        // console.log('modify success');
                        toastr.success('修改成功!');
                    },function (response) {
                        toastr.error('修改失败!');
                        // console.log('Error');
                        // console.log(response);
                        // console.log('Status' + response.status);
                    });
        }



        var token = StorageService.get('iot.hnair.cloud.access_token');
        if (token){
            logger.debug(token);
            // $http.defaults.headers.common['Authorization'] = token;
            token = 'Bearer ' + token;
        }
        // console.log(token)

        





        function getProData() {
            NetworkService.get(constdata.api.product.notificationInfoPath+'/'+argsProduct.name+'/profiles/v'+argsSdk.version+'/schemas/notification',null,function (response) {
                //监听数据变化
                vm.responseObj = response.data;
                vm.profileInfo = JSON.parse(response.data.schema);
                //console.log(vm.profileInfo);
                createShape(vm.profileInfo);
            },function (response) {
                console.log('Error');
                console.log('Status' + response.status);
            });
        }/**/

       // function createShape(data) {
         //   figure1 = new RecordShape({
        //        x: 150,
        //        y: 50,
        //        data: data,
        //        settings: {
         //           isFirstShape: true,
         //           tipInfo: constdata.draw2dtipInfo
                    // ,tableCols: 5,
          //          // tabelCellText: ['新列']
          //      },
          //      myCanvas: canvas
          //  });
          //  canvas.add(figure1);
      //  }


        
        /*  回复原始默认数据
            var ob={
                "schema": {
                    "type":"record",
                    "name":"DeviceProfile",
                    "namespace":"com.hnair.iot.bee.client.song.profile",
                    "fields":[
                        {"name":"serialNumber","type":"string","scope":"system"},
                        {"name":"name","type":"string","scope":"system"},
                        {"name":"os","type":"string","scope":"system"},
                        {"name":"description","type":"string","scope":"system"},
                        {
                            "name":"networkType","scope":"system",
                            "type":{
                                "type":"enum","name":"NetworkType",
                                "symbols":["WiFi","Cellular","Ethernet","Bluetooth","Other"]
                            }
                        }
                    ]
                }
            }





            $("#dd").on("click",function(){
                var sob={"schema":JSON.stringify(ob.schema)}

            var rData = sob;
                                    console.log(rData);
                                    submitData2(rData);
        })
        */
        var str={
            "left":'<p names="user"><input type="text" class="form-control"><select name="" id=""><option value="String" selected>String</option><option value="Integer">Integer</option><option value="Long">Long</option><option value="Float">Float</option><option value="Double">Double</option><option value="Boolean">Boolean</option><option value="Bytes">Bytes</option><option value="Enumeration">Enumeration</option><option value="Record">Record</option></select><i class="glyphicon glyphicon-remove"></i></p>',
            "Recordchild":'<p><input type="text" class="form-control"><select name=""><option value="String" selected>String</option><option value="Integer">Integer</option><option value="Long">Long</option><option value="Float">Float</option><option value="Double">Double</option><option value="Boolean">Boolean</option><option value="Bytes">Bytes</option></select><i class="glyphicon glyphicon-remove"></i></p>',
             "Enumerationchild":'<p><input type="text" class="form-control"><i class="glyphicon glyphicon-remove"></i></p>',
             "tith3":'<div class="tith3"><input type="text" class="form-control" style="background:#1DAEEF;" placeholder="Username"><i class="glyphicon glyphicon-plus" id="clones"></i></div>'
        };
        var options={
            "string":"String",
            "int":"Integer",
            "long":"Long",
            "float":"Float",
            "double":"Double",
            "boolean":"Boolean",
            "bytes":"Bytes",
            "enum":"Enumeration",
            "record":"Record"
        }
        function Line(x1,y1,x2,y2){
            this.x1=x1;
            this.y1=y1;
            this.x2=x2;
            this.y2=y2;
        }
        Line.prototype.drawWithArrowheads=function(ctx){
            // arbitrary styling
            ctx.strokeStyle="#3879d9";
            ctx.fillStyle="#3879d9";
            ctx.lineWidth=1;
            // draw the line
            ctx.beginPath();
            ctx.moveTo(this.x1,this.y1);
            ctx.lineTo(this.x2,this.y2);
            ctx.stroke();
            // draw the starting arrowhead
            var startRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
            startRadians+=((this.x2>this.x1)?-90:90)*Math.PI/180;
            this.drawArrowhead(ctx,this.x1,this.y1,startRadians);
            // draw the ending arrowhead
            var endRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
            endRadians+=((this.x2>this.x1)?90:-90)*Math.PI/180;
            this.drawArrowhead(ctx,this.x2,this.y2,endRadians);
        }
        Line.prototype.drawArrowhead=function(ctx,x,y,radians){
            ctx.save();
            ctx.beginPath();
            ctx.translate(x,y);
            ctx.rotate(radians);
            ctx.moveTo(0,0);
            ctx.lineTo(5,20);
            ctx.lineTo(-5,20);
            ctx.closePath();
            ctx.restore();
            ctx.fill();
        }
        var canvas=document.getElementById("cvs");
        var ctx=canvas.getContext("2d");

        var arrClass=[];/*用于存放left盒子里所有动态添加的class名字*/

        var BASE_API_URL = constdata.apiHost_ONLINE;
        if (constdata.debugMode){
            BASE_API_URL = constdata.apiHost_OFFLINE;
        };
        $.ajax({
            url:BASE_API_URL+constdata.api.product.notificationInfoPath+'/'+argsProduct.name+'/profiles/v'+argsSdk.version+'/schemas/notification',
            type: 'GET',
            headers:{'Authorization':token},
            getType:"json",
            success:function(result){
                // console.log(result)

                var result=result.schema;
                //console.log(result)
                var $result= eval('('+result+')');//字符串转换为对象
                var hName=$result.name;
                var $results=$result.fields;
                
                var types,typesArr=[];
                var ajaxStr='<div class="tith3"><input type="text" class="form-control" disabled="disabled" style="background:#1DAEEF;" placeholder="'+hName+'" value="'+hName+'"><i class="glyphicon glyphicon-plus"></i></div><div class="lister">'
                $.each($results,function(i,val){
                    ajaxStr+='<p names='+val.scope+'><input type="text" class="form-control" value="'+val.name+'"><select name="" id=""><option value="String" selected>String</option><option value="Integer">Integer</option><option value="Long">Long</option><option value="Float">Float</option><option value="Double">Double</option><option value="Boolean">Boolean</option><option value="Bytes">Bytes</option><option value="Enumeration">Enumeration</option><option value="Record">Record</option></select></p>'
                })
                ajaxStr+='</div>'
                $("#box #left").html(ajaxStr);
             /*映射*/
               var  valobj={}/*创建心对象*/
                $.each($results,function(i,values){
                    //console.log(i)
                    if(typeof values.type=="string"){
                        types=values.type
                    }else{
                        types=values.type.type;
                        if(values.type.type=="enum"){
                            valobj["Enumeration"+i]=[];
                            for(var j=0;j<values.type.symbols.length;j++){
                                valobj["Enumeration"+i].push(values.type.symbols[j])
                            }
                        }else if(values.type.type=="record"){
                            valobj["Record"+i]=[];
                            for(var j=0;j<values.type.fields.length;j++){
                                valobj["Record"+i].push({})
                                valobj["Record"+i][j].name=values.type.fields[j].name
                                valobj["Record"+i][j].type=values.type.fields[j].type
                            }
                            /*console.log(valobj)如果值为enum或者record就把其装进一个大对象里面*/
                        }
                    }

                    $.each(options,function(idx,vals){
                        if(types==idx){types=vals}/*得到每一个首字母开头为大写*/
                    })
                    /*console.log(types)得到每一个首字母开头为大写*/
                    typesArr.push(types)
                
                    $("#left .lister p").eq(i).find("select option").each(function(idx,val){
                        if(typesArr[i]==$(this).val()){
                            $(this).attr("selected",true).siblings().attr("selected",false)
                            /*console.log($(this).parents("p").index()+"-----"+i)*/
                            if($(this).val()=="Enumeration"){
                                $(this).parents("p").addClass("Enumeration"+i);
                                arrClass.push("Enumeration"+i)/*存放动态名字*/
                                var htm='<div class="Enumerationchild draFting E common" id="Enumeration'+i+'"><div class="tith3"><input type="text" class="form-control" style="background:#1DAEEF;" placeholder="Username" value='+values.type.name+'><i class="glyphicon glyphicon-plus" id="clones"></i></div><div class="lister">'
                                var ech=valobj["Enumeration"+i]
                                for( var k=0;k<ech.length;k++){htm+='<p><input type="text" value='+ech[k]+' class="form-control"><i class="glyphicon glyphicon-remove"></i></p>'}
                                htm+='</div></div>'
                                $(htm).appendTo($("#box"));
                            }else if($(this).val()=="Record"){
                                $(this).parents("p").addClass("Record"+i);
                                arrClass.push("Record"+i)/*存放动态名字*/
                                var htm='<div class="Recordchild draFting R common" id="Record'+i+'"><div class="tith3" id="mon'+i+'"><input type="text" class="form-control" style="background:#1DAEEF;" placeholder="Username" value='+values.type.name+'><i class="glyphicon glyphicon-plus" id="clones"></i></div><div class="lister">'
                                var ech=valobj["Record"+i]
                                for(var k=0;k<ech.length;k++){
                                    htm+='<p><input type="text" value='+ech[k].name+' class="form-control"><select name="" id=""><option value="String">String</option><option value="Integer">Integer</option><option value="Long">Long</option><option value="Float">Float</option><option value="Double">Double</option><option value="Boolean">Boolean</option><option value="Bytes">Bytes</option></select><i class="glyphicon glyphicon-remove"></i></p>'
                                }
                                htm+='</div></div>'
                                $(htm).appendTo($("#box"));
                            }
                        }
                    });
                })
             /*映射*/
                var dtarr=["string","int","long","float","double","boolean","bytes"];
                $(".common").each(function(i,val){/*如果为record则显示对应的数据*/
                    //var that=$(this)
                    if($(this).attr("id").substr(0,6)=="Record"){
                        var idx=$(this).find(".tith3").attr("id").substr(3);
                        for(var i=0;i<$results[idx].type.fields.length;i++){
                            //console.log($results[idx].type.fields[i].type)
                            //console.log(i+"---"+idx)
                            $("#Record"+idx).find(".lister p").eq(i).find("select").find("option").each(function(id,vals){
                                $(this).attr("name",dtarr[id]);
                                if($(this).attr("name")==$results[idx].type.fields[i].type){
                                    $(this).attr("selected","selected")
                                    /*console.log($(this).val())*/
                                }
                            })  
                        }
                    }
                })
                myScript();/*调用方法*/
            },
            error:function(){
                alert("数据请求失败")
            }
        });
 
        function myScript(){
            var sx,sy,ex,ey;
            function gown(){/*xian*/
                $(".draFting").each(function(i,val){
                    var a,b,c,d,e;
                    if($(this).attr("id")=="left"){} else{
                        a=$(this).attr("id");/*显示出来的每个id*/
                        b=$(this).position().left/*显示出来的id名和他自己对应的left*/
                        c=$(this).position().top+20/*显示出来的id名和他自己对应的top*/
                        d=$("#left").outerWidth()+$("#left").position().left;
                        e=$("."+a+"").offset().top-$("#box").offset().top+15;
                       // console.log(a+"------"+b+"------"+c+"------"+d+"------"+e)
                        var line=new Line(b,c,d,e);line.drawWithArrowheads(ctx);
                    }
                });
            }
            function displac(){/*让盒子显示的时候不要重叠*/
                $(".common").each(function(i,val){
                    var L=i*20+480;
                    var T=i*20+100;

                    $(this).css("left",L)
                    $(this).css("top",T)
                })
            }
            displac();
            function juDgement(){/*动态添加创建删除*/
                $("#box #left .lister p").each(function(i,val){/*动态让left里面的默认数据只读*/
                    if($(this).attr("names")=="system"){
                        $(this).find("select").attr("disabled","disabled")
                        $(this).find("input").attr("disabled","disabled")
                    }else if($(this).attr("names")=="user"){
                        $(this).append('<i class="glyphicon glyphicon-remove"></i>')
                    }
                });
                var idx;
                $("#box").on("change","#left p select",function(){
                        idx=$(this).parents("p").index();
                        var ste;
                    if($(this).val()=="Enumeration"){
                        $(this).parents("p").attr("name","Enumeration")
                        $(this).parents("p").attr("data-name","Enumeration")
                        if($(this).parents("p").attr("name","Enumeration")){
                            
                            ste=$('<div class="Enumerationchild draFting E common">'+str.tith3+'<div class="lister">'+str.Enumerationchild+'</div></div>');
                            $("#Enumeration"+idx).remove();$("#Record"+idx).remove();
                            ste.attr("id","Enumeration"+idx);$(this).parents("p").attr("class","Enumeration"+idx);
                            ste.appendTo($(".box"));


                            sx=$(this).parents(".draFting").outerWidth()+$(this).parents(".draFting").position().left
                            sy=$(".Enumeration"+idx).offset().top-$("#box").offset().top+15
                            ex=$("#Enumeration"+idx).position().left;
                            ey=$("#Enumeration"+idx).position().top+20;
                            //console.log(sx+","+sy+","+ex+","+ey)
                            ctx.clearRect(0,0,1073,1088);var line=new Line(sx,sy,ex,ey);line.drawWithArrowheads(ctx);/*调用*/
                        }
                    }else if($(this).val()=="Record"){
                        $(this).parents("p").attr("name","Record")
                        $(this).parents("p").attr("data-name","Record")
                        if($(this).parents("p").attr("name","Record")){
                            
                            ste=$('<div class="Recordchild draFting R common">'+str.tith3+'<div class="lister">'+str.Recordchild+'</div></div>');
                            $("#Enumeration"+idx).remove();$("#Record"+idx).remove();

                            ste.attr("id","Record"+idx);$(this).parents("p").attr("class","Record"+idx);
                            ste.appendTo($(".box"));


                            sx=$(this).parents(".draFting").outerWidth()+$(this).parents(".draFting").position().left
                            sy=$(".Record"+idx).offset().top-$("#box").offset().top+15
                            ex=$("#Record"+idx).position().left;
                            ey=$("#Record"+idx).position().top+20;
                            //console.log(sx+","+sy+","+ex+","+ey)
                            ctx.clearRect(0,0,1073,1088);var line=new Line(sx,sy,ex,ey);line.drawWithArrowheads(ctx);/*调用*/
                        }
                    }else{
                        $(this).parents("p").attr("name","");
                        $("#Enumeration"+idx).remove();$("#Record"+idx).remove();$(this).parents("p").attr("class","");
                        $(this).parents("p").attr("data-name","")
                        ctx.clearRect(0,0,1073,1088); 
                    }
                });
                $("#box").on("click","#left p i",function(){
                    var id=$(this).parents("p").attr("class");
                    $("#"+id).remove()
                    $(this).parents("p").remove();

                    var arr =[];
                    $("#left p").each(function(i,val){
                        if($(this).attr("data-name")=="Record"){
                            /*var id=$(this).attr("class");
                            $("#"+id).attr("id","Record"+(i-1))*/
                            $(this).attr("class","Record"+i)
                            arr.push( $(this).attr("class"))
                        }else if($(this).attr("data-name")=="Enumeration"){
                            /*var id=$(this).attr("class");
                            $("#"+id).attr("id","Enumeration"+(i-1))*/
                            $(this).attr("class","Enumeration"+i)
                            arr.push( $(this).attr("class"))
                        }

                    })
                    // console.log(arr)
                    $(".common").each(function(i,val){
                        $(".common").eq(i).attr("id",arr[i])
                        
                    })
                    ctx.clearRect(0,0,1073,1088);
                    gown();
                })
            }
            juDgement();
            function highlights(){/*移入移除一些样式以及添加删除和创建*/
                $("#box").on("mouseover",".draFting .tith3",function(){$(this).addClass("bg").find("input").addClass("bg")});
                $("#box").on("mouseout",".draFting .tith3",function(){$(this).removeClass("bg").find("input").removeClass("bg")});
                $("#box").on("mouseover",".draFting p i",function(){$(this).addClass("bg")});
                $("#box").on("mouseout",".draFting p i",function(){$(this).removeClass("bg")});
                $("#box").on("click","#left .tith3 i",function(){
                    $(str.left).appendTo($(this).parents(".draFting").find($(".lister")));
                });
                $("#box").on("click",".E .tith3 i",function(){
                    $(str.Enumerationchild).appendTo($(this).parents(".draFting").find($(".lister")));
                });
                $("#box").on("click",".R .tith3 i",function(){
                    $(str.Recordchild).appendTo($(this).parents(".draFting").find($(".lister")));
                });
                $("#box").on("click",".draFting p i",function(){$(this).parents("p").remove();})
            }
            highlights();
            function  draFting(){/*拖拽所有的盒子*/
                $("#box").on("mousedown",".draFting",function(e){
                    $(this).css({"z-index":1000,"opacity":1}).siblings().css({"z-index":100,"opacity":0.5});
                    var oevent=e||window.event
                    var L=oevent.clientX-$(this).position().left
                    var T=oevent.clientY-$(this).position().top
                    var that=$(this);
                    var opt=that.attr("id");
                    $(document).on("mousemove",function(ev){
                        $("#cvs").css("opacity",1)
                        var aevent=ev||window.event
                        var left=aevent.clientX-L
                        var top=aevent.clientY-T
                        if(left<0){left=0}else if(left>$("#box").outerWidth()-that.outerWidth()){left=$("#box").outerWidth()-that.outerWidth()}
                        if(top<0){top=0}else if(top>$("#box").outerHeight()-that.outerHeight()){top=$("#box").outerHeight()-that.outerHeight()}  
                         that.css("left",left);that.css("top",top);

                        /*获取id以及坐标*/
                        var id=that.attr("id");
                        if(that.attr("id")=="left"){
                            ctx.clearRect(0,0,1073,1088);
                        }else{
                            sx=$("."+id).parents(".draFting").outerWidth()+$("."+id).parents(".draFting").position().left
                            sy=$("."+id).offset().top-$("#box").offset().top+15
                            ex=that.position().left;
                            ey=that.position().top+20;

                            ctx.clearRect(0,0,1073,1088);var line=new Line(sx,sy,ex,ey);line.drawWithArrowheads(ctx);/*调用*/
                        }
                    })
                    $(document).on("mouseup",function(event){
                        $(".draFting").css({"z-index":1000,"opacity":1});
                        $(that).css({"opacity":1,"z-index":1000}).siblings().css({"z-index":100});
                        $("#cvs").css("opacity",1);
                        gown();//渲染完毕就画线
                        $(this).off("mousemove")
                    })
                })
            }
            draFting();
            function forEachadClas(){/*页面重新打开的时候进行遍历*/
                var clasVal=[];
                $("#left .lister p").each(function(i,val){
                    var vals=$(this).find("select").val()
                    //$(this).addClass("");
                    if(vals=="Enumeration"){
                        $(this).attr("data-name",vals)
                        $(this).addClass(vals+i)
                        clasVal.push(vals+i)
                    }else if(vals=="Record"){
                        $(this).attr("data-name",vals)
                        $(this).addClass(vals+i)
                        clasVal.push(vals+i)
                    }
                })
                $(".common").each(function(i,val){
                    $(this).attr("id",clasVal[i]+"")
                })
            }
            forEachadClas()
            gown();/*默认线条*/
            function callback(){/*返回json数据*/
                var obj={};
                obj.schema={};
                obj.schema.type="record";
                obj.schema.name=$("#left .tith3 input").val();
                obj.schema.namespace="com.hnair.iot.bee.client.song.profile";
                obj.schema.fields=[];
                $("#left .lister p").each(function(i,val){
                    obj.schema.fields[i]={};
                    obj.schema.fields[i].scope=$(this).attr("names");
                    obj.schema.fields[i].name=$(this).find("input").val();
                    if($(this).attr("data-name")!="Enumeration" && $(this).attr("data-name")!="Record"){
                        for(var a in options){if($(this).find("select").val()==options[a]){obj.schema.fields[i].type=a}}
                    }else if($(this).attr("data-name")=="Enumeration"){
                        obj.schema.fields[i].type={}
                        var cls=$(this).attr("class");
                        obj.schema.fields[i].type.type="enum";
                        obj.schema.fields[i].type.name=$("#"+cls).find(".tith3 input").val();
                        obj.schema.fields[i].type.symbols=[];
                        $("#"+cls).find(".lister p").each(function(index,val){
                            var val=$(this).find("input").val();
                            obj.schema.fields[i].type.symbols.push(val)
                        })
                    }else if($(this).attr("data-name")=="Record"){
                        obj.schema.fields[i].type={}
                        var cls=$(this).attr("class");
                        obj.schema.fields[i].type.type="record";
                        obj.schema.fields[i].type.name=$("#"+cls).find(".tith3 input").val();
                        obj.schema.fields[i].type.fields=[];
                        $("#"+cls).find(".lister p").each(function(index,val){
                            obj.schema.fields[i].type.fields[index]={}
                            obj.schema.fields[i].type.fields[index].name=$(this).find("input").val()
                            for(var a in options){if($(this).find("select").val()==options[a]){obj.schema.fields[i].type.fields[index].type=a}}
                        })
                    }
                })
                //JSON.stringify(obj.schema)
                obj={"schema":JSON.stringify(obj.schema)}
                return obj;
            }
            
            function speech(){/*正则判断*/
                var reg=/^[A-Z|a-z][a-zA-Z0-9]{1,20}$/;
                $("#box").on("blur","input",function(){
                    if($(this).parents("div").attr("class")=="tith3"){
                        var vas=$(this).val();
                        var that=$(this);
                        $(this).parents(".draFting").siblings().find(".tith3").each(function(i,val){
                            $(this).find("input").removeClass("bgSpeech")
                            if($(this).find("input").val()==vas){
                                that.addClass("bgSpeech")
                            }else{
                                if($(this).val()!="" && reg.test($(this).val())==true){
                                    that.removeClass("bgSpeech")
                                }
                            }
                        })
                    }else if($(this).parents(".lister").attr("class")=="lister"){
                        var vas=$(this).val();
                        var that=$(this);
                        $(this).parents("p").siblings().each(function(i,val){
                            $(this).find("input").removeClass("bgSpeech")
                            if($(this).find("input").val()==vas){
                                that.addClass("bgSpeech")
                            }else{
                                if($(this).val()!="" && reg.test($(this).val())==true){
                                   that.removeClass("bgSpeech")
                                }
                            }
                        })
                    }
                });
                $("#box").on("keyup",".draFting input",function(){
                    if($(this).val()=="" || reg.test($(this).val())==false){
                       $(this).addClass("bgSpeech")
                    }else{
                        $(this).removeClass("bgSpeech")
                    }
                });
            }
            speech();
            function submits(){/*判断提交数据*/
                $("#btn").on("click",function(){
                    // console.log(callback())
                    var num=0
                    $("#box input").each(function(i,val){
                        //console.log(i)
                        if($(this).val()==""){
                            $(this).addClass("bgSpeech")
                        }
                        if($(this).attr("class")=="form-control bgSpeech"){
                           num+=1
                        }
                        // console.log($(this).attr("class")+"------"+num)
                    })
                    if(num==0){
                        var rData = callback();
                        //console.log(rData);
                        submitData2(rData);

                    }else{
                        return false;
                    }
                })
            }
            submits()
            function disble(){//默认只读
                $("#left p").each(function(i,val){
                    if($(val).attr("data-name")=="Enumeration" || $(val).attr("data-name")=="Record"){
                        if($(val).attr("names")=="system")
                        {
                            var clas=$(val).attr("class")
                            $("#"+clas).find("input").attr("disabled","disabled")
                            $("#"+clas).find("i").on("click",function(){
                                return false
                            })
                        }

                    }
                })
            }
            disble();
        }

    }

})();
