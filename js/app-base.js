
var AppBase = {
    
    createParamsApp: function(){
        
        var w = 1024;
        var h = 600;
        
//        if(true || BrowserUtil.isMobile()){
//            
//        }
        
        var out = {

            w: w,
            h: h,

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

