/* 折线图组件对象 */
var H5ComponentPolyline = function(name, cfg) {
    var component = new H5ComponentBase(name, cfg);
    
    //绘制网格线
    var w = cfg.width;
    var h = cfg.height;
    //加入一画布（网格线背景）
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    
    component.append(cns);
    
    //绘制网格线
    //水平网格线  100 -- 10份
    var step = 10;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#aaa";
    
    window.ctx = ctx;
    for( var i=0 ; i<(step+1) ; i++) {
        var y = (h/step) * i;
        ctx.moveTo(0,y);
        ctx.lineTo(w,y);
    }
    
    //垂直网格线（根据项目的个数区分）
    step = cfg.data.length+1;
    var text_w = w/step >> 0;
    for(var i=0 ; i<(step+1) ; i++) {
        var x = (w/step) * i;
        ctx.moveTo(x,0);
        ctx.lineTo(x,h);
        
        if(cfg.data[i]) {
            var text = $('<div class="text">');
            text.text(cfg.data[i][0]);
            text.css('width', text_w/2).css('left', (x/2 - text_w/4) + text_w/2); //canvas只有本身一半的大小所以这里除2
            
            component.append(text);
        }
    }
    
    ctx.stroke();
    
    //绘制折线数据(重新用cns，是因为这里的cns是不断变动的动画，分成两个层)
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    
    component.append(cns);
    
    /*绘线
        per:0-1之间的数据，根据它绘制数据对应的中间状态
    */
    var draw = function( per) {
        //清空画布
        ctx.clearRect(0,0,w,h);
        //绘制折线数据
        ctx.beginPath();
        ctx.lineWidth = 3;  //为了解决后面画阴影的时候的，边框bug
        ctx.strokeStyle = "#ff8878";
        
        var x = 0;
        var y = 0;
        //画点
        var row_w = (w/(cfg.data.length + 1));
        for(i in cfg.data) {
            var item = cfg.data[i];
            
            x = row_w * i + row_w;
            y = h*(1 - (item[1] * per));
            
            ctx.moveTo(x,y);
            ctx.arc(x,y,5,0,2*Math.PI);
        }
        
        //连线
        //移动画笔到第一个点的位置
        ctx.moveTo(row_w * 0 + row_w , h*(1 - (cfg.data[0][1] * per)));
        for(i in cfg.data) {
            var item = cfg.data[i];
            
            x = row_w * i + row_w;
            y = h*(1 - (item[1] * per));
            ctx.lineTo(x,y);
        }
        ctx.stroke();
        ctx.strokeStyle = "#rgba(255,255,255, 0)";
        
        
        //绘制阴影
        ctx.lineTo(x,h);
        ctx.lineTo(row_w * 0 + row_w, h);
        ctx.fillStyle = 'rgba(255,136,120, 0.2)';
        ctx.fill();
        
        //写数据
        for(i in cfg.data) {
            var item = cfg.data[i];
            
            x = row_w * i + row_w;
            y = h*(1 - (item[1] * per));
            
          
            ctx.fillStyle = item[2] ? item[2] : '#595959';
            ctx.fillText(((item[1]*100)>>0)+'%', x-10, y-10);
        }
        // ctx.stroke();
    }
    // draw(1);
    
    
    component.on('onLoad', function() {
        //折线图生长动画
        var s = 0;
        for(var i=0 ; i<100 ; i++) {
            setTimeout(function() {
                s+=.01;
                draw(s);
            }, i*10+500); //+500是为了让网格下来后，在做生长动画
        }
    });
    component.on('onLeave', function() {
        //折线图减少动画
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