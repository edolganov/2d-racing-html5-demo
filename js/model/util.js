
model.Util = {
    
    hasElemCollision: function(rootBody, elem, pos){
        
        var center = rootBody.getCenter();
        var offset = rootBody.getOffset();
        var rotation = rootBody.getRotation();

        var rotationX = center.x - offset.x;
        var rotationY = center.y - offset.y;

        var beforeRotationX = center.x + elem.x;
        var beforeRotationY = center.y + elem.y;

        var elemCenterX = rotationX 
                + (beforeRotationX - rotationX) * Math.cos(rotation) 
                - (beforeRotationY - rotationY) * Math.sin(rotation);
        var elemCenterY = rotationY 
                + (beforeRotationY - rotationY) * Math.cos(rotation) 
                + (beforeRotationX - rotationX) * Math.sin(rotation);
        
        if(elem.type == model.PrimitiveType.CIRCLE){
            if(!elem.rr)
                elem.rr = Math.pow(elem.radius, 2);
            var dist = Math.pow(pos.x - elemCenterX, 2) + Math.pow(pos.y - elemCenterY, 2);
            return dist <= elem.rr;
        }
        return false;
    } 
    
};

