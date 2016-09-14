
model.map.fn.LINE = function(opt){
    
    var w = opt.s(opt.w || 600);
    var h = opt.s(opt.h || 10);
    
    return {
        line: {
            label: "line",
            type: model.PrimitiveType.RECTANGLE,
            x: opt.x,
            y: opt.y,
            w: w,
            h: h,
            angle: opt.angle || 0,
            restitution: opt.restitution || 0
        }
    };
}