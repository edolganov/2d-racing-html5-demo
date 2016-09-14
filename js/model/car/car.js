
model.car.Car = function(opt){
    
    opt = Util.extend({
        x: 0,
        y: 0,
        scale: 1,
        type: model.car.CarType.BASIC,
        accVal: 0.005
    }, opt);
    opt.s = function(val){
        return val * opt.scale;
    }
    
    var self = this;
    var msgSerivce = MsgService.namedService("model.car.Car");
    var phys = Global.context.phys;
    
    var elems;
    var backWheel;
    var frontWheel;
    var body;
    var listeners = [];
    var acc = false;
    var brakes = false;
    
    var startX = opt.x;
    var startY = opt.y;
    
    function init(){
        
        elems = model.car.fn[opt.type](opt);
        if(!elems)
            throw new Error("can't build car model by type: "+opt.type);
        
        backWheel = elems.backWheel;
        frontWheel = elems.frontWheel;
        
        body = phys.addCompound({
            objType: model.ObjectType.CAR,
            x: opt.x, 
            y: opt.y,
            isStatic: Global.params.app.debugCar,
            children: Util.mapToList(elems)
        });
            
        body.addListener(self);
        body.owner = self;
    }
    
    this.addListener = function(l){
        listeners.push(l);
    }
    
    this.onCollision = function(otherBody, pos, norm){
        
        if(otherBody.objType == model.ObjectType.MAP_ELEM)
            checkWheelsCollisions(pos, norm);
        else if(otherBody.objType == model.ObjectType.POINT)
            hitPoint(otherBody);
    }
    
    this.resetPosition = function(){
        body.resetTo(startX, startY);
    }
    
    function checkWheelsCollisions(pos, norm){
        checkWheelCollision(backWheel, pos, norm);
        checkWheelCollision(frontWheel, pos, norm);
    }
    
    function checkWheelCollision(wheel, pos, norm){
        
        var onGround = model.Util.hasElemCollision(body, wheel, pos);
        
        if(wheel.onGroundHist > 0){
            return;
        }
        
        wheel.onGround = onGround;
        if(onGround){
            wheel.onGroundHist = 10;
            wheel.groundNorm = norm;
        }
    }
    
    
    function hitPoint(pointBody){
        
        if( ! pointBody.onHit)
            return;
        
        pointBody.onHit();
        
        body.backPrevForce();
        
        msgSerivce.trigger(model.MsgType.CAR_ADD_SCORE);
    }
    
    
    this.afterStep = function(){
        
        if( ! acc && ! brakes)
            return;
        
        var wheelsOnGround = backWheel.onGround || frontWheel.onGround;
        if( ! wheelsOnGround)
            return;
        
        var accVec = body.getAcc();
        var wheelsVec = getWheelsVec();
        
        var newAccVec = null;
        if(acc)
            newAccVec = {x: accVec.x + wheelsVec.x, y: accVec.y + wheelsVec.y};
        if(brakes)
            newAccVec = {x: accVec.x - wheelsVec.x, y: accVec.y - wheelsVec.y};
        
        if(newAccVec)
            body.setAcc(newAccVec.x, newAccVec.y);
        
        
    }
    
    function getWheelsVec(){
        
        var wheelsVec = {x: 0, y:0};
        
        addAccVectorOfWheel(wheelsVec, backWheel);
        addAccVectorOfWheel(wheelsVec, frontWheel);
        
        wheelsVec.x *= opt.accVal;
        wheelsVec.y *= opt.accVal;
        
        return wheelsVec;
    }
    
    function addAccVectorOfWheel(accVec, wheel){
        
        if( ! wheel.onGround)
            return;
        
        accVec.x += wheel.groundNorm.y;
        accVec.y -= wheel.groundNorm.x;
    }
    
    
    
    
    this.beforeNextStep = function(){
        resetWheelStateIfNeed(backWheel);
        resetWheelStateIfNeed(frontWheel);
    }
    
    function resetWheelStateIfNeed(wheel){
        if(wheel.onGroundHist > 0){
            wheel.onGroundHist--;
            return;
        }
        
        wheel.onGroundHist = 0;
        wheel.onGround = false;
    }
        
    
    this.startAccelerator = function(){
        acc = true;
    }
    
    this.stopAccelerator = function(){
        acc = false;
    }
    
    this.startBrakes = function(){
        brakes = true;
    }
    
    this.stopBrakes = function(){
        brakes = false;
    }
    
    this.getElems = function(){
        return elems;
    }
    
    this.getState = function(){
        return body;
    }
    
    init();
    
}

