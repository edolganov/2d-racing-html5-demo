
render.GridStage = function(opt){
    
    opt = Util.extend({
        step: 50
    }, opt);
    
    var log = LogFactory.getLog("render.GridStage");
    
    
    var p = Global.params.app;
    var g = new PIXI.Graphics();
    
    var curX = null;
    var curY = null;
    
    this.getContainer = function(){
        return g;
    }
    
    this.update = function(pos){
        
        if( ! Util.isEmpty(curX) 
                && curX == pos.x
                && curY == pos.y)
            return;
        
        curX = pos.x;
        curY = pos.y;
        
        var step = opt.step;
        var w = p.w + 2*step;
        var h = p.h + 2*step;
        var wCount = Math.ceil(w / step);
        var hCount = Math.ceil(h / step);
        
        g.clear();
        g.lineStyle(1, Colors.WHITE, 1);
        
        g.beginFill(Colors.WHITE);
        g.drawCircle(0, 0, 10);
        g.endFill();
        
        var i;
        var x = - (step * Math.floor(curX / step)) - step * 2;
        var y = - (step * Math.floor(curY / step)) - step * 2;
        for(i=0; i < wCount; i++){
            g.moveTo(x, y);
            g.lineTo(x, y + h);
            x += step;
        }
        
        x = - (step * Math.floor(curX / step)) - step * 2;
        y = - (step * Math.floor(curY / step)) - step * 2;
        for(i=0; i < hCount; i++){
            g.moveTo(x, y);
            g.lineTo(x + w, y);
            y += step;
        }
        
        
        
        
    }
    
    
}

