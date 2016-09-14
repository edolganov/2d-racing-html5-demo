
render.car.PlayerCar = function(model, opt){
    
    opt = Util.extend({
        colorCabin: Colors.RED_01,
        colorWheel: Colors.GREAY_01
    }, opt);
    
    var c = new PIXI.Container();
    
    var cabin = new PIXI.Graphics();
    var backWheel = new PIXI.Graphics();
    var frontWheel = new PIXI.Graphics();
    
    
    function init(){
    
        var elems = model.getElems();
        
        if(elems){
            paintCabin(cabin, elems.cabin);
            paintWheel(backWheel, elems.backWheel);
            paintWheel(frontWheel, elems.frontWheel);
        }
        
        c.addChild(cabin);
        c.addChild(backWheel);
        c.addChild(frontWheel);
        
        updatePosition();       

    }
    
    this.getContainer = function(){
        return c;
    };
    
    this.update = function(){
        
        updatePosition();
        
        var elems = model.getElems();
        if(elems) {
            paintWheel(backWheel, elems.backWheel);
            paintWheel(frontWheel, elems.frontWheel);
        }
    };
    
    
    function paintCabin(g, model){
        
        g.clear();
        g.lineStyle(1, Colors.WHITE, 1);
        g.beginFill(opt.colorCabin);
        g.drawRect(model.x - model.w/2, model.y - model.h/2, model.w, model.h);
        
        g.endFill();
    }
    
    function paintWheel(g, model){
        
        g.clear();
        g.lineStyle(1, Colors.WHITE, 1);
        g.beginFill(Global.params.app.showWheelMove 
                && model.onGround ? Colors.GREEN_00 : opt.colorWheel);
        g.drawCircle(model.x, model.y, model.radius);
        
        g.endFill();
        
    }
    
    function updatePosition(){
        
        var state = model.getState();
        
        var center = state.getCenter();
        var offset = state.getOffset();
        var rotation = state.getRotation();
        
        c.position.set(center.x, center.y);
        c.pivot.set(-offset.x,-offset.y);
        c.rotation = rotation;
    }
    
    
    
    
    init();
}

