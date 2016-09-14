
model.car.fn.BASIC = function(opt){
    
    var w = opt.s(80);
    var h = opt.s(60);
    
    var cabinMass = 500;
    var typeRadius = h/4;
    var typeMass = 50000;
    var typeRestitution = 0.3;
    var bamper = typeRadius*0.1;
    
    return {
        cabin: {
            label: "cabin",
            type: model.PrimitiveType.RECTANGLE,
            x: 0,
            y: 0,
            w: w,
            h: h/4,
            mass: cabinMass,
            restitution:0
        },
        backWheel: {
            label: "backWheel",
            type: model.PrimitiveType.CIRCLE,
            x: -w/2,
            y: 0,
            radius:typeRadius,
            mass: typeMass,
            restitution: typeRestitution
        },
        frontWheel: {
            label: "fronWheel",
            type: model.PrimitiveType.CIRCLE,
            x: w/2,
            y: 0,
            radius:typeRadius,
            mass: typeMass,
            restitution: typeRestitution
        }
    };
    
    
}

