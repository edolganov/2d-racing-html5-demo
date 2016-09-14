

model.Game = function(map, car, points){
    
    var phys = Global.context.phys;
    
    
    this.car = function(){
        return car;
    }
    
    this.map = function(){
        return map;
    }
    
    this.points = function(){
        return points;
    }
    
    this.step = function(){
        
        if(isCarOutOfMap())
            car.resetPosition();
        
        phys.step();
        
        car.afterStep();
    }
    
    this.afterStep = function(){
        car.beforeNextStep();
    }
    
    function isCarOutOfMap(){
        var center = car.getState().getCenter();
        var bounds = map.getBounds();
        return center.x < bounds.leftX 
                || center.x > bounds.rightX
                || center.y > bounds.downY;
    }
}

