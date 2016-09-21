
$(function(){
   new App(); 
});


function App(){
    
    var msgService = MsgService.namedService("App");
   
    var score = 0;
    var totalScore = 0;
    var levelIsDone = false;
    
    //model
    var map;
    var car;
    var points;
    var game;
    
    //view
    var rootStage;
    var mapStage;
    var carStage;
    var pointsStage;
    var scoreElem = $(".scoreElem");
    
    var p;
    
    
    function init(){
        
        AppBase.initNoLogMsgTypes();
        
        p = AppBase.createParamsApp();
        Global.params.app = p;
        
        var initCarX = p.debugCar? 0 : 180;
        var initCarY = p.debugCar? 0 : 140;
        
        Global.context.phys = new physics.Game();
        
        map = new model.map.Map();
        car = new model.car.Car({
            x: initCarX,
            y: initCarY
        });
        
        points = new model.point.Points();
        points.addListener({
            onPointAdded: function(){
                totalScore++;
            }
        })
        
        game = new model.Game(map, car, points);

        rootStage = new render.RootStage(p.w, p.h, game);
        mapStage = new render.map.MapStage(map);
        carStage = new render.car.PlayerCar(car);
        pointsStage = new render.point.PointsStage(points);
        
        
        //createRandomMap();
        createMap01();
        

        rootStage.addStage(mapStage);
        rootStage.addStage(pointsStage);
        rootStage.addStage(carStage);
        
        
        if( ! p.usePhysicsRender)
            $("#physics").hide();
        
        updateScoreLabel();
        
        
        //events
        msgService.bind(model.MsgType.CAR_ADD_SCORE, function(){
            score++;
            updateLevelState();
            updateScoreLabel();
        })
    }
    
    function updateScoreLabel(){
        scoreElem.text(score + " / " + totalScore);
    }
    
    function updateLevelState(){
        
        if(levelIsDone)
            return;
        
        if(score < totalScore)
            return;
        
        levelIsDone = true;
        
        setTimeout(function(){
            alert("You are the Best! \n Thank you for a game :)");
        }, 1000);
        
    }
    
    function createMap01(){
        
        map.addBlock({x: 0, y: 100, w: 900, angle: Math.PI/2});
        map.addBlock({x: 305, y: 200, angle: 0});
        map.addBlock({x: 720, y: 110, w:300, angle: -Math.PI/5});
        map.addBlock({x: 955, y: 110, w:300, angle: Math.PI/5});
        map.addBlock({x: 1355, y: 200, angle: 0});
        map.addBlock({x: 1655, y: 100, angle: Math.PI/2});
        
        
        //points
        addPoints(1, 1, 840, -600);
        addPoints(3, 3, 760, -480);
        addPoints(10, 3, 480, -200);
        addPoints(5, 1, 160, 100);
        addPoints(5, 1, 1200, 100);
        addPoints(2, 1, 360, 175);
        addPoints(2, 1, 1240, 175);
        
        addPoints(1, 15, 1700, -600);
        addPoints(1, 10, 40, -550);

        
    }
    
    function addPoints(rows, lines, initX, initY){
        var stepX = 80;
        var stepY = 70;
        for(var i=0; i < rows; i++)
            for(var j=0; j<lines; j++)
                points.addSimplePoint(initX+(stepX *i), initY+(j*stepY));
    }
    
    
    init();
}



