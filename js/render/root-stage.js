
render.RootStage = function(w, h, game){
    
    var renderer = PIXI.autoDetectRenderer(w, h,{backgroundColor : Colors.BLUE_01});
    var canvas = renderer.view;
    var c = new PIXI.Container();
    var docElem = $(document);
    var stages = [];
    var p = {};
    var msgService = MsgService.namedService("render.RootStage");
    
    function init(){
        
        Global.params.stage = p;
        
        p.moveByCar = ! Global.params.app.debugCar && Global.params.app.moveCameraByCar;
        p.moveByBtns = Global.params.app.moveCameraByBtns;
        
        p.pause = false;
        
        p.zoomDelta = 0.1;
        p.moveDelta = 10;
        p.maxZoom = 2;
        p.minZoom = 0.5;
        
        p.moveUp = false;
        p.moveDown = false;
        p.moveLeft = false;
        p.moveRight = false;
        
        
        var initScale = Global.params.app.initScale;
        if(initScale){
            c.scale.x = initScale;
            c.scale.y = initScale;
        }


        
        $("#scene")[0].appendChild(canvas);
        
        $("#pause").click(function(){
            p.pause = !p.pause;
        });
        
        if(Global.params.app.showCollisions)
            initShowCollisions();
        
        docElem.keydown(function(e){
            
            if (e.keyCode === KeyUtil.UP) 
                p.moveUp = true;
            else if (e.keyCode === KeyUtil.DOWN) 
                p.moveDown = true;
            else if (e.keyCode === KeyUtil.LEFT) 
                p.moveLeft = true;
            else if (e.keyCode === KeyUtil.RIGHT) 
                p.moveRight = true;
            else if (e.keyCode === KeyUtil.D)
                game.car().startAccelerator();
            else if (e.keyCode === KeyUtil.A)
                game.car().startBrakes();
            
            
            return true;
        });
        docElem.keyup(function(e){
            
            if (e.keyCode === KeyUtil.UP) 
                p.moveUp = false;
            else if (e.keyCode === KeyUtil.DOWN) 
                p.moveDown = false;
            else if (e.keyCode === KeyUtil.LEFT) 
                p.moveLeft = false;
            else if (e.keyCode === KeyUtil.RIGHT) 
                p.moveRight = false;
            else if (e.keyCode === KeyUtil.D)
                game.car().stopAccelerator();
            else if (e.keyCode === KeyUtil.A)
                game.car().stopBrakes();
            
            return true;
        });
        
        $(canvas).mousewheel(function(e) {
            var isZoom = e.deltaY > 0;
            cameraZoomStep(isZoom);
        });
        
        var btnRight = $("#moveRight");
        btnRight.mousedown(function(){
            game.car().startAccelerator();
        });
        btnRight.on('touchstart', function(){
            game.car().startAccelerator();
        });
        
        btnRight.mouseup(function(){
            game.car().stopAccelerator();
        });
        btnRight.on('touchend', function(){
            game.car().stopAccelerator();
        });
        
        
        var btnLeft = $("#moveLeft");
        btnLeft.mousedown(function(){
            game.car().startBrakes();
        });
        btnLeft.mouseup(function(){
            game.car().stopBrakes();
        });
        
        $("#reset").click(function(){
           game.car().resetPosition(); 
        });

        animate();
    }
    
    function initShowCollisions(){
        
        p.hasCollisionLayer = true;
        
        var g = new PIXI.Graphics();
        c.addChild(g);
        
        msgService.bind(model.MsgType.PHYSICS_COLLISION, function(e, pos, norm, bodyA, bodyB){
            g.clear();
            g.lineStyle(1, Colors.WHITE, 1);
            g.beginFill(Colors.WHITE);
            g.drawCircle(pos.x, pos.y, 5);
            
            var moveDir = {x: norm.y * 100, y: -norm.x * 100};
            g.moveTo(pos.x, pos.y);
            g.lineTo(pos.x + moveDir.x, pos.y + moveDir.y);
            g.drawCircle(pos.x + moveDir.x, pos.y + moveDir.y, 2);
        });
    }
    
    
    this.addStage = function(stage){
        
        stages.push(stage);
        
        var index = c.children.length;
        if(p.hasCollisionLayer && index > 0)
            index--;
        
        c.addChildAt(stage.getContainer(), index);
    }
    
    this.moveTo = function(x, y){
        cameraMove(x, y);
    }
    
    function animate() {
        
        requestAnimationFrame(animate);
        
        if(p.pause)
            return;
        
        game.step();
        
        renderStep();
        
        game.afterStep();
        
        
    }
    
    
    
    function renderStep(){
        
        if(p.moveByBtns)
            moveCameraByBtns();
        else if(p.moveByCar)
            moveCameraByCar();

        //update stages
        var pos = c.position;
        var scale = c.scale.x;
        for (var i=0; i< stages.length; i++)
            stages[i].update({
                x: pos.x / scale,
                y: pos.y / scale
            });
        
        renderer.render(c);

    }
    
    function moveCameraByBtns(){
        
        if(p.moveUp)
            cameraMoveStep(model.MoveType.UP);
        if(p.moveDown)
            cameraMoveStep(model.MoveType.DOWN);
        if(p.moveLeft)
            cameraMoveStep(model.MoveType.LEFT);
        if(p.moveRight)
            cameraMoveStep(model.MoveType.RIGHT);
    }
    
    function moveCameraByCar(){
        
        var car = game.car();
        var center = car.getState().getCenter();
        var x = 250 - c.scale.x * center.x;
        var y = 300 - c.scale.y * center.y;
        
        //Global.log.info("camera move by car: "+x+" "+y);
        
        cameraMove(x, y);
        
    }
    
    function cameraMoveStep(type){
        
        if(type == model.MoveType.DOWN)
            c.position.y -= p.moveDelta;

        if(type == model.MoveType.UP)
            c.position.y += p.moveDelta;

        if(type == model.MoveType.RIGHT)
            c.position.x -= p.moveDelta;

        if(type == model.MoveType.LEFT)
            c.position.x += p.moveDelta;  
        
    }
    
    function cameraMove(x, y){
        c.position.x = x;
        c.position.y = y;
    }
    
    function cameraZoomStep(isZoom){
        
        var curScale = c.scale.x;
        if(isZoom)
            curScale += p.zoomDelta;
        else 
            curScale -= p.zoomDelta;
        
        if(curScale > p.maxZoom)
            curScale = p.maxZoom;
        else if(curScale < p.minZoom)
            curScale = p.minZoom;
        
        c.scale.x = curScale;
        c.scale.y = curScale;
        
    }
    
    
    
    
    
    init();
}