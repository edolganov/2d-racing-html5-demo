
function MsgServiceImpl(){

	var log = LogFactory.getLog("MsgService");
	var self = this;
	var byType = {};
    var noLogTypes = {};
    
    this.addNoLogType = function(type){
        noLogTypes[type] = true;
    }
    
    this.removeNoLogType = function(type){
        delete noLogTypes[type];
    }
	
	/**
	 * Подписаться на сообщения
	 * @argument {String} type - тип сообщения
	 * @argument {Func} fn - обработчик
	 * @argument {String} listenerName - имя подписуемого (опционально)
	 * @argument {jQueryElem} checkStateElem - элемент для авто отписки (опционально)
	 */
	this.bind = function(type, fn, listenerName, checkStateElem){
				
		if( ! checkStateElem) 
			checkStateElem = $("body");
		
		var listeners = byType[type];
		if(!listeners) {
			listeners = [];
			byType[type] = listeners;
			$("body").bind(type, createBindFn(type));
		}
		
		checkStateElem.data("bind-check", true);
		listeners.push({fn:fn, name:listenerName, elem: checkStateElem});
	};

	/**
	 * Послать сообщение
	 */
	this.trigger = function(type, attrs, sourceName){
		
		cleanDeadListeners(type);
		
		var listeners = byType[type];
		var listNames;
		if(listeners){
			listNames = "";
			$.each(listeners, function(i, data){
				if(i > 0) listNames +=", ";
				listNames += data.name? data.name : "anonymous";
			});
		}
		
		var attrVals = "";
		if(attrs)
			$.each(attrs, function(i, val){
				if(i > 0) 
                    attrVals +=", ";
				attrVals += Util.toString(val, true);
			});
        
        if( ! noLogTypes[type])
            log.info("[MSG] "
                + type +" "+attrVals
                + "\n"+(sourceName? sourceName : 'anonymous')
                +" --> "
                +(listNames? listNames : "empty"));
	
		if(!listeners)
			return;

		try {
			$("body").trigger(type, attrs);
		}catch(e){
			log.error("can't trigger "+type, e);
		}
	};



	
	/**
	 * Утилитный метод для создания именованных слушателей
	 */
	this.namedService = function(name){
		return {
			bind: function(type, fn, checkStateElem){
				self.bind(
						type, 
						fn, 
						name, 
						checkStateElem);
			},
			trigger: function(type, attrs){
				self.trigger(
						type, 
						attrs, 
						name);
			}
		};
	};
    
    this.stubService = function(){
        return {
            bind: function(){},
            trigger: function(){}
        };
    }
	
	
	function createBindFn(type){
		return function(){

			var listeners = byType[type];
			if(!listeners) 
				return;

			var callThis = this;
			var args = arguments;

			$.each(listeners, function(i, curListener){
				curListener.fn.apply(callThis, args);
			});
		};
	}
	
	function cleanDeadListeners(type){

		var listeners = byType[type];
		if(!listeners) 
			return;

		var filteredListeners = $.grep(listeners, function(curListener){
			var elem = curListener.elem;
			var valid = ! Util.isEmpty(elem) 
					&& elem.length > 0 
					&& elem.data("bind-check") == true;
			if( ! valid)
				log.warn("remove invalid listener for type="+type+": "+curListener.name);
			return valid;
		});
		byType[type] = filteredListeners;

	}

};

var MsgService = new MsgServiceImpl();

