/*loading动画脚本*/
var H5_loading = function(images, firstPage) {
    
    var id = this.id;
    
    if(this._images === undefined) {  //第一次进入
        
        this._images = (images || []).length;  //需要加载的资源
        this._loaded = 0;  //最开始加载了0个资源
        
        window[id] = this;  //把当前对象存储到全局对象中，用来进行某个图片加载弯沉过之后的回调
        
        for(s in images) {
            var item = images[s];
            var img = new Image;
            img.onload = function() {
                window[id].loader();
            }
            img.src = item;
        }
        
        $('#rate').text('0%');
        // debugger
        return this;
    } else {
        
        this._loaded++;
        $('#rate').text(((this._loaded / this._images * 100) >> 0) + '%');
        
        // debugger
        if(this._loaded < this._images) {
            return this;
        }
    }
    
    window[id] = null;
    
    
    this.el.fullpage({
        onLeave: function(index, nextIndex, direction) {
            $(this).find('.h5_component').trigger('onLeave');
        },
        afterLoad: function(anchorLink, index) {
            $(this).find('.h5_component').trigger('onLoad');
        }
    });
    this.page[0].find('.h5_component').trigger('onLoad');
    this.el.show();
    if(firstPage) {
        $.fn.fullpage.moveTo(firstPage);
    }
}