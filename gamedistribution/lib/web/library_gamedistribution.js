// https://kripken.github.io/emscripten-site/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html

var GameDistributionLibrary = {

    $Context: {
        listener: null
    },

    GameDistribution_PlatformInit: function(gameId, debug) {
        window["GD_OPTIONS"] = {
    		"gameId": UTF8ToString(gameId),
    		"advertisementSettings": {
    			"debug": (debug == 1), // Enable IMA SDK debugging.
    			"autoplay": false, // Don't use this because of browser video autoplay restrictions.
    			"locale": "en", // Locale used in IMA SDK, this will localize the "Skip ad after x seconds" phrases.
    		},
    	};
        window["GD_OPTIONS"]["onEvent"] = function(event) {
            if (!Context.listener) {
                console.log("No listener set");
                return;
            }
            dynCall("vii", Context.listener, [
                allocate(intArrayFromString(event.name), "i8", ALLOC_STACK),
                allocate(intArrayFromString(event.message), "i8", ALLOC_STACK)
            ]);
        };

        // https://gamedistribution.com/sdk/html5
        var id = 'gamedistribution-jssdk';
        var js, fjs = document.getElementsByTagName('script')[0];
        if (document.getElementById(id)) return;
        js = document.createElement('script');
        js.id = id;
        js.src = 'https://html5.api.gamedistribution.com/main.min.js';
        fjs.parentNode.insertBefore(js, fjs);
    },

    GameDistribution_PlatformSetEventListener: function(listener) {
        Context.listener = listener;
    },

    GameDistribution_PlatformShowAd: function() {
        if (typeof gdsdk !== 'undefined' && gdsdk.showAd !== 'undefined') {
            gdsdk.showAd();
        }
    },

    GameDistribution_PlatformOpenConsole: function() {
        if (typeof gdsdk !== 'undefined' && gdsdk.openConsole !== 'undefined') {
            gdsdk.openConsole();
        }
    }
};

autoAddDeps(GameDistributionLibrary, "$Context");

mergeInto(LibraryManager.library, GameDistributionLibrary);
