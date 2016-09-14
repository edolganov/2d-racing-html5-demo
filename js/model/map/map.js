
model.map.Map = function(){
    
    var phys = Global.context.phys;
    
    var blocks = [];
    var listeners = [];
    
    var bounds;
    var boundsExtra = 600;
    
    function init(){
        
        bounds = {
            leftX: 0,
            rightX: 0,
            downY:0
        };
        
    }
    
    this.addListener = function(l){
        listeners.push(l);
    }
    
    this.getBounds = function(){
        return bounds;
    }
    
    
    this.addBlock = function(opt){
        
        opt = Util.extend({
            type: model.map.BlockType.LINE,
            x: 0,
            y: 0,
            angle: 0,
            restitution: 0,
            scale: 1,
            isStatic: true
        }, opt);
        opt.s = function(val){
            return val * opt.scale;
        }
        
        var elems = model.map.fn[opt.type](opt);
        if( ! elems)
            throw new Error("can't build map block model by type: "+opt.type);
        
        updateMapBounds(elems);
        
        var index = elems.length;
        var body = phys.addCompound({
            objType: model.ObjectType.MAP_ELEM,
            x: opt.x, 
            y: opt.y,
            isStatic: opt.isStatic,
            children: Util.mapToList(elems)
        });
        
        var block = {
            type: opt.type,
            elems: elems,
            state: body
        }
        
        blocks.push(block);
        
        $.each(listeners, function(i, l){
           l.onBlockAdded(block); 
        });
    }
    
    
    function updateMapBounds(elems){
        
        $.each(elems, function(name, elem){
            updateMapBoundsBy(elem);
        });
    }
    
    function updateMapBoundsBy(elem){
        
        var center;
        var size;
        
        if(elem.type == model.PrimitiveType.RECTANGLE){
            center = {x: elem.x, y: elem.y};
            size = Math.max(elem.w, elem.h) / 2;
        }
        
        if(!center)
            return;
        
        var halfSize = size/2;
        var leftX = center.x - halfSize - boundsExtra;
        var rightX = center.x + halfSize + boundsExtra;
        var downY = center.y + halfSize + boundsExtra;
        
        if(bounds.leftX > leftX)
            bounds.leftX = leftX;
        if(bounds.rightX < rightX)
            bounds.rightX = rightX;
        if(bounds.downY < downY)
            bounds.downY = downY;
    }
    
    
    
    
    init();
    
};

