
function polyfillForEach() {
    if (typeof Array.prototype.forEach !== "function") {
        Array.prototype.forEach = function (callback, thisArg) {
            if (typeof thisArg === "undefined") {
                thisArg = window;
            }
            for (var i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
            }
        };
    }
}

function polyFillClone() {
    if (typeof Array.prototype.clone !== "function") {
        Array.prototype.clone = function () {
            return this.slice(0);
        };
    }
}

function shallowEquals() {
    if (typeof Array.prototype.shallowEquals !== "function") {
        Array.prototype.shallowEquals = function (other) {
            if (this === other) {
                return true;
            }
            if (this === null || other === null) {
                return false;
            }
            if (this.length !== other.length) {
                return false;
            }

            for (var i = 0; i < this.length; i++) {
                if (this[i] !== other[i]) {
                    return false;
                }
            }
            return true;
        };
    }
}

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

(function () {
    polyfillForEach();
    polyFillClone();
    shallowEquals();
})();
if (typeof String.prototype.startsWith !== 'function') {
    String.prototype.startsWith = function (str) {
        return str.length > 0 && this.substring(0, str.length) === str;
    };
}

if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (str) {
        return str.length > 0 && this.substring(this.length - str.length, this.length) === str;
    };
}

String.prototype.replaceAll = function (toReplace, replacement) {
    var result = this.split(toReplace).join(replacement);
    return result;
};

String.prototype.toCamelCase = function () {
    var result = this.charAt(0).toLowerCase() + this.substring(1);
    result = result.replaceAll("-", "");
    return result;
};

String.prototype.toPascalCase = function () {
    var result = this.charAt(0).toUpperCase() + this.substring(1);
    result = result.replaceAll("-", "");
    return result;
};

String.prototype.hashCode = function () {
    var charCode, hash = 0;
    if (this.length === 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        charCode = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + charCode;
        hash = hash & hash;
    }
    return hash;
};
NodeList.prototype.forEach = Array.prototype.forEach;
NodeList.prototype.length = Array.prototype.length;
HTMLElement.prototype.knownElementTypes = [
    "a",
    "abbr",
    "acronym",
    "address",
    "applet",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "basefont",
    "bdi",
    "bdo",
    "bgsound",
    "big",
    "blink",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "center",
    "cite",
    "col",
    "colgroup",
    "content",
    "code",
    "data",
    "datalist",
    "dd",
    "decorator",
    "del",
    "details",
    "dfn",
    "dir",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "font",
    "footer",
    "form",
    "frame",
    "frameset",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "isindex",
    "kbd",
    "keygen",
    "label",
    "legend",
    "li",
    "link",
    "listing",
    "main",
    "map",
    "mark",
    "marque",
    "menu",
    "menuitem",
    "meta",
    "meter",
    "nav",
    "nobr",
    "noframes",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "plaintext",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "shadow",
    "small",
    "source",
    "spacer",
    "span",
    "strike",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "tt",
    "u",
    "ul",
    "var",
    "video",
    "wbr",
    "xmp"
];
HTMLElement.prototype.isKnownType = function () {
    if (!Bifrost.isNullOrUndefined("HTMLUnknownElement")) {
        if (this.constructor.toString().indexOf("HTMLUnknownElement") < 0) {
            return true;
        }
        return false;
    }

    var isKnown = this.constructor !== HTMLElement;
    if (isKnown === false) {
        var tagName = this.tagName.toLowerCase();
        isKnown = this.knownElementTypes.some(function (type) {
            if (tagName === type) {
                return true;
            }
        });
    }
    return isKnown;
};
HTMLElement.prototype.getChildElements = function () {
    var children = [];
    this.childNodes.forEach(function (node) {
        if (node.nodeType === 1) {
            children.push(node);
        }
    });
    return children;
};
HTMLCollection.prototype.forEach = Array.prototype.forEach;
HTMLCollection.prototype.length = Array.prototype.length;
// From the following thread : http://stackoverflow.com/questions/1056728/formatting-a-date-in-javascript
// author: meizz
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1,
              RegExp.$1.length === 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2012-11-15
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if ("document" in self && !(
        "classList" in document.createElement("_") &&
        "classList" in document.createElementNS("http://www.w3.org/2000/svg", "svg")
    )) {

    (function (view) {

        "use strict";

        if (!('Element' in view)) return;

        var
              classListProp = "classList"
            , protoProp = "prototype"
            , elemCtrProto = view.Element[protoProp]
            , objCtr = Object
            , strTrim = String[protoProp].trim || function () {
                return this.replace(/^\s+|\s+$/g, "");
            }
            , arrIndexOf = Array[protoProp].indexOf || function (item) {
                var
                      i = 0
                    , len = this.length
                ;
                for (; i < len; i++) {
                    if (i in this && this[i] === item) {
                        return i;
                    }
                }
                return -1;
            }
            // Vendors: please allow content code to instantiate DOMExceptions
            , DOMEx = function (type, message) {
                this.name = type;
                this.code = DOMException[type];
                this.message = message;
            }
            , checkTokenAndGetIndex = function (classList, token) {
                if (token === "") {
                    throw new DOMEx(
                          "SYNTAX_ERR"
                        , "An invalid or illegal string was specified"
                    );
                }
                if (/\s/.test(token)) {
                    throw new DOMEx(
                          "INVALID_CHARACTER_ERR"
                        , "String contains an invalid character"
                    );
                }
                return arrIndexOf.call(classList, token);
            }
            , ClassList = function (elem) {
                var
                      trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
                    , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
                    , i = 0
                    , len = classes.length
                ;
                for (; i < len; i++) {
                    this.push(classes[i]);
                }
                this._updateClassName = function () {
                    elem.setAttribute("class", this.toString());
                };
            }
            , classListProto = ClassList[protoProp] = []
            , classListGetter = function () {
                return new ClassList(this);
            }
        ;
        // Most DOMException implementations don't allow calling DOMException's toString()
        // on non-DOMExceptions. Error's toString() is sufficient here.
        DOMEx[protoProp] = Error[protoProp];
        classListProto.item = function (i) {
            return this[i] || null;
        };
        classListProto.contains = function (token) {
            token += "";
            return checkTokenAndGetIndex(this, token) !== -1;
        };
        classListProto.add = function () {
            var
                  tokens = arguments
                , i = 0
                , l = tokens.length
                , token
                , updated = false
            ;
            do {
                token = tokens[i] + "";
                if (checkTokenAndGetIndex(this, token) === -1) {
                    this.push(token);
                    updated = true;
                }
            }
            while (++i < l);

            if (updated) {
                this._updateClassName();
            }
        };
        classListProto.remove = function () {
            var
                  tokens = arguments
                , i = 0
                , l = tokens.length
                , token
                , updated = false
            ;
            do {
                token = tokens[i] + "";
                var index = checkTokenAndGetIndex(this, token);
                if (index !== -1) {
                    this.splice(index, 1);
                    updated = true;
                }
            }
            while (++i < l);

            if (updated) {
                this._updateClassName();
            }
        };
        classListProto.toggle = function (token, forse) {
            token += "";

            var
                  result = this.contains(token)
                , method = result ?
                    forse !== true && "remove"
                :
                    forse !== false && "add"
            ;

            if (method) {
                this[method](token);
            }

            return !result;
        };
        classListProto.toString = function () {
            return this.join(" ");
        };

        if (objCtr.defineProperty) {
            var classListPropDesc = {
                get: classListGetter
                , enumerable: true
                , configurable: true
            };
            try {
                objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
            } catch (ex) { // IE 8 doesn't support enumerable:true
                if (ex.number === -0x7FF5EC54) {
                    classListPropDesc.enumerable = false;
                    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                }
            }
        } else if (objCtr[protoProp].__defineGetter__) {
            elemCtrProto.__defineGetter__(classListProp, classListGetter);
        }

    }(self));
}
// From: http://www.jonathantneal.com/blog/faking-the-future/
this.Element && (function (ElementPrototype, polyfill) {
    function NodeList() { [polyfill] }
    NodeList.prototype.length = Array.prototype.length;

    ElementPrototype.matchesSelector = ElementPrototype.matchesSelector ||
    ElementPrototype.mozMatchesSelector ||
    ElementPrototype.msMatchesSelector ||
    ElementPrototype.oMatchesSelector ||
    ElementPrototype.webkitMatchesSelector ||
    function matchesSelector(selector) {
        var results = this.parentNode.querySelectorAll(selector);
        var resultsIndex = -1;

        while (results[++resultsIndex] && results[resultsIndex] != this) {}

        return !!results[resultsIndex];
    };

    ElementPrototype.ancestorQuerySelectorAll = ElementPrototype.ancestorQuerySelectorAll ||
    ElementPrototype.mozAncestorQuerySelectorAll ||
    ElementPrototype.msAncestorQuerySelectorAll ||
    ElementPrototype.oAncestorQuerySelectorAll ||
    ElementPrototype.webkitAncestorQuerySelectorAll ||
    function ancestorQuerySelectorAll(selector) {
        for (var cite = this, newNodeList = new NodeList(); cite = cite.parentElement;) {
            if (cite.matchesSelector(selector)) Array.prototype.push.call(newNodeList, cite);
        }
 
        return newNodeList;
    };
 
    ElementPrototype.ancestorQuerySelector = ElementPrototype.ancestorQuerySelector ||
    ElementPrototype.mozAncestorQuerySelector ||
    ElementPrototype.msAncestorQuerySelector ||
    ElementPrototype.oAncestorQuerySelector ||
    ElementPrototype.webkitAncestorQuerySelector ||
    function ancestorQuerySelector(selector) {
        return this.ancestorQuerySelectorAll(selector)[0] || null;
    };
})(Element.prototype);
var Bifrost = Bifrost || {};
(function(global, undefined) {
    Bifrost.extend = function extend(destination, source) {
        return $.extend(destination, source);
    };
})(window);
var Bifrost = Bifrost || {};
Bifrost.namespace = function (ns, content) {

    // Todo: this should not be needed, it is a symptom of something using it being wrong!!! Se issue #232 on GitHub (http://github.com/dolittle/Bifrost/issues/232)
    ns = ns.replaceAll("..", ".");
    if (ns.endsWith(".")) {
        ns = ns.substr(0, ns.length - 1);
    }
    if (ns.startsWith(".")) {
        ns = ns.substr(1);
    }

    var parent = window;
    var name = "";
    var parts = ns.split('.');
    parts.forEach(function (part) {
        if (name.length > 0) {
            name += ".";
        }
        name += part;
        if (!Object.prototype.hasOwnProperty.call(parent, part)) {
            parent[part] = {};
            parent[part].parent = parent;
            parent[part].name = name;
        }
        parent = parent[part];
    });

    if (typeof content === "object") {
        Bifrost.namespace.current = parent;

        var property;

        for (property in content) {
            parent[property] = content[property];
        }

        for (property in parent) {
            if (parent.hasOwnProperty(property)) {
                parent[property]._namespace = parent;
                parent[property]._name = property;
            }
        }
        Bifrost.namespace.current = null;
    }

    return parent;
};
Bifrost.namespace("Bifrost.execution", {
    Promise: function () {
        var self = this;

        this.id = Bifrost.Guid.create();

        this.signalled = false;
        this.callback = null;
        this.error = null;
        this.hasFailed = false;
        this.failedCallback = null;

        function onSignal() {
            if (self.callback != null && typeof self.callback !== "undefined") {
                if (typeof self.signalParameter !== "undefined") {
                    self.callback(self.signalParameter, Bifrost.execution.Promise.create());
                } else {
                    self.callback(Bifrost.execution.Promise.create());
                }
            }
        }

        this.fail = function (error) {
            if (self.failedCallback != null) {
                self.failedCallback(error);
            }
            self.hasFailed = true;
            self.error = error;
        };

        this.onFail = function (callback) {
            if (self.hasFailed) {
                callback(self.error);
            } else {
                self.failedCallback = callback;
            }
            return self;
        };


        this.signal = function (parameter) {
            self.signalled = true;
            self.signalParameter = parameter;
            onSignal();
        };

        this.continueWith = function (callback) {
            this.callback = callback;
            if (self.signalled === true) {
                onSignal();
            }
            return self;
        };
    }
});

Bifrost.execution.Promise.create = function() {
    var promise = new Bifrost.execution.Promise();
    return promise;
};
Bifrost.namespace("Bifrost", {
    isObject: function (o) {
        if (o === null || typeof o === "undefined" ) {
            return false;
        }
        return Object.prototype.toString.call(o) === '[object Object]';
    }
});
Bifrost.namespace("Bifrost", {
    isNumber: function (number) {
        if (Bifrost.isString(number)) {
            if (number.length > 1 && number[0] === '0') {
                return false;
            }
        }

        return !isNaN(parseFloat(number)) && isFinite(number);
    }
});
Bifrost.namespace("Bifrost", {
    isArray : function(o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    }
});
Bifrost.namespace("Bifrost", {
    isString: function (value) {
        return typeof value === "string";
        }
});
Bifrost.namespace("Bifrost", {
    isNull: function (value) {
        return value === null;
    }
});
Bifrost.namespace("Bifrost", {
    isUndefined: function (value) {
        return typeof value === "undefined";
    }
});
Bifrost.namespace("Bifrost", {
    isNullOrUndefined: function (value) {
        return Bifrost.isUndefined(value) || Bifrost.isNull(value);
    }
});
Bifrost.namespace("Bifrost", {
    isFunction: function (value) {
        return typeof value === "function";
    }
});
Bifrost.namespace("Bifrost", {
    isType: function (o) {
        if (Bifrost.isNullOrUndefined(o)) {
            return false;
        }
        return typeof o._typeId !== "undefined";
    }
});
Bifrost.namespace("Bifrost", {
    functionParser: {
        parse: function(func) {
            var result = [];

            var match = func.toString().match(/function\w*\s*\((.*?)\)/);
            if (match !== null) {
                var functionArguments = match[1].split(/\s*,\s*/);
                functionArguments.forEach(function (item) {
                    if (item.trim().length > 0) {
                        result.push({
                            name: item
                        });
                    }
                });
            }

            return result;
        }
    }
});
Bifrost.namespace("Bifrost", {
    assetsManager: {
        scripts: [],
        isInitialized: function() {
            return Bifrost.assetsManager.scripts.length > 0;
        },
        initialize: function () {
            var promise = Bifrost.execution.Promise.create();
            if (!Bifrost.assetsManager.isInitialized()) {
                $.get("/Bifrost/AssetsManager", { extension: "js" }, function (result) {
                    Bifrost.assetsManager.initializeFromAssets(result);
                    promise.signal();
                }, "json");
            } else {
                promise.signal();
            }
            return promise;
        },
        initializeFromAssets: function (assets) {
            if (!Bifrost.assetsManager.isInitialized()) {
                Bifrost.assetsManager.scripts = assets;
                Bifrost.namespaces.create().initialize();
            }
        },
        getScripts: function () {
            return Bifrost.assetsManager.scripts;
        },
        hasScript: function(script) {
            return Bifrost.assetsManager.scripts.some(function (scriptInSystem) {
                return scriptInSystem === script;
            });
        },
        getScriptPaths: function () {
            var paths = [];

            Bifrost.assetsManager.scripts.forEach(function (fullPath) {
                var path = Bifrost.Path.getPathWithoutFilename(fullPath);
                if (paths.indexOf(path) === -1) {
                    paths.push(path);
                }
            });
            return paths;
        }
    }
});
Bifrost.namespace("Bifrost", {
    WellKnownTypesDependencyResolver: function () {
        var self = this;
        this.types = Bifrost.WellKnownTypesDependencyResolver.types;

        this.canResolve = function (namespace, name) {
            return self.types.hasOwnProperty(name);
        };

        this.resolve = function (namespace, name) {
            return self.types[name];
        };
    }
});

Bifrost.WellKnownTypesDependencyResolver.types = {
    options: {}
};

Bifrost.namespace("Bifrost", {
    dependencyResolver: (function () {
        function resolveImplementation(namespace, name) {
            var resolvers = Bifrost.dependencyResolvers.getAll();
            var resolvedSystem = null;
            resolvers.forEach(function (resolver) {
                if (resolvedSystem != null) {
                    return;
                }
                var canResolve = resolver.canResolve(namespace, name);
                if (canResolve) {
                    resolvedSystem = resolver.resolve(namespace, name);
                    return;
                }
            });

            return resolvedSystem;
        }

        function isType(system) {
            if (system != null &&
                system._super !== null) {

                if (typeof system._super !== "undefined" &&
                    system._super === Bifrost.Type) {
                    return true;
                }

                if (isType(system._super) === true) {
                    return true;
                }
            }

            return false;
        }

        function handleSystemInstance(system) {
            if (isType(system)) {
                return system.create();
            }
            return system;
        }

        function beginHandleSystemInstance(system) {
            var promise = Bifrost.execution.Promise.create();

            if (system != null &&
                system._super !== null &&
                typeof system._super !== "undefined" &&
                system._super === Bifrost.Type) {

                system.beginCreate().continueWith(function (result, next) {
                    promise.signal(result);
                });
            } else {
                promise.signal(system);
            }

            return promise;
        }

        return {
            getDependenciesFor: function (func) {
                var dependencies = [];
                var parameters = Bifrost.functionParser.parse(func);
                for (var i = 0; i < parameters.length; i++) {
                    dependencies.push(parameters[i].name);
                }
                return dependencies;
            },

            canResolve: function (namespace, name) {
                // Loop through resolvers and check if anyone can resolve it, if so return true - if not false
                var resolvers = Bifrost.dependencyResolvers.getAll();
                var canResolve = false;

                resolvers.forEach(function (resolver) {
                    if (canResolve === true) {
                        return;
                    }

                    canResolve = resolver.canResolve(namespace, name);
                });

                return canResolve;
            },

            resolve: function (namespace, name) {
                var resolvedSystem = resolveImplementation(namespace, name);
                if (typeof resolvedSystem === "undefined" || resolvedSystem === null) {
                    console.log("Unable to resolve '" + name + "' in '" + namespace + "'");
                    throw new Bifrost.UnresolvedDependencies();
                }

                if (resolvedSystem instanceof Bifrost.execution.Promise) {
                    console.log("'" + name + "' was resolved as an asynchronous dependency, consider using beginCreate() or make the dependency available prior to calling create");
                    throw new Bifrost.AsynchronousDependenciesDetected();
                }

                return handleSystemInstance(resolvedSystem);
            },

            beginResolve: function (namespace, name) {
                var promise = Bifrost.execution.Promise.create();
                Bifrost.configure.ready(function () {
                    var resolvedSystem = resolveImplementation(namespace, name);
                    if (typeof resolvedSystem === "undefined" || resolvedSystem === null) {
                        console.log("Unable to resolve '" + name + "' in '" + namespace + "'");
                        promise.fail(new Bifrost.UnresolvedDependencies());
                    }

                    if (resolvedSystem instanceof Bifrost.execution.Promise) {
                        resolvedSystem.continueWith(function (system, innerPromise) {
                            beginHandleSystemInstance(system)
                            .continueWith(function (actualSystem, next) {

                                promise.signal(handleSystemInstance(actualSystem));
                            }).onFail(function (e) { promise.fail(e); });
                        });
                    } else {
                        promise.signal(handleSystemInstance(resolvedSystem));
                    }
                });

                return promise;
            }
        };
    })()
});
Bifrost.WellKnownTypesDependencyResolver.types.dependencyResolver = Bifrost.dependencyResolver;
Bifrost.namespace("Bifrost", {
    dependencyResolvers: (function () {
        return {
            getAll: function () {
                var resolvers = [
                    new Bifrost.WellKnownTypesDependencyResolver(),
                    new Bifrost.DefaultDependencyResolver(),
                    new Bifrost.KnownArtifactTypesDependencyResolver(),
                    new Bifrost.KnownArtifactInstancesDependencyResolver(),

                ];
                for (var property in this) {
                    if (property.indexOf("_") !== 0 &&
                        this.hasOwnProperty(property) &&
                        typeof this[property] !== "function") {
                        resolvers.push(this[property]);
                    }
                }
                return resolvers;
            }
        };
    })()
});
Bifrost.namespace("Bifrost", {
    DefaultDependencyResolver: function () {
        var self = this;

        this.doesNamespaceHave = function (namespace, name) {
            return namespace.hasOwnProperty(name);
        };

        this.doesNamespaceHaveScriptReference = function (namespace, name) {
            if (namespace.hasOwnProperty("_scripts") && Bifrost.isArray(namespace._scripts)) {
                for (var i = 0; i < namespace._scripts.length; i++) {
                    var script = namespace._scripts[i];
                    if (script === name) {
                        return true;
                    }
                }
            }
            return false;
        };

        this.getFileName = function (namespace, name) {
            var fileName = "";
            if (typeof namespace._path !== "undefined") {
                fileName += namespace._path;
                if (!fileName.endsWith("/")) {
                    fileName += "/";
                }
            }
            fileName += name;
            if (!fileName.endsWith(".js")) {
                fileName += ".js";
            }
            fileName = fileName.replaceAll("//", "/");
            return fileName;

        };

        this.loadScriptReference = function (namespace, name, promise) {
            var fileName = self.getFileName(namespace, name);
            var file = Bifrost.io.fileFactory.create().create(fileName, Bifrost.io.fileType.javaScript);

            Bifrost.io.fileManager.create().load([file]).continueWith(function (types) {
                var system = types[0];
                if (self.doesNamespaceHave(namespace, name)) {
                    system = namespace[name];
                }
                promise.signal(system);
            });
        };


        this.canResolve = function (namespace, name) {
            var current = namespace;
            while (current != null && current !== window) {
                if (self.doesNamespaceHave(current, name)) {
                    return true;
                }
                if (self.doesNamespaceHaveScriptReference(current, name) ) {
                    return true;
                }
                if (current === current.parent) {
                    break;
                }
                current = current.parent;
            }

            return false;
        };

        this.resolve = function (namespace, name) {
            var current = namespace;
            while (current != null && current !== window) {
                if (self.doesNamespaceHave(current, name)) {
                    return current[name];
                }
                if (self.doesNamespaceHaveScriptReference(current, name) ) {
                    var promise = Bifrost.execution.Promise.create();
                    self.loadScriptReference(current, name, promise);
                    return promise;
                }
                if (current === current.parent) {
                    break;
                }
                current = current.parent;

            }

            return null;
        };
    }
});

Bifrost.dependencyResolvers.DOMRootDependencyResolver = {
    canResolve: function (namespace, name) {
        return name === "DOMRoot";
    },

    resolve: function (namespace, name) {
        if (document.body != null && typeof document.body !== "undefined") {
            return document.body;
        }

        var promise = Bifrost.execution.Promise.create();
        Bifrost.dependencyResolvers.DOMRootDependencyResolver.promises.push(promise);
        return promise;
    }
};

Bifrost.dependencyResolvers.DOMRootDependencyResolver.promises = [];
Bifrost.dependencyResolvers.DOMRootDependencyResolver.documentIsReady = function () {
    Bifrost.dependencyResolvers.DOMRootDependencyResolver.promises.forEach(function (promise) {
        promise.signal(document.body);
    });
};
Bifrost.namespace("Bifrost", {
    KnownArtifactTypesDependencyResolver: function () {
        var self = this;
        var supportedArtifacts = {
            readModelTypes: Bifrost.read.ReadModelOf,
            commandTypes: Bifrost.commands.Command,
            queryTypes: Bifrost.read.Query
        };

        function isMoreSpecificNamespace(base, compareTo) {
            var isDeeper = false;
            var matchesbase = false;

            var baseParts = base.name.split(".");
            var compareToParts = compareTo.name.split(".");

            if (baseParts.length > compareToParts.length) {
                return false;
            }

            for (var i = 0; i < baseParts.length; i++) {
                if (baseParts[i] !== compareToParts[i]) {
                    return false;
                }
            }
            return true;
        }

        this.canResolve = function (namespace, name) {
            return name in supportedArtifacts;
        };

        this.resolve = function (namespace, name) {
            var type = supportedArtifacts[name];
            var extenders = type.getExtendersIn(namespace);
            var resolvedTypes = {};

            extenders.forEach(function (extender) {
                var name = extender._name;
                if (resolvedTypes[name] && !isMoreSpecificNamespace(resolvedTypes[name]._namespace, extender._namespace)) {
                    return;
                }

                resolvedTypes[name] = extender;
            });

            return resolvedTypes;
        };
    }
});
Bifrost.namespace("Bifrost", {
    KnownArtifactInstancesDependencyResolver: function () {
        var self = this;
        var supportedArtifacts = {
            readModels: Bifrost.read.ReadModelOf,
            commands: Bifrost.commands.Command,
            queries: Bifrost.read.Query
        };

        function isMoreSpecificNamespace(base, compareTo) {
            var isDeeper = false;
            var matchesbase = false;

            var baseParts = base.name.split(".");
            var compareToParts = compareTo.name.split(".");

            if (baseParts.length > compareToParts.length) {
                return false;
            }

            for (var i = 0; i < baseParts.length; i++) {
                if (baseParts[i] !== compareToParts[i]) {
                    return false;
                }
            }
            return true;
        }

        this.canResolve = function (namespace, name) {
            return name in supportedArtifacts;
        };

        this.resolve = function (namespace, name) {
            var type = supportedArtifacts[name];
            var extenders = type.getExtendersIn(namespace);
            var resolvedTypes = {};

            extenders.forEach(function (extender) {
                var name = extender._name;
                if (resolvedTypes[name] && !isMoreSpecificNamespace(resolvedTypes[name]._namespace, extender._namespace)) {
                    return;
                }

                resolvedTypes[name] = extender;
            });

            var resolvedInstances = {};
            for (var prop in resolvedTypes) {
                resolvedInstances[prop] = resolvedTypes[prop].create();
            }

            return resolvedInstances;
        };
    }
});
Bifrost.namespace("Bifrost", {
    Guid : {
        create: function() {
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        },
        empty: "00000000-0000-0000-0000-000000000000"
    }
});

Bifrost.namespace("Bifrost", {
    Type: function () {
    }
});

(function () {
    function throwIfMissingTypeDefinition(typeDefinition) {
        if (typeDefinition == null || typeof typeDefinition === "undefined") {
            throw new Bifrost.MissingTypeDefinition();
        }
    }

    function throwIfTypeDefinitionIsObjectLiteral(typeDefinition) {
        if (typeof typeDefinition === "object") {
            throw new Bifrost.ObjectLiteralNotAllowed();
        }
    }

    function addStaticProperties(typeDefinition) {
        for (var property in Bifrost.Type) {
            if (Bifrost.Type.hasOwnProperty(property) && property !== "_extenders") {
                typeDefinition[property] = Bifrost.Type[property];
            }
        }
    }

    function setupDependencies(typeDefinition) {
        typeDefinition._dependencies = Bifrost.dependencyResolver.getDependenciesFor(typeDefinition);

        var firstParameter = true;
        var createFunctionString = "Function('definition', 'dependencies','return new definition(";

        if( typeof typeDefinition._dependencies !== "undefined" ) {
            typeDefinition._dependencies.forEach(function(dependency, index) {
                if (!firstParameter) {
                    createFunctionString += ",";
                }
                firstParameter = false;
                createFunctionString += "dependencies[" + index + "]";
            });
        }
        createFunctionString += ");')";

        typeDefinition.createFunction = eval(createFunctionString);
    }

    function getDependencyInstances(namespace, typeDefinition) {
        var dependencyInstances = [];
        if( typeof typeDefinition._dependencies !== "undefined" ) {
            typeDefinition._dependencies.forEach(function(dependency) {
                var dependencyInstance = Bifrost.dependencyResolver.resolve(namespace, dependency);
                dependencyInstances.push(dependencyInstance);
            });
        }
        return dependencyInstances;
    }

    function resolve(namespace, dependency, index, instances, typeDefinition, resolvedCallback) {
        var promise =
            Bifrost.dependencyResolver
                .beginResolve(namespace, dependency)
                .continueWith(function(result, nextPromise) {
                    instances[index] = result;
                    resolvedCallback(result, nextPromise);
                });
        return promise;
    }


    function beginGetDependencyInstances(namespace, typeDefinition, instanceHash) {
        function resolved(result, nextPromise) {
            solvedDependencies++;
            if (solvedDependencies === dependenciesToResolve) {
                promise.signal(dependencyInstances);
            }
        }

        var promise = Bifrost.execution.Promise.create();
        var dependencyInstances = [];
        var solvedDependencies = 0;
        if( typeof typeDefinition._dependencies !== "undefined" ) {
            var dependenciesToResolve = typeDefinition._dependencies.length;
            var actualDependencyIndex = 0;
            var dependency = "";
            for( var dependencyIndex=0; dependencyIndex<dependenciesToResolve; dependencyIndex++ ) {
                dependency = typeDefinition._dependencies[dependencyIndex];

                if (instanceHash && instanceHash.hasOwnProperty(dependency)) {
                    dependencyInstances[dependencyIndex] = instanceHash[dependency];
                    solvedDependencies++;
                    if (solvedDependencies === dependenciesToResolve) {
                        promise.signal(dependencyInstances);
                    }
                } else {
                    resolve(namespace, dependency, dependencyIndex, dependencyInstances, typeDefinition, resolved).onFail(promise.fail);
                }
            }

        }
        return promise;
    }

    function expandInstancesHashToDependencies(typeDefinition, instanceHash, dependencyInstances) {
        if (typeof typeDefinition._dependencies === "undefined" || typeDefinition._dependencies == null) {
            return;
        }
        for( var dependency in instanceHash ) {
            for( var dependencyIndex=0; dependencyIndex<typeDefinition._dependencies.length; dependencyIndex++ ) {
                if( typeDefinition._dependencies[dependencyIndex] === dependency ) {
                    dependencyInstances[dependencyIndex] = instanceHash[dependency];
                }
            }
        }
    }

    function expandDependenciesToInstanceHash(typeDefinition, dependencies, instanceHash) {
        for( var dependencyIndex=0; dependencyIndex<dependencies.length; dependencyIndex++ ) {
            instanceHash[typeDefinition._dependencies[dependencyIndex]] = dependencies[dependencyIndex];
        }
    }

    function resolveDependencyInstancesThatHasNotBeenResolved(dependencyInstances, typeDefinition) {
        dependencyInstances.forEach(function(dependencyInstance, index) {
            if( dependencyInstance == null || typeof dependencyInstance === "undefined" ) {
                var dependency = typeDefinition._dependencies[index];
                dependencyInstances[index] = Bifrost.dependencyResolver.resolve(typeDefinition._namespace, dependency);
            }
        });
    }

    function resolveDependencyInstances(instanceHash, typeDefinition) {
        var dependencyInstances = [];
        if( typeof instanceHash === "object" ) {
            expandInstancesHashToDependencies(typeDefinition, instanceHash, dependencyInstances);
        }
        if( typeof typeDefinition._dependencies !== "undefined" && typeDefinition._dependencies.length > 0 ) {
            if( dependencyInstances.length > 0 ) {
                resolveDependencyInstancesThatHasNotBeenResolved(dependencyInstances, typeDefinition);
            } else {
                dependencyInstances = getDependencyInstances(typeDefinition._namespace, typeDefinition);
            }
        }
        return dependencyInstances;
    }

    function addMissingDependenciesAsNullFromTypeDefinition(instanceHash, typeDefinition) {
        if (typeof typeDefinition._dependencies === "undefined") {
            return;
        }
        if (typeof instanceHash === "undefined" || instanceHash == null) {
            return;
        }
        for( var index=0; index<typeDefinition._dependencies.length; index++ ) {
            var dependency = typeDefinition._dependencies[index];
            if (!(dependency in instanceHash)) {
                instanceHash[dependency] = null;
            }
        }
    }

    function handleOnCreate(type, lastDescendant, currentInstance) {
        if (currentInstance == null || typeof currentInstance === "undefined") {
            return;
        }

        if( typeof type !== "undefined" && typeof type.prototype !== "undefined" ) {
            handleOnCreate(type._super, lastDescendant, type.prototype);
        }

        if( currentInstance.hasOwnProperty("onCreated") && typeof currentInstance.onCreated === "function" ) {
            currentInstance.onCreated(lastDescendant);
        }
    }

    Bifrost.Type._extenders = [];

    Bifrost.Type.scope = {
        getFor : function(namespace, name) {
            return null;
        }
    };

    Bifrost.Type.typeOf = function (type) {

        if (typeof this._super === "undefined" ||
            typeof this._super._typeId === "undefined") {
            return false;
        }

        if (this._super._typeId === type._typeId) {
            return true;
        }

        if (typeof type._super !== "undefined") {
            var isType = this._super.typeOf(type);
            if (isType === true) {
                return true;
            }
        }


        return false;
    };

    Bifrost.Type.getExtenders = function () {
        return this._extenders;
    };

    Bifrost.Type.getExtendersIn = function (namespace) {
        var inNamespace = [];

        this._extenders.forEach(function (extender) {
            var current = namespace;
            while (current !== window) {
                if (extender._namespace === current) {
                    inNamespace.push(extender);
                    break;
                }

                if (Bifrost.isUndefined(current.parent)) {
                    break;
                }

                current = current.parent;
            }

        });
        return inNamespace;
    };



    Bifrost.Type.extend = function (typeDefinition) {
        throwIfMissingTypeDefinition(typeDefinition);
        throwIfTypeDefinitionIsObjectLiteral(typeDefinition);

        addStaticProperties(typeDefinition);
        setupDependencies(typeDefinition);
        typeDefinition._super = this;
        typeDefinition._typeId = Bifrost.Guid.create();
        typeDefinition._extenders = [];
        Bifrost.Type.registerExtender(this, typeDefinition);
        return typeDefinition;
    };

    Bifrost.Type.registerExtender = function (typeExtended, typeDefined) {
        var superType = typeExtended;

        while (superType != null) {
            if (superType._extenders.indexOf(typeDefined) === -1) {
                superType._extenders.push(typeDefined);
            }
            superType = superType._super;
        }
    };

    Bifrost.Type.scopeTo = function(scope) {
        if( typeof scope === "function" ) {
            this.scope = {
                getFor: scope
            };
        } else {
            if( typeof scope.getFor === "function" ) {
                this.scope = scope;
            } else {
                this.scope = {
                    getFor: function () {
                        return scope;
                    }
                };
            }
        }
        return this;
    };

    Bifrost.Type.defaultScope = function() {
        this.scope = {
            getFor: function() {
                return null;
            }
        };
        return this;
    };

    Bifrost.Type.requires = function () {
        for (var argumentIndex = 0; argumentIndex < arguments.length; argumentIndex++) {
            this._dependencies.push(arguments[argumentIndex]);
        }

        return this;
    };

    Bifrost.Type.create = function (instanceHash, isSuper) {
        var actualType = this;
        if( this._super != null ) {
            actualType.prototype = this._super.create(instanceHash, true);
        }
        addMissingDependenciesAsNullFromTypeDefinition(instanceHash, this);
        var scope = null;
        if( this !== Bifrost.Type ) {
            this.instancesPerScope = this.instancesPerScope || {};

            scope = this.scope.getFor(this._namespace, this._name, this._typeId);
            if (scope != null && this.instancesPerScope.hasOwnProperty(scope)) {
                return this.instancesPerScope[scope];
            }
        }

        var instance = null;
        if( typeof this.createFunction !== "undefined" ) {
            var dependencyInstances = resolveDependencyInstances(instanceHash, this);
            instance = this.createFunction(this, dependencyInstances);
        } else {
            instance = new actualType();
        }

        instance._type = actualType;

        if( isSuper !== true ) {
            handleOnCreate(actualType, instance, instance);
        }

        if( scope != null ) {
            this.instancesPerScope[scope] = instance;
        }

        return instance;
    };

    Bifrost.Type.createWithoutScope = function (instanceHash, isSuper) {
        var scope = this.scope;
        this.defaultScope();
        var instance = this.create(instanceHash, isSuper);
        this.scope = scope;
        return instance;
    };

    Bifrost.Type.ensure = function () {
        var promise = Bifrost.execution.Promise.create();

        var loadedDependencies = 0;
        var dependenciesToResolve = this._dependencies.length;
        var namespace = this._namespace;
        var resolver = Bifrost.dependencyResolver;
        if (dependenciesToResolve > 0) {
            this._dependencies.forEach(function (dependency) {

                if (resolver.canResolve(namespace, dependency)) {
                    resolver.beginResolve(namespace, dependency).continueWith(function (resolvedSystem) {
                        loadedDependencies++;
                        if (loadedDependencies === dependenciesToResolve) {
                            promise.signal();
                        }
                    });
                } else {
                    dependenciesToResolve--;
                    if (loadedDependencies === dependenciesToResolve) {
                        promise.signal();
                    }
                }
            });
        } else {
            promise.signal();
        }



        return promise;
    };

    Bifrost.Type.beginCreate = function(instanceHash) {
        var self = this;

        var promise = Bifrost.execution.Promise.create();
        var superPromise = Bifrost.execution.Promise.create();
        superPromise.onFail(function (e) {
            promise.fail(e);
        });

        if( this._super != null ) {
            this._super.beginCreate(instanceHash).continueWith(function (_super, nextPromise) {
                superPromise.signal(_super);
            }).onFail(function (e) {
                promise.fail(e);
            });
        } else {
            superPromise.signal(null);
        }

        superPromise.continueWith(function(_super, nextPromise) {
            self.prototype = _super;

            if( self._dependencies == null ||
                typeof self._dependencies === "undefined" ||
                self._dependencies.length === 0) {
                var instance = self.create(instanceHash);
                promise.signal(instance);
            } else {
                beginGetDependencyInstances(self._namespace, self, instanceHash)
                    .continueWith(function(dependencies, nextPromise) {
                        var dependencyInstances = {};
                        expandDependenciesToInstanceHash(self, dependencies, dependencyInstances);
                        if( typeof instanceHash === "object" ) {
                            for( var property in instanceHash ) {
                                dependencyInstances[property] = instanceHash[property];
                            }
                        }

                        try {
                            var instance = self.create(dependencyInstances);
                            promise.signal(instance);
                        } catch (e) {
                            promise.fail(e);
                        }
                    });

            }
        });

        return promise;
    };
})();
Bifrost.namespace("Bifrost", {
    Singleton: function (typeDefinition) {
        return Bifrost.Type.extend(typeDefinition).scopeTo(window);
    }
});
Bifrost.namespace("Bifrost.types", {
    TypeInfo: Bifrost.Type.extend(function () {
        this.properties = [];
    })
});
Bifrost.types.TypeInfo.createFrom = function (instance) {
    var typeInfo = Bifrost.types.TypeInfo.create();
    var propertyInfo;
    for (var property in instance) {
        var value = instance[property];
        if (!Bifrost.isNullOrUndefined(value)) {

            var type = value.constructor;

            if (!Bifrost.isNullOrUndefined(instance[property]._type)) {
                type = instance[property]._type;
            }

            propertyInfo = Bifrost.types.PropertyInfo.create({
                name: property,
                type: type
            });
        }
        typeInfo.properties.push(propertyInfo);
    }
    return typeInfo;
};

Bifrost.namespace("Bifrost.types", {
    PropertyInfo: Bifrost.Type.extend(function (name, type) {
        this.name = name;
        this.type = type;
    })
});
Bifrost.namespace("Bifrost", {
    Path: Bifrost.Type.extend(function (fullPath) {
        var self = this;

        // Based on node.js implementation : http://stackoverflow.com/questions/9451100/filename-extension-in-javascript
        var splitDeviceRe =
            /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?([\\\/])?([\s\S]*?)$/;

        // Regex to split the tail part of the above into [*, dir, basename, ext]
        var splitTailRe =
            /^([\s\S]+[\\\/](?!$)|[\\\/])?((?:\.{1,2}$|[\s\S]+?)?(\.[^.\/\\]*)?)$/;

        function removeUnsupportedParts(filename) {
            var queryStringStart = filename.indexOf("?");
            if (queryStringStart > 0) {
                filename = filename.substr(0, queryStringStart);
            }
            return filename;
        }

        function splitPath(filename) {
            // Separate device+slash from tail
            var result = splitDeviceRe.exec(filename),
                device = (result[1] || '') + (result[2] || ''),
                tail = result[3] || '';
            // Split the tail into dir, basename and extension
            var result2 = splitTailRe.exec(tail),
                dir = result2[1] || '',
                basename = result2[2] || '',
                ext = result2[3] || '';
            return [device, dir, basename, ext];
        }

        fullPath = removeUnsupportedParts(fullPath);
        var result = splitPath(fullPath);
        this.device = result[0] || "";
        this.directory = result[1] || "";
        this.filename = result[2] || "";
        this.extension = result[3] || "";
        this.filenameWithoutExtension = this.filename.replaceAll(this.extension, "");
        this.fullPath = fullPath;

        this.hasExtension = function () {
            if (Bifrost.isNullOrUndefined(self.extension)) {
                return false;
            }
            if (self.extension === "") {
                return false;
            }
            return true;
        };
    })
});
Bifrost.Path.makeRelative = function (fullPath) {
    if (fullPath.indexOf("/") === 0) {
        return fullPath.substr(1);
    }

    return fullPath;
};
Bifrost.Path.getPathWithoutFilename = function (fullPath) {
    var lastIndex = fullPath.lastIndexOf("/");
    return fullPath.substr(0, lastIndex);
};
Bifrost.Path.getFilename = function (fullPath) {
    var lastIndex = fullPath.lastIndexOf("/");
    return fullPath.substr(lastIndex+1);
};
Bifrost.Path.getFilenameWithoutExtension = function (fullPath) {
    var filename = this.getFilename(fullPath);
    var lastIndex = filename.lastIndexOf(".");
    return filename.substr(0,lastIndex);
};
Bifrost.Path.hasExtension = function (path) {
    if (path.indexOf("?") > 0) {
        path = path.substr(0, path.indexOf("?"));
    }
    var lastIndex = path.lastIndexOf(".");
    return lastIndex > 0;
};
Bifrost.Path.changeExtension = function (fullPath, newExtension) {
    var path = Bifrost.Path.create({ fullPath: fullPath });
    var newPath = path.directory + path.filenameWithoutExtension + "." + newExtension;
    return newPath;
};

Bifrost.namespace("Bifrost");

Bifrost.DefinitionMustBeFunction = function (message) {
    this.prototype = Error.prototype;
    this.name = "DefinitionMustBeFunction";
    this.message = message || "Definition must be function";
};

Bifrost.MissingName = function (message) {
    this.prototype = Error.prototype;
    this.name = "MissingName";
    this.message = message || "Missing name";
};

Bifrost.Exception = (function(global, undefined) {
    function throwIfNameMissing(name) {
        if (!name || typeof name === "undefined") {
            throw new Bifrost.MissingName();
        }
    }

    function throwIfDefinitionNotAFunction(definition) {
        if (typeof definition !== "function") {
            throw new Bifrost.DefinitionMustBeFunction();
        }
    }

    function getExceptionName(name) {
        var lastDot = name.lastIndexOf(".");
        if (lastDot === -1 && lastDot !== name.length) {
            return name;
        }
        return name.substr(lastDot+1);
    }

    function defineAndGetTargetScope(name) {
        var lastDot = name.lastIndexOf(".");
        if( lastDot === -1 ) {
            return global;
        }

        var ns = name.substr(0,lastDot);
        Bifrost.namespace(ns);

        var scope = global;
        var parts = ns.split('.');
        parts.forEach(function(part) {
            scope = scope[part];
        });

        return scope;
    }

    return {
        define: function(name, defaultMessage, definition) {
            throwIfNameMissing(name);

            var scope = defineAndGetTargetScope(name);
            var exceptionName = getExceptionName(name);

            var exception = function (message) {
                this.name = exceptionName;
                this.message = message || defaultMessage;
            };
            exception.prototype = Error.prototype;

            if( definition && typeof definition !== "undefined" ) {
                throwIfDefinitionNotAFunction(definition);

                definition.prototype = Error.prototype;
                exception.prototype = new definition();
            }

            scope[exceptionName] = exception;
        }
    };
})(window);
Bifrost.namespace("Bifrost");
Bifrost.Exception.define("Bifrost.LocationNotSpecified","Location was not specified");
Bifrost.Exception.define("Bifrost.InvalidUriFormat", "Uri format specified is not valid");
Bifrost.Exception.define("Bifrost.ObjectLiteralNotAllowed", "Object literal is not allowed");
Bifrost.Exception.define("Bifrost.MissingTypeDefinition", "Type definition was not specified");
Bifrost.Exception.define("Bifrost.AsynchronousDependenciesDetected", "You should consider using Type.beginCreate() or dependencyResolver.beginResolve() for systems that has asynchronous dependencies");
Bifrost.Exception.define("Bifrost.UnresolvedDependencies", "Some dependencies was not possible to resolve");
Bifrost.namespace("Bifrost");
Bifrost.hashString = (function() {
    return {
        decode: function (a) {
            if (a === "") {
                return {};
            }
            a = a.replace("/?", "").split('&');

            var b = {};
            for (var i = 0; i < a.length; ++i) {
                var p = a[i].split('=', 2);
                if (p.length !== 2) {
                    continue;
                }

                var value = decodeURIComponent(p[1].replace(/\+/g, " "));

                if (value !== "" && !isNaN(value)) {
                    value = parseFloat(value);
                }

                b[p[0]] = value;
            }
            return b;
        }
    };
})();

Bifrost.namespace("Bifrost");
Bifrost.Uri = (function(window, undefined) {
    /* parseUri JS v0.1, by Steven Levithan (http://badassery.blogspot.com)
    Splits any well-formed URI into the following parts (all are optional):
    ----------------------
    • source (since the exec() method returns backreference 0 [i.e., the entire match] as key 0, we might as well use it)
    • protocol (scheme)
    • authority (includes both the domain and port)
        • domain (part of the authority; can be an IP address)
        • port (part of the authority)
    • path (includes both the directory path and filename)
        • directoryPath (part of the path; supports directories with periods, and without a trailing backslash)
        • fileName (part of the path)
    • query (does not include the leading question mark)
    • anchor (fragment)
    */
    function parseUri(sourceUri){
        var uriPartNames = ["source","protocol","authority","domain","port","path","directoryPath","fileName","query","anchor"];
        var uriParts = new RegExp("^(?:([^:/?#.]+):)?(?://)?(([^:/?#]*)(?::(\\d*))?)?((/(?:[^?#](?![^?#/]*\\.[^?#/.]+(?:[\\?#]|$)))*/?)?([^?#/]*))?(?:\\?([^#]*))?(?:#(.*))?").exec(sourceUri);
        var uri = {};

        for (var i = 0; i < 10; i++){
            uri[uriPartNames[i]] = (uriParts[i] ? uriParts[i] : "");
        }

        // Always end directoryPath with a trailing backslash if a path was present in the source URI
        // Note that a trailing backslash is NOT automatically inserted within or appended to the "path" key
        if(uri.directoryPath.length > 0){
            uri.directoryPath = uri.directoryPath.replace(/\/?$/, "/");
        }

        return uri;
    }


    function Uri(location) {
        var self = this;
        this.setLocation = function (location) {
            self.fullPath = location;
            location = location.replace("#!", "/");

            var result = parseUri(location);

            if (!result.protocol || typeof result.protocol === "undefined") {
                throw new Bifrost.InvalidUriFormat("Uri ('" + location + "') was in the wrong format");
            }

            self.scheme = result.protocol;
            self.host = result.domain;
            self.path = result.path;
            self.anchor = result.anchor;

            self.queryString = result.query;
            self.port = parseInt(result.port);
            self.parameters = Bifrost.hashString.decode(result.query);
            self.parameters = Bifrost.extend(Bifrost.hashString.decode(result.anchor), self.parameters);

            self.isSameAsOrigin = (window.location.protocol === result.protocol + ":" &&
                window.location.hostname === self.host);
        };

        this.setLocation(location);
    }

    function throwIfLocationNotSpecified(location) {
        if (!location || typeof location === "undefined") {
            throw new Bifrost.LocationNotSpecified();
        }
    }


    return {
        create: function(location) {
            throwIfLocationNotSpecified(location);

            var uri = new Uri(location);
            return uri;
        },

        isAbsolute: function (url) {
            // Based on http://stackoverflow.com/questions/10687099/how-to-test-if-a-url-string-is-absolute-or-relative
            var expression = new RegExp('^(?:[a-z]+:)?//', 'i');
            return expression.test(url);
        }
    };
})(window);
Bifrost.namespace("Bifrost", {
    namespaces: Bifrost.Singleton(function() {
        var self = this;

        this.stripPath = function (path) {
            if (path.startsWith("/")) {
                path = path.substr(1);
            }
            if (path.endsWith("/")) {
                path = path.substr(0, path.length - 1);
            }
            return path;
        };

        this.initialize = function () {
            var scripts = Bifrost.assetsManager.getScripts();
            if (typeof scripts === "undefined") {
                return;
            }

            scripts.forEach(function (fullPath) {
                var path = Bifrost.Path.getPathWithoutFilename(fullPath);
                path = self.stripPath(path);

                for (var mapperKey in Bifrost.namespaceMappers) {
                    var mapper = Bifrost.namespaceMappers[mapperKey];
                    if (typeof mapper.hasMappingFor === "function" && mapper.hasMappingFor(path)) {
                        var namespacePath = mapper.resolve(path);
                        var namespace = Bifrost.namespace(namespacePath);

                        var root = "/" + path + "/";
                        namespace._path = root;

                        if (typeof namespace._scripts === "undefined") {
                            namespace._scripts = [];
                        }

                        var fileIndex = fullPath.lastIndexOf("/");
                        var file = fullPath.substr(fileIndex + 1);
                        var extensionIndex = file.lastIndexOf(".");
                        var system = file.substr(0, extensionIndex);

                        namespace._scripts.push(system);
                    }
                }
            });
        };
    })
});
Bifrost.namespace("Bifrost", {
    namespaceMappers: {

        mapPathToNamespace: function (path) {
            for (var mapperKey in Bifrost.namespaceMappers) {
                var mapper = Bifrost.namespaceMappers[mapperKey];
                if (typeof mapper.hasMappingFor === "function" && mapper.hasMappingFor(path)) {
                    var namespacePath = mapper.resolve(path);
                    return namespacePath;
                }
            }

            return null;
        }
    }
});
Bifrost.namespace("Bifrost", {
    StringMapping: Bifrost.Type.extend(function (format, mappedFormat) {
        var self = this;

        this.format = format;
        this.mappedFormat = mappedFormat;

        var placeholderExpression = "{[a-zA-Z]+}";
        var placeholderRegex = new RegExp(placeholderExpression, "g");

        var wildcardExpression = "\\*{2}[//||.]";
        var wildcardRegex = new RegExp(wildcardExpression, "g");

        var combinedExpression = "(" + placeholderExpression + ")*(" + wildcardExpression + ")*";
        var combinedRegex = new RegExp(combinedExpression, "g");

        var components = [];

        var resolveExpression = format.replace(combinedRegex, function(match) {
            if (typeof match === "undefined" || match === "") {
                return "";
            }
            components.push(match);
            if (match.indexOf("**") === 0) {
                return "([\\w.//]*)";
            }
            return "([\\w.]*)";
        });

        var mappedFormatWildcardMatch = mappedFormat.match(wildcardRegex);
        var formatRegex = new RegExp(resolveExpression);

        this.matches = function (input) {
            var match = input.match(formatRegex);
            if (match) {
                return true;
            }
            return false;
        };

        this.getValues = function (input) {
            var output = {};
            var match = input.match(formatRegex);
            components.forEach(function (c, i) {
                var component = c.substr(1, c.length - 2);
                var value = match[i + 2];
                if (c.indexOf("**") !== 0) {
                    output[component] = value;
                }
            });

            return output;
        };

        this.resolve = function (input) {
            var match = input.match(formatRegex);
            var result = mappedFormat;
            var wildcardOffset = 0;

            components.forEach(function (c, i) {
                var value = match[i + 1];
                if (c.indexOf("**") === 0) {
                    var wildcard = mappedFormatWildcardMatch[wildcardOffset];
                    value = value.replaceAll(c[2], wildcard[2]);
                    result = result.replace(wildcard, value);
                    wildcardOffset++;
                } else {
                    result = result.replace(c, value);
                }
            });

            return result;
        };
    })
});
Bifrost.namespace("Bifrost", {
    stringMappingFactory: Bifrost.Singleton(function () {

        this.create = function (format, mappedFormat) {
            var mapping = Bifrost.StringMapping.create({
                format: format,
                mappedFormat: mappedFormat
            });
            return mapping;
        };
    })
});
Bifrost.namespace("Bifrost", {
    StringMapper: Bifrost.Type.extend(function (stringMappingFactory) {
        var self = this;

        this.stringMappingFactory = stringMappingFactory;

        this.mappings = [];

        this.reverseMappings = [];

        function hasMappingFor(mappings, input) {
            var found = false;
            mappings.some(function (m) {
                if (m.matches(input)) {
                    found = true;
                }
                return found;
            });
            return found;
        }

        function getMappingFor(mappings, input) {
            var found;
            mappings.some(function (m) {
                if (m.matches(input)) {
                    found = m;
                    return true;
                }
            });

            if (typeof found !== "undefined") {
                return found;
            }

            throw {
                name: "ArgumentError",
                message: "String mapping for (" + input + ") could not be found"
            };
        }

        function resolve(mappings, input) {
            try {
                if (input === null || typeof input === "undefined") {
                    return "";
                }

                var mapping = self.getMappingFor(input);
                if (Bifrost.isNullOrUndefined(mapping)) {
                    return "";
                }

                return mapping.resolve(input);
            } catch (e) {
                return "";
            }
        }

        this.hasMappingFor = function (input) {
            return hasMappingFor(self.mappings, input);
        };
        this.getMappingFor = function (input) {
            return getMappingFor(self.mappings, input);
        };
        this.resolve = function (input) {
            return resolve(self.mappings, input);
        };

        this.reverse = {
            hasMappingFor: function (input) {
                return self.hasMappingFor(self.reverseMappings, input);
            },

            getMappingFor: function (input) {
                return self.getMappingFor(self.reverseMappings, input);
            },

            resolve: function (input) {
                return self.resolve(self.reverseMappings, input);
            }
        };

        this.addMapping = function (format, mappedFormat) {
            var mapping = self.stringMappingFactory.create(format, mappedFormat);
            self.mappings.push(mapping);

            var reverseMapping = self.stringMappingFactory.create(mappedFormat, format);
            self.reverseMappings.push(reverseMapping);
        };
    })
});
Bifrost.namespace("Bifrost", {
    uriMappers: {
    }
});
Bifrost.namespace("Bifrost", {
    server: Bifrost.Singleton(function () {
        var self = this;

        this.target = "";

        this.defaultParameters = {};

        function deserialize(data) {
            if (Bifrost.isArray(data)) {
                var items = [];
                data.forEach(function (item) {
                    items.push(deserialize(item));
                });
                return items;
            } else {
                for (var property in data) {
                    if (Bifrost.isArray(data[property])) {
                        data[property] = deserialize(data[property]);
                    } else {
                        var value = data[property];

                        if (Bifrost.isNumber(value)) {
                            data[property] = parseFloat(value);
                        } else {
                            data[property] = data[property];
                        }
                    }
                }
                return data;
            }
        }


        this.post = function (url, parameters) {
            var promise = Bifrost.execution.Promise.create();

            if (!Bifrost.Uri.isAbsolute(url)) {
                url = self.target + url;
            }

            var actualParameters = {};
            Bifrost.extend(actualParameters, self.defaultParameters);

            for (var property in parameters) {
                actualParameters[property] = JSON.stringify(parameters[property]);
            }

            $.ajax({
                url: url,
                type: "POST",
                dataType: 'json',
                data: JSON.stringify(actualParameters),
                contentType: 'application/json; charset=utf-8',
                complete: function (result) {
                    var data = $.parseJSON(result.responseText);
                    deserialize(data);
                    promise.signal(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    promise.fail(jqXHR);
                }
            });

            return promise;
        };

        this.get = function (url, parameters) {
            var promise = Bifrost.execution.Promise.create();

            if (!Bifrost.Uri.isAbsolute(url)) {
                url = self.target + url;
            }

            var actualParameters = {};
            Bifrost.extend(actualParameters, self.defaultParameters);

            if (Bifrost.isObject(parameters)) {
                for (var parameterName in parameters) {
                    if (Bifrost.isArray(parameters[parameterName])) {
                        actualParameters[parameterName] = JSON.stringify(parameters[parameterName]);
                    } else {
                        actualParameters[parameterName] = parameters[parameterName];
                    }
                }
            }

            $.ajax({
                url: url,
                type: "GET",
                dataType: 'json',
                data: actualParameters,
                contentType: 'application/json; charset=utf-8',
                complete: function (result, textStatus) {
                    var data = $.parseJSON(result.responseText);
                    deserialize(data);
                    promise.signal(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    promise.fail(jqXHR);
                }
            });

            return promise;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.server = Bifrost.server;
Bifrost.namespace("Bifrost", {
    areEqual: function (source, target) {
        function isReservedMemberName(member) {
            return member.indexOf("_") >= 0 || member === "model" || member === "commons" || member === "targetViewModel" || member === "region";
        }

        if (ko.isObservable(source)) {
            source = source();
        }
        if (ko.isObservable(target)) {
            target = target();
        }

        if (Bifrost.isNullOrUndefined(source) && Bifrost.isNullOrUndefined(target)) {
            return true;
        }

        if (Bifrost.isNullOrUndefined(source)) {
            return false;
        }
        if (Bifrost.isNullOrUndefined(target)) {
            return false;
        }

        if (Bifrost.isArray(source) && Bifrost.isArray(target)) {
            if (source.length !== target.length) {
                return false;
            }

            for (var index = 0; index < source.length; index++) {
                if (Bifrost.areEqual(source[index], target[index]) === false) {
                    return false;
                }
            }
        } else {
            for (var member in source) {
                if (isReservedMemberName(member)) {
                    continue;
                }
                if (target.hasOwnProperty(member)) {
                    var sourceValue = source[member];
                    var targetValue = target[member];

                    if (Bifrost.isObject(sourceValue) ||
                        Bifrost.isArray(sourceValue) ||
                        ko.isObservable(sourceValue)) {

                        if (!Bifrost.areEqual(sourceValue, targetValue)) {
                            return false;
                        }
                    } else {
                        if (sourceValue !== targetValue) {
                            return false;
                        }
                    }
                } else {
                    return false;
                }
            }
        }

        return true;
    }
});
Bifrost.namespace("Bifrost", {
    deepClone: function (source, target) {
        function isReservedMemberName(member) {
            return member.indexOf("_") >= 0 || member === "model" || member === "commons" || member === "targetViewModel" || member === "region";
        }

        if (ko.isObservable(source)) {
            source = source();
        }

        if (target == null) {
            if (Bifrost.isArray(source)) {
                target = [];
            } else {
                target = {};
            }
        }

        var sourceValue;
        if (Bifrost.isArray(source)) {
            for (var index = 0; index < source.length; index++) {
                sourceValue = source[index];
                var clonedValue = Bifrost.deepClone(sourceValue);
                target.push(clonedValue);
            }
        } else {
            for (var member in source) {
                if (isReservedMemberName(member)) {
                    continue;
                }

                sourceValue = source[member];

                if (ko.isObservable(sourceValue)) {
                    sourceValue = sourceValue();
                }

                if (Bifrost.isFunction(sourceValue)) {
                    continue;
                }

                var targetValue = null;
                if (Bifrost.isObject(sourceValue)) {
                    targetValue = {};
                } else if (Bifrost.isArray(sourceValue)) {
                    targetValue = [];
                } else {
                    target[member] = sourceValue;
                }

                if (targetValue != null) {
                    target[member] = targetValue;
                    Bifrost.deepClone(sourceValue, targetValue);
                }
            }
        }

        return target;
    }
});

Bifrost.namespace("Bifrost", {
    systemClock: Bifrost.Singleton(function () {
        this.nowInMilliseconds = function () {
            return window.performance.now();
        };
    })
});
/*!
* JavaScript TimeSpan Library
*
* Copyright (c) 2010 Michael Stum, http://www.Stum.de/
* 
* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files (the
* "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish,
* distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to
* the following conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
* LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
* WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
Bifrost.namespace("Bifrost", {
    // Constructor function, all parameters are optional
    TimeSpan : function (milliseconds, seconds, minutes, hours, days) {
        var version = "1.2",
            // Millisecond-constants
            msecPerSecond = 1000,
            msecPerMinute = 60000,
            msecPerHour = 3600000,
            msecPerDay = 86400000,
            // Internally we store the TimeSpan as Milliseconds
            msecs = 0,

            // Helper functions
            isNumeric = function (input) {
                return !isNaN(parseFloat(input)) && isFinite(input);
            };

        // Constructor Logic
        if (isNumeric(days)) {
            msecs += (days * msecPerDay);
        }
        if (isNumeric(hours)) {
            msecs += (hours * msecPerHour);
        }
        if (isNumeric(minutes)) {
            msecs += (minutes * msecPerMinute);
        }
        if (isNumeric(seconds)) {
            msecs += (seconds * msecPerSecond);
        }
        if (isNumeric(milliseconds)) {
            msecs += milliseconds;
        }

        // Addition Functions
        this.addMilliseconds = function (milliseconds) {
            if (!isNumeric(milliseconds)) {
                return;
            }
            msecs += milliseconds;
        };
        this.addSeconds = function (seconds) {
            if (!isNumeric(seconds)) {
                return;
            }
            msecs += (seconds * msecPerSecond);
        };
        this.addMinutes = function (minutes) {
            if (!isNumeric(minutes)) {
                return;
            }
            msecs += (minutes * msecPerMinute);
        };
        this.addHours = function (hours) {
            if (!isNumeric(hours)) {
                return;
            }
            msecs += (hours * msecPerHour);
        };
        this.addDays = function (days) {
            if (!isNumeric(days)) {
                return;
            }
            msecs += (days * msecPerDay);
        };

        // Subtraction Functions
        this.subtractMilliseconds = function (milliseconds) {
            if (!isNumeric(milliseconds)) {
                return;
            }
            msecs -= milliseconds;
        };
        this.subtractSeconds = function (seconds) {
            if (!isNumeric(seconds)) {
                return;
            }
            msecs -= (seconds * msecPerSecond);
        };
        this.subtractMinutes = function (minutes) {
            if (!isNumeric(minutes)) {
                return;
            }
            msecs -= (minutes * msecPerMinute);
        };
        this.subtractHours = function (hours) {
            if (!isNumeric(hours)) {
                return;
            }
            msecs -= (hours * msecPerHour);
        };
        this.subtractDays = function (days) {
            if (!isNumeric(days)) {
                return;
            }
            msecs -= (days * msecPerDay);
        };

        // Functions to interact with other TimeSpans
        this.isTimeSpan = true;
        this.add = function (otherTimeSpan) {
            if (!otherTimeSpan.isTimeSpan) {
                return;
            }
            msecs += otherTimeSpan.totalMilliseconds();
        };
        this.subtract = function (otherTimeSpan) {
            if (!otherTimeSpan.isTimeSpan) {
                return;
            }
            msecs -= otherTimeSpan.totalMilliseconds();
        };
        this.equals = function (otherTimeSpan) {
            if (!otherTimeSpan.isTimeSpan) {
                return;
            }
            return msecs === otherTimeSpan.totalMilliseconds();
        };

        // Getters
        this.totalMilliseconds = function (roundDown) {
            var result = msecs;
            if (roundDown === true) {
                result = Math.floor(result);
            }
            return result;
        };
        this.totalSeconds = function (roundDown) {
            var result = msecs / msecPerSecond;
            if (roundDown === true) {
                result = Math.floor(result);
            }
            return result;
        };
        this.totalMinutes = function (roundDown) {
            var result = msecs / msecPerMinute;
            if (roundDown === true) {
                result = Math.floor(result);
            }
            return result;
        };
        this.totalHours = function (roundDown) {
            var result = msecs / msecPerHour;
            if (roundDown === true) {
                result = Math.floor(result);
            }
            return result;
        };
        this.totalDays = function (roundDown) {
            var result = msecs / msecPerDay;
            if (roundDown === true) {
                result = Math.floor(result);
            }
            return result;
        };
        // Return a Fraction of the TimeSpan
        this.milliseconds = function () {
            return msecs % 1000;
        };
        this.seconds = function () {
            return Math.floor(msecs / msecPerSecond) % 60;
        };
        this.minutes = function () {
            return Math.floor(msecs / msecPerMinute) % 60;
        };
        this.hours = function () {
            return Math.floor(msecs / msecPerHour) % 24;
        };
        this.days = function () {
            return Math.floor(msecs / msecPerDay);
        };

        // Misc. Functions
        this.getVersion = function () {
            return version;
        };
    }
});

// "Static Constructors"
Bifrost.TimeSpan.zero = function() {
    return new Bifrost.TimeSpan(0, 0, 0, 0, 0);
};
Bifrost.TimeSpan.fromMilliseconds = function (milliseconds) {
    return new Bifrost.TimeSpan(milliseconds, 0, 0, 0, 0);
};
Bifrost.TimeSpan.fromSeconds = function (seconds) {
    return new Bifrost.TimeSpan(0, seconds, 0, 0, 0);
};
Bifrost.TimeSpan.fromMinutes = function (minutes) {
    return new Bifrost.TimeSpan(0, 0, minutes, 0, 0);
};
Bifrost.TimeSpan.fromHours = function (hours) {
    return new Bifrost.TimeSpan(0, 0, 0, hours, 0);
};
Bifrost.TimeSpan.fromDays = function (days) {
    return new Bifrost.TimeSpan(0, 0, 0, 0, days);
};
Bifrost.TimeSpan.fromDates = function (firstDate, secondDate, forcePositive) {
    var differenceMsecs = secondDate.valueOf() - firstDate.valueOf();
    if (forcePositive === true) {
        differenceMsecs = Math.abs(differenceMsecs);
    }
    return new Bifrost.TimeSpan(differenceMsecs, 0, 0, 0, 0);
};

Bifrost.namespace("Bifrost", {
    Event: Bifrost.Type.extend(function () {
        var subscribers = [];

        this.subscribe = function (subscriber) {
            subscribers.push(subscriber);
        };

        this.trigger = function (data) {
            subscribers.forEach(function (subscriber) {
                subscriber(data);
            });
        };
    })
});
Bifrost.namespace("Bifrost", {
    systemEvents: Bifrost.Singleton(function () {
        this.readModels = Bifrost.read.readModelSystemEvents.create();
        this.commands = Bifrost.commands.commandEvents.create();
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.systemEvents = Bifrost.systemEvents;
Bifrost.namespace("Bifrost", {
    dispatcher: Bifrost.Singleton(function () {
        this.schedule = function (milliseconds, callback) {
            setTimeout(callback, milliseconds);
        };
    })
});
ko.extenders.linked = function (target, options) {
    function setupValueSubscription(value) {
        if (ko.isObservable(value)) {
            var subscription = value.subscribe(function () {
                target.valueHasMutated();
            });
            target._previousLinkedSubscription = subscription;
        }
    }

    target.subscribe(function (newValue) {
        if (target._previousLinkedSubscription) {
            target._previousLinkedSubscription.dispose();
        }
        setupValueSubscription(newValue);

    });

    var currentValue = target();
    setupValueSubscription(currentValue);
};
Bifrost.namespace("Bifrost.hubs", {
    hubConnection: Bifrost.Singleton(function () {
        var self = this;
        var hub = $.hubConnection("/signalr", { useDefaultPath: false });
        /* jshint ignore:start */
        $.signalR.hub = hub;
        /* jshint ignore:end */

        this.isConnected = false;
        this.connected = Bifrost.Event.create();

        this.createProxy = function (hubName) {
            var proxy = hub.createHubProxy(hubName);
            return proxy;
        };

        //$.connection.hub.logging = true;
        $.connection.hub.start().done(function () {
            console.log("Hub connection up and running");
            self.isConnected = true;
            self.connected.trigger();
        });
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.hubConnection = Bifrost.hubs.hubConnection;
Bifrost.namespace("Bifrost.hubs", {
    Hub: Bifrost.Type.extend(function (hubConnection) {
        var self = this;

        var proxy = null;
        this._name = "";

        function makeClientProxyFunction(callback) {
            return function () {
                callback.apply(self, arguments);
            };
        }

        this.client = function (callback) {
            var client = {};
            callback(client);

            for (var property in client) {
                var value = client[property];
                if (!Bifrost.isFunction(value)) {
                    continue;
                }

                proxy.on(property, makeClientProxyFunction(value));
            }
        };

        this.server = {};

        var delayedServerInvocations = [];

        hubConnection.connected.subscribe(function () {
            delayedServerInvocations.forEach(function (invocationFunction) {
                invocationFunction();
            });
        });

        function makeInvocationFunction(promise, method, args) {
            return function () {
                var argumentsAsArray = [];
                for (var arg = 0; arg < args.length; arg++) {
                    argumentsAsArray.push(args[arg]);
                }

                var allArguments = [method].concat(argumentsAsArray);
                proxy.invoke.apply(proxy, allArguments).done(function (result) {
                    promise.signal(result);
                });
            };
        }

        this.invokeServerMethod = function (method, args) {
            var promise = Bifrost.execution.Promise.create();

            var invocationFunction = makeInvocationFunction(promise, method, args);

            if (hubConnection.isConnected === false) {
                delayedServerInvocations.push(invocationFunction);
            } else {
                invocationFunction();
            }

            return promise;
        };

        this.onCreated = function (lastDescendant) {
            proxy = hubConnection.createProxy(lastDescendant._name);
        };
    })
});

Bifrost.dependencyResolvers.hub = {
    canResolve: function (namespace, name) {
        if (typeof hubs !== "undefined") {
            return name in hubs;
        }
        return false;
    },

    resolve: function (namespace, name) {
        return hubs[name].create();
    }
};
Bifrost.namespace("Bifrost.io", {
    fileType: {
        unknown: 0,
        text: 1,
        javaScript: 2,
        html: 3
    }
});
Bifrost.namespace("Bifrost.io", {
    File: Bifrost.Type.extend(function (path) {
        /// <summary>Represents a file</summary>

        /// <field name="type" type="Bifrost.io.fileType">Type of file represented</field>
        this.type = Bifrost.io.fileType.unknown;

        /// <field name="path" type="Bifrost.Path">The path representing the file</field>
        this.path = Bifrost.Path.create({ fullPath: path });
    })
});
Bifrost.namespace("Bifrost.io", {
    fileFactory: Bifrost.Singleton(function () {
        /// <summary>Represents a factory for creating instances of Bifrost.io.File</summary>
        this.create = function (path, fileType) {
            /// <summary>Creates a new file</summary>
            /// <param name="path" type="String">Path of file</param>
            /// <param name="fileType" type="Bifrost.io.fileType" optional="true">Type of file to use</param>
            /// <returns type="Bifrost.io.File">An instance of a file</returns>

            var file = Bifrost.io.File.create({ path: path });
            if (!Bifrost.isNullOrUndefined(fileType)) {
                file.fileType = fileType;
            }
            return file;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.fileFactory = Bifrost.io.fileFactory;
Bifrost.namespace("Bifrost.io", {
    fileManager: Bifrost.Singleton(function () {
        /// <summary>Represents a manager for files, providing capabilities of loading and more</summary>
        var self = this;

        var uri = Bifrost.Uri.create(window.location.href);
        if (window.location.protocol === "file:") {
            this.origin = window.location.href;
            this.origin = this.origin.substr(0, this.origin.lastIndexOf("/"));

            if (this.origin.lastIndexOf("/") === this.origin.length - 1) {
                this.origin = this.origin.substr(0, this.origin.length - 1);
            }
        } else {
            var port = uri.port || "";
            if (!Bifrost.isUndefined(port) && port !== "" && port !== 80) {
                port = ":" + port;
            }

            this.origin = uri.scheme + "://" + uri.host + port;
        }

        function getActualFilename(filename) {
            var actualFilename = self.origin;

            if (filename.indexOf("/") !== 0) {
                actualFilename += "/";
            }
            actualFilename += filename;

            return actualFilename;
        }

        this.load = function (files) {
            /// <summary>Load files</summary>
            /// <param parameterArray="true" elementType="Bifrost.io.File">Files to load</param>
            /// <returns type="Bifrost.execution.Promise">A promise that can be continued with the actual files coming in as an array</returns>
            var filesToLoad = [];

            var promise = Bifrost.execution.Promise.create();

            files.forEach(function (file) {
                var path = getActualFilename(file.path.fullPath);
                if (file.fileType === Bifrost.io.fileType.html) {
                    path = "text!" + path + "!strip";
                }

                filesToLoad.push(path);
            });

            require(filesToLoad, function () {
                promise.signal(arguments);
            });

            return promise;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.fileManager = Bifrost.io.fileManager;
Bifrost.namespace("Bifrost.specifications", {
    Specification: Bifrost.Type.extend(function () {
        /// <summary>Represents a rule based on the specification pattern</summary>
        var self = this;
        var currentInstance = ko.observable();

        /// <field name="evaluator">
        /// Holds the evaluator to be used to evaluate wether or not the rule is satisfied
        /// </field>
        /// <remarks>
        /// The evaluator can either be a function that gets called with the instance
        /// or an observable. The observable not being a regular function will obviously
        /// not have the instance passed
        /// </remarks>
        this.evaluator = null;

        /// <field name="isSatisfied">Observable that holds the result of any evaluations being done</field>
        /// <remarks>
        /// Due to its nature of being an observable, it will re-evaluate if the evaluator
        /// is an observable and its state changes.
        /// </remarks>
        this.isSatisfied = ko.computed(function () {
            if (ko.isObservable(self.evaluator)) {
                return self.evaluator();
            }
            var instance = currentInstance();

            if (!Bifrost.isNullOrUndefined(instance)) {
                return self.evaluator(instance);
            }
            return false;
        });

        this.evaluate = function (instance) {
            /// <summary>Evaluates the rule</summary>
            /// <param name="instance">Object instance used during evaluation</param>
            /// <returns>True if satisfied, false if not</returns>
            currentInstance(instance);

            return self.isSatisfied();
        };

        this.and = function (rule) {
            /// <summary>Takes this rule and "ands" it together with another rule</summary>
            /// <param name="rule">
            /// This can either be the instance of another specific rule,
            /// or an evaluator that can be used directly by the default rule implementation
            /// </param>
            /// <returns>A new composed rule</returns>

            if (Bifrost.isFunction(rule)) {
                var oldRule = rule;
                rule = Bifrost.specifications.Specification.create();
                rule.evaluator = oldRule;
            }

            var and = Bifrost.specifications.And.create(this, rule);
            return and;
        };

        this.or = function (rule) {
            /// <summary>Takes this rule and "ors" it together with another rule</summary>
            /// <param name="rule">
            /// This can either be the instance of another specific rule,
            /// or an evaluator that can be used directly by the default rule implementation
            /// </param>
            /// <returns>A new composed rule</returns>

            if (Bifrost.isFunction(rule)) {
                var oldRule = rule;
                rule = Bifrost.specifications.Specification.create();
                rule.evaluator = oldRule;
            }

            var or = Bifrost.specifications.Or.create(this, rule);
            return or;
        };
    })
});
Bifrost.specifications.Specification.when = function (evaluator) {
    /// <summary>Starts a rule chain</summary>
    /// <param name="evaluator">
    /// The evaluator can either be a function that gets called with the instance
    /// or an observable. The observable not being a regular function will obviously
    /// not have the instance passed
    /// </param>
    /// <returns>A new composed rule</returns>
    var rule = Bifrost.specifications.Specification.create();
    rule.evaluator = evaluator;
    return rule;
};
Bifrost.namespace("Bifrost.specifications", {
    And: Bifrost.specifications.Specification.extend(function (leftHandSide, rightHandSide) {
        /// <summary>Represents the "and" composite rule based on the specification pattern</summary>

        this.isSatisfied = ko.computed(function () {
            return leftHandSide.isSatisfied() &&
                rightHandSide.isSatisfied();
        });

        this.evaluate = function (instance) {
            leftHandSide.evaluate(instance);
            rightHandSide.evaluate(instance);
        };
    })
});
Bifrost.namespace("Bifrost.specifications", {
    Or: Bifrost.specifications.Specification.extend(function (leftHandSide, rightHandSide) {
        /// <summary>Represents the "or" composite rule based on the specification pattern</summary>

        this.isSatisfied = ko.computed(function () {
            return leftHandSide.isSatisfied() ||
                rightHandSide.isSatisfied();
        });

        this.evaluate = function (instance) {
            leftHandSide.evaluate(instance);
            rightHandSide.evaluate(instance);
        };
    })
});
Bifrost.namespace("Bifrost.tasks", {
    Task: Bifrost.Type.extend(function () {
        /// <summary>Represents a task that can be done in the system</summary>
        var self = this;

        /// <field name="errors" type="observableArray">Observable array of errors</field>
        this.errors = ko.observableArray();

        /// <field name="isExceuting" type="boolean">True / false for telling wether or not the task is executing or not</field>
        this.isExecuting = ko.observable(false);

        this.execute = function () {
            /// <summary>Executes the task</summary>
            /// <returns>A promise</returns>
            var promise = Bifrost.execution.Promise.create();
            promise.signal();
            return promise;
        };

        this.reportError = function (error) {
            /// <summary>Report an error from executing the task</summary>
            /// <param name="error" type="String">Error coming back</param>
            self.errors.push(error);
        };
    })
});
Bifrost.namespace("Bifrost.tasks", {
    TaskHistoryEntry: Bifrost.Type.extend(function () {
        var self = this;

        this.type = "";
        this.content = "";

        this.begin = ko.observable();
        this.end = ko.observable();
        this.total = ko.computed(function () {
            if (!Bifrost.isNullOrUndefined(self.end()) &&
                !Bifrost.isNullOrUndefined(self.begin())) {
                return self.end() - self.begin();
            }
            return 0;
        });
        this.result = ko.observable();
        this.error = ko.observable();

        this.isFinished = ko.computed(function () {
            return !Bifrost.isNullOrUndefined(self.end());
        });
        this.hasFailed = ko.computed(function () {
            return !Bifrost.isNullOrUndefined(self.error());
        });

        this.isSuccess = ko.computed(function () {
            return self.isFinished() && !self.hasFailed();
        });
    })
});
Bifrost.namespace("Bifrost.tasks", {
    taskHistory: Bifrost.Singleton(function (systemClock) {
        /// <summary>Represents the history of tasks that has been executed since the start of the application</summary>
        var self = this;

        var entriesById = {};

        /// <field param="entries" type="observableArray">Observable array of entries</field>
        this.entries = ko.observableArray();

        this.begin = function (task) {
            var id = Bifrost.Guid.create();

            try {
                var entry = Bifrost.tasks.TaskHistoryEntry.create();

                entry.type = task._type._name;

                var content = {};

                for (var property in task) {
                    if (property.indexOf("_") !== 0 && task.hasOwnProperty(property) && typeof task[property] !== "function") {
                        content[property] = task[property];
                    }
                }

                entry.content = JSON.stringify(content);

                entry.begin(systemClock.nowInMilliseconds());
                entriesById[id] = entry;
                self.entries.push(entry);
            } catch (ex) {
                // Todo: perfect place for logging something
            }
            return id;
        };

        this.end = function (id, result) {
            if (entriesById.hasOwnProperty(id)) {
                var entry = entriesById[id];
                entry.end(systemClock.nowInMilliseconds());
                entry.result(result);
            }
        };

        this.failed = function (id, error) {
            if (entriesById.hasOwnProperty(id)) {
                var entry = entriesById[id];
                entry.end(systemClock.nowInMilliseconds());
                entry.error(error);
            }
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.taskHistory = Bifrost.tasks.taskHistory;
Bifrost.namespace("Bifrost.tasks", {
    Tasks: Bifrost.Type.extend(function (taskHistory) {
        /// <summary>Represents an aggregation of tasks</summary>
        var self = this;

        /// <field name="unfiltered" type="Bifrost.tasks.Task[]">All tasks completely unfiltered</field>
        this.unfiltered = ko.observableArray();

        /// <field name="executeWhen" type="Bifrost.specifications.Specification">Gets or sets the rule for execution</field>
        /// <remarks>
        /// If a task gets executed that does not get satisfied by the rule, it will just queue it up
        /// </remarks>
        this.canExecuteWhen = ko.observable();

        /// <field name="all" type="Bifrost.tasks.Task[]">All tasks being executed</field>
        this.all = ko.computed(function () {
            var all = self.unfiltered();

            var rule = self.canExecuteWhen();

            if (!Bifrost.isNullOrUndefined(rule)) {
                var filtered = [];

                all.forEach(function (task) {
                    rule.evaluate(task);
                    if (rule.isSatisfied() === true) {
                        filtered.push(task);
                    }
                });
                return filtered;
            }

            return all;
        });

        /// <field name="errors" type="observableArrayOfString">All errors that occured during execution of the task</field>
        this.errors = ko.observableArray();

        /// <field name="isBusy" type="Boolean">Returns true if the system is busy working, false if not</field>
        this.isBusy = ko.computed(function () {
            return self.all().length > 0;
        });

        function executeTaskIfNotExecuting(task) {
            if (task.isExecuting() === true) {
                return;
            }
            task.isExecuting(true);
            var taskHistoryId = taskHistory.begin(task);

            task.execute().continueWith(function (result) {
                self.unfiltered.remove(task);
                taskHistory.end(taskHistoryId, result);
                task.promise.signal(result);
            }).onFail(function (error) {
                self.unfiltered.remove(task);
                self.errors.push(task);
                taskHistory.failed(taskHistoryId, error);
                task.promise.fail(error);
            });
        }

        this.all.subscribe(function (changedTasks) {
            changedTasks.forEach(function (task) {
                executeTaskIfNotExecuting(task);
            });
        });

        this.execute = function (task) {
            /// <summary>Adds a task and starts executing it right away</summary>
            /// <param name="task" type="Bifrost.tasks.Task">Task to add</summary>
            /// <returns>A promise to work with for chaining further events</returns>

            task.promise = Bifrost.execution.Promise.create();
            self.unfiltered.push(task);

            var rule = self.canExecuteWhen();
            var canExecute = true;
            if (!Bifrost.isNullOrUndefined(rule)) {
                canExecute = rule.evaluate(task);
            }

            if (canExecute === true) {
                executeTaskIfNotExecuting(task);
            }

            return task.promise;
        };
    })
});
Bifrost.namespace("Bifrost.tasks", {
    tasksFactory: Bifrost.Singleton(function () {
        this.create = function () {
            var tasks = Bifrost.tasks.Tasks.create();
            return tasks;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.tasksFactory = Bifrost.tasks.tasksFactory;
Bifrost.namespace("Bifrost.tasks", {
    HttpGetTask: Bifrost.tasks.Task.extend(function (server, url, payload) {
        /// <summary>Represents a task that can perform Http Get requests</summary>

        this.execute = function () {
            var promise = Bifrost.execution.Promise.create();
            server
                .get(url, payload)
                    .continueWith(function (result) {
                        promise.signal(result);
                    })
                    .onFail(function (error) {
                        promise.fail(error);
                    });
            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.tasks", {
    HttpPostTask: Bifrost.tasks.Task.extend(function (server, url, payload) {
        /// <summary>Represents a task that can perform a Http Post request</summary>

        this.execute = function () {
            var promise = Bifrost.execution.Promise.create();

            server
                .post(url, payload)
                    .continueWith(function (result) {
                        promise.signal(result);
                    })
                    .onFail(function (error) {
                        promise.fail(error);
                    });
            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.tasks", {
    LoadTask: Bifrost.tasks.Task.extend(function () {
        /// <summary>Represents a base task that represents anything that is loading things</summary>
        this.execute = function () {
            var promise = Bifrost.execution.Promise.create();
            promise.signal();
            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.tasks", {
    FileLoadTask: Bifrost.tasks.LoadTask.extend(function (files, fileManager) {
        /// <summary>Represents a task for loading view related files asynchronously</summary>
        this.files = files;

        var self = this;

        this.files = [];
        files.forEach(function (file) {
            self.files.push(file.path.fullPath);
        });

        this.execute = function () {
            var promise = Bifrost.execution.Promise.create();

            fileManager.load(files).continueWith(function (instances) {
                promise.signal(instances);
            });
            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.tasks", {
    ExecutionTask: Bifrost.tasks.Task.extend(function () {
        /// <summary>Represents a base task that represents anything that is executing</summary>
        this.execute = function () {
        };
    })
});
Bifrost.namespace("Bifrost", {
    taskFactory: Bifrost.Singleton(function () {
        this.createHttpPost = function (url, payload) {
            var task = Bifrost.tasks.HttpPostTask.create({
                url: url,
                payload: payload
            });
            return task;
        };

        this.createHttpGet = function (url, payload) {
            var task = Bifrost.tasks.HttpGetTask.create({
                url: url,
                payload: payload
            });
            return task;
        };

        this.createQuery = function (query, paging) {
            var task = Bifrost.read.QueryTask.create({
                query: query,
                paging: paging
            });
            return task;
        };

        this.createReadModel = function (readModelOf, propertyFilters) {
            var task = Bifrost.read.ReadModelTask.create({
                readModelOf: readModelOf,
                propertyFilters: propertyFilters
            });
            return task;
        };

        this.createHandleCommand = function (command) {
            var task = Bifrost.commands.HandleCommandTask.create({
                command: command
            });
            return task;
        };

        this.createHandleCommands = function (commands) {
            var task = Bifrost.commands.HandleCommandsTask.create({
                commands: commands
            });
            return task;
        };

        this.createViewLoad = function (files) {
            var task = Bifrost.views.ViewLoadTask.create({
                files: files
            });
            return task;
        };

        this.createViewModelLoad = function (files) {
            var task = Bifrost.views.ViewModelLoadTask.create({
                files: files
            });
            return task;
        };

        this.createFileLoad = function (files) {
            var task = Bifrost.tasks.FileLoadTask.create({
                files: files
            });
            return task;
        };
    })
});
Bifrost.namespace("Bifrost.validation");
Bifrost.Exception.define("Bifrost.validation.OptionsNotDefined", "Option was undefined");
Bifrost.Exception.define("Bifrost.validation.OptionsValueNotSpecified", "Required value in Options is not specified. ");
Bifrost.Exception.define("Bifrost.validation.NotANumber", "Value is not a number");
Bifrost.Exception.define("Bifrost.validation.NotAString", "Value is not a string");
Bifrost.Exception.define("Bifrost.validation.ValueNotSpecified","Value is not specified");
Bifrost.Exception.define("Bifrost.validation.MinNotSpecified","Min is not specified");
Bifrost.Exception.define("Bifrost.validation.MaxNotSpecified","Max is not specified");
Bifrost.Exception.define("Bifrost.validation.MinLengthNotSpecified","Min length is not specified");
Bifrost.Exception.define("Bifrost.validation.MaxLengthNotSpecified","Max length is not specified");
Bifrost.Exception.define("Bifrost.validation.MissingExpression","Expression is not specified");
Bifrost.namespace("Bifrost.validation");
Bifrost.validation.ruleHandlers = (function () {
    return Bifrost.validation.ruleHandlers || { };
})();

Bifrost.namespace("Bifrost.validation", {
    Rule: Bifrost.Type.extend(function (options) {
        options = options || {};
        this.message = options.message || "";
        this.options = {};
        Bifrost.extend(this.options, options);

        this.validate = function (value) {
            return true;
        };
    })
});
Bifrost.namespace("Bifrost.validation");
Bifrost.validation.Validator = (function () {
    function Validator(options) {
        var self = this;
        this.isValid = ko.observable(true);
        this.message = ko.observable("");
        this.rules = [];
        this.isRequired = false;
        options = options || {};

        this.setOptions = function (options) {
            function setupRule(ruleType) {
                if (ruleType._name === property) {
                    var rule = ruleType.create({ options: options[property] || {} });
                    self.rules.push(rule);
                }

                if (ruleType._name === "required") {
                    self.isRequired = true;
                }
            }
            for (var property in options) {
                var ruleTypes = Bifrost.validation.Rule.getExtenders();
                ruleTypes.some(setupRule);
            }
        };

        this.validate = function (value) {
            self.isValid(true);
            self.message("");
            value = ko.utils.unwrapObservable(value);
            self.rules.some(function(rule) {
                if (!rule.validate(value)) {
                    self.isValid(false);
                    self.message(rule.message);
                    return true;
                } else {
                    self.isValid(true);
                    self.message("");
                }
            });
        };

        this.validateSilently = function (value) {
            self.rules.some(function (rule) {
                if (!rule.validate(value)) {
                    self.isValid(false);
                    return true;
                } else {
                    self.isValid(true);
                }
            });
        };


        this.setOptions(options);
    }

    return {
        create: function (options) {
            var validator = new Validator(options);
            return validator;
        },
        applyTo: function (itemOrItems, options) {
            var self = this;

            function applyToItem(item) {
                var validator = self.create(options);
                item.validator = validator;
            }

            if (itemOrItems instanceof Array) {
                itemOrItems.forEach(function (item) {

                    applyToItem(item);
                });
            } else {
                applyToItem(itemOrItems);
            }
        },
        applyToProperties: function (item, options) {
            var items = [];

            for (var property in item) {
                if (item.hasOwnProperty(property)) {
                    items.push(item[property]);
                }
            }
            this.applyTo(items, options);
        }
    };
})();

if (typeof ko !== 'undefined') {
    Bifrost.namespace("Bifrost.validation", {
        ValidationSummary: function (commands, containerElement) {
            var self = this;
            this.commands = ko.observable(commands);
            this.messages = ko.observableArray([]);
            this.hasMessages = ko.computed(function(){
                return this.messages().length > 0;
            },self);

            function aggregateMessages() {
                var actualMessages = [];
                self.commands().forEach(function (command) {
                    var unwrappedCommand = ko.utils.unwrapObservable(command);

                    unwrappedCommand.validators().forEach(function (validator) {
                        if (!validator.isValid() && validator.message().length) {
                            actualMessages.push(validator.message());
                        }
                    });
                });
                self.messages(actualMessages);
            }

            commands.forEach(function (command) {
                var unwrappedCommand = ko.utils.unwrapObservable(command);

                unwrappedCommand.validators().forEach(function (validator) {
                    validator.message.subscribe(aggregateMessages);
                });
            });
        }
    });

    ko.bindingHandlers.validationSummaryFor = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var target = ko.bindingHandlers.validationSummaryFor.getValueAsArray(valueAccessor);
            var validationSummary = new Bifrost.validation.ValidationSummary(target);
            var ul = document.createElement("ul");
            element.appendChild(ul);
            ul.innerHTML = "<li><span data-bind='text: $data'></span></li>";

            ko.utils.domData.set(element, 'validationsummary', validationSummary);

            ko.applyBindingsToNode(element, { visible: validationSummary.hasMessages }, validationSummary);
            ko.applyBindingsToNode(ul, { foreach: validationSummary.messages }, validationSummary);
        },
        update: function (element, valueAccessor) {
            var validationSummary = ko.utils.domData.get(element, 'validationsummary');
            validationSummary.commands(ko.bindingHandlers.validationSummaryFor.getValueAsArray(valueAccessor));
        },
        getValueAsArray: function (valueAccessor) {
            var target = ko.utils.unwrapObservable(valueAccessor());
            if (!(Bifrost.isArray(target))) { target = [target]; }
            return target;
        }
    };
}
if (typeof ko !== 'undefined') {
    ko.bindingHandlers.validationMessageFor = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var value = valueAccessor();
            var validator = value.validator;
            if (Bifrost.isNullOrUndefined(validator)) {
                return;
            }

            validator.isValid.subscribe(function (newValue) {
                if (newValue === true) {
                    $(element).hide();
                } else {
                    $(element).show();
                }
            });
            ko.applyBindingsToNode(element, { text: validator.message }, validator);
        }
    };
}
if (typeof ko !== 'undefined') {
    ko.extenders.validation = function (target, options) {
        Bifrost.validation.Validator.applyTo(target, options);
        target.subscribe(function (newValue) {
            target.validator.validate(newValue);
        });

        // Todo : look into aggressive validation
        //target.validator.validate(target());
        return target;
    };
}

Bifrost.namespace("Bifrost.validation", {
    required: Bifrost.validation.Rule.extend(function () {
        this.validate = function (value) {
            return !(Bifrost.isUndefined(value) || Bifrost.isNull(value) || value === "" || value === 0);
        };
    })
});


Bifrost.namespace("Bifrost.validation", {
    length: Bifrost.validation.Rule.extend(function () {
        var self = this;

        function notSet(value) {
            return Bifrost.isUndefined(value) || Bifrost.isNull(value);
        }

        function throwIfValueIsNotANumber(value) {
            if (!Bifrost.isNumber(value)) {
                throw new Bifrost.validation.NotANumber("Value " + value + " is not a number");
            }
        }

        function throwIfOptionsInvalid(options) {
            if (notSet(options)) {
                throw new Bifrost.validation.OptionsNotDefined();
            }
            if (notSet(options.max)) {
                throw new Bifrost.validation.MaxLengthNotSpecified();
            }
            if (notSet(options.min)) {
                throw new Bifrost.validation.MinLengthNotSpecified();
            }
            throwIfValueIsNotANumber(options.min);
            throwIfValueIsNotANumber(options.max);
        }

        this.validate = function (value) {
            throwIfOptionsInvalid(self.options);
            if (notSet(value)) {
                value = "";
            }
            if (!Bifrost.isString(value)) {
                value = value.toString();
            }
            return self.options.min <= value.length && value.length <= self.options.max;
        };
    })
});
Bifrost.namespace("Bifrost.validation", {
    minLength: Bifrost.validation.Rule.extend(function () {
        var self = this;

        function notSet(value) {
            return Bifrost.isUndefined(value) || Bifrost.isNull(value);
        }

        function throwIfValueIsNotANumber(value) {
            if (!Bifrost.isNumber(value)) {
                throw new Bifrost.validation.NotANumber("Value " + value + " is not a number");
            }
        }

        function throwIfOptionsInvalid(options) {
            if (notSet(options)) {
                throw new Bifrost.validation.OptionsNotDefined();
            }
            if (notSet(options.length)) {
                throw new Bifrost.validation.MaxNotSpecified();
            }
            throwIfValueIsNotANumber(options.length);
        }


        function throwIfValueIsNotAString(string) {
            if (!Bifrost.isString(string)) {
                throw new Bifrost.validation.NotAString("Value " + string + " is not a string");
            }
        }

        this.validate = function (value) {
            throwIfOptionsInvalid(self.options);
            if (notSet(value)) {
                value = "";
            }
            throwIfValueIsNotAString(value);
            return value.length >= self.options.length;
        };
    })
});


Bifrost.namespace("Bifrost.validation", {
    maxLength: Bifrost.validation.Rule.extend(function() {
        var self = this;

        function notSet(value) {
            return Bifrost.isUndefined(value) || Bifrost.isNull(value);
        }

        function throwIfValueIsNotANumber(value) {
            if (!Bifrost.isNumber(value)) {
                throw new Bifrost.validation.NotANumber("Value " + value + " is not a number");
            }
        }

        function throwIfOptionsInvalid(options) {
            if (notSet(options)) {
                throw new Bifrost.validation.OptionsNotDefined();
            }
            if (notSet(options.length)) {
                throw new Bifrost.validation.MaxNotSpecified();
            }
            throwIfValueIsNotANumber(options.length);
        }


        function throwIfValueIsNotAString(string) {
            if (!Bifrost.isString(string)) {
                throw new Bifrost.validation.NotAString("Value " + string + " is not a string");
            }
        }

        this.validate = function (value) {
            throwIfOptionsInvalid(self.options);
            if (notSet(value)) {
                value = "";
            }
            throwIfValueIsNotAString(value);
            return value.length <= self.options.length;
        };
    })
});


Bifrost.namespace("Bifrost.validation", {
    range: Bifrost.validation.Rule.extend(function () {
        var self = this;

        function notSet(value) {
            return Bifrost.isUndefined(value) || Bifrost.isNull(value);
        }

        function throwIfValueIsNotANumber(value, param) {
            if (!Bifrost.isNumber(value)) {
                throw new Bifrost.validation.NotANumber(param + " value " + value + " is not a number");
            }
        }


        function throwIfOptionsInvalid(options) {
            if (notSet(options)) {
                throw new Bifrost.validation.OptionsNotDefined();
            }
            if (notSet(options.max)) {
                throw new Bifrost.validation.MaxNotSpecified();
            }
            if (notSet(options.min)) {
                throw new Bifrost.validation.MinNotSpecified();
            }
            throwIfValueIsNotANumber(options.min, "min");
            throwIfValueIsNotANumber(options.max, "max");
        }


        this.validate = function (value) {
            throwIfOptionsInvalid(self.options);
            if (notSet(value)) {
                return false;
            }
            throwIfValueIsNotANumber(value, "value");
            return self.options.min <= value && value <= self.options.max;
        };

    })
});

Bifrost.namespace("Bifrost.validation", {
    lessThan: Bifrost.validation.Rule.extend(function () {
        var self = this;

        function notSet(value) {
            return Bifrost.isUndefined(value) || Bifrost.isNull(value);
        }

        function throwIfOptionsInvalid(options) {
            if (notSet(options)) {
                throw new Bifrost.validation.OptionsNotDefined();
            }
            if (notSet(options.value)) {
                var exception = new Bifrost.validation.OptionsValueNotSpecified();
                exception.message = exception.message + " 'value' is not set.";
                throw exception;
            }
        }

        function throwIsValueToCheckIsNotANumber(value) {
            if (!Bifrost.isNumber(value)) {
                throw new Bifrost.validation.NotANumber("Value " + value + " is not a number");
            }
        }

        this.validate = function (value) {
            throwIfOptionsInvalid(self.options);
            if (notSet(value)) {
                return false;
            }
            throwIsValueToCheckIsNotANumber(value);
            return parseFloat(value) < parseFloat(self.options.value);
        };
    })
});

Bifrost.namespace("Bifrost.validation.ruleHandlers");
Bifrost.validation.ruleHandlers.lessThanOrEqual = {
    throwIfOptionsInvalid: function (options) {
        if (this.notSet(options)) {
            throw new Bifrost.validation.OptionsNotDefined();
        }
        if (this.notSet(options.value)) {
            var exception = new Bifrost.validation.OptionsValueNotSpecified();
            exception.message = exception.message + " 'value' is not set.";
            throw exception;
        }
    },

    throwIsValueToCheckIsNotANumber: function (value) {
        if (!Bifrost.isNumber(value)) {
            throw new Bifrost.validation.NotANumber("Value " + value + " is not a number");
        }
    },

    notSet: function (value) {
        return Bifrost.isUndefined(value) || Bifrost.isNull(value);
    },

    validate: function (value, options) {
        this.throwIfOptionsInvalid(options);
        if (this.notSet(value)) {
            return false;
        }
        this.throwIsValueToCheckIsNotANumber(value);
        return parseFloat(value) <= parseFloat(options.value);
    }
};

Bifrost.namespace("Bifrost.validation", {
    greaterThan: Bifrost.validation.Rule.extend(function() {
        var self = this;

        function notSet(value) {
            return Bifrost.isUndefined(value) || Bifrost.isNull(value);
        }

        function throwIfOptionsInvalid(options) {
            if (notSet(options)) {
                throw new Bifrost.validation.OptionsNotDefined();
            }
            if (notSet(options.value)) {
                var exception = new Bifrost.validation.OptionsValueNotSpecified();
                exception.message = exception.message + " 'value' is not set.";
                throw exception;
            }
            throwIfValueToCheckIsNotANumber(options.value);
        }

        function throwIfValueToCheckIsNotANumber(value) {
            if (!Bifrost.isNumber(value)) {
                throw new Bifrost.validation.NotANumber("Value " + value + " is not a number");
            }
        }

        this.validate = function (value) {
            throwIfOptionsInvalid(self.options);
            if (notSet(value)) {
                return false;
            }
            throwIfValueToCheckIsNotANumber(value);
            return parseFloat(value) > parseFloat(self.options.value);
        };
    })
});

Bifrost.namespace("Bifrost.validation.ruleHandlers");
Bifrost.validation.ruleHandlers.greaterThanOrEqual = {
    throwIfOptionsInvalid: function (options) {
        if (this.notSet(options)) {
            throw new Bifrost.validation.OptionsNotDefined();
        }
        if (this.notSet(options.value)) {
            var exception = new Bifrost.validation.OptionsValueNotSpecified();
            exception.message = exception.message + " 'value' is not set.";
            throw exception;
        }
        this.throwIfValueToCheckIsNotANumber(options.value);
    },

    throwIfValueToCheckIsNotANumber: function (value) {
        if (!Bifrost.isNumber(value)) {
            throw new Bifrost.validation.NotANumber("Value " + value + " is not a number");
        }
    },

    notSet: function (value) {
        return Bifrost.isUndefined(value) || Bifrost.isNull(value);
    },

    validate: function (value, options) {
        this.throwIfOptionsInvalid(options);
        if (this.notSet(value)) {
            return false;
        }
        this.throwIfValueToCheckIsNotANumber(value);
        return parseFloat(value) >= parseFloat(options.value);
    }
};

Bifrost.namespace("Bifrost.validation", {
    email: Bifrost.validation.Rule.extend(function () {
        var regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/;

        function notSet(value) {
            return Bifrost.isNull(value) || Bifrost.isUndefined(value);
        }

        this.validate = function (value) {
            if (notSet(value)) {
                return false;
            }

            if (!Bifrost.isString(value)) {
                throw new Bifrost.validation.NotAString("Value " + value + " is not a string");
            }

            return (value.match(regex) == null) ? false : true;
        };

    })
});

Bifrost.namespace("Bifrost.validation", {
    regex: Bifrost.validation.Rule.extend(function () {
        var self = this;

        function notSet(value) {
            return Bifrost.isUndefined(value) || Bifrost.isNull(value);
        }

        function throwIfOptionsInvalid(options) {
            if (notSet(options)) {
                throw new Bifrost.validation.OptionsNotDefined();
            }
            if (notSet(options.expression)) {
                throw new Bifrost.validation.MissingExpression();
            }
            if (!Bifrost.isString(options.expression)) {
                throw new Bifrost.validation.NotAString("Expression " + options.expression + " is not a string.");
            }
        }

        function throwIfValueIsNotString(value) {
            if (!Bifrost.isString(value)) {
                throw new Bifrost.validation.NotAString("Value " + value + " is not a string.");
            }
        }

        this.validate = function (value) {
            throwIfOptionsInvalid(self.options);
            if (notSet(value)) {
                return false;
            }
            throwIfValueIsNotString(value);
            return (value.match(self.options.expression) == null) ? false : true;
        };
    })
});



if (typeof ko !== 'undefined') {
    ko.bindingHandlers.command = {
        init: function (element, valueAccessor, allBindingAccessor, viewModel) {
            var value = valueAccessor();
            var command;
            var contextBound = false;
            if(typeof value.canExecute === "undefined") {
                command = value.target;

                command.parameters = command.parameters || {};
                var parameters = value.parameters || {};

                for (var parameter in parameters ) {
                    var parameterValue = parameters[parameter];

                    if( command.parameters.hasOwnProperty(parameter) &&
                        ko.isObservable(command.parameters[parameter]) ) {
                        command.parameters[parameter](parameterValue);
                    } else {
                        command.parameters[parameter] = ko.observable(parameterValue);
                    }
                }
                contextBound = true;
            } else {
                command = value;
            }
            ko.applyBindingsToNode(element, { click: function() {
                command.execute();
            }}, viewModel);
        }
    };
}
Bifrost.namespace("Bifrost.commands", {
    HandleCommandTask: Bifrost.tasks.ExecutionTask.extend(function (command, server, systemEvents) {
        /// <summary>Represents a task that can handle a command</summary>
        this.name = command.name;

        this.execute = function () {
            var promise = Bifrost.execution.Promise.create();

            var commandDescriptor = Bifrost.commands.CommandDescriptor.createFrom(command);
            var parameters = {
                commandDescriptor: commandDescriptor
            };

            var url = "/Bifrost/CommandCoordinator/Handle?_cmd=" + command._generatedFrom;

            server.post(url, parameters).continueWith(function (result) {
                var commandResult = Bifrost.commands.CommandResult.createFrom(result);

                if (commandResult.success === true) {
                    systemEvents.commands.succeeded.trigger(result);
                } else {
                    systemEvents.commands.failed.trigger(result);
                }

                promise.signal(commandResult);
            }).onFail(function (response) {
                var commandResult = Bifrost.commands.CommandResult.create();
                commandResult.exception = "HTTP 500";
                commandResult.exceptionMessage = response.statusText;
                commandResult.details = response.responseText;
                systemEvents.commands.failed.trigger(commandResult);
                promise.signal(commandResult);
            });

            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.commands", {
    HandleCommandsTask: Bifrost.tasks.ExecutionTask.extend(function (commands, server) {
        /// <summary>Represents a task that can handle an array of command</summary>
        var self = this;

        this.names = [];
        commands.forEach(function (command) {
            self.names.push(command.name);
        });

        this.execute = function () {
            var promise = Bifrost.execution.Promise.create();

            var commandDescriptors = [];

            commands.forEach(function (command) {
                command.isBusy(true);
                var commandDescriptor = Bifrost.commands.CommandDescriptor.createFrom(command);
                commandDescriptors.push(commandDescriptor);
            });

            var parameters = {
                commandDescriptors: commandDescriptors
            };

            var url = "/Bifrost/CommandCoordinator/HandleMany";

            server.post(url, parameters).continueWith(function (results) {
                var commandResults = [];

                results.forEach(function (result) {
                    var commandResult = Bifrost.commands.CommandResult.createFrom(result);
                    commandResults.push(commandResult);
                });
                promise.signal(commandResults);
            });

            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.commands", {
    commandCoordinator: Bifrost.Singleton(function (taskFactory) {
        this.handle = function (command) {
            var promise = Bifrost.execution.Promise.create();
            var task = taskFactory.createHandleCommand(command);

            command.region.tasks.execute(task).continueWith(function (commandResult) {
                promise.signal(commandResult);
            });

            return promise;
        };

        this.handleMany = function (commands, region) {
            var promise = Bifrost.execution.Promise.create();

            try {
                var task = taskFactory.createHandleCommands(commands);

                region.tasks.execute(task).continueWith(function (commandResults) {
                    commands.forEach(function (command, index) {
                        var commandResult = commandResults[index];
                        if (commandResult != null && !Bifrost.isUndefined(commandResult)) {
                            command.handleCommandResult(commandResult);
                        }
                        command.isBusy(false);
                    });

                    promise.signal(commandResults);
                });
            } catch(e) {
                commands.forEach(function(command) {
                    command.isBusy(false);
                });
            }

            return promise;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.commandCoordinator = Bifrost.commands.commandCoordinator;
Bifrost.namespace("Bifrost.commands", {
    commandValidationService: Bifrost.Singleton(function () {
        var self = this;

        function shouldSkipProperty(target, property) {
            if (property === "region") {
                return true;
            }
            if (target instanceof HTMLElement) {
                return true;
            }
            if (!target.hasOwnProperty(property)) {
                return true;
            }
            if (ko.isObservable(target[property])) {
                return false;
            }
            if (typeof target[property] === "function") {
                return true;
            }
            if (property === "_type") {
                return true;
            }
            if (property === "_dependencies") {
                return true;
            }
            if (property === "_namespace") {
                return true;
            }
            if ((target[property] == null)) {
                return true;
            }
            if ((typeof target[property].prototype !== "undefined") &&
                (target[property].prototype !== null) &&
                (target[property] instanceof Bifrost.Type)) {
                return true;
            }

            return false;
        }

        function extendProperties(target, validators) {
            for (var property in target) {
                if (shouldSkipProperty(target, property)) {
                    continue;
                }
                if (typeof target[property].validator !== "undefined") {
                    continue;
                }

                if (ko.isObservable(target[property])) {
                    target[property].extend({ validation: {} });
                    target[property].validator.propertyName = property;
                } else if (typeof target[property] === "object") {
                    extendProperties(target[property], validators);
                }
            }
        }

        function validatePropertiesFor(target, result, silent) {
            for (var property in target) {
                if (shouldSkipProperty(target, property)) {
                    continue;
                }

                if (typeof target[property].validator !== "undefined") {
                    var valueToValidate = ko.utils.unwrapObservable(target[property]());
                    if (silent === true) {
                        target[property].validator.validateSilently(valueToValidate);
                    } else {
                        target[property].validator.validate(valueToValidate);
                    }

                    if (target[property].validator.isValid() === false) {
                        result.valid = false;
                    }
                } else if (typeof target[property] === "object") {
                    validatePropertiesFor(target[property], result, silent);
                }
            }
        }


        function applyValidationMessageToMembers(command, members, message) {
            function fixMember(member) {
                property = member.toCamelCase();
                if (property in target) {
                    if (typeof target[property] === "object") {
                        target = target[property];
                    }
                }
            }

            for (var memberIndex = 0; memberIndex < members.length; memberIndex++) {
                var path = members[memberIndex].split(".");
                var property = null;
                var target = command;

                path.forEach(fixMember);

                if (property != null && property.length) {
                    var member = target[property];

                    if (typeof member.validator !== "undefined") {
                        member.validator.isValid(false);
                        member.validator.message(message);
                    }
                }
            }
        }

        this.applyValidationResultToProperties = function (command, validationResults) {

            for (var i = 0; i < validationResults.length; i++) {
                var validationResult = validationResults[i];
                var message = validationResult.errorMessage;
                var memberNames = validationResult.memberNames;
                if (memberNames.length > 0) {
                    applyValidationMessageToMembers(command, memberNames, message);
                }
            }
        };

        this.validate = function (command) {
            var result = { valid: true };
            validatePropertiesFor(command, result);
            return result;
        };

        this.validateSilently = function (command) {
            var result = { valid: true };
            validatePropertiesFor(command, result, true);
            return result;
        };

        this.clearValidationMessagesFor = function (target) {
            for (var property in target) {
                if (shouldSkipProperty(target, property)) {
                    continue;
                }

                if (!Bifrost.isNullOrUndefined(target[property].validator)) {
                    target[property].validator.message("");
                }
            }
        };

        this.extendPropertiesWithoutValidation = function (command) {
            extendProperties(command);
        };


        function collectValidators(source, validators) {
            for (var property in source) {
                var value = source[property];

                if (shouldSkipProperty(source, property)) {
                    continue;
                }

                if (ko.isObservable(value) && typeof value.validator !== "undefined") {
                    validators.push(value.validator);
                } else if (Bifrost.isObject(value)) {
                    collectValidators(value, validators);
                }
            }
        }

        this.getValidatorsFor = function (command) {
            var validators = [];
            collectValidators(command, validators);
            return validators;
        };
    })
});
Bifrost.namespace("Bifrost.commands", {
    Command: Bifrost.Type.extend(function (commandCoordinator, commandValidationService, commandSecurityService, mapper, options, region) {
        var self = this;
        var hasChangesObservables = ko.observableArray();

        this.region = region;
        this._name = "";
        this._generatedFrom = "";
        this.targetCommand = this;
        this.validators = ko.observableArray();
        this.validationMessages = ko.observableArray();
        this.securityContext = ko.observable(null);
        this.populatedFromExternalSource = ko.observable(false);


        this.isBusy = ko.observable(false);
        this.isValid = ko.computed(function () {
            var valid = true;
            self.validators().some(function (validator) {
                if (ko.isObservable(validator.isValid) && validator.isValid() === false) {
                    valid = false;
                    return true;
                }
            });

            if (self.validationMessages().length > 0) {
                return false;
            }

            return valid;
        });
        this.isAuthorized = ko.observable(false);
        this.canExecute = ko.computed(function () {
            return self.isValid() && self.isAuthorized();
        });
        this.isPopulatedExternally = ko.observable(false);
        this.isReady = ko.computed(function () {
            if (self.isPopulatedExternally() === false) {
                return true;
            }
            return self.populatedFromExternalSource();
        });
        this.isReadyToExecute = ko.computed(function () {
            if (self.isPopulatedExternally() === false) {
                return true;
            }

            return self.hasChanges();
        });


        this.hasChanges = ko.computed(function () {
            var hasChange = false;
            hasChangesObservables().some(function (item) {
                if (item() === true) {
                    hasChange = true;
                    return true;
                }
            });

            return hasChange;
        });

        this.failedCallbacks = [];
        this.succeededCallbacks = [];
        this.completedCallbacks = [];

        this.commandCoordinator = commandCoordinator;
        this.commandValidationService = commandValidationService;
        this.commandSecurityService = commandSecurityService;

        this.options = {
            beforeExecute: function () { },
            failed: function () { },
            succeeded: function () { },
            completed: function () { },
            properties: {}
        };

        this.failed = function (callback) {
            self.failedCallbacks.push(callback);
            return self;
        };
        this.succeeded = function (callback) {
            self.succeededCallbacks.push(callback);
            return self;
        };
        this.completed = function (callback) {
            self.completedCallbacks.push(callback);
            return self;
        };

        this.setOptions = function (options) {
            Bifrost.extend(self.options, options);
            if (typeof options.name !== "undefined" && typeof options.name === "string") {
                self._name = options.name;
            }
        };

        this.copyPropertiesFromOptions = function () {
            for (var property in self.targetCommand.options.properties) {
                var value = self.targetCommand.options.properties[property];
                if (!ko.isObservable(value)) {
                    value = ko.observable(value);
                }

                self.targetCommand[property] = value;
            }
        };

        this.getProperties = function () {
            var properties = [];
            for (var property in self.targetCommand) {
                if (self.targetCommand.hasOwnProperty(property) &&
                    !(self.hasOwnProperty(property))) {
                    properties.push(property);
                }
            }

            return properties;
        };

        this.makePropertiesObservable = function () {
            var properties = self.getProperties();
            properties.forEach(function (property) {
                var value = null;
                var propertyValue = self.targetCommand[property];

                if (!ko.isObservable(propertyValue) &&
                     (typeof propertyValue !== "object" || Bifrost.isArray(propertyValue))) {

                    if (typeof propertyValue !== "function") {
                        if (Bifrost.isArray(propertyValue)) {
                            value = ko.observableArray(propertyValue);
                        } else {
                            value = ko.observable(propertyValue);
                        }
                        self.targetCommand[property] = value;
                    }
                }
            });
        };

        this.extendPropertiesWithHasChanges = function () {
            var properties = self.getProperties();
            properties.forEach(function(property) {
                var propertyValue = self.targetCommand[property];
                if (ko.isObservable(propertyValue)) {
                    propertyValue.extend({ hasChanges: {} });
                    if (!Bifrost.isNullOrUndefined(propertyValue.hasChanges)) {
                        hasChangesObservables.push(propertyValue.hasChanges);
                    }
                }
            });
        };

        this.onBeforeExecute = function () {
            self.options.beforeExecute();
        };

        this.onFailed = function (commandResult) {
            self.options.failed(commandResult);

            self.failedCallbacks.forEach(function (callback) {
                callback(commandResult);
            });
        };

        this.setInitialValuesForProperties = function (properties) {
            properties.forEach(function (propertyName) {
                var property = self.targetCommand[propertyName];
                if (ko.isObservable(property) &&
                    ko.isWriteableObservable(property) &&
                    Bifrost.isFunction(property.setInitialValue)) {
                    var value = property();
                    property.setInitialValue(value);
                }
            });
        };

        this.setInitialValuesFromCurrentValues = function () {
            var properties = self.getProperties();
            self.setInitialValuesForProperties(properties);
        };

        this.onSucceeded = function (commandResult) {
            self.options.succeeded(commandResult);

            self.setInitialValuesFromCurrentValues();

            self.succeededCallbacks.forEach(function (callback) {
                callback(commandResult);
            });
        };

        this.onCompleted = function (commandResult) {
            self.options.completed(commandResult);

            self.completedCallbacks.forEach(function (callback) {
                callback(commandResult);
            });
        };

        this.handleCommandResult = function (commandResult) {
            self.isBusy(false);
            if (typeof commandResult.commandValidationMessages !== "undefined") {
                self.validationMessages(commandResult.commandValidationMessages);
            }

            if (commandResult.success === false || commandResult.invalid === true) {
                if (commandResult.invalid && typeof commandResult.validationResults !== "undefined") {
                    self.commandValidationService.applyValidationResultToProperties(self.targetCommand, commandResult.validationResults);
                }
                self.onFailed(commandResult);
            } else {
                self.onSucceeded(commandResult);
            }
            self.onCompleted(commandResult);
        };

        this.getCommandResultFromValidationResult = function (validationResult) {
            var result = Bifrost.commands.CommandResult.create();
            result.invalid = true;
            return result;
        };

        this.execute = function () {
            self.isBusy(true);
            try {
                self.onBeforeExecute();
                var validationResult = self.commandValidationService.validate(this);
                if (validationResult.valid === true) {
                        self.commandCoordinator.handle(self.targetCommand).continueWith(function (commandResult) {
                            self.handleCommandResult(commandResult);
                        });
                } else {
                    var commandResult = self.getCommandResultFromValidationResult(validationResult);
                    self.handleCommandResult(commandResult);
                }
            } catch (ex) {
                self.isBusy(false);
            }
        };

        this.populatedExternally = function () {
            self.isPopulatedExternally(true);
        };

        this.populateFromExternalSource = function (values) {
            self.isPopulatedExternally(true);
            self.setPropertyValuesFrom(values);
            self.populatedFromExternalSource(true);
            commandValidationService.clearValidationMessagesFor(self.targetCommand);
        };

        this.setPropertyValuesFrom = function (values) {
            var mappedProperties = mapper.mapToInstance(self.targetCommand._type, values, self.targetCommand);
            self.setInitialValuesForProperties(mappedProperties);
        };

        this.onCreated = function (lastDescendant) {
            self.targetCommand = lastDescendant;
            if (typeof options !== "undefined") {
                this.setOptions(options);
                this.copyPropertiesFromOptions();
            }
            this.makePropertiesObservable();
            this.extendPropertiesWithHasChanges();
            if (typeof lastDescendant._name !== "undefined" && lastDescendant._name !== "") {
                commandValidationService.extendPropertiesWithoutValidation(lastDescendant);
                var validators = commandValidationService.getValidatorsFor(lastDescendant);
                if (Bifrost.isArray(validators) && validators.length > 0) {
                    self.validators(validators);
                }
                commandValidationService.validateSilently(this);
            }

            commandSecurityService.getContextFor(lastDescendant).continueWith(function (securityContext) {
                lastDescendant.securityContext(securityContext);

                if (ko.isObservable(securityContext.isAuthorized)) {
                    lastDescendant.isAuthorized(securityContext.isAuthorized());
                    securityContext.isAuthorized.subscribe(function (newValue) {
                        lastDescendant.isAuthorized(newValue);
                    });
                }
            });
        };
    })
});
Bifrost.namespace("Bifrost.commands");
Bifrost.commands.CommandDescriptor = function(command) {
    var self = this;

    var builtInCommand = {};
    if (typeof Bifrost.commands.Command !== "undefined") {
        builtInCommand = Bifrost.commands.Command.create({
            region: { commands: [] },
            commandCoordinator: {},
            commandValidationService: {},
            commandSecurityService: { getContextFor: function () { return { continueWith: function () { } }; } },
            mapper: {},
            options: {}
        });
    }

    function shouldSkipProperty(target, property) {
        if (!target.hasOwnProperty(property)) {
            return true;
        }
        if (builtInCommand.hasOwnProperty(property)) {
            return true;
        }
        if (ko.isObservable(target[property])) {
            return false;
        }
        if (typeof target[property] === "function") {
            return true;
        }
        if (property === "_type") {
            return true;
        }
        if (property === "_namespace") {
            return true;
        }

        return false;
    }

    function getPropertiesFromCommand(command) {
        var properties = {};

        for (var property in command) {
            if (!shouldSkipProperty(command, property) ) {
                properties[property] = command[property];
            }
        }
        return properties;
    }

    this.name = command._name;
    this.generatedFrom = command._generatedFrom;
    this.id = Bifrost.Guid.create();

    var properties = getPropertiesFromCommand(command);
    var commandContent = ko.toJS(properties);
    commandContent.Id = Bifrost.Guid.create();
    this.command = ko.toJSON(commandContent);
};


Bifrost.commands.CommandDescriptor.createFrom = function (command) {
    var commandDescriptor = new Bifrost.commands.CommandDescriptor(command);
    return commandDescriptor;
};


Bifrost.namespace("Bifrost.commands");
Bifrost.commands.CommandResult = (function () {
    function CommandResult(existing) {
        var self = this;
        this.isEmpty = function () {
            return self.commandId === Bifrost.Guid.empty;
        };

        this.commandName = "";
        this.commandId = Bifrost.Guid.empty;
        this.validationResults = [];
        this.success = true;
        this.invalid = false;
        this.passedSecurity = true;
        this.exception = undefined;
        this.exceptionMessage = "";
        this.commandValidationMessages = [];
        this.securityMessages = [];
        this.allValidationMessages = [];
        this.details = "";

        if (typeof existing !== "undefined") {
            Bifrost.extend(this, existing);
        }
    }

    return {
        create: function() {
            var commandResult = new CommandResult();
            return commandResult;
        },
        createFrom: function (result) {
            var existing = typeof result === "string" ? JSON.parse(result) : result;
            var commandResult = new CommandResult(existing);
            return commandResult;
        }
    };
})();
Bifrost.dependencyResolvers.command = {
    canResolve: function (namespace, name) {
        if (typeof commands !== "undefined") {
            return name in commands;
        }
        return false;
    },

    resolve: function (namespace, name) {
        return commands[name].create();
    }
};
Bifrost.namespace("Bifrost.commands", {
    CommandSecurityContext: Bifrost.Type.extend(function () {
        this.isAuthorized = ko.observable(false);
    })
});
Bifrost.namespace("Bifrost.commands", {
    commandSecurityContextFactory: Bifrost.Singleton(function () {
        this.create = function () {
            var context = Bifrost.commands.CommandSecurityContext.create();
            return context;
        };
    })
});
Bifrost.namespace("Bifrost.commands", {
    commandSecurityService: Bifrost.Singleton(function (commandSecurityContextFactory) {
        var self = this;

        this.commandSecurityContextFactory = commandSecurityContextFactory;

        function getTypeNameFor(command) {
            return command._type._name;
        }

        function getSecurityContextNameFor(type) {
            var securityContextName = type + "SecurityContext";
            return securityContextName;
        }

        function hasSecurityContextInNamespaceFor(type, namespace) {
            var securityContextName = getSecurityContextNameFor(type);
            return !Bifrost.isNullOrUndefined(securityContextName) &&
                !Bifrost.isNullOrUndefined(namespace) &&
                namespace.hasOwnProperty(securityContextName);
        }

        function getSecurityContextInNamespaceFor(type, namespace) {
            var securityContextName = getSecurityContextNameFor(type, namespace);
            return namespace[securityContextName];
        }

        this.getContextFor = function (command) {
            var promise = Bifrost.execution.Promise.create();
            var context;

            var type = getTypeNameFor(command);
            if (hasSecurityContextInNamespaceFor(type, command._type._namespace)) {
                var contextType = getSecurityContextInNamespaceFor(type, command._type._namespace);
                context = contextType.create();
                promise.signal(context);
            } else {
                context = self.commandSecurityContextFactory.create();
                if (Bifrost.isNullOrUndefined(command._generatedFrom) || command._generatedFrom === "") {
                    promise.signal(context);
                } else {
                    var url = "/Bifrost/CommandSecurity/GetForCommand?commandName=" + command._generatedFrom;
                    $.getJSON(url, function (e) {
                        context.isAuthorized(e.isAuthorized);
                        promise.signal(context);
                    });
                }
            }

            return promise;
        };

        this.getContextForType = function (commandType) {
            var promise = Bifrost.execution.Promise.create();
            var context;

            if (hasSecurityContextInNamespaceFor(commandType._name, commandType._namespace)) {
                var contextType = getSecurityContextInNamespaceFor(commandType._name, commandType._namespace);
                context = contextType.create();
                promise.signal(context);
            } else {
                context = Bifrost.commands.CommandSecurityContext.create();
                context.isAuthorized(true);
                promise.signal(context);
            }

            return promise;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.commandSecurityService = Bifrost.commands.commandSecurityService;
ko.extenders.hasChanges = function (target) {
    target._initialValueSet = false;
    target.hasChanges = ko.observable(false);
    function updateHasChanges() {
        if (target._initialValueSet === false) {
            target.hasChanges(false);
        } else {
            if (Bifrost.isArray(target._initialValue)) {
                target.hasChanges(!target._initialValue.shallowEquals(target()));
                return;
            }
            target.hasChanges(target._initialValue !== target());
        }
    }

    target.subscribe(function () {
        updateHasChanges();
    });

    target.setInitialValue = function (value) {
        var initialValue;
        if (Bifrost.isArray(value)) {
            initialValue = value.clone();
        } else {
            initialValue = value;
        }

        target._initialValue = initialValue;
        target._initialValueSet = true;
        updateHasChanges();
    };
};
Bifrost.namespace("Bifrost.commands", {
    commandEvents: Bifrost.Singleton(function () {
        this.succeeded = Bifrost.Event.create();
        this.failed = Bifrost.Event.create();
    })
});
Bifrost.namespace("Bifrost.interaction", {
    Operation: Bifrost.Type.extend(function (region, context) {
        /// <summary>Defines an operation that be performed</summary>
        var self = this;
        var canPerformObservables = ko.observableArray();
        var internalCanPerform = ko.observable(true);

        /// <field name="context" type="Bifrost.interaction.Operation">Context in which the operation exists in</field>
        this.context = context;

        /// <field name="identifier" type="Bifrost.Guid">Unique identifier for the operation instance<field>
        this.identifier = Bifrost.Guid.empty;

        /// <field name="region" type="Bifrost.views.Region">Region that the operation was created in</field>
        this.region = region;

        /// <field name="canPerform" type="observable">Set to true if the operation can be performed, false if not</field>
        this.canPerform = ko.computed({
            read: function () {
                if (canPerformObservables().length === 0) {
                    return true;
                }

                var canPerform = true;
                canPerformObservables().forEach(function (observable) {
                    if (observable() === false) {
                        canPerform = false;
                        return;
                    }
                });

                return canPerform;
            },
            write: function (value) {
                internalCanPerform(value);
            }
        });

        this.canPerform.when = function (observable) {
            /// <summary>Chainable clauses</summary>
            /// <param name="observable" type="observable">The observable to use for deciding wether or not the operation can perform</param>
            /// <returns>The canPerform that can be further chained</returns>
            canPerformObservables.push(observable);
            return self.canPerform;
        };

        this.canPerform.when(internalCanPerform);

        this.perform = function () {
            /// <summary>Function that gets called when an operation gets performed</summary>
            /// <returns>State change, if any - typically helpful when undoing</returns>
            return {};
        };

        this.undo = function (state) {
            /// <summary>Function that gets called when an operation gets undoed</summary>
            /// <param name="state" type="object">State generated when the operation was performed</param>
        };
    })
});
Bifrost.namespace("Bifrost.interaction", {
    OperationContext: Bifrost.Type.extend(function () {
        /// <summary>Defines the context in which an operation is being performed or undoed within</summary>

    })
});
Bifrost.namespace("Bifrost.interaction", {
    OperationEntry: Bifrost.Type.extend(function (operation, state) {
        /// <summary>Represents an entry for an operation in a specific context with resulting state</summary>

        /// <field name="operation" type="Bifrost.interaction.Operation">Operation that was performed</field>
        this.operation = operation;

        /// <field name="state" type="object">State that operation generated</field>
        this.state = state;
    })
});
Bifrost.namespace("Bifrost.interaction", {
    operationEntryFactory: Bifrost.Singleton(function () {
        /// <summary>Represents a factory that can create OperationEntries</summary>

        this.create = function (operation, state) {
            /// <sumary>Create an instance of a OperationEntry</summary>
            /// <param name="context" type="Bifrost.interaction.OperationContext">Context the operation was performed in</param>
            /// <param name="operation" type="Bifrost.interaction.Operation">Operation that was performed</param>
            /// <param name="state" type="object">State that operation generated</param>
            /// <returns>An OperationEntry</returns>

            var instance = Bifrost.interaction.OperationEntry.create({
                operation: operation,
                state: state
            });
            return instance;
        };
    })
});
Bifrost.namespace("Bifrost.interaction", {
    Operations: Bifrost.Type.extend(function (operationEntryFactory) {
        /// <summary>Represents a stack of operations and the ability to perform and put operations on the stack</summary>
        var self = this;

        /// <field name="all" type="observableArray">Holds all operations</field>
        this.all = ko.observableArray();

        /// <field name="stateful" type="observableArray">Holds all operations that are stateful - meaning that they produce state from being performed</field>
        this.stateful = ko.computed(function () {
            var entries = [];

            self.all().forEach(function (entry) {
                if (!Bifrost.areEqual(entry.state, {})) {
                    entries.push(entry);
                }
            });

            return entries;
        });

        this.getByIdentifier = function (identifier) {
            /// <summary>Get an operation by its identifier</identifier>
            /// <param name="identifier" type="Bifrost.Guid">Identifier of the operation to get<param>
            /// <returns>An instance of the operation if found, null if not found</returns>

            var found = null;
            self.all().forEach(function (operation) {
                if (operation.identifier === identifier) {
                    found = operation;
                    return;
                }
            });

            return found;
        };

        this.perform = function (operation) {
            /// <summary>Perform an operation in a given context</summary>
            /// <param name="context" type="Bifrost.interaction.OperationContext">Context in which the operation is being performed in</param>
            /// <param name="operation" type="Bifrost.interaction.Operation">Operation to perform</param>

            if (operation.canPerform() === true) {
                var state = operation.perform();
                var entry = operationEntryFactory.create(operation, state);
                self.all.push(entry);
            }
        };

        this.undo = function () {
            /// <summary>Undo the last operation on the stack and remove it as an operation</summary>

            throw "Not implemented";
        };
    })
});
Bifrost.namespace("Bifrost.interaction", {
    operationsFactory: Bifrost.Singleton(function () {
        this.create = function () {
            var operations = Bifrost.interaction.Operations.create();
            return operations;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.operationsFactory = Bifrost.interaction.operationsFactory;
Bifrost.namespace("Bifrost.interaction", {
    CommandOperation: Bifrost.interaction.Operation.extend(function (commandSecurityService) {
        /// <summary>Represents an operation that result in a command</summary>
        var self = this;

        /// <field name="commandType" type="Bifrost.Type">Type of command to create</field>
        this.commandType = ko.observable();

        // <field name="isAuthorizaed" type="observable">Holds a boolean; true if authorized / false if not</field>
        this.isAuthorized = ko.observable(false);

        // <field name="commandCreated" type="Bifrost.Event">Event that gets triggered when command is created</field>
        this.commandCreated = Bifrost.Event.create();

        this.canPerform.when(this.isAuthorized);

        this.commandType.subscribe(function (type) {
            commandSecurityService.getContextForType(type).continueWith(function (context) {
                if (!Bifrost.isNullOrUndefined(context)) {
                    self.isAuthorized(context.isAuthorized());
                }
            });
        });

        this.createCommandOfType = function (commandType) {
            /// <summary>Create an instance of a given command type</summary>
            var instance = commandType.create({
                region: self.region
            });

            self.commandCreated.trigger(instance);

            return instance;
        };
    })
});
Bifrost.namespace("Bifrost.interaction", {
    Action: Bifrost.Type.extend(function () {
        this.perform = function () {
        };
    })
});
Bifrost.namespace("Bifrost.interaction", {
    Trigger: Bifrost.Type.extend(function () {
        var self = this;

        this.actions = [];

        this.addAction = function (action) {
            self.actions.push(action);
        };

        this.initialize = function (element) {
        };

        this.signal = function () {
            self.actions.forEach(function (action) {
                action.perform();
            });
        };
    })
});
Bifrost.namespace("Bifrost.interaction", {
    EventTrigger: Bifrost.interaction.Trigger.extend(function () {
        var self = this;

        this.eventName = null;

        function throwIfEventNameIsNotSet(trigger) {
            if (!trigger.eventName) {
                throw "EventName is not set for trigger";
            }
        }

        this.initialize = function (element) {
            throwIfEventNameIsNotSet(this);

            var actualEventName = "on" + self.eventName;
            if (element[actualEventName] == null || typeof element[actualEventName] === "function") {
                var originalEventHandler = element[actualEventName];
                element[actualEventName] = function (e) {
                    if (originalEventHandler) {
                        originalEventHandler(e);
                    }

                    self.signal();
                };
            }

        };
    })
});
Bifrost.namespace("Bifrost.interaction", {
    VisualState: Bifrost.Type.extend(function () {
        /// <summary>Represents a visual state of a control or element</summary>
        var self = this;

        /// <field name="name" type="String">Name of the visual state</field>
        this.name = "";

        /// <field name="actions" type="Array" elementType="Bifrost.interaction.VisualStateTransitionAction">Transition actions that will execute when transitioning</field>
        this.actions = ko.observableArray();

        this.addAction = function (action) {
            /// <summary>Add action to the visual state</summary>
            /// <param name="action" type="Bifrost.interaction.VisualStateAction">
            self.actions.push(action);
        };

        this.enter = function (namingRoot, duration) {
            /// <summary>Enter the state with a given duration</summary>
            /// <param name="duration" type="Bifrost.TimeSpan">Time to spend entering the state</param>
            self.actions().forEach(function (action) {
                action.onEnter(namingRoot, duration);
            });
        };

        this.exit = function (namingRoot, duration) {
            /// <summary>Exit the state with a given duration</summary>
            /// <param name="duration" type="Bifrost.TimeSpan">Time to spend entering the state</param>
            self.actions().forEach(function (action) {
                action.onExit(namingRoot, duration);
            });
        };
    })
});
Bifrost.namespace("Bifrost.interaction", {
    VisualStateAction: Bifrost.Type.extend(function () {

        this.initialize = function (namingRoot) {

        };

        this.onEnter = function (namingRoot, duration) {

        };

        this.onExit = function (namingRoot, duration) {

        };
    })
});
Bifrost.namespace("Bifrost.interaction", {
    VisualStateGroup: Bifrost.Type.extend(function (dispatcher) {
        /// <summary>Represents a group that holds visual states</summary>
        var self = this;

        this.defaultDuration = Bifrost.TimeSpan.zero();

        /// <field name="currentState" type="Bifrost.interaction.VisualState">Holds the current state, this is an observable</field>
        this.currentState = ko.observable({name: "null state", enter: function () {}, exit: function () {}});

        /// <field name="states" type="Array" elementType="Bifrost.interaction.VisualState">Holds an observable array of visual states</field>
        this.states = ko.observableArray();

        /// <field name="transitions" type="Array" elementType="Bifrost.interaction.VisualStateTransition">Holds an observable array of visual state transitions</field>
        this.transitions = ko.observableArray();

        this.addState = function (state) {
            /// <summary>Add a state to the group</summary>
            /// <param name="state" type="Bifrost.interaction.VisualState">State to add</param>
            if (self.hasState(state.name)) {
                throw "VisualState with name of '" + state.name + "' already exists";
            }
            self.states.push(state);
        };

        this.addTransition = function (transition) {
            /// <summary>Add transition to group</summary>
            /// <param name="transition" type="Bifrost.interaction.VisualStateTransition">Transition to add</param>
            self.transitions.push(transition);
        };

        this.hasState = function (stateName) {
            /// <summary>Check if group has state by the name of the state</summary>
            /// <param name="stateName" type="String">Name of the state to check for</param>
            /// <returns type="Boolean">True if the state exists, false if not</returns>
            var hasState = false;
            self.states().forEach(function (state) {
                if (state.name === stateName) {
                    hasState = true;
                    return;
                }
            });

            return hasState;
        };

        this.getStateByName = function (stateName) {
            /// <summary>Gets a state by its name</summary>
            /// <param name="stateName" type="String">Name of the state to get</param>
            /// <returns type="Bifrost.interaction.VisualState">State found or null if it does not have a state by the given name</returns>
            var stateFound = null;
            self.states().forEach(function (state) {
                if (state.name === stateName) {
                    stateFound = state;
                    return;
                }
            });
            return stateFound;
        };

        this.goTo = function (namingRoot, stateName) {
            /// <summary>Go to a specific state by the name of the state</summary>
            /// <param name="stateName" type="String">Name of the state to go to</param>
            var currentState = self.currentState();
            if (!Bifrost.isNullOrUndefined(currentState) && currentState.name === stateName) {
                return;
            }

            var state = self.getStateByName(stateName);
            if (!Bifrost.isNullOrUndefined(state)) {
                var duration = self.defaultDuration;
                if (!Bifrost.isNullOrUndefined(currentState)) {
                    currentState.exit(namingRoot, duration);
                }
                state.enter(namingRoot, duration);

                dispatcher.schedule(duration.totalMilliseconds(), function () {
                    self.currentState(state);
                });
            }
        };
    })
});
Bifrost.namespace("Bifrost.interaction", {
    VisualStateManager: Bifrost.Type.extend(function () {
        /// <summary>Represents a state manager for dealing with visual states, typically related to a control or other element on a page</summary>
        var self = this;

        /// <field name="namingRoot" type="Bifrost.views.NamingRoot">A root for named objects</field>
        this.namingRoot = null;

        /// <field name="groups" type="Array" elementType="Bifrost.interaction.VisualStateGroup">Holds all groups in the state manager</field>
        this.groups = ko.observableArray();

        this.addGroup = function (group) {
            /// <summary>Adds a VisualStateGroup to the manager</summary>
            /// <param name="group" type="Bifrost.interaction.VisualStateGroup">Group to add</param>
            self.groups.push(group);
        };

        this.goTo = function (stateName) {
            /// <summary>Go to a specific state by its name</summary>
            /// <param name="stateName" type="String">Name of state to go to</param>
            self.groups().forEach(function (group) {
                if (group.hasState(stateName) === true) {
                    group.goTo(self.namingRoot, stateName);
                }
            });
        };
    })
});
Bifrost.namespace("Bifrost.interaction", {
    VisualStateTransition: Bifrost.Type.extend(function() {
        /// <summary>Represents a description of transition between two named states</summary>

        /// <field name="from" type="String">Name of visual state that we are describing transitioning from</field>
        this.from = "";

        /// <field name="to" type="String">Name of visual state that we are describing transitioning to</field>
        this.to = "";

        /// <field name="duration" type="Bifrost.TimeStamp">Duration for the transition</field>
        this.duration = Bifrost.TimeStamp.zero();
    })
});
var globalId = 0;
Bifrost.namespace("Bifrost.interaction.visualStateActions", {
    Opacity: Bifrost.interaction.VisualStateAction.extend(function (documentService) {
        var self = this;
        var element = null;
        var id = documentService.getUniqueStyleName("opacity");

        this.target = "";
        this.value = "";


        this.initialize = function (namingRoot) {
            element = namingRoot.find(self.target);
        };

        this.onEnter = function (namingRoot, duration) {
            var value = parseFloat(self.value);
            if (isNaN(value)) {
                value = 0.0;
            }

            var actualDuration = duration.totalMilliseconds() / 1000;

            documentService.addStyle("." + id, {
                "-webkit-transition": "opacity " + actualDuration + "s ease-in-out",
                "-moz-transition": "opacity " + actualDuration + "s ease-in-out",
                "-ms-transition": "opacity " + actualDuration + "s ease-in-out",
                "-o-transition": "opacity " + actualDuration + "s ease-in-out",
                "transition": "opacity " + actualDuration + "s ease-in-out",
                "opacity": value
            });

            element.classList.add(id);
        };

        this.onExit = function (namingRoot, duration) {
            element.classList.remove(id);
        };
    })
});
Bifrost.namespace("Bifrost.mapping", {
    MissingPropertyStrategy: Bifrost.Type.extend(function () {

    })
});
Bifrost.namespace("Bifrost.mapping", {
    PropertyMap: Bifrost.Type.extend(function (sourceProperty, typeConverters) {
        var self = this;

        this.strategy = null;

        function throwIfMissingPropertyStrategy() {
            if (Bifrost.isNullOrUndefined(self.strategy)) {
                throw Bifrost.mapping.MissingPropertyStrategy.create();
            }
        }

        this.to = function (targetProperty) {
            self.strategy = function (source, target) {
                var value = ko.unwrap(source[sourceProperty]);
                var targetValue = ko.unwrap(target[targetProperty]);

                var typeAsString = null;
                if (!Bifrost.isNullOrUndefined(value)) {
                    if (!Bifrost.isNullOrUndefined(targetValue)) {
                        if (value.constructor !== targetValue.constructor) {
                            typeAsString = targetValue.constructor.name.toString();
                        }

                        if (!Bifrost.isNullOrUndefined(target[targetProperty]._typeAsString)) {
                            typeAsString = target[targetProperty]._typeAsString;
                        }
                    }

                    if (!Bifrost.isNullOrUndefined(typeAsString)) {
                        value = typeConverters.convertFrom(value.toString(), typeAsString);
                    }
                }

                if (ko.isObservable(target[targetProperty])) {
                    target[targetProperty](value);
                } else {
                    target[targetProperty] = value;
                }
            };
        };

        this.map = function (source, target) {
            throwIfMissingPropertyStrategy();

            self.strategy(source, target);
        };
    })
});
Bifrost.namespace("Bifrost.mapping", {
    Map: Bifrost.Type.extend(function () {
        var self = this;

        var properties = {};

        this.sourceType = null;
        this.targetType = null;

        this.source = function (type) {
            self.sourceType = type;
        };

        this.target = function (type) {
            self.targetType = type;
        };

        this.property = function (property) {
            var propertyMap = Bifrost.mapping.PropertyMap.create({ sourceProperty: property });
            properties[property] = propertyMap;
            return propertyMap;
        };

        this.canMapProperty = function (property) {
            return properties.hasOwnProperty(property);
        };

        this.mapProperty = function (property, source, target) {
            if (self.canMapProperty(property)) {
                properties[property].map(source, target);
            }
        };
    })
});
Bifrost.namespace("Bifrost.mapping", {
    maps: Bifrost.Singleton(function () {
        var self = this;
        var maps = {};

        function getKeyFrom(sourceType, targetType) {
            return sourceType._typeId + " - " + targetType._typeId;
        }

        var extenders = Bifrost.mapping.Map.getExtenders();

        extenders.forEach(function (extender) {
            var map = extender.create();
            var key = getKeyFrom(map.sourceType, map.targetType);
            maps[key] = map;
        });

        this.hasMapFor = function (sourceType, targetType) {
            if (Bifrost.isNullOrUndefined(sourceType) || Bifrost.isNullOrUndefined(targetType)) {
                return false;
            }
            var key = getKeyFrom(sourceType, targetType);
            return maps.hasOwnProperty(key);
        };

        this.getMapFor = function (sourceType, targetType) {
            if (self.hasMapFor(sourceType, targetType)) {
                var key = getKeyFrom(sourceType, targetType);
                return maps[key];
            }
        };
    })
});
Bifrost.namespace("Bifrost.mapping", {
    mapper: Bifrost.Type.extend(function (typeConverters, maps) {
        "use strict";
        var self = this;

        function getTypeAsString(to, property, value, toValue) {
            var typeAsString = null;
            if (!Bifrost.isNullOrUndefined(value) &&
                !Bifrost.isNullOrUndefined(toValue)) {

                if (value.constructor !== toValue.constructor) {
                    typeAsString = toValue.constructor.toString().match(/function\040+(\w*)/)[1];
                }
            }

            if (!Bifrost.isNullOrUndefined(to[property]) &&
                !Bifrost.isNullOrUndefined(to[property]._typeAsString)) {
                typeAsString = to[property]._typeAsString;
            }
            return typeAsString;
        }



        function copyProperties(mappedProperties, from, to, map) {
            for (var property in from) {
                if (property.indexOf("_") === 0) {
                    continue;
                }

                if (!Bifrost.isUndefined(from[property])) {

                    if (Bifrost.isObject(from[property]) && Bifrost.isObject(to[property])) {
                        copyProperties(mappedProperties, from[property], to[property]);
                    } else {
                        if (!Bifrost.isNullOrUndefined(map)) {
                            if (map.canMapProperty(property)) {
                                map.mapProperty(property, from, to);

                                if (mappedProperties.indexOf(property) < 0) {
                                    mappedProperties.push(property);
                                }

                                continue;
                            }
                        }

                        if (!Bifrost.isUndefined(to[property])) {
                            var value = ko.unwrap(from[property]);
                            var toValue = ko.unwrap(to[property]);

                            var typeAsString = getTypeAsString(to, property, value, toValue);

                            if (!Bifrost.isNullOrUndefined(typeAsString) && !Bifrost.isNullOrUndefined(value)) {
                                value = typeConverters.convertFrom(value.toString(), typeAsString);
                            }

                            if (mappedProperties.indexOf(property) < 0) {
                                mappedProperties.push(property);
                            }


                            if (ko.isObservable(to[property])) {
                                if (!ko.isWriteableObservable(to[property])) {
                                    continue;
                                }

                                to[property](value);
                            } else {
                                to[property] = value;
                            }
                        }
                    }
                }
            }
        }

        function mapSingleInstance(type, data, mappedProperties) {
            if (data) {
                if (!Bifrost.isNullOrUndefined(data._sourceType)) {
                    type = eval(data._sourceType);
                }
            }

            var instance = type.create();

            if (data) {
                var map = null;
                if (maps.hasMapFor(data._type, type)) {
                    map = maps.getMapFor(data._type, type);
                }

                copyProperties(mappedProperties, data, instance, map);
            }
            return instance;
        }

        function mapMultipleInstances(type, data, mappedProperties) {
            var mappedInstances = [];
            for (var i = 0; i < data.length; i++) {
                var singleData = data[i];
                mappedInstances.push(mapSingleInstance(type, singleData, mappedProperties));
            }
            return mappedInstances;
        }

        this.map = function (type, data) {
            var mappedProperties = [];
            if (Bifrost.isArray(data)) {
                return mapMultipleInstances(type, data, mappedProperties);
            } else {
                return mapSingleInstance(type, data, mappedProperties);
            }
        };

        this.mapToInstance = function (targetType, data, target) {
            var mappedProperties = [];

            var map = null;
            if (maps.hasMapFor(data._type, targetType)) {
                map = maps.getMapFor(data._type, targetType);
            }
            copyProperties(mappedProperties, data, target, map);

            return mappedProperties;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.mapper = Bifrost.mapping.mapper;
Bifrost.namespace("Bifrost.read", {
    readModelSystemEvents: Bifrost.Singleton(function () {
        this.noInstance = Bifrost.Event.create();
    })
});
Bifrost.namespace("Bifrost.read", {
    PagingInfo: Bifrost.Type.extend(function (size, number) {
        this.size = size;
        this.number = number;
    })
});
Bifrost.namespace("Bifrost.read", {
    Queryable: Bifrost.Type.extend(function (query, queryService, region, targetObservable) {
        var self = this;

        this.canExecute = true;

        this.target = targetObservable;
        this.query = query;
        this.queryService = queryService;
        this.pageSize = ko.observable(0);
        this.pageNumber = ko.observable(0);
        this.totalItems = ko.observable(0);
        this.completedCallbacks = [];

        this.pageSize.subscribe(function () {
            if (self.canExecute) {
                self.execute();
            }
        });

        this.pageNumber.subscribe(function () {
            if (self.canExecute) {
                self.execute();
            }
        });

        function observePropertiesFrom(query) {
            for (var propertyName in query) {
                var property = query[propertyName];
                if (ko.isObservable(property) === true && query.hasOwnProperty(propertyName) && propertyName !== "areAllParametersSet") {
                    property.subscribe(self.execute);
                }
            }
        }

        this.completed = function (callback) {
            self.completedCallbacks.push(callback);
            return self;
        };

        this.onCompleted = function (data) {
            self.completedCallbacks.forEach(function (callback) {
                callback(data);
            });
        };

        this.execute = function () {
            if (self.query.areAllParametersSet() !== true) {
                // TODO: Diagnostics - warning
                return self.target;
            }
            self.query._previousAreAllParametersSet = true;

            var paging = Bifrost.read.PagingInfo.create({
                size: self.pageSize(),
                number: self.pageNumber()
            });
            self.queryService.execute(query, paging).continueWith(function (result) {
                if (!Bifrost.isNullOrUndefined(result)) {
                    self.totalItems(result.totalItems);
                    self.target(result.items);
                    self.onCompleted(result.items);
                }
            });

            return self.target;
        };

        this.setPageInfo = function (pageSize, pageNumber) {

            if (pageSize === self.pageSize() && pageNumber === self.pageNumber()) {
                return;
            }

            self.canExecute = false;
            self.pageSize(pageSize);
            self.pageNumber(pageNumber);
            self.canExecute = true;
            self.execute();
        };

        observePropertiesFrom(self.query);

        if (self.query.areAllParametersSet()) {
            self.execute();
        }

    })
});
Bifrost.read.Queryable.new = function (options, region) {
    var observable = ko.observableArray();
    options.targetObservable = observable;
    options.region = region;
    var queryable = Bifrost.read.Queryable.create(options);
    Bifrost.extend(observable, queryable);
    observable.isQueryable = true;
    return observable;
};
Bifrost.namespace("Bifrost.read", {
    queryableFactory: Bifrost.Singleton(function () {
        this.create = function (query, region) {
            var queryable = Bifrost.read.Queryable.new({
                query: query
            }, region);
            return queryable;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.queryableFactory = Bifrost.interaction.queryableFactory;
Bifrost.namespace("Bifrost.read", {
    Query: Bifrost.Type.extend(function (queryableFactory, region) {
        var self = this;
        this.target = this;

        this._name = "";
        this._generatedFrom = "";
        this._readModel = null;
        this.region = region;

        this.areAllParametersSet = null;

        this.hasReadModel = function () {
            return typeof self.target._readModel !== "undefined" && self.target._readModel != null;
        };

        this.setParameters = function (parameters) {
            try {
                for (var property in parameters) {
                    if (self.target.hasOwnProperty(property) && ko.isObservable(self.target[property]) === true) {
                        self.target[property](parameters[property]);
                    }
                }
            } catch(ex) {}
        };

        this.getParameters = function () {
            var parameters = {};

            for (var property in self.target) {
                if (ko.isObservable(self.target[property]) &&
                    property !== "areAllParametersSet") {
                    parameters[property] = self.target[property];
                }
            }

            return parameters;
        };

        this.getParameterValues = function () {
            var parameterValues = {};
            var value;

            var parameters = self.getParameters();
            for (var property in parameters) {
                value = parameters[property]();
                if (ko.isObservable(value)) {
                    value = value();
                }
                parameterValues[property] = value;
            }

            return parameterValues;
        };

        this.all = function () {
            var queryable = queryableFactory.create(self.target, region);
            return queryable;
        };

        this.paged = function (pageSize, pageNumber) {
            var queryable = queryableFactory.create(self.target, region);
            queryable.setPageInfo(pageSize, pageNumber);
            return queryable;
        };

        this.onCreated = function (query) {
            self.target = query;

            for (var property in self.target) {
                if (ko.isObservable(self.target[property]) === true) {
                    self.target[property].extend({ linked: {} });
                }
            }

            self.areAllParametersSet = ko.computed(function () {
                var isSet = true;
                var hasParameters = false;
                for (var property in self.target) {
                    if (ko.isObservable(self.target[property]) === true) {
                        hasParameters = true;
                        var value = ko.unwrap(self.target[property]());
                        if (typeof value === "undefined" || value === null) {
                            isSet = false;
                            break;
                        }
                    }
                }
                if (hasParameters === false) {
                    return true;
                }
                return isSet;
            });
        };
    })
});
Bifrost.namespace("Bifrost.read", {
    ReadModel: Bifrost.Type.extend(function () {
        var self = this;
        var actualReadModel = this;


        this.copyTo = function (target) {
            for (var property in actualReadModel) {
                if (actualReadModel.hasOwnProperty(property) && property.indexOf("_") !== 0) {
                    var value = ko.utils.unwrapObservable(actualReadModel[property]);
                    if (!target.hasOwnProperty(property)) {
                        target[property] = ko.observable(value);
                    } else {
                        if (ko.isObservable(target[property])) {
                            target[property](value);
                        } else {
                            target[property] = value;
                        }
                    }
                }
            }
        };

        this.onCreated = function (lastDescendant) {
            actualReadModel = lastDescendant;
        };
    })
});
Bifrost.namespace("Bifrost.read", {
    ReadModelOf: Bifrost.Type.extend(function (region, mapper, taskFactory, readModelSystemEvents) {
        var self = this;
        this.target = null;

        this._name = "";
        this._generatedFrom = "";
        this._readModelType = Bifrost.Type.extend(function () { });
        this.instance = ko.observable();
        this.commandToPopulate = null;
        this.region = region;

        function unwrapPropertyFilters(propertyFilters) {
            var unwrappedPropertyFilters = {};
            for (var property in propertyFilters) {
                unwrappedPropertyFilters[property] = ko.utils.unwrapObservable(propertyFilters[property]);
            }
            return unwrappedPropertyFilters;
        }

        function performLoad(target, propertyFilters) {
            var task = taskFactory.createReadModel(target, propertyFilters);
            target.region.tasks.execute(task).continueWith(function (data) {
                if (!Bifrost.isNullOrUndefined(data)) {
                    var mappedReadModel = mapper.map(target._readModelType, data);
                    self.instance(mappedReadModel);
                } else {
                    readModelSystemEvents.noInstance.trigger(target);
                }
            });
        }

        this.instanceMatching = function (propertyFilters) {
            function load() {
                var unwrappedPropertyFilters = unwrapPropertyFilters(propertyFilters);
                performLoad(self.target, unwrappedPropertyFilters);
            }

            load();

            for (var property in propertyFilters) {
                var value = propertyFilters[property];
                if (ko.isObservable(value)) {
                    value.subscribe(load);
                }
            }
        };

        this.populateCommandOnChanges = function (command) {
            command.populatedExternally();

            if (typeof self.instance() !== "undefined" && self.instance() != null) {
                command.populateFromExternalSource(self.instance());
            }

            self.instance.subscribe(function (newValue) {
                command.populateFromExternalSource(newValue);
            });
        };

        this.onCreated = function (lastDescendant) {
            self.target = lastDescendant;
            var readModelInstance = lastDescendant._readModelType.create();
            self.instance(readModelInstance);
        };
    })
});
Bifrost.namespace("Bifrost.read", {
    ReadModelTask: Bifrost.tasks.LoadTask.extend(function (readModelOf, propertyFilters, taskFactory) {
        var url = "/Bifrost/ReadModel/InstanceMatching?_rm=" + readModelOf._generatedFrom;
        var payload = {
            descriptor: {
                readModel: readModelOf._name,
                generatedFrom: readModelOf._generatedFrom,
                propertyFilters: propertyFilters
            }
        };

        this.readModel = readModelOf._generatedFrom;

        var innerTask = taskFactory.createHttpPost(url, payload);

        this.execute = function () {
            var promise = innerTask.execute();
            return promise;
        };
    })
});
Bifrost.dependencyResolvers.readModelOf = {
    canResolve: function (namespace, name) {
        if (typeof read !== "undefined") {
            return name in read;
        }
        return false;
    },

    resolve: function (namespace, name) {
        return read[name].create();
    }
};
Bifrost.dependencyResolvers.query = {
    canResolve: function (namespace, name) {
        if (typeof read !== "undefined") {
            return name in read;
        }
        return false;
    },

    resolve: function (namespace, name) {
        return read[name].create();
    }
};
Bifrost.namespace("Bifrost.read", {
    QueryTask: Bifrost.tasks.LoadTask.extend(function (query, paging, taskFactory) {
        var url = "/Bifrost/Query/Execute?_q=" + query._generatedFrom;
        var payload = {
            descriptor: {
                nameOfQuery: query._name,
                generatedFrom: query._generatedFrom,
                parameters: query.getParameterValues()
            },
            paging: {
                size: paging.size,
                number: paging.number
            }
        };

        this.query = query._name;
        this.paging = payload.paging;

        var innerTask = taskFactory.createHttpPost(url, payload);

        this.execute = function () {
            var promise = innerTask.execute();
            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.read", {
    queryService: Bifrost.Singleton(function (mapper, taskFactory) {
        var self = this;

        this.execute = function (query, paging) {
            var promise = Bifrost.execution.Promise.create();
            var region = query.region;

            var task = taskFactory.createQuery(query, paging);
            region.tasks.execute(task).continueWith(function (result) {
                if (typeof result === "undefined" || result == null) {
                    result = {};
                }
                if (typeof result.items === "undefined" || result.items == null) {
                    result.items = [];
                }
                if (typeof result.totalItems === "undefined" || result.totalItems == null) {
                    result.totalItems = 0;
                }

                if (query.hasReadModel()) {
                    result.items = mapper.map(query._readModel, result.items);
                }
                promise.signal(result);
            });

            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.sagas");
Bifrost.sagas.Saga = (function () {
    function Saga() {
        var self = this;

        this.executeCommands = function (commands, options) {

            var canExecuteSaga = true;

            commands.forEach(function (command) {
                if (command.onBeforeExecute() === false) {
                    canExecuteSaga = false;
                    return false;
                }
            });

            if (canExecuteSaga === false) {
                return;
            }
            Bifrost.commands.commandCoordinator.handleForSaga(self, commands, options);
        };
    }

    return {
        create: function (configuration) {
            var saga = new Saga();
            Bifrost.extend(saga, configuration);
            return saga;
        }
    };
})();

Bifrost.namespace("Bifrost.sagas");
Bifrost.sagas.sagaNarrator = (function () {
    var baseUrl = "/Bifrost/SagaNarrator";
    // Todo : abstract away into general Service code - look at CommandCoordinator.js for the other copy of this!s
    function post(url, data, completeHandler) {
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: data,
            contentType: 'application/json; charset=utf-8',
            complete: completeHandler
        });
    }

    function isRequestSuccess(jqXHR, commandResult) {
        if (jqXHR.status === 200) {
            if (commandResult.success === true) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    return {
        conclude: function (saga, success, error) {
            var methodParameters = {
                sagaId: saga.Id
            };
            post(baseUrl + "/Conclude", JSON.stringify(methodParameters), function (jqXHR) {
                var commandResult = Bifrost.commands.CommandResult.createFrom(jqXHR.responseText);
                var isSuccess = isRequestSuccess(jqXHR, commandResult);
                if (isSuccess === true && typeof success === "function") {
                    success(saga);
                }
                if (isSuccess === false && typeof error === "function") {
                    error(saga);
                }
            });
        }
    };
})();

Bifrost.namespace("Bifrost.messaging", {
    Messenger: Bifrost.Type.extend(function () {
        var subscribers = [];

        this.publish = function (topic, message) {
            if (subscribers.hasOwnProperty(topic)) {
                subscribers[topic].subscribers.forEach(function (item) {
                    item(message);
                });
            }
        };

        this.subscribeTo = function (topic, subscriber) {
            var subscribersByTopic;

            if (subscribers.hasOwnProperty(topic)) {
                subscribersByTopic = subscribers[topic];
            } else {
                subscribersByTopic = { subscribers: [] };
                subscribers[topic] = subscribersByTopic;
            }

            subscribersByTopic.subscribers.push(subscriber);
        };

        return {
            publish: this.publish,
            subscribeTo: this.subscribeTo
        };
    })
});
Bifrost.messaging.Messenger.global = Bifrost.messaging.Messenger.create();
Bifrost.WellKnownTypesDependencyResolver.types.globalMessenger = Bifrost.messaging.Messenger.global;

Bifrost.namespace("Bifrost.messaging", {
    messengerFactory: Bifrost.Singleton(function () {
        this.create = function () {
            var messenger = Bifrost.messaging.Messenger.create();
            return messenger;
        };

        this.global = function () {
            return Bifrost.messaging.Messenger.global;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.messengerFactory = Bifrost.messaging.messengerFactory;
if (typeof ko !== 'undefined') {
    ko.observableMessage = function (message, defaultValue) {
        var observable = ko.observable(defaultValue);

        var internal = false;
        observable.subscribe(function (newValue) {
            if (internal === true) {
                return;
            }
            Bifrost.messaging.Messenger.global.publish(message, newValue);
        });

        Bifrost.messaging.Messenger.global.subscribeTo(message, function (value) {
            internal = true;
            observable(value);
            internal = false;
        });
        return observable;
    };
}
Bifrost.namespace("Bifrost.services", {
    Service: Bifrost.Type.extend(function () {
        var self = this;

        this.url = "";
        this.name = "";

        function prepareArguments(args) {
            var prepared = {};

            for (var property in args) {
                prepared[property] = JSON.stringify(args[property]);
            }

            var stringified = JSON.stringify(prepared);
            return stringified;
        }

        function call(method, args, callback) {
            $.ajax({
                url: self.url + "/" + method,
                type: 'POST',
                dataType: 'json',
                data: prepareArguments(args),
                contentType: 'application/json; charset=utf-8',
                complete: function (result) {
                    var v = $.parseJSON(result.responseText);
                    callback(v);
                }
            });
        }


        this.callWithoutReturnValue = function (method, args) {
            var promise = Bifrost.execution.Promise.create();
            call(method, args, function (v) {
                promise.signal();
            });
            return promise;
        };

        this.callWithObjectAsReturn = function (method, args) {
            var value = ko.observable();
            call(method, args, function (v) {
                value(v);
            });
            return value;
        };

        this.callWithArrayAsReturn = function (method, args) {
            var value = ko.observableArray();
            call(method, args, function (v) {
                value(v);
            });
            return value;
        };

        this.onCreated = function (lastDescendant) {
            self.url = lastDescendant.url;
            if (self.url.indexOf("/") !== 0) {
                self.url = "/" + self.url;
            }

            self.name = lastDescendant.name;
        };
    })
});
Bifrost.dependencyResolvers.service = {
    canResolve: function (namespace, name) {
        if (typeof services !== "undefined") {
            return name in services;
        }
        return false;
    },

    resolve: function (namespace, name) {
        return services[name].create();
    }
};
Bifrost.namespace("Bifrost", {
    documentService: Bifrost.Singleton(function (DOMRoot) {
        var self = this;

        this.DOMRoot = DOMRoot;

        this.pageHasViewModel = function (viewModel) {
            var context = ko.contextFor($("body")[0]);
            if (Bifrost.isUndefined(context)) {
                return false;
            }
            return context.$data === viewModel;
        };

        this.getViewModelNameFor = function (element) {
            var dataViewModelName = element.attributes.getNamedItem("data-viewmodel-name");
            if (Bifrost.isNullOrUndefined(dataViewModelName)) {
                dataViewModelName = document.createAttribute("data-viewmodel-name");
                dataViewModelName.value = Bifrost.Guid.create();
            }
            element.attributes.setNamedItem(dataViewModelName);
            return dataViewModelName.value;
        };

        this.setViewModelParametersOn = function (element, parameters) {
            element.viewModelParameters = parameters;
        };

        this.getViewModelParametersFrom = function (element) {
            return element.viewModelParameters;
        };

        this.hasViewModelParameters = function (element) {
            return !Bifrost.isNullOrUndefined(element.viewModelParameters);
        };

        this.cleanChildrenOf = function (element) {
            self.traverseObjects(function (child) {
                if (child !== element) {
                    $(child).unbind();
                    ko.cleanNode(child);
                }
            }, element);
        };

        this.hasViewFile = function (element) {
            var attribute = element.attributes["data-view-file"];
            return !Bifrost.isNullOrUndefined(attribute);
        };

        this.getViewFileFrom = function (element) {
            if (self.hasViewFile(element)) {
                var attribute = element.attributes["data-view-file"];
                return attribute.value;
            }
            return null;
        };


        this.hasOwnRegion = function (element) {
            /// <summary>Check if element has its own region</summary>
            /// <param name="element" type="HTMLElement">HTML Element to check</param>
            /// <returns>true if it has its own region, false it not</returns>

            if (element.region) {
                return true;
            }
            return false;
        };

        this.getParentRegionFor = function (element) {
            /// <summary>Get the parent region for a given element</summary>
            /// <param name="element" type="HTMLElement">HTML Element to get for</param>
            /// <returns>An instance of the region, if no region is found it will return null</returns>
            var found = null;

            while (element.parentNode) {
                element = element.parentNode;
                if (element.region) {
                    return element.region;
                }
            }

            return found;
        };

        this.getRegionFor = function (element) {
            /// <summary>Get region for an element, either directly or implicitly through the nearest parent, null if none</summary>
            /// <param name="element" type="HTMLElement">HTML Element to get for</param>
            /// <returns>An instance of the region, if no region is found it will return null</returns>
            var found = null;

            if (element.region) {
                return element.region;
            }
            found = self.getParentRegionFor(element);
            return found;
        };

        this.setRegionOn = function (element, region) {
            /// <summary>Set region on a specific element</summary>
            /// <param name="element" type="HTMLElement">HTML Element to set on</param>
            /// <param name="region" type="Bifrost.views.Region">Region to set on element</param>

            element.region = region;
        };

        this.clearRegionOn = function (element) {
            /// <summary>Clear region on a specific element</summary>
            /// <param name="element" type="HTMLElement">HTML Element to set on</param>
            element.region = null;
        };

        this.traverseObjects = function(callback, element) {
            /// <summary>Traverse objects and call back for each element</summary>
            /// <param name="callback" type="Function">Callback to call for each element found</param>
            /// <param name="element" type="HTMLElement" optional="true">Optional root element</param>
            element = element || self.DOMRoot;
            if (!Bifrost.isNullOrUndefined(element)) {
                callback(element);

                if( element.hasChildNodes() ) {
                    var child = element.firstChild;
                    while (child) {
                        var nextSibling = child.nextSibling;
                        if( child.nodeType === 1 ) {
                            self.traverseObjects(callback, child);
                        }
                        child = nextSibling;
                    }
                }
            }
        };

        this.getUniqueStyleName = function(prefix) {
            var id = Bifrost.Guid.create();
            var name = prefix+"_"+id;
            return name;
        };

        this.addStyle = function(selector, style) {
            /// <summary>Add a style dynamically into the browser</summary>
            /// <param name="selector" type="String">Selector that represents the class</param>
            /// <param name="style" type="Object">Key/value pair object for styles</param>
            if(!document.styleSheets) {
                return;
            }
            var i;
            var styleString = "";
            for( var property in style ) {
                styleString = styleString + property +":" + style[property]+";";
            }
            style = styleString;

            if(document.getElementsByTagName("head").length === 0) {
                return;
            }

            var styleSheet;
            var media;
            var mediaType;
            if(document.styleSheets.length > 0) {
                for( i = 0; i < document.styleSheets.length; i++) {
                    if(document.styleSheets[i].disabled) {
                        continue;
                    }
                    media = document.styleSheets[i].media;
                    mediaType = typeof media;

                    if(mediaType === "string") {
                        if(media === "" || (media.indexOf("screen") !== -1)) {
                            styleSheet = document.styleSheets[i];
                        }
                    } else if(mediaType === "object") {
                        if(media.mediaText === "" || (media.mediaText.indexOf("screen") !== -1)) {
                            styleSheet = document.styleSheets[i];
                        }
                    }

                    if( typeof styleSheet !== "undefined") {
                        break;
                    }
                }
            }

            if( typeof styleSheet === "undefined") {
                var styleSheetElement = document.createElement("style");
                styleSheetElement.type = "text/css";

                document.getElementsByTagName("head")[0].appendChild(styleSheetElement);

                for( i = 0; i < document.styleSheets.length; i++) {
                    if(document.styleSheets[i].disabled) {
                        continue;
                    }
                    styleSheet = document.styleSheets[i];
                }

                media = styleSheet.media;
                mediaType = typeof media;
            }

            if(mediaType === "string") {
                for( i = 0; i < styleSheet.rules.length; i++) {
                    if(styleSheet.rules[i].selectorText && styleSheet.rules[i].selectorText.toLowerCase() === selector.toLowerCase()) {
                        styleSheet.rules[i].style.cssText = style;
                        return;
                    }
                }

                styleSheet.addRule(selector, style);
            } else if(mediaType === "object") {
                for( i = 0; i < styleSheet.cssRules.length; i++) {
                    if(styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() === selector.toLowerCase()) {
                        styleSheet.cssRules[i].style.cssText = style;
                        return;
                    }
                }

                styleSheet.insertRule(selector + "{" + style + "}", 0);
            }
        };
    })
});
Bifrost.namespace("Bifrost.markup", {
    BindingContext: Bifrost.Type.extend(function () {
        this.parent = null;
        this.current = null;

        this.changed = Bifrost.Event.create();
    })
});
Bifrost.namespace("Bifrost.markup", {
    bindingContextManager: Bifrost.Singleton(function () {

        this.ensure = function (element) {
            // If there is specific bindingContext for element, return it

            // If no specific, find nearest from parent element

            // If no parent element has one either, there is none - return null

            // If element has an attribute of bindingContext - we can now change it to what it is pointing at

            // If bindingContext changes due to a binding being related to the context from the attribute on the element, it should fire the changed thing on the binding context

            // Inherit from parent - always - parent is prototype of current, point back to parent
        };

        this.hasFor = function (element) {

        };

        this.getFor = function (element) {

        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.bindingContextManager = Bifrost.markup.bindingContextManager;
Bifrost.namespace("Bifrost.markup", {
    attributeValues: Bifrost.Singleton(function (valueProviderParser) {
        this.expandFor = function (element) {

        };
    })
});
Bifrost.namespace("Bifrost.markup", {
    valueProviderParser: Bifrost.Singleton(function (valueProviders, valueConsumers, typeConverters) {
        var self = this;
        var regex = new RegExp("{{([a-z ,:{{}}}]*)}}", "g");

        function handleValue(instance, property, value) {
            var consumer = valueConsumers.getFor(instance, property);

            if (self.hasValueProvider(value)) {
                var providers = self.parseFor(instance, property, value);
                providers.forEach(function (provider) {
                    provider.provide(consumer);
                });
            } else {
                consumer.consume(value);
            }
        }


        this.hasValueProvider = function (value) {
            var result = value.match(regex);
            if (result) {
                return true;
            }

            return false;
        };

        this.parseFor = function (instance, name, value) {
            var providers = [];
            var result = value.match(regex);
            var expression = result[0].substr(2, result[0].length - 4);

            var rx = new RegExp("([a-z]*) +", "g");
            result = expression.match(rx);
            if (result.length === 1) {
                var valueProviderName = result[0].trim();

                if (valueProviders.isKnown(valueProviderName)) {
                    var provider = valueProviders.getInstanceOf(valueProviderName);
                    providers.push(provider);

                    if (expression.length > result[0].length) {
                        var configurationString = expression.substr(result[0].length);
                        var elements = configurationString.split(",");

                        elements.forEach(function (element) {
                            element = element.trim();

                            var keyValuePair = element.split(":");
                            if (keyValuePair.length === 0) {
                                // something is wrong
                            }
                            if (keyValuePair.length === 1) {
                                // Value only

                                // Only valid if value provider has default property and that property exist

                                var value = keyValuePair[0];
                                handleValue(provider, provider.defaultProperty, value);

                            } else if (keyValuePair.length === 2) {
                                // Property and value

                                // Invalid if property does not exist

                                handleValue(provider, keyValuePair[0], keyValuePair[1]);
                            } else {
                                // something is wrong - there are too many
                            }
                        });
                    }
                }
            }
            return providers;
        };
    })
});
Bifrost.namespace("Bifrost.markup", {
    ElementVisitor: Bifrost.Type.extend(function() {
        this.visit = function (element, resultActions) {

        };
    })
});
Bifrost.namespace("Bifrost.markup", {
    ElementVisitorResultActions: Bifrost.Type.extend(function() {

    })
});
Bifrost.namespace("Bifrost.markup", {
    objectModelFactory: Bifrost.Singleton(function (dependencyResolver, documentService) {

        function tryResolveTargetNamespaces(localName, targets, success, error) {
            function tryResolve(queue) {
                if (queue.length) {
                    var namespace = Bifrost.namespace(targets.shift());

                    var found = false;
                    namespace._scripts.forEach(function (script) {
                        if (script.toLowerCase() === localName.toLowerCase()) {
                            dependencyResolver.beginResolve(namespace, script)
                                .continueWith(function (instance) {
                                    success(instance);
                                })
                                .onFail(function () {
                                    tryResolveTargetNamespaces(localName, targets, success, error);
                                });
                            found = true;
                        }
                    });

                    if (!found) {
                        tryResolveTargetNamespaces(localName, targets, success, error);
                    }

                } else {
                    error();
                }

            }

            tryResolve(targets);
        }


        this.createFrom = function (element, localName, namespaceDefinition, success, error) {
            tryResolveTargetNamespaces(localName, namespaceDefinition.targets, success, error);
        };
    })
});
Bifrost.namespace("Bifrost.markup", {
    MultipleNamespacesInNameNotAllowed: Bifrost.Type.extend(function (tagName) {
        //"Syntax error: tagname '" + name + "' has multiple namespaces";
    })
});
Bifrost.namespace("Bifrost.markup", {
    MultiplePropertyReferencesNotAllowed: Bifrost.Type.extend(function(tagName) {
        // "Syntax error: tagname '"+name+"' has multiple properties its referring to";
    })
}); 
Bifrost.namespace("Bifrost.markup", {
    ParentTagNameMismatched: Bifrost.Type.extend(function (tagName, parentTagName) {
        // "Setting property using tag '"+name+"' does not match parent tag of '"+parentName+"'";
    })
});
Bifrost.namespace("Bifrost.markup", {
    NamespaceDefinition: Bifrost.Type.extend(function (prefix) {
        var self = this;
        this.prefix = prefix;

        this.targets = [];

        this.addTarget = function (target) {
            self.targets.push(target);
        };
    })
});
Bifrost.namespace("Bifrost.markup", {
    namespaceDefinitions: Bifrost.Singleton(function () {

        this.create = function (prefix) {
            var definition = Bifrost.markup.NamespaceDefinition.create({
                prefix: prefix,
            });
            return definition;
        };
    })
});
Bifrost.namespace("Bifrost.markup", {
    namespaces: Bifrost.Singleton(function (namespaceDefinitions, elementNaming) {
        var self = this;
        var ns = "ns:";

        this.global = namespaceDefinitions.create("__global");

        function findNamespaceDefinitionInElementOrParent(prefix, element) {
            if (!Bifrost.isNullOrUndefined(element.__namespaces)) {
                var found = null;
                element.__namespaces.forEach(function (definition) {
                    if (definition.prefix === prefix) {
                        found = definition;
                        return false;
                    }
                });

                if (found != null) {
                    return found;
                }
            }
            if (Bifrost.isNullOrUndefined(element.parentElement) ||
                element.parentElement.constructor === HTMLHtmlElement) {

                return null;
            }

            var parentResult = findNamespaceDefinitionInElementOrParent(prefix, element.parentElement);
            if (parentResult != null) {
                return parentResult;
            }

            return null;
        }


        this.expandNamespaceDefinitions = function (element) {
            for (var attributeIndex = 0; attributeIndex < element.attributes.length; attributeIndex++) {
                var attribute = element.attributes[attributeIndex];
                if( attribute.name.indexOf(ns) === 0) {
                    var prefix = attribute.name.substr(ns.length);
                    var target = attribute.value;

                    var namespaceDefinition = findNamespaceDefinitionInElementOrParent(prefix, element);
                    if (Bifrost.isNullOrUndefined(namespaceDefinition)) {
                        if (Bifrost.isNullOrUndefined(element.__namespaces)) {
                            element.__namespaces = [];
                        }
                        namespaceDefinition = namespaceDefinitions.create(prefix);
                        element.__namespaces.push(namespaceDefinition);
                    }

                    namespaceDefinition.addTarget(target);
                }
            }
        };

        this.resolveFor = function (element) {
            var prefix = elementNaming.getNamespacePrefixFor(element);
            if (Bifrost.isNullOrUndefined(prefix) || prefix === "") {
                return self.global;
            }
            var definition = findNamespaceDefinitionInElementOrParent(prefix, element);
            return definition;
        };
    })
});
Bifrost.namespace("Bifrost.markup", {
    elementNaming: Bifrost.Singleton(function () {

        function getNameAndNamespace(element) {
            var namespace;
            var name = element.localName.toLowerCase();

            var namespaceSplit = name.split(":");
            if (namespaceSplit.length > 2) {
                throw Bifrost.markup.MultipleNamespacesInNameNotAllowed.create({ tagName: name });
            }
            if (namespaceSplit.length === 2) {
                name = namespaceSplit[1];
                namespace = namespaceSplit[0];
            }

            return {
                name: name,
                namespace: namespace
            };
        }


        this.getNamespacePrefixFor = function (element) {
            var nameAndNamespace = getNameAndNamespace(element);
            if (Bifrost.isNullOrUndefined(nameAndNamespace.namespace)) {
                return "";
            }
            return nameAndNamespace.namespace;
        };

        this.getLocalNameFor = function (element) {
            var nameAndNamespace = getNameAndNamespace(element);
            return nameAndNamespace.name;
        };
    })
});
Bifrost.namespace("Bifrost.markup", {
    propertyExpander: Bifrost.Singleton(function (valueProviderParser) {
        this.expand = function (element, target) {
            for (var attributeIndex = 0; attributeIndex < element.attributes.length; attributeIndex++) {
                var name = element.attributes[attributeIndex].localName;
                var value = element.attributes[attributeIndex].value;

                if (name in target) {
                    if (valueProviderParser.hasValueProvider(value)) {
                        valueProviderParser.parseFor(target, name, value);
                    }
                }
            }
        };
    })
});
Bifrost.namespace("Bifrost.markup", {
    ObjectModelElementVisitor: Bifrost.markup.ElementVisitor.extend(function (elementNaming, namespaces, objectModelFactory, propertyExpander, UIElementPreparer, attributeValues, bindingContextManager) {
        this.visit = function(element, actions) {
            // Tags :
            //  - tag names automatically match type names
            //  - due to tag names in HTML elements being without case - they become lower case in the
            //    localname property, we will have to search for type by lowercase
            //  - multiple types found with different casing in same namespace should throw an exception
            // Namespaces :
            //  - split by ':'
            //  - if more than one ':' - throw an exception
            //  - if no namespace is defined, try to resolve in the global namespace
            //  - namespaces in the object model can point to multiple JavaScript namespaces
            //  - multiple types with same name in namespace groupings should throw an exception
            //  - registering a namespace can be done on any tag by adding ns:name="point to JS namespace"
            //  - Wildcard registrations to capture anything in a namespace e.g. ns:controls="Web.Controls.*"
            //  - If one registers a namespace with a prefix a parent already has and no naming root sits in between,
            //    it should add the namespace target on the same definition
            //  - Naming roots are important - if there occurs a naming root, everything is relative to that and
            //    breaking any "inheritance"
            // Properties :
            //  - Attributes on an element is a property
            //  - Values in property should always go through type conversion sub system
            //  - Values with encapsulated in {} should be considered markup extensions, go through
            //    markup extension system for resolving them and then pass on the resulting value
            //    to type conversion sub system
            //  - Properties can be set with tag suffixed with .<name of property> - more than one
            //    '.' in a tag name should throw an exception
            // Value Provider :
            //  - Any value escaped with {{ }} should be considered a value provider
            // Value Consumer :
            //  - In the opposite end of a value sits a consumer. If the target property is a consumer, pass this
            //    in to the value provider. If the property is just a regular property, use the default property
            //    value consumer
            // Dependency Properties
            //  - A property type that has the ability of notifying something when it changes
            //    Typically a property gets registered with the ability to offer a callback
            //    Dependency properties needs to be explicitly setup
            //  - Attached dependency properties - one should be able to attach dependency properties
            //    Adding new functionality to an existing element through exposing new properties on
            //    existing elements. It does not matter what elements, it could be existing ones.
            //    The attached dependency property defines what it is for by specifying a type. Once
            //    we're matching a particular dependency property in the markup with the type it supports
            //    its all good
            // Services
            //  - Nodes should have the ability to specify a service that is relevant for the node.
            //    The service will be called with the element itself. It is defined as an attribute on
            //    a node, any values in the attribute will be handed in, obviously resolved through
            //    the value provider system.
            // Child tags :
            //  - Children which are not a property reference are only allowed if a content or
            //    items property exist. There can only be one of the other, two of either or both
            //    at the same time should yield an exception
            // Templating :
            //  - If a UIElement is found, it will need to be instantiated
            //  - If the instance is of a Control type - we will look at the
            //    ControlTemplate property for its template and use that to replace content
            //
            // Example :
            // Simple control:
            // <somecontrol property="42"/>
            //
            // Control in different namespace:
            // <ns:somecontrol property="42"/>
            //
            // Assigning property with tags:
            // <ns:somecontrol>
            //    <ns:somecontrol.property>42</ns:somcontrol.property>
            // </ns:somecontrol>
            //
            // Using a markup extension:
            // <ns:somecontrol somevalue="{{binding property}}">
            // <ns:somecontrol
            //
            // <span>{{binding property}}</span>
            //
            // <ns:somecontrol>
            //    <ns:somecontrol.property>{{binding property}}</ns:somcontrol.property>
            // </ns:somecontrol>

            namespaces.expandNamespaceDefinitions(element);
            bindingContextManager.ensure(element);

            if (element.isKnownType()) {
                attributeValues.expandFor(element);
                return;
            }

            var localName = elementNaming.getLocalNameFor(element);
            var namespaceDefinition = namespaces.resolveFor(element);
            objectModelFactory.createFrom(element, localName, namespaceDefinition,
                function (instance) {
                    propertyExpander.expand(element, instance);
                    UIElementPreparer.prepare(element, instance);
                },
                function () {
                }
            );

        };
    })
});
Bifrost.namespace("Bifrost.markup", {
    NamingRoot: Bifrost.Type.extend(function() {
        var self = this;
        this.target = null;

        this.find = function (name, element) {
            if (Bifrost.isNullOrUndefined(element)) {
                if (Bifrost.isNullOrUndefined(self.target)) {
                    return null;
                }
                element = self.target;
            }


            if (element.getAttribute("name") === name) {
                return element;
            }

            if (element.hasChildNodes()) {
                var child = element.firstChild;
                while (child) {
                    if (child.nodeType === 1) {
                        var foundElement = self.find(name, child);
                        if (foundElement != null) {
                            return foundElement;
                        }
                    }
                    child = child.nextSibling;
                }
            }

            return null;
        };
    })
});
Bifrost.namespace("Bifrost.markup", {
    UIElement: Bifrost.markup.NamingRoot.extend(function () {

        this.prepare = function (type, element) {

        };
    })
});
Bifrost.namespace("Bifrost.markup", {
    UIElementPreparer: Bifrost.Singleton(function () {
        this.prepare = function (element, instance) {
            var result = instance.prepare(instance._type, element);
            if (result instanceof Bifrost.execution.Promise) {
                result.continueWith(function () {

                    if (!Bifrost.isNullOrUndefined(instance.template)) {
                        var UIManager = Bifrost.views.UIManager.create();

                        UIManager.handle(instance.template);

                        ko.applyBindingsToNode(instance.template, {
                            "with": instance
                        });

                        element.parentElement.replaceChild(instance.template, element);
                    }
                });
            }
        };
    })
});
Bifrost.namespace("Bifrost.markup", {
    Control: Bifrost.markup.UIElement.extend(function () {
        var self = this;
        this.template = null;

        this.prepare = function (type, element) {
            var promise = Bifrost.execution.Promise.create();

            var file = type._namespace._path + type._name + ".html";
            require(["text!" + file + "!strip"], function (v) {
                var container = document.createElement("div");
                container.innerHTML = v;
                self.template = container;

                promise.signal();
            });

            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.views", {
    PostBindingVisitor: Bifrost.Type.extend(function() {
        this.visit = function (element) {

        };
    })
});
Bifrost.namespace("Bifrost.views", {
    UIManager: Bifrost.Singleton(function(documentService) {
        var elementVisitorTypes = Bifrost.markup.ElementVisitor.getExtenders();
        var elementVisitors = [];
        var postBindingVisitorTypes = Bifrost.views.PostBindingVisitor.getExtenders();
        var postBindingVisitors = [];

        elementVisitorTypes.forEach(function (type) {
            elementVisitors.push(type.create());
        });

        postBindingVisitorTypes.forEach(function (type) {
            postBindingVisitors.push(type.create());
        });

        this.handle = function (root) {
            documentService.traverseObjects(function(element) {
                elementVisitors.forEach(function(visitor) {
                    var actions = Bifrost.markup.ElementVisitorResultActions.create();
                    visitor.visit(element, actions);
                });
            }, root);
        };

        this.handlePostBinding = function (root) {
            documentService.traverseObjects(function (element) {
                postBindingVisitors.forEach(function (visitor) {
                    visitor.visit(element);
                });
            }, root);
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.UIManager = Bifrost.views.UIManager;
Bifrost.namespace("Bifrost.views", {
    Content: Bifrost.Type.extend(function () {

    })
});
Bifrost.namespace("Bifrost.views", {
    Items: Bifrost.Type.extend(function () {

    })
});
Bifrost.namespace("Bifrost.views", {
    ComposeTask: Bifrost.tasks.Task.extend(function () {
        /// <summary>Represents a base task that represents anything that is executing</summary>
        this.execute = function () {
        };
    })
});
Bifrost.namespace("Bifrost.views", {
    viewManager: Bifrost.Singleton(function (viewFactory, pathResolvers, regionManager, UIManager, viewModelManager, viewModelLoader, viewModelTypes, documentService) {
        var self = this;


        function setViewModelForElement(element, viewModel) {
            viewModelManager.masterViewModel.setFor(element, viewModel);

            var viewModelName = documentService.getViewModelNameFor(element);

            var dataBindString = "";
            var dataBind = element.attributes.getNamedItem("data-bind");
            if (!Bifrost.isNullOrUndefined(dataBind)) {
                dataBindString = dataBind.value + ", ";
            } else {
                dataBind = document.createAttribute("data-bind");
            }
            dataBind.value = dataBindString + "viewModel: $root['" + viewModelName + "']";
            element.attributes.setNamedItem(dataBind);
        }

        this.initializeLandingPage = function () {
            var promise = Bifrost.execution.Promise.create();
            var body = document.body;
            if (body !== null) {
                var file = Bifrost.Path.getFilenameWithoutExtension(document.location.toString());
                if (file === "") {
                    file = "index";
                }

                if (pathResolvers.canResolve(body, file)) {
                    var actualPath = pathResolvers.resolve(body, file);
                    var view = viewFactory.createFrom(actualPath);
                    view.element = body;
                    view.content = body.innerHTML;
                    body.view = view;

                    var region = regionManager.getFor(view);
                    regionManager.describe(view, region).continueWith(function () {
                        if (viewModelManager.hasForView(actualPath)) {
                            var viewModelPath = viewModelManager.getViewModelPathForView(actualPath);
                            if (!viewModelManager.isLoaded(viewModelPath)) {
                                viewModelLoader.load(viewModelPath, region).continueWith(function (viewModel) {
                                    if (!Bifrost.isNullOrUndefined(viewModel)) {
                                        setViewModelForElement(body, viewModel);
                                    }
                                });
                            } else {
                                viewModelTypes.beginCreateInstanceOfViewModel(viewModelPath, region).continueWith(function (viewModel) {
                                    if (!Bifrost.isNullOrUndefined(viewModel)) {
                                        setViewModelForElement(body, viewModel);
                                    }
                                });
                            }
                        }

                        UIManager.handle(body);
                        promise.signal();
                    });
                }
            }
            return promise;
        };

        this.attach = function (element) {
            UIManager.handle(element);
            viewModelManager.masterViewModel.applyTo(element);
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.viewManager = Bifrost.views.viewManager;
Bifrost.namespace("Bifrost.views", {
    PathResolver: Bifrost.Type.extend(function () {
        this.canResolve = function (element, path) {
            return false;
        };

        this.resolve = function (element, path) {

        };
    })
});
Bifrost.namespace("Bifrost.views", {
    pathResolvers: Bifrost.Singleton(function () {

        function getResolvers() {
            var resolvers = [];
            for (var property in Bifrost.views.pathResolvers) {
                if (Bifrost.views.pathResolvers.hasOwnProperty(property)) {
                    var value = Bifrost.views.pathResolvers[property];
                    if( typeof value === "function" &&
                        typeof value.create === "function") {

                        var resolver = value.create();
                        if (typeof resolver.canResolve === "function") {
                            resolvers.push(resolver);
                        }
                    }
                }
            }
            return resolvers;
        }


        this.canResolve = function (element, path) {
            var resolvers = getResolvers();
            for (var resolverIndex = 0; resolverIndex < resolvers.length; resolverIndex++) {
                var resolver = resolvers[resolverIndex];
                var result = resolver.canResolve(element, path);
                if (result === true) {
                    return true;
                }
            }
            return false;
        };

        this.resolve = function (element, path) {
            var resolvers = getResolvers();
            for (var resolverIndex = 0; resolverIndex < resolvers.length; resolverIndex++) {
                var resolver = resolvers[resolverIndex];
                if (resolver.canResolve(element, path)) {
                    return resolver.resolve(element, path);
                }
            }
            return null;
        };
    })
});
Bifrost.namespace("Bifrost.views", {
    UriMapperPathResolver: Bifrost.views.PathResolver.extend(function () {
        this.canResolve = function (element, path) {
            var closest = $(element).closest("[data-urimapper]");
            if (closest.length === 1) {
                var mapperName = $(closest[0]).data("urimapper");
                if (Bifrost.uriMappers[mapperName].hasMappingFor(path) === true) {
                    return true;
                }
            }
            return Bifrost.uriMappers.default.hasMappingFor(path);
        };

        this.resolve = function (element, path) {
            var closest = $(element).closest("[data-urimapper]");
            if (closest.length === 1) {
                var mapperName = $(closest[0]).data("urimapper");
                if (Bifrost.uriMappers[mapperName].hasMappingFor(path) === true) {
                    return Bifrost.uriMappers[mapperName].resolve(path);
                }
            }
            return Bifrost.uriMappers.default.resolve(path);
        };
    })
});
if (typeof Bifrost.views.pathResolvers !== "undefined") {
    Bifrost.views.pathResolvers.UriMapperPathResolver = Bifrost.views.UriMapperPathResolver;
}
Bifrost.namespace("Bifrost.views", {
    RelativePathResolver: Bifrost.views.PathResolver.extend(function () {
        this.canResolve = function (element, path) {
            var closest = $(element).closest("[data-view]");
            if (closest.length === 1) {
                var view = $(closest[0]).view;

            }
            return false;
        };

        this.resolve = function (element, path) {
            var closest = $(element).closest("[data-urimapper]");
            if (closest.length === 1) {
                var mapperName = $(closest[0]).data("urimapper");
                if (Bifrost.uriMappers[mapperName].hasMappingFor(path) === true) {
                    return Bifrost.uriMappers[mapperName].resolve(path);
                }
            }
            return Bifrost.uriMappers.default.resolve(path);
        };
    })
});
if (typeof Bifrost.views.pathResolvers !== "undefined") {
    Bifrost.views.pathResolvers.RelativePathResolver = Bifrost.views.RelativePathResolver;
}
Bifrost.namespace("Bifrost.views", {
    View: Bifrost.Type.extend(function (viewLoader, viewModelTypes, viewModelManager, path) {
        var self = this;

        this.path = path;
        this.content = "[CONTENT NOT LOADED]";
        this.element = null;
        this.viewModelType = null;
        this.viewModelPath = null;
        this.region = null;

        this.load = function (region) {
            self.region = region;
            var promise = Bifrost.execution.Promise.create();
            self.viewModelPath = viewModelManager.getViewModelPathForView(path);
            viewLoader.load(self.path, region).continueWith(function (html) {
                self.content = html;
                self.viewModelType = viewModelTypes.getViewModelTypeForPath(self.viewModelPath);
                promise.signal(self);
            });

            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.views", {
    viewFactory: Bifrost.Singleton(function () {
        this.createFrom = function (path) {
            var view = Bifrost.views.View.create({
                path: path
            });
            return view;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.viewFactory = Bifrost.views.viewFactory;
Bifrost.namespace("Bifrost.views", {
    ViewLoadTask: Bifrost.views.ComposeTask.extend(function (files, fileManager) {
        /// <summary>Represents a task for loading files asynchronously</summary>

        var self = this;

        this.files = [];
        files.forEach(function (file) {
            self.files.push(file.path.fullPath);
        });

        this.execute = function () {
            var promise = Bifrost.execution.Promise.create();

            fileManager.load(files).continueWith(function (instances) {
                var view = instances[0];
                promise.signal(view);
            });
            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.views", {
    viewLoader: Bifrost.Singleton(function (viewModelManager, taskFactory, fileFactory, regionManager) {
        this.load = function (path,region) {
            var promise = Bifrost.execution.Promise.create();

            var files = [];

            var viewFile = fileFactory.create(path, Bifrost.io.fileType.html);
            if (path.indexOf("?") > 0) {
                viewFile.path.fullPath = viewFile.path.fullPath + path.substr(path.indexOf("?"));
            }
            files.push(viewFile);

            var viewModelPath = null;
            if (viewModelManager.hasForView(path)) {
                viewModelPath = viewModelManager.getViewModelPathForView(path);
                if (!viewModelManager.isLoaded(viewModelPath)) {
                    var viewModelFile = fileFactory.create(viewModelPath, Bifrost.io.fileType.javaScript);
                    files.push(viewModelFile);
                }
            }

            var task = taskFactory.createViewLoad(files);
            region.tasks.execute(task).continueWith(function (view) {
                promise.signal(view);
            });

            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.views", {
    viewBindingHandler: Bifrost.Type.extend(function (ViewBindingHandlerTemplateEngine, UIManager, viewFactory, viewManager, viewModelManager, documentService, regionManager, pathResolvers) {
        function makeTemplateValueAccessor(element, valueAccessor, allBindingsAccessor, bindingContext) {
            return function () {
                var viewUri = ko.utils.unwrapObservable(valueAccessor());

                if (element.viewUri !== viewUri) {
                    element.children.forEach(ko.removeNode);

                    element.viewModel = null;
                    element.view = null;
                    element.templateSource = null;
                    element.innerHTML = "";
                }

                element.viewUri = viewUri;

                var viewModel = ko.observable(element.viewModel);
                var viewModelParameters = allBindingsAccessor().viewModelParameters || {};

                var templateEngine = null;
                var view = null;
                var region = null;

                if (Bifrost.isNullOrUndefined(viewUri) || viewUri === "") {
                    templateEngine = new ko.nativeTemplateEngine();
                } else {
                    templateEngine = ViewBindingHandlerTemplateEngine;
                    var actualPath = pathResolvers.resolve(element, viewUri);
                    view = viewFactory.createFrom(actualPath);
                    view.element = element;
                    region = regionManager.getFor(view);
                }

                return {
                    if: true,
                    data: viewModel,
                    element: element,
                    templateEngine: templateEngine,
                    viewUri: viewUri,
                    viewModelParameters: viewModelParameters,
                    view: view,
                    region: region
                };
            };
        }

        this.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            return ko.bindingHandlers.template.init(element, makeTemplateValueAccessor(element, valueAccessor, allBindingsAccessor, bindingContext), allBindingsAccessor, viewModel, bindingContext);
        };

        this.update = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            return ko.bindingHandlers.template.update(element, makeTemplateValueAccessor(element, valueAccessor, allBindingsAccessor, bindingContext), allBindingsAccessor, viewModel, bindingContext);
        };
    })
});
Bifrost.views.viewBindingHandler.initialize = function () {
    ko.bindingHandlers.view = Bifrost.views.viewBindingHandler.create();
    ko.jsonExpressionRewriting.bindingRewriteValidators.view = false; // Can't rewrite control flow bindings
    ko.virtualElements.allowedBindings.view = true;
};
Bifrost.namespace("Bifrost.views", {
    ViewBindingHandlerTemplateSource: Bifrost.Type.extend(function (viewFactory) {
        var content = "";


        this.loadFor = function (element, view, region) {
            var promise = Bifrost.execution.Promise.create();

            view.load(region).continueWith(function (loadedView) {
                var wrapper = document.createElement("div");
                wrapper.innerHTML = loadedView.content;


                content = wrapper.innerHTML;

                if (Bifrost.isNullOrUndefined(loadedView.viewModelType)) {
                    promise.signal(loadedView);
                } else {
                    Bifrost.views.Region.current = region;
                    view.viewModelType.ensure().continueWith(function () {
                        promise.signal(loadedView);
                    });
                }
            });

            return promise;
        };

        this.data = function (key, value) { };

        this.text = function (value) {
            return content;
        };
    })
});
Bifrost.namespace("Bifrost.views", {
    ViewBindingHandlerTemplateEngine: Bifrost.Type.extend(function (viewModelManager, regionManager, UIManager) {
        var self = this;
        this.renderTemplate = function (template, bindingContext, options) {
            var templateSource;
            if (Bifrost.isNullOrUndefined(options.element.templateSource)) {
                templateSource = Bifrost.views.ViewBindingHandlerTemplateSource.create({
                    viewUri: options.viewUri,
                    region: options.region
                });
                options.element.templateSource = templateSource;
            } else {
                templateSource = options.element.templateSource;
            }

            if (Bifrost.isNullOrUndefined(options.element.view)) {
                templateSource.loadFor(options.element, options.view, options.region).continueWith(function (view) {
                    options.element.view = view;
                    regionManager.describe(options.view, options.region).continueWith(function () {
                        try {
                            // This is a bit dodgy, but can't find any way around it
                            // Put an empty object for dependency detection - we don't want Knockout to be observing any observables on our viewModel
                            ko.dependencyDetection.begin();

                            var instance;

                            if (!Bifrost.isNullOrUndefined(view.viewModelType)) {
                                var viewModelParameters = options.viewModelParameters;
                                viewModelParameters.region = options.region;

                                instance = view.viewModelType.create(viewModelParameters);
                                options.element.viewModel = instance;
                                options.data(instance);

                                bindingContext.$data = instance;
                            } else {
                                instance = {};
                                options.data(instance);
                                bindingContext.$data = instance;
                            }
                        } finally {
                            ko.dependencyDetection.end();
                        }
                    });
                });
            }

            bindingContext.$root = bindingContext.$data;
            var renderedTemplateSource = self.renderTemplateSource(templateSource, bindingContext, options);

            renderedTemplateSource.forEach(function (element) {
                if (element.constructor !== Text && element.constructor !== Comment) {
                    UIManager.handle(element);
                }
            });


            return renderedTemplateSource;
        };
    })
});

(function () {
    var nativeTemplateEngine = new ko.nativeTemplateEngine();
    var baseCreate = Bifrost.views.ViewBindingHandlerTemplateEngine.create;
    Bifrost.views.ViewBindingHandlerTemplateEngine.create = function () {
        var instance = baseCreate.call(Bifrost.views.ViewBindingHandlerTemplateEngine, arguments);

        for (var property in nativeTemplateEngine) {
            if (!instance.hasOwnProperty(property)) {
                instance[property] = nativeTemplateEngine[property];
            }
        }

        return instance;
    };
})();

Bifrost.namespace("Bifrost.views", {
    MasterViewModel: Bifrost.Type.extend(function (documentService) {
        var self = this;

        function deactivateViewModel(viewModel) {
            if (!Bifrost.isNullOrUndefined(viewModel)) {
                if (Bifrost.isFunction(viewModel.deactivated)) {
                    viewModel.deactivated();
                }

            }
        }


        function activateViewModel(viewModel) {
            if (!Bifrost.isNullOrUndefined(viewModel) && Bifrost.isFunction(viewModel.activated)) {
                viewModel.activated();
            }
        }


        this.setFor = function (element, viewModel) {
            var existingViewModel = self.getFor(element);
            if (existingViewModel !== viewModel) {
                deactivateViewModel(existingViewModel);
            }

            var name = documentService.getViewModelNameFor(element);
            self[name] = viewModel;

            activateViewModel(viewModel);
        };

        this.getFor = function (element) {
            var name = documentService.getViewModelNameFor(element);
            if (self.hasOwnProperty(name)) {
                return self[name];
            }
            return null;
        };


        this.clearFor = function (element) {
            var name = documentService.getViewModelNameFor(element);
            if (!self.hasOwnProperty(name)) {
                deactivateViewModel(self[name]);
                delete self[name];
                self[name] = null;
            }
        };

        this.apply = function () {
            ko.applyBindings(self);
        };

        this.applyTo = function (element) {
            ko.applyBindings(self, element);
        };
    })
});
Bifrost.namespace("Bifrost.views", {
    ViewModel: Bifrost.Type.extend(function (region) {
        var self = this;
        this.targetViewModel = this;
        this.region = region;

        this.activated = function () {
            if (typeof self.targetViewModel.onActivated === "function") {
                self.targetViewModel.onActivated();
            }
        };

        this.deactivated = function () {
            if (typeof self.targetViewModel.onDeactivated === "function") {
                self.targetViewModel.onDeactivated();
            }
        };

        this.onCreated = function (lastDescendant) {
            self.targetViewModel = lastDescendant;
        };
    })
});
Bifrost.namespace("Bifrost.views", {
    viewModelTypes: Bifrost.Singleton(function () {
        var self = this;

        function getNamespaceFrom(path) {
            var localPath = Bifrost.Path.getPathWithoutFilename(path);
            var namespacePath = Bifrost.namespaceMappers.mapPathToNamespace(localPath);
            if (namespacePath != null) {
                var namespace = Bifrost.namespace(namespacePath);
                return namespace;
            }
            return null;
        }

        function getTypeNameFrom(path) {
            var localPath = Bifrost.Path.getPathWithoutFilename(path);
            var filename = Bifrost.Path.getFilenameWithoutExtension(path);
            return filename;
        }


        this.isLoaded = function (path) {
            var namespace = getNamespaceFrom(path);
            if (namespace != null) {
                var typename = getTypeNameFrom(path);
                return typename in namespace;
            }
            return false;
        };

        function getViewModelTypeForPathImplementation(path) {
            var namespace = getNamespaceFrom(path);
            if (namespace != null) {
                var typename = getTypeNameFrom(path);
                if (Bifrost.isType(namespace[typename])) {
                    return namespace[typename];
                }
            }

            return null;
        }

        this.getViewModelTypeForPath = function (path) {
            var type = getViewModelTypeForPathImplementation(path);
            if (Bifrost.isNullOrUndefined(type)) {
                var deepPath = path.replace(".js", "/index.js");
                type = getViewModelTypeForPathImplementation(deepPath);
                if (Bifrost.isNullOrUndefined(type)) {
                    deepPath = path.replace(".js", "/Index.js");
                    getViewModelTypeForPathImplementation(deepPath);
                }
            }

            return type;
        };


        this.beginCreateInstanceOfViewModel = function (path, region, viewModelParameters) {
            var promise = Bifrost.execution.Promise.create();

            var type = self.getViewModelTypeForPath(path);
            if (type != null) {
                var previousRegion = Bifrost.views.Region.current;
                Bifrost.views.Region.current = region;

                viewModelParameters = viewModelParameters || {};
                viewModelParameters.region = region;

                type.beginCreate(viewModelParameters)
                        .continueWith(function (instance) {
                            promise.signal(instance);
                        }).onFail(function (error) {
                            console.log("ViewModel '" + path + "' failed instantiation");
                            throw error;
                        });
            } else {
                console.log("ViewModel '" + path + "' does not exist");
                promise.signal(null);
            }

            return promise;
        };

    })
});
Bifrost.WellKnownTypesDependencyResolver.types.viewModelTypes = Bifrost.views.viewModelTypes;
Bifrost.namespace("Bifrost.views", {
    viewModelLoader: Bifrost.Singleton(function (taskFactory, fileFactory, viewModelTypes) {
        this.load = function (path, region, viewModelParameters) {
            var promise = Bifrost.execution.Promise.create();
            var file = fileFactory.create(path, Bifrost.io.fileType.javaScript);
            var task = taskFactory.createViewModelLoad([file]);
            region.tasks.execute(task).continueWith(function () {
                viewModelTypes.beginCreateInstanceOfViewModel(path, region, viewModelParameters).continueWith(function (instance) {
                    promise.signal(instance);
                });
            });
            return promise;
        };
    })
});

Bifrost.namespace("Bifrost.views", {
    ViewModelLoadTask: Bifrost.views.ComposeTask.extend(function (files, fileManager) {
        /// <summary>Represents a task for loading viewModels</summary>
        var self = this;

        this.files = [];
        files.forEach(function (file) {
            self.files.push(file.path.fullPath);
        });

        this.execute = function () {
            var promise = Bifrost.execution.Promise.create();

            fileManager.load(files).continueWith(function (instances) {
                promise.signal(instances);
            });
            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.views", {
    viewModelManager: Bifrost.Singleton(function(assetsManager, documentService, viewModelLoader, regionManager, taskFactory, viewFactory, MasterViewModel) {
        var self = this;
        this.assetsManager = assetsManager;
        this.viewModelLoader = viewModelLoader;
        this.documentService = documentService;

        this.masterViewModel = MasterViewModel;

        this.hasForView = function (viewPath) {
            var scriptFile = Bifrost.Path.changeExtension(viewPath, "js");
            scriptFile = Bifrost.Path.makeRelative(scriptFile);
            var hasViewModel = self.assetsManager.hasScript(scriptFile);
            return hasViewModel;
        };

        this.getViewModelPathForView = function (viewPath) {
            var scriptFile = Bifrost.Path.changeExtension(viewPath, "js");
            return scriptFile;
        };

        this.isLoaded = function (path) {
            var localPath = Bifrost.Path.getPathWithoutFilename(path);
            var filename = Bifrost.Path.getFilenameWithoutExtension(path);
            var namespacePath = Bifrost.namespaceMappers.mapPathToNamespace(localPath);
            if (namespacePath != null) {
                var namespace = Bifrost.namespace(namespacePath);

                if (filename in namespace) {
                    return true;
                }
            }
            return false;
        };
    })
});
Bifrost.namespace("Bifrost.views", {
    viewModelBindingHandler: Bifrost.Type.extend(function(documentService, viewFactory, viewModelLoader, viewModelManager, viewModelTypes, regionManager) {
        this.init = function (element, valueAccessor, allBindingsAccessor, parentViewModel, bindingContext) {
            var path = ko.utils.unwrapObservable(valueAccessor());
            if (element._isLoading === true || (element._viewModelPath === path && !Bifrost.isNullOrUndefined(element._viewModel))) {
                return;
            }

            element._isLoading = true;
            element._viewModelPath = path;

            var viewPath = "/";

            if( documentService.hasViewFile(element) ) {
                viewPath = documentService.getViewFileFrom(element);
            }

            var view = viewFactory.createFrom(viewPath);
            view.content = element.innerHTML;
            view.element = element;

            var viewModelInstance = ko.observable();

            var region = regionManager.getFor(view);
            regionManager.describe(view,region).continueWith(function () {
                var viewModelParameters = allBindingsAccessor().viewModelParameters || {};
                viewModelParameters.region = region;

                if (viewModelTypes.isLoaded(path)) {
                    var viewModelType = viewModelTypes.getViewModelTypeForPath(path);

                    var lastRegion = Bifrost.views.Region.current;
                    Bifrost.views.Region.current = region;

                    viewModelType.beginCreate(viewModelParameters).continueWith(function (viewModel) {
                        var childBindingContext = bindingContext.createChildContext(viewModel);
                        childBindingContext.$root = viewModel;
                        element._viewModel = viewModel;

                        viewModelInstance(viewModel);
                        Bifrost.views.Region.current = lastRegion;

                        element._isLoading = false;
                    }).onFail(function(e) {
                        console.log("Could not create an instance of '" + viewModelType._namespace.name + "." + viewModelType._name+" - Reason : "+e);
                    });
                } else {
                    viewModelLoader.load(path, region, viewModelParameters).continueWith(function (viewModel) {
                        var childBindingContext = bindingContext.createChildContext(viewModel);
                        childBindingContext.$root = viewModel;
                        element._viewModel = viewModel;

                        viewModelInstance(viewModel);

                        element._isLoading = false;
                    });
                }
            });

            return ko.bindingHandlers.with.init(element, viewModelInstance, allBindingsAccessor, parentViewModel, bindingContext);
        };
    })
});
Bifrost.views.viewModelBindingHandler.initialize = function () {
    ko.bindingHandlers.viewModel = Bifrost.views.viewModelBindingHandler.create();
};


Bifrost.namespace("Bifrost.views", {
    Region: function(messengerFactory, operationsFactory, tasksFactory) {
        /// <summary>Represents a region in the visual composition on a page</summary>
        var self = this;

        /// <field name="view" type="observable of Bifrost.views.View">Observable holding View for the composition</field>
        this.view = ko.observable();

        /// <field name="viewModel" type="Bifrost.views.ViewModel">The ViewModel associated with the view</field>
        this.viewModel = null;

        /// <field name="messenger" type="Bifrost.messaging.Messenger">The messenger for the region</field>
        this.messenger = messengerFactory.create();

        /// <field name="globalMessenger" type="Bifrost.messaging.Messenger">The global messenger</field>
        this.globalMessenger = messengerFactory.global();

        /// <field name="operations" type="Bifrost.interaction.Operations">Operations for the region</field>
        this.operations = operationsFactory.create();

        /// <field name="tasks" type="Bifrost.tasks.Tasks">Tasks for the region</field>
        this.tasks = tasksFactory.create();

        /// <field name="parent" type="Bifrost.views.Region">Parent region, null if there is no parent</field>
        this.parent = null;

        /// <field name="children" type="Bifrost.views.Region[]">Child regions within this region</field>
        this.children = ko.observableArray();

        /// <field name="commands" type="observableArray">Array of commands inside the region</field>
        this.commands = ko.observableArray();

        /// <field name="isCommandRoot" type="observable">Whether this region is a command root.
        /// (i.e does not bubble its commands upwards)</field>
        this.isCommandRoot = ko.observable(false);

        /// <field name="aggregatedCommands" type="observableArray">Represents all commands in this region and any child regions</field>
        this.aggregatedCommands = ko.computed(function () {
            var commands = [];

            self.commands().forEach(function (command) {
                commands.push(command);
            });

            self.children().forEach(function (childRegion) {
                if (!childRegion.isCommandRoot()) {
                    childRegion.aggregatedCommands().forEach(function (command) {
                        commands.push(command);
                    });
                }
            });
            return commands;
        });


        function thisOrChildHasTaskType(taskType, propertyName) {
            return ko.computed(function () {
                var hasTask = false;
                self.children().forEach(function (childRegion) {
                    if (childRegion[propertyName]() === true) {
                        hasTask = true;
                        return;
                    }
                });

                self.tasks.all().forEach(function (task) {
                    if (task._type.typeOf(taskType) === true) {
                        hasTask = true;
                    }
                });

                return hasTask;
            });
        }


        function thisOrChildCommandHasPropertySetToTrue(commandPropertyName, breakIfThisHasNoCommands) {
            return ko.computed(function () {
                var isSet = true;

                var commands = self.aggregatedCommands();
                if (breakIfThisHasNoCommands === true) {
                    if (commands.length === 0) {
                        return false;
                    }
                }
                commands.forEach(function (command) {
                    if (command[commandPropertyName]() === false) {
                        isSet = false;
                        return;
                    }
                });

                return isSet;
            });
        }

        function thisOrChildCommandHasPropertySetToFalse(commandPropertyName) {
            return ko.computed(function () {
                var isSet = false;

                var commands = self.aggregatedCommands();
                commands.forEach(function (command) {
                    if (command[commandPropertyName]() === true) {
                        isSet = true;
                        return;
                    }
                });

                return isSet;
            });
        }

        /// <field name="isValid" type="observable">Indiciates wether or not region or any of its child regions are in an invalid state</field>
        this.isValid = thisOrChildCommandHasPropertySetToTrue("isValid");

        /// <field name="canCommandsExecute" type="observable">Indicates wether or not region or any of its child regions can execute their commands</field>
        this.canCommandsExecute = thisOrChildCommandHasPropertySetToTrue("canExecute", true);

        /// <field name="areCommandsAuthorized" type="observable">Indicates wether or not region or any of its child regions have their commands authorized</field>
        this.areCommandsAuthorized = thisOrChildCommandHasPropertySetToTrue("isAuthorized");

        /// <field name="areCommandsAuthorized" type="observable">Indicates wether or not region or any of its child regions have their commands changed</field>
        this.commandsHaveChanges = thisOrChildCommandHasPropertySetToFalse("hasChanges");

        /// <field name="areCommandsAuthorized" type="observable">Indicates wether or not region or any of its child regions have their commands ready to execute</field>
        this.areCommandsReadyToExecute = thisOrChildCommandHasPropertySetToTrue("isReadyToExecute", true);

        /// <field name="areCommandsAuthorized" type="observable">Indicates wether or not region or any of its child regions have changes in their commands or has any operations</field>
        this.hasChanges = ko.computed(function () {
            var commandsHaveChanges = self.commandsHaveChanges();


            var childrenHasChanges = false;
            self.children().forEach(function (childRegion) {
                if (!childRegion.isCommandRoot()) {
                    if (childRegion.hasChanges() === true) {
                        childrenHasChanges = true;
                        return;
                    }
                }
            });

            return commandsHaveChanges || (self.operations.stateful().length > 0) || childrenHasChanges;
        });

        /// <field name="validationMessages" type="observableArray">Holds the regions and any of its child regions validation messages</field>
        this.validationMessages = ko.computed(function () {
            var messages = [];

            var commands = self.aggregatedCommands();
            commands.forEach(function (command) {
                if (command.isValid() === false) {
                    command.validators().forEach(function (validator) {
                        if (validator.isValid() === false) {
                            messages.push(validator.message());
                        }
                    });
                }
            });

            return messages;
        });

        /// <field name="isExecuting" type="observable">Indiciates wether or not execution tasks are being performend in this region or any of its child regions</field>
        this.isExecuting = thisOrChildHasTaskType(Bifrost.tasks.ExecutionTask, "isExecuting");

        /// <field name="isComposing" type="observable">Indiciates wether or not execution tasks are being performend in this region or any of its child regions</field>
        this.isComposing = thisOrChildHasTaskType(Bifrost.views.ComposeTask, "isComposing");

        /// <field name="isLoading" type="observable">Indiciates wether or not loading tasks are being performend in this region or any of its child regions</field>
        this.isLoading = thisOrChildHasTaskType(Bifrost.tasks.LoadTask, "isLoading");

        /// <field name="isBusy" type="observable">Indicates wether or not tasks are being performed in this region or any of its child regions</field>
        this.isBusy = ko.computed(function () {
            var isBusy = false;
            self.children().forEach(function (childRegion) {
                if (childRegion.isBusy() === true) {
                    isBusy = true;
                    return;
                }
            });

            if (self.tasks.all().length > 0) {
                isBusy = true;
            }

            return isBusy;
        });
    }
});
Bifrost.views.Region.current = null;
Bifrost.dependencyResolvers.Region = {
    canResolve: function (namespace, name) {
        return name === "region";
    },

    resolve: function (namespace, name) {
        return Bifrost.views.Region.current;
    }
};
Bifrost.namespace("Bifrost.views", {
    regionManager: Bifrost.Singleton(function (documentService, regionDescriptorManager, messengerFactory, operationsFactory, tasksFactory) {
        /// <summary>Represents a manager that knows how to deal with Regions on the page</summary>
        var self = this;

        function createRegionInstance() {
            var instance = new Bifrost.views.Region(messengerFactory, operationsFactory, tasksFactory);
            return instance;
        }


        function manageInheritance(element) {
            var parentRegion = documentService.getParentRegionFor(element);
            if (parentRegion) {
                Bifrost.views.Region.prototype = parentRegion;
            } else {
                var topLevel = createRegionInstance();
                regionDescriptorManager.describeTopLevel(topLevel);
                Bifrost.views.Region.prototype = topLevel;
            }
            return parentRegion;
        }

        function manageHierarchy(parentRegion) {
            var region = createRegionInstance();
            region.parent = parentRegion;
            if (parentRegion) {
                parentRegion.children.push(region);
            }
            return region;
        }

        this.getFor = function (view) {
            /// <summary>Gets the region for the given view and creates one if none exist</summary>
            /// <param name="view" type="View">View to get a region for</param>
            /// <returns>The region for the element</returns>

            var region;
            var element = view.element;
            if (documentService.hasOwnRegion(element)) {
                region = documentService.getRegionFor(element);
                region.view(view);
                return region;
            }

            var parentRegion = manageInheritance(element);
            region = manageHierarchy(parentRegion);
            region.view(view);
            documentService.setRegionOn(element, region);

            return region;
        };

        this.describe = function (view, region) {
            /// <summary>Describes a region for a view</summary>
            /// <param name="view" type="View">View to describe region for</param>
            /// <param name="region" type="Region">Region to describe for</param>
            /// <returns>A promise that can be continued for when the description is done</returns>
            var promise = Bifrost.execution.Promise.create();
            var element = view.element;

            regionDescriptorManager.describe(view, region).continueWith(function () {
                promise.signal();
            });
            return promise;
        };

        this.getCurrent = function () {
            /// <summary>Gets the current region</summary>
            return Bifrost.views.Region.current;
        };

        this.evict = function (region) {
            /// <summary>Evict a region from the page</summary>
            /// <param name="region" type="Bifrost.views.Region">Region to evict</param>

            if (region.parentRegion) {
                region.parentRegion.children.remove(region);
            }
            region.parentRegion = null;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.regionManager = Bifrost.views.regionManage;
Bifrost.namespace("Bifrost.views", {
    RegionDescriptor: Bifrost.Type.extend(function () {
        this.describe = function (region) {
        };
    })
});
Bifrost.namespace("Bifrost.views", {
    regionDescriptorManager: Bifrost.Singleton(function () {
        /// <summary>Represents a manager that knows how to manage region descriptors</summary>

        this.describe = function (view, region) {
            /// <summary>Describe a specific region related to a view</summary>
            /// <param name="view" type="Bifrost.views.View">View related to the region</param>
            /// <param name="region" type="Bifrost.views.Region">Region that needs to be described</param>
            var promise = Bifrost.execution.Promise.create();
            var localPath = Bifrost.Path.getPathWithoutFilename(view.path);
            var namespacePath = Bifrost.namespaceMappers.mapPathToNamespace(localPath);
            if (namespacePath != null) {
                var namespace = Bifrost.namespace(namespacePath);

                Bifrost.views.Region.current = region;
                Bifrost.dependencyResolver.beginResolve(namespace, "RegionDescriptor").continueWith(function (descriptor) {
                    descriptor.describe(region);
                    promise.signal();
                }).onFail(function () {
                    promise.signal();
                });
            } else {
                promise.signal();
            }
            return promise;
        };

        this.describeTopLevel = function (region) {

        };
    })
});
Bifrost.dependencyResolvers.RegionDescriptor = {
    canResolve: function (namespace, name) {
        return name === "RegionDescriptor";
    },

    resolve: function (namespace, name) {
        return {
            describe: function () { }
        };
    }
};
Bifrost.namespace("Bifrost.views", {
    DataViewAttributeElementVisitor: Bifrost.markup.ElementVisitor.extend(function () {
        this.visit = function (element, actions) {

            var dataView = element.attributes.getNamedItem("data-view");
            if (!Bifrost.isNullOrUndefined(dataView)) {
                var dataBindString = "";
                var dataBind = element.attributes.getNamedItem("data-bind");
                if (!Bifrost.isNullOrUndefined(dataBind)) {
                    dataBindString = dataBind.value + ", ";
                } else {
                    dataBind = document.createAttribute("data-bind");
                }
                dataBind.value = dataBindString + "view: '" + dataView.value + "'";
                element.attributes.setNamedItem(dataBind);
                element.attributes.removeNamedItem("data-view");
            }
        };
    })
});
Bifrost.namespace("Bifrost.views", {
    DataViewModelFileAttributeElementVisitor: Bifrost.markup.ElementVisitor.extend(function () {
        this.visit = function (element, actions) {

            var dataView = element.attributes.getNamedItem("data-viewmodel-file");
            if (!Bifrost.isNullOrUndefined(dataView)) {
                var dataBindString = "";
                var dataBind = element.attributes.getNamedItem("data-bind");
                if (!Bifrost.isNullOrUndefined(dataBind)) {
                    dataBindString = dataBind.value + ", ";
                } else {
                    dataBind = document.createAttribute("data-bind");
                }
                dataBind.value = dataBindString + "viewModel: '" + dataView.value + "'";
                element.attributes.setNamedItem(dataBind);
                element.attributes.removeNamedItem("data-viewmodel-file");
            }
        };
    })
});
Bifrost.namespace("Bifrost.interaction", {
    VisualStateManagerElementVisitor: Bifrost.markup.ElementVisitor.extend(function () {
        var visualStateActionTypes = Bifrost.interaction.VisualStateAction.getExtenders();



        function parseActions(namingRoot, stateElement, state) {
            function parseAction(type) {
                if (type._name.toLowerCase() === child.localName) {
                    var action = type.create();

                    for (var attributeIndex = 0; attributeIndex < child.attributes.length; attributeIndex++) {
                        var name = child.attributes[attributeIndex].localName;
                        var value = child.attributes[attributeIndex].value;
                        if (action.hasOwnProperty(name)) {
                            action[name] = value;
                        }
                    }
                    action.initialize(namingRoot);
                    state.addAction(action);
                }
            }

            if (stateElement.hasChildNodes()) {
                var child = stateElement.firstChild;
                while (child) {
                    visualStateActionTypes.forEach(parseAction);
                    child = child.nextSibling;
                }
            }
        }

        function parseStates(namingRoot, groupElement, group) {
            if( groupElement.hasChildNodes() ) {
                var child = groupElement.firstChild;
                while( child ) {
                    if( child.localName === "visualstate" ) {
                        var state = Bifrost.interaction.VisualState.create();
                        state.name = child.getAttribute("name");
                        group.addState(state);
                        parseActions(namingRoot, child, state);
                    }
                    child = child.nextSibling;
                }
            }
        }


        this.visit = function (element, actions) {
            if (element.localName === "visualstatemanager") {
                var visualStateManager = Bifrost.interaction.VisualStateManager.create();
                var namingRoot = element.parentElement.namingRoot;
                element.parentElement.visualStateManager = visualStateManager;

                if (element.hasChildNodes()) {
                    var child = element.firstChild;
                    while (child) {
                        if (child.localName === "visualstategroup") {
                            var group = Bifrost.interaction.VisualStateGroup.create();
                            visualStateManager.addGroup(group);

                            var duration = child.getAttribute("duration");
                            if (!Bifrost.isNullOrUndefined(duration)) {
                                duration = parseFloat(duration);
                                if (!isNaN(duration)) {
                                    duration = duration * 1000;
                                    var timespan = Bifrost.TimeSpan.fromMilliseconds(duration);
                                    group.defaultDuration = timespan;
                                }
                            }

                            parseStates(namingRoot, child, group);
                        }
                        child = child.nextSibling;
                    }
                }
            }
        };

    })
});
Bifrost.namespace("Bifrost.navigation", {
    NavigationFrame: Bifrost.Type.extend(function (home, uriMapper, history) {
        var self = this;

        this.home = home;
        this.history = history;

        this.container = null;
        this.currentUri = ko.observable(home);
        this.uriMapper = uriMapper || null;

        this.setCurrentUri = function (path) {
            if (path.indexOf("/") === 0) {
                path = path.substr(1);
            }
            if (path.lastIndexOf("/") === path.length - 1) {
                path = path.substr(0, path.length - 1);
            }
            if (path == null || path.length === 0) {
                path = self.home;
            }
            if (self.uriMapper != null && !self.uriMapper.hasMappingFor(path)) {
                path = self.home;
            }
            self.currentUri(path);
        };

        this.setCurrentUriFromCurrentLocation = function () {
            var state = self.history.getState();
            var uri = Bifrost.Uri.create(state.url);
            self.setCurrentUri(uri.path);
        };

        history.Adapter.bind(window, "statechange", function () {
            self.setCurrentUriFromCurrentLocation();
        });

        this.configureFor = function (container) {
            self.setCurrentUriFromCurrentLocation();
            self.container = container;

            var uriMapper = $(container).closest("[data-urimapper]");
            if (uriMapper.length === 1) {
                var uriMapperName = $(uriMapper[0]).data("urimapper");
                if (uriMapperName in Bifrost.uriMappers) {
                    self.uriMapper = Bifrost.uriMappers[uriMapperName];
                }
            }
            if (self.uriMapper == null) {
                self.uriMapper = Bifrost.uriMappers.default;
            }
        };

        this.navigate = function (uri) {
            self.setCurrentUri(uri);
        };

    })
});
if (typeof ko !== 'undefined' && typeof History !== "undefined" && typeof History.Adapter !== "undefined") {
    ko.bindingHandlers.navigateTo = {
        init: function (element, valueAccessor, allBindingAccessor, viewModel) {
            ko.applyBindingsToNode(element, {
                click: function() {
                    var featureName = valueAccessor()();
                    History.pushState({feature:featureName},$(element).attr("title"),"/"+ featureName);
                }
            }, viewModel);
        }
    };
}
Bifrost.namespace("Bifrost.navigation", {
    navigateTo: function (featureName, queryString) {
        var url = featureName;

        if (featureName.charAt(0) !== "/") {
            url = "/" + url;
        }

        if (queryString) {
            url += queryString;
        }

        // TODO: Support title somehow
        if (typeof History !== "undefined" && typeof History.Adapter !== "undefined") {
            History.pushState({}, "", url);
        }
    },
    navigationManager: {
        getCurrentLocation: function() {
            var uri = Bifrost.Uri.create(window.location.toString());
            return uri;
        },

        hookup: function () {
            if (typeof History !== "undefined" && typeof History.Adapter !== "undefined") {
                $("body").click(function (e) {
                    var href = e.target.href;
                    if (typeof href === "undefined") {
                        var closestAnchor = $(e.target).closest("a")[0];
                        if (!closestAnchor) {
                            return;
                        }
                        href = closestAnchor.href;
                    }
                    if (href.indexOf("#!") > 0) {
                        href = href.substr(0, href.indexOf("#!"));
                    }

                    if (href.length === 0) {
                        href = "/";
                    }
                    var targetUri = Bifrost.Uri.create(href);
                    if (targetUri.isSameAsOrigin &&
                        targetUri.queryString.indexOf("postback")<0) {
                        var target = targetUri.path;
                        while (target.indexOf("/") === 0) {
                            target = target.substr(1);
                        }
                        e.preventDefault();

                        var result = $(e.target).closest("[data-navigation-target]");
                        if (result.length === 1) {
                            var id = $(result[0]).data("navigation-target");
                            var element = $("#"+id);
                            if (element.length === 1 && typeof element[0].navigationFrame !== "undefined") {
                                element[0].navigationFrame.navigate(targetUri.path);
                            } else {
                                // Element not found
                            }
                        } else {
                            var queryString = targetUri.queryString.length > 0 ? "?" + targetUri.queryString : "";
                            History.pushState({}, "", "/" + target + queryString);
                        }
                    }
                });
            }
        }
    }
});
Bifrost.namespace("Bifrost.navigation", {
    observableQueryParameterFactory: Bifrost.Singleton(function () {
        var self = this;

        var historyEnabled = typeof History !== "undefined" && typeof History.Adapter !== "undefined";

        this.create = function (parameterName, defaultValue, navigationManager) {

            function getState() {
                var uri = navigationManager.getCurrentLocation();
                if (uri.parameters.hasOwnProperty(parameterName)) {
                    return uri.parameters[parameterName];
                }

                return null;
            }

            var observable = null;

            if (historyEnabled) {
                History.Adapter.bind(window, "statechange", function () {
                    if (observable != null) {
                        observable(getState());
                    }
                });
            } else {
                window.addEventListener("hashchange", function () {
                    if (observable != null) {
                        var state = getState();
                        if (observable() !== state) {
                            observable(state);
                        }
                    }
                }, false);
            }

            var state = getState();
            observable = ko.observable(state || defaultValue);

            function getQueryStringParametersWithValueForParameter(url, parameterValue) {
                var parameters = Bifrost.hashString.decode(url);
                parameters[parameterName] = parameterValue;

                var queryString = "";
                var parameterIndex = 0;
                for (var parameter in parameters) {
                    var value = parameters[parameter];
                    if (!Bifrost.isNullOrUndefined(value)) {
                        if (parameterIndex > 0) {
                            queryString += "&";
                        }
                        queryString += parameter + "=" + value;
                    }
                    parameterIndex++;
                }

                return queryString;
            }

            function cleanQueryString(queryString) {
                if (queryString.indexOf("#") === 0 || queryString.indexOf("?") === 0) {
                    queryString = queryString.substr(1);
                }
                return queryString;
            }

            observable.subscribe(function (newValue) {
                var queryString;
                if (historyEnabled) {
                    var state = History.getState();
                    state[parameterName] = newValue;
                    queryString = "?" + getQueryStringParametersWithValueForParameter(cleanQueryString(state.url), newValue);
                    History.pushState(state, state.title, queryString);
                } else {
                    queryString = "#" + getQueryStringParametersWithValueForParameter(cleanQueryString(document.location.hash), newValue);
                    document.location.hash = queryString;
                }
            });

            return observable;
        };
    })
});

ko.observableQueryParameter = function (parameterName, defaultValue) {
    var navigationManager = Bifrost.navigation.navigationManager;
    var observable = Bifrost.navigation.observableQueryParameterFactory.create().create(parameterName, defaultValue, navigationManager);
    return observable;
};

Bifrost.namespace("Bifrost.navigation", {
    DataNavigationFrameAttributeElementVisitor: Bifrost.markup.ElementVisitor.extend(function (documentService) {
        this.visit = function (element, actions) {
            var dataNavigationFrame = element.attributes.getNamedItem("data-navigation-frame");
            if (!Bifrost.isNullOrUndefined(dataNavigationFrame)) {
                var dataBindString = "";
                var dataBind = element.attributes.getNamedItem("data-bind");
                if (!Bifrost.isNullOrUndefined(dataBind)) {
                    dataBindString = dataBind.value + ", ";
                } else {
                    dataBind = document.createAttribute("data-bind");
                }
                dataBind.value = dataBindString + "navigation: '" + dataNavigationFrame.value + "'";
                element.attributes.setNamedItem(dataBind);

                element.attributes.removeNamedItem("data-navigation-frame");
            }
        };
    })
});

Bifrost.namespace("Bifrost.navigation", {
    navigationBindingHandler: Bifrost.Type.extend(function () {
        function getNavigationFrameFor(valueAccessor) {
            var configurationString = ko.utils.unwrapObservable(valueAccessor());
            var configurationItems = ko.expressionRewriting.parseObjectLiteral(configurationString);
            var configuration = {};

            for (var index = 0; index < configurationItems.length; index++) {
                var item = configurationItems[index];
                configuration[item.key.trim()] = item.value.trim();
            }

            var uriMapperName = configuration.uriMapper;
            if (Bifrost.isNullOrUndefined(uriMapperName)) {
                uriMapperName = "default";
            }

            var mapper = Bifrost.uriMappers[uriMapperName];
            var frame = Bifrost.navigation.NavigationFrame.create({
                locationAware: false,
                uriMapper: mapper,
                home: configuration.home || ''
            });

            return frame;
        }

        function makeValueAccessor(navigationFrame) {
            return function () {
                return navigationFrame.currentUri();
            };
        }

        this.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var navigationFrame = getNavigationFrameFor(valueAccessor);
            navigationFrame.configureFor(element);
            return ko.bindingHandlers.view.init(element, makeValueAccessor(navigationFrame), allBindingsAccessor, viewModel, bindingContext);
        };
        this.update = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var navigationFrame = getNavigationFrameFor(valueAccessor);
            navigationFrame.configureFor(element);
            return ko.bindingHandlers.view.update(element, makeValueAccessor(navigationFrame), allBindingsAccessor, viewModel, bindingContext);
        };
    })
});
Bifrost.navigation.navigationBindingHandler.initialize = function () {
    ko.bindingHandlers.navigation = Bifrost.navigation.navigationBindingHandler.create();
    ko.jsonExpressionRewriting.bindingRewriteValidators.navigation = false; // Can't rewrite control flow bindings
    ko.virtualElements.allowedBindings.navigation = true;
};

Bifrost.namespace("Bifrost.values", {
    TypeConverter: Bifrost.Type.extend(function () {
        this.supportedType = null;

        this.convertFrom = function (value) {
            return value;
        };

        this.convertTo = function (value) {
            return value;
        };
    })
});
Bifrost.namespace("Bifrost.values", {
    NumberTypeConverter: Bifrost.values.TypeConverter.extend(function () {
        var allowedCharacters = "0123456789.,-";

        this.supportedType = Number;

        function stripLetters(value) {
            value = value.toString();
            var returnValue = "";

            for (var charIndex = 0; charIndex < value.length; charIndex++) {
                var found = false;
                for (var allowedCharIndex = 0; allowedCharIndex < allowedCharacters.length; allowedCharIndex++) {
                    if (value[charIndex] === allowedCharacters[allowedCharIndex]) {
                        found = true;
                        returnValue = returnValue + value[charIndex];
                        break;
                    }
                }
            }

            return returnValue;
        }

        this.convertFrom = function (value) {
            if (value.constructor === Number) {
                return value;
            }
            if (value === "") {
                return 0;
            }
            value = stripLetters(value);
            var result = 0;
            if (value.indexOf(".") >= 0) {
                result = parseFloat(value);
            } else {
                result = parseInt(value);
            }
            return result;
        };
    })
});
Bifrost.namespace("Bifrost.values", {
    DateTypeConverter: Bifrost.values.TypeConverter.extend(function () {
        this.supportedType = Date;

        function isNull(time) {
            // Treat serialization of default(DateTime) from server as null.
            return Bifrost.isNullOrUndefined(time) ||
                // ISO 8601 formats for default(DateTime):
                time === "0001-01-01T00:00:00" ||
                time === "0001-01-01T00:00:00Z" ||
                // new Date("0001-01-01T00:00:00") in Chrome and Firefox:
                (time instanceof Date && time.getTime() === -62135596800000) ||
                // new Date("0001-01-01T00:00:00") or any other invalid date in Internet Explorer:
                (time instanceof Date && isNaN(time.getTime()));
        }

        this.convertFrom = function (value) {
            if (isNull(value)) {
                return null;
            }
            var date = new Date(value);
            return date;
        };

        this.convertTo = function (value) {
            return value.format("yyyy-MM-dd");
        };
    })
});
Bifrost.namespace("Bifrost.values", {
    StringTypeConverter: Bifrost.values.TypeConverter.extend(function () {
        this.supportedType = String;

        this.convertFrom = function (value) {
            return value.toString();
        };
    })
});
Bifrost.namespace("Bifrost.values", {
    typeConverters: Bifrost.Singleton(function () {
        var convertersByType = {};

        var typeConverterTypes = Bifrost.values.TypeConverter.getExtenders();
        typeConverterTypes.forEach(function (type) {
            var converter = type.create();
            convertersByType[converter.supportedType] = converter;
        });

        this.convertFrom = function (value, type) {
            var actualType = null;
            if (Bifrost.isString(type)) {
                actualType = eval(type);
            } else {
                actualType = type;
            }
            if (convertersByType.hasOwnProperty(actualType)) {
                return convertersByType[actualType].convertFrom(value);
            }

            return value;
        };

        this.convertTo = function (value) {
            if (Bifrost.isNullOrUndefined(value)) {
                return value;
            }
            for (var converter in convertersByType) {
                /* jshint eqeqeq: false */
                if (value.constructor == converter) {
                    return convertersByType[converter].convertTo(value);
                }
            }

            return value;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.typeConverters = Bifrost.values.typeConverters;

Bifrost.namespace("Bifrost.values", {
    typeExtender: Bifrost.Singleton(function () {
        this.extend = function (target, typeAsString) {
            target._typeAsString = typeAsString;
        };
    })
});
ko.extenders.type = Bifrost.values.typeExtender.create().extend;

Bifrost.namespace("Bifrost.values", {
    Formatter: Bifrost.Type.extend(function () {
        this.supportedType = null;

        this.format = function (value, format) {
            return value;
        };
    })
});
Bifrost.namespace("Bifrost.values", {
    DateFormatter: Bifrost.values.Formatter.extend(function () {
        this.supportedType = Date;

        this.format = function (value, format) {
            return value.format(format);
        };
    })
});
Bifrost.namespace("Bifrost.values", {
    stringFormatter: Bifrost.Singleton(function () {
        var formatterTypes = Bifrost.values.Formatter.getExtenders();
        var formattersByType = {};

        formatterTypes.forEach(function (type) {
            var formatter = type.create();
            formattersByType[formatter.supportedType] = formatter;
        });

        function getFormat(element) {
            if (element.nodeType !== 1 || Bifrost.isNullOrUndefined(element.attributes)) {
                return null;
            }
            var stringFormatAttribute = element.attributes.getNamedItem("data-stringformat");
            if (!Bifrost.isNullOrUndefined(stringFormatAttribute)) {
                return stringFormatAttribute.value;
            }

            return null;
        }

        this.hasFormat = function (element) {
            var format = getFormat(element);
            return format !== null;
        };

        this.format = function (element, value) {
            var format = getFormat(element);

            if (formattersByType.hasOwnProperty(value.constructor)) {
                var formatter = formattersByType[value.constructor];
                var regex = new RegExp("{(.[^{}])*}", "g");
                var result = format.replace(regex, function (formatExpression) {
                    var expression = formatExpression.substr(1, formatExpression.length - 2);
                    return formatter.format(value, expression);
                });
                return result;
            }

            return format;
        };
    })
});
Bifrost.namespace("Bifrost.values", {
    valuePipeline: Bifrost.Singleton(function (typeConverters, stringFormatter) {
        this.getValueForView = function (element, value) {
            if (Bifrost.isNullOrUndefined(value)) {
                return value;
            }
            var actualValue = ko.utils.unwrapObservable(value);
            if (Bifrost.isNullOrUndefined(actualValue)) {
                return value;
            }

            var returnValue = actualValue;

            if (stringFormatter.hasFormat(element)) {
                returnValue = stringFormatter.format(element, actualValue);
            } else {
                if (!Bifrost.isNullOrUndefined(value._typeAsString)) {
                    returnValue = typeConverters.convertTo(actualValue);
                }
            }
            return returnValue;
        };

        this.getValueForProperty = function (property, value) {
            if (Bifrost.isNullOrUndefined(property)) {
                return value;
            }
            if (Bifrost.isNullOrUndefined(value)) {
                return value;
            }
            if (!Bifrost.isNullOrUndefined(property._typeAsString)) {
                value = typeConverters.convertFrom(value, property._typeAsString);
            }

            return value;
        };
    })
});

(function () {
    var valuePipeline = Bifrost.values.valuePipeline.create();

    var oldReadValue = ko.selectExtensions.readValue;
    ko.selectExtensions.readValue = function (element) {
        var value = oldReadValue(element);

        var bindings = ko.bindingProvider.instance.getBindings(element, ko.contextFor(element));
        if (Bifrost.isNullOrUndefined(bindings)) {
            return value;
        }
        var result = valuePipeline.getValueForProperty(bindings.value, value);
        return result;
    };

    var oldWriteValue = ko.selectExtensions.writeValue;
    ko.selectExtensions.writeValue = function (element, value, allowUnset) {
        var result = value;
        var bindings = ko.bindingProvider.instance.getBindings(element, ko.contextFor(element));
        if (!Bifrost.isNullOrUndefined(bindings)) {
            result = ko.utils.unwrapObservable(valuePipeline.getValueForView(element, bindings.value));
        }
        oldWriteValue(element, result, allowUnset);
    };

    var oldSetTextContent = ko.utils.setTextContent;
    ko.utils.setTextContent = function (element, value) {
        var result = valuePipeline.getValueForView(element, value);
        oldSetTextContent(element, result);
    };

    var oldSetHtml = ko.utils.setHtml;
    ko.utils.setHtml = function (element, value) {
        var result = valuePipeline.getValueForView(element, value);
        oldSetHtml(element, result);
    };
})();
Bifrost.namespace("Bifrost.values", {
    ValueProvider: Bifrost.Type.extend(function () {

        this.defaultProperty = null;

        this.provide = function (consumer) {

        };
    })
});
Bifrost.namespace("Bifrost.values", {
    valueProviders: Bifrost.Singleton(function () {

        this.isKnown = function (name) {
            var found = false;
            var valueProviders = Bifrost.values.ValueProvider.getExtenders();
            valueProviders.forEach(function (valueProviderType) {
                if (valueProviderType._name.toLowerCase() === name) {
                    found = true;
                    return;
                }
            });
            return found;
        };

        this.getInstanceOf = function (name) {
            var instance = null;
            var valueProviders = Bifrost.values.ValueProvider.getExtenders();
            valueProviders.forEach(function (valueProviderType) {
                if (valueProviderType._name.toLowerCase() === name) {
                    instance = valueProviderType.create();
                    return;
                }
            });

            return instance;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.valueProviders = Bifrost.values.valueProviders;
Bifrost.namespace("Bifrost.values", {
    ValueConsumer: Bifrost.Type.extend(function () {

        this.canNotifyChanges = function () {
            return false;
        };

        this.notifyChanges = function (callback) {
        };

        this.consume = function(value) {
        };
    })
});
Bifrost.namespace("Bifrost.values", {
    valueConsumers: Bifrost.Singleton(function () {

        this.getFor = function (instance, propertyName) {
            var consumer = Bifrost.values.DefaultValueConsumer.create({
                target: instance,
                property: propertyName
            });
            return consumer;
        };

    })
});
Bifrost.WellKnownTypesDependencyResolver.types.valueConsumers = Bifrost.values.valueConsumers;
Bifrost.namespace("Bifrost.values", {
    Binding: Bifrost.values.ValueProvider.extend(function (bindingContextManager) {

        this.defaultProperty = "path";

        this.path = "";
        this.mode = null;
        this.converter = null;
        this.format = null;

        this.provide = function (consumer) {

        };
    })
});
Bifrost.namespace("Bifrost.values", {
    DefaultValueConsumer: Bifrost.values.ValueConsumer.extend(function (target, property) {
        this.consume = function(value) {
            target[property] = value;
        };
    })
});
Bifrost.namespace("Bifrost", {
    configurator: Bifrost.Type.extend(function () {
        this.configure = function (configure) {
        };
    })
});
Bifrost.namespace("Bifrost", {
    configureType: Bifrost.Singleton(function(assetsManager) {
        var self = this;

        var defaultUriMapper = Bifrost.StringMapper.create();
        defaultUriMapper.addMapping("{boundedContext}/{module}/{feature}/{view}", "{boundedContext}/{module}/{feature}/{view}.html");
        defaultUriMapper.addMapping("{boundedContext}/{feature}/{view}", "{boundedContext}/{feature}/{view}.html");
        defaultUriMapper.addMapping("{feature}/{view}", "{feature}/{view}.html");
        defaultUriMapper.addMapping("{view}", "{view}.html");
        Bifrost.uriMappers.default = defaultUriMapper;

        this.isReady = false;
        this.readyCallbacks = [];

        this.initializeLandingPage = true;
        this.applyMasterViewModel = true;

        function onReady() {
            Bifrost.views.Region.current = document.body.region;
            self.isReady = true;
            for (var callbackIndex = 0; callbackIndex < self.readyCallbacks.length; callbackIndex++) {
                self.readyCallbacks[callbackIndex]();
            }
        }

        function hookUpNavigaionAndApplyViewModel() {
            Bifrost.navigation.navigationManager.hookup();

            if (self.applyMasterViewModel === true) {
                Bifrost.views.viewModelManager.create().masterViewModel.apply();
            }
        }

        function onStartup() {
            var configurators = Bifrost.configurator.getExtenders();
            configurators.forEach(function (configuratorType) {
                var configurator = configuratorType.create();
                configurator.config(self);
            });


            Bifrost.dependencyResolvers.DOMRootDependencyResolver.documentIsReady();
            Bifrost.views.viewModelBindingHandler.initialize();
            Bifrost.views.viewBindingHandler.initialize();
            Bifrost.navigation.navigationBindingHandler.initialize();

            if (typeof History !== "undefined" && typeof History.Adapter !== "undefined") {
                Bifrost.WellKnownTypesDependencyResolver.types.history = History;
            }

            assetsManager.initialize().continueWith(function () {
                if (self.initializeLandingPage === true) {
                    Bifrost.views.viewManager.create().initializeLandingPage().continueWith(hookUpNavigaionAndApplyViewModel);
                } else {
                    hookUpNavigaionAndApplyViewModel();
                }
                onReady();
            });
        }

        function reset() {
            self.isReady = false;
            self.readyCallbacks = [];
        }

        this.ready = function(callback) {
            if (self.isReady === true) {
                callback();
            } else {
                self.readyCallbacks.push(callback);
            }
        };

        $(function () {
            onStartup();
        });
    })
});
Bifrost.configure = Bifrost.configureType.create();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJpZnJvc3QuSmF2YVNjcmlwdC9leHRlbnNpb25zL0FycmF5RXh0ZW5zaW9ucy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9leHRlbnNpb25zL3N0cmluZ0V4dGVuc2lvbnMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvZXh0ZW5zaW9ucy9Ob2RlTGlzdEV4dGVuc2lvbnMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvZXh0ZW5zaW9ucy9IVE1MRWxlbWVudEV4dGVuc2lvbnMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvZXh0ZW5zaW9ucy9IVE1MQ29sbGVjdGlvbkV4dGVuc2lvbnMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvZXh0ZW5zaW9ucy9EYXRlRXh0ZW5zaW9ucy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9wb2x5ZmlsbHMvY2xhc3NMaXN0LmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3BvbHlmaWxscy9FbGVtZW50UG9seWZpbGxzLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3V0aWxzL2V4dGVuZC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9uYW1lc3BhY2UuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvZXhlY3V0aW9uL1Byb21pc2UuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvaXNPYmplY3QuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvaXNOdW1iZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvaXNBcnJheS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9pc1N0cmluZy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9pc051bGwuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvaXNVbmRlZmluZWQuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvaXNOdWxsT3JVbmRlZmluZWQuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvaXNGdW5jdGlvbi5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9pc1R5cGUuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvZnVuY3Rpb25QYXJzZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvYXNzZXRzTWFuYWdlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9kZXBlbmRlbmN5UmVzb2x2ZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvZGVwZW5kZW5jeVJlc29sdmVycy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9kZWZhdWx0RGVwZW5kZW5jeVJlc29sdmVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3V0aWxzL0RPTVJvb3REZXBlbmRlbmN5UmVzb2x2ZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvS25vd25BcnRpZmFjdFR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3V0aWxzL0tub3duQXJ0aWZhY3RJbnN0YW5jZXNEZXBlbmRlbmN5UmVzb2x2ZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvZ3VpZC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9UeXBlLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3V0aWxzL1NpbmdsZXRvbi5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC90eXBlcy9UeXBlSW5mby5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC90eXBlcy9Qcm9wZXJ0eUluZm8uanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvcGF0aC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9FeGNlcHRpb24uanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvZXhjZXB0aW9ucy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9oYXNoU3RyaW5nLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3V0aWxzL1VyaS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9uYW1lc3BhY2VzLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3V0aWxzL25hbWVzcGFjZU1hcHBlcnMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvU3RyaW5nTWFwcGluZy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9zdHJpbmdNYXBwaW5nRmFjdG9yeS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9TdHJpbmdNYXBwZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvdXJpTWFwcGVycy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9zZXJ2ZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvYXJlRXF1YWwuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvZGVlcENsb25lLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3V0aWxzL3N5c3RlbUNsb2NrLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L1RpbWVTcGFuLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L0V2ZW50LmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3N5c3RlbUV2ZW50cy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9kaXNwYXRjaGVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2xpbmtlZC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9odWJzL2h1YkNvbm5lY3Rpb24uanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvaHVicy9IdWIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvaHVicy9odWJEZXBlbmRlbmN5UmVzb2x2ZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvaW8vZmlsZVR5cGUuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvaW8vRmlsZS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9pby9maWxlRmFjdG9yeS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9pby9maWxlTWFuYWdlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9zcGVjaWZpY2F0aW9ucy9TcGVjaWZpY2F0aW9uLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3NwZWNpZmljYXRpb25zL0FuZC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9zcGVjaWZpY2F0aW9ucy9Pci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC90YXNrcy9UYXNrLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3Rhc2tzL1Rhc2tIaXN0b3J5RW50cnkuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdGFza3MvdGFza0hpc3RvcnkuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdGFza3MvVGFza3MuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdGFza3MvdGFza3NGYWN0b3J5LmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3Rhc2tzL0h0dHBHZXRUYXNrLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3Rhc2tzL0h0dHBQb3N0VGFzay5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC90YXNrcy9Mb2FkVGFzay5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC90YXNrcy9GaWxlTG9hZFRhc2suanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdGFza3MvRXhlY3V0aW9uVGFzay5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC90YXNrRmFjdG9yeS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWxpZGF0aW9uL2V4Y2VwdGlvbnMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsaWRhdGlvbi9ydWxlSGFuZGxlcnMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsaWRhdGlvbi9SdWxlLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZhbGlkYXRpb24vVmFsaWRhdG9yLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZhbGlkYXRpb24vdmFsaWRhdGlvblN1bW1hcnlGb3IuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsaWRhdGlvbi92YWxpZGF0aW9uTWVzc2FnZUZvci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWxpZGF0aW9uL3ZhbGlkYXRpb24uanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsaWRhdGlvbi9yZXF1aXJlZC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWxpZGF0aW9uL2xlbmd0aC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWxpZGF0aW9uL21pbkxlbmd0aC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWxpZGF0aW9uL21heExlbmd0aC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWxpZGF0aW9uL3JhbmdlLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZhbGlkYXRpb24vbGVzc1RoYW4uanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsaWRhdGlvbi9sZXNzVGhhbk9yRXF1YWwuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsaWRhdGlvbi9ncmVhdGVyVGhhbi5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWxpZGF0aW9uL2dyZWF0ZXJUaGFuT3JFcXVhbC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWxpZGF0aW9uL2VtYWlsLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZhbGlkYXRpb24vcmVnZXguanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvY29tbWFuZHMvYmluZGluZ0hhbmRsZXJzLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2NvbW1hbmRzL0hhbmRsZUNvbW1hbmRUYXNrLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2NvbW1hbmRzL0hhbmRsZUNvbW1hbmRzVGFzay5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9jb21tYW5kcy9Db21tYW5kQ29vcmRpbmF0b3IuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvY29tbWFuZHMvY29tbWFuZFZhbGlkYXRpb25TZXJ2aWNlLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2NvbW1hbmRzL0NvbW1hbmQuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvY29tbWFuZHMvQ29tbWFuZERlc2NyaXB0b3IuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvY29tbWFuZHMvQ29tbWFuZFJlc3VsdC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9jb21tYW5kcy9jb21tYW5kRGVwZW5kZW5jeVJlc29sdmVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2NvbW1hbmRzL0NvbW1hbmRTZWN1cml0eUNvbnRleHQuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvY29tbWFuZHMvY29tbWFuZFNlY3VyaXR5Q29udGV4dEZhY3RvcnkuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvY29tbWFuZHMvY29tbWFuZFNlY3VyaXR5U2VydmljZS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9jb21tYW5kcy9oYXNDaGFuZ2VzLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2NvbW1hbmRzL2NvbW1hbmRFdmVudHMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvaW50ZXJhY3Rpb24vT3BlcmF0aW9uLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2ludGVyYWN0aW9uL09wZXJhdGlvbkNvbnRleHQuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvaW50ZXJhY3Rpb24vT3BlcmF0aW9uRW50cnkuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvaW50ZXJhY3Rpb24vb3BlcmF0aW9uRW50cnlGYWN0b3J5LmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2ludGVyYWN0aW9uL09wZXJhdGlvbnMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvaW50ZXJhY3Rpb24vb3BlcmF0aW9uc0ZhY3RvcnkuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvaW50ZXJhY3Rpb24vQ29tbWFuZE9wZXJhdGlvbi5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9pbnRlcmFjdGlvbi9BY3Rpb24uanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvaW50ZXJhY3Rpb24vVHJpZ2dlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9pbnRlcmFjdGlvbi9FdmVudFRyaWdnZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvaW50ZXJhY3Rpb24vVmlzdWFsU3RhdGUuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvaW50ZXJhY3Rpb24vVmlzdWFsU3RhdGVBY3Rpb24uanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvaW50ZXJhY3Rpb24vVmlzdWFsU3RhdGVHcm91cC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9pbnRlcmFjdGlvbi9WaXN1YWxTdGF0ZU1hbmFnZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvaW50ZXJhY3Rpb24vVmlzdWFsU3RhdGVUcmFuc2l0aW9uLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2ludGVyYWN0aW9uL3Zpc3VhbFN0YXRlQWN0aW9ucy9PcGFjaXR5LmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L21hcHBpbmcvTWlzc2luZ1Byb3BlcnR5U3RyYXRlZ3kuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvbWFwcGluZy9wcm9wZXJ0eU1hcC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9tYXBwaW5nL01hcC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9tYXBwaW5nL21hcHMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvbWFwcGluZy9tYXBwZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvcmVhZC9yZWFkTW9kZWxTeXN0ZW1FdmVudHMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvcmVhZC9QYWdpbmdJbmZvLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3JlYWQvUXVlcnlhYmxlLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3JlYWQvcXVlcnlhYmxlRmFjdG9yeS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9yZWFkL1F1ZXJ5LmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3JlYWQvUmVhZE1vZGVsLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3JlYWQvUmVhZE1vZGVsT2YuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvcmVhZC9SZWFkTW9kZWxUYXNrLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3JlYWQvcmVhZE1vZGVsT2ZEZXBlbmRlbmN5UmVzb2x2ZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvcmVhZC9xdWVyeURlcGVuZGVuY3lSZXNvbHZlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9yZWFkL1F1ZXJ5VGFzay5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9yZWFkL3F1ZXJ5U2VydmljZS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9zYWdhcy9TYWdhLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3NhZ2FzL3NhZ2FOYXJyYXRvci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9tZXNzYWdpbmcvTWVzc2VuZ2VyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L21lc3NhZ2luZy9tZXNzZW5nZXJGYWN0b3J5LmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L21lc3NhZ2luZy9vYnNlcnZhYmxlTWVzc2FnZS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9zZXJ2aWNlcy9TZXJ2aWNlLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3NlcnZpY2VzL3NlcnZpY2VEZXBlbmRlbmN5UmVzb2x2ZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvZG9jdW1lbnRTZXJ2aWNlLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L21hcmt1cC9CaW5kaW5nQ29udGV4dC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9tYXJrdXAvYmluZGluZ0NvbnRleHRNYW5hZ2VyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L21hcmt1cC9hdHRyaWJ1dGVWYWx1ZXMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvbWFya3VwL3ZhbHVlUHJvdmlkZXJQYXJzZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvbWFya3VwL0VsZW1lbnRWaXNpdG9yLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L21hcmt1cC9FbGVtZW50VmlzaXRvclJlc3VsdEFjdGlvbnMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvbWFya3VwL29iamVjdE1vZGVsRmFjdG9yeS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9tYXJrdXAvTXVsdGlwbGVOYW1lc3BhY2VzSW5OYW1lTm90QWxsb3dlZC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9tYXJrdXAvTXVsdGlwbGVQcm9wZXJ0eVJlZmVyZW5jZXNOb3RBbGxvd2VkLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L21hcmt1cC9QYXJlbnRUYWdOYW1lTWlzbWF0Y2hlZC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9tYXJrdXAvTmFtZXNwYWNlRGVmaW5pdGlvbi5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9tYXJrdXAvbmFtZXNwYWNlRGVmaW5pdGlvbnMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvbWFya3VwL25hbWVzcGFjZXMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvbWFya3VwL2VsZW1lbnROYW1pbmcuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvbWFya3VwL3Byb3BlcnR5RXhwYW5kZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvbWFya3VwL09iamVjdE1vZGVsRWxlbWVudFZpc2l0b3IuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvbWFya3VwL05hbWluZ1Jvb3QuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvbWFya3VwL1VJRWxlbWVudC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9tYXJrdXAvVUlFbGVtZW50UHJlcGFyZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvbWFya3VwL0NvbnRyb2wuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmlld3MvUG9zdEJpbmRpbmdWaXNpdG9yLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZpZXdzL1VJTWFuYWdlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy9Db250ZW50LmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZpZXdzL0l0ZW1zLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZpZXdzL0NvbXBvc2VUYXNrLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZpZXdzL3ZpZXdNYW5hZ2VyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZpZXdzL1BhdGhSZXNvbHZlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy9wYXRoUmVzb2x2ZXJzLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZpZXdzL1VyaU1hcHBlclBhdGhSZXNvbHZlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy9SZWxhdGl2ZVBhdGhSZXNvbHZlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy9WaWV3LmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZpZXdzL3ZpZXdGYWN0b3J5LmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZpZXdzL1ZpZXdMb2FkVGFzay5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy92aWV3TG9hZGVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZpZXdzL3ZpZXdCaW5kaW5nSGFuZGxlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy92aWV3QmluZGluZ0hhbmRsZXJUZW1wbGF0ZVNvdXJjZS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy92aWV3QmluZGluZ0hhbmRsZXJUZW1wbGF0ZUVuZ2luZS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy9NYXN0ZXJWaWV3TW9kZWwuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmlld3MvVmlld01vZGVsLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZpZXdzL3ZpZXdNb2RlbFR5cGVzLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZpZXdzL3ZpZXdNb2RlbExvYWRlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy9WaWV3TW9kZWxMb2FkVGFzay5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy92aWV3TW9kZWxNYW5hZ2VyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZpZXdzL3ZpZXdNb2RlbEJpbmRpbmdIYW5kbGVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZpZXdzL1JlZ2lvbi5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy9SZWdpb25EZXBlbmRlbmN5UmVzb2x2ZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmlld3MvcmVnaW9uTWFuYWdlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy9SZWdpb25EZXNjcmlwdG9yLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZpZXdzL3JlZ2lvbkRlc2NyaXB0b3JNYW5hZ2VyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZpZXdzL1JlZ2lvbkRlc2NyaXB0b3JEZXBlbmRlbmN5UmVzb2x2ZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmlld3MvRGF0YVZpZXdBdHRyaWJ1dGVFbGVtZW50VmlzaXRvci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy9EYXRhVmlld01vZGVsRmlsZUF0dHJpYnV0ZUVsZW1lbnRWaXNpdG9yLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2ludGVyYWN0aW9uL1Zpc3VhbFN0YXRlTWFuYWdlckVsZW1lbnRWaXNpdG9yLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L25hdmlnYXRpb24vTmF2aWdhdGlvbkZyYW1lLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L25hdmlnYXRpb24vbmF2aWdhdGVUby5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9uYXZpZ2F0aW9uL25hdmlnYXRpb25NYW5hZ2VyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L25hdmlnYXRpb24vb2JzZXJ2YWJsZVF1ZXJ5UGFyYW1ldGVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L25hdmlnYXRpb24vRGF0YU5hdmlnYXRpb25GcmFtZUF0dHJpYnV0ZUVsZW1lbnRWaXNpdG9yLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L25hdmlnYXRpb24vbmF2aWdhdGlvbkJpbmRpbmdIYW5kbGVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZhbHVlcy9UeXBlQ29udmVydGVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZhbHVlcy9OdW1iZXJUeXBlQ29udmVydGVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZhbHVlcy9EYXRlVHlwZUNvbnZlcnRlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWx1ZXMvU3RyaW5nVHlwZUNvbnZlcnRlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWx1ZXMvdHlwZUNvbnZlcnRlcnMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsdWVzL3R5cGVFeHRlbmRlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWx1ZXMvRm9ybWF0dGVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZhbHVlcy9EYXRlRm9ybWF0dGVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZhbHVlcy9zdHJpbmdGb3JtYXR0ZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsdWVzL3ZhbHVlUGlwZWxpbmUuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsdWVzL1ZhbHVlUHJvdmlkZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsdWVzL3ZhbHVlUHJvdmlkZXJzLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZhbHVlcy9WYWx1ZUNvbnN1bWVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZhbHVlcy92YWx1ZUNvbnN1bWVycy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWx1ZXMvQmluZGluZy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWx1ZXMvRGVmYXVsdFZhbHVlQ29uc3VtZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvY29uZmlndXJhdG9yLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3V0aWxzL2NvbmZpZ3VyZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEtBO0FBQ0E7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcmFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9OQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJCaWZyb3N0LmRldi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5mdW5jdGlvbiBwb2x5ZmlsbEZvckVhY2goKSB7XHJcbiAgICBpZiAodHlwZW9mIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaywgdGhpc0FyZykge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXNBcmcgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXNBcmcgPSB3aW5kb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHRoaXNbaV0sIGksIHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcG9seUZpbGxDbG9uZSgpIHtcclxuICAgIGlmICh0eXBlb2YgQXJyYXkucHJvdG90eXBlLmNsb25lICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNsaWNlKDApO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNoYWxsb3dFcXVhbHMoKSB7XHJcbiAgICBpZiAodHlwZW9mIEFycmF5LnByb3RvdHlwZS5zaGFsbG93RXF1YWxzICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUuc2hhbGxvd0VxdWFscyA9IGZ1bmN0aW9uIChvdGhlcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcyA9PT0gb3RoZXIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzID09PSBudWxsIHx8IG90aGVyID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMubGVuZ3RoICE9PSBvdGhlci5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpc1tpXSAhPT0gb3RoZXJbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5cclxuQXJyYXkucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xyXG4gICAgdGhpcy5zcGxpY2UoaW5kZXgsIDAsIGl0ZW0pO1xyXG59O1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgIHBvbHlmaWxsRm9yRWFjaCgpO1xyXG4gICAgcG9seUZpbGxDbG9uZSgpO1xyXG4gICAgc2hhbGxvd0VxdWFscygpO1xyXG59KSgpOyIsImlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGggPSBmdW5jdGlvbiAoc3RyKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0ci5sZW5ndGggPiAwICYmIHRoaXMuc3Vic3RyaW5nKDAsIHN0ci5sZW5ndGgpID09PSBzdHI7XHJcbiAgICB9O1xyXG59XHJcblxyXG5pZiAodHlwZW9mIFN0cmluZy5wcm90b3R5cGUuZW5kc1dpdGggIT09ICdmdW5jdGlvbicpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUuZW5kc1dpdGggPSBmdW5jdGlvbiAoc3RyKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0ci5sZW5ndGggPiAwICYmIHRoaXMuc3Vic3RyaW5nKHRoaXMubGVuZ3RoIC0gc3RyLmxlbmd0aCwgdGhpcy5sZW5ndGgpID09PSBzdHI7XHJcbiAgICB9O1xyXG59XHJcblxyXG5TdHJpbmcucHJvdG90eXBlLnJlcGxhY2VBbGwgPSBmdW5jdGlvbiAodG9SZXBsYWNlLCByZXBsYWNlbWVudCkge1xyXG4gICAgdmFyIHJlc3VsdCA9IHRoaXMuc3BsaXQodG9SZXBsYWNlKS5qb2luKHJlcGxhY2VtZW50KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG5TdHJpbmcucHJvdG90eXBlLnRvQ2FtZWxDYXNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHJlc3VsdCA9IHRoaXMuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgKyB0aGlzLnN1YnN0cmluZygxKTtcclxuICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlQWxsKFwiLVwiLCBcIlwiKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG5TdHJpbmcucHJvdG90eXBlLnRvUGFzY2FsQ2FzZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciByZXN1bHQgPSB0aGlzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdGhpcy5zdWJzdHJpbmcoMSk7XHJcbiAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZUFsbChcIi1cIiwgXCJcIik7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuU3RyaW5nLnByb3RvdHlwZS5oYXNoQ29kZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBjaGFyQ29kZSwgaGFzaCA9IDA7XHJcbiAgICBpZiAodGhpcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICByZXR1cm4gaGFzaDtcclxuICAgIH1cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNoYXJDb2RlID0gdGhpcy5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgIGhhc2ggPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIGNoYXJDb2RlO1xyXG4gICAgICAgIGhhc2ggPSBoYXNoICYgaGFzaDtcclxuICAgIH1cclxuICAgIHJldHVybiBoYXNoO1xyXG59OyIsIk5vZGVMaXN0LnByb3RvdHlwZS5mb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2g7XHJcbk5vZGVMaXN0LnByb3RvdHlwZS5sZW5ndGggPSBBcnJheS5wcm90b3R5cGUubGVuZ3RoOyIsIkhUTUxFbGVtZW50LnByb3RvdHlwZS5rbm93bkVsZW1lbnRUeXBlcyA9IFtcclxuICAgIFwiYVwiLFxyXG4gICAgXCJhYmJyXCIsXHJcbiAgICBcImFjcm9ueW1cIixcclxuICAgIFwiYWRkcmVzc1wiLFxyXG4gICAgXCJhcHBsZXRcIixcclxuICAgIFwiYXJlYVwiLFxyXG4gICAgXCJhcnRpY2xlXCIsXHJcbiAgICBcImFzaWRlXCIsXHJcbiAgICBcImF1ZGlvXCIsXHJcbiAgICBcImJcIixcclxuICAgIFwiYmFzZVwiLFxyXG4gICAgXCJiYXNlZm9udFwiLFxyXG4gICAgXCJiZGlcIixcclxuICAgIFwiYmRvXCIsXHJcbiAgICBcImJnc291bmRcIixcclxuICAgIFwiYmlnXCIsXHJcbiAgICBcImJsaW5rXCIsXHJcbiAgICBcImJsb2NrcXVvdGVcIixcclxuICAgIFwiYm9keVwiLFxyXG4gICAgXCJiclwiLFxyXG4gICAgXCJidXR0b25cIixcclxuICAgIFwiY2FudmFzXCIsXHJcbiAgICBcImNhcHRpb25cIixcclxuICAgIFwiY2VudGVyXCIsXHJcbiAgICBcImNpdGVcIixcclxuICAgIFwiY29sXCIsXHJcbiAgICBcImNvbGdyb3VwXCIsXHJcbiAgICBcImNvbnRlbnRcIixcclxuICAgIFwiY29kZVwiLFxyXG4gICAgXCJkYXRhXCIsXHJcbiAgICBcImRhdGFsaXN0XCIsXHJcbiAgICBcImRkXCIsXHJcbiAgICBcImRlY29yYXRvclwiLFxyXG4gICAgXCJkZWxcIixcclxuICAgIFwiZGV0YWlsc1wiLFxyXG4gICAgXCJkZm5cIixcclxuICAgIFwiZGlyXCIsXHJcbiAgICBcImRpdlwiLFxyXG4gICAgXCJkbFwiLFxyXG4gICAgXCJkdFwiLFxyXG4gICAgXCJlbVwiLFxyXG4gICAgXCJlbWJlZFwiLFxyXG4gICAgXCJmaWVsZHNldFwiLFxyXG4gICAgXCJmaWdjYXB0aW9uXCIsXHJcbiAgICBcImZpZ3VyZVwiLFxyXG4gICAgXCJmb250XCIsXHJcbiAgICBcImZvb3RlclwiLFxyXG4gICAgXCJmb3JtXCIsXHJcbiAgICBcImZyYW1lXCIsXHJcbiAgICBcImZyYW1lc2V0XCIsXHJcbiAgICBcImgxXCIsXHJcbiAgICBcImgyXCIsXHJcbiAgICBcImgzXCIsXHJcbiAgICBcImg0XCIsXHJcbiAgICBcImg1XCIsXHJcbiAgICBcImg2XCIsXHJcbiAgICBcImhlYWRcIixcclxuICAgIFwiaGVhZGVyXCIsXHJcbiAgICBcImhncm91cFwiLFxyXG4gICAgXCJoclwiLFxyXG4gICAgXCJodG1sXCIsXHJcbiAgICBcImlcIixcclxuICAgIFwiaWZyYW1lXCIsXHJcbiAgICBcImltZ1wiLFxyXG4gICAgXCJpbnB1dFwiLFxyXG4gICAgXCJpbnNcIixcclxuICAgIFwiaXNpbmRleFwiLFxyXG4gICAgXCJrYmRcIixcclxuICAgIFwia2V5Z2VuXCIsXHJcbiAgICBcImxhYmVsXCIsXHJcbiAgICBcImxlZ2VuZFwiLFxyXG4gICAgXCJsaVwiLFxyXG4gICAgXCJsaW5rXCIsXHJcbiAgICBcImxpc3RpbmdcIixcclxuICAgIFwibWFpblwiLFxyXG4gICAgXCJtYXBcIixcclxuICAgIFwibWFya1wiLFxyXG4gICAgXCJtYXJxdWVcIixcclxuICAgIFwibWVudVwiLFxyXG4gICAgXCJtZW51aXRlbVwiLFxyXG4gICAgXCJtZXRhXCIsXHJcbiAgICBcIm1ldGVyXCIsXHJcbiAgICBcIm5hdlwiLFxyXG4gICAgXCJub2JyXCIsXHJcbiAgICBcIm5vZnJhbWVzXCIsXHJcbiAgICBcIm5vc2NyaXB0XCIsXHJcbiAgICBcIm9iamVjdFwiLFxyXG4gICAgXCJvbFwiLFxyXG4gICAgXCJvcHRncm91cFwiLFxyXG4gICAgXCJvcHRpb25cIixcclxuICAgIFwib3V0cHV0XCIsXHJcbiAgICBcInBcIixcclxuICAgIFwicGFyYW1cIixcclxuICAgIFwicGxhaW50ZXh0XCIsXHJcbiAgICBcInByZVwiLFxyXG4gICAgXCJwcm9ncmVzc1wiLFxyXG4gICAgXCJxXCIsXHJcbiAgICBcInJwXCIsXHJcbiAgICBcInJ0XCIsXHJcbiAgICBcInJ1YnlcIixcclxuICAgIFwic1wiLFxyXG4gICAgXCJzYW1wXCIsXHJcbiAgICBcInNjcmlwdFwiLFxyXG4gICAgXCJzZWN0aW9uXCIsXHJcbiAgICBcInNlbGVjdFwiLFxyXG4gICAgXCJzaGFkb3dcIixcclxuICAgIFwic21hbGxcIixcclxuICAgIFwic291cmNlXCIsXHJcbiAgICBcInNwYWNlclwiLFxyXG4gICAgXCJzcGFuXCIsXHJcbiAgICBcInN0cmlrZVwiLFxyXG4gICAgXCJzdHJvbmdcIixcclxuICAgIFwic3R5bGVcIixcclxuICAgIFwic3ViXCIsXHJcbiAgICBcInN1bW1hcnlcIixcclxuICAgIFwic3VwXCIsXHJcbiAgICBcInRhYmxlXCIsXHJcbiAgICBcInRib2R5XCIsXHJcbiAgICBcInRkXCIsXHJcbiAgICBcInRlbXBsYXRlXCIsXHJcbiAgICBcInRleHRhcmVhXCIsXHJcbiAgICBcInRmb290XCIsXHJcbiAgICBcInRoXCIsXHJcbiAgICBcInRoZWFkXCIsXHJcbiAgICBcInRpbWVcIixcclxuICAgIFwidGl0bGVcIixcclxuICAgIFwidHJcIixcclxuICAgIFwidHJhY2tcIixcclxuICAgIFwidHRcIixcclxuICAgIFwidVwiLFxyXG4gICAgXCJ1bFwiLFxyXG4gICAgXCJ2YXJcIixcclxuICAgIFwidmlkZW9cIixcclxuICAgIFwid2JyXCIsXHJcbiAgICBcInhtcFwiXHJcbl07XHJcbkhUTUxFbGVtZW50LnByb3RvdHlwZS5pc0tub3duVHlwZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChcIkhUTUxVbmtub3duRWxlbWVudFwiKSkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkuaW5kZXhPZihcIkhUTUxVbmtub3duRWxlbWVudFwiKSA8IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaXNLbm93biA9IHRoaXMuY29uc3RydWN0b3IgIT09IEhUTUxFbGVtZW50O1xyXG4gICAgaWYgKGlzS25vd24gPT09IGZhbHNlKSB7XHJcbiAgICAgICAgdmFyIHRhZ05hbWUgPSB0aGlzLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBpc0tub3duID0gdGhpcy5rbm93bkVsZW1lbnRUeXBlcy5zb21lKGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGlmICh0YWdOYW1lID09PSB0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGlzS25vd247XHJcbn07XHJcbkhUTUxFbGVtZW50LnByb3RvdHlwZS5nZXRDaGlsZEVsZW1lbnRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGNoaWxkcmVuID0gW107XHJcbiAgICB0aGlzLmNoaWxkTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2gobm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbn07IiwiSFRNTENvbGxlY3Rpb24ucHJvdG90eXBlLmZvckVhY2ggPSBBcnJheS5wcm90b3R5cGUuZm9yRWFjaDtcclxuSFRNTENvbGxlY3Rpb24ucHJvdG90eXBlLmxlbmd0aCA9IEFycmF5LnByb3RvdHlwZS5sZW5ndGg7IiwiLy8gRnJvbSB0aGUgZm9sbG93aW5nIHRocmVhZCA6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTA1NjcyOC9mb3JtYXR0aW5nLWEtZGF0ZS1pbi1qYXZhc2NyaXB0XHJcbi8vIGF1dGhvcjogbWVpenpcclxuRGF0ZS5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24gKGZvcm1hdCkge1xyXG4gICAgdmFyIG8gPSB7XHJcbiAgICAgICAgXCJNK1wiOiB0aGlzLmdldE1vbnRoKCkgKyAxLCAvL21vbnRoXHJcbiAgICAgICAgXCJkK1wiOiB0aGlzLmdldERhdGUoKSwgICAgLy9kYXlcclxuICAgICAgICBcImgrXCI6IHRoaXMuZ2V0SG91cnMoKSwgICAvL2hvdXJcclxuICAgICAgICBcIm0rXCI6IHRoaXMuZ2V0TWludXRlcygpLCAvL21pbnV0ZVxyXG4gICAgICAgIFwicytcIjogdGhpcy5nZXRTZWNvbmRzKCksIC8vc2Vjb25kXHJcbiAgICAgICAgXCJxK1wiOiBNYXRoLmZsb29yKCh0aGlzLmdldE1vbnRoKCkgKyAzKSAvIDMpLCAgLy9xdWFydGVyXHJcbiAgICAgICAgXCJTXCI6IHRoaXMuZ2V0TWlsbGlzZWNvbmRzKCkgLy9taWxsaXNlY29uZFxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoLyh5KykvLnRlc3QoZm9ybWF0KSkge1xyXG4gICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKFJlZ0V4cC4kMSwgKHRoaXMuZ2V0RnVsbFllYXIoKSArIFwiXCIpLnN1YnN0cig0IC0gUmVnRXhwLiQxLmxlbmd0aCkpO1xyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgayBpbiBvKSB7XHJcbiAgICAgICAgaWYgKG5ldyBSZWdFeHAoXCIoXCIgKyBrICsgXCIpXCIpLnRlc3QoZm9ybWF0KSkge1xyXG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZShSZWdFeHAuJDEsXHJcbiAgICAgICAgICAgICAgUmVnRXhwLiQxLmxlbmd0aCA9PT0gMSA/IG9ba10gOlxyXG4gICAgICAgICAgICAgICAgKFwiMDBcIiArIG9ba10pLnN1YnN0cigoXCJcIiArIG9ba10pLmxlbmd0aCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBmb3JtYXQ7XHJcbn07IiwiLypcclxuICogY2xhc3NMaXN0LmpzOiBDcm9zcy1icm93c2VyIGZ1bGwgZWxlbWVudC5jbGFzc0xpc3QgaW1wbGVtZW50YXRpb24uXHJcbiAqIDIwMTItMTEtMTVcclxuICpcclxuICogQnkgRWxpIEdyZXksIGh0dHA6Ly9lbGlncmV5LmNvbVxyXG4gKiBQdWJsaWMgRG9tYWluLlxyXG4gKiBOTyBXQVJSQU5UWSBFWFBSRVNTRUQgT1IgSU1QTElFRC4gVVNFIEFUIFlPVVIgT1dOIFJJU0suXHJcbiAqL1xyXG5cclxuLypnbG9iYWwgc2VsZiwgZG9jdW1lbnQsIERPTUV4Y2VwdGlvbiAqL1xyXG5cclxuLyohIEBzb3VyY2UgaHR0cDovL3B1cmwuZWxpZ3JleS5jb20vZ2l0aHViL2NsYXNzTGlzdC5qcy9ibG9iL21hc3Rlci9jbGFzc0xpc3QuanMqL1xyXG5cclxuaWYgKFwiZG9jdW1lbnRcIiBpbiBzZWxmICYmICEoXHJcbiAgICAgICAgXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKSAmJlxyXG4gICAgICAgIFwiY2xhc3NMaXN0XCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCJzdmdcIilcclxuICAgICkpIHtcclxuXHJcbiAgICAoZnVuY3Rpb24gKHZpZXcpIHtcclxuXHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgICAgIGlmICghKCdFbGVtZW50JyBpbiB2aWV3KSkgcmV0dXJuO1xyXG5cclxuICAgICAgICB2YXJcclxuICAgICAgICAgICAgICBjbGFzc0xpc3RQcm9wID0gXCJjbGFzc0xpc3RcIlxyXG4gICAgICAgICAgICAsIHByb3RvUHJvcCA9IFwicHJvdG90eXBlXCJcclxuICAgICAgICAgICAgLCBlbGVtQ3RyUHJvdG8gPSB2aWV3LkVsZW1lbnRbcHJvdG9Qcm9wXVxyXG4gICAgICAgICAgICAsIG9iakN0ciA9IE9iamVjdFxyXG4gICAgICAgICAgICAsIHN0clRyaW0gPSBTdHJpbmdbcHJvdG9Qcm9wXS50cmltIHx8IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL15cXHMrfFxccyskL2csIFwiXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICwgYXJySW5kZXhPZiA9IEFycmF5W3Byb3RvUHJvcF0uaW5kZXhPZiB8fCBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyXHJcbiAgICAgICAgICAgICAgICAgICAgICBpID0gMFxyXG4gICAgICAgICAgICAgICAgICAgICwgbGVuID0gdGhpcy5sZW5ndGhcclxuICAgICAgICAgICAgICAgIDtcclxuICAgICAgICAgICAgICAgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIFZlbmRvcnM6IHBsZWFzZSBhbGxvdyBjb250ZW50IGNvZGUgdG8gaW5zdGFudGlhdGUgRE9NRXhjZXB0aW9uc1xyXG4gICAgICAgICAgICAsIERPTUV4ID0gZnVuY3Rpb24gKHR5cGUsIG1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmFtZSA9IHR5cGU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvZGUgPSBET01FeGNlcHRpb25bdHlwZV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICwgY2hlY2tUb2tlbkFuZEdldEluZGV4ID0gZnVuY3Rpb24gKGNsYXNzTGlzdCwgdG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbiA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBET01FeChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcIlNZTlRBWF9FUlJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAsIFwiQW4gaW52YWxpZCBvciBpbGxlZ2FsIHN0cmluZyB3YXMgc3BlY2lmaWVkXCJcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKC9cXHMvLnRlc3QodG9rZW4pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IERPTUV4KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiSU5WQUxJRF9DSEFSQUNURVJfRVJSXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgLCBcIlN0cmluZyBjb250YWlucyBhbiBpbnZhbGlkIGNoYXJhY3RlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBhcnJJbmRleE9mLmNhbGwoY2xhc3NMaXN0LCB0b2tlbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLCBDbGFzc0xpc3QgPSBmdW5jdGlvbiAoZWxlbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyXHJcbiAgICAgICAgICAgICAgICAgICAgICB0cmltbWVkQ2xhc3NlcyA9IHN0clRyaW0uY2FsbChlbGVtLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLCBjbGFzc2VzID0gdHJpbW1lZENsYXNzZXMgPyB0cmltbWVkQ2xhc3Nlcy5zcGxpdCgvXFxzKy8pIDogW11cclxuICAgICAgICAgICAgICAgICAgICAsIGkgPSAwXHJcbiAgICAgICAgICAgICAgICAgICAgLCBsZW4gPSBjbGFzc2VzLmxlbmd0aFxyXG4gICAgICAgICAgICAgICAgO1xyXG4gICAgICAgICAgICAgICAgZm9yICg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaChjbGFzc2VzW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHRoaXMudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICwgY2xhc3NMaXN0UHJvdG8gPSBDbGFzc0xpc3RbcHJvdG9Qcm9wXSA9IFtdXHJcbiAgICAgICAgICAgICwgY2xhc3NMaXN0R2V0dGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDbGFzc0xpc3QodGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICA7XHJcbiAgICAgICAgLy8gTW9zdCBET01FeGNlcHRpb24gaW1wbGVtZW50YXRpb25zIGRvbid0IGFsbG93IGNhbGxpbmcgRE9NRXhjZXB0aW9uJ3MgdG9TdHJpbmcoKVxyXG4gICAgICAgIC8vIG9uIG5vbi1ET01FeGNlcHRpb25zLiBFcnJvcidzIHRvU3RyaW5nKCkgaXMgc3VmZmljaWVudCBoZXJlLlxyXG4gICAgICAgIERPTUV4W3Byb3RvUHJvcF0gPSBFcnJvcltwcm90b1Byb3BdO1xyXG4gICAgICAgIGNsYXNzTGlzdFByb3RvLml0ZW0gPSBmdW5jdGlvbiAoaSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpc1tpXSB8fCBudWxsO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2xhc3NMaXN0UHJvdG8uY29udGFpbnMgPSBmdW5jdGlvbiAodG9rZW4pIHtcclxuICAgICAgICAgICAgdG9rZW4gKz0gXCJcIjtcclxuICAgICAgICAgICAgcmV0dXJuIGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbikgIT09IC0xO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2xhc3NMaXN0UHJvdG8uYWRkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXJcclxuICAgICAgICAgICAgICAgICAgdG9rZW5zID0gYXJndW1lbnRzXHJcbiAgICAgICAgICAgICAgICAsIGkgPSAwXHJcbiAgICAgICAgICAgICAgICAsIGwgPSB0b2tlbnMubGVuZ3RoXHJcbiAgICAgICAgICAgICAgICAsIHRva2VuXHJcbiAgICAgICAgICAgICAgICAsIHVwZGF0ZWQgPSBmYWxzZVxyXG4gICAgICAgICAgICA7XHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgIHRva2VuID0gdG9rZW5zW2ldICsgXCJcIjtcclxuICAgICAgICAgICAgICAgIGlmIChjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh0b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgd2hpbGUgKCsraSA8IGwpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHVwZGF0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjbGFzc0xpc3RQcm90by5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhclxyXG4gICAgICAgICAgICAgICAgICB0b2tlbnMgPSBhcmd1bWVudHNcclxuICAgICAgICAgICAgICAgICwgaSA9IDBcclxuICAgICAgICAgICAgICAgICwgbCA9IHRva2Vucy5sZW5ndGhcclxuICAgICAgICAgICAgICAgICwgdG9rZW5cclxuICAgICAgICAgICAgICAgICwgdXBkYXRlZCA9IGZhbHNlXHJcbiAgICAgICAgICAgIDtcclxuICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgd2hpbGUgKCsraSA8IGwpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHVwZGF0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjbGFzc0xpc3RQcm90by50b2dnbGUgPSBmdW5jdGlvbiAodG9rZW4sIGZvcnNlKSB7XHJcbiAgICAgICAgICAgIHRva2VuICs9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICB2YXJcclxuICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5jb250YWlucyh0b2tlbilcclxuICAgICAgICAgICAgICAgICwgbWV0aG9kID0gcmVzdWx0ID9cclxuICAgICAgICAgICAgICAgICAgICBmb3JzZSAhPT0gdHJ1ZSAmJiBcInJlbW92ZVwiXHJcbiAgICAgICAgICAgICAgICA6XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yc2UgIT09IGZhbHNlICYmIFwiYWRkXCJcclxuICAgICAgICAgICAgO1xyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGhvZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpc1ttZXRob2RdKHRva2VuKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuICFyZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjbGFzc0xpc3RQcm90by50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuam9pbihcIiBcIik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKG9iakN0ci5kZWZpbmVQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICB2YXIgY2xhc3NMaXN0UHJvcERlc2MgPSB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGNsYXNzTGlzdEdldHRlclxyXG4gICAgICAgICAgICAgICAgLCBlbnVtZXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAsIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgb2JqQ3RyLmRlZmluZVByb3BlcnR5KGVsZW1DdHJQcm90bywgY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0UHJvcERlc2MpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChleCkgeyAvLyBJRSA4IGRvZXNuJ3Qgc3VwcG9ydCBlbnVtZXJhYmxlOnRydWVcclxuICAgICAgICAgICAgICAgIGlmIChleC5udW1iZXIgPT09IC0weDdGRjVFQzU0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NMaXN0UHJvcERlc2MuZW51bWVyYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAob2JqQ3RyW3Byb3RvUHJvcF0uX19kZWZpbmVHZXR0ZXJfXykge1xyXG4gICAgICAgICAgICBlbGVtQ3RyUHJvdG8uX19kZWZpbmVHZXR0ZXJfXyhjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RHZXR0ZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KHNlbGYpKTtcclxufSIsIi8vIEZyb206IGh0dHA6Ly93d3cuam9uYXRoYW50bmVhbC5jb20vYmxvZy9mYWtpbmctdGhlLWZ1dHVyZS9cclxudGhpcy5FbGVtZW50ICYmIChmdW5jdGlvbiAoRWxlbWVudFByb3RvdHlwZSwgcG9seWZpbGwpIHtcclxuICAgIGZ1bmN0aW9uIE5vZGVMaXN0KCkgeyBbcG9seWZpbGxdIH1cclxuICAgIE5vZGVMaXN0LnByb3RvdHlwZS5sZW5ndGggPSBBcnJheS5wcm90b3R5cGUubGVuZ3RoO1xyXG5cclxuICAgIEVsZW1lbnRQcm90b3R5cGUubWF0Y2hlc1NlbGVjdG9yID0gRWxlbWVudFByb3RvdHlwZS5tYXRjaGVzU2VsZWN0b3IgfHxcclxuICAgIEVsZW1lbnRQcm90b3R5cGUubW96TWF0Y2hlc1NlbGVjdG9yIHx8XHJcbiAgICBFbGVtZW50UHJvdG90eXBlLm1zTWF0Y2hlc1NlbGVjdG9yIHx8XHJcbiAgICBFbGVtZW50UHJvdG90eXBlLm9NYXRjaGVzU2VsZWN0b3IgfHxcclxuICAgIEVsZW1lbnRQcm90b3R5cGUud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8XHJcbiAgICBmdW5jdGlvbiBtYXRjaGVzU2VsZWN0b3Ioc2VsZWN0b3IpIHtcclxuICAgICAgICB2YXIgcmVzdWx0cyA9IHRoaXMucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuICAgICAgICB2YXIgcmVzdWx0c0luZGV4ID0gLTE7XHJcblxyXG4gICAgICAgIHdoaWxlIChyZXN1bHRzWysrcmVzdWx0c0luZGV4XSAmJiByZXN1bHRzW3Jlc3VsdHNJbmRleF0gIT0gdGhpcykge31cclxuXHJcbiAgICAgICAgcmV0dXJuICEhcmVzdWx0c1tyZXN1bHRzSW5kZXhdO1xyXG4gICAgfTtcclxuXHJcbiAgICBFbGVtZW50UHJvdG90eXBlLmFuY2VzdG9yUXVlcnlTZWxlY3RvckFsbCA9IEVsZW1lbnRQcm90b3R5cGUuYW5jZXN0b3JRdWVyeVNlbGVjdG9yQWxsIHx8XHJcbiAgICBFbGVtZW50UHJvdG90eXBlLm1vekFuY2VzdG9yUXVlcnlTZWxlY3RvckFsbCB8fFxyXG4gICAgRWxlbWVudFByb3RvdHlwZS5tc0FuY2VzdG9yUXVlcnlTZWxlY3RvckFsbCB8fFxyXG4gICAgRWxlbWVudFByb3RvdHlwZS5vQW5jZXN0b3JRdWVyeVNlbGVjdG9yQWxsIHx8XHJcbiAgICBFbGVtZW50UHJvdG90eXBlLndlYmtpdEFuY2VzdG9yUXVlcnlTZWxlY3RvckFsbCB8fFxyXG4gICAgZnVuY3Rpb24gYW5jZXN0b3JRdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgZm9yICh2YXIgY2l0ZSA9IHRoaXMsIG5ld05vZGVMaXN0ID0gbmV3IE5vZGVMaXN0KCk7IGNpdGUgPSBjaXRlLnBhcmVudEVsZW1lbnQ7KSB7XHJcbiAgICAgICAgICAgIGlmIChjaXRlLm1hdGNoZXNTZWxlY3RvcihzZWxlY3RvcikpIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwobmV3Tm9kZUxpc3QsIGNpdGUpO1xyXG4gICAgICAgIH1cclxuIFxyXG4gICAgICAgIHJldHVybiBuZXdOb2RlTGlzdDtcclxuICAgIH07XHJcbiBcclxuICAgIEVsZW1lbnRQcm90b3R5cGUuYW5jZXN0b3JRdWVyeVNlbGVjdG9yID0gRWxlbWVudFByb3RvdHlwZS5hbmNlc3RvclF1ZXJ5U2VsZWN0b3IgfHxcclxuICAgIEVsZW1lbnRQcm90b3R5cGUubW96QW5jZXN0b3JRdWVyeVNlbGVjdG9yIHx8XHJcbiAgICBFbGVtZW50UHJvdG90eXBlLm1zQW5jZXN0b3JRdWVyeVNlbGVjdG9yIHx8XHJcbiAgICBFbGVtZW50UHJvdG90eXBlLm9BbmNlc3RvclF1ZXJ5U2VsZWN0b3IgfHxcclxuICAgIEVsZW1lbnRQcm90b3R5cGUud2Via2l0QW5jZXN0b3JRdWVyeVNlbGVjdG9yIHx8XHJcbiAgICBmdW5jdGlvbiBhbmNlc3RvclF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hbmNlc3RvclF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpWzBdIHx8IG51bGw7XHJcbiAgICB9O1xyXG59KShFbGVtZW50LnByb3RvdHlwZSk7IiwidmFyIEJpZnJvc3QgPSBCaWZyb3N0IHx8IHt9O1xyXG4oZnVuY3Rpb24oZ2xvYmFsLCB1bmRlZmluZWQpIHtcclxuICAgIEJpZnJvc3QuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kKGRlc3RpbmF0aW9uLCBzb3VyY2UpIHtcclxuICAgICAgICByZXR1cm4gJC5leHRlbmQoZGVzdGluYXRpb24sIHNvdXJjZSk7XHJcbiAgICB9O1xyXG59KSh3aW5kb3cpOyIsInZhciBCaWZyb3N0ID0gQmlmcm9zdCB8fCB7fTtcclxuQmlmcm9zdC5uYW1lc3BhY2UgPSBmdW5jdGlvbiAobnMsIGNvbnRlbnQpIHtcclxuXHJcbiAgICAvLyBUb2RvOiB0aGlzIHNob3VsZCBub3QgYmUgbmVlZGVkLCBpdCBpcyBhIHN5bXB0b20gb2Ygc29tZXRoaW5nIHVzaW5nIGl0IGJlaW5nIHdyb25nISEhIFNlIGlzc3VlICMyMzIgb24gR2l0SHViIChodHRwOi8vZ2l0aHViLmNvbS9kb2xpdHRsZS9CaWZyb3N0L2lzc3Vlcy8yMzIpXHJcbiAgICBucyA9IG5zLnJlcGxhY2VBbGwoXCIuLlwiLCBcIi5cIik7XHJcbiAgICBpZiAobnMuZW5kc1dpdGgoXCIuXCIpKSB7XHJcbiAgICAgICAgbnMgPSBucy5zdWJzdHIoMCwgbnMubGVuZ3RoIC0gMSk7XHJcbiAgICB9XHJcbiAgICBpZiAobnMuc3RhcnRzV2l0aChcIi5cIikpIHtcclxuICAgICAgICBucyA9IG5zLnN1YnN0cigxKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcGFyZW50ID0gd2luZG93O1xyXG4gICAgdmFyIG5hbWUgPSBcIlwiO1xyXG4gICAgdmFyIHBhcnRzID0gbnMuc3BsaXQoJy4nKTtcclxuICAgIHBhcnRzLmZvckVhY2goZnVuY3Rpb24gKHBhcnQpIHtcclxuICAgICAgICBpZiAobmFtZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIG5hbWUgKz0gXCIuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5hbWUgKz0gcGFydDtcclxuICAgICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJlbnQsIHBhcnQpKSB7XHJcbiAgICAgICAgICAgIHBhcmVudFtwYXJ0XSA9IHt9O1xyXG4gICAgICAgICAgICBwYXJlbnRbcGFydF0ucGFyZW50ID0gcGFyZW50O1xyXG4gICAgICAgICAgICBwYXJlbnRbcGFydF0ubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhcmVudCA9IHBhcmVudFtwYXJ0XTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmICh0eXBlb2YgY29udGVudCA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgIEJpZnJvc3QubmFtZXNwYWNlLmN1cnJlbnQgPSBwYXJlbnQ7XHJcblxyXG4gICAgICAgIHZhciBwcm9wZXJ0eTtcclxuXHJcbiAgICAgICAgZm9yIChwcm9wZXJ0eSBpbiBjb250ZW50KSB7XHJcbiAgICAgICAgICAgIHBhcmVudFtwcm9wZXJ0eV0gPSBjb250ZW50W3Byb3BlcnR5XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAocHJvcGVydHkgaW4gcGFyZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRbcHJvcGVydHldLl9uYW1lc3BhY2UgPSBwYXJlbnQ7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRbcHJvcGVydHldLl9uYW1lID0gcHJvcGVydHk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgQmlmcm9zdC5uYW1lc3BhY2UuY3VycmVudCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHBhcmVudDtcclxufTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuZXhlY3V0aW9uXCIsIHtcclxuICAgIFByb21pc2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuaWQgPSBCaWZyb3N0Lkd1aWQuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2lnbmFsbGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5lcnJvciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5oYXNGYWlsZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmZhaWxlZENhbGxiYWNrID0gbnVsbDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb25TaWduYWwoKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmNhbGxiYWNrICE9IG51bGwgJiYgdHlwZW9mIHNlbGYuY2FsbGJhY2sgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc2VsZi5zaWduYWxQYXJhbWV0ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNhbGxiYWNrKHNlbGYuc2lnbmFsUGFyYW1ldGVyLCBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jYWxsYmFjayhCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5mYWlsID0gZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmZhaWxlZENhbGxiYWNrICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuZmFpbGVkQ2FsbGJhY2soZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNlbGYuaGFzRmFpbGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgc2VsZi5lcnJvciA9IGVycm9yO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMub25GYWlsID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmhhc0ZhaWxlZCkge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soc2VsZi5lcnJvcik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmZhaWxlZENhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHNlbGY7XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2lnbmFsID0gZnVuY3Rpb24gKHBhcmFtZXRlcikge1xyXG4gICAgICAgICAgICBzZWxmLnNpZ25hbGxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHNlbGYuc2lnbmFsUGFyYW1ldGVyID0gcGFyYW1ldGVyO1xyXG4gICAgICAgICAgICBvblNpZ25hbCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY29udGludWVXaXRoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgICAgICAgICAgaWYgKHNlbGYuc2lnbmFsbGVkID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBvblNpZ25hbCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBwcm9taXNlID0gbmV3IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UoKTtcclxuICAgIHJldHVybiBwcm9taXNlO1xyXG59OyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBpc09iamVjdDogZnVuY3Rpb24gKG8pIHtcclxuICAgICAgICBpZiAobyA9PT0gbnVsbCB8fCB0eXBlb2YgbyA9PT0gXCJ1bmRlZmluZWRcIiApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pID09PSAnW29iamVjdCBPYmplY3RdJztcclxuICAgIH1cclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIGlzTnVtYmVyOiBmdW5jdGlvbiAobnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKEJpZnJvc3QuaXNTdHJpbmcobnVtYmVyKSkge1xyXG4gICAgICAgICAgICBpZiAobnVtYmVyLmxlbmd0aCA+IDEgJiYgbnVtYmVyWzBdID09PSAnMCcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG51bWJlcikpICYmIGlzRmluaXRlKG51bWJlcik7XHJcbiAgICB9XHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBpc0FycmF5IDogZnVuY3Rpb24obykge1xyXG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykgPT09ICdbb2JqZWN0IEFycmF5XSc7XHJcbiAgICB9XHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBpc1N0cmluZzogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIjtcclxuICAgICAgICB9XHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBpc051bGw6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbDtcclxuICAgIH1cclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIGlzVW5kZWZpbmVkOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcInVuZGVmaW5lZFwiO1xyXG4gICAgfVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgaXNOdWxsT3JVbmRlZmluZWQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiBCaWZyb3N0LmlzVW5kZWZpbmVkKHZhbHVlKSB8fCBCaWZyb3N0LmlzTnVsbCh2YWx1ZSk7XHJcbiAgICB9XHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBpc0Z1bmN0aW9uOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCI7XHJcbiAgICB9XHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBpc1R5cGU6IGZ1bmN0aW9uIChvKSB7XHJcbiAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQobykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHlwZW9mIG8uX3R5cGVJZCAhPT0gXCJ1bmRlZmluZWRcIjtcclxuICAgIH1cclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIGZ1bmN0aW9uUGFyc2VyOiB7XHJcbiAgICAgICAgcGFyc2U6IGZ1bmN0aW9uKGZ1bmMpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgdmFyIG1hdGNoID0gZnVuYy50b1N0cmluZygpLm1hdGNoKC9mdW5jdGlvblxcdypcXHMqXFwoKC4qPylcXCkvKTtcclxuICAgICAgICAgICAgaWYgKG1hdGNoICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZnVuY3Rpb25Bcmd1bWVudHMgPSBtYXRjaFsxXS5zcGxpdCgvXFxzKixcXHMqLyk7XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbkFyZ3VtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0udHJpbSgpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogaXRlbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBhc3NldHNNYW5hZ2VyOiB7XHJcbiAgICAgICAgc2NyaXB0czogW10sXHJcbiAgICAgICAgaXNJbml0aWFsaXplZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBCaWZyb3N0LmFzc2V0c01hbmFnZXIuc2NyaXB0cy5sZW5ndGggPiAwO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5hc3NldHNNYW5hZ2VyLmlzSW5pdGlhbGl6ZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgJC5nZXQoXCIvQmlmcm9zdC9Bc3NldHNNYW5hZ2VyXCIsIHsgZXh0ZW5zaW9uOiBcImpzXCIgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIEJpZnJvc3QuYXNzZXRzTWFuYWdlci5pbml0aWFsaXplRnJvbUFzc2V0cyhyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKCk7XHJcbiAgICAgICAgICAgICAgICB9LCBcImpzb25cIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW5pdGlhbGl6ZUZyb21Bc3NldHM6IGZ1bmN0aW9uIChhc3NldHMpIHtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmFzc2V0c01hbmFnZXIuaXNJbml0aWFsaXplZCgpKSB7XHJcbiAgICAgICAgICAgICAgICBCaWZyb3N0LmFzc2V0c01hbmFnZXIuc2NyaXB0cyA9IGFzc2V0cztcclxuICAgICAgICAgICAgICAgIEJpZnJvc3QubmFtZXNwYWNlcy5jcmVhdGUoKS5pbml0aWFsaXplKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldFNjcmlwdHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEJpZnJvc3QuYXNzZXRzTWFuYWdlci5zY3JpcHRzO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaGFzU2NyaXB0OiBmdW5jdGlvbihzY3JpcHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEJpZnJvc3QuYXNzZXRzTWFuYWdlci5zY3JpcHRzLnNvbWUoZnVuY3Rpb24gKHNjcmlwdEluU3lzdGVtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2NyaXB0SW5TeXN0ZW0gPT09IHNjcmlwdDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRTY3JpcHRQYXRoczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcGF0aHMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIEJpZnJvc3QuYXNzZXRzTWFuYWdlci5zY3JpcHRzLmZvckVhY2goZnVuY3Rpb24gKGZ1bGxQYXRoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGF0aCA9IEJpZnJvc3QuUGF0aC5nZXRQYXRoV2l0aG91dEZpbGVuYW1lKGZ1bGxQYXRoKTtcclxuICAgICAgICAgICAgICAgIGlmIChwYXRocy5pbmRleE9mKHBhdGgpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhdGhzLnB1c2gocGF0aCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcGF0aHM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy50eXBlcyA9IEJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIudHlwZXM7XHJcblxyXG4gICAgICAgIHRoaXMuY2FuUmVzb2x2ZSA9IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYudHlwZXMuaGFzT3duUHJvcGVydHkobmFtZSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXNvbHZlID0gZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi50eXBlc1tuYW1lXTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KTtcclxuXHJcbkJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIudHlwZXMgPSB7XHJcbiAgICBvcHRpb25zOiB7fVxyXG59O1xyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgZGVwZW5kZW5jeVJlc29sdmVyOiAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIHJlc29sdmVJbXBsZW1lbnRhdGlvbihuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIHJlc29sdmVycyA9IEJpZnJvc3QuZGVwZW5kZW5jeVJlc29sdmVycy5nZXRBbGwoKTtcclxuICAgICAgICAgICAgdmFyIHJlc29sdmVkU3lzdGVtID0gbnVsbDtcclxuICAgICAgICAgICAgcmVzb2x2ZXJzLmZvckVhY2goZnVuY3Rpb24gKHJlc29sdmVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzb2x2ZWRTeXN0ZW0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBjYW5SZXNvbHZlID0gcmVzb2x2ZXIuY2FuUmVzb2x2ZShuYW1lc3BhY2UsIG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhblJlc29sdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlZFN5c3RlbSA9IHJlc29sdmVyLnJlc29sdmUobmFtZXNwYWNlLCBuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVkU3lzdGVtO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaXNUeXBlKHN5c3RlbSkge1xyXG4gICAgICAgICAgICBpZiAoc3lzdGVtICE9IG51bGwgJiZcclxuICAgICAgICAgICAgICAgIHN5c3RlbS5fc3VwZXIgIT09IG51bGwpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHN5c3RlbS5fc3VwZXIgIT09IFwidW5kZWZpbmVkXCIgJiZcclxuICAgICAgICAgICAgICAgICAgICBzeXN0ZW0uX3N1cGVyID09PSBCaWZyb3N0LlR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNUeXBlKHN5c3RlbS5fc3VwZXIpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVN5c3RlbUluc3RhbmNlKHN5c3RlbSkge1xyXG4gICAgICAgICAgICBpZiAoaXNUeXBlKHN5c3RlbSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzeXN0ZW0uY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHN5c3RlbTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGJlZ2luSGFuZGxlU3lzdGVtSW5zdGFuY2Uoc3lzdGVtKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzeXN0ZW0gIT0gbnVsbCAmJlxyXG4gICAgICAgICAgICAgICAgc3lzdGVtLl9zdXBlciAhPT0gbnVsbCAmJlxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIHN5c3RlbS5fc3VwZXIgIT09IFwidW5kZWZpbmVkXCIgJiZcclxuICAgICAgICAgICAgICAgIHN5c3RlbS5fc3VwZXIgPT09IEJpZnJvc3QuVHlwZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHN5c3RlbS5iZWdpbkNyZWF0ZSgpLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAocmVzdWx0LCBuZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoc3lzdGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBnZXREZXBlbmRlbmNpZXNGb3I6IGZ1bmN0aW9uIChmdW5jKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGVwZW5kZW5jaWVzID0gW107XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyYW1ldGVycyA9IEJpZnJvc3QuZnVuY3Rpb25QYXJzZXIucGFyc2UoZnVuYyk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcmFtZXRlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXMucHVzaChwYXJhbWV0ZXJzW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlcGVuZGVuY2llcztcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGNhblJlc29sdmU6IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCByZXNvbHZlcnMgYW5kIGNoZWNrIGlmIGFueW9uZSBjYW4gcmVzb2x2ZSBpdCwgaWYgc28gcmV0dXJuIHRydWUgLSBpZiBub3QgZmFsc2VcclxuICAgICAgICAgICAgICAgIHZhciByZXNvbHZlcnMgPSBCaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlcnMuZ2V0QWxsKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FuUmVzb2x2ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlc29sdmVycy5mb3JFYWNoKGZ1bmN0aW9uIChyZXNvbHZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYW5SZXNvbHZlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhblJlc29sdmUgPSByZXNvbHZlci5jYW5SZXNvbHZlKG5hbWVzcGFjZSwgbmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FuUmVzb2x2ZTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHJlc29sdmU6IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXNvbHZlZFN5c3RlbSA9IHJlc29sdmVJbXBsZW1lbnRhdGlvbihuYW1lc3BhY2UsIG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZXNvbHZlZFN5c3RlbSA9PT0gXCJ1bmRlZmluZWRcIiB8fCByZXNvbHZlZFN5c3RlbSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5hYmxlIHRvIHJlc29sdmUgJ1wiICsgbmFtZSArIFwiJyBpbiAnXCIgKyBuYW1lc3BhY2UgKyBcIidcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QuVW5yZXNvbHZlZERlcGVuZGVuY2llcygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChyZXNvbHZlZFN5c3RlbSBpbnN0YW5jZW9mIEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIidcIiArIG5hbWUgKyBcIicgd2FzIHJlc29sdmVkIGFzIGFuIGFzeW5jaHJvbm91cyBkZXBlbmRlbmN5LCBjb25zaWRlciB1c2luZyBiZWdpbkNyZWF0ZSgpIG9yIG1ha2UgdGhlIGRlcGVuZGVuY3kgYXZhaWxhYmxlIHByaW9yIHRvIGNhbGxpbmcgY3JlYXRlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LkFzeW5jaHJvbm91c0RlcGVuZGVuY2llc0RldGVjdGVkKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZVN5c3RlbUluc3RhbmNlKHJlc29sdmVkU3lzdGVtKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGJlZ2luUmVzb2x2ZTogZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgQmlmcm9zdC5jb25maWd1cmUucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNvbHZlZFN5c3RlbSA9IHJlc29sdmVJbXBsZW1lbnRhdGlvbihuYW1lc3BhY2UsIG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzb2x2ZWRTeXN0ZW0gPT09IFwidW5kZWZpbmVkXCIgfHwgcmVzb2x2ZWRTeXN0ZW0gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbmFibGUgdG8gcmVzb2x2ZSAnXCIgKyBuYW1lICsgXCInIGluICdcIiArIG5hbWVzcGFjZSArIFwiJ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5mYWlsKG5ldyBCaWZyb3N0LlVucmVzb2x2ZWREZXBlbmRlbmNpZXMoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzb2x2ZWRTeXN0ZW0gaW5zdGFuY2VvZiBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVkU3lzdGVtLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoc3lzdGVtLCBpbm5lclByb21pc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlZ2luSGFuZGxlU3lzdGVtSW5zdGFuY2Uoc3lzdGVtKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoYWN0dWFsU3lzdGVtLCBuZXh0KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGhhbmRsZVN5c3RlbUluc3RhbmNlKGFjdHVhbFN5c3RlbSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkub25GYWlsKGZ1bmN0aW9uIChlKSB7IHByb21pc2UuZmFpbChlKTsgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGhhbmRsZVN5c3RlbUluc3RhbmNlKHJlc29sdmVkU3lzdGVtKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSkoKVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy5kZXBlbmRlbmN5UmVzb2x2ZXIgPSBCaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlcjsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgZGVwZW5kZW5jeVJlc29sdmVyczogKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBnZXRBbGw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXNvbHZlcnMgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IEJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIoKSxcclxuICAgICAgICAgICAgICAgICAgICBuZXcgQmlmcm9zdC5EZWZhdWx0RGVwZW5kZW5jeVJlc29sdmVyKCksXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IEJpZnJvc3QuS25vd25BcnRpZmFjdFR5cGVzRGVwZW5kZW5jeVJlc29sdmVyKCksXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IEJpZnJvc3QuS25vd25BcnRpZmFjdEluc3RhbmNlc0RlcGVuZGVuY3lSZXNvbHZlcigpLFxyXG5cclxuICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiB0aGlzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5LmluZGV4T2YoXCJfXCIpICE9PSAwICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzW3Byb3BlcnR5XSAhPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVycy5wdXNoKHRoaXNbcHJvcGVydHldKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZXJzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pKClcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIERlZmF1bHREZXBlbmRlbmN5UmVzb2x2ZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuZG9lc05hbWVzcGFjZUhhdmUgPSBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lc3BhY2UuaGFzT3duUHJvcGVydHkobmFtZSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5kb2VzTmFtZXNwYWNlSGF2ZVNjcmlwdFJlZmVyZW5jZSA9IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKG5hbWVzcGFjZS5oYXNPd25Qcm9wZXJ0eShcIl9zY3JpcHRzXCIpICYmIEJpZnJvc3QuaXNBcnJheShuYW1lc3BhY2UuX3NjcmlwdHMpKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hbWVzcGFjZS5fc2NyaXB0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzY3JpcHQgPSBuYW1lc3BhY2UuX3NjcmlwdHNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjcmlwdCA9PT0gbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0RmlsZU5hbWUgPSBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IFwiXCI7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbmFtZXNwYWNlLl9wYXRoICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlTmFtZSArPSBuYW1lc3BhY2UuX3BhdGg7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWZpbGVOYW1lLmVuZHNXaXRoKFwiL1wiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lICs9IFwiL1wiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZpbGVOYW1lICs9IG5hbWU7XHJcbiAgICAgICAgICAgIGlmICghZmlsZU5hbWUuZW5kc1dpdGgoXCIuanNcIikpIHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lICs9IFwiLmpzXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZmlsZU5hbWUgPSBmaWxlTmFtZS5yZXBsYWNlQWxsKFwiLy9cIiwgXCIvXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmlsZU5hbWU7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMubG9hZFNjcmlwdFJlZmVyZW5jZSA9IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUsIHByb21pc2UpIHtcclxuICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gc2VsZi5nZXRGaWxlTmFtZShuYW1lc3BhY2UsIG5hbWUpO1xyXG4gICAgICAgICAgICB2YXIgZmlsZSA9IEJpZnJvc3QuaW8uZmlsZUZhY3RvcnkuY3JlYXRlKCkuY3JlYXRlKGZpbGVOYW1lLCBCaWZyb3N0LmlvLmZpbGVUeXBlLmphdmFTY3JpcHQpO1xyXG5cclxuICAgICAgICAgICAgQmlmcm9zdC5pby5maWxlTWFuYWdlci5jcmVhdGUoKS5sb2FkKFtmaWxlXSkuY29udGludWVXaXRoKGZ1bmN0aW9uICh0eXBlcykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN5c3RlbSA9IHR5cGVzWzBdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuZG9lc05hbWVzcGFjZUhhdmUobmFtZXNwYWNlLCBuYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN5c3RlbSA9IG5hbWVzcGFjZVtuYW1lXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKHN5c3RlbSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICB0aGlzLmNhblJlc29sdmUgPSBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gbmFtZXNwYWNlO1xyXG4gICAgICAgICAgICB3aGlsZSAoY3VycmVudCAhPSBudWxsICYmIGN1cnJlbnQgIT09IHdpbmRvdykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuZG9lc05hbWVzcGFjZUhhdmUoY3VycmVudCwgbmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmRvZXNOYW1lc3BhY2VIYXZlU2NyaXB0UmVmZXJlbmNlKGN1cnJlbnQsIG5hbWUpICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnQgPT09IGN1cnJlbnQucGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnJlc29sdmUgPSBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gbmFtZXNwYWNlO1xyXG4gICAgICAgICAgICB3aGlsZSAoY3VycmVudCAhPSBudWxsICYmIGN1cnJlbnQgIT09IHdpbmRvdykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuZG9lc05hbWVzcGFjZUhhdmUoY3VycmVudCwgbmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudFtuYW1lXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmRvZXNOYW1lc3BhY2VIYXZlU2NyaXB0UmVmZXJlbmNlKGN1cnJlbnQsIG5hbWUpICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvYWRTY3JpcHRSZWZlcmVuY2UoY3VycmVudCwgbmFtZSwgcHJvbWlzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudCA9PT0gY3VycmVudC5wYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudDtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0pO1xyXG4iLCJCaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlcnMuRE9NUm9vdERlcGVuZGVuY3lSZXNvbHZlciA9IHtcclxuICAgIGNhblJlc29sdmU6IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gbmFtZSA9PT0gXCJET01Sb290XCI7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc29sdmU6IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYm9keSAhPSBudWxsICYmIHR5cGVvZiBkb2N1bWVudC5ib2R5ICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5ib2R5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIEJpZnJvc3QuZGVwZW5kZW5jeVJlc29sdmVycy5ET01Sb290RGVwZW5kZW5jeVJlc29sdmVyLnByb21pc2VzLnB1c2gocHJvbWlzZSk7XHJcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICB9XHJcbn07XHJcblxyXG5CaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlcnMuRE9NUm9vdERlcGVuZGVuY3lSZXNvbHZlci5wcm9taXNlcyA9IFtdO1xyXG5CaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlcnMuRE9NUm9vdERlcGVuZGVuY3lSZXNvbHZlci5kb2N1bWVudElzUmVhZHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBCaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlcnMuRE9NUm9vdERlcGVuZGVuY3lSZXNvbHZlci5wcm9taXNlcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9taXNlKSB7XHJcbiAgICAgICAgcHJvbWlzZS5zaWduYWwoZG9jdW1lbnQuYm9keSk7XHJcbiAgICB9KTtcclxufTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgS25vd25BcnRpZmFjdFR5cGVzRGVwZW5kZW5jeVJlc29sdmVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBzdXBwb3J0ZWRBcnRpZmFjdHMgPSB7XHJcbiAgICAgICAgICAgIHJlYWRNb2RlbFR5cGVzOiBCaWZyb3N0LnJlYWQuUmVhZE1vZGVsT2YsXHJcbiAgICAgICAgICAgIGNvbW1hbmRUeXBlczogQmlmcm9zdC5jb21tYW5kcy5Db21tYW5kLFxyXG4gICAgICAgICAgICBxdWVyeVR5cGVzOiBCaWZyb3N0LnJlYWQuUXVlcnlcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBpc01vcmVTcGVjaWZpY05hbWVzcGFjZShiYXNlLCBjb21wYXJlVG8pIHtcclxuICAgICAgICAgICAgdmFyIGlzRGVlcGVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBtYXRjaGVzYmFzZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdmFyIGJhc2VQYXJ0cyA9IGJhc2UubmFtZS5zcGxpdChcIi5cIik7XHJcbiAgICAgICAgICAgIHZhciBjb21wYXJlVG9QYXJ0cyA9IGNvbXBhcmVUby5uYW1lLnNwbGl0KFwiLlwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChiYXNlUGFydHMubGVuZ3RoID4gY29tcGFyZVRvUGFydHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmFzZVBhcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmFzZVBhcnRzW2ldICE9PSBjb21wYXJlVG9QYXJ0c1tpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY2FuUmVzb2x2ZSA9IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5hbWUgaW4gc3VwcG9ydGVkQXJ0aWZhY3RzO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucmVzb2x2ZSA9IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIHR5cGUgPSBzdXBwb3J0ZWRBcnRpZmFjdHNbbmFtZV07XHJcbiAgICAgICAgICAgIHZhciBleHRlbmRlcnMgPSB0eXBlLmdldEV4dGVuZGVyc0luKG5hbWVzcGFjZSk7XHJcbiAgICAgICAgICAgIHZhciByZXNvbHZlZFR5cGVzID0ge307XHJcblxyXG4gICAgICAgICAgICBleHRlbmRlcnMuZm9yRWFjaChmdW5jdGlvbiAoZXh0ZW5kZXIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gZXh0ZW5kZXIuX25hbWU7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzb2x2ZWRUeXBlc1tuYW1lXSAmJiAhaXNNb3JlU3BlY2lmaWNOYW1lc3BhY2UocmVzb2x2ZWRUeXBlc1tuYW1lXS5fbmFtZXNwYWNlLCBleHRlbmRlci5fbmFtZXNwYWNlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlZFR5cGVzW25hbWVdID0gZXh0ZW5kZXI7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVkVHlwZXM7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIEtub3duQXJ0aWZhY3RJbnN0YW5jZXNEZXBlbmRlbmN5UmVzb2x2ZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHN1cHBvcnRlZEFydGlmYWN0cyA9IHtcclxuICAgICAgICAgICAgcmVhZE1vZGVsczogQmlmcm9zdC5yZWFkLlJlYWRNb2RlbE9mLFxyXG4gICAgICAgICAgICBjb21tYW5kczogQmlmcm9zdC5jb21tYW5kcy5Db21tYW5kLFxyXG4gICAgICAgICAgICBxdWVyaWVzOiBCaWZyb3N0LnJlYWQuUXVlcnlcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBpc01vcmVTcGVjaWZpY05hbWVzcGFjZShiYXNlLCBjb21wYXJlVG8pIHtcclxuICAgICAgICAgICAgdmFyIGlzRGVlcGVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBtYXRjaGVzYmFzZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdmFyIGJhc2VQYXJ0cyA9IGJhc2UubmFtZS5zcGxpdChcIi5cIik7XHJcbiAgICAgICAgICAgIHZhciBjb21wYXJlVG9QYXJ0cyA9IGNvbXBhcmVUby5uYW1lLnNwbGl0KFwiLlwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChiYXNlUGFydHMubGVuZ3RoID4gY29tcGFyZVRvUGFydHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmFzZVBhcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmFzZVBhcnRzW2ldICE9PSBjb21wYXJlVG9QYXJ0c1tpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY2FuUmVzb2x2ZSA9IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5hbWUgaW4gc3VwcG9ydGVkQXJ0aWZhY3RzO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucmVzb2x2ZSA9IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIHR5cGUgPSBzdXBwb3J0ZWRBcnRpZmFjdHNbbmFtZV07XHJcbiAgICAgICAgICAgIHZhciBleHRlbmRlcnMgPSB0eXBlLmdldEV4dGVuZGVyc0luKG5hbWVzcGFjZSk7XHJcbiAgICAgICAgICAgIHZhciByZXNvbHZlZFR5cGVzID0ge307XHJcblxyXG4gICAgICAgICAgICBleHRlbmRlcnMuZm9yRWFjaChmdW5jdGlvbiAoZXh0ZW5kZXIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gZXh0ZW5kZXIuX25hbWU7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzb2x2ZWRUeXBlc1tuYW1lXSAmJiAhaXNNb3JlU3BlY2lmaWNOYW1lc3BhY2UocmVzb2x2ZWRUeXBlc1tuYW1lXS5fbmFtZXNwYWNlLCBleHRlbmRlci5fbmFtZXNwYWNlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlZFR5cGVzW25hbWVdID0gZXh0ZW5kZXI7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJlc29sdmVkSW5zdGFuY2VzID0ge307XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gcmVzb2x2ZWRUeXBlcykge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZWRJbnN0YW5jZXNbcHJvcF0gPSByZXNvbHZlZFR5cGVzW3Byb3BdLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZWRJbnN0YW5jZXM7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIEd1aWQgOiB7XHJcbiAgICAgICAgY3JlYXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gUzQoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKCgoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMCkgfCAwKS50b1N0cmluZygxNikuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAoUzQoKSArIFM0KCkgKyBcIi1cIiArIFM0KCkgKyBcIi1cIiArIFM0KCkgKyBcIi1cIiArIFM0KCkgKyBcIi1cIiArIFM0KCkgKyBTNCgpICsgUzQoKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbXB0eTogXCIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDBcIlxyXG4gICAgfVxyXG59KTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIFR5cGU6IGZ1bmN0aW9uICgpIHtcclxuICAgIH1cclxufSk7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gdGhyb3dJZk1pc3NpbmdUeXBlRGVmaW5pdGlvbih0eXBlRGVmaW5pdGlvbikge1xyXG4gICAgICAgIGlmICh0eXBlRGVmaW5pdGlvbiA9PSBudWxsIHx8IHR5cGVvZiB0eXBlRGVmaW5pdGlvbiA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC5NaXNzaW5nVHlwZURlZmluaXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGhyb3dJZlR5cGVEZWZpbml0aW9uSXNPYmplY3RMaXRlcmFsKHR5cGVEZWZpbml0aW9uKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0eXBlRGVmaW5pdGlvbiA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC5PYmplY3RMaXRlcmFsTm90QWxsb3dlZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhZGRTdGF0aWNQcm9wZXJ0aWVzKHR5cGVEZWZpbml0aW9uKSB7XHJcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gQmlmcm9zdC5UeXBlKSB7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LlR5cGUuaGFzT3duUHJvcGVydHkocHJvcGVydHkpICYmIHByb3BlcnR5ICE9PSBcIl9leHRlbmRlcnNcIikge1xyXG4gICAgICAgICAgICAgICAgdHlwZURlZmluaXRpb25bcHJvcGVydHldID0gQmlmcm9zdC5UeXBlW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZXR1cERlcGVuZGVuY2llcyh0eXBlRGVmaW5pdGlvbikge1xyXG4gICAgICAgIHR5cGVEZWZpbml0aW9uLl9kZXBlbmRlbmNpZXMgPSBCaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlci5nZXREZXBlbmRlbmNpZXNGb3IodHlwZURlZmluaXRpb24pO1xyXG5cclxuICAgICAgICB2YXIgZmlyc3RQYXJhbWV0ZXIgPSB0cnVlO1xyXG4gICAgICAgIHZhciBjcmVhdGVGdW5jdGlvblN0cmluZyA9IFwiRnVuY3Rpb24oJ2RlZmluaXRpb24nLCAnZGVwZW5kZW5jaWVzJywncmV0dXJuIG5ldyBkZWZpbml0aW9uKFwiO1xyXG5cclxuICAgICAgICBpZiggdHlwZW9mIHR5cGVEZWZpbml0aW9uLl9kZXBlbmRlbmNpZXMgIT09IFwidW5kZWZpbmVkXCIgKSB7XHJcbiAgICAgICAgICAgIHR5cGVEZWZpbml0aW9uLl9kZXBlbmRlbmNpZXMuZm9yRWFjaChmdW5jdGlvbihkZXBlbmRlbmN5LCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFmaXJzdFBhcmFtZXRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZUZ1bmN0aW9uU3RyaW5nICs9IFwiLFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZmlyc3RQYXJhbWV0ZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGNyZWF0ZUZ1bmN0aW9uU3RyaW5nICs9IFwiZGVwZW5kZW5jaWVzW1wiICsgaW5kZXggKyBcIl1cIjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNyZWF0ZUZ1bmN0aW9uU3RyaW5nICs9IFwiKTsnKVwiO1xyXG5cclxuICAgICAgICB0eXBlRGVmaW5pdGlvbi5jcmVhdGVGdW5jdGlvbiA9IGV2YWwoY3JlYXRlRnVuY3Rpb25TdHJpbmcpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldERlcGVuZGVuY3lJbnN0YW5jZXMobmFtZXNwYWNlLCB0eXBlRGVmaW5pdGlvbikge1xyXG4gICAgICAgIHZhciBkZXBlbmRlbmN5SW5zdGFuY2VzID0gW107XHJcbiAgICAgICAgaWYoIHR5cGVvZiB0eXBlRGVmaW5pdGlvbi5fZGVwZW5kZW5jaWVzICE9PSBcInVuZGVmaW5lZFwiICkge1xyXG4gICAgICAgICAgICB0eXBlRGVmaW5pdGlvbi5fZGVwZW5kZW5jaWVzLmZvckVhY2goZnVuY3Rpb24oZGVwZW5kZW5jeSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlcGVuZGVuY3lJbnN0YW5jZSA9IEJpZnJvc3QuZGVwZW5kZW5jeVJlc29sdmVyLnJlc29sdmUobmFtZXNwYWNlLCBkZXBlbmRlbmN5KTtcclxuICAgICAgICAgICAgICAgIGRlcGVuZGVuY3lJbnN0YW5jZXMucHVzaChkZXBlbmRlbmN5SW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlcGVuZGVuY3lJbnN0YW5jZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVzb2x2ZShuYW1lc3BhY2UsIGRlcGVuZGVuY3ksIGluZGV4LCBpbnN0YW5jZXMsIHR5cGVEZWZpbml0aW9uLCByZXNvbHZlZENhbGxiYWNrKSB7XHJcbiAgICAgICAgdmFyIHByb21pc2UgPVxyXG4gICAgICAgICAgICBCaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlclxyXG4gICAgICAgICAgICAgICAgLmJlZ2luUmVzb2x2ZShuYW1lc3BhY2UsIGRlcGVuZGVuY3kpXHJcbiAgICAgICAgICAgICAgICAuY29udGludWVXaXRoKGZ1bmN0aW9uKHJlc3VsdCwgbmV4dFByb21pc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZXNbaW5kZXhdID0gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVkQ2FsbGJhY2socmVzdWx0LCBuZXh0UHJvbWlzZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZnVuY3Rpb24gYmVnaW5HZXREZXBlbmRlbmN5SW5zdGFuY2VzKG5hbWVzcGFjZSwgdHlwZURlZmluaXRpb24sIGluc3RhbmNlSGFzaCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIHJlc29sdmVkKHJlc3VsdCwgbmV4dFByb21pc2UpIHtcclxuICAgICAgICAgICAgc29sdmVkRGVwZW5kZW5jaWVzKys7XHJcbiAgICAgICAgICAgIGlmIChzb2x2ZWREZXBlbmRlbmNpZXMgPT09IGRlcGVuZGVuY2llc1RvUmVzb2x2ZSkge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoZGVwZW5kZW5jeUluc3RhbmNlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuICAgICAgICB2YXIgZGVwZW5kZW5jeUluc3RhbmNlcyA9IFtdO1xyXG4gICAgICAgIHZhciBzb2x2ZWREZXBlbmRlbmNpZXMgPSAwO1xyXG4gICAgICAgIGlmKCB0eXBlb2YgdHlwZURlZmluaXRpb24uX2RlcGVuZGVuY2llcyAhPT0gXCJ1bmRlZmluZWRcIiApIHtcclxuICAgICAgICAgICAgdmFyIGRlcGVuZGVuY2llc1RvUmVzb2x2ZSA9IHR5cGVEZWZpbml0aW9uLl9kZXBlbmRlbmNpZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICB2YXIgYWN0dWFsRGVwZW5kZW5jeUluZGV4ID0gMDtcclxuICAgICAgICAgICAgdmFyIGRlcGVuZGVuY3kgPSBcIlwiO1xyXG4gICAgICAgICAgICBmb3IoIHZhciBkZXBlbmRlbmN5SW5kZXg9MDsgZGVwZW5kZW5jeUluZGV4PGRlcGVuZGVuY2llc1RvUmVzb2x2ZTsgZGVwZW5kZW5jeUluZGV4KysgKSB7XHJcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmN5ID0gdHlwZURlZmluaXRpb24uX2RlcGVuZGVuY2llc1tkZXBlbmRlbmN5SW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpbnN0YW5jZUhhc2ggJiYgaW5zdGFuY2VIYXNoLmhhc093blByb3BlcnR5KGRlcGVuZGVuY3kpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVwZW5kZW5jeUluc3RhbmNlc1tkZXBlbmRlbmN5SW5kZXhdID0gaW5zdGFuY2VIYXNoW2RlcGVuZGVuY3ldO1xyXG4gICAgICAgICAgICAgICAgICAgIHNvbHZlZERlcGVuZGVuY2llcysrO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzb2x2ZWREZXBlbmRlbmNpZXMgPT09IGRlcGVuZGVuY2llc1RvUmVzb2x2ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChkZXBlbmRlbmN5SW5zdGFuY2VzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUobmFtZXNwYWNlLCBkZXBlbmRlbmN5LCBkZXBlbmRlbmN5SW5kZXgsIGRlcGVuZGVuY3lJbnN0YW5jZXMsIHR5cGVEZWZpbml0aW9uLCByZXNvbHZlZCkub25GYWlsKHByb21pc2UuZmFpbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGV4cGFuZEluc3RhbmNlc0hhc2hUb0RlcGVuZGVuY2llcyh0eXBlRGVmaW5pdGlvbiwgaW5zdGFuY2VIYXNoLCBkZXBlbmRlbmN5SW5zdGFuY2VzKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0eXBlRGVmaW5pdGlvbi5fZGVwZW5kZW5jaWVzID09PSBcInVuZGVmaW5lZFwiIHx8IHR5cGVEZWZpbml0aW9uLl9kZXBlbmRlbmNpZXMgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciggdmFyIGRlcGVuZGVuY3kgaW4gaW5zdGFuY2VIYXNoICkge1xyXG4gICAgICAgICAgICBmb3IoIHZhciBkZXBlbmRlbmN5SW5kZXg9MDsgZGVwZW5kZW5jeUluZGV4PHR5cGVEZWZpbml0aW9uLl9kZXBlbmRlbmNpZXMubGVuZ3RoOyBkZXBlbmRlbmN5SW5kZXgrKyApIHtcclxuICAgICAgICAgICAgICAgIGlmKCB0eXBlRGVmaW5pdGlvbi5fZGVwZW5kZW5jaWVzW2RlcGVuZGVuY3lJbmRleF0gPT09IGRlcGVuZGVuY3kgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVwZW5kZW5jeUluc3RhbmNlc1tkZXBlbmRlbmN5SW5kZXhdID0gaW5zdGFuY2VIYXNoW2RlcGVuZGVuY3ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGV4cGFuZERlcGVuZGVuY2llc1RvSW5zdGFuY2VIYXNoKHR5cGVEZWZpbml0aW9uLCBkZXBlbmRlbmNpZXMsIGluc3RhbmNlSGFzaCkge1xyXG4gICAgICAgIGZvciggdmFyIGRlcGVuZGVuY3lJbmRleD0wOyBkZXBlbmRlbmN5SW5kZXg8ZGVwZW5kZW5jaWVzLmxlbmd0aDsgZGVwZW5kZW5jeUluZGV4KysgKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlSGFzaFt0eXBlRGVmaW5pdGlvbi5fZGVwZW5kZW5jaWVzW2RlcGVuZGVuY3lJbmRleF1dID0gZGVwZW5kZW5jaWVzW2RlcGVuZGVuY3lJbmRleF07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlc29sdmVEZXBlbmRlbmN5SW5zdGFuY2VzVGhhdEhhc05vdEJlZW5SZXNvbHZlZChkZXBlbmRlbmN5SW5zdGFuY2VzLCB0eXBlRGVmaW5pdGlvbikge1xyXG4gICAgICAgIGRlcGVuZGVuY3lJbnN0YW5jZXMuZm9yRWFjaChmdW5jdGlvbihkZXBlbmRlbmN5SW5zdGFuY2UsIGluZGV4KSB7XHJcbiAgICAgICAgICAgIGlmKCBkZXBlbmRlbmN5SW5zdGFuY2UgPT0gbnVsbCB8fCB0eXBlb2YgZGVwZW5kZW5jeUluc3RhbmNlID09PSBcInVuZGVmaW5lZFwiICkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlcGVuZGVuY3kgPSB0eXBlRGVmaW5pdGlvbi5fZGVwZW5kZW5jaWVzW2luZGV4XTtcclxuICAgICAgICAgICAgICAgIGRlcGVuZGVuY3lJbnN0YW5jZXNbaW5kZXhdID0gQmlmcm9zdC5kZXBlbmRlbmN5UmVzb2x2ZXIucmVzb2x2ZSh0eXBlRGVmaW5pdGlvbi5fbmFtZXNwYWNlLCBkZXBlbmRlbmN5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlc29sdmVEZXBlbmRlbmN5SW5zdGFuY2VzKGluc3RhbmNlSGFzaCwgdHlwZURlZmluaXRpb24pIHtcclxuICAgICAgICB2YXIgZGVwZW5kZW5jeUluc3RhbmNlcyA9IFtdO1xyXG4gICAgICAgIGlmKCB0eXBlb2YgaW5zdGFuY2VIYXNoID09PSBcIm9iamVjdFwiICkge1xyXG4gICAgICAgICAgICBleHBhbmRJbnN0YW5jZXNIYXNoVG9EZXBlbmRlbmNpZXModHlwZURlZmluaXRpb24sIGluc3RhbmNlSGFzaCwgZGVwZW5kZW5jeUluc3RhbmNlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0eXBlb2YgdHlwZURlZmluaXRpb24uX2RlcGVuZGVuY2llcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlRGVmaW5pdGlvbi5fZGVwZW5kZW5jaWVzLmxlbmd0aCA+IDAgKSB7XHJcbiAgICAgICAgICAgIGlmKCBkZXBlbmRlbmN5SW5zdGFuY2VzLmxlbmd0aCA+IDAgKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlRGVwZW5kZW5jeUluc3RhbmNlc1RoYXRIYXNOb3RCZWVuUmVzb2x2ZWQoZGVwZW5kZW5jeUluc3RhbmNlcywgdHlwZURlZmluaXRpb24pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jeUluc3RhbmNlcyA9IGdldERlcGVuZGVuY3lJbnN0YW5jZXModHlwZURlZmluaXRpb24uX25hbWVzcGFjZSwgdHlwZURlZmluaXRpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZXBlbmRlbmN5SW5zdGFuY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFkZE1pc3NpbmdEZXBlbmRlbmNpZXNBc051bGxGcm9tVHlwZURlZmluaXRpb24oaW5zdGFuY2VIYXNoLCB0eXBlRGVmaW5pdGlvbikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdHlwZURlZmluaXRpb24uX2RlcGVuZGVuY2llcyA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2YgaW5zdGFuY2VIYXNoID09PSBcInVuZGVmaW5lZFwiIHx8IGluc3RhbmNlSGFzaCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKCB2YXIgaW5kZXg9MDsgaW5kZXg8dHlwZURlZmluaXRpb24uX2RlcGVuZGVuY2llcy5sZW5ndGg7IGluZGV4KysgKSB7XHJcbiAgICAgICAgICAgIHZhciBkZXBlbmRlbmN5ID0gdHlwZURlZmluaXRpb24uX2RlcGVuZGVuY2llc1tpbmRleF07XHJcbiAgICAgICAgICAgIGlmICghKGRlcGVuZGVuY3kgaW4gaW5zdGFuY2VIYXNoKSkge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VIYXNoW2RlcGVuZGVuY3ldID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBoYW5kbGVPbkNyZWF0ZSh0eXBlLCBsYXN0RGVzY2VuZGFudCwgY3VycmVudEluc3RhbmNlKSB7XHJcbiAgICAgICAgaWYgKGN1cnJlbnRJbnN0YW5jZSA9PSBudWxsIHx8IHR5cGVvZiBjdXJyZW50SW5zdGFuY2UgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIHR5cGVvZiB0eXBlICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiB0eXBlLnByb3RvdHlwZSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcclxuICAgICAgICAgICAgaGFuZGxlT25DcmVhdGUodHlwZS5fc3VwZXIsIGxhc3REZXNjZW5kYW50LCB0eXBlLnByb3RvdHlwZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiggY3VycmVudEluc3RhbmNlLmhhc093blByb3BlcnR5KFwib25DcmVhdGVkXCIpICYmIHR5cGVvZiBjdXJyZW50SW5zdGFuY2Uub25DcmVhdGVkID09PSBcImZ1bmN0aW9uXCIgKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5vbkNyZWF0ZWQobGFzdERlc2NlbmRhbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBCaWZyb3N0LlR5cGUuX2V4dGVuZGVycyA9IFtdO1xyXG5cclxuICAgIEJpZnJvc3QuVHlwZS5zY29wZSA9IHtcclxuICAgICAgICBnZXRGb3IgOiBmdW5jdGlvbihuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBCaWZyb3N0LlR5cGUudHlwZU9mID0gZnVuY3Rpb24gKHR5cGUpIHtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9zdXBlciA9PT0gXCJ1bmRlZmluZWRcIiB8fFxyXG4gICAgICAgICAgICB0eXBlb2YgdGhpcy5fc3VwZXIuX3R5cGVJZCA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fc3VwZXIuX3R5cGVJZCA9PT0gdHlwZS5fdHlwZUlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiB0eXBlLl9zdXBlciAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICB2YXIgaXNUeXBlID0gdGhpcy5fc3VwZXIudHlwZU9mKHR5cGUpO1xyXG4gICAgICAgICAgICBpZiAoaXNUeXBlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgQmlmcm9zdC5UeXBlLmdldEV4dGVuZGVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZXh0ZW5kZXJzO1xyXG4gICAgfTtcclxuXHJcbiAgICBCaWZyb3N0LlR5cGUuZ2V0RXh0ZW5kZXJzSW4gPSBmdW5jdGlvbiAobmFtZXNwYWNlKSB7XHJcbiAgICAgICAgdmFyIGluTmFtZXNwYWNlID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuX2V4dGVuZGVycy5mb3JFYWNoKGZ1bmN0aW9uIChleHRlbmRlcikge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudCA9IG5hbWVzcGFjZTtcclxuICAgICAgICAgICAgd2hpbGUgKGN1cnJlbnQgIT09IHdpbmRvdykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGV4dGVuZGVyLl9uYW1lc3BhY2UgPT09IGN1cnJlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbk5hbWVzcGFjZS5wdXNoKGV4dGVuZGVyKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC5pc1VuZGVmaW5lZChjdXJyZW50LnBhcmVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGluTmFtZXNwYWNlO1xyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgIEJpZnJvc3QuVHlwZS5leHRlbmQgPSBmdW5jdGlvbiAodHlwZURlZmluaXRpb24pIHtcclxuICAgICAgICB0aHJvd0lmTWlzc2luZ1R5cGVEZWZpbml0aW9uKHR5cGVEZWZpbml0aW9uKTtcclxuICAgICAgICB0aHJvd0lmVHlwZURlZmluaXRpb25Jc09iamVjdExpdGVyYWwodHlwZURlZmluaXRpb24pO1xyXG5cclxuICAgICAgICBhZGRTdGF0aWNQcm9wZXJ0aWVzKHR5cGVEZWZpbml0aW9uKTtcclxuICAgICAgICBzZXR1cERlcGVuZGVuY2llcyh0eXBlRGVmaW5pdGlvbik7XHJcbiAgICAgICAgdHlwZURlZmluaXRpb24uX3N1cGVyID0gdGhpcztcclxuICAgICAgICB0eXBlRGVmaW5pdGlvbi5fdHlwZUlkID0gQmlmcm9zdC5HdWlkLmNyZWF0ZSgpO1xyXG4gICAgICAgIHR5cGVEZWZpbml0aW9uLl9leHRlbmRlcnMgPSBbXTtcclxuICAgICAgICBCaWZyb3N0LlR5cGUucmVnaXN0ZXJFeHRlbmRlcih0aGlzLCB0eXBlRGVmaW5pdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVEZWZpbml0aW9uO1xyXG4gICAgfTtcclxuXHJcbiAgICBCaWZyb3N0LlR5cGUucmVnaXN0ZXJFeHRlbmRlciA9IGZ1bmN0aW9uICh0eXBlRXh0ZW5kZWQsIHR5cGVEZWZpbmVkKSB7XHJcbiAgICAgICAgdmFyIHN1cGVyVHlwZSA9IHR5cGVFeHRlbmRlZDtcclxuXHJcbiAgICAgICAgd2hpbGUgKHN1cGVyVHlwZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChzdXBlclR5cGUuX2V4dGVuZGVycy5pbmRleE9mKHR5cGVEZWZpbmVkKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyVHlwZS5fZXh0ZW5kZXJzLnB1c2godHlwZURlZmluZWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN1cGVyVHlwZSA9IHN1cGVyVHlwZS5fc3VwZXI7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBCaWZyb3N0LlR5cGUuc2NvcGVUbyA9IGZ1bmN0aW9uKHNjb3BlKSB7XHJcbiAgICAgICAgaWYoIHR5cGVvZiBzY29wZSA9PT0gXCJmdW5jdGlvblwiICkge1xyXG4gICAgICAgICAgICB0aGlzLnNjb3BlID0ge1xyXG4gICAgICAgICAgICAgICAgZ2V0Rm9yOiBzY29wZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmKCB0eXBlb2Ygc2NvcGUuZ2V0Rm9yID09PSBcImZ1bmN0aW9uXCIgKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3BlID0gc2NvcGU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3BlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGdldEZvcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2NvcGU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgQmlmcm9zdC5UeXBlLmRlZmF1bHRTY29wZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuc2NvcGUgPSB7XHJcbiAgICAgICAgICAgIGdldEZvcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIEJpZnJvc3QuVHlwZS5yZXF1aXJlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmb3IgKHZhciBhcmd1bWVudEluZGV4ID0gMDsgYXJndW1lbnRJbmRleCA8IGFyZ3VtZW50cy5sZW5ndGg7IGFyZ3VtZW50SW5kZXgrKykge1xyXG4gICAgICAgICAgICB0aGlzLl9kZXBlbmRlbmNpZXMucHVzaChhcmd1bWVudHNbYXJndW1lbnRJbmRleF0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIEJpZnJvc3QuVHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoaW5zdGFuY2VIYXNoLCBpc1N1cGVyKSB7XHJcbiAgICAgICAgdmFyIGFjdHVhbFR5cGUgPSB0aGlzO1xyXG4gICAgICAgIGlmKCB0aGlzLl9zdXBlciAhPSBudWxsICkge1xyXG4gICAgICAgICAgICBhY3R1YWxUeXBlLnByb3RvdHlwZSA9IHRoaXMuX3N1cGVyLmNyZWF0ZShpbnN0YW5jZUhhc2gsIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhZGRNaXNzaW5nRGVwZW5kZW5jaWVzQXNOdWxsRnJvbVR5cGVEZWZpbml0aW9uKGluc3RhbmNlSGFzaCwgdGhpcyk7XHJcbiAgICAgICAgdmFyIHNjb3BlID0gbnVsbDtcclxuICAgICAgICBpZiggdGhpcyAhPT0gQmlmcm9zdC5UeXBlICkge1xyXG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlc1BlclNjb3BlID0gdGhpcy5pbnN0YW5jZXNQZXJTY29wZSB8fCB7fTtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlID0gdGhpcy5zY29wZS5nZXRGb3IodGhpcy5fbmFtZXNwYWNlLCB0aGlzLl9uYW1lLCB0aGlzLl90eXBlSWQpO1xyXG4gICAgICAgICAgICBpZiAoc2NvcGUgIT0gbnVsbCAmJiB0aGlzLmluc3RhbmNlc1BlclNjb3BlLmhhc093blByb3BlcnR5KHNjb3BlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VzUGVyU2NvcGVbc2NvcGVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaW5zdGFuY2UgPSBudWxsO1xyXG4gICAgICAgIGlmKCB0eXBlb2YgdGhpcy5jcmVhdGVGdW5jdGlvbiAhPT0gXCJ1bmRlZmluZWRcIiApIHtcclxuICAgICAgICAgICAgdmFyIGRlcGVuZGVuY3lJbnN0YW5jZXMgPSByZXNvbHZlRGVwZW5kZW5jeUluc3RhbmNlcyhpbnN0YW5jZUhhc2gsIHRoaXMpO1xyXG4gICAgICAgICAgICBpbnN0YW5jZSA9IHRoaXMuY3JlYXRlRnVuY3Rpb24odGhpcywgZGVwZW5kZW5jeUluc3RhbmNlcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaW5zdGFuY2UgPSBuZXcgYWN0dWFsVHlwZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5zdGFuY2UuX3R5cGUgPSBhY3R1YWxUeXBlO1xyXG5cclxuICAgICAgICBpZiggaXNTdXBlciAhPT0gdHJ1ZSApIHtcclxuICAgICAgICAgICAgaGFuZGxlT25DcmVhdGUoYWN0dWFsVHlwZSwgaW5zdGFuY2UsIGluc3RhbmNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCBzY29wZSAhPSBudWxsICkge1xyXG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlc1BlclNjb3BlW3Njb3BlXSA9IGluc3RhbmNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfTtcclxuXHJcbiAgICBCaWZyb3N0LlR5cGUuY3JlYXRlV2l0aG91dFNjb3BlID0gZnVuY3Rpb24gKGluc3RhbmNlSGFzaCwgaXNTdXBlcikge1xyXG4gICAgICAgIHZhciBzY29wZSA9IHRoaXMuc2NvcGU7XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0U2NvcGUoKTtcclxuICAgICAgICB2YXIgaW5zdGFuY2UgPSB0aGlzLmNyZWF0ZShpbnN0YW5jZUhhc2gsIGlzU3VwZXIpO1xyXG4gICAgICAgIHRoaXMuc2NvcGUgPSBzY29wZTtcclxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICB9O1xyXG5cclxuICAgIEJpZnJvc3QuVHlwZS5lbnN1cmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICB2YXIgbG9hZGVkRGVwZW5kZW5jaWVzID0gMDtcclxuICAgICAgICB2YXIgZGVwZW5kZW5jaWVzVG9SZXNvbHZlID0gdGhpcy5fZGVwZW5kZW5jaWVzLmxlbmd0aDtcclxuICAgICAgICB2YXIgbmFtZXNwYWNlID0gdGhpcy5fbmFtZXNwYWNlO1xyXG4gICAgICAgIHZhciByZXNvbHZlciA9IEJpZnJvc3QuZGVwZW5kZW5jeVJlc29sdmVyO1xyXG4gICAgICAgIGlmIChkZXBlbmRlbmNpZXNUb1Jlc29sdmUgPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlcGVuZGVuY2llcy5mb3JFYWNoKGZ1bmN0aW9uIChkZXBlbmRlbmN5KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlc29sdmVyLmNhblJlc29sdmUobmFtZXNwYWNlLCBkZXBlbmRlbmN5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVyLmJlZ2luUmVzb2x2ZShuYW1lc3BhY2UsIGRlcGVuZGVuY3kpLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAocmVzb2x2ZWRTeXN0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGVkRGVwZW5kZW5jaWVzKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb2FkZWREZXBlbmRlbmNpZXMgPT09IGRlcGVuZGVuY2llc1RvUmVzb2x2ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXNUb1Jlc29sdmUtLTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobG9hZGVkRGVwZW5kZW5jaWVzID09PSBkZXBlbmRlbmNpZXNUb1Jlc29sdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgfTtcclxuXHJcbiAgICBCaWZyb3N0LlR5cGUuYmVnaW5DcmVhdGUgPSBmdW5jdGlvbihpbnN0YW5jZUhhc2gpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuICAgICAgICB2YXIgc3VwZXJQcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuICAgICAgICBzdXBlclByb21pc2Uub25GYWlsKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIHByb21pc2UuZmFpbChlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMuX3N1cGVyICE9IG51bGwgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1cGVyLmJlZ2luQ3JlYXRlKGluc3RhbmNlSGFzaCkuY29udGludWVXaXRoKGZ1bmN0aW9uIChfc3VwZXIsIG5leHRQcm9taXNlKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlclByb21pc2Uuc2lnbmFsKF9zdXBlcik7XHJcbiAgICAgICAgICAgIH0pLm9uRmFpbChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5mYWlsKGUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzdXBlclByb21pc2Uuc2lnbmFsKG51bGwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3VwZXJQcm9taXNlLmNvbnRpbnVlV2l0aChmdW5jdGlvbihfc3VwZXIsIG5leHRQcm9taXNlKSB7XHJcbiAgICAgICAgICAgIHNlbGYucHJvdG90eXBlID0gX3N1cGVyO1xyXG5cclxuICAgICAgICAgICAgaWYoIHNlbGYuX2RlcGVuZGVuY2llcyA9PSBudWxsIHx8XHJcbiAgICAgICAgICAgICAgICB0eXBlb2Ygc2VsZi5fZGVwZW5kZW5jaWVzID09PSBcInVuZGVmaW5lZFwiIHx8XHJcbiAgICAgICAgICAgICAgICBzZWxmLl9kZXBlbmRlbmNpZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBzZWxmLmNyZWF0ZShpbnN0YW5jZUhhc2gpO1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYmVnaW5HZXREZXBlbmRlbmN5SW5zdGFuY2VzKHNlbGYuX25hbWVzcGFjZSwgc2VsZiwgaW5zdGFuY2VIYXNoKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jb250aW51ZVdpdGgoZnVuY3Rpb24oZGVwZW5kZW5jaWVzLCBuZXh0UHJvbWlzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVwZW5kZW5jeUluc3RhbmNlcyA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBleHBhbmREZXBlbmRlbmNpZXNUb0luc3RhbmNlSGFzaChzZWxmLCBkZXBlbmRlbmNpZXMsIGRlcGVuZGVuY3lJbnN0YW5jZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggdHlwZW9mIGluc3RhbmNlSGFzaCA9PT0gXCJvYmplY3RcIiApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciggdmFyIHByb3BlcnR5IGluIGluc3RhbmNlSGFzaCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXBlbmRlbmN5SW5zdGFuY2VzW3Byb3BlcnR5XSA9IGluc3RhbmNlSGFzaFtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBzZWxmLmNyZWF0ZShkZXBlbmRlbmN5SW5zdGFuY2VzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5mYWlsKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgfTtcclxufSkoKTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgU2luZ2xldG9uOiBmdW5jdGlvbiAodHlwZURlZmluaXRpb24pIHtcclxuICAgICAgICByZXR1cm4gQmlmcm9zdC5UeXBlLmV4dGVuZCh0eXBlRGVmaW5pdGlvbikuc2NvcGVUbyh3aW5kb3cpO1xyXG4gICAgfVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudHlwZXNcIiwge1xyXG4gICAgVHlwZUluZm86IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IFtdO1xyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QudHlwZXMuVHlwZUluZm8uY3JlYXRlRnJvbSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xyXG4gICAgdmFyIHR5cGVJbmZvID0gQmlmcm9zdC50eXBlcy5UeXBlSW5mby5jcmVhdGUoKTtcclxuICAgIHZhciBwcm9wZXJ0eUluZm87XHJcbiAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBpbnN0YW5jZSkge1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IGluc3RhbmNlW3Byb3BlcnR5XTtcclxuICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodmFsdWUpKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgdHlwZSA9IHZhbHVlLmNvbnN0cnVjdG9yO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGluc3RhbmNlW3Byb3BlcnR5XS5fdHlwZSkpIHtcclxuICAgICAgICAgICAgICAgIHR5cGUgPSBpbnN0YW5jZVtwcm9wZXJ0eV0uX3R5cGU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHByb3BlcnR5SW5mbyA9IEJpZnJvc3QudHlwZXMuUHJvcGVydHlJbmZvLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBwcm9wZXJ0eSxcclxuICAgICAgICAgICAgICAgIHR5cGU6IHR5cGVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHR5cGVJbmZvLnByb3BlcnRpZXMucHVzaChwcm9wZXJ0eUluZm8pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHR5cGVJbmZvO1xyXG59O1xyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudHlwZXNcIiwge1xyXG4gICAgUHJvcGVydHlJbmZvOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uIChuYW1lLCB0eXBlKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIFBhdGg6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKGZ1bGxQYXRoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvLyBCYXNlZCBvbiBub2RlLmpzIGltcGxlbWVudGF0aW9uIDogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy85NDUxMTAwL2ZpbGVuYW1lLWV4dGVuc2lvbi1pbi1qYXZhc2NyaXB0XHJcbiAgICAgICAgdmFyIHNwbGl0RGV2aWNlUmUgPVxyXG4gICAgICAgICAgICAvXihbYS16QS1aXTp8W1xcXFxcXC9dezJ9W15cXFxcXFwvXStbXFxcXFxcL11bXlxcXFxcXC9dKyk/KFtcXFxcXFwvXSk/KFtcXHNcXFNdKj8pJC87XHJcblxyXG4gICAgICAgIC8vIFJlZ2V4IHRvIHNwbGl0IHRoZSB0YWlsIHBhcnQgb2YgdGhlIGFib3ZlIGludG8gWyosIGRpciwgYmFzZW5hbWUsIGV4dF1cclxuICAgICAgICB2YXIgc3BsaXRUYWlsUmUgPVxyXG4gICAgICAgICAgICAvXihbXFxzXFxTXStbXFxcXFxcL10oPyEkKXxbXFxcXFxcL10pPygoPzpcXC57MSwyfSR8W1xcc1xcU10rPyk/KFxcLlteLlxcL1xcXFxdKik/KSQvO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiByZW1vdmVVbnN1cHBvcnRlZFBhcnRzKGZpbGVuYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVyeVN0cmluZ1N0YXJ0ID0gZmlsZW5hbWUuaW5kZXhPZihcIj9cIik7XHJcbiAgICAgICAgICAgIGlmIChxdWVyeVN0cmluZ1N0YXJ0ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgZmlsZW5hbWUgPSBmaWxlbmFtZS5zdWJzdHIoMCwgcXVlcnlTdHJpbmdTdGFydCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZpbGVuYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc3BsaXRQYXRoKGZpbGVuYW1lKSB7XHJcbiAgICAgICAgICAgIC8vIFNlcGFyYXRlIGRldmljZStzbGFzaCBmcm9tIHRhaWxcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHNwbGl0RGV2aWNlUmUuZXhlYyhmaWxlbmFtZSksXHJcbiAgICAgICAgICAgICAgICBkZXZpY2UgPSAocmVzdWx0WzFdIHx8ICcnKSArIChyZXN1bHRbMl0gfHwgJycpLFxyXG4gICAgICAgICAgICAgICAgdGFpbCA9IHJlc3VsdFszXSB8fCAnJztcclxuICAgICAgICAgICAgLy8gU3BsaXQgdGhlIHRhaWwgaW50byBkaXIsIGJhc2VuYW1lIGFuZCBleHRlbnNpb25cclxuICAgICAgICAgICAgdmFyIHJlc3VsdDIgPSBzcGxpdFRhaWxSZS5leGVjKHRhaWwpLFxyXG4gICAgICAgICAgICAgICAgZGlyID0gcmVzdWx0MlsxXSB8fCAnJyxcclxuICAgICAgICAgICAgICAgIGJhc2VuYW1lID0gcmVzdWx0MlsyXSB8fCAnJyxcclxuICAgICAgICAgICAgICAgIGV4dCA9IHJlc3VsdDJbM10gfHwgJyc7XHJcbiAgICAgICAgICAgIHJldHVybiBbZGV2aWNlLCBkaXIsIGJhc2VuYW1lLCBleHRdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVsbFBhdGggPSByZW1vdmVVbnN1cHBvcnRlZFBhcnRzKGZ1bGxQYXRoKTtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gc3BsaXRQYXRoKGZ1bGxQYXRoKTtcclxuICAgICAgICB0aGlzLmRldmljZSA9IHJlc3VsdFswXSB8fCBcIlwiO1xyXG4gICAgICAgIHRoaXMuZGlyZWN0b3J5ID0gcmVzdWx0WzFdIHx8IFwiXCI7XHJcbiAgICAgICAgdGhpcy5maWxlbmFtZSA9IHJlc3VsdFsyXSB8fCBcIlwiO1xyXG4gICAgICAgIHRoaXMuZXh0ZW5zaW9uID0gcmVzdWx0WzNdIHx8IFwiXCI7XHJcbiAgICAgICAgdGhpcy5maWxlbmFtZVdpdGhvdXRFeHRlbnNpb24gPSB0aGlzLmZpbGVuYW1lLnJlcGxhY2VBbGwodGhpcy5leHRlbnNpb24sIFwiXCIpO1xyXG4gICAgICAgIHRoaXMuZnVsbFBhdGggPSBmdWxsUGF0aDtcclxuXHJcbiAgICAgICAgdGhpcy5oYXNFeHRlbnNpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHNlbGYuZXh0ZW5zaW9uKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmV4dGVuc2lvbiA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5QYXRoLm1ha2VSZWxhdGl2ZSA9IGZ1bmN0aW9uIChmdWxsUGF0aCkge1xyXG4gICAgaWYgKGZ1bGxQYXRoLmluZGV4T2YoXCIvXCIpID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bGxQYXRoLnN1YnN0cigxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZnVsbFBhdGg7XHJcbn07XHJcbkJpZnJvc3QuUGF0aC5nZXRQYXRoV2l0aG91dEZpbGVuYW1lID0gZnVuY3Rpb24gKGZ1bGxQYXRoKSB7XHJcbiAgICB2YXIgbGFzdEluZGV4ID0gZnVsbFBhdGgubGFzdEluZGV4T2YoXCIvXCIpO1xyXG4gICAgcmV0dXJuIGZ1bGxQYXRoLnN1YnN0cigwLCBsYXN0SW5kZXgpO1xyXG59O1xyXG5CaWZyb3N0LlBhdGguZ2V0RmlsZW5hbWUgPSBmdW5jdGlvbiAoZnVsbFBhdGgpIHtcclxuICAgIHZhciBsYXN0SW5kZXggPSBmdWxsUGF0aC5sYXN0SW5kZXhPZihcIi9cIik7XHJcbiAgICByZXR1cm4gZnVsbFBhdGguc3Vic3RyKGxhc3RJbmRleCsxKTtcclxufTtcclxuQmlmcm9zdC5QYXRoLmdldEZpbGVuYW1lV2l0aG91dEV4dGVuc2lvbiA9IGZ1bmN0aW9uIChmdWxsUGF0aCkge1xyXG4gICAgdmFyIGZpbGVuYW1lID0gdGhpcy5nZXRGaWxlbmFtZShmdWxsUGF0aCk7XHJcbiAgICB2YXIgbGFzdEluZGV4ID0gZmlsZW5hbWUubGFzdEluZGV4T2YoXCIuXCIpO1xyXG4gICAgcmV0dXJuIGZpbGVuYW1lLnN1YnN0cigwLGxhc3RJbmRleCk7XHJcbn07XHJcbkJpZnJvc3QuUGF0aC5oYXNFeHRlbnNpb24gPSBmdW5jdGlvbiAocGF0aCkge1xyXG4gICAgaWYgKHBhdGguaW5kZXhPZihcIj9cIikgPiAwKSB7XHJcbiAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDAsIHBhdGguaW5kZXhPZihcIj9cIikpO1xyXG4gICAgfVxyXG4gICAgdmFyIGxhc3RJbmRleCA9IHBhdGgubGFzdEluZGV4T2YoXCIuXCIpO1xyXG4gICAgcmV0dXJuIGxhc3RJbmRleCA+IDA7XHJcbn07XHJcbkJpZnJvc3QuUGF0aC5jaGFuZ2VFeHRlbnNpb24gPSBmdW5jdGlvbiAoZnVsbFBhdGgsIG5ld0V4dGVuc2lvbikge1xyXG4gICAgdmFyIHBhdGggPSBCaWZyb3N0LlBhdGguY3JlYXRlKHsgZnVsbFBhdGg6IGZ1bGxQYXRoIH0pO1xyXG4gICAgdmFyIG5ld1BhdGggPSBwYXRoLmRpcmVjdG9yeSArIHBhdGguZmlsZW5hbWVXaXRob3V0RXh0ZW5zaW9uICsgXCIuXCIgKyBuZXdFeHRlbnNpb247XHJcbiAgICByZXR1cm4gbmV3UGF0aDtcclxufTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIpO1xyXG5cclxuQmlmcm9zdC5EZWZpbml0aW9uTXVzdEJlRnVuY3Rpb24gPSBmdW5jdGlvbiAobWVzc2FnZSkge1xyXG4gICAgdGhpcy5wcm90b3R5cGUgPSBFcnJvci5wcm90b3R5cGU7XHJcbiAgICB0aGlzLm5hbWUgPSBcIkRlZmluaXRpb25NdXN0QmVGdW5jdGlvblwiO1xyXG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZSB8fCBcIkRlZmluaXRpb24gbXVzdCBiZSBmdW5jdGlvblwiO1xyXG59O1xyXG5cclxuQmlmcm9zdC5NaXNzaW5nTmFtZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XHJcbiAgICB0aGlzLnByb3RvdHlwZSA9IEVycm9yLnByb3RvdHlwZTtcclxuICAgIHRoaXMubmFtZSA9IFwiTWlzc2luZ05hbWVcIjtcclxuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2UgfHwgXCJNaXNzaW5nIG5hbWVcIjtcclxufTtcclxuXHJcbkJpZnJvc3QuRXhjZXB0aW9uID0gKGZ1bmN0aW9uKGdsb2JhbCwgdW5kZWZpbmVkKSB7XHJcbiAgICBmdW5jdGlvbiB0aHJvd0lmTmFtZU1pc3NpbmcobmFtZSkge1xyXG4gICAgICAgIGlmICghbmFtZSB8fCB0eXBlb2YgbmFtZSA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC5NaXNzaW5nTmFtZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0aHJvd0lmRGVmaW5pdGlvbk5vdEFGdW5jdGlvbihkZWZpbml0aW9uKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBkZWZpbml0aW9uICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QuRGVmaW5pdGlvbk11c3RCZUZ1bmN0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldEV4Y2VwdGlvbk5hbWUobmFtZSkge1xyXG4gICAgICAgIHZhciBsYXN0RG90ID0gbmFtZS5sYXN0SW5kZXhPZihcIi5cIik7XHJcbiAgICAgICAgaWYgKGxhc3REb3QgPT09IC0xICYmIGxhc3REb3QgIT09IG5hbWUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmFtZS5zdWJzdHIobGFzdERvdCsxKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkZWZpbmVBbmRHZXRUYXJnZXRTY29wZShuYW1lKSB7XHJcbiAgICAgICAgdmFyIGxhc3REb3QgPSBuYW1lLmxhc3RJbmRleE9mKFwiLlwiKTtcclxuICAgICAgICBpZiggbGFzdERvdCA9PT0gLTEgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbnMgPSBuYW1lLnN1YnN0cigwLGxhc3REb3QpO1xyXG4gICAgICAgIEJpZnJvc3QubmFtZXNwYWNlKG5zKTtcclxuXHJcbiAgICAgICAgdmFyIHNjb3BlID0gZ2xvYmFsO1xyXG4gICAgICAgIHZhciBwYXJ0cyA9IG5zLnNwbGl0KCcuJyk7XHJcbiAgICAgICAgcGFydHMuZm9yRWFjaChmdW5jdGlvbihwYXJ0KSB7XHJcbiAgICAgICAgICAgIHNjb3BlID0gc2NvcGVbcGFydF07XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzY29wZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGRlZmluZTogZnVuY3Rpb24obmFtZSwgZGVmYXVsdE1lc3NhZ2UsIGRlZmluaXRpb24pIHtcclxuICAgICAgICAgICAgdGhyb3dJZk5hbWVNaXNzaW5nKG5hbWUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHNjb3BlID0gZGVmaW5lQW5kR2V0VGFyZ2V0U2NvcGUobmFtZSk7XHJcbiAgICAgICAgICAgIHZhciBleGNlcHRpb25OYW1lID0gZ2V0RXhjZXB0aW9uTmFtZShuYW1lKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBleGNlcHRpb24gPSBmdW5jdGlvbiAobWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uYW1lID0gZXhjZXB0aW9uTmFtZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2UgfHwgZGVmYXVsdE1lc3NhZ2U7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGV4Y2VwdGlvbi5wcm90b3R5cGUgPSBFcnJvci5wcm90b3R5cGU7XHJcblxyXG4gICAgICAgICAgICBpZiggZGVmaW5pdGlvbiAmJiB0eXBlb2YgZGVmaW5pdGlvbiAhPT0gXCJ1bmRlZmluZWRcIiApIHtcclxuICAgICAgICAgICAgICAgIHRocm93SWZEZWZpbml0aW9uTm90QUZ1bmN0aW9uKGRlZmluaXRpb24pO1xyXG5cclxuICAgICAgICAgICAgICAgIGRlZmluaXRpb24ucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xyXG4gICAgICAgICAgICAgICAgZXhjZXB0aW9uLnByb3RvdHlwZSA9IG5ldyBkZWZpbml0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNjb3BlW2V4Y2VwdGlvbk5hbWVdID0gZXhjZXB0aW9uO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0pKHdpbmRvdyk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIpO1xyXG5CaWZyb3N0LkV4Y2VwdGlvbi5kZWZpbmUoXCJCaWZyb3N0LkxvY2F0aW9uTm90U3BlY2lmaWVkXCIsXCJMb2NhdGlvbiB3YXMgbm90IHNwZWNpZmllZFwiKTtcclxuQmlmcm9zdC5FeGNlcHRpb24uZGVmaW5lKFwiQmlmcm9zdC5JbnZhbGlkVXJpRm9ybWF0XCIsIFwiVXJpIGZvcm1hdCBzcGVjaWZpZWQgaXMgbm90IHZhbGlkXCIpO1xyXG5CaWZyb3N0LkV4Y2VwdGlvbi5kZWZpbmUoXCJCaWZyb3N0Lk9iamVjdExpdGVyYWxOb3RBbGxvd2VkXCIsIFwiT2JqZWN0IGxpdGVyYWwgaXMgbm90IGFsbG93ZWRcIik7XHJcbkJpZnJvc3QuRXhjZXB0aW9uLmRlZmluZShcIkJpZnJvc3QuTWlzc2luZ1R5cGVEZWZpbml0aW9uXCIsIFwiVHlwZSBkZWZpbml0aW9uIHdhcyBub3Qgc3BlY2lmaWVkXCIpO1xyXG5CaWZyb3N0LkV4Y2VwdGlvbi5kZWZpbmUoXCJCaWZyb3N0LkFzeW5jaHJvbm91c0RlcGVuZGVuY2llc0RldGVjdGVkXCIsIFwiWW91IHNob3VsZCBjb25zaWRlciB1c2luZyBUeXBlLmJlZ2luQ3JlYXRlKCkgb3IgZGVwZW5kZW5jeVJlc29sdmVyLmJlZ2luUmVzb2x2ZSgpIGZvciBzeXN0ZW1zIHRoYXQgaGFzIGFzeW5jaHJvbm91cyBkZXBlbmRlbmNpZXNcIik7XHJcbkJpZnJvc3QuRXhjZXB0aW9uLmRlZmluZShcIkJpZnJvc3QuVW5yZXNvbHZlZERlcGVuZGVuY2llc1wiLCBcIlNvbWUgZGVwZW5kZW5jaWVzIHdhcyBub3QgcG9zc2libGUgdG8gcmVzb2x2ZVwiKTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIik7XHJcbkJpZnJvc3QuaGFzaFN0cmluZyA9IChmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZGVjb2RlOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICAgICAgICBpZiAoYSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGEgPSBhLnJlcGxhY2UoXCIvP1wiLCBcIlwiKS5zcGxpdCgnJicpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGIgPSB7fTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcCA9IGFbaV0uc3BsaXQoJz0nLCAyKTtcclxuICAgICAgICAgICAgICAgIGlmIChwLmxlbmd0aCAhPT0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGRlY29kZVVSSUNvbXBvbmVudChwWzFdLnJlcGxhY2UoL1xcKy9nLCBcIiBcIikpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gXCJcIiAmJiAhaXNOYU4odmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBiW3BbMF1dID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGI7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSkoKTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIpO1xyXG5CaWZyb3N0LlVyaSA9IChmdW5jdGlvbih3aW5kb3csIHVuZGVmaW5lZCkge1xyXG4gICAgLyogcGFyc2VVcmkgSlMgdjAuMSwgYnkgU3RldmVuIExldml0aGFuIChodHRwOi8vYmFkYXNzZXJ5LmJsb2dzcG90LmNvbSlcclxuICAgIFNwbGl0cyBhbnkgd2VsbC1mb3JtZWQgVVJJIGludG8gdGhlIGZvbGxvd2luZyBwYXJ0cyAoYWxsIGFyZSBvcHRpb25hbCk6XHJcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICDigKIgc291cmNlIChzaW5jZSB0aGUgZXhlYygpIG1ldGhvZCByZXR1cm5zIGJhY2tyZWZlcmVuY2UgMCBbaS5lLiwgdGhlIGVudGlyZSBtYXRjaF0gYXMga2V5IDAsIHdlIG1pZ2h0IGFzIHdlbGwgdXNlIGl0KVxyXG4gICAg4oCiIHByb3RvY29sIChzY2hlbWUpXHJcbiAgICDigKIgYXV0aG9yaXR5IChpbmNsdWRlcyBib3RoIHRoZSBkb21haW4gYW5kIHBvcnQpXHJcbiAgICAgICAg4oCiIGRvbWFpbiAocGFydCBvZiB0aGUgYXV0aG9yaXR5OyBjYW4gYmUgYW4gSVAgYWRkcmVzcylcclxuICAgICAgICDigKIgcG9ydCAocGFydCBvZiB0aGUgYXV0aG9yaXR5KVxyXG4gICAg4oCiIHBhdGggKGluY2x1ZGVzIGJvdGggdGhlIGRpcmVjdG9yeSBwYXRoIGFuZCBmaWxlbmFtZSlcclxuICAgICAgICDigKIgZGlyZWN0b3J5UGF0aCAocGFydCBvZiB0aGUgcGF0aDsgc3VwcG9ydHMgZGlyZWN0b3JpZXMgd2l0aCBwZXJpb2RzLCBhbmQgd2l0aG91dCBhIHRyYWlsaW5nIGJhY2tzbGFzaClcclxuICAgICAgICDigKIgZmlsZU5hbWUgKHBhcnQgb2YgdGhlIHBhdGgpXHJcbiAgICDigKIgcXVlcnkgKGRvZXMgbm90IGluY2x1ZGUgdGhlIGxlYWRpbmcgcXVlc3Rpb24gbWFyaylcclxuICAgIOKAoiBhbmNob3IgKGZyYWdtZW50KVxyXG4gICAgKi9cclxuICAgIGZ1bmN0aW9uIHBhcnNlVXJpKHNvdXJjZVVyaSl7XHJcbiAgICAgICAgdmFyIHVyaVBhcnROYW1lcyA9IFtcInNvdXJjZVwiLFwicHJvdG9jb2xcIixcImF1dGhvcml0eVwiLFwiZG9tYWluXCIsXCJwb3J0XCIsXCJwYXRoXCIsXCJkaXJlY3RvcnlQYXRoXCIsXCJmaWxlTmFtZVwiLFwicXVlcnlcIixcImFuY2hvclwiXTtcclxuICAgICAgICB2YXIgdXJpUGFydHMgPSBuZXcgUmVnRXhwKFwiXig/OihbXjovPyMuXSspOik/KD86Ly8pPygoW146Lz8jXSopKD86OihcXFxcZCopKT8pPygoLyg/OltePyNdKD8hW14/Iy9dKlxcXFwuW14/Iy8uXSsoPzpbXFxcXD8jXXwkKSkpKi8/KT8oW14/Iy9dKikpPyg/OlxcXFw/KFteI10qKSk/KD86IyguKikpP1wiKS5leGVjKHNvdXJjZVVyaSk7XHJcbiAgICAgICAgdmFyIHVyaSA9IHt9O1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspe1xyXG4gICAgICAgICAgICB1cmlbdXJpUGFydE5hbWVzW2ldXSA9ICh1cmlQYXJ0c1tpXSA/IHVyaVBhcnRzW2ldIDogXCJcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBbHdheXMgZW5kIGRpcmVjdG9yeVBhdGggd2l0aCBhIHRyYWlsaW5nIGJhY2tzbGFzaCBpZiBhIHBhdGggd2FzIHByZXNlbnQgaW4gdGhlIHNvdXJjZSBVUklcclxuICAgICAgICAvLyBOb3RlIHRoYXQgYSB0cmFpbGluZyBiYWNrc2xhc2ggaXMgTk9UIGF1dG9tYXRpY2FsbHkgaW5zZXJ0ZWQgd2l0aGluIG9yIGFwcGVuZGVkIHRvIHRoZSBcInBhdGhcIiBrZXlcclxuICAgICAgICBpZih1cmkuZGlyZWN0b3J5UGF0aC5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgdXJpLmRpcmVjdG9yeVBhdGggPSB1cmkuZGlyZWN0b3J5UGF0aC5yZXBsYWNlKC9cXC8/JC8sIFwiL1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB1cmk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIFVyaShsb2NhdGlvbikge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnNldExvY2F0aW9uID0gZnVuY3Rpb24gKGxvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgIHNlbGYuZnVsbFBhdGggPSBsb2NhdGlvbjtcclxuICAgICAgICAgICAgbG9jYXRpb24gPSBsb2NhdGlvbi5yZXBsYWNlKFwiIyFcIiwgXCIvXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHBhcnNlVXJpKGxvY2F0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0LnByb3RvY29sIHx8IHR5cGVvZiByZXN1bHQucHJvdG9jb2wgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LkludmFsaWRVcmlGb3JtYXQoXCJVcmkgKCdcIiArIGxvY2F0aW9uICsgXCInKSB3YXMgaW4gdGhlIHdyb25nIGZvcm1hdFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5zY2hlbWUgPSByZXN1bHQucHJvdG9jb2w7XHJcbiAgICAgICAgICAgIHNlbGYuaG9zdCA9IHJlc3VsdC5kb21haW47XHJcbiAgICAgICAgICAgIHNlbGYucGF0aCA9IHJlc3VsdC5wYXRoO1xyXG4gICAgICAgICAgICBzZWxmLmFuY2hvciA9IHJlc3VsdC5hbmNob3I7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnF1ZXJ5U3RyaW5nID0gcmVzdWx0LnF1ZXJ5O1xyXG4gICAgICAgICAgICBzZWxmLnBvcnQgPSBwYXJzZUludChyZXN1bHQucG9ydCk7XHJcbiAgICAgICAgICAgIHNlbGYucGFyYW1ldGVycyA9IEJpZnJvc3QuaGFzaFN0cmluZy5kZWNvZGUocmVzdWx0LnF1ZXJ5KTtcclxuICAgICAgICAgICAgc2VsZi5wYXJhbWV0ZXJzID0gQmlmcm9zdC5leHRlbmQoQmlmcm9zdC5oYXNoU3RyaW5nLmRlY29kZShyZXN1bHQuYW5jaG9yKSwgc2VsZi5wYXJhbWV0ZXJzKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuaXNTYW1lQXNPcmlnaW4gPSAod2luZG93LmxvY2F0aW9uLnByb3RvY29sID09PSByZXN1bHQucHJvdG9jb2wgKyBcIjpcIiAmJlxyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lID09PSBzZWxmLmhvc3QpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TG9jYXRpb24obG9jYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRocm93SWZMb2NhdGlvbk5vdFNwZWNpZmllZChsb2NhdGlvbikge1xyXG4gICAgICAgIGlmICghbG9jYXRpb24gfHwgdHlwZW9mIGxvY2F0aW9uID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LkxvY2F0aW9uTm90U3BlY2lmaWVkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNyZWF0ZTogZnVuY3Rpb24obG9jYXRpb24pIHtcclxuICAgICAgICAgICAgdGhyb3dJZkxvY2F0aW9uTm90U3BlY2lmaWVkKGxvY2F0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB1cmkgPSBuZXcgVXJpKGxvY2F0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIHVyaTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpc0Fic29sdXRlOiBmdW5jdGlvbiAodXJsKSB7XHJcbiAgICAgICAgICAgIC8vIEJhc2VkIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTA2ODcwOTkvaG93LXRvLXRlc3QtaWYtYS11cmwtc3RyaW5nLWlzLWFic29sdXRlLW9yLXJlbGF0aXZlXHJcbiAgICAgICAgICAgIHZhciBleHByZXNzaW9uID0gbmV3IFJlZ0V4cCgnXig/OlthLXpdKzopPy8vJywgJ2knKTtcclxuICAgICAgICAgICAgcmV0dXJuIGV4cHJlc3Npb24udGVzdCh1cmwpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0pKHdpbmRvdyk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIG5hbWVzcGFjZXM6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5zdHJpcFBhdGggPSBmdW5jdGlvbiAocGF0aCkge1xyXG4gICAgICAgICAgICBpZiAocGF0aC5zdGFydHNXaXRoKFwiL1wiKSkge1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwYXRoLmVuZHNXaXRoKFwiL1wiKSkge1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDAsIHBhdGgubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHBhdGg7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgc2NyaXB0cyA9IEJpZnJvc3QuYXNzZXRzTWFuYWdlci5nZXRTY3JpcHRzKCk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc2NyaXB0cyA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzY3JpcHRzLmZvckVhY2goZnVuY3Rpb24gKGZ1bGxQYXRoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGF0aCA9IEJpZnJvc3QuUGF0aC5nZXRQYXRoV2l0aG91dEZpbGVuYW1lKGZ1bGxQYXRoKTtcclxuICAgICAgICAgICAgICAgIHBhdGggPSBzZWxmLnN0cmlwUGF0aChwYXRoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBtYXBwZXJLZXkgaW4gQmlmcm9zdC5uYW1lc3BhY2VNYXBwZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hcHBlciA9IEJpZnJvc3QubmFtZXNwYWNlTWFwcGVyc1ttYXBwZXJLZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbWFwcGVyLmhhc01hcHBpbmdGb3IgPT09IFwiZnVuY3Rpb25cIiAmJiBtYXBwZXIuaGFzTWFwcGluZ0ZvcihwYXRoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmFtZXNwYWNlUGF0aCA9IG1hcHBlci5yZXNvbHZlKHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmFtZXNwYWNlID0gQmlmcm9zdC5uYW1lc3BhY2UobmFtZXNwYWNlUGF0aCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm9vdCA9IFwiL1wiICsgcGF0aCArIFwiL1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2UuX3BhdGggPSByb290O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBuYW1lc3BhY2UuX3NjcmlwdHMgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZS5fc2NyaXB0cyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZUluZGV4ID0gZnVsbFBhdGgubGFzdEluZGV4T2YoXCIvXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZSA9IGZ1bGxQYXRoLnN1YnN0cihmaWxlSW5kZXggKyAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4dGVuc2lvbkluZGV4ID0gZmlsZS5sYXN0SW5kZXhPZihcIi5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzeXN0ZW0gPSBmaWxlLnN1YnN0cigwLCBleHRlbnNpb25JbmRleCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2UuX3NjcmlwdHMucHVzaChzeXN0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBuYW1lc3BhY2VNYXBwZXJzOiB7XHJcblxyXG4gICAgICAgIG1hcFBhdGhUb05hbWVzcGFjZTogZnVuY3Rpb24gKHBhdGgpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgbWFwcGVyS2V5IGluIEJpZnJvc3QubmFtZXNwYWNlTWFwcGVycykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hcHBlciA9IEJpZnJvc3QubmFtZXNwYWNlTWFwcGVyc1ttYXBwZXJLZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtYXBwZXIuaGFzTWFwcGluZ0ZvciA9PT0gXCJmdW5jdGlvblwiICYmIG1hcHBlci5oYXNNYXBwaW5nRm9yKHBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWVzcGFjZVBhdGggPSBtYXBwZXIucmVzb2x2ZShwYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmFtZXNwYWNlUGF0aDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgU3RyaW5nTWFwcGluZzogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoZm9ybWF0LCBtYXBwZWRGb3JtYXQpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuZm9ybWF0ID0gZm9ybWF0O1xyXG4gICAgICAgIHRoaXMubWFwcGVkRm9ybWF0ID0gbWFwcGVkRm9ybWF0O1xyXG5cclxuICAgICAgICB2YXIgcGxhY2Vob2xkZXJFeHByZXNzaW9uID0gXCJ7W2EtekEtWl0rfVwiO1xyXG4gICAgICAgIHZhciBwbGFjZWhvbGRlclJlZ2V4ID0gbmV3IFJlZ0V4cChwbGFjZWhvbGRlckV4cHJlc3Npb24sIFwiZ1wiKTtcclxuXHJcbiAgICAgICAgdmFyIHdpbGRjYXJkRXhwcmVzc2lvbiA9IFwiXFxcXCp7Mn1bLy98fC5dXCI7XHJcbiAgICAgICAgdmFyIHdpbGRjYXJkUmVnZXggPSBuZXcgUmVnRXhwKHdpbGRjYXJkRXhwcmVzc2lvbiwgXCJnXCIpO1xyXG5cclxuICAgICAgICB2YXIgY29tYmluZWRFeHByZXNzaW9uID0gXCIoXCIgKyBwbGFjZWhvbGRlckV4cHJlc3Npb24gKyBcIikqKFwiICsgd2lsZGNhcmRFeHByZXNzaW9uICsgXCIpKlwiO1xyXG4gICAgICAgIHZhciBjb21iaW5lZFJlZ2V4ID0gbmV3IFJlZ0V4cChjb21iaW5lZEV4cHJlc3Npb24sIFwiZ1wiKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbXBvbmVudHMgPSBbXTtcclxuXHJcbiAgICAgICAgdmFyIHJlc29sdmVFeHByZXNzaW9uID0gZm9ybWF0LnJlcGxhY2UoY29tYmluZWRSZWdleCwgZnVuY3Rpb24obWF0Y2gpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBtYXRjaCA9PT0gXCJ1bmRlZmluZWRcIiB8fCBtYXRjaCA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29tcG9uZW50cy5wdXNoKG1hdGNoKTtcclxuICAgICAgICAgICAgaWYgKG1hdGNoLmluZGV4T2YoXCIqKlwiKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiKFtcXFxcdy4vL10qKVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBcIihbXFxcXHcuXSopXCI7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBtYXBwZWRGb3JtYXRXaWxkY2FyZE1hdGNoID0gbWFwcGVkRm9ybWF0Lm1hdGNoKHdpbGRjYXJkUmVnZXgpO1xyXG4gICAgICAgIHZhciBmb3JtYXRSZWdleCA9IG5ldyBSZWdFeHAocmVzb2x2ZUV4cHJlc3Npb24pO1xyXG5cclxuICAgICAgICB0aGlzLm1hdGNoZXMgPSBmdW5jdGlvbiAoaW5wdXQpIHtcclxuICAgICAgICAgICAgdmFyIG1hdGNoID0gaW5wdXQubWF0Y2goZm9ybWF0UmVnZXgpO1xyXG4gICAgICAgICAgICBpZiAobWF0Y2gpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldFZhbHVlcyA9IGZ1bmN0aW9uIChpbnB1dCkge1xyXG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0ge307XHJcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IGlucHV0Lm1hdGNoKGZvcm1hdFJlZ2V4KTtcclxuICAgICAgICAgICAgY29tcG9uZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjLCBpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29tcG9uZW50ID0gYy5zdWJzdHIoMSwgYy5sZW5ndGggLSAyKTtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IG1hdGNoW2kgKyAyXTtcclxuICAgICAgICAgICAgICAgIGlmIChjLmluZGV4T2YoXCIqKlwiKSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dFtjb21wb25lbnRdID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnJlc29sdmUgPSBmdW5jdGlvbiAoaW5wdXQpIHtcclxuICAgICAgICAgICAgdmFyIG1hdGNoID0gaW5wdXQubWF0Y2goZm9ybWF0UmVnZXgpO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbWFwcGVkRm9ybWF0O1xyXG4gICAgICAgICAgICB2YXIgd2lsZGNhcmRPZmZzZXQgPSAwO1xyXG5cclxuICAgICAgICAgICAgY29tcG9uZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjLCBpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBtYXRjaFtpICsgMV07XHJcbiAgICAgICAgICAgICAgICBpZiAoYy5pbmRleE9mKFwiKipcIikgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgd2lsZGNhcmQgPSBtYXBwZWRGb3JtYXRXaWxkY2FyZE1hdGNoW3dpbGRjYXJkT2Zmc2V0XTtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2VBbGwoY1syXSwgd2lsZGNhcmRbMl0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKHdpbGRjYXJkLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgd2lsZGNhcmRPZmZzZXQrKztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoYywgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBzdHJpbmdNYXBwaW5nRmFjdG9yeTogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uIChmb3JtYXQsIG1hcHBlZEZvcm1hdCkge1xyXG4gICAgICAgICAgICB2YXIgbWFwcGluZyA9IEJpZnJvc3QuU3RyaW5nTWFwcGluZy5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgZm9ybWF0OiBmb3JtYXQsXHJcbiAgICAgICAgICAgICAgICBtYXBwZWRGb3JtYXQ6IG1hcHBlZEZvcm1hdFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIG1hcHBpbmc7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBTdHJpbmdNYXBwZXI6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKHN0cmluZ01hcHBpbmdGYWN0b3J5KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLnN0cmluZ01hcHBpbmdGYWN0b3J5ID0gc3RyaW5nTWFwcGluZ0ZhY3Rvcnk7XHJcblxyXG4gICAgICAgIHRoaXMubWFwcGluZ3MgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXZlcnNlTWFwcGluZ3MgPSBbXTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFzTWFwcGluZ0ZvcihtYXBwaW5ncywgaW5wdXQpIHtcclxuICAgICAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgIG1hcHBpbmdzLnNvbWUoZnVuY3Rpb24gKG0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChtLm1hdGNoZXMoaW5wdXQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvdW5kO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGZvdW5kO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0TWFwcGluZ0ZvcihtYXBwaW5ncywgaW5wdXQpIHtcclxuICAgICAgICAgICAgdmFyIGZvdW5kO1xyXG4gICAgICAgICAgICBtYXBwaW5ncy5zb21lKGZ1bmN0aW9uIChtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobS5tYXRjaGVzKGlucHV0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gbTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGZvdW5kICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZm91bmQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwiQXJndW1lbnRFcnJvclwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJTdHJpbmcgbWFwcGluZyBmb3IgKFwiICsgaW5wdXQgKyBcIikgY291bGQgbm90IGJlIGZvdW5kXCJcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlc29sdmUobWFwcGluZ3MsIGlucHV0KSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXQgPT09IG51bGwgfHwgdHlwZW9mIGlucHV0ID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG1hcHBpbmcgPSBzZWxmLmdldE1hcHBpbmdGb3IoaW5wdXQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQobWFwcGluZykpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFwcGluZy5yZXNvbHZlKGlucHV0KTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaGFzTWFwcGluZ0ZvciA9IGZ1bmN0aW9uIChpbnB1dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gaGFzTWFwcGluZ0ZvcihzZWxmLm1hcHBpbmdzLCBpbnB1dCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmdldE1hcHBpbmdGb3IgPSBmdW5jdGlvbiAoaW5wdXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGdldE1hcHBpbmdGb3Ioc2VsZi5tYXBwaW5ncywgaW5wdXQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5yZXNvbHZlID0gZnVuY3Rpb24gKGlucHV0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHNlbGYubWFwcGluZ3MsIGlucHV0KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnJldmVyc2UgPSB7XHJcbiAgICAgICAgICAgIGhhc01hcHBpbmdGb3I6IGZ1bmN0aW9uIChpbnB1dCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuaGFzTWFwcGluZ0ZvcihzZWxmLnJldmVyc2VNYXBwaW5ncywgaW5wdXQpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0TWFwcGluZ0ZvcjogZnVuY3Rpb24gKGlucHV0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5nZXRNYXBwaW5nRm9yKHNlbGYucmV2ZXJzZU1hcHBpbmdzLCBpbnB1dCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICByZXNvbHZlOiBmdW5jdGlvbiAoaW5wdXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnJlc29sdmUoc2VsZi5yZXZlcnNlTWFwcGluZ3MsIGlucHV0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuYWRkTWFwcGluZyA9IGZ1bmN0aW9uIChmb3JtYXQsIG1hcHBlZEZvcm1hdCkge1xyXG4gICAgICAgICAgICB2YXIgbWFwcGluZyA9IHNlbGYuc3RyaW5nTWFwcGluZ0ZhY3RvcnkuY3JlYXRlKGZvcm1hdCwgbWFwcGVkRm9ybWF0KTtcclxuICAgICAgICAgICAgc2VsZi5tYXBwaW5ncy5wdXNoKG1hcHBpbmcpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJldmVyc2VNYXBwaW5nID0gc2VsZi5zdHJpbmdNYXBwaW5nRmFjdG9yeS5jcmVhdGUobWFwcGVkRm9ybWF0LCBmb3JtYXQpO1xyXG4gICAgICAgICAgICBzZWxmLnJldmVyc2VNYXBwaW5ncy5wdXNoKHJldmVyc2VNYXBwaW5nKTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIHVyaU1hcHBlcnM6IHtcclxuICAgIH1cclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIHNlcnZlcjogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSBcIlwiO1xyXG5cclxuICAgICAgICB0aGlzLmRlZmF1bHRQYXJhbWV0ZXJzID0ge307XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGRlc2VyaWFsaXplKGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNBcnJheShkYXRhKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1zID0gW107XHJcbiAgICAgICAgICAgICAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKGRlc2VyaWFsaXplKGl0ZW0pKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1zO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzQXJyYXkoZGF0YVtwcm9wZXJ0eV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbcHJvcGVydHldID0gZGVzZXJpYWxpemUoZGF0YVtwcm9wZXJ0eV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGRhdGFbcHJvcGVydHldO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdW1iZXIodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhW3Byb3BlcnR5XSA9IHBhcnNlRmxvYXQodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtwcm9wZXJ0eV0gPSBkYXRhW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5wb3N0ID0gZnVuY3Rpb24gKHVybCwgcGFyYW1ldGVycykge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuVXJpLmlzQWJzb2x1dGUodXJsKSkge1xyXG4gICAgICAgICAgICAgICAgdXJsID0gc2VsZi50YXJnZXQgKyB1cmw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBhY3R1YWxQYXJhbWV0ZXJzID0ge307XHJcbiAgICAgICAgICAgIEJpZnJvc3QuZXh0ZW5kKGFjdHVhbFBhcmFtZXRlcnMsIHNlbGYuZGVmYXVsdFBhcmFtZXRlcnMpO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcGFyYW1ldGVycykge1xyXG4gICAgICAgICAgICAgICAgYWN0dWFsUGFyYW1ldGVyc1twcm9wZXJ0eV0gPSBKU09OLnN0cmluZ2lmeShwYXJhbWV0ZXJzW3Byb3BlcnR5XSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGFjdHVhbFBhcmFtZXRlcnMpLFxyXG4gICAgICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyxcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSAkLnBhcnNlSlNPTihyZXN1bHQucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICBkZXNlcmlhbGl6ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UuZmFpbChqcVhIUik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXQgPSBmdW5jdGlvbiAodXJsLCBwYXJhbWV0ZXJzKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5VcmkuaXNBYnNvbHV0ZSh1cmwpKSB7XHJcbiAgICAgICAgICAgICAgICB1cmwgPSBzZWxmLnRhcmdldCArIHVybDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGFjdHVhbFBhcmFtZXRlcnMgPSB7fTtcclxuICAgICAgICAgICAgQmlmcm9zdC5leHRlbmQoYWN0dWFsUGFyYW1ldGVycywgc2VsZi5kZWZhdWx0UGFyYW1ldGVycyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc09iamVjdChwYXJhbWV0ZXJzKSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcGFyYW1ldGVyTmFtZSBpbiBwYXJhbWV0ZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNBcnJheShwYXJhbWV0ZXJzW3BhcmFtZXRlck5hbWVdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3R1YWxQYXJhbWV0ZXJzW3BhcmFtZXRlck5hbWVdID0gSlNPTi5zdHJpbmdpZnkocGFyYW1ldGVyc1twYXJhbWV0ZXJOYW1lXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0dWFsUGFyYW1ldGVyc1twYXJhbWV0ZXJOYW1lXSA9IHBhcmFtZXRlcnNbcGFyYW1ldGVyTmFtZV07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGFjdHVhbFBhcmFtZXRlcnMsXHJcbiAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxyXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uIChyZXN1bHQsIHRleHRTdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9ICQucGFyc2VKU09OKHJlc3VsdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc2VyaWFsaXplKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5mYWlsKGpxWEhSKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIudHlwZXMuc2VydmVyID0gQmlmcm9zdC5zZXJ2ZXI7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIGFyZUVxdWFsOiBmdW5jdGlvbiAoc291cmNlLCB0YXJnZXQpIHtcclxuICAgICAgICBmdW5jdGlvbiBpc1Jlc2VydmVkTWVtYmVyTmFtZShtZW1iZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1lbWJlci5pbmRleE9mKFwiX1wiKSA+PSAwIHx8IG1lbWJlciA9PT0gXCJtb2RlbFwiIHx8IG1lbWJlciA9PT0gXCJjb21tb25zXCIgfHwgbWVtYmVyID09PSBcInRhcmdldFZpZXdNb2RlbFwiIHx8IG1lbWJlciA9PT0gXCJyZWdpb25cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChrby5pc09ic2VydmFibGUoc291cmNlKSkge1xyXG4gICAgICAgICAgICBzb3VyY2UgPSBzb3VyY2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZSh0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoc291cmNlKSAmJiBCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChzb3VyY2UpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodGFyZ2V0KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoQmlmcm9zdC5pc0FycmF5KHNvdXJjZSkgJiYgQmlmcm9zdC5pc0FycmF5KHRhcmdldCkpIHtcclxuICAgICAgICAgICAgaWYgKHNvdXJjZS5sZW5ndGggIT09IHRhcmdldC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHNvdXJjZS5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LmFyZUVxdWFsKHNvdXJjZVtpbmRleF0sIHRhcmdldFtpbmRleF0pID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIG1lbWJlciBpbiBzb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc1Jlc2VydmVkTWVtYmVyTmFtZShtZW1iZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0Lmhhc093blByb3BlcnR5KG1lbWJlcikpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc291cmNlVmFsdWUgPSBzb3VyY2VbbWVtYmVyXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0VmFsdWUgPSB0YXJnZXRbbWVtYmVyXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNPYmplY3Qoc291cmNlVmFsdWUpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEJpZnJvc3QuaXNBcnJheShzb3VyY2VWYWx1ZSkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAga28uaXNPYnNlcnZhYmxlKHNvdXJjZVZhbHVlKSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmFyZUVxdWFsKHNvdXJjZVZhbHVlLCB0YXJnZXRWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzb3VyY2VWYWx1ZSAhPT0gdGFyZ2V0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIGRlZXBDbG9uZTogZnVuY3Rpb24gKHNvdXJjZSwgdGFyZ2V0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gaXNSZXNlcnZlZE1lbWJlck5hbWUobWVtYmVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZW1iZXIuaW5kZXhPZihcIl9cIikgPj0gMCB8fCBtZW1iZXIgPT09IFwibW9kZWxcIiB8fCBtZW1iZXIgPT09IFwiY29tbW9uc1wiIHx8IG1lbWJlciA9PT0gXCJ0YXJnZXRWaWV3TW9kZWxcIiB8fCBtZW1iZXIgPT09IFwicmVnaW9uXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoa28uaXNPYnNlcnZhYmxlKHNvdXJjZSkpIHtcclxuICAgICAgICAgICAgc291cmNlID0gc291cmNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGFyZ2V0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNBcnJheShzb3VyY2UpKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSBbXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldCA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgc291cmNlVmFsdWU7XHJcbiAgICAgICAgaWYgKEJpZnJvc3QuaXNBcnJheShzb3VyY2UpKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBzb3VyY2UubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICBzb3VyY2VWYWx1ZSA9IHNvdXJjZVtpbmRleF07XHJcbiAgICAgICAgICAgICAgICB2YXIgY2xvbmVkVmFsdWUgPSBCaWZyb3N0LmRlZXBDbG9uZShzb3VyY2VWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQucHVzaChjbG9uZWRWYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBtZW1iZXIgaW4gc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNSZXNlcnZlZE1lbWJlck5hbWUobWVtYmVyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHNvdXJjZVZhbHVlID0gc291cmNlW21lbWJlcl07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZShzb3VyY2VWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzb3VyY2VWYWx1ZSA9IHNvdXJjZVZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNGdW5jdGlvbihzb3VyY2VWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0VmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNPYmplY3Qoc291cmNlVmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VmFsdWUgPSB7fTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoQmlmcm9zdC5pc0FycmF5KHNvdXJjZVZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFZhbHVlID0gW107XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFttZW1iZXJdID0gc291cmNlVmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldFZhbHVlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRbbWVtYmVyXSA9IHRhcmdldFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIEJpZnJvc3QuZGVlcENsb25lKHNvdXJjZVZhbHVlLCB0YXJnZXRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICB9XHJcbn0pO1xyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgc3lzdGVtQ2xvY2s6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLm5vd0luTWlsbGlzZWNvbmRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCIvKiFcclxuKiBKYXZhU2NyaXB0IFRpbWVTcGFuIExpYnJhcnlcclxuKlxyXG4qIENvcHlyaWdodCAoYykgMjAxMCBNaWNoYWVsIFN0dW0sIGh0dHA6Ly93d3cuU3R1bS5kZS9cclxuKiBcclxuKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmdcclxuKiBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcclxuKiBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcclxuKiB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXHJcbiogZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXHJcbiogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvXHJcbiogdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG4qIFxyXG4qIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXHJcbiogaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcbiogXHJcbiogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcclxuKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcclxuKiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxyXG4qIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcclxuKiBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXHJcbiogT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXHJcbiogV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXHJcbiovXHJcbkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICAvLyBDb25zdHJ1Y3RvciBmdW5jdGlvbiwgYWxsIHBhcmFtZXRlcnMgYXJlIG9wdGlvbmFsXHJcbiAgICBUaW1lU3BhbiA6IGZ1bmN0aW9uIChtaWxsaXNlY29uZHMsIHNlY29uZHMsIG1pbnV0ZXMsIGhvdXJzLCBkYXlzKSB7XHJcbiAgICAgICAgdmFyIHZlcnNpb24gPSBcIjEuMlwiLFxyXG4gICAgICAgICAgICAvLyBNaWxsaXNlY29uZC1jb25zdGFudHNcclxuICAgICAgICAgICAgbXNlY1BlclNlY29uZCA9IDEwMDAsXHJcbiAgICAgICAgICAgIG1zZWNQZXJNaW51dGUgPSA2MDAwMCxcclxuICAgICAgICAgICAgbXNlY1BlckhvdXIgPSAzNjAwMDAwLFxyXG4gICAgICAgICAgICBtc2VjUGVyRGF5ID0gODY0MDAwMDAsXHJcbiAgICAgICAgICAgIC8vIEludGVybmFsbHkgd2Ugc3RvcmUgdGhlIFRpbWVTcGFuIGFzIE1pbGxpc2Vjb25kc1xyXG4gICAgICAgICAgICBtc2VjcyA9IDAsXHJcblxyXG4gICAgICAgICAgICAvLyBIZWxwZXIgZnVuY3Rpb25zXHJcbiAgICAgICAgICAgIGlzTnVtZXJpYyA9IGZ1bmN0aW9uIChpbnB1dCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KGlucHV0KSkgJiYgaXNGaW5pdGUoaW5wdXQpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBDb25zdHJ1Y3RvciBMb2dpY1xyXG4gICAgICAgIGlmIChpc051bWVyaWMoZGF5cykpIHtcclxuICAgICAgICAgICAgbXNlY3MgKz0gKGRheXMgKiBtc2VjUGVyRGF5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzTnVtZXJpYyhob3VycykpIHtcclxuICAgICAgICAgICAgbXNlY3MgKz0gKGhvdXJzICogbXNlY1BlckhvdXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNOdW1lcmljKG1pbnV0ZXMpKSB7XHJcbiAgICAgICAgICAgIG1zZWNzICs9IChtaW51dGVzICogbXNlY1Blck1pbnV0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc051bWVyaWMoc2Vjb25kcykpIHtcclxuICAgICAgICAgICAgbXNlY3MgKz0gKHNlY29uZHMgKiBtc2VjUGVyU2Vjb25kKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzTnVtZXJpYyhtaWxsaXNlY29uZHMpKSB7XHJcbiAgICAgICAgICAgIG1zZWNzICs9IG1pbGxpc2Vjb25kcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEFkZGl0aW9uIEZ1bmN0aW9uc1xyXG4gICAgICAgIHRoaXMuYWRkTWlsbGlzZWNvbmRzID0gZnVuY3Rpb24gKG1pbGxpc2Vjb25kcykge1xyXG4gICAgICAgICAgICBpZiAoIWlzTnVtZXJpYyhtaWxsaXNlY29uZHMpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbXNlY3MgKz0gbWlsbGlzZWNvbmRzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5hZGRTZWNvbmRzID0gZnVuY3Rpb24gKHNlY29uZHMpIHtcclxuICAgICAgICAgICAgaWYgKCFpc051bWVyaWMoc2Vjb25kcykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtc2VjcyArPSAoc2Vjb25kcyAqIG1zZWNQZXJTZWNvbmQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5hZGRNaW51dGVzID0gZnVuY3Rpb24gKG1pbnV0ZXMpIHtcclxuICAgICAgICAgICAgaWYgKCFpc051bWVyaWMobWludXRlcykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtc2VjcyArPSAobWludXRlcyAqIG1zZWNQZXJNaW51dGUpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5hZGRIb3VycyA9IGZ1bmN0aW9uIChob3Vycykge1xyXG4gICAgICAgICAgICBpZiAoIWlzTnVtZXJpYyhob3VycykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtc2VjcyArPSAoaG91cnMgKiBtc2VjUGVySG91cik7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmFkZERheXMgPSBmdW5jdGlvbiAoZGF5cykge1xyXG4gICAgICAgICAgICBpZiAoIWlzTnVtZXJpYyhkYXlzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1zZWNzICs9IChkYXlzICogbXNlY1BlckRheSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gU3VidHJhY3Rpb24gRnVuY3Rpb25zXHJcbiAgICAgICAgdGhpcy5zdWJ0cmFjdE1pbGxpc2Vjb25kcyA9IGZ1bmN0aW9uIChtaWxsaXNlY29uZHMpIHtcclxuICAgICAgICAgICAgaWYgKCFpc051bWVyaWMobWlsbGlzZWNvbmRzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1zZWNzIC09IG1pbGxpc2Vjb25kcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuc3VidHJhY3RTZWNvbmRzID0gZnVuY3Rpb24gKHNlY29uZHMpIHtcclxuICAgICAgICAgICAgaWYgKCFpc051bWVyaWMoc2Vjb25kcykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtc2VjcyAtPSAoc2Vjb25kcyAqIG1zZWNQZXJTZWNvbmQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5zdWJ0cmFjdE1pbnV0ZXMgPSBmdW5jdGlvbiAobWludXRlcykge1xyXG4gICAgICAgICAgICBpZiAoIWlzTnVtZXJpYyhtaW51dGVzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1zZWNzIC09IChtaW51dGVzICogbXNlY1Blck1pbnV0ZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnN1YnRyYWN0SG91cnMgPSBmdW5jdGlvbiAoaG91cnMpIHtcclxuICAgICAgICAgICAgaWYgKCFpc051bWVyaWMoaG91cnMpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbXNlY3MgLT0gKGhvdXJzICogbXNlY1BlckhvdXIpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5zdWJ0cmFjdERheXMgPSBmdW5jdGlvbiAoZGF5cykge1xyXG4gICAgICAgICAgICBpZiAoIWlzTnVtZXJpYyhkYXlzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1zZWNzIC09IChkYXlzICogbXNlY1BlckRheSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gRnVuY3Rpb25zIHRvIGludGVyYWN0IHdpdGggb3RoZXIgVGltZVNwYW5zXHJcbiAgICAgICAgdGhpcy5pc1RpbWVTcGFuID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmFkZCA9IGZ1bmN0aW9uIChvdGhlclRpbWVTcGFuKSB7XHJcbiAgICAgICAgICAgIGlmICghb3RoZXJUaW1lU3Bhbi5pc1RpbWVTcGFuKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbXNlY3MgKz0gb3RoZXJUaW1lU3Bhbi50b3RhbE1pbGxpc2Vjb25kcygpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5zdWJ0cmFjdCA9IGZ1bmN0aW9uIChvdGhlclRpbWVTcGFuKSB7XHJcbiAgICAgICAgICAgIGlmICghb3RoZXJUaW1lU3Bhbi5pc1RpbWVTcGFuKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbXNlY3MgLT0gb3RoZXJUaW1lU3Bhbi50b3RhbE1pbGxpc2Vjb25kcygpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5lcXVhbHMgPSBmdW5jdGlvbiAob3RoZXJUaW1lU3Bhbikge1xyXG4gICAgICAgICAgICBpZiAoIW90aGVyVGltZVNwYW4uaXNUaW1lU3Bhbikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBtc2VjcyA9PT0gb3RoZXJUaW1lU3Bhbi50b3RhbE1pbGxpc2Vjb25kcygpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIEdldHRlcnNcclxuICAgICAgICB0aGlzLnRvdGFsTWlsbGlzZWNvbmRzID0gZnVuY3Rpb24gKHJvdW5kRG93bikge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbXNlY3M7XHJcbiAgICAgICAgICAgIGlmIChyb3VuZERvd24gPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IE1hdGguZmxvb3IocmVzdWx0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy50b3RhbFNlY29uZHMgPSBmdW5jdGlvbiAocm91bmREb3duKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBtc2VjcyAvIG1zZWNQZXJTZWNvbmQ7XHJcbiAgICAgICAgICAgIGlmIChyb3VuZERvd24gPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IE1hdGguZmxvb3IocmVzdWx0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy50b3RhbE1pbnV0ZXMgPSBmdW5jdGlvbiAocm91bmREb3duKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBtc2VjcyAvIG1zZWNQZXJNaW51dGU7XHJcbiAgICAgICAgICAgIGlmIChyb3VuZERvd24gPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IE1hdGguZmxvb3IocmVzdWx0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy50b3RhbEhvdXJzID0gZnVuY3Rpb24gKHJvdW5kRG93bikge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbXNlY3MgLyBtc2VjUGVySG91cjtcclxuICAgICAgICAgICAgaWYgKHJvdW5kRG93biA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gTWF0aC5mbG9vcihyZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnRvdGFsRGF5cyA9IGZ1bmN0aW9uIChyb3VuZERvd24pIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG1zZWNzIC8gbXNlY1BlckRheTtcclxuICAgICAgICAgICAgaWYgKHJvdW5kRG93biA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gTWF0aC5mbG9vcihyZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvLyBSZXR1cm4gYSBGcmFjdGlvbiBvZiB0aGUgVGltZVNwYW5cclxuICAgICAgICB0aGlzLm1pbGxpc2Vjb25kcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1zZWNzICUgMTAwMDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuc2Vjb25kcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IobXNlY3MgLyBtc2VjUGVyU2Vjb25kKSAlIDYwO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5taW51dGVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihtc2VjcyAvIG1zZWNQZXJNaW51dGUpICUgNjA7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmhvdXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihtc2VjcyAvIG1zZWNQZXJIb3VyKSAlIDI0O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5kYXlzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihtc2VjcyAvIG1zZWNQZXJEYXkpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIE1pc2MuIEZ1bmN0aW9uc1xyXG4gICAgICAgIHRoaXMuZ2V0VmVyc2lvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZlcnNpb247XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSk7XHJcblxyXG4vLyBcIlN0YXRpYyBDb25zdHJ1Y3RvcnNcIlxyXG5CaWZyb3N0LlRpbWVTcGFuLnplcm8gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBuZXcgQmlmcm9zdC5UaW1lU3BhbigwLCAwLCAwLCAwLCAwKTtcclxufTtcclxuQmlmcm9zdC5UaW1lU3Bhbi5mcm9tTWlsbGlzZWNvbmRzID0gZnVuY3Rpb24gKG1pbGxpc2Vjb25kcykge1xyXG4gICAgcmV0dXJuIG5ldyBCaWZyb3N0LlRpbWVTcGFuKG1pbGxpc2Vjb25kcywgMCwgMCwgMCwgMCk7XHJcbn07XHJcbkJpZnJvc3QuVGltZVNwYW4uZnJvbVNlY29uZHMgPSBmdW5jdGlvbiAoc2Vjb25kcykge1xyXG4gICAgcmV0dXJuIG5ldyBCaWZyb3N0LlRpbWVTcGFuKDAsIHNlY29uZHMsIDAsIDAsIDApO1xyXG59O1xyXG5CaWZyb3N0LlRpbWVTcGFuLmZyb21NaW51dGVzID0gZnVuY3Rpb24gKG1pbnV0ZXMpIHtcclxuICAgIHJldHVybiBuZXcgQmlmcm9zdC5UaW1lU3BhbigwLCAwLCBtaW51dGVzLCAwLCAwKTtcclxufTtcclxuQmlmcm9zdC5UaW1lU3Bhbi5mcm9tSG91cnMgPSBmdW5jdGlvbiAoaG91cnMpIHtcclxuICAgIHJldHVybiBuZXcgQmlmcm9zdC5UaW1lU3BhbigwLCAwLCAwLCBob3VycywgMCk7XHJcbn07XHJcbkJpZnJvc3QuVGltZVNwYW4uZnJvbURheXMgPSBmdW5jdGlvbiAoZGF5cykge1xyXG4gICAgcmV0dXJuIG5ldyBCaWZyb3N0LlRpbWVTcGFuKDAsIDAsIDAsIDAsIGRheXMpO1xyXG59O1xyXG5CaWZyb3N0LlRpbWVTcGFuLmZyb21EYXRlcyA9IGZ1bmN0aW9uIChmaXJzdERhdGUsIHNlY29uZERhdGUsIGZvcmNlUG9zaXRpdmUpIHtcclxuICAgIHZhciBkaWZmZXJlbmNlTXNlY3MgPSBzZWNvbmREYXRlLnZhbHVlT2YoKSAtIGZpcnN0RGF0ZS52YWx1ZU9mKCk7XHJcbiAgICBpZiAoZm9yY2VQb3NpdGl2ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIGRpZmZlcmVuY2VNc2VjcyA9IE1hdGguYWJzKGRpZmZlcmVuY2VNc2Vjcyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IEJpZnJvc3QuVGltZVNwYW4oZGlmZmVyZW5jZU1zZWNzLCAwLCAwLCAwLCAwKTtcclxufTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIEV2ZW50OiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc3Vic2NyaWJlcnMgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5zdWJzY3JpYmUgPSBmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xyXG4gICAgICAgICAgICBzdWJzY3JpYmVycy5wdXNoKHN1YnNjcmliZXIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMudHJpZ2dlciA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIHN1YnNjcmliZXJzLmZvckVhY2goZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcclxuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgc3lzdGVtRXZlbnRzOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5yZWFkTW9kZWxzID0gQmlmcm9zdC5yZWFkLnJlYWRNb2RlbFN5c3RlbUV2ZW50cy5jcmVhdGUoKTtcclxuICAgICAgICB0aGlzLmNvbW1hbmRzID0gQmlmcm9zdC5jb21tYW5kcy5jb21tYW5kRXZlbnRzLmNyZWF0ZSgpO1xyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIudHlwZXMuc3lzdGVtRXZlbnRzID0gQmlmcm9zdC5zeXN0ZW1FdmVudHM7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIGRpc3BhdGNoZXI6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnNjaGVkdWxlID0gZnVuY3Rpb24gKG1pbGxpc2Vjb25kcywgY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dChjYWxsYmFjaywgbWlsbGlzZWNvbmRzKTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7Iiwia28uZXh0ZW5kZXJzLmxpbmtlZCA9IGZ1bmN0aW9uICh0YXJnZXQsIG9wdGlvbnMpIHtcclxuICAgIGZ1bmN0aW9uIHNldHVwVmFsdWVTdWJzY3JpcHRpb24odmFsdWUpIHtcclxuICAgICAgICBpZiAoa28uaXNPYnNlcnZhYmxlKHZhbHVlKSkge1xyXG4gICAgICAgICAgICB2YXIgc3Vic2NyaXB0aW9uID0gdmFsdWUuc3Vic2NyaWJlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldC52YWx1ZUhhc011dGF0ZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRhcmdldC5fcHJldmlvdXNMaW5rZWRTdWJzY3JpcHRpb24gPSBzdWJzY3JpcHRpb247XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRhcmdldC5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRhcmdldC5fcHJldmlvdXNMaW5rZWRTdWJzY3JpcHRpb24pIHtcclxuICAgICAgICAgICAgdGFyZ2V0Ll9wcmV2aW91c0xpbmtlZFN1YnNjcmlwdGlvbi5kaXNwb3NlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldHVwVmFsdWVTdWJzY3JpcHRpb24obmV3VmFsdWUpO1xyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBjdXJyZW50VmFsdWUgPSB0YXJnZXQoKTtcclxuICAgIHNldHVwVmFsdWVTdWJzY3JpcHRpb24oY3VycmVudFZhbHVlKTtcclxufTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaHVic1wiLCB7XHJcbiAgICBodWJDb25uZWN0aW9uOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBodWIgPSAkLmh1YkNvbm5lY3Rpb24oXCIvc2lnbmFsclwiLCB7IHVzZURlZmF1bHRQYXRoOiBmYWxzZSB9KTtcclxuICAgICAgICAvKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXHJcbiAgICAgICAgJC5zaWduYWxSLmh1YiA9IGh1YjtcclxuICAgICAgICAvKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xyXG5cclxuICAgICAgICB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0ZWQgPSBCaWZyb3N0LkV2ZW50LmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZVByb3h5ID0gZnVuY3Rpb24gKGh1Yk5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIHByb3h5ID0gaHViLmNyZWF0ZUh1YlByb3h5KGh1Yk5hbWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJveHk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8kLmNvbm5lY3Rpb24uaHViLmxvZ2dpbmcgPSB0cnVlO1xyXG4gICAgICAgICQuY29ubmVjdGlvbi5odWIuc3RhcnQoKS5kb25lKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJIdWIgY29ubmVjdGlvbiB1cCBhbmQgcnVubmluZ1wiKTtcclxuICAgICAgICAgICAgc2VsZi5pc0Nvbm5lY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdGVkLnRyaWdnZXIoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLmh1YkNvbm5lY3Rpb24gPSBCaWZyb3N0Lmh1YnMuaHViQ29ubmVjdGlvbjsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaHVic1wiLCB7XHJcbiAgICBIdWI6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKGh1YkNvbm5lY3Rpb24pIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciBwcm94eSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG1ha2VDbGllbnRQcm94eUZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jbGllbnQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgdmFyIGNsaWVudCA9IHt9O1xyXG4gICAgICAgICAgICBjYWxsYmFjayhjbGllbnQpO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gY2xpZW50KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBjbGllbnRbcHJvcGVydHldO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzRnVuY3Rpb24odmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcHJveHkub24ocHJvcGVydHksIG1ha2VDbGllbnRQcm94eUZ1bmN0aW9uKHZhbHVlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNlcnZlciA9IHt9O1xyXG5cclxuICAgICAgICB2YXIgZGVsYXllZFNlcnZlckludm9jYXRpb25zID0gW107XHJcblxyXG4gICAgICAgIGh1YkNvbm5lY3Rpb24uY29ubmVjdGVkLnN1YnNjcmliZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGRlbGF5ZWRTZXJ2ZXJJbnZvY2F0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChpbnZvY2F0aW9uRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIGludm9jYXRpb25GdW5jdGlvbigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbWFrZUludm9jYXRpb25GdW5jdGlvbihwcm9taXNlLCBtZXRob2QsIGFyZ3MpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhcmd1bWVudHNBc0FycmF5ID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBhcmcgPSAwOyBhcmcgPCBhcmdzLmxlbmd0aDsgYXJnKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHNBc0FycmF5LnB1c2goYXJnc1thcmddKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgYWxsQXJndW1lbnRzID0gW21ldGhvZF0uY29uY2F0KGFyZ3VtZW50c0FzQXJyYXkpO1xyXG4gICAgICAgICAgICAgICAgcHJveHkuaW52b2tlLmFwcGx5KHByb3h5LCBhbGxBcmd1bWVudHMpLmRvbmUoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW52b2tlU2VydmVyTWV0aG9kID0gZnVuY3Rpb24gKG1ldGhvZCwgYXJncykge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaW52b2NhdGlvbkZ1bmN0aW9uID0gbWFrZUludm9jYXRpb25GdW5jdGlvbihwcm9taXNlLCBtZXRob2QsIGFyZ3MpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGh1YkNvbm5lY3Rpb24uaXNDb25uZWN0ZWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxheWVkU2VydmVySW52b2NhdGlvbnMucHVzaChpbnZvY2F0aW9uRnVuY3Rpb24pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaW52b2NhdGlvbkZ1bmN0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMub25DcmVhdGVkID0gZnVuY3Rpb24gKGxhc3REZXNjZW5kYW50KSB7XHJcbiAgICAgICAgICAgIHByb3h5ID0gaHViQ29ubmVjdGlvbi5jcmVhdGVQcm94eShsYXN0RGVzY2VuZGFudC5fbmFtZSk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG4iLCJCaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlcnMuaHViID0ge1xyXG4gICAgY2FuUmVzb2x2ZTogZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgaHVicyAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gbmFtZSBpbiBodWJzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc29sdmU6IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gaHVic1tuYW1lXS5jcmVhdGUoKTtcclxuICAgIH1cclxufTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW9cIiwge1xyXG4gICAgZmlsZVR5cGU6IHtcclxuICAgICAgICB1bmtub3duOiAwLFxyXG4gICAgICAgIHRleHQ6IDEsXHJcbiAgICAgICAgamF2YVNjcmlwdDogMixcclxuICAgICAgICBodG1sOiAzXHJcbiAgICB9XHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5pb1wiLCB7XHJcbiAgICBGaWxlOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uIChwYXRoKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSBmaWxlPC9zdW1tYXJ5PlxyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJ0eXBlXCIgdHlwZT1cIkJpZnJvc3QuaW8uZmlsZVR5cGVcIj5UeXBlIG9mIGZpbGUgcmVwcmVzZW50ZWQ8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMudHlwZSA9IEJpZnJvc3QuaW8uZmlsZVR5cGUudW5rbm93bjtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwicGF0aFwiIHR5cGU9XCJCaWZyb3N0LlBhdGhcIj5UaGUgcGF0aCByZXByZXNlbnRpbmcgdGhlIGZpbGU8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMucGF0aCA9IEJpZnJvc3QuUGF0aC5jcmVhdGUoeyBmdWxsUGF0aDogcGF0aCB9KTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5pb1wiLCB7XHJcbiAgICBmaWxlRmFjdG9yeTogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGEgZmFjdG9yeSBmb3IgY3JlYXRpbmcgaW5zdGFuY2VzIG9mIEJpZnJvc3QuaW8uRmlsZTwvc3VtbWFyeT5cclxuICAgICAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uIChwYXRoLCBmaWxlVHlwZSkge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+Q3JlYXRlcyBhIG5ldyBmaWxlPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJwYXRoXCIgdHlwZT1cIlN0cmluZ1wiPlBhdGggb2YgZmlsZTwvcGFyYW0+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cImZpbGVUeXBlXCIgdHlwZT1cIkJpZnJvc3QuaW8uZmlsZVR5cGVcIiBvcHRpb25hbD1cInRydWVcIj5UeXBlIG9mIGZpbGUgdG8gdXNlPC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxyZXR1cm5zIHR5cGU9XCJCaWZyb3N0LmlvLkZpbGVcIj5BbiBpbnN0YW5jZSBvZiBhIGZpbGU8L3JldHVybnM+XHJcblxyXG4gICAgICAgICAgICB2YXIgZmlsZSA9IEJpZnJvc3QuaW8uRmlsZS5jcmVhdGUoeyBwYXRoOiBwYXRoIH0pO1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoZmlsZVR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlLmZpbGVUeXBlID0gZmlsZVR5cGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZpbGU7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLmZpbGVGYWN0b3J5ID0gQmlmcm9zdC5pby5maWxlRmFjdG9yeTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW9cIiwge1xyXG4gICAgZmlsZU1hbmFnZXI6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyBhIG1hbmFnZXIgZm9yIGZpbGVzLCBwcm92aWRpbmcgY2FwYWJpbGl0aWVzIG9mIGxvYWRpbmcgYW5kIG1vcmU8L3N1bW1hcnk+XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgdXJpID0gQmlmcm9zdC5VcmkuY3JlYXRlKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLnByb3RvY29sID09PSBcImZpbGU6XCIpIHtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSB0aGlzLm9yaWdpbi5zdWJzdHIoMCwgdGhpcy5vcmlnaW4ubGFzdEluZGV4T2YoXCIvXCIpKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9yaWdpbi5sYXN0SW5kZXhPZihcIi9cIikgPT09IHRoaXMub3JpZ2luLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub3JpZ2luID0gdGhpcy5vcmlnaW4uc3Vic3RyKDAsIHRoaXMub3JpZ2luLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHBvcnQgPSB1cmkucG9ydCB8fCBcIlwiO1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNVbmRlZmluZWQocG9ydCkgJiYgcG9ydCAhPT0gXCJcIiAmJiBwb3J0ICE9PSA4MCkge1xyXG4gICAgICAgICAgICAgICAgcG9ydCA9IFwiOlwiICsgcG9ydDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSB1cmkuc2NoZW1lICsgXCI6Ly9cIiArIHVyaS5ob3N0ICsgcG9ydDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldEFjdHVhbEZpbGVuYW1lKGZpbGVuYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciBhY3R1YWxGaWxlbmFtZSA9IHNlbGYub3JpZ2luO1xyXG5cclxuICAgICAgICAgICAgaWYgKGZpbGVuYW1lLmluZGV4T2YoXCIvXCIpICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBhY3R1YWxGaWxlbmFtZSArPSBcIi9cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhY3R1YWxGaWxlbmFtZSArPSBmaWxlbmFtZTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhY3R1YWxGaWxlbmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubG9hZCA9IGZ1bmN0aW9uIChmaWxlcykge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+TG9hZCBmaWxlczwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBwYXJhbWV0ZXJBcnJheT1cInRydWVcIiBlbGVtZW50VHlwZT1cIkJpZnJvc3QuaW8uRmlsZVwiPkZpbGVzIHRvIGxvYWQ8L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHJldHVybnMgdHlwZT1cIkJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2VcIj5BIHByb21pc2UgdGhhdCBjYW4gYmUgY29udGludWVkIHdpdGggdGhlIGFjdHVhbCBmaWxlcyBjb21pbmcgaW4gYXMgYW4gYXJyYXk8L3JldHVybnM+XHJcbiAgICAgICAgICAgIHZhciBmaWxlc1RvTG9hZCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgZmlsZXMuZm9yRWFjaChmdW5jdGlvbiAoZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhdGggPSBnZXRBY3R1YWxGaWxlbmFtZShmaWxlLnBhdGguZnVsbFBhdGgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGZpbGUuZmlsZVR5cGUgPT09IEJpZnJvc3QuaW8uZmlsZVR5cGUuaHRtbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhdGggPSBcInRleHQhXCIgKyBwYXRoICsgXCIhc3RyaXBcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmaWxlc1RvTG9hZC5wdXNoKHBhdGgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVpcmUoZmlsZXNUb0xvYWQsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLmZpbGVNYW5hZ2VyID0gQmlmcm9zdC5pby5maWxlTWFuYWdlcjsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Quc3BlY2lmaWNhdGlvbnNcIiwge1xyXG4gICAgU3BlY2lmaWNhdGlvbjogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSBydWxlIGJhc2VkIG9uIHRoZSBzcGVjaWZpY2F0aW9uIHBhdHRlcm48L3N1bW1hcnk+XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjdXJyZW50SW5zdGFuY2UgPSBrby5vYnNlcnZhYmxlKCk7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImV2YWx1YXRvclwiPlxyXG4gICAgICAgIC8vLyBIb2xkcyB0aGUgZXZhbHVhdG9yIHRvIGJlIHVzZWQgdG8gZXZhbHVhdGUgd2V0aGVyIG9yIG5vdCB0aGUgcnVsZSBpcyBzYXRpc2ZpZWRcclxuICAgICAgICAvLy8gPC9maWVsZD5cclxuICAgICAgICAvLy8gPHJlbWFya3M+XHJcbiAgICAgICAgLy8vIFRoZSBldmFsdWF0b3IgY2FuIGVpdGhlciBiZSBhIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgd2l0aCB0aGUgaW5zdGFuY2VcclxuICAgICAgICAvLy8gb3IgYW4gb2JzZXJ2YWJsZS4gVGhlIG9ic2VydmFibGUgbm90IGJlaW5nIGEgcmVndWxhciBmdW5jdGlvbiB3aWxsIG9idmlvdXNseVxyXG4gICAgICAgIC8vLyBub3QgaGF2ZSB0aGUgaW5zdGFuY2UgcGFzc2VkXHJcbiAgICAgICAgLy8vIDwvcmVtYXJrcz5cclxuICAgICAgICB0aGlzLmV2YWx1YXRvciA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImlzU2F0aXNmaWVkXCI+T2JzZXJ2YWJsZSB0aGF0IGhvbGRzIHRoZSByZXN1bHQgb2YgYW55IGV2YWx1YXRpb25zIGJlaW5nIGRvbmU8L2ZpZWxkPlxyXG4gICAgICAgIC8vLyA8cmVtYXJrcz5cclxuICAgICAgICAvLy8gRHVlIHRvIGl0cyBuYXR1cmUgb2YgYmVpbmcgYW4gb2JzZXJ2YWJsZSwgaXQgd2lsbCByZS1ldmFsdWF0ZSBpZiB0aGUgZXZhbHVhdG9yXHJcbiAgICAgICAgLy8vIGlzIGFuIG9ic2VydmFibGUgYW5kIGl0cyBzdGF0ZSBjaGFuZ2VzLlxyXG4gICAgICAgIC8vLyA8L3JlbWFya3M+XHJcbiAgICAgICAgdGhpcy5pc1NhdGlzZmllZCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZShzZWxmLmV2YWx1YXRvcikpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmV2YWx1YXRvcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IGN1cnJlbnRJbnN0YW5jZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGluc3RhbmNlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZXZhbHVhdG9yKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZXZhbHVhdGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkV2YWx1YXRlcyB0aGUgcnVsZTwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiaW5zdGFuY2VcIj5PYmplY3QgaW5zdGFuY2UgdXNlZCBkdXJpbmcgZXZhbHVhdGlvbjwvcGFyYW0+XHJcbiAgICAgICAgICAgIC8vLyA8cmV0dXJucz5UcnVlIGlmIHNhdGlzZmllZCwgZmFsc2UgaWYgbm90PC9yZXR1cm5zPlxyXG4gICAgICAgICAgICBjdXJyZW50SW5zdGFuY2UoaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuaXNTYXRpc2ZpZWQoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmFuZCA9IGZ1bmN0aW9uIChydWxlKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5UYWtlcyB0aGlzIHJ1bGUgYW5kIFwiYW5kc1wiIGl0IHRvZ2V0aGVyIHdpdGggYW5vdGhlciBydWxlPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJydWxlXCI+XHJcbiAgICAgICAgICAgIC8vLyBUaGlzIGNhbiBlaXRoZXIgYmUgdGhlIGluc3RhbmNlIG9mIGFub3RoZXIgc3BlY2lmaWMgcnVsZSxcclxuICAgICAgICAgICAgLy8vIG9yIGFuIGV2YWx1YXRvciB0aGF0IGNhbiBiZSB1c2VkIGRpcmVjdGx5IGJ5IHRoZSBkZWZhdWx0IHJ1bGUgaW1wbGVtZW50YXRpb25cclxuICAgICAgICAgICAgLy8vIDwvcGFyYW0+XHJcbiAgICAgICAgICAgIC8vLyA8cmV0dXJucz5BIG5ldyBjb21wb3NlZCBydWxlPC9yZXR1cm5zPlxyXG5cclxuICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNGdW5jdGlvbihydWxlKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9sZFJ1bGUgPSBydWxlO1xyXG4gICAgICAgICAgICAgICAgcnVsZSA9IEJpZnJvc3Quc3BlY2lmaWNhdGlvbnMuU3BlY2lmaWNhdGlvbi5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgIHJ1bGUuZXZhbHVhdG9yID0gb2xkUnVsZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGFuZCA9IEJpZnJvc3Quc3BlY2lmaWNhdGlvbnMuQW5kLmNyZWF0ZSh0aGlzLCBydWxlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGFuZDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9yID0gZnVuY3Rpb24gKHJ1bGUpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PlRha2VzIHRoaXMgcnVsZSBhbmQgXCJvcnNcIiBpdCB0b2dldGhlciB3aXRoIGFub3RoZXIgcnVsZTwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwicnVsZVwiPlxyXG4gICAgICAgICAgICAvLy8gVGhpcyBjYW4gZWl0aGVyIGJlIHRoZSBpbnN0YW5jZSBvZiBhbm90aGVyIHNwZWNpZmljIHJ1bGUsXHJcbiAgICAgICAgICAgIC8vLyBvciBhbiBldmFsdWF0b3IgdGhhdCBjYW4gYmUgdXNlZCBkaXJlY3RseSBieSB0aGUgZGVmYXVsdCBydWxlIGltcGxlbWVudGF0aW9uXHJcbiAgICAgICAgICAgIC8vLyA8L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHJldHVybnM+QSBuZXcgY29tcG9zZWQgcnVsZTwvcmV0dXJucz5cclxuXHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzRnVuY3Rpb24ocnVsZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBvbGRSdWxlID0gcnVsZTtcclxuICAgICAgICAgICAgICAgIHJ1bGUgPSBCaWZyb3N0LnNwZWNpZmljYXRpb25zLlNwZWNpZmljYXRpb24uY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBydWxlLmV2YWx1YXRvciA9IG9sZFJ1bGU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBvciA9IEJpZnJvc3Quc3BlY2lmaWNhdGlvbnMuT3IuY3JlYXRlKHRoaXMsIHJ1bGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gb3I7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LnNwZWNpZmljYXRpb25zLlNwZWNpZmljYXRpb24ud2hlbiA9IGZ1bmN0aW9uIChldmFsdWF0b3IpIHtcclxuICAgIC8vLyA8c3VtbWFyeT5TdGFydHMgYSBydWxlIGNoYWluPC9zdW1tYXJ5PlxyXG4gICAgLy8vIDxwYXJhbSBuYW1lPVwiZXZhbHVhdG9yXCI+XHJcbiAgICAvLy8gVGhlIGV2YWx1YXRvciBjYW4gZWl0aGVyIGJlIGEgZnVuY3Rpb24gdGhhdCBnZXRzIGNhbGxlZCB3aXRoIHRoZSBpbnN0YW5jZVxyXG4gICAgLy8vIG9yIGFuIG9ic2VydmFibGUuIFRoZSBvYnNlcnZhYmxlIG5vdCBiZWluZyBhIHJlZ3VsYXIgZnVuY3Rpb24gd2lsbCBvYnZpb3VzbHlcclxuICAgIC8vLyBub3QgaGF2ZSB0aGUgaW5zdGFuY2UgcGFzc2VkXHJcbiAgICAvLy8gPC9wYXJhbT5cclxuICAgIC8vLyA8cmV0dXJucz5BIG5ldyBjb21wb3NlZCBydWxlPC9yZXR1cm5zPlxyXG4gICAgdmFyIHJ1bGUgPSBCaWZyb3N0LnNwZWNpZmljYXRpb25zLlNwZWNpZmljYXRpb24uY3JlYXRlKCk7XHJcbiAgICBydWxlLmV2YWx1YXRvciA9IGV2YWx1YXRvcjtcclxuICAgIHJldHVybiBydWxlO1xyXG59OyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5zcGVjaWZpY2F0aW9uc1wiLCB7XHJcbiAgICBBbmQ6IEJpZnJvc3Quc3BlY2lmaWNhdGlvbnMuU3BlY2lmaWNhdGlvbi5leHRlbmQoZnVuY3Rpb24gKGxlZnRIYW5kU2lkZSwgcmlnaHRIYW5kU2lkZSkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIHRoZSBcImFuZFwiIGNvbXBvc2l0ZSBydWxlIGJhc2VkIG9uIHRoZSBzcGVjaWZpY2F0aW9uIHBhdHRlcm48L3N1bW1hcnk+XHJcblxyXG4gICAgICAgIHRoaXMuaXNTYXRpc2ZpZWQgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsZWZ0SGFuZFNpZGUuaXNTYXRpc2ZpZWQoKSAmJlxyXG4gICAgICAgICAgICAgICAgcmlnaHRIYW5kU2lkZS5pc1NhdGlzZmllZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmV2YWx1YXRlID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIGxlZnRIYW5kU2lkZS5ldmFsdWF0ZShpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIHJpZ2h0SGFuZFNpZGUuZXZhbHVhdGUoaW5zdGFuY2UpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Quc3BlY2lmaWNhdGlvbnNcIiwge1xyXG4gICAgT3I6IEJpZnJvc3Quc3BlY2lmaWNhdGlvbnMuU3BlY2lmaWNhdGlvbi5leHRlbmQoZnVuY3Rpb24gKGxlZnRIYW5kU2lkZSwgcmlnaHRIYW5kU2lkZSkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIHRoZSBcIm9yXCIgY29tcG9zaXRlIHJ1bGUgYmFzZWQgb24gdGhlIHNwZWNpZmljYXRpb24gcGF0dGVybjwvc3VtbWFyeT5cclxuXHJcbiAgICAgICAgdGhpcy5pc1NhdGlzZmllZCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxlZnRIYW5kU2lkZS5pc1NhdGlzZmllZCgpIHx8XHJcbiAgICAgICAgICAgICAgICByaWdodEhhbmRTaWRlLmlzU2F0aXNmaWVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZXZhbHVhdGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgbGVmdEhhbmRTaWRlLmV2YWx1YXRlKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgcmlnaHRIYW5kU2lkZS5ldmFsdWF0ZShpbnN0YW5jZSk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC50YXNrc1wiLCB7XHJcbiAgICBUYXNrOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyBhIHRhc2sgdGhhdCBjYW4gYmUgZG9uZSBpbiB0aGUgc3lzdGVtPC9zdW1tYXJ5PlxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiZXJyb3JzXCIgdHlwZT1cIm9ic2VydmFibGVBcnJheVwiPk9ic2VydmFibGUgYXJyYXkgb2YgZXJyb3JzPC9maWVsZD5cclxuICAgICAgICB0aGlzLmVycm9ycyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJpc0V4Y2V1dGluZ1wiIHR5cGU9XCJib29sZWFuXCI+VHJ1ZSAvIGZhbHNlIGZvciB0ZWxsaW5nIHdldGhlciBvciBub3QgdGhlIHRhc2sgaXMgZXhlY3V0aW5nIG9yIG5vdDwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5pc0V4ZWN1dGluZyA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG5cclxuICAgICAgICB0aGlzLmV4ZWN1dGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5FeGVjdXRlcyB0aGUgdGFzazwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxyZXR1cm5zPkEgcHJvbWlzZTwvcmV0dXJucz5cclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICBwcm9taXNlLnNpZ25hbCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnJlcG9ydEVycm9yID0gZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5SZXBvcnQgYW4gZXJyb3IgZnJvbSBleGVjdXRpbmcgdGhlIHRhc2s8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cImVycm9yXCIgdHlwZT1cIlN0cmluZ1wiPkVycm9yIGNvbWluZyBiYWNrPC9wYXJhbT5cclxuICAgICAgICAgICAgc2VsZi5lcnJvcnMucHVzaChlcnJvcik7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC50YXNrc1wiLCB7XHJcbiAgICBUYXNrSGlzdG9yeUVudHJ5OiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMudHlwZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5jb250ZW50ID0gXCJcIjtcclxuXHJcbiAgICAgICAgdGhpcy5iZWdpbiA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICB0aGlzLmVuZCA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICB0aGlzLnRvdGFsID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoc2VsZi5lbmQoKSkgJiZcclxuICAgICAgICAgICAgICAgICFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHNlbGYuYmVnaW4oKSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmVuZCgpIC0gc2VsZi5iZWdpbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVzdWx0ID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgIHRoaXMuZXJyb3IgPSBrby5vYnNlcnZhYmxlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuaXNGaW5pc2hlZCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHNlbGYuZW5kKCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaGFzRmFpbGVkID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoc2VsZi5lcnJvcigpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5pc1N1Y2Nlc3MgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmlzRmluaXNoZWQoKSAmJiAhc2VsZi5oYXNGYWlsZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC50YXNrc1wiLCB7XHJcbiAgICB0YXNrSGlzdG9yeTogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKHN5c3RlbUNsb2NrKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgdGhlIGhpc3Rvcnkgb2YgdGFza3MgdGhhdCBoYXMgYmVlbiBleGVjdXRlZCBzaW5jZSB0aGUgc3RhcnQgb2YgdGhlIGFwcGxpY2F0aW9uPC9zdW1tYXJ5PlxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIGVudHJpZXNCeUlkID0ge307XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgcGFyYW09XCJlbnRyaWVzXCIgdHlwZT1cIm9ic2VydmFibGVBcnJheVwiPk9ic2VydmFibGUgYXJyYXkgb2YgZW50cmllczwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5lbnRyaWVzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcblxyXG4gICAgICAgIHRoaXMuYmVnaW4gPSBmdW5jdGlvbiAodGFzaykge1xyXG4gICAgICAgICAgICB2YXIgaWQgPSBCaWZyb3N0Lkd1aWQuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVudHJ5ID0gQmlmcm9zdC50YXNrcy5UYXNrSGlzdG9yeUVudHJ5LmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGVudHJ5LnR5cGUgPSB0YXNrLl90eXBlLl9uYW1lO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjb250ZW50ID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gdGFzaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5pbmRleE9mKFwiX1wiKSAhPT0gMCAmJiB0YXNrLmhhc093blByb3BlcnR5KHByb3BlcnR5KSAmJiB0eXBlb2YgdGFza1twcm9wZXJ0eV0gIT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50W3Byb3BlcnR5XSA9IHRhc2tbcHJvcGVydHldO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBlbnRyeS5jb250ZW50ID0gSlNPTi5zdHJpbmdpZnkoY29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZW50cnkuYmVnaW4oc3lzdGVtQ2xvY2subm93SW5NaWxsaXNlY29uZHMoKSk7XHJcbiAgICAgICAgICAgICAgICBlbnRyaWVzQnlJZFtpZF0gPSBlbnRyeTtcclxuICAgICAgICAgICAgICAgIHNlbGYuZW50cmllcy5wdXNoKGVudHJ5KTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgIC8vIFRvZG86IHBlcmZlY3QgcGxhY2UgZm9yIGxvZ2dpbmcgc29tZXRoaW5nXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGlkO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZW5kID0gZnVuY3Rpb24gKGlkLCByZXN1bHQpIHtcclxuICAgICAgICAgICAgaWYgKGVudHJpZXNCeUlkLmhhc093blByb3BlcnR5KGlkKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVudHJ5ID0gZW50cmllc0J5SWRbaWRdO1xyXG4gICAgICAgICAgICAgICAgZW50cnkuZW5kKHN5c3RlbUNsb2NrLm5vd0luTWlsbGlzZWNvbmRzKCkpO1xyXG4gICAgICAgICAgICAgICAgZW50cnkucmVzdWx0KHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmZhaWxlZCA9IGZ1bmN0aW9uIChpZCwgZXJyb3IpIHtcclxuICAgICAgICAgICAgaWYgKGVudHJpZXNCeUlkLmhhc093blByb3BlcnR5KGlkKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVudHJ5ID0gZW50cmllc0J5SWRbaWRdO1xyXG4gICAgICAgICAgICAgICAgZW50cnkuZW5kKHN5c3RlbUNsb2NrLm5vd0luTWlsbGlzZWNvbmRzKCkpO1xyXG4gICAgICAgICAgICAgICAgZW50cnkuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLnRhc2tIaXN0b3J5ID0gQmlmcm9zdC50YXNrcy50YXNrSGlzdG9yeTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudGFza3NcIiwge1xyXG4gICAgVGFza3M6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKHRhc2tIaXN0b3J5KSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYW4gYWdncmVnYXRpb24gb2YgdGFza3M8L3N1bW1hcnk+XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJ1bmZpbHRlcmVkXCIgdHlwZT1cIkJpZnJvc3QudGFza3MuVGFza1tdXCI+QWxsIHRhc2tzIGNvbXBsZXRlbHkgdW5maWx0ZXJlZDwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy51bmZpbHRlcmVkID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImV4ZWN1dGVXaGVuXCIgdHlwZT1cIkJpZnJvc3Quc3BlY2lmaWNhdGlvbnMuU3BlY2lmaWNhdGlvblwiPkdldHMgb3Igc2V0cyB0aGUgcnVsZSBmb3IgZXhlY3V0aW9uPC9maWVsZD5cclxuICAgICAgICAvLy8gPHJlbWFya3M+XHJcbiAgICAgICAgLy8vIElmIGEgdGFzayBnZXRzIGV4ZWN1dGVkIHRoYXQgZG9lcyBub3QgZ2V0IHNhdGlzZmllZCBieSB0aGUgcnVsZSwgaXQgd2lsbCBqdXN0IHF1ZXVlIGl0IHVwXHJcbiAgICAgICAgLy8vIDwvcmVtYXJrcz5cclxuICAgICAgICB0aGlzLmNhbkV4ZWN1dGVXaGVuID0ga28ub2JzZXJ2YWJsZSgpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJhbGxcIiB0eXBlPVwiQmlmcm9zdC50YXNrcy5UYXNrW11cIj5BbGwgdGFza3MgYmVpbmcgZXhlY3V0ZWQ8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuYWxsID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgYWxsID0gc2VsZi51bmZpbHRlcmVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcnVsZSA9IHNlbGYuY2FuRXhlY3V0ZVdoZW4oKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChydWxlKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZpbHRlcmVkID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgYWxsLmZvckVhY2goZnVuY3Rpb24gKHRhc2spIHtcclxuICAgICAgICAgICAgICAgICAgICBydWxlLmV2YWx1YXRlKHRhc2spO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChydWxlLmlzU2F0aXNmaWVkKCkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQucHVzaCh0YXNrKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmaWx0ZXJlZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGFsbDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiZXJyb3JzXCIgdHlwZT1cIm9ic2VydmFibGVBcnJheU9mU3RyaW5nXCI+QWxsIGVycm9ycyB0aGF0IG9jY3VyZWQgZHVyaW5nIGV4ZWN1dGlvbiBvZiB0aGUgdGFzazwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5lcnJvcnMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiaXNCdXN5XCIgdHlwZT1cIkJvb2xlYW5cIj5SZXR1cm5zIHRydWUgaWYgdGhlIHN5c3RlbSBpcyBidXN5IHdvcmtpbmcsIGZhbHNlIGlmIG5vdDwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5pc0J1c3kgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmFsbCgpLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGV4ZWN1dGVUYXNrSWZOb3RFeGVjdXRpbmcodGFzaykge1xyXG4gICAgICAgICAgICBpZiAodGFzay5pc0V4ZWN1dGluZygpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGFzay5pc0V4ZWN1dGluZyh0cnVlKTtcclxuICAgICAgICAgICAgdmFyIHRhc2tIaXN0b3J5SWQgPSB0YXNrSGlzdG9yeS5iZWdpbih0YXNrKTtcclxuXHJcbiAgICAgICAgICAgIHRhc2suZXhlY3V0ZSgpLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnVuZmlsdGVyZWQucmVtb3ZlKHRhc2spO1xyXG4gICAgICAgICAgICAgICAgdGFza0hpc3RvcnkuZW5kKHRhc2tIaXN0b3J5SWQsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB0YXNrLnByb21pc2Uuc2lnbmFsKHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH0pLm9uRmFpbChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYudW5maWx0ZXJlZC5yZW1vdmUodGFzayk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmVycm9ycy5wdXNoKHRhc2spO1xyXG4gICAgICAgICAgICAgICAgdGFza0hpc3RvcnkuZmFpbGVkKHRhc2tIaXN0b3J5SWQsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIHRhc2sucHJvbWlzZS5mYWlsKGVycm9yKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmFsbC5zdWJzY3JpYmUoZnVuY3Rpb24gKGNoYW5nZWRUYXNrcykge1xyXG4gICAgICAgICAgICBjaGFuZ2VkVGFza3MuZm9yRWFjaChmdW5jdGlvbiAodGFzaykge1xyXG4gICAgICAgICAgICAgICAgZXhlY3V0ZVRhc2tJZk5vdEV4ZWN1dGluZyh0YXNrKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZXhlY3V0ZSA9IGZ1bmN0aW9uICh0YXNrKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5BZGRzIGEgdGFzayBhbmQgc3RhcnRzIGV4ZWN1dGluZyBpdCByaWdodCBhd2F5PC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJ0YXNrXCIgdHlwZT1cIkJpZnJvc3QudGFza3MuVGFza1wiPlRhc2sgdG8gYWRkPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHJldHVybnM+QSBwcm9taXNlIHRvIHdvcmsgd2l0aCBmb3IgY2hhaW5pbmcgZnVydGhlciBldmVudHM8L3JldHVybnM+XHJcblxyXG4gICAgICAgICAgICB0YXNrLnByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICBzZWxmLnVuZmlsdGVyZWQucHVzaCh0YXNrKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBydWxlID0gc2VsZi5jYW5FeGVjdXRlV2hlbigpO1xyXG4gICAgICAgICAgICB2YXIgY2FuRXhlY3V0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChydWxlKSkge1xyXG4gICAgICAgICAgICAgICAgY2FuRXhlY3V0ZSA9IHJ1bGUuZXZhbHVhdGUodGFzayk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjYW5FeGVjdXRlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBleGVjdXRlVGFza0lmTm90RXhlY3V0aW5nKHRhc2spO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGFzay5wcm9taXNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudGFza3NcIiwge1xyXG4gICAgdGFza3NGYWN0b3J5OiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB0YXNrcyA9IEJpZnJvc3QudGFza3MuVGFza3MuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0YXNrcztcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIudHlwZXMudGFza3NGYWN0b3J5ID0gQmlmcm9zdC50YXNrcy50YXNrc0ZhY3Rvcnk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnRhc2tzXCIsIHtcclxuICAgIEh0dHBHZXRUYXNrOiBCaWZyb3N0LnRhc2tzLlRhc2suZXh0ZW5kKGZ1bmN0aW9uIChzZXJ2ZXIsIHVybCwgcGF5bG9hZCkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGEgdGFzayB0aGF0IGNhbiBwZXJmb3JtIEh0dHAgR2V0IHJlcXVlc3RzPC9zdW1tYXJ5PlxyXG5cclxuICAgICAgICB0aGlzLmV4ZWN1dGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgc2VydmVyXHJcbiAgICAgICAgICAgICAgICAuZ2V0KHVybCwgcGF5bG9hZClcclxuICAgICAgICAgICAgICAgICAgICAuY29udGludWVXaXRoKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5vbkZhaWwoZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2UuZmFpbChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudGFza3NcIiwge1xyXG4gICAgSHR0cFBvc3RUYXNrOiBCaWZyb3N0LnRhc2tzLlRhc2suZXh0ZW5kKGZ1bmN0aW9uIChzZXJ2ZXIsIHVybCwgcGF5bG9hZCkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGEgdGFzayB0aGF0IGNhbiBwZXJmb3JtIGEgSHR0cCBQb3N0IHJlcXVlc3Q8L3N1bW1hcnk+XHJcblxyXG4gICAgICAgIHRoaXMuZXhlY3V0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgc2VydmVyXHJcbiAgICAgICAgICAgICAgICAucG9zdCh1cmwsIHBheWxvYWQpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAub25GYWlsKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLmZhaWwoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnRhc2tzXCIsIHtcclxuICAgIExvYWRUYXNrOiBCaWZyb3N0LnRhc2tzLlRhc2suZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyBhIGJhc2UgdGFzayB0aGF0IHJlcHJlc2VudHMgYW55dGhpbmcgdGhhdCBpcyBsb2FkaW5nIHRoaW5nczwvc3VtbWFyeT5cclxuICAgICAgICB0aGlzLmV4ZWN1dGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC50YXNrc1wiLCB7XHJcbiAgICBGaWxlTG9hZFRhc2s6IEJpZnJvc3QudGFza3MuTG9hZFRhc2suZXh0ZW5kKGZ1bmN0aW9uIChmaWxlcywgZmlsZU1hbmFnZXIpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyBhIHRhc2sgZm9yIGxvYWRpbmcgdmlldyByZWxhdGVkIGZpbGVzIGFzeW5jaHJvbm91c2x5PC9zdW1tYXJ5PlxyXG4gICAgICAgIHRoaXMuZmlsZXMgPSBmaWxlcztcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmZpbGVzID0gW107XHJcbiAgICAgICAgZmlsZXMuZm9yRWFjaChmdW5jdGlvbiAoZmlsZSkge1xyXG4gICAgICAgICAgICBzZWxmLmZpbGVzLnB1c2goZmlsZS5wYXRoLmZ1bGxQYXRoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgICAgICBmaWxlTWFuYWdlci5sb2FkKGZpbGVzKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKGluc3RhbmNlcykge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoaW5zdGFuY2VzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudGFza3NcIiwge1xyXG4gICAgRXhlY3V0aW9uVGFzazogQmlmcm9zdC50YXNrcy5UYXNrLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSBiYXNlIHRhc2sgdGhhdCByZXByZXNlbnRzIGFueXRoaW5nIHRoYXQgaXMgZXhlY3V0aW5nPC9zdW1tYXJ5PlxyXG4gICAgICAgIHRoaXMuZXhlY3V0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIHRhc2tGYWN0b3J5OiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVIdHRwUG9zdCA9IGZ1bmN0aW9uICh1cmwsIHBheWxvYWQpIHtcclxuICAgICAgICAgICAgdmFyIHRhc2sgPSBCaWZyb3N0LnRhc2tzLkh0dHBQb3N0VGFzay5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiBwYXlsb2FkXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdGFzaztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZUh0dHBHZXQgPSBmdW5jdGlvbiAodXJsLCBwYXlsb2FkKSB7XHJcbiAgICAgICAgICAgIHZhciB0YXNrID0gQmlmcm9zdC50YXNrcy5IdHRwR2V0VGFzay5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiBwYXlsb2FkXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdGFzaztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZVF1ZXJ5ID0gZnVuY3Rpb24gKHF1ZXJ5LCBwYWdpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHRhc2sgPSBCaWZyb3N0LnJlYWQuUXVlcnlUYXNrLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBxdWVyeTogcXVlcnksXHJcbiAgICAgICAgICAgICAgICBwYWdpbmc6IHBhZ2luZ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRhc2s7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGVSZWFkTW9kZWwgPSBmdW5jdGlvbiAocmVhZE1vZGVsT2YsIHByb3BlcnR5RmlsdGVycykge1xyXG4gICAgICAgICAgICB2YXIgdGFzayA9IEJpZnJvc3QucmVhZC5SZWFkTW9kZWxUYXNrLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICByZWFkTW9kZWxPZjogcmVhZE1vZGVsT2YsXHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eUZpbHRlcnM6IHByb3BlcnR5RmlsdGVyc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRhc2s7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGVIYW5kbGVDb21tYW5kID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgdmFyIHRhc2sgPSBCaWZyb3N0LmNvbW1hbmRzLkhhbmRsZUNvbW1hbmRUYXNrLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kOiBjb21tYW5kXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdGFzaztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZUhhbmRsZUNvbW1hbmRzID0gZnVuY3Rpb24gKGNvbW1hbmRzKSB7XHJcbiAgICAgICAgICAgIHZhciB0YXNrID0gQmlmcm9zdC5jb21tYW5kcy5IYW5kbGVDb21tYW5kc1Rhc2suY3JlYXRlKHtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmRzOiBjb21tYW5kc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRhc2s7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGVWaWV3TG9hZCA9IGZ1bmN0aW9uIChmaWxlcykge1xyXG4gICAgICAgICAgICB2YXIgdGFzayA9IEJpZnJvc3Qudmlld3MuVmlld0xvYWRUYXNrLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBmaWxlczogZmlsZXNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0YXNrO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlVmlld01vZGVsTG9hZCA9IGZ1bmN0aW9uIChmaWxlcykge1xyXG4gICAgICAgICAgICB2YXIgdGFzayA9IEJpZnJvc3Qudmlld3MuVmlld01vZGVsTG9hZFRhc2suY3JlYXRlKHtcclxuICAgICAgICAgICAgICAgIGZpbGVzOiBmaWxlc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRhc2s7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGVGaWxlTG9hZCA9IGZ1bmN0aW9uIChmaWxlcykge1xyXG4gICAgICAgICAgICB2YXIgdGFzayA9IEJpZnJvc3QudGFza3MuRmlsZUxvYWRUYXNrLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBmaWxlczogZmlsZXNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0YXNrO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsaWRhdGlvblwiKTtcclxuQmlmcm9zdC5FeGNlcHRpb24uZGVmaW5lKFwiQmlmcm9zdC52YWxpZGF0aW9uLk9wdGlvbnNOb3REZWZpbmVkXCIsIFwiT3B0aW9uIHdhcyB1bmRlZmluZWRcIik7XHJcbkJpZnJvc3QuRXhjZXB0aW9uLmRlZmluZShcIkJpZnJvc3QudmFsaWRhdGlvbi5PcHRpb25zVmFsdWVOb3RTcGVjaWZpZWRcIiwgXCJSZXF1aXJlZCB2YWx1ZSBpbiBPcHRpb25zIGlzIG5vdCBzcGVjaWZpZWQuIFwiKTtcclxuQmlmcm9zdC5FeGNlcHRpb24uZGVmaW5lKFwiQmlmcm9zdC52YWxpZGF0aW9uLk5vdEFOdW1iZXJcIiwgXCJWYWx1ZSBpcyBub3QgYSBudW1iZXJcIik7XHJcbkJpZnJvc3QuRXhjZXB0aW9uLmRlZmluZShcIkJpZnJvc3QudmFsaWRhdGlvbi5Ob3RBU3RyaW5nXCIsIFwiVmFsdWUgaXMgbm90IGEgc3RyaW5nXCIpO1xyXG5CaWZyb3N0LkV4Y2VwdGlvbi5kZWZpbmUoXCJCaWZyb3N0LnZhbGlkYXRpb24uVmFsdWVOb3RTcGVjaWZpZWRcIixcIlZhbHVlIGlzIG5vdCBzcGVjaWZpZWRcIik7XHJcbkJpZnJvc3QuRXhjZXB0aW9uLmRlZmluZShcIkJpZnJvc3QudmFsaWRhdGlvbi5NaW5Ob3RTcGVjaWZpZWRcIixcIk1pbiBpcyBub3Qgc3BlY2lmaWVkXCIpO1xyXG5CaWZyb3N0LkV4Y2VwdGlvbi5kZWZpbmUoXCJCaWZyb3N0LnZhbGlkYXRpb24uTWF4Tm90U3BlY2lmaWVkXCIsXCJNYXggaXMgbm90IHNwZWNpZmllZFwiKTtcclxuQmlmcm9zdC5FeGNlcHRpb24uZGVmaW5lKFwiQmlmcm9zdC52YWxpZGF0aW9uLk1pbkxlbmd0aE5vdFNwZWNpZmllZFwiLFwiTWluIGxlbmd0aCBpcyBub3Qgc3BlY2lmaWVkXCIpO1xyXG5CaWZyb3N0LkV4Y2VwdGlvbi5kZWZpbmUoXCJCaWZyb3N0LnZhbGlkYXRpb24uTWF4TGVuZ3RoTm90U3BlY2lmaWVkXCIsXCJNYXggbGVuZ3RoIGlzIG5vdCBzcGVjaWZpZWRcIik7XHJcbkJpZnJvc3QuRXhjZXB0aW9uLmRlZmluZShcIkJpZnJvc3QudmFsaWRhdGlvbi5NaXNzaW5nRXhwcmVzc2lvblwiLFwiRXhwcmVzc2lvbiBpcyBub3Qgc3BlY2lmaWVkXCIpOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWxpZGF0aW9uXCIpO1xyXG5CaWZyb3N0LnZhbGlkYXRpb24ucnVsZUhhbmRsZXJzID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBCaWZyb3N0LnZhbGlkYXRpb24ucnVsZUhhbmRsZXJzIHx8IHsgfTtcclxufSkoKTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbGlkYXRpb25cIiwge1xyXG4gICAgUnVsZTogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fCBcIlwiO1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHt9O1xyXG4gICAgICAgIEJpZnJvc3QuZXh0ZW5kKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHRoaXMudmFsaWRhdGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWxpZGF0aW9uXCIpO1xyXG5CaWZyb3N0LnZhbGlkYXRpb24uVmFsaWRhdG9yID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFZhbGlkYXRvcihvcHRpb25zKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuaXNWYWxpZCA9IGtvLm9ic2VydmFibGUodHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5tZXNzYWdlID0ga28ub2JzZXJ2YWJsZShcIlwiKTtcclxuICAgICAgICB0aGlzLnJ1bGVzID0gW107XHJcbiAgICAgICAgdGhpcy5pc1JlcXVpcmVkID0gZmFsc2U7XHJcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblxyXG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNldHVwUnVsZShydWxlVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJ1bGVUeXBlLl9uYW1lID09PSBwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBydWxlID0gcnVsZVR5cGUuY3JlYXRlKHsgb3B0aW9uczogb3B0aW9uc1twcm9wZXJ0eV0gfHwge30gfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5ydWxlcy5wdXNoKHJ1bGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChydWxlVHlwZS5fbmFtZSA9PT0gXCJyZXF1aXJlZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pc1JlcXVpcmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcnVsZVR5cGVzID0gQmlmcm9zdC52YWxpZGF0aW9uLlJ1bGUuZ2V0RXh0ZW5kZXJzKCk7XHJcbiAgICAgICAgICAgICAgICBydWxlVHlwZXMuc29tZShzZXR1cFJ1bGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBzZWxmLmlzVmFsaWQodHJ1ZSk7XHJcbiAgICAgICAgICAgIHNlbGYubWVzc2FnZShcIlwiKTtcclxuICAgICAgICAgICAgdmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlKTtcclxuICAgICAgICAgICAgc2VsZi5ydWxlcy5zb21lKGZ1bmN0aW9uKHJ1bGUpIHtcclxuICAgICAgICAgICAgICAgIGlmICghcnVsZS52YWxpZGF0ZSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmlzVmFsaWQoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYubWVzc2FnZShydWxlLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmlzVmFsaWQodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5tZXNzYWdlKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnZhbGlkYXRlU2lsZW50bHkgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgc2VsZi5ydWxlcy5zb21lKGZ1bmN0aW9uIChydWxlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJ1bGUudmFsaWRhdGUodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pc1ZhbGlkKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pc1ZhbGlkKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgICAgICB2YXIgdmFsaWRhdG9yID0gbmV3IFZhbGlkYXRvcihvcHRpb25zKTtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRvcjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFwcGx5VG86IGZ1bmN0aW9uIChpdGVtT3JJdGVtcywgb3B0aW9ucykge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBhcHBseVRvSXRlbShpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsaWRhdG9yID0gc2VsZi5jcmVhdGUob3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnZhbGlkYXRvciA9IHZhbGlkYXRvcjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGl0ZW1Pckl0ZW1zIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW1Pckl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwbHlUb0l0ZW0oaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFwcGx5VG9JdGVtKGl0ZW1Pckl0ZW1zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYXBwbHlUb1Byb3BlcnRpZXM6IGZ1bmN0aW9uIChpdGVtLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMucHVzaChpdGVtW3Byb3BlcnR5XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5hcHBseVRvKGl0ZW1zLCBvcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59KSgpO1xyXG4iLCJpZiAodHlwZW9mIGtvICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbGlkYXRpb25cIiwge1xyXG4gICAgICAgIFZhbGlkYXRpb25TdW1tYXJ5OiBmdW5jdGlvbiAoY29tbWFuZHMsIGNvbnRhaW5lckVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLmNvbW1hbmRzID0ga28ub2JzZXJ2YWJsZShjb21tYW5kcyk7XHJcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xyXG4gICAgICAgICAgICB0aGlzLmhhc01lc3NhZ2VzID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1lc3NhZ2VzKCkubGVuZ3RoID4gMDtcclxuICAgICAgICAgICAgfSxzZWxmKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGFnZ3JlZ2F0ZU1lc3NhZ2VzKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFjdHVhbE1lc3NhZ2VzID0gW107XHJcbiAgICAgICAgICAgICAgICBzZWxmLmNvbW1hbmRzKCkuZm9yRWFjaChmdW5jdGlvbiAoY29tbWFuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB1bndyYXBwZWRDb21tYW5kID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShjb21tYW5kKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdW53cmFwcGVkQ29tbWFuZC52YWxpZGF0b3JzKCkuZm9yRWFjaChmdW5jdGlvbiAodmFsaWRhdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdmFsaWRhdG9yLmlzVmFsaWQoKSAmJiB2YWxpZGF0b3IubWVzc2FnZSgpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0dWFsTWVzc2FnZXMucHVzaCh2YWxpZGF0b3IubWVzc2FnZSgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLm1lc3NhZ2VzKGFjdHVhbE1lc3NhZ2VzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29tbWFuZHMuZm9yRWFjaChmdW5jdGlvbiAoY29tbWFuZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHVud3JhcHBlZENvbW1hbmQgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGNvbW1hbmQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHVud3JhcHBlZENvbW1hbmQudmFsaWRhdG9ycygpLmZvckVhY2goZnVuY3Rpb24gKHZhbGlkYXRvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvci5tZXNzYWdlLnN1YnNjcmliZShhZ2dyZWdhdGVNZXNzYWdlcyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAga28uYmluZGluZ0hhbmRsZXJzLnZhbGlkYXRpb25TdW1tYXJ5Rm9yID0ge1xyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5nc0FjY2Vzc29yLCB2aWV3TW9kZWwpIHtcclxuICAgICAgICAgICAgdmFyIHRhcmdldCA9IGtvLmJpbmRpbmdIYW5kbGVycy52YWxpZGF0aW9uU3VtbWFyeUZvci5nZXRWYWx1ZUFzQXJyYXkodmFsdWVBY2Nlc3Nvcik7XHJcbiAgICAgICAgICAgIHZhciB2YWxpZGF0aW9uU3VtbWFyeSA9IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uVmFsaWRhdGlvblN1bW1hcnkodGFyZ2V0KTtcclxuICAgICAgICAgICAgdmFyIHVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpO1xyXG4gICAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHVsKTtcclxuICAgICAgICAgICAgdWwuaW5uZXJIVE1MID0gXCI8bGk+PHNwYW4gZGF0YS1iaW5kPSd0ZXh0OiAkZGF0YSc+PC9zcGFuPjwvbGk+XCI7XHJcblxyXG4gICAgICAgICAgICBrby51dGlscy5kb21EYXRhLnNldChlbGVtZW50LCAndmFsaWRhdGlvbnN1bW1hcnknLCB2YWxpZGF0aW9uU3VtbWFyeSk7XHJcblxyXG4gICAgICAgICAgICBrby5hcHBseUJpbmRpbmdzVG9Ob2RlKGVsZW1lbnQsIHsgdmlzaWJsZTogdmFsaWRhdGlvblN1bW1hcnkuaGFzTWVzc2FnZXMgfSwgdmFsaWRhdGlvblN1bW1hcnkpO1xyXG4gICAgICAgICAgICBrby5hcHBseUJpbmRpbmdzVG9Ob2RlKHVsLCB7IGZvcmVhY2g6IHZhbGlkYXRpb25TdW1tYXJ5Lm1lc3NhZ2VzIH0sIHZhbGlkYXRpb25TdW1tYXJ5KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVwZGF0ZTogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpIHtcclxuICAgICAgICAgICAgdmFyIHZhbGlkYXRpb25TdW1tYXJ5ID0ga28udXRpbHMuZG9tRGF0YS5nZXQoZWxlbWVudCwgJ3ZhbGlkYXRpb25zdW1tYXJ5Jyk7XHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdW1tYXJ5LmNvbW1hbmRzKGtvLmJpbmRpbmdIYW5kbGVycy52YWxpZGF0aW9uU3VtbWFyeUZvci5nZXRWYWx1ZUFzQXJyYXkodmFsdWVBY2Nlc3NvcikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0VmFsdWVBc0FycmF5OiBmdW5jdGlvbiAodmFsdWVBY2Nlc3Nvcikge1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpO1xyXG4gICAgICAgICAgICBpZiAoIShCaWZyb3N0LmlzQXJyYXkodGFyZ2V0KSkpIHsgdGFyZ2V0ID0gW3RhcmdldF07IH1cclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59IiwiaWYgKHR5cGVvZiBrbyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIGtvLmJpbmRpbmdIYW5kbGVycy52YWxpZGF0aW9uTWVzc2FnZUZvciA9IHtcclxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3NBY2Nlc3Nvciwgdmlld01vZGVsKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHZhbHVlQWNjZXNzb3IoKTtcclxuICAgICAgICAgICAgdmFyIHZhbGlkYXRvciA9IHZhbHVlLnZhbGlkYXRvcjtcclxuICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodmFsaWRhdG9yKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YWxpZGF0b3IuaXNWYWxpZC5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobmV3VmFsdWUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChlbGVtZW50KS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBrby5hcHBseUJpbmRpbmdzVG9Ob2RlKGVsZW1lbnQsIHsgdGV4dDogdmFsaWRhdG9yLm1lc3NhZ2UgfSwgdmFsaWRhdG9yKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59IiwiaWYgKHR5cGVvZiBrbyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIGtvLmV4dGVuZGVycy52YWxpZGF0aW9uID0gZnVuY3Rpb24gKHRhcmdldCwgb3B0aW9ucykge1xyXG4gICAgICAgIEJpZnJvc3QudmFsaWRhdGlvbi5WYWxpZGF0b3IuYXBwbHlUbyh0YXJnZXQsIG9wdGlvbnMpO1xyXG4gICAgICAgIHRhcmdldC5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRhcmdldC52YWxpZGF0b3IudmFsaWRhdGUobmV3VmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBUb2RvIDogbG9vayBpbnRvIGFnZ3Jlc3NpdmUgdmFsaWRhdGlvblxyXG4gICAgICAgIC8vdGFyZ2V0LnZhbGlkYXRvci52YWxpZGF0ZSh0YXJnZXQoKSk7XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgIH07XHJcbn1cclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbGlkYXRpb25cIiwge1xyXG4gICAgcmVxdWlyZWQ6IEJpZnJvc3QudmFsaWRhdGlvbi5SdWxlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gIShCaWZyb3N0LmlzVW5kZWZpbmVkKHZhbHVlKSB8fCBCaWZyb3N0LmlzTnVsbCh2YWx1ZSkgfHwgdmFsdWUgPT09IFwiXCIgfHwgdmFsdWUgPT09IDApO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuXHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWxpZGF0aW9uXCIsIHtcclxuICAgIGxlbmd0aDogQmlmcm9zdC52YWxpZGF0aW9uLlJ1bGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG5vdFNldCh2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gQmlmcm9zdC5pc1VuZGVmaW5lZCh2YWx1ZSkgfHwgQmlmcm9zdC5pc051bGwodmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGhyb3dJZlZhbHVlSXNOb3RBTnVtYmVyKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bWJlcih2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uTm90QU51bWJlcihcIlZhbHVlIFwiICsgdmFsdWUgKyBcIiBpcyBub3QgYSBudW1iZXJcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRocm93SWZPcHRpb25zSW52YWxpZChvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGlmIChub3RTZXQob3B0aW9ucykpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uT3B0aW9uc05vdERlZmluZWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobm90U2V0KG9wdGlvbnMubWF4KSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5NYXhMZW5ndGhOb3RTcGVjaWZpZWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobm90U2V0KG9wdGlvbnMubWluKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5NaW5MZW5ndGhOb3RTcGVjaWZpZWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aHJvd0lmVmFsdWVJc05vdEFOdW1iZXIob3B0aW9ucy5taW4pO1xyXG4gICAgICAgICAgICB0aHJvd0lmVmFsdWVJc05vdEFOdW1iZXIob3B0aW9ucy5tYXgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aHJvd0lmT3B0aW9uc0ludmFsaWQoc2VsZi5vcHRpb25zKTtcclxuICAgICAgICAgICAgaWYgKG5vdFNldCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNTdHJpbmcodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYub3B0aW9ucy5taW4gPD0gdmFsdWUubGVuZ3RoICYmIHZhbHVlLmxlbmd0aCA8PSBzZWxmLm9wdGlvbnMubWF4O1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsaWRhdGlvblwiLCB7XHJcbiAgICBtaW5MZW5ndGg6IEJpZnJvc3QudmFsaWRhdGlvbi5SdWxlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBub3RTZXQodmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEJpZnJvc3QuaXNVbmRlZmluZWQodmFsdWUpIHx8IEJpZnJvc3QuaXNOdWxsKHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRocm93SWZWYWx1ZUlzTm90QU51bWJlcih2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdW1iZXIodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk5vdEFOdW1iZXIoXCJWYWx1ZSBcIiArIHZhbHVlICsgXCIgaXMgbm90IGEgbnVtYmVyXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lmT3B0aW9uc0ludmFsaWQob3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAobm90U2V0KG9wdGlvbnMpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk9wdGlvbnNOb3REZWZpbmVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5vdFNldChvcHRpb25zLmxlbmd0aCkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uTWF4Tm90U3BlY2lmaWVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3dJZlZhbHVlSXNOb3RBTnVtYmVyKG9wdGlvbnMubGVuZ3RoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lmVmFsdWVJc05vdEFTdHJpbmcoc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc1N0cmluZyhzdHJpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk5vdEFTdHJpbmcoXCJWYWx1ZSBcIiArIHN0cmluZyArIFwiIGlzIG5vdCBhIHN0cmluZ1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aHJvd0lmT3B0aW9uc0ludmFsaWQoc2VsZi5vcHRpb25zKTtcclxuICAgICAgICAgICAgaWYgKG5vdFNldCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aHJvd0lmVmFsdWVJc05vdEFTdHJpbmcodmFsdWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUubGVuZ3RoID49IHNlbGYub3B0aW9ucy5sZW5ndGg7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5cclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbGlkYXRpb25cIiwge1xyXG4gICAgbWF4TGVuZ3RoOiBCaWZyb3N0LnZhbGlkYXRpb24uUnVsZS5leHRlbmQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBub3RTZXQodmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEJpZnJvc3QuaXNVbmRlZmluZWQodmFsdWUpIHx8IEJpZnJvc3QuaXNOdWxsKHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRocm93SWZWYWx1ZUlzTm90QU51bWJlcih2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdW1iZXIodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk5vdEFOdW1iZXIoXCJWYWx1ZSBcIiArIHZhbHVlICsgXCIgaXMgbm90IGEgbnVtYmVyXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lmT3B0aW9uc0ludmFsaWQob3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAobm90U2V0KG9wdGlvbnMpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk9wdGlvbnNOb3REZWZpbmVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5vdFNldChvcHRpb25zLmxlbmd0aCkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uTWF4Tm90U3BlY2lmaWVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3dJZlZhbHVlSXNOb3RBTnVtYmVyKG9wdGlvbnMubGVuZ3RoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lmVmFsdWVJc05vdEFTdHJpbmcoc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc1N0cmluZyhzdHJpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk5vdEFTdHJpbmcoXCJWYWx1ZSBcIiArIHN0cmluZyArIFwiIGlzIG5vdCBhIHN0cmluZ1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aHJvd0lmT3B0aW9uc0ludmFsaWQoc2VsZi5vcHRpb25zKTtcclxuICAgICAgICAgICAgaWYgKG5vdFNldCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aHJvd0lmVmFsdWVJc05vdEFTdHJpbmcodmFsdWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUubGVuZ3RoIDw9IHNlbGYub3B0aW9ucy5sZW5ndGg7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5cclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbGlkYXRpb25cIiwge1xyXG4gICAgcmFuZ2U6IEJpZnJvc3QudmFsaWRhdGlvbi5SdWxlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBub3RTZXQodmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEJpZnJvc3QuaXNVbmRlZmluZWQodmFsdWUpIHx8IEJpZnJvc3QuaXNOdWxsKHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRocm93SWZWYWx1ZUlzTm90QU51bWJlcih2YWx1ZSwgcGFyYW0pIHtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVtYmVyKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5Ob3RBTnVtYmVyKHBhcmFtICsgXCIgdmFsdWUgXCIgKyB2YWx1ZSArIFwiIGlzIG5vdCBhIG51bWJlclwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRocm93SWZPcHRpb25zSW52YWxpZChvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGlmIChub3RTZXQob3B0aW9ucykpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uT3B0aW9uc05vdERlZmluZWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobm90U2V0KG9wdGlvbnMubWF4KSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5NYXhOb3RTcGVjaWZpZWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobm90U2V0KG9wdGlvbnMubWluKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5NaW5Ob3RTcGVjaWZpZWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aHJvd0lmVmFsdWVJc05vdEFOdW1iZXIob3B0aW9ucy5taW4sIFwibWluXCIpO1xyXG4gICAgICAgICAgICB0aHJvd0lmVmFsdWVJc05vdEFOdW1iZXIob3B0aW9ucy5tYXgsIFwibWF4XCIpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMudmFsaWRhdGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhyb3dJZk9wdGlvbnNJbnZhbGlkKHNlbGYub3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGlmIChub3RTZXQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3dJZlZhbHVlSXNOb3RBTnVtYmVyKHZhbHVlLCBcInZhbHVlXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5vcHRpb25zLm1pbiA8PSB2YWx1ZSAmJiB2YWx1ZSA8PSBzZWxmLm9wdGlvbnMubWF4O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfSlcclxufSk7XHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWxpZGF0aW9uXCIsIHtcclxuICAgIGxlc3NUaGFuOiBCaWZyb3N0LnZhbGlkYXRpb24uUnVsZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbm90U2V0KHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBCaWZyb3N0LmlzVW5kZWZpbmVkKHZhbHVlKSB8fCBCaWZyb3N0LmlzTnVsbCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lmT3B0aW9uc0ludmFsaWQob3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAobm90U2V0KG9wdGlvbnMpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk9wdGlvbnNOb3REZWZpbmVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5vdFNldChvcHRpb25zLnZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGV4Y2VwdGlvbiA9IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uT3B0aW9uc1ZhbHVlTm90U3BlY2lmaWVkKCk7XHJcbiAgICAgICAgICAgICAgICBleGNlcHRpb24ubWVzc2FnZSA9IGV4Y2VwdGlvbi5tZXNzYWdlICsgXCIgJ3ZhbHVlJyBpcyBub3Qgc2V0LlwiO1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lzVmFsdWVUb0NoZWNrSXNOb3RBTnVtYmVyKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bWJlcih2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uTm90QU51bWJlcihcIlZhbHVlIFwiICsgdmFsdWUgKyBcIiBpcyBub3QgYSBudW1iZXJcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudmFsaWRhdGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhyb3dJZk9wdGlvbnNJbnZhbGlkKHNlbGYub3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGlmIChub3RTZXQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3dJc1ZhbHVlVG9DaGVja0lzTm90QU51bWJlcih2YWx1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKSA8IHBhcnNlRmxvYXQoc2VsZi5vcHRpb25zLnZhbHVlKTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWxpZGF0aW9uLnJ1bGVIYW5kbGVyc1wiKTtcclxuQmlmcm9zdC52YWxpZGF0aW9uLnJ1bGVIYW5kbGVycy5sZXNzVGhhbk9yRXF1YWwgPSB7XHJcbiAgICB0aHJvd0lmT3B0aW9uc0ludmFsaWQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubm90U2V0KG9wdGlvbnMpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uT3B0aW9uc05vdERlZmluZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubm90U2V0KG9wdGlvbnMudmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHZhciBleGNlcHRpb24gPSBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk9wdGlvbnNWYWx1ZU5vdFNwZWNpZmllZCgpO1xyXG4gICAgICAgICAgICBleGNlcHRpb24ubWVzc2FnZSA9IGV4Y2VwdGlvbi5tZXNzYWdlICsgXCIgJ3ZhbHVlJyBpcyBub3Qgc2V0LlwiO1xyXG4gICAgICAgICAgICB0aHJvdyBleGNlcHRpb247XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICB0aHJvd0lzVmFsdWVUb0NoZWNrSXNOb3RBTnVtYmVyOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdW1iZXIodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uTm90QU51bWJlcihcIlZhbHVlIFwiICsgdmFsdWUgKyBcIiBpcyBub3QgYSBudW1iZXJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBub3RTZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiBCaWZyb3N0LmlzVW5kZWZpbmVkKHZhbHVlKSB8fCBCaWZyb3N0LmlzTnVsbCh2YWx1ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHZhbGlkYXRlOiBmdW5jdGlvbiAodmFsdWUsIG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLnRocm93SWZPcHRpb25zSW52YWxpZChvcHRpb25zKTtcclxuICAgICAgICBpZiAodGhpcy5ub3RTZXQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50aHJvd0lzVmFsdWVUb0NoZWNrSXNOb3RBTnVtYmVyKHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSkgPD0gcGFyc2VGbG9hdChvcHRpb25zLnZhbHVlKTtcclxuICAgIH1cclxufTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbGlkYXRpb25cIiwge1xyXG4gICAgZ3JlYXRlclRoYW46IEJpZnJvc3QudmFsaWRhdGlvbi5SdWxlLmV4dGVuZChmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG5vdFNldCh2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gQmlmcm9zdC5pc1VuZGVmaW5lZCh2YWx1ZSkgfHwgQmlmcm9zdC5pc051bGwodmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGhyb3dJZk9wdGlvbnNJbnZhbGlkKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKG5vdFNldChvcHRpb25zKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5PcHRpb25zTm90RGVmaW5lZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChub3RTZXQob3B0aW9ucy52YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBleGNlcHRpb24gPSBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk9wdGlvbnNWYWx1ZU5vdFNwZWNpZmllZCgpO1xyXG4gICAgICAgICAgICAgICAgZXhjZXB0aW9uLm1lc3NhZ2UgPSBleGNlcHRpb24ubWVzc2FnZSArIFwiICd2YWx1ZScgaXMgbm90IHNldC5cIjtcclxuICAgICAgICAgICAgICAgIHRocm93IGV4Y2VwdGlvbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aHJvd0lmVmFsdWVUb0NoZWNrSXNOb3RBTnVtYmVyKG9wdGlvbnMudmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGhyb3dJZlZhbHVlVG9DaGVja0lzTm90QU51bWJlcih2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdW1iZXIodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk5vdEFOdW1iZXIoXCJWYWx1ZSBcIiArIHZhbHVlICsgXCIgaXMgbm90IGEgbnVtYmVyXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZhbGlkYXRlID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRocm93SWZPcHRpb25zSW52YWxpZChzZWxmLm9wdGlvbnMpO1xyXG4gICAgICAgICAgICBpZiAobm90U2V0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRocm93SWZWYWx1ZVRvQ2hlY2tJc05vdEFOdW1iZXIodmFsdWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSkgPiBwYXJzZUZsb2F0KHNlbGYub3B0aW9ucy52YWx1ZSk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsaWRhdGlvbi5ydWxlSGFuZGxlcnNcIik7XHJcbkJpZnJvc3QudmFsaWRhdGlvbi5ydWxlSGFuZGxlcnMuZ3JlYXRlclRoYW5PckVxdWFsID0ge1xyXG4gICAgdGhyb3dJZk9wdGlvbnNJbnZhbGlkOiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIGlmICh0aGlzLm5vdFNldChvcHRpb25zKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk9wdGlvbnNOb3REZWZpbmVkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm5vdFNldChvcHRpb25zLnZhbHVlKSkge1xyXG4gICAgICAgICAgICB2YXIgZXhjZXB0aW9uID0gbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5PcHRpb25zVmFsdWVOb3RTcGVjaWZpZWQoKTtcclxuICAgICAgICAgICAgZXhjZXB0aW9uLm1lc3NhZ2UgPSBleGNlcHRpb24ubWVzc2FnZSArIFwiICd2YWx1ZScgaXMgbm90IHNldC5cIjtcclxuICAgICAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRocm93SWZWYWx1ZVRvQ2hlY2tJc05vdEFOdW1iZXIob3B0aW9ucy52YWx1ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHRocm93SWZWYWx1ZVRvQ2hlY2tJc05vdEFOdW1iZXI6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICghQmlmcm9zdC5pc051bWJlcih2YWx1ZSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5Ob3RBTnVtYmVyKFwiVmFsdWUgXCIgKyB2YWx1ZSArIFwiIGlzIG5vdCBhIG51bWJlclwiKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG5vdFNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIEJpZnJvc3QuaXNVbmRlZmluZWQodmFsdWUpIHx8IEJpZnJvc3QuaXNOdWxsKHZhbHVlKTtcclxuICAgIH0sXHJcblxyXG4gICAgdmFsaWRhdGU6IGZ1bmN0aW9uICh2YWx1ZSwgb3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMudGhyb3dJZk9wdGlvbnNJbnZhbGlkKG9wdGlvbnMpO1xyXG4gICAgICAgIGlmICh0aGlzLm5vdFNldCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRocm93SWZWYWx1ZVRvQ2hlY2tJc05vdEFOdW1iZXIodmFsdWUpO1xyXG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKSA+PSBwYXJzZUZsb2F0KG9wdGlvbnMudmFsdWUpO1xyXG4gICAgfVxyXG59O1xyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsaWRhdGlvblwiLCB7XHJcbiAgICBlbWFpbDogQmlmcm9zdC52YWxpZGF0aW9uLlJ1bGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmVnZXggPSAvXigoKFthLXpdfFxcZHxbISNcXCQlJidcXCpcXCtcXC1cXC89XFw/XFxeX2B7XFx8fX5dfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSsoXFwuKFthLXpdfFxcZHxbISNcXCQlJidcXCpcXCtcXC1cXC89XFw/XFxeX2B7XFx8fX5dfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSspKil8KChcXHgyMikoKCgoXFx4MjB8XFx4MDkpKihcXHgwZFxceDBhKSk/KFxceDIwfFxceDA5KSspPygoW1xceDAxLVxceDA4XFx4MGJcXHgwY1xceDBlLVxceDFmXFx4N2ZdfFxceDIxfFtcXHgyMy1cXHg1Yl18W1xceDVkLVxceDdlXXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KFxcXFwoW1xceDAxLVxceDA5XFx4MGJcXHgwY1xceDBkLVxceDdmXXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkpKSkqKCgoXFx4MjB8XFx4MDkpKihcXHgwZFxceDBhKSk/KFxceDIwfFxceDA5KSspPyhcXHgyMikpKUAoKChbYS16XXxcXGR8W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfCgoW2Etel18XFxkfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKShbYS16XXxcXGR8LXxcXC58X3x+fFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSooW2Etel18XFxkfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSkpXFwuKSsoKFthLXpdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoKFthLXpdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKShbYS16XXxcXGR8LXxcXC58X3x+fFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSooW2Etel18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKSkkLztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbm90U2V0KHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBCaWZyb3N0LmlzTnVsbCh2YWx1ZSkgfHwgQmlmcm9zdC5pc1VuZGVmaW5lZCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZhbGlkYXRlID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmIChub3RTZXQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc1N0cmluZyh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uTm90QVN0cmluZyhcIlZhbHVlIFwiICsgdmFsdWUgKyBcIiBpcyBub3QgYSBzdHJpbmdcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAodmFsdWUubWF0Y2gocmVnZXgpID09IG51bGwpID8gZmFsc2UgOiB0cnVlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfSlcclxufSk7XHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWxpZGF0aW9uXCIsIHtcclxuICAgIHJlZ2V4OiBCaWZyb3N0LnZhbGlkYXRpb24uUnVsZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbm90U2V0KHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBCaWZyb3N0LmlzVW5kZWZpbmVkKHZhbHVlKSB8fCBCaWZyb3N0LmlzTnVsbCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lmT3B0aW9uc0ludmFsaWQob3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAobm90U2V0KG9wdGlvbnMpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk9wdGlvbnNOb3REZWZpbmVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5vdFNldChvcHRpb25zLmV4cHJlc3Npb24pKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk1pc3NpbmdFeHByZXNzaW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzU3RyaW5nKG9wdGlvbnMuZXhwcmVzc2lvbikpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uTm90QVN0cmluZyhcIkV4cHJlc3Npb24gXCIgKyBvcHRpb25zLmV4cHJlc3Npb24gKyBcIiBpcyBub3QgYSBzdHJpbmcuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lmVmFsdWVJc05vdFN0cmluZyh2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNTdHJpbmcodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk5vdEFTdHJpbmcoXCJWYWx1ZSBcIiArIHZhbHVlICsgXCIgaXMgbm90IGEgc3RyaW5nLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aHJvd0lmT3B0aW9uc0ludmFsaWQoc2VsZi5vcHRpb25zKTtcclxuICAgICAgICAgICAgaWYgKG5vdFNldCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aHJvd0lmVmFsdWVJc05vdFN0cmluZyh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiAodmFsdWUubWF0Y2goc2VsZi5vcHRpb25zLmV4cHJlc3Npb24pID09IG51bGwpID8gZmFsc2UgOiB0cnVlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuXHJcblxyXG4iLCJpZiAodHlwZW9mIGtvICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAga28uYmluZGluZ0hhbmRsZXJzLmNvbW1hbmQgPSB7XHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdBY2Nlc3Nvciwgdmlld01vZGVsKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHZhbHVlQWNjZXNzb3IoKTtcclxuICAgICAgICAgICAgdmFyIGNvbW1hbmQ7XHJcbiAgICAgICAgICAgIHZhciBjb250ZXh0Qm91bmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYodHlwZW9mIHZhbHVlLmNhbkV4ZWN1dGUgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmQgPSB2YWx1ZS50YXJnZXQ7XHJcblxyXG4gICAgICAgICAgICAgICAgY29tbWFuZC5wYXJhbWV0ZXJzID0gY29tbWFuZC5wYXJhbWV0ZXJzIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtZXRlcnMgPSB2YWx1ZS5wYXJhbWV0ZXJzIHx8IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHBhcmFtZXRlciBpbiBwYXJhbWV0ZXJzICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJhbWV0ZXJWYWx1ZSA9IHBhcmFtZXRlcnNbcGFyYW1ldGVyXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIGNvbW1hbmQucGFyYW1ldGVycy5oYXNPd25Qcm9wZXJ0eShwYXJhbWV0ZXIpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtvLmlzT2JzZXJ2YWJsZShjb21tYW5kLnBhcmFtZXRlcnNbcGFyYW1ldGVyXSkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmQucGFyYW1ldGVyc1twYXJhbWV0ZXJdKHBhcmFtZXRlclZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kLnBhcmFtZXRlcnNbcGFyYW1ldGVyXSA9IGtvLm9ic2VydmFibGUocGFyYW1ldGVyVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnRleHRCb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAga28uYXBwbHlCaW5kaW5nc1RvTm9kZShlbGVtZW50LCB7IGNsaWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmQuZXhlY3V0ZSgpO1xyXG4gICAgICAgICAgICB9fSwgdmlld01vZGVsKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmNvbW1hbmRzXCIsIHtcclxuICAgIEhhbmRsZUNvbW1hbmRUYXNrOiBCaWZyb3N0LnRhc2tzLkV4ZWN1dGlvblRhc2suZXh0ZW5kKGZ1bmN0aW9uIChjb21tYW5kLCBzZXJ2ZXIsIHN5c3RlbUV2ZW50cykge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGEgdGFzayB0aGF0IGNhbiBoYW5kbGUgYSBjb21tYW5kPC9zdW1tYXJ5PlxyXG4gICAgICAgIHRoaXMubmFtZSA9IGNvbW1hbmQubmFtZTtcclxuXHJcbiAgICAgICAgdGhpcy5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY29tbWFuZERlc2NyaXB0b3IgPSBCaWZyb3N0LmNvbW1hbmRzLkNvbW1hbmREZXNjcmlwdG9yLmNyZWF0ZUZyb20oY29tbWFuZCk7XHJcbiAgICAgICAgICAgIHZhciBwYXJhbWV0ZXJzID0ge1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZERlc2NyaXB0b3I6IGNvbW1hbmREZXNjcmlwdG9yXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB2YXIgdXJsID0gXCIvQmlmcm9zdC9Db21tYW5kQ29vcmRpbmF0b3IvSGFuZGxlP19jbWQ9XCIgKyBjb21tYW5kLl9nZW5lcmF0ZWRGcm9tO1xyXG5cclxuICAgICAgICAgICAgc2VydmVyLnBvc3QodXJsLCBwYXJhbWV0ZXJzKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbW1hbmRSZXN1bHQgPSBCaWZyb3N0LmNvbW1hbmRzLkNvbW1hbmRSZXN1bHQuY3JlYXRlRnJvbShyZXN1bHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjb21tYW5kUmVzdWx0LnN1Y2Nlc3MgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzeXN0ZW1FdmVudHMuY29tbWFuZHMuc3VjY2VlZGVkLnRyaWdnZXIocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3lzdGVtRXZlbnRzLmNvbW1hbmRzLmZhaWxlZC50cmlnZ2VyKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoY29tbWFuZFJlc3VsdCk7XHJcbiAgICAgICAgICAgIH0pLm9uRmFpbChmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb21tYW5kUmVzdWx0ID0gQmlmcm9zdC5jb21tYW5kcy5Db21tYW5kUmVzdWx0LmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZFJlc3VsdC5leGNlcHRpb24gPSBcIkhUVFAgNTAwXCI7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kUmVzdWx0LmV4Y2VwdGlvbk1lc3NhZ2UgPSByZXNwb25zZS5zdGF0dXNUZXh0O1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZFJlc3VsdC5kZXRhaWxzID0gcmVzcG9uc2UucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgICAgICAgICAgc3lzdGVtRXZlbnRzLmNvbW1hbmRzLmZhaWxlZC50cmlnZ2VyKGNvbW1hbmRSZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoY29tbWFuZFJlc3VsdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5jb21tYW5kc1wiLCB7XHJcbiAgICBIYW5kbGVDb21tYW5kc1Rhc2s6IEJpZnJvc3QudGFza3MuRXhlY3V0aW9uVGFzay5leHRlbmQoZnVuY3Rpb24gKGNvbW1hbmRzLCBzZXJ2ZXIpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyBhIHRhc2sgdGhhdCBjYW4gaGFuZGxlIGFuIGFycmF5IG9mIGNvbW1hbmQ8L3N1bW1hcnk+XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLm5hbWVzID0gW107XHJcbiAgICAgICAgY29tbWFuZHMuZm9yRWFjaChmdW5jdGlvbiAoY29tbWFuZCkge1xyXG4gICAgICAgICAgICBzZWxmLm5hbWVzLnB1c2goY29tbWFuZC5uYW1lKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY29tbWFuZERlc2NyaXB0b3JzID0gW107XHJcblxyXG4gICAgICAgICAgICBjb21tYW5kcy5mb3JFYWNoKGZ1bmN0aW9uIChjb21tYW5kKSB7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kLmlzQnVzeSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIHZhciBjb21tYW5kRGVzY3JpcHRvciA9IEJpZnJvc3QuY29tbWFuZHMuQ29tbWFuZERlc2NyaXB0b3IuY3JlYXRlRnJvbShjb21tYW5kKTtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmREZXNjcmlwdG9ycy5wdXNoKGNvbW1hbmREZXNjcmlwdG9yKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcGFyYW1ldGVycyA9IHtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmREZXNjcmlwdG9yczogY29tbWFuZERlc2NyaXB0b3JzXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB2YXIgdXJsID0gXCIvQmlmcm9zdC9Db21tYW5kQ29vcmRpbmF0b3IvSGFuZGxlTWFueVwiO1xyXG5cclxuICAgICAgICAgICAgc2VydmVyLnBvc3QodXJsLCBwYXJhbWV0ZXJzKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHJlc3VsdHMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb21tYW5kUmVzdWx0cyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlc3VsdHMuZm9yRWFjaChmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbW1hbmRSZXN1bHQgPSBCaWZyb3N0LmNvbW1hbmRzLkNvbW1hbmRSZXN1bHQuY3JlYXRlRnJvbShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmRSZXN1bHRzLnB1c2goY29tbWFuZFJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGNvbW1hbmRSZXN1bHRzKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmNvbW1hbmRzXCIsIHtcclxuICAgIGNvbW1hbmRDb29yZGluYXRvcjogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKHRhc2tGYWN0b3J5KSB7XHJcbiAgICAgICAgdGhpcy5oYW5kbGUgPSBmdW5jdGlvbiAoY29tbWFuZCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHZhciB0YXNrID0gdGFza0ZhY3RvcnkuY3JlYXRlSGFuZGxlQ29tbWFuZChjb21tYW5kKTtcclxuXHJcbiAgICAgICAgICAgIGNvbW1hbmQucmVnaW9uLnRhc2tzLmV4ZWN1dGUodGFzaykuY29udGludWVXaXRoKGZ1bmN0aW9uIChjb21tYW5kUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChjb21tYW5kUmVzdWx0KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZU1hbnkgPSBmdW5jdGlvbiAoY29tbWFuZHMsIHJlZ2lvbikge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRhc2sgPSB0YXNrRmFjdG9yeS5jcmVhdGVIYW5kbGVDb21tYW5kcyhjb21tYW5kcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVnaW9uLnRhc2tzLmV4ZWN1dGUodGFzaykuY29udGludWVXaXRoKGZ1bmN0aW9uIChjb21tYW5kUmVzdWx0cykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmRzLmZvckVhY2goZnVuY3Rpb24gKGNvbW1hbmQsIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb21tYW5kUmVzdWx0ID0gY29tbWFuZFJlc3VsdHNbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tbWFuZFJlc3VsdCAhPSBudWxsICYmICFCaWZyb3N0LmlzVW5kZWZpbmVkKGNvbW1hbmRSZXN1bHQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kLmhhbmRsZUNvbW1hbmRSZXN1bHQoY29tbWFuZFJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZC5pc0J1c3koZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChjb21tYW5kUmVzdWx0cyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kcy5mb3JFYWNoKGZ1bmN0aW9uKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kLmlzQnVzeShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLmNvbW1hbmRDb29yZGluYXRvciA9IEJpZnJvc3QuY29tbWFuZHMuY29tbWFuZENvb3JkaW5hdG9yOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5jb21tYW5kc1wiLCB7XHJcbiAgICBjb21tYW5kVmFsaWRhdGlvblNlcnZpY2U6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNob3VsZFNraXBQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gXCJyZWdpb25cIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRhcmdldC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChrby5pc09ic2VydmFibGUodGFyZ2V0W3Byb3BlcnR5XSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRhcmdldFtwcm9wZXJ0eV0gPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09PSBcIl90eXBlXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gXCJfZGVwZW5kZW5jaWVzXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gXCJfbmFtZXNwYWNlXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgodGFyZ2V0W3Byb3BlcnR5XSA9PSBudWxsKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCh0eXBlb2YgdGFyZ2V0W3Byb3BlcnR5XS5wcm90b3R5cGUgIT09IFwidW5kZWZpbmVkXCIpICYmXHJcbiAgICAgICAgICAgICAgICAodGFyZ2V0W3Byb3BlcnR5XS5wcm90b3R5cGUgIT09IG51bGwpICYmXHJcbiAgICAgICAgICAgICAgICAodGFyZ2V0W3Byb3BlcnR5XSBpbnN0YW5jZW9mIEJpZnJvc3QuVHlwZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBleHRlbmRQcm9wZXJ0aWVzKHRhcmdldCwgdmFsaWRhdG9ycykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzaG91bGRTa2lwUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0W3Byb3BlcnR5XS52YWxpZGF0b3IgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoa28uaXNPYnNlcnZhYmxlKHRhcmdldFtwcm9wZXJ0eV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BlcnR5XS5leHRlbmQoeyB2YWxpZGF0aW9uOiB7fSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcGVydHldLnZhbGlkYXRvci5wcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRhcmdldFtwcm9wZXJ0eV0gPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBleHRlbmRQcm9wZXJ0aWVzKHRhcmdldFtwcm9wZXJ0eV0sIHZhbGlkYXRvcnMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB2YWxpZGF0ZVByb3BlcnRpZXNGb3IodGFyZ2V0LCByZXN1bHQsIHNpbGVudCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzaG91bGRTa2lwUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRhcmdldFtwcm9wZXJ0eV0udmFsaWRhdG9yICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlVG9WYWxpZGF0ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodGFyZ2V0W3Byb3BlcnR5XSgpKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2lsZW50ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFtwcm9wZXJ0eV0udmFsaWRhdG9yLnZhbGlkYXRlU2lsZW50bHkodmFsdWVUb1ZhbGlkYXRlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcGVydHldLnZhbGlkYXRvci52YWxpZGF0ZSh2YWx1ZVRvVmFsaWRhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldFtwcm9wZXJ0eV0udmFsaWRhdG9yLmlzVmFsaWQoKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0W3Byb3BlcnR5XSA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlUHJvcGVydGllc0Zvcih0YXJnZXRbcHJvcGVydHldLCByZXN1bHQsIHNpbGVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBhcHBseVZhbGlkYXRpb25NZXNzYWdlVG9NZW1iZXJzKGNvbW1hbmQsIG1lbWJlcnMsIG1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gZml4TWVtYmVyKG1lbWJlcikge1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydHkgPSBtZW1iZXIudG9DYW1lbENhc2UoKTtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSBpbiB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRhcmdldFtwcm9wZXJ0eV0gPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0W3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIG1lbWJlckluZGV4ID0gMDsgbWVtYmVySW5kZXggPCBtZW1iZXJzLmxlbmd0aDsgbWVtYmVySW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhdGggPSBtZW1iZXJzW21lbWJlckluZGV4XS5zcGxpdChcIi5cIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHkgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IGNvbW1hbmQ7XHJcblxyXG4gICAgICAgICAgICAgICAgcGF0aC5mb3JFYWNoKGZpeE1lbWJlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ICE9IG51bGwgJiYgcHJvcGVydHkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1lbWJlciA9IHRhcmdldFtwcm9wZXJ0eV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbWVtYmVyLnZhbGlkYXRvciAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1iZXIudmFsaWRhdG9yLmlzVmFsaWQoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1iZXIudmFsaWRhdG9yLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmFwcGx5VmFsaWRhdGlvblJlc3VsdFRvUHJvcGVydGllcyA9IGZ1bmN0aW9uIChjb21tYW5kLCB2YWxpZGF0aW9uUmVzdWx0cykge1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWxpZGF0aW9uUmVzdWx0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbGlkYXRpb25SZXN1bHQgPSB2YWxpZGF0aW9uUmVzdWx0c1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gdmFsaWRhdGlvblJlc3VsdC5lcnJvck1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWVtYmVyTmFtZXMgPSB2YWxpZGF0aW9uUmVzdWx0Lm1lbWJlck5hbWVzO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1lbWJlck5hbWVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBhcHBseVZhbGlkYXRpb25NZXNzYWdlVG9NZW1iZXJzKGNvbW1hbmQsIG1lbWJlck5hbWVzLCBtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMudmFsaWRhdGUgPSBmdW5jdGlvbiAoY29tbWFuZCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0geyB2YWxpZDogdHJ1ZSB9O1xyXG4gICAgICAgICAgICB2YWxpZGF0ZVByb3BlcnRpZXNGb3IoY29tbWFuZCwgcmVzdWx0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnZhbGlkYXRlU2lsZW50bHkgPSBmdW5jdGlvbiAoY29tbWFuZCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0geyB2YWxpZDogdHJ1ZSB9O1xyXG4gICAgICAgICAgICB2YWxpZGF0ZVByb3BlcnRpZXNGb3IoY29tbWFuZCwgcmVzdWx0LCB0cnVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNsZWFyVmFsaWRhdGlvbk1lc3NhZ2VzRm9yID0gZnVuY3Rpb24gKHRhcmdldCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzaG91bGRTa2lwUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodGFyZ2V0W3Byb3BlcnR5XS52YWxpZGF0b3IpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BlcnR5XS52YWxpZGF0b3IubWVzc2FnZShcIlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZXh0ZW5kUHJvcGVydGllc1dpdGhvdXRWYWxpZGF0aW9uID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgZXh0ZW5kUHJvcGVydGllcyhjb21tYW5kKTtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY29sbGVjdFZhbGlkYXRvcnMoc291cmNlLCB2YWxpZGF0b3JzKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHNvdXJjZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gc291cmNlW3Byb3BlcnR5XTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2hvdWxkU2tpcFByb3BlcnR5KHNvdXJjZSwgcHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZSh2YWx1ZSkgJiYgdHlwZW9mIHZhbHVlLnZhbGlkYXRvciAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvcnMucHVzaCh2YWx1ZS52YWxpZGF0b3IpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChCaWZyb3N0LmlzT2JqZWN0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbGxlY3RWYWxpZGF0b3JzKHZhbHVlLCB2YWxpZGF0b3JzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5nZXRWYWxpZGF0b3JzRm9yID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgdmFyIHZhbGlkYXRvcnMgPSBbXTtcclxuICAgICAgICAgICAgY29sbGVjdFZhbGlkYXRvcnMoY29tbWFuZCwgdmFsaWRhdG9ycyk7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWxpZGF0b3JzO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuY29tbWFuZHNcIiwge1xyXG4gICAgQ29tbWFuZDogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoY29tbWFuZENvb3JkaW5hdG9yLCBjb21tYW5kVmFsaWRhdGlvblNlcnZpY2UsIGNvbW1hbmRTZWN1cml0eVNlcnZpY2UsIG1hcHBlciwgb3B0aW9ucywgcmVnaW9uKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBoYXNDaGFuZ2VzT2JzZXJ2YWJsZXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZWdpb24gPSByZWdpb247XHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5fZ2VuZXJhdGVkRnJvbSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy50YXJnZXRDb21tYW5kID0gdGhpcztcclxuICAgICAgICB0aGlzLnZhbGlkYXRvcnMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICB0aGlzLnZhbGlkYXRpb25NZXNzYWdlcyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgIHRoaXMuc2VjdXJpdHlDb250ZXh0ID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxuICAgICAgICB0aGlzLnBvcHVsYXRlZEZyb21FeHRlcm5hbFNvdXJjZSA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5pc0J1c3kgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgICAgICB0aGlzLmlzVmFsaWQgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWxpZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHNlbGYudmFsaWRhdG9ycygpLnNvbWUoZnVuY3Rpb24gKHZhbGlkYXRvcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZSh2YWxpZGF0b3IuaXNWYWxpZCkgJiYgdmFsaWRhdG9yLmlzVmFsaWQoKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWxmLnZhbGlkYXRpb25NZXNzYWdlcygpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaXNBdXRob3JpemVkID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5jYW5FeGVjdXRlID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5pc1ZhbGlkKCkgJiYgc2VsZi5pc0F1dGhvcml6ZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmlzUG9wdWxhdGVkRXh0ZXJuYWxseSA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuaXNSZWFkeSA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuaXNQb3B1bGF0ZWRFeHRlcm5hbGx5KCkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wb3B1bGF0ZWRGcm9tRXh0ZXJuYWxTb3VyY2UoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmlzUmVhZHlUb0V4ZWN1dGUgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmlzUG9wdWxhdGVkRXh0ZXJuYWxseSgpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmhhc0NoYW5nZXMoKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuaGFzQ2hhbmdlcyA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGhhc0NoYW5nZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBoYXNDaGFuZ2VzT2JzZXJ2YWJsZXMoKS5zb21lKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSgpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGFzQ2hhbmdlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaGFzQ2hhbmdlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmZhaWxlZENhbGxiYWNrcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuc3VjY2VlZGVkQ2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgdGhpcy5jb21wbGV0ZWRDYWxsYmFja3MgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5jb21tYW5kQ29vcmRpbmF0b3IgPSBjb21tYW5kQ29vcmRpbmF0b3I7XHJcbiAgICAgICAgdGhpcy5jb21tYW5kVmFsaWRhdGlvblNlcnZpY2UgPSBjb21tYW5kVmFsaWRhdGlvblNlcnZpY2U7XHJcbiAgICAgICAgdGhpcy5jb21tYW5kU2VjdXJpdHlTZXJ2aWNlID0gY29tbWFuZFNlY3VyaXR5U2VydmljZTtcclxuXHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0ge1xyXG4gICAgICAgICAgICBiZWZvcmVFeGVjdXRlOiBmdW5jdGlvbiAoKSB7IH0sXHJcbiAgICAgICAgICAgIGZhaWxlZDogZnVuY3Rpb24gKCkgeyB9LFxyXG4gICAgICAgICAgICBzdWNjZWVkZWQ6IGZ1bmN0aW9uICgpIHsgfSxcclxuICAgICAgICAgICAgY29tcGxldGVkOiBmdW5jdGlvbiAoKSB7IH0sXHJcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5mYWlsZWQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgc2VsZi5mYWlsZWRDYWxsYmFja3MucHVzaChjYWxsYmFjayk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5zdWNjZWVkZWQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgc2VsZi5zdWNjZWVkZWRDYWxsYmFja3MucHVzaChjYWxsYmFjayk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5jb21wbGV0ZWQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgc2VsZi5jb21wbGV0ZWRDYWxsYmFja3MucHVzaChjYWxsYmFjayk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIEJpZnJvc3QuZXh0ZW5kKHNlbGYub3B0aW9ucywgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5uYW1lICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBvcHRpb25zLm5hbWUgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuX25hbWUgPSBvcHRpb25zLm5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNvcHlQcm9wZXJ0aWVzRnJvbU9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHNlbGYudGFyZ2V0Q29tbWFuZC5vcHRpb25zLnByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHNlbGYudGFyZ2V0Q29tbWFuZC5vcHRpb25zLnByb3BlcnRpZXNbcHJvcGVydHldO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFrby5pc09ic2VydmFibGUodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBrby5vYnNlcnZhYmxlKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnRhcmdldENvbW1hbmRbcHJvcGVydHldID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldFByb3BlcnRpZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHNlbGYudGFyZ2V0Q29tbWFuZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYudGFyZ2V0Q29tbWFuZC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkgJiZcclxuICAgICAgICAgICAgICAgICAgICAhKHNlbGYuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaChwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0aWVzO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMubWFrZVByb3BlcnRpZXNPYnNlcnZhYmxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IHNlbGYuZ2V0UHJvcGVydGllcygpO1xyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5VmFsdWUgPSBzZWxmLnRhcmdldENvbW1hbmRbcHJvcGVydHldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgha28uaXNPYnNlcnZhYmxlKHByb3BlcnR5VmFsdWUpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICh0eXBlb2YgcHJvcGVydHlWYWx1ZSAhPT0gXCJvYmplY3RcIiB8fCBCaWZyb3N0LmlzQXJyYXkocHJvcGVydHlWYWx1ZSkpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcGVydHlWYWx1ZSAhPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzQXJyYXkocHJvcGVydHlWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0ga28ub2JzZXJ2YWJsZUFycmF5KHByb3BlcnR5VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBrby5vYnNlcnZhYmxlKHByb3BlcnR5VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudGFyZ2V0Q29tbWFuZFtwcm9wZXJ0eV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZXh0ZW5kUHJvcGVydGllc1dpdGhIYXNDaGFuZ2VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IHNlbGYuZ2V0UHJvcGVydGllcygpO1xyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eVZhbHVlID0gc2VsZi50YXJnZXRDb21tYW5kW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgICAgIGlmIChrby5pc09ic2VydmFibGUocHJvcGVydHlWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlLmV4dGVuZCh7IGhhc0NoYW5nZXM6IHt9IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChwcm9wZXJ0eVZhbHVlLmhhc0NoYW5nZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0NoYW5nZXNPYnNlcnZhYmxlcy5wdXNoKHByb3BlcnR5VmFsdWUuaGFzQ2hhbmdlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9uQmVmb3JlRXhlY3V0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2VsZi5vcHRpb25zLmJlZm9yZUV4ZWN1dGUoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9uRmFpbGVkID0gZnVuY3Rpb24gKGNvbW1hbmRSZXN1bHQpIHtcclxuICAgICAgICAgICAgc2VsZi5vcHRpb25zLmZhaWxlZChjb21tYW5kUmVzdWx0KTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuZmFpbGVkQ2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhjb21tYW5kUmVzdWx0KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsVmFsdWVzRm9yUHJvcGVydGllcyA9IGZ1bmN0aW9uIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbiAocHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHkgPSBzZWxmLnRhcmdldENvbW1hbmRbcHJvcGVydHlOYW1lXTtcclxuICAgICAgICAgICAgICAgIGlmIChrby5pc09ic2VydmFibGUocHJvcGVydHkpICYmXHJcbiAgICAgICAgICAgICAgICAgICAga28uaXNXcml0ZWFibGVPYnNlcnZhYmxlKHByb3BlcnR5KSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIEJpZnJvc3QuaXNGdW5jdGlvbihwcm9wZXJ0eS5zZXRJbml0aWFsVmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gcHJvcGVydHkoKTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eS5zZXRJbml0aWFsVmFsdWUodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNldEluaXRpYWxWYWx1ZXNGcm9tQ3VycmVudFZhbHVlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBzZWxmLmdldFByb3BlcnRpZXMoKTtcclxuICAgICAgICAgICAgc2VsZi5zZXRJbml0aWFsVmFsdWVzRm9yUHJvcGVydGllcyhwcm9wZXJ0aWVzKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9uU3VjY2VlZGVkID0gZnVuY3Rpb24gKGNvbW1hbmRSZXN1bHQpIHtcclxuICAgICAgICAgICAgc2VsZi5vcHRpb25zLnN1Y2NlZWRlZChjb21tYW5kUmVzdWx0KTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2V0SW5pdGlhbFZhbHVlc0Zyb21DdXJyZW50VmFsdWVzKCk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnN1Y2NlZWRlZENhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soY29tbWFuZFJlc3VsdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMub25Db21wbGV0ZWQgPSBmdW5jdGlvbiAoY29tbWFuZFJlc3VsdCkge1xyXG4gICAgICAgICAgICBzZWxmLm9wdGlvbnMuY29tcGxldGVkKGNvbW1hbmRSZXN1bHQpO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5jb21wbGV0ZWRDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGNvbW1hbmRSZXN1bHQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZUNvbW1hbmRSZXN1bHQgPSBmdW5jdGlvbiAoY29tbWFuZFJlc3VsdCkge1xyXG4gICAgICAgICAgICBzZWxmLmlzQnVzeShmYWxzZSk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29tbWFuZFJlc3VsdC5jb21tYW5kVmFsaWRhdGlvbk1lc3NhZ2VzICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnZhbGlkYXRpb25NZXNzYWdlcyhjb21tYW5kUmVzdWx0LmNvbW1hbmRWYWxpZGF0aW9uTWVzc2FnZXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY29tbWFuZFJlc3VsdC5zdWNjZXNzID09PSBmYWxzZSB8fCBjb21tYW5kUmVzdWx0LmludmFsaWQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb21tYW5kUmVzdWx0LmludmFsaWQgJiYgdHlwZW9mIGNvbW1hbmRSZXN1bHQudmFsaWRhdGlvblJlc3VsdHMgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbW1hbmRWYWxpZGF0aW9uU2VydmljZS5hcHBseVZhbGlkYXRpb25SZXN1bHRUb1Byb3BlcnRpZXMoc2VsZi50YXJnZXRDb21tYW5kLCBjb21tYW5kUmVzdWx0LnZhbGlkYXRpb25SZXN1bHRzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHNlbGYub25GYWlsZWQoY29tbWFuZFJlc3VsdCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLm9uU3VjY2VlZGVkKGNvbW1hbmRSZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNlbGYub25Db21wbGV0ZWQoY29tbWFuZFJlc3VsdCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRDb21tYW5kUmVzdWx0RnJvbVZhbGlkYXRpb25SZXN1bHQgPSBmdW5jdGlvbiAodmFsaWRhdGlvblJlc3VsdCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gQmlmcm9zdC5jb21tYW5kcy5Db21tYW5kUmVzdWx0LmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICByZXN1bHQuaW52YWxpZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZWxmLmlzQnVzeSh0cnVlKTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHNlbGYub25CZWZvcmVFeGVjdXRlKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsaWRhdGlvblJlc3VsdCA9IHNlbGYuY29tbWFuZFZhbGlkYXRpb25TZXJ2aWNlLnZhbGlkYXRlKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbGlkYXRpb25SZXN1bHQudmFsaWQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb21tYW5kQ29vcmRpbmF0b3IuaGFuZGxlKHNlbGYudGFyZ2V0Q29tbWFuZCkuY29udGludWVXaXRoKGZ1bmN0aW9uIChjb21tYW5kUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhhbmRsZUNvbW1hbmRSZXN1bHQoY29tbWFuZFJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29tbWFuZFJlc3VsdCA9IHNlbGYuZ2V0Q29tbWFuZFJlc3VsdEZyb21WYWxpZGF0aW9uUmVzdWx0KHZhbGlkYXRpb25SZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaGFuZGxlQ29tbWFuZFJlc3VsdChjb21tYW5kUmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuaXNCdXN5KGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucG9wdWxhdGVkRXh0ZXJuYWxseSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2VsZi5pc1BvcHVsYXRlZEV4dGVybmFsbHkodHJ1ZSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5wb3B1bGF0ZUZyb21FeHRlcm5hbFNvdXJjZSA9IGZ1bmN0aW9uICh2YWx1ZXMpIHtcclxuICAgICAgICAgICAgc2VsZi5pc1BvcHVsYXRlZEV4dGVybmFsbHkodHJ1ZSk7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0UHJvcGVydHlWYWx1ZXNGcm9tKHZhbHVlcyk7XHJcbiAgICAgICAgICAgIHNlbGYucG9wdWxhdGVkRnJvbUV4dGVybmFsU291cmNlKHRydWUpO1xyXG4gICAgICAgICAgICBjb21tYW5kVmFsaWRhdGlvblNlcnZpY2UuY2xlYXJWYWxpZGF0aW9uTWVzc2FnZXNGb3Ioc2VsZi50YXJnZXRDb21tYW5kKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNldFByb3BlcnR5VmFsdWVzRnJvbSA9IGZ1bmN0aW9uICh2YWx1ZXMpIHtcclxuICAgICAgICAgICAgdmFyIG1hcHBlZFByb3BlcnRpZXMgPSBtYXBwZXIubWFwVG9JbnN0YW5jZShzZWxmLnRhcmdldENvbW1hbmQuX3R5cGUsIHZhbHVlcywgc2VsZi50YXJnZXRDb21tYW5kKTtcclxuICAgICAgICAgICAgc2VsZi5zZXRJbml0aWFsVmFsdWVzRm9yUHJvcGVydGllcyhtYXBwZWRQcm9wZXJ0aWVzKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9uQ3JlYXRlZCA9IGZ1bmN0aW9uIChsYXN0RGVzY2VuZGFudCkge1xyXG4gICAgICAgICAgICBzZWxmLnRhcmdldENvbW1hbmQgPSBsYXN0RGVzY2VuZGFudDtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvcHlQcm9wZXJ0aWVzRnJvbU9wdGlvbnMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm1ha2VQcm9wZXJ0aWVzT2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmV4dGVuZFByb3BlcnRpZXNXaXRoSGFzQ2hhbmdlcygpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGxhc3REZXNjZW5kYW50Ll9uYW1lICE9PSBcInVuZGVmaW5lZFwiICYmIGxhc3REZXNjZW5kYW50Ll9uYW1lICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kVmFsaWRhdGlvblNlcnZpY2UuZXh0ZW5kUHJvcGVydGllc1dpdGhvdXRWYWxpZGF0aW9uKGxhc3REZXNjZW5kYW50KTtcclxuICAgICAgICAgICAgICAgIHZhciB2YWxpZGF0b3JzID0gY29tbWFuZFZhbGlkYXRpb25TZXJ2aWNlLmdldFZhbGlkYXRvcnNGb3IobGFzdERlc2NlbmRhbnQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNBcnJheSh2YWxpZGF0b3JzKSAmJiB2YWxpZGF0b3JzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnZhbGlkYXRvcnModmFsaWRhdG9ycyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kVmFsaWRhdGlvblNlcnZpY2UudmFsaWRhdGVTaWxlbnRseSh0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29tbWFuZFNlY3VyaXR5U2VydmljZS5nZXRDb250ZXh0Rm9yKGxhc3REZXNjZW5kYW50KS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHNlY3VyaXR5Q29udGV4dCkge1xyXG4gICAgICAgICAgICAgICAgbGFzdERlc2NlbmRhbnQuc2VjdXJpdHlDb250ZXh0KHNlY3VyaXR5Q29udGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZShzZWN1cml0eUNvbnRleHQuaXNBdXRob3JpemVkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhc3REZXNjZW5kYW50LmlzQXV0aG9yaXplZChzZWN1cml0eUNvbnRleHQuaXNBdXRob3JpemVkKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlY3VyaXR5Q29udGV4dC5pc0F1dGhvcml6ZWQuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0RGVzY2VuZGFudC5pc0F1dGhvcml6ZWQobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmNvbW1hbmRzXCIpO1xyXG5CaWZyb3N0LmNvbW1hbmRzLkNvbW1hbmREZXNjcmlwdG9yID0gZnVuY3Rpb24oY29tbWFuZCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHZhciBidWlsdEluQ29tbWFuZCA9IHt9O1xyXG4gICAgaWYgKHR5cGVvZiBCaWZyb3N0LmNvbW1hbmRzLkNvbW1hbmQgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICBidWlsdEluQ29tbWFuZCA9IEJpZnJvc3QuY29tbWFuZHMuQ29tbWFuZC5jcmVhdGUoe1xyXG4gICAgICAgICAgICByZWdpb246IHsgY29tbWFuZHM6IFtdIH0sXHJcbiAgICAgICAgICAgIGNvbW1hbmRDb29yZGluYXRvcjoge30sXHJcbiAgICAgICAgICAgIGNvbW1hbmRWYWxpZGF0aW9uU2VydmljZToge30sXHJcbiAgICAgICAgICAgIGNvbW1hbmRTZWN1cml0eVNlcnZpY2U6IHsgZ2V0Q29udGV4dEZvcjogZnVuY3Rpb24gKCkgeyByZXR1cm4geyBjb250aW51ZVdpdGg6IGZ1bmN0aW9uICgpIHsgfSB9OyB9IH0sXHJcbiAgICAgICAgICAgIG1hcHBlcjoge30sXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHt9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2hvdWxkU2tpcFByb3BlcnR5KHRhcmdldCwgcHJvcGVydHkpIHtcclxuICAgICAgICBpZiAoIXRhcmdldC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChidWlsdEluQ29tbWFuZC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChrby5pc09ic2VydmFibGUodGFyZ2V0W3Byb3BlcnR5XSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIHRhcmdldFtwcm9wZXJ0eV0gPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHByb3BlcnR5ID09PSBcIl90eXBlXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gXCJfbmFtZXNwYWNlXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UHJvcGVydGllc0Zyb21Db21tYW5kKGNvbW1hbmQpIHtcclxuICAgICAgICB2YXIgcHJvcGVydGllcyA9IHt9O1xyXG5cclxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBjb21tYW5kKSB7XHJcbiAgICAgICAgICAgIGlmICghc2hvdWxkU2tpcFByb3BlcnR5KGNvbW1hbmQsIHByb3BlcnR5KSApIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXNbcHJvcGVydHldID0gY29tbWFuZFtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHByb3BlcnRpZXM7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5uYW1lID0gY29tbWFuZC5fbmFtZTtcclxuICAgIHRoaXMuZ2VuZXJhdGVkRnJvbSA9IGNvbW1hbmQuX2dlbmVyYXRlZEZyb207XHJcbiAgICB0aGlzLmlkID0gQmlmcm9zdC5HdWlkLmNyZWF0ZSgpO1xyXG5cclxuICAgIHZhciBwcm9wZXJ0aWVzID0gZ2V0UHJvcGVydGllc0Zyb21Db21tYW5kKGNvbW1hbmQpO1xyXG4gICAgdmFyIGNvbW1hbmRDb250ZW50ID0ga28udG9KUyhwcm9wZXJ0aWVzKTtcclxuICAgIGNvbW1hbmRDb250ZW50LklkID0gQmlmcm9zdC5HdWlkLmNyZWF0ZSgpO1xyXG4gICAgdGhpcy5jb21tYW5kID0ga28udG9KU09OKGNvbW1hbmRDb250ZW50KTtcclxufTtcclxuXHJcblxyXG5CaWZyb3N0LmNvbW1hbmRzLkNvbW1hbmREZXNjcmlwdG9yLmNyZWF0ZUZyb20gPSBmdW5jdGlvbiAoY29tbWFuZCkge1xyXG4gICAgdmFyIGNvbW1hbmREZXNjcmlwdG9yID0gbmV3IEJpZnJvc3QuY29tbWFuZHMuQ29tbWFuZERlc2NyaXB0b3IoY29tbWFuZCk7XHJcbiAgICByZXR1cm4gY29tbWFuZERlc2NyaXB0b3I7XHJcbn07XHJcblxyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuY29tbWFuZHNcIik7XHJcbkJpZnJvc3QuY29tbWFuZHMuQ29tbWFuZFJlc3VsdCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBDb21tYW5kUmVzdWx0KGV4aXN0aW5nKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuY29tbWFuZElkID09PSBCaWZyb3N0Lkd1aWQuZW1wdHk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jb21tYW5kTmFtZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5jb21tYW5kSWQgPSBCaWZyb3N0Lkd1aWQuZW1wdHk7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0aW9uUmVzdWx0cyA9IFtdO1xyXG4gICAgICAgIHRoaXMuc3VjY2VzcyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5pbnZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5wYXNzZWRTZWN1cml0eSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5leGNlcHRpb24gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5leGNlcHRpb25NZXNzYWdlID0gXCJcIjtcclxuICAgICAgICB0aGlzLmNvbW1hbmRWYWxpZGF0aW9uTWVzc2FnZXMgPSBbXTtcclxuICAgICAgICB0aGlzLnNlY3VyaXR5TWVzc2FnZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmFsbFZhbGlkYXRpb25NZXNzYWdlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZGV0YWlscyA9IFwiXCI7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgZXhpc3RpbmcgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgQmlmcm9zdC5leHRlbmQodGhpcywgZXhpc3RpbmcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNyZWF0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBjb21tYW5kUmVzdWx0ID0gbmV3IENvbW1hbmRSZXN1bHQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbW1hbmRSZXN1bHQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjcmVhdGVGcm9tOiBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIHZhciBleGlzdGluZyA9IHR5cGVvZiByZXN1bHQgPT09IFwic3RyaW5nXCIgPyBKU09OLnBhcnNlKHJlc3VsdCkgOiByZXN1bHQ7XHJcbiAgICAgICAgICAgIHZhciBjb21tYW5kUmVzdWx0ID0gbmV3IENvbW1hbmRSZXN1bHQoZXhpc3RpbmcpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29tbWFuZFJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59KSgpOyIsIkJpZnJvc3QuZGVwZW5kZW5jeVJlc29sdmVycy5jb21tYW5kID0ge1xyXG4gICAgY2FuUmVzb2x2ZTogZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgY29tbWFuZHMgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5hbWUgaW4gY29tbWFuZHM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVzb2x2ZTogZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgIHJldHVybiBjb21tYW5kc1tuYW1lXS5jcmVhdGUoKTtcclxuICAgIH1cclxufTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuY29tbWFuZHNcIiwge1xyXG4gICAgQ29tbWFuZFNlY3VyaXR5Q29udGV4dDogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5pc0F1dGhvcml6ZWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5jb21tYW5kc1wiLCB7XHJcbiAgICBjb21tYW5kU2VjdXJpdHlDb250ZXh0RmFjdG9yeTogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgY29udGV4dCA9IEJpZnJvc3QuY29tbWFuZHMuQ29tbWFuZFNlY3VyaXR5Q29udGV4dC5jcmVhdGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQ7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5jb21tYW5kc1wiLCB7XHJcbiAgICBjb21tYW5kU2VjdXJpdHlTZXJ2aWNlOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoY29tbWFuZFNlY3VyaXR5Q29udGV4dEZhY3RvcnkpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuY29tbWFuZFNlY3VyaXR5Q29udGV4dEZhY3RvcnkgPSBjb21tYW5kU2VjdXJpdHlDb250ZXh0RmFjdG9yeTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0VHlwZU5hbWVGb3IoY29tbWFuZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gY29tbWFuZC5fdHlwZS5fbmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFNlY3VyaXR5Q29udGV4dE5hbWVGb3IodHlwZSkge1xyXG4gICAgICAgICAgICB2YXIgc2VjdXJpdHlDb250ZXh0TmFtZSA9IHR5cGUgKyBcIlNlY3VyaXR5Q29udGV4dFwiO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VjdXJpdHlDb250ZXh0TmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhc1NlY3VyaXR5Q29udGV4dEluTmFtZXNwYWNlRm9yKHR5cGUsIG5hbWVzcGFjZSkge1xyXG4gICAgICAgICAgICB2YXIgc2VjdXJpdHlDb250ZXh0TmFtZSA9IGdldFNlY3VyaXR5Q29udGV4dE5hbWVGb3IodHlwZSk7XHJcbiAgICAgICAgICAgIHJldHVybiAhQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChzZWN1cml0eUNvbnRleHROYW1lKSAmJlxyXG4gICAgICAgICAgICAgICAgIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQobmFtZXNwYWNlKSAmJlxyXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlLmhhc093blByb3BlcnR5KHNlY3VyaXR5Q29udGV4dE5hbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0U2VjdXJpdHlDb250ZXh0SW5OYW1lc3BhY2VGb3IodHlwZSwgbmFtZXNwYWNlKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWN1cml0eUNvbnRleHROYW1lID0gZ2V0U2VjdXJpdHlDb250ZXh0TmFtZUZvcih0eXBlLCBuYW1lc3BhY2UpO1xyXG4gICAgICAgICAgICByZXR1cm4gbmFtZXNwYWNlW3NlY3VyaXR5Q29udGV4dE5hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5nZXRDb250ZXh0Rm9yID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB2YXIgY29udGV4dDtcclxuXHJcbiAgICAgICAgICAgIHZhciB0eXBlID0gZ2V0VHlwZU5hbWVGb3IoY29tbWFuZCk7XHJcbiAgICAgICAgICAgIGlmIChoYXNTZWN1cml0eUNvbnRleHRJbk5hbWVzcGFjZUZvcih0eXBlLCBjb21tYW5kLl90eXBlLl9uYW1lc3BhY2UpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29udGV4dFR5cGUgPSBnZXRTZWN1cml0eUNvbnRleHRJbk5hbWVzcGFjZUZvcih0eXBlLCBjb21tYW5kLl90eXBlLl9uYW1lc3BhY2UpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dCA9IGNvbnRleHRUeXBlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoY29udGV4dCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0ID0gc2VsZi5jb21tYW5kU2VjdXJpdHlDb250ZXh0RmFjdG9yeS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGNvbW1hbmQuX2dlbmVyYXRlZEZyb20pIHx8IGNvbW1hbmQuX2dlbmVyYXRlZEZyb20gPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVybCA9IFwiL0JpZnJvc3QvQ29tbWFuZFNlY3VyaXR5L0dldEZvckNvbW1hbmQ/Y29tbWFuZE5hbWU9XCIgKyBjb21tYW5kLl9nZW5lcmF0ZWRGcm9tO1xyXG4gICAgICAgICAgICAgICAgICAgICQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuaXNBdXRob3JpemVkKGUuaXNBdXRob3JpemVkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0Q29udGV4dEZvclR5cGUgPSBmdW5jdGlvbiAoY29tbWFuZFR5cGUpIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB2YXIgY29udGV4dDtcclxuXHJcbiAgICAgICAgICAgIGlmIChoYXNTZWN1cml0eUNvbnRleHRJbk5hbWVzcGFjZUZvcihjb21tYW5kVHlwZS5fbmFtZSwgY29tbWFuZFR5cGUuX25hbWVzcGFjZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb250ZXh0VHlwZSA9IGdldFNlY3VyaXR5Q29udGV4dEluTmFtZXNwYWNlRm9yKGNvbW1hbmRUeXBlLl9uYW1lLCBjb21tYW5kVHlwZS5fbmFtZXNwYWNlKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQgPSBjb250ZXh0VHlwZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGNvbnRleHQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29udGV4dCA9IEJpZnJvc3QuY29tbWFuZHMuQ29tbWFuZFNlY3VyaXR5Q29udGV4dC5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuaXNBdXRob3JpemVkKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoY29udGV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy5jb21tYW5kU2VjdXJpdHlTZXJ2aWNlID0gQmlmcm9zdC5jb21tYW5kcy5jb21tYW5kU2VjdXJpdHlTZXJ2aWNlOyIsImtvLmV4dGVuZGVycy5oYXNDaGFuZ2VzID0gZnVuY3Rpb24gKHRhcmdldCkge1xyXG4gICAgdGFyZ2V0Ll9pbml0aWFsVmFsdWVTZXQgPSBmYWxzZTtcclxuICAgIHRhcmdldC5oYXNDaGFuZ2VzID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcbiAgICBmdW5jdGlvbiB1cGRhdGVIYXNDaGFuZ2VzKCkge1xyXG4gICAgICAgIGlmICh0YXJnZXQuX2luaXRpYWxWYWx1ZVNldCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdGFyZ2V0Lmhhc0NoYW5nZXMoZmFsc2UpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzQXJyYXkodGFyZ2V0Ll9pbml0aWFsVmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuaGFzQ2hhbmdlcyghdGFyZ2V0Ll9pbml0aWFsVmFsdWUuc2hhbGxvd0VxdWFscyh0YXJnZXQoKSkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRhcmdldC5oYXNDaGFuZ2VzKHRhcmdldC5faW5pdGlhbFZhbHVlICE9PSB0YXJnZXQoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRhcmdldC5zdWJzY3JpYmUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHVwZGF0ZUhhc0NoYW5nZXMoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRhcmdldC5zZXRJbml0aWFsVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICB2YXIgaW5pdGlhbFZhbHVlO1xyXG4gICAgICAgIGlmIChCaWZyb3N0LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIGluaXRpYWxWYWx1ZSA9IHZhbHVlLmNsb25lKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaW5pdGlhbFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0YXJnZXQuX2luaXRpYWxWYWx1ZSA9IGluaXRpYWxWYWx1ZTtcclxuICAgICAgICB0YXJnZXQuX2luaXRpYWxWYWx1ZVNldCA9IHRydWU7XHJcbiAgICAgICAgdXBkYXRlSGFzQ2hhbmdlcygpO1xyXG4gICAgfTtcclxufTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuY29tbWFuZHNcIiwge1xyXG4gICAgY29tbWFuZEV2ZW50czogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuc3VjY2VlZGVkID0gQmlmcm9zdC5FdmVudC5jcmVhdGUoKTtcclxuICAgICAgICB0aGlzLmZhaWxlZCA9IEJpZnJvc3QuRXZlbnQuY3JlYXRlKCk7XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW50ZXJhY3Rpb25cIiwge1xyXG4gICAgT3BlcmF0aW9uOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uIChyZWdpb24sIGNvbnRleHQpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+RGVmaW5lcyBhbiBvcGVyYXRpb24gdGhhdCBiZSBwZXJmb3JtZWQ8L3N1bW1hcnk+XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjYW5QZXJmb3JtT2JzZXJ2YWJsZXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICB2YXIgaW50ZXJuYWxDYW5QZXJmb3JtID0ga28ub2JzZXJ2YWJsZSh0cnVlKTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiY29udGV4dFwiIHR5cGU9XCJCaWZyb3N0LmludGVyYWN0aW9uLk9wZXJhdGlvblwiPkNvbnRleHQgaW4gd2hpY2ggdGhlIG9wZXJhdGlvbiBleGlzdHMgaW48L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImlkZW50aWZpZXJcIiB0eXBlPVwiQmlmcm9zdC5HdWlkXCI+VW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBvcGVyYXRpb24gaW5zdGFuY2U8ZmllbGQ+XHJcbiAgICAgICAgdGhpcy5pZGVudGlmaWVyID0gQmlmcm9zdC5HdWlkLmVtcHR5O1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJyZWdpb25cIiB0eXBlPVwiQmlmcm9zdC52aWV3cy5SZWdpb25cIj5SZWdpb24gdGhhdCB0aGUgb3BlcmF0aW9uIHdhcyBjcmVhdGVkIGluPC9maWVsZD5cclxuICAgICAgICB0aGlzLnJlZ2lvbiA9IHJlZ2lvbjtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiY2FuUGVyZm9ybVwiIHR5cGU9XCJvYnNlcnZhYmxlXCI+U2V0IHRvIHRydWUgaWYgdGhlIG9wZXJhdGlvbiBjYW4gYmUgcGVyZm9ybWVkLCBmYWxzZSBpZiBub3Q8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuY2FuUGVyZm9ybSA9IGtvLmNvbXB1dGVkKHtcclxuICAgICAgICAgICAgcmVhZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhblBlcmZvcm1PYnNlcnZhYmxlcygpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjYW5QZXJmb3JtID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGNhblBlcmZvcm1PYnNlcnZhYmxlcygpLmZvckVhY2goZnVuY3Rpb24gKG9ic2VydmFibGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JzZXJ2YWJsZSgpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5QZXJmb3JtID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FuUGVyZm9ybTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgd3JpdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaW50ZXJuYWxDYW5QZXJmb3JtKHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNhblBlcmZvcm0ud2hlbiA9IGZ1bmN0aW9uIChvYnNlcnZhYmxlKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5DaGFpbmFibGUgY2xhdXNlczwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwib2JzZXJ2YWJsZVwiIHR5cGU9XCJvYnNlcnZhYmxlXCI+VGhlIG9ic2VydmFibGUgdG8gdXNlIGZvciBkZWNpZGluZyB3ZXRoZXIgb3Igbm90IHRoZSBvcGVyYXRpb24gY2FuIHBlcmZvcm08L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHJldHVybnM+VGhlIGNhblBlcmZvcm0gdGhhdCBjYW4gYmUgZnVydGhlciBjaGFpbmVkPC9yZXR1cm5zPlxyXG4gICAgICAgICAgICBjYW5QZXJmb3JtT2JzZXJ2YWJsZXMucHVzaChvYnNlcnZhYmxlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuY2FuUGVyZm9ybTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNhblBlcmZvcm0ud2hlbihpbnRlcm5hbENhblBlcmZvcm0pO1xyXG5cclxuICAgICAgICB0aGlzLnBlcmZvcm0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5GdW5jdGlvbiB0aGF0IGdldHMgY2FsbGVkIHdoZW4gYW4gb3BlcmF0aW9uIGdldHMgcGVyZm9ybWVkPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHJldHVybnM+U3RhdGUgY2hhbmdlLCBpZiBhbnkgLSB0eXBpY2FsbHkgaGVscGZ1bCB3aGVuIHVuZG9pbmc8L3JldHVybnM+XHJcbiAgICAgICAgICAgIHJldHVybiB7fTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnVuZG8gPSBmdW5jdGlvbiAoc3RhdGUpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgd2hlbiBhbiBvcGVyYXRpb24gZ2V0cyB1bmRvZWQ8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cInN0YXRlXCIgdHlwZT1cIm9iamVjdFwiPlN0YXRlIGdlbmVyYXRlZCB3aGVuIHRoZSBvcGVyYXRpb24gd2FzIHBlcmZvcm1lZDwvcGFyYW0+XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5pbnRlcmFjdGlvblwiLCB7XHJcbiAgICBPcGVyYXRpb25Db250ZXh0OiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+RGVmaW5lcyB0aGUgY29udGV4dCBpbiB3aGljaCBhbiBvcGVyYXRpb24gaXMgYmVpbmcgcGVyZm9ybWVkIG9yIHVuZG9lZCB3aXRoaW48L3N1bW1hcnk+XHJcblxyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmludGVyYWN0aW9uXCIsIHtcclxuICAgIE9wZXJhdGlvbkVudHJ5OiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uIChvcGVyYXRpb24sIHN0YXRlKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYW4gZW50cnkgZm9yIGFuIG9wZXJhdGlvbiBpbiBhIHNwZWNpZmljIGNvbnRleHQgd2l0aCByZXN1bHRpbmcgc3RhdGU8L3N1bW1hcnk+XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cIm9wZXJhdGlvblwiIHR5cGU9XCJCaWZyb3N0LmludGVyYWN0aW9uLk9wZXJhdGlvblwiPk9wZXJhdGlvbiB0aGF0IHdhcyBwZXJmb3JtZWQ8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMub3BlcmF0aW9uID0gb3BlcmF0aW9uO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJzdGF0ZVwiIHR5cGU9XCJvYmplY3RcIj5TdGF0ZSB0aGF0IG9wZXJhdGlvbiBnZW5lcmF0ZWQ8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5pbnRlcmFjdGlvblwiLCB7XHJcbiAgICBvcGVyYXRpb25FbnRyeUZhY3Rvcnk6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyBhIGZhY3RvcnkgdGhhdCBjYW4gY3JlYXRlIE9wZXJhdGlvbkVudHJpZXM8L3N1bW1hcnk+XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKG9wZXJhdGlvbiwgc3RhdGUpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1hcnk+Q3JlYXRlIGFuIGluc3RhbmNlIG9mIGEgT3BlcmF0aW9uRW50cnk8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cImNvbnRleHRcIiB0eXBlPVwiQmlmcm9zdC5pbnRlcmFjdGlvbi5PcGVyYXRpb25Db250ZXh0XCI+Q29udGV4dCB0aGUgb3BlcmF0aW9uIHdhcyBwZXJmb3JtZWQgaW48L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJvcGVyYXRpb25cIiB0eXBlPVwiQmlmcm9zdC5pbnRlcmFjdGlvbi5PcGVyYXRpb25cIj5PcGVyYXRpb24gdGhhdCB3YXMgcGVyZm9ybWVkPC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwic3RhdGVcIiB0eXBlPVwib2JqZWN0XCI+U3RhdGUgdGhhdCBvcGVyYXRpb24gZ2VuZXJhdGVkPC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxyZXR1cm5zPkFuIE9wZXJhdGlvbkVudHJ5PC9yZXR1cm5zPlxyXG5cclxuICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gQmlmcm9zdC5pbnRlcmFjdGlvbi5PcGVyYXRpb25FbnRyeS5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBvcGVyYXRpb24sXHJcbiAgICAgICAgICAgICAgICBzdGF0ZTogc3RhdGVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmludGVyYWN0aW9uXCIsIHtcclxuICAgIE9wZXJhdGlvbnM6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKG9wZXJhdGlvbkVudHJ5RmFjdG9yeSkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGEgc3RhY2sgb2Ygb3BlcmF0aW9ucyBhbmQgdGhlIGFiaWxpdHkgdG8gcGVyZm9ybSBhbmQgcHV0IG9wZXJhdGlvbnMgb24gdGhlIHN0YWNrPC9zdW1tYXJ5PlxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiYWxsXCIgdHlwZT1cIm9ic2VydmFibGVBcnJheVwiPkhvbGRzIGFsbCBvcGVyYXRpb25zPC9maWVsZD5cclxuICAgICAgICB0aGlzLmFsbCA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJzdGF0ZWZ1bFwiIHR5cGU9XCJvYnNlcnZhYmxlQXJyYXlcIj5Ib2xkcyBhbGwgb3BlcmF0aW9ucyB0aGF0IGFyZSBzdGF0ZWZ1bCAtIG1lYW5pbmcgdGhhdCB0aGV5IHByb2R1Y2Ugc3RhdGUgZnJvbSBiZWluZyBwZXJmb3JtZWQ8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuc3RhdGVmdWwgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBlbnRyaWVzID0gW107XHJcblxyXG4gICAgICAgICAgICBzZWxmLmFsbCgpLmZvckVhY2goZnVuY3Rpb24gKGVudHJ5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuYXJlRXF1YWwoZW50cnkuc3RhdGUsIHt9KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVudHJpZXMucHVzaChlbnRyeSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGVudHJpZXM7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0QnlJZGVudGlmaWVyID0gZnVuY3Rpb24gKGlkZW50aWZpZXIpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkdldCBhbiBvcGVyYXRpb24gYnkgaXRzIGlkZW50aWZpZXI8L2lkZW50aWZpZXI+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cImlkZW50aWZpZXJcIiB0eXBlPVwiQmlmcm9zdC5HdWlkXCI+SWRlbnRpZmllciBvZiB0aGUgb3BlcmF0aW9uIHRvIGdldDxwYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxyZXR1cm5zPkFuIGluc3RhbmNlIG9mIHRoZSBvcGVyYXRpb24gaWYgZm91bmQsIG51bGwgaWYgbm90IGZvdW5kPC9yZXR1cm5zPlxyXG5cclxuICAgICAgICAgICAgdmFyIGZvdW5kID0gbnVsbDtcclxuICAgICAgICAgICAgc2VsZi5hbGwoKS5mb3JFYWNoKGZ1bmN0aW9uIChvcGVyYXRpb24pIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb24uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gb3BlcmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZm91bmQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5wZXJmb3JtID0gZnVuY3Rpb24gKG9wZXJhdGlvbikge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+UGVyZm9ybSBhbiBvcGVyYXRpb24gaW4gYSBnaXZlbiBjb250ZXh0PC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJjb250ZXh0XCIgdHlwZT1cIkJpZnJvc3QuaW50ZXJhY3Rpb24uT3BlcmF0aW9uQ29udGV4dFwiPkNvbnRleHQgaW4gd2hpY2ggdGhlIG9wZXJhdGlvbiBpcyBiZWluZyBwZXJmb3JtZWQgaW48L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJvcGVyYXRpb25cIiB0eXBlPVwiQmlmcm9zdC5pbnRlcmFjdGlvbi5PcGVyYXRpb25cIj5PcGVyYXRpb24gdG8gcGVyZm9ybTwvcGFyYW0+XHJcblxyXG4gICAgICAgICAgICBpZiAob3BlcmF0aW9uLmNhblBlcmZvcm0oKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gb3BlcmF0aW9uLnBlcmZvcm0oKTtcclxuICAgICAgICAgICAgICAgIHZhciBlbnRyeSA9IG9wZXJhdGlvbkVudHJ5RmFjdG9yeS5jcmVhdGUob3BlcmF0aW9uLCBzdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmFsbC5wdXNoKGVudHJ5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMudW5kbyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PlVuZG8gdGhlIGxhc3Qgb3BlcmF0aW9uIG9uIHRoZSBzdGFjayBhbmQgcmVtb3ZlIGl0IGFzIGFuIG9wZXJhdGlvbjwvc3VtbWFyeT5cclxuXHJcbiAgICAgICAgICAgIHRocm93IFwiTm90IGltcGxlbWVudGVkXCI7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5pbnRlcmFjdGlvblwiLCB7XHJcbiAgICBvcGVyYXRpb25zRmFjdG9yeTogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgb3BlcmF0aW9ucyA9IEJpZnJvc3QuaW50ZXJhY3Rpb24uT3BlcmF0aW9ucy5jcmVhdGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIG9wZXJhdGlvbnM7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLm9wZXJhdGlvbnNGYWN0b3J5ID0gQmlmcm9zdC5pbnRlcmFjdGlvbi5vcGVyYXRpb25zRmFjdG9yeTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW50ZXJhY3Rpb25cIiwge1xyXG4gICAgQ29tbWFuZE9wZXJhdGlvbjogQmlmcm9zdC5pbnRlcmFjdGlvbi5PcGVyYXRpb24uZXh0ZW5kKGZ1bmN0aW9uIChjb21tYW5kU2VjdXJpdHlTZXJ2aWNlKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYW4gb3BlcmF0aW9uIHRoYXQgcmVzdWx0IGluIGEgY29tbWFuZDwvc3VtbWFyeT5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImNvbW1hbmRUeXBlXCIgdHlwZT1cIkJpZnJvc3QuVHlwZVwiPlR5cGUgb2YgY29tbWFuZCB0byBjcmVhdGU8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuY29tbWFuZFR5cGUgPSBrby5vYnNlcnZhYmxlKCk7XHJcblxyXG4gICAgICAgIC8vIDxmaWVsZCBuYW1lPVwiaXNBdXRob3JpemFlZFwiIHR5cGU9XCJvYnNlcnZhYmxlXCI+SG9sZHMgYSBib29sZWFuOyB0cnVlIGlmIGF1dGhvcml6ZWQgLyBmYWxzZSBpZiBub3Q8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuaXNBdXRob3JpemVkID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcblxyXG4gICAgICAgIC8vIDxmaWVsZCBuYW1lPVwiY29tbWFuZENyZWF0ZWRcIiB0eXBlPVwiQmlmcm9zdC5FdmVudFwiPkV2ZW50IHRoYXQgZ2V0cyB0cmlnZ2VyZWQgd2hlbiBjb21tYW5kIGlzIGNyZWF0ZWQ8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuY29tbWFuZENyZWF0ZWQgPSBCaWZyb3N0LkV2ZW50LmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmNhblBlcmZvcm0ud2hlbih0aGlzLmlzQXV0aG9yaXplZCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tbWFuZFR5cGUuc3Vic2NyaWJlKGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNvbW1hbmRTZWN1cml0eVNlcnZpY2UuZ2V0Q29udGV4dEZvclR5cGUodHlwZSkuY29udGludWVXaXRoKGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoY29udGV4dCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmlzQXV0aG9yaXplZChjb250ZXh0LmlzQXV0aG9yaXplZCgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlQ29tbWFuZE9mVHlwZSA9IGZ1bmN0aW9uIChjb21tYW5kVHlwZSkge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+Q3JlYXRlIGFuIGluc3RhbmNlIG9mIGEgZ2l2ZW4gY29tbWFuZCB0eXBlPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBjb21tYW5kVHlwZS5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgcmVnaW9uOiBzZWxmLnJlZ2lvblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuY29tbWFuZENyZWF0ZWQudHJpZ2dlcihpbnN0YW5jZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5pbnRlcmFjdGlvblwiLCB7XHJcbiAgICBBY3Rpb246IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucGVyZm9ybSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmludGVyYWN0aW9uXCIsIHtcclxuICAgIFRyaWdnZXI6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5hY3Rpb25zID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQWN0aW9uID0gZnVuY3Rpb24gKGFjdGlvbikge1xyXG4gICAgICAgICAgICBzZWxmLmFjdGlvbnMucHVzaChhY3Rpb24pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zaWduYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYuYWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIGFjdGlvbi5wZXJmb3JtKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW50ZXJhY3Rpb25cIiwge1xyXG4gICAgRXZlbnRUcmlnZ2VyOiBCaWZyb3N0LmludGVyYWN0aW9uLlRyaWdnZXIuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuZXZlbnROYW1lID0gbnVsbDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGhyb3dJZkV2ZW50TmFtZUlzTm90U2V0KHRyaWdnZXIpIHtcclxuICAgICAgICAgICAgaWYgKCF0cmlnZ2VyLmV2ZW50TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJFdmVudE5hbWUgaXMgbm90IHNldCBmb3IgdHJpZ2dlclwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICB0aHJvd0lmRXZlbnROYW1lSXNOb3RTZXQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWN0dWFsRXZlbnROYW1lID0gXCJvblwiICsgc2VsZi5ldmVudE5hbWU7XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50W2FjdHVhbEV2ZW50TmFtZV0gPT0gbnVsbCB8fCB0eXBlb2YgZWxlbWVudFthY3R1YWxFdmVudE5hbWVdID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBvcmlnaW5hbEV2ZW50SGFuZGxlciA9IGVsZW1lbnRbYWN0dWFsRXZlbnROYW1lXTtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnRbYWN0dWFsRXZlbnROYW1lXSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9yaWdpbmFsRXZlbnRIYW5kbGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnRIYW5kbGVyKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zaWduYWwoKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5pbnRlcmFjdGlvblwiLCB7XHJcbiAgICBWaXN1YWxTdGF0ZTogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSB2aXN1YWwgc3RhdGUgb2YgYSBjb250cm9sIG9yIGVsZW1lbnQ8L3N1bW1hcnk+XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJuYW1lXCIgdHlwZT1cIlN0cmluZ1wiPk5hbWUgb2YgdGhlIHZpc3VhbCBzdGF0ZTwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5uYW1lID0gXCJcIjtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiYWN0aW9uc1wiIHR5cGU9XCJBcnJheVwiIGVsZW1lbnRUeXBlPVwiQmlmcm9zdC5pbnRlcmFjdGlvbi5WaXN1YWxTdGF0ZVRyYW5zaXRpb25BY3Rpb25cIj5UcmFuc2l0aW9uIGFjdGlvbnMgdGhhdCB3aWxsIGV4ZWN1dGUgd2hlbiB0cmFuc2l0aW9uaW5nPC9maWVsZD5cclxuICAgICAgICB0aGlzLmFjdGlvbnMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRBY3Rpb24gPSBmdW5jdGlvbiAoYWN0aW9uKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5BZGQgYWN0aW9uIHRvIHRoZSB2aXN1YWwgc3RhdGU8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cImFjdGlvblwiIHR5cGU9XCJCaWZyb3N0LmludGVyYWN0aW9uLlZpc3VhbFN0YXRlQWN0aW9uXCI+XHJcbiAgICAgICAgICAgIHNlbGYuYWN0aW9ucy5wdXNoKGFjdGlvbik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lbnRlciA9IGZ1bmN0aW9uIChuYW1pbmdSb290LCBkdXJhdGlvbikge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+RW50ZXIgdGhlIHN0YXRlIHdpdGggYSBnaXZlbiBkdXJhdGlvbjwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiZHVyYXRpb25cIiB0eXBlPVwiQmlmcm9zdC5UaW1lU3BhblwiPlRpbWUgdG8gc3BlbmQgZW50ZXJpbmcgdGhlIHN0YXRlPC9wYXJhbT5cclxuICAgICAgICAgICAgc2VsZi5hY3Rpb25zKCkuZm9yRWFjaChmdW5jdGlvbiAoYWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBhY3Rpb24ub25FbnRlcihuYW1pbmdSb290LCBkdXJhdGlvbik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZXhpdCA9IGZ1bmN0aW9uIChuYW1pbmdSb290LCBkdXJhdGlvbikge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+RXhpdCB0aGUgc3RhdGUgd2l0aCBhIGdpdmVuIGR1cmF0aW9uPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJkdXJhdGlvblwiIHR5cGU9XCJCaWZyb3N0LlRpbWVTcGFuXCI+VGltZSB0byBzcGVuZCBlbnRlcmluZyB0aGUgc3RhdGU8L3BhcmFtPlxyXG4gICAgICAgICAgICBzZWxmLmFjdGlvbnMoKS5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIGFjdGlvbi5vbkV4aXQobmFtaW5nUm9vdCwgZHVyYXRpb24pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmludGVyYWN0aW9uXCIsIHtcclxuICAgIFZpc3VhbFN0YXRlQWN0aW9uOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplID0gZnVuY3Rpb24gKG5hbWluZ1Jvb3QpIHtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vbkVudGVyID0gZnVuY3Rpb24gKG5hbWluZ1Jvb3QsIGR1cmF0aW9uKSB7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMub25FeGl0ID0gZnVuY3Rpb24gKG5hbWluZ1Jvb3QsIGR1cmF0aW9uKSB7XHJcblxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW50ZXJhY3Rpb25cIiwge1xyXG4gICAgVmlzdWFsU3RhdGVHcm91cDogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoZGlzcGF0Y2hlcikge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGEgZ3JvdXAgdGhhdCBob2xkcyB2aXN1YWwgc3RhdGVzPC9zdW1tYXJ5PlxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5kZWZhdWx0RHVyYXRpb24gPSBCaWZyb3N0LlRpbWVTcGFuLnplcm8oKTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiY3VycmVudFN0YXRlXCIgdHlwZT1cIkJpZnJvc3QuaW50ZXJhY3Rpb24uVmlzdWFsU3RhdGVcIj5Ib2xkcyB0aGUgY3VycmVudCBzdGF0ZSwgdGhpcyBpcyBhbiBvYnNlcnZhYmxlPC9maWVsZD5cclxuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IGtvLm9ic2VydmFibGUoe25hbWU6IFwibnVsbCBzdGF0ZVwiLCBlbnRlcjogZnVuY3Rpb24gKCkge30sIGV4aXQ6IGZ1bmN0aW9uICgpIHt9fSk7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cInN0YXRlc1wiIHR5cGU9XCJBcnJheVwiIGVsZW1lbnRUeXBlPVwiQmlmcm9zdC5pbnRlcmFjdGlvbi5WaXN1YWxTdGF0ZVwiPkhvbGRzIGFuIG9ic2VydmFibGUgYXJyYXkgb2YgdmlzdWFsIHN0YXRlczwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5zdGF0ZXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwidHJhbnNpdGlvbnNcIiB0eXBlPVwiQXJyYXlcIiBlbGVtZW50VHlwZT1cIkJpZnJvc3QuaW50ZXJhY3Rpb24uVmlzdWFsU3RhdGVUcmFuc2l0aW9uXCI+SG9sZHMgYW4gb2JzZXJ2YWJsZSBhcnJheSBvZiB2aXN1YWwgc3RhdGUgdHJhbnNpdGlvbnM8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMudHJhbnNpdGlvbnMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSkge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+QWRkIGEgc3RhdGUgdG8gdGhlIGdyb3VwPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJzdGF0ZVwiIHR5cGU9XCJCaWZyb3N0LmludGVyYWN0aW9uLlZpc3VhbFN0YXRlXCI+U3RhdGUgdG8gYWRkPC9wYXJhbT5cclxuICAgICAgICAgICAgaWYgKHNlbGYuaGFzU3RhdGUoc3RhdGUubmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwiVmlzdWFsU3RhdGUgd2l0aCBuYW1lIG9mICdcIiArIHN0YXRlLm5hbWUgKyBcIicgYWxyZWFkeSBleGlzdHNcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZWxmLnN0YXRlcy5wdXNoKHN0YXRlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmFkZFRyYW5zaXRpb24gPSBmdW5jdGlvbiAodHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+QWRkIHRyYW5zaXRpb24gdG8gZ3JvdXA8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cInRyYW5zaXRpb25cIiB0eXBlPVwiQmlmcm9zdC5pbnRlcmFjdGlvbi5WaXN1YWxTdGF0ZVRyYW5zaXRpb25cIj5UcmFuc2l0aW9uIHRvIGFkZDwvcGFyYW0+XHJcbiAgICAgICAgICAgIHNlbGYudHJhbnNpdGlvbnMucHVzaCh0cmFuc2l0aW9uKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmhhc1N0YXRlID0gZnVuY3Rpb24gKHN0YXRlTmFtZSkge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+Q2hlY2sgaWYgZ3JvdXAgaGFzIHN0YXRlIGJ5IHRoZSBuYW1lIG9mIHRoZSBzdGF0ZTwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwic3RhdGVOYW1lXCIgdHlwZT1cIlN0cmluZ1wiPk5hbWUgb2YgdGhlIHN0YXRlIHRvIGNoZWNrIGZvcjwvcGFyYW0+XHJcbiAgICAgICAgICAgIC8vLyA8cmV0dXJucyB0eXBlPVwiQm9vbGVhblwiPlRydWUgaWYgdGhlIHN0YXRlIGV4aXN0cywgZmFsc2UgaWYgbm90PC9yZXR1cm5zPlxyXG4gICAgICAgICAgICB2YXIgaGFzU3RhdGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgc2VsZi5zdGF0ZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlLm5hbWUgPT09IHN0YXRlTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhhc1N0YXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGhhc1N0YXRlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0U3RhdGVCeU5hbWUgPSBmdW5jdGlvbiAoc3RhdGVOYW1lKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5HZXRzIGEgc3RhdGUgYnkgaXRzIG5hbWU8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cInN0YXRlTmFtZVwiIHR5cGU9XCJTdHJpbmdcIj5OYW1lIG9mIHRoZSBzdGF0ZSB0byBnZXQ8L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHJldHVybnMgdHlwZT1cIkJpZnJvc3QuaW50ZXJhY3Rpb24uVmlzdWFsU3RhdGVcIj5TdGF0ZSBmb3VuZCBvciBudWxsIGlmIGl0IGRvZXMgbm90IGhhdmUgYSBzdGF0ZSBieSB0aGUgZ2l2ZW4gbmFtZTwvcmV0dXJucz5cclxuICAgICAgICAgICAgdmFyIHN0YXRlRm91bmQgPSBudWxsO1xyXG4gICAgICAgICAgICBzZWxmLnN0YXRlcygpLmZvckVhY2goZnVuY3Rpb24gKHN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUubmFtZSA9PT0gc3RhdGVOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVGb3VuZCA9IHN0YXRlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZUZvdW5kO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ29UbyA9IGZ1bmN0aW9uIChuYW1pbmdSb290LCBzdGF0ZU5hbWUpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkdvIHRvIGEgc3BlY2lmaWMgc3RhdGUgYnkgdGhlIG5hbWUgb2YgdGhlIHN0YXRlPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJzdGF0ZU5hbWVcIiB0eXBlPVwiU3RyaW5nXCI+TmFtZSBvZiB0aGUgc3RhdGUgdG8gZ28gdG88L3BhcmFtPlxyXG4gICAgICAgICAgICB2YXIgY3VycmVudFN0YXRlID0gc2VsZi5jdXJyZW50U3RhdGUoKTtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGN1cnJlbnRTdGF0ZSkgJiYgY3VycmVudFN0YXRlLm5hbWUgPT09IHN0YXRlTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgc3RhdGUgPSBzZWxmLmdldFN0YXRlQnlOYW1lKHN0YXRlTmFtZSk7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChzdGF0ZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkdXJhdGlvbiA9IHNlbGYuZGVmYXVsdER1cmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGN1cnJlbnRTdGF0ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3RhdGUuZXhpdChuYW1pbmdSb290LCBkdXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5lbnRlcihuYW1pbmdSb290LCBkdXJhdGlvbik7XHJcblxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hlci5zY2hlZHVsZShkdXJhdGlvbi50b3RhbE1pbGxpc2Vjb25kcygpLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jdXJyZW50U3RhdGUoc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmludGVyYWN0aW9uXCIsIHtcclxuICAgIFZpc3VhbFN0YXRlTWFuYWdlcjogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSBzdGF0ZSBtYW5hZ2VyIGZvciBkZWFsaW5nIHdpdGggdmlzdWFsIHN0YXRlcywgdHlwaWNhbGx5IHJlbGF0ZWQgdG8gYSBjb250cm9sIG9yIG90aGVyIGVsZW1lbnQgb24gYSBwYWdlPC9zdW1tYXJ5PlxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwibmFtaW5nUm9vdFwiIHR5cGU9XCJCaWZyb3N0LnZpZXdzLk5hbWluZ1Jvb3RcIj5BIHJvb3QgZm9yIG5hbWVkIG9iamVjdHM8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMubmFtaW5nUm9vdCA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImdyb3Vwc1wiIHR5cGU9XCJBcnJheVwiIGVsZW1lbnRUeXBlPVwiQmlmcm9zdC5pbnRlcmFjdGlvbi5WaXN1YWxTdGF0ZUdyb3VwXCI+SG9sZHMgYWxsIGdyb3VwcyBpbiB0aGUgc3RhdGUgbWFuYWdlcjwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5ncm91cHMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRHcm91cCA9IGZ1bmN0aW9uIChncm91cCkge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+QWRkcyBhIFZpc3VhbFN0YXRlR3JvdXAgdG8gdGhlIG1hbmFnZXI8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cImdyb3VwXCIgdHlwZT1cIkJpZnJvc3QuaW50ZXJhY3Rpb24uVmlzdWFsU3RhdGVHcm91cFwiPkdyb3VwIHRvIGFkZDwvcGFyYW0+XHJcbiAgICAgICAgICAgIHNlbGYuZ3JvdXBzLnB1c2goZ3JvdXApO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ29UbyA9IGZ1bmN0aW9uIChzdGF0ZU5hbWUpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkdvIHRvIGEgc3BlY2lmaWMgc3RhdGUgYnkgaXRzIG5hbWU8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cInN0YXRlTmFtZVwiIHR5cGU9XCJTdHJpbmdcIj5OYW1lIG9mIHN0YXRlIHRvIGdvIHRvPC9wYXJhbT5cclxuICAgICAgICAgICAgc2VsZi5ncm91cHMoKS5mb3JFYWNoKGZ1bmN0aW9uIChncm91cCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwLmhhc1N0YXRlKHN0YXRlTmFtZSkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBncm91cC5nb1RvKHNlbGYubmFtaW5nUm9vdCwgc3RhdGVOYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5pbnRlcmFjdGlvblwiLCB7XHJcbiAgICBWaXN1YWxTdGF0ZVRyYW5zaXRpb246IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSBkZXNjcmlwdGlvbiBvZiB0cmFuc2l0aW9uIGJldHdlZW4gdHdvIG5hbWVkIHN0YXRlczwvc3VtbWFyeT5cclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiZnJvbVwiIHR5cGU9XCJTdHJpbmdcIj5OYW1lIG9mIHZpc3VhbCBzdGF0ZSB0aGF0IHdlIGFyZSBkZXNjcmliaW5nIHRyYW5zaXRpb25pbmcgZnJvbTwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5mcm9tID0gXCJcIjtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwidG9cIiB0eXBlPVwiU3RyaW5nXCI+TmFtZSBvZiB2aXN1YWwgc3RhdGUgdGhhdCB3ZSBhcmUgZGVzY3JpYmluZyB0cmFuc2l0aW9uaW5nIHRvPC9maWVsZD5cclxuICAgICAgICB0aGlzLnRvID0gXCJcIjtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiZHVyYXRpb25cIiB0eXBlPVwiQmlmcm9zdC5UaW1lU3RhbXBcIj5EdXJhdGlvbiBmb3IgdGhlIHRyYW5zaXRpb248L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuZHVyYXRpb24gPSBCaWZyb3N0LlRpbWVTdGFtcC56ZXJvKCk7XHJcbiAgICB9KVxyXG59KTsiLCJ2YXIgZ2xvYmFsSWQgPSAwO1xyXG5CaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW50ZXJhY3Rpb24udmlzdWFsU3RhdGVBY3Rpb25zXCIsIHtcclxuICAgIE9wYWNpdHk6IEJpZnJvc3QuaW50ZXJhY3Rpb24uVmlzdWFsU3RhdGVBY3Rpb24uZXh0ZW5kKGZ1bmN0aW9uIChkb2N1bWVudFNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgIHZhciBpZCA9IGRvY3VtZW50U2VydmljZS5nZXRVbmlxdWVTdHlsZU5hbWUoXCJvcGFjaXR5XCIpO1xyXG5cclxuICAgICAgICB0aGlzLnRhcmdldCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IFwiXCI7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemUgPSBmdW5jdGlvbiAobmFtaW5nUm9vdCkge1xyXG4gICAgICAgICAgICBlbGVtZW50ID0gbmFtaW5nUm9vdC5maW5kKHNlbGYudGFyZ2V0KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9uRW50ZXIgPSBmdW5jdGlvbiAobmFtaW5nUm9vdCwgZHVyYXRpb24pIHtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gcGFyc2VGbG9hdChzZWxmLnZhbHVlKTtcclxuICAgICAgICAgICAgaWYgKGlzTmFOKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSAwLjA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBhY3R1YWxEdXJhdGlvbiA9IGR1cmF0aW9uLnRvdGFsTWlsbGlzZWNvbmRzKCkgLyAxMDAwO1xyXG5cclxuICAgICAgICAgICAgZG9jdW1lbnRTZXJ2aWNlLmFkZFN0eWxlKFwiLlwiICsgaWQsIHtcclxuICAgICAgICAgICAgICAgIFwiLXdlYmtpdC10cmFuc2l0aW9uXCI6IFwib3BhY2l0eSBcIiArIGFjdHVhbER1cmF0aW9uICsgXCJzIGVhc2UtaW4tb3V0XCIsXHJcbiAgICAgICAgICAgICAgICBcIi1tb3otdHJhbnNpdGlvblwiOiBcIm9wYWNpdHkgXCIgKyBhY3R1YWxEdXJhdGlvbiArIFwicyBlYXNlLWluLW91dFwiLFxyXG4gICAgICAgICAgICAgICAgXCItbXMtdHJhbnNpdGlvblwiOiBcIm9wYWNpdHkgXCIgKyBhY3R1YWxEdXJhdGlvbiArIFwicyBlYXNlLWluLW91dFwiLFxyXG4gICAgICAgICAgICAgICAgXCItby10cmFuc2l0aW9uXCI6IFwib3BhY2l0eSBcIiArIGFjdHVhbER1cmF0aW9uICsgXCJzIGVhc2UtaW4tb3V0XCIsXHJcbiAgICAgICAgICAgICAgICBcInRyYW5zaXRpb25cIjogXCJvcGFjaXR5IFwiICsgYWN0dWFsRHVyYXRpb24gKyBcInMgZWFzZS1pbi1vdXRcIixcclxuICAgICAgICAgICAgICAgIFwib3BhY2l0eVwiOiB2YWx1ZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChpZCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vbkV4aXQgPSBmdW5jdGlvbiAobmFtaW5nUm9vdCwgZHVyYXRpb24pIHtcclxuICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGlkKTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcHBpbmdcIiwge1xyXG4gICAgTWlzc2luZ1Byb3BlcnR5U3RyYXRlZ3k6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXBwaW5nXCIsIHtcclxuICAgIFByb3BlcnR5TWFwOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uIChzb3VyY2VQcm9wZXJ0eSwgdHlwZUNvbnZlcnRlcnMpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuc3RyYXRlZ3kgPSBudWxsO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lmTWlzc2luZ1Byb3BlcnR5U3RyYXRlZ3koKSB7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHNlbGYuc3RyYXRlZ3kpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBCaWZyb3N0Lm1hcHBpbmcuTWlzc2luZ1Byb3BlcnR5U3RyYXRlZ3kuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudG8gPSBmdW5jdGlvbiAodGFyZ2V0UHJvcGVydHkpIHtcclxuICAgICAgICAgICAgc2VsZi5zdHJhdGVneSA9IGZ1bmN0aW9uIChzb3VyY2UsIHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0ga28udW53cmFwKHNvdXJjZVtzb3VyY2VQcm9wZXJ0eV0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldFZhbHVlID0ga28udW53cmFwKHRhcmdldFt0YXJnZXRQcm9wZXJ0eV0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0eXBlQXNTdHJpbmcgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh0YXJnZXRWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmNvbnN0cnVjdG9yICE9PSB0YXJnZXRWYWx1ZS5jb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZUFzU3RyaW5nID0gdGFyZ2V0VmFsdWUuY29uc3RydWN0b3IubmFtZS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodGFyZ2V0W3RhcmdldFByb3BlcnR5XS5fdHlwZUFzU3RyaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZUFzU3RyaW5nID0gdGFyZ2V0W3RhcmdldFByb3BlcnR5XS5fdHlwZUFzU3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodHlwZUFzU3RyaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHR5cGVDb252ZXJ0ZXJzLmNvbnZlcnRGcm9tKHZhbHVlLnRvU3RyaW5nKCksIHR5cGVBc1N0cmluZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChrby5pc09ic2VydmFibGUodGFyZ2V0W3RhcmdldFByb3BlcnR5XSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRbdGFyZ2V0UHJvcGVydHldKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W3RhcmdldFByb3BlcnR5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMubWFwID0gZnVuY3Rpb24gKHNvdXJjZSwgdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRocm93SWZNaXNzaW5nUHJvcGVydHlTdHJhdGVneSgpO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5zdHJhdGVneShzb3VyY2UsIHRhcmdldCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXBwaW5nXCIsIHtcclxuICAgIE1hcDogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgcHJvcGVydGllcyA9IHt9O1xyXG5cclxuICAgICAgICB0aGlzLnNvdXJjZVR5cGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0VHlwZSA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuc291cmNlID0gZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgICAgICAgICAgc2VsZi5zb3VyY2VUeXBlID0gdHlwZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnRhcmdldCA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgIHNlbGYudGFyZ2V0VHlwZSA9IHR5cGU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0eSA9IGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydHlNYXAgPSBCaWZyb3N0Lm1hcHBpbmcuUHJvcGVydHlNYXAuY3JlYXRlKHsgc291cmNlUHJvcGVydHk6IHByb3BlcnR5IH0pO1xyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzW3Byb3BlcnR5XSA9IHByb3BlcnR5TWFwO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvcGVydHlNYXA7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jYW5NYXBQcm9wZXJ0eSA9IGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXBQcm9wZXJ0eSA9IGZ1bmN0aW9uIChwcm9wZXJ0eSwgc291cmNlLCB0YXJnZXQpIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuY2FuTWFwUHJvcGVydHkocHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzW3Byb3BlcnR5XS5tYXAoc291cmNlLCB0YXJnZXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXBwaW5nXCIsIHtcclxuICAgIG1hcHM6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG1hcHMgPSB7fTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0S2V5RnJvbShzb3VyY2VUeXBlLCB0YXJnZXRUeXBlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2VUeXBlLl90eXBlSWQgKyBcIiAtIFwiICsgdGFyZ2V0VHlwZS5fdHlwZUlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGV4dGVuZGVycyA9IEJpZnJvc3QubWFwcGluZy5NYXAuZ2V0RXh0ZW5kZXJzKCk7XHJcblxyXG4gICAgICAgIGV4dGVuZGVycy5mb3JFYWNoKGZ1bmN0aW9uIChleHRlbmRlcikge1xyXG4gICAgICAgICAgICB2YXIgbWFwID0gZXh0ZW5kZXIuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBnZXRLZXlGcm9tKG1hcC5zb3VyY2VUeXBlLCBtYXAudGFyZ2V0VHlwZSk7XHJcbiAgICAgICAgICAgIG1hcHNba2V5XSA9IG1hcDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5oYXNNYXBGb3IgPSBmdW5jdGlvbiAoc291cmNlVHlwZSwgdGFyZ2V0VHlwZSkge1xyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChzb3VyY2VUeXBlKSB8fCBCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHRhcmdldFR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGtleSA9IGdldEtleUZyb20oc291cmNlVHlwZSwgdGFyZ2V0VHlwZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBtYXBzLmhhc093blByb3BlcnR5KGtleSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRNYXBGb3IgPSBmdW5jdGlvbiAoc291cmNlVHlwZSwgdGFyZ2V0VHlwZSkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5oYXNNYXBGb3Ioc291cmNlVHlwZSwgdGFyZ2V0VHlwZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBnZXRLZXlGcm9tKHNvdXJjZVR5cGUsIHRhcmdldFR5cGUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hcHNba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFwcGluZ1wiLCB7XHJcbiAgICBtYXBwZXI6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKHR5cGVDb252ZXJ0ZXJzLCBtYXBzKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRUeXBlQXNTdHJpbmcodG8sIHByb3BlcnR5LCB2YWx1ZSwgdG9WYWx1ZSkge1xyXG4gICAgICAgICAgICB2YXIgdHlwZUFzU3RyaW5nID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHZhbHVlKSAmJlxyXG4gICAgICAgICAgICAgICAgIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodG9WYWx1ZSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUuY29uc3RydWN0b3IgIT09IHRvVmFsdWUuY29uc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlQXNTdHJpbmcgPSB0b1ZhbHVlLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkubWF0Y2goL2Z1bmN0aW9uXFwwNDArKFxcdyopLylbMV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh0b1twcm9wZXJ0eV0pICYmXHJcbiAgICAgICAgICAgICAgICAhQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh0b1twcm9wZXJ0eV0uX3R5cGVBc1N0cmluZykpIHtcclxuICAgICAgICAgICAgICAgIHR5cGVBc1N0cmluZyA9IHRvW3Byb3BlcnR5XS5fdHlwZUFzU3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0eXBlQXNTdHJpbmc7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNvcHlQcm9wZXJ0aWVzKG1hcHBlZFByb3BlcnRpZXMsIGZyb20sIHRvLCBtYXApIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZnJvbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5LmluZGV4T2YoXCJfXCIpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzVW5kZWZpbmVkKGZyb21bcHJvcGVydHldKSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC5pc09iamVjdChmcm9tW3Byb3BlcnR5XSkgJiYgQmlmcm9zdC5pc09iamVjdCh0b1twcm9wZXJ0eV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvcHlQcm9wZXJ0aWVzKG1hcHBlZFByb3BlcnRpZXMsIGZyb21bcHJvcGVydHldLCB0b1twcm9wZXJ0eV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChtYXApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwLmNhbk1hcFByb3BlcnR5KHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcC5tYXBQcm9wZXJ0eShwcm9wZXJ0eSwgZnJvbSwgdG8pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwcGVkUHJvcGVydGllcy5pbmRleE9mKHByb3BlcnR5KSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwcGVkUHJvcGVydGllcy5wdXNoKHByb3BlcnR5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNVbmRlZmluZWQodG9bcHJvcGVydHldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0ga28udW53cmFwKGZyb21bcHJvcGVydHldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b1ZhbHVlID0ga28udW53cmFwKHRvW3Byb3BlcnR5XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGVBc1N0cmluZyA9IGdldFR5cGVBc1N0cmluZyh0bywgcHJvcGVydHksIHZhbHVlLCB0b1ZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodHlwZUFzU3RyaW5nKSAmJiAhQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHR5cGVDb252ZXJ0ZXJzLmNvbnZlcnRGcm9tKHZhbHVlLnRvU3RyaW5nKCksIHR5cGVBc1N0cmluZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hcHBlZFByb3BlcnRpZXMuaW5kZXhPZihwcm9wZXJ0eSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwcGVkUHJvcGVydGllcy5wdXNoKHByb3BlcnR5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZSh0b1twcm9wZXJ0eV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFrby5pc1dyaXRlYWJsZU9ic2VydmFibGUodG9bcHJvcGVydHldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvW3Byb3BlcnR5XSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvW3Byb3BlcnR5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBtYXBTaW5nbGVJbnN0YW5jZSh0eXBlLCBkYXRhLCBtYXBwZWRQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoZGF0YS5fc291cmNlVHlwZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gZXZhbChkYXRhLl9zb3VyY2VUeXBlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gdHlwZS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWFwID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmIChtYXBzLmhhc01hcEZvcihkYXRhLl90eXBlLCB0eXBlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcCA9IG1hcHMuZ2V0TWFwRm9yKGRhdGEuX3R5cGUsIHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvcHlQcm9wZXJ0aWVzKG1hcHBlZFByb3BlcnRpZXMsIGRhdGEsIGluc3RhbmNlLCBtYXApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG1hcE11bHRpcGxlSW5zdGFuY2VzKHR5cGUsIGRhdGEsIG1hcHBlZFByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgdmFyIG1hcHBlZEluc3RhbmNlcyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBzaW5nbGVEYXRhID0gZGF0YVtpXTtcclxuICAgICAgICAgICAgICAgIG1hcHBlZEluc3RhbmNlcy5wdXNoKG1hcFNpbmdsZUluc3RhbmNlKHR5cGUsIHNpbmdsZURhdGEsIG1hcHBlZFByb3BlcnRpZXMpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbWFwcGVkSW5zdGFuY2VzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5tYXAgPSBmdW5jdGlvbiAodHlwZSwgZGF0YSkge1xyXG4gICAgICAgICAgICB2YXIgbWFwcGVkUHJvcGVydGllcyA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc0FycmF5KGRhdGEpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFwTXVsdGlwbGVJbnN0YW5jZXModHlwZSwgZGF0YSwgbWFwcGVkUHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFwU2luZ2xlSW5zdGFuY2UodHlwZSwgZGF0YSwgbWFwcGVkUHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm1hcFRvSW5zdGFuY2UgPSBmdW5jdGlvbiAodGFyZ2V0VHlwZSwgZGF0YSwgdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHZhciBtYXBwZWRQcm9wZXJ0aWVzID0gW107XHJcblxyXG4gICAgICAgICAgICB2YXIgbWFwID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKG1hcHMuaGFzTWFwRm9yKGRhdGEuX3R5cGUsIHRhcmdldFR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICBtYXAgPSBtYXBzLmdldE1hcEZvcihkYXRhLl90eXBlLCB0YXJnZXRUeXBlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb3B5UHJvcGVydGllcyhtYXBwZWRQcm9wZXJ0aWVzLCBkYXRhLCB0YXJnZXQsIG1hcCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbWFwcGVkUHJvcGVydGllcztcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIudHlwZXMubWFwcGVyID0gQmlmcm9zdC5tYXBwaW5nLm1hcHBlcjsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QucmVhZFwiLCB7XHJcbiAgICByZWFkTW9kZWxTeXN0ZW1FdmVudHM6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLm5vSW5zdGFuY2UgPSBCaWZyb3N0LkV2ZW50LmNyZWF0ZSgpO1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnJlYWRcIiwge1xyXG4gICAgUGFnaW5nSW5mbzogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoc2l6ZSwgbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcclxuICAgICAgICB0aGlzLm51bWJlciA9IG51bWJlcjtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5yZWFkXCIsIHtcclxuICAgIFF1ZXJ5YWJsZTogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAocXVlcnksIHF1ZXJ5U2VydmljZSwgcmVnaW9uLCB0YXJnZXRPYnNlcnZhYmxlKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmNhbkV4ZWN1dGUgPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldE9ic2VydmFibGU7XHJcbiAgICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5O1xyXG4gICAgICAgIHRoaXMucXVlcnlTZXJ2aWNlID0gcXVlcnlTZXJ2aWNlO1xyXG4gICAgICAgIHRoaXMucGFnZVNpemUgPSBrby5vYnNlcnZhYmxlKDApO1xyXG4gICAgICAgIHRoaXMucGFnZU51bWJlciA9IGtvLm9ic2VydmFibGUoMCk7XHJcbiAgICAgICAgdGhpcy50b3RhbEl0ZW1zID0ga28ub2JzZXJ2YWJsZSgwKTtcclxuICAgICAgICB0aGlzLmNvbXBsZXRlZENhbGxiYWNrcyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLnBhZ2VTaXplLnN1YnNjcmliZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmNhbkV4ZWN1dGUpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuZXhlY3V0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucGFnZU51bWJlci5zdWJzY3JpYmUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5jYW5FeGVjdXRlKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmV4ZWN1dGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBvYnNlcnZlUHJvcGVydGllc0Zyb20ocXVlcnkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHlOYW1lIGluIHF1ZXJ5KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHkgPSBxdWVyeVtwcm9wZXJ0eU5hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZShwcm9wZXJ0eSkgPT09IHRydWUgJiYgcXVlcnkuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSAmJiBwcm9wZXJ0eU5hbWUgIT09IFwiYXJlQWxsUGFyYW1ldGVyc1NldFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkuc3Vic2NyaWJlKHNlbGYuZXhlY3V0ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY29tcGxldGVkID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHNlbGYuY29tcGxldGVkQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9uQ29tcGxldGVkID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgc2VsZi5jb21wbGV0ZWRDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmV4ZWN1dGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnF1ZXJ5LmFyZUFsbFBhcmFtZXRlcnNTZXQoKSAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogRGlhZ25vc3RpY3MgLSB3YXJuaW5nXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi50YXJnZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2VsZi5xdWVyeS5fcHJldmlvdXNBcmVBbGxQYXJhbWV0ZXJzU2V0ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwYWdpbmcgPSBCaWZyb3N0LnJlYWQuUGFnaW5nSW5mby5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgc2l6ZTogc2VsZi5wYWdlU2l6ZSgpLFxyXG4gICAgICAgICAgICAgICAgbnVtYmVyOiBzZWxmLnBhZ2VOdW1iZXIoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc2VsZi5xdWVyeVNlcnZpY2UuZXhlY3V0ZShxdWVyeSwgcGFnaW5nKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHJlc3VsdCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnRvdGFsSXRlbXMocmVzdWx0LnRvdGFsSXRlbXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudGFyZ2V0KHJlc3VsdC5pdGVtcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5vbkNvbXBsZXRlZChyZXN1bHQuaXRlbXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnRhcmdldDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNldFBhZ2VJbmZvID0gZnVuY3Rpb24gKHBhZ2VTaXplLCBwYWdlTnVtYmVyKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFnZVNpemUgPT09IHNlbGYucGFnZVNpemUoKSAmJiBwYWdlTnVtYmVyID09PSBzZWxmLnBhZ2VOdW1iZXIoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLmNhbkV4ZWN1dGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgc2VsZi5wYWdlU2l6ZShwYWdlU2l6ZSk7XHJcbiAgICAgICAgICAgIHNlbGYucGFnZU51bWJlcihwYWdlTnVtYmVyKTtcclxuICAgICAgICAgICAgc2VsZi5jYW5FeGVjdXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgc2VsZi5leGVjdXRlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgb2JzZXJ2ZVByb3BlcnRpZXNGcm9tKHNlbGYucXVlcnkpO1xyXG5cclxuICAgICAgICBpZiAoc2VsZi5xdWVyeS5hcmVBbGxQYXJhbWV0ZXJzU2V0KCkpIHtcclxuICAgICAgICAgICAgc2VsZi5leGVjdXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LnJlYWQuUXVlcnlhYmxlLm5ldyA9IGZ1bmN0aW9uIChvcHRpb25zLCByZWdpb24pIHtcclxuICAgIHZhciBvYnNlcnZhYmxlID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICBvcHRpb25zLnRhcmdldE9ic2VydmFibGUgPSBvYnNlcnZhYmxlO1xyXG4gICAgb3B0aW9ucy5yZWdpb24gPSByZWdpb247XHJcbiAgICB2YXIgcXVlcnlhYmxlID0gQmlmcm9zdC5yZWFkLlF1ZXJ5YWJsZS5jcmVhdGUob3B0aW9ucyk7XHJcbiAgICBCaWZyb3N0LmV4dGVuZChvYnNlcnZhYmxlLCBxdWVyeWFibGUpO1xyXG4gICAgb2JzZXJ2YWJsZS5pc1F1ZXJ5YWJsZSA9IHRydWU7XHJcbiAgICByZXR1cm4gb2JzZXJ2YWJsZTtcclxufTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QucmVhZFwiLCB7XHJcbiAgICBxdWVyeWFibGVGYWN0b3J5OiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAocXVlcnksIHJlZ2lvbikge1xyXG4gICAgICAgICAgICB2YXIgcXVlcnlhYmxlID0gQmlmcm9zdC5yZWFkLlF1ZXJ5YWJsZS5uZXcoe1xyXG4gICAgICAgICAgICAgICAgcXVlcnk6IHF1ZXJ5XHJcbiAgICAgICAgICAgIH0sIHJlZ2lvbik7XHJcbiAgICAgICAgICAgIHJldHVybiBxdWVyeWFibGU7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLnF1ZXJ5YWJsZUZhY3RvcnkgPSBCaWZyb3N0LmludGVyYWN0aW9uLnF1ZXJ5YWJsZUZhY3Rvcnk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnJlYWRcIiwge1xyXG4gICAgUXVlcnk6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKHF1ZXJ5YWJsZUZhY3RvcnksIHJlZ2lvbikge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnRhcmdldCA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuX25hbWUgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuX2dlbmVyYXRlZEZyb20gPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuX3JlYWRNb2RlbCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5yZWdpb24gPSByZWdpb247XHJcblxyXG4gICAgICAgIHRoaXMuYXJlQWxsUGFyYW1ldGVyc1NldCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuaGFzUmVhZE1vZGVsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHNlbGYudGFyZ2V0Ll9yZWFkTW9kZWwgIT09IFwidW5kZWZpbmVkXCIgJiYgc2VsZi50YXJnZXQuX3JlYWRNb2RlbCAhPSBudWxsO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2V0UGFyYW1ldGVycyA9IGZ1bmN0aW9uIChwYXJhbWV0ZXJzKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBwYXJhbWV0ZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYudGFyZ2V0Lmhhc093blByb3BlcnR5KHByb3BlcnR5KSAmJiBrby5pc09ic2VydmFibGUoc2VsZi50YXJnZXRbcHJvcGVydHldKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnRhcmdldFtwcm9wZXJ0eV0ocGFyYW1ldGVyc1twcm9wZXJ0eV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaChleCkge31cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldFBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJhbWV0ZXJzID0ge307XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBzZWxmLnRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZShzZWxmLnRhcmdldFtwcm9wZXJ0eV0pICYmXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkgIT09IFwiYXJlQWxsUGFyYW1ldGVyc1NldFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyc1twcm9wZXJ0eV0gPSBzZWxmLnRhcmdldFtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwYXJhbWV0ZXJzO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0UGFyYW1ldGVyVmFsdWVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcGFyYW1ldGVyVmFsdWVzID0ge307XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwYXJhbWV0ZXJzID0gc2VsZi5nZXRQYXJhbWV0ZXJzKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHBhcmFtZXRlcnMpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gcGFyYW1ldGVyc1twcm9wZXJ0eV0oKTtcclxuICAgICAgICAgICAgICAgIGlmIChrby5pc09ic2VydmFibGUodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyVmFsdWVzW3Byb3BlcnR5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcGFyYW1ldGVyVmFsdWVzO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuYWxsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcXVlcnlhYmxlID0gcXVlcnlhYmxlRmFjdG9yeS5jcmVhdGUoc2VsZi50YXJnZXQsIHJlZ2lvbik7XHJcbiAgICAgICAgICAgIHJldHVybiBxdWVyeWFibGU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5wYWdlZCA9IGZ1bmN0aW9uIChwYWdlU2l6ZSwgcGFnZU51bWJlcikge1xyXG4gICAgICAgICAgICB2YXIgcXVlcnlhYmxlID0gcXVlcnlhYmxlRmFjdG9yeS5jcmVhdGUoc2VsZi50YXJnZXQsIHJlZ2lvbik7XHJcbiAgICAgICAgICAgIHF1ZXJ5YWJsZS5zZXRQYWdlSW5mbyhwYWdlU2l6ZSwgcGFnZU51bWJlcik7XHJcbiAgICAgICAgICAgIHJldHVybiBxdWVyeWFibGU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vbkNyZWF0ZWQgPSBmdW5jdGlvbiAocXVlcnkpIHtcclxuICAgICAgICAgICAgc2VsZi50YXJnZXQgPSBxdWVyeTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHNlbGYudGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoa28uaXNPYnNlcnZhYmxlKHNlbGYudGFyZ2V0W3Byb3BlcnR5XSkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnRhcmdldFtwcm9wZXJ0eV0uZXh0ZW5kKHsgbGlua2VkOiB7fSB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5hcmVBbGxQYXJhbWV0ZXJzU2V0ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGlzU2V0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHZhciBoYXNQYXJhbWV0ZXJzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBzZWxmLnRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChrby5pc09ic2VydmFibGUoc2VsZi50YXJnZXRbcHJvcGVydHldKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNQYXJhbWV0ZXJzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0ga28udW53cmFwKHNlbGYudGFyZ2V0W3Byb3BlcnR5XSgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCB2YWx1ZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNTZXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGhhc1BhcmFtZXRlcnMgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXNTZXQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QucmVhZFwiLCB7XHJcbiAgICBSZWFkTW9kZWw6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgYWN0dWFsUmVhZE1vZGVsID0gdGhpcztcclxuXHJcblxyXG4gICAgICAgIHRoaXMuY29weVRvID0gZnVuY3Rpb24gKHRhcmdldCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBhY3R1YWxSZWFkTW9kZWwpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhY3R1YWxSZWFkTW9kZWwuaGFzT3duUHJvcGVydHkocHJvcGVydHkpICYmIHByb3BlcnR5LmluZGV4T2YoXCJfXCIpICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShhY3R1YWxSZWFkTW9kZWxbcHJvcGVydHldKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRhcmdldC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BlcnR5XSA9IGtvLm9ic2VydmFibGUodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrby5pc09ic2VydmFibGUodGFyZ2V0W3Byb3BlcnR5XSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFtwcm9wZXJ0eV0odmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BlcnR5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vbkNyZWF0ZWQgPSBmdW5jdGlvbiAobGFzdERlc2NlbmRhbnQpIHtcclxuICAgICAgICAgICAgYWN0dWFsUmVhZE1vZGVsID0gbGFzdERlc2NlbmRhbnQ7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5yZWFkXCIsIHtcclxuICAgIFJlYWRNb2RlbE9mOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uIChyZWdpb24sIG1hcHBlciwgdGFza0ZhY3RvcnksIHJlYWRNb2RlbFN5c3RlbUV2ZW50cykge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnRhcmdldCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuX25hbWUgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuX2dlbmVyYXRlZEZyb20gPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuX3JlYWRNb2RlbFR5cGUgPSBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHsgfSk7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZSA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICB0aGlzLmNvbW1hbmRUb1BvcHVsYXRlID0gbnVsbDtcclxuICAgICAgICB0aGlzLnJlZ2lvbiA9IHJlZ2lvbjtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdW53cmFwUHJvcGVydHlGaWx0ZXJzKHByb3BlcnR5RmlsdGVycykge1xyXG4gICAgICAgICAgICB2YXIgdW53cmFwcGVkUHJvcGVydHlGaWx0ZXJzID0ge307XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHByb3BlcnR5RmlsdGVycykge1xyXG4gICAgICAgICAgICAgICAgdW53cmFwcGVkUHJvcGVydHlGaWx0ZXJzW3Byb3BlcnR5XSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUocHJvcGVydHlGaWx0ZXJzW3Byb3BlcnR5XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHVud3JhcHBlZFByb3BlcnR5RmlsdGVycztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBlcmZvcm1Mb2FkKHRhcmdldCwgcHJvcGVydHlGaWx0ZXJzKSB7XHJcbiAgICAgICAgICAgIHZhciB0YXNrID0gdGFza0ZhY3RvcnkuY3JlYXRlUmVhZE1vZGVsKHRhcmdldCwgcHJvcGVydHlGaWx0ZXJzKTtcclxuICAgICAgICAgICAgdGFyZ2V0LnJlZ2lvbi50YXNrcy5leGVjdXRlKHRhc2spLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGRhdGEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hcHBlZFJlYWRNb2RlbCA9IG1hcHBlci5tYXAodGFyZ2V0Ll9yZWFkTW9kZWxUeXBlLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmluc3RhbmNlKG1hcHBlZFJlYWRNb2RlbCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYWRNb2RlbFN5c3RlbUV2ZW50cy5ub0luc3RhbmNlLnRyaWdnZXIodGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmluc3RhbmNlTWF0Y2hpbmcgPSBmdW5jdGlvbiAocHJvcGVydHlGaWx0ZXJzKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxvYWQoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdW53cmFwcGVkUHJvcGVydHlGaWx0ZXJzID0gdW53cmFwUHJvcGVydHlGaWx0ZXJzKHByb3BlcnR5RmlsdGVycyk7XHJcbiAgICAgICAgICAgICAgICBwZXJmb3JtTG9hZChzZWxmLnRhcmdldCwgdW53cmFwcGVkUHJvcGVydHlGaWx0ZXJzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbG9hZCgpO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcHJvcGVydHlGaWx0ZXJzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBwcm9wZXJ0eUZpbHRlcnNbcHJvcGVydHldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zdWJzY3JpYmUobG9hZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnBvcHVsYXRlQ29tbWFuZE9uQ2hhbmdlcyA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XHJcbiAgICAgICAgICAgIGNvbW1hbmQucG9wdWxhdGVkRXh0ZXJuYWxseSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzZWxmLmluc3RhbmNlKCkgIT09IFwidW5kZWZpbmVkXCIgJiYgc2VsZi5pbnN0YW5jZSgpICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmQucG9wdWxhdGVGcm9tRXh0ZXJuYWxTb3VyY2Uoc2VsZi5pbnN0YW5jZSgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5pbnN0YW5jZS5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kLnBvcHVsYXRlRnJvbUV4dGVybmFsU291cmNlKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vbkNyZWF0ZWQgPSBmdW5jdGlvbiAobGFzdERlc2NlbmRhbnQpIHtcclxuICAgICAgICAgICAgc2VsZi50YXJnZXQgPSBsYXN0RGVzY2VuZGFudDtcclxuICAgICAgICAgICAgdmFyIHJlYWRNb2RlbEluc3RhbmNlID0gbGFzdERlc2NlbmRhbnQuX3JlYWRNb2RlbFR5cGUuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHNlbGYuaW5zdGFuY2UocmVhZE1vZGVsSW5zdGFuY2UpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QucmVhZFwiLCB7XHJcbiAgICBSZWFkTW9kZWxUYXNrOiBCaWZyb3N0LnRhc2tzLkxvYWRUYXNrLmV4dGVuZChmdW5jdGlvbiAocmVhZE1vZGVsT2YsIHByb3BlcnR5RmlsdGVycywgdGFza0ZhY3RvcnkpIHtcclxuICAgICAgICB2YXIgdXJsID0gXCIvQmlmcm9zdC9SZWFkTW9kZWwvSW5zdGFuY2VNYXRjaGluZz9fcm09XCIgKyByZWFkTW9kZWxPZi5fZ2VuZXJhdGVkRnJvbTtcclxuICAgICAgICB2YXIgcGF5bG9hZCA9IHtcclxuICAgICAgICAgICAgZGVzY3JpcHRvcjoge1xyXG4gICAgICAgICAgICAgICAgcmVhZE1vZGVsOiByZWFkTW9kZWxPZi5fbmFtZSxcclxuICAgICAgICAgICAgICAgIGdlbmVyYXRlZEZyb206IHJlYWRNb2RlbE9mLl9nZW5lcmF0ZWRGcm9tLFxyXG4gICAgICAgICAgICAgICAgcHJvcGVydHlGaWx0ZXJzOiBwcm9wZXJ0eUZpbHRlcnNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucmVhZE1vZGVsID0gcmVhZE1vZGVsT2YuX2dlbmVyYXRlZEZyb207XHJcblxyXG4gICAgICAgIHZhciBpbm5lclRhc2sgPSB0YXNrRmFjdG9yeS5jcmVhdGVIdHRwUG9zdCh1cmwsIHBheWxvYWQpO1xyXG5cclxuICAgICAgICB0aGlzLmV4ZWN1dGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gaW5uZXJUYXNrLmV4ZWN1dGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QuZGVwZW5kZW5jeVJlc29sdmVycy5yZWFkTW9kZWxPZiA9IHtcclxuICAgIGNhblJlc29sdmU6IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHJlYWQgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5hbWUgaW4gcmVhZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICByZXNvbHZlOiBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlYWRbbmFtZV0uY3JlYXRlKCk7XHJcbiAgICB9XHJcbn07IiwiQmlmcm9zdC5kZXBlbmRlbmN5UmVzb2x2ZXJzLnF1ZXJ5ID0ge1xyXG4gICAgY2FuUmVzb2x2ZTogZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgcmVhZCAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gbmFtZSBpbiByZWFkO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc29sdmU6IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gcmVhZFtuYW1lXS5jcmVhdGUoKTtcclxuICAgIH1cclxufTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QucmVhZFwiLCB7XHJcbiAgICBRdWVyeVRhc2s6IEJpZnJvc3QudGFza3MuTG9hZFRhc2suZXh0ZW5kKGZ1bmN0aW9uIChxdWVyeSwgcGFnaW5nLCB0YXNrRmFjdG9yeSkge1xyXG4gICAgICAgIHZhciB1cmwgPSBcIi9CaWZyb3N0L1F1ZXJ5L0V4ZWN1dGU/X3E9XCIgKyBxdWVyeS5fZ2VuZXJhdGVkRnJvbTtcclxuICAgICAgICB2YXIgcGF5bG9hZCA9IHtcclxuICAgICAgICAgICAgZGVzY3JpcHRvcjoge1xyXG4gICAgICAgICAgICAgICAgbmFtZU9mUXVlcnk6IHF1ZXJ5Ll9uYW1lLFxyXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVkRnJvbTogcXVlcnkuX2dlbmVyYXRlZEZyb20sXHJcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiBxdWVyeS5nZXRQYXJhbWV0ZXJWYWx1ZXMoKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwYWdpbmc6IHtcclxuICAgICAgICAgICAgICAgIHNpemU6IHBhZ2luZy5zaXplLFxyXG4gICAgICAgICAgICAgICAgbnVtYmVyOiBwYWdpbmcubnVtYmVyXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnF1ZXJ5ID0gcXVlcnkuX25hbWU7XHJcbiAgICAgICAgdGhpcy5wYWdpbmcgPSBwYXlsb2FkLnBhZ2luZztcclxuXHJcbiAgICAgICAgdmFyIGlubmVyVGFzayA9IHRhc2tGYWN0b3J5LmNyZWF0ZUh0dHBQb3N0KHVybCwgcGF5bG9hZCk7XHJcblxyXG4gICAgICAgIHRoaXMuZXhlY3V0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBpbm5lclRhc2suZXhlY3V0ZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnJlYWRcIiwge1xyXG4gICAgcXVlcnlTZXJ2aWNlOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAobWFwcGVyLCB0YXNrRmFjdG9yeSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5leGVjdXRlID0gZnVuY3Rpb24gKHF1ZXJ5LCBwYWdpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB2YXIgcmVnaW9uID0gcXVlcnkucmVnaW9uO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRhc2sgPSB0YXNrRmFjdG9yeS5jcmVhdGVRdWVyeShxdWVyeSwgcGFnaW5nKTtcclxuICAgICAgICAgICAgcmVnaW9uLnRhc2tzLmV4ZWN1dGUodGFzaykuY29udGludWVXaXRoKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSBcInVuZGVmaW5lZFwiIHx8IHJlc3VsdCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0ge307XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlc3VsdC5pdGVtcyA9PT0gXCJ1bmRlZmluZWRcIiB8fCByZXN1bHQuaXRlbXMgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5pdGVtcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQudG90YWxJdGVtcyA9PT0gXCJ1bmRlZmluZWRcIiB8fCByZXN1bHQudG90YWxJdGVtcyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnRvdGFsSXRlbXMgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChxdWVyeS5oYXNSZWFkTW9kZWwoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5pdGVtcyA9IG1hcHBlci5tYXAocXVlcnkuX3JlYWRNb2RlbCwgcmVzdWx0Lml0ZW1zKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5zYWdhc1wiKTtcclxuQmlmcm9zdC5zYWdhcy5TYWdhID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFNhZ2EoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmV4ZWN1dGVDb21tYW5kcyA9IGZ1bmN0aW9uIChjb21tYW5kcywgb3B0aW9ucykge1xyXG5cclxuICAgICAgICAgICAgdmFyIGNhbkV4ZWN1dGVTYWdhID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGNvbW1hbmRzLmZvckVhY2goZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb21tYW5kLm9uQmVmb3JlRXhlY3V0ZSgpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbkV4ZWN1dGVTYWdhID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYW5FeGVjdXRlU2FnYSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBCaWZyb3N0LmNvbW1hbmRzLmNvbW1hbmRDb29yZGluYXRvci5oYW5kbGVGb3JTYWdhKHNlbGYsIGNvbW1hbmRzLCBvcHRpb25zKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAoY29uZmlndXJhdGlvbikge1xyXG4gICAgICAgICAgICB2YXIgc2FnYSA9IG5ldyBTYWdhKCk7XHJcbiAgICAgICAgICAgIEJpZnJvc3QuZXh0ZW5kKHNhZ2EsIGNvbmZpZ3VyYXRpb24pO1xyXG4gICAgICAgICAgICByZXR1cm4gc2FnYTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59KSgpO1xyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Quc2FnYXNcIik7XHJcbkJpZnJvc3Quc2FnYXMuc2FnYU5hcnJhdG9yID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBiYXNlVXJsID0gXCIvQmlmcm9zdC9TYWdhTmFycmF0b3JcIjtcclxuICAgIC8vIFRvZG8gOiBhYnN0cmFjdCBhd2F5IGludG8gZ2VuZXJhbCBTZXJ2aWNlIGNvZGUgLSBsb29rIGF0IENvbW1hbmRDb29yZGluYXRvci5qcyBmb3IgdGhlIG90aGVyIGNvcHkgb2YgdGhpcyFzXHJcbiAgICBmdW5jdGlvbiBwb3N0KHVybCwgZGF0YSwgY29tcGxldGVIYW5kbGVyKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGNvbXBsZXRlSGFuZGxlclxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGlzUmVxdWVzdFN1Y2Nlc3MoanFYSFIsIGNvbW1hbmRSZXN1bHQpIHtcclxuICAgICAgICBpZiAoanFYSFIuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgaWYgKGNvbW1hbmRSZXN1bHQuc3VjY2VzcyA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY29uY2x1ZGU6IGZ1bmN0aW9uIChzYWdhLCBzdWNjZXNzLCBlcnJvcikge1xyXG4gICAgICAgICAgICB2YXIgbWV0aG9kUGFyYW1ldGVycyA9IHtcclxuICAgICAgICAgICAgICAgIHNhZ2FJZDogc2FnYS5JZFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBwb3N0KGJhc2VVcmwgKyBcIi9Db25jbHVkZVwiLCBKU09OLnN0cmluZ2lmeShtZXRob2RQYXJhbWV0ZXJzKSwgZnVuY3Rpb24gKGpxWEhSKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29tbWFuZFJlc3VsdCA9IEJpZnJvc3QuY29tbWFuZHMuQ29tbWFuZFJlc3VsdC5jcmVhdGVGcm9tKGpxWEhSLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXNTdWNjZXNzID0gaXNSZXF1ZXN0U3VjY2VzcyhqcVhIUiwgY29tbWFuZFJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNTdWNjZXNzID09PSB0cnVlICYmIHR5cGVvZiBzdWNjZXNzID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKHNhZ2EpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGlzU3VjY2VzcyA9PT0gZmFsc2UgJiYgdHlwZW9mIGVycm9yID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcihzYWdhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSkoKTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1lc3NhZ2luZ1wiLCB7XHJcbiAgICBNZXNzZW5nZXI6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzdWJzY3JpYmVycyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLnB1Ymxpc2ggPSBmdW5jdGlvbiAodG9waWMsIG1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgaWYgKHN1YnNjcmliZXJzLmhhc093blByb3BlcnR5KHRvcGljKSkge1xyXG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlcnNbdG9waWNdLnN1YnNjcmliZXJzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnN1YnNjcmliZVRvID0gZnVuY3Rpb24gKHRvcGljLCBzdWJzY3JpYmVyKSB7XHJcbiAgICAgICAgICAgIHZhciBzdWJzY3JpYmVyc0J5VG9waWM7XHJcblxyXG4gICAgICAgICAgICBpZiAoc3Vic2NyaWJlcnMuaGFzT3duUHJvcGVydHkodG9waWMpKSB7XHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyc0J5VG9waWMgPSBzdWJzY3JpYmVyc1t0b3BpY107XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyc0J5VG9waWMgPSB7IHN1YnNjcmliZXJzOiBbXSB9O1xyXG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlcnNbdG9waWNdID0gc3Vic2NyaWJlcnNCeVRvcGljO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzdWJzY3JpYmVyc0J5VG9waWMuc3Vic2NyaWJlcnMucHVzaChzdWJzY3JpYmVyKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBwdWJsaXNoOiB0aGlzLnB1Ymxpc2gsXHJcbiAgICAgICAgICAgIHN1YnNjcmliZVRvOiB0aGlzLnN1YnNjcmliZVRvXHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0Lm1lc3NhZ2luZy5NZXNzZW5nZXIuZ2xvYmFsID0gQmlmcm9zdC5tZXNzYWdpbmcuTWVzc2VuZ2VyLmNyZWF0ZSgpO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLmdsb2JhbE1lc3NlbmdlciA9IEJpZnJvc3QubWVzc2FnaW5nLk1lc3Nlbmdlci5nbG9iYWw7XHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tZXNzYWdpbmdcIiwge1xyXG4gICAgbWVzc2VuZ2VyRmFjdG9yeTogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbWVzc2VuZ2VyID0gQmlmcm9zdC5tZXNzYWdpbmcuTWVzc2VuZ2VyLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gbWVzc2VuZ2VyO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ2xvYmFsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gQmlmcm9zdC5tZXNzYWdpbmcuTWVzc2VuZ2VyLmdsb2JhbDtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIudHlwZXMubWVzc2VuZ2VyRmFjdG9yeSA9IEJpZnJvc3QubWVzc2FnaW5nLm1lc3NlbmdlckZhY3Rvcnk7IiwiaWYgKHR5cGVvZiBrbyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIGtvLm9ic2VydmFibGVNZXNzYWdlID0gZnVuY3Rpb24gKG1lc3NhZ2UsIGRlZmF1bHRWYWx1ZSkge1xyXG4gICAgICAgIHZhciBvYnNlcnZhYmxlID0ga28ub2JzZXJ2YWJsZShkZWZhdWx0VmFsdWUpO1xyXG5cclxuICAgICAgICB2YXIgaW50ZXJuYWwgPSBmYWxzZTtcclxuICAgICAgICBvYnNlcnZhYmxlLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKGludGVybmFsID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgQmlmcm9zdC5tZXNzYWdpbmcuTWVzc2VuZ2VyLmdsb2JhbC5wdWJsaXNoKG1lc3NhZ2UsIG5ld1ZhbHVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgQmlmcm9zdC5tZXNzYWdpbmcuTWVzc2VuZ2VyLmdsb2JhbC5zdWJzY3JpYmVUbyhtZXNzYWdlLCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgaW50ZXJuYWwgPSB0cnVlO1xyXG4gICAgICAgICAgICBvYnNlcnZhYmxlKHZhbHVlKTtcclxuICAgICAgICAgICAgaW50ZXJuYWwgPSBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZTtcclxuICAgIH07XHJcbn0iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Quc2VydmljZXNcIiwge1xyXG4gICAgU2VydmljZTogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLnVybCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gXCJcIjtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcHJlcGFyZUFyZ3VtZW50cyhhcmdzKSB7XHJcbiAgICAgICAgICAgIHZhciBwcmVwYXJlZCA9IHt9O1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gYXJncykge1xyXG4gICAgICAgICAgICAgICAgcHJlcGFyZWRbcHJvcGVydHldID0gSlNPTi5zdHJpbmdpZnkoYXJnc1twcm9wZXJ0eV0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgc3RyaW5naWZpZWQgPSBKU09OLnN0cmluZ2lmeShwcmVwYXJlZCk7XHJcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmdpZmllZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNhbGwobWV0aG9kLCBhcmdzLCBjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiBzZWxmLnVybCArIFwiL1wiICsgbWV0aG9kLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHByZXBhcmVBcmd1bWVudHMoYXJncyksXHJcbiAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxyXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdiA9ICQucGFyc2VKU09OKHJlc3VsdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHYpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLmNhbGxXaXRob3V0UmV0dXJuVmFsdWUgPSBmdW5jdGlvbiAobWV0aG9kLCBhcmdzKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgY2FsbChtZXRob2QsIGFyZ3MsIGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jYWxsV2l0aE9iamVjdEFzUmV0dXJuID0gZnVuY3Rpb24gKG1ldGhvZCwgYXJncykge1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgICAgIGNhbGwobWV0aG9kLCBhcmdzLCBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUodik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jYWxsV2l0aEFycmF5QXNSZXR1cm4gPSBmdW5jdGlvbiAobWV0aG9kLCBhcmdzKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgICAgICBjYWxsKG1ldGhvZCwgYXJncywgZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlKHYpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMub25DcmVhdGVkID0gZnVuY3Rpb24gKGxhc3REZXNjZW5kYW50KSB7XHJcbiAgICAgICAgICAgIHNlbGYudXJsID0gbGFzdERlc2NlbmRhbnQudXJsO1xyXG4gICAgICAgICAgICBpZiAoc2VsZi51cmwuaW5kZXhPZihcIi9cIikgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHNlbGYudXJsID0gXCIvXCIgKyBzZWxmLnVybDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5uYW1lID0gbGFzdERlc2NlbmRhbnQubmFtZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5kZXBlbmRlbmN5UmVzb2x2ZXJzLnNlcnZpY2UgPSB7XHJcbiAgICBjYW5SZXNvbHZlOiBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBzZXJ2aWNlcyAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gbmFtZSBpbiBzZXJ2aWNlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICByZXNvbHZlOiBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIHNlcnZpY2VzW25hbWVdLmNyZWF0ZSgpO1xyXG4gICAgfVxyXG59OyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBkb2N1bWVudFNlcnZpY2U6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uIChET01Sb290KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLkRPTVJvb3QgPSBET01Sb290O1xyXG5cclxuICAgICAgICB0aGlzLnBhZ2VIYXNWaWV3TW9kZWwgPSBmdW5jdGlvbiAodmlld01vZGVsKSB7XHJcbiAgICAgICAgICAgIHZhciBjb250ZXh0ID0ga28uY29udGV4dEZvcigkKFwiYm9keVwiKVswXSk7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzVW5kZWZpbmVkKGNvbnRleHQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQuJGRhdGEgPT09IHZpZXdNb2RlbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldFZpZXdNb2RlbE5hbWVGb3IgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICB2YXIgZGF0YVZpZXdNb2RlbE5hbWUgPSBlbGVtZW50LmF0dHJpYnV0ZXMuZ2V0TmFtZWRJdGVtKFwiZGF0YS12aWV3bW9kZWwtbmFtZVwiKTtcclxuICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoZGF0YVZpZXdNb2RlbE5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhVmlld01vZGVsTmFtZSA9IGRvY3VtZW50LmNyZWF0ZUF0dHJpYnV0ZShcImRhdGEtdmlld21vZGVsLW5hbWVcIik7XHJcbiAgICAgICAgICAgICAgICBkYXRhVmlld01vZGVsTmFtZS52YWx1ZSA9IEJpZnJvc3QuR3VpZC5jcmVhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbGVtZW50LmF0dHJpYnV0ZXMuc2V0TmFtZWRJdGVtKGRhdGFWaWV3TW9kZWxOYW1lKTtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGFWaWV3TW9kZWxOYW1lLnZhbHVlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2V0Vmlld01vZGVsUGFyYW1ldGVyc09uID0gZnVuY3Rpb24gKGVsZW1lbnQsIHBhcmFtZXRlcnMpIHtcclxuICAgICAgICAgICAgZWxlbWVudC52aWV3TW9kZWxQYXJhbWV0ZXJzID0gcGFyYW1ldGVycztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldFZpZXdNb2RlbFBhcmFtZXRlcnNGcm9tID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQudmlld01vZGVsUGFyYW1ldGVycztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmhhc1ZpZXdNb2RlbFBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICByZXR1cm4gIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoZWxlbWVudC52aWV3TW9kZWxQYXJhbWV0ZXJzKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNsZWFuQ2hpbGRyZW5PZiA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHNlbGYudHJhdmVyc2VPYmplY3RzKGZ1bmN0aW9uIChjaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkICE9PSBlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChjaGlsZCkudW5iaW5kKCk7XHJcbiAgICAgICAgICAgICAgICAgICAga28uY2xlYW5Ob2RlKGNoaWxkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgZWxlbWVudCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5oYXNWaWV3RmlsZSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGUgPSBlbGVtZW50LmF0dHJpYnV0ZXNbXCJkYXRhLXZpZXctZmlsZVwiXTtcclxuICAgICAgICAgICAgcmV0dXJuICFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGF0dHJpYnV0ZSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRWaWV3RmlsZUZyb20gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5oYXNWaWV3RmlsZShlbGVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZSA9IGVsZW1lbnQuYXR0cmlidXRlc1tcImRhdGEtdmlldy1maWxlXCJdO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZS52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5oYXNPd25SZWdpb24gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+Q2hlY2sgaWYgZWxlbWVudCBoYXMgaXRzIG93biByZWdpb248L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cImVsZW1lbnRcIiB0eXBlPVwiSFRNTEVsZW1lbnRcIj5IVE1MIEVsZW1lbnQgdG8gY2hlY2s8L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHJldHVybnM+dHJ1ZSBpZiBpdCBoYXMgaXRzIG93biByZWdpb24sIGZhbHNlIGl0IG5vdDwvcmV0dXJucz5cclxuXHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LnJlZ2lvbikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0UGFyZW50UmVnaW9uRm9yID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkdldCB0aGUgcGFyZW50IHJlZ2lvbiBmb3IgYSBnaXZlbiBlbGVtZW50PC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJlbGVtZW50XCIgdHlwZT1cIkhUTUxFbGVtZW50XCI+SFRNTCBFbGVtZW50IHRvIGdldCBmb3I8L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHJldHVybnM+QW4gaW5zdGFuY2Ugb2YgdGhlIHJlZ2lvbiwgaWYgbm8gcmVnaW9uIGlzIGZvdW5kIGl0IHdpbGwgcmV0dXJuIG51bGw8L3JldHVybnM+XHJcbiAgICAgICAgICAgIHZhciBmb3VuZCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoZWxlbWVudC5wYXJlbnROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQucmVnaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQucmVnaW9uO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZm91bmQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRSZWdpb25Gb3IgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+R2V0IHJlZ2lvbiBmb3IgYW4gZWxlbWVudCwgZWl0aGVyIGRpcmVjdGx5IG9yIGltcGxpY2l0bHkgdGhyb3VnaCB0aGUgbmVhcmVzdCBwYXJlbnQsIG51bGwgaWYgbm9uZTwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiZWxlbWVudFwiIHR5cGU9XCJIVE1MRWxlbWVudFwiPkhUTUwgRWxlbWVudCB0byBnZXQgZm9yPC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxyZXR1cm5zPkFuIGluc3RhbmNlIG9mIHRoZSByZWdpb24sIGlmIG5vIHJlZ2lvbiBpcyBmb3VuZCBpdCB3aWxsIHJldHVybiBudWxsPC9yZXR1cm5zPlxyXG4gICAgICAgICAgICB2YXIgZm91bmQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQucmVnaW9uKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5yZWdpb247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm91bmQgPSBzZWxmLmdldFBhcmVudFJlZ2lvbkZvcihlbGVtZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIGZvdW5kO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2V0UmVnaW9uT24gPSBmdW5jdGlvbiAoZWxlbWVudCwgcmVnaW9uKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5TZXQgcmVnaW9uIG9uIGEgc3BlY2lmaWMgZWxlbWVudDwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiZWxlbWVudFwiIHR5cGU9XCJIVE1MRWxlbWVudFwiPkhUTUwgRWxlbWVudCB0byBzZXQgb248L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJyZWdpb25cIiB0eXBlPVwiQmlmcm9zdC52aWV3cy5SZWdpb25cIj5SZWdpb24gdG8gc2V0IG9uIGVsZW1lbnQ8L3BhcmFtPlxyXG5cclxuICAgICAgICAgICAgZWxlbWVudC5yZWdpb24gPSByZWdpb247XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jbGVhclJlZ2lvbk9uID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkNsZWFyIHJlZ2lvbiBvbiBhIHNwZWNpZmljIGVsZW1lbnQ8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cImVsZW1lbnRcIiB0eXBlPVwiSFRNTEVsZW1lbnRcIj5IVE1MIEVsZW1lbnQgdG8gc2V0IG9uPC9wYXJhbT5cclxuICAgICAgICAgICAgZWxlbWVudC5yZWdpb24gPSBudWxsO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMudHJhdmVyc2VPYmplY3RzID0gZnVuY3Rpb24oY2FsbGJhY2ssIGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PlRyYXZlcnNlIG9iamVjdHMgYW5kIGNhbGwgYmFjayBmb3IgZWFjaCBlbGVtZW50PC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJjYWxsYmFja1wiIHR5cGU9XCJGdW5jdGlvblwiPkNhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggZWxlbWVudCBmb3VuZDwvcGFyYW0+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cImVsZW1lbnRcIiB0eXBlPVwiSFRNTEVsZW1lbnRcIiBvcHRpb25hbD1cInRydWVcIj5PcHRpb25hbCByb290IGVsZW1lbnQ8L3BhcmFtPlxyXG4gICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudCB8fCBzZWxmLkRPTVJvb3Q7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChlbGVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZWxlbWVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoIGVsZW1lbnQuaGFzQ2hpbGROb2RlcygpICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IGVsZW1lbnQuZmlyc3RDaGlsZDtcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoY2hpbGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5leHRTaWJsaW5nID0gY2hpbGQubmV4dFNpYmxpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBjaGlsZC5ub2RlVHlwZSA9PT0gMSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudHJhdmVyc2VPYmplY3RzKGNhbGxiYWNrLCBjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQgPSBuZXh0U2libGluZztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldFVuaXF1ZVN0eWxlTmFtZSA9IGZ1bmN0aW9uKHByZWZpeCkge1xyXG4gICAgICAgICAgICB2YXIgaWQgPSBCaWZyb3N0Lkd1aWQuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gcHJlZml4K1wiX1wiK2lkO1xyXG4gICAgICAgICAgICByZXR1cm4gbmFtZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmFkZFN0eWxlID0gZnVuY3Rpb24oc2VsZWN0b3IsIHN0eWxlKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5BZGQgYSBzdHlsZSBkeW5hbWljYWxseSBpbnRvIHRoZSBicm93c2VyPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJzZWxlY3RvclwiIHR5cGU9XCJTdHJpbmdcIj5TZWxlY3RvciB0aGF0IHJlcHJlc2VudHMgdGhlIGNsYXNzPC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwic3R5bGVcIiB0eXBlPVwiT2JqZWN0XCI+S2V5L3ZhbHVlIHBhaXIgb2JqZWN0IGZvciBzdHlsZXM8L3BhcmFtPlxyXG4gICAgICAgICAgICBpZighZG9jdW1lbnQuc3R5bGVTaGVldHMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgaTtcclxuICAgICAgICAgICAgdmFyIHN0eWxlU3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgZm9yKCB2YXIgcHJvcGVydHkgaW4gc3R5bGUgKSB7XHJcbiAgICAgICAgICAgICAgICBzdHlsZVN0cmluZyA9IHN0eWxlU3RyaW5nICsgcHJvcGVydHkgK1wiOlwiICsgc3R5bGVbcHJvcGVydHldK1wiO1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN0eWxlID0gc3R5bGVTdHJpbmc7XHJcblxyXG4gICAgICAgICAgICBpZihkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIikubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBzdHlsZVNoZWV0O1xyXG4gICAgICAgICAgICB2YXIgbWVkaWE7XHJcbiAgICAgICAgICAgIHZhciBtZWRpYVR5cGU7XHJcbiAgICAgICAgICAgIGlmKGRvY3VtZW50LnN0eWxlU2hlZXRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGZvciggaSA9IDA7IGkgPCBkb2N1bWVudC5zdHlsZVNoZWV0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBtZWRpYSA9IGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldLm1lZGlhO1xyXG4gICAgICAgICAgICAgICAgICAgIG1lZGlhVHlwZSA9IHR5cGVvZiBtZWRpYTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYobWVkaWFUeXBlID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKG1lZGlhID09PSBcIlwiIHx8IChtZWRpYS5pbmRleE9mKFwic2NyZWVuXCIpICE9PSAtMSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlU2hlZXQgPSBkb2N1bWVudC5zdHlsZVNoZWV0c1tpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihtZWRpYVR5cGUgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYobWVkaWEubWVkaWFUZXh0ID09PSBcIlwiIHx8IChtZWRpYS5tZWRpYVRleHQuaW5kZXhPZihcInNjcmVlblwiKSAhPT0gLTEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZVNoZWV0ID0gZG9jdW1lbnQuc3R5bGVTaGVldHNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCB0eXBlb2Ygc3R5bGVTaGVldCAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKCB0eXBlb2Ygc3R5bGVTaGVldCA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0eWxlU2hlZXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xyXG4gICAgICAgICAgICAgICAgc3R5bGVTaGVldEVsZW1lbnQudHlwZSA9IFwidGV4dC9jc3NcIjtcclxuXHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQoc3R5bGVTaGVldEVsZW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciggaSA9IDA7IGkgPCBkb2N1bWVudC5zdHlsZVNoZWV0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZVNoZWV0ID0gZG9jdW1lbnQuc3R5bGVTaGVldHNbaV07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbWVkaWEgPSBzdHlsZVNoZWV0Lm1lZGlhO1xyXG4gICAgICAgICAgICAgICAgbWVkaWFUeXBlID0gdHlwZW9mIG1lZGlhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihtZWRpYVR5cGUgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgIGZvciggaSA9IDA7IGkgPCBzdHlsZVNoZWV0LnJ1bGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc3R5bGVTaGVldC5ydWxlc1tpXS5zZWxlY3RvclRleHQgJiYgc3R5bGVTaGVldC5ydWxlc1tpXS5zZWxlY3RvclRleHQudG9Mb3dlckNhc2UoKSA9PT0gc2VsZWN0b3IudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZVNoZWV0LnJ1bGVzW2ldLnN0eWxlLmNzc1RleHQgPSBzdHlsZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzdHlsZVNoZWV0LmFkZFJ1bGUoc2VsZWN0b3IsIHN0eWxlKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmKG1lZGlhVHlwZSA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICAgICAgZm9yKCBpID0gMDsgaSA8IHN0eWxlU2hlZXQuY3NzUnVsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihzdHlsZVNoZWV0LmNzc1J1bGVzW2ldLnNlbGVjdG9yVGV4dCAmJiBzdHlsZVNoZWV0LmNzc1J1bGVzW2ldLnNlbGVjdG9yVGV4dC50b0xvd2VyQ2FzZSgpID09PSBzZWxlY3Rvci50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlU2hlZXQuY3NzUnVsZXNbaV0uc3R5bGUuY3NzVGV4dCA9IHN0eWxlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHN0eWxlU2hlZXQuaW5zZXJ0UnVsZShzZWxlY3RvciArIFwie1wiICsgc3R5bGUgKyBcIn1cIiwgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcmt1cFwiLCB7XHJcbiAgICBCaW5kaW5nQ29udGV4dDogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY3VycmVudCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuY2hhbmdlZCA9IEJpZnJvc3QuRXZlbnQuY3JlYXRlKCk7XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFya3VwXCIsIHtcclxuICAgIGJpbmRpbmdDb250ZXh0TWFuYWdlcjogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB0aGlzLmVuc3VyZSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGlzIHNwZWNpZmljIGJpbmRpbmdDb250ZXh0IGZvciBlbGVtZW50LCByZXR1cm4gaXRcclxuXHJcbiAgICAgICAgICAgIC8vIElmIG5vIHNwZWNpZmljLCBmaW5kIG5lYXJlc3QgZnJvbSBwYXJlbnQgZWxlbWVudFxyXG5cclxuICAgICAgICAgICAgLy8gSWYgbm8gcGFyZW50IGVsZW1lbnQgaGFzIG9uZSBlaXRoZXIsIHRoZXJlIGlzIG5vbmUgLSByZXR1cm4gbnVsbFxyXG5cclxuICAgICAgICAgICAgLy8gSWYgZWxlbWVudCBoYXMgYW4gYXR0cmlidXRlIG9mIGJpbmRpbmdDb250ZXh0IC0gd2UgY2FuIG5vdyBjaGFuZ2UgaXQgdG8gd2hhdCBpdCBpcyBwb2ludGluZyBhdFxyXG5cclxuICAgICAgICAgICAgLy8gSWYgYmluZGluZ0NvbnRleHQgY2hhbmdlcyBkdWUgdG8gYSBiaW5kaW5nIGJlaW5nIHJlbGF0ZWQgdG8gdGhlIGNvbnRleHQgZnJvbSB0aGUgYXR0cmlidXRlIG9uIHRoZSBlbGVtZW50LCBpdCBzaG91bGQgZmlyZSB0aGUgY2hhbmdlZCB0aGluZyBvbiB0aGUgYmluZGluZyBjb250ZXh0XHJcblxyXG4gICAgICAgICAgICAvLyBJbmhlcml0IGZyb20gcGFyZW50IC0gYWx3YXlzIC0gcGFyZW50IGlzIHByb3RvdHlwZSBvZiBjdXJyZW50LCBwb2ludCBiYWNrIHRvIHBhcmVudFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuaGFzRm9yID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRGb3IgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG5cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIudHlwZXMuYmluZGluZ0NvbnRleHRNYW5hZ2VyID0gQmlmcm9zdC5tYXJrdXAuYmluZGluZ0NvbnRleHRNYW5hZ2VyOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXJrdXBcIiwge1xyXG4gICAgYXR0cmlidXRlVmFsdWVzOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAodmFsdWVQcm92aWRlclBhcnNlcikge1xyXG4gICAgICAgIHRoaXMuZXhwYW5kRm9yID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXJrdXBcIiwge1xyXG4gICAgdmFsdWVQcm92aWRlclBhcnNlcjogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKHZhbHVlUHJvdmlkZXJzLCB2YWx1ZUNvbnN1bWVycywgdHlwZUNvbnZlcnRlcnMpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChcInt7KFthLXogLDp7e319fV0qKX19XCIsIFwiZ1wiKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlVmFsdWUoaW5zdGFuY2UsIHByb3BlcnR5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICB2YXIgY29uc3VtZXIgPSB2YWx1ZUNvbnN1bWVycy5nZXRGb3IoaW5zdGFuY2UsIHByb3BlcnR5KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWxmLmhhc1ZhbHVlUHJvdmlkZXIodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvdmlkZXJzID0gc2VsZi5wYXJzZUZvcihpbnN0YW5jZSwgcHJvcGVydHksIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHByb3ZpZGVycy5mb3JFYWNoKGZ1bmN0aW9uIChwcm92aWRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyLnByb3ZpZGUoY29uc3VtZXIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdW1lci5jb25zdW1lKHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMuaGFzVmFsdWVQcm92aWRlciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdmFsdWUubWF0Y2gocmVnZXgpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucGFyc2VGb3IgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIG5hbWUsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm92aWRlcnMgPSBbXTtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHZhbHVlLm1hdGNoKHJlZ2V4KTtcclxuICAgICAgICAgICAgdmFyIGV4cHJlc3Npb24gPSByZXN1bHRbMF0uc3Vic3RyKDIsIHJlc3VsdFswXS5sZW5ndGggLSA0KTtcclxuXHJcbiAgICAgICAgICAgIHZhciByeCA9IG5ldyBSZWdFeHAoXCIoW2Etel0qKSArXCIsIFwiZ1wiKTtcclxuICAgICAgICAgICAgcmVzdWx0ID0gZXhwcmVzc2lvbi5tYXRjaChyeCk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWVQcm92aWRlck5hbWUgPSByZXN1bHRbMF0udHJpbSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZVByb3ZpZGVycy5pc0tub3duKHZhbHVlUHJvdmlkZXJOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm92aWRlciA9IHZhbHVlUHJvdmlkZXJzLmdldEluc3RhbmNlT2YodmFsdWVQcm92aWRlck5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGVycy5wdXNoKHByb3ZpZGVyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4cHJlc3Npb24ubGVuZ3RoID4gcmVzdWx0WzBdLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29uZmlndXJhdGlvblN0cmluZyA9IGV4cHJlc3Npb24uc3Vic3RyKHJlc3VsdFswXS5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBjb25maWd1cmF0aW9uU3RyaW5nLnNwbGl0KFwiLFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnRyaW0oKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIga2V5VmFsdWVQYWlyID0gZWxlbWVudC5zcGxpdChcIjpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5VmFsdWVQYWlyLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNvbWV0aGluZyBpcyB3cm9uZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleVZhbHVlUGFpci5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBWYWx1ZSBvbmx5XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9ubHkgdmFsaWQgaWYgdmFsdWUgcHJvdmlkZXIgaGFzIGRlZmF1bHQgcHJvcGVydHkgYW5kIHRoYXQgcHJvcGVydHkgZXhpc3RcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0ga2V5VmFsdWVQYWlyWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZVZhbHVlKHByb3ZpZGVyLCBwcm92aWRlci5kZWZhdWx0UHJvcGVydHksIHZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGtleVZhbHVlUGFpci5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQcm9wZXJ0eSBhbmQgdmFsdWVcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW52YWxpZCBpZiBwcm9wZXJ0eSBkb2VzIG5vdCBleGlzdFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVWYWx1ZShwcm92aWRlciwga2V5VmFsdWVQYWlyWzBdLCBrZXlWYWx1ZVBhaXJbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzb21ldGhpbmcgaXMgd3JvbmcgLSB0aGVyZSBhcmUgdG9vIG1hbnlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwcm92aWRlcnM7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXJrdXBcIiwge1xyXG4gICAgRWxlbWVudFZpc2l0b3I6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy52aXNpdCA9IGZ1bmN0aW9uIChlbGVtZW50LCByZXN1bHRBY3Rpb25zKSB7XHJcblxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFya3VwXCIsIHtcclxuICAgIEVsZW1lbnRWaXNpdG9yUmVzdWx0QWN0aW9uczogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbigpIHtcclxuXHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFya3VwXCIsIHtcclxuICAgIG9iamVjdE1vZGVsRmFjdG9yeTogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKGRlcGVuZGVuY3lSZXNvbHZlciwgZG9jdW1lbnRTZXJ2aWNlKSB7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRyeVJlc29sdmVUYXJnZXROYW1lc3BhY2VzKGxvY2FsTmFtZSwgdGFyZ2V0cywgc3VjY2VzcywgZXJyb3IpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gdHJ5UmVzb2x2ZShxdWV1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuYW1lc3BhY2UgPSBCaWZyb3N0Lm5hbWVzcGFjZSh0YXJnZXRzLnNoaWZ0KCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgZm91bmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2UuX3NjcmlwdHMuZm9yRWFjaChmdW5jdGlvbiAoc2NyaXB0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY3JpcHQudG9Mb3dlckNhc2UoKSA9PT0gbG9jYWxOYW1lLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlcGVuZGVuY3lSZXNvbHZlci5iZWdpblJlc29sdmUobmFtZXNwYWNlLCBzY3JpcHQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyhpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAub25GYWlsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5UmVzb2x2ZVRhcmdldE5hbWVzcGFjZXMobG9jYWxOYW1lLCB0YXJnZXRzLCBzdWNjZXNzLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnlSZXNvbHZlVGFyZ2V0TmFtZXNwYWNlcyhsb2NhbE5hbWUsIHRhcmdldHMsIHN1Y2Nlc3MsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdHJ5UmVzb2x2ZSh0YXJnZXRzKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZUZyb20gPSBmdW5jdGlvbiAoZWxlbWVudCwgbG9jYWxOYW1lLCBuYW1lc3BhY2VEZWZpbml0aW9uLCBzdWNjZXNzLCBlcnJvcikge1xyXG4gICAgICAgICAgICB0cnlSZXNvbHZlVGFyZ2V0TmFtZXNwYWNlcyhsb2NhbE5hbWUsIG5hbWVzcGFjZURlZmluaXRpb24udGFyZ2V0cywgc3VjY2VzcywgZXJyb3IpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFya3VwXCIsIHtcclxuICAgIE11bHRpcGxlTmFtZXNwYWNlc0luTmFtZU5vdEFsbG93ZWQ6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKHRhZ05hbWUpIHtcclxuICAgICAgICAvL1wiU3ludGF4IGVycm9yOiB0YWduYW1lICdcIiArIG5hbWUgKyBcIicgaGFzIG11bHRpcGxlIG5hbWVzcGFjZXNcIjtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXJrdXBcIiwge1xyXG4gICAgTXVsdGlwbGVQcm9wZXJ0eVJlZmVyZW5jZXNOb3RBbGxvd2VkOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uKHRhZ05hbWUpIHtcclxuICAgICAgICAvLyBcIlN5bnRheCBlcnJvcjogdGFnbmFtZSAnXCIrbmFtZStcIicgaGFzIG11bHRpcGxlIHByb3BlcnRpZXMgaXRzIHJlZmVycmluZyB0b1wiO1xyXG4gICAgfSlcclxufSk7ICIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXJrdXBcIiwge1xyXG4gICAgUGFyZW50VGFnTmFtZU1pc21hdGNoZWQ6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKHRhZ05hbWUsIHBhcmVudFRhZ05hbWUpIHtcclxuICAgICAgICAvLyBcIlNldHRpbmcgcHJvcGVydHkgdXNpbmcgdGFnICdcIituYW1lK1wiJyBkb2VzIG5vdCBtYXRjaCBwYXJlbnQgdGFnIG9mICdcIitwYXJlbnROYW1lK1wiJ1wiO1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcmt1cFwiLCB7XHJcbiAgICBOYW1lc3BhY2VEZWZpbml0aW9uOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uIChwcmVmaXgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5wcmVmaXggPSBwcmVmaXg7XHJcblxyXG4gICAgICAgIHRoaXMudGFyZ2V0cyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmFkZFRhcmdldCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuICAgICAgICAgICAgc2VsZi50YXJnZXRzLnB1c2godGFyZ2V0KTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcmt1cFwiLCB7XHJcbiAgICBuYW1lc3BhY2VEZWZpbml0aW9uczogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uIChwcmVmaXgpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmluaXRpb24gPSBCaWZyb3N0Lm1hcmt1cC5OYW1lc3BhY2VEZWZpbml0aW9uLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBwcmVmaXg6IHByZWZpeCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWZpbml0aW9uO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFya3VwXCIsIHtcclxuICAgIG5hbWVzcGFjZXM6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uIChuYW1lc3BhY2VEZWZpbml0aW9ucywgZWxlbWVudE5hbWluZykge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgbnMgPSBcIm5zOlwiO1xyXG5cclxuICAgICAgICB0aGlzLmdsb2JhbCA9IG5hbWVzcGFjZURlZmluaXRpb25zLmNyZWF0ZShcIl9fZ2xvYmFsXCIpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBmaW5kTmFtZXNwYWNlRGVmaW5pdGlvbkluRWxlbWVudE9yUGFyZW50KHByZWZpeCwgZWxlbWVudCkge1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoZWxlbWVudC5fX25hbWVzcGFjZXMpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZm91bmQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5fX25hbWVzcGFjZXMuZm9yRWFjaChmdW5jdGlvbiAoZGVmaW5pdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWZpbml0aW9uLnByZWZpeCA9PT0gcHJlZml4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gZGVmaW5pdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChmb3VuZCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZvdW5kO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGVsZW1lbnQucGFyZW50RWxlbWVudCkgfHxcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQucGFyZW50RWxlbWVudC5jb25zdHJ1Y3RvciA9PT0gSFRNTEh0bWxFbGVtZW50KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBwYXJlbnRSZXN1bHQgPSBmaW5kTmFtZXNwYWNlRGVmaW5pdGlvbkluRWxlbWVudE9yUGFyZW50KHByZWZpeCwgZWxlbWVudC5wYXJlbnRFbGVtZW50KTtcclxuICAgICAgICAgICAgaWYgKHBhcmVudFJlc3VsdCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50UmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLmV4cGFuZE5hbWVzcGFjZURlZmluaXRpb25zID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgYXR0cmlidXRlSW5kZXggPSAwOyBhdHRyaWJ1dGVJbmRleCA8IGVsZW1lbnQuYXR0cmlidXRlcy5sZW5ndGg7IGF0dHJpYnV0ZUluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGUgPSBlbGVtZW50LmF0dHJpYnV0ZXNbYXR0cmlidXRlSW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgaWYoIGF0dHJpYnV0ZS5uYW1lLmluZGV4T2YobnMpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByZWZpeCA9IGF0dHJpYnV0ZS5uYW1lLnN1YnN0cihucy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBhdHRyaWJ1dGUudmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuYW1lc3BhY2VEZWZpbml0aW9uID0gZmluZE5hbWVzcGFjZURlZmluaXRpb25JbkVsZW1lbnRPclBhcmVudChwcmVmaXgsIGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKG5hbWVzcGFjZURlZmluaXRpb24pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGVsZW1lbnQuX19uYW1lc3BhY2VzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5fX25hbWVzcGFjZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2VEZWZpbml0aW9uID0gbmFtZXNwYWNlRGVmaW5pdGlvbnMuY3JlYXRlKHByZWZpeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuX19uYW1lc3BhY2VzLnB1c2gobmFtZXNwYWNlRGVmaW5pdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2VEZWZpbml0aW9uLmFkZFRhcmdldCh0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXNvbHZlRm9yID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdmFyIHByZWZpeCA9IGVsZW1lbnROYW1pbmcuZ2V0TmFtZXNwYWNlUHJlZml4Rm9yKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChwcmVmaXgpIHx8IHByZWZpeCA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZ2xvYmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBkZWZpbml0aW9uID0gZmluZE5hbWVzcGFjZURlZmluaXRpb25JbkVsZW1lbnRPclBhcmVudChwcmVmaXgsIGVsZW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVmaW5pdGlvbjtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcmt1cFwiLCB7XHJcbiAgICBlbGVtZW50TmFtaW5nOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldE5hbWVBbmROYW1lc3BhY2UoZWxlbWVudCkge1xyXG4gICAgICAgICAgICB2YXIgbmFtZXNwYWNlO1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IGVsZW1lbnQubG9jYWxOYW1lLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgbmFtZXNwYWNlU3BsaXQgPSBuYW1lLnNwbGl0KFwiOlwiKTtcclxuICAgICAgICAgICAgaWYgKG5hbWVzcGFjZVNwbGl0Lmxlbmd0aCA+IDIpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IEJpZnJvc3QubWFya3VwLk11bHRpcGxlTmFtZXNwYWNlc0luTmFtZU5vdEFsbG93ZWQuY3JlYXRlKHsgdGFnTmFtZTogbmFtZSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobmFtZXNwYWNlU3BsaXQubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lID0gbmFtZXNwYWNlU3BsaXRbMV07XHJcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2UgPSBuYW1lc3BhY2VTcGxpdFswXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IG5hbWVzcGFjZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMuZ2V0TmFtZXNwYWNlUHJlZml4Rm9yID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdmFyIG5hbWVBbmROYW1lc3BhY2UgPSBnZXROYW1lQW5kTmFtZXNwYWNlKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChuYW1lQW5kTmFtZXNwYWNlLm5hbWVzcGFjZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lQW5kTmFtZXNwYWNlLm5hbWVzcGFjZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldExvY2FsTmFtZUZvciA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBuYW1lQW5kTmFtZXNwYWNlID0gZ2V0TmFtZUFuZE5hbWVzcGFjZShlbGVtZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIG5hbWVBbmROYW1lc3BhY2UubmFtZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcmt1cFwiLCB7XHJcbiAgICBwcm9wZXJ0eUV4cGFuZGVyOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAodmFsdWVQcm92aWRlclBhcnNlcikge1xyXG4gICAgICAgIHRoaXMuZXhwYW5kID0gZnVuY3Rpb24gKGVsZW1lbnQsIHRhcmdldCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBhdHRyaWJ1dGVJbmRleCA9IDA7IGF0dHJpYnV0ZUluZGV4IDwgZWxlbWVudC5hdHRyaWJ1dGVzLmxlbmd0aDsgYXR0cmlidXRlSW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5hbWUgPSBlbGVtZW50LmF0dHJpYnV0ZXNbYXR0cmlidXRlSW5kZXhdLmxvY2FsTmFtZTtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGVsZW1lbnQuYXR0cmlidXRlc1thdHRyaWJ1dGVJbmRleF0udmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG5hbWUgaW4gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlUHJvdmlkZXJQYXJzZXIuaGFzVmFsdWVQcm92aWRlcih2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVQcm92aWRlclBhcnNlci5wYXJzZUZvcih0YXJnZXQsIG5hbWUsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcmt1cFwiLCB7XHJcbiAgICBPYmplY3RNb2RlbEVsZW1lbnRWaXNpdG9yOiBCaWZyb3N0Lm1hcmt1cC5FbGVtZW50VmlzaXRvci5leHRlbmQoZnVuY3Rpb24gKGVsZW1lbnROYW1pbmcsIG5hbWVzcGFjZXMsIG9iamVjdE1vZGVsRmFjdG9yeSwgcHJvcGVydHlFeHBhbmRlciwgVUlFbGVtZW50UHJlcGFyZXIsIGF0dHJpYnV0ZVZhbHVlcywgYmluZGluZ0NvbnRleHRNYW5hZ2VyKSB7XHJcbiAgICAgICAgdGhpcy52aXNpdCA9IGZ1bmN0aW9uKGVsZW1lbnQsIGFjdGlvbnMpIHtcclxuICAgICAgICAgICAgLy8gVGFncyA6XHJcbiAgICAgICAgICAgIC8vICAtIHRhZyBuYW1lcyBhdXRvbWF0aWNhbGx5IG1hdGNoIHR5cGUgbmFtZXNcclxuICAgICAgICAgICAgLy8gIC0gZHVlIHRvIHRhZyBuYW1lcyBpbiBIVE1MIGVsZW1lbnRzIGJlaW5nIHdpdGhvdXQgY2FzZSAtIHRoZXkgYmVjb21lIGxvd2VyIGNhc2UgaW4gdGhlXHJcbiAgICAgICAgICAgIC8vICAgIGxvY2FsbmFtZSBwcm9wZXJ0eSwgd2Ugd2lsbCBoYXZlIHRvIHNlYXJjaCBmb3IgdHlwZSBieSBsb3dlcmNhc2VcclxuICAgICAgICAgICAgLy8gIC0gbXVsdGlwbGUgdHlwZXMgZm91bmQgd2l0aCBkaWZmZXJlbnQgY2FzaW5nIGluIHNhbWUgbmFtZXNwYWNlIHNob3VsZCB0aHJvdyBhbiBleGNlcHRpb25cclxuICAgICAgICAgICAgLy8gTmFtZXNwYWNlcyA6XHJcbiAgICAgICAgICAgIC8vICAtIHNwbGl0IGJ5ICc6J1xyXG4gICAgICAgICAgICAvLyAgLSBpZiBtb3JlIHRoYW4gb25lICc6JyAtIHRocm93IGFuIGV4Y2VwdGlvblxyXG4gICAgICAgICAgICAvLyAgLSBpZiBubyBuYW1lc3BhY2UgaXMgZGVmaW5lZCwgdHJ5IHRvIHJlc29sdmUgaW4gdGhlIGdsb2JhbCBuYW1lc3BhY2VcclxuICAgICAgICAgICAgLy8gIC0gbmFtZXNwYWNlcyBpbiB0aGUgb2JqZWN0IG1vZGVsIGNhbiBwb2ludCB0byBtdWx0aXBsZSBKYXZhU2NyaXB0IG5hbWVzcGFjZXNcclxuICAgICAgICAgICAgLy8gIC0gbXVsdGlwbGUgdHlwZXMgd2l0aCBzYW1lIG5hbWUgaW4gbmFtZXNwYWNlIGdyb3VwaW5ncyBzaG91bGQgdGhyb3cgYW4gZXhjZXB0aW9uXHJcbiAgICAgICAgICAgIC8vICAtIHJlZ2lzdGVyaW5nIGEgbmFtZXNwYWNlIGNhbiBiZSBkb25lIG9uIGFueSB0YWcgYnkgYWRkaW5nIG5zOm5hbWU9XCJwb2ludCB0byBKUyBuYW1lc3BhY2VcIlxyXG4gICAgICAgICAgICAvLyAgLSBXaWxkY2FyZCByZWdpc3RyYXRpb25zIHRvIGNhcHR1cmUgYW55dGhpbmcgaW4gYSBuYW1lc3BhY2UgZS5nLiBuczpjb250cm9scz1cIldlYi5Db250cm9scy4qXCJcclxuICAgICAgICAgICAgLy8gIC0gSWYgb25lIHJlZ2lzdGVycyBhIG5hbWVzcGFjZSB3aXRoIGEgcHJlZml4IGEgcGFyZW50IGFscmVhZHkgaGFzIGFuZCBubyBuYW1pbmcgcm9vdCBzaXRzIGluIGJldHdlZW4sXHJcbiAgICAgICAgICAgIC8vICAgIGl0IHNob3VsZCBhZGQgdGhlIG5hbWVzcGFjZSB0YXJnZXQgb24gdGhlIHNhbWUgZGVmaW5pdGlvblxyXG4gICAgICAgICAgICAvLyAgLSBOYW1pbmcgcm9vdHMgYXJlIGltcG9ydGFudCAtIGlmIHRoZXJlIG9jY3VycyBhIG5hbWluZyByb290LCBldmVyeXRoaW5nIGlzIHJlbGF0aXZlIHRvIHRoYXQgYW5kXHJcbiAgICAgICAgICAgIC8vICAgIGJyZWFraW5nIGFueSBcImluaGVyaXRhbmNlXCJcclxuICAgICAgICAgICAgLy8gUHJvcGVydGllcyA6XHJcbiAgICAgICAgICAgIC8vICAtIEF0dHJpYnV0ZXMgb24gYW4gZWxlbWVudCBpcyBhIHByb3BlcnR5XHJcbiAgICAgICAgICAgIC8vICAtIFZhbHVlcyBpbiBwcm9wZXJ0eSBzaG91bGQgYWx3YXlzIGdvIHRocm91Z2ggdHlwZSBjb252ZXJzaW9uIHN1YiBzeXN0ZW1cclxuICAgICAgICAgICAgLy8gIC0gVmFsdWVzIHdpdGggZW5jYXBzdWxhdGVkIGluIHt9IHNob3VsZCBiZSBjb25zaWRlcmVkIG1hcmt1cCBleHRlbnNpb25zLCBnbyB0aHJvdWdoXHJcbiAgICAgICAgICAgIC8vICAgIG1hcmt1cCBleHRlbnNpb24gc3lzdGVtIGZvciByZXNvbHZpbmcgdGhlbSBhbmQgdGhlbiBwYXNzIG9uIHRoZSByZXN1bHRpbmcgdmFsdWVcclxuICAgICAgICAgICAgLy8gICAgdG8gdHlwZSBjb252ZXJzaW9uIHN1YiBzeXN0ZW1cclxuICAgICAgICAgICAgLy8gIC0gUHJvcGVydGllcyBjYW4gYmUgc2V0IHdpdGggdGFnIHN1ZmZpeGVkIHdpdGggLjxuYW1lIG9mIHByb3BlcnR5PiAtIG1vcmUgdGhhbiBvbmVcclxuICAgICAgICAgICAgLy8gICAgJy4nIGluIGEgdGFnIG5hbWUgc2hvdWxkIHRocm93IGFuIGV4Y2VwdGlvblxyXG4gICAgICAgICAgICAvLyBWYWx1ZSBQcm92aWRlciA6XHJcbiAgICAgICAgICAgIC8vICAtIEFueSB2YWx1ZSBlc2NhcGVkIHdpdGgge3sgfX0gc2hvdWxkIGJlIGNvbnNpZGVyZWQgYSB2YWx1ZSBwcm92aWRlclxyXG4gICAgICAgICAgICAvLyBWYWx1ZSBDb25zdW1lciA6XHJcbiAgICAgICAgICAgIC8vICAtIEluIHRoZSBvcHBvc2l0ZSBlbmQgb2YgYSB2YWx1ZSBzaXRzIGEgY29uc3VtZXIuIElmIHRoZSB0YXJnZXQgcHJvcGVydHkgaXMgYSBjb25zdW1lciwgcGFzcyB0aGlzXHJcbiAgICAgICAgICAgIC8vICAgIGluIHRvIHRoZSB2YWx1ZSBwcm92aWRlci4gSWYgdGhlIHByb3BlcnR5IGlzIGp1c3QgYSByZWd1bGFyIHByb3BlcnR5LCB1c2UgdGhlIGRlZmF1bHQgcHJvcGVydHlcclxuICAgICAgICAgICAgLy8gICAgdmFsdWUgY29uc3VtZXJcclxuICAgICAgICAgICAgLy8gRGVwZW5kZW5jeSBQcm9wZXJ0aWVzXHJcbiAgICAgICAgICAgIC8vICAtIEEgcHJvcGVydHkgdHlwZSB0aGF0IGhhcyB0aGUgYWJpbGl0eSBvZiBub3RpZnlpbmcgc29tZXRoaW5nIHdoZW4gaXQgY2hhbmdlc1xyXG4gICAgICAgICAgICAvLyAgICBUeXBpY2FsbHkgYSBwcm9wZXJ0eSBnZXRzIHJlZ2lzdGVyZWQgd2l0aCB0aGUgYWJpbGl0eSB0byBvZmZlciBhIGNhbGxiYWNrXHJcbiAgICAgICAgICAgIC8vICAgIERlcGVuZGVuY3kgcHJvcGVydGllcyBuZWVkcyB0byBiZSBleHBsaWNpdGx5IHNldHVwXHJcbiAgICAgICAgICAgIC8vICAtIEF0dGFjaGVkIGRlcGVuZGVuY3kgcHJvcGVydGllcyAtIG9uZSBzaG91bGQgYmUgYWJsZSB0byBhdHRhY2ggZGVwZW5kZW5jeSBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICAgIC8vICAgIEFkZGluZyBuZXcgZnVuY3Rpb25hbGl0eSB0byBhbiBleGlzdGluZyBlbGVtZW50IHRocm91Z2ggZXhwb3NpbmcgbmV3IHByb3BlcnRpZXMgb25cclxuICAgICAgICAgICAgLy8gICAgZXhpc3RpbmcgZWxlbWVudHMuIEl0IGRvZXMgbm90IG1hdHRlciB3aGF0IGVsZW1lbnRzLCBpdCBjb3VsZCBiZSBleGlzdGluZyBvbmVzLlxyXG4gICAgICAgICAgICAvLyAgICBUaGUgYXR0YWNoZWQgZGVwZW5kZW5jeSBwcm9wZXJ0eSBkZWZpbmVzIHdoYXQgaXQgaXMgZm9yIGJ5IHNwZWNpZnlpbmcgYSB0eXBlLiBPbmNlXHJcbiAgICAgICAgICAgIC8vICAgIHdlJ3JlIG1hdGNoaW5nIGEgcGFydGljdWxhciBkZXBlbmRlbmN5IHByb3BlcnR5IGluIHRoZSBtYXJrdXAgd2l0aCB0aGUgdHlwZSBpdCBzdXBwb3J0c1xyXG4gICAgICAgICAgICAvLyAgICBpdHMgYWxsIGdvb2RcclxuICAgICAgICAgICAgLy8gU2VydmljZXNcclxuICAgICAgICAgICAgLy8gIC0gTm9kZXMgc2hvdWxkIGhhdmUgdGhlIGFiaWxpdHkgdG8gc3BlY2lmeSBhIHNlcnZpY2UgdGhhdCBpcyByZWxldmFudCBmb3IgdGhlIG5vZGUuXHJcbiAgICAgICAgICAgIC8vICAgIFRoZSBzZXJ2aWNlIHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIGVsZW1lbnQgaXRzZWxmLiBJdCBpcyBkZWZpbmVkIGFzIGFuIGF0dHJpYnV0ZSBvblxyXG4gICAgICAgICAgICAvLyAgICBhIG5vZGUsIGFueSB2YWx1ZXMgaW4gdGhlIGF0dHJpYnV0ZSB3aWxsIGJlIGhhbmRlZCBpbiwgb2J2aW91c2x5IHJlc29sdmVkIHRocm91Z2hcclxuICAgICAgICAgICAgLy8gICAgdGhlIHZhbHVlIHByb3ZpZGVyIHN5c3RlbS5cclxuICAgICAgICAgICAgLy8gQ2hpbGQgdGFncyA6XHJcbiAgICAgICAgICAgIC8vICAtIENoaWxkcmVuIHdoaWNoIGFyZSBub3QgYSBwcm9wZXJ0eSByZWZlcmVuY2UgYXJlIG9ubHkgYWxsb3dlZCBpZiBhIGNvbnRlbnQgb3JcclxuICAgICAgICAgICAgLy8gICAgaXRlbXMgcHJvcGVydHkgZXhpc3QuIFRoZXJlIGNhbiBvbmx5IGJlIG9uZSBvZiB0aGUgb3RoZXIsIHR3byBvZiBlaXRoZXIgb3IgYm90aFxyXG4gICAgICAgICAgICAvLyAgICBhdCB0aGUgc2FtZSB0aW1lIHNob3VsZCB5aWVsZCBhbiBleGNlcHRpb25cclxuICAgICAgICAgICAgLy8gVGVtcGxhdGluZyA6XHJcbiAgICAgICAgICAgIC8vICAtIElmIGEgVUlFbGVtZW50IGlzIGZvdW5kLCBpdCB3aWxsIG5lZWQgdG8gYmUgaW5zdGFudGlhdGVkXHJcbiAgICAgICAgICAgIC8vICAtIElmIHRoZSBpbnN0YW5jZSBpcyBvZiBhIENvbnRyb2wgdHlwZSAtIHdlIHdpbGwgbG9vayBhdCB0aGVcclxuICAgICAgICAgICAgLy8gICAgQ29udHJvbFRlbXBsYXRlIHByb3BlcnR5IGZvciBpdHMgdGVtcGxhdGUgYW5kIHVzZSB0aGF0IHRvIHJlcGxhY2UgY29udGVudFxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAvLyBFeGFtcGxlIDpcclxuICAgICAgICAgICAgLy8gU2ltcGxlIGNvbnRyb2w6XHJcbiAgICAgICAgICAgIC8vIDxzb21lY29udHJvbCBwcm9wZXJ0eT1cIjQyXCIvPlxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAvLyBDb250cm9sIGluIGRpZmZlcmVudCBuYW1lc3BhY2U6XHJcbiAgICAgICAgICAgIC8vIDxuczpzb21lY29udHJvbCBwcm9wZXJ0eT1cIjQyXCIvPlxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAvLyBBc3NpZ25pbmcgcHJvcGVydHkgd2l0aCB0YWdzOlxyXG4gICAgICAgICAgICAvLyA8bnM6c29tZWNvbnRyb2w+XHJcbiAgICAgICAgICAgIC8vICAgIDxuczpzb21lY29udHJvbC5wcm9wZXJ0eT40MjwvbnM6c29tY29udHJvbC5wcm9wZXJ0eT5cclxuICAgICAgICAgICAgLy8gPC9uczpzb21lY29udHJvbD5cclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gVXNpbmcgYSBtYXJrdXAgZXh0ZW5zaW9uOlxyXG4gICAgICAgICAgICAvLyA8bnM6c29tZWNvbnRyb2wgc29tZXZhbHVlPVwie3tiaW5kaW5nIHByb3BlcnR5fX1cIj5cclxuICAgICAgICAgICAgLy8gPG5zOnNvbWVjb250cm9sXHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vIDxzcGFuPnt7YmluZGluZyBwcm9wZXJ0eX19PC9zcGFuPlxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAvLyA8bnM6c29tZWNvbnRyb2w+XHJcbiAgICAgICAgICAgIC8vICAgIDxuczpzb21lY29udHJvbC5wcm9wZXJ0eT57e2JpbmRpbmcgcHJvcGVydHl9fTwvbnM6c29tY29udHJvbC5wcm9wZXJ0eT5cclxuICAgICAgICAgICAgLy8gPC9uczpzb21lY29udHJvbD5cclxuXHJcbiAgICAgICAgICAgIG5hbWVzcGFjZXMuZXhwYW5kTmFtZXNwYWNlRGVmaW5pdGlvbnMoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGJpbmRpbmdDb250ZXh0TWFuYWdlci5lbnN1cmUoZWxlbWVudCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5pc0tub3duVHlwZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZXMuZXhwYW5kRm9yKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgbG9jYWxOYW1lID0gZWxlbWVudE5hbWluZy5nZXRMb2NhbE5hbWVGb3IoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIHZhciBuYW1lc3BhY2VEZWZpbml0aW9uID0gbmFtZXNwYWNlcy5yZXNvbHZlRm9yKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICBvYmplY3RNb2RlbEZhY3RvcnkuY3JlYXRlRnJvbShlbGVtZW50LCBsb2NhbE5hbWUsIG5hbWVzcGFjZURlZmluaXRpb24sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eUV4cGFuZGVyLmV4cGFuZChlbGVtZW50LCBpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgVUlFbGVtZW50UHJlcGFyZXIucHJlcGFyZShlbGVtZW50LCBpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcmt1cFwiLCB7XHJcbiAgICBOYW1pbmdSb290OiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnRhcmdldCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuZmluZCA9IGZ1bmN0aW9uIChuYW1lLCBlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChzZWxmLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBzZWxmLnRhcmdldDtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZShcIm5hbWVcIikgPT09IG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5oYXNDaGlsZE5vZGVzKCkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IGVsZW1lbnQuZmlyc3RDaGlsZDtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChjaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm91bmRFbGVtZW50ID0gc2VsZi5maW5kKG5hbWUsIGNoaWxkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kRWxlbWVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm91bmRFbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkID0gY2hpbGQubmV4dFNpYmxpbmc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFya3VwXCIsIHtcclxuICAgIFVJRWxlbWVudDogQmlmcm9zdC5tYXJrdXAuTmFtaW5nUm9vdC5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB0aGlzLnByZXBhcmUgPSBmdW5jdGlvbiAodHlwZSwgZWxlbWVudCkge1xyXG5cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcmt1cFwiLCB7XHJcbiAgICBVSUVsZW1lbnRQcmVwYXJlcjogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucHJlcGFyZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UucHJlcGFyZShpbnN0YW5jZS5fdHlwZSwgZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQuY29udGludWVXaXRoKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGluc3RhbmNlLnRlbXBsYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgVUlNYW5hZ2VyID0gQmlmcm9zdC52aWV3cy5VSU1hbmFnZXIuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBVSU1hbmFnZXIuaGFuZGxlKGluc3RhbmNlLnRlbXBsYXRlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3NUb05vZGUoaW5zdGFuY2UudGVtcGxhdGUsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwid2l0aFwiOiBpbnN0YW5jZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucGFyZW50RWxlbWVudC5yZXBsYWNlQ2hpbGQoaW5zdGFuY2UudGVtcGxhdGUsIGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXJrdXBcIiwge1xyXG4gICAgQ29udHJvbDogQmlmcm9zdC5tYXJrdXAuVUlFbGVtZW50LmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnByZXBhcmUgPSBmdW5jdGlvbiAodHlwZSwgZWxlbWVudCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZmlsZSA9IHR5cGUuX25hbWVzcGFjZS5fcGF0aCArIHR5cGUuX25hbWUgKyBcIi5odG1sXCI7XHJcbiAgICAgICAgICAgIHJlcXVpcmUoW1widGV4dCFcIiArIGZpbGUgKyBcIiFzdHJpcFwiXSwgZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9IHY7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnRlbXBsYXRlID0gY29udGFpbmVyO1xyXG5cclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICBQb3N0QmluZGluZ1Zpc2l0b3I6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy52aXNpdCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcblxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgVUlNYW5hZ2VyOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbihkb2N1bWVudFNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgZWxlbWVudFZpc2l0b3JUeXBlcyA9IEJpZnJvc3QubWFya3VwLkVsZW1lbnRWaXNpdG9yLmdldEV4dGVuZGVycygpO1xyXG4gICAgICAgIHZhciBlbGVtZW50VmlzaXRvcnMgPSBbXTtcclxuICAgICAgICB2YXIgcG9zdEJpbmRpbmdWaXNpdG9yVHlwZXMgPSBCaWZyb3N0LnZpZXdzLlBvc3RCaW5kaW5nVmlzaXRvci5nZXRFeHRlbmRlcnMoKTtcclxuICAgICAgICB2YXIgcG9zdEJpbmRpbmdWaXNpdG9ycyA9IFtdO1xyXG5cclxuICAgICAgICBlbGVtZW50VmlzaXRvclR5cGVzLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgICAgICAgICAgZWxlbWVudFZpc2l0b3JzLnB1c2godHlwZS5jcmVhdGUoKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHBvc3RCaW5kaW5nVmlzaXRvclR5cGVzLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgICAgICAgICAgcG9zdEJpbmRpbmdWaXNpdG9ycy5wdXNoKHR5cGUuY3JlYXRlKCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZSA9IGZ1bmN0aW9uIChyb290KSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50U2VydmljZS50cmF2ZXJzZU9iamVjdHMoZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudFZpc2l0b3JzLmZvckVhY2goZnVuY3Rpb24odmlzaXRvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhY3Rpb25zID0gQmlmcm9zdC5tYXJrdXAuRWxlbWVudFZpc2l0b3JSZXN1bHRBY3Rpb25zLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpc2l0b3IudmlzaXQoZWxlbWVudCwgYWN0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSwgcm9vdCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVQb3N0QmluZGluZyA9IGZ1bmN0aW9uIChyb290KSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50U2VydmljZS50cmF2ZXJzZU9iamVjdHMoZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHBvc3RCaW5kaW5nVmlzaXRvcnMuZm9yRWFjaChmdW5jdGlvbiAodmlzaXRvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpc2l0b3IudmlzaXQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSwgcm9vdCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLlVJTWFuYWdlciA9IEJpZnJvc3Qudmlld3MuVUlNYW5hZ2VyOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICBDb250ZW50OiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgSXRlbXM6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICBDb21wb3NlVGFzazogQmlmcm9zdC50YXNrcy5UYXNrLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSBiYXNlIHRhc2sgdGhhdCByZXByZXNlbnRzIGFueXRoaW5nIHRoYXQgaXMgZXhlY3V0aW5nPC9zdW1tYXJ5PlxyXG4gICAgICAgIHRoaXMuZXhlY3V0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIHZpZXdNYW5hZ2VyOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAodmlld0ZhY3RvcnksIHBhdGhSZXNvbHZlcnMsIHJlZ2lvbk1hbmFnZXIsIFVJTWFuYWdlciwgdmlld01vZGVsTWFuYWdlciwgdmlld01vZGVsTG9hZGVyLCB2aWV3TW9kZWxUeXBlcywgZG9jdW1lbnRTZXJ2aWNlKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0Vmlld01vZGVsRm9yRWxlbWVudChlbGVtZW50LCB2aWV3TW9kZWwpIHtcclxuICAgICAgICAgICAgdmlld01vZGVsTWFuYWdlci5tYXN0ZXJWaWV3TW9kZWwuc2V0Rm9yKGVsZW1lbnQsIHZpZXdNb2RlbCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdmlld01vZGVsTmFtZSA9IGRvY3VtZW50U2VydmljZS5nZXRWaWV3TW9kZWxOYW1lRm9yKGVsZW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGRhdGFCaW5kU3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgdmFyIGRhdGFCaW5kID0gZWxlbWVudC5hdHRyaWJ1dGVzLmdldE5hbWVkSXRlbShcImRhdGEtYmluZFwiKTtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGRhdGFCaW5kKSkge1xyXG4gICAgICAgICAgICAgICAgZGF0YUJpbmRTdHJpbmcgPSBkYXRhQmluZC52YWx1ZSArIFwiLCBcIjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRhdGFCaW5kID0gZG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKFwiZGF0YS1iaW5kXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRhdGFCaW5kLnZhbHVlID0gZGF0YUJpbmRTdHJpbmcgKyBcInZpZXdNb2RlbDogJHJvb3RbJ1wiICsgdmlld01vZGVsTmFtZSArIFwiJ11cIjtcclxuICAgICAgICAgICAgZWxlbWVudC5hdHRyaWJ1dGVzLnNldE5hbWVkSXRlbShkYXRhQmluZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemVMYW5kaW5nUGFnZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB2YXIgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcbiAgICAgICAgICAgIGlmIChib2R5ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZmlsZSA9IEJpZnJvc3QuUGF0aC5nZXRGaWxlbmFtZVdpdGhvdXRFeHRlbnNpb24oZG9jdW1lbnQubG9jYXRpb24udG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmlsZSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGUgPSBcImluZGV4XCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHBhdGhSZXNvbHZlcnMuY2FuUmVzb2x2ZShib2R5LCBmaWxlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhY3R1YWxQYXRoID0gcGF0aFJlc29sdmVycy5yZXNvbHZlKGJvZHksIGZpbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2aWV3ID0gdmlld0ZhY3RvcnkuY3JlYXRlRnJvbShhY3R1YWxQYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LmVsZW1lbnQgPSBib2R5O1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuY29udGVudCA9IGJvZHkuaW5uZXJIVE1MO1xyXG4gICAgICAgICAgICAgICAgICAgIGJvZHkudmlldyA9IHZpZXc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZWdpb24gPSByZWdpb25NYW5hZ2VyLmdldEZvcih2aWV3KTtcclxuICAgICAgICAgICAgICAgICAgICByZWdpb25NYW5hZ2VyLmRlc2NyaWJlKHZpZXcsIHJlZ2lvbikuY29udGludWVXaXRoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZpZXdNb2RlbE1hbmFnZXIuaGFzRm9yVmlldyhhY3R1YWxQYXRoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZpZXdNb2RlbFBhdGggPSB2aWV3TW9kZWxNYW5hZ2VyLmdldFZpZXdNb2RlbFBhdGhGb3JWaWV3KGFjdHVhbFBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF2aWV3TW9kZWxNYW5hZ2VyLmlzTG9hZGVkKHZpZXdNb2RlbFBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlld01vZGVsTG9hZGVyLmxvYWQodmlld01vZGVsUGF0aCwgcmVnaW9uKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHZpZXdNb2RlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodmlld01vZGVsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Vmlld01vZGVsRm9yRWxlbWVudChib2R5LCB2aWV3TW9kZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdNb2RlbFR5cGVzLmJlZ2luQ3JlYXRlSW5zdGFuY2VPZlZpZXdNb2RlbCh2aWV3TW9kZWxQYXRoLCByZWdpb24pLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAodmlld01vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh2aWV3TW9kZWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRWaWV3TW9kZWxGb3JFbGVtZW50KGJvZHksIHZpZXdNb2RlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgVUlNYW5hZ2VyLmhhbmRsZShib2R5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmF0dGFjaCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIFVJTWFuYWdlci5oYW5kbGUoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIHZpZXdNb2RlbE1hbmFnZXIubWFzdGVyVmlld01vZGVsLmFwcGx5VG8oZWxlbWVudCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLnZpZXdNYW5hZ2VyID0gQmlmcm9zdC52aWV3cy52aWV3TWFuYWdlcjsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgUGF0aFJlc29sdmVyOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmNhblJlc29sdmUgPSBmdW5jdGlvbiAoZWxlbWVudCwgcGF0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXNvbHZlID0gZnVuY3Rpb24gKGVsZW1lbnQsIHBhdGgpIHtcclxuXHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICBwYXRoUmVzb2x2ZXJzOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFJlc29sdmVycygpIHtcclxuICAgICAgICAgICAgdmFyIHJlc29sdmVycyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBCaWZyb3N0LnZpZXdzLnBhdGhSZXNvbHZlcnMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LnZpZXdzLnBhdGhSZXNvbHZlcnMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gQmlmcm9zdC52aWV3cy5wYXRoUmVzb2x2ZXJzW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgICAgICAgICBpZiggdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHZhbHVlLmNyZWF0ZSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzb2x2ZXIgPSB2YWx1ZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZXNvbHZlci5jYW5SZXNvbHZlID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVycy5wdXNoKHJlc29sdmVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZXJzO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMuY2FuUmVzb2x2ZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBwYXRoKSB7XHJcbiAgICAgICAgICAgIHZhciByZXNvbHZlcnMgPSBnZXRSZXNvbHZlcnMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcmVzb2x2ZXJJbmRleCA9IDA7IHJlc29sdmVySW5kZXggPCByZXNvbHZlcnMubGVuZ3RoOyByZXNvbHZlckluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXNvbHZlciA9IHJlc29sdmVyc1tyZXNvbHZlckluZGV4XTtcclxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSByZXNvbHZlci5jYW5SZXNvbHZlKGVsZW1lbnQsIHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnJlc29sdmUgPSBmdW5jdGlvbiAoZWxlbWVudCwgcGF0aCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzb2x2ZXJzID0gZ2V0UmVzb2x2ZXJzKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHJlc29sdmVySW5kZXggPSAwOyByZXNvbHZlckluZGV4IDwgcmVzb2x2ZXJzLmxlbmd0aDsgcmVzb2x2ZXJJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzb2x2ZXIgPSByZXNvbHZlcnNbcmVzb2x2ZXJJbmRleF07XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzb2x2ZXIuY2FuUmVzb2x2ZShlbGVtZW50LCBwYXRoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlci5yZXNvbHZlKGVsZW1lbnQsIHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgVXJpTWFwcGVyUGF0aFJlc29sdmVyOiBCaWZyb3N0LnZpZXdzLlBhdGhSZXNvbHZlci5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY2FuUmVzb2x2ZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBwYXRoKSB7XHJcbiAgICAgICAgICAgIHZhciBjbG9zZXN0ID0gJChlbGVtZW50KS5jbG9zZXN0KFwiW2RhdGEtdXJpbWFwcGVyXVwiKTtcclxuICAgICAgICAgICAgaWYgKGNsb3Nlc3QubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWFwcGVyTmFtZSA9ICQoY2xvc2VzdFswXSkuZGF0YShcInVyaW1hcHBlclwiKTtcclxuICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LnVyaU1hcHBlcnNbbWFwcGVyTmFtZV0uaGFzTWFwcGluZ0ZvcihwYXRoKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBCaWZyb3N0LnVyaU1hcHBlcnMuZGVmYXVsdC5oYXNNYXBwaW5nRm9yKHBhdGgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucmVzb2x2ZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBwYXRoKSB7XHJcbiAgICAgICAgICAgIHZhciBjbG9zZXN0ID0gJChlbGVtZW50KS5jbG9zZXN0KFwiW2RhdGEtdXJpbWFwcGVyXVwiKTtcclxuICAgICAgICAgICAgaWYgKGNsb3Nlc3QubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWFwcGVyTmFtZSA9ICQoY2xvc2VzdFswXSkuZGF0YShcInVyaW1hcHBlclwiKTtcclxuICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LnVyaU1hcHBlcnNbbWFwcGVyTmFtZV0uaGFzTWFwcGluZ0ZvcihwYXRoKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBCaWZyb3N0LnVyaU1hcHBlcnNbbWFwcGVyTmFtZV0ucmVzb2x2ZShwYXRoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gQmlmcm9zdC51cmlNYXBwZXJzLmRlZmF1bHQucmVzb2x2ZShwYXRoKTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbmlmICh0eXBlb2YgQmlmcm9zdC52aWV3cy5wYXRoUmVzb2x2ZXJzICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICBCaWZyb3N0LnZpZXdzLnBhdGhSZXNvbHZlcnMuVXJpTWFwcGVyUGF0aFJlc29sdmVyID0gQmlmcm9zdC52aWV3cy5VcmlNYXBwZXJQYXRoUmVzb2x2ZXI7XHJcbn0iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgUmVsYXRpdmVQYXRoUmVzb2x2ZXI6IEJpZnJvc3Qudmlld3MuUGF0aFJlc29sdmVyLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jYW5SZXNvbHZlID0gZnVuY3Rpb24gKGVsZW1lbnQsIHBhdGgpIHtcclxuICAgICAgICAgICAgdmFyIGNsb3Nlc3QgPSAkKGVsZW1lbnQpLmNsb3Nlc3QoXCJbZGF0YS12aWV3XVwiKTtcclxuICAgICAgICAgICAgaWYgKGNsb3Nlc3QubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmlldyA9ICQoY2xvc2VzdFswXSkudmlldztcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucmVzb2x2ZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBwYXRoKSB7XHJcbiAgICAgICAgICAgIHZhciBjbG9zZXN0ID0gJChlbGVtZW50KS5jbG9zZXN0KFwiW2RhdGEtdXJpbWFwcGVyXVwiKTtcclxuICAgICAgICAgICAgaWYgKGNsb3Nlc3QubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWFwcGVyTmFtZSA9ICQoY2xvc2VzdFswXSkuZGF0YShcInVyaW1hcHBlclwiKTtcclxuICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LnVyaU1hcHBlcnNbbWFwcGVyTmFtZV0uaGFzTWFwcGluZ0ZvcihwYXRoKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBCaWZyb3N0LnVyaU1hcHBlcnNbbWFwcGVyTmFtZV0ucmVzb2x2ZShwYXRoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gQmlmcm9zdC51cmlNYXBwZXJzLmRlZmF1bHQucmVzb2x2ZShwYXRoKTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbmlmICh0eXBlb2YgQmlmcm9zdC52aWV3cy5wYXRoUmVzb2x2ZXJzICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICBCaWZyb3N0LnZpZXdzLnBhdGhSZXNvbHZlcnMuUmVsYXRpdmVQYXRoUmVzb2x2ZXIgPSBCaWZyb3N0LnZpZXdzLlJlbGF0aXZlUGF0aFJlc29sdmVyO1xyXG59IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIFZpZXc6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKHZpZXdMb2FkZXIsIHZpZXdNb2RlbFR5cGVzLCB2aWV3TW9kZWxNYW5hZ2VyLCBwYXRoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xyXG4gICAgICAgIHRoaXMuY29udGVudCA9IFwiW0NPTlRFTlQgTk9UIExPQURFRF1cIjtcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudmlld01vZGVsVHlwZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy52aWV3TW9kZWxQYXRoID0gbnVsbDtcclxuICAgICAgICB0aGlzLnJlZ2lvbiA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZCA9IGZ1bmN0aW9uIChyZWdpb24pIHtcclxuICAgICAgICAgICAgc2VsZi5yZWdpb24gPSByZWdpb247XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgc2VsZi52aWV3TW9kZWxQYXRoID0gdmlld01vZGVsTWFuYWdlci5nZXRWaWV3TW9kZWxQYXRoRm9yVmlldyhwYXRoKTtcclxuICAgICAgICAgICAgdmlld0xvYWRlci5sb2FkKHNlbGYucGF0aCwgcmVnaW9uKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKGh0bWwpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuY29udGVudCA9IGh0bWw7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnZpZXdNb2RlbFR5cGUgPSB2aWV3TW9kZWxUeXBlcy5nZXRWaWV3TW9kZWxUeXBlRm9yUGF0aChzZWxmLnZpZXdNb2RlbFBhdGgpO1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoc2VsZik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICB2aWV3RmFjdG9yeTogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlRnJvbSA9IGZ1bmN0aW9uIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHZhciB2aWV3ID0gQmlmcm9zdC52aWV3cy5WaWV3LmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBwYXRoOiBwYXRoXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdmlldztcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIudHlwZXMudmlld0ZhY3RvcnkgPSBCaWZyb3N0LnZpZXdzLnZpZXdGYWN0b3J5OyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICBWaWV3TG9hZFRhc2s6IEJpZnJvc3Qudmlld3MuQ29tcG9zZVRhc2suZXh0ZW5kKGZ1bmN0aW9uIChmaWxlcywgZmlsZU1hbmFnZXIpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyBhIHRhc2sgZm9yIGxvYWRpbmcgZmlsZXMgYXN5bmNocm9ub3VzbHk8L3N1bW1hcnk+XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5maWxlcyA9IFtdO1xyXG4gICAgICAgIGZpbGVzLmZvckVhY2goZnVuY3Rpb24gKGZpbGUpIHtcclxuICAgICAgICAgICAgc2VsZi5maWxlcy5wdXNoKGZpbGUucGF0aC5mdWxsUGF0aCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZXhlY3V0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgZmlsZU1hbmFnZXIubG9hZChmaWxlcykuY29udGludWVXaXRoKGZ1bmN0aW9uIChpbnN0YW5jZXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2aWV3ID0gaW5zdGFuY2VzWzBdO1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwodmlldyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIHZpZXdMb2FkZXI6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICh2aWV3TW9kZWxNYW5hZ2VyLCB0YXNrRmFjdG9yeSwgZmlsZUZhY3RvcnksIHJlZ2lvbk1hbmFnZXIpIHtcclxuICAgICAgICB0aGlzLmxvYWQgPSBmdW5jdGlvbiAocGF0aCxyZWdpb24pIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGZpbGVzID0gW107XHJcblxyXG4gICAgICAgICAgICB2YXIgdmlld0ZpbGUgPSBmaWxlRmFjdG9yeS5jcmVhdGUocGF0aCwgQmlmcm9zdC5pby5maWxlVHlwZS5odG1sKTtcclxuICAgICAgICAgICAgaWYgKHBhdGguaW5kZXhPZihcIj9cIikgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3RmlsZS5wYXRoLmZ1bGxQYXRoID0gdmlld0ZpbGUucGF0aC5mdWxsUGF0aCArIHBhdGguc3Vic3RyKHBhdGguaW5kZXhPZihcIj9cIikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZpbGVzLnB1c2godmlld0ZpbGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHZpZXdNb2RlbFBhdGggPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAodmlld01vZGVsTWFuYWdlci5oYXNGb3JWaWV3KHBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3TW9kZWxQYXRoID0gdmlld01vZGVsTWFuYWdlci5nZXRWaWV3TW9kZWxQYXRoRm9yVmlldyhwYXRoKTtcclxuICAgICAgICAgICAgICAgIGlmICghdmlld01vZGVsTWFuYWdlci5pc0xvYWRlZCh2aWV3TW9kZWxQYXRoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2aWV3TW9kZWxGaWxlID0gZmlsZUZhY3RvcnkuY3JlYXRlKHZpZXdNb2RlbFBhdGgsIEJpZnJvc3QuaW8uZmlsZVR5cGUuamF2YVNjcmlwdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZXMucHVzaCh2aWV3TW9kZWxGaWxlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHRhc2sgPSB0YXNrRmFjdG9yeS5jcmVhdGVWaWV3TG9hZChmaWxlcyk7XHJcbiAgICAgICAgICAgIHJlZ2lvbi50YXNrcy5leGVjdXRlKHRhc2spLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAodmlldykge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwodmlldyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICB2aWV3QmluZGluZ0hhbmRsZXI6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKFZpZXdCaW5kaW5nSGFuZGxlclRlbXBsYXRlRW5naW5lLCBVSU1hbmFnZXIsIHZpZXdGYWN0b3J5LCB2aWV3TWFuYWdlciwgdmlld01vZGVsTWFuYWdlciwgZG9jdW1lbnRTZXJ2aWNlLCByZWdpb25NYW5hZ2VyLCBwYXRoUmVzb2x2ZXJzKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gbWFrZVRlbXBsYXRlVmFsdWVBY2Nlc3NvcihlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5nc0FjY2Vzc29yLCBiaW5kaW5nQ29udGV4dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZpZXdVcmkgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQudmlld1VyaSAhPT0gdmlld1VyaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2hpbGRyZW4uZm9yRWFjaChrby5yZW1vdmVOb2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC52aWV3TW9kZWwgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudmlldyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC50ZW1wbGF0ZVNvdXJjZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGVsZW1lbnQudmlld1VyaSA9IHZpZXdVcmk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHZpZXdNb2RlbCA9IGtvLm9ic2VydmFibGUoZWxlbWVudC52aWV3TW9kZWwpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZpZXdNb2RlbFBhcmFtZXRlcnMgPSBhbGxCaW5kaW5nc0FjY2Vzc29yKCkudmlld01vZGVsUGFyYW1ldGVycyB8fCB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGVFbmdpbmUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZpZXcgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlZ2lvbiA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodmlld1VyaSkgfHwgdmlld1VyaSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlRW5naW5lID0gbmV3IGtvLm5hdGl2ZVRlbXBsYXRlRW5naW5lKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlRW5naW5lID0gVmlld0JpbmRpbmdIYW5kbGVyVGVtcGxhdGVFbmdpbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFjdHVhbFBhdGggPSBwYXRoUmVzb2x2ZXJzLnJlc29sdmUoZWxlbWVudCwgdmlld1VyaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldyA9IHZpZXdGYWN0b3J5LmNyZWF0ZUZyb20oYWN0dWFsUGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgICByZWdpb24gPSByZWdpb25NYW5hZ2VyLmdldEZvcih2aWV3KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdNb2RlbCxcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlRW5naW5lOiB0ZW1wbGF0ZUVuZ2luZSxcclxuICAgICAgICAgICAgICAgICAgICB2aWV3VXJpOiB2aWV3VXJpLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXdNb2RlbFBhcmFtZXRlcnM6IHZpZXdNb2RlbFBhcmFtZXRlcnMsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlldzogdmlldyxcclxuICAgICAgICAgICAgICAgICAgICByZWdpb246IHJlZ2lvblxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5nc0FjY2Vzc29yLCB2aWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBrby5iaW5kaW5nSGFuZGxlcnMudGVtcGxhdGUuaW5pdChlbGVtZW50LCBtYWtlVGVtcGxhdGVWYWx1ZUFjY2Vzc29yKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzQWNjZXNzb3IsIGJpbmRpbmdDb250ZXh0KSwgYWxsQmluZGluZ3NBY2Nlc3Nvciwgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3NBY2Nlc3Nvciwgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCkge1xyXG4gICAgICAgICAgICByZXR1cm4ga28uYmluZGluZ0hhbmRsZXJzLnRlbXBsYXRlLnVwZGF0ZShlbGVtZW50LCBtYWtlVGVtcGxhdGVWYWx1ZUFjY2Vzc29yKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzQWNjZXNzb3IsIGJpbmRpbmdDb250ZXh0KSwgYWxsQmluZGluZ3NBY2Nlc3Nvciwgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LnZpZXdzLnZpZXdCaW5kaW5nSGFuZGxlci5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xyXG4gICAga28uYmluZGluZ0hhbmRsZXJzLnZpZXcgPSBCaWZyb3N0LnZpZXdzLnZpZXdCaW5kaW5nSGFuZGxlci5jcmVhdGUoKTtcclxuICAgIGtvLmpzb25FeHByZXNzaW9uUmV3cml0aW5nLmJpbmRpbmdSZXdyaXRlVmFsaWRhdG9ycy52aWV3ID0gZmFsc2U7IC8vIENhbid0IHJld3JpdGUgY29udHJvbCBmbG93IGJpbmRpbmdzXHJcbiAgICBrby52aXJ0dWFsRWxlbWVudHMuYWxsb3dlZEJpbmRpbmdzLnZpZXcgPSB0cnVlO1xyXG59OyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICBWaWV3QmluZGluZ0hhbmRsZXJUZW1wbGF0ZVNvdXJjZTogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAodmlld0ZhY3RvcnkpIHtcclxuICAgICAgICB2YXIgY29udGVudCA9IFwiXCI7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmxvYWRGb3IgPSBmdW5jdGlvbiAoZWxlbWVudCwgdmlldywgcmVnaW9uKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIHZpZXcubG9hZChyZWdpb24pLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAobG9hZGVkVmlldykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICAgICAgd3JhcHBlci5pbm5lckhUTUwgPSBsb2FkZWRWaWV3LmNvbnRlbnQ7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSB3cmFwcGVyLmlubmVySFRNTDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChsb2FkZWRWaWV3LnZpZXdNb2RlbFR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwobG9hZGVkVmlldyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIEJpZnJvc3Qudmlld3MuUmVnaW9uLmN1cnJlbnQgPSByZWdpb247XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy52aWV3TW9kZWxUeXBlLmVuc3VyZSgpLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGxvYWRlZFZpZXcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7IH07XHJcblxyXG4gICAgICAgIHRoaXMudGV4dCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIFZpZXdCaW5kaW5nSGFuZGxlclRlbXBsYXRlRW5naW5lOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICh2aWV3TW9kZWxNYW5hZ2VyLCByZWdpb25NYW5hZ2VyLCBVSU1hbmFnZXIpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJUZW1wbGF0ZSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSwgYmluZGluZ0NvbnRleHQsIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgdmFyIHRlbXBsYXRlU291cmNlO1xyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChvcHRpb25zLmVsZW1lbnQudGVtcGxhdGVTb3VyY2UpKSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVNvdXJjZSA9IEJpZnJvc3Qudmlld3MuVmlld0JpbmRpbmdIYW5kbGVyVGVtcGxhdGVTb3VyY2UuY3JlYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3VXJpOiBvcHRpb25zLnZpZXdVcmksXHJcbiAgICAgICAgICAgICAgICAgICAgcmVnaW9uOiBvcHRpb25zLnJlZ2lvblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLmVsZW1lbnQudGVtcGxhdGVTb3VyY2UgPSB0ZW1wbGF0ZVNvdXJjZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlU291cmNlID0gb3B0aW9ucy5lbGVtZW50LnRlbXBsYXRlU291cmNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChvcHRpb25zLmVsZW1lbnQudmlldykpIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlU291cmNlLmxvYWRGb3Iob3B0aW9ucy5lbGVtZW50LCBvcHRpb25zLnZpZXcsIG9wdGlvbnMucmVnaW9uKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHZpZXcpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmVsZW1lbnQudmlldyA9IHZpZXc7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVnaW9uTWFuYWdlci5kZXNjcmliZShvcHRpb25zLnZpZXcsIG9wdGlvbnMucmVnaW9uKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIGJpdCBkb2RneSwgYnV0IGNhbid0IGZpbmQgYW55IHdheSBhcm91bmQgaXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFB1dCBhbiBlbXB0eSBvYmplY3QgZm9yIGRlcGVuZGVuY3kgZGV0ZWN0aW9uIC0gd2UgZG9uJ3Qgd2FudCBLbm9ja291dCB0byBiZSBvYnNlcnZpbmcgYW55IG9ic2VydmFibGVzIG9uIG91ciB2aWV3TW9kZWxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uYmVnaW4oKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5zdGFuY2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHZpZXcudmlld01vZGVsVHlwZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmlld01vZGVsUGFyYW1ldGVycyA9IG9wdGlvbnMudmlld01vZGVsUGFyYW1ldGVycztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3TW9kZWxQYXJhbWV0ZXJzLnJlZ2lvbiA9IG9wdGlvbnMucmVnaW9uO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZSA9IHZpZXcudmlld01vZGVsVHlwZS5jcmVhdGUodmlld01vZGVsUGFyYW1ldGVycyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5lbGVtZW50LnZpZXdNb2RlbCA9IGluc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZGF0YShpbnN0YW5jZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmRpbmdDb250ZXh0LiRkYXRhID0gaW5zdGFuY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3RhbmNlID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5kYXRhKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kaW5nQ29udGV4dC4kZGF0YSA9IGluc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5lbmQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGJpbmRpbmdDb250ZXh0LiRyb290ID0gYmluZGluZ0NvbnRleHQuJGRhdGE7XHJcbiAgICAgICAgICAgIHZhciByZW5kZXJlZFRlbXBsYXRlU291cmNlID0gc2VsZi5yZW5kZXJUZW1wbGF0ZVNvdXJjZSh0ZW1wbGF0ZVNvdXJjZSwgYmluZGluZ0NvbnRleHQsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgcmVuZGVyZWRUZW1wbGF0ZVNvdXJjZS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5jb25zdHJ1Y3RvciAhPT0gVGV4dCAmJiBlbGVtZW50LmNvbnN0cnVjdG9yICE9PSBDb21tZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgVUlNYW5hZ2VyLmhhbmRsZShlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlcmVkVGVtcGxhdGVTb3VyY2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBuYXRpdmVUZW1wbGF0ZUVuZ2luZSA9IG5ldyBrby5uYXRpdmVUZW1wbGF0ZUVuZ2luZSgpO1xyXG4gICAgdmFyIGJhc2VDcmVhdGUgPSBCaWZyb3N0LnZpZXdzLlZpZXdCaW5kaW5nSGFuZGxlclRlbXBsYXRlRW5naW5lLmNyZWF0ZTtcclxuICAgIEJpZnJvc3Qudmlld3MuVmlld0JpbmRpbmdIYW5kbGVyVGVtcGxhdGVFbmdpbmUuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpbnN0YW5jZSA9IGJhc2VDcmVhdGUuY2FsbChCaWZyb3N0LnZpZXdzLlZpZXdCaW5kaW5nSGFuZGxlclRlbXBsYXRlRW5naW5lLCBhcmd1bWVudHMpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBuYXRpdmVUZW1wbGF0ZUVuZ2luZSkge1xyXG4gICAgICAgICAgICBpZiAoIWluc3RhbmNlLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VbcHJvcGVydHldID0gbmF0aXZlVGVtcGxhdGVFbmdpbmVbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICB9O1xyXG59KSgpO1xyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgTWFzdGVyVmlld01vZGVsOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uIChkb2N1bWVudFNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGRlYWN0aXZhdGVWaWV3TW9kZWwodmlld01vZGVsKSB7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh2aWV3TW9kZWwpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC5pc0Z1bmN0aW9uKHZpZXdNb2RlbC5kZWFjdGl2YXRlZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3TW9kZWwuZGVhY3RpdmF0ZWQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZVZpZXdNb2RlbCh2aWV3TW9kZWwpIHtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHZpZXdNb2RlbCkgJiYgQmlmcm9zdC5pc0Z1bmN0aW9uKHZpZXdNb2RlbC5hY3RpdmF0ZWQpKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3TW9kZWwuYWN0aXZhdGVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLnNldEZvciA9IGZ1bmN0aW9uIChlbGVtZW50LCB2aWV3TW9kZWwpIHtcclxuICAgICAgICAgICAgdmFyIGV4aXN0aW5nVmlld01vZGVsID0gc2VsZi5nZXRGb3IoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGlmIChleGlzdGluZ1ZpZXdNb2RlbCAhPT0gdmlld01vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICBkZWFjdGl2YXRlVmlld01vZGVsKGV4aXN0aW5nVmlld01vZGVsKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIG5hbWUgPSBkb2N1bWVudFNlcnZpY2UuZ2V0Vmlld01vZGVsTmFtZUZvcihlbGVtZW50KTtcclxuICAgICAgICAgICAgc2VsZltuYW1lXSA9IHZpZXdNb2RlbDtcclxuXHJcbiAgICAgICAgICAgIGFjdGl2YXRlVmlld01vZGVsKHZpZXdNb2RlbCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRGb3IgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IGRvY3VtZW50U2VydmljZS5nZXRWaWV3TW9kZWxOYW1lRm9yKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGZbbmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuY2xlYXJGb3IgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IGRvY3VtZW50U2VydmljZS5nZXRWaWV3TW9kZWxOYW1lRm9yKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICBpZiAoIXNlbGYuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIGRlYWN0aXZhdGVWaWV3TW9kZWwoc2VsZltuYW1lXSk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgc2VsZltuYW1lXTtcclxuICAgICAgICAgICAgICAgIHNlbGZbbmFtZV0gPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hcHBseSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAga28uYXBwbHlCaW5kaW5ncyhzZWxmKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmFwcGx5VG8gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBrby5hcHBseUJpbmRpbmdzKHNlbGYsIGVsZW1lbnQpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgVmlld01vZGVsOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uIChyZWdpb24pIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy50YXJnZXRWaWV3TW9kZWwgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMucmVnaW9uID0gcmVnaW9uO1xyXG5cclxuICAgICAgICB0aGlzLmFjdGl2YXRlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzZWxmLnRhcmdldFZpZXdNb2RlbC5vbkFjdGl2YXRlZCA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnRhcmdldFZpZXdNb2RlbC5vbkFjdGl2YXRlZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzZWxmLnRhcmdldFZpZXdNb2RlbC5vbkRlYWN0aXZhdGVkID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYudGFyZ2V0Vmlld01vZGVsLm9uRGVhY3RpdmF0ZWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMub25DcmVhdGVkID0gZnVuY3Rpb24gKGxhc3REZXNjZW5kYW50KSB7XHJcbiAgICAgICAgICAgIHNlbGYudGFyZ2V0Vmlld01vZGVsID0gbGFzdERlc2NlbmRhbnQ7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICB2aWV3TW9kZWxUeXBlczogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0TmFtZXNwYWNlRnJvbShwYXRoKSB7XHJcbiAgICAgICAgICAgIHZhciBsb2NhbFBhdGggPSBCaWZyb3N0LlBhdGguZ2V0UGF0aFdpdGhvdXRGaWxlbmFtZShwYXRoKTtcclxuICAgICAgICAgICAgdmFyIG5hbWVzcGFjZVBhdGggPSBCaWZyb3N0Lm5hbWVzcGFjZU1hcHBlcnMubWFwUGF0aFRvTmFtZXNwYWNlKGxvY2FsUGF0aCk7XHJcbiAgICAgICAgICAgIGlmIChuYW1lc3BhY2VQYXRoICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuYW1lc3BhY2UgPSBCaWZyb3N0Lm5hbWVzcGFjZShuYW1lc3BhY2VQYXRoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuYW1lc3BhY2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRUeXBlTmFtZUZyb20ocGF0aCkge1xyXG4gICAgICAgICAgICB2YXIgbG9jYWxQYXRoID0gQmlmcm9zdC5QYXRoLmdldFBhdGhXaXRob3V0RmlsZW5hbWUocGF0aCk7XHJcbiAgICAgICAgICAgIHZhciBmaWxlbmFtZSA9IEJpZnJvc3QuUGF0aC5nZXRGaWxlbmFtZVdpdGhvdXRFeHRlbnNpb24ocGF0aCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmaWxlbmFtZTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLmlzTG9hZGVkID0gZnVuY3Rpb24gKHBhdGgpIHtcclxuICAgICAgICAgICAgdmFyIG5hbWVzcGFjZSA9IGdldE5hbWVzcGFjZUZyb20ocGF0aCk7XHJcbiAgICAgICAgICAgIGlmIChuYW1lc3BhY2UgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHR5cGVuYW1lID0gZ2V0VHlwZU5hbWVGcm9tKHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVuYW1lIGluIG5hbWVzcGFjZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0Vmlld01vZGVsVHlwZUZvclBhdGhJbXBsZW1lbnRhdGlvbihwYXRoKSB7XHJcbiAgICAgICAgICAgIHZhciBuYW1lc3BhY2UgPSBnZXROYW1lc3BhY2VGcm9tKHBhdGgpO1xyXG4gICAgICAgICAgICBpZiAobmFtZXNwYWNlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0eXBlbmFtZSA9IGdldFR5cGVOYW1lRnJvbShwYXRoKTtcclxuICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzVHlwZShuYW1lc3BhY2VbdHlwZW5hbWVdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuYW1lc3BhY2VbdHlwZW5hbWVdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0Vmlld01vZGVsVHlwZUZvclBhdGggPSBmdW5jdGlvbiAocGF0aCkge1xyXG4gICAgICAgICAgICB2YXIgdHlwZSA9IGdldFZpZXdNb2RlbFR5cGVGb3JQYXRoSW1wbGVtZW50YXRpb24ocGF0aCk7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGVlcFBhdGggPSBwYXRoLnJlcGxhY2UoXCIuanNcIiwgXCIvaW5kZXguanNcIik7XHJcbiAgICAgICAgICAgICAgICB0eXBlID0gZ2V0Vmlld01vZGVsVHlwZUZvclBhdGhJbXBsZW1lbnRhdGlvbihkZWVwUGF0aCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh0eXBlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZXBQYXRoID0gcGF0aC5yZXBsYWNlKFwiLmpzXCIsIFwiL0luZGV4LmpzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdldFZpZXdNb2RlbFR5cGVGb3JQYXRoSW1wbGVtZW50YXRpb24oZGVlcFBhdGgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHlwZTtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5iZWdpbkNyZWF0ZUluc3RhbmNlT2ZWaWV3TW9kZWwgPSBmdW5jdGlvbiAocGF0aCwgcmVnaW9uLCB2aWV3TW9kZWxQYXJhbWV0ZXJzKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0eXBlID0gc2VsZi5nZXRWaWV3TW9kZWxUeXBlRm9yUGF0aChwYXRoKTtcclxuICAgICAgICAgICAgaWYgKHR5cGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzUmVnaW9uID0gQmlmcm9zdC52aWV3cy5SZWdpb24uY3VycmVudDtcclxuICAgICAgICAgICAgICAgIEJpZnJvc3Qudmlld3MuUmVnaW9uLmN1cnJlbnQgPSByZWdpb247XHJcblxyXG4gICAgICAgICAgICAgICAgdmlld01vZGVsUGFyYW1ldGVycyA9IHZpZXdNb2RlbFBhcmFtZXRlcnMgfHwge307XHJcbiAgICAgICAgICAgICAgICB2aWV3TW9kZWxQYXJhbWV0ZXJzLnJlZ2lvbiA9IHJlZ2lvbjtcclxuXHJcbiAgICAgICAgICAgICAgICB0eXBlLmJlZ2luQ3JlYXRlKHZpZXdNb2RlbFBhcmFtZXRlcnMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb250aW51ZVdpdGgoZnVuY3Rpb24gKGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLm9uRmFpbChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVmlld01vZGVsICdcIiArIHBhdGggKyBcIicgZmFpbGVkIGluc3RhbnRpYXRpb25cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlZpZXdNb2RlbCAnXCIgKyBwYXRoICsgXCInIGRvZXMgbm90IGV4aXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIudHlwZXMudmlld01vZGVsVHlwZXMgPSBCaWZyb3N0LnZpZXdzLnZpZXdNb2RlbFR5cGVzOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICB2aWV3TW9kZWxMb2FkZXI6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICh0YXNrRmFjdG9yeSwgZmlsZUZhY3RvcnksIHZpZXdNb2RlbFR5cGVzKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkID0gZnVuY3Rpb24gKHBhdGgsIHJlZ2lvbiwgdmlld01vZGVsUGFyYW1ldGVycykge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHZhciBmaWxlID0gZmlsZUZhY3RvcnkuY3JlYXRlKHBhdGgsIEJpZnJvc3QuaW8uZmlsZVR5cGUuamF2YVNjcmlwdCk7XHJcbiAgICAgICAgICAgIHZhciB0YXNrID0gdGFza0ZhY3RvcnkuY3JlYXRlVmlld01vZGVsTG9hZChbZmlsZV0pO1xyXG4gICAgICAgICAgICByZWdpb24udGFza3MuZXhlY3V0ZSh0YXNrKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmlld01vZGVsVHlwZXMuYmVnaW5DcmVhdGVJbnN0YW5jZU9mVmlld01vZGVsKHBhdGgsIHJlZ2lvbiwgdmlld01vZGVsUGFyYW1ldGVycykuY29udGludWVXaXRoKGZ1bmN0aW9uIChpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgVmlld01vZGVsTG9hZFRhc2s6IEJpZnJvc3Qudmlld3MuQ29tcG9zZVRhc2suZXh0ZW5kKGZ1bmN0aW9uIChmaWxlcywgZmlsZU1hbmFnZXIpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyBhIHRhc2sgZm9yIGxvYWRpbmcgdmlld01vZGVsczwvc3VtbWFyeT5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuZmlsZXMgPSBbXTtcclxuICAgICAgICBmaWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChmaWxlKSB7XHJcbiAgICAgICAgICAgIHNlbGYuZmlsZXMucHVzaChmaWxlLnBhdGguZnVsbFBhdGgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmV4ZWN1dGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIGZpbGVNYW5hZ2VyLmxvYWQoZmlsZXMpLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoaW5zdGFuY2VzKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChpbnN0YW5jZXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICB2aWV3TW9kZWxNYW5hZ2VyOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbihhc3NldHNNYW5hZ2VyLCBkb2N1bWVudFNlcnZpY2UsIHZpZXdNb2RlbExvYWRlciwgcmVnaW9uTWFuYWdlciwgdGFza0ZhY3RvcnksIHZpZXdGYWN0b3J5LCBNYXN0ZXJWaWV3TW9kZWwpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5hc3NldHNNYW5hZ2VyID0gYXNzZXRzTWFuYWdlcjtcclxuICAgICAgICB0aGlzLnZpZXdNb2RlbExvYWRlciA9IHZpZXdNb2RlbExvYWRlcjtcclxuICAgICAgICB0aGlzLmRvY3VtZW50U2VydmljZSA9IGRvY3VtZW50U2VydmljZTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXN0ZXJWaWV3TW9kZWwgPSBNYXN0ZXJWaWV3TW9kZWw7XHJcblxyXG4gICAgICAgIHRoaXMuaGFzRm9yVmlldyA9IGZ1bmN0aW9uICh2aWV3UGF0aCkge1xyXG4gICAgICAgICAgICB2YXIgc2NyaXB0RmlsZSA9IEJpZnJvc3QuUGF0aC5jaGFuZ2VFeHRlbnNpb24odmlld1BhdGgsIFwianNcIik7XHJcbiAgICAgICAgICAgIHNjcmlwdEZpbGUgPSBCaWZyb3N0LlBhdGgubWFrZVJlbGF0aXZlKHNjcmlwdEZpbGUpO1xyXG4gICAgICAgICAgICB2YXIgaGFzVmlld01vZGVsID0gc2VsZi5hc3NldHNNYW5hZ2VyLmhhc1NjcmlwdChzY3JpcHRGaWxlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGhhc1ZpZXdNb2RlbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldFZpZXdNb2RlbFBhdGhGb3JWaWV3ID0gZnVuY3Rpb24gKHZpZXdQYXRoKSB7XHJcbiAgICAgICAgICAgIHZhciBzY3JpcHRGaWxlID0gQmlmcm9zdC5QYXRoLmNoYW5nZUV4dGVuc2lvbih2aWV3UGF0aCwgXCJqc1wiKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNjcmlwdEZpbGU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5pc0xvYWRlZCA9IGZ1bmN0aW9uIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHZhciBsb2NhbFBhdGggPSBCaWZyb3N0LlBhdGguZ2V0UGF0aFdpdGhvdXRGaWxlbmFtZShwYXRoKTtcclxuICAgICAgICAgICAgdmFyIGZpbGVuYW1lID0gQmlmcm9zdC5QYXRoLmdldEZpbGVuYW1lV2l0aG91dEV4dGVuc2lvbihwYXRoKTtcclxuICAgICAgICAgICAgdmFyIG5hbWVzcGFjZVBhdGggPSBCaWZyb3N0Lm5hbWVzcGFjZU1hcHBlcnMubWFwUGF0aFRvTmFtZXNwYWNlKGxvY2FsUGF0aCk7XHJcbiAgICAgICAgICAgIGlmIChuYW1lc3BhY2VQYXRoICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuYW1lc3BhY2UgPSBCaWZyb3N0Lm5hbWVzcGFjZShuYW1lc3BhY2VQYXRoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZmlsZW5hbWUgaW4gbmFtZXNwYWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgdmlld01vZGVsQmluZGluZ0hhbmRsZXI6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24oZG9jdW1lbnRTZXJ2aWNlLCB2aWV3RmFjdG9yeSwgdmlld01vZGVsTG9hZGVyLCB2aWV3TW9kZWxNYW5hZ2VyLCB2aWV3TW9kZWxUeXBlcywgcmVnaW9uTWFuYWdlcikge1xyXG4gICAgICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5nc0FjY2Vzc29yLCBwYXJlbnRWaWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KSB7XHJcbiAgICAgICAgICAgIHZhciBwYXRoID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpO1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5faXNMb2FkaW5nID09PSB0cnVlIHx8IChlbGVtZW50Ll92aWV3TW9kZWxQYXRoID09PSBwYXRoICYmICFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGVsZW1lbnQuX3ZpZXdNb2RlbCkpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGVsZW1lbnQuX2lzTG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuX3ZpZXdNb2RlbFBhdGggPSBwYXRoO1xyXG5cclxuICAgICAgICAgICAgdmFyIHZpZXdQYXRoID0gXCIvXCI7XHJcblxyXG4gICAgICAgICAgICBpZiggZG9jdW1lbnRTZXJ2aWNlLmhhc1ZpZXdGaWxlKGVsZW1lbnQpICkge1xyXG4gICAgICAgICAgICAgICAgdmlld1BhdGggPSBkb2N1bWVudFNlcnZpY2UuZ2V0Vmlld0ZpbGVGcm9tKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgdmlldyA9IHZpZXdGYWN0b3J5LmNyZWF0ZUZyb20odmlld1BhdGgpO1xyXG4gICAgICAgICAgICB2aWV3LmNvbnRlbnQgPSBlbGVtZW50LmlubmVySFRNTDtcclxuICAgICAgICAgICAgdmlldy5lbGVtZW50ID0gZWxlbWVudDtcclxuXHJcbiAgICAgICAgICAgIHZhciB2aWV3TW9kZWxJbnN0YW5jZSA9IGtvLm9ic2VydmFibGUoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByZWdpb24gPSByZWdpb25NYW5hZ2VyLmdldEZvcih2aWV3KTtcclxuICAgICAgICAgICAgcmVnaW9uTWFuYWdlci5kZXNjcmliZSh2aWV3LHJlZ2lvbikuY29udGludWVXaXRoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2aWV3TW9kZWxQYXJhbWV0ZXJzID0gYWxsQmluZGluZ3NBY2Nlc3NvcigpLnZpZXdNb2RlbFBhcmFtZXRlcnMgfHwge307XHJcbiAgICAgICAgICAgICAgICB2aWV3TW9kZWxQYXJhbWV0ZXJzLnJlZ2lvbiA9IHJlZ2lvbjtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmlld01vZGVsVHlwZXMuaXNMb2FkZWQocGF0aCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmlld01vZGVsVHlwZSA9IHZpZXdNb2RlbFR5cGVzLmdldFZpZXdNb2RlbFR5cGVGb3JQYXRoKHBhdGgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgbGFzdFJlZ2lvbiA9IEJpZnJvc3Qudmlld3MuUmVnaW9uLmN1cnJlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgQmlmcm9zdC52aWV3cy5SZWdpb24uY3VycmVudCA9IHJlZ2lvbjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmlld01vZGVsVHlwZS5iZWdpbkNyZWF0ZSh2aWV3TW9kZWxQYXJhbWV0ZXJzKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHZpZXdNb2RlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGRCaW5kaW5nQ29udGV4dCA9IGJpbmRpbmdDb250ZXh0LmNyZWF0ZUNoaWxkQ29udGV4dCh2aWV3TW9kZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZEJpbmRpbmdDb250ZXh0LiRyb290ID0gdmlld01vZGVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50Ll92aWV3TW9kZWwgPSB2aWV3TW9kZWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3TW9kZWxJbnN0YW5jZSh2aWV3TW9kZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBCaWZyb3N0LnZpZXdzLlJlZ2lvbi5jdXJyZW50ID0gbGFzdFJlZ2lvbjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuX2lzTG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pLm9uRmFpbChmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ291bGQgbm90IGNyZWF0ZSBhbiBpbnN0YW5jZSBvZiAnXCIgKyB2aWV3TW9kZWxUeXBlLl9uYW1lc3BhY2UubmFtZSArIFwiLlwiICsgdmlld01vZGVsVHlwZS5fbmFtZStcIiAtIFJlYXNvbiA6IFwiK2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3TW9kZWxMb2FkZXIubG9hZChwYXRoLCByZWdpb24sIHZpZXdNb2RlbFBhcmFtZXRlcnMpLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAodmlld01vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZEJpbmRpbmdDb250ZXh0ID0gYmluZGluZ0NvbnRleHQuY3JlYXRlQ2hpbGRDb250ZXh0KHZpZXdNb2RlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkQmluZGluZ0NvbnRleHQuJHJvb3QgPSB2aWV3TW9kZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuX3ZpZXdNb2RlbCA9IHZpZXdNb2RlbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdNb2RlbEluc3RhbmNlKHZpZXdNb2RlbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50Ll9pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ga28uYmluZGluZ0hhbmRsZXJzLndpdGguaW5pdChlbGVtZW50LCB2aWV3TW9kZWxJbnN0YW5jZSwgYWxsQmluZGluZ3NBY2Nlc3NvciwgcGFyZW50Vmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LnZpZXdzLnZpZXdNb2RlbEJpbmRpbmdIYW5kbGVyLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBrby5iaW5kaW5nSGFuZGxlcnMudmlld01vZGVsID0gQmlmcm9zdC52aWV3cy52aWV3TW9kZWxCaW5kaW5nSGFuZGxlci5jcmVhdGUoKTtcclxufTtcclxuXHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICBSZWdpb246IGZ1bmN0aW9uKG1lc3NlbmdlckZhY3RvcnksIG9wZXJhdGlvbnNGYWN0b3J5LCB0YXNrc0ZhY3RvcnkpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyBhIHJlZ2lvbiBpbiB0aGUgdmlzdWFsIGNvbXBvc2l0aW9uIG9uIGEgcGFnZTwvc3VtbWFyeT5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cInZpZXdcIiB0eXBlPVwib2JzZXJ2YWJsZSBvZiBCaWZyb3N0LnZpZXdzLlZpZXdcIj5PYnNlcnZhYmxlIGhvbGRpbmcgVmlldyBmb3IgdGhlIGNvbXBvc2l0aW9uPC9maWVsZD5cclxuICAgICAgICB0aGlzLnZpZXcgPSBrby5vYnNlcnZhYmxlKCk7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cInZpZXdNb2RlbFwiIHR5cGU9XCJCaWZyb3N0LnZpZXdzLlZpZXdNb2RlbFwiPlRoZSBWaWV3TW9kZWwgYXNzb2NpYXRlZCB3aXRoIHRoZSB2aWV3PC9maWVsZD5cclxuICAgICAgICB0aGlzLnZpZXdNb2RlbCA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cIm1lc3NlbmdlclwiIHR5cGU9XCJCaWZyb3N0Lm1lc3NhZ2luZy5NZXNzZW5nZXJcIj5UaGUgbWVzc2VuZ2VyIGZvciB0aGUgcmVnaW9uPC9maWVsZD5cclxuICAgICAgICB0aGlzLm1lc3NlbmdlciA9IG1lc3NlbmdlckZhY3RvcnkuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImdsb2JhbE1lc3NlbmdlclwiIHR5cGU9XCJCaWZyb3N0Lm1lc3NhZ2luZy5NZXNzZW5nZXJcIj5UaGUgZ2xvYmFsIG1lc3NlbmdlcjwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5nbG9iYWxNZXNzZW5nZXIgPSBtZXNzZW5nZXJGYWN0b3J5Lmdsb2JhbCgpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJvcGVyYXRpb25zXCIgdHlwZT1cIkJpZnJvc3QuaW50ZXJhY3Rpb24uT3BlcmF0aW9uc1wiPk9wZXJhdGlvbnMgZm9yIHRoZSByZWdpb248L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMub3BlcmF0aW9ucyA9IG9wZXJhdGlvbnNGYWN0b3J5LmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJ0YXNrc1wiIHR5cGU9XCJCaWZyb3N0LnRhc2tzLlRhc2tzXCI+VGFza3MgZm9yIHRoZSByZWdpb248L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMudGFza3MgPSB0YXNrc0ZhY3RvcnkuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cInBhcmVudFwiIHR5cGU9XCJCaWZyb3N0LnZpZXdzLlJlZ2lvblwiPlBhcmVudCByZWdpb24sIG51bGwgaWYgdGhlcmUgaXMgbm8gcGFyZW50PC9maWVsZD5cclxuICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImNoaWxkcmVuXCIgdHlwZT1cIkJpZnJvc3Qudmlld3MuUmVnaW9uW11cIj5DaGlsZCByZWdpb25zIHdpdGhpbiB0aGlzIHJlZ2lvbjwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJjb21tYW5kc1wiIHR5cGU9XCJvYnNlcnZhYmxlQXJyYXlcIj5BcnJheSBvZiBjb21tYW5kcyBpbnNpZGUgdGhlIHJlZ2lvbjwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5jb21tYW5kcyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJpc0NvbW1hbmRSb290XCIgdHlwZT1cIm9ic2VydmFibGVcIj5XaGV0aGVyIHRoaXMgcmVnaW9uIGlzIGEgY29tbWFuZCByb290LlxyXG4gICAgICAgIC8vLyAoaS5lIGRvZXMgbm90IGJ1YmJsZSBpdHMgY29tbWFuZHMgdXB3YXJkcyk8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuaXNDb21tYW5kUm9vdCA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJhZ2dyZWdhdGVkQ29tbWFuZHNcIiB0eXBlPVwib2JzZXJ2YWJsZUFycmF5XCI+UmVwcmVzZW50cyBhbGwgY29tbWFuZHMgaW4gdGhpcyByZWdpb24gYW5kIGFueSBjaGlsZCByZWdpb25zPC9maWVsZD5cclxuICAgICAgICB0aGlzLmFnZ3JlZ2F0ZWRDb21tYW5kcyA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGNvbW1hbmRzID0gW107XHJcblxyXG4gICAgICAgICAgICBzZWxmLmNvbW1hbmRzKCkuZm9yRWFjaChmdW5jdGlvbiAoY29tbWFuZCkge1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZHMucHVzaChjb21tYW5kKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLmNoaWxkcmVuKCkuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGRSZWdpb24pIHtcclxuICAgICAgICAgICAgICAgIGlmICghY2hpbGRSZWdpb24uaXNDb21tYW5kUm9vdCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRSZWdpb24uYWdncmVnYXRlZENvbW1hbmRzKCkuZm9yRWFjaChmdW5jdGlvbiAoY29tbWFuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kcy5wdXNoKGNvbW1hbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbW1hbmRzO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGhpc09yQ2hpbGRIYXNUYXNrVHlwZSh0YXNrVHlwZSwgcHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaGFzVGFzayA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jaGlsZHJlbigpLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkUmVnaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkUmVnaW9uW3Byb3BlcnR5TmFtZV0oKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNUYXNrID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYudGFza3MuYWxsKCkuZm9yRWFjaChmdW5jdGlvbiAodGFzaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXNrLl90eXBlLnR5cGVPZih0YXNrVHlwZSkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzVGFzayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGhhc1Rhc2s7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRoaXNPckNoaWxkQ29tbWFuZEhhc1Byb3BlcnR5U2V0VG9UcnVlKGNvbW1hbmRQcm9wZXJ0eU5hbWUsIGJyZWFrSWZUaGlzSGFzTm9Db21tYW5kcykge1xyXG4gICAgICAgICAgICByZXR1cm4ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGlzU2V0ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY29tbWFuZHMgPSBzZWxmLmFnZ3JlZ2F0ZWRDb21tYW5kcygpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJyZWFrSWZUaGlzSGFzTm9Db21tYW5kcyA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21tYW5kcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbW1hbmRzLmZvckVhY2goZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tbWFuZFtjb21tYW5kUHJvcGVydHlOYW1lXSgpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1NldCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzU2V0O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRoaXNPckNoaWxkQ29tbWFuZEhhc1Byb3BlcnR5U2V0VG9GYWxzZShjb21tYW5kUHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXNTZXQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY29tbWFuZHMgPSBzZWxmLmFnZ3JlZ2F0ZWRDb21tYW5kcygpO1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZHMuZm9yRWFjaChmdW5jdGlvbiAoY29tbWFuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21tYW5kW2NvbW1hbmRQcm9wZXJ0eU5hbWVdKCkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNTZXQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzU2V0O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImlzVmFsaWRcIiB0eXBlPVwib2JzZXJ2YWJsZVwiPkluZGljaWF0ZXMgd2V0aGVyIG9yIG5vdCByZWdpb24gb3IgYW55IG9mIGl0cyBjaGlsZCByZWdpb25zIGFyZSBpbiBhbiBpbnZhbGlkIHN0YXRlPC9maWVsZD5cclxuICAgICAgICB0aGlzLmlzVmFsaWQgPSB0aGlzT3JDaGlsZENvbW1hbmRIYXNQcm9wZXJ0eVNldFRvVHJ1ZShcImlzVmFsaWRcIik7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImNhbkNvbW1hbmRzRXhlY3V0ZVwiIHR5cGU9XCJvYnNlcnZhYmxlXCI+SW5kaWNhdGVzIHdldGhlciBvciBub3QgcmVnaW9uIG9yIGFueSBvZiBpdHMgY2hpbGQgcmVnaW9ucyBjYW4gZXhlY3V0ZSB0aGVpciBjb21tYW5kczwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5jYW5Db21tYW5kc0V4ZWN1dGUgPSB0aGlzT3JDaGlsZENvbW1hbmRIYXNQcm9wZXJ0eVNldFRvVHJ1ZShcImNhbkV4ZWN1dGVcIiwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImFyZUNvbW1hbmRzQXV0aG9yaXplZFwiIHR5cGU9XCJvYnNlcnZhYmxlXCI+SW5kaWNhdGVzIHdldGhlciBvciBub3QgcmVnaW9uIG9yIGFueSBvZiBpdHMgY2hpbGQgcmVnaW9ucyBoYXZlIHRoZWlyIGNvbW1hbmRzIGF1dGhvcml6ZWQ8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuYXJlQ29tbWFuZHNBdXRob3JpemVkID0gdGhpc09yQ2hpbGRDb21tYW5kSGFzUHJvcGVydHlTZXRUb1RydWUoXCJpc0F1dGhvcml6ZWRcIik7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImFyZUNvbW1hbmRzQXV0aG9yaXplZFwiIHR5cGU9XCJvYnNlcnZhYmxlXCI+SW5kaWNhdGVzIHdldGhlciBvciBub3QgcmVnaW9uIG9yIGFueSBvZiBpdHMgY2hpbGQgcmVnaW9ucyBoYXZlIHRoZWlyIGNvbW1hbmRzIGNoYW5nZWQ8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuY29tbWFuZHNIYXZlQ2hhbmdlcyA9IHRoaXNPckNoaWxkQ29tbWFuZEhhc1Byb3BlcnR5U2V0VG9GYWxzZShcImhhc0NoYW5nZXNcIik7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImFyZUNvbW1hbmRzQXV0aG9yaXplZFwiIHR5cGU9XCJvYnNlcnZhYmxlXCI+SW5kaWNhdGVzIHdldGhlciBvciBub3QgcmVnaW9uIG9yIGFueSBvZiBpdHMgY2hpbGQgcmVnaW9ucyBoYXZlIHRoZWlyIGNvbW1hbmRzIHJlYWR5IHRvIGV4ZWN1dGU8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuYXJlQ29tbWFuZHNSZWFkeVRvRXhlY3V0ZSA9IHRoaXNPckNoaWxkQ29tbWFuZEhhc1Byb3BlcnR5U2V0VG9UcnVlKFwiaXNSZWFkeVRvRXhlY3V0ZVwiLCB0cnVlKTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiYXJlQ29tbWFuZHNBdXRob3JpemVkXCIgdHlwZT1cIm9ic2VydmFibGVcIj5JbmRpY2F0ZXMgd2V0aGVyIG9yIG5vdCByZWdpb24gb3IgYW55IG9mIGl0cyBjaGlsZCByZWdpb25zIGhhdmUgY2hhbmdlcyBpbiB0aGVpciBjb21tYW5kcyBvciBoYXMgYW55IG9wZXJhdGlvbnM8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuaGFzQ2hhbmdlcyA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGNvbW1hbmRzSGF2ZUNoYW5nZXMgPSBzZWxmLmNvbW1hbmRzSGF2ZUNoYW5nZXMoKTtcclxuXHJcblxyXG4gICAgICAgICAgICB2YXIgY2hpbGRyZW5IYXNDaGFuZ2VzID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHNlbGYuY2hpbGRyZW4oKS5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZFJlZ2lvbikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjaGlsZFJlZ2lvbi5pc0NvbW1hbmRSb290KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGRSZWdpb24uaGFzQ2hhbmdlcygpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuSGFzQ2hhbmdlcyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvbW1hbmRzSGF2ZUNoYW5nZXMgfHwgKHNlbGYub3BlcmF0aW9ucy5zdGF0ZWZ1bCgpLmxlbmd0aCA+IDApIHx8IGNoaWxkcmVuSGFzQ2hhbmdlcztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwidmFsaWRhdGlvbk1lc3NhZ2VzXCIgdHlwZT1cIm9ic2VydmFibGVBcnJheVwiPkhvbGRzIHRoZSByZWdpb25zIGFuZCBhbnkgb2YgaXRzIGNoaWxkIHJlZ2lvbnMgdmFsaWRhdGlvbiBtZXNzYWdlczwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy52YWxpZGF0aW9uTWVzc2FnZXMgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBtZXNzYWdlcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNvbW1hbmRzID0gc2VsZi5hZ2dyZWdhdGVkQ29tbWFuZHMoKTtcclxuICAgICAgICAgICAgY29tbWFuZHMuZm9yRWFjaChmdW5jdGlvbiAoY29tbWFuZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbW1hbmQuaXNWYWxpZCgpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQudmFsaWRhdG9ycygpLmZvckVhY2goZnVuY3Rpb24gKHZhbGlkYXRvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsaWRhdG9yLmlzVmFsaWQoKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2godmFsaWRhdG9yLm1lc3NhZ2UoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbWVzc2FnZXM7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImlzRXhlY3V0aW5nXCIgdHlwZT1cIm9ic2VydmFibGVcIj5JbmRpY2lhdGVzIHdldGhlciBvciBub3QgZXhlY3V0aW9uIHRhc2tzIGFyZSBiZWluZyBwZXJmb3JtZW5kIGluIHRoaXMgcmVnaW9uIG9yIGFueSBvZiBpdHMgY2hpbGQgcmVnaW9uczwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5pc0V4ZWN1dGluZyA9IHRoaXNPckNoaWxkSGFzVGFza1R5cGUoQmlmcm9zdC50YXNrcy5FeGVjdXRpb25UYXNrLCBcImlzRXhlY3V0aW5nXCIpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJpc0NvbXBvc2luZ1wiIHR5cGU9XCJvYnNlcnZhYmxlXCI+SW5kaWNpYXRlcyB3ZXRoZXIgb3Igbm90IGV4ZWN1dGlvbiB0YXNrcyBhcmUgYmVpbmcgcGVyZm9ybWVuZCBpbiB0aGlzIHJlZ2lvbiBvciBhbnkgb2YgaXRzIGNoaWxkIHJlZ2lvbnM8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuaXNDb21wb3NpbmcgPSB0aGlzT3JDaGlsZEhhc1Rhc2tUeXBlKEJpZnJvc3Qudmlld3MuQ29tcG9zZVRhc2ssIFwiaXNDb21wb3NpbmdcIik7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImlzTG9hZGluZ1wiIHR5cGU9XCJvYnNlcnZhYmxlXCI+SW5kaWNpYXRlcyB3ZXRoZXIgb3Igbm90IGxvYWRpbmcgdGFza3MgYXJlIGJlaW5nIHBlcmZvcm1lbmQgaW4gdGhpcyByZWdpb24gb3IgYW55IG9mIGl0cyBjaGlsZCByZWdpb25zPC9maWVsZD5cclxuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IHRoaXNPckNoaWxkSGFzVGFza1R5cGUoQmlmcm9zdC50YXNrcy5Mb2FkVGFzaywgXCJpc0xvYWRpbmdcIik7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImlzQnVzeVwiIHR5cGU9XCJvYnNlcnZhYmxlXCI+SW5kaWNhdGVzIHdldGhlciBvciBub3QgdGFza3MgYXJlIGJlaW5nIHBlcmZvcm1lZCBpbiB0aGlzIHJlZ2lvbiBvciBhbnkgb2YgaXRzIGNoaWxkIHJlZ2lvbnM8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuaXNCdXN5ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgaXNCdXN5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHNlbGYuY2hpbGRyZW4oKS5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZFJlZ2lvbikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkUmVnaW9uLmlzQnVzeSgpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNCdXN5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNlbGYudGFza3MuYWxsKCkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgaXNCdXN5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGlzQnVzeTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSk7XHJcbkJpZnJvc3Qudmlld3MuUmVnaW9uLmN1cnJlbnQgPSBudWxsOyIsIkJpZnJvc3QuZGVwZW5kZW5jeVJlc29sdmVycy5SZWdpb24gPSB7XHJcbiAgICBjYW5SZXNvbHZlOiBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIG5hbWUgPT09IFwicmVnaW9uXCI7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc29sdmU6IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gQmlmcm9zdC52aWV3cy5SZWdpb24uY3VycmVudDtcclxuICAgIH1cclxufTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgcmVnaW9uTWFuYWdlcjogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKGRvY3VtZW50U2VydmljZSwgcmVnaW9uRGVzY3JpcHRvck1hbmFnZXIsIG1lc3NlbmdlckZhY3RvcnksIG9wZXJhdGlvbnNGYWN0b3J5LCB0YXNrc0ZhY3RvcnkpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyBhIG1hbmFnZXIgdGhhdCBrbm93cyBob3cgdG8gZGVhbCB3aXRoIFJlZ2lvbnMgb24gdGhlIHBhZ2U8L3N1bW1hcnk+XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVSZWdpb25JbnN0YW5jZSgpIHtcclxuICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gbmV3IEJpZnJvc3Qudmlld3MuUmVnaW9uKG1lc3NlbmdlckZhY3RvcnksIG9wZXJhdGlvbnNGYWN0b3J5LCB0YXNrc0ZhY3RvcnkpO1xyXG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbWFuYWdlSW5oZXJpdGFuY2UoZWxlbWVudCkge1xyXG4gICAgICAgICAgICB2YXIgcGFyZW50UmVnaW9uID0gZG9jdW1lbnRTZXJ2aWNlLmdldFBhcmVudFJlZ2lvbkZvcihlbGVtZW50KTtcclxuICAgICAgICAgICAgaWYgKHBhcmVudFJlZ2lvbikge1xyXG4gICAgICAgICAgICAgICAgQmlmcm9zdC52aWV3cy5SZWdpb24ucHJvdG90eXBlID0gcGFyZW50UmVnaW9uO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRvcExldmVsID0gY3JlYXRlUmVnaW9uSW5zdGFuY2UoKTtcclxuICAgICAgICAgICAgICAgIHJlZ2lvbkRlc2NyaXB0b3JNYW5hZ2VyLmRlc2NyaWJlVG9wTGV2ZWwodG9wTGV2ZWwpO1xyXG4gICAgICAgICAgICAgICAgQmlmcm9zdC52aWV3cy5SZWdpb24ucHJvdG90eXBlID0gdG9wTGV2ZWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHBhcmVudFJlZ2lvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG1hbmFnZUhpZXJhcmNoeShwYXJlbnRSZWdpb24pIHtcclxuICAgICAgICAgICAgdmFyIHJlZ2lvbiA9IGNyZWF0ZVJlZ2lvbkluc3RhbmNlKCk7XHJcbiAgICAgICAgICAgIHJlZ2lvbi5wYXJlbnQgPSBwYXJlbnRSZWdpb247XHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRSZWdpb24pIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudFJlZ2lvbi5jaGlsZHJlbi5wdXNoKHJlZ2lvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlZ2lvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0Rm9yID0gZnVuY3Rpb24gKHZpZXcpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkdldHMgdGhlIHJlZ2lvbiBmb3IgdGhlIGdpdmVuIHZpZXcgYW5kIGNyZWF0ZXMgb25lIGlmIG5vbmUgZXhpc3Q8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cInZpZXdcIiB0eXBlPVwiVmlld1wiPlZpZXcgdG8gZ2V0IGEgcmVnaW9uIGZvcjwvcGFyYW0+XHJcbiAgICAgICAgICAgIC8vLyA8cmV0dXJucz5UaGUgcmVnaW9uIGZvciB0aGUgZWxlbWVudDwvcmV0dXJucz5cclxuXHJcbiAgICAgICAgICAgIHZhciByZWdpb247XHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gdmlldy5lbGVtZW50O1xyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnRTZXJ2aWNlLmhhc093blJlZ2lvbihlbGVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgcmVnaW9uID0gZG9jdW1lbnRTZXJ2aWNlLmdldFJlZ2lvbkZvcihlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIHJlZ2lvbi52aWV3KHZpZXcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlZ2lvbjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHBhcmVudFJlZ2lvbiA9IG1hbmFnZUluaGVyaXRhbmNlKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICByZWdpb24gPSBtYW5hZ2VIaWVyYXJjaHkocGFyZW50UmVnaW9uKTtcclxuICAgICAgICAgICAgcmVnaW9uLnZpZXcodmlldyk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50U2VydmljZS5zZXRSZWdpb25PbihlbGVtZW50LCByZWdpb24pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlZ2lvbjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmRlc2NyaWJlID0gZnVuY3Rpb24gKHZpZXcsIHJlZ2lvbikge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+RGVzY3JpYmVzIGEgcmVnaW9uIGZvciBhIHZpZXc8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cInZpZXdcIiB0eXBlPVwiVmlld1wiPlZpZXcgdG8gZGVzY3JpYmUgcmVnaW9uIGZvcjwvcGFyYW0+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cInJlZ2lvblwiIHR5cGU9XCJSZWdpb25cIj5SZWdpb24gdG8gZGVzY3JpYmUgZm9yPC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxyZXR1cm5zPkEgcHJvbWlzZSB0aGF0IGNhbiBiZSBjb250aW51ZWQgZm9yIHdoZW4gdGhlIGRlc2NyaXB0aW9uIGlzIGRvbmU8L3JldHVybnM+XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSB2aWV3LmVsZW1lbnQ7XHJcblxyXG4gICAgICAgICAgICByZWdpb25EZXNjcmlwdG9yTWFuYWdlci5kZXNjcmliZSh2aWV3LCByZWdpb24pLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRDdXJyZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+R2V0cyB0aGUgY3VycmVudCByZWdpb248L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIHJldHVybiBCaWZyb3N0LnZpZXdzLlJlZ2lvbi5jdXJyZW50O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZXZpY3QgPSBmdW5jdGlvbiAocmVnaW9uKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5FdmljdCBhIHJlZ2lvbiBmcm9tIHRoZSBwYWdlPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJyZWdpb25cIiB0eXBlPVwiQmlmcm9zdC52aWV3cy5SZWdpb25cIj5SZWdpb24gdG8gZXZpY3Q8L3BhcmFtPlxyXG5cclxuICAgICAgICAgICAgaWYgKHJlZ2lvbi5wYXJlbnRSZWdpb24pIHtcclxuICAgICAgICAgICAgICAgIHJlZ2lvbi5wYXJlbnRSZWdpb24uY2hpbGRyZW4ucmVtb3ZlKHJlZ2lvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVnaW9uLnBhcmVudFJlZ2lvbiA9IG51bGw7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLnJlZ2lvbk1hbmFnZXIgPSBCaWZyb3N0LnZpZXdzLnJlZ2lvbk1hbmFnZTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgUmVnaW9uRGVzY3JpcHRvcjogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5kZXNjcmliZSA9IGZ1bmN0aW9uIChyZWdpb24pIHtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIHJlZ2lvbkRlc2NyaXB0b3JNYW5hZ2VyOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSBtYW5hZ2VyIHRoYXQga25vd3MgaG93IHRvIG1hbmFnZSByZWdpb24gZGVzY3JpcHRvcnM8L3N1bW1hcnk+XHJcblxyXG4gICAgICAgIHRoaXMuZGVzY3JpYmUgPSBmdW5jdGlvbiAodmlldywgcmVnaW9uKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5EZXNjcmliZSBhIHNwZWNpZmljIHJlZ2lvbiByZWxhdGVkIHRvIGEgdmlldzwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwidmlld1wiIHR5cGU9XCJCaWZyb3N0LnZpZXdzLlZpZXdcIj5WaWV3IHJlbGF0ZWQgdG8gdGhlIHJlZ2lvbjwvcGFyYW0+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cInJlZ2lvblwiIHR5cGU9XCJCaWZyb3N0LnZpZXdzLlJlZ2lvblwiPlJlZ2lvbiB0aGF0IG5lZWRzIHRvIGJlIGRlc2NyaWJlZDwvcGFyYW0+XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgdmFyIGxvY2FsUGF0aCA9IEJpZnJvc3QuUGF0aC5nZXRQYXRoV2l0aG91dEZpbGVuYW1lKHZpZXcucGF0aCk7XHJcbiAgICAgICAgICAgIHZhciBuYW1lc3BhY2VQYXRoID0gQmlmcm9zdC5uYW1lc3BhY2VNYXBwZXJzLm1hcFBhdGhUb05hbWVzcGFjZShsb2NhbFBhdGgpO1xyXG4gICAgICAgICAgICBpZiAobmFtZXNwYWNlUGF0aCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmFtZXNwYWNlID0gQmlmcm9zdC5uYW1lc3BhY2UobmFtZXNwYWNlUGF0aCk7XHJcblxyXG4gICAgICAgICAgICAgICAgQmlmcm9zdC52aWV3cy5SZWdpb24uY3VycmVudCA9IHJlZ2lvbjtcclxuICAgICAgICAgICAgICAgIEJpZnJvc3QuZGVwZW5kZW5jeVJlc29sdmVyLmJlZ2luUmVzb2x2ZShuYW1lc3BhY2UsIFwiUmVnaW9uRGVzY3JpcHRvclwiKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKGRlc2NyaXB0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdG9yLmRlc2NyaWJlKHJlZ2lvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoKTtcclxuICAgICAgICAgICAgICAgIH0pLm9uRmFpbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmRlc2NyaWJlVG9wTGV2ZWwgPSBmdW5jdGlvbiAocmVnaW9uKSB7XHJcblxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlcnMuUmVnaW9uRGVzY3JpcHRvciA9IHtcclxuICAgIGNhblJlc29sdmU6IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gbmFtZSA9PT0gXCJSZWdpb25EZXNjcmlwdG9yXCI7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc29sdmU6IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBkZXNjcmliZTogZnVuY3Rpb24gKCkgeyB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgRGF0YVZpZXdBdHRyaWJ1dGVFbGVtZW50VmlzaXRvcjogQmlmcm9zdC5tYXJrdXAuRWxlbWVudFZpc2l0b3IuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnZpc2l0ID0gZnVuY3Rpb24gKGVsZW1lbnQsIGFjdGlvbnMpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBkYXRhVmlldyA9IGVsZW1lbnQuYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oXCJkYXRhLXZpZXdcIik7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChkYXRhVmlldykpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRhQmluZFN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YUJpbmQgPSBlbGVtZW50LmF0dHJpYnV0ZXMuZ2V0TmFtZWRJdGVtKFwiZGF0YS1iaW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGRhdGFCaW5kKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFCaW5kU3RyaW5nID0gZGF0YUJpbmQudmFsdWUgKyBcIiwgXCI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFCaW5kID0gZG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKFwiZGF0YS1iaW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZGF0YUJpbmQudmFsdWUgPSBkYXRhQmluZFN0cmluZyArIFwidmlldzogJ1wiICsgZGF0YVZpZXcudmFsdWUgKyBcIidcIjtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cmlidXRlcy5zZXROYW1lZEl0ZW0oZGF0YUJpbmQpO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyaWJ1dGVzLnJlbW92ZU5hbWVkSXRlbShcImRhdGEtdmlld1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgRGF0YVZpZXdNb2RlbEZpbGVBdHRyaWJ1dGVFbGVtZW50VmlzaXRvcjogQmlmcm9zdC5tYXJrdXAuRWxlbWVudFZpc2l0b3IuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnZpc2l0ID0gZnVuY3Rpb24gKGVsZW1lbnQsIGFjdGlvbnMpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBkYXRhVmlldyA9IGVsZW1lbnQuYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oXCJkYXRhLXZpZXdtb2RlbC1maWxlXCIpO1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoZGF0YVZpZXcpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YUJpbmRTdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGFCaW5kID0gZWxlbWVudC5hdHRyaWJ1dGVzLmdldE5hbWVkSXRlbShcImRhdGEtYmluZFwiKTtcclxuICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChkYXRhQmluZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhQmluZFN0cmluZyA9IGRhdGFCaW5kLnZhbHVlICsgXCIsIFwiO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhQmluZCA9IGRvY3VtZW50LmNyZWF0ZUF0dHJpYnV0ZShcImRhdGEtYmluZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRhdGFCaW5kLnZhbHVlID0gZGF0YUJpbmRTdHJpbmcgKyBcInZpZXdNb2RlbDogJ1wiICsgZGF0YVZpZXcudmFsdWUgKyBcIidcIjtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cmlidXRlcy5zZXROYW1lZEl0ZW0oZGF0YUJpbmQpO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyaWJ1dGVzLnJlbW92ZU5hbWVkSXRlbShcImRhdGEtdmlld21vZGVsLWZpbGVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmludGVyYWN0aW9uXCIsIHtcclxuICAgIFZpc3VhbFN0YXRlTWFuYWdlckVsZW1lbnRWaXNpdG9yOiBCaWZyb3N0Lm1hcmt1cC5FbGVtZW50VmlzaXRvci5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB2aXN1YWxTdGF0ZUFjdGlvblR5cGVzID0gQmlmcm9zdC5pbnRlcmFjdGlvbi5WaXN1YWxTdGF0ZUFjdGlvbi5nZXRFeHRlbmRlcnMoKTtcclxuXHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwYXJzZUFjdGlvbnMobmFtaW5nUm9vdCwgc3RhdGVFbGVtZW50LCBzdGF0ZSkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBwYXJzZUFjdGlvbih0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZS5fbmFtZS50b0xvd2VyQ2FzZSgpID09PSBjaGlsZC5sb2NhbE5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYWN0aW9uID0gdHlwZS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgYXR0cmlidXRlSW5kZXggPSAwOyBhdHRyaWJ1dGVJbmRleCA8IGNoaWxkLmF0dHJpYnV0ZXMubGVuZ3RoOyBhdHRyaWJ1dGVJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuYW1lID0gY2hpbGQuYXR0cmlidXRlc1thdHRyaWJ1dGVJbmRleF0ubG9jYWxOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBjaGlsZC5hdHRyaWJ1dGVzW2F0dHJpYnV0ZUluZGV4XS52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGlvbi5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uW25hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uLmluaXRpYWxpemUobmFtaW5nUm9vdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYWRkQWN0aW9uKGFjdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChzdGF0ZUVsZW1lbnQuaGFzQ2hpbGROb2RlcygpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBzdGF0ZUVsZW1lbnQuZmlyc3RDaGlsZDtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChjaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpc3VhbFN0YXRlQWN0aW9uVHlwZXMuZm9yRWFjaChwYXJzZUFjdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQgPSBjaGlsZC5uZXh0U2libGluZztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcGFyc2VTdGF0ZXMobmFtaW5nUm9vdCwgZ3JvdXBFbGVtZW50LCBncm91cCkge1xyXG4gICAgICAgICAgICBpZiggZ3JvdXBFbGVtZW50Lmhhc0NoaWxkTm9kZXMoKSApIHtcclxuICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IGdyb3VwRWxlbWVudC5maXJzdENoaWxkO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUoIGNoaWxkICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCBjaGlsZC5sb2NhbE5hbWUgPT09IFwidmlzdWFsc3RhdGVcIiApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gQmlmcm9zdC5pbnRlcmFjdGlvbi5WaXN1YWxTdGF0ZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUubmFtZSA9IGNoaWxkLmdldEF0dHJpYnV0ZShcIm5hbWVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwLmFkZFN0YXRlKHN0YXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VBY3Rpb25zKG5hbWluZ1Jvb3QsIGNoaWxkLCBzdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkID0gY2hpbGQubmV4dFNpYmxpbmc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLnZpc2l0ID0gZnVuY3Rpb24gKGVsZW1lbnQsIGFjdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQubG9jYWxOYW1lID09PSBcInZpc3VhbHN0YXRlbWFuYWdlclwiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmlzdWFsU3RhdGVNYW5hZ2VyID0gQmlmcm9zdC5pbnRlcmFjdGlvbi5WaXN1YWxTdGF0ZU1hbmFnZXIuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmFtaW5nUm9vdCA9IGVsZW1lbnQucGFyZW50RWxlbWVudC5uYW1pbmdSb290O1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5wYXJlbnRFbGVtZW50LnZpc3VhbFN0YXRlTWFuYWdlciA9IHZpc3VhbFN0YXRlTWFuYWdlcjtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5oYXNDaGlsZE5vZGVzKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBlbGVtZW50LmZpcnN0Q2hpbGQ7XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGNoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZC5sb2NhbE5hbWUgPT09IFwidmlzdWFsc3RhdGVncm91cFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZ3JvdXAgPSBCaWZyb3N0LmludGVyYWN0aW9uLlZpc3VhbFN0YXRlR3JvdXAuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aXN1YWxTdGF0ZU1hbmFnZXIuYWRkR3JvdXAoZ3JvdXApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkdXJhdGlvbiA9IGNoaWxkLmdldEF0dHJpYnV0ZShcImR1cmF0aW9uXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGR1cmF0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uID0gcGFyc2VGbG9hdChkdXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc05hTihkdXJhdGlvbikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb24gPSBkdXJhdGlvbiAqIDEwMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aW1lc3BhbiA9IEJpZnJvc3QuVGltZVNwYW4uZnJvbU1pbGxpc2Vjb25kcyhkdXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwLmRlZmF1bHREdXJhdGlvbiA9IHRpbWVzcGFuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZVN0YXRlcyhuYW1pbmdSb290LCBjaGlsZCwgZ3JvdXApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkID0gY2hpbGQubmV4dFNpYmxpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubmF2aWdhdGlvblwiLCB7XHJcbiAgICBOYXZpZ2F0aW9uRnJhbWU6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKGhvbWUsIHVyaU1hcHBlciwgaGlzdG9yeSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5ob21lID0gaG9tZTtcclxuICAgICAgICB0aGlzLmhpc3RvcnkgPSBoaXN0b3J5O1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VXJpID0ga28ub2JzZXJ2YWJsZShob21lKTtcclxuICAgICAgICB0aGlzLnVyaU1hcHBlciA9IHVyaU1hcHBlciB8fCBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnNldEN1cnJlbnRVcmkgPSBmdW5jdGlvbiAocGF0aCkge1xyXG4gICAgICAgICAgICBpZiAocGF0aC5pbmRleE9mKFwiL1wiKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwYXRoLmxhc3RJbmRleE9mKFwiL1wiKSA9PT0gcGF0aC5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICBwYXRoID0gcGF0aC5zdWJzdHIoMCwgcGF0aC5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocGF0aCA9PSBudWxsIHx8IHBhdGgubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBwYXRoID0gc2VsZi5ob21lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnVyaU1hcHBlciAhPSBudWxsICYmICFzZWxmLnVyaU1hcHBlci5oYXNNYXBwaW5nRm9yKHBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICBwYXRoID0gc2VsZi5ob21lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNlbGYuY3VycmVudFVyaShwYXRoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNldEN1cnJlbnRVcmlGcm9tQ3VycmVudExvY2F0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgc3RhdGUgPSBzZWxmLmhpc3RvcnkuZ2V0U3RhdGUoKTtcclxuICAgICAgICAgICAgdmFyIHVyaSA9IEJpZnJvc3QuVXJpLmNyZWF0ZShzdGF0ZS51cmwpO1xyXG4gICAgICAgICAgICBzZWxmLnNldEN1cnJlbnRVcmkodXJpLnBhdGgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGhpc3RvcnkuQWRhcHRlci5iaW5kKHdpbmRvdywgXCJzdGF0ZWNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0Q3VycmVudFVyaUZyb21DdXJyZW50TG9jYXRpb24oKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25maWd1cmVGb3IgPSBmdW5jdGlvbiAoY29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0Q3VycmVudFVyaUZyb21DdXJyZW50TG9jYXRpb24oKTtcclxuICAgICAgICAgICAgc2VsZi5jb250YWluZXIgPSBjb250YWluZXI7XHJcblxyXG4gICAgICAgICAgICB2YXIgdXJpTWFwcGVyID0gJChjb250YWluZXIpLmNsb3Nlc3QoXCJbZGF0YS11cmltYXBwZXJdXCIpO1xyXG4gICAgICAgICAgICBpZiAodXJpTWFwcGVyLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHVyaU1hcHBlck5hbWUgPSAkKHVyaU1hcHBlclswXSkuZGF0YShcInVyaW1hcHBlclwiKTtcclxuICAgICAgICAgICAgICAgIGlmICh1cmlNYXBwZXJOYW1lIGluIEJpZnJvc3QudXJpTWFwcGVycykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXJpTWFwcGVyID0gQmlmcm9zdC51cmlNYXBwZXJzW3VyaU1hcHBlck5hbWVdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnVyaU1hcHBlciA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnVyaU1hcHBlciA9IEJpZnJvc3QudXJpTWFwcGVycy5kZWZhdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZSA9IGZ1bmN0aW9uICh1cmkpIHtcclxuICAgICAgICAgICAgc2VsZi5zZXRDdXJyZW50VXJpKHVyaSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9KVxyXG59KTsiLCJpZiAodHlwZW9mIGtvICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgSGlzdG9yeSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgSGlzdG9yeS5BZGFwdGVyICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICBrby5iaW5kaW5nSGFuZGxlcnMubmF2aWdhdGVUbyA9IHtcclxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ0FjY2Vzc29yLCB2aWV3TW9kZWwpIHtcclxuICAgICAgICAgICAga28uYXBwbHlCaW5kaW5nc1RvTm9kZShlbGVtZW50LCB7XHJcbiAgICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZlYXR1cmVOYW1lID0gdmFsdWVBY2Nlc3NvcigpKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgSGlzdG9yeS5wdXNoU3RhdGUoe2ZlYXR1cmU6ZmVhdHVyZU5hbWV9LCQoZWxlbWVudCkuYXR0cihcInRpdGxlXCIpLFwiL1wiKyBmZWF0dXJlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHZpZXdNb2RlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5uYXZpZ2F0aW9uXCIsIHtcclxuICAgIG5hdmlnYXRlVG86IGZ1bmN0aW9uIChmZWF0dXJlTmFtZSwgcXVlcnlTdHJpbmcpIHtcclxuICAgICAgICB2YXIgdXJsID0gZmVhdHVyZU5hbWU7XHJcblxyXG4gICAgICAgIGlmIChmZWF0dXJlTmFtZS5jaGFyQXQoMCkgIT09IFwiL1wiKSB7XHJcbiAgICAgICAgICAgIHVybCA9IFwiL1wiICsgdXJsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHF1ZXJ5U3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHVybCArPSBxdWVyeVN0cmluZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRPRE86IFN1cHBvcnQgdGl0bGUgc29tZWhvd1xyXG4gICAgICAgIGlmICh0eXBlb2YgSGlzdG9yeSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgSGlzdG9yeS5BZGFwdGVyICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIEhpc3RvcnkucHVzaFN0YXRlKHt9LCBcIlwiLCB1cmwpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBuYXZpZ2F0aW9uTWFuYWdlcjoge1xyXG4gICAgICAgIGdldEN1cnJlbnRMb2NhdGlvbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciB1cmkgPSBCaWZyb3N0LlVyaS5jcmVhdGUod2luZG93LmxvY2F0aW9uLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gdXJpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGhvb2t1cDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIEhpc3RvcnkgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIEhpc3RvcnkuQWRhcHRlciAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgJChcImJvZHlcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaHJlZiA9IGUudGFyZ2V0LmhyZWY7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBocmVmID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjbG9zZXN0QW5jaG9yID0gJChlLnRhcmdldCkuY2xvc2VzdChcImFcIilbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY2xvc2VzdEFuY2hvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhyZWYgPSBjbG9zZXN0QW5jaG9yLmhyZWY7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChocmVmLmluZGV4T2YoXCIjIVwiKSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHJlZiA9IGhyZWYuc3Vic3RyKDAsIGhyZWYuaW5kZXhPZihcIiMhXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChocmVmLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBocmVmID0gXCIvXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXRVcmkgPSBCaWZyb3N0LlVyaS5jcmVhdGUoaHJlZik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldFVyaS5pc1NhbWVBc09yaWdpbiAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRVcmkucXVlcnlTdHJpbmcuaW5kZXhPZihcInBvc3RiYWNrXCIpPDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IHRhcmdldFVyaS5wYXRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAodGFyZ2V0LmluZGV4T2YoXCIvXCIpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQuc3Vic3RyKDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSAkKGUudGFyZ2V0KS5jbG9zZXN0KFwiW2RhdGEtbmF2aWdhdGlvbi10YXJnZXRdXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gJChyZXN1bHRbMF0pLmRhdGEoXCJuYXZpZ2F0aW9uLXRhcmdldFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gJChcIiNcIitpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5sZW5ndGggPT09IDEgJiYgdHlwZW9mIGVsZW1lbnRbMF0ubmF2aWdhdGlvbkZyYW1lICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFswXS5uYXZpZ2F0aW9uRnJhbWUubmF2aWdhdGUodGFyZ2V0VXJpLnBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFbGVtZW50IG5vdCBmb3VuZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHF1ZXJ5U3RyaW5nID0gdGFyZ2V0VXJpLnF1ZXJ5U3RyaW5nLmxlbmd0aCA+IDAgPyBcIj9cIiArIHRhcmdldFVyaS5xdWVyeVN0cmluZyA6IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBIaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJcIiwgXCIvXCIgKyB0YXJnZXQgKyBxdWVyeVN0cmluZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm5hdmlnYXRpb25cIiwge1xyXG4gICAgb2JzZXJ2YWJsZVF1ZXJ5UGFyYW1ldGVyRmFjdG9yeTogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIGhpc3RvcnlFbmFibGVkID0gdHlwZW9mIEhpc3RvcnkgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIEhpc3RvcnkuQWRhcHRlciAhPT0gXCJ1bmRlZmluZWRcIjtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAocGFyYW1ldGVyTmFtZSwgZGVmYXVsdFZhbHVlLCBuYXZpZ2F0aW9uTWFuYWdlcikge1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0U3RhdGUoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJpID0gbmF2aWdhdGlvbk1hbmFnZXIuZ2V0Q3VycmVudExvY2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodXJpLnBhcmFtZXRlcnMuaGFzT3duUHJvcGVydHkocGFyYW1ldGVyTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXJpLnBhcmFtZXRlcnNbcGFyYW1ldGVyTmFtZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBvYnNlcnZhYmxlID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmIChoaXN0b3J5RW5hYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgSGlzdG9yeS5BZGFwdGVyLmJpbmQod2luZG93LCBcInN0YXRlY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JzZXJ2YWJsZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmFibGUoZ2V0U3RhdGUoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImhhc2hjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYnNlcnZhYmxlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gZ2V0U3RhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9ic2VydmFibGUoKSAhPT0gc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmFibGUoc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgc3RhdGUgPSBnZXRTdGF0ZSgpO1xyXG4gICAgICAgICAgICBvYnNlcnZhYmxlID0ga28ub2JzZXJ2YWJsZShzdGF0ZSB8fCBkZWZhdWx0VmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0UXVlcnlTdHJpbmdQYXJhbWV0ZXJzV2l0aFZhbHVlRm9yUGFyYW1ldGVyKHVybCwgcGFyYW1ldGVyVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJhbWV0ZXJzID0gQmlmcm9zdC5oYXNoU3RyaW5nLmRlY29kZSh1cmwpO1xyXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyc1twYXJhbWV0ZXJOYW1lXSA9IHBhcmFtZXRlclZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBxdWVyeVN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyYW1ldGVySW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcGFyYW1ldGVyIGluIHBhcmFtZXRlcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBwYXJhbWV0ZXJzW3BhcmFtZXRlcl07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW1ldGVySW5kZXggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVyeVN0cmluZyArPSBcIiZcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeVN0cmluZyArPSBwYXJhbWV0ZXIgKyBcIj1cIiArIHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJJbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBxdWVyeVN0cmluZztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY2xlYW5RdWVyeVN0cmluZyhxdWVyeVN0cmluZykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHF1ZXJ5U3RyaW5nLmluZGV4T2YoXCIjXCIpID09PSAwIHx8IHF1ZXJ5U3RyaW5nLmluZGV4T2YoXCI/XCIpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVlcnlTdHJpbmcgPSBxdWVyeVN0cmluZy5zdWJzdHIoMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcXVlcnlTdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG9ic2VydmFibGUuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHF1ZXJ5U3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgaWYgKGhpc3RvcnlFbmFibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gSGlzdG9yeS5nZXRTdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlW3BhcmFtZXRlck5hbWVdID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVlcnlTdHJpbmcgPSBcIj9cIiArIGdldFF1ZXJ5U3RyaW5nUGFyYW1ldGVyc1dpdGhWYWx1ZUZvclBhcmFtZXRlcihjbGVhblF1ZXJ5U3RyaW5nKHN0YXRlLnVybCksIG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBIaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZSwgc3RhdGUudGl0bGUsIHF1ZXJ5U3RyaW5nKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVlcnlTdHJpbmcgPSBcIiNcIiArIGdldFF1ZXJ5U3RyaW5nUGFyYW1ldGVyc1dpdGhWYWx1ZUZvclBhcmFtZXRlcihjbGVhblF1ZXJ5U3RyaW5nKGRvY3VtZW50LmxvY2F0aW9uLmhhc2gpLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaGFzaCA9IHF1ZXJ5U3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuXHJcbmtvLm9ic2VydmFibGVRdWVyeVBhcmFtZXRlciA9IGZ1bmN0aW9uIChwYXJhbWV0ZXJOYW1lLCBkZWZhdWx0VmFsdWUpIHtcclxuICAgIHZhciBuYXZpZ2F0aW9uTWFuYWdlciA9IEJpZnJvc3QubmF2aWdhdGlvbi5uYXZpZ2F0aW9uTWFuYWdlcjtcclxuICAgIHZhciBvYnNlcnZhYmxlID0gQmlmcm9zdC5uYXZpZ2F0aW9uLm9ic2VydmFibGVRdWVyeVBhcmFtZXRlckZhY3RvcnkuY3JlYXRlKCkuY3JlYXRlKHBhcmFtZXRlck5hbWUsIGRlZmF1bHRWYWx1ZSwgbmF2aWdhdGlvbk1hbmFnZXIpO1xyXG4gICAgcmV0dXJuIG9ic2VydmFibGU7XHJcbn07XHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5uYXZpZ2F0aW9uXCIsIHtcclxuICAgIERhdGFOYXZpZ2F0aW9uRnJhbWVBdHRyaWJ1dGVFbGVtZW50VmlzaXRvcjogQmlmcm9zdC5tYXJrdXAuRWxlbWVudFZpc2l0b3IuZXh0ZW5kKGZ1bmN0aW9uIChkb2N1bWVudFNlcnZpY2UpIHtcclxuICAgICAgICB0aGlzLnZpc2l0ID0gZnVuY3Rpb24gKGVsZW1lbnQsIGFjdGlvbnMpIHtcclxuICAgICAgICAgICAgdmFyIGRhdGFOYXZpZ2F0aW9uRnJhbWUgPSBlbGVtZW50LmF0dHJpYnV0ZXMuZ2V0TmFtZWRJdGVtKFwiZGF0YS1uYXZpZ2F0aW9uLWZyYW1lXCIpO1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoZGF0YU5hdmlnYXRpb25GcmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRhQmluZFN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YUJpbmQgPSBlbGVtZW50LmF0dHJpYnV0ZXMuZ2V0TmFtZWRJdGVtKFwiZGF0YS1iaW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGRhdGFCaW5kKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFCaW5kU3RyaW5nID0gZGF0YUJpbmQudmFsdWUgKyBcIiwgXCI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFCaW5kID0gZG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKFwiZGF0YS1iaW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZGF0YUJpbmQudmFsdWUgPSBkYXRhQmluZFN0cmluZyArIFwibmF2aWdhdGlvbjogJ1wiICsgZGF0YU5hdmlnYXRpb25GcmFtZS52YWx1ZSArIFwiJ1wiO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyaWJ1dGVzLnNldE5hbWVkSXRlbShkYXRhQmluZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyaWJ1dGVzLnJlbW92ZU5hbWVkSXRlbShcImRhdGEtbmF2aWdhdGlvbi1mcmFtZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm5hdmlnYXRpb25cIiwge1xyXG4gICAgbmF2aWdhdGlvbkJpbmRpbmdIYW5kbGVyOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmdW5jdGlvbiBnZXROYXZpZ2F0aW9uRnJhbWVGb3IodmFsdWVBY2Nlc3Nvcikge1xyXG4gICAgICAgICAgICB2YXIgY29uZmlndXJhdGlvblN0cmluZyA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKTtcclxuICAgICAgICAgICAgdmFyIGNvbmZpZ3VyYXRpb25JdGVtcyA9IGtvLmV4cHJlc3Npb25SZXdyaXRpbmcucGFyc2VPYmplY3RMaXRlcmFsKGNvbmZpZ3VyYXRpb25TdHJpbmcpO1xyXG4gICAgICAgICAgICB2YXIgY29uZmlndXJhdGlvbiA9IHt9O1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGNvbmZpZ3VyYXRpb25JdGVtcy5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gY29uZmlndXJhdGlvbkl0ZW1zW2luZGV4XTtcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25baXRlbS5rZXkudHJpbSgpXSA9IGl0ZW0udmFsdWUudHJpbSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgdXJpTWFwcGVyTmFtZSA9IGNvbmZpZ3VyYXRpb24udXJpTWFwcGVyO1xyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh1cmlNYXBwZXJOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgdXJpTWFwcGVyTmFtZSA9IFwiZGVmYXVsdFwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgbWFwcGVyID0gQmlmcm9zdC51cmlNYXBwZXJzW3VyaU1hcHBlck5hbWVdO1xyXG4gICAgICAgICAgICB2YXIgZnJhbWUgPSBCaWZyb3N0Lm5hdmlnYXRpb24uTmF2aWdhdGlvbkZyYW1lLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBsb2NhdGlvbkF3YXJlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHVyaU1hcHBlcjogbWFwcGVyLFxyXG4gICAgICAgICAgICAgICAgaG9tZTogY29uZmlndXJhdGlvbi5ob21lIHx8ICcnXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZyYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbWFrZVZhbHVlQWNjZXNzb3IobmF2aWdhdGlvbkZyYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmF2aWdhdGlvbkZyYW1lLmN1cnJlbnRVcmkoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5nc0FjY2Vzc29yLCB2aWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KSB7XHJcbiAgICAgICAgICAgIHZhciBuYXZpZ2F0aW9uRnJhbWUgPSBnZXROYXZpZ2F0aW9uRnJhbWVGb3IodmFsdWVBY2Nlc3Nvcik7XHJcbiAgICAgICAgICAgIG5hdmlnYXRpb25GcmFtZS5jb25maWd1cmVGb3IoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIHJldHVybiBrby5iaW5kaW5nSGFuZGxlcnMudmlldy5pbml0KGVsZW1lbnQsIG1ha2VWYWx1ZUFjY2Vzc29yKG5hdmlnYXRpb25GcmFtZSksIGFsbEJpbmRpbmdzQWNjZXNzb3IsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3NBY2Nlc3Nvciwgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCkge1xyXG4gICAgICAgICAgICB2YXIgbmF2aWdhdGlvbkZyYW1lID0gZ2V0TmF2aWdhdGlvbkZyYW1lRm9yKHZhbHVlQWNjZXNzb3IpO1xyXG4gICAgICAgICAgICBuYXZpZ2F0aW9uRnJhbWUuY29uZmlndXJlRm9yKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4ga28uYmluZGluZ0hhbmRsZXJzLnZpZXcudXBkYXRlKGVsZW1lbnQsIG1ha2VWYWx1ZUFjY2Vzc29yKG5hdmlnYXRpb25GcmFtZSksIGFsbEJpbmRpbmdzQWNjZXNzb3IsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5uYXZpZ2F0aW9uLm5hdmlnYXRpb25CaW5kaW5nSGFuZGxlci5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xyXG4gICAga28uYmluZGluZ0hhbmRsZXJzLm5hdmlnYXRpb24gPSBCaWZyb3N0Lm5hdmlnYXRpb24ubmF2aWdhdGlvbkJpbmRpbmdIYW5kbGVyLmNyZWF0ZSgpO1xyXG4gICAga28uanNvbkV4cHJlc3Npb25SZXdyaXRpbmcuYmluZGluZ1Jld3JpdGVWYWxpZGF0b3JzLm5hdmlnYXRpb24gPSBmYWxzZTsgLy8gQ2FuJ3QgcmV3cml0ZSBjb250cm9sIGZsb3cgYmluZGluZ3NcclxuICAgIGtvLnZpcnR1YWxFbGVtZW50cy5hbGxvd2VkQmluZGluZ3MubmF2aWdhdGlvbiA9IHRydWU7XHJcbn07XHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWx1ZXNcIiwge1xyXG4gICAgVHlwZUNvbnZlcnRlcjogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5zdXBwb3J0ZWRUeXBlID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5jb252ZXJ0RnJvbSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jb252ZXJ0VG8gPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsdWVzXCIsIHtcclxuICAgIE51bWJlclR5cGVDb252ZXJ0ZXI6IEJpZnJvc3QudmFsdWVzLlR5cGVDb252ZXJ0ZXIuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYWxsb3dlZENoYXJhY3RlcnMgPSBcIjAxMjM0NTY3ODkuLC1cIjtcclxuXHJcbiAgICAgICAgdGhpcy5zdXBwb3J0ZWRUeXBlID0gTnVtYmVyO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBzdHJpcExldHRlcnModmFsdWUpIHtcclxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICB2YXIgcmV0dXJuVmFsdWUgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgY2hhckluZGV4ID0gMDsgY2hhckluZGV4IDwgdmFsdWUubGVuZ3RoOyBjaGFySW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBhbGxvd2VkQ2hhckluZGV4ID0gMDsgYWxsb3dlZENoYXJJbmRleCA8IGFsbG93ZWRDaGFyYWN0ZXJzLmxlbmd0aDsgYWxsb3dlZENoYXJJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlW2NoYXJJbmRleF0gPT09IGFsbG93ZWRDaGFyYWN0ZXJzW2FsbG93ZWRDaGFySW5kZXhdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSByZXR1cm5WYWx1ZSArIHZhbHVlW2NoYXJJbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb252ZXJ0RnJvbSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUuY29uc3RydWN0b3IgPT09IE51bWJlcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFsdWUgPSBzdHJpcExldHRlcnModmFsdWUpO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gMDtcclxuICAgICAgICAgICAgaWYgKHZhbHVlLmluZGV4T2YoXCIuXCIpID49IDApIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHBhcnNlRmxvYXQodmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcGFyc2VJbnQodmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWx1ZXNcIiwge1xyXG4gICAgRGF0ZVR5cGVDb252ZXJ0ZXI6IEJpZnJvc3QudmFsdWVzLlR5cGVDb252ZXJ0ZXIuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnN1cHBvcnRlZFR5cGUgPSBEYXRlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBpc051bGwodGltZSkge1xyXG4gICAgICAgICAgICAvLyBUcmVhdCBzZXJpYWxpemF0aW9uIG9mIGRlZmF1bHQoRGF0ZVRpbWUpIGZyb20gc2VydmVyIGFzIG51bGwuXHJcbiAgICAgICAgICAgIHJldHVybiBCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHRpbWUpIHx8XHJcbiAgICAgICAgICAgICAgICAvLyBJU08gODYwMSBmb3JtYXRzIGZvciBkZWZhdWx0KERhdGVUaW1lKTpcclxuICAgICAgICAgICAgICAgIHRpbWUgPT09IFwiMDAwMS0wMS0wMVQwMDowMDowMFwiIHx8XHJcbiAgICAgICAgICAgICAgICB0aW1lID09PSBcIjAwMDEtMDEtMDFUMDA6MDA6MDBaXCIgfHxcclxuICAgICAgICAgICAgICAgIC8vIG5ldyBEYXRlKFwiMDAwMS0wMS0wMVQwMDowMDowMFwiKSBpbiBDaHJvbWUgYW5kIEZpcmVmb3g6XHJcbiAgICAgICAgICAgICAgICAodGltZSBpbnN0YW5jZW9mIERhdGUgJiYgdGltZS5nZXRUaW1lKCkgPT09IC02MjEzNTU5NjgwMDAwMCkgfHxcclxuICAgICAgICAgICAgICAgIC8vIG5ldyBEYXRlKFwiMDAwMS0wMS0wMVQwMDowMDowMFwiKSBvciBhbnkgb3RoZXIgaW52YWxpZCBkYXRlIGluIEludGVybmV0IEV4cGxvcmVyOlxyXG4gICAgICAgICAgICAgICAgKHRpbWUgaW5zdGFuY2VvZiBEYXRlICYmIGlzTmFOKHRpbWUuZ2V0VGltZSgpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbnZlcnRGcm9tID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmIChpc051bGwodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jb252ZXJ0VG8gPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmZvcm1hdChcInl5eXktTU0tZGRcIik7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWx1ZXNcIiwge1xyXG4gICAgU3RyaW5nVHlwZUNvbnZlcnRlcjogQmlmcm9zdC52YWx1ZXMuVHlwZUNvbnZlcnRlci5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuc3VwcG9ydGVkVHlwZSA9IFN0cmluZztcclxuXHJcbiAgICAgICAgdGhpcy5jb252ZXJ0RnJvbSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbHVlc1wiLCB7XHJcbiAgICB0eXBlQ29udmVydGVyczogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBjb252ZXJ0ZXJzQnlUeXBlID0ge307XHJcblxyXG4gICAgICAgIHZhciB0eXBlQ29udmVydGVyVHlwZXMgPSBCaWZyb3N0LnZhbHVlcy5UeXBlQ29udmVydGVyLmdldEV4dGVuZGVycygpO1xyXG4gICAgICAgIHR5cGVDb252ZXJ0ZXJUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgIHZhciBjb252ZXJ0ZXIgPSB0eXBlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICBjb252ZXJ0ZXJzQnlUeXBlW2NvbnZlcnRlci5zdXBwb3J0ZWRUeXBlXSA9IGNvbnZlcnRlcjtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb252ZXJ0RnJvbSA9IGZ1bmN0aW9uICh2YWx1ZSwgdHlwZSkge1xyXG4gICAgICAgICAgICB2YXIgYWN0dWFsVHlwZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzU3RyaW5nKHR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICBhY3R1YWxUeXBlID0gZXZhbCh0eXBlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFjdHVhbFR5cGUgPSB0eXBlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb252ZXJ0ZXJzQnlUeXBlLmhhc093blByb3BlcnR5KGFjdHVhbFR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udmVydGVyc0J5VHlwZVthY3R1YWxUeXBlXS5jb252ZXJ0RnJvbSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNvbnZlcnRUbyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKHZhciBjb252ZXJ0ZXIgaW4gY29udmVydGVyc0J5VHlwZSkge1xyXG4gICAgICAgICAgICAgICAgLyoganNoaW50IGVxZXFlcTogZmFsc2UgKi9cclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5jb25zdHJ1Y3RvciA9PSBjb252ZXJ0ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udmVydGVyc0J5VHlwZVtjb252ZXJ0ZXJdLmNvbnZlcnRUbyh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIudHlwZXMudHlwZUNvbnZlcnRlcnMgPSBCaWZyb3N0LnZhbHVlcy50eXBlQ29udmVydGVycztcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbHVlc1wiLCB7XHJcbiAgICB0eXBlRXh0ZW5kZXI6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmV4dGVuZCA9IGZ1bmN0aW9uICh0YXJnZXQsIHR5cGVBc1N0cmluZykge1xyXG4gICAgICAgICAgICB0YXJnZXQuX3R5cGVBc1N0cmluZyA9IHR5cGVBc1N0cmluZztcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbmtvLmV4dGVuZGVycy50eXBlID0gQmlmcm9zdC52YWx1ZXMudHlwZUV4dGVuZGVyLmNyZWF0ZSgpLmV4dGVuZDtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbHVlc1wiLCB7XHJcbiAgICBGb3JtYXR0ZXI6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuc3VwcG9ydGVkVHlwZSA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuZm9ybWF0ID0gZnVuY3Rpb24gKHZhbHVlLCBmb3JtYXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsdWVzXCIsIHtcclxuICAgIERhdGVGb3JtYXR0ZXI6IEJpZnJvc3QudmFsdWVzLkZvcm1hdHRlci5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuc3VwcG9ydGVkVHlwZSA9IERhdGU7XHJcblxyXG4gICAgICAgIHRoaXMuZm9ybWF0ID0gZnVuY3Rpb24gKHZhbHVlLCBmb3JtYXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmZvcm1hdChmb3JtYXQpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsdWVzXCIsIHtcclxuICAgIHN0cmluZ0Zvcm1hdHRlcjogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBmb3JtYXR0ZXJUeXBlcyA9IEJpZnJvc3QudmFsdWVzLkZvcm1hdHRlci5nZXRFeHRlbmRlcnMoKTtcclxuICAgICAgICB2YXIgZm9ybWF0dGVyc0J5VHlwZSA9IHt9O1xyXG5cclxuICAgICAgICBmb3JtYXR0ZXJUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgIHZhciBmb3JtYXR0ZXIgPSB0eXBlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICBmb3JtYXR0ZXJzQnlUeXBlW2Zvcm1hdHRlci5zdXBwb3J0ZWRUeXBlXSA9IGZvcm1hdHRlcjtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0Rm9ybWF0KGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQubm9kZVR5cGUgIT09IDEgfHwgQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChlbGVtZW50LmF0dHJpYnV0ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgc3RyaW5nRm9ybWF0QXR0cmlidXRlID0gZWxlbWVudC5hdHRyaWJ1dGVzLmdldE5hbWVkSXRlbShcImRhdGEtc3RyaW5nZm9ybWF0XCIpO1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoc3RyaW5nRm9ybWF0QXR0cmlidXRlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0cmluZ0Zvcm1hdEF0dHJpYnV0ZS52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmhhc0Zvcm1hdCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBmb3JtYXQgPSBnZXRGb3JtYXQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXQgIT09IG51bGw7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5mb3JtYXQgPSBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWUpIHtcclxuICAgICAgICAgICAgdmFyIGZvcm1hdCA9IGdldEZvcm1hdChlbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChmb3JtYXR0ZXJzQnlUeXBlLmhhc093blByb3BlcnR5KHZhbHVlLmNvbnN0cnVjdG9yKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZvcm1hdHRlciA9IGZvcm1hdHRlcnNCeVR5cGVbdmFsdWUuY29uc3RydWN0b3JdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChcInsoLltee31dKSp9XCIsIFwiZ1wiKTtcclxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBmb3JtYXQucmVwbGFjZShyZWdleCwgZnVuY3Rpb24gKGZvcm1hdEV4cHJlc3Npb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZXhwcmVzc2lvbiA9IGZvcm1hdEV4cHJlc3Npb24uc3Vic3RyKDEsIGZvcm1hdEV4cHJlc3Npb24ubGVuZ3RoIC0gMik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdHRlci5mb3JtYXQodmFsdWUsIGV4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0O1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsdWVzXCIsIHtcclxuICAgIHZhbHVlUGlwZWxpbmU6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICh0eXBlQ29udmVydGVycywgc3RyaW5nRm9ybWF0dGVyKSB7XHJcbiAgICAgICAgdGhpcy5nZXRWYWx1ZUZvclZpZXcgPSBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGFjdHVhbFZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGFjdHVhbFZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgcmV0dXJuVmFsdWUgPSBhY3R1YWxWYWx1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzdHJpbmdGb3JtYXR0ZXIuaGFzRm9ybWF0KGVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSA9IHN0cmluZ0Zvcm1hdHRlci5mb3JtYXQoZWxlbWVudCwgYWN0dWFsVmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHZhbHVlLl90eXBlQXNTdHJpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSB0eXBlQ29udmVydGVycy5jb252ZXJ0VG8oYWN0dWFsVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldFZhbHVlRm9yUHJvcGVydHkgPSBmdW5jdGlvbiAocHJvcGVydHksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChwcm9wZXJ0eS5fdHlwZUFzU3RyaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0eXBlQ29udmVydGVycy5jb252ZXJ0RnJvbSh2YWx1ZSwgcHJvcGVydHkuX3R5cGVBc1N0cmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHZhbHVlUGlwZWxpbmUgPSBCaWZyb3N0LnZhbHVlcy52YWx1ZVBpcGVsaW5lLmNyZWF0ZSgpO1xyXG5cclxuICAgIHZhciBvbGRSZWFkVmFsdWUgPSBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZTtcclxuICAgIGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICB2YXIgdmFsdWUgPSBvbGRSZWFkVmFsdWUoZWxlbWVudCk7XHJcblxyXG4gICAgICAgIHZhciBiaW5kaW5ncyA9IGtvLmJpbmRpbmdQcm92aWRlci5pbnN0YW5jZS5nZXRCaW5kaW5ncyhlbGVtZW50LCBrby5jb250ZXh0Rm9yKGVsZW1lbnQpKTtcclxuICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChiaW5kaW5ncykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcmVzdWx0ID0gdmFsdWVQaXBlbGluZS5nZXRWYWx1ZUZvclByb3BlcnR5KGJpbmRpbmdzLnZhbHVlLCB2YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIG9sZFdyaXRlVmFsdWUgPSBrby5zZWxlY3RFeHRlbnNpb25zLndyaXRlVmFsdWU7XHJcbiAgICBrby5zZWxlY3RFeHRlbnNpb25zLndyaXRlVmFsdWUgPSBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWUsIGFsbG93VW5zZXQpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gdmFsdWU7XHJcbiAgICAgICAgdmFyIGJpbmRpbmdzID0ga28uYmluZGluZ1Byb3ZpZGVyLmluc3RhbmNlLmdldEJpbmRpbmdzKGVsZW1lbnQsIGtvLmNvbnRleHRGb3IoZWxlbWVudCkpO1xyXG4gICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChiaW5kaW5ncykpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZVBpcGVsaW5lLmdldFZhbHVlRm9yVmlldyhlbGVtZW50LCBiaW5kaW5ncy52YWx1ZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvbGRXcml0ZVZhbHVlKGVsZW1lbnQsIHJlc3VsdCwgYWxsb3dVbnNldCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBvbGRTZXRUZXh0Q29udGVudCA9IGtvLnV0aWxzLnNldFRleHRDb250ZW50O1xyXG4gICAga28udXRpbHMuc2V0VGV4dENvbnRlbnQgPSBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWUpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gdmFsdWVQaXBlbGluZS5nZXRWYWx1ZUZvclZpZXcoZWxlbWVudCwgdmFsdWUpO1xyXG4gICAgICAgIG9sZFNldFRleHRDb250ZW50KGVsZW1lbnQsIHJlc3VsdCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBvbGRTZXRIdG1sID0ga28udXRpbHMuc2V0SHRtbDtcclxuICAgIGtvLnV0aWxzLnNldEh0bWwgPSBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWUpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gdmFsdWVQaXBlbGluZS5nZXRWYWx1ZUZvclZpZXcoZWxlbWVudCwgdmFsdWUpO1xyXG4gICAgICAgIG9sZFNldEh0bWwoZWxlbWVudCwgcmVzdWx0KTtcclxuICAgIH07XHJcbn0pKCk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbHVlc1wiLCB7XHJcbiAgICBWYWx1ZVByb3ZpZGVyOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5kZWZhdWx0UHJvcGVydHkgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnByb3ZpZGUgPSBmdW5jdGlvbiAoY29uc3VtZXIpIHtcclxuXHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWx1ZXNcIiwge1xyXG4gICAgdmFsdWVQcm92aWRlcnM6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5pc0tub3duID0gZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZVByb3ZpZGVycyA9IEJpZnJvc3QudmFsdWVzLlZhbHVlUHJvdmlkZXIuZ2V0RXh0ZW5kZXJzKCk7XHJcbiAgICAgICAgICAgIHZhbHVlUHJvdmlkZXJzLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlUHJvdmlkZXJUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVQcm92aWRlclR5cGUuX25hbWUudG9Mb3dlckNhc2UoKSA9PT0gbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZm91bmQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRJbnN0YW5jZU9mID0gZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gbnVsbDtcclxuICAgICAgICAgICAgdmFyIHZhbHVlUHJvdmlkZXJzID0gQmlmcm9zdC52YWx1ZXMuVmFsdWVQcm92aWRlci5nZXRFeHRlbmRlcnMoKTtcclxuICAgICAgICAgICAgdmFsdWVQcm92aWRlcnMuZm9yRWFjaChmdW5jdGlvbiAodmFsdWVQcm92aWRlclR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZVByb3ZpZGVyVHlwZS5fbmFtZS50b0xvd2VyQ2FzZSgpID09PSBuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UgPSB2YWx1ZVByb3ZpZGVyVHlwZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy52YWx1ZVByb3ZpZGVycyA9IEJpZnJvc3QudmFsdWVzLnZhbHVlUHJvdmlkZXJzOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWx1ZXNcIiwge1xyXG4gICAgVmFsdWVDb25zdW1lcjogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuY2FuTm90aWZ5Q2hhbmdlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcyA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY29uc3VtZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWx1ZXNcIiwge1xyXG4gICAgdmFsdWVDb25zdW1lcnM6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRGb3IgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIHByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgY29uc3VtZXIgPSBCaWZyb3N0LnZhbHVlcy5EZWZhdWx0VmFsdWVDb25zdW1lci5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiBpbnN0YW5jZSxcclxuICAgICAgICAgICAgICAgIHByb3BlcnR5OiBwcm9wZXJ0eU5hbWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb25zdW1lcjtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLnZhbHVlQ29uc3VtZXJzID0gQmlmcm9zdC52YWx1ZXMudmFsdWVDb25zdW1lcnM7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbHVlc1wiLCB7XHJcbiAgICBCaW5kaW5nOiBCaWZyb3N0LnZhbHVlcy5WYWx1ZVByb3ZpZGVyLmV4dGVuZChmdW5jdGlvbiAoYmluZGluZ0NvbnRleHRNYW5hZ2VyKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZGVmYXVsdFByb3BlcnR5ID0gXCJwYXRoXCI7XHJcblxyXG4gICAgICAgIHRoaXMucGF0aCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5tb2RlID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvbnZlcnRlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5mb3JtYXQgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnByb3ZpZGUgPSBmdW5jdGlvbiAoY29uc3VtZXIpIHtcclxuXHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWx1ZXNcIiwge1xyXG4gICAgRGVmYXVsdFZhbHVlQ29uc3VtZXI6IEJpZnJvc3QudmFsdWVzLlZhbHVlQ29uc3VtZXIuZXh0ZW5kKGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5KSB7XHJcbiAgICAgICAgdGhpcy5jb25zdW1lID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgdGFyZ2V0W3Byb3BlcnR5XSA9IHZhbHVlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgY29uZmlndXJhdG9yOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmNvbmZpZ3VyZSA9IGZ1bmN0aW9uIChjb25maWd1cmUpIHtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIGNvbmZpZ3VyZVR5cGU6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uKGFzc2V0c01hbmFnZXIpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciBkZWZhdWx0VXJpTWFwcGVyID0gQmlmcm9zdC5TdHJpbmdNYXBwZXIuY3JlYXRlKCk7XHJcbiAgICAgICAgZGVmYXVsdFVyaU1hcHBlci5hZGRNYXBwaW5nKFwie2JvdW5kZWRDb250ZXh0fS97bW9kdWxlfS97ZmVhdHVyZX0ve3ZpZXd9XCIsIFwie2JvdW5kZWRDb250ZXh0fS97bW9kdWxlfS97ZmVhdHVyZX0ve3ZpZXd9Lmh0bWxcIik7XHJcbiAgICAgICAgZGVmYXVsdFVyaU1hcHBlci5hZGRNYXBwaW5nKFwie2JvdW5kZWRDb250ZXh0fS97ZmVhdHVyZX0ve3ZpZXd9XCIsIFwie2JvdW5kZWRDb250ZXh0fS97ZmVhdHVyZX0ve3ZpZXd9Lmh0bWxcIik7XHJcbiAgICAgICAgZGVmYXVsdFVyaU1hcHBlci5hZGRNYXBwaW5nKFwie2ZlYXR1cmV9L3t2aWV3fVwiLCBcIntmZWF0dXJlfS97dmlld30uaHRtbFwiKTtcclxuICAgICAgICBkZWZhdWx0VXJpTWFwcGVyLmFkZE1hcHBpbmcoXCJ7dmlld31cIiwgXCJ7dmlld30uaHRtbFwiKTtcclxuICAgICAgICBCaWZyb3N0LnVyaU1hcHBlcnMuZGVmYXVsdCA9IGRlZmF1bHRVcmlNYXBwZXI7XHJcblxyXG4gICAgICAgIHRoaXMuaXNSZWFkeSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVhZHlDYWxsYmFja3MgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplTGFuZGluZ1BhZ2UgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuYXBwbHlNYXN0ZXJWaWV3TW9kZWwgPSB0cnVlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBvblJlYWR5KCkge1xyXG4gICAgICAgICAgICBCaWZyb3N0LnZpZXdzLlJlZ2lvbi5jdXJyZW50ID0gZG9jdW1lbnQuYm9keS5yZWdpb247XHJcbiAgICAgICAgICAgIHNlbGYuaXNSZWFkeSA9IHRydWU7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGNhbGxiYWNrSW5kZXggPSAwOyBjYWxsYmFja0luZGV4IDwgc2VsZi5yZWFkeUNhbGxiYWNrcy5sZW5ndGg7IGNhbGxiYWNrSW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5yZWFkeUNhbGxiYWNrc1tjYWxsYmFja0luZGV4XSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBob29rVXBOYXZpZ2Fpb25BbmRBcHBseVZpZXdNb2RlbCgpIHtcclxuICAgICAgICAgICAgQmlmcm9zdC5uYXZpZ2F0aW9uLm5hdmlnYXRpb25NYW5hZ2VyLmhvb2t1cCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNlbGYuYXBwbHlNYXN0ZXJWaWV3TW9kZWwgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIEJpZnJvc3Qudmlld3Mudmlld01vZGVsTWFuYWdlci5jcmVhdGUoKS5tYXN0ZXJWaWV3TW9kZWwuYXBwbHkoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb25TdGFydHVwKCkge1xyXG4gICAgICAgICAgICB2YXIgY29uZmlndXJhdG9ycyA9IEJpZnJvc3QuY29uZmlndXJhdG9yLmdldEV4dGVuZGVycygpO1xyXG4gICAgICAgICAgICBjb25maWd1cmF0b3JzLmZvckVhY2goZnVuY3Rpb24gKGNvbmZpZ3VyYXRvclR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb25maWd1cmF0b3IgPSBjb25maWd1cmF0b3JUeXBlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhdG9yLmNvbmZpZyhzZWxmKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgQmlmcm9zdC5kZXBlbmRlbmN5UmVzb2x2ZXJzLkRPTVJvb3REZXBlbmRlbmN5UmVzb2x2ZXIuZG9jdW1lbnRJc1JlYWR5KCk7XHJcbiAgICAgICAgICAgIEJpZnJvc3Qudmlld3Mudmlld01vZGVsQmluZGluZ0hhbmRsZXIuaW5pdGlhbGl6ZSgpO1xyXG4gICAgICAgICAgICBCaWZyb3N0LnZpZXdzLnZpZXdCaW5kaW5nSGFuZGxlci5pbml0aWFsaXplKCk7XHJcbiAgICAgICAgICAgIEJpZnJvc3QubmF2aWdhdGlvbi5uYXZpZ2F0aW9uQmluZGluZ0hhbmRsZXIuaW5pdGlhbGl6ZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBIaXN0b3J5ICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBIaXN0b3J5LkFkYXB0ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgIEJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIudHlwZXMuaGlzdG9yeSA9IEhpc3Rvcnk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGFzc2V0c01hbmFnZXIuaW5pdGlhbGl6ZSgpLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5pbml0aWFsaXplTGFuZGluZ1BhZ2UgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBCaWZyb3N0LnZpZXdzLnZpZXdNYW5hZ2VyLmNyZWF0ZSgpLmluaXRpYWxpemVMYW5kaW5nUGFnZSgpLmNvbnRpbnVlV2l0aChob29rVXBOYXZpZ2Fpb25BbmRBcHBseVZpZXdNb2RlbCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGhvb2tVcE5hdmlnYWlvbkFuZEFwcGx5Vmlld01vZGVsKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBvblJlYWR5KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcmVzZXQoKSB7XHJcbiAgICAgICAgICAgIHNlbGYuaXNSZWFkeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBzZWxmLnJlYWR5Q2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlYWR5ID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuaXNSZWFkeSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucmVhZHlDYWxsYmFja3MucHVzaChjYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgb25TdGFydHVwKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5jb25maWd1cmUgPSBCaWZyb3N0LmNvbmZpZ3VyZVR5cGUuY3JlYXRlKCk7XHJcbiJdfQ==
