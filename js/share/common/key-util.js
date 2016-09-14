
var KeyUtil = {
	
	ENTER: 13,
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    
    W: 87,
    A: 65,
    S: 83,
    D: 68,
	
	onEscape: function(fn){
		$(document).keyup(function(e) {
			if (e.keyCode == 27) 
				fn();
	   });
	},
	
	onCtrlS: function(fn){
		
		var w = $(window);
		
		var list = w.data("CtrlS_listeners");
		if(!list){
			list = [];
			w.data("CtrlS_listeners", list);
		}
		list.push(fn);
		
		w.keypress(function(e) {
			
			if (!(e.which == 115 && e.ctrlKey) 
					&& !(e.which == 19))
				return true;
			
			try {
				$.each(list, function(i, fn){
					fn();
				});
			}catch (e){
				Global.log.error("can't process ctrl+s", e);
			}
			
			e.preventDefault();
			return false;
		});
		
	},

	onCtrlEnter: function(input, fn){
        input.keydown(function(e){
            if(e.ctrlKey && e.keyCode === KeyUtil.ENTER)
                fn();
        });
	},

	onEnter: function(input, fn){
        input.keydown(function(e){
            if(e.keyCode === KeyUtil.ENTER)
                fn();
        });
	},

	onKeyDown: function(elem, key, fn){
        elem.keydown(function(e){
            if (e.keyCode === key) 
                return fn();
            return true;
        });
	},

	onKeyUp: function(elem, key, fn){
        elem.keydown(function(e){
            if (e.keyCode === key) 
                return fn();
            return true;
        });
	},

	onKeyPress: function(elem, key, fn){
        elem.keypress(function(e){
            if (e.keyCode === key) 
                return fn();
            return true;
        });
	},

	onArrowUp: function(elem, fn){
        KeyUtil.onKeyPress(elem, KeyUtil.UP, fn);
	},

	onArrowDown: function(elem, fn){
        KeyUtil.onKeyPress(elem, KeyUtil.DOWN, fn);
	},

	onArrowLeft: function(elem, fn){
        KeyUtil.onKeyPress(elem, KeyUtil.LEFT, fn);
	},

	onArrowRight: function(elem, fn){
        KeyUtil.onKeyUp(elem, KeyUtil.RIGHT, fn);
	}



};