/* 垂直柱图组件对象 */
var H5ComponentBar_v = function(name, cfg) {
    var component = new H5ComponentBar(name, cfg);
    
    //每个项目所占宽度的比例
    var width = (100 / cfg.data.length) >> 0;
    component.find('.line').width(width + '%');
    
    //把原来的宽度变成高度
    $.each(component.find('.rate'), function() {
        var w = $(this).css('width');
        $(this).height(w).width('');
    });
    
    //把百分比.per添加到进度区.rate
    $.each(component.find('.per'), function() {
        $(this).appendTo($(this).prev());        
    });
    
    
    return component;
}