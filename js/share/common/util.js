

var Util = {
    
    getLog: function(name){
        
        try {
            return LogFactory.getLog(name);
        } catch(e){}
        
        try {
            return new CLog(name);
        }catch(e){}
        
        return null;
    },
	
	/**
	 * Требуется инициализация страницы, не дожидаясь старта контроллеров.
	 * Флаг используется для инициализации различных визуальных элементов и
	 * проставления нужных css классов.
	 */
	isNeedToInitState: function(){
		return $("html").attr("p-initState") === "true";
	},

    isEmpty: function(ob){
        return ob === null? true : (ob === undefined? true: false);
    },

    isEmptyString: function(str){
        return Util.isEmpty(str) || str.length === 0 || str.trim().length === 0;
    },

    isEmptyArray: function(ob){
        return Util.isEmpty(ob) || ob.length === 0;
    },

	isEmptyMap: function(ob){
		return Util.isEmpty(ob) || Util.mapSize(ob) == 0;
	},

    checkArgumentForEmpty: function(arg, errorMsg){
        if(Util.isEmpty(arg)){
            throw new Error("Invalid argument: "+errorMsg);
        }
    },

    checkArgument: function(condition, errorMsg){
        if(!condition){
            throw new Error("Invalid argument: "+errorMsg);
        }
    },

    extend: function(target, other){
        
        if(Util.isEmpty(other))
            return target;
        
        for(var key in other)
            if(other.hasOwnProperty(key))
                target[key] = other[key];
        return target;
    },

    generateUid: function(){
        var randomSuffix = "";
        for(var i = 1; i < 5; i++){
            randomSuffix = randomSuffix + (Math.floor(Math.random()*10));
        }
        var timestamp = ""+new Date().getTime();
        var firstPart = timestamp.substring(0, timestamp.length-3);
        var secondPart = timestamp.substring(timestamp.length-3, timestamp.length);
        return firstPart+"-"+secondPart+"-"+randomSuffix;
    },

    /**
     * @param source
     * @param deep - optional (default - true)
     */
    clone: function(source, deep){
        if(Util.isEmpty(source)){
            return null;
        }

        if(Util.isEmpty(deep)){
            deep = true;
        }

        if($.isArray(source)){
            var result = [];
            $.each(source, function(i, item){
                result.push(Util.clone(item, deep));
            });
            return result;
        }else{
            return $.extend(deep,{},source);
        }
    },

    inherit: function(ChildType, ParentType) {
		var F = function() { };
		F.prototype = ParentType.prototype;
		ChildType.prototype = new F();
		ChildType.prototype.constructor = ChildType;
		ChildType.superclass = ParentType.prototype;
    },


    getValue: function(obj, exp){

        if(Util.isEmpty(obj)){
            return null;
        }

        var fields = exp.split(".");
        var curObj = obj;
        for(var i=0; i<fields.length; i++){
            var field = fields[i];
            var curValue = curObj[field];
            if(Util.isEmpty(curValue)){
                return null;
            } else {
                curObj = curValue;
            }
        }
        return curObj;

    },

    deleteField: function(obj, fieldName){
        var value = obj[fieldName];
        delete obj[fieldName];
        return value;
    },

    toStringFn: function(){
        return Util.toString(this, true);
    },

    toString: function(obj, deep){
		
		if(deep)
			if(JSON && JSON.stringify)
				return JSON.stringify(obj);
			else 
				return ""+obj; //dummy impl


		if(typeof obj == 'number')
			return ""+obj;

		if(Util.isString(obj))
			return ""+obj;

		//one level string
		var outStr = "";
		if( ! Util.isEmpty(obj)){

			var hasFields = false;

			outStr = "{";
			var first = true;
			$.each(obj, function(name, value){
				hasFields = true;
				if(first)
					first = false;
				else 
					outStr += ", ";
				outStr += name+":"+value;
			});
			outStr += "}";

			if(!hasFields)
				return ""+obj;

		} else {
			outStr = "null";
		}
		
		return outStr;
    },

    cloneById: function(id, opt){

		opt = Util.extend({
			root: null
		}, opt);

		var elem = opt.root ? $("#"+id, opt.root) : $("#"+id);
		if(elem.length === 0) 
			throw new Error("can't find template for clone by id='"+id+"'");
        return Util.cloneByElem(elem, opt);
    },

    cloneByElem: function(elem, opt){

        opt = Util.extend({
			skipShowHide: false,
            hide: false,
            id: null
        }, opt);

        if(Util.isEmpty(elem) || elem.length === 0)
            throw new Error("can't find template for clone: "+elem);

        var cloneElem = elem.clone();
        if(opt.id) cloneElem.attr("id",opt.id);
		else cloneElem.removeAttr("id");

		if( ! opt.skipShowHide){
			if( ! opt.hide) 
				cloneElem.show();
			else 
				cloneElem.hide();
		}
        

        //cloneElem.bindedUI = Bind.createUI(cloneElem);
        return cloneElem;

    },

	append: function(elem, content){
		return elem.append(content).children().last();
	},

	/**
	 * Returns a random DOUBLE number between min and max
	 */
	getRandomArbitary: function(min, max) {
	  return Math.random() * (max - min) + min;
	},

	/**
	 * Returns a random integer between min and max
	 */
	getRandomInt: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	isHttps: function(){
		return 'https:' == document.location.protocol;
	},

	ascSort : function(a, b){
        return a < b? -1 : (a > b ? 1 : 0);
    },

    descSort : function(a, b){
        return -1 * Util.ascSort(a, b);
    },

	parseInt: function(obj, defaultVal){
		
		if(Util.isEmpty(obj))
			return defaultVal;
		
		try {
			var out = window.parseInt(obj, 10);
			return isNaN(out)? defaultVal : out;
		}catch(e){
			return defaultVal;
		}
	},

	parseFloat: function(obj, defaultVal){
		
		if(Util.isEmpty(obj))
			return defaultVal;
		
		try {
			return window.parseFloat(obj);
		}catch(e){
			return defaultVal;
		}
	},

	listToMap: function(list){
		var out = {};
		$.each(list, function(i, key){
			out[key] = true;
		});
		return out;
	},

	mapToList: function(map){
		var out = [];
		$.each(map, function(key, val){
			out.push(val);
		});
		return out;
	},

	mapSize: function(map){
		var count = 0;
		$.each(map, function(){
			count++;
		});
		return count;
	},

	isString: function(val){
		if(typeof val == 'string' || val instanceof String) return true;
		return false;
	},

	isNum: function(val){
		return $.isNumeric(val);
	},

	getProp: function(key, defVal){
		if(!window.Props) return defVal;
		return window.Props[key];
	},


	initAndAppend: function(controllerType, parent){
		var c = new window[controllerType]();
		c.init();
		parent.append(c.getUI());
	},
	
	
	waitAndStartLast: function(name, fn, time){
		
		name = "_waitAndStartLast-"+name;
		
		var id = Util.generateUid();
		window[name] = id;
		setTimeout(function(){
			var curId = window[name];
			if(curId === id)
				fn();
		}, time);
		
	},
	
	argumentsToArray: function(callerArguments){
		var args = [];
		for (i = 0; i < callerArguments.length; i++)
			args.push(callerArguments[i]);
		return args;
	},
	
	getCaller: function(callerArguments){
		if(!callerArguments || !callerArguments.callee)
			return "unknown";
		return callerArguments.callee.caller.toString();
	},
    
    removeFromArray: function(list, candidat, checkFn){
        
        var removed = null;
        
        for(var i=list.length-1; i > -1; i--){
            if((checkFn && checkFn(list[i], candidat)) 
                    || ( ! checkFn && list[i] == candidat)){
                removed = list[i];
                list.splice(i, 1);
                break;
            }
        }
        
        return removed;
    }

};