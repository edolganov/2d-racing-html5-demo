
model.point.Points = function(opt){
    
    opt = Util.extend({
        simpleRadius: 15
    }, opt);
    
    var phys = Global.context.phys;
    var listeners = [];
    
    this.addListener = function(l){
        listeners.push(l);
    }
    
    this.addSimplePoint = function(x, y){
        
        var body = phys.addElem({
            objType: model.ObjectType.POINT,
            x: x,
            y: y,
            type: model.PrimitiveType.CIRCLE,
            radius: opt.simpleRadius,
            isStatic: true
        });
        
        var point = {
            type: model.point.PointType.SIMPLE,
            state: body,
            radius: opt.simpleRadius
        }
        
        body.onHit = onHit;
        body.pointData = point;
        
        $.each(listeners, function(i, l){
           l.onPointAdded(point); 
        });
        
    }
    
    var onHit = function(){
        var body = this;
        body.removeFromWorld();
        
        var point = body.pointData;
        $.each(listeners, function(i, l){
           l.onPointHit(point); 
        });
    }
    
    
}

