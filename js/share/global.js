

var Global = {
	
	log: window.LogFactory? LogFactory.getLog("Global") 
        : (window.CLog? new CLog("Global") 
            : null),
	context: {},
	params: {},
    
    debug: function(msg){
        Global.log.debug(msg);
    }
	
};
