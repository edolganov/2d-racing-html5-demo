
var AppBase = {
    
    createParamsApp: function(){
        
        var out = {

            w: 1024,
            h: 600,

            moveCameraByBtns: false,
            moveCameraByCar: true,
            usePhysicsRender: false,
            showCollisions: false,
            showMapBounds: true,
            initScale: 1,

            showWheelMove: false,
            debugCar: false
        };
        
        return out;
    },
    
    initNoLogMsgTypes: function(){
        
        MsgService.addNoLogType(model.MsgType.PHYSICS_COLLISION);
    }
    
    
    
}

