/* 饼图组件对象 */
var H5ComponentPie = function(name, cfg) {
    var component = new H5ComponentBase(name, cfg);
    
    //绘制网格线
    var w = cfg.width;
    var h = cfg.height;
    //加入一画布（网格线背景）
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    $(cns).css('zIndex',1);
    component.append(cns);
    
    var r = w/2;
    
    //加入一个底图层
    ctx.beginPath();
    ctx.fillStyle = '#eee';
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    ctx.arc(r,r,r,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();
    
    //绘制一个数据层
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    $(cns).css('zIndex',2);
    component.append(cns);
    
    var colors = ['red', 'green', 'blue', 'orange' , 'gray'];
    var sAngel = 1.5 * Math.PI;  //设置其实的角度，在12点的位置
    var eAngel = 0;
    var aAngel = Math.PI*2;  //100%的圆结束的角度 2PI = 360
    
    
    var step = cfg.data.length;
    for(var i=0 ; i<step ; i++) {
        var item = cfg.data[i];
        var color = item[2] || (item[2] = colors.pop());
        
        eAngel = sAngel + aAngel * item[1];
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.1;
        ctx.moveTo(r,r);
        ctx.arc(r,r,r,sAngel,eAngel);
        ctx.fill();
        ctx.stroke();
        
        //下一个起始点
        sAngel = eAngel;
        
        //加入项目文本
        var text = $('<div class="text">');
        text.text(cfg.data[i][0]);
        var per = $('<div class="per">');
        per.text(cfg.data[i][1]*100 + '%');
        
        text.append(per);
        
        var x = r + Math.sin(0.5 * Math.PI - sAngel) * r;
        var y = r + Math.cos(0.5 * Math.PI - sAngel) * r;
        
        
        if(x > w/2) {
            text.css('left', x/2);
        } else {
            text.css('right', (w-x)/2);
        }
        
        if(y > h/2) {
             text.css('top', y/2);
        } else {
             text.css('bottom', (h-y)/2);
        }
        if(cfg.data[i][2]) {
            text.css('color', cfg.data[i][2]);
        }
        
        text.css('opacity', 0);
        component.append(text);
    }
    
    //加入一蒙版层
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    $(cns).css('zIndex',3);
    component.append(cns);
    
    ctx.fillStyle = '#eee';
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;

    
    //生长动画
    var draw = function(per) {
        ctx.clearRect(0,0,w,h);

        ctx.beginPath();
        
        ctx.moveTo(r,r);
        
        if(per <= 0) {
            ctx.arc(r,r,r,0,02*Math.PI);
            component.find('.text').css('opacity', 0); //退场动画与文字的消失
        } else {
            ctx.arc(r,r,r,sAngel,sAngel+2*Math.PI * per,true);
        }
        
        ctx.fill();
        ctx.stroke();
        
        //动画完成后，出现文字，退场也是
        if(per >= 1) {
            //显示出来之前，做重排
            H5ComponentPie.reSort(component.find('.text'));
            component.find('.text').css('opacity', 1);
            ctx.clearRect(0,0,w,h);
        }
    }
    draw(0);
    
    
    component.on('onLoad', function() {
        //饼图生长动画
        var s = 0;
        for(var i=0 ; i<100 ; i++) {
            setTimeout(function() {
                s+=.01;
                draw(s);
            }, i*10+500); //+500是为了让网格下来后，在做生长动画
        }
    });
    component.on('onLeave', function() {
        //饼图减少动画
        var s = 1;
        for(var i=0 ; i<100 ; i++) {
            setTimeout(function() {
                s-=.01;
                draw(s);
            }, i*10);
        }
    });
    return component;
}

//重排项目文本元素
H5ComponentPie.reSort = function(list) {
    
    //检测相交
    var compare = function(domA, domB) {
        
        //元素的位置，不用left，因为有时候，left为auto
        var offsetA = $(domA).offset();
        var offsetB = $(domB).offset();
        
        var shadowA_x = [offsetA.left,$(domA).width() + offsetA.left];
        var shadowA_y = [offsetA.top,$(domA).height() + offsetA.top];
        
        var shadowB_x = [offsetB.left,$(domA).width() + offsetB.left];
        var shadowB_y = [offsetB.top,$(domA).height() + offsetB.top];
        
        //检测x
        var intersect_x = (shadowA_x[0] > shadowB_x[0] && shadowA_x[0] < shadowB_x[1])
         || (shadowA_x[1] > shadowB_x[0] && shadowA_x[1] < shadowB_x[1]);
        
        //检测y
        var intersect_y = (shadowA_y[0] > shadowB_y[0] && shadowA_y[0] < shadowB_y[1])
         || (shadowA_y[1] > shadowB_y[0] && shadowA_y[1] < shadowB_y[1]);
    
        return intersect_x && intersect_y;
    }    
    
    //重排
    var reset = function(domA, domB) {
        if($(domA).css('top') != 'auto') {
            $(domA).css('top', parseInt($(domA).css('top') + $('domB').height()));
        }
        
        if($(domA).css('buttom') != 'auto') {
            $(domA).css('buttom', parseInt($(domA).css('buttom') + $('domB').height()));
        }
    }
    
    var willReset = [list[0]];
    
    $.each(list, function(i, domTarget) {
        if(compare(willReset[willReset.length-1], domTarget)) {
            willReset.push(domTarget);
        }
    });
    if(willReset.length > 1) {
        $.each(willReset, function(i, domA) {
            
            if(willReset[i+1]) {
                reset(domA, willReset[i+1]);
            }
        })
        H5ComponentPie.reSort(willReset);
    }
}