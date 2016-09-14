
render.map.MapStage = function(map){
    
    var self = this;
    var c = new PIXI.Container();
    var bounds;
    
    
    function init(){
        
        map.addListener(self);
        
        if(Global.params.app.showMapBounds)
            initMapBounds();
        
    }
    
    
    function initMapBounds(){
        bounds = new PIXI.Graphics();
        c.addChild(bounds);
    }
    
    
    this.onBlockAdded = function(block){
        
        var factoryFn = render.map.fn[block.type];
        if(!factoryFn)
            return;
        
        var state = block.state;
        var center = state.getCenter();
        var offset = state.getOffset();
        
        var elem = factoryFn(block);
        elem.position.set(center.x, center.y);
        elem.pivot.set(-offset.x,-offset.y);
        
        c.addChild(elem);
        
        updateBounds();
    };
    
    function updateBounds(){
        
        if(!bounds)
            return;
        
        var data = map.getBounds();
        
        bounds.clear();
        bounds.lineStyle(1, Colors.RED_00, 1);
        
        var upY = -1800
        bounds.moveTo(data.leftX, upY);
        bounds.lineTo(data.leftX, data.downY);
        bounds.lineTo(data.rightX, data.downY);
        bounds.lineTo(data.rightX, upY);
        
    }
    
    
    this.getContainer = function(){
        return c;
    };
    
    this.update = function(){
        
    };
    

    
    
    init();
}

