
model.car.CarStub = function(){
    
    var state = {
        
        getCenter: function(){
            return {x:0, y:0};
        },
        
        getOffset: function(){
            return {x:0, y:0};
        },
        
        getRotation: function(){
            return 0;
        }
    };
    
    this.addListener = function(){}
    
    this.resetPosition = function(){}
    
    this.startAccelerator = function(){}
    
    this.stopAccelerator = function(){}
    
    this.startBrakes = function(){}
    
    this.stopBrakes = function(){}
    
    this.afterStep = function(){}
    
    this.beforeNextStep = function(){}
    
    this.getElems = function(){
        return null;
    }
    
    this.getState = function(){
        return state;
    }
}

