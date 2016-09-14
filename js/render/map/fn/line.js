

render.map.fn.LINE = function(block){
    
    var model = block.elems.line;

    var g = new PIXI.Graphics();

    g.lineStyle(1, Colors.WHITE, 1);
    g.beginFill(Colors.BLACK);
    g.drawRect(
        model.x - model.w/2, 
        model.y - model.h/2, 
        model.w, 
        model.h);
    g.endFill();
    
    g.rotation = model.angle;
    
    return g;
}

