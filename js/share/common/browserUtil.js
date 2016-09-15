
BrowserUtil = {
    
    openUrl: function(url){
        window.open(url, "_self");
    },

    isTouchDevice: function(){
        try{
            document.createEvent("TouchEvent");
            return true;
        }catch(e){
            return false;
        }
    },

	getCurrentOS: function(){
		var appVersion = navigator.appVersion;
		if (appVersion.indexOf("Android")!=-1) return "android";
		if (appVersion.indexOf("Mac")!=-1) return "mac";
		if (appVersion.indexOf("Win")!=-1) return "windows";
		if (appVersion.indexOf("X11")!=-1) return "unix";
		if (appVersion.indexOf("Linux")!=-1) return "linux";

		return "unknown"
	},

	isNixOS: function(){
		var os = BrowserUtil.getCurrentOS();
		return os === "unix" || os === "linux";
	},

	isMac: function(){
		var os = BrowserUtil.getCurrentOS();
		return os === "mac";
	},

	isAndroid: function(){
		var os = BrowserUtil.getCurrentOS();
		return os === "android";
	},

	isIOS: function(){
		var nP = navigator.platform;
		return nP == "iPad" || nP == "iPhone" || nP == "iPod" || nP == "iPhone Simulator" || nP == "iPad Simulator";
	},

	isWinPhone: function(){
		return navigator.userAgent.match(/Windows Phone/i);
	},

	isBlackBerry: function(){
		return navigator.userAgent.match(/BlackBerry/i);
	},

	isMobile: function(){
		if(BrowserUtil.isAndroid()
			|| BrowserUtil.isIOS()
			|| BrowserUtil.isWinPhone()
			|| BrowserUtil.isBlackBerry()) return true;
		return false;
	},

	isIE: function(){
		var userAgent = navigator.userAgent;
		return $.browser.msie || (userAgent.indexOf("like Gecko") != -1 && userAgent.indexOf("rv") != -1);
	},

	isIE9: function(){
		return $.browser.msie && $.browser.version == 9;
	},

    isIE10: function(){
        return $.browser.msie && $.browser.version == 10;
    },

	isIPad: function(){
		return navigator.userAgent.match(/iPad/i) != null;
	},

	isIPhone: function (){
		return (
			//Detect iPhone
			(navigator.platform.indexOf("iPhone") != -1) ||
			//Detect iPod
			(navigator.platform.indexOf("iPod") != -1)
		);
	},

	isIPhone4: function(){
		return BrowserUtil.isIPhone() && (window.screen.height == (960 / 2));
	},

	isIPhone5: function(){
		return BrowserUtil.isIPhone() && (window.screen.height == (1136 / 2));
	},

	isChrome: function(){
		return /chrome/.test(navigator.userAgent.toLowerCase());
	},

	isFirefox: function(){
		return /firefox/.test(navigator.userAgent.toLowerCase());
	},

	isOpera: function(){
		return $.browser.opera;
	},

	isSafari: function(){
		return navigator.userAgent.indexOf("Safari") > -1;
	},

	isWebkit: function(){
		return $.browser.webkit;
	},

	getBrowserVersion: function(){
		return $.browser.version;
	},

	inIframe: function () {
		try {
			return window.self !== window.top;
		} catch (e) {
			return false;
		}
	},

	initWindowStateClasses: function(opt){

		opt = Util.extend({
			smallWidth: 767,
			mediumWidth: 991
		}, opt);

		var s1 = "state-big";
		var s2 = "state-medium";
		var s3 = "state-small";

		var w = $(window);
		var html = $("html");
		var checkState = function(){
			var width = w.width();
			if(width <= opt.smallWidth) {
				html.removeClass(s1).removeClass(s2).addClass(s3);
				return;
			}
			if(width <= opt.mediumWidth) {
				html.removeClass(s1).removeClass(s3).addClass(s2);
				return;
			}
			html.removeClass(s2).removeClass(s3).addClass(s1);
		}
		checkState();
		w.on('resize', checkState);
	},

	isSmallState: function(){
		return $("html").hasClass("state-small");
	},

	scrollOnTop: function(){
		window.scrollTo(0, 0);
	},

	onHashChange: function(checkElem, fn){

		var realHandlers = $(window).data("hashchange.realHandlers");
		if(!realHandlers){
			realHandlers = [];
			$(window).data("hashchange.realHandlers", realHandlers);
		}
		
		checkElem.data("hashchange.init", true);
		realHandlers.push({checkElem:checkElem, fn:fn});
		Global.log.info("add hashchange handler for: " + Util.getValue(checkElem, "0", checkElem));


		var singleHandler = $(window).data("hashchange.handler");
		if(!singleHandler){
			singleHandler = function(event){
				var handler;
				for (var i = 0; i < realHandlers.length; i++) {
					handler = realHandlers[i];
					if( ! handler.checkElem.data("hashchange.init")) {
						Global.log.info("skip hashchange handler for: "+ Util.getValue(handler.checkElem, "0", handler.checkElem));
						continue;
					}
					handler.fn(event);
				}
			}
			$(window).data("hashchange.handler", singleHandler);
			$(window).bind('hashchange', singleHandler);
		}
	},

	changeUrlHash: function(hash){
		var oldHash = window.location.hash;
		if(oldHash == hash) return oldHash;

		function changeImpl(val){
			if(history.pushState) history.pushState(null, null, val);
			if(window.location.hash === oldHash){
				window.location.hash = val;
			}
		}

		if(Util.isEmptyString(hash)){
			var urlWithoutHash = window.location.href.split('#')[0];
			changeImpl(urlWithoutHash);
			return oldHash;
		}

		changeImpl(hash);
		return oldHash;
	}

};



if(Util.isNeedToInitState()){
	BrowserUtil.initWindowStateClasses();
}