
render.point.PointsStage = function(points){
    
    var self = this;
    var c = new PIXI.Container();
    
    function init(){
        points.addListener(self);
    }
    
    this.onPointAdded = function(point){
        
        var elem = createElem(point);
        point.view = elem;
        
        var center = point.state.getCenter();
        
        elem.position.set(center.x, center.y);
        
        c.addChild(elem);
    }
    
    this.onPointHit = function(point){
        if( ! point.view)
            return;
        
        point.view.clear();
    }
    
    this.getContainer = function(){
        return c;
    }
    
    this.update = function(){
        
    }
    
    
    function createElem(point){
        
        if(point.type == model.point.PointType.SIMPLE)
            return createSimpleElem(point);
        
        throw new Error("Unknown point type: "+point.type);
    }
    
    function createSimpleElem(point){
        
        var g = new PIXI.Graphics();

        
        var alpha = (2 * Math.PI) / 10; 
        var radius = point.radius;

        g.beginFill(Colors.YELLOW_01);
        
        //5 point star by: http://stackoverflow.com/questions/14580033
        var polygon = [];
        for(var i = 11; i != 0; i--){
            var r = radius*(i % 2 + 1)/2;
            var omega = alpha * i;
            polygon.push(r * Math.sin(omega));
            polygon.push(r * Math.cos(omega));
        }
        g.drawPolygon(polygon);

        g.endFill();
        
        return g;
        
    }
    
    
    
    init();
}
