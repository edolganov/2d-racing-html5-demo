
physics.BodyPhysicsImpl = function(world, body){
    
    var self = this;
    var listeners = [];
    
    function init(){
        body.backHandler = self;
        self.objType = body.objType;
    }
    
    this.addListener = function(l){
        listeners.push(l);
    };
    
    this.onCollision = function(other, pos, norm){
        for (var i=0; i < listeners.length; i++)
            listeners[i].onCollision(other, pos, norm);
    };
    
    this.getCenter = function(){
        return body.state.pos; 
    }
    
    this.getOffset = function(){
        return body.offset;
    }
    
    this.getRotation = function(){
        return body.state.angular.pos;
    }
    
    this.getAcc = function(){
        return body.state.acc;
    }
    
    this.resetTo = function(x, y){
        body.state.pos.set(x, y);
        body.state.acc.set(0, 0);
        body.state.vel.set(0, 0);
        body.state.angular.pos = 0;
        body.state.angular.vel = 0;
        body.state.angular.acc = 0;
    }
    
    this.setAcc = function(x, y){
        body.state.acc.set(x, y);
    }
    
    this.removeFromWorld = function(){
        world.removeBody(body);
    }
    
    this.backPrevForce = function(){
        var old = body.state.old;
        body.state.acc.set(old.acc.x, old.acc.y);
        body.state.vel.set(old.vel.x, old.vel.y);
        body.state.angular.vel = old.angular.vel;
        body.state.angular.acc = old.angular.acc;
    }
    
    
    init();
    
}

