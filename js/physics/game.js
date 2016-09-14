
physics.Game = function(){
    
    var world = Physics({
        timestep: 1000.0 / 160,
        maxIPF: 16,
        _integrator: 'verlet'
    });
    
    var msgService = MsgService.namedService("physics.Game");
    
    function init(){
        
        if(Global.params.app.usePhysicsRender)
            initOwnRender();
        
        //edge collision
//        world.add(Physics.behavior('edge-collision-detection', {
//            aabb: Physics.aabb(-900, -900, 99000, 99000),
//            restitution: 0.99,
//            cof: 0.99
//        }));
        
        //gravity
        var gravity = Physics.behavior('constant-acceleration', {
            acc: { 
                x: 0, 
                y: 0.001
            }
        });
        world.add(gravity);

        //bodies collision
        world.add([
            Physics.behavior('body-impulse-response'),
            Physics.behavior('body-collision-detection'),
            Physics.behavior('sweep-prune')
        ]);
        
        
        //collision events
        world.on('collisions:detected', function(data){
            for (var i = 0; i < data.collisions.length; i++)
                onCollision(data.collisions[i]);
        });
    }
    
    function onCollision(coll){
        var a = coll.bodyA;
        var b = coll.bodyB;
        var globalPos = {
            x: a.state.pos.x + coll.pos.x,
            y: a.state.pos.y + coll.pos.y
        };
        var aHandler = a.backHandler;
        var bHandler = b.backHandler;
        var norm = coll.norm;
        
        if(aHandler && bHandler){
            if(aHandler.onCollision)
                aHandler.onCollision(bHandler, globalPos, norm);
            if(bHandler.onCollision)
                bHandler.onCollision(aHandler, globalPos, norm);
        }
        
        if(Global.params.app.showCollisions)
            msgService.trigger(
                    model.MsgType.PHYSICS_COLLISION, 
                    [globalPos, norm, aHandler, bHandler]);
    }
    
    function initOwnRender(){
        
        var renderer = Physics.renderer('canvas', {
            el: 'physics',
            width: 800,
            height: 300,
            meta: false
        });
        world.add( renderer );
        world.on('step', function(){
            world.render();
        });
    }
    
    this.step = function(now){
        world.step(now);
    }
    
    this.addElem = function(elem){
        
        var body = convertToBody(elem);
        
        world.add(body);
        
        return new physics.BodyPhysicsImpl(world, body);
        
        
    }
    
    this.addCompound = function(opt){
        
        opt = Util.extend({
            x:0, 
            y:0,
            isStatic: false,
            restitution: 0.7,
            children: []
        }, opt);
        
        var treatment = opt.isStatic? "static" : "dynamic";
        var children = convertToBodies(opt.children);
        
        var body = Physics.body('compound', {
            objType: opt.objType,
            x: opt.x,
            y: opt.y,
            restitution: opt.restitution,
            treatment: treatment,
            children: children
        });
        
        world.add(body);
        
        return new physics.BodyPhysicsImpl(world, body);
    }
    
    function convertToBodies(elems){
        var out = [];
        $.each(elems, function(i, elem){
            out.push(convertToBody(elem));
        });
        return out;
    }
    
    function convertToBody(elem){
        
        var ops = {};
        
        ops.mass = Util.isEmpty(elem.mass)? 1 : elem.mass;
        ops.restitution = Util.isEmpty(elem.restitution)? 0 : elem.restitution;
        
        if( ! Util.isEmpty(elem.isStatic))
            ops.treatment = elem.isStatic? "static" : "dynamic";
        
        if( ! Util.isEmpty(elem.objType))
            ops.objType = elem.objType;
        
        
        if(elem.type == model.PrimitiveType.RECTANGLE){
            ops.x = elem.x;
            ops.y = elem.y;
            ops.width = elem.w;
            ops.height = elem.h;
            ops.angle = elem.angle || 0;
            return Physics.body('rectangle', ops);
        }
            
        if(elem.type == model.PrimitiveType.CIRCLE){
            ops.x = elem.x;
            ops.y = elem.y;
            ops.radius = elem.radius;
            return Physics.body('circle', ops);
        }
        
        throw new Error("Unknown type to create body: "+elem.type);
    }
    
    
    
    
    
    
    
    
    init();
};

