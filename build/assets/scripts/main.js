(function () {
'use strict';

/**
 * the most terrible camelizer on the internet, guaranteed!
 * @param {string} str String that isn't camel-case, e.g., CAMeL_CaSEiS-harD
 * @return {string} String converted to camel-case, e.g., camelCaseIsHard
 */
var camelCase = function (str) { return ("" + (str.charAt(0).toLowerCase()) + (str
    .replace(/[\W_]/g, '|')
    .split('|')
    .map(function (part) { return ("" + (part.charAt(0).toUpperCase()) + (part.slice(1))); })
    .join('')
    .slice(1))); };

var Router = function Router (routes) {
  this.routes = routes;
};

/**
 * Fire Router events
 * @param {string} route DOM-based route derived from body classes (`<body class="...">`)
 * @param {string} [event] Events on the route. By default, `init` and `finalize` events are called.
 * @param {string} [arg] Any custom argument to be passed to the event.
 */
Router.prototype.fire = function fire (route, event, arg) {
    if ( event === void 0 ) event = 'init';

  var fire =
    route !== '' &&
    this.routes[route] &&
    typeof this.routes[route][event] === 'function';
  if (fire) {
    this.routes[route][event](arg);
  }
};

/**
 * Automatically load and fire Router events
 *
 * Events are fired in the following order:
 ** common init
 ** page-specific init
 ** page-specific finalize
 ** common finalize
 */
Router.prototype.loadEvents = function loadEvents () {
    var this$1 = this;

  // Fire common init JS
  this.fire('common');

  // Fire page-specific init JS, and then finalize JS
  document.body.className
    .toLowerCase()
    .replace(/-/g, '_')
    .split(/\s+/)
    .map(camelCase)
    .forEach(function (className) {
      this$1.fire(className);
      this$1.fire(className, 'finalize');
    });

  // Fire common finalize JS
  this.fire('common', 'finalize');
};

var common = {
  init: function init () {
    var content = document.querySelector('.page-content').children;
    Array.from(content).forEach(function (element) {});
  },
};

var routes = {
  common: common,
};

// Usually, you won't need to modify anything below this line.
var router = new Router(routes);

if (
  document.readyState === 'complete' ||
  (document.readyState !== 'loading' && !document.documentElement.doScroll)
) {
  router.loadEvents();
} else {
  document.addEventListener(
    'DOMContentLoaded',
    router.loadEvents.bind(router),
    false
  );
}

}());

//# sourceMappingURL=main.js.map
