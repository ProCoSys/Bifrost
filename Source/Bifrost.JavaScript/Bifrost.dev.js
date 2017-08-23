
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
    notNull: Bifrost.validation.Rule.extend(function () {
        this.validate = function (value) {
            return !(Bifrost.isUndefined(value) || Bifrost.isNull(value));
        };
    })
});


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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJpZnJvc3QuSmF2YVNjcmlwdC9leHRlbnNpb25zL0FycmF5RXh0ZW5zaW9ucy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9leHRlbnNpb25zL3N0cmluZ0V4dGVuc2lvbnMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvZXh0ZW5zaW9ucy9Ob2RlTGlzdEV4dGVuc2lvbnMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvZXh0ZW5zaW9ucy9IVE1MRWxlbWVudEV4dGVuc2lvbnMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvZXh0ZW5zaW9ucy9IVE1MQ29sbGVjdGlvbkV4dGVuc2lvbnMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvZXh0ZW5zaW9ucy9EYXRlRXh0ZW5zaW9ucy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9wb2x5ZmlsbHMvY2xhc3NMaXN0LmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3BvbHlmaWxscy9FbGVtZW50UG9seWZpbGxzLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3V0aWxzL2V4dGVuZC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9uYW1lc3BhY2UuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvZXhlY3V0aW9uL1Byb21pc2UuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvaXNPYmplY3QuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvaXNOdW1iZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvaXNBcnJheS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9pc1N0cmluZy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9pc051bGwuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvaXNVbmRlZmluZWQuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvaXNOdWxsT3JVbmRlZmluZWQuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvaXNGdW5jdGlvbi5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9pc1R5cGUuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvZnVuY3Rpb25QYXJzZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvYXNzZXRzTWFuYWdlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9kZXBlbmRlbmN5UmVzb2x2ZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvZGVwZW5kZW5jeVJlc29sdmVycy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9kZWZhdWx0RGVwZW5kZW5jeVJlc29sdmVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3V0aWxzL0RPTVJvb3REZXBlbmRlbmN5UmVzb2x2ZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvS25vd25BcnRpZmFjdFR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3V0aWxzL0tub3duQXJ0aWZhY3RJbnN0YW5jZXNEZXBlbmRlbmN5UmVzb2x2ZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvZ3VpZC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9UeXBlLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3V0aWxzL1NpbmdsZXRvbi5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC90eXBlcy9UeXBlSW5mby5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC90eXBlcy9Qcm9wZXJ0eUluZm8uanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvcGF0aC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9FeGNlcHRpb24uanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvZXhjZXB0aW9ucy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9oYXNoU3RyaW5nLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3V0aWxzL1VyaS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9uYW1lc3BhY2VzLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3V0aWxzL25hbWVzcGFjZU1hcHBlcnMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvU3RyaW5nTWFwcGluZy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9zdHJpbmdNYXBwaW5nRmFjdG9yeS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9TdHJpbmdNYXBwZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvdXJpTWFwcGVycy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9zZXJ2ZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvYXJlRXF1YWwuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdXRpbHMvZGVlcENsb25lLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3V0aWxzL3N5c3RlbUNsb2NrLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L1RpbWVTcGFuLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L0V2ZW50LmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3N5c3RlbUV2ZW50cy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9kaXNwYXRjaGVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2xpbmtlZC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9odWJzL2h1YkNvbm5lY3Rpb24uanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvaHVicy9IdWIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvaHVicy9odWJEZXBlbmRlbmN5UmVzb2x2ZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvaW8vZmlsZVR5cGUuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvaW8vRmlsZS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9pby9maWxlRmFjdG9yeS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9pby9maWxlTWFuYWdlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9zcGVjaWZpY2F0aW9ucy9TcGVjaWZpY2F0aW9uLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3NwZWNpZmljYXRpb25zL0FuZC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9zcGVjaWZpY2F0aW9ucy9Pci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC90YXNrcy9UYXNrLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3Rhc2tzL1Rhc2tIaXN0b3J5RW50cnkuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdGFza3MvdGFza0hpc3RvcnkuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdGFza3MvVGFza3MuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdGFza3MvdGFza3NGYWN0b3J5LmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3Rhc2tzL0h0dHBHZXRUYXNrLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3Rhc2tzL0h0dHBQb3N0VGFzay5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC90YXNrcy9Mb2FkVGFzay5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC90YXNrcy9GaWxlTG9hZFRhc2suanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdGFza3MvRXhlY3V0aW9uVGFzay5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC90YXNrRmFjdG9yeS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWxpZGF0aW9uL2V4Y2VwdGlvbnMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsaWRhdGlvbi9ydWxlSGFuZGxlcnMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsaWRhdGlvbi9SdWxlLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZhbGlkYXRpb24vVmFsaWRhdG9yLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZhbGlkYXRpb24vdmFsaWRhdGlvblN1bW1hcnlGb3IuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsaWRhdGlvbi92YWxpZGF0aW9uTWVzc2FnZUZvci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWxpZGF0aW9uL3ZhbGlkYXRpb24uanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsaWRhdGlvbi9ub3ROdWxsLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZhbGlkYXRpb24vcmVxdWlyZWQuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsaWRhdGlvbi9sZW5ndGguanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsaWRhdGlvbi9taW5MZW5ndGguanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsaWRhdGlvbi9tYXhMZW5ndGguanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsaWRhdGlvbi9yYW5nZS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWxpZGF0aW9uL2xlc3NUaGFuLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZhbGlkYXRpb24vbGVzc1RoYW5PckVxdWFsLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZhbGlkYXRpb24vZ3JlYXRlclRoYW4uanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsaWRhdGlvbi9ncmVhdGVyVGhhbk9yRXF1YWwuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsaWRhdGlvbi9lbWFpbC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWxpZGF0aW9uL3JlZ2V4LmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2NvbW1hbmRzL2JpbmRpbmdIYW5kbGVycy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9jb21tYW5kcy9IYW5kbGVDb21tYW5kVGFzay5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9jb21tYW5kcy9IYW5kbGVDb21tYW5kc1Rhc2suanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvY29tbWFuZHMvQ29tbWFuZENvb3JkaW5hdG9yLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2NvbW1hbmRzL2NvbW1hbmRWYWxpZGF0aW9uU2VydmljZS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9jb21tYW5kcy9Db21tYW5kLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2NvbW1hbmRzL0NvbW1hbmREZXNjcmlwdG9yLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2NvbW1hbmRzL0NvbW1hbmRSZXN1bHQuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvY29tbWFuZHMvY29tbWFuZERlcGVuZGVuY3lSZXNvbHZlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9jb21tYW5kcy9Db21tYW5kU2VjdXJpdHlDb250ZXh0LmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2NvbW1hbmRzL2NvbW1hbmRTZWN1cml0eUNvbnRleHRGYWN0b3J5LmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2NvbW1hbmRzL2NvbW1hbmRTZWN1cml0eVNlcnZpY2UuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvY29tbWFuZHMvaGFzQ2hhbmdlcy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9jb21tYW5kcy9jb21tYW5kRXZlbnRzLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2ludGVyYWN0aW9uL09wZXJhdGlvbi5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9pbnRlcmFjdGlvbi9PcGVyYXRpb25Db250ZXh0LmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2ludGVyYWN0aW9uL09wZXJhdGlvbkVudHJ5LmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2ludGVyYWN0aW9uL29wZXJhdGlvbkVudHJ5RmFjdG9yeS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9pbnRlcmFjdGlvbi9PcGVyYXRpb25zLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2ludGVyYWN0aW9uL29wZXJhdGlvbnNGYWN0b3J5LmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2ludGVyYWN0aW9uL0NvbW1hbmRPcGVyYXRpb24uanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvaW50ZXJhY3Rpb24vQWN0aW9uLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2ludGVyYWN0aW9uL1RyaWdnZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvaW50ZXJhY3Rpb24vRXZlbnRUcmlnZ2VyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2ludGVyYWN0aW9uL1Zpc3VhbFN0YXRlLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2ludGVyYWN0aW9uL1Zpc3VhbFN0YXRlQWN0aW9uLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2ludGVyYWN0aW9uL1Zpc3VhbFN0YXRlR3JvdXAuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvaW50ZXJhY3Rpb24vVmlzdWFsU3RhdGVNYW5hZ2VyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2ludGVyYWN0aW9uL1Zpc3VhbFN0YXRlVHJhbnNpdGlvbi5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9pbnRlcmFjdGlvbi92aXN1YWxTdGF0ZUFjdGlvbnMvT3BhY2l0eS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9tYXBwaW5nL01pc3NpbmdQcm9wZXJ0eVN0cmF0ZWd5LmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L21hcHBpbmcvcHJvcGVydHlNYXAuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvbWFwcGluZy9NYXAuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvbWFwcGluZy9tYXBzLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L21hcHBpbmcvbWFwcGVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3JlYWQvcmVhZE1vZGVsU3lzdGVtRXZlbnRzLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3JlYWQvUGFnaW5nSW5mby5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9yZWFkL1F1ZXJ5YWJsZS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9yZWFkL3F1ZXJ5YWJsZUZhY3RvcnkuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvcmVhZC9RdWVyeS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9yZWFkL1JlYWRNb2RlbC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9yZWFkL1JlYWRNb2RlbE9mLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3JlYWQvUmVhZE1vZGVsVGFzay5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9yZWFkL3JlYWRNb2RlbE9mRGVwZW5kZW5jeVJlc29sdmVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3JlYWQvcXVlcnlEZXBlbmRlbmN5UmVzb2x2ZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvcmVhZC9RdWVyeVRhc2suanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvcmVhZC9xdWVyeVNlcnZpY2UuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvc2FnYXMvU2FnYS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9zYWdhcy9zYWdhTmFycmF0b3IuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvbWVzc2FnaW5nL01lc3Nlbmdlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9tZXNzYWdpbmcvbWVzc2VuZ2VyRmFjdG9yeS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9tZXNzYWdpbmcvb2JzZXJ2YWJsZU1lc3NhZ2UuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvc2VydmljZXMvU2VydmljZS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9zZXJ2aWNlcy9zZXJ2aWNlRGVwZW5kZW5jeVJlc29sdmVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L2RvY3VtZW50U2VydmljZS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9tYXJrdXAvQmluZGluZ0NvbnRleHQuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvbWFya3VwL2JpbmRpbmdDb250ZXh0TWFuYWdlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9tYXJrdXAvYXR0cmlidXRlVmFsdWVzLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L21hcmt1cC92YWx1ZVByb3ZpZGVyUGFyc2VyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L21hcmt1cC9FbGVtZW50VmlzaXRvci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9tYXJrdXAvRWxlbWVudFZpc2l0b3JSZXN1bHRBY3Rpb25zLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L21hcmt1cC9vYmplY3RNb2RlbEZhY3RvcnkuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvbWFya3VwL011bHRpcGxlTmFtZXNwYWNlc0luTmFtZU5vdEFsbG93ZWQuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvbWFya3VwL011bHRpcGxlUHJvcGVydHlSZWZlcmVuY2VzTm90QWxsb3dlZC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9tYXJrdXAvUGFyZW50VGFnTmFtZU1pc21hdGNoZWQuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvbWFya3VwL05hbWVzcGFjZURlZmluaXRpb24uanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvbWFya3VwL25hbWVzcGFjZURlZmluaXRpb25zLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L21hcmt1cC9uYW1lc3BhY2VzLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L21hcmt1cC9lbGVtZW50TmFtaW5nLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L21hcmt1cC9wcm9wZXJ0eUV4cGFuZGVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L21hcmt1cC9PYmplY3RNb2RlbEVsZW1lbnRWaXNpdG9yLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L21hcmt1cC9OYW1pbmdSb290LmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L21hcmt1cC9VSUVsZW1lbnQuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvbWFya3VwL1VJRWxlbWVudFByZXBhcmVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L21hcmt1cC9Db250cm9sLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZpZXdzL1Bvc3RCaW5kaW5nVmlzaXRvci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy9VSU1hbmFnZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmlld3MvQ29udGVudC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy9JdGVtcy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy9Db21wb3NlVGFzay5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy92aWV3TWFuYWdlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy9QYXRoUmVzb2x2ZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmlld3MvcGF0aFJlc29sdmVycy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy9VcmlNYXBwZXJQYXRoUmVzb2x2ZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmlld3MvUmVsYXRpdmVQYXRoUmVzb2x2ZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmlld3MvVmlldy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy92aWV3RmFjdG9yeS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy9WaWV3TG9hZFRhc2suanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmlld3Mvdmlld0xvYWRlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy92aWV3QmluZGluZ0hhbmRsZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmlld3Mvdmlld0JpbmRpbmdIYW5kbGVyVGVtcGxhdGVTb3VyY2UuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmlld3Mvdmlld0JpbmRpbmdIYW5kbGVyVGVtcGxhdGVFbmdpbmUuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmlld3MvTWFzdGVyVmlld01vZGVsLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZpZXdzL1ZpZXdNb2RlbC5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy92aWV3TW9kZWxUeXBlcy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy92aWV3TW9kZWxMb2FkZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmlld3MvVmlld01vZGVsTG9hZFRhc2suanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmlld3Mvdmlld01vZGVsTWFuYWdlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy92aWV3TW9kZWxCaW5kaW5nSGFuZGxlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy9SZWdpb24uanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmlld3MvUmVnaW9uRGVwZW5kZW5jeVJlc29sdmVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZpZXdzL3JlZ2lvbk1hbmFnZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmlld3MvUmVnaW9uRGVzY3JpcHRvci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy9yZWdpb25EZXNjcmlwdG9yTWFuYWdlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92aWV3cy9SZWdpb25EZXNjcmlwdG9yRGVwZW5kZW5jeVJlc29sdmVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZpZXdzL0RhdGFWaWV3QXR0cmlidXRlRWxlbWVudFZpc2l0b3IuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmlld3MvRGF0YVZpZXdNb2RlbEZpbGVBdHRyaWJ1dGVFbGVtZW50VmlzaXRvci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9pbnRlcmFjdGlvbi9WaXN1YWxTdGF0ZU1hbmFnZXJFbGVtZW50VmlzaXRvci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9uYXZpZ2F0aW9uL05hdmlnYXRpb25GcmFtZS5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9uYXZpZ2F0aW9uL25hdmlnYXRlVG8uanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uTWFuYWdlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9uYXZpZ2F0aW9uL29ic2VydmFibGVRdWVyeVBhcmFtZXRlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9uYXZpZ2F0aW9uL0RhdGFOYXZpZ2F0aW9uRnJhbWVBdHRyaWJ1dGVFbGVtZW50VmlzaXRvci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC9uYXZpZ2F0aW9uL25hdmlnYXRpb25CaW5kaW5nSGFuZGxlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWx1ZXMvVHlwZUNvbnZlcnRlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWx1ZXMvTnVtYmVyVHlwZUNvbnZlcnRlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWx1ZXMvRGF0ZVR5cGVDb252ZXJ0ZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsdWVzL1N0cmluZ1R5cGVDb252ZXJ0ZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsdWVzL3R5cGVDb252ZXJ0ZXJzLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZhbHVlcy90eXBlRXh0ZW5kZXIuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsdWVzL0Zvcm1hdHRlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWx1ZXMvRGF0ZUZvcm1hdHRlci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWx1ZXMvc3RyaW5nRm9ybWF0dGVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZhbHVlcy92YWx1ZVBpcGVsaW5lLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZhbHVlcy9WYWx1ZVByb3ZpZGVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3ZhbHVlcy92YWx1ZVByb3ZpZGVycy5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWx1ZXMvVmFsdWVDb25zdW1lci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC92YWx1ZXMvdmFsdWVDb25zdW1lcnMuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsdWVzL0JpbmRpbmcuanMiLCJCaWZyb3N0LkphdmFTY3JpcHQvdmFsdWVzL0RlZmF1bHRWYWx1ZUNvbnN1bWVyLmpzIiwiQmlmcm9zdC5KYXZhU2NyaXB0L3V0aWxzL2NvbmZpZ3VyYXRvci5qcyIsIkJpZnJvc3QuSmF2YVNjcmlwdC91dGlscy9jb25maWd1cmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4Q0E7QUFDQTtBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BLQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDalNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiQmlmcm9zdC5kZXYuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuZnVuY3Rpb24gcG9seWZpbGxGb3JFYWNoKCkge1xyXG4gICAgaWYgKHR5cGVvZiBBcnJheS5wcm90b3R5cGUuZm9yRWFjaCAhPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2ssIHRoaXNBcmcpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzQXJnID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzQXJnID0gd2luZG93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB0aGlzW2ldLCBpLCB0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBvbHlGaWxsQ2xvbmUoKSB7XHJcbiAgICBpZiAodHlwZW9mIEFycmF5LnByb3RvdHlwZS5jbG9uZSAhPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zbGljZSgwKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzaGFsbG93RXF1YWxzKCkge1xyXG4gICAgaWYgKHR5cGVvZiBBcnJheS5wcm90b3R5cGUuc2hhbGxvd0VxdWFscyAhPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnNoYWxsb3dFcXVhbHMgPSBmdW5jdGlvbiAob3RoZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMgPT09IG90aGVyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcyA9PT0gbnVsbCB8fCBvdGhlciA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmxlbmd0aCAhPT0gb3RoZXIubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXNbaV0gIT09IG90aGVyW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbkFycmF5LnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcclxuICAgIHRoaXMuc3BsaWNlKGluZGV4LCAwLCBpdGVtKTtcclxufTtcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICBwb2x5ZmlsbEZvckVhY2goKTtcclxuICAgIHBvbHlGaWxsQ2xvbmUoKTtcclxuICAgIHNoYWxsb3dFcXVhbHMoKTtcclxufSkoKTsiLCJpZiAodHlwZW9mIFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aCAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoID0gZnVuY3Rpb24gKHN0cikge1xyXG4gICAgICAgIHJldHVybiBzdHIubGVuZ3RoID4gMCAmJiB0aGlzLnN1YnN0cmluZygwLCBzdHIubGVuZ3RoKSA9PT0gc3RyO1xyXG4gICAgfTtcclxufVxyXG5cclxuaWYgKHR5cGVvZiBTdHJpbmcucHJvdG90eXBlLmVuZHNXaXRoICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLmVuZHNXaXRoID0gZnVuY3Rpb24gKHN0cikge1xyXG4gICAgICAgIHJldHVybiBzdHIubGVuZ3RoID4gMCAmJiB0aGlzLnN1YnN0cmluZyh0aGlzLmxlbmd0aCAtIHN0ci5sZW5ndGgsIHRoaXMubGVuZ3RoKSA9PT0gc3RyO1xyXG4gICAgfTtcclxufVxyXG5cclxuU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlQWxsID0gZnVuY3Rpb24gKHRvUmVwbGFjZSwgcmVwbGFjZW1lbnQpIHtcclxuICAgIHZhciByZXN1bHQgPSB0aGlzLnNwbGl0KHRvUmVwbGFjZSkuam9pbihyZXBsYWNlbWVudCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuU3RyaW5nLnByb3RvdHlwZS50b0NhbWVsQ2FzZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciByZXN1bHQgPSB0aGlzLmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpICsgdGhpcy5zdWJzdHJpbmcoMSk7XHJcbiAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZUFsbChcIi1cIiwgXCJcIik7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuU3RyaW5nLnByb3RvdHlwZS50b1Bhc2NhbENhc2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcmVzdWx0ID0gdGhpcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRoaXMuc3Vic3RyaW5nKDEpO1xyXG4gICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2VBbGwoXCItXCIsIFwiXCIpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcblN0cmluZy5wcm90b3R5cGUuaGFzaENvZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgY2hhckNvZGUsIGhhc2ggPSAwO1xyXG4gICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIGhhc2g7XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjaGFyQ29kZSA9IHRoaXMuY2hhckNvZGVBdChpKTtcclxuICAgICAgICBoYXNoID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjaGFyQ29kZTtcclxuICAgICAgICBoYXNoID0gaGFzaCAmIGhhc2g7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaGFzaDtcclxufTsiLCJOb2RlTGlzdC5wcm90b3R5cGUuZm9yRWFjaCA9IEFycmF5LnByb3RvdHlwZS5mb3JFYWNoO1xyXG5Ob2RlTGlzdC5wcm90b3R5cGUubGVuZ3RoID0gQXJyYXkucHJvdG90eXBlLmxlbmd0aDsiLCJIVE1MRWxlbWVudC5wcm90b3R5cGUua25vd25FbGVtZW50VHlwZXMgPSBbXHJcbiAgICBcImFcIixcclxuICAgIFwiYWJiclwiLFxyXG4gICAgXCJhY3JvbnltXCIsXHJcbiAgICBcImFkZHJlc3NcIixcclxuICAgIFwiYXBwbGV0XCIsXHJcbiAgICBcImFyZWFcIixcclxuICAgIFwiYXJ0aWNsZVwiLFxyXG4gICAgXCJhc2lkZVwiLFxyXG4gICAgXCJhdWRpb1wiLFxyXG4gICAgXCJiXCIsXHJcbiAgICBcImJhc2VcIixcclxuICAgIFwiYmFzZWZvbnRcIixcclxuICAgIFwiYmRpXCIsXHJcbiAgICBcImJkb1wiLFxyXG4gICAgXCJiZ3NvdW5kXCIsXHJcbiAgICBcImJpZ1wiLFxyXG4gICAgXCJibGlua1wiLFxyXG4gICAgXCJibG9ja3F1b3RlXCIsXHJcbiAgICBcImJvZHlcIixcclxuICAgIFwiYnJcIixcclxuICAgIFwiYnV0dG9uXCIsXHJcbiAgICBcImNhbnZhc1wiLFxyXG4gICAgXCJjYXB0aW9uXCIsXHJcbiAgICBcImNlbnRlclwiLFxyXG4gICAgXCJjaXRlXCIsXHJcbiAgICBcImNvbFwiLFxyXG4gICAgXCJjb2xncm91cFwiLFxyXG4gICAgXCJjb250ZW50XCIsXHJcbiAgICBcImNvZGVcIixcclxuICAgIFwiZGF0YVwiLFxyXG4gICAgXCJkYXRhbGlzdFwiLFxyXG4gICAgXCJkZFwiLFxyXG4gICAgXCJkZWNvcmF0b3JcIixcclxuICAgIFwiZGVsXCIsXHJcbiAgICBcImRldGFpbHNcIixcclxuICAgIFwiZGZuXCIsXHJcbiAgICBcImRpclwiLFxyXG4gICAgXCJkaXZcIixcclxuICAgIFwiZGxcIixcclxuICAgIFwiZHRcIixcclxuICAgIFwiZW1cIixcclxuICAgIFwiZW1iZWRcIixcclxuICAgIFwiZmllbGRzZXRcIixcclxuICAgIFwiZmlnY2FwdGlvblwiLFxyXG4gICAgXCJmaWd1cmVcIixcclxuICAgIFwiZm9udFwiLFxyXG4gICAgXCJmb290ZXJcIixcclxuICAgIFwiZm9ybVwiLFxyXG4gICAgXCJmcmFtZVwiLFxyXG4gICAgXCJmcmFtZXNldFwiLFxyXG4gICAgXCJoMVwiLFxyXG4gICAgXCJoMlwiLFxyXG4gICAgXCJoM1wiLFxyXG4gICAgXCJoNFwiLFxyXG4gICAgXCJoNVwiLFxyXG4gICAgXCJoNlwiLFxyXG4gICAgXCJoZWFkXCIsXHJcbiAgICBcImhlYWRlclwiLFxyXG4gICAgXCJoZ3JvdXBcIixcclxuICAgIFwiaHJcIixcclxuICAgIFwiaHRtbFwiLFxyXG4gICAgXCJpXCIsXHJcbiAgICBcImlmcmFtZVwiLFxyXG4gICAgXCJpbWdcIixcclxuICAgIFwiaW5wdXRcIixcclxuICAgIFwiaW5zXCIsXHJcbiAgICBcImlzaW5kZXhcIixcclxuICAgIFwia2JkXCIsXHJcbiAgICBcImtleWdlblwiLFxyXG4gICAgXCJsYWJlbFwiLFxyXG4gICAgXCJsZWdlbmRcIixcclxuICAgIFwibGlcIixcclxuICAgIFwibGlua1wiLFxyXG4gICAgXCJsaXN0aW5nXCIsXHJcbiAgICBcIm1haW5cIixcclxuICAgIFwibWFwXCIsXHJcbiAgICBcIm1hcmtcIixcclxuICAgIFwibWFycXVlXCIsXHJcbiAgICBcIm1lbnVcIixcclxuICAgIFwibWVudWl0ZW1cIixcclxuICAgIFwibWV0YVwiLFxyXG4gICAgXCJtZXRlclwiLFxyXG4gICAgXCJuYXZcIixcclxuICAgIFwibm9iclwiLFxyXG4gICAgXCJub2ZyYW1lc1wiLFxyXG4gICAgXCJub3NjcmlwdFwiLFxyXG4gICAgXCJvYmplY3RcIixcclxuICAgIFwib2xcIixcclxuICAgIFwib3B0Z3JvdXBcIixcclxuICAgIFwib3B0aW9uXCIsXHJcbiAgICBcIm91dHB1dFwiLFxyXG4gICAgXCJwXCIsXHJcbiAgICBcInBhcmFtXCIsXHJcbiAgICBcInBsYWludGV4dFwiLFxyXG4gICAgXCJwcmVcIixcclxuICAgIFwicHJvZ3Jlc3NcIixcclxuICAgIFwicVwiLFxyXG4gICAgXCJycFwiLFxyXG4gICAgXCJydFwiLFxyXG4gICAgXCJydWJ5XCIsXHJcbiAgICBcInNcIixcclxuICAgIFwic2FtcFwiLFxyXG4gICAgXCJzY3JpcHRcIixcclxuICAgIFwic2VjdGlvblwiLFxyXG4gICAgXCJzZWxlY3RcIixcclxuICAgIFwic2hhZG93XCIsXHJcbiAgICBcInNtYWxsXCIsXHJcbiAgICBcInNvdXJjZVwiLFxyXG4gICAgXCJzcGFjZXJcIixcclxuICAgIFwic3BhblwiLFxyXG4gICAgXCJzdHJpa2VcIixcclxuICAgIFwic3Ryb25nXCIsXHJcbiAgICBcInN0eWxlXCIsXHJcbiAgICBcInN1YlwiLFxyXG4gICAgXCJzdW1tYXJ5XCIsXHJcbiAgICBcInN1cFwiLFxyXG4gICAgXCJ0YWJsZVwiLFxyXG4gICAgXCJ0Ym9keVwiLFxyXG4gICAgXCJ0ZFwiLFxyXG4gICAgXCJ0ZW1wbGF0ZVwiLFxyXG4gICAgXCJ0ZXh0YXJlYVwiLFxyXG4gICAgXCJ0Zm9vdFwiLFxyXG4gICAgXCJ0aFwiLFxyXG4gICAgXCJ0aGVhZFwiLFxyXG4gICAgXCJ0aW1lXCIsXHJcbiAgICBcInRpdGxlXCIsXHJcbiAgICBcInRyXCIsXHJcbiAgICBcInRyYWNrXCIsXHJcbiAgICBcInR0XCIsXHJcbiAgICBcInVcIixcclxuICAgIFwidWxcIixcclxuICAgIFwidmFyXCIsXHJcbiAgICBcInZpZGVvXCIsXHJcbiAgICBcIndiclwiLFxyXG4gICAgXCJ4bXBcIlxyXG5dO1xyXG5IVE1MRWxlbWVudC5wcm90b3R5cGUuaXNLbm93blR5cGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoXCJIVE1MVW5rbm93bkVsZW1lbnRcIikpIHtcclxuICAgICAgICBpZiAodGhpcy5jb25zdHJ1Y3Rvci50b1N0cmluZygpLmluZGV4T2YoXCJIVE1MVW5rbm93bkVsZW1lbnRcIikgPCAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGlzS25vd24gPSB0aGlzLmNvbnN0cnVjdG9yICE9PSBIVE1MRWxlbWVudDtcclxuICAgIGlmIChpc0tub3duID09PSBmYWxzZSkge1xyXG4gICAgICAgIHZhciB0YWdOYW1lID0gdGhpcy50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgaXNLbm93biA9IHRoaXMua25vd25FbGVtZW50VHlwZXMuc29tZShmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgICAgICBpZiAodGFnTmFtZSA9PT0gdHlwZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBpc0tub3duO1xyXG59O1xyXG5IVE1MRWxlbWVudC5wcm90b3R5cGUuZ2V0Q2hpbGRFbGVtZW50cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBjaGlsZHJlbiA9IFtdO1xyXG4gICAgdGhpcy5jaGlsZE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSkge1xyXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG59OyIsIkhUTUxDb2xsZWN0aW9uLnByb3RvdHlwZS5mb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2g7XHJcbkhUTUxDb2xsZWN0aW9uLnByb3RvdHlwZS5sZW5ndGggPSBBcnJheS5wcm90b3R5cGUubGVuZ3RoOyIsIi8vIEZyb20gdGhlIGZvbGxvd2luZyB0aHJlYWQgOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwNTY3MjgvZm9ybWF0dGluZy1hLWRhdGUtaW4tamF2YXNjcmlwdFxyXG4vLyBhdXRob3I6IG1laXp6XHJcbkRhdGUucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uIChmb3JtYXQpIHtcclxuICAgIHZhciBvID0ge1xyXG4gICAgICAgIFwiTStcIjogdGhpcy5nZXRNb250aCgpICsgMSwgLy9tb250aFxyXG4gICAgICAgIFwiZCtcIjogdGhpcy5nZXREYXRlKCksICAgIC8vZGF5XHJcbiAgICAgICAgXCJoK1wiOiB0aGlzLmdldEhvdXJzKCksICAgLy9ob3VyXHJcbiAgICAgICAgXCJtK1wiOiB0aGlzLmdldE1pbnV0ZXMoKSwgLy9taW51dGVcclxuICAgICAgICBcInMrXCI6IHRoaXMuZ2V0U2Vjb25kcygpLCAvL3NlY29uZFxyXG4gICAgICAgIFwicStcIjogTWF0aC5mbG9vcigodGhpcy5nZXRNb250aCgpICsgMykgLyAzKSwgIC8vcXVhcnRlclxyXG4gICAgICAgIFwiU1wiOiB0aGlzLmdldE1pbGxpc2Vjb25kcygpIC8vbWlsbGlzZWNvbmRcclxuICAgIH07XHJcblxyXG4gICAgaWYgKC8oeSspLy50ZXN0KGZvcm1hdCkpIHtcclxuICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZShSZWdFeHAuJDEsICh0aGlzLmdldEZ1bGxZZWFyKCkgKyBcIlwiKS5zdWJzdHIoNCAtIFJlZ0V4cC4kMS5sZW5ndGgpKTtcclxuICAgIH1cclxuICAgIGZvciAodmFyIGsgaW4gbykge1xyXG4gICAgICAgIGlmIChuZXcgUmVnRXhwKFwiKFwiICsgayArIFwiKVwiKS50ZXN0KGZvcm1hdCkpIHtcclxuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoUmVnRXhwLiQxLFxyXG4gICAgICAgICAgICAgIFJlZ0V4cC4kMS5sZW5ndGggPT09IDEgPyBvW2tdIDpcclxuICAgICAgICAgICAgICAgIChcIjAwXCIgKyBvW2tdKS5zdWJzdHIoKFwiXCIgKyBvW2tdKS5sZW5ndGgpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZm9ybWF0O1xyXG59OyIsIi8qXHJcbiAqIGNsYXNzTGlzdC5qczogQ3Jvc3MtYnJvd3NlciBmdWxsIGVsZW1lbnQuY2xhc3NMaXN0IGltcGxlbWVudGF0aW9uLlxyXG4gKiAyMDEyLTExLTE1XHJcbiAqXHJcbiAqIEJ5IEVsaSBHcmV5LCBodHRwOi8vZWxpZ3JleS5jb21cclxuICogUHVibGljIERvbWFpbi5cclxuICogTk8gV0FSUkFOVFkgRVhQUkVTU0VEIE9SIElNUExJRUQuIFVTRSBBVCBZT1VSIE9XTiBSSVNLLlxyXG4gKi9cclxuXHJcbi8qZ2xvYmFsIHNlbGYsIGRvY3VtZW50LCBET01FeGNlcHRpb24gKi9cclxuXHJcbi8qISBAc291cmNlIGh0dHA6Ly9wdXJsLmVsaWdyZXkuY29tL2dpdGh1Yi9jbGFzc0xpc3QuanMvYmxvYi9tYXN0ZXIvY2xhc3NMaXN0LmpzKi9cclxuXHJcbmlmIChcImRvY3VtZW50XCIgaW4gc2VsZiAmJiAhKFxyXG4gICAgICAgIFwiY2xhc3NMaXN0XCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIl9cIikgJiZcclxuICAgICAgICBcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwic3ZnXCIpXHJcbiAgICApKSB7XHJcblxyXG4gICAgKGZ1bmN0aW9uICh2aWV3KSB7XHJcblxyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgICAgICBpZiAoISgnRWxlbWVudCcgaW4gdmlldykpIHJldHVybjtcclxuXHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAgICAgY2xhc3NMaXN0UHJvcCA9IFwiY2xhc3NMaXN0XCJcclxuICAgICAgICAgICAgLCBwcm90b1Byb3AgPSBcInByb3RvdHlwZVwiXHJcbiAgICAgICAgICAgICwgZWxlbUN0clByb3RvID0gdmlldy5FbGVtZW50W3Byb3RvUHJvcF1cclxuICAgICAgICAgICAgLCBvYmpDdHIgPSBPYmplY3RcclxuICAgICAgICAgICAgLCBzdHJUcmltID0gU3RyaW5nW3Byb3RvUHJvcF0udHJpbSB8fCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCBcIlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAsIGFyckluZGV4T2YgPSBBcnJheVtwcm90b1Byb3BdLmluZGV4T2YgfHwgZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHZhclxyXG4gICAgICAgICAgICAgICAgICAgICAgaSA9IDBcclxuICAgICAgICAgICAgICAgICAgICAsIGxlbiA9IHRoaXMubGVuZ3RoXHJcbiAgICAgICAgICAgICAgICA7XHJcbiAgICAgICAgICAgICAgICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBWZW5kb3JzOiBwbGVhc2UgYWxsb3cgY29udGVudCBjb2RlIHRvIGluc3RhbnRpYXRlIERPTUV4Y2VwdGlvbnNcclxuICAgICAgICAgICAgLCBET01FeCA9IGZ1bmN0aW9uICh0eXBlLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5hbWUgPSB0eXBlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2RlID0gRE9NRXhjZXB0aW9uW3R5cGVdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAsIGNoZWNrVG9rZW5BbmRHZXRJbmRleCA9IGZ1bmN0aW9uIChjbGFzc0xpc3QsIHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4gPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRE9NRXgoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJTWU5UQVhfRVJSXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgLCBcIkFuIGludmFsaWQgb3IgaWxsZWdhbCBzdHJpbmcgd2FzIHNwZWNpZmllZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICgvXFxzLy50ZXN0KHRva2VuKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBET01FeChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcIklOVkFMSURfQ0hBUkFDVEVSX0VSUlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICwgXCJTdHJpbmcgY29udGFpbnMgYW4gaW52YWxpZCBjaGFyYWN0ZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJySW5kZXhPZi5jYWxsKGNsYXNzTGlzdCwgdG9rZW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICwgQ2xhc3NMaXN0ID0gZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICAgICAgICAgIHZhclxyXG4gICAgICAgICAgICAgICAgICAgICAgdHJpbW1lZENsYXNzZXMgPSBzdHJUcmltLmNhbGwoZWxlbS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiKVxyXG4gICAgICAgICAgICAgICAgICAgICwgY2xhc3NlcyA9IHRyaW1tZWRDbGFzc2VzID8gdHJpbW1lZENsYXNzZXMuc3BsaXQoL1xccysvKSA6IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgLCBpID0gMFxyXG4gICAgICAgICAgICAgICAgICAgICwgbGVuID0gY2xhc3Nlcy5sZW5ndGhcclxuICAgICAgICAgICAgICAgIDtcclxuICAgICAgICAgICAgICAgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2goY2xhc3Nlc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVDbGFzc05hbWUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGlzLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAsIGNsYXNzTGlzdFByb3RvID0gQ2xhc3NMaXN0W3Byb3RvUHJvcF0gPSBbXVxyXG4gICAgICAgICAgICAsIGNsYXNzTGlzdEdldHRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQ2xhc3NMaXN0KHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgO1xyXG4gICAgICAgIC8vIE1vc3QgRE9NRXhjZXB0aW9uIGltcGxlbWVudGF0aW9ucyBkb24ndCBhbGxvdyBjYWxsaW5nIERPTUV4Y2VwdGlvbidzIHRvU3RyaW5nKClcclxuICAgICAgICAvLyBvbiBub24tRE9NRXhjZXB0aW9ucy4gRXJyb3IncyB0b1N0cmluZygpIGlzIHN1ZmZpY2llbnQgaGVyZS5cclxuICAgICAgICBET01FeFtwcm90b1Byb3BdID0gRXJyb3JbcHJvdG9Qcm9wXTtcclxuICAgICAgICBjbGFzc0xpc3RQcm90by5pdGVtID0gZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNbaV0gfHwgbnVsbDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNsYXNzTGlzdFByb3RvLmNvbnRhaW5zID0gZnVuY3Rpb24gKHRva2VuKSB7XHJcbiAgICAgICAgICAgIHRva2VuICs9IFwiXCI7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pICE9PSAtMTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNsYXNzTGlzdFByb3RvLmFkZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyXHJcbiAgICAgICAgICAgICAgICAgIHRva2VucyA9IGFyZ3VtZW50c1xyXG4gICAgICAgICAgICAgICAgLCBpID0gMFxyXG4gICAgICAgICAgICAgICAgLCBsID0gdG9rZW5zLmxlbmd0aFxyXG4gICAgICAgICAgICAgICAgLCB0b2tlblxyXG4gICAgICAgICAgICAgICAgLCB1cGRhdGVkID0gZmFsc2VcclxuICAgICAgICAgICAgO1xyXG4gICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICB0b2tlbiA9IHRva2Vuc1tpXSArIFwiXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2godG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdoaWxlICgrK2kgPCBsKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh1cGRhdGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2xhc3NMaXN0UHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXJcclxuICAgICAgICAgICAgICAgICAgdG9rZW5zID0gYXJndW1lbnRzXHJcbiAgICAgICAgICAgICAgICAsIGkgPSAwXHJcbiAgICAgICAgICAgICAgICAsIGwgPSB0b2tlbnMubGVuZ3RoXHJcbiAgICAgICAgICAgICAgICAsIHRva2VuXHJcbiAgICAgICAgICAgICAgICAsIHVwZGF0ZWQgPSBmYWxzZVxyXG4gICAgICAgICAgICA7XHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgIHRva2VuID0gdG9rZW5zW2ldICsgXCJcIjtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbik7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdoaWxlICgrK2kgPCBsKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh1cGRhdGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2xhc3NMaXN0UHJvdG8udG9nZ2xlID0gZnVuY3Rpb24gKHRva2VuLCBmb3JzZSkge1xyXG4gICAgICAgICAgICB0b2tlbiArPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgdmFyXHJcbiAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuY29udGFpbnModG9rZW4pXHJcbiAgICAgICAgICAgICAgICAsIG1ldGhvZCA9IHJlc3VsdCA/XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yc2UgIT09IHRydWUgJiYgXCJyZW1vdmVcIlxyXG4gICAgICAgICAgICAgICAgOlxyXG4gICAgICAgICAgICAgICAgICAgIGZvcnNlICE9PSBmYWxzZSAmJiBcImFkZFwiXHJcbiAgICAgICAgICAgIDtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRob2QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXNbbWV0aG9kXSh0b2tlbik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAhcmVzdWx0O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2xhc3NMaXN0UHJvdG8udG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmpvaW4oXCIgXCIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChvYmpDdHIuZGVmaW5lUHJvcGVydHkpIHtcclxuICAgICAgICAgICAgdmFyIGNsYXNzTGlzdFByb3BEZXNjID0ge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBjbGFzc0xpc3RHZXR0ZXJcclxuICAgICAgICAgICAgICAgICwgZW51bWVyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgLCBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHsgLy8gSUUgOCBkb2Vzbid0IHN1cHBvcnQgZW51bWVyYWJsZTp0cnVlXHJcbiAgICAgICAgICAgICAgICBpZiAoZXgubnVtYmVyID09PSAtMHg3RkY1RUM1NCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTGlzdFByb3BEZXNjLmVudW1lcmFibGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBvYmpDdHIuZGVmaW5lUHJvcGVydHkoZWxlbUN0clByb3RvLCBjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RQcm9wRGVzYyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKG9iakN0cltwcm90b1Byb3BdLl9fZGVmaW5lR2V0dGVyX18pIHtcclxuICAgICAgICAgICAgZWxlbUN0clByb3RvLl9fZGVmaW5lR2V0dGVyX18oY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0R2V0dGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfShzZWxmKSk7XHJcbn0iLCIvLyBGcm9tOiBodHRwOi8vd3d3LmpvbmF0aGFudG5lYWwuY29tL2Jsb2cvZmFraW5nLXRoZS1mdXR1cmUvXHJcbnRoaXMuRWxlbWVudCAmJiAoZnVuY3Rpb24gKEVsZW1lbnRQcm90b3R5cGUsIHBvbHlmaWxsKSB7XHJcbiAgICBmdW5jdGlvbiBOb2RlTGlzdCgpIHsgW3BvbHlmaWxsXSB9XHJcbiAgICBOb2RlTGlzdC5wcm90b3R5cGUubGVuZ3RoID0gQXJyYXkucHJvdG90eXBlLmxlbmd0aDtcclxuXHJcbiAgICBFbGVtZW50UHJvdG90eXBlLm1hdGNoZXNTZWxlY3RvciA9IEVsZW1lbnRQcm90b3R5cGUubWF0Y2hlc1NlbGVjdG9yIHx8XHJcbiAgICBFbGVtZW50UHJvdG90eXBlLm1vek1hdGNoZXNTZWxlY3RvciB8fFxyXG4gICAgRWxlbWVudFByb3RvdHlwZS5tc01hdGNoZXNTZWxlY3RvciB8fFxyXG4gICAgRWxlbWVudFByb3RvdHlwZS5vTWF0Y2hlc1NlbGVjdG9yIHx8XHJcbiAgICBFbGVtZW50UHJvdG90eXBlLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fFxyXG4gICAgZnVuY3Rpb24gbWF0Y2hlc1NlbGVjdG9yKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdHMgPSB0aGlzLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgICAgICAgdmFyIHJlc3VsdHNJbmRleCA9IC0xO1xyXG5cclxuICAgICAgICB3aGlsZSAocmVzdWx0c1srK3Jlc3VsdHNJbmRleF0gJiYgcmVzdWx0c1tyZXN1bHRzSW5kZXhdICE9IHRoaXMpIHt9XHJcblxyXG4gICAgICAgIHJldHVybiAhIXJlc3VsdHNbcmVzdWx0c0luZGV4XTtcclxuICAgIH07XHJcblxyXG4gICAgRWxlbWVudFByb3RvdHlwZS5hbmNlc3RvclF1ZXJ5U2VsZWN0b3JBbGwgPSBFbGVtZW50UHJvdG90eXBlLmFuY2VzdG9yUXVlcnlTZWxlY3RvckFsbCB8fFxyXG4gICAgRWxlbWVudFByb3RvdHlwZS5tb3pBbmNlc3RvclF1ZXJ5U2VsZWN0b3JBbGwgfHxcclxuICAgIEVsZW1lbnRQcm90b3R5cGUubXNBbmNlc3RvclF1ZXJ5U2VsZWN0b3JBbGwgfHxcclxuICAgIEVsZW1lbnRQcm90b3R5cGUub0FuY2VzdG9yUXVlcnlTZWxlY3RvckFsbCB8fFxyXG4gICAgRWxlbWVudFByb3RvdHlwZS53ZWJraXRBbmNlc3RvclF1ZXJ5U2VsZWN0b3JBbGwgfHxcclxuICAgIGZ1bmN0aW9uIGFuY2VzdG9yUXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcikge1xyXG4gICAgICAgIGZvciAodmFyIGNpdGUgPSB0aGlzLCBuZXdOb2RlTGlzdCA9IG5ldyBOb2RlTGlzdCgpOyBjaXRlID0gY2l0ZS5wYXJlbnRFbGVtZW50Oykge1xyXG4gICAgICAgICAgICBpZiAoY2l0ZS5tYXRjaGVzU2VsZWN0b3Ioc2VsZWN0b3IpKSBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKG5ld05vZGVMaXN0LCBjaXRlKTtcclxuICAgICAgICB9XHJcbiBcclxuICAgICAgICByZXR1cm4gbmV3Tm9kZUxpc3Q7XHJcbiAgICB9O1xyXG4gXHJcbiAgICBFbGVtZW50UHJvdG90eXBlLmFuY2VzdG9yUXVlcnlTZWxlY3RvciA9IEVsZW1lbnRQcm90b3R5cGUuYW5jZXN0b3JRdWVyeVNlbGVjdG9yIHx8XHJcbiAgICBFbGVtZW50UHJvdG90eXBlLm1vekFuY2VzdG9yUXVlcnlTZWxlY3RvciB8fFxyXG4gICAgRWxlbWVudFByb3RvdHlwZS5tc0FuY2VzdG9yUXVlcnlTZWxlY3RvciB8fFxyXG4gICAgRWxlbWVudFByb3RvdHlwZS5vQW5jZXN0b3JRdWVyeVNlbGVjdG9yIHx8XHJcbiAgICBFbGVtZW50UHJvdG90eXBlLndlYmtpdEFuY2VzdG9yUXVlcnlTZWxlY3RvciB8fFxyXG4gICAgZnVuY3Rpb24gYW5jZXN0b3JRdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5jZXN0b3JRdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKVswXSB8fCBudWxsO1xyXG4gICAgfTtcclxufSkoRWxlbWVudC5wcm90b3R5cGUpOyIsInZhciBCaWZyb3N0ID0gQmlmcm9zdCB8fCB7fTtcclxuKGZ1bmN0aW9uKGdsb2JhbCwgdW5kZWZpbmVkKSB7XHJcbiAgICBCaWZyb3N0LmV4dGVuZCA9IGZ1bmN0aW9uIGV4dGVuZChkZXN0aW5hdGlvbiwgc291cmNlKSB7XHJcbiAgICAgICAgcmV0dXJuICQuZXh0ZW5kKGRlc3RpbmF0aW9uLCBzb3VyY2UpO1xyXG4gICAgfTtcclxufSkod2luZG93KTsiLCJ2YXIgQmlmcm9zdCA9IEJpZnJvc3QgfHwge307XHJcbkJpZnJvc3QubmFtZXNwYWNlID0gZnVuY3Rpb24gKG5zLCBjb250ZW50KSB7XHJcblxyXG4gICAgLy8gVG9kbzogdGhpcyBzaG91bGQgbm90IGJlIG5lZWRlZCwgaXQgaXMgYSBzeW1wdG9tIG9mIHNvbWV0aGluZyB1c2luZyBpdCBiZWluZyB3cm9uZyEhISBTZSBpc3N1ZSAjMjMyIG9uIEdpdEh1YiAoaHR0cDovL2dpdGh1Yi5jb20vZG9saXR0bGUvQmlmcm9zdC9pc3N1ZXMvMjMyKVxyXG4gICAgbnMgPSBucy5yZXBsYWNlQWxsKFwiLi5cIiwgXCIuXCIpO1xyXG4gICAgaWYgKG5zLmVuZHNXaXRoKFwiLlwiKSkge1xyXG4gICAgICAgIG5zID0gbnMuc3Vic3RyKDAsIG5zLmxlbmd0aCAtIDEpO1xyXG4gICAgfVxyXG4gICAgaWYgKG5zLnN0YXJ0c1dpdGgoXCIuXCIpKSB7XHJcbiAgICAgICAgbnMgPSBucy5zdWJzdHIoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHBhcmVudCA9IHdpbmRvdztcclxuICAgIHZhciBuYW1lID0gXCJcIjtcclxuICAgIHZhciBwYXJ0cyA9IG5zLnNwbGl0KCcuJyk7XHJcbiAgICBwYXJ0cy5mb3JFYWNoKGZ1bmN0aW9uIChwYXJ0KSB7XHJcbiAgICAgICAgaWYgKG5hbWUubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBuYW1lICs9IFwiLlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBuYW1lICs9IHBhcnQ7XHJcbiAgICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyZW50LCBwYXJ0KSkge1xyXG4gICAgICAgICAgICBwYXJlbnRbcGFydF0gPSB7fTtcclxuICAgICAgICAgICAgcGFyZW50W3BhcnRdLnBhcmVudCA9IHBhcmVudDtcclxuICAgICAgICAgICAgcGFyZW50W3BhcnRdLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwYXJlbnQgPSBwYXJlbnRbcGFydF07XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICBCaWZyb3N0Lm5hbWVzcGFjZS5jdXJyZW50ID0gcGFyZW50O1xyXG5cclxuICAgICAgICB2YXIgcHJvcGVydHk7XHJcblxyXG4gICAgICAgIGZvciAocHJvcGVydHkgaW4gY29udGVudCkge1xyXG4gICAgICAgICAgICBwYXJlbnRbcHJvcGVydHldID0gY29udGVudFtwcm9wZXJ0eV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHByb3BlcnR5IGluIHBhcmVudCkge1xyXG4gICAgICAgICAgICBpZiAocGFyZW50Lmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50W3Byb3BlcnR5XS5fbmFtZXNwYWNlID0gcGFyZW50O1xyXG4gICAgICAgICAgICAgICAgcGFyZW50W3Byb3BlcnR5XS5fbmFtZSA9IHByb3BlcnR5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEJpZnJvc3QubmFtZXNwYWNlLmN1cnJlbnQgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwYXJlbnQ7XHJcbn07IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmV4ZWN1dGlvblwiLCB7XHJcbiAgICBQcm9taXNlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmlkID0gQmlmcm9zdC5HdWlkLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnNpZ25hbGxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2sgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZXJyb3IgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaGFzRmFpbGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5mYWlsZWRDYWxsYmFjayA9IG51bGw7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9uU2lnbmFsKCkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5jYWxsYmFjayAhPSBudWxsICYmIHR5cGVvZiBzZWxmLmNhbGxiYWNrICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNlbGYuc2lnbmFsUGFyYW1ldGVyICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jYWxsYmFjayhzZWxmLnNpZ25hbFBhcmFtZXRlciwgQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY2FsbGJhY2soQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZmFpbCA9IGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5mYWlsZWRDYWxsYmFjayAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmZhaWxlZENhbGxiYWNrKGVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZWxmLmhhc0ZhaWxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHNlbGYuZXJyb3IgPSBlcnJvcjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9uRmFpbCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5oYXNGYWlsZWQpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHNlbGYuZXJyb3IpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5mYWlsZWRDYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICB0aGlzLnNpZ25hbCA9IGZ1bmN0aW9uIChwYXJhbWV0ZXIpIHtcclxuICAgICAgICAgICAgc2VsZi5zaWduYWxsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBzZWxmLnNpZ25hbFBhcmFtZXRlciA9IHBhcmFtZXRlcjtcclxuICAgICAgICAgICAgb25TaWduYWwoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRpbnVlV2l0aCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnNpZ25hbGxlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgb25TaWduYWwoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KTtcclxuXHJcbkJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlKCk7XHJcbiAgICByZXR1cm4gcHJvbWlzZTtcclxufTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgaXNPYmplY3Q6IGZ1bmN0aW9uIChvKSB7XHJcbiAgICAgICAgaWYgKG8gPT09IG51bGwgfHwgdHlwZW9mIG8gPT09IFwidW5kZWZpbmVkXCIgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XHJcbiAgICB9XHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBpc051bWJlcjogZnVuY3Rpb24gKG51bWJlcikge1xyXG4gICAgICAgIGlmIChCaWZyb3N0LmlzU3RyaW5nKG51bWJlcikpIHtcclxuICAgICAgICAgICAgaWYgKG51bWJlci5sZW5ndGggPiAxICYmIG51bWJlclswXSA9PT0gJzAnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChudW1iZXIpKSAmJiBpc0Zpbml0ZShudW1iZXIpO1xyXG4gICAgfVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgaXNBcnJheSA6IGZ1bmN0aW9uKG8pIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pID09PSAnW29iamVjdCBBcnJheV0nO1xyXG4gICAgfVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgaXNTdHJpbmc6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCI7XHJcbiAgICAgICAgfVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgaXNOdWxsOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gdmFsdWUgPT09IG51bGw7XHJcbiAgICB9XHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBpc1VuZGVmaW5lZDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIjtcclxuICAgIH1cclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIGlzTnVsbE9yVW5kZWZpbmVkOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gQmlmcm9zdC5pc1VuZGVmaW5lZCh2YWx1ZSkgfHwgQmlmcm9zdC5pc051bGwodmFsdWUpO1xyXG4gICAgfVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgaXNGdW5jdGlvbjogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiO1xyXG4gICAgfVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgaXNUeXBlOiBmdW5jdGlvbiAobykge1xyXG4gICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKG8pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBvLl90eXBlSWQgIT09IFwidW5kZWZpbmVkXCI7XHJcbiAgICB9XHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBmdW5jdGlvblBhcnNlcjoge1xyXG4gICAgICAgIHBhcnNlOiBmdW5jdGlvbihmdW5jKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IGZ1bmMudG9TdHJpbmcoKS5tYXRjaCgvZnVuY3Rpb25cXHcqXFxzKlxcKCguKj8pXFwpLyk7XHJcbiAgICAgICAgICAgIGlmIChtYXRjaCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uQXJndW1lbnRzID0gbWF0Y2hbMV0uc3BsaXQoL1xccyosXFxzKi8pO1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb25Bcmd1bWVudHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnRyaW0oKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGl0ZW1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgYXNzZXRzTWFuYWdlcjoge1xyXG4gICAgICAgIHNjcmlwdHM6IFtdLFxyXG4gICAgICAgIGlzSW5pdGlhbGl6ZWQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gQmlmcm9zdC5hc3NldHNNYW5hZ2VyLnNjcmlwdHMubGVuZ3RoID4gMDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuYXNzZXRzTWFuYWdlci5pc0luaXRpYWxpemVkKCkpIHtcclxuICAgICAgICAgICAgICAgICQuZ2V0KFwiL0JpZnJvc3QvQXNzZXRzTWFuYWdlclwiLCB7IGV4dGVuc2lvbjogXCJqc1wiIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBCaWZyb3N0LmFzc2V0c01hbmFnZXIuaW5pdGlhbGl6ZUZyb21Bc3NldHMocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbCgpO1xyXG4gICAgICAgICAgICAgICAgfSwgXCJqc29uXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGluaXRpYWxpemVGcm9tQXNzZXRzOiBmdW5jdGlvbiAoYXNzZXRzKSB7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5hc3NldHNNYW5hZ2VyLmlzSW5pdGlhbGl6ZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgQmlmcm9zdC5hc3NldHNNYW5hZ2VyLnNjcmlwdHMgPSBhc3NldHM7XHJcbiAgICAgICAgICAgICAgICBCaWZyb3N0Lm5hbWVzcGFjZXMuY3JlYXRlKCkuaW5pdGlhbGl6ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRTY3JpcHRzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBCaWZyb3N0LmFzc2V0c01hbmFnZXIuc2NyaXB0cztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGhhc1NjcmlwdDogZnVuY3Rpb24oc2NyaXB0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBCaWZyb3N0LmFzc2V0c01hbmFnZXIuc2NyaXB0cy5zb21lKGZ1bmN0aW9uIChzY3JpcHRJblN5c3RlbSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNjcmlwdEluU3lzdGVtID09PSBzY3JpcHQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0U2NyaXB0UGF0aHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHBhdGhzID0gW107XHJcblxyXG4gICAgICAgICAgICBCaWZyb3N0LmFzc2V0c01hbmFnZXIuc2NyaXB0cy5mb3JFYWNoKGZ1bmN0aW9uIChmdWxsUGF0aCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhdGggPSBCaWZyb3N0LlBhdGguZ2V0UGF0aFdpdGhvdXRGaWxlbmFtZShmdWxsUGF0aCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGF0aHMuaW5kZXhPZihwYXRoKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXRocy5wdXNoKHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHBhdGhzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIFdlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMudHlwZXMgPSBCaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzO1xyXG5cclxuICAgICAgICB0aGlzLmNhblJlc29sdmUgPSBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnR5cGVzLmhhc093blByb3BlcnR5KG5hbWUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucmVzb2x2ZSA9IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYudHlwZXNbbmFtZV07XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSk7XHJcblxyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzID0ge1xyXG4gICAgb3B0aW9uczoge31cclxufTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIGRlcGVuZGVuY3lSZXNvbHZlcjogKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmdW5jdGlvbiByZXNvbHZlSW1wbGVtZW50YXRpb24obmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciByZXNvbHZlcnMgPSBCaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlcnMuZ2V0QWxsKCk7XHJcbiAgICAgICAgICAgIHZhciByZXNvbHZlZFN5c3RlbSA9IG51bGw7XHJcbiAgICAgICAgICAgIHJlc29sdmVycy5mb3JFYWNoKGZ1bmN0aW9uIChyZXNvbHZlcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc29sdmVkU3lzdGVtICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FuUmVzb2x2ZSA9IHJlc29sdmVyLmNhblJlc29sdmUobmFtZXNwYWNlLCBuYW1lKTtcclxuICAgICAgICAgICAgICAgIGlmIChjYW5SZXNvbHZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZWRTeXN0ZW0gPSByZXNvbHZlci5yZXNvbHZlKG5hbWVzcGFjZSwgbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlZFN5c3RlbTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGlzVHlwZShzeXN0ZW0pIHtcclxuICAgICAgICAgICAgaWYgKHN5c3RlbSAhPSBudWxsICYmXHJcbiAgICAgICAgICAgICAgICBzeXN0ZW0uX3N1cGVyICE9PSBudWxsKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzeXN0ZW0uX3N1cGVyICE9PSBcInVuZGVmaW5lZFwiICYmXHJcbiAgICAgICAgICAgICAgICAgICAgc3lzdGVtLl9zdXBlciA9PT0gQmlmcm9zdC5UeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlzVHlwZShzeXN0ZW0uX3N1cGVyKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVTeXN0ZW1JbnN0YW5jZShzeXN0ZW0pIHtcclxuICAgICAgICAgICAgaWYgKGlzVHlwZShzeXN0ZW0pKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3lzdGVtLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzeXN0ZW07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBiZWdpbkhhbmRsZVN5c3RlbUluc3RhbmNlKHN5c3RlbSkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc3lzdGVtICE9IG51bGwgJiZcclxuICAgICAgICAgICAgICAgIHN5c3RlbS5fc3VwZXIgIT09IG51bGwgJiZcclxuICAgICAgICAgICAgICAgIHR5cGVvZiBzeXN0ZW0uX3N1cGVyICE9PSBcInVuZGVmaW5lZFwiICYmXHJcbiAgICAgICAgICAgICAgICBzeXN0ZW0uX3N1cGVyID09PSBCaWZyb3N0LlR5cGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBzeXN0ZW0uYmVnaW5DcmVhdGUoKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHJlc3VsdCwgbmV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKHN5c3RlbSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZ2V0RGVwZW5kZW5jaWVzRm9yOiBmdW5jdGlvbiAoZnVuYykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlcGVuZGVuY2llcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtZXRlcnMgPSBCaWZyb3N0LmZ1bmN0aW9uUGFyc2VyLnBhcnNlKGZ1bmMpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJhbWV0ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVwZW5kZW5jaWVzLnB1c2gocGFyYW1ldGVyc1tpXS5uYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBkZXBlbmRlbmNpZXM7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBjYW5SZXNvbHZlOiBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBMb29wIHRocm91Z2ggcmVzb2x2ZXJzIGFuZCBjaGVjayBpZiBhbnlvbmUgY2FuIHJlc29sdmUgaXQsIGlmIHNvIHJldHVybiB0cnVlIC0gaWYgbm90IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzb2x2ZXJzID0gQmlmcm9zdC5kZXBlbmRlbmN5UmVzb2x2ZXJzLmdldEFsbCgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNhblJlc29sdmUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlcnMuZm9yRWFjaChmdW5jdGlvbiAocmVzb2x2ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FuUmVzb2x2ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYW5SZXNvbHZlID0gcmVzb2x2ZXIuY2FuUmVzb2x2ZShuYW1lc3BhY2UsIG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhblJlc29sdmU7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICByZXNvbHZlOiBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzb2x2ZWRTeXN0ZW0gPSByZXNvbHZlSW1wbGVtZW50YXRpb24obmFtZXNwYWNlLCBuYW1lKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzb2x2ZWRTeXN0ZW0gPT09IFwidW5kZWZpbmVkXCIgfHwgcmVzb2x2ZWRTeXN0ZW0gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVuYWJsZSB0byByZXNvbHZlICdcIiArIG5hbWUgKyBcIicgaW4gJ1wiICsgbmFtZXNwYWNlICsgXCInXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LlVucmVzb2x2ZWREZXBlbmRlbmNpZXMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzb2x2ZWRTeXN0ZW0gaW5zdGFuY2VvZiBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCInXCIgKyBuYW1lICsgXCInIHdhcyByZXNvbHZlZCBhcyBhbiBhc3luY2hyb25vdXMgZGVwZW5kZW5jeSwgY29uc2lkZXIgdXNpbmcgYmVnaW5DcmVhdGUoKSBvciBtYWtlIHRoZSBkZXBlbmRlbmN5IGF2YWlsYWJsZSBwcmlvciB0byBjYWxsaW5nIGNyZWF0ZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC5Bc3luY2hyb25vdXNEZXBlbmRlbmNpZXNEZXRlY3RlZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBoYW5kbGVTeXN0ZW1JbnN0YW5jZShyZXNvbHZlZFN5c3RlbSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBiZWdpblJlc29sdmU6IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgIEJpZnJvc3QuY29uZmlndXJlLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzb2x2ZWRTeXN0ZW0gPSByZXNvbHZlSW1wbGVtZW50YXRpb24obmFtZXNwYWNlLCBuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlc29sdmVkU3lzdGVtID09PSBcInVuZGVmaW5lZFwiIHx8IHJlc29sdmVkU3lzdGVtID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5hYmxlIHRvIHJlc29sdmUgJ1wiICsgbmFtZSArIFwiJyBpbiAnXCIgKyBuYW1lc3BhY2UgKyBcIidcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2UuZmFpbChuZXcgQmlmcm9zdC5VbnJlc29sdmVkRGVwZW5kZW5jaWVzKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc29sdmVkU3lzdGVtIGluc3RhbmNlb2YgQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlZFN5c3RlbS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHN5c3RlbSwgaW5uZXJQcm9taXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWdpbkhhbmRsZVN5c3RlbUluc3RhbmNlKHN5c3RlbSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jb250aW51ZVdpdGgoZnVuY3Rpb24gKGFjdHVhbFN5c3RlbSwgbmV4dCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChoYW5kbGVTeXN0ZW1JbnN0YW5jZShhY3R1YWxTeXN0ZW0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLm9uRmFpbChmdW5jdGlvbiAoZSkgeyBwcm9taXNlLmZhaWwoZSk7IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChoYW5kbGVTeXN0ZW1JbnN0YW5jZShyZXNvbHZlZFN5c3RlbSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pKClcclxufSk7XHJcbkJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIudHlwZXMuZGVwZW5kZW5jeVJlc29sdmVyID0gQmlmcm9zdC5kZXBlbmRlbmN5UmVzb2x2ZXI7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIGRlcGVuZGVuY3lSZXNvbHZlcnM6IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZ2V0QWxsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzb2x2ZXJzID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBCaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyKCksXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IEJpZnJvc3QuRGVmYXVsdERlcGVuZGVuY3lSZXNvbHZlcigpLFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBCaWZyb3N0Lktub3duQXJ0aWZhY3RUeXBlc0RlcGVuZGVuY3lSZXNvbHZlcigpLFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBCaWZyb3N0Lktub3duQXJ0aWZhY3RJbnN0YW5jZXNEZXBlbmRlbmN5UmVzb2x2ZXIoKSxcclxuXHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gdGhpcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5pbmRleE9mKFwiX1wiKSAhPT0gMCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgdGhpc1twcm9wZXJ0eV0gIT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlcnMucHVzaCh0aGlzW3Byb3BlcnR5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVycztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KSgpXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBEZWZhdWx0RGVwZW5kZW5jeVJlc29sdmVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmRvZXNOYW1lc3BhY2VIYXZlID0gZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmFtZXNwYWNlLmhhc093blByb3BlcnR5KG5hbWUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZG9lc05hbWVzcGFjZUhhdmVTY3JpcHRSZWZlcmVuY2UgPSBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgICAgIGlmIChuYW1lc3BhY2UuaGFzT3duUHJvcGVydHkoXCJfc2NyaXB0c1wiKSAmJiBCaWZyb3N0LmlzQXJyYXkobmFtZXNwYWNlLl9zY3JpcHRzKSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lc3BhY2UuX3NjcmlwdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2NyaXB0ID0gbmFtZXNwYWNlLl9zY3JpcHRzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzY3JpcHQgPT09IG5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldEZpbGVOYW1lID0gZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG5hbWVzcGFjZS5fcGF0aCAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWUgKz0gbmFtZXNwYWNlLl9wYXRoO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFmaWxlTmFtZS5lbmRzV2l0aChcIi9cIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSArPSBcIi9cIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmaWxlTmFtZSArPSBuYW1lO1xyXG4gICAgICAgICAgICBpZiAoIWZpbGVOYW1lLmVuZHNXaXRoKFwiLmpzXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlTmFtZSArPSBcIi5qc1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZpbGVOYW1lID0gZmlsZU5hbWUucmVwbGFjZUFsbChcIi8vXCIsIFwiL1wiKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbGVOYW1lO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRTY3JpcHRSZWZlcmVuY2UgPSBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lLCBwcm9taXNlKSB7XHJcbiAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IHNlbGYuZ2V0RmlsZU5hbWUobmFtZXNwYWNlLCBuYW1lKTtcclxuICAgICAgICAgICAgdmFyIGZpbGUgPSBCaWZyb3N0LmlvLmZpbGVGYWN0b3J5LmNyZWF0ZSgpLmNyZWF0ZShmaWxlTmFtZSwgQmlmcm9zdC5pby5maWxlVHlwZS5qYXZhU2NyaXB0KTtcclxuXHJcbiAgICAgICAgICAgIEJpZnJvc3QuaW8uZmlsZU1hbmFnZXIuY3JlYXRlKCkubG9hZChbZmlsZV0pLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAodHlwZXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzeXN0ZW0gPSB0eXBlc1swXTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmRvZXNOYW1lc3BhY2VIYXZlKG5hbWVzcGFjZSwgbmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzeXN0ZW0gPSBuYW1lc3BhY2VbbmFtZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChzeXN0ZW0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5jYW5SZXNvbHZlID0gZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudCA9IG5hbWVzcGFjZTtcclxuICAgICAgICAgICAgd2hpbGUgKGN1cnJlbnQgIT0gbnVsbCAmJiBjdXJyZW50ICE9PSB3aW5kb3cpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmRvZXNOYW1lc3BhY2VIYXZlKGN1cnJlbnQsIG5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5kb2VzTmFtZXNwYWNlSGF2ZVNjcmlwdFJlZmVyZW5jZShjdXJyZW50LCBuYW1lKSApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50ID09PSBjdXJyZW50LnBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXNvbHZlID0gZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudCA9IG5hbWVzcGFjZTtcclxuICAgICAgICAgICAgd2hpbGUgKGN1cnJlbnQgIT0gbnVsbCAmJiBjdXJyZW50ICE9PSB3aW5kb3cpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmRvZXNOYW1lc3BhY2VIYXZlKGN1cnJlbnQsIG5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRbbmFtZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5kb2VzTmFtZXNwYWNlSGF2ZVNjcmlwdFJlZmVyZW5jZShjdXJyZW50LCBuYW1lKSApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2FkU2NyaXB0UmVmZXJlbmNlKGN1cnJlbnQsIG5hbWUsIHByb21pc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnQgPT09IGN1cnJlbnQucGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnQ7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KTtcclxuIiwiQmlmcm9zdC5kZXBlbmRlbmN5UmVzb2x2ZXJzLkRPTVJvb3REZXBlbmRlbmN5UmVzb2x2ZXIgPSB7XHJcbiAgICBjYW5SZXNvbHZlOiBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIG5hbWUgPT09IFwiRE9NUm9vdFwiO1xyXG4gICAgfSxcclxuXHJcbiAgICByZXNvbHZlOiBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkgIT0gbnVsbCAmJiB0eXBlb2YgZG9jdW1lbnQuYm9keSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuYm9keTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuICAgICAgICBCaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlcnMuRE9NUm9vdERlcGVuZGVuY3lSZXNvbHZlci5wcm9taXNlcy5wdXNoKHByb21pc2UpO1xyXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuQmlmcm9zdC5kZXBlbmRlbmN5UmVzb2x2ZXJzLkRPTVJvb3REZXBlbmRlbmN5UmVzb2x2ZXIucHJvbWlzZXMgPSBbXTtcclxuQmlmcm9zdC5kZXBlbmRlbmN5UmVzb2x2ZXJzLkRPTVJvb3REZXBlbmRlbmN5UmVzb2x2ZXIuZG9jdW1lbnRJc1JlYWR5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgQmlmcm9zdC5kZXBlbmRlbmN5UmVzb2x2ZXJzLkRPTVJvb3REZXBlbmRlbmN5UmVzb2x2ZXIucHJvbWlzZXMuZm9yRWFjaChmdW5jdGlvbiAocHJvbWlzZSkge1xyXG4gICAgICAgIHByb21pc2Uuc2lnbmFsKGRvY3VtZW50LmJvZHkpO1xyXG4gICAgfSk7XHJcbn07IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIEtub3duQXJ0aWZhY3RUeXBlc0RlcGVuZGVuY3lSZXNvbHZlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgc3VwcG9ydGVkQXJ0aWZhY3RzID0ge1xyXG4gICAgICAgICAgICByZWFkTW9kZWxUeXBlczogQmlmcm9zdC5yZWFkLlJlYWRNb2RlbE9mLFxyXG4gICAgICAgICAgICBjb21tYW5kVHlwZXM6IEJpZnJvc3QuY29tbWFuZHMuQ29tbWFuZCxcclxuICAgICAgICAgICAgcXVlcnlUeXBlczogQmlmcm9zdC5yZWFkLlF1ZXJ5XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaXNNb3JlU3BlY2lmaWNOYW1lc3BhY2UoYmFzZSwgY29tcGFyZVRvKSB7XHJcbiAgICAgICAgICAgIHZhciBpc0RlZXBlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgbWF0Y2hlc2Jhc2UgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBiYXNlUGFydHMgPSBiYXNlLm5hbWUuc3BsaXQoXCIuXCIpO1xyXG4gICAgICAgICAgICB2YXIgY29tcGFyZVRvUGFydHMgPSBjb21wYXJlVG8ubmFtZS5zcGxpdChcIi5cIik7XHJcblxyXG4gICAgICAgICAgICBpZiAoYmFzZVBhcnRzLmxlbmd0aCA+IGNvbXBhcmVUb1BhcnRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJhc2VQYXJ0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJhc2VQYXJ0c1tpXSAhPT0gY29tcGFyZVRvUGFydHNbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNhblJlc29sdmUgPSBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lIGluIHN1cHBvcnRlZEFydGlmYWN0cztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnJlc29sdmUgPSBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciB0eXBlID0gc3VwcG9ydGVkQXJ0aWZhY3RzW25hbWVdO1xyXG4gICAgICAgICAgICB2YXIgZXh0ZW5kZXJzID0gdHlwZS5nZXRFeHRlbmRlcnNJbihuYW1lc3BhY2UpO1xyXG4gICAgICAgICAgICB2YXIgcmVzb2x2ZWRUeXBlcyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgZXh0ZW5kZXJzLmZvckVhY2goZnVuY3Rpb24gKGV4dGVuZGVyKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IGV4dGVuZGVyLl9uYW1lO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc29sdmVkVHlwZXNbbmFtZV0gJiYgIWlzTW9yZVNwZWNpZmljTmFtZXNwYWNlKHJlc29sdmVkVHlwZXNbbmFtZV0uX25hbWVzcGFjZSwgZXh0ZW5kZXIuX25hbWVzcGFjZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZWRUeXBlc1tuYW1lXSA9IGV4dGVuZGVyO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlZFR5cGVzO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBLbm93bkFydGlmYWN0SW5zdGFuY2VzRGVwZW5kZW5jeVJlc29sdmVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBzdXBwb3J0ZWRBcnRpZmFjdHMgPSB7XHJcbiAgICAgICAgICAgIHJlYWRNb2RlbHM6IEJpZnJvc3QucmVhZC5SZWFkTW9kZWxPZixcclxuICAgICAgICAgICAgY29tbWFuZHM6IEJpZnJvc3QuY29tbWFuZHMuQ29tbWFuZCxcclxuICAgICAgICAgICAgcXVlcmllczogQmlmcm9zdC5yZWFkLlF1ZXJ5XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaXNNb3JlU3BlY2lmaWNOYW1lc3BhY2UoYmFzZSwgY29tcGFyZVRvKSB7XHJcbiAgICAgICAgICAgIHZhciBpc0RlZXBlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgbWF0Y2hlc2Jhc2UgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBiYXNlUGFydHMgPSBiYXNlLm5hbWUuc3BsaXQoXCIuXCIpO1xyXG4gICAgICAgICAgICB2YXIgY29tcGFyZVRvUGFydHMgPSBjb21wYXJlVG8ubmFtZS5zcGxpdChcIi5cIik7XHJcblxyXG4gICAgICAgICAgICBpZiAoYmFzZVBhcnRzLmxlbmd0aCA+IGNvbXBhcmVUb1BhcnRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJhc2VQYXJ0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJhc2VQYXJ0c1tpXSAhPT0gY29tcGFyZVRvUGFydHNbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNhblJlc29sdmUgPSBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lIGluIHN1cHBvcnRlZEFydGlmYWN0cztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnJlc29sdmUgPSBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciB0eXBlID0gc3VwcG9ydGVkQXJ0aWZhY3RzW25hbWVdO1xyXG4gICAgICAgICAgICB2YXIgZXh0ZW5kZXJzID0gdHlwZS5nZXRFeHRlbmRlcnNJbihuYW1lc3BhY2UpO1xyXG4gICAgICAgICAgICB2YXIgcmVzb2x2ZWRUeXBlcyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgZXh0ZW5kZXJzLmZvckVhY2goZnVuY3Rpb24gKGV4dGVuZGVyKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IGV4dGVuZGVyLl9uYW1lO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc29sdmVkVHlwZXNbbmFtZV0gJiYgIWlzTW9yZVNwZWNpZmljTmFtZXNwYWNlKHJlc29sdmVkVHlwZXNbbmFtZV0uX25hbWVzcGFjZSwgZXh0ZW5kZXIuX25hbWVzcGFjZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZWRUeXBlc1tuYW1lXSA9IGV4dGVuZGVyO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHZhciByZXNvbHZlZEluc3RhbmNlcyA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIHJlc29sdmVkVHlwZXMpIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmVkSW5zdGFuY2VzW3Byb3BdID0gcmVzb2x2ZWRUeXBlc1twcm9wXS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVkSW5zdGFuY2VzO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBHdWlkIDoge1xyXG4gICAgICAgIGNyZWF0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIFM0KCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICgoKDEgKyBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDApIHwgMCkudG9TdHJpbmcoMTYpLnN1YnN0cmluZygxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gKFM0KCkgKyBTNCgpICsgXCItXCIgKyBTNCgpICsgXCItXCIgKyBTNCgpICsgXCItXCIgKyBTNCgpICsgXCItXCIgKyBTNCgpICsgUzQoKSArIFM0KCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1wdHk6IFwiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwXCJcclxuICAgIH1cclxufSk7XHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBUeXBlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIHRocm93SWZNaXNzaW5nVHlwZURlZmluaXRpb24odHlwZURlZmluaXRpb24pIHtcclxuICAgICAgICBpZiAodHlwZURlZmluaXRpb24gPT0gbnVsbCB8fCB0eXBlb2YgdHlwZURlZmluaXRpb24gPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QuTWlzc2luZ1R5cGVEZWZpbml0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRocm93SWZUeXBlRGVmaW5pdGlvbklzT2JqZWN0TGl0ZXJhbCh0eXBlRGVmaW5pdGlvbikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdHlwZURlZmluaXRpb24gPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QuT2JqZWN0TGl0ZXJhbE5vdEFsbG93ZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYWRkU3RhdGljUHJvcGVydGllcyh0eXBlRGVmaW5pdGlvbikge1xyXG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIEJpZnJvc3QuVHlwZSkge1xyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5UeXBlLmhhc093blByb3BlcnR5KHByb3BlcnR5KSAmJiBwcm9wZXJ0eSAhPT0gXCJfZXh0ZW5kZXJzXCIpIHtcclxuICAgICAgICAgICAgICAgIHR5cGVEZWZpbml0aW9uW3Byb3BlcnR5XSA9IEJpZnJvc3QuVHlwZVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0dXBEZXBlbmRlbmNpZXModHlwZURlZmluaXRpb24pIHtcclxuICAgICAgICB0eXBlRGVmaW5pdGlvbi5fZGVwZW5kZW5jaWVzID0gQmlmcm9zdC5kZXBlbmRlbmN5UmVzb2x2ZXIuZ2V0RGVwZW5kZW5jaWVzRm9yKHR5cGVEZWZpbml0aW9uKTtcclxuXHJcbiAgICAgICAgdmFyIGZpcnN0UGFyYW1ldGVyID0gdHJ1ZTtcclxuICAgICAgICB2YXIgY3JlYXRlRnVuY3Rpb25TdHJpbmcgPSBcIkZ1bmN0aW9uKCdkZWZpbml0aW9uJywgJ2RlcGVuZGVuY2llcycsJ3JldHVybiBuZXcgZGVmaW5pdGlvbihcIjtcclxuXHJcbiAgICAgICAgaWYoIHR5cGVvZiB0eXBlRGVmaW5pdGlvbi5fZGVwZW5kZW5jaWVzICE9PSBcInVuZGVmaW5lZFwiICkge1xyXG4gICAgICAgICAgICB0eXBlRGVmaW5pdGlvbi5fZGVwZW5kZW5jaWVzLmZvckVhY2goZnVuY3Rpb24oZGVwZW5kZW5jeSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGlmICghZmlyc3RQYXJhbWV0ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVGdW5jdGlvblN0cmluZyArPSBcIixcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZpcnN0UGFyYW1ldGVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVGdW5jdGlvblN0cmluZyArPSBcImRlcGVuZGVuY2llc1tcIiArIGluZGV4ICsgXCJdXCI7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjcmVhdGVGdW5jdGlvblN0cmluZyArPSBcIik7JylcIjtcclxuXHJcbiAgICAgICAgdHlwZURlZmluaXRpb24uY3JlYXRlRnVuY3Rpb24gPSBldmFsKGNyZWF0ZUZ1bmN0aW9uU3RyaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXREZXBlbmRlbmN5SW5zdGFuY2VzKG5hbWVzcGFjZSwgdHlwZURlZmluaXRpb24pIHtcclxuICAgICAgICB2YXIgZGVwZW5kZW5jeUluc3RhbmNlcyA9IFtdO1xyXG4gICAgICAgIGlmKCB0eXBlb2YgdHlwZURlZmluaXRpb24uX2RlcGVuZGVuY2llcyAhPT0gXCJ1bmRlZmluZWRcIiApIHtcclxuICAgICAgICAgICAgdHlwZURlZmluaXRpb24uX2RlcGVuZGVuY2llcy5mb3JFYWNoKGZ1bmN0aW9uKGRlcGVuZGVuY3kpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkZXBlbmRlbmN5SW5zdGFuY2UgPSBCaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlci5yZXNvbHZlKG5hbWVzcGFjZSwgZGVwZW5kZW5jeSk7XHJcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmN5SW5zdGFuY2VzLnB1c2goZGVwZW5kZW5jeUluc3RhbmNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZXBlbmRlbmN5SW5zdGFuY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlc29sdmUobmFtZXNwYWNlLCBkZXBlbmRlbmN5LCBpbmRleCwgaW5zdGFuY2VzLCB0eXBlRGVmaW5pdGlvbiwgcmVzb2x2ZWRDYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBwcm9taXNlID1cclxuICAgICAgICAgICAgQmlmcm9zdC5kZXBlbmRlbmN5UmVzb2x2ZXJcclxuICAgICAgICAgICAgICAgIC5iZWdpblJlc29sdmUobmFtZXNwYWNlLCBkZXBlbmRlbmN5KVxyXG4gICAgICAgICAgICAgICAgLmNvbnRpbnVlV2l0aChmdW5jdGlvbihyZXN1bHQsIG5leHRQcm9taXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2VzW2luZGV4XSA9IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlZENhbGxiYWNrKHJlc3VsdCwgbmV4dFByb21pc2UpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGJlZ2luR2V0RGVwZW5kZW5jeUluc3RhbmNlcyhuYW1lc3BhY2UsIHR5cGVEZWZpbml0aW9uLCBpbnN0YW5jZUhhc2gpIHtcclxuICAgICAgICBmdW5jdGlvbiByZXNvbHZlZChyZXN1bHQsIG5leHRQcm9taXNlKSB7XHJcbiAgICAgICAgICAgIHNvbHZlZERlcGVuZGVuY2llcysrO1xyXG4gICAgICAgICAgICBpZiAoc29sdmVkRGVwZW5kZW5jaWVzID09PSBkZXBlbmRlbmNpZXNUb1Jlc29sdmUpIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGRlcGVuZGVuY3lJbnN0YW5jZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgdmFyIGRlcGVuZGVuY3lJbnN0YW5jZXMgPSBbXTtcclxuICAgICAgICB2YXIgc29sdmVkRGVwZW5kZW5jaWVzID0gMDtcclxuICAgICAgICBpZiggdHlwZW9mIHR5cGVEZWZpbml0aW9uLl9kZXBlbmRlbmNpZXMgIT09IFwidW5kZWZpbmVkXCIgKSB7XHJcbiAgICAgICAgICAgIHZhciBkZXBlbmRlbmNpZXNUb1Jlc29sdmUgPSB0eXBlRGVmaW5pdGlvbi5fZGVwZW5kZW5jaWVzLmxlbmd0aDtcclxuICAgICAgICAgICAgdmFyIGFjdHVhbERlcGVuZGVuY3lJbmRleCA9IDA7XHJcbiAgICAgICAgICAgIHZhciBkZXBlbmRlbmN5ID0gXCJcIjtcclxuICAgICAgICAgICAgZm9yKCB2YXIgZGVwZW5kZW5jeUluZGV4PTA7IGRlcGVuZGVuY3lJbmRleDxkZXBlbmRlbmNpZXNUb1Jlc29sdmU7IGRlcGVuZGVuY3lJbmRleCsrICkge1xyXG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jeSA9IHR5cGVEZWZpbml0aW9uLl9kZXBlbmRlbmNpZXNbZGVwZW5kZW5jeUluZGV4XTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2VIYXNoICYmIGluc3RhbmNlSGFzaC5oYXNPd25Qcm9wZXJ0eShkZXBlbmRlbmN5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlcGVuZGVuY3lJbnN0YW5jZXNbZGVwZW5kZW5jeUluZGV4XSA9IGluc3RhbmNlSGFzaFtkZXBlbmRlbmN5XTtcclxuICAgICAgICAgICAgICAgICAgICBzb2x2ZWREZXBlbmRlbmNpZXMrKztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc29sdmVkRGVwZW5kZW5jaWVzID09PSBkZXBlbmRlbmNpZXNUb1Jlc29sdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoZGVwZW5kZW5jeUluc3RhbmNlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG5hbWVzcGFjZSwgZGVwZW5kZW5jeSwgZGVwZW5kZW5jeUluZGV4LCBkZXBlbmRlbmN5SW5zdGFuY2VzLCB0eXBlRGVmaW5pdGlvbiwgcmVzb2x2ZWQpLm9uRmFpbChwcm9taXNlLmZhaWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBleHBhbmRJbnN0YW5jZXNIYXNoVG9EZXBlbmRlbmNpZXModHlwZURlZmluaXRpb24sIGluc3RhbmNlSGFzaCwgZGVwZW5kZW5jeUluc3RhbmNlcykge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdHlwZURlZmluaXRpb24uX2RlcGVuZGVuY2llcyA9PT0gXCJ1bmRlZmluZWRcIiB8fCB0eXBlRGVmaW5pdGlvbi5fZGVwZW5kZW5jaWVzID09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IoIHZhciBkZXBlbmRlbmN5IGluIGluc3RhbmNlSGFzaCApIHtcclxuICAgICAgICAgICAgZm9yKCB2YXIgZGVwZW5kZW5jeUluZGV4PTA7IGRlcGVuZGVuY3lJbmRleDx0eXBlRGVmaW5pdGlvbi5fZGVwZW5kZW5jaWVzLmxlbmd0aDsgZGVwZW5kZW5jeUluZGV4KysgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiggdHlwZURlZmluaXRpb24uX2RlcGVuZGVuY2llc1tkZXBlbmRlbmN5SW5kZXhdID09PSBkZXBlbmRlbmN5ICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlcGVuZGVuY3lJbnN0YW5jZXNbZGVwZW5kZW5jeUluZGV4XSA9IGluc3RhbmNlSGFzaFtkZXBlbmRlbmN5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBleHBhbmREZXBlbmRlbmNpZXNUb0luc3RhbmNlSGFzaCh0eXBlRGVmaW5pdGlvbiwgZGVwZW5kZW5jaWVzLCBpbnN0YW5jZUhhc2gpIHtcclxuICAgICAgICBmb3IoIHZhciBkZXBlbmRlbmN5SW5kZXg9MDsgZGVwZW5kZW5jeUluZGV4PGRlcGVuZGVuY2llcy5sZW5ndGg7IGRlcGVuZGVuY3lJbmRleCsrICkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZUhhc2hbdHlwZURlZmluaXRpb24uX2RlcGVuZGVuY2llc1tkZXBlbmRlbmN5SW5kZXhdXSA9IGRlcGVuZGVuY2llc1tkZXBlbmRlbmN5SW5kZXhdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZXNvbHZlRGVwZW5kZW5jeUluc3RhbmNlc1RoYXRIYXNOb3RCZWVuUmVzb2x2ZWQoZGVwZW5kZW5jeUluc3RhbmNlcywgdHlwZURlZmluaXRpb24pIHtcclxuICAgICAgICBkZXBlbmRlbmN5SW5zdGFuY2VzLmZvckVhY2goZnVuY3Rpb24oZGVwZW5kZW5jeUluc3RhbmNlLCBpbmRleCkge1xyXG4gICAgICAgICAgICBpZiggZGVwZW5kZW5jeUluc3RhbmNlID09IG51bGwgfHwgdHlwZW9mIGRlcGVuZGVuY3lJbnN0YW5jZSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcclxuICAgICAgICAgICAgICAgIHZhciBkZXBlbmRlbmN5ID0gdHlwZURlZmluaXRpb24uX2RlcGVuZGVuY2llc1tpbmRleF07XHJcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmN5SW5zdGFuY2VzW2luZGV4XSA9IEJpZnJvc3QuZGVwZW5kZW5jeVJlc29sdmVyLnJlc29sdmUodHlwZURlZmluaXRpb24uX25hbWVzcGFjZSwgZGVwZW5kZW5jeSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZXNvbHZlRGVwZW5kZW5jeUluc3RhbmNlcyhpbnN0YW5jZUhhc2gsIHR5cGVEZWZpbml0aW9uKSB7XHJcbiAgICAgICAgdmFyIGRlcGVuZGVuY3lJbnN0YW5jZXMgPSBbXTtcclxuICAgICAgICBpZiggdHlwZW9mIGluc3RhbmNlSGFzaCA9PT0gXCJvYmplY3RcIiApIHtcclxuICAgICAgICAgICAgZXhwYW5kSW5zdGFuY2VzSGFzaFRvRGVwZW5kZW5jaWVzKHR5cGVEZWZpbml0aW9uLCBpbnN0YW5jZUhhc2gsIGRlcGVuZGVuY3lJbnN0YW5jZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggdHlwZW9mIHR5cGVEZWZpbml0aW9uLl9kZXBlbmRlbmNpZXMgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZURlZmluaXRpb24uX2RlcGVuZGVuY2llcy5sZW5ndGggPiAwICkge1xyXG4gICAgICAgICAgICBpZiggZGVwZW5kZW5jeUluc3RhbmNlcy5sZW5ndGggPiAwICkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZURlcGVuZGVuY3lJbnN0YW5jZXNUaGF0SGFzTm90QmVlblJlc29sdmVkKGRlcGVuZGVuY3lJbnN0YW5jZXMsIHR5cGVEZWZpbml0aW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlcGVuZGVuY3lJbnN0YW5jZXMgPSBnZXREZXBlbmRlbmN5SW5zdGFuY2VzKHR5cGVEZWZpbml0aW9uLl9uYW1lc3BhY2UsIHR5cGVEZWZpbml0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGVwZW5kZW5jeUluc3RhbmNlcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhZGRNaXNzaW5nRGVwZW5kZW5jaWVzQXNOdWxsRnJvbVR5cGVEZWZpbml0aW9uKGluc3RhbmNlSGFzaCwgdHlwZURlZmluaXRpb24pIHtcclxuICAgICAgICBpZiAodHlwZW9mIHR5cGVEZWZpbml0aW9uLl9kZXBlbmRlbmNpZXMgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIGluc3RhbmNlSGFzaCA9PT0gXCJ1bmRlZmluZWRcIiB8fCBpbnN0YW5jZUhhc2ggPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciggdmFyIGluZGV4PTA7IGluZGV4PHR5cGVEZWZpbml0aW9uLl9kZXBlbmRlbmNpZXMubGVuZ3RoOyBpbmRleCsrICkge1xyXG4gICAgICAgICAgICB2YXIgZGVwZW5kZW5jeSA9IHR5cGVEZWZpbml0aW9uLl9kZXBlbmRlbmNpZXNbaW5kZXhdO1xyXG4gICAgICAgICAgICBpZiAoIShkZXBlbmRlbmN5IGluIGluc3RhbmNlSGFzaCkpIHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlSGFzaFtkZXBlbmRlbmN5XSA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaGFuZGxlT25DcmVhdGUodHlwZSwgbGFzdERlc2NlbmRhbnQsIGN1cnJlbnRJbnN0YW5jZSkge1xyXG4gICAgICAgIGlmIChjdXJyZW50SW5zdGFuY2UgPT0gbnVsbCB8fCB0eXBlb2YgY3VycmVudEluc3RhbmNlID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCB0eXBlb2YgdHlwZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgdHlwZS5wcm90b3R5cGUgIT09IFwidW5kZWZpbmVkXCIgKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZU9uQ3JlYXRlKHR5cGUuX3N1cGVyLCBsYXN0RGVzY2VuZGFudCwgdHlwZS5wcm90b3R5cGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIGN1cnJlbnRJbnN0YW5jZS5oYXNPd25Qcm9wZXJ0eShcIm9uQ3JlYXRlZFwiKSAmJiB0eXBlb2YgY3VycmVudEluc3RhbmNlLm9uQ3JlYXRlZCA9PT0gXCJmdW5jdGlvblwiICkge1xyXG4gICAgICAgICAgICBjdXJyZW50SW5zdGFuY2Uub25DcmVhdGVkKGxhc3REZXNjZW5kYW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQmlmcm9zdC5UeXBlLl9leHRlbmRlcnMgPSBbXTtcclxuXHJcbiAgICBCaWZyb3N0LlR5cGUuc2NvcGUgPSB7XHJcbiAgICAgICAgZ2V0Rm9yIDogZnVuY3Rpb24obmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgQmlmcm9zdC5UeXBlLnR5cGVPZiA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5fc3VwZXIgPT09IFwidW5kZWZpbmVkXCIgfHxcclxuICAgICAgICAgICAgdHlwZW9mIHRoaXMuX3N1cGVyLl90eXBlSWQgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3N1cGVyLl90eXBlSWQgPT09IHR5cGUuX3R5cGVJZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgdHlwZS5fc3VwZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgdmFyIGlzVHlwZSA9IHRoaXMuX3N1cGVyLnR5cGVPZih0eXBlKTtcclxuICAgICAgICAgICAgaWYgKGlzVHlwZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIEJpZnJvc3QuVHlwZS5nZXRFeHRlbmRlcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2V4dGVuZGVycztcclxuICAgIH07XHJcblxyXG4gICAgQmlmcm9zdC5UeXBlLmdldEV4dGVuZGVyc0luID0gZnVuY3Rpb24gKG5hbWVzcGFjZSkge1xyXG4gICAgICAgIHZhciBpbk5hbWVzcGFjZSA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLl9leHRlbmRlcnMuZm9yRWFjaChmdW5jdGlvbiAoZXh0ZW5kZXIpIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSBuYW1lc3BhY2U7XHJcbiAgICAgICAgICAgIHdoaWxlIChjdXJyZW50ICE9PSB3aW5kb3cpIHtcclxuICAgICAgICAgICAgICAgIGlmIChleHRlbmRlci5fbmFtZXNwYWNlID09PSBjdXJyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5OYW1lc3BhY2UucHVzaChleHRlbmRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNVbmRlZmluZWQoY3VycmVudC5wYXJlbnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBpbk5hbWVzcGFjZTtcclxuICAgIH07XHJcblxyXG5cclxuXHJcbiAgICBCaWZyb3N0LlR5cGUuZXh0ZW5kID0gZnVuY3Rpb24gKHR5cGVEZWZpbml0aW9uKSB7XHJcbiAgICAgICAgdGhyb3dJZk1pc3NpbmdUeXBlRGVmaW5pdGlvbih0eXBlRGVmaW5pdGlvbik7XHJcbiAgICAgICAgdGhyb3dJZlR5cGVEZWZpbml0aW9uSXNPYmplY3RMaXRlcmFsKHR5cGVEZWZpbml0aW9uKTtcclxuXHJcbiAgICAgICAgYWRkU3RhdGljUHJvcGVydGllcyh0eXBlRGVmaW5pdGlvbik7XHJcbiAgICAgICAgc2V0dXBEZXBlbmRlbmNpZXModHlwZURlZmluaXRpb24pO1xyXG4gICAgICAgIHR5cGVEZWZpbml0aW9uLl9zdXBlciA9IHRoaXM7XHJcbiAgICAgICAgdHlwZURlZmluaXRpb24uX3R5cGVJZCA9IEJpZnJvc3QuR3VpZC5jcmVhdGUoKTtcclxuICAgICAgICB0eXBlRGVmaW5pdGlvbi5fZXh0ZW5kZXJzID0gW107XHJcbiAgICAgICAgQmlmcm9zdC5UeXBlLnJlZ2lzdGVyRXh0ZW5kZXIodGhpcywgdHlwZURlZmluaXRpb24pO1xyXG4gICAgICAgIHJldHVybiB0eXBlRGVmaW5pdGlvbjtcclxuICAgIH07XHJcblxyXG4gICAgQmlmcm9zdC5UeXBlLnJlZ2lzdGVyRXh0ZW5kZXIgPSBmdW5jdGlvbiAodHlwZUV4dGVuZGVkLCB0eXBlRGVmaW5lZCkge1xyXG4gICAgICAgIHZhciBzdXBlclR5cGUgPSB0eXBlRXh0ZW5kZWQ7XHJcblxyXG4gICAgICAgIHdoaWxlIChzdXBlclR5cGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoc3VwZXJUeXBlLl9leHRlbmRlcnMuaW5kZXhPZih0eXBlRGVmaW5lZCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlclR5cGUuX2V4dGVuZGVycy5wdXNoKHR5cGVEZWZpbmVkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdXBlclR5cGUgPSBzdXBlclR5cGUuX3N1cGVyO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgQmlmcm9zdC5UeXBlLnNjb3BlVG8gPSBmdW5jdGlvbihzY29wZSkge1xyXG4gICAgICAgIGlmKCB0eXBlb2Ygc2NvcGUgPT09IFwiZnVuY3Rpb25cIiApIHtcclxuICAgICAgICAgICAgdGhpcy5zY29wZSA9IHtcclxuICAgICAgICAgICAgICAgIGdldEZvcjogc2NvcGVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiggdHlwZW9mIHNjb3BlLmdldEZvciA9PT0gXCJmdW5jdGlvblwiICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY29wZSA9IHNjb3BlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY29wZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBnZXRGb3I6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIEJpZnJvc3QuVHlwZS5kZWZhdWx0U2NvcGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnNjb3BlID0ge1xyXG4gICAgICAgICAgICBnZXRGb3I6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBCaWZyb3N0LlR5cGUucmVxdWlyZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZm9yICh2YXIgYXJndW1lbnRJbmRleCA9IDA7IGFyZ3VtZW50SW5kZXggPCBhcmd1bWVudHMubGVuZ3RoOyBhcmd1bWVudEluZGV4KyspIHtcclxuICAgICAgICAgICAgdGhpcy5fZGVwZW5kZW5jaWVzLnB1c2goYXJndW1lbnRzW2FyZ3VtZW50SW5kZXhdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBCaWZyb3N0LlR5cGUuY3JlYXRlID0gZnVuY3Rpb24gKGluc3RhbmNlSGFzaCwgaXNTdXBlcikge1xyXG4gICAgICAgIHZhciBhY3R1YWxUeXBlID0gdGhpcztcclxuICAgICAgICBpZiggdGhpcy5fc3VwZXIgIT0gbnVsbCApIHtcclxuICAgICAgICAgICAgYWN0dWFsVHlwZS5wcm90b3R5cGUgPSB0aGlzLl9zdXBlci5jcmVhdGUoaW5zdGFuY2VIYXNoLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYWRkTWlzc2luZ0RlcGVuZGVuY2llc0FzTnVsbEZyb21UeXBlRGVmaW5pdGlvbihpbnN0YW5jZUhhc2gsIHRoaXMpO1xyXG4gICAgICAgIHZhciBzY29wZSA9IG51bGw7XHJcbiAgICAgICAgaWYoIHRoaXMgIT09IEJpZnJvc3QuVHlwZSApIHtcclxuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZXNQZXJTY29wZSA9IHRoaXMuaW5zdGFuY2VzUGVyU2NvcGUgfHwge307XHJcblxyXG4gICAgICAgICAgICBzY29wZSA9IHRoaXMuc2NvcGUuZ2V0Rm9yKHRoaXMuX25hbWVzcGFjZSwgdGhpcy5fbmFtZSwgdGhpcy5fdHlwZUlkKTtcclxuICAgICAgICAgICAgaWYgKHNjb3BlICE9IG51bGwgJiYgdGhpcy5pbnN0YW5jZXNQZXJTY29wZS5oYXNPd25Qcm9wZXJ0eShzY29wZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlc1BlclNjb3BlW3Njb3BlXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGluc3RhbmNlID0gbnVsbDtcclxuICAgICAgICBpZiggdHlwZW9mIHRoaXMuY3JlYXRlRnVuY3Rpb24gIT09IFwidW5kZWZpbmVkXCIgKSB7XHJcbiAgICAgICAgICAgIHZhciBkZXBlbmRlbmN5SW5zdGFuY2VzID0gcmVzb2x2ZURlcGVuZGVuY3lJbnN0YW5jZXMoaW5zdGFuY2VIYXNoLCB0aGlzKTtcclxuICAgICAgICAgICAgaW5zdGFuY2UgPSB0aGlzLmNyZWF0ZUZ1bmN0aW9uKHRoaXMsIGRlcGVuZGVuY3lJbnN0YW5jZXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlID0gbmV3IGFjdHVhbFR5cGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluc3RhbmNlLl90eXBlID0gYWN0dWFsVHlwZTtcclxuXHJcbiAgICAgICAgaWYoIGlzU3VwZXIgIT09IHRydWUgKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZU9uQ3JlYXRlKGFjdHVhbFR5cGUsIGluc3RhbmNlLCBpbnN0YW5jZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiggc2NvcGUgIT0gbnVsbCApIHtcclxuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZXNQZXJTY29wZVtzY29wZV0gPSBpbnN0YW5jZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgIH07XHJcblxyXG4gICAgQmlmcm9zdC5UeXBlLmNyZWF0ZVdpdGhvdXRTY29wZSA9IGZ1bmN0aW9uIChpbnN0YW5jZUhhc2gsIGlzU3VwZXIpIHtcclxuICAgICAgICB2YXIgc2NvcGUgPSB0aGlzLnNjb3BlO1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdFNjb3BlKCk7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlID0gdGhpcy5jcmVhdGUoaW5zdGFuY2VIYXNoLCBpc1N1cGVyKTtcclxuICAgICAgICB0aGlzLnNjb3BlID0gc2NvcGU7XHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfTtcclxuXHJcbiAgICBCaWZyb3N0LlR5cGUuZW5zdXJlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgdmFyIGxvYWRlZERlcGVuZGVuY2llcyA9IDA7XHJcbiAgICAgICAgdmFyIGRlcGVuZGVuY2llc1RvUmVzb2x2ZSA9IHRoaXMuX2RlcGVuZGVuY2llcy5sZW5ndGg7XHJcbiAgICAgICAgdmFyIG5hbWVzcGFjZSA9IHRoaXMuX25hbWVzcGFjZTtcclxuICAgICAgICB2YXIgcmVzb2x2ZXIgPSBCaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlcjtcclxuICAgICAgICBpZiAoZGVwZW5kZW5jaWVzVG9SZXNvbHZlID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kZXBlbmRlbmNpZXMuZm9yRWFjaChmdW5jdGlvbiAoZGVwZW5kZW5jeSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChyZXNvbHZlci5jYW5SZXNvbHZlKG5hbWVzcGFjZSwgZGVwZW5kZW5jeSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlci5iZWdpblJlc29sdmUobmFtZXNwYWNlLCBkZXBlbmRlbmN5KS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHJlc29sdmVkU3lzdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRlZERlcGVuZGVuY2llcysrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9hZGVkRGVwZW5kZW5jaWVzID09PSBkZXBlbmRlbmNpZXNUb1Jlc29sdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVwZW5kZW5jaWVzVG9SZXNvbHZlLS07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvYWRlZERlcGVuZGVuY2llcyA9PT0gZGVwZW5kZW5jaWVzVG9SZXNvbHZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwcm9taXNlLnNpZ25hbCgpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH07XHJcblxyXG4gICAgQmlmcm9zdC5UeXBlLmJlZ2luQ3JlYXRlID0gZnVuY3Rpb24oaW5zdGFuY2VIYXNoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgdmFyIHN1cGVyUHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgc3VwZXJQcm9taXNlLm9uRmFpbChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBwcm9taXNlLmZhaWwoZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmKCB0aGlzLl9zdXBlciAhPSBudWxsICkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdXBlci5iZWdpbkNyZWF0ZShpbnN0YW5jZUhhc2gpLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoX3N1cGVyLCBuZXh0UHJvbWlzZSkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXJQcm9taXNlLnNpZ25hbChfc3VwZXIpO1xyXG4gICAgICAgICAgICB9KS5vbkZhaWwoZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2UuZmFpbChlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc3VwZXJQcm9taXNlLnNpZ25hbChudWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1cGVyUHJvbWlzZS5jb250aW51ZVdpdGgoZnVuY3Rpb24oX3N1cGVyLCBuZXh0UHJvbWlzZSkge1xyXG4gICAgICAgICAgICBzZWxmLnByb3RvdHlwZSA9IF9zdXBlcjtcclxuXHJcbiAgICAgICAgICAgIGlmKCBzZWxmLl9kZXBlbmRlbmNpZXMgPT0gbnVsbCB8fFxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIHNlbGYuX2RlcGVuZGVuY2llcyA9PT0gXCJ1bmRlZmluZWRcIiB8fFxyXG4gICAgICAgICAgICAgICAgc2VsZi5fZGVwZW5kZW5jaWVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gc2VsZi5jcmVhdGUoaW5zdGFuY2VIYXNoKTtcclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGJlZ2luR2V0RGVwZW5kZW5jeUluc3RhbmNlcyhzZWxmLl9uYW1lc3BhY2UsIHNlbGYsIGluc3RhbmNlSGFzaClcclxuICAgICAgICAgICAgICAgICAgICAuY29udGludWVXaXRoKGZ1bmN0aW9uKGRlcGVuZGVuY2llcywgbmV4dFByb21pc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlcGVuZGVuY3lJbnN0YW5jZXMgPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kRGVwZW5kZW5jaWVzVG9JbnN0YW5jZUhhc2goc2VsZiwgZGVwZW5kZW5jaWVzLCBkZXBlbmRlbmN5SW5zdGFuY2VzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHR5cGVvZiBpbnN0YW5jZUhhc2ggPT09IFwib2JqZWN0XCIgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IoIHZhciBwcm9wZXJ0eSBpbiBpbnN0YW5jZUhhc2ggKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwZW5kZW5jeUluc3RhbmNlc1twcm9wZXJ0eV0gPSBpbnN0YW5jZUhhc2hbcHJvcGVydHldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gc2VsZi5jcmVhdGUoZGVwZW5kZW5jeUluc3RhbmNlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2UuZmFpbChlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH07XHJcbn0pKCk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIFNpbmdsZXRvbjogZnVuY3Rpb24gKHR5cGVEZWZpbml0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIEJpZnJvc3QuVHlwZS5leHRlbmQodHlwZURlZmluaXRpb24pLnNjb3BlVG8od2luZG93KTtcclxuICAgIH1cclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnR5cGVzXCIsIHtcclxuICAgIFR5cGVJbmZvOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBbXTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LnR5cGVzLlR5cGVJbmZvLmNyZWF0ZUZyb20gPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcclxuICAgIHZhciB0eXBlSW5mbyA9IEJpZnJvc3QudHlwZXMuVHlwZUluZm8uY3JlYXRlKCk7XHJcbiAgICB2YXIgcHJvcGVydHlJbmZvO1xyXG4gICAgZm9yICh2YXIgcHJvcGVydHkgaW4gaW5zdGFuY2UpIHtcclxuICAgICAgICB2YXIgdmFsdWUgPSBpbnN0YW5jZVtwcm9wZXJ0eV07XHJcbiAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHZhbHVlKSkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHR5cGUgPSB2YWx1ZS5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChpbnN0YW5jZVtwcm9wZXJ0eV0uX3R5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlID0gaW5zdGFuY2VbcHJvcGVydHldLl90eXBlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwcm9wZXJ0eUluZm8gPSBCaWZyb3N0LnR5cGVzLlByb3BlcnR5SW5mby5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgbmFtZTogcHJvcGVydHksXHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0eXBlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0eXBlSW5mby5wcm9wZXJ0aWVzLnB1c2gocHJvcGVydHlJbmZvKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0eXBlSW5mbztcclxufTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnR5cGVzXCIsIHtcclxuICAgIFByb3BlcnR5SW5mbzogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAobmFtZSwgdHlwZSkge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBQYXRoOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uIChmdWxsUGF0aCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8gQmFzZWQgb24gbm9kZS5qcyBpbXBsZW1lbnRhdGlvbiA6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTQ1MTEwMC9maWxlbmFtZS1leHRlbnNpb24taW4tamF2YXNjcmlwdFxyXG4gICAgICAgIHZhciBzcGxpdERldmljZVJlID1cclxuICAgICAgICAgICAgL14oW2EtekEtWl06fFtcXFxcXFwvXXsyfVteXFxcXFxcL10rW1xcXFxcXC9dW15cXFxcXFwvXSspPyhbXFxcXFxcL10pPyhbXFxzXFxTXSo/KSQvO1xyXG5cclxuICAgICAgICAvLyBSZWdleCB0byBzcGxpdCB0aGUgdGFpbCBwYXJ0IG9mIHRoZSBhYm92ZSBpbnRvIFsqLCBkaXIsIGJhc2VuYW1lLCBleHRdXHJcbiAgICAgICAgdmFyIHNwbGl0VGFpbFJlID1cclxuICAgICAgICAgICAgL14oW1xcc1xcU10rW1xcXFxcXC9dKD8hJCl8W1xcXFxcXC9dKT8oKD86XFwuezEsMn0kfFtcXHNcXFNdKz8pPyhcXC5bXi5cXC9cXFxcXSopPykkLztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlVW5zdXBwb3J0ZWRQYXJ0cyhmaWxlbmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgcXVlcnlTdHJpbmdTdGFydCA9IGZpbGVuYW1lLmluZGV4T2YoXCI/XCIpO1xyXG4gICAgICAgICAgICBpZiAocXVlcnlTdHJpbmdTdGFydCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGZpbGVuYW1lID0gZmlsZW5hbWUuc3Vic3RyKDAsIHF1ZXJ5U3RyaW5nU3RhcnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmaWxlbmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNwbGl0UGF0aChmaWxlbmFtZSkge1xyXG4gICAgICAgICAgICAvLyBTZXBhcmF0ZSBkZXZpY2Urc2xhc2ggZnJvbSB0YWlsXHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBzcGxpdERldmljZVJlLmV4ZWMoZmlsZW5hbWUpLFxyXG4gICAgICAgICAgICAgICAgZGV2aWNlID0gKHJlc3VsdFsxXSB8fCAnJykgKyAocmVzdWx0WzJdIHx8ICcnKSxcclxuICAgICAgICAgICAgICAgIHRhaWwgPSByZXN1bHRbM10gfHwgJyc7XHJcbiAgICAgICAgICAgIC8vIFNwbGl0IHRoZSB0YWlsIGludG8gZGlyLCBiYXNlbmFtZSBhbmQgZXh0ZW5zaW9uXHJcbiAgICAgICAgICAgIHZhciByZXN1bHQyID0gc3BsaXRUYWlsUmUuZXhlYyh0YWlsKSxcclxuICAgICAgICAgICAgICAgIGRpciA9IHJlc3VsdDJbMV0gfHwgJycsXHJcbiAgICAgICAgICAgICAgICBiYXNlbmFtZSA9IHJlc3VsdDJbMl0gfHwgJycsXHJcbiAgICAgICAgICAgICAgICBleHQgPSByZXN1bHQyWzNdIHx8ICcnO1xyXG4gICAgICAgICAgICByZXR1cm4gW2RldmljZSwgZGlyLCBiYXNlbmFtZSwgZXh0XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bGxQYXRoID0gcmVtb3ZlVW5zdXBwb3J0ZWRQYXJ0cyhmdWxsUGF0aCk7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHNwbGl0UGF0aChmdWxsUGF0aCk7XHJcbiAgICAgICAgdGhpcy5kZXZpY2UgPSByZXN1bHRbMF0gfHwgXCJcIjtcclxuICAgICAgICB0aGlzLmRpcmVjdG9yeSA9IHJlc3VsdFsxXSB8fCBcIlwiO1xyXG4gICAgICAgIHRoaXMuZmlsZW5hbWUgPSByZXN1bHRbMl0gfHwgXCJcIjtcclxuICAgICAgICB0aGlzLmV4dGVuc2lvbiA9IHJlc3VsdFszXSB8fCBcIlwiO1xyXG4gICAgICAgIHRoaXMuZmlsZW5hbWVXaXRob3V0RXh0ZW5zaW9uID0gdGhpcy5maWxlbmFtZS5yZXBsYWNlQWxsKHRoaXMuZXh0ZW5zaW9uLCBcIlwiKTtcclxuICAgICAgICB0aGlzLmZ1bGxQYXRoID0gZnVsbFBhdGg7XHJcblxyXG4gICAgICAgIHRoaXMuaGFzRXh0ZW5zaW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChzZWxmLmV4dGVuc2lvbikpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2VsZi5leHRlbnNpb24gPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QuUGF0aC5tYWtlUmVsYXRpdmUgPSBmdW5jdGlvbiAoZnVsbFBhdGgpIHtcclxuICAgIGlmIChmdWxsUGF0aC5pbmRleE9mKFwiL1wiKSA9PT0gMCkge1xyXG4gICAgICAgIHJldHVybiBmdWxsUGF0aC5zdWJzdHIoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZ1bGxQYXRoO1xyXG59O1xyXG5CaWZyb3N0LlBhdGguZ2V0UGF0aFdpdGhvdXRGaWxlbmFtZSA9IGZ1bmN0aW9uIChmdWxsUGF0aCkge1xyXG4gICAgdmFyIGxhc3RJbmRleCA9IGZ1bGxQYXRoLmxhc3RJbmRleE9mKFwiL1wiKTtcclxuICAgIHJldHVybiBmdWxsUGF0aC5zdWJzdHIoMCwgbGFzdEluZGV4KTtcclxufTtcclxuQmlmcm9zdC5QYXRoLmdldEZpbGVuYW1lID0gZnVuY3Rpb24gKGZ1bGxQYXRoKSB7XHJcbiAgICB2YXIgbGFzdEluZGV4ID0gZnVsbFBhdGgubGFzdEluZGV4T2YoXCIvXCIpO1xyXG4gICAgcmV0dXJuIGZ1bGxQYXRoLnN1YnN0cihsYXN0SW5kZXgrMSk7XHJcbn07XHJcbkJpZnJvc3QuUGF0aC5nZXRGaWxlbmFtZVdpdGhvdXRFeHRlbnNpb24gPSBmdW5jdGlvbiAoZnVsbFBhdGgpIHtcclxuICAgIHZhciBmaWxlbmFtZSA9IHRoaXMuZ2V0RmlsZW5hbWUoZnVsbFBhdGgpO1xyXG4gICAgdmFyIGxhc3RJbmRleCA9IGZpbGVuYW1lLmxhc3RJbmRleE9mKFwiLlwiKTtcclxuICAgIHJldHVybiBmaWxlbmFtZS5zdWJzdHIoMCxsYXN0SW5kZXgpO1xyXG59O1xyXG5CaWZyb3N0LlBhdGguaGFzRXh0ZW5zaW9uID0gZnVuY3Rpb24gKHBhdGgpIHtcclxuICAgIGlmIChwYXRoLmluZGV4T2YoXCI/XCIpID4gMCkge1xyXG4gICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cigwLCBwYXRoLmluZGV4T2YoXCI/XCIpKTtcclxuICAgIH1cclxuICAgIHZhciBsYXN0SW5kZXggPSBwYXRoLmxhc3RJbmRleE9mKFwiLlwiKTtcclxuICAgIHJldHVybiBsYXN0SW5kZXggPiAwO1xyXG59O1xyXG5CaWZyb3N0LlBhdGguY2hhbmdlRXh0ZW5zaW9uID0gZnVuY3Rpb24gKGZ1bGxQYXRoLCBuZXdFeHRlbnNpb24pIHtcclxuICAgIHZhciBwYXRoID0gQmlmcm9zdC5QYXRoLmNyZWF0ZSh7IGZ1bGxQYXRoOiBmdWxsUGF0aCB9KTtcclxuICAgIHZhciBuZXdQYXRoID0gcGF0aC5kaXJlY3RvcnkgKyBwYXRoLmZpbGVuYW1lV2l0aG91dEV4dGVuc2lvbiArIFwiLlwiICsgbmV3RXh0ZW5zaW9uO1xyXG4gICAgcmV0dXJuIG5ld1BhdGg7XHJcbn07XHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiKTtcclxuXHJcbkJpZnJvc3QuRGVmaW5pdGlvbk11c3RCZUZ1bmN0aW9uID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcclxuICAgIHRoaXMucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xyXG4gICAgdGhpcy5uYW1lID0gXCJEZWZpbml0aW9uTXVzdEJlRnVuY3Rpb25cIjtcclxuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2UgfHwgXCJEZWZpbml0aW9uIG11c3QgYmUgZnVuY3Rpb25cIjtcclxufTtcclxuXHJcbkJpZnJvc3QuTWlzc2luZ05hbWUgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xyXG4gICAgdGhpcy5wcm90b3R5cGUgPSBFcnJvci5wcm90b3R5cGU7XHJcbiAgICB0aGlzLm5hbWUgPSBcIk1pc3NpbmdOYW1lXCI7XHJcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlIHx8IFwiTWlzc2luZyBuYW1lXCI7XHJcbn07XHJcblxyXG5CaWZyb3N0LkV4Y2VwdGlvbiA9IChmdW5jdGlvbihnbG9iYWwsIHVuZGVmaW5lZCkge1xyXG4gICAgZnVuY3Rpb24gdGhyb3dJZk5hbWVNaXNzaW5nKG5hbWUpIHtcclxuICAgICAgICBpZiAoIW5hbWUgfHwgdHlwZW9mIG5hbWUgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QuTWlzc2luZ05hbWUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGhyb3dJZkRlZmluaXRpb25Ob3RBRnVuY3Rpb24oZGVmaW5pdGlvbikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgZGVmaW5pdGlvbiAhPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LkRlZmluaXRpb25NdXN0QmVGdW5jdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRFeGNlcHRpb25OYW1lKG5hbWUpIHtcclxuICAgICAgICB2YXIgbGFzdERvdCA9IG5hbWUubGFzdEluZGV4T2YoXCIuXCIpO1xyXG4gICAgICAgIGlmIChsYXN0RG90ID09PSAtMSAmJiBsYXN0RG90ICE9PSBuYW1lLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5hbWUuc3Vic3RyKGxhc3REb3QrMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGVmaW5lQW5kR2V0VGFyZ2V0U2NvcGUobmFtZSkge1xyXG4gICAgICAgIHZhciBsYXN0RG90ID0gbmFtZS5sYXN0SW5kZXhPZihcIi5cIik7XHJcbiAgICAgICAgaWYoIGxhc3REb3QgPT09IC0xICkge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG5zID0gbmFtZS5zdWJzdHIoMCxsYXN0RG90KTtcclxuICAgICAgICBCaWZyb3N0Lm5hbWVzcGFjZShucyk7XHJcblxyXG4gICAgICAgIHZhciBzY29wZSA9IGdsb2JhbDtcclxuICAgICAgICB2YXIgcGFydHMgPSBucy5zcGxpdCgnLicpO1xyXG4gICAgICAgIHBhcnRzLmZvckVhY2goZnVuY3Rpb24ocGFydCkge1xyXG4gICAgICAgICAgICBzY29wZSA9IHNjb3BlW3BhcnRdO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gc2NvcGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBkZWZpbmU6IGZ1bmN0aW9uKG5hbWUsIGRlZmF1bHRNZXNzYWdlLCBkZWZpbml0aW9uKSB7XHJcbiAgICAgICAgICAgIHRocm93SWZOYW1lTWlzc2luZyhuYW1lKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzY29wZSA9IGRlZmluZUFuZEdldFRhcmdldFNjb3BlKG5hbWUpO1xyXG4gICAgICAgICAgICB2YXIgZXhjZXB0aW9uTmFtZSA9IGdldEV4Y2VwdGlvbk5hbWUobmFtZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZXhjZXB0aW9uID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmFtZSA9IGV4Y2VwdGlvbk5hbWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlIHx8IGRlZmF1bHRNZXNzYWdlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBleGNlcHRpb24ucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xyXG5cclxuICAgICAgICAgICAgaWYoIGRlZmluaXRpb24gJiYgdHlwZW9mIGRlZmluaXRpb24gIT09IFwidW5kZWZpbmVkXCIgKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvd0lmRGVmaW5pdGlvbk5vdEFGdW5jdGlvbihkZWZpbml0aW9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkZWZpbml0aW9uLnByb3RvdHlwZSA9IEVycm9yLnByb3RvdHlwZTtcclxuICAgICAgICAgICAgICAgIGV4Y2VwdGlvbi5wcm90b3R5cGUgPSBuZXcgZGVmaW5pdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzY29wZVtleGNlcHRpb25OYW1lXSA9IGV4Y2VwdGlvbjtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59KSh3aW5kb3cpOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiKTtcclxuQmlmcm9zdC5FeGNlcHRpb24uZGVmaW5lKFwiQmlmcm9zdC5Mb2NhdGlvbk5vdFNwZWNpZmllZFwiLFwiTG9jYXRpb24gd2FzIG5vdCBzcGVjaWZpZWRcIik7XHJcbkJpZnJvc3QuRXhjZXB0aW9uLmRlZmluZShcIkJpZnJvc3QuSW52YWxpZFVyaUZvcm1hdFwiLCBcIlVyaSBmb3JtYXQgc3BlY2lmaWVkIGlzIG5vdCB2YWxpZFwiKTtcclxuQmlmcm9zdC5FeGNlcHRpb24uZGVmaW5lKFwiQmlmcm9zdC5PYmplY3RMaXRlcmFsTm90QWxsb3dlZFwiLCBcIk9iamVjdCBsaXRlcmFsIGlzIG5vdCBhbGxvd2VkXCIpO1xyXG5CaWZyb3N0LkV4Y2VwdGlvbi5kZWZpbmUoXCJCaWZyb3N0Lk1pc3NpbmdUeXBlRGVmaW5pdGlvblwiLCBcIlR5cGUgZGVmaW5pdGlvbiB3YXMgbm90IHNwZWNpZmllZFwiKTtcclxuQmlmcm9zdC5FeGNlcHRpb24uZGVmaW5lKFwiQmlmcm9zdC5Bc3luY2hyb25vdXNEZXBlbmRlbmNpZXNEZXRlY3RlZFwiLCBcIllvdSBzaG91bGQgY29uc2lkZXIgdXNpbmcgVHlwZS5iZWdpbkNyZWF0ZSgpIG9yIGRlcGVuZGVuY3lSZXNvbHZlci5iZWdpblJlc29sdmUoKSBmb3Igc3lzdGVtcyB0aGF0IGhhcyBhc3luY2hyb25vdXMgZGVwZW5kZW5jaWVzXCIpO1xyXG5CaWZyb3N0LkV4Y2VwdGlvbi5kZWZpbmUoXCJCaWZyb3N0LlVucmVzb2x2ZWREZXBlbmRlbmNpZXNcIiwgXCJTb21lIGRlcGVuZGVuY2llcyB3YXMgbm90IHBvc3NpYmxlIHRvIHJlc29sdmVcIik7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIpO1xyXG5CaWZyb3N0Lmhhc2hTdHJpbmcgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGRlY29kZTogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgICAgICAgaWYgKGEgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhID0gYS5yZXBsYWNlKFwiLz9cIiwgXCJcIikuc3BsaXQoJyYnKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBiID0ge307XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHAgPSBhW2ldLnNwbGl0KCc9JywgMik7XHJcbiAgICAgICAgICAgICAgICBpZiAocC5sZW5ndGggIT09IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBkZWNvZGVVUklDb21wb25lbnQocFsxXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09IFwiXCIgJiYgIWlzTmFOKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgYltwWzBdXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBiO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0pKCk7XHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiKTtcclxuQmlmcm9zdC5VcmkgPSAoZnVuY3Rpb24od2luZG93LCB1bmRlZmluZWQpIHtcclxuICAgIC8qIHBhcnNlVXJpIEpTIHYwLjEsIGJ5IFN0ZXZlbiBMZXZpdGhhbiAoaHR0cDovL2JhZGFzc2VyeS5ibG9nc3BvdC5jb20pXHJcbiAgICBTcGxpdHMgYW55IHdlbGwtZm9ybWVkIFVSSSBpbnRvIHRoZSBmb2xsb3dpbmcgcGFydHMgKGFsbCBhcmUgb3B0aW9uYWwpOlxyXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAg4oCiIHNvdXJjZSAoc2luY2UgdGhlIGV4ZWMoKSBtZXRob2QgcmV0dXJucyBiYWNrcmVmZXJlbmNlIDAgW2kuZS4sIHRoZSBlbnRpcmUgbWF0Y2hdIGFzIGtleSAwLCB3ZSBtaWdodCBhcyB3ZWxsIHVzZSBpdClcclxuICAgIOKAoiBwcm90b2NvbCAoc2NoZW1lKVxyXG4gICAg4oCiIGF1dGhvcml0eSAoaW5jbHVkZXMgYm90aCB0aGUgZG9tYWluIGFuZCBwb3J0KVxyXG4gICAgICAgIOKAoiBkb21haW4gKHBhcnQgb2YgdGhlIGF1dGhvcml0eTsgY2FuIGJlIGFuIElQIGFkZHJlc3MpXHJcbiAgICAgICAg4oCiIHBvcnQgKHBhcnQgb2YgdGhlIGF1dGhvcml0eSlcclxuICAgIOKAoiBwYXRoIChpbmNsdWRlcyBib3RoIHRoZSBkaXJlY3RvcnkgcGF0aCBhbmQgZmlsZW5hbWUpXHJcbiAgICAgICAg4oCiIGRpcmVjdG9yeVBhdGggKHBhcnQgb2YgdGhlIHBhdGg7IHN1cHBvcnRzIGRpcmVjdG9yaWVzIHdpdGggcGVyaW9kcywgYW5kIHdpdGhvdXQgYSB0cmFpbGluZyBiYWNrc2xhc2gpXHJcbiAgICAgICAg4oCiIGZpbGVOYW1lIChwYXJ0IG9mIHRoZSBwYXRoKVxyXG4gICAg4oCiIHF1ZXJ5IChkb2VzIG5vdCBpbmNsdWRlIHRoZSBsZWFkaW5nIHF1ZXN0aW9uIG1hcmspXHJcbiAgICDigKIgYW5jaG9yIChmcmFnbWVudClcclxuICAgICovXHJcbiAgICBmdW5jdGlvbiBwYXJzZVVyaShzb3VyY2VVcmkpe1xyXG4gICAgICAgIHZhciB1cmlQYXJ0TmFtZXMgPSBbXCJzb3VyY2VcIixcInByb3RvY29sXCIsXCJhdXRob3JpdHlcIixcImRvbWFpblwiLFwicG9ydFwiLFwicGF0aFwiLFwiZGlyZWN0b3J5UGF0aFwiLFwiZmlsZU5hbWVcIixcInF1ZXJ5XCIsXCJhbmNob3JcIl07XHJcbiAgICAgICAgdmFyIHVyaVBhcnRzID0gbmV3IFJlZ0V4cChcIl4oPzooW146Lz8jLl0rKTopPyg/Oi8vKT8oKFteOi8/I10qKSg/OjooXFxcXGQqKSk/KT8oKC8oPzpbXj8jXSg/IVtePyMvXSpcXFxcLltePyMvLl0rKD86W1xcXFw/I118JCkpKSovPyk/KFtePyMvXSopKT8oPzpcXFxcPyhbXiNdKikpPyg/OiMoLiopKT9cIikuZXhlYyhzb3VyY2VVcmkpO1xyXG4gICAgICAgIHZhciB1cmkgPSB7fTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKXtcclxuICAgICAgICAgICAgdXJpW3VyaVBhcnROYW1lc1tpXV0gPSAodXJpUGFydHNbaV0gPyB1cmlQYXJ0c1tpXSA6IFwiXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQWx3YXlzIGVuZCBkaXJlY3RvcnlQYXRoIHdpdGggYSB0cmFpbGluZyBiYWNrc2xhc2ggaWYgYSBwYXRoIHdhcyBwcmVzZW50IGluIHRoZSBzb3VyY2UgVVJJXHJcbiAgICAgICAgLy8gTm90ZSB0aGF0IGEgdHJhaWxpbmcgYmFja3NsYXNoIGlzIE5PVCBhdXRvbWF0aWNhbGx5IGluc2VydGVkIHdpdGhpbiBvciBhcHBlbmRlZCB0byB0aGUgXCJwYXRoXCIga2V5XHJcbiAgICAgICAgaWYodXJpLmRpcmVjdG9yeVBhdGgubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgIHVyaS5kaXJlY3RvcnlQYXRoID0gdXJpLmRpcmVjdG9yeVBhdGgucmVwbGFjZSgvXFwvPyQvLCBcIi9cIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdXJpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBVcmkobG9jYXRpb24pIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5zZXRMb2NhdGlvbiA9IGZ1bmN0aW9uIChsb2NhdGlvbikge1xyXG4gICAgICAgICAgICBzZWxmLmZ1bGxQYXRoID0gbG9jYXRpb247XHJcbiAgICAgICAgICAgIGxvY2F0aW9uID0gbG9jYXRpb24ucmVwbGFjZShcIiMhXCIsIFwiL1wiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBwYXJzZVVyaShsb2NhdGlvbik7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXJlc3VsdC5wcm90b2NvbCB8fCB0eXBlb2YgcmVzdWx0LnByb3RvY29sID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC5JbnZhbGlkVXJpRm9ybWF0KFwiVXJpICgnXCIgKyBsb2NhdGlvbiArIFwiJykgd2FzIGluIHRoZSB3cm9uZyBmb3JtYXRcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2NoZW1lID0gcmVzdWx0LnByb3RvY29sO1xyXG4gICAgICAgICAgICBzZWxmLmhvc3QgPSByZXN1bHQuZG9tYWluO1xyXG4gICAgICAgICAgICBzZWxmLnBhdGggPSByZXN1bHQucGF0aDtcclxuICAgICAgICAgICAgc2VsZi5hbmNob3IgPSByZXN1bHQuYW5jaG9yO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5xdWVyeVN0cmluZyA9IHJlc3VsdC5xdWVyeTtcclxuICAgICAgICAgICAgc2VsZi5wb3J0ID0gcGFyc2VJbnQocmVzdWx0LnBvcnQpO1xyXG4gICAgICAgICAgICBzZWxmLnBhcmFtZXRlcnMgPSBCaWZyb3N0Lmhhc2hTdHJpbmcuZGVjb2RlKHJlc3VsdC5xdWVyeSk7XHJcbiAgICAgICAgICAgIHNlbGYucGFyYW1ldGVycyA9IEJpZnJvc3QuZXh0ZW5kKEJpZnJvc3QuaGFzaFN0cmluZy5kZWNvZGUocmVzdWx0LmFuY2hvciksIHNlbGYucGFyYW1ldGVycyk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLmlzU2FtZUFzT3JpZ2luID0gKHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCA9PT0gcmVzdWx0LnByb3RvY29sICsgXCI6XCIgJiZcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSA9PT0gc2VsZi5ob3N0KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNldExvY2F0aW9uKGxvY2F0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0aHJvd0lmTG9jYXRpb25Ob3RTcGVjaWZpZWQobG9jYXRpb24pIHtcclxuICAgICAgICBpZiAoIWxvY2F0aW9uIHx8IHR5cGVvZiBsb2NhdGlvbiA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC5Mb2NhdGlvbk5vdFNwZWNpZmllZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uKGxvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgIHRocm93SWZMb2NhdGlvbk5vdFNwZWNpZmllZChsb2NhdGlvbik7XHJcblxyXG4gICAgICAgICAgICB2YXIgdXJpID0gbmV3IFVyaShsb2NhdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybiB1cmk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaXNBYnNvbHV0ZTogZnVuY3Rpb24gKHVybCkge1xyXG4gICAgICAgICAgICAvLyBCYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwNjg3MDk5L2hvdy10by10ZXN0LWlmLWEtdXJsLXN0cmluZy1pcy1hYnNvbHV0ZS1vci1yZWxhdGl2ZVxyXG4gICAgICAgICAgICB2YXIgZXhwcmVzc2lvbiA9IG5ldyBSZWdFeHAoJ14oPzpbYS16XSs6KT8vLycsICdpJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBleHByZXNzaW9uLnRlc3QodXJsKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59KSh3aW5kb3cpOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBuYW1lc3BhY2VzOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuc3RyaXBQYXRoID0gZnVuY3Rpb24gKHBhdGgpIHtcclxuICAgICAgICAgICAgaWYgKHBhdGguc3RhcnRzV2l0aChcIi9cIikpIHtcclxuICAgICAgICAgICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cigxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocGF0aC5lbmRzV2l0aChcIi9cIikpIHtcclxuICAgICAgICAgICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cigwLCBwYXRoLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwYXRoO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHNjcmlwdHMgPSBCaWZyb3N0LmFzc2V0c01hbmFnZXIuZ2V0U2NyaXB0cygpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHNjcmlwdHMgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2NyaXB0cy5mb3JFYWNoKGZ1bmN0aW9uIChmdWxsUGF0aCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhdGggPSBCaWZyb3N0LlBhdGguZ2V0UGF0aFdpdGhvdXRGaWxlbmFtZShmdWxsUGF0aCk7XHJcbiAgICAgICAgICAgICAgICBwYXRoID0gc2VsZi5zdHJpcFBhdGgocGF0aCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgbWFwcGVyS2V5IGluIEJpZnJvc3QubmFtZXNwYWNlTWFwcGVycykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXBwZXIgPSBCaWZyb3N0Lm5hbWVzcGFjZU1hcHBlcnNbbWFwcGVyS2V5XTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1hcHBlci5oYXNNYXBwaW5nRm9yID09PSBcImZ1bmN0aW9uXCIgJiYgbWFwcGVyLmhhc01hcHBpbmdGb3IocGF0aCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWVzcGFjZVBhdGggPSBtYXBwZXIucmVzb2x2ZShwYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWVzcGFjZSA9IEJpZnJvc3QubmFtZXNwYWNlKG5hbWVzcGFjZVBhdGgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJvb3QgPSBcIi9cIiArIHBhdGggKyBcIi9cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlLl9wYXRoID0gcm9vdDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbmFtZXNwYWNlLl9zY3JpcHRzID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2UuX3NjcmlwdHMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVJbmRleCA9IGZ1bGxQYXRoLmxhc3RJbmRleE9mKFwiL1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGUgPSBmdWxsUGF0aC5zdWJzdHIoZmlsZUluZGV4ICsgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHRlbnNpb25JbmRleCA9IGZpbGUubGFzdEluZGV4T2YoXCIuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3lzdGVtID0gZmlsZS5zdWJzdHIoMCwgZXh0ZW5zaW9uSW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlLl9zY3JpcHRzLnB1c2goc3lzdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgbmFtZXNwYWNlTWFwcGVyczoge1xyXG5cclxuICAgICAgICBtYXBQYXRoVG9OYW1lc3BhY2U6IGZ1bmN0aW9uIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIG1hcHBlcktleSBpbiBCaWZyb3N0Lm5hbWVzcGFjZU1hcHBlcnMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBtYXBwZXIgPSBCaWZyb3N0Lm5hbWVzcGFjZU1hcHBlcnNbbWFwcGVyS2V5XTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbWFwcGVyLmhhc01hcHBpbmdGb3IgPT09IFwiZnVuY3Rpb25cIiAmJiBtYXBwZXIuaGFzTWFwcGluZ0ZvcihwYXRoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuYW1lc3BhY2VQYXRoID0gbWFwcGVyLnJlc29sdmUocGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWVzcGFjZVBhdGg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIFN0cmluZ01hcHBpbmc6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKGZvcm1hdCwgbWFwcGVkRm9ybWF0KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmZvcm1hdCA9IGZvcm1hdDtcclxuICAgICAgICB0aGlzLm1hcHBlZEZvcm1hdCA9IG1hcHBlZEZvcm1hdDtcclxuXHJcbiAgICAgICAgdmFyIHBsYWNlaG9sZGVyRXhwcmVzc2lvbiA9IFwie1thLXpBLVpdK31cIjtcclxuICAgICAgICB2YXIgcGxhY2Vob2xkZXJSZWdleCA9IG5ldyBSZWdFeHAocGxhY2Vob2xkZXJFeHByZXNzaW9uLCBcImdcIik7XHJcblxyXG4gICAgICAgIHZhciB3aWxkY2FyZEV4cHJlc3Npb24gPSBcIlxcXFwqezJ9Wy8vfHwuXVwiO1xyXG4gICAgICAgIHZhciB3aWxkY2FyZFJlZ2V4ID0gbmV3IFJlZ0V4cCh3aWxkY2FyZEV4cHJlc3Npb24sIFwiZ1wiKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbWJpbmVkRXhwcmVzc2lvbiA9IFwiKFwiICsgcGxhY2Vob2xkZXJFeHByZXNzaW9uICsgXCIpKihcIiArIHdpbGRjYXJkRXhwcmVzc2lvbiArIFwiKSpcIjtcclxuICAgICAgICB2YXIgY29tYmluZWRSZWdleCA9IG5ldyBSZWdFeHAoY29tYmluZWRFeHByZXNzaW9uLCBcImdcIik7XHJcblxyXG4gICAgICAgIHZhciBjb21wb25lbnRzID0gW107XHJcblxyXG4gICAgICAgIHZhciByZXNvbHZlRXhwcmVzc2lvbiA9IGZvcm1hdC5yZXBsYWNlKGNvbWJpbmVkUmVnZXgsIGZ1bmN0aW9uKG1hdGNoKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbWF0Y2ggPT09IFwidW5kZWZpbmVkXCIgfHwgbWF0Y2ggPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbXBvbmVudHMucHVzaChtYXRjaCk7XHJcbiAgICAgICAgICAgIGlmIChtYXRjaC5pbmRleE9mKFwiKipcIikgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIihbXFxcXHcuLy9dKilcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gXCIoW1xcXFx3Ll0qKVwiO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgbWFwcGVkRm9ybWF0V2lsZGNhcmRNYXRjaCA9IG1hcHBlZEZvcm1hdC5tYXRjaCh3aWxkY2FyZFJlZ2V4KTtcclxuICAgICAgICB2YXIgZm9ybWF0UmVnZXggPSBuZXcgUmVnRXhwKHJlc29sdmVFeHByZXNzaW9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRjaGVzID0gZnVuY3Rpb24gKGlucHV0KSB7XHJcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IGlucHV0Lm1hdGNoKGZvcm1hdFJlZ2V4KTtcclxuICAgICAgICAgICAgaWYgKG1hdGNoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRWYWx1ZXMgPSBmdW5jdGlvbiAoaW5wdXQpIHtcclxuICAgICAgICAgICAgdmFyIG91dHB1dCA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSBpbnB1dC5tYXRjaChmb3JtYXRSZWdleCk7XHJcbiAgICAgICAgICAgIGNvbXBvbmVudHMuZm9yRWFjaChmdW5jdGlvbiAoYywgaSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbXBvbmVudCA9IGMuc3Vic3RyKDEsIGMubGVuZ3RoIC0gMik7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBtYXRjaFtpICsgMl07XHJcbiAgICAgICAgICAgICAgICBpZiAoYy5pbmRleE9mKFwiKipcIikgIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRwdXRbY29tcG9uZW50XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXNvbHZlID0gZnVuY3Rpb24gKGlucHV0KSB7XHJcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IGlucHV0Lm1hdGNoKGZvcm1hdFJlZ2V4KTtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG1hcHBlZEZvcm1hdDtcclxuICAgICAgICAgICAgdmFyIHdpbGRjYXJkT2Zmc2V0ID0gMDtcclxuXHJcbiAgICAgICAgICAgIGNvbXBvbmVudHMuZm9yRWFjaChmdW5jdGlvbiAoYywgaSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gbWF0Y2hbaSArIDFdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGMuaW5kZXhPZihcIioqXCIpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdpbGRjYXJkID0gbWFwcGVkRm9ybWF0V2lsZGNhcmRNYXRjaFt3aWxkY2FyZE9mZnNldF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlQWxsKGNbMl0sIHdpbGRjYXJkWzJdKTtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSh3aWxkY2FyZCwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbGRjYXJkT2Zmc2V0Kys7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKGMsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgc3RyaW5nTWFwcGluZ0ZhY3Rvcnk6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAoZm9ybWF0LCBtYXBwZWRGb3JtYXQpIHtcclxuICAgICAgICAgICAgdmFyIG1hcHBpbmcgPSBCaWZyb3N0LlN0cmluZ01hcHBpbmcuY3JlYXRlKHtcclxuICAgICAgICAgICAgICAgIGZvcm1hdDogZm9ybWF0LFxyXG4gICAgICAgICAgICAgICAgbWFwcGVkRm9ybWF0OiBtYXBwZWRGb3JtYXRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBtYXBwaW5nO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgU3RyaW5nTWFwcGVyOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uIChzdHJpbmdNYXBwaW5nRmFjdG9yeSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5zdHJpbmdNYXBwaW5nRmFjdG9yeSA9IHN0cmluZ01hcHBpbmdGYWN0b3J5O1xyXG5cclxuICAgICAgICB0aGlzLm1hcHBpbmdzID0gW107XHJcblxyXG4gICAgICAgIHRoaXMucmV2ZXJzZU1hcHBpbmdzID0gW107XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhc01hcHBpbmdGb3IobWFwcGluZ3MsIGlucHV0KSB7XHJcbiAgICAgICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBtYXBwaW5ncy5zb21lKGZ1bmN0aW9uIChtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobS5tYXRjaGVzKGlucHV0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBmb3VuZDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmb3VuZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldE1hcHBpbmdGb3IobWFwcGluZ3MsIGlucHV0KSB7XHJcbiAgICAgICAgICAgIHZhciBmb3VuZDtcclxuICAgICAgICAgICAgbWFwcGluZ3Muc29tZShmdW5jdGlvbiAobSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG0ubWF0Y2hlcyhpbnB1dCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IG07XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBmb3VuZCAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvdW5kO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcIkFyZ3VtZW50RXJyb3JcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiU3RyaW5nIG1hcHBpbmcgZm9yIChcIiArIGlucHV0ICsgXCIpIGNvdWxkIG5vdCBiZSBmb3VuZFwiXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiByZXNvbHZlKG1hcHBpbmdzLCBpbnB1dCkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlucHV0ID09PSBudWxsIHx8IHR5cGVvZiBpbnB1dCA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBtYXBwaW5nID0gc2VsZi5nZXRNYXBwaW5nRm9yKGlucHV0KTtcclxuICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKG1hcHBpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hcHBpbmcucmVzb2x2ZShpbnB1dCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmhhc01hcHBpbmdGb3IgPSBmdW5jdGlvbiAoaW5wdXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGhhc01hcHBpbmdGb3Ioc2VsZi5tYXBwaW5ncywgaW5wdXQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5nZXRNYXBwaW5nRm9yID0gZnVuY3Rpb24gKGlucHV0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRNYXBwaW5nRm9yKHNlbGYubWFwcGluZ3MsIGlucHV0KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucmVzb2x2ZSA9IGZ1bmN0aW9uIChpbnB1dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShzZWxmLm1hcHBpbmdzLCBpbnB1dCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXZlcnNlID0ge1xyXG4gICAgICAgICAgICBoYXNNYXBwaW5nRm9yOiBmdW5jdGlvbiAoaW5wdXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmhhc01hcHBpbmdGb3Ioc2VsZi5yZXZlcnNlTWFwcGluZ3MsIGlucHV0KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldE1hcHBpbmdGb3I6IGZ1bmN0aW9uIChpbnB1dCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZ2V0TWFwcGluZ0ZvcihzZWxmLnJldmVyc2VNYXBwaW5ncywgaW5wdXQpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcmVzb2x2ZTogZnVuY3Rpb24gKGlucHV0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5yZXNvbHZlKHNlbGYucmV2ZXJzZU1hcHBpbmdzLCBpbnB1dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmFkZE1hcHBpbmcgPSBmdW5jdGlvbiAoZm9ybWF0LCBtYXBwZWRGb3JtYXQpIHtcclxuICAgICAgICAgICAgdmFyIG1hcHBpbmcgPSBzZWxmLnN0cmluZ01hcHBpbmdGYWN0b3J5LmNyZWF0ZShmb3JtYXQsIG1hcHBlZEZvcm1hdCk7XHJcbiAgICAgICAgICAgIHNlbGYubWFwcGluZ3MucHVzaChtYXBwaW5nKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByZXZlcnNlTWFwcGluZyA9IHNlbGYuc3RyaW5nTWFwcGluZ0ZhY3RvcnkuY3JlYXRlKG1hcHBlZEZvcm1hdCwgZm9ybWF0KTtcclxuICAgICAgICAgICAgc2VsZi5yZXZlcnNlTWFwcGluZ3MucHVzaChyZXZlcnNlTWFwcGluZyk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICB1cmlNYXBwZXJzOiB7XHJcbiAgICB9XHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBzZXJ2ZXI6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gXCJcIjtcclxuXHJcbiAgICAgICAgdGhpcy5kZWZhdWx0UGFyYW1ldGVycyA9IHt9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBkZXNlcmlhbGl6ZShkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzQXJyYXkoZGF0YSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMucHVzaChkZXNlcmlhbGl6ZShpdGVtKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtcztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC5pc0FycmF5KGRhdGFbcHJvcGVydHldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhW3Byb3BlcnR5XSA9IGRlc2VyaWFsaXplKGRhdGFbcHJvcGVydHldKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBkYXRhW3Byb3BlcnR5XTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVtYmVyKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtwcm9wZXJ0eV0gPSBwYXJzZUZsb2F0KHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbcHJvcGVydHldID0gZGF0YVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMucG9zdCA9IGZ1bmN0aW9uICh1cmwsIHBhcmFtZXRlcnMpIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LlVyaS5pc0Fic29sdXRlKHVybCkpIHtcclxuICAgICAgICAgICAgICAgIHVybCA9IHNlbGYudGFyZ2V0ICsgdXJsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgYWN0dWFsUGFyYW1ldGVycyA9IHt9O1xyXG4gICAgICAgICAgICBCaWZyb3N0LmV4dGVuZChhY3R1YWxQYXJhbWV0ZXJzLCBzZWxmLmRlZmF1bHRQYXJhbWV0ZXJzKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHBhcmFtZXRlcnMpIHtcclxuICAgICAgICAgICAgICAgIGFjdHVhbFBhcmFtZXRlcnNbcHJvcGVydHldID0gSlNPTi5zdHJpbmdpZnkocGFyYW1ldGVyc1twcm9wZXJ0eV0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShhY3R1YWxQYXJhbWV0ZXJzKSxcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcsXHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gJC5wYXJzZUpTT04ocmVzdWx0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzZXJpYWxpemUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLmZhaWwoanFYSFIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0ID0gZnVuY3Rpb24gKHVybCwgcGFyYW1ldGVycykge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuVXJpLmlzQWJzb2x1dGUodXJsKSkge1xyXG4gICAgICAgICAgICAgICAgdXJsID0gc2VsZi50YXJnZXQgKyB1cmw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBhY3R1YWxQYXJhbWV0ZXJzID0ge307XHJcbiAgICAgICAgICAgIEJpZnJvc3QuZXh0ZW5kKGFjdHVhbFBhcmFtZXRlcnMsIHNlbGYuZGVmYXVsdFBhcmFtZXRlcnMpO1xyXG5cclxuICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNPYmplY3QocGFyYW1ldGVycykpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHBhcmFtZXRlck5hbWUgaW4gcGFyYW1ldGVycykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzQXJyYXkocGFyYW1ldGVyc1twYXJhbWV0ZXJOYW1lXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0dWFsUGFyYW1ldGVyc1twYXJhbWV0ZXJOYW1lXSA9IEpTT04uc3RyaW5naWZ5KHBhcmFtZXRlcnNbcGFyYW1ldGVyTmFtZV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdHVhbFBhcmFtZXRlcnNbcGFyYW1ldGVyTmFtZV0gPSBwYXJhbWV0ZXJzW3BhcmFtZXRlck5hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBhY3R1YWxQYXJhbWV0ZXJzLFxyXG4gICAgICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyxcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAocmVzdWx0LCB0ZXh0U3RhdHVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSAkLnBhcnNlSlNPTihyZXN1bHQucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICBkZXNlcmlhbGl6ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UuZmFpbChqcVhIUik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLnNlcnZlciA9IEJpZnJvc3Quc2VydmVyOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBhcmVFcXVhbDogZnVuY3Rpb24gKHNvdXJjZSwgdGFyZ2V0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gaXNSZXNlcnZlZE1lbWJlck5hbWUobWVtYmVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZW1iZXIuaW5kZXhPZihcIl9cIikgPj0gMCB8fCBtZW1iZXIgPT09IFwibW9kZWxcIiB8fCBtZW1iZXIgPT09IFwiY29tbW9uc1wiIHx8IG1lbWJlciA9PT0gXCJ0YXJnZXRWaWV3TW9kZWxcIiB8fCBtZW1iZXIgPT09IFwicmVnaW9uXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoa28uaXNPYnNlcnZhYmxlKHNvdXJjZSkpIHtcclxuICAgICAgICAgICAgc291cmNlID0gc291cmNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChrby5pc09ic2VydmFibGUodGFyZ2V0KSkge1xyXG4gICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHNvdXJjZSkgJiYgQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoc291cmNlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKEJpZnJvc3QuaXNBcnJheShzb3VyY2UpICYmIEJpZnJvc3QuaXNBcnJheSh0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgIGlmIChzb3VyY2UubGVuZ3RoICE9PSB0YXJnZXQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBzb3VyY2UubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC5hcmVFcXVhbChzb3VyY2VbaW5kZXhdLCB0YXJnZXRbaW5kZXhdKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBtZW1iZXIgaW4gc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNSZXNlcnZlZE1lbWJlck5hbWUobWVtYmVyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldC5oYXNPd25Qcm9wZXJ0eShtZW1iZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNvdXJjZVZhbHVlID0gc291cmNlW21lbWJlcl07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhcmdldFZhbHVlID0gdGFyZ2V0W21lbWJlcl07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzT2JqZWN0KHNvdXJjZVZhbHVlKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBCaWZyb3N0LmlzQXJyYXkoc291cmNlVmFsdWUpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtvLmlzT2JzZXJ2YWJsZShzb3VyY2VWYWx1ZSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5hcmVFcXVhbChzb3VyY2VWYWx1ZSwgdGFyZ2V0VmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc291cmNlVmFsdWUgIT09IHRhcmdldFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBkZWVwQ2xvbmU6IGZ1bmN0aW9uIChzb3VyY2UsIHRhcmdldCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGlzUmVzZXJ2ZWRNZW1iZXJOYW1lKG1lbWJlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gbWVtYmVyLmluZGV4T2YoXCJfXCIpID49IDAgfHwgbWVtYmVyID09PSBcIm1vZGVsXCIgfHwgbWVtYmVyID09PSBcImNvbW1vbnNcIiB8fCBtZW1iZXIgPT09IFwidGFyZ2V0Vmlld01vZGVsXCIgfHwgbWVtYmVyID09PSBcInJlZ2lvblwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZShzb3VyY2UpKSB7XHJcbiAgICAgICAgICAgIHNvdXJjZSA9IHNvdXJjZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRhcmdldCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzQXJyYXkoc291cmNlKSkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gW107XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHNvdXJjZVZhbHVlO1xyXG4gICAgICAgIGlmIChCaWZyb3N0LmlzQXJyYXkoc291cmNlKSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgc291cmNlLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgc291cmNlVmFsdWUgPSBzb3VyY2VbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNsb25lZFZhbHVlID0gQmlmcm9zdC5kZWVwQ2xvbmUoc291cmNlVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LnB1c2goY2xvbmVkVmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgbWVtYmVyIGluIHNvdXJjZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzUmVzZXJ2ZWRNZW1iZXJOYW1lKG1lbWJlcikpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzb3VyY2VWYWx1ZSA9IHNvdXJjZVttZW1iZXJdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChrby5pc09ic2VydmFibGUoc291cmNlVmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlVmFsdWUgPSBzb3VyY2VWYWx1ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzRnVuY3Rpb24oc291cmNlVmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldFZhbHVlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzT2JqZWN0KHNvdXJjZVZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFZhbHVlID0ge307XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKEJpZnJvc3QuaXNBcnJheShzb3VyY2VWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRWYWx1ZSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRbbWVtYmVyXSA9IHNvdXJjZVZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRWYWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W21lbWJlcl0gPSB0YXJnZXRWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBCaWZyb3N0LmRlZXBDbG9uZShzb3VyY2VWYWx1ZSwgdGFyZ2V0VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xyXG4gICAgfVxyXG59KTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIHN5c3RlbUNsb2NrOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5ub3dJbk1pbGxpc2Vjb25kcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiLyohXHJcbiogSmF2YVNjcmlwdCBUaW1lU3BhbiBMaWJyYXJ5XHJcbipcclxuKiBDb3B5cmlnaHQgKGMpIDIwMTAgTWljaGFlbCBTdHVtLCBodHRwOi8vd3d3LlN0dW0uZGUvXHJcbiogXHJcbiogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXHJcbiogYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXHJcbiogXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXHJcbiogd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxyXG4qIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xyXG4qIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0b1xyXG4qIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuKiBcclxuKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxyXG4qIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxyXG4qIFxyXG4qIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXHJcbiogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXHJcbiogTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcclxuKiBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXHJcbiogTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxyXG4qIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxyXG4qIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5CaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgLy8gQ29uc3RydWN0b3IgZnVuY3Rpb24sIGFsbCBwYXJhbWV0ZXJzIGFyZSBvcHRpb25hbFxyXG4gICAgVGltZVNwYW4gOiBmdW5jdGlvbiAobWlsbGlzZWNvbmRzLCBzZWNvbmRzLCBtaW51dGVzLCBob3VycywgZGF5cykge1xyXG4gICAgICAgIHZhciB2ZXJzaW9uID0gXCIxLjJcIixcclxuICAgICAgICAgICAgLy8gTWlsbGlzZWNvbmQtY29uc3RhbnRzXHJcbiAgICAgICAgICAgIG1zZWNQZXJTZWNvbmQgPSAxMDAwLFxyXG4gICAgICAgICAgICBtc2VjUGVyTWludXRlID0gNjAwMDAsXHJcbiAgICAgICAgICAgIG1zZWNQZXJIb3VyID0gMzYwMDAwMCxcclxuICAgICAgICAgICAgbXNlY1BlckRheSA9IDg2NDAwMDAwLFxyXG4gICAgICAgICAgICAvLyBJbnRlcm5hbGx5IHdlIHN0b3JlIHRoZSBUaW1lU3BhbiBhcyBNaWxsaXNlY29uZHNcclxuICAgICAgICAgICAgbXNlY3MgPSAwLFxyXG5cclxuICAgICAgICAgICAgLy8gSGVscGVyIGZ1bmN0aW9uc1xyXG4gICAgICAgICAgICBpc051bWVyaWMgPSBmdW5jdGlvbiAoaW5wdXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChpbnB1dCkpICYmIGlzRmluaXRlKGlucHV0KTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gQ29uc3RydWN0b3IgTG9naWNcclxuICAgICAgICBpZiAoaXNOdW1lcmljKGRheXMpKSB7XHJcbiAgICAgICAgICAgIG1zZWNzICs9IChkYXlzICogbXNlY1BlckRheSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc051bWVyaWMoaG91cnMpKSB7XHJcbiAgICAgICAgICAgIG1zZWNzICs9IChob3VycyAqIG1zZWNQZXJIb3VyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzTnVtZXJpYyhtaW51dGVzKSkge1xyXG4gICAgICAgICAgICBtc2VjcyArPSAobWludXRlcyAqIG1zZWNQZXJNaW51dGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNOdW1lcmljKHNlY29uZHMpKSB7XHJcbiAgICAgICAgICAgIG1zZWNzICs9IChzZWNvbmRzICogbXNlY1BlclNlY29uZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc051bWVyaWMobWlsbGlzZWNvbmRzKSkge1xyXG4gICAgICAgICAgICBtc2VjcyArPSBtaWxsaXNlY29uZHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBZGRpdGlvbiBGdW5jdGlvbnNcclxuICAgICAgICB0aGlzLmFkZE1pbGxpc2Vjb25kcyA9IGZ1bmN0aW9uIChtaWxsaXNlY29uZHMpIHtcclxuICAgICAgICAgICAgaWYgKCFpc051bWVyaWMobWlsbGlzZWNvbmRzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1zZWNzICs9IG1pbGxpc2Vjb25kcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuYWRkU2Vjb25kcyA9IGZ1bmN0aW9uIChzZWNvbmRzKSB7XHJcbiAgICAgICAgICAgIGlmICghaXNOdW1lcmljKHNlY29uZHMpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbXNlY3MgKz0gKHNlY29uZHMgKiBtc2VjUGVyU2Vjb25kKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuYWRkTWludXRlcyA9IGZ1bmN0aW9uIChtaW51dGVzKSB7XHJcbiAgICAgICAgICAgIGlmICghaXNOdW1lcmljKG1pbnV0ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbXNlY3MgKz0gKG1pbnV0ZXMgKiBtc2VjUGVyTWludXRlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuYWRkSG91cnMgPSBmdW5jdGlvbiAoaG91cnMpIHtcclxuICAgICAgICAgICAgaWYgKCFpc051bWVyaWMoaG91cnMpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbXNlY3MgKz0gKGhvdXJzICogbXNlY1BlckhvdXIpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5hZGREYXlzID0gZnVuY3Rpb24gKGRheXMpIHtcclxuICAgICAgICAgICAgaWYgKCFpc051bWVyaWMoZGF5cykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtc2VjcyArPSAoZGF5cyAqIG1zZWNQZXJEYXkpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIFN1YnRyYWN0aW9uIEZ1bmN0aW9uc1xyXG4gICAgICAgIHRoaXMuc3VidHJhY3RNaWxsaXNlY29uZHMgPSBmdW5jdGlvbiAobWlsbGlzZWNvbmRzKSB7XHJcbiAgICAgICAgICAgIGlmICghaXNOdW1lcmljKG1pbGxpc2Vjb25kcykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtc2VjcyAtPSBtaWxsaXNlY29uZHM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnN1YnRyYWN0U2Vjb25kcyA9IGZ1bmN0aW9uIChzZWNvbmRzKSB7XHJcbiAgICAgICAgICAgIGlmICghaXNOdW1lcmljKHNlY29uZHMpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbXNlY3MgLT0gKHNlY29uZHMgKiBtc2VjUGVyU2Vjb25kKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuc3VidHJhY3RNaW51dGVzID0gZnVuY3Rpb24gKG1pbnV0ZXMpIHtcclxuICAgICAgICAgICAgaWYgKCFpc051bWVyaWMobWludXRlcykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtc2VjcyAtPSAobWludXRlcyAqIG1zZWNQZXJNaW51dGUpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5zdWJ0cmFjdEhvdXJzID0gZnVuY3Rpb24gKGhvdXJzKSB7XHJcbiAgICAgICAgICAgIGlmICghaXNOdW1lcmljKGhvdXJzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1zZWNzIC09IChob3VycyAqIG1zZWNQZXJIb3VyKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuc3VidHJhY3REYXlzID0gZnVuY3Rpb24gKGRheXMpIHtcclxuICAgICAgICAgICAgaWYgKCFpc051bWVyaWMoZGF5cykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtc2VjcyAtPSAoZGF5cyAqIG1zZWNQZXJEYXkpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIEZ1bmN0aW9ucyB0byBpbnRlcmFjdCB3aXRoIG90aGVyIFRpbWVTcGFuc1xyXG4gICAgICAgIHRoaXMuaXNUaW1lU3BhbiA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5hZGQgPSBmdW5jdGlvbiAob3RoZXJUaW1lU3Bhbikge1xyXG4gICAgICAgICAgICBpZiAoIW90aGVyVGltZVNwYW4uaXNUaW1lU3Bhbikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1zZWNzICs9IG90aGVyVGltZVNwYW4udG90YWxNaWxsaXNlY29uZHMoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuc3VidHJhY3QgPSBmdW5jdGlvbiAob3RoZXJUaW1lU3Bhbikge1xyXG4gICAgICAgICAgICBpZiAoIW90aGVyVGltZVNwYW4uaXNUaW1lU3Bhbikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1zZWNzIC09IG90aGVyVGltZVNwYW4udG90YWxNaWxsaXNlY29uZHMoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZXF1YWxzID0gZnVuY3Rpb24gKG90aGVyVGltZVNwYW4pIHtcclxuICAgICAgICAgICAgaWYgKCFvdGhlclRpbWVTcGFuLmlzVGltZVNwYW4pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbXNlY3MgPT09IG90aGVyVGltZVNwYW4udG90YWxNaWxsaXNlY29uZHMoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBHZXR0ZXJzXHJcbiAgICAgICAgdGhpcy50b3RhbE1pbGxpc2Vjb25kcyA9IGZ1bmN0aW9uIChyb3VuZERvd24pIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG1zZWNzO1xyXG4gICAgICAgICAgICBpZiAocm91bmREb3duID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBNYXRoLmZsb29yKHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudG90YWxTZWNvbmRzID0gZnVuY3Rpb24gKHJvdW5kRG93bikge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbXNlY3MgLyBtc2VjUGVyU2Vjb25kO1xyXG4gICAgICAgICAgICBpZiAocm91bmREb3duID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBNYXRoLmZsb29yKHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudG90YWxNaW51dGVzID0gZnVuY3Rpb24gKHJvdW5kRG93bikge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbXNlY3MgLyBtc2VjUGVyTWludXRlO1xyXG4gICAgICAgICAgICBpZiAocm91bmREb3duID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBNYXRoLmZsb29yKHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudG90YWxIb3VycyA9IGZ1bmN0aW9uIChyb3VuZERvd24pIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG1zZWNzIC8gbXNlY1BlckhvdXI7XHJcbiAgICAgICAgICAgIGlmIChyb3VuZERvd24gPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IE1hdGguZmxvb3IocmVzdWx0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy50b3RhbERheXMgPSBmdW5jdGlvbiAocm91bmREb3duKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBtc2VjcyAvIG1zZWNQZXJEYXk7XHJcbiAgICAgICAgICAgIGlmIChyb3VuZERvd24gPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IE1hdGguZmxvb3IocmVzdWx0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8gUmV0dXJuIGEgRnJhY3Rpb24gb2YgdGhlIFRpbWVTcGFuXHJcbiAgICAgICAgdGhpcy5taWxsaXNlY29uZHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtc2VjcyAlIDEwMDA7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnNlY29uZHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKG1zZWNzIC8gbXNlY1BlclNlY29uZCkgJSA2MDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMubWludXRlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IobXNlY3MgLyBtc2VjUGVyTWludXRlKSAlIDYwO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ob3VycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IobXNlY3MgLyBtc2VjUGVySG91cikgJSAyNDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZGF5cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IobXNlY3MgLyBtc2VjUGVyRGF5KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBNaXNjLiBGdW5jdGlvbnNcclxuICAgICAgICB0aGlzLmdldFZlcnNpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2ZXJzaW9uO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuLy8gXCJTdGF0aWMgQ29uc3RydWN0b3JzXCJcclxuQmlmcm9zdC5UaW1lU3Bhbi56ZXJvID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gbmV3IEJpZnJvc3QuVGltZVNwYW4oMCwgMCwgMCwgMCwgMCk7XHJcbn07XHJcbkJpZnJvc3QuVGltZVNwYW4uZnJvbU1pbGxpc2Vjb25kcyA9IGZ1bmN0aW9uIChtaWxsaXNlY29uZHMpIHtcclxuICAgIHJldHVybiBuZXcgQmlmcm9zdC5UaW1lU3BhbihtaWxsaXNlY29uZHMsIDAsIDAsIDAsIDApO1xyXG59O1xyXG5CaWZyb3N0LlRpbWVTcGFuLmZyb21TZWNvbmRzID0gZnVuY3Rpb24gKHNlY29uZHMpIHtcclxuICAgIHJldHVybiBuZXcgQmlmcm9zdC5UaW1lU3BhbigwLCBzZWNvbmRzLCAwLCAwLCAwKTtcclxufTtcclxuQmlmcm9zdC5UaW1lU3Bhbi5mcm9tTWludXRlcyA9IGZ1bmN0aW9uIChtaW51dGVzKSB7XHJcbiAgICByZXR1cm4gbmV3IEJpZnJvc3QuVGltZVNwYW4oMCwgMCwgbWludXRlcywgMCwgMCk7XHJcbn07XHJcbkJpZnJvc3QuVGltZVNwYW4uZnJvbUhvdXJzID0gZnVuY3Rpb24gKGhvdXJzKSB7XHJcbiAgICByZXR1cm4gbmV3IEJpZnJvc3QuVGltZVNwYW4oMCwgMCwgMCwgaG91cnMsIDApO1xyXG59O1xyXG5CaWZyb3N0LlRpbWVTcGFuLmZyb21EYXlzID0gZnVuY3Rpb24gKGRheXMpIHtcclxuICAgIHJldHVybiBuZXcgQmlmcm9zdC5UaW1lU3BhbigwLCAwLCAwLCAwLCBkYXlzKTtcclxufTtcclxuQmlmcm9zdC5UaW1lU3Bhbi5mcm9tRGF0ZXMgPSBmdW5jdGlvbiAoZmlyc3REYXRlLCBzZWNvbmREYXRlLCBmb3JjZVBvc2l0aXZlKSB7XHJcbiAgICB2YXIgZGlmZmVyZW5jZU1zZWNzID0gc2Vjb25kRGF0ZS52YWx1ZU9mKCkgLSBmaXJzdERhdGUudmFsdWVPZigpO1xyXG4gICAgaWYgKGZvcmNlUG9zaXRpdmUgPT09IHRydWUpIHtcclxuICAgICAgICBkaWZmZXJlbmNlTXNlY3MgPSBNYXRoLmFicyhkaWZmZXJlbmNlTXNlY3MpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBCaWZyb3N0LlRpbWVTcGFuKGRpZmZlcmVuY2VNc2VjcywgMCwgMCwgMCwgMCk7XHJcbn07XHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBFdmVudDogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHN1YnNjcmliZXJzID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuc3Vic2NyaWJlID0gZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcclxuICAgICAgICAgICAgc3Vic2NyaWJlcnMucHVzaChzdWJzY3JpYmVyKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnRyaWdnZXIgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBzdWJzY3JpYmVycy5mb3JFYWNoKGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIHN5c3RlbUV2ZW50czogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucmVhZE1vZGVscyA9IEJpZnJvc3QucmVhZC5yZWFkTW9kZWxTeXN0ZW1FdmVudHMuY3JlYXRlKCk7XHJcbiAgICAgICAgdGhpcy5jb21tYW5kcyA9IEJpZnJvc3QuY29tbWFuZHMuY29tbWFuZEV2ZW50cy5jcmVhdGUoKTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLnN5c3RlbUV2ZW50cyA9IEJpZnJvc3Quc3lzdGVtRXZlbnRzOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBkaXNwYXRjaGVyOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZSA9IGZ1bmN0aW9uIChtaWxsaXNlY29uZHMsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIG1pbGxpc2Vjb25kcyk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsImtvLmV4dGVuZGVycy5saW5rZWQgPSBmdW5jdGlvbiAodGFyZ2V0LCBvcHRpb25zKSB7XHJcbiAgICBmdW5jdGlvbiBzZXR1cFZhbHVlU3Vic2NyaXB0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgdmFyIHN1YnNjcmlwdGlvbiA9IHZhbHVlLnN1YnNjcmliZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQudmFsdWVIYXNNdXRhdGVkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0YXJnZXQuX3ByZXZpb3VzTGlua2VkU3Vic2NyaXB0aW9uID0gc3Vic2NyaXB0aW9uO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0YXJnZXQuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgIGlmICh0YXJnZXQuX3ByZXZpb3VzTGlua2VkU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgICAgICAgIHRhcmdldC5fcHJldmlvdXNMaW5rZWRTdWJzY3JpcHRpb24uZGlzcG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXR1cFZhbHVlU3Vic2NyaXB0aW9uKG5ld1ZhbHVlKTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgY3VycmVudFZhbHVlID0gdGFyZ2V0KCk7XHJcbiAgICBzZXR1cFZhbHVlU3Vic2NyaXB0aW9uKGN1cnJlbnRWYWx1ZSk7XHJcbn07IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lmh1YnNcIiwge1xyXG4gICAgaHViQ29ubmVjdGlvbjogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgaHViID0gJC5odWJDb25uZWN0aW9uKFwiL3NpZ25hbHJcIiwgeyB1c2VEZWZhdWx0UGF0aDogZmFsc2UgfSk7XHJcbiAgICAgICAgLyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xyXG4gICAgICAgICQuc2lnbmFsUi5odWIgPSBodWI7XHJcbiAgICAgICAgLyoganNoaW50IGlnbm9yZTplbmQgKi9cclxuXHJcbiAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGVkID0gQmlmcm9zdC5FdmVudC5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGVQcm94eSA9IGZ1bmN0aW9uIChodWJOYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm94eSA9IGh1Yi5jcmVhdGVIdWJQcm94eShodWJOYW1lKTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb3h5O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vJC5jb25uZWN0aW9uLmh1Yi5sb2dnaW5nID0gdHJ1ZTtcclxuICAgICAgICAkLmNvbm5lY3Rpb24uaHViLnN0YXJ0KCkuZG9uZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSHViIGNvbm5lY3Rpb24gdXAgYW5kIHJ1bm5pbmdcIik7XHJcbiAgICAgICAgICAgIHNlbGYuaXNDb25uZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBzZWxmLmNvbm5lY3RlZC50cmlnZ2VyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy5odWJDb25uZWN0aW9uID0gQmlmcm9zdC5odWJzLmh1YkNvbm5lY3Rpb247IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lmh1YnNcIiwge1xyXG4gICAgSHViOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uIChodWJDb25uZWN0aW9uKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgcHJveHkgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX25hbWUgPSBcIlwiO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBtYWtlQ2xpZW50UHJveHlGdW5jdGlvbihjYWxsYmFjaykge1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY2xpZW50ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHZhciBjbGllbnQgPSB7fTtcclxuICAgICAgICAgICAgY2FsbGJhY2soY2xpZW50KTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGNsaWVudCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gY2xpZW50W3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc0Z1bmN0aW9uKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHByb3h5Lm9uKHByb3BlcnR5LCBtYWtlQ2xpZW50UHJveHlGdW5jdGlvbih2YWx1ZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXJ2ZXIgPSB7fTtcclxuXHJcbiAgICAgICAgdmFyIGRlbGF5ZWRTZXJ2ZXJJbnZvY2F0aW9ucyA9IFtdO1xyXG5cclxuICAgICAgICBodWJDb25uZWN0aW9uLmNvbm5lY3RlZC5zdWJzY3JpYmUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkZWxheWVkU2VydmVySW52b2NhdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoaW52b2NhdGlvbkZ1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBpbnZvY2F0aW9uRnVuY3Rpb24oKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG1ha2VJbnZvY2F0aW9uRnVuY3Rpb24ocHJvbWlzZSwgbWV0aG9kLCBhcmdzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJndW1lbnRzQXNBcnJheSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgYXJnID0gMDsgYXJnIDwgYXJncy5sZW5ndGg7IGFyZysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzQXNBcnJheS5wdXNoKGFyZ3NbYXJnXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGFsbEFyZ3VtZW50cyA9IFttZXRob2RdLmNvbmNhdChhcmd1bWVudHNBc0FycmF5KTtcclxuICAgICAgICAgICAgICAgIHByb3h5Lmludm9rZS5hcHBseShwcm94eSwgYWxsQXJndW1lbnRzKS5kb25lKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmludm9rZVNlcnZlck1ldGhvZCA9IGZ1bmN0aW9uIChtZXRob2QsIGFyZ3MpIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGludm9jYXRpb25GdW5jdGlvbiA9IG1ha2VJbnZvY2F0aW9uRnVuY3Rpb24ocHJvbWlzZSwgbWV0aG9kLCBhcmdzKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChodWJDb25uZWN0aW9uLmlzQ29ubmVjdGVkID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgZGVsYXllZFNlcnZlckludm9jYXRpb25zLnB1c2goaW52b2NhdGlvbkZ1bmN0aW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGludm9jYXRpb25GdW5jdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9uQ3JlYXRlZCA9IGZ1bmN0aW9uIChsYXN0RGVzY2VuZGFudCkge1xyXG4gICAgICAgICAgICBwcm94eSA9IGh1YkNvbm5lY3Rpb24uY3JlYXRlUHJveHkobGFzdERlc2NlbmRhbnQuX25hbWUpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuIiwiQmlmcm9zdC5kZXBlbmRlbmN5UmVzb2x2ZXJzLmh1YiA9IHtcclxuICAgIGNhblJlc29sdmU6IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGh1YnMgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5hbWUgaW4gaHVicztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICByZXNvbHZlOiBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIGh1YnNbbmFtZV0uY3JlYXRlKCk7XHJcbiAgICB9XHJcbn07IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmlvXCIsIHtcclxuICAgIGZpbGVUeXBlOiB7XHJcbiAgICAgICAgdW5rbm93bjogMCxcclxuICAgICAgICB0ZXh0OiAxLFxyXG4gICAgICAgIGphdmFTY3JpcHQ6IDIsXHJcbiAgICAgICAgaHRtbDogM1xyXG4gICAgfVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW9cIiwge1xyXG4gICAgRmlsZTogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAocGF0aCkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGEgZmlsZTwvc3VtbWFyeT5cclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwidHlwZVwiIHR5cGU9XCJCaWZyb3N0LmlvLmZpbGVUeXBlXCI+VHlwZSBvZiBmaWxlIHJlcHJlc2VudGVkPC9maWVsZD5cclxuICAgICAgICB0aGlzLnR5cGUgPSBCaWZyb3N0LmlvLmZpbGVUeXBlLnVua25vd247XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cInBhdGhcIiB0eXBlPVwiQmlmcm9zdC5QYXRoXCI+VGhlIHBhdGggcmVwcmVzZW50aW5nIHRoZSBmaWxlPC9maWVsZD5cclxuICAgICAgICB0aGlzLnBhdGggPSBCaWZyb3N0LlBhdGguY3JlYXRlKHsgZnVsbFBhdGg6IHBhdGggfSk7XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW9cIiwge1xyXG4gICAgZmlsZUZhY3Rvcnk6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyBhIGZhY3RvcnkgZm9yIGNyZWF0aW5nIGluc3RhbmNlcyBvZiBCaWZyb3N0LmlvLkZpbGU8L3N1bW1hcnk+XHJcbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAocGF0aCwgZmlsZVR5cGUpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkNyZWF0ZXMgYSBuZXcgZmlsZTwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwicGF0aFwiIHR5cGU9XCJTdHJpbmdcIj5QYXRoIG9mIGZpbGU8L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJmaWxlVHlwZVwiIHR5cGU9XCJCaWZyb3N0LmlvLmZpbGVUeXBlXCIgb3B0aW9uYWw9XCJ0cnVlXCI+VHlwZSBvZiBmaWxlIHRvIHVzZTwvcGFyYW0+XHJcbiAgICAgICAgICAgIC8vLyA8cmV0dXJucyB0eXBlPVwiQmlmcm9zdC5pby5GaWxlXCI+QW4gaW5zdGFuY2Ugb2YgYSBmaWxlPC9yZXR1cm5zPlxyXG5cclxuICAgICAgICAgICAgdmFyIGZpbGUgPSBCaWZyb3N0LmlvLkZpbGUuY3JlYXRlKHsgcGF0aDogcGF0aCB9KTtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGZpbGVUeXBlKSkge1xyXG4gICAgICAgICAgICAgICAgZmlsZS5maWxlVHlwZSA9IGZpbGVUeXBlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmaWxlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy5maWxlRmFjdG9yeSA9IEJpZnJvc3QuaW8uZmlsZUZhY3Rvcnk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmlvXCIsIHtcclxuICAgIGZpbGVNYW5hZ2VyOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSBtYW5hZ2VyIGZvciBmaWxlcywgcHJvdmlkaW5nIGNhcGFiaWxpdGllcyBvZiBsb2FkaW5nIGFuZCBtb3JlPC9zdW1tYXJ5PlxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIHVyaSA9IEJpZnJvc3QuVXJpLmNyZWF0ZSh3aW5kb3cubG9jYXRpb24uaHJlZik7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCA9PT0gXCJmaWxlOlwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0gdGhpcy5vcmlnaW4uc3Vic3RyKDAsIHRoaXMub3JpZ2luLmxhc3RJbmRleE9mKFwiL1wiKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5vcmlnaW4ubGFzdEluZGV4T2YoXCIvXCIpID09PSB0aGlzLm9yaWdpbi5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9yaWdpbiA9IHRoaXMub3JpZ2luLnN1YnN0cigwLCB0aGlzLm9yaWdpbi5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBwb3J0ID0gdXJpLnBvcnQgfHwgXCJcIjtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzVW5kZWZpbmVkKHBvcnQpICYmIHBvcnQgIT09IFwiXCIgJiYgcG9ydCAhPT0gODApIHtcclxuICAgICAgICAgICAgICAgIHBvcnQgPSBcIjpcIiArIHBvcnQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0gdXJpLnNjaGVtZSArIFwiOi8vXCIgKyB1cmkuaG9zdCArIHBvcnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRBY3R1YWxGaWxlbmFtZShmaWxlbmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgYWN0dWFsRmlsZW5hbWUgPSBzZWxmLm9yaWdpbjtcclxuXHJcbiAgICAgICAgICAgIGlmIChmaWxlbmFtZS5pbmRleE9mKFwiL1wiKSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgYWN0dWFsRmlsZW5hbWUgKz0gXCIvXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYWN0dWFsRmlsZW5hbWUgKz0gZmlsZW5hbWU7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYWN0dWFsRmlsZW5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmxvYWQgPSBmdW5jdGlvbiAoZmlsZXMpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkxvYWQgZmlsZXM8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gcGFyYW1ldGVyQXJyYXk9XCJ0cnVlXCIgZWxlbWVudFR5cGU9XCJCaWZyb3N0LmlvLkZpbGVcIj5GaWxlcyB0byBsb2FkPC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxyZXR1cm5zIHR5cGU9XCJCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlXCI+QSBwcm9taXNlIHRoYXQgY2FuIGJlIGNvbnRpbnVlZCB3aXRoIHRoZSBhY3R1YWwgZmlsZXMgY29taW5nIGluIGFzIGFuIGFycmF5PC9yZXR1cm5zPlxyXG4gICAgICAgICAgICB2YXIgZmlsZXNUb0xvYWQgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIGZpbGVzLmZvckVhY2goZnVuY3Rpb24gKGZpbGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYXRoID0gZ2V0QWN0dWFsRmlsZW5hbWUoZmlsZS5wYXRoLmZ1bGxQYXRoKTtcclxuICAgICAgICAgICAgICAgIGlmIChmaWxlLmZpbGVUeXBlID09PSBCaWZyb3N0LmlvLmZpbGVUeXBlLmh0bWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXRoID0gXCJ0ZXh0IVwiICsgcGF0aCArIFwiIXN0cmlwXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZmlsZXNUb0xvYWQucHVzaChwYXRoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1aXJlKGZpbGVzVG9Mb2FkLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy5maWxlTWFuYWdlciA9IEJpZnJvc3QuaW8uZmlsZU1hbmFnZXI7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnNwZWNpZmljYXRpb25zXCIsIHtcclxuICAgIFNwZWNpZmljYXRpb246IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGEgcnVsZSBiYXNlZCBvbiB0aGUgc3BlY2lmaWNhdGlvbiBwYXR0ZXJuPC9zdW1tYXJ5PlxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY3VycmVudEluc3RhbmNlID0ga28ub2JzZXJ2YWJsZSgpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJldmFsdWF0b3JcIj5cclxuICAgICAgICAvLy8gSG9sZHMgdGhlIGV2YWx1YXRvciB0byBiZSB1c2VkIHRvIGV2YWx1YXRlIHdldGhlciBvciBub3QgdGhlIHJ1bGUgaXMgc2F0aXNmaWVkXHJcbiAgICAgICAgLy8vIDwvZmllbGQ+XHJcbiAgICAgICAgLy8vIDxyZW1hcmtzPlxyXG4gICAgICAgIC8vLyBUaGUgZXZhbHVhdG9yIGNhbiBlaXRoZXIgYmUgYSBmdW5jdGlvbiB0aGF0IGdldHMgY2FsbGVkIHdpdGggdGhlIGluc3RhbmNlXHJcbiAgICAgICAgLy8vIG9yIGFuIG9ic2VydmFibGUuIFRoZSBvYnNlcnZhYmxlIG5vdCBiZWluZyBhIHJlZ3VsYXIgZnVuY3Rpb24gd2lsbCBvYnZpb3VzbHlcclxuICAgICAgICAvLy8gbm90IGhhdmUgdGhlIGluc3RhbmNlIHBhc3NlZFxyXG4gICAgICAgIC8vLyA8L3JlbWFya3M+XHJcbiAgICAgICAgdGhpcy5ldmFsdWF0b3IgPSBudWxsO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJpc1NhdGlzZmllZFwiPk9ic2VydmFibGUgdGhhdCBob2xkcyB0aGUgcmVzdWx0IG9mIGFueSBldmFsdWF0aW9ucyBiZWluZyBkb25lPC9maWVsZD5cclxuICAgICAgICAvLy8gPHJlbWFya3M+XHJcbiAgICAgICAgLy8vIER1ZSB0byBpdHMgbmF0dXJlIG9mIGJlaW5nIGFuIG9ic2VydmFibGUsIGl0IHdpbGwgcmUtZXZhbHVhdGUgaWYgdGhlIGV2YWx1YXRvclxyXG4gICAgICAgIC8vLyBpcyBhbiBvYnNlcnZhYmxlIGFuZCBpdHMgc3RhdGUgY2hhbmdlcy5cclxuICAgICAgICAvLy8gPC9yZW1hcmtzPlxyXG4gICAgICAgIHRoaXMuaXNTYXRpc2ZpZWQgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChrby5pc09ic2VydmFibGUoc2VsZi5ldmFsdWF0b3IpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5ldmFsdWF0b3IoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBjdXJyZW50SW5zdGFuY2UoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChpbnN0YW5jZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmV2YWx1YXRvcihpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmV2YWx1YXRlID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5FdmFsdWF0ZXMgdGhlIHJ1bGU8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cImluc3RhbmNlXCI+T2JqZWN0IGluc3RhbmNlIHVzZWQgZHVyaW5nIGV2YWx1YXRpb248L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHJldHVybnM+VHJ1ZSBpZiBzYXRpc2ZpZWQsIGZhbHNlIGlmIG5vdDwvcmV0dXJucz5cclxuICAgICAgICAgICAgY3VycmVudEluc3RhbmNlKGluc3RhbmNlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmlzU2F0aXNmaWVkKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hbmQgPSBmdW5jdGlvbiAocnVsZSkge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+VGFrZXMgdGhpcyBydWxlIGFuZCBcImFuZHNcIiBpdCB0b2dldGhlciB3aXRoIGFub3RoZXIgcnVsZTwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwicnVsZVwiPlxyXG4gICAgICAgICAgICAvLy8gVGhpcyBjYW4gZWl0aGVyIGJlIHRoZSBpbnN0YW5jZSBvZiBhbm90aGVyIHNwZWNpZmljIHJ1bGUsXHJcbiAgICAgICAgICAgIC8vLyBvciBhbiBldmFsdWF0b3IgdGhhdCBjYW4gYmUgdXNlZCBkaXJlY3RseSBieSB0aGUgZGVmYXVsdCBydWxlIGltcGxlbWVudGF0aW9uXHJcbiAgICAgICAgICAgIC8vLyA8L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHJldHVybnM+QSBuZXcgY29tcG9zZWQgcnVsZTwvcmV0dXJucz5cclxuXHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzRnVuY3Rpb24ocnVsZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBvbGRSdWxlID0gcnVsZTtcclxuICAgICAgICAgICAgICAgIHJ1bGUgPSBCaWZyb3N0LnNwZWNpZmljYXRpb25zLlNwZWNpZmljYXRpb24uY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBydWxlLmV2YWx1YXRvciA9IG9sZFJ1bGU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBhbmQgPSBCaWZyb3N0LnNwZWNpZmljYXRpb25zLkFuZC5jcmVhdGUodGhpcywgcnVsZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBhbmQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vciA9IGZ1bmN0aW9uIChydWxlKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5UYWtlcyB0aGlzIHJ1bGUgYW5kIFwib3JzXCIgaXQgdG9nZXRoZXIgd2l0aCBhbm90aGVyIHJ1bGU8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cInJ1bGVcIj5cclxuICAgICAgICAgICAgLy8vIFRoaXMgY2FuIGVpdGhlciBiZSB0aGUgaW5zdGFuY2Ugb2YgYW5vdGhlciBzcGVjaWZpYyBydWxlLFxyXG4gICAgICAgICAgICAvLy8gb3IgYW4gZXZhbHVhdG9yIHRoYXQgY2FuIGJlIHVzZWQgZGlyZWN0bHkgYnkgdGhlIGRlZmF1bHQgcnVsZSBpbXBsZW1lbnRhdGlvblxyXG4gICAgICAgICAgICAvLy8gPC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxyZXR1cm5zPkEgbmV3IGNvbXBvc2VkIHJ1bGU8L3JldHVybnM+XHJcblxyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc0Z1bmN0aW9uKHJ1bGUpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2xkUnVsZSA9IHJ1bGU7XHJcbiAgICAgICAgICAgICAgICBydWxlID0gQmlmcm9zdC5zcGVjaWZpY2F0aW9ucy5TcGVjaWZpY2F0aW9uLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgcnVsZS5ldmFsdWF0b3IgPSBvbGRSdWxlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgb3IgPSBCaWZyb3N0LnNwZWNpZmljYXRpb25zLk9yLmNyZWF0ZSh0aGlzLCBydWxlKTtcclxuICAgICAgICAgICAgcmV0dXJuIG9yO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5zcGVjaWZpY2F0aW9ucy5TcGVjaWZpY2F0aW9uLndoZW4gPSBmdW5jdGlvbiAoZXZhbHVhdG9yKSB7XHJcbiAgICAvLy8gPHN1bW1hcnk+U3RhcnRzIGEgcnVsZSBjaGFpbjwvc3VtbWFyeT5cclxuICAgIC8vLyA8cGFyYW0gbmFtZT1cImV2YWx1YXRvclwiPlxyXG4gICAgLy8vIFRoZSBldmFsdWF0b3IgY2FuIGVpdGhlciBiZSBhIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgd2l0aCB0aGUgaW5zdGFuY2VcclxuICAgIC8vLyBvciBhbiBvYnNlcnZhYmxlLiBUaGUgb2JzZXJ2YWJsZSBub3QgYmVpbmcgYSByZWd1bGFyIGZ1bmN0aW9uIHdpbGwgb2J2aW91c2x5XHJcbiAgICAvLy8gbm90IGhhdmUgdGhlIGluc3RhbmNlIHBhc3NlZFxyXG4gICAgLy8vIDwvcGFyYW0+XHJcbiAgICAvLy8gPHJldHVybnM+QSBuZXcgY29tcG9zZWQgcnVsZTwvcmV0dXJucz5cclxuICAgIHZhciBydWxlID0gQmlmcm9zdC5zcGVjaWZpY2F0aW9ucy5TcGVjaWZpY2F0aW9uLmNyZWF0ZSgpO1xyXG4gICAgcnVsZS5ldmFsdWF0b3IgPSBldmFsdWF0b3I7XHJcbiAgICByZXR1cm4gcnVsZTtcclxufTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Quc3BlY2lmaWNhdGlvbnNcIiwge1xyXG4gICAgQW5kOiBCaWZyb3N0LnNwZWNpZmljYXRpb25zLlNwZWNpZmljYXRpb24uZXh0ZW5kKGZ1bmN0aW9uIChsZWZ0SGFuZFNpZGUsIHJpZ2h0SGFuZFNpZGUpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyB0aGUgXCJhbmRcIiBjb21wb3NpdGUgcnVsZSBiYXNlZCBvbiB0aGUgc3BlY2lmaWNhdGlvbiBwYXR0ZXJuPC9zdW1tYXJ5PlxyXG5cclxuICAgICAgICB0aGlzLmlzU2F0aXNmaWVkID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbGVmdEhhbmRTaWRlLmlzU2F0aXNmaWVkKCkgJiZcclxuICAgICAgICAgICAgICAgIHJpZ2h0SGFuZFNpZGUuaXNTYXRpc2ZpZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5ldmFsdWF0ZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICBsZWZ0SGFuZFNpZGUuZXZhbHVhdGUoaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICByaWdodEhhbmRTaWRlLmV2YWx1YXRlKGluc3RhbmNlKTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnNwZWNpZmljYXRpb25zXCIsIHtcclxuICAgIE9yOiBCaWZyb3N0LnNwZWNpZmljYXRpb25zLlNwZWNpZmljYXRpb24uZXh0ZW5kKGZ1bmN0aW9uIChsZWZ0SGFuZFNpZGUsIHJpZ2h0SGFuZFNpZGUpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyB0aGUgXCJvclwiIGNvbXBvc2l0ZSBydWxlIGJhc2VkIG9uIHRoZSBzcGVjaWZpY2F0aW9uIHBhdHRlcm48L3N1bW1hcnk+XHJcblxyXG4gICAgICAgIHRoaXMuaXNTYXRpc2ZpZWQgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsZWZ0SGFuZFNpZGUuaXNTYXRpc2ZpZWQoKSB8fFxyXG4gICAgICAgICAgICAgICAgcmlnaHRIYW5kU2lkZS5pc1NhdGlzZmllZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmV2YWx1YXRlID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIGxlZnRIYW5kU2lkZS5ldmFsdWF0ZShpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIHJpZ2h0SGFuZFNpZGUuZXZhbHVhdGUoaW5zdGFuY2UpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudGFza3NcIiwge1xyXG4gICAgVGFzazogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSB0YXNrIHRoYXQgY2FuIGJlIGRvbmUgaW4gdGhlIHN5c3RlbTwvc3VtbWFyeT5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImVycm9yc1wiIHR5cGU9XCJvYnNlcnZhYmxlQXJyYXlcIj5PYnNlcnZhYmxlIGFycmF5IG9mIGVycm9yczwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5lcnJvcnMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiaXNFeGNldXRpbmdcIiB0eXBlPVwiYm9vbGVhblwiPlRydWUgLyBmYWxzZSBmb3IgdGVsbGluZyB3ZXRoZXIgb3Igbm90IHRoZSB0YXNrIGlzIGV4ZWN1dGluZyBvciBub3Q8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuaXNFeGVjdXRpbmcgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+RXhlY3V0ZXMgdGhlIHRhc2s8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cmV0dXJucz5BIHByb21pc2U8L3JldHVybnM+XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXBvcnRFcnJvciA9IGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+UmVwb3J0IGFuIGVycm9yIGZyb20gZXhlY3V0aW5nIHRoZSB0YXNrPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJlcnJvclwiIHR5cGU9XCJTdHJpbmdcIj5FcnJvciBjb21pbmcgYmFjazwvcGFyYW0+XHJcbiAgICAgICAgICAgIHNlbGYuZXJyb3JzLnB1c2goZXJyb3IpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudGFza3NcIiwge1xyXG4gICAgVGFza0hpc3RvcnlFbnRyeTogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLnR5cGUgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuY29udGVudCA9IFwiXCI7XHJcblxyXG4gICAgICAgIHRoaXMuYmVnaW4gPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5lbmQgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgdGhpcy50b3RhbCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHNlbGYuZW5kKCkpICYmXHJcbiAgICAgICAgICAgICAgICAhQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChzZWxmLmJlZ2luKCkpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5lbmQoKSAtIHNlbGYuYmVnaW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnJlc3VsdCA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICB0aGlzLmVycm9yID0ga28ub2JzZXJ2YWJsZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmlzRmluaXNoZWQgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAhQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChzZWxmLmVuZCgpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmhhc0ZhaWxlZCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHNlbGYuZXJyb3IoKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuaXNTdWNjZXNzID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5pc0ZpbmlzaGVkKCkgJiYgIXNlbGYuaGFzRmFpbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudGFza3NcIiwge1xyXG4gICAgdGFza0hpc3Rvcnk6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uIChzeXN0ZW1DbG9jaykge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIHRoZSBoaXN0b3J5IG9mIHRhc2tzIHRoYXQgaGFzIGJlZW4gZXhlY3V0ZWQgc2luY2UgdGhlIHN0YXJ0IG9mIHRoZSBhcHBsaWNhdGlvbjwvc3VtbWFyeT5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciBlbnRyaWVzQnlJZCA9IHt9O1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIHBhcmFtPVwiZW50cmllc1wiIHR5cGU9XCJvYnNlcnZhYmxlQXJyYXlcIj5PYnNlcnZhYmxlIGFycmF5IG9mIGVudHJpZXM8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuZW50cmllcyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG5cclxuICAgICAgICB0aGlzLmJlZ2luID0gZnVuY3Rpb24gKHRhc2spIHtcclxuICAgICAgICAgICAgdmFyIGlkID0gQmlmcm9zdC5HdWlkLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHZhciBlbnRyeSA9IEJpZnJvc3QudGFza3MuVGFza0hpc3RvcnlFbnRyeS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBlbnRyeS50eXBlID0gdGFzay5fdHlwZS5fbmFtZTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY29udGVudCA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHRhc2spIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkuaW5kZXhPZihcIl9cIikgIT09IDAgJiYgdGFzay5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkgJiYgdHlwZW9mIHRhc2tbcHJvcGVydHldICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFtwcm9wZXJ0eV0gPSB0YXNrW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZW50cnkuY29udGVudCA9IEpTT04uc3RyaW5naWZ5KGNvbnRlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGVudHJ5LmJlZ2luKHN5c3RlbUNsb2NrLm5vd0luTWlsbGlzZWNvbmRzKCkpO1xyXG4gICAgICAgICAgICAgICAgZW50cmllc0J5SWRbaWRdID0gZW50cnk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmVudHJpZXMucHVzaChlbnRyeSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBUb2RvOiBwZXJmZWN0IHBsYWNlIGZvciBsb2dnaW5nIHNvbWV0aGluZ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpZDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmVuZCA9IGZ1bmN0aW9uIChpZCwgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmIChlbnRyaWVzQnlJZC5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBlbnRyeSA9IGVudHJpZXNCeUlkW2lkXTtcclxuICAgICAgICAgICAgICAgIGVudHJ5LmVuZChzeXN0ZW1DbG9jay5ub3dJbk1pbGxpc2Vjb25kcygpKTtcclxuICAgICAgICAgICAgICAgIGVudHJ5LnJlc3VsdChyZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5mYWlsZWQgPSBmdW5jdGlvbiAoaWQsIGVycm9yKSB7XHJcbiAgICAgICAgICAgIGlmIChlbnRyaWVzQnlJZC5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBlbnRyeSA9IGVudHJpZXNCeUlkW2lkXTtcclxuICAgICAgICAgICAgICAgIGVudHJ5LmVuZChzeXN0ZW1DbG9jay5ub3dJbk1pbGxpc2Vjb25kcygpKTtcclxuICAgICAgICAgICAgICAgIGVudHJ5LmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy50YXNrSGlzdG9yeSA9IEJpZnJvc3QudGFza3MudGFza0hpc3Rvcnk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnRhc2tzXCIsIHtcclxuICAgIFRhc2tzOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICh0YXNrSGlzdG9yeSkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGFuIGFnZ3JlZ2F0aW9uIG9mIHRhc2tzPC9zdW1tYXJ5PlxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwidW5maWx0ZXJlZFwiIHR5cGU9XCJCaWZyb3N0LnRhc2tzLlRhc2tbXVwiPkFsbCB0YXNrcyBjb21wbGV0ZWx5IHVuZmlsdGVyZWQ8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMudW5maWx0ZXJlZCA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJleGVjdXRlV2hlblwiIHR5cGU9XCJCaWZyb3N0LnNwZWNpZmljYXRpb25zLlNwZWNpZmljYXRpb25cIj5HZXRzIG9yIHNldHMgdGhlIHJ1bGUgZm9yIGV4ZWN1dGlvbjwvZmllbGQ+XHJcbiAgICAgICAgLy8vIDxyZW1hcmtzPlxyXG4gICAgICAgIC8vLyBJZiBhIHRhc2sgZ2V0cyBleGVjdXRlZCB0aGF0IGRvZXMgbm90IGdldCBzYXRpc2ZpZWQgYnkgdGhlIHJ1bGUsIGl0IHdpbGwganVzdCBxdWV1ZSBpdCB1cFxyXG4gICAgICAgIC8vLyA8L3JlbWFya3M+XHJcbiAgICAgICAgdGhpcy5jYW5FeGVjdXRlV2hlbiA9IGtvLm9ic2VydmFibGUoKTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiYWxsXCIgdHlwZT1cIkJpZnJvc3QudGFza3MuVGFza1tdXCI+QWxsIHRhc2tzIGJlaW5nIGV4ZWN1dGVkPC9maWVsZD5cclxuICAgICAgICB0aGlzLmFsbCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGFsbCA9IHNlbGYudW5maWx0ZXJlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJ1bGUgPSBzZWxmLmNhbkV4ZWN1dGVXaGVuKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQocnVsZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBmaWx0ZXJlZCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIGFsbC5mb3JFYWNoKGZ1bmN0aW9uICh0YXNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcnVsZS5ldmFsdWF0ZSh0YXNrKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocnVsZS5pc1NhdGlzZmllZCgpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkLnB1c2godGFzayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyZWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhbGw7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImVycm9yc1wiIHR5cGU9XCJvYnNlcnZhYmxlQXJyYXlPZlN0cmluZ1wiPkFsbCBlcnJvcnMgdGhhdCBvY2N1cmVkIGR1cmluZyBleGVjdXRpb24gb2YgdGhlIHRhc2s8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuZXJyb3JzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImlzQnVzeVwiIHR5cGU9XCJCb29sZWFuXCI+UmV0dXJucyB0cnVlIGlmIHRoZSBzeXN0ZW0gaXMgYnVzeSB3b3JraW5nLCBmYWxzZSBpZiBub3Q8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuaXNCdXN5ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5hbGwoKS5sZW5ndGggPiAwO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBleGVjdXRlVGFza0lmTm90RXhlY3V0aW5nKHRhc2spIHtcclxuICAgICAgICAgICAgaWYgKHRhc2suaXNFeGVjdXRpbmcoKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRhc2suaXNFeGVjdXRpbmcodHJ1ZSk7XHJcbiAgICAgICAgICAgIHZhciB0YXNrSGlzdG9yeUlkID0gdGFza0hpc3RvcnkuYmVnaW4odGFzayk7XHJcblxyXG4gICAgICAgICAgICB0YXNrLmV4ZWN1dGUoKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi51bmZpbHRlcmVkLnJlbW92ZSh0YXNrKTtcclxuICAgICAgICAgICAgICAgIHRhc2tIaXN0b3J5LmVuZCh0YXNrSGlzdG9yeUlkLCByZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgdGFzay5wcm9taXNlLnNpZ25hbChyZXN1bHQpO1xyXG4gICAgICAgICAgICB9KS5vbkZhaWwoZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnVuZmlsdGVyZWQucmVtb3ZlKHRhc2spO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5lcnJvcnMucHVzaCh0YXNrKTtcclxuICAgICAgICAgICAgICAgIHRhc2tIaXN0b3J5LmZhaWxlZCh0YXNrSGlzdG9yeUlkLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB0YXNrLnByb21pc2UuZmFpbChlcnJvcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5hbGwuc3Vic2NyaWJlKGZ1bmN0aW9uIChjaGFuZ2VkVGFza3MpIHtcclxuICAgICAgICAgICAgY2hhbmdlZFRhc2tzLmZvckVhY2goZnVuY3Rpb24gKHRhc2spIHtcclxuICAgICAgICAgICAgICAgIGV4ZWN1dGVUYXNrSWZOb3RFeGVjdXRpbmcodGFzayk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmV4ZWN1dGUgPSBmdW5jdGlvbiAodGFzaykge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+QWRkcyBhIHRhc2sgYW5kIHN0YXJ0cyBleGVjdXRpbmcgaXQgcmlnaHQgYXdheTwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwidGFza1wiIHR5cGU9XCJCaWZyb3N0LnRhc2tzLlRhc2tcIj5UYXNrIHRvIGFkZDwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxyZXR1cm5zPkEgcHJvbWlzZSB0byB3b3JrIHdpdGggZm9yIGNoYWluaW5nIGZ1cnRoZXIgZXZlbnRzPC9yZXR1cm5zPlxyXG5cclxuICAgICAgICAgICAgdGFzay5wcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgc2VsZi51bmZpbHRlcmVkLnB1c2godGFzayk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcnVsZSA9IHNlbGYuY2FuRXhlY3V0ZVdoZW4oKTtcclxuICAgICAgICAgICAgdmFyIGNhbkV4ZWN1dGUgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQocnVsZSkpIHtcclxuICAgICAgICAgICAgICAgIGNhbkV4ZWN1dGUgPSBydWxlLmV2YWx1YXRlKHRhc2spO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FuRXhlY3V0ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgZXhlY3V0ZVRhc2tJZk5vdEV4ZWN1dGluZyh0YXNrKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRhc2sucHJvbWlzZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnRhc2tzXCIsIHtcclxuICAgIHRhc2tzRmFjdG9yeTogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdGFza3MgPSBCaWZyb3N0LnRhc2tzLlRhc2tzLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGFza3M7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLnRhc2tzRmFjdG9yeSA9IEJpZnJvc3QudGFza3MudGFza3NGYWN0b3J5OyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC50YXNrc1wiLCB7XHJcbiAgICBIdHRwR2V0VGFzazogQmlmcm9zdC50YXNrcy5UYXNrLmV4dGVuZChmdW5jdGlvbiAoc2VydmVyLCB1cmwsIHBheWxvYWQpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyBhIHRhc2sgdGhhdCBjYW4gcGVyZm9ybSBIdHRwIEdldCByZXF1ZXN0czwvc3VtbWFyeT5cclxuXHJcbiAgICAgICAgdGhpcy5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHNlcnZlclxyXG4gICAgICAgICAgICAgICAgLmdldCh1cmwsIHBheWxvYWQpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAub25GYWlsKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLmZhaWwoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnRhc2tzXCIsIHtcclxuICAgIEh0dHBQb3N0VGFzazogQmlmcm9zdC50YXNrcy5UYXNrLmV4dGVuZChmdW5jdGlvbiAoc2VydmVyLCB1cmwsIHBheWxvYWQpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyBhIHRhc2sgdGhhdCBjYW4gcGVyZm9ybSBhIEh0dHAgUG9zdCByZXF1ZXN0PC9zdW1tYXJ5PlxyXG5cclxuICAgICAgICB0aGlzLmV4ZWN1dGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIHNlcnZlclxyXG4gICAgICAgICAgICAgICAgLnBvc3QodXJsLCBwYXlsb2FkKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLm9uRmFpbChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5mYWlsKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC50YXNrc1wiLCB7XHJcbiAgICBMb2FkVGFzazogQmlmcm9zdC50YXNrcy5UYXNrLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSBiYXNlIHRhc2sgdGhhdCByZXByZXNlbnRzIGFueXRoaW5nIHRoYXQgaXMgbG9hZGluZyB0aGluZ3M8L3N1bW1hcnk+XHJcbiAgICAgICAgdGhpcy5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudGFza3NcIiwge1xyXG4gICAgRmlsZUxvYWRUYXNrOiBCaWZyb3N0LnRhc2tzLkxvYWRUYXNrLmV4dGVuZChmdW5jdGlvbiAoZmlsZXMsIGZpbGVNYW5hZ2VyKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSB0YXNrIGZvciBsb2FkaW5nIHZpZXcgcmVsYXRlZCBmaWxlcyBhc3luY2hyb25vdXNseTwvc3VtbWFyeT5cclxuICAgICAgICB0aGlzLmZpbGVzID0gZmlsZXM7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5maWxlcyA9IFtdO1xyXG4gICAgICAgIGZpbGVzLmZvckVhY2goZnVuY3Rpb24gKGZpbGUpIHtcclxuICAgICAgICAgICAgc2VsZi5maWxlcy5wdXNoKGZpbGUucGF0aC5mdWxsUGF0aCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZXhlY3V0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgZmlsZU1hbmFnZXIubG9hZChmaWxlcykuY29udGludWVXaXRoKGZ1bmN0aW9uIChpbnN0YW5jZXMpIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGluc3RhbmNlcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnRhc2tzXCIsIHtcclxuICAgIEV4ZWN1dGlvblRhc2s6IEJpZnJvc3QudGFza3MuVGFzay5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGEgYmFzZSB0YXNrIHRoYXQgcmVwcmVzZW50cyBhbnl0aGluZyB0aGF0IGlzIGV4ZWN1dGluZzwvc3VtbWFyeT5cclxuICAgICAgICB0aGlzLmV4ZWN1dGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICB0YXNrRmFjdG9yeTogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlSHR0cFBvc3QgPSBmdW5jdGlvbiAodXJsLCBwYXlsb2FkKSB7XHJcbiAgICAgICAgICAgIHZhciB0YXNrID0gQmlmcm9zdC50YXNrcy5IdHRwUG9zdFRhc2suY3JlYXRlKHtcclxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgcGF5bG9hZDogcGF5bG9hZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRhc2s7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGVIdHRwR2V0ID0gZnVuY3Rpb24gKHVybCwgcGF5bG9hZCkge1xyXG4gICAgICAgICAgICB2YXIgdGFzayA9IEJpZnJvc3QudGFza3MuSHR0cEdldFRhc2suY3JlYXRlKHtcclxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgcGF5bG9hZDogcGF5bG9hZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRhc2s7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGVRdWVyeSA9IGZ1bmN0aW9uIChxdWVyeSwgcGFnaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciB0YXNrID0gQmlmcm9zdC5yZWFkLlF1ZXJ5VGFzay5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgcXVlcnk6IHF1ZXJ5LFxyXG4gICAgICAgICAgICAgICAgcGFnaW5nOiBwYWdpbmdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0YXNrO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlUmVhZE1vZGVsID0gZnVuY3Rpb24gKHJlYWRNb2RlbE9mLCBwcm9wZXJ0eUZpbHRlcnMpIHtcclxuICAgICAgICAgICAgdmFyIHRhc2sgPSBCaWZyb3N0LnJlYWQuUmVhZE1vZGVsVGFzay5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgcmVhZE1vZGVsT2Y6IHJlYWRNb2RlbE9mLFxyXG4gICAgICAgICAgICAgICAgcHJvcGVydHlGaWx0ZXJzOiBwcm9wZXJ0eUZpbHRlcnNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0YXNrO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlSGFuZGxlQ29tbWFuZCA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XHJcbiAgICAgICAgICAgIHZhciB0YXNrID0gQmlmcm9zdC5jb21tYW5kcy5IYW5kbGVDb21tYW5kVGFzay5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZDogY29tbWFuZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRhc2s7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGVIYW5kbGVDb21tYW5kcyA9IGZ1bmN0aW9uIChjb21tYW5kcykge1xyXG4gICAgICAgICAgICB2YXIgdGFzayA9IEJpZnJvc3QuY29tbWFuZHMuSGFuZGxlQ29tbWFuZHNUYXNrLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kczogY29tbWFuZHNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0YXNrO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlVmlld0xvYWQgPSBmdW5jdGlvbiAoZmlsZXMpIHtcclxuICAgICAgICAgICAgdmFyIHRhc2sgPSBCaWZyb3N0LnZpZXdzLlZpZXdMb2FkVGFzay5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgZmlsZXM6IGZpbGVzXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdGFzaztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZVZpZXdNb2RlbExvYWQgPSBmdW5jdGlvbiAoZmlsZXMpIHtcclxuICAgICAgICAgICAgdmFyIHRhc2sgPSBCaWZyb3N0LnZpZXdzLlZpZXdNb2RlbExvYWRUYXNrLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBmaWxlczogZmlsZXNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0YXNrO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlRmlsZUxvYWQgPSBmdW5jdGlvbiAoZmlsZXMpIHtcclxuICAgICAgICAgICAgdmFyIHRhc2sgPSBCaWZyb3N0LnRhc2tzLkZpbGVMb2FkVGFzay5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgZmlsZXM6IGZpbGVzXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdGFzaztcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbGlkYXRpb25cIik7XHJcbkJpZnJvc3QuRXhjZXB0aW9uLmRlZmluZShcIkJpZnJvc3QudmFsaWRhdGlvbi5PcHRpb25zTm90RGVmaW5lZFwiLCBcIk9wdGlvbiB3YXMgdW5kZWZpbmVkXCIpO1xyXG5CaWZyb3N0LkV4Y2VwdGlvbi5kZWZpbmUoXCJCaWZyb3N0LnZhbGlkYXRpb24uT3B0aW9uc1ZhbHVlTm90U3BlY2lmaWVkXCIsIFwiUmVxdWlyZWQgdmFsdWUgaW4gT3B0aW9ucyBpcyBub3Qgc3BlY2lmaWVkLiBcIik7XHJcbkJpZnJvc3QuRXhjZXB0aW9uLmRlZmluZShcIkJpZnJvc3QudmFsaWRhdGlvbi5Ob3RBTnVtYmVyXCIsIFwiVmFsdWUgaXMgbm90IGEgbnVtYmVyXCIpO1xyXG5CaWZyb3N0LkV4Y2VwdGlvbi5kZWZpbmUoXCJCaWZyb3N0LnZhbGlkYXRpb24uTm90QVN0cmluZ1wiLCBcIlZhbHVlIGlzIG5vdCBhIHN0cmluZ1wiKTtcclxuQmlmcm9zdC5FeGNlcHRpb24uZGVmaW5lKFwiQmlmcm9zdC52YWxpZGF0aW9uLlZhbHVlTm90U3BlY2lmaWVkXCIsXCJWYWx1ZSBpcyBub3Qgc3BlY2lmaWVkXCIpO1xyXG5CaWZyb3N0LkV4Y2VwdGlvbi5kZWZpbmUoXCJCaWZyb3N0LnZhbGlkYXRpb24uTWluTm90U3BlY2lmaWVkXCIsXCJNaW4gaXMgbm90IHNwZWNpZmllZFwiKTtcclxuQmlmcm9zdC5FeGNlcHRpb24uZGVmaW5lKFwiQmlmcm9zdC52YWxpZGF0aW9uLk1heE5vdFNwZWNpZmllZFwiLFwiTWF4IGlzIG5vdCBzcGVjaWZpZWRcIik7XHJcbkJpZnJvc3QuRXhjZXB0aW9uLmRlZmluZShcIkJpZnJvc3QudmFsaWRhdGlvbi5NaW5MZW5ndGhOb3RTcGVjaWZpZWRcIixcIk1pbiBsZW5ndGggaXMgbm90IHNwZWNpZmllZFwiKTtcclxuQmlmcm9zdC5FeGNlcHRpb24uZGVmaW5lKFwiQmlmcm9zdC52YWxpZGF0aW9uLk1heExlbmd0aE5vdFNwZWNpZmllZFwiLFwiTWF4IGxlbmd0aCBpcyBub3Qgc3BlY2lmaWVkXCIpO1xyXG5CaWZyb3N0LkV4Y2VwdGlvbi5kZWZpbmUoXCJCaWZyb3N0LnZhbGlkYXRpb24uTWlzc2luZ0V4cHJlc3Npb25cIixcIkV4cHJlc3Npb24gaXMgbm90IHNwZWNpZmllZFwiKTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsaWRhdGlvblwiKTtcclxuQmlmcm9zdC52YWxpZGF0aW9uLnJ1bGVIYW5kbGVycyA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gQmlmcm9zdC52YWxpZGF0aW9uLnJ1bGVIYW5kbGVycyB8fCB7IH07XHJcbn0pKCk7XHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWxpZGF0aW9uXCIsIHtcclxuICAgIFJ1bGU6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHwgXCJcIjtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7fTtcclxuICAgICAgICBCaWZyb3N0LmV4dGVuZCh0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICB0aGlzLnZhbGlkYXRlID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsaWRhdGlvblwiKTtcclxuQmlmcm9zdC52YWxpZGF0aW9uLlZhbGlkYXRvciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBWYWxpZGF0b3Iob3B0aW9ucykge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmlzVmFsaWQgPSBrby5vYnNlcnZhYmxlKHRydWUpO1xyXG4gICAgICAgIHRoaXMubWVzc2FnZSA9IGtvLm9ic2VydmFibGUoXCJcIik7XHJcbiAgICAgICAgdGhpcy5ydWxlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaXNSZXF1aXJlZCA9IGZhbHNlO1xyXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgICAgICB0aGlzLnNldE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBzZXR1cFJ1bGUocnVsZVR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChydWxlVHlwZS5fbmFtZSA9PT0gcHJvcGVydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcnVsZSA9IHJ1bGVUeXBlLmNyZWF0ZSh7IG9wdGlvbnM6IG9wdGlvbnNbcHJvcGVydHldIHx8IHt9IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucnVsZXMucHVzaChydWxlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocnVsZVR5cGUuX25hbWUgPT09IFwicmVxdWlyZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaXNSZXF1aXJlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gb3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJ1bGVUeXBlcyA9IEJpZnJvc3QudmFsaWRhdGlvbi5SdWxlLmdldEV4dGVuZGVycygpO1xyXG4gICAgICAgICAgICAgICAgcnVsZVR5cGVzLnNvbWUoc2V0dXBSdWxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMudmFsaWRhdGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgc2VsZi5pc1ZhbGlkKHRydWUpO1xyXG4gICAgICAgICAgICBzZWxmLm1lc3NhZ2UoXCJcIik7XHJcbiAgICAgICAgICAgIHZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHNlbGYucnVsZXMuc29tZShmdW5jdGlvbihydWxlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJ1bGUudmFsaWRhdGUodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pc1ZhbGlkKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLm1lc3NhZ2UocnVsZS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pc1ZhbGlkKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYubWVzc2FnZShcIlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZVNpbGVudGx5ID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHNlbGYucnVsZXMuc29tZShmdW5jdGlvbiAocnVsZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFydWxlLnZhbGlkYXRlKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaXNWYWxpZChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaXNWYWxpZCh0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgdmFyIHZhbGlkYXRvciA9IG5ldyBWYWxpZGF0b3Iob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWxpZGF0b3I7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhcHBseVRvOiBmdW5jdGlvbiAoaXRlbU9ySXRlbXMsIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gYXBwbHlUb0l0ZW0oaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbGlkYXRvciA9IHNlbGYuY3JlYXRlKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgaXRlbS52YWxpZGF0b3IgPSB2YWxpZGF0b3I7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpdGVtT3JJdGVtcyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtT3JJdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGFwcGx5VG9JdGVtKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhcHBseVRvSXRlbShpdGVtT3JJdGVtcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGFwcGx5VG9Qcm9wZXJ0aWVzOiBmdW5jdGlvbiAoaXRlbSwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICB2YXIgaXRlbXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2goaXRlbVtwcm9wZXJ0eV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHlUbyhpdGVtcywgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSkoKTtcclxuIiwiaWYgKHR5cGVvZiBrbyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIEJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWxpZGF0aW9uXCIsIHtcclxuICAgICAgICBWYWxpZGF0aW9uU3VtbWFyeTogZnVuY3Rpb24gKGNvbW1hbmRzLCBjb250YWluZXJFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5jb21tYW5kcyA9IGtvLm9ic2VydmFibGUoY29tbWFuZHMpO1xyXG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VzID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcclxuICAgICAgICAgICAgdGhpcy5oYXNNZXNzYWdlcyA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tZXNzYWdlcygpLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgICAgIH0sc2VsZik7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBhZ2dyZWdhdGVNZXNzYWdlcygpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhY3R1YWxNZXNzYWdlcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jb21tYW5kcygpLmZvckVhY2goZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdW53cmFwcGVkQ29tbWFuZCA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoY29tbWFuZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHVud3JhcHBlZENvbW1hbmQudmFsaWRhdG9ycygpLmZvckVhY2goZnVuY3Rpb24gKHZhbGlkYXRvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXZhbGlkYXRvci5pc1ZhbGlkKCkgJiYgdmFsaWRhdG9yLm1lc3NhZ2UoKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdHVhbE1lc3NhZ2VzLnB1c2godmFsaWRhdG9yLm1lc3NhZ2UoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5tZXNzYWdlcyhhY3R1YWxNZXNzYWdlcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbW1hbmRzLmZvckVhY2goZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgICAgIHZhciB1bndyYXBwZWRDb21tYW5kID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShjb21tYW5kKTtcclxuXHJcbiAgICAgICAgICAgICAgICB1bndyYXBwZWRDb21tYW5kLnZhbGlkYXRvcnMoKS5mb3JFYWNoKGZ1bmN0aW9uICh2YWxpZGF0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0b3IubWVzc2FnZS5zdWJzY3JpYmUoYWdncmVnYXRlTWVzc2FnZXMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGtvLmJpbmRpbmdIYW5kbGVycy52YWxpZGF0aW9uU3VtbWFyeUZvciA9IHtcclxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3NBY2Nlc3Nvciwgdmlld01vZGVsKSB7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSBrby5iaW5kaW5nSGFuZGxlcnMudmFsaWRhdGlvblN1bW1hcnlGb3IuZ2V0VmFsdWVBc0FycmF5KHZhbHVlQWNjZXNzb3IpO1xyXG4gICAgICAgICAgICB2YXIgdmFsaWRhdGlvblN1bW1hcnkgPSBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLlZhbGlkYXRpb25TdW1tYXJ5KHRhcmdldCk7XHJcbiAgICAgICAgICAgIHZhciB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcclxuICAgICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZCh1bCk7XHJcbiAgICAgICAgICAgIHVsLmlubmVySFRNTCA9IFwiPGxpPjxzcGFuIGRhdGEtYmluZD0ndGV4dDogJGRhdGEnPjwvc3Bhbj48L2xpPlwiO1xyXG5cclxuICAgICAgICAgICAga28udXRpbHMuZG9tRGF0YS5zZXQoZWxlbWVudCwgJ3ZhbGlkYXRpb25zdW1tYXJ5JywgdmFsaWRhdGlvblN1bW1hcnkpO1xyXG5cclxuICAgICAgICAgICAga28uYXBwbHlCaW5kaW5nc1RvTm9kZShlbGVtZW50LCB7IHZpc2libGU6IHZhbGlkYXRpb25TdW1tYXJ5Lmhhc01lc3NhZ2VzIH0sIHZhbGlkYXRpb25TdW1tYXJ5KTtcclxuICAgICAgICAgICAga28uYXBwbHlCaW5kaW5nc1RvTm9kZSh1bCwgeyBmb3JlYWNoOiB2YWxpZGF0aW9uU3VtbWFyeS5tZXNzYWdlcyB9LCB2YWxpZGF0aW9uU3VtbWFyeSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWxpZGF0aW9uU3VtbWFyeSA9IGtvLnV0aWxzLmRvbURhdGEuZ2V0KGVsZW1lbnQsICd2YWxpZGF0aW9uc3VtbWFyeScpO1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uU3VtbWFyeS5jb21tYW5kcyhrby5iaW5kaW5nSGFuZGxlcnMudmFsaWRhdGlvblN1bW1hcnlGb3IuZ2V0VmFsdWVBc0FycmF5KHZhbHVlQWNjZXNzb3IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldFZhbHVlQXNBcnJheTogZnVuY3Rpb24gKHZhbHVlQWNjZXNzb3IpIHtcclxuICAgICAgICAgICAgdmFyIHRhcmdldCA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKTtcclxuICAgICAgICAgICAgaWYgKCEoQmlmcm9zdC5pc0FycmF5KHRhcmdldCkpKSB7IHRhcmdldCA9IFt0YXJnZXRdOyB9XHJcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSIsImlmICh0eXBlb2Yga28gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICBrby5iaW5kaW5nSGFuZGxlcnMudmFsaWRhdGlvbk1lc3NhZ2VGb3IgPSB7XHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzQWNjZXNzb3IsIHZpZXdNb2RlbCkge1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB2YWx1ZUFjY2Vzc29yKCk7XHJcbiAgICAgICAgICAgIHZhciB2YWxpZGF0b3IgPSB2YWx1ZS52YWxpZGF0b3I7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHZhbGlkYXRvcikpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFsaWRhdG9yLmlzVmFsaWQuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChlbGVtZW50KS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZWxlbWVudCkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAga28uYXBwbHlCaW5kaW5nc1RvTm9kZShlbGVtZW50LCB7IHRleHQ6IHZhbGlkYXRvci5tZXNzYWdlIH0sIHZhbGlkYXRvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSIsImlmICh0eXBlb2Yga28gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICBrby5leHRlbmRlcnMudmFsaWRhdGlvbiA9IGZ1bmN0aW9uICh0YXJnZXQsIG9wdGlvbnMpIHtcclxuICAgICAgICBCaWZyb3N0LnZhbGlkYXRpb24uVmFsaWRhdG9yLmFwcGx5VG8odGFyZ2V0LCBvcHRpb25zKTtcclxuICAgICAgICB0YXJnZXQuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICB0YXJnZXQudmFsaWRhdG9yLnZhbGlkYXRlKG5ld1ZhbHVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gVG9kbyA6IGxvb2sgaW50byBhZ2dyZXNzaXZlIHZhbGlkYXRpb25cclxuICAgICAgICAvL3RhcmdldC52YWxpZGF0b3IudmFsaWRhdGUodGFyZ2V0KCkpO1xyXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICB9O1xyXG59XHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWxpZGF0aW9uXCIsIHtcclxuICAgIG5vdE51bGw6IEJpZnJvc3QudmFsaWRhdGlvbi5SdWxlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gIShCaWZyb3N0LmlzVW5kZWZpbmVkKHZhbHVlKSB8fCBCaWZyb3N0LmlzTnVsbCh2YWx1ZSkpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuXHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWxpZGF0aW9uXCIsIHtcclxuICAgIHJlcXVpcmVkOiBCaWZyb3N0LnZhbGlkYXRpb24uUnVsZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMudmFsaWRhdGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuICEoQmlmcm9zdC5pc1VuZGVmaW5lZCh2YWx1ZSkgfHwgQmlmcm9zdC5pc051bGwodmFsdWUpIHx8IHZhbHVlID09PSBcIlwiIHx8IHZhbHVlID09PSAwKTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcblxyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsaWRhdGlvblwiLCB7XHJcbiAgICBsZW5ndGg6IEJpZnJvc3QudmFsaWRhdGlvbi5SdWxlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBub3RTZXQodmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEJpZnJvc3QuaXNVbmRlZmluZWQodmFsdWUpIHx8IEJpZnJvc3QuaXNOdWxsKHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRocm93SWZWYWx1ZUlzTm90QU51bWJlcih2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdW1iZXIodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk5vdEFOdW1iZXIoXCJWYWx1ZSBcIiArIHZhbHVlICsgXCIgaXMgbm90IGEgbnVtYmVyXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lmT3B0aW9uc0ludmFsaWQob3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAobm90U2V0KG9wdGlvbnMpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk9wdGlvbnNOb3REZWZpbmVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5vdFNldChvcHRpb25zLm1heCkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uTWF4TGVuZ3RoTm90U3BlY2lmaWVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5vdFNldChvcHRpb25zLm1pbikpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uTWluTGVuZ3RoTm90U3BlY2lmaWVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3dJZlZhbHVlSXNOb3RBTnVtYmVyKG9wdGlvbnMubWluKTtcclxuICAgICAgICAgICAgdGhyb3dJZlZhbHVlSXNOb3RBTnVtYmVyKG9wdGlvbnMubWF4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudmFsaWRhdGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhyb3dJZk9wdGlvbnNJbnZhbGlkKHNlbGYub3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGlmIChub3RTZXQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzU3RyaW5nKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLm9wdGlvbnMubWluIDw9IHZhbHVlLmxlbmd0aCAmJiB2YWx1ZS5sZW5ndGggPD0gc2VsZi5vcHRpb25zLm1heDtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbGlkYXRpb25cIiwge1xyXG4gICAgbWluTGVuZ3RoOiBCaWZyb3N0LnZhbGlkYXRpb24uUnVsZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbm90U2V0KHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBCaWZyb3N0LmlzVW5kZWZpbmVkKHZhbHVlKSB8fCBCaWZyb3N0LmlzTnVsbCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lmVmFsdWVJc05vdEFOdW1iZXIodmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVtYmVyKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5Ob3RBTnVtYmVyKFwiVmFsdWUgXCIgKyB2YWx1ZSArIFwiIGlzIG5vdCBhIG51bWJlclwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGhyb3dJZk9wdGlvbnNJbnZhbGlkKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKG5vdFNldChvcHRpb25zKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5PcHRpb25zTm90RGVmaW5lZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChub3RTZXQob3B0aW9ucy5sZW5ndGgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk1heE5vdFNwZWNpZmllZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRocm93SWZWYWx1ZUlzTm90QU51bWJlcihvcHRpb25zLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGhyb3dJZlZhbHVlSXNOb3RBU3RyaW5nKHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNTdHJpbmcoc3RyaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5Ob3RBU3RyaW5nKFwiVmFsdWUgXCIgKyBzdHJpbmcgKyBcIiBpcyBub3QgYSBzdHJpbmdcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudmFsaWRhdGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhyb3dJZk9wdGlvbnNJbnZhbGlkKHNlbGYub3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGlmIChub3RTZXQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3dJZlZhbHVlSXNOb3RBU3RyaW5nKHZhbHVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA+PSBzZWxmLm9wdGlvbnMubGVuZ3RoO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuXHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWxpZGF0aW9uXCIsIHtcclxuICAgIG1heExlbmd0aDogQmlmcm9zdC52YWxpZGF0aW9uLlJ1bGUuZXh0ZW5kKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbm90U2V0KHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBCaWZyb3N0LmlzVW5kZWZpbmVkKHZhbHVlKSB8fCBCaWZyb3N0LmlzTnVsbCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lmVmFsdWVJc05vdEFOdW1iZXIodmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVtYmVyKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5Ob3RBTnVtYmVyKFwiVmFsdWUgXCIgKyB2YWx1ZSArIFwiIGlzIG5vdCBhIG51bWJlclwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGhyb3dJZk9wdGlvbnNJbnZhbGlkKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKG5vdFNldChvcHRpb25zKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5PcHRpb25zTm90RGVmaW5lZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChub3RTZXQob3B0aW9ucy5sZW5ndGgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk1heE5vdFNwZWNpZmllZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRocm93SWZWYWx1ZUlzTm90QU51bWJlcihvcHRpb25zLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGhyb3dJZlZhbHVlSXNOb3RBU3RyaW5nKHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNTdHJpbmcoc3RyaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5Ob3RBU3RyaW5nKFwiVmFsdWUgXCIgKyBzdHJpbmcgKyBcIiBpcyBub3QgYSBzdHJpbmdcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudmFsaWRhdGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhyb3dJZk9wdGlvbnNJbnZhbGlkKHNlbGYub3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGlmIChub3RTZXQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3dJZlZhbHVlSXNOb3RBU3RyaW5nKHZhbHVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA8PSBzZWxmLm9wdGlvbnMubGVuZ3RoO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuXHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWxpZGF0aW9uXCIsIHtcclxuICAgIHJhbmdlOiBCaWZyb3N0LnZhbGlkYXRpb24uUnVsZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbm90U2V0KHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBCaWZyb3N0LmlzVW5kZWZpbmVkKHZhbHVlKSB8fCBCaWZyb3N0LmlzTnVsbCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lmVmFsdWVJc05vdEFOdW1iZXIodmFsdWUsIHBhcmFtKSB7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bWJlcih2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uTm90QU51bWJlcihwYXJhbSArIFwiIHZhbHVlIFwiICsgdmFsdWUgKyBcIiBpcyBub3QgYSBudW1iZXJcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lmT3B0aW9uc0ludmFsaWQob3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAobm90U2V0KG9wdGlvbnMpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk9wdGlvbnNOb3REZWZpbmVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5vdFNldChvcHRpb25zLm1heCkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uTWF4Tm90U3BlY2lmaWVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5vdFNldChvcHRpb25zLm1pbikpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uTWluTm90U3BlY2lmaWVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3dJZlZhbHVlSXNOb3RBTnVtYmVyKG9wdGlvbnMubWluLCBcIm1pblwiKTtcclxuICAgICAgICAgICAgdGhyb3dJZlZhbHVlSXNOb3RBTnVtYmVyKG9wdGlvbnMubWF4LCBcIm1heFwiKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLnZhbGlkYXRlID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRocm93SWZPcHRpb25zSW52YWxpZChzZWxmLm9wdGlvbnMpO1xyXG4gICAgICAgICAgICBpZiAobm90U2V0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRocm93SWZWYWx1ZUlzTm90QU51bWJlcih2YWx1ZSwgXCJ2YWx1ZVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYub3B0aW9ucy5taW4gPD0gdmFsdWUgJiYgdmFsdWUgPD0gc2VsZi5vcHRpb25zLm1heDtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH0pXHJcbn0pO1xyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsaWRhdGlvblwiLCB7XHJcbiAgICBsZXNzVGhhbjogQmlmcm9zdC52YWxpZGF0aW9uLlJ1bGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG5vdFNldCh2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gQmlmcm9zdC5pc1VuZGVmaW5lZCh2YWx1ZSkgfHwgQmlmcm9zdC5pc051bGwodmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGhyb3dJZk9wdGlvbnNJbnZhbGlkKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKG5vdFNldChvcHRpb25zKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5PcHRpb25zTm90RGVmaW5lZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChub3RTZXQob3B0aW9ucy52YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBleGNlcHRpb24gPSBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk9wdGlvbnNWYWx1ZU5vdFNwZWNpZmllZCgpO1xyXG4gICAgICAgICAgICAgICAgZXhjZXB0aW9uLm1lc3NhZ2UgPSBleGNlcHRpb24ubWVzc2FnZSArIFwiICd2YWx1ZScgaXMgbm90IHNldC5cIjtcclxuICAgICAgICAgICAgICAgIHRocm93IGV4Y2VwdGlvbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGhyb3dJc1ZhbHVlVG9DaGVja0lzTm90QU51bWJlcih2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdW1iZXIodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk5vdEFOdW1iZXIoXCJWYWx1ZSBcIiArIHZhbHVlICsgXCIgaXMgbm90IGEgbnVtYmVyXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZhbGlkYXRlID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRocm93SWZPcHRpb25zSW52YWxpZChzZWxmLm9wdGlvbnMpO1xyXG4gICAgICAgICAgICBpZiAobm90U2V0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRocm93SXNWYWx1ZVRvQ2hlY2tJc05vdEFOdW1iZXIodmFsdWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSkgPCBwYXJzZUZsb2F0KHNlbGYub3B0aW9ucy52YWx1ZSk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsaWRhdGlvbi5ydWxlSGFuZGxlcnNcIik7XHJcbkJpZnJvc3QudmFsaWRhdGlvbi5ydWxlSGFuZGxlcnMubGVzc1RoYW5PckVxdWFsID0ge1xyXG4gICAgdGhyb3dJZk9wdGlvbnNJbnZhbGlkOiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIGlmICh0aGlzLm5vdFNldChvcHRpb25zKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk9wdGlvbnNOb3REZWZpbmVkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm5vdFNldChvcHRpb25zLnZhbHVlKSkge1xyXG4gICAgICAgICAgICB2YXIgZXhjZXB0aW9uID0gbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5PcHRpb25zVmFsdWVOb3RTcGVjaWZpZWQoKTtcclxuICAgICAgICAgICAgZXhjZXB0aW9uLm1lc3NhZ2UgPSBleGNlcHRpb24ubWVzc2FnZSArIFwiICd2YWx1ZScgaXMgbm90IHNldC5cIjtcclxuICAgICAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgdGhyb3dJc1ZhbHVlVG9DaGVja0lzTm90QU51bWJlcjogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVtYmVyKHZhbHVlKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk5vdEFOdW1iZXIoXCJWYWx1ZSBcIiArIHZhbHVlICsgXCIgaXMgbm90IGEgbnVtYmVyXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgbm90U2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gQmlmcm9zdC5pc1VuZGVmaW5lZCh2YWx1ZSkgfHwgQmlmcm9zdC5pc051bGwodmFsdWUpO1xyXG4gICAgfSxcclxuXHJcbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24gKHZhbHVlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy50aHJvd0lmT3B0aW9uc0ludmFsaWQob3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKHRoaXMubm90U2V0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudGhyb3dJc1ZhbHVlVG9DaGVja0lzTm90QU51bWJlcih2YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpIDw9IHBhcnNlRmxvYXQob3B0aW9ucy52YWx1ZSk7XHJcbiAgICB9XHJcbn07XHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWxpZGF0aW9uXCIsIHtcclxuICAgIGdyZWF0ZXJUaGFuOiBCaWZyb3N0LnZhbGlkYXRpb24uUnVsZS5leHRlbmQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBub3RTZXQodmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEJpZnJvc3QuaXNVbmRlZmluZWQodmFsdWUpIHx8IEJpZnJvc3QuaXNOdWxsKHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRocm93SWZPcHRpb25zSW52YWxpZChvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGlmIChub3RTZXQob3B0aW9ucykpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uT3B0aW9uc05vdERlZmluZWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobm90U2V0KG9wdGlvbnMudmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXhjZXB0aW9uID0gbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5PcHRpb25zVmFsdWVOb3RTcGVjaWZpZWQoKTtcclxuICAgICAgICAgICAgICAgIGV4Y2VwdGlvbi5tZXNzYWdlID0gZXhjZXB0aW9uLm1lc3NhZ2UgKyBcIiAndmFsdWUnIGlzIG5vdCBzZXQuXCI7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBleGNlcHRpb247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3dJZlZhbHVlVG9DaGVja0lzTm90QU51bWJlcihvcHRpb25zLnZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRocm93SWZWYWx1ZVRvQ2hlY2tJc05vdEFOdW1iZXIodmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVtYmVyKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5Ob3RBTnVtYmVyKFwiVmFsdWUgXCIgKyB2YWx1ZSArIFwiIGlzIG5vdCBhIG51bWJlclwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aHJvd0lmT3B0aW9uc0ludmFsaWQoc2VsZi5vcHRpb25zKTtcclxuICAgICAgICAgICAgaWYgKG5vdFNldCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aHJvd0lmVmFsdWVUb0NoZWNrSXNOb3RBTnVtYmVyKHZhbHVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpID4gcGFyc2VGbG9hdChzZWxmLm9wdGlvbnMudmFsdWUpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbGlkYXRpb24ucnVsZUhhbmRsZXJzXCIpO1xyXG5CaWZyb3N0LnZhbGlkYXRpb24ucnVsZUhhbmRsZXJzLmdyZWF0ZXJUaGFuT3JFcXVhbCA9IHtcclxuICAgIHRocm93SWZPcHRpb25zSW52YWxpZDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICBpZiAodGhpcy5ub3RTZXQob3B0aW9ucykpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5PcHRpb25zTm90RGVmaW5lZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5ub3RTZXQob3B0aW9ucy52YWx1ZSkpIHtcclxuICAgICAgICAgICAgdmFyIGV4Y2VwdGlvbiA9IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uT3B0aW9uc1ZhbHVlTm90U3BlY2lmaWVkKCk7XHJcbiAgICAgICAgICAgIGV4Y2VwdGlvbi5tZXNzYWdlID0gZXhjZXB0aW9uLm1lc3NhZ2UgKyBcIiAndmFsdWUnIGlzIG5vdCBzZXQuXCI7XHJcbiAgICAgICAgICAgIHRocm93IGV4Y2VwdGlvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50aHJvd0lmVmFsdWVUb0NoZWNrSXNOb3RBTnVtYmVyKG9wdGlvbnMudmFsdWUpO1xyXG4gICAgfSxcclxuXHJcbiAgICB0aHJvd0lmVmFsdWVUb0NoZWNrSXNOb3RBTnVtYmVyOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdW1iZXIodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uTm90QU51bWJlcihcIlZhbHVlIFwiICsgdmFsdWUgKyBcIiBpcyBub3QgYSBudW1iZXJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBub3RTZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiBCaWZyb3N0LmlzVW5kZWZpbmVkKHZhbHVlKSB8fCBCaWZyb3N0LmlzTnVsbCh2YWx1ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHZhbGlkYXRlOiBmdW5jdGlvbiAodmFsdWUsIG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLnRocm93SWZPcHRpb25zSW52YWxpZChvcHRpb25zKTtcclxuICAgICAgICBpZiAodGhpcy5ub3RTZXQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50aHJvd0lmVmFsdWVUb0NoZWNrSXNOb3RBTnVtYmVyKHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSkgPj0gcGFyc2VGbG9hdChvcHRpb25zLnZhbHVlKTtcclxuICAgIH1cclxufTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbGlkYXRpb25cIiwge1xyXG4gICAgZW1haWw6IEJpZnJvc3QudmFsaWRhdGlvbi5SdWxlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHJlZ2V4ID0gL14oKChbYS16XXxcXGR8WyEjXFwkJSYnXFwqXFwrXFwtXFwvPVxcP1xcXl9ge1xcfH1+XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkrKFxcLihbYS16XXxcXGR8WyEjXFwkJSYnXFwqXFwrXFwtXFwvPVxcP1xcXl9ge1xcfH1+XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkrKSopfCgoXFx4MjIpKCgoKFxceDIwfFxceDA5KSooXFx4MGRcXHgwYSkpPyhcXHgyMHxcXHgwOSkrKT8oKFtcXHgwMS1cXHgwOFxceDBiXFx4MGNcXHgwZS1cXHgxZlxceDdmXXxcXHgyMXxbXFx4MjMtXFx4NWJdfFtcXHg1ZC1cXHg3ZV18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfChcXFxcKFtcXHgwMS1cXHgwOVxceDBiXFx4MGNcXHgwZC1cXHg3Zl18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKSkpKigoKFxceDIwfFxceDA5KSooXFx4MGRcXHgwYSkpPyhcXHgyMHxcXHgwOSkrKT8oXFx4MjIpKSlAKCgoW2Etel18XFxkfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoKFthLXpdfFxcZHxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkoW2Etel18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkqKFthLXpdfFxcZHxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkpKVxcLikrKChbYS16XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KChbYS16XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkoW2Etel18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkqKFthLXpdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSkpJC87XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG5vdFNldCh2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gQmlmcm9zdC5pc051bGwodmFsdWUpIHx8IEJpZnJvc3QuaXNVbmRlZmluZWQodmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAobm90U2V0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNTdHJpbmcodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk5vdEFTdHJpbmcoXCJWYWx1ZSBcIiArIHZhbHVlICsgXCIgaXMgbm90IGEgc3RyaW5nXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gKHZhbHVlLm1hdGNoKHJlZ2V4KSA9PSBudWxsKSA/IGZhbHNlIDogdHJ1ZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH0pXHJcbn0pO1xyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsaWRhdGlvblwiLCB7XHJcbiAgICByZWdleDogQmlmcm9zdC52YWxpZGF0aW9uLlJ1bGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG5vdFNldCh2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gQmlmcm9zdC5pc1VuZGVmaW5lZCh2YWx1ZSkgfHwgQmlmcm9zdC5pc051bGwodmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGhyb3dJZk9wdGlvbnNJbnZhbGlkKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKG5vdFNldChvcHRpb25zKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5PcHRpb25zTm90RGVmaW5lZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChub3RTZXQob3B0aW9ucy5leHByZXNzaW9uKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5NaXNzaW5nRXhwcmVzc2lvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc1N0cmluZyhvcHRpb25zLmV4cHJlc3Npb24pKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk5vdEFTdHJpbmcoXCJFeHByZXNzaW9uIFwiICsgb3B0aW9ucy5leHByZXNzaW9uICsgXCIgaXMgbm90IGEgc3RyaW5nLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGhyb3dJZlZhbHVlSXNOb3RTdHJpbmcodmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzU3RyaW5nKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5Ob3RBU3RyaW5nKFwiVmFsdWUgXCIgKyB2YWx1ZSArIFwiIGlzIG5vdCBhIHN0cmluZy5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudmFsaWRhdGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhyb3dJZk9wdGlvbnNJbnZhbGlkKHNlbGYub3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGlmIChub3RTZXQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3dJZlZhbHVlSXNOb3RTdHJpbmcodmFsdWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gKHZhbHVlLm1hdGNoKHNlbGYub3B0aW9ucy5leHByZXNzaW9uKSA9PSBudWxsKSA/IGZhbHNlIDogdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcblxyXG5cclxuIiwiaWYgKHR5cGVvZiBrbyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIGtvLmJpbmRpbmdIYW5kbGVycy5jb21tYW5kID0ge1xyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5nQWNjZXNzb3IsIHZpZXdNb2RlbCkge1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB2YWx1ZUFjY2Vzc29yKCk7XHJcbiAgICAgICAgICAgIHZhciBjb21tYW5kO1xyXG4gICAgICAgICAgICB2YXIgY29udGV4dEJvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiB2YWx1ZS5jYW5FeGVjdXRlID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kID0gdmFsdWUudGFyZ2V0O1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbW1hbmQucGFyYW1ldGVycyA9IGNvbW1hbmQucGFyYW1ldGVycyB8fCB7fTtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJhbWV0ZXJzID0gdmFsdWUucGFyYW1ldGVycyB8fCB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwYXJhbWV0ZXIgaW4gcGFyYW1ldGVycyApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGFyYW1ldGVyVmFsdWUgPSBwYXJhbWV0ZXJzW3BhcmFtZXRlcl07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCBjb21tYW5kLnBhcmFtZXRlcnMuaGFzT3duUHJvcGVydHkocGFyYW1ldGVyKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrby5pc09ic2VydmFibGUoY29tbWFuZC5wYXJhbWV0ZXJzW3BhcmFtZXRlcl0pICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kLnBhcmFtZXRlcnNbcGFyYW1ldGVyXShwYXJhbWV0ZXJWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZC5wYXJhbWV0ZXJzW3BhcmFtZXRlcl0gPSBrby5vYnNlcnZhYmxlKHBhcmFtZXRlclZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0Qm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZCA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3NUb05vZGUoZWxlbWVudCwgeyBjbGljazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kLmV4ZWN1dGUoKTtcclxuICAgICAgICAgICAgfX0sIHZpZXdNb2RlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5jb21tYW5kc1wiLCB7XHJcbiAgICBIYW5kbGVDb21tYW5kVGFzazogQmlmcm9zdC50YXNrcy5FeGVjdXRpb25UYXNrLmV4dGVuZChmdW5jdGlvbiAoY29tbWFuZCwgc2VydmVyLCBzeXN0ZW1FdmVudHMpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyBhIHRhc2sgdGhhdCBjYW4gaGFuZGxlIGEgY29tbWFuZDwvc3VtbWFyeT5cclxuICAgICAgICB0aGlzLm5hbWUgPSBjb21tYW5kLm5hbWU7XHJcblxyXG4gICAgICAgIHRoaXMuZXhlY3V0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNvbW1hbmREZXNjcmlwdG9yID0gQmlmcm9zdC5jb21tYW5kcy5Db21tYW5kRGVzY3JpcHRvci5jcmVhdGVGcm9tKGNvbW1hbmQpO1xyXG4gICAgICAgICAgICB2YXIgcGFyYW1ldGVycyA9IHtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmREZXNjcmlwdG9yOiBjb21tYW5kRGVzY3JpcHRvclxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdmFyIHVybCA9IFwiL0JpZnJvc3QvQ29tbWFuZENvb3JkaW5hdG9yL0hhbmRsZT9fY21kPVwiICsgY29tbWFuZC5fZ2VuZXJhdGVkRnJvbTtcclxuXHJcbiAgICAgICAgICAgIHNlcnZlci5wb3N0KHVybCwgcGFyYW1ldGVycykuY29udGludWVXaXRoKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb21tYW5kUmVzdWx0ID0gQmlmcm9zdC5jb21tYW5kcy5Db21tYW5kUmVzdWx0LmNyZWF0ZUZyb20ocmVzdWx0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY29tbWFuZFJlc3VsdC5zdWNjZXNzID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3lzdGVtRXZlbnRzLmNvbW1hbmRzLnN1Y2NlZWRlZC50cmlnZ2VyKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHN5c3RlbUV2ZW50cy5jb21tYW5kcy5mYWlsZWQudHJpZ2dlcihyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGNvbW1hbmRSZXN1bHQpO1xyXG4gICAgICAgICAgICB9KS5vbkZhaWwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29tbWFuZFJlc3VsdCA9IEJpZnJvc3QuY29tbWFuZHMuQ29tbWFuZFJlc3VsdC5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmRSZXN1bHQuZXhjZXB0aW9uID0gXCJIVFRQIDUwMFwiO1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZFJlc3VsdC5leGNlcHRpb25NZXNzYWdlID0gcmVzcG9uc2Uuc3RhdHVzVGV4dDtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmRSZXN1bHQuZGV0YWlscyA9IHJlc3BvbnNlLnJlc3BvbnNlVGV4dDtcclxuICAgICAgICAgICAgICAgIHN5c3RlbUV2ZW50cy5jb21tYW5kcy5mYWlsZWQudHJpZ2dlcihjb21tYW5kUmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGNvbW1hbmRSZXN1bHQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuY29tbWFuZHNcIiwge1xyXG4gICAgSGFuZGxlQ29tbWFuZHNUYXNrOiBCaWZyb3N0LnRhc2tzLkV4ZWN1dGlvblRhc2suZXh0ZW5kKGZ1bmN0aW9uIChjb21tYW5kcywgc2VydmVyKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSB0YXNrIHRoYXQgY2FuIGhhbmRsZSBhbiBhcnJheSBvZiBjb21tYW5kPC9zdW1tYXJ5PlxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5uYW1lcyA9IFtdO1xyXG4gICAgICAgIGNvbW1hbmRzLmZvckVhY2goZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgc2VsZi5uYW1lcy5wdXNoKGNvbW1hbmQubmFtZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZXhlY3V0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNvbW1hbmREZXNjcmlwdG9ycyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgY29tbWFuZHMuZm9yRWFjaChmdW5jdGlvbiAoY29tbWFuZCkge1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZC5pc0J1c3kodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29tbWFuZERlc2NyaXB0b3IgPSBCaWZyb3N0LmNvbW1hbmRzLkNvbW1hbmREZXNjcmlwdG9yLmNyZWF0ZUZyb20oY29tbWFuZCk7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kRGVzY3JpcHRvcnMucHVzaChjb21tYW5kRGVzY3JpcHRvcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIHBhcmFtZXRlcnMgPSB7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kRGVzY3JpcHRvcnM6IGNvbW1hbmREZXNjcmlwdG9yc1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdmFyIHVybCA9IFwiL0JpZnJvc3QvQ29tbWFuZENvb3JkaW5hdG9yL0hhbmRsZU1hbnlcIjtcclxuXHJcbiAgICAgICAgICAgIHNlcnZlci5wb3N0KHVybCwgcGFyYW1ldGVycykuY29udGludWVXaXRoKGZ1bmN0aW9uIChyZXN1bHRzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29tbWFuZFJlc3VsdHMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXN1bHRzLmZvckVhY2goZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21tYW5kUmVzdWx0ID0gQmlmcm9zdC5jb21tYW5kcy5Db21tYW5kUmVzdWx0LmNyZWF0ZUZyb20ocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kUmVzdWx0cy5wdXNoKGNvbW1hbmRSZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChjb21tYW5kUmVzdWx0cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5jb21tYW5kc1wiLCB7XHJcbiAgICBjb21tYW5kQ29vcmRpbmF0b3I6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICh0YXNrRmFjdG9yeSkge1xyXG4gICAgICAgIHRoaXMuaGFuZGxlID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB2YXIgdGFzayA9IHRhc2tGYWN0b3J5LmNyZWF0ZUhhbmRsZUNvbW1hbmQoY29tbWFuZCk7XHJcblxyXG4gICAgICAgICAgICBjb21tYW5kLnJlZ2lvbi50YXNrcy5leGVjdXRlKHRhc2spLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoY29tbWFuZFJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoY29tbWFuZFJlc3VsdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVNYW55ID0gZnVuY3Rpb24gKGNvbW1hbmRzLCByZWdpb24pIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHZhciB0YXNrID0gdGFza0ZhY3RvcnkuY3JlYXRlSGFuZGxlQ29tbWFuZHMoY29tbWFuZHMpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlZ2lvbi50YXNrcy5leGVjdXRlKHRhc2spLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoY29tbWFuZFJlc3VsdHMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kcy5mb3JFYWNoKGZ1bmN0aW9uIChjb21tYW5kLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29tbWFuZFJlc3VsdCA9IGNvbW1hbmRSZXN1bHRzW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbW1hbmRSZXN1bHQgIT0gbnVsbCAmJiAhQmlmcm9zdC5pc1VuZGVmaW5lZChjb21tYW5kUmVzdWx0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZC5oYW5kbGVDb21tYW5kUmVzdWx0KGNvbW1hbmRSZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmQuaXNCdXN5KGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoY29tbWFuZFJlc3VsdHMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZHMuZm9yRWFjaChmdW5jdGlvbihjb21tYW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZC5pc0J1c3koZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy5jb21tYW5kQ29vcmRpbmF0b3IgPSBCaWZyb3N0LmNvbW1hbmRzLmNvbW1hbmRDb29yZGluYXRvcjsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuY29tbWFuZHNcIiwge1xyXG4gICAgY29tbWFuZFZhbGlkYXRpb25TZXJ2aWNlOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG91bGRTa2lwUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydHkgPT09IFwicmVnaW9uXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF0YXJnZXQuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoa28uaXNPYnNlcnZhYmxlKHRhcmdldFtwcm9wZXJ0eV0pKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXRbcHJvcGVydHldID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gXCJfdHlwZVwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvcGVydHkgPT09IFwiX2RlcGVuZGVuY2llc1wiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvcGVydHkgPT09IFwiX25hbWVzcGFjZVwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoKHRhcmdldFtwcm9wZXJ0eV0gPT0gbnVsbCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgodHlwZW9mIHRhcmdldFtwcm9wZXJ0eV0ucHJvdG90eXBlICE9PSBcInVuZGVmaW5lZFwiKSAmJlxyXG4gICAgICAgICAgICAgICAgKHRhcmdldFtwcm9wZXJ0eV0ucHJvdG90eXBlICE9PSBudWxsKSAmJlxyXG4gICAgICAgICAgICAgICAgKHRhcmdldFtwcm9wZXJ0eV0gaW5zdGFuY2VvZiBCaWZyb3N0LlR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZXh0ZW5kUHJvcGVydGllcyh0YXJnZXQsIHZhbGlkYXRvcnMpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2hvdWxkU2tpcFByb3BlcnR5KHRhcmdldCwgcHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRhcmdldFtwcm9wZXJ0eV0udmFsaWRhdG9yICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZSh0YXJnZXRbcHJvcGVydHldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFtwcm9wZXJ0eV0uZXh0ZW5kKHsgdmFsaWRhdGlvbjoge30gfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BlcnR5XS52YWxpZGF0b3IucHJvcGVydHlOYW1lID0gcHJvcGVydHk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0YXJnZXRbcHJvcGVydHldID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXh0ZW5kUHJvcGVydGllcyh0YXJnZXRbcHJvcGVydHldLCB2YWxpZGF0b3JzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdmFsaWRhdGVQcm9wZXJ0aWVzRm9yKHRhcmdldCwgcmVzdWx0LCBzaWxlbnQpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2hvdWxkU2tpcFByb3BlcnR5KHRhcmdldCwgcHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXRbcHJvcGVydHldLnZhbGlkYXRvciAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZVRvVmFsaWRhdGUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHRhcmdldFtwcm9wZXJ0eV0oKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpbGVudCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcGVydHldLnZhbGlkYXRvci52YWxpZGF0ZVNpbGVudGx5KHZhbHVlVG9WYWxpZGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BlcnR5XS52YWxpZGF0b3IudmFsaWRhdGUodmFsdWVUb1ZhbGlkYXRlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRbcHJvcGVydHldLnZhbGlkYXRvci5pc1ZhbGlkKCkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC52YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRhcmdldFtwcm9wZXJ0eV0gPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZVByb3BlcnRpZXNGb3IodGFyZ2V0W3Byb3BlcnR5XSwgcmVzdWx0LCBzaWxlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYXBwbHlWYWxpZGF0aW9uTWVzc2FnZVRvTWVtYmVycyhjb21tYW5kLCBtZW1iZXJzLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGZpeE1lbWJlcihtZW1iZXIpIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gbWVtYmVyLnRvQ2FtZWxDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgaW4gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXRbcHJvcGVydHldID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldFtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBtZW1iZXJJbmRleCA9IDA7IG1lbWJlckluZGV4IDwgbWVtYmVycy5sZW5ndGg7IG1lbWJlckluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYXRoID0gbWVtYmVyc1ttZW1iZXJJbmRleF0uc3BsaXQoXCIuXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBjb21tYW5kO1xyXG5cclxuICAgICAgICAgICAgICAgIHBhdGguZm9yRWFjaChmaXhNZW1iZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSAhPSBudWxsICYmIHByb3BlcnR5Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtZW1iZXIgPSB0YXJnZXRbcHJvcGVydHldO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1lbWJlci52YWxpZGF0b3IgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVtYmVyLnZhbGlkYXRvci5pc1ZhbGlkKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVtYmVyLnZhbGlkYXRvci5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5hcHBseVZhbGlkYXRpb25SZXN1bHRUb1Byb3BlcnRpZXMgPSBmdW5jdGlvbiAoY29tbWFuZCwgdmFsaWRhdGlvblJlc3VsdHMpIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsaWRhdGlvblJlc3VsdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWxpZGF0aW9uUmVzdWx0ID0gdmFsaWRhdGlvblJlc3VsdHNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHZhbGlkYXRpb25SZXN1bHQuZXJyb3JNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1lbWJlck5hbWVzID0gdmFsaWRhdGlvblJlc3VsdC5tZW1iZXJOYW1lcztcclxuICAgICAgICAgICAgICAgIGlmIChtZW1iZXJOYW1lcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXBwbHlWYWxpZGF0aW9uTWVzc2FnZVRvTWVtYmVycyhjb21tYW5kLCBtZW1iZXJOYW1lcywgbWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnZhbGlkYXRlID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHsgdmFsaWQ6IHRydWUgfTtcclxuICAgICAgICAgICAgdmFsaWRhdGVQcm9wZXJ0aWVzRm9yKGNvbW1hbmQsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZVNpbGVudGx5ID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHsgdmFsaWQ6IHRydWUgfTtcclxuICAgICAgICAgICAgdmFsaWRhdGVQcm9wZXJ0aWVzRm9yKGNvbW1hbmQsIHJlc3VsdCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jbGVhclZhbGlkYXRpb25NZXNzYWdlc0ZvciA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2hvdWxkU2tpcFByb3BlcnR5KHRhcmdldCwgcHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHRhcmdldFtwcm9wZXJ0eV0udmFsaWRhdG9yKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFtwcm9wZXJ0eV0udmFsaWRhdG9yLm1lc3NhZ2UoXCJcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmV4dGVuZFByb3BlcnRpZXNXaXRob3V0VmFsaWRhdGlvbiA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XHJcbiAgICAgICAgICAgIGV4dGVuZFByb3BlcnRpZXMoY29tbWFuZCk7XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNvbGxlY3RWYWxpZGF0b3JzKHNvdXJjZSwgdmFsaWRhdG9ycykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBzb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHNvdXJjZVtwcm9wZXJ0eV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNob3VsZFNraXBQcm9wZXJ0eShzb3VyY2UsIHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChrby5pc09ic2VydmFibGUodmFsdWUpICYmIHR5cGVvZiB2YWx1ZS52YWxpZGF0b3IgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0b3JzLnB1c2godmFsdWUudmFsaWRhdG9yKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoQmlmcm9zdC5pc09iamVjdCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xsZWN0VmFsaWRhdG9ycyh2YWx1ZSwgdmFsaWRhdG9ycyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0VmFsaWRhdG9yc0ZvciA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWxpZGF0b3JzID0gW107XHJcbiAgICAgICAgICAgIGNvbGxlY3RWYWxpZGF0b3JzKGNvbW1hbmQsIHZhbGlkYXRvcnMpO1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsaWRhdG9ycztcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmNvbW1hbmRzXCIsIHtcclxuICAgIENvbW1hbmQ6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKGNvbW1hbmRDb29yZGluYXRvciwgY29tbWFuZFZhbGlkYXRpb25TZXJ2aWNlLCBjb21tYW5kU2VjdXJpdHlTZXJ2aWNlLCBtYXBwZXIsIG9wdGlvbnMsIHJlZ2lvbikge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgaGFzQ2hhbmdlc09ic2VydmFibGVzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcblxyXG4gICAgICAgIHRoaXMucmVnaW9uID0gcmVnaW9uO1xyXG4gICAgICAgIHRoaXMuX25hbWUgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuX2dlbmVyYXRlZEZyb20gPSBcIlwiO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0Q29tbWFuZCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0b3JzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0aW9uTWVzc2FnZXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICB0aGlzLnNlY3VyaXR5Q29udGV4dCA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcbiAgICAgICAgdGhpcy5wb3B1bGF0ZWRGcm9tRXh0ZXJuYWxTb3VyY2UgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuaXNCdXN5ID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5pc1ZhbGlkID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdmFsaWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBzZWxmLnZhbGlkYXRvcnMoKS5zb21lKGZ1bmN0aW9uICh2YWxpZGF0b3IpIHtcclxuICAgICAgICAgICAgICAgIGlmIChrby5pc09ic2VydmFibGUodmFsaWRhdG9yLmlzVmFsaWQpICYmIHZhbGlkYXRvci5pc1ZhbGlkKCkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VsZi52YWxpZGF0aW9uTWVzc2FnZXMoKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2YWxpZDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmlzQXV0aG9yaXplZCA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuY2FuRXhlY3V0ZSA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuaXNWYWxpZCgpICYmIHNlbGYuaXNBdXRob3JpemVkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5pc1BvcHVsYXRlZEV4dGVybmFsbHkgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgICAgICB0aGlzLmlzUmVhZHkgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmlzUG9wdWxhdGVkRXh0ZXJuYWxseSgpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYucG9wdWxhdGVkRnJvbUV4dGVybmFsU291cmNlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5pc1JlYWR5VG9FeGVjdXRlID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5pc1BvcHVsYXRlZEV4dGVybmFsbHkoKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5oYXNDaGFuZ2VzKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmhhc0NoYW5nZXMgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBoYXNDaGFuZ2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgaGFzQ2hhbmdlc09ic2VydmFibGVzKCkuc29tZShmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0oKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhhc0NoYW5nZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGhhc0NoYW5nZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5mYWlsZWRDYWxsYmFja3MgPSBbXTtcclxuICAgICAgICB0aGlzLnN1Y2NlZWRlZENhbGxiYWNrcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuY29tcGxldGVkQ2FsbGJhY2tzID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuY29tbWFuZENvb3JkaW5hdG9yID0gY29tbWFuZENvb3JkaW5hdG9yO1xyXG4gICAgICAgIHRoaXMuY29tbWFuZFZhbGlkYXRpb25TZXJ2aWNlID0gY29tbWFuZFZhbGlkYXRpb25TZXJ2aWNlO1xyXG4gICAgICAgIHRoaXMuY29tbWFuZFNlY3VyaXR5U2VydmljZSA9IGNvbW1hbmRTZWN1cml0eVNlcnZpY2U7XHJcblxyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgYmVmb3JlRXhlY3V0ZTogZnVuY3Rpb24gKCkgeyB9LFxyXG4gICAgICAgICAgICBmYWlsZWQ6IGZ1bmN0aW9uICgpIHsgfSxcclxuICAgICAgICAgICAgc3VjY2VlZGVkOiBmdW5jdGlvbiAoKSB7IH0sXHJcbiAgICAgICAgICAgIGNvbXBsZXRlZDogZnVuY3Rpb24gKCkgeyB9LFxyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7fVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZmFpbGVkID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHNlbGYuZmFpbGVkQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuc3VjY2VlZGVkID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc3VjY2VlZGVkQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuY29tcGxldGVkID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHNlbGYuY29tcGxldGVkQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNldE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgICAgICBCaWZyb3N0LmV4dGVuZChzZWxmLm9wdGlvbnMsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMubmFtZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2Ygb3B0aW9ucy5uYW1lID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLl9uYW1lID0gb3B0aW9ucy5uYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jb3B5UHJvcGVydGllc0Zyb21PcHRpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBzZWxmLnRhcmdldENvbW1hbmQub3B0aW9ucy5wcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBzZWxmLnRhcmdldENvbW1hbmQub3B0aW9ucy5wcm9wZXJ0aWVzW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgICAgIGlmICgha28uaXNPYnNlcnZhYmxlKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0ga28ub2JzZXJ2YWJsZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi50YXJnZXRDb21tYW5kW3Byb3BlcnR5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBzZWxmLnRhcmdldENvbW1hbmQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLnRhcmdldENvbW1hbmQuaGFzT3duUHJvcGVydHkocHJvcGVydHkpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgIShzZWxmLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2gocHJvcGVydHkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvcGVydGllcztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm1ha2VQcm9wZXJ0aWVzT2JzZXJ2YWJsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBzZWxmLmdldFByb3BlcnRpZXMoKTtcclxuICAgICAgICAgICAgcHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eVZhbHVlID0gc2VsZi50YXJnZXRDb21tYW5kW3Byb3BlcnR5XTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWtvLmlzT2JzZXJ2YWJsZShwcm9wZXJ0eVZhbHVlKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAodHlwZW9mIHByb3BlcnR5VmFsdWUgIT09IFwib2JqZWN0XCIgfHwgQmlmcm9zdC5pc0FycmF5KHByb3BlcnR5VmFsdWUpKSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHByb3BlcnR5VmFsdWUgIT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC5pc0FycmF5KHByb3BlcnR5VmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGtvLm9ic2VydmFibGVBcnJheShwcm9wZXJ0eVZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0ga28ub2JzZXJ2YWJsZShwcm9wZXJ0eVZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnRhcmdldENvbW1hbmRbcHJvcGVydHldID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmV4dGVuZFByb3BlcnRpZXNXaXRoSGFzQ2hhbmdlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBzZWxmLmdldFByb3BlcnRpZXMoKTtcclxuICAgICAgICAgICAgcHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlWYWx1ZSA9IHNlbGYudGFyZ2V0Q29tbWFuZFtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgICAgICBpZiAoa28uaXNPYnNlcnZhYmxlKHByb3BlcnR5VmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZS5leHRlbmQoeyBoYXNDaGFuZ2VzOiB7fSB9KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQocHJvcGVydHlWYWx1ZS5oYXNDaGFuZ2VzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNDaGFuZ2VzT2JzZXJ2YWJsZXMucHVzaChwcm9wZXJ0eVZhbHVlLmhhc0NoYW5nZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vbkJlZm9yZUV4ZWN1dGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYub3B0aW9ucy5iZWZvcmVFeGVjdXRlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vbkZhaWxlZCA9IGZ1bmN0aW9uIChjb21tYW5kUmVzdWx0KSB7XHJcbiAgICAgICAgICAgIHNlbGYub3B0aW9ucy5mYWlsZWQoY29tbWFuZFJlc3VsdCk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLmZhaWxlZENhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soY29tbWFuZFJlc3VsdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2V0SW5pdGlhbFZhbHVlc0ZvclByb3BlcnRpZXMgPSBmdW5jdGlvbiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gc2VsZi50YXJnZXRDb21tYW5kW3Byb3BlcnR5TmFtZV07XHJcbiAgICAgICAgICAgICAgICBpZiAoa28uaXNPYnNlcnZhYmxlKHByb3BlcnR5KSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGtvLmlzV3JpdGVhYmxlT2JzZXJ2YWJsZShwcm9wZXJ0eSkgJiZcclxuICAgICAgICAgICAgICAgICAgICBCaWZyb3N0LmlzRnVuY3Rpb24ocHJvcGVydHkuc2V0SW5pdGlhbFZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHByb3BlcnR5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkuc2V0SW5pdGlhbFZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsVmFsdWVzRnJvbUN1cnJlbnRWYWx1ZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gc2VsZi5nZXRQcm9wZXJ0aWVzKCk7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0SW5pdGlhbFZhbHVlc0ZvclByb3BlcnRpZXMocHJvcGVydGllcyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vblN1Y2NlZWRlZCA9IGZ1bmN0aW9uIChjb21tYW5kUmVzdWx0KSB7XHJcbiAgICAgICAgICAgIHNlbGYub3B0aW9ucy5zdWNjZWVkZWQoY29tbWFuZFJlc3VsdCk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnNldEluaXRpYWxWYWx1ZXNGcm9tQ3VycmVudFZhbHVlcygpO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5zdWNjZWVkZWRDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGNvbW1hbmRSZXN1bHQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9uQ29tcGxldGVkID0gZnVuY3Rpb24gKGNvbW1hbmRSZXN1bHQpIHtcclxuICAgICAgICAgICAgc2VsZi5vcHRpb25zLmNvbXBsZXRlZChjb21tYW5kUmVzdWx0KTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuY29tcGxldGVkQ2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhjb21tYW5kUmVzdWx0KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVDb21tYW5kUmVzdWx0ID0gZnVuY3Rpb24gKGNvbW1hbmRSZXN1bHQpIHtcclxuICAgICAgICAgICAgc2VsZi5pc0J1c3koZmFsc2UpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbW1hbmRSZXN1bHQuY29tbWFuZFZhbGlkYXRpb25NZXNzYWdlcyAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgc2VsZi52YWxpZGF0aW9uTWVzc2FnZXMoY29tbWFuZFJlc3VsdC5jb21tYW5kVmFsaWRhdGlvbk1lc3NhZ2VzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGNvbW1hbmRSZXN1bHQuc3VjY2VzcyA9PT0gZmFsc2UgfHwgY29tbWFuZFJlc3VsdC5pbnZhbGlkID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29tbWFuZFJlc3VsdC5pbnZhbGlkICYmIHR5cGVvZiBjb21tYW5kUmVzdWx0LnZhbGlkYXRpb25SZXN1bHRzICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb21tYW5kVmFsaWRhdGlvblNlcnZpY2UuYXBwbHlWYWxpZGF0aW9uUmVzdWx0VG9Qcm9wZXJ0aWVzKHNlbGYudGFyZ2V0Q29tbWFuZCwgY29tbWFuZFJlc3VsdC52YWxpZGF0aW9uUmVzdWx0cyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzZWxmLm9uRmFpbGVkKGNvbW1hbmRSZXN1bHQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vblN1Y2NlZWRlZChjb21tYW5kUmVzdWx0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZWxmLm9uQ29tcGxldGVkKGNvbW1hbmRSZXN1bHQpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0Q29tbWFuZFJlc3VsdEZyb21WYWxpZGF0aW9uUmVzdWx0ID0gZnVuY3Rpb24gKHZhbGlkYXRpb25SZXN1bHQpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IEJpZnJvc3QuY29tbWFuZHMuQ29tbWFuZFJlc3VsdC5jcmVhdGUoKTtcclxuICAgICAgICAgICAgcmVzdWx0LmludmFsaWQgPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZXhlY3V0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2VsZi5pc0J1c3kodHJ1ZSk7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLm9uQmVmb3JlRXhlY3V0ZSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbGlkYXRpb25SZXN1bHQgPSBzZWxmLmNvbW1hbmRWYWxpZGF0aW9uU2VydmljZS52YWxpZGF0ZSh0aGlzKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0aW9uUmVzdWx0LnZhbGlkID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29tbWFuZENvb3JkaW5hdG9yLmhhbmRsZShzZWxmLnRhcmdldENvbW1hbmQpLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoY29tbWFuZFJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oYW5kbGVDb21tYW5kUmVzdWx0KGNvbW1hbmRSZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbW1hbmRSZXN1bHQgPSBzZWxmLmdldENvbW1hbmRSZXN1bHRGcm9tVmFsaWRhdGlvblJlc3VsdCh2YWxpZGF0aW9uUmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmhhbmRsZUNvbW1hbmRSZXN1bHQoY29tbWFuZFJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmlzQnVzeShmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnBvcHVsYXRlZEV4dGVybmFsbHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYuaXNQb3B1bGF0ZWRFeHRlcm5hbGx5KHRydWUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucG9wdWxhdGVGcm9tRXh0ZXJuYWxTb3VyY2UgPSBmdW5jdGlvbiAodmFsdWVzKSB7XHJcbiAgICAgICAgICAgIHNlbGYuaXNQb3B1bGF0ZWRFeHRlcm5hbGx5KHRydWUpO1xyXG4gICAgICAgICAgICBzZWxmLnNldFByb3BlcnR5VmFsdWVzRnJvbSh2YWx1ZXMpO1xyXG4gICAgICAgICAgICBzZWxmLnBvcHVsYXRlZEZyb21FeHRlcm5hbFNvdXJjZSh0cnVlKTtcclxuICAgICAgICAgICAgY29tbWFuZFZhbGlkYXRpb25TZXJ2aWNlLmNsZWFyVmFsaWRhdGlvbk1lc3NhZ2VzRm9yKHNlbGYudGFyZ2V0Q29tbWFuZCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRQcm9wZXJ0eVZhbHVlc0Zyb20gPSBmdW5jdGlvbiAodmFsdWVzKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXBwZWRQcm9wZXJ0aWVzID0gbWFwcGVyLm1hcFRvSW5zdGFuY2Uoc2VsZi50YXJnZXRDb21tYW5kLl90eXBlLCB2YWx1ZXMsIHNlbGYudGFyZ2V0Q29tbWFuZCk7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0SW5pdGlhbFZhbHVlc0ZvclByb3BlcnRpZXMobWFwcGVkUHJvcGVydGllcyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vbkNyZWF0ZWQgPSBmdW5jdGlvbiAobGFzdERlc2NlbmRhbnQpIHtcclxuICAgICAgICAgICAgc2VsZi50YXJnZXRDb21tYW5kID0gbGFzdERlc2NlbmRhbnQ7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb3B5UHJvcGVydGllc0Zyb21PcHRpb25zKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5tYWtlUHJvcGVydGllc09ic2VydmFibGUoKTtcclxuICAgICAgICAgICAgdGhpcy5leHRlbmRQcm9wZXJ0aWVzV2l0aEhhc0NoYW5nZXMoKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBsYXN0RGVzY2VuZGFudC5fbmFtZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBsYXN0RGVzY2VuZGFudC5fbmFtZSAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZFZhbGlkYXRpb25TZXJ2aWNlLmV4dGVuZFByb3BlcnRpZXNXaXRob3V0VmFsaWRhdGlvbihsYXN0RGVzY2VuZGFudCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsaWRhdG9ycyA9IGNvbW1hbmRWYWxpZGF0aW9uU2VydmljZS5nZXRWYWxpZGF0b3JzRm9yKGxhc3REZXNjZW5kYW50KTtcclxuICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzQXJyYXkodmFsaWRhdG9ycykgJiYgdmFsaWRhdG9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi52YWxpZGF0b3JzKHZhbGlkYXRvcnMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29tbWFuZFZhbGlkYXRpb25TZXJ2aWNlLnZhbGlkYXRlU2lsZW50bHkodGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbW1hbmRTZWN1cml0eVNlcnZpY2UuZ2V0Q29udGV4dEZvcihsYXN0RGVzY2VuZGFudCkuY29udGludWVXaXRoKGZ1bmN0aW9uIChzZWN1cml0eUNvbnRleHQpIHtcclxuICAgICAgICAgICAgICAgIGxhc3REZXNjZW5kYW50LnNlY3VyaXR5Q29udGV4dChzZWN1cml0eUNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChrby5pc09ic2VydmFibGUoc2VjdXJpdHlDb250ZXh0LmlzQXV0aG9yaXplZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsYXN0RGVzY2VuZGFudC5pc0F1dGhvcml6ZWQoc2VjdXJpdHlDb250ZXh0LmlzQXV0aG9yaXplZCgpKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWN1cml0eUNvbnRleHQuaXNBdXRob3JpemVkLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdERlc2NlbmRhbnQuaXNBdXRob3JpemVkKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5jb21tYW5kc1wiKTtcclxuQmlmcm9zdC5jb21tYW5kcy5Db21tYW5kRGVzY3JpcHRvciA9IGZ1bmN0aW9uKGNvbW1hbmQpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICB2YXIgYnVpbHRJbkNvbW1hbmQgPSB7fTtcclxuICAgIGlmICh0eXBlb2YgQmlmcm9zdC5jb21tYW5kcy5Db21tYW5kICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgYnVpbHRJbkNvbW1hbmQgPSBCaWZyb3N0LmNvbW1hbmRzLkNvbW1hbmQuY3JlYXRlKHtcclxuICAgICAgICAgICAgcmVnaW9uOiB7IGNvbW1hbmRzOiBbXSB9LFxyXG4gICAgICAgICAgICBjb21tYW5kQ29vcmRpbmF0b3I6IHt9LFxyXG4gICAgICAgICAgICBjb21tYW5kVmFsaWRhdGlvblNlcnZpY2U6IHt9LFxyXG4gICAgICAgICAgICBjb21tYW5kU2VjdXJpdHlTZXJ2aWNlOiB7IGdldENvbnRleHRGb3I6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHsgY29udGludWVXaXRoOiBmdW5jdGlvbiAoKSB7IH0gfTsgfSB9LFxyXG4gICAgICAgICAgICBtYXBwZXI6IHt9LFxyXG4gICAgICAgICAgICBvcHRpb25zOiB7fVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNob3VsZFNraXBQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5KSB7XHJcbiAgICAgICAgaWYgKCF0YXJnZXQuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYnVpbHRJbkNvbW1hbmQuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoa28uaXNPYnNlcnZhYmxlKHRhcmdldFtwcm9wZXJ0eV0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXRbcHJvcGVydHldID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gXCJfdHlwZVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocHJvcGVydHkgPT09IFwiX25hbWVzcGFjZVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFByb3BlcnRpZXNGcm9tQ29tbWFuZChjb21tYW5kKSB7XHJcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB7fTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gY29tbWFuZCkge1xyXG4gICAgICAgICAgICBpZiAoIXNob3VsZFNraXBQcm9wZXJ0eShjb21tYW5kLCBwcm9wZXJ0eSkgKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzW3Byb3BlcnR5XSA9IGNvbW1hbmRbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwcm9wZXJ0aWVzO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubmFtZSA9IGNvbW1hbmQuX25hbWU7XHJcbiAgICB0aGlzLmdlbmVyYXRlZEZyb20gPSBjb21tYW5kLl9nZW5lcmF0ZWRGcm9tO1xyXG4gICAgdGhpcy5pZCA9IEJpZnJvc3QuR3VpZC5jcmVhdGUoKTtcclxuXHJcbiAgICB2YXIgcHJvcGVydGllcyA9IGdldFByb3BlcnRpZXNGcm9tQ29tbWFuZChjb21tYW5kKTtcclxuICAgIHZhciBjb21tYW5kQ29udGVudCA9IGtvLnRvSlMocHJvcGVydGllcyk7XHJcbiAgICBjb21tYW5kQ29udGVudC5JZCA9IEJpZnJvc3QuR3VpZC5jcmVhdGUoKTtcclxuICAgIHRoaXMuY29tbWFuZCA9IGtvLnRvSlNPTihjb21tYW5kQ29udGVudCk7XHJcbn07XHJcblxyXG5cclxuQmlmcm9zdC5jb21tYW5kcy5Db21tYW5kRGVzY3JpcHRvci5jcmVhdGVGcm9tID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgIHZhciBjb21tYW5kRGVzY3JpcHRvciA9IG5ldyBCaWZyb3N0LmNvbW1hbmRzLkNvbW1hbmREZXNjcmlwdG9yKGNvbW1hbmQpO1xyXG4gICAgcmV0dXJuIGNvbW1hbmREZXNjcmlwdG9yO1xyXG59O1xyXG5cclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmNvbW1hbmRzXCIpO1xyXG5CaWZyb3N0LmNvbW1hbmRzLkNvbW1hbmRSZXN1bHQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gQ29tbWFuZFJlc3VsdChleGlzdGluZykge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmlzRW1wdHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmNvbW1hbmRJZCA9PT0gQmlmcm9zdC5HdWlkLmVtcHR5O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY29tbWFuZE5hbWUgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuY29tbWFuZElkID0gQmlmcm9zdC5HdWlkLmVtcHR5O1xyXG4gICAgICAgIHRoaXMudmFsaWRhdGlvblJlc3VsdHMgPSBbXTtcclxuICAgICAgICB0aGlzLnN1Y2Nlc3MgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuaW52YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucGFzc2VkU2VjdXJpdHkgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZXhjZXB0aW9uID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuZXhjZXB0aW9uTWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5jb21tYW5kVmFsaWRhdGlvbk1lc3NhZ2VzID0gW107XHJcbiAgICAgICAgdGhpcy5zZWN1cml0eU1lc3NhZ2VzID0gW107XHJcbiAgICAgICAgdGhpcy5hbGxWYWxpZGF0aW9uTWVzc2FnZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmRldGFpbHMgPSBcIlwiO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGV4aXN0aW5nICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIEJpZnJvc3QuZXh0ZW5kKHRoaXMsIGV4aXN0aW5nKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgY29tbWFuZFJlc3VsdCA9IG5ldyBDb21tYW5kUmVzdWx0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21tYW5kUmVzdWx0O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY3JlYXRlRnJvbTogZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICB2YXIgZXhpc3RpbmcgPSB0eXBlb2YgcmVzdWx0ID09PSBcInN0cmluZ1wiID8gSlNPTi5wYXJzZShyZXN1bHQpIDogcmVzdWx0O1xyXG4gICAgICAgICAgICB2YXIgY29tbWFuZFJlc3VsdCA9IG5ldyBDb21tYW5kUmVzdWx0KGV4aXN0aW5nKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbW1hbmRSZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSkoKTsiLCJCaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlcnMuY29tbWFuZCA9IHtcclxuICAgIGNhblJlc29sdmU6IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGNvbW1hbmRzICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lIGluIGNvbW1hbmRzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc29sdmU6IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gY29tbWFuZHNbbmFtZV0uY3JlYXRlKCk7XHJcbiAgICB9XHJcbn07IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmNvbW1hbmRzXCIsIHtcclxuICAgIENvbW1hbmRTZWN1cml0eUNvbnRleHQ6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuaXNBdXRob3JpemVkID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuY29tbWFuZHNcIiwge1xyXG4gICAgY29tbWFuZFNlY3VyaXR5Q29udGV4dEZhY3Rvcnk6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBCaWZyb3N0LmNvbW1hbmRzLkNvbW1hbmRTZWN1cml0eUNvbnRleHQuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZXh0O1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuY29tbWFuZHNcIiwge1xyXG4gICAgY29tbWFuZFNlY3VyaXR5U2VydmljZTogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKGNvbW1hbmRTZWN1cml0eUNvbnRleHRGYWN0b3J5KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmNvbW1hbmRTZWN1cml0eUNvbnRleHRGYWN0b3J5ID0gY29tbWFuZFNlY3VyaXR5Q29udGV4dEZhY3Rvcnk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFR5cGVOYW1lRm9yKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbW1hbmQuX3R5cGUuX25hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRTZWN1cml0eUNvbnRleHROYW1lRm9yKHR5cGUpIHtcclxuICAgICAgICAgICAgdmFyIHNlY3VyaXR5Q29udGV4dE5hbWUgPSB0eXBlICsgXCJTZWN1cml0eUNvbnRleHRcIjtcclxuICAgICAgICAgICAgcmV0dXJuIHNlY3VyaXR5Q29udGV4dE5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBoYXNTZWN1cml0eUNvbnRleHRJbk5hbWVzcGFjZUZvcih0eXBlLCBuYW1lc3BhY2UpIHtcclxuICAgICAgICAgICAgdmFyIHNlY3VyaXR5Q29udGV4dE5hbWUgPSBnZXRTZWN1cml0eUNvbnRleHROYW1lRm9yKHR5cGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoc2VjdXJpdHlDb250ZXh0TmFtZSkgJiZcclxuICAgICAgICAgICAgICAgICFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKG5hbWVzcGFjZSkgJiZcclxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZS5oYXNPd25Qcm9wZXJ0eShzZWN1cml0eUNvbnRleHROYW1lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFNlY3VyaXR5Q29udGV4dEluTmFtZXNwYWNlRm9yKHR5cGUsIG5hbWVzcGFjZSkge1xyXG4gICAgICAgICAgICB2YXIgc2VjdXJpdHlDb250ZXh0TmFtZSA9IGdldFNlY3VyaXR5Q29udGV4dE5hbWVGb3IodHlwZSwgbmFtZXNwYWNlKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5hbWVzcGFjZVtzZWN1cml0eUNvbnRleHROYW1lXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0Q29udGV4dEZvciA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgdmFyIGNvbnRleHQ7XHJcblxyXG4gICAgICAgICAgICB2YXIgdHlwZSA9IGdldFR5cGVOYW1lRm9yKGNvbW1hbmQpO1xyXG4gICAgICAgICAgICBpZiAoaGFzU2VjdXJpdHlDb250ZXh0SW5OYW1lc3BhY2VGb3IodHlwZSwgY29tbWFuZC5fdHlwZS5fbmFtZXNwYWNlKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbnRleHRUeXBlID0gZ2V0U2VjdXJpdHlDb250ZXh0SW5OYW1lc3BhY2VGb3IodHlwZSwgY29tbWFuZC5fdHlwZS5fbmFtZXNwYWNlKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQgPSBjb250ZXh0VHlwZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGNvbnRleHQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29udGV4dCA9IHNlbGYuY29tbWFuZFNlY3VyaXR5Q29udGV4dEZhY3RvcnkuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChjb21tYW5kLl9nZW5lcmF0ZWRGcm9tKSB8fCBjb21tYW5kLl9nZW5lcmF0ZWRGcm9tID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB1cmwgPSBcIi9CaWZyb3N0L0NvbW1hbmRTZWN1cml0eS9HZXRGb3JDb21tYW5kP2NvbW1hbmROYW1lPVwiICsgY29tbWFuZC5fZ2VuZXJhdGVkRnJvbTtcclxuICAgICAgICAgICAgICAgICAgICAkLmdldEpTT04odXJsLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmlzQXV0aG9yaXplZChlLmlzQXV0aG9yaXplZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldENvbnRleHRGb3JUeXBlID0gZnVuY3Rpb24gKGNvbW1hbmRUeXBlKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgdmFyIGNvbnRleHQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoaGFzU2VjdXJpdHlDb250ZXh0SW5OYW1lc3BhY2VGb3IoY29tbWFuZFR5cGUuX25hbWUsIGNvbW1hbmRUeXBlLl9uYW1lc3BhY2UpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29udGV4dFR5cGUgPSBnZXRTZWN1cml0eUNvbnRleHRJbk5hbWVzcGFjZUZvcihjb21tYW5kVHlwZS5fbmFtZSwgY29tbWFuZFR5cGUuX25hbWVzcGFjZSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0ID0gY29udGV4dFR5cGUuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChjb250ZXh0KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQgPSBCaWZyb3N0LmNvbW1hbmRzLkNvbW1hbmRTZWN1cml0eUNvbnRleHQuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmlzQXV0aG9yaXplZCh0cnVlKTtcclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGNvbnRleHQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIudHlwZXMuY29tbWFuZFNlY3VyaXR5U2VydmljZSA9IEJpZnJvc3QuY29tbWFuZHMuY29tbWFuZFNlY3VyaXR5U2VydmljZTsiLCJrby5leHRlbmRlcnMuaGFzQ2hhbmdlcyA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuICAgIHRhcmdldC5faW5pdGlhbFZhbHVlU2V0ID0gZmFsc2U7XHJcbiAgICB0YXJnZXQuaGFzQ2hhbmdlcyA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG4gICAgZnVuY3Rpb24gdXBkYXRlSGFzQ2hhbmdlcygpIHtcclxuICAgICAgICBpZiAodGFyZ2V0Ll9pbml0aWFsVmFsdWVTZXQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHRhcmdldC5oYXNDaGFuZ2VzKGZhbHNlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc0FycmF5KHRhcmdldC5faW5pdGlhbFZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0Lmhhc0NoYW5nZXMoIXRhcmdldC5faW5pdGlhbFZhbHVlLnNoYWxsb3dFcXVhbHModGFyZ2V0KCkpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0YXJnZXQuaGFzQ2hhbmdlcyh0YXJnZXQuX2luaXRpYWxWYWx1ZSAhPT0gdGFyZ2V0KCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0YXJnZXQuc3Vic2NyaWJlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB1cGRhdGVIYXNDaGFuZ2VzKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0YXJnZXQuc2V0SW5pdGlhbFZhbHVlID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdmFyIGluaXRpYWxWYWx1ZTtcclxuICAgICAgICBpZiAoQmlmcm9zdC5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgICBpbml0aWFsVmFsdWUgPSB2YWx1ZS5jbG9uZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGluaXRpYWxWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGFyZ2V0Ll9pbml0aWFsVmFsdWUgPSBpbml0aWFsVmFsdWU7XHJcbiAgICAgICAgdGFyZ2V0Ll9pbml0aWFsVmFsdWVTZXQgPSB0cnVlO1xyXG4gICAgICAgIHVwZGF0ZUhhc0NoYW5nZXMoKTtcclxuICAgIH07XHJcbn07IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmNvbW1hbmRzXCIsIHtcclxuICAgIGNvbW1hbmRFdmVudHM6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnN1Y2NlZWRlZCA9IEJpZnJvc3QuRXZlbnQuY3JlYXRlKCk7XHJcbiAgICAgICAgdGhpcy5mYWlsZWQgPSBCaWZyb3N0LkV2ZW50LmNyZWF0ZSgpO1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmludGVyYWN0aW9uXCIsIHtcclxuICAgIE9wZXJhdGlvbjogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAocmVnaW9uLCBjb250ZXh0KSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PkRlZmluZXMgYW4gb3BlcmF0aW9uIHRoYXQgYmUgcGVyZm9ybWVkPC9zdW1tYXJ5PlxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY2FuUGVyZm9ybU9ic2VydmFibGVzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgdmFyIGludGVybmFsQ2FuUGVyZm9ybSA9IGtvLm9ic2VydmFibGUodHJ1ZSk7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImNvbnRleHRcIiB0eXBlPVwiQmlmcm9zdC5pbnRlcmFjdGlvbi5PcGVyYXRpb25cIj5Db250ZXh0IGluIHdoaWNoIHRoZSBvcGVyYXRpb24gZXhpc3RzIGluPC9maWVsZD5cclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJpZGVudGlmaWVyXCIgdHlwZT1cIkJpZnJvc3QuR3VpZFwiPlVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgb3BlcmF0aW9uIGluc3RhbmNlPGZpZWxkPlxyXG4gICAgICAgIHRoaXMuaWRlbnRpZmllciA9IEJpZnJvc3QuR3VpZC5lbXB0eTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwicmVnaW9uXCIgdHlwZT1cIkJpZnJvc3Qudmlld3MuUmVnaW9uXCI+UmVnaW9uIHRoYXQgdGhlIG9wZXJhdGlvbiB3YXMgY3JlYXRlZCBpbjwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5yZWdpb24gPSByZWdpb247XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImNhblBlcmZvcm1cIiB0eXBlPVwib2JzZXJ2YWJsZVwiPlNldCB0byB0cnVlIGlmIHRoZSBvcGVyYXRpb24gY2FuIGJlIHBlcmZvcm1lZCwgZmFsc2UgaWYgbm90PC9maWVsZD5cclxuICAgICAgICB0aGlzLmNhblBlcmZvcm0gPSBrby5jb21wdXRlZCh7XHJcbiAgICAgICAgICAgIHJlYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjYW5QZXJmb3JtT2JzZXJ2YWJsZXMoKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY2FuUGVyZm9ybSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBjYW5QZXJmb3JtT2JzZXJ2YWJsZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChvYnNlcnZhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9ic2VydmFibGUoKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuUGVyZm9ybSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhblBlcmZvcm07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHdyaXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGludGVybmFsQ2FuUGVyZm9ybSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jYW5QZXJmb3JtLndoZW4gPSBmdW5jdGlvbiAob2JzZXJ2YWJsZSkge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+Q2hhaW5hYmxlIGNsYXVzZXM8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cIm9ic2VydmFibGVcIiB0eXBlPVwib2JzZXJ2YWJsZVwiPlRoZSBvYnNlcnZhYmxlIHRvIHVzZSBmb3IgZGVjaWRpbmcgd2V0aGVyIG9yIG5vdCB0aGUgb3BlcmF0aW9uIGNhbiBwZXJmb3JtPC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxyZXR1cm5zPlRoZSBjYW5QZXJmb3JtIHRoYXQgY2FuIGJlIGZ1cnRoZXIgY2hhaW5lZDwvcmV0dXJucz5cclxuICAgICAgICAgICAgY2FuUGVyZm9ybU9ic2VydmFibGVzLnB1c2gob2JzZXJ2YWJsZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmNhblBlcmZvcm07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jYW5QZXJmb3JtLndoZW4oaW50ZXJuYWxDYW5QZXJmb3JtKTtcclxuXHJcbiAgICAgICAgdGhpcy5wZXJmb3JtID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+RnVuY3Rpb24gdGhhdCBnZXRzIGNhbGxlZCB3aGVuIGFuIG9wZXJhdGlvbiBnZXRzIHBlcmZvcm1lZDwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxyZXR1cm5zPlN0YXRlIGNoYW5nZSwgaWYgYW55IC0gdHlwaWNhbGx5IGhlbHBmdWwgd2hlbiB1bmRvaW5nPC9yZXR1cm5zPlxyXG4gICAgICAgICAgICByZXR1cm4ge307XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy51bmRvID0gZnVuY3Rpb24gKHN0YXRlKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5GdW5jdGlvbiB0aGF0IGdldHMgY2FsbGVkIHdoZW4gYW4gb3BlcmF0aW9uIGdldHMgdW5kb2VkPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJzdGF0ZVwiIHR5cGU9XCJvYmplY3RcIj5TdGF0ZSBnZW5lcmF0ZWQgd2hlbiB0aGUgb3BlcmF0aW9uIHdhcyBwZXJmb3JtZWQ8L3BhcmFtPlxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW50ZXJhY3Rpb25cIiwge1xyXG4gICAgT3BlcmF0aW9uQ29udGV4dDogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PkRlZmluZXMgdGhlIGNvbnRleHQgaW4gd2hpY2ggYW4gb3BlcmF0aW9uIGlzIGJlaW5nIHBlcmZvcm1lZCBvciB1bmRvZWQgd2l0aGluPC9zdW1tYXJ5PlxyXG5cclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5pbnRlcmFjdGlvblwiLCB7XHJcbiAgICBPcGVyYXRpb25FbnRyeTogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAob3BlcmF0aW9uLCBzdGF0ZSkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGFuIGVudHJ5IGZvciBhbiBvcGVyYXRpb24gaW4gYSBzcGVjaWZpYyBjb250ZXh0IHdpdGggcmVzdWx0aW5nIHN0YXRlPC9zdW1tYXJ5PlxyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJvcGVyYXRpb25cIiB0eXBlPVwiQmlmcm9zdC5pbnRlcmFjdGlvbi5PcGVyYXRpb25cIj5PcGVyYXRpb24gdGhhdCB3YXMgcGVyZm9ybWVkPC9maWVsZD5cclxuICAgICAgICB0aGlzLm9wZXJhdGlvbiA9IG9wZXJhdGlvbjtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwic3RhdGVcIiB0eXBlPVwib2JqZWN0XCI+U3RhdGUgdGhhdCBvcGVyYXRpb24gZ2VuZXJhdGVkPC9maWVsZD5cclxuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW50ZXJhY3Rpb25cIiwge1xyXG4gICAgb3BlcmF0aW9uRW50cnlGYWN0b3J5OiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSBmYWN0b3J5IHRoYXQgY2FuIGNyZWF0ZSBPcGVyYXRpb25FbnRyaWVzPC9zdW1tYXJ5PlxyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uIChvcGVyYXRpb24sIHN0YXRlKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtYXJ5PkNyZWF0ZSBhbiBpbnN0YW5jZSBvZiBhIE9wZXJhdGlvbkVudHJ5PC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJjb250ZXh0XCIgdHlwZT1cIkJpZnJvc3QuaW50ZXJhY3Rpb24uT3BlcmF0aW9uQ29udGV4dFwiPkNvbnRleHQgdGhlIG9wZXJhdGlvbiB3YXMgcGVyZm9ybWVkIGluPC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwib3BlcmF0aW9uXCIgdHlwZT1cIkJpZnJvc3QuaW50ZXJhY3Rpb24uT3BlcmF0aW9uXCI+T3BlcmF0aW9uIHRoYXQgd2FzIHBlcmZvcm1lZDwvcGFyYW0+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cInN0YXRlXCIgdHlwZT1cIm9iamVjdFwiPlN0YXRlIHRoYXQgb3BlcmF0aW9uIGdlbmVyYXRlZDwvcGFyYW0+XHJcbiAgICAgICAgICAgIC8vLyA8cmV0dXJucz5BbiBPcGVyYXRpb25FbnRyeTwvcmV0dXJucz5cclxuXHJcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IEJpZnJvc3QuaW50ZXJhY3Rpb24uT3BlcmF0aW9uRW50cnkuY3JlYXRlKHtcclxuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogb3BlcmF0aW9uLFxyXG4gICAgICAgICAgICAgICAgc3RhdGU6IHN0YXRlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5pbnRlcmFjdGlvblwiLCB7XHJcbiAgICBPcGVyYXRpb25zOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uIChvcGVyYXRpb25FbnRyeUZhY3RvcnkpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyBhIHN0YWNrIG9mIG9wZXJhdGlvbnMgYW5kIHRoZSBhYmlsaXR5IHRvIHBlcmZvcm0gYW5kIHB1dCBvcGVyYXRpb25zIG9uIHRoZSBzdGFjazwvc3VtbWFyeT5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImFsbFwiIHR5cGU9XCJvYnNlcnZhYmxlQXJyYXlcIj5Ib2xkcyBhbGwgb3BlcmF0aW9uczwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5hbGwgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwic3RhdGVmdWxcIiB0eXBlPVwib2JzZXJ2YWJsZUFycmF5XCI+SG9sZHMgYWxsIG9wZXJhdGlvbnMgdGhhdCBhcmUgc3RhdGVmdWwgLSBtZWFuaW5nIHRoYXQgdGhleSBwcm9kdWNlIHN0YXRlIGZyb20gYmVpbmcgcGVyZm9ybWVkPC9maWVsZD5cclxuICAgICAgICB0aGlzLnN0YXRlZnVsID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgZW50cmllcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5hbGwoKS5mb3JFYWNoKGZ1bmN0aW9uIChlbnRyeSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmFyZUVxdWFsKGVudHJ5LnN0YXRlLCB7fSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbnRyaWVzLnB1c2goZW50cnkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBlbnRyaWVzO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmdldEJ5SWRlbnRpZmllciA9IGZ1bmN0aW9uIChpZGVudGlmaWVyKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5HZXQgYW4gb3BlcmF0aW9uIGJ5IGl0cyBpZGVudGlmaWVyPC9pZGVudGlmaWVyPlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJpZGVudGlmaWVyXCIgdHlwZT1cIkJpZnJvc3QuR3VpZFwiPklkZW50aWZpZXIgb2YgdGhlIG9wZXJhdGlvbiB0byBnZXQ8cGFyYW0+XHJcbiAgICAgICAgICAgIC8vLyA8cmV0dXJucz5BbiBpbnN0YW5jZSBvZiB0aGUgb3BlcmF0aW9uIGlmIGZvdW5kLCBudWxsIGlmIG5vdCBmb3VuZDwvcmV0dXJucz5cclxuXHJcbiAgICAgICAgICAgIHZhciBmb3VuZCA9IG51bGw7XHJcbiAgICAgICAgICAgIHNlbGYuYWxsKCkuZm9yRWFjaChmdW5jdGlvbiAob3BlcmF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9uLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IG9wZXJhdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZvdW5kO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucGVyZm9ybSA9IGZ1bmN0aW9uIChvcGVyYXRpb24pIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PlBlcmZvcm0gYW4gb3BlcmF0aW9uIGluIGEgZ2l2ZW4gY29udGV4dDwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiY29udGV4dFwiIHR5cGU9XCJCaWZyb3N0LmludGVyYWN0aW9uLk9wZXJhdGlvbkNvbnRleHRcIj5Db250ZXh0IGluIHdoaWNoIHRoZSBvcGVyYXRpb24gaXMgYmVpbmcgcGVyZm9ybWVkIGluPC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwib3BlcmF0aW9uXCIgdHlwZT1cIkJpZnJvc3QuaW50ZXJhY3Rpb24uT3BlcmF0aW9uXCI+T3BlcmF0aW9uIHRvIHBlcmZvcm08L3BhcmFtPlxyXG5cclxuICAgICAgICAgICAgaWYgKG9wZXJhdGlvbi5jYW5QZXJmb3JtKCkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IG9wZXJhdGlvbi5wZXJmb3JtKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZW50cnkgPSBvcGVyYXRpb25FbnRyeUZhY3RvcnkuY3JlYXRlKG9wZXJhdGlvbiwgc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5hbGwucHVzaChlbnRyeSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnVuZG8gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5VbmRvIHRoZSBsYXN0IG9wZXJhdGlvbiBvbiB0aGUgc3RhY2sgYW5kIHJlbW92ZSBpdCBhcyBhbiBvcGVyYXRpb248L3N1bW1hcnk+XHJcblxyXG4gICAgICAgICAgICB0aHJvdyBcIk5vdCBpbXBsZW1lbnRlZFwiO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW50ZXJhY3Rpb25cIiwge1xyXG4gICAgb3BlcmF0aW9uc0ZhY3Rvcnk6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG9wZXJhdGlvbnMgPSBCaWZyb3N0LmludGVyYWN0aW9uLk9wZXJhdGlvbnMuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBvcGVyYXRpb25zO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy5vcGVyYXRpb25zRmFjdG9yeSA9IEJpZnJvc3QuaW50ZXJhY3Rpb24ub3BlcmF0aW9uc0ZhY3Rvcnk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmludGVyYWN0aW9uXCIsIHtcclxuICAgIENvbW1hbmRPcGVyYXRpb246IEJpZnJvc3QuaW50ZXJhY3Rpb24uT3BlcmF0aW9uLmV4dGVuZChmdW5jdGlvbiAoY29tbWFuZFNlY3VyaXR5U2VydmljZSkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGFuIG9wZXJhdGlvbiB0aGF0IHJlc3VsdCBpbiBhIGNvbW1hbmQ8L3N1bW1hcnk+XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJjb21tYW5kVHlwZVwiIHR5cGU9XCJCaWZyb3N0LlR5cGVcIj5UeXBlIG9mIGNvbW1hbmQgdG8gY3JlYXRlPC9maWVsZD5cclxuICAgICAgICB0aGlzLmNvbW1hbmRUeXBlID0ga28ub2JzZXJ2YWJsZSgpO1xyXG5cclxuICAgICAgICAvLyA8ZmllbGQgbmFtZT1cImlzQXV0aG9yaXphZWRcIiB0eXBlPVwib2JzZXJ2YWJsZVwiPkhvbGRzIGEgYm9vbGVhbjsgdHJ1ZSBpZiBhdXRob3JpemVkIC8gZmFsc2UgaWYgbm90PC9maWVsZD5cclxuICAgICAgICB0aGlzLmlzQXV0aG9yaXplZCA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG5cclxuICAgICAgICAvLyA8ZmllbGQgbmFtZT1cImNvbW1hbmRDcmVhdGVkXCIgdHlwZT1cIkJpZnJvc3QuRXZlbnRcIj5FdmVudCB0aGF0IGdldHMgdHJpZ2dlcmVkIHdoZW4gY29tbWFuZCBpcyBjcmVhdGVkPC9maWVsZD5cclxuICAgICAgICB0aGlzLmNvbW1hbmRDcmVhdGVkID0gQmlmcm9zdC5FdmVudC5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jYW5QZXJmb3JtLndoZW4odGhpcy5pc0F1dGhvcml6ZWQpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbW1hbmRUeXBlLnN1YnNjcmliZShmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgICAgICBjb21tYW5kU2VjdXJpdHlTZXJ2aWNlLmdldENvbnRleHRGb3JUeXBlKHR5cGUpLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGNvbnRleHQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pc0F1dGhvcml6ZWQoY29udGV4dC5pc0F1dGhvcml6ZWQoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZUNvbW1hbmRPZlR5cGUgPSBmdW5jdGlvbiAoY29tbWFuZFR5cGUpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkNyZWF0ZSBhbiBpbnN0YW5jZSBvZiBhIGdpdmVuIGNvbW1hbmQgdHlwZTwvc3VtbWFyeT5cclxuICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gY29tbWFuZFR5cGUuY3JlYXRlKHtcclxuICAgICAgICAgICAgICAgIHJlZ2lvbjogc2VsZi5yZWdpb25cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLmNvbW1hbmRDcmVhdGVkLnRyaWdnZXIoaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW50ZXJhY3Rpb25cIiwge1xyXG4gICAgQWN0aW9uOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnBlcmZvcm0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5pbnRlcmFjdGlvblwiLCB7XHJcbiAgICBUcmlnZ2VyOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuYWN0aW9ucyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmFkZEFjdGlvbiA9IGZ1bmN0aW9uIChhY3Rpb24pIHtcclxuICAgICAgICAgICAgc2VsZi5hY3Rpb25zLnB1c2goYWN0aW9uKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2lnbmFsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZWxmLmFjdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoYWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBhY3Rpb24ucGVyZm9ybSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmludGVyYWN0aW9uXCIsIHtcclxuICAgIEV2ZW50VHJpZ2dlcjogQmlmcm9zdC5pbnRlcmFjdGlvbi5UcmlnZ2VyLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmV2ZW50TmFtZSA9IG51bGw7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRocm93SWZFdmVudE5hbWVJc05vdFNldCh0cmlnZ2VyKSB7XHJcbiAgICAgICAgICAgIGlmICghdHJpZ2dlci5ldmVudE5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwiRXZlbnROYW1lIGlzIG5vdCBzZXQgZm9yIHRyaWdnZXJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGhyb3dJZkV2ZW50TmFtZUlzTm90U2V0KHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFjdHVhbEV2ZW50TmFtZSA9IFwib25cIiArIHNlbGYuZXZlbnROYW1lO1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudFthY3R1YWxFdmVudE5hbWVdID09IG51bGwgfHwgdHlwZW9mIGVsZW1lbnRbYWN0dWFsRXZlbnROYW1lXSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb3JpZ2luYWxFdmVudEhhbmRsZXIgPSBlbGVtZW50W2FjdHVhbEV2ZW50TmFtZV07XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50W2FjdHVhbEV2ZW50TmFtZV0gPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcmlnaW5hbEV2ZW50SGFuZGxlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50SGFuZGxlcihlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2lnbmFsKCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW50ZXJhY3Rpb25cIiwge1xyXG4gICAgVmlzdWFsU3RhdGU6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGEgdmlzdWFsIHN0YXRlIG9mIGEgY29udHJvbCBvciBlbGVtZW50PC9zdW1tYXJ5PlxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwibmFtZVwiIHR5cGU9XCJTdHJpbmdcIj5OYW1lIG9mIHRoZSB2aXN1YWwgc3RhdGU8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMubmFtZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImFjdGlvbnNcIiB0eXBlPVwiQXJyYXlcIiBlbGVtZW50VHlwZT1cIkJpZnJvc3QuaW50ZXJhY3Rpb24uVmlzdWFsU3RhdGVUcmFuc2l0aW9uQWN0aW9uXCI+VHJhbnNpdGlvbiBhY3Rpb25zIHRoYXQgd2lsbCBleGVjdXRlIHdoZW4gdHJhbnNpdGlvbmluZzwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQWN0aW9uID0gZnVuY3Rpb24gKGFjdGlvbikge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+QWRkIGFjdGlvbiB0byB0aGUgdmlzdWFsIHN0YXRlPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJhY3Rpb25cIiB0eXBlPVwiQmlmcm9zdC5pbnRlcmFjdGlvbi5WaXN1YWxTdGF0ZUFjdGlvblwiPlxyXG4gICAgICAgICAgICBzZWxmLmFjdGlvbnMucHVzaChhY3Rpb24pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZW50ZXIgPSBmdW5jdGlvbiAobmFtaW5nUm9vdCwgZHVyYXRpb24pIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkVudGVyIHRoZSBzdGF0ZSB3aXRoIGEgZ2l2ZW4gZHVyYXRpb248L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cImR1cmF0aW9uXCIgdHlwZT1cIkJpZnJvc3QuVGltZVNwYW5cIj5UaW1lIHRvIHNwZW5kIGVudGVyaW5nIHRoZSBzdGF0ZTwvcGFyYW0+XHJcbiAgICAgICAgICAgIHNlbGYuYWN0aW9ucygpLmZvckVhY2goZnVuY3Rpb24gKGFjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uLm9uRW50ZXIobmFtaW5nUm9vdCwgZHVyYXRpb24pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmV4aXQgPSBmdW5jdGlvbiAobmFtaW5nUm9vdCwgZHVyYXRpb24pIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkV4aXQgdGhlIHN0YXRlIHdpdGggYSBnaXZlbiBkdXJhdGlvbjwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiZHVyYXRpb25cIiB0eXBlPVwiQmlmcm9zdC5UaW1lU3BhblwiPlRpbWUgdG8gc3BlbmQgZW50ZXJpbmcgdGhlIHN0YXRlPC9wYXJhbT5cclxuICAgICAgICAgICAgc2VsZi5hY3Rpb25zKCkuZm9yRWFjaChmdW5jdGlvbiAoYWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBhY3Rpb24ub25FeGl0KG5hbWluZ1Jvb3QsIGR1cmF0aW9uKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5pbnRlcmFjdGlvblwiLCB7XHJcbiAgICBWaXN1YWxTdGF0ZUFjdGlvbjogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChuYW1pbmdSb290KSB7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMub25FbnRlciA9IGZ1bmN0aW9uIChuYW1pbmdSb290LCBkdXJhdGlvbikge1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9uRXhpdCA9IGZ1bmN0aW9uIChuYW1pbmdSb290LCBkdXJhdGlvbikge1xyXG5cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmludGVyYWN0aW9uXCIsIHtcclxuICAgIFZpc3VhbFN0YXRlR3JvdXA6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKGRpc3BhdGNoZXIpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyBhIGdyb3VwIHRoYXQgaG9sZHMgdmlzdWFsIHN0YXRlczwvc3VtbWFyeT5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuZGVmYXVsdER1cmF0aW9uID0gQmlmcm9zdC5UaW1lU3Bhbi56ZXJvKCk7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImN1cnJlbnRTdGF0ZVwiIHR5cGU9XCJCaWZyb3N0LmludGVyYWN0aW9uLlZpc3VhbFN0YXRlXCI+SG9sZHMgdGhlIGN1cnJlbnQgc3RhdGUsIHRoaXMgaXMgYW4gb2JzZXJ2YWJsZTwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBrby5vYnNlcnZhYmxlKHtuYW1lOiBcIm51bGwgc3RhdGVcIiwgZW50ZXI6IGZ1bmN0aW9uICgpIHt9LCBleGl0OiBmdW5jdGlvbiAoKSB7fX0pO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJzdGF0ZXNcIiB0eXBlPVwiQXJyYXlcIiBlbGVtZW50VHlwZT1cIkJpZnJvc3QuaW50ZXJhY3Rpb24uVmlzdWFsU3RhdGVcIj5Ib2xkcyBhbiBvYnNlcnZhYmxlIGFycmF5IG9mIHZpc3VhbCBzdGF0ZXM8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuc3RhdGVzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cInRyYW5zaXRpb25zXCIgdHlwZT1cIkFycmF5XCIgZWxlbWVudFR5cGU9XCJCaWZyb3N0LmludGVyYWN0aW9uLlZpc3VhbFN0YXRlVHJhbnNpdGlvblwiPkhvbGRzIGFuIG9ic2VydmFibGUgYXJyYXkgb2YgdmlzdWFsIHN0YXRlIHRyYW5zaXRpb25zPC9maWVsZD5cclxuICAgICAgICB0aGlzLnRyYW5zaXRpb25zID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkU3RhdGUgPSBmdW5jdGlvbiAoc3RhdGUpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkFkZCBhIHN0YXRlIHRvIHRoZSBncm91cDwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwic3RhdGVcIiB0eXBlPVwiQmlmcm9zdC5pbnRlcmFjdGlvbi5WaXN1YWxTdGF0ZVwiPlN0YXRlIHRvIGFkZDwvcGFyYW0+XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmhhc1N0YXRlKHN0YXRlLm5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlZpc3VhbFN0YXRlIHdpdGggbmFtZSBvZiAnXCIgKyBzdGF0ZS5uYW1lICsgXCInIGFscmVhZHkgZXhpc3RzXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2VsZi5zdGF0ZXMucHVzaChzdGF0ZSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRUcmFuc2l0aW9uID0gZnVuY3Rpb24gKHRyYW5zaXRpb24pIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkFkZCB0cmFuc2l0aW9uIHRvIGdyb3VwPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJ0cmFuc2l0aW9uXCIgdHlwZT1cIkJpZnJvc3QuaW50ZXJhY3Rpb24uVmlzdWFsU3RhdGVUcmFuc2l0aW9uXCI+VHJhbnNpdGlvbiB0byBhZGQ8L3BhcmFtPlxyXG4gICAgICAgICAgICBzZWxmLnRyYW5zaXRpb25zLnB1c2godHJhbnNpdGlvbik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5oYXNTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZU5hbWUpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkNoZWNrIGlmIGdyb3VwIGhhcyBzdGF0ZSBieSB0aGUgbmFtZSBvZiB0aGUgc3RhdGU8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cInN0YXRlTmFtZVwiIHR5cGU9XCJTdHJpbmdcIj5OYW1lIG9mIHRoZSBzdGF0ZSB0byBjaGVjayBmb3I8L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHJldHVybnMgdHlwZT1cIkJvb2xlYW5cIj5UcnVlIGlmIHRoZSBzdGF0ZSBleGlzdHMsIGZhbHNlIGlmIG5vdDwvcmV0dXJucz5cclxuICAgICAgICAgICAgdmFyIGhhc1N0YXRlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHNlbGYuc3RhdGVzKCkuZm9yRWFjaChmdW5jdGlvbiAoc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5uYW1lID09PSBzdGF0ZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBoYXNTdGF0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoYXNTdGF0ZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldFN0YXRlQnlOYW1lID0gZnVuY3Rpb24gKHN0YXRlTmFtZSkge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+R2V0cyBhIHN0YXRlIGJ5IGl0cyBuYW1lPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJzdGF0ZU5hbWVcIiB0eXBlPVwiU3RyaW5nXCI+TmFtZSBvZiB0aGUgc3RhdGUgdG8gZ2V0PC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxyZXR1cm5zIHR5cGU9XCJCaWZyb3N0LmludGVyYWN0aW9uLlZpc3VhbFN0YXRlXCI+U3RhdGUgZm91bmQgb3IgbnVsbCBpZiBpdCBkb2VzIG5vdCBoYXZlIGEgc3RhdGUgYnkgdGhlIGdpdmVuIG5hbWU8L3JldHVybnM+XHJcbiAgICAgICAgICAgIHZhciBzdGF0ZUZvdW5kID0gbnVsbDtcclxuICAgICAgICAgICAgc2VsZi5zdGF0ZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlLm5hbWUgPT09IHN0YXRlTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlRm91bmQgPSBzdGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGVGb3VuZDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdvVG8gPSBmdW5jdGlvbiAobmFtaW5nUm9vdCwgc3RhdGVOYW1lKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5HbyB0byBhIHNwZWNpZmljIHN0YXRlIGJ5IHRoZSBuYW1lIG9mIHRoZSBzdGF0ZTwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwic3RhdGVOYW1lXCIgdHlwZT1cIlN0cmluZ1wiPk5hbWUgb2YgdGhlIHN0YXRlIHRvIGdvIHRvPC9wYXJhbT5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRTdGF0ZSA9IHNlbGYuY3VycmVudFN0YXRlKCk7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChjdXJyZW50U3RhdGUpICYmIGN1cnJlbnRTdGF0ZS5uYW1lID09PSBzdGF0ZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHN0YXRlID0gc2VsZi5nZXRTdGF0ZUJ5TmFtZShzdGF0ZU5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoc3RhdGUpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZHVyYXRpb24gPSBzZWxmLmRlZmF1bHREdXJhdGlvbjtcclxuICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChjdXJyZW50U3RhdGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFN0YXRlLmV4aXQobmFtaW5nUm9vdCwgZHVyYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3RhdGUuZW50ZXIobmFtaW5nUm9vdCwgZHVyYXRpb24pO1xyXG5cclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIuc2NoZWR1bGUoZHVyYXRpb24udG90YWxNaWxsaXNlY29uZHMoKSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY3VycmVudFN0YXRlKHN0YXRlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5pbnRlcmFjdGlvblwiLCB7XHJcbiAgICBWaXN1YWxTdGF0ZU1hbmFnZXI6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGEgc3RhdGUgbWFuYWdlciBmb3IgZGVhbGluZyB3aXRoIHZpc3VhbCBzdGF0ZXMsIHR5cGljYWxseSByZWxhdGVkIHRvIGEgY29udHJvbCBvciBvdGhlciBlbGVtZW50IG9uIGEgcGFnZTwvc3VtbWFyeT5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cIm5hbWluZ1Jvb3RcIiB0eXBlPVwiQmlmcm9zdC52aWV3cy5OYW1pbmdSb290XCI+QSByb290IGZvciBuYW1lZCBvYmplY3RzPC9maWVsZD5cclxuICAgICAgICB0aGlzLm5hbWluZ1Jvb3QgPSBudWxsO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJncm91cHNcIiB0eXBlPVwiQXJyYXlcIiBlbGVtZW50VHlwZT1cIkJpZnJvc3QuaW50ZXJhY3Rpb24uVmlzdWFsU3RhdGVHcm91cFwiPkhvbGRzIGFsbCBncm91cHMgaW4gdGhlIHN0YXRlIG1hbmFnZXI8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuZ3JvdXBzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkR3JvdXAgPSBmdW5jdGlvbiAoZ3JvdXApIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkFkZHMgYSBWaXN1YWxTdGF0ZUdyb3VwIHRvIHRoZSBtYW5hZ2VyPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJncm91cFwiIHR5cGU9XCJCaWZyb3N0LmludGVyYWN0aW9uLlZpc3VhbFN0YXRlR3JvdXBcIj5Hcm91cCB0byBhZGQ8L3BhcmFtPlxyXG4gICAgICAgICAgICBzZWxmLmdyb3Vwcy5wdXNoKGdyb3VwKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdvVG8gPSBmdW5jdGlvbiAoc3RhdGVOYW1lKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5HbyB0byBhIHNwZWNpZmljIHN0YXRlIGJ5IGl0cyBuYW1lPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJzdGF0ZU5hbWVcIiB0eXBlPVwiU3RyaW5nXCI+TmFtZSBvZiBzdGF0ZSB0byBnbyB0bzwvcGFyYW0+XHJcbiAgICAgICAgICAgIHNlbGYuZ3JvdXBzKCkuZm9yRWFjaChmdW5jdGlvbiAoZ3JvdXApIHtcclxuICAgICAgICAgICAgICAgIGlmIChncm91cC5oYXNTdGF0ZShzdGF0ZU5hbWUpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAuZ29UbyhzZWxmLm5hbWluZ1Jvb3QsIHN0YXRlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW50ZXJhY3Rpb25cIiwge1xyXG4gICAgVmlzdWFsU3RhdGVUcmFuc2l0aW9uOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGEgZGVzY3JpcHRpb24gb2YgdHJhbnNpdGlvbiBiZXR3ZWVuIHR3byBuYW1lZCBzdGF0ZXM8L3N1bW1hcnk+XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImZyb21cIiB0eXBlPVwiU3RyaW5nXCI+TmFtZSBvZiB2aXN1YWwgc3RhdGUgdGhhdCB3ZSBhcmUgZGVzY3JpYmluZyB0cmFuc2l0aW9uaW5nIGZyb208L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuZnJvbSA9IFwiXCI7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cInRvXCIgdHlwZT1cIlN0cmluZ1wiPk5hbWUgb2YgdmlzdWFsIHN0YXRlIHRoYXQgd2UgYXJlIGRlc2NyaWJpbmcgdHJhbnNpdGlvbmluZyB0bzwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy50byA9IFwiXCI7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImR1cmF0aW9uXCIgdHlwZT1cIkJpZnJvc3QuVGltZVN0YW1wXCI+RHVyYXRpb24gZm9yIHRoZSB0cmFuc2l0aW9uPC9maWVsZD5cclxuICAgICAgICB0aGlzLmR1cmF0aW9uID0gQmlmcm9zdC5UaW1lU3RhbXAuemVybygpO1xyXG4gICAgfSlcclxufSk7IiwidmFyIGdsb2JhbElkID0gMDtcclxuQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmludGVyYWN0aW9uLnZpc3VhbFN0YXRlQWN0aW9uc1wiLCB7XHJcbiAgICBPcGFjaXR5OiBCaWZyb3N0LmludGVyYWN0aW9uLlZpc3VhbFN0YXRlQWN0aW9uLmV4dGVuZChmdW5jdGlvbiAoZG9jdW1lbnRTZXJ2aWNlKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gbnVsbDtcclxuICAgICAgICB2YXIgaWQgPSBkb2N1bWVudFNlcnZpY2UuZ2V0VW5pcXVlU3R5bGVOYW1lKFwib3BhY2l0eVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSBcIlwiO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplID0gZnVuY3Rpb24gKG5hbWluZ1Jvb3QpIHtcclxuICAgICAgICAgICAgZWxlbWVudCA9IG5hbWluZ1Jvb3QuZmluZChzZWxmLnRhcmdldCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vbkVudGVyID0gZnVuY3Rpb24gKG5hbWluZ1Jvb3QsIGR1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHBhcnNlRmxvYXQoc2VsZi52YWx1ZSk7XHJcbiAgICAgICAgICAgIGlmIChpc05hTih2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gMC4wO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgYWN0dWFsRHVyYXRpb24gPSBkdXJhdGlvbi50b3RhbE1pbGxpc2Vjb25kcygpIC8gMTAwMDtcclxuXHJcbiAgICAgICAgICAgIGRvY3VtZW50U2VydmljZS5hZGRTdHlsZShcIi5cIiArIGlkLCB7XHJcbiAgICAgICAgICAgICAgICBcIi13ZWJraXQtdHJhbnNpdGlvblwiOiBcIm9wYWNpdHkgXCIgKyBhY3R1YWxEdXJhdGlvbiArIFwicyBlYXNlLWluLW91dFwiLFxyXG4gICAgICAgICAgICAgICAgXCItbW96LXRyYW5zaXRpb25cIjogXCJvcGFjaXR5IFwiICsgYWN0dWFsRHVyYXRpb24gKyBcInMgZWFzZS1pbi1vdXRcIixcclxuICAgICAgICAgICAgICAgIFwiLW1zLXRyYW5zaXRpb25cIjogXCJvcGFjaXR5IFwiICsgYWN0dWFsRHVyYXRpb24gKyBcInMgZWFzZS1pbi1vdXRcIixcclxuICAgICAgICAgICAgICAgIFwiLW8tdHJhbnNpdGlvblwiOiBcIm9wYWNpdHkgXCIgKyBhY3R1YWxEdXJhdGlvbiArIFwicyBlYXNlLWluLW91dFwiLFxyXG4gICAgICAgICAgICAgICAgXCJ0cmFuc2l0aW9uXCI6IFwib3BhY2l0eSBcIiArIGFjdHVhbER1cmF0aW9uICsgXCJzIGVhc2UtaW4tb3V0XCIsXHJcbiAgICAgICAgICAgICAgICBcIm9wYWNpdHlcIjogdmFsdWVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoaWQpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMub25FeGl0ID0gZnVuY3Rpb24gKG5hbWluZ1Jvb3QsIGR1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShpZCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXBwaW5nXCIsIHtcclxuICAgIE1pc3NpbmdQcm9wZXJ0eVN0cmF0ZWd5OiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFwcGluZ1wiLCB7XHJcbiAgICBQcm9wZXJ0eU1hcDogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoc291cmNlUHJvcGVydHksIHR5cGVDb252ZXJ0ZXJzKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLnN0cmF0ZWd5ID0gbnVsbDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGhyb3dJZk1pc3NpbmdQcm9wZXJ0eVN0cmF0ZWd5KCkge1xyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChzZWxmLnN0cmF0ZWd5KSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgQmlmcm9zdC5tYXBwaW5nLk1pc3NpbmdQcm9wZXJ0eVN0cmF0ZWd5LmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnRvID0gZnVuY3Rpb24gKHRhcmdldFByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgIHNlbGYuc3RyYXRlZ3kgPSBmdW5jdGlvbiAoc291cmNlLCB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGtvLnVud3JhcChzb3VyY2Vbc291cmNlUHJvcGVydHldKTtcclxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXRWYWx1ZSA9IGtvLnVud3JhcCh0YXJnZXRbdGFyZ2V0UHJvcGVydHldKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdHlwZUFzU3RyaW5nID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodGFyZ2V0VmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5jb25zdHJ1Y3RvciAhPT0gdGFyZ2V0VmFsdWUuY29uc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVBc1N0cmluZyA9IHRhcmdldFZhbHVlLmNvbnN0cnVjdG9yLm5hbWUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHRhcmdldFt0YXJnZXRQcm9wZXJ0eV0uX3R5cGVBc1N0cmluZykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVBc1N0cmluZyA9IHRhcmdldFt0YXJnZXRQcm9wZXJ0eV0uX3R5cGVBc1N0cmluZztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHR5cGVBc1N0cmluZykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0eXBlQ29udmVydGVycy5jb252ZXJ0RnJvbSh2YWx1ZS50b1N0cmluZygpLCB0eXBlQXNTdHJpbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoa28uaXNPYnNlcnZhYmxlKHRhcmdldFt0YXJnZXRQcm9wZXJ0eV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W3RhcmdldFByb3BlcnR5XSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFt0YXJnZXRQcm9wZXJ0eV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm1hcCA9IGZ1bmN0aW9uIChzb3VyY2UsIHRhcmdldCkge1xyXG4gICAgICAgICAgICB0aHJvd0lmTWlzc2luZ1Byb3BlcnR5U3RyYXRlZ3koKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc3RyYXRlZ3koc291cmNlLCB0YXJnZXQpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFwcGluZ1wiLCB7XHJcbiAgICBNYXA6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB7fTtcclxuXHJcbiAgICAgICAgdGhpcy5zb3VyY2VUeXBlID0gbnVsbDtcclxuICAgICAgICB0aGlzLnRhcmdldFR5cGUgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnNvdXJjZSA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc291cmNlVHlwZSA9IHR5cGU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgICAgICBzZWxmLnRhcmdldFR5cGUgPSB0eXBlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucHJvcGVydHkgPSBmdW5jdGlvbiAocHJvcGVydHkpIHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnR5TWFwID0gQmlmcm9zdC5tYXBwaW5nLlByb3BlcnR5TWFwLmNyZWF0ZSh7IHNvdXJjZVByb3BlcnR5OiBwcm9wZXJ0eSB9KTtcclxuICAgICAgICAgICAgcHJvcGVydGllc1twcm9wZXJ0eV0gPSBwcm9wZXJ0eU1hcDtcclxuICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5TWFwO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY2FuTWFwUHJvcGVydHkgPSBmdW5jdGlvbiAocHJvcGVydHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMubWFwUHJvcGVydHkgPSBmdW5jdGlvbiAocHJvcGVydHksIHNvdXJjZSwgdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmNhbk1hcFByb3BlcnR5KHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllc1twcm9wZXJ0eV0ubWFwKHNvdXJjZSwgdGFyZ2V0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFwcGluZ1wiLCB7XHJcbiAgICBtYXBzOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBtYXBzID0ge307XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldEtleUZyb20oc291cmNlVHlwZSwgdGFyZ2V0VHlwZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc291cmNlVHlwZS5fdHlwZUlkICsgXCIgLSBcIiArIHRhcmdldFR5cGUuX3R5cGVJZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBleHRlbmRlcnMgPSBCaWZyb3N0Lm1hcHBpbmcuTWFwLmdldEV4dGVuZGVycygpO1xyXG5cclxuICAgICAgICBleHRlbmRlcnMuZm9yRWFjaChmdW5jdGlvbiAoZXh0ZW5kZXIpIHtcclxuICAgICAgICAgICAgdmFyIG1hcCA9IGV4dGVuZGVyLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gZ2V0S2V5RnJvbShtYXAuc291cmNlVHlwZSwgbWFwLnRhcmdldFR5cGUpO1xyXG4gICAgICAgICAgICBtYXBzW2tleV0gPSBtYXA7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuaGFzTWFwRm9yID0gZnVuY3Rpb24gKHNvdXJjZVR5cGUsIHRhcmdldFR5cGUpIHtcclxuICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoc291cmNlVHlwZSkgfHwgQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh0YXJnZXRUeXBlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBnZXRLZXlGcm9tKHNvdXJjZVR5cGUsIHRhcmdldFR5cGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gbWFwcy5oYXNPd25Qcm9wZXJ0eShrZXkpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0TWFwRm9yID0gZnVuY3Rpb24gKHNvdXJjZVR5cGUsIHRhcmdldFR5cGUpIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuaGFzTWFwRm9yKHNvdXJjZVR5cGUsIHRhcmdldFR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gZ2V0S2V5RnJvbShzb3VyY2VUeXBlLCB0YXJnZXRUeXBlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtYXBzW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcHBpbmdcIiwge1xyXG4gICAgbWFwcGVyOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICh0eXBlQ29udmVydGVycywgbWFwcykge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0VHlwZUFzU3RyaW5nKHRvLCBwcm9wZXJ0eSwgdmFsdWUsIHRvVmFsdWUpIHtcclxuICAgICAgICAgICAgdmFyIHR5cGVBc1N0cmluZyA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh2YWx1ZSkgJiZcclxuICAgICAgICAgICAgICAgICFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHRvVmFsdWUpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLmNvbnN0cnVjdG9yICE9PSB0b1ZhbHVlLmNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZUFzU3RyaW5nID0gdG9WYWx1ZS5jb25zdHJ1Y3Rvci50b1N0cmluZygpLm1hdGNoKC9mdW5jdGlvblxcMDQwKyhcXHcqKS8pWzFdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodG9bcHJvcGVydHldKSAmJlxyXG4gICAgICAgICAgICAgICAgIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodG9bcHJvcGVydHldLl90eXBlQXNTdHJpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlQXNTdHJpbmcgPSB0b1twcm9wZXJ0eV0uX3R5cGVBc1N0cmluZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHlwZUFzU3RyaW5nO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBjb3B5UHJvcGVydGllcyhtYXBwZWRQcm9wZXJ0aWVzLCBmcm9tLCB0bywgbWFwKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGZyb20pIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5pbmRleE9mKFwiX1wiKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc1VuZGVmaW5lZChmcm9tW3Byb3BlcnR5XSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNPYmplY3QoZnJvbVtwcm9wZXJ0eV0pICYmIEJpZnJvc3QuaXNPYmplY3QodG9bcHJvcGVydHldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3B5UHJvcGVydGllcyhtYXBwZWRQcm9wZXJ0aWVzLCBmcm9tW3Byb3BlcnR5XSwgdG9bcHJvcGVydHldKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQobWFwKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hcC5jYW5NYXBQcm9wZXJ0eShwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXAubWFwUHJvcGVydHkocHJvcGVydHksIGZyb20sIHRvKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hcHBlZFByb3BlcnRpZXMuaW5kZXhPZihwcm9wZXJ0eSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcHBlZFByb3BlcnRpZXMucHVzaChwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzVW5kZWZpbmVkKHRvW3Byb3BlcnR5XSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGtvLnVud3JhcChmcm9tW3Byb3BlcnR5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG9WYWx1ZSA9IGtvLnVud3JhcCh0b1twcm9wZXJ0eV0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0eXBlQXNTdHJpbmcgPSBnZXRUeXBlQXNTdHJpbmcodG8sIHByb3BlcnR5LCB2YWx1ZSwgdG9WYWx1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHR5cGVBc1N0cmluZykgJiYgIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0eXBlQ29udmVydGVycy5jb252ZXJ0RnJvbSh2YWx1ZS50b1N0cmluZygpLCB0eXBlQXNTdHJpbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXBwZWRQcm9wZXJ0aWVzLmluZGV4T2YocHJvcGVydHkpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcHBlZFByb3BlcnRpZXMucHVzaChwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrby5pc09ic2VydmFibGUodG9bcHJvcGVydHldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgha28uaXNXcml0ZWFibGVPYnNlcnZhYmxlKHRvW3Byb3BlcnR5XSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b1twcm9wZXJ0eV0odmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b1twcm9wZXJ0eV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbWFwU2luZ2xlSW5zdGFuY2UodHlwZSwgZGF0YSwgbWFwcGVkUHJvcGVydGllcykge1xyXG4gICAgICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGRhdGEuX3NvdXJjZVR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9IGV2YWwoZGF0YS5fc291cmNlVHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IHR5cGUuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hcCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBpZiAobWFwcy5oYXNNYXBGb3IoZGF0YS5fdHlwZSwgdHlwZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXAgPSBtYXBzLmdldE1hcEZvcihkYXRhLl90eXBlLCB0eXBlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb3B5UHJvcGVydGllcyhtYXBwZWRQcm9wZXJ0aWVzLCBkYXRhLCBpbnN0YW5jZSwgbWFwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBtYXBNdWx0aXBsZUluc3RhbmNlcyh0eXBlLCBkYXRhLCBtYXBwZWRQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXBwZWRJbnN0YW5jZXMgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2luZ2xlRGF0YSA9IGRhdGFbaV07XHJcbiAgICAgICAgICAgICAgICBtYXBwZWRJbnN0YW5jZXMucHVzaChtYXBTaW5nbGVJbnN0YW5jZSh0eXBlLCBzaW5nbGVEYXRhLCBtYXBwZWRQcm9wZXJ0aWVzKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG1hcHBlZEluc3RhbmNlcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubWFwID0gZnVuY3Rpb24gKHR5cGUsIGRhdGEpIHtcclxuICAgICAgICAgICAgdmFyIG1hcHBlZFByb3BlcnRpZXMgPSBbXTtcclxuICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNBcnJheShkYXRhKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hcE11bHRpcGxlSW5zdGFuY2VzKHR5cGUsIGRhdGEsIG1hcHBlZFByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hcFNpbmdsZUluc3RhbmNlKHR5cGUsIGRhdGEsIG1hcHBlZFByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXBUb0luc3RhbmNlID0gZnVuY3Rpb24gKHRhcmdldFR5cGUsIGRhdGEsIHRhcmdldCkge1xyXG4gICAgICAgICAgICB2YXIgbWFwcGVkUHJvcGVydGllcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgdmFyIG1hcCA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChtYXBzLmhhc01hcEZvcihkYXRhLl90eXBlLCB0YXJnZXRUeXBlKSkge1xyXG4gICAgICAgICAgICAgICAgbWFwID0gbWFwcy5nZXRNYXBGb3IoZGF0YS5fdHlwZSwgdGFyZ2V0VHlwZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29weVByb3BlcnRpZXMobWFwcGVkUHJvcGVydGllcywgZGF0YSwgdGFyZ2V0LCBtYXApO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG1hcHBlZFByb3BlcnRpZXM7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLm1hcHBlciA9IEJpZnJvc3QubWFwcGluZy5tYXBwZXI7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnJlYWRcIiwge1xyXG4gICAgcmVhZE1vZGVsU3lzdGVtRXZlbnRzOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5ub0luc3RhbmNlID0gQmlmcm9zdC5FdmVudC5jcmVhdGUoKTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5yZWFkXCIsIHtcclxuICAgIFBhZ2luZ0luZm86IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKHNpemUsIG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuc2l6ZSA9IHNpemU7XHJcbiAgICAgICAgdGhpcy5udW1iZXIgPSBudW1iZXI7XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QucmVhZFwiLCB7XHJcbiAgICBRdWVyeWFibGU6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKHF1ZXJ5LCBxdWVyeVNlcnZpY2UsIHJlZ2lvbiwgdGFyZ2V0T2JzZXJ2YWJsZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5jYW5FeGVjdXRlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXRPYnNlcnZhYmxlO1xyXG4gICAgICAgIHRoaXMucXVlcnkgPSBxdWVyeTtcclxuICAgICAgICB0aGlzLnF1ZXJ5U2VydmljZSA9IHF1ZXJ5U2VydmljZTtcclxuICAgICAgICB0aGlzLnBhZ2VTaXplID0ga28ub2JzZXJ2YWJsZSgwKTtcclxuICAgICAgICB0aGlzLnBhZ2VOdW1iZXIgPSBrby5vYnNlcnZhYmxlKDApO1xyXG4gICAgICAgIHRoaXMudG90YWxJdGVtcyA9IGtvLm9ic2VydmFibGUoMCk7XHJcbiAgICAgICAgdGhpcy5jb21wbGV0ZWRDYWxsYmFja3MgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5wYWdlU2l6ZS5zdWJzY3JpYmUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5jYW5FeGVjdXRlKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmV4ZWN1dGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnBhZ2VOdW1iZXIuc3Vic2NyaWJlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuY2FuRXhlY3V0ZSkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5leGVjdXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb2JzZXJ2ZVByb3BlcnRpZXNGcm9tKHF1ZXJ5KSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5TmFtZSBpbiBxdWVyeSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gcXVlcnlbcHJvcGVydHlOYW1lXTtcclxuICAgICAgICAgICAgICAgIGlmIChrby5pc09ic2VydmFibGUocHJvcGVydHkpID09PSB0cnVlICYmIHF1ZXJ5Lmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkgJiYgcHJvcGVydHlOYW1lICE9PSBcImFyZUFsbFBhcmFtZXRlcnNTZXRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5LnN1YnNjcmliZShzZWxmLmV4ZWN1dGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbXBsZXRlZCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICBzZWxmLmNvbXBsZXRlZENhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGY7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vbkNvbXBsZXRlZCA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIHNlbGYuY29tcGxldGVkQ2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5xdWVyeS5hcmVBbGxQYXJhbWV0ZXJzU2V0KCkgIT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIC8vIFRPRE86IERpYWdub3N0aWNzIC0gd2FybmluZ1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYudGFyZ2V0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNlbGYucXVlcnkuX3ByZXZpb3VzQXJlQWxsUGFyYW1ldGVyc1NldCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB2YXIgcGFnaW5nID0gQmlmcm9zdC5yZWFkLlBhZ2luZ0luZm8uY3JlYXRlKHtcclxuICAgICAgICAgICAgICAgIHNpemU6IHNlbGYucGFnZVNpemUoKSxcclxuICAgICAgICAgICAgICAgIG51bWJlcjogc2VsZi5wYWdlTnVtYmVyKClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHNlbGYucXVlcnlTZXJ2aWNlLmV4ZWN1dGUocXVlcnksIHBhZ2luZykuY29udGludWVXaXRoKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChyZXN1bHQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi50b3RhbEl0ZW1zKHJlc3VsdC50b3RhbEl0ZW1zKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnRhcmdldChyZXN1bHQuaXRlbXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYub25Db21wbGV0ZWQocmVzdWx0Lml0ZW1zKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi50YXJnZXQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRQYWdlSW5mbyA9IGZ1bmN0aW9uIChwYWdlU2l6ZSwgcGFnZU51bWJlcikge1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhZ2VTaXplID09PSBzZWxmLnBhZ2VTaXplKCkgJiYgcGFnZU51bWJlciA9PT0gc2VsZi5wYWdlTnVtYmVyKCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5jYW5FeGVjdXRlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHNlbGYucGFnZVNpemUocGFnZVNpemUpO1xyXG4gICAgICAgICAgICBzZWxmLnBhZ2VOdW1iZXIocGFnZU51bWJlcik7XHJcbiAgICAgICAgICAgIHNlbGYuY2FuRXhlY3V0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHNlbGYuZXhlY3V0ZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIG9ic2VydmVQcm9wZXJ0aWVzRnJvbShzZWxmLnF1ZXJ5KTtcclxuXHJcbiAgICAgICAgaWYgKHNlbGYucXVlcnkuYXJlQWxsUGFyYW1ldGVyc1NldCgpKSB7XHJcbiAgICAgICAgICAgIHNlbGYuZXhlY3V0ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5yZWFkLlF1ZXJ5YWJsZS5uZXcgPSBmdW5jdGlvbiAob3B0aW9ucywgcmVnaW9uKSB7XHJcbiAgICB2YXIgb2JzZXJ2YWJsZSA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgb3B0aW9ucy50YXJnZXRPYnNlcnZhYmxlID0gb2JzZXJ2YWJsZTtcclxuICAgIG9wdGlvbnMucmVnaW9uID0gcmVnaW9uO1xyXG4gICAgdmFyIHF1ZXJ5YWJsZSA9IEJpZnJvc3QucmVhZC5RdWVyeWFibGUuY3JlYXRlKG9wdGlvbnMpO1xyXG4gICAgQmlmcm9zdC5leHRlbmQob2JzZXJ2YWJsZSwgcXVlcnlhYmxlKTtcclxuICAgIG9ic2VydmFibGUuaXNRdWVyeWFibGUgPSB0cnVlO1xyXG4gICAgcmV0dXJuIG9ic2VydmFibGU7XHJcbn07IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnJlYWRcIiwge1xyXG4gICAgcXVlcnlhYmxlRmFjdG9yeTogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKHF1ZXJ5LCByZWdpb24pIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXJ5YWJsZSA9IEJpZnJvc3QucmVhZC5RdWVyeWFibGUubmV3KHtcclxuICAgICAgICAgICAgICAgIHF1ZXJ5OiBxdWVyeVxyXG4gICAgICAgICAgICB9LCByZWdpb24pO1xyXG4gICAgICAgICAgICByZXR1cm4gcXVlcnlhYmxlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy5xdWVyeWFibGVGYWN0b3J5ID0gQmlmcm9zdC5pbnRlcmFjdGlvbi5xdWVyeWFibGVGYWN0b3J5OyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5yZWFkXCIsIHtcclxuICAgIFF1ZXJ5OiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uIChxdWVyeWFibGVGYWN0b3J5LCByZWdpb24pIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLl9uYW1lID0gXCJcIjtcclxuICAgICAgICB0aGlzLl9nZW5lcmF0ZWRGcm9tID0gXCJcIjtcclxuICAgICAgICB0aGlzLl9yZWFkTW9kZWwgPSBudWxsO1xyXG4gICAgICAgIHRoaXMucmVnaW9uID0gcmVnaW9uO1xyXG5cclxuICAgICAgICB0aGlzLmFyZUFsbFBhcmFtZXRlcnNTZXQgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmhhc1JlYWRNb2RlbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBzZWxmLnRhcmdldC5fcmVhZE1vZGVsICE9PSBcInVuZGVmaW5lZFwiICYmIHNlbGYudGFyZ2V0Ll9yZWFkTW9kZWwgIT0gbnVsbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNldFBhcmFtZXRlcnMgPSBmdW5jdGlvbiAocGFyYW1ldGVycykge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcGFyYW1ldGVycykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLnRhcmdldC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkgJiYga28uaXNPYnNlcnZhYmxlKHNlbGYudGFyZ2V0W3Byb3BlcnR5XSkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi50YXJnZXRbcHJvcGVydHldKHBhcmFtZXRlcnNbcHJvcGVydHldKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2goZXgpIHt9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcGFyYW1ldGVycyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gc2VsZi50YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChrby5pc09ic2VydmFibGUoc2VsZi50YXJnZXRbcHJvcGVydHldKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5ICE9PSBcImFyZUFsbFBhcmFtZXRlcnNTZXRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnNbcHJvcGVydHldID0gc2VsZi50YXJnZXRbcHJvcGVydHldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcGFyYW1ldGVycztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldFBhcmFtZXRlclZhbHVlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHBhcmFtZXRlclZhbHVlcyA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgdmFsdWU7XHJcblxyXG4gICAgICAgICAgICB2YXIgcGFyYW1ldGVycyA9IHNlbGYuZ2V0UGFyYW1ldGVycygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBwYXJhbWV0ZXJzKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHBhcmFtZXRlcnNbcHJvcGVydHldKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoa28uaXNPYnNlcnZhYmxlKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHBhcmFtZXRlclZhbHVlc1twcm9wZXJ0eV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHBhcmFtZXRlclZhbHVlcztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmFsbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXJ5YWJsZSA9IHF1ZXJ5YWJsZUZhY3RvcnkuY3JlYXRlKHNlbGYudGFyZ2V0LCByZWdpb24pO1xyXG4gICAgICAgICAgICByZXR1cm4gcXVlcnlhYmxlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucGFnZWQgPSBmdW5jdGlvbiAocGFnZVNpemUsIHBhZ2VOdW1iZXIpIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXJ5YWJsZSA9IHF1ZXJ5YWJsZUZhY3RvcnkuY3JlYXRlKHNlbGYudGFyZ2V0LCByZWdpb24pO1xyXG4gICAgICAgICAgICBxdWVyeWFibGUuc2V0UGFnZUluZm8ocGFnZVNpemUsIHBhZ2VOdW1iZXIpO1xyXG4gICAgICAgICAgICByZXR1cm4gcXVlcnlhYmxlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMub25DcmVhdGVkID0gZnVuY3Rpb24gKHF1ZXJ5KSB7XHJcbiAgICAgICAgICAgIHNlbGYudGFyZ2V0ID0gcXVlcnk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBzZWxmLnRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZShzZWxmLnRhcmdldFtwcm9wZXJ0eV0pID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi50YXJnZXRbcHJvcGVydHldLmV4dGVuZCh7IGxpbmtlZDoge30gfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYuYXJlQWxsUGFyYW1ldGVyc1NldCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpc1NldCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgaGFzUGFyYW1ldGVycyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gc2VsZi50YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoa28uaXNPYnNlcnZhYmxlKHNlbGYudGFyZ2V0W3Byb3BlcnR5XSkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzUGFyYW1ldGVycyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGtvLnVud3JhcChzZWxmLnRhcmdldFtwcm9wZXJ0eV0oKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwidW5kZWZpbmVkXCIgfHwgdmFsdWUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzU2V0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChoYXNQYXJhbWV0ZXJzID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzU2V0O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnJlYWRcIiwge1xyXG4gICAgUmVhZE1vZGVsOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGFjdHVhbFJlYWRNb2RlbCA9IHRoaXM7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmNvcHlUbyA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gYWN0dWFsUmVhZE1vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0dWFsUmVhZE1vZGVsLmhhc093blByb3BlcnR5KHByb3BlcnR5KSAmJiBwcm9wZXJ0eS5pbmRleE9mKFwiX1wiKSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoYWN0dWFsUmVhZE1vZGVsW3Byb3BlcnR5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0YXJnZXQuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFtwcm9wZXJ0eV0gPSBrby5vYnNlcnZhYmxlKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoa28uaXNPYnNlcnZhYmxlKHRhcmdldFtwcm9wZXJ0eV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcGVydHldKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFtwcm9wZXJ0eV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMub25DcmVhdGVkID0gZnVuY3Rpb24gKGxhc3REZXNjZW5kYW50KSB7XHJcbiAgICAgICAgICAgIGFjdHVhbFJlYWRNb2RlbCA9IGxhc3REZXNjZW5kYW50O1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QucmVhZFwiLCB7XHJcbiAgICBSZWFkTW9kZWxPZjogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAocmVnaW9uLCBtYXBwZXIsIHRhc2tGYWN0b3J5LCByZWFkTW9kZWxTeXN0ZW1FdmVudHMpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLl9uYW1lID0gXCJcIjtcclxuICAgICAgICB0aGlzLl9nZW5lcmF0ZWRGcm9tID0gXCJcIjtcclxuICAgICAgICB0aGlzLl9yZWFkTW9kZWxUeXBlID0gQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7IH0pO1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2UgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5jb21tYW5kVG9Qb3B1bGF0ZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5yZWdpb24gPSByZWdpb247XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVud3JhcFByb3BlcnR5RmlsdGVycyhwcm9wZXJ0eUZpbHRlcnMpIHtcclxuICAgICAgICAgICAgdmFyIHVud3JhcHBlZFByb3BlcnR5RmlsdGVycyA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBwcm9wZXJ0eUZpbHRlcnMpIHtcclxuICAgICAgICAgICAgICAgIHVud3JhcHBlZFByb3BlcnR5RmlsdGVyc1twcm9wZXJ0eV0gPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHByb3BlcnR5RmlsdGVyc1twcm9wZXJ0eV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB1bndyYXBwZWRQcm9wZXJ0eUZpbHRlcnM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwZXJmb3JtTG9hZCh0YXJnZXQsIHByb3BlcnR5RmlsdGVycykge1xyXG4gICAgICAgICAgICB2YXIgdGFzayA9IHRhc2tGYWN0b3J5LmNyZWF0ZVJlYWRNb2RlbCh0YXJnZXQsIHByb3BlcnR5RmlsdGVycyk7XHJcbiAgICAgICAgICAgIHRhcmdldC5yZWdpb24udGFza3MuZXhlY3V0ZSh0YXNrKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChkYXRhKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXBwZWRSZWFkTW9kZWwgPSBtYXBwZXIubWFwKHRhcmdldC5fcmVhZE1vZGVsVHlwZSwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnN0YW5jZShtYXBwZWRSZWFkTW9kZWwpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZWFkTW9kZWxTeXN0ZW1FdmVudHMubm9JbnN0YW5jZS50cmlnZ2VyKHRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZU1hdGNoaW5nID0gZnVuY3Rpb24gKHByb3BlcnR5RmlsdGVycykge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBsb2FkKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHVud3JhcHBlZFByb3BlcnR5RmlsdGVycyA9IHVud3JhcFByb3BlcnR5RmlsdGVycyhwcm9wZXJ0eUZpbHRlcnMpO1xyXG4gICAgICAgICAgICAgICAgcGVyZm9ybUxvYWQoc2VsZi50YXJnZXQsIHVud3JhcHBlZFByb3BlcnR5RmlsdGVycyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxvYWQoKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHByb3BlcnR5RmlsdGVycykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gcHJvcGVydHlGaWx0ZXJzW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgICAgIGlmIChrby5pc09ic2VydmFibGUodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUuc3Vic2NyaWJlKGxvYWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5wb3B1bGF0ZUNvbW1hbmRPbkNoYW5nZXMgPSBmdW5jdGlvbiAoY29tbWFuZCkge1xyXG4gICAgICAgICAgICBjb21tYW5kLnBvcHVsYXRlZEV4dGVybmFsbHkoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc2VsZi5pbnN0YW5jZSgpICE9PSBcInVuZGVmaW5lZFwiICYmIHNlbGYuaW5zdGFuY2UoKSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kLnBvcHVsYXRlRnJvbUV4dGVybmFsU291cmNlKHNlbGYuaW5zdGFuY2UoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYuaW5zdGFuY2Uuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZC5wb3B1bGF0ZUZyb21FeHRlcm5hbFNvdXJjZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMub25DcmVhdGVkID0gZnVuY3Rpb24gKGxhc3REZXNjZW5kYW50KSB7XHJcbiAgICAgICAgICAgIHNlbGYudGFyZ2V0ID0gbGFzdERlc2NlbmRhbnQ7XHJcbiAgICAgICAgICAgIHZhciByZWFkTW9kZWxJbnN0YW5jZSA9IGxhc3REZXNjZW5kYW50Ll9yZWFkTW9kZWxUeXBlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICBzZWxmLmluc3RhbmNlKHJlYWRNb2RlbEluc3RhbmNlKTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnJlYWRcIiwge1xyXG4gICAgUmVhZE1vZGVsVGFzazogQmlmcm9zdC50YXNrcy5Mb2FkVGFzay5leHRlbmQoZnVuY3Rpb24gKHJlYWRNb2RlbE9mLCBwcm9wZXJ0eUZpbHRlcnMsIHRhc2tGYWN0b3J5KSB7XHJcbiAgICAgICAgdmFyIHVybCA9IFwiL0JpZnJvc3QvUmVhZE1vZGVsL0luc3RhbmNlTWF0Y2hpbmc/X3JtPVwiICsgcmVhZE1vZGVsT2YuX2dlbmVyYXRlZEZyb207XHJcbiAgICAgICAgdmFyIHBheWxvYWQgPSB7XHJcbiAgICAgICAgICAgIGRlc2NyaXB0b3I6IHtcclxuICAgICAgICAgICAgICAgIHJlYWRNb2RlbDogcmVhZE1vZGVsT2YuX25hbWUsXHJcbiAgICAgICAgICAgICAgICBnZW5lcmF0ZWRGcm9tOiByZWFkTW9kZWxPZi5fZ2VuZXJhdGVkRnJvbSxcclxuICAgICAgICAgICAgICAgIHByb3BlcnR5RmlsdGVyczogcHJvcGVydHlGaWx0ZXJzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnJlYWRNb2RlbCA9IHJlYWRNb2RlbE9mLl9nZW5lcmF0ZWRGcm9tO1xyXG5cclxuICAgICAgICB2YXIgaW5uZXJUYXNrID0gdGFza0ZhY3RvcnkuY3JlYXRlSHR0cFBvc3QodXJsLCBwYXlsb2FkKTtcclxuXHJcbiAgICAgICAgdGhpcy5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IGlubmVyVGFzay5leGVjdXRlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlcnMucmVhZE1vZGVsT2YgPSB7XHJcbiAgICBjYW5SZXNvbHZlOiBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiByZWFkICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lIGluIHJlYWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVzb2x2ZTogZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgIHJldHVybiByZWFkW25hbWVdLmNyZWF0ZSgpO1xyXG4gICAgfVxyXG59OyIsIkJpZnJvc3QuZGVwZW5kZW5jeVJlc29sdmVycy5xdWVyeSA9IHtcclxuICAgIGNhblJlc29sdmU6IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHJlYWQgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5hbWUgaW4gcmVhZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICByZXNvbHZlOiBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlYWRbbmFtZV0uY3JlYXRlKCk7XHJcbiAgICB9XHJcbn07IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnJlYWRcIiwge1xyXG4gICAgUXVlcnlUYXNrOiBCaWZyb3N0LnRhc2tzLkxvYWRUYXNrLmV4dGVuZChmdW5jdGlvbiAocXVlcnksIHBhZ2luZywgdGFza0ZhY3RvcnkpIHtcclxuICAgICAgICB2YXIgdXJsID0gXCIvQmlmcm9zdC9RdWVyeS9FeGVjdXRlP19xPVwiICsgcXVlcnkuX2dlbmVyYXRlZEZyb207XHJcbiAgICAgICAgdmFyIHBheWxvYWQgPSB7XHJcbiAgICAgICAgICAgIGRlc2NyaXB0b3I6IHtcclxuICAgICAgICAgICAgICAgIG5hbWVPZlF1ZXJ5OiBxdWVyeS5fbmFtZSxcclxuICAgICAgICAgICAgICAgIGdlbmVyYXRlZEZyb206IHF1ZXJ5Ll9nZW5lcmF0ZWRGcm9tLFxyXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyczogcXVlcnkuZ2V0UGFyYW1ldGVyVmFsdWVzKClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcGFnaW5nOiB7XHJcbiAgICAgICAgICAgICAgICBzaXplOiBwYWdpbmcuc2l6ZSxcclxuICAgICAgICAgICAgICAgIG51bWJlcjogcGFnaW5nLm51bWJlclxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5Ll9uYW1lO1xyXG4gICAgICAgIHRoaXMucGFnaW5nID0gcGF5bG9hZC5wYWdpbmc7XHJcblxyXG4gICAgICAgIHZhciBpbm5lclRhc2sgPSB0YXNrRmFjdG9yeS5jcmVhdGVIdHRwUG9zdCh1cmwsIHBheWxvYWQpO1xyXG5cclxuICAgICAgICB0aGlzLmV4ZWN1dGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gaW5uZXJUYXNrLmV4ZWN1dGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5yZWFkXCIsIHtcclxuICAgIHF1ZXJ5U2VydmljZTogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKG1hcHBlciwgdGFza0ZhY3RvcnkpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuZXhlY3V0ZSA9IGZ1bmN0aW9uIChxdWVyeSwgcGFnaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgdmFyIHJlZ2lvbiA9IHF1ZXJ5LnJlZ2lvbjtcclxuXHJcbiAgICAgICAgICAgIHZhciB0YXNrID0gdGFza0ZhY3RvcnkuY3JlYXRlUXVlcnkocXVlcnksIHBhZ2luZyk7XHJcbiAgICAgICAgICAgIHJlZ2lvbi50YXNrcy5leGVjdXRlKHRhc2spLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCByZXN1bHQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQuaXRlbXMgPT09IFwidW5kZWZpbmVkXCIgfHwgcmVzdWx0Lml0ZW1zID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQuaXRlbXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzdWx0LnRvdGFsSXRlbXMgPT09IFwidW5kZWZpbmVkXCIgfHwgcmVzdWx0LnRvdGFsSXRlbXMgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC50b3RhbEl0ZW1zID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocXVlcnkuaGFzUmVhZE1vZGVsKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQuaXRlbXMgPSBtYXBwZXIubWFwKHF1ZXJ5Ll9yZWFkTW9kZWwsIHJlc3VsdC5pdGVtcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChyZXN1bHQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Quc2FnYXNcIik7XHJcbkJpZnJvc3Quc2FnYXMuU2FnYSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBTYWdhKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5leGVjdXRlQ29tbWFuZHMgPSBmdW5jdGlvbiAoY29tbWFuZHMsIG9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBjYW5FeGVjdXRlU2FnYSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBjb21tYW5kcy5mb3JFYWNoKGZ1bmN0aW9uIChjb21tYW5kKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29tbWFuZC5vbkJlZm9yZUV4ZWN1dGUoKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYW5FeGVjdXRlU2FnYSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FuRXhlY3V0ZVNhZ2EgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgQmlmcm9zdC5jb21tYW5kcy5jb21tYW5kQ29vcmRpbmF0b3IuaGFuZGxlRm9yU2FnYShzZWxmLCBjb21tYW5kcywgb3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKGNvbmZpZ3VyYXRpb24pIHtcclxuICAgICAgICAgICAgdmFyIHNhZ2EgPSBuZXcgU2FnYSgpO1xyXG4gICAgICAgICAgICBCaWZyb3N0LmV4dGVuZChzYWdhLCBjb25maWd1cmF0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNhZ2E7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSkoKTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnNhZ2FzXCIpO1xyXG5CaWZyb3N0LnNhZ2FzLnNhZ2FOYXJyYXRvciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgYmFzZVVybCA9IFwiL0JpZnJvc3QvU2FnYU5hcnJhdG9yXCI7XHJcbiAgICAvLyBUb2RvIDogYWJzdHJhY3QgYXdheSBpbnRvIGdlbmVyYWwgU2VydmljZSBjb2RlIC0gbG9vayBhdCBDb21tYW5kQ29vcmRpbmF0b3IuanMgZm9yIHRoZSBvdGhlciBjb3B5IG9mIHRoaXMhc1xyXG4gICAgZnVuY3Rpb24gcG9zdCh1cmwsIGRhdGEsIGNvbXBsZXRlSGFuZGxlcikge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBjb21wbGV0ZUhhbmRsZXJcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpc1JlcXVlc3RTdWNjZXNzKGpxWEhSLCBjb21tYW5kUmVzdWx0KSB7XHJcbiAgICAgICAgaWYgKGpxWEhSLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIGlmIChjb21tYW5kUmVzdWx0LnN1Y2Nlc3MgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvbmNsdWRlOiBmdW5jdGlvbiAoc2FnYSwgc3VjY2VzcywgZXJyb3IpIHtcclxuICAgICAgICAgICAgdmFyIG1ldGhvZFBhcmFtZXRlcnMgPSB7XHJcbiAgICAgICAgICAgICAgICBzYWdhSWQ6IHNhZ2EuSWRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcG9zdChiYXNlVXJsICsgXCIvQ29uY2x1ZGVcIiwgSlNPTi5zdHJpbmdpZnkobWV0aG9kUGFyYW1ldGVycyksIGZ1bmN0aW9uIChqcVhIUikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbW1hbmRSZXN1bHQgPSBCaWZyb3N0LmNvbW1hbmRzLkNvbW1hbmRSZXN1bHQuY3JlYXRlRnJvbShqcVhIUi5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlzU3VjY2VzcyA9IGlzUmVxdWVzdFN1Y2Nlc3MoanFYSFIsIGNvbW1hbmRSZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzU3VjY2VzcyA9PT0gdHJ1ZSAmJiB0eXBlb2Ygc3VjY2VzcyA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyhzYWdhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpc1N1Y2Nlc3MgPT09IGZhbHNlICYmIHR5cGVvZiBlcnJvciA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3Ioc2FnYSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0pKCk7XHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tZXNzYWdpbmdcIiwge1xyXG4gICAgTWVzc2VuZ2VyOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc3Vic2NyaWJlcnMgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5wdWJsaXNoID0gZnVuY3Rpb24gKHRvcGljLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIGlmIChzdWJzY3JpYmVycy5oYXNPd25Qcm9wZXJ0eSh0b3BpYykpIHtcclxuICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzW3RvcGljXS5zdWJzY3JpYmVycy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbShtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zdWJzY3JpYmVUbyA9IGZ1bmN0aW9uICh0b3BpYywgc3Vic2NyaWJlcikge1xyXG4gICAgICAgICAgICB2YXIgc3Vic2NyaWJlcnNCeVRvcGljO1xyXG5cclxuICAgICAgICAgICAgaWYgKHN1YnNjcmliZXJzLmhhc093blByb3BlcnR5KHRvcGljKSkge1xyXG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlcnNCeVRvcGljID0gc3Vic2NyaWJlcnNbdG9waWNdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlcnNCeVRvcGljID0geyBzdWJzY3JpYmVyczogW10gfTtcclxuICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzW3RvcGljXSA9IHN1YnNjcmliZXJzQnlUb3BpYztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc3Vic2NyaWJlcnNCeVRvcGljLnN1YnNjcmliZXJzLnB1c2goc3Vic2NyaWJlcik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcHVibGlzaDogdGhpcy5wdWJsaXNoLFxyXG4gICAgICAgICAgICBzdWJzY3JpYmVUbzogdGhpcy5zdWJzY3JpYmVUb1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5tZXNzYWdpbmcuTWVzc2VuZ2VyLmdsb2JhbCA9IEJpZnJvc3QubWVzc2FnaW5nLk1lc3Nlbmdlci5jcmVhdGUoKTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy5nbG9iYWxNZXNzZW5nZXIgPSBCaWZyb3N0Lm1lc3NhZ2luZy5NZXNzZW5nZXIuZ2xvYmFsO1xyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWVzc2FnaW5nXCIsIHtcclxuICAgIG1lc3NlbmdlckZhY3Rvcnk6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG1lc3NlbmdlciA9IEJpZnJvc3QubWVzc2FnaW5nLk1lc3Nlbmdlci5jcmVhdGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIG1lc3NlbmdlcjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdsb2JhbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEJpZnJvc3QubWVzc2FnaW5nLk1lc3Nlbmdlci5nbG9iYWw7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLm1lc3NlbmdlckZhY3RvcnkgPSBCaWZyb3N0Lm1lc3NhZ2luZy5tZXNzZW5nZXJGYWN0b3J5OyIsImlmICh0eXBlb2Yga28gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICBrby5vYnNlcnZhYmxlTWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlLCBkZWZhdWx0VmFsdWUpIHtcclxuICAgICAgICB2YXIgb2JzZXJ2YWJsZSA9IGtvLm9ic2VydmFibGUoZGVmYXVsdFZhbHVlKTtcclxuXHJcbiAgICAgICAgdmFyIGludGVybmFsID0gZmFsc2U7XHJcbiAgICAgICAgb2JzZXJ2YWJsZS5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmIChpbnRlcm5hbCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIEJpZnJvc3QubWVzc2FnaW5nLk1lc3Nlbmdlci5nbG9iYWwucHVibGlzaChtZXNzYWdlLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIEJpZnJvc3QubWVzc2FnaW5nLk1lc3Nlbmdlci5nbG9iYWwuc3Vic2NyaWJlVG8obWVzc2FnZSwgZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGludGVybmFsID0gdHJ1ZTtcclxuICAgICAgICAgICAgb2JzZXJ2YWJsZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIGludGVybmFsID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGU7XHJcbiAgICB9O1xyXG59IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnNlcnZpY2VzXCIsIHtcclxuICAgIFNlcnZpY2U6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy51cmwgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHByZXBhcmVBcmd1bWVudHMoYXJncykge1xyXG4gICAgICAgICAgICB2YXIgcHJlcGFyZWQgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGFyZ3MpIHtcclxuICAgICAgICAgICAgICAgIHByZXBhcmVkW3Byb3BlcnR5XSA9IEpTT04uc3RyaW5naWZ5KGFyZ3NbcHJvcGVydHldKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHN0cmluZ2lmaWVkID0gSlNPTi5zdHJpbmdpZnkocHJlcGFyZWQpO1xyXG4gICAgICAgICAgICByZXR1cm4gc3RyaW5naWZpZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBjYWxsKG1ldGhvZCwgYXJncywgY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHVybDogc2VsZi51cmwgKyBcIi9cIiArIG1ldGhvZCxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBwcmVwYXJlQXJndW1lbnRzKGFyZ3MpLFxyXG4gICAgICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyxcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHYgPSAkLnBhcnNlSlNPTihyZXN1bHQucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayh2KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5jYWxsV2l0aG91dFJldHVyblZhbHVlID0gZnVuY3Rpb24gKG1ldGhvZCwgYXJncykge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIGNhbGwobWV0aG9kLCBhcmdzLCBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY2FsbFdpdGhPYmplY3RBc1JldHVybiA9IGZ1bmN0aW9uIChtZXRob2QsIGFyZ3MpIHtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgICAgICBjYWxsKG1ldGhvZCwgYXJncywgZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlKHYpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY2FsbFdpdGhBcnJheUFzUmV0dXJuID0gZnVuY3Rpb24gKG1ldGhvZCwgYXJncykge1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICAgICAgY2FsbChtZXRob2QsIGFyZ3MsIGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSh2KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9uQ3JlYXRlZCA9IGZ1bmN0aW9uIChsYXN0RGVzY2VuZGFudCkge1xyXG4gICAgICAgICAgICBzZWxmLnVybCA9IGxhc3REZXNjZW5kYW50LnVybDtcclxuICAgICAgICAgICAgaWYgKHNlbGYudXJsLmluZGV4T2YoXCIvXCIpICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnVybCA9IFwiL1wiICsgc2VsZi51cmw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYubmFtZSA9IGxhc3REZXNjZW5kYW50Lm5hbWU7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QuZGVwZW5kZW5jeVJlc29sdmVycy5zZXJ2aWNlID0ge1xyXG4gICAgY2FuUmVzb2x2ZTogZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygc2VydmljZXMgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5hbWUgaW4gc2VydmljZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVzb2x2ZTogZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgIHJldHVybiBzZXJ2aWNlc1tuYW1lXS5jcmVhdGUoKTtcclxuICAgIH1cclxufTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgZG9jdW1lbnRTZXJ2aWNlOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoRE9NUm9vdCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5ET01Sb290ID0gRE9NUm9vdDtcclxuXHJcbiAgICAgICAgdGhpcy5wYWdlSGFzVmlld01vZGVsID0gZnVuY3Rpb24gKHZpZXdNb2RlbCkge1xyXG4gICAgICAgICAgICB2YXIgY29udGV4dCA9IGtvLmNvbnRleHRGb3IoJChcImJvZHlcIilbMF0pO1xyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc1VuZGVmaW5lZChjb250ZXh0KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZXh0LiRkYXRhID09PSB2aWV3TW9kZWw7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRWaWV3TW9kZWxOYW1lRm9yID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdmFyIGRhdGFWaWV3TW9kZWxOYW1lID0gZWxlbWVudC5hdHRyaWJ1dGVzLmdldE5hbWVkSXRlbShcImRhdGEtdmlld21vZGVsLW5hbWVcIik7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGRhdGFWaWV3TW9kZWxOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgZGF0YVZpZXdNb2RlbE5hbWUgPSBkb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGUoXCJkYXRhLXZpZXdtb2RlbC1uYW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgZGF0YVZpZXdNb2RlbE5hbWUudmFsdWUgPSBCaWZyb3N0Lkd1aWQuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxlbWVudC5hdHRyaWJ1dGVzLnNldE5hbWVkSXRlbShkYXRhVmlld01vZGVsTmFtZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhVmlld01vZGVsTmFtZS52YWx1ZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNldFZpZXdNb2RlbFBhcmFtZXRlcnNPbiA9IGZ1bmN0aW9uIChlbGVtZW50LCBwYXJhbWV0ZXJzKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQudmlld01vZGVsUGFyYW1ldGVycyA9IHBhcmFtZXRlcnM7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRWaWV3TW9kZWxQYXJhbWV0ZXJzRnJvbSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50LnZpZXdNb2RlbFBhcmFtZXRlcnM7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5oYXNWaWV3TW9kZWxQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGVsZW1lbnQudmlld01vZGVsUGFyYW1ldGVycyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jbGVhbkNoaWxkcmVuT2YgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBzZWxmLnRyYXZlcnNlT2JqZWN0cyhmdW5jdGlvbiAoY2hpbGQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZCAhPT0gZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoY2hpbGQpLnVuYmluZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGtvLmNsZWFuTm9kZShjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIGVsZW1lbnQpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuaGFzVmlld0ZpbGUgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlID0gZWxlbWVudC5hdHRyaWJ1dGVzW1wiZGF0YS12aWV3LWZpbGVcIl07XHJcbiAgICAgICAgICAgIHJldHVybiAhQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChhdHRyaWJ1dGUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0Vmlld0ZpbGVGcm9tID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuaGFzVmlld0ZpbGUoZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGUgPSBlbGVtZW50LmF0dHJpYnV0ZXNbXCJkYXRhLXZpZXctZmlsZVwiXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGUudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuaGFzT3duUmVnaW9uID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkNoZWNrIGlmIGVsZW1lbnQgaGFzIGl0cyBvd24gcmVnaW9uPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJlbGVtZW50XCIgdHlwZT1cIkhUTUxFbGVtZW50XCI+SFRNTCBFbGVtZW50IHRvIGNoZWNrPC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxyZXR1cm5zPnRydWUgaWYgaXQgaGFzIGl0cyBvd24gcmVnaW9uLCBmYWxzZSBpdCBub3Q8L3JldHVybnM+XHJcblxyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5yZWdpb24pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldFBhcmVudFJlZ2lvbkZvciA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5HZXQgdGhlIHBhcmVudCByZWdpb24gZm9yIGEgZ2l2ZW4gZWxlbWVudDwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiZWxlbWVudFwiIHR5cGU9XCJIVE1MRWxlbWVudFwiPkhUTUwgRWxlbWVudCB0byBnZXQgZm9yPC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxyZXR1cm5zPkFuIGluc3RhbmNlIG9mIHRoZSByZWdpb24sIGlmIG5vIHJlZ2lvbiBpcyBmb3VuZCBpdCB3aWxsIHJldHVybiBudWxsPC9yZXR1cm5zPlxyXG4gICAgICAgICAgICB2YXIgZm91bmQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKGVsZW1lbnQucGFyZW50Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcclxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnJlZ2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50LnJlZ2lvbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZvdW5kO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0UmVnaW9uRm9yID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkdldCByZWdpb24gZm9yIGFuIGVsZW1lbnQsIGVpdGhlciBkaXJlY3RseSBvciBpbXBsaWNpdGx5IHRocm91Z2ggdGhlIG5lYXJlc3QgcGFyZW50LCBudWxsIGlmIG5vbmU8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cImVsZW1lbnRcIiB0eXBlPVwiSFRNTEVsZW1lbnRcIj5IVE1MIEVsZW1lbnQgdG8gZ2V0IGZvcjwvcGFyYW0+XHJcbiAgICAgICAgICAgIC8vLyA8cmV0dXJucz5BbiBpbnN0YW5jZSBvZiB0aGUgcmVnaW9uLCBpZiBubyByZWdpb24gaXMgZm91bmQgaXQgd2lsbCByZXR1cm4gbnVsbDwvcmV0dXJucz5cclxuICAgICAgICAgICAgdmFyIGZvdW5kID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LnJlZ2lvbikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQucmVnaW9uO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvdW5kID0gc2VsZi5nZXRQYXJlbnRSZWdpb25Gb3IoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmb3VuZDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNldFJlZ2lvbk9uID0gZnVuY3Rpb24gKGVsZW1lbnQsIHJlZ2lvbikge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+U2V0IHJlZ2lvbiBvbiBhIHNwZWNpZmljIGVsZW1lbnQ8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cImVsZW1lbnRcIiB0eXBlPVwiSFRNTEVsZW1lbnRcIj5IVE1MIEVsZW1lbnQgdG8gc2V0IG9uPC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwicmVnaW9uXCIgdHlwZT1cIkJpZnJvc3Qudmlld3MuUmVnaW9uXCI+UmVnaW9uIHRvIHNldCBvbiBlbGVtZW50PC9wYXJhbT5cclxuXHJcbiAgICAgICAgICAgIGVsZW1lbnQucmVnaW9uID0gcmVnaW9uO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY2xlYXJSZWdpb25PbiA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5DbGVhciByZWdpb24gb24gYSBzcGVjaWZpYyBlbGVtZW50PC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJlbGVtZW50XCIgdHlwZT1cIkhUTUxFbGVtZW50XCI+SFRNTCBFbGVtZW50IHRvIHNldCBvbjwvcGFyYW0+XHJcbiAgICAgICAgICAgIGVsZW1lbnQucmVnaW9uID0gbnVsbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnRyYXZlcnNlT2JqZWN0cyA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5UcmF2ZXJzZSBvYmplY3RzIGFuZCBjYWxsIGJhY2sgZm9yIGVhY2ggZWxlbWVudDwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiY2FsbGJhY2tcIiB0eXBlPVwiRnVuY3Rpb25cIj5DYWxsYmFjayB0byBjYWxsIGZvciBlYWNoIGVsZW1lbnQgZm91bmQ8L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJlbGVtZW50XCIgdHlwZT1cIkhUTUxFbGVtZW50XCIgb3B0aW9uYWw9XCJ0cnVlXCI+T3B0aW9uYWwgcm9vdCBlbGVtZW50PC9wYXJhbT5cclxuICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQgfHwgc2VsZi5ET01Sb290O1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVsZW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCBlbGVtZW50Lmhhc0NoaWxkTm9kZXMoKSApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBlbGVtZW50LmZpcnN0Q2hpbGQ7XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGNoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXh0U2libGluZyA9IGNoaWxkLm5leHRTaWJsaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggY2hpbGQubm9kZVR5cGUgPT09IDEgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnRyYXZlcnNlT2JqZWN0cyhjYWxsYmFjaywgY2hpbGQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkID0gbmV4dFNpYmxpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRVbmlxdWVTdHlsZU5hbWUgPSBmdW5jdGlvbihwcmVmaXgpIHtcclxuICAgICAgICAgICAgdmFyIGlkID0gQmlmcm9zdC5HdWlkLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IHByZWZpeCtcIl9cIitpZDtcclxuICAgICAgICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRTdHlsZSA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBzdHlsZSkge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+QWRkIGEgc3R5bGUgZHluYW1pY2FsbHkgaW50byB0aGUgYnJvd3Nlcjwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwic2VsZWN0b3JcIiB0eXBlPVwiU3RyaW5nXCI+U2VsZWN0b3IgdGhhdCByZXByZXNlbnRzIHRoZSBjbGFzczwvcGFyYW0+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cInN0eWxlXCIgdHlwZT1cIk9iamVjdFwiPktleS92YWx1ZSBwYWlyIG9iamVjdCBmb3Igc3R5bGVzPC9wYXJhbT5cclxuICAgICAgICAgICAgaWYoIWRvY3VtZW50LnN0eWxlU2hlZXRzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgICAgIHZhciBzdHlsZVN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGZvciggdmFyIHByb3BlcnR5IGluIHN0eWxlICkge1xyXG4gICAgICAgICAgICAgICAgc3R5bGVTdHJpbmcgPSBzdHlsZVN0cmluZyArIHByb3BlcnR5ICtcIjpcIiArIHN0eWxlW3Byb3BlcnR5XStcIjtcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdHlsZSA9IHN0eWxlU3RyaW5nO1xyXG5cclxuICAgICAgICAgICAgaWYoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgc3R5bGVTaGVldDtcclxuICAgICAgICAgICAgdmFyIG1lZGlhO1xyXG4gICAgICAgICAgICB2YXIgbWVkaWFUeXBlO1xyXG4gICAgICAgICAgICBpZihkb2N1bWVudC5zdHlsZVNoZWV0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IoIGkgPSAwOyBpIDwgZG9jdW1lbnQuc3R5bGVTaGVldHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihkb2N1bWVudC5zdHlsZVNoZWV0c1tpXS5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbWVkaWEgPSBkb2N1bWVudC5zdHlsZVNoZWV0c1tpXS5tZWRpYTtcclxuICAgICAgICAgICAgICAgICAgICBtZWRpYVR5cGUgPSB0eXBlb2YgbWVkaWE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKG1lZGlhVHlwZSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihtZWRpYSA9PT0gXCJcIiB8fCAobWVkaWEuaW5kZXhPZihcInNjcmVlblwiKSAhPT0gLTEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZVNoZWV0ID0gZG9jdW1lbnQuc3R5bGVTaGVldHNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYobWVkaWFUeXBlID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKG1lZGlhLm1lZGlhVGV4dCA9PT0gXCJcIiB8fCAobWVkaWEubWVkaWFUZXh0LmluZGV4T2YoXCJzY3JlZW5cIikgIT09IC0xKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVTaGVldCA9IGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiggdHlwZW9mIHN0eWxlU2hlZXQgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiggdHlwZW9mIHN0eWxlU2hlZXQgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdHlsZVNoZWV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcclxuICAgICAgICAgICAgICAgIHN0eWxlU2hlZXRFbGVtZW50LnR5cGUgPSBcInRleHQvY3NzXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLmFwcGVuZENoaWxkKHN0eWxlU2hlZXRFbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IoIGkgPSAwOyBpIDwgZG9jdW1lbnQuc3R5bGVTaGVldHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihkb2N1bWVudC5zdHlsZVNoZWV0c1tpXS5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGVTaGVldCA9IGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIG1lZGlhID0gc3R5bGVTaGVldC5tZWRpYTtcclxuICAgICAgICAgICAgICAgIG1lZGlhVHlwZSA9IHR5cGVvZiBtZWRpYTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYobWVkaWFUeXBlID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IoIGkgPSAwOyBpIDwgc3R5bGVTaGVldC5ydWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHN0eWxlU2hlZXQucnVsZXNbaV0uc2VsZWN0b3JUZXh0ICYmIHN0eWxlU2hlZXQucnVsZXNbaV0uc2VsZWN0b3JUZXh0LnRvTG93ZXJDYXNlKCkgPT09IHNlbGVjdG9yLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVTaGVldC5ydWxlc1tpXS5zdHlsZS5jc3NUZXh0ID0gc3R5bGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc3R5bGVTaGVldC5hZGRSdWxlKHNlbGVjdG9yLCBzdHlsZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZihtZWRpYVR5cGUgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgICAgIGZvciggaSA9IDA7IGkgPCBzdHlsZVNoZWV0LmNzc1J1bGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc3R5bGVTaGVldC5jc3NSdWxlc1tpXS5zZWxlY3RvclRleHQgJiYgc3R5bGVTaGVldC5jc3NSdWxlc1tpXS5zZWxlY3RvclRleHQudG9Mb3dlckNhc2UoKSA9PT0gc2VsZWN0b3IudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZVNoZWV0LmNzc1J1bGVzW2ldLnN0eWxlLmNzc1RleHQgPSBzdHlsZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzdHlsZVNoZWV0Lmluc2VydFJ1bGUoc2VsZWN0b3IgKyBcIntcIiArIHN0eWxlICsgXCJ9XCIsIDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXJrdXBcIiwge1xyXG4gICAgQmluZGluZ0NvbnRleHQ6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmN1cnJlbnQgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmNoYW5nZWQgPSBCaWZyb3N0LkV2ZW50LmNyZWF0ZSgpO1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcmt1cFwiLCB7XHJcbiAgICBiaW5kaW5nQ29udGV4dE1hbmFnZXI6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5lbnN1cmUgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBzcGVjaWZpYyBiaW5kaW5nQ29udGV4dCBmb3IgZWxlbWVudCwgcmV0dXJuIGl0XHJcblxyXG4gICAgICAgICAgICAvLyBJZiBubyBzcGVjaWZpYywgZmluZCBuZWFyZXN0IGZyb20gcGFyZW50IGVsZW1lbnRcclxuXHJcbiAgICAgICAgICAgIC8vIElmIG5vIHBhcmVudCBlbGVtZW50IGhhcyBvbmUgZWl0aGVyLCB0aGVyZSBpcyBub25lIC0gcmV0dXJuIG51bGxcclxuXHJcbiAgICAgICAgICAgIC8vIElmIGVsZW1lbnQgaGFzIGFuIGF0dHJpYnV0ZSBvZiBiaW5kaW5nQ29udGV4dCAtIHdlIGNhbiBub3cgY2hhbmdlIGl0IHRvIHdoYXQgaXQgaXMgcG9pbnRpbmcgYXRcclxuXHJcbiAgICAgICAgICAgIC8vIElmIGJpbmRpbmdDb250ZXh0IGNoYW5nZXMgZHVlIHRvIGEgYmluZGluZyBiZWluZyByZWxhdGVkIHRvIHRoZSBjb250ZXh0IGZyb20gdGhlIGF0dHJpYnV0ZSBvbiB0aGUgZWxlbWVudCwgaXQgc2hvdWxkIGZpcmUgdGhlIGNoYW5nZWQgdGhpbmcgb24gdGhlIGJpbmRpbmcgY29udGV4dFxyXG5cclxuICAgICAgICAgICAgLy8gSW5oZXJpdCBmcm9tIHBhcmVudCAtIGFsd2F5cyAtIHBhcmVudCBpcyBwcm90b3R5cGUgb2YgY3VycmVudCwgcG9pbnQgYmFjayB0byBwYXJlbnRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmhhc0ZvciA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0Rm9yID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLmJpbmRpbmdDb250ZXh0TWFuYWdlciA9IEJpZnJvc3QubWFya3VwLmJpbmRpbmdDb250ZXh0TWFuYWdlcjsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFya3VwXCIsIHtcclxuICAgIGF0dHJpYnV0ZVZhbHVlczogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKHZhbHVlUHJvdmlkZXJQYXJzZXIpIHtcclxuICAgICAgICB0aGlzLmV4cGFuZEZvciA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcblxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFya3VwXCIsIHtcclxuICAgIHZhbHVlUHJvdmlkZXJQYXJzZXI6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICh2YWx1ZVByb3ZpZGVycywgdmFsdWVDb25zdW1lcnMsIHR5cGVDb252ZXJ0ZXJzKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJ7eyhbYS16ICw6e3t9fX1dKil9fVwiLCBcImdcIik7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVZhbHVlKGluc3RhbmNlLCBwcm9wZXJ0eSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgdmFyIGNvbnN1bWVyID0gdmFsdWVDb25zdW1lcnMuZ2V0Rm9yKGluc3RhbmNlLCBwcm9wZXJ0eSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VsZi5oYXNWYWx1ZVByb3ZpZGVyKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3ZpZGVycyA9IHNlbGYucGFyc2VGb3IoaW5zdGFuY2UsIHByb3BlcnR5LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBwcm92aWRlcnMuZm9yRWFjaChmdW5jdGlvbiAocHJvdmlkZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlci5wcm92aWRlKGNvbnN1bWVyKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3VtZXIuY29uc3VtZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLmhhc1ZhbHVlUHJvdmlkZXIgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHZhbHVlLm1hdGNoKHJlZ2V4KTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnBhcnNlRm9yID0gZnVuY3Rpb24gKGluc3RhbmNlLCBuYW1lLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICB2YXIgcHJvdmlkZXJzID0gW107XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB2YWx1ZS5tYXRjaChyZWdleCk7XHJcbiAgICAgICAgICAgIHZhciBleHByZXNzaW9uID0gcmVzdWx0WzBdLnN1YnN0cigyLCByZXN1bHRbMF0ubGVuZ3RoIC0gNCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcnggPSBuZXcgUmVnRXhwKFwiKFthLXpdKikgK1wiLCBcImdcIik7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGV4cHJlc3Npb24ubWF0Y2gocngpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlUHJvdmlkZXJOYW1lID0gcmVzdWx0WzBdLnRyaW0oKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVQcm92aWRlcnMuaXNLbm93bih2YWx1ZVByb3ZpZGVyTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvdmlkZXIgPSB2YWx1ZVByb3ZpZGVycy5nZXRJbnN0YW5jZU9mKHZhbHVlUHJvdmlkZXJOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnMucHVzaChwcm92aWRlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChleHByZXNzaW9uLmxlbmd0aCA+IHJlc3VsdFswXS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbmZpZ3VyYXRpb25TdHJpbmcgPSBleHByZXNzaW9uLnN1YnN0cihyZXN1bHRbMF0ubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gY29uZmlndXJhdGlvblN0cmluZy5zcGxpdChcIixcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC50cmltKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGtleVZhbHVlUGFpciA9IGVsZW1lbnQuc3BsaXQoXCI6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleVZhbHVlUGFpci5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzb21ldGhpbmcgaXMgd3JvbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXlWYWx1ZVBhaXIubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVmFsdWUgb25seVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPbmx5IHZhbGlkIGlmIHZhbHVlIHByb3ZpZGVyIGhhcyBkZWZhdWx0IHByb3BlcnR5IGFuZCB0aGF0IHByb3BlcnR5IGV4aXN0XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGtleVZhbHVlUGFpclswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVWYWx1ZShwcm92aWRlciwgcHJvdmlkZXIuZGVmYXVsdFByb3BlcnR5LCB2YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChrZXlWYWx1ZVBhaXIubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUHJvcGVydHkgYW5kIHZhbHVlXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEludmFsaWQgaWYgcHJvcGVydHkgZG9lcyBub3QgZXhpc3RcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlVmFsdWUocHJvdmlkZXIsIGtleVZhbHVlUGFpclswXSwga2V5VmFsdWVQYWlyWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc29tZXRoaW5nIGlzIHdyb25nIC0gdGhlcmUgYXJlIHRvbyBtYW55XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvdmlkZXJzO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFya3VwXCIsIHtcclxuICAgIEVsZW1lbnRWaXNpdG9yOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMudmlzaXQgPSBmdW5jdGlvbiAoZWxlbWVudCwgcmVzdWx0QWN0aW9ucykge1xyXG5cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcmt1cFwiLCB7XHJcbiAgICBFbGVtZW50VmlzaXRvclJlc3VsdEFjdGlvbnM6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcmt1cFwiLCB7XHJcbiAgICBvYmplY3RNb2RlbEZhY3Rvcnk6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uIChkZXBlbmRlbmN5UmVzb2x2ZXIsIGRvY3VtZW50U2VydmljZSkge1xyXG5cclxuICAgICAgICBmdW5jdGlvbiB0cnlSZXNvbHZlVGFyZ2V0TmFtZXNwYWNlcyhsb2NhbE5hbWUsIHRhcmdldHMsIHN1Y2Nlc3MsIGVycm9yKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHRyeVJlc29sdmUocXVldWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmFtZXNwYWNlID0gQmlmcm9zdC5uYW1lc3BhY2UodGFyZ2V0cy5zaGlmdCgpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlLl9zY3JpcHRzLmZvckVhY2goZnVuY3Rpb24gKHNjcmlwdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2NyaXB0LnRvTG93ZXJDYXNlKCkgPT09IGxvY2FsTmFtZS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXBlbmRlbmN5UmVzb2x2ZXIuYmVnaW5SZXNvbHZlKG5hbWVzcGFjZSwgc2NyaXB0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jb250aW51ZVdpdGgoZnVuY3Rpb24gKGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MoaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uRmFpbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeVJlc29sdmVUYXJnZXROYW1lc3BhY2VzKGxvY2FsTmFtZSwgdGFyZ2V0cywgc3VjY2VzcywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZm91bmQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5UmVzb2x2ZVRhcmdldE5hbWVzcGFjZXMobG9jYWxOYW1lLCB0YXJnZXRzLCBzdWNjZXNzLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRyeVJlc29sdmUodGFyZ2V0cyk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGVGcm9tID0gZnVuY3Rpb24gKGVsZW1lbnQsIGxvY2FsTmFtZSwgbmFtZXNwYWNlRGVmaW5pdGlvbiwgc3VjY2VzcywgZXJyb3IpIHtcclxuICAgICAgICAgICAgdHJ5UmVzb2x2ZVRhcmdldE5hbWVzcGFjZXMobG9jYWxOYW1lLCBuYW1lc3BhY2VEZWZpbml0aW9uLnRhcmdldHMsIHN1Y2Nlc3MsIGVycm9yKTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcmt1cFwiLCB7XHJcbiAgICBNdWx0aXBsZU5hbWVzcGFjZXNJbk5hbWVOb3RBbGxvd2VkOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICh0YWdOYW1lKSB7XHJcbiAgICAgICAgLy9cIlN5bnRheCBlcnJvcjogdGFnbmFtZSAnXCIgKyBuYW1lICsgXCInIGhhcyBtdWx0aXBsZSBuYW1lc3BhY2VzXCI7XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFya3VwXCIsIHtcclxuICAgIE11bHRpcGxlUHJvcGVydHlSZWZlcmVuY2VzTm90QWxsb3dlZDogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbih0YWdOYW1lKSB7XHJcbiAgICAgICAgLy8gXCJTeW50YXggZXJyb3I6IHRhZ25hbWUgJ1wiK25hbWUrXCInIGhhcyBtdWx0aXBsZSBwcm9wZXJ0aWVzIGl0cyByZWZlcnJpbmcgdG9cIjtcclxuICAgIH0pXHJcbn0pOyAiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFya3VwXCIsIHtcclxuICAgIFBhcmVudFRhZ05hbWVNaXNtYXRjaGVkOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICh0YWdOYW1lLCBwYXJlbnRUYWdOYW1lKSB7XHJcbiAgICAgICAgLy8gXCJTZXR0aW5nIHByb3BlcnR5IHVzaW5nIHRhZyAnXCIrbmFtZStcIicgZG9lcyBub3QgbWF0Y2ggcGFyZW50IHRhZyBvZiAnXCIrcGFyZW50TmFtZStcIidcIjtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXJrdXBcIiwge1xyXG4gICAgTmFtZXNwYWNlRGVmaW5pdGlvbjogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAocHJlZml4KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMucHJlZml4ID0gcHJlZml4O1xyXG5cclxuICAgICAgICB0aGlzLnRhcmdldHMgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRUYXJnZXQgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHNlbGYudGFyZ2V0cy5wdXNoKHRhcmdldCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXJrdXBcIiwge1xyXG4gICAgbmFtZXNwYWNlRGVmaW5pdGlvbnM6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAocHJlZml4KSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZpbml0aW9uID0gQmlmcm9zdC5tYXJrdXAuTmFtZXNwYWNlRGVmaW5pdGlvbi5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgcHJlZml4OiBwcmVmaXgsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVmaW5pdGlvbjtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcmt1cFwiLCB7XHJcbiAgICBuYW1lc3BhY2VzOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAobmFtZXNwYWNlRGVmaW5pdGlvbnMsIGVsZW1lbnROYW1pbmcpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG5zID0gXCJuczpcIjtcclxuXHJcbiAgICAgICAgdGhpcy5nbG9iYWwgPSBuYW1lc3BhY2VEZWZpbml0aW9ucy5jcmVhdGUoXCJfX2dsb2JhbFwiKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZmluZE5hbWVzcGFjZURlZmluaXRpb25JbkVsZW1lbnRPclBhcmVudChwcmVmaXgsIGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGVsZW1lbnQuX19uYW1lc3BhY2VzKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZvdW5kID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuX19uYW1lc3BhY2VzLmZvckVhY2goZnVuY3Rpb24gKGRlZmluaXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVmaW5pdGlvbi5wcmVmaXggPT09IHByZWZpeCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IGRlZmluaXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZm91bmQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmb3VuZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChlbGVtZW50LnBhcmVudEVsZW1lbnQpIHx8XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnBhcmVudEVsZW1lbnQuY29uc3RydWN0b3IgPT09IEhUTUxIdG1sRWxlbWVudCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgcGFyZW50UmVzdWx0ID0gZmluZE5hbWVzcGFjZURlZmluaXRpb25JbkVsZW1lbnRPclBhcmVudChwcmVmaXgsIGVsZW1lbnQucGFyZW50RWxlbWVudCk7XHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRSZXN1bHQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudFJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5leHBhbmROYW1lc3BhY2VEZWZpbml0aW9ucyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGF0dHJpYnV0ZUluZGV4ID0gMDsgYXR0cmlidXRlSW5kZXggPCBlbGVtZW50LmF0dHJpYnV0ZXMubGVuZ3RoOyBhdHRyaWJ1dGVJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlID0gZWxlbWVudC5hdHRyaWJ1dGVzW2F0dHJpYnV0ZUluZGV4XTtcclxuICAgICAgICAgICAgICAgIGlmKCBhdHRyaWJ1dGUubmFtZS5pbmRleE9mKG5zKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcmVmaXggPSBhdHRyaWJ1dGUubmFtZS5zdWJzdHIobnMubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gYXR0cmlidXRlLnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmFtZXNwYWNlRGVmaW5pdGlvbiA9IGZpbmROYW1lc3BhY2VEZWZpbml0aW9uSW5FbGVtZW50T3JQYXJlbnQocHJlZml4LCBlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChuYW1lc3BhY2VEZWZpbml0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChlbGVtZW50Ll9fbmFtZXNwYWNlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuX19uYW1lc3BhY2VzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlRGVmaW5pdGlvbiA9IG5hbWVzcGFjZURlZmluaXRpb25zLmNyZWF0ZShwcmVmaXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50Ll9fbmFtZXNwYWNlcy5wdXNoKG5hbWVzcGFjZURlZmluaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlRGVmaW5pdGlvbi5hZGRUYXJnZXQodGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucmVzb2x2ZUZvciA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBwcmVmaXggPSBlbGVtZW50TmFtaW5nLmdldE5hbWVzcGFjZVByZWZpeEZvcihlbGVtZW50KTtcclxuICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQocHJlZml4KSB8fCBwcmVmaXggPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmdsb2JhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZGVmaW5pdGlvbiA9IGZpbmROYW1lc3BhY2VEZWZpbml0aW9uSW5FbGVtZW50T3JQYXJlbnQocHJlZml4LCBlbGVtZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmluaXRpb247XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXJrdXBcIiwge1xyXG4gICAgZWxlbWVudE5hbWluZzogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXROYW1lQW5kTmFtZXNwYWNlKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdmFyIG5hbWVzcGFjZTtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSBlbGVtZW50LmxvY2FsTmFtZS50b0xvd2VyQ2FzZSgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG5hbWVzcGFjZVNwbGl0ID0gbmFtZS5zcGxpdChcIjpcIik7XHJcbiAgICAgICAgICAgIGlmIChuYW1lc3BhY2VTcGxpdC5sZW5ndGggPiAyKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBCaWZyb3N0Lm1hcmt1cC5NdWx0aXBsZU5hbWVzcGFjZXNJbk5hbWVOb3RBbGxvd2VkLmNyZWF0ZSh7IHRhZ05hbWU6IG5hbWUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5hbWVzcGFjZVNwbGl0Lmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgbmFtZSA9IG5hbWVzcGFjZVNwbGl0WzFdO1xyXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlID0gbmFtZXNwYWNlU3BsaXRbMF07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiBuYW1lc3BhY2VcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLmdldE5hbWVzcGFjZVByZWZpeEZvciA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBuYW1lQW5kTmFtZXNwYWNlID0gZ2V0TmFtZUFuZE5hbWVzcGFjZShlbGVtZW50KTtcclxuICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQobmFtZUFuZE5hbWVzcGFjZS5uYW1lc3BhY2UpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmFtZUFuZE5hbWVzcGFjZS5uYW1lc3BhY2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRMb2NhbE5hbWVGb3IgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICB2YXIgbmFtZUFuZE5hbWVzcGFjZSA9IGdldE5hbWVBbmROYW1lc3BhY2UoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lQW5kTmFtZXNwYWNlLm5hbWU7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXJrdXBcIiwge1xyXG4gICAgcHJvcGVydHlFeHBhbmRlcjogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKHZhbHVlUHJvdmlkZXJQYXJzZXIpIHtcclxuICAgICAgICB0aGlzLmV4cGFuZCA9IGZ1bmN0aW9uIChlbGVtZW50LCB0YXJnZXQpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgYXR0cmlidXRlSW5kZXggPSAwOyBhdHRyaWJ1dGVJbmRleCA8IGVsZW1lbnQuYXR0cmlidXRlcy5sZW5ndGg7IGF0dHJpYnV0ZUluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gZWxlbWVudC5hdHRyaWJ1dGVzW2F0dHJpYnV0ZUluZGV4XS5sb2NhbE5hbWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBlbGVtZW50LmF0dHJpYnV0ZXNbYXR0cmlidXRlSW5kZXhdLnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChuYW1lIGluIHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZVByb3ZpZGVyUGFyc2VyLmhhc1ZhbHVlUHJvdmlkZXIodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlUHJvdmlkZXJQYXJzZXIucGFyc2VGb3IodGFyZ2V0LCBuYW1lLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXJrdXBcIiwge1xyXG4gICAgT2JqZWN0TW9kZWxFbGVtZW50VmlzaXRvcjogQmlmcm9zdC5tYXJrdXAuRWxlbWVudFZpc2l0b3IuZXh0ZW5kKGZ1bmN0aW9uIChlbGVtZW50TmFtaW5nLCBuYW1lc3BhY2VzLCBvYmplY3RNb2RlbEZhY3RvcnksIHByb3BlcnR5RXhwYW5kZXIsIFVJRWxlbWVudFByZXBhcmVyLCBhdHRyaWJ1dGVWYWx1ZXMsIGJpbmRpbmdDb250ZXh0TWFuYWdlcikge1xyXG4gICAgICAgIHRoaXMudmlzaXQgPSBmdW5jdGlvbihlbGVtZW50LCBhY3Rpb25zKSB7XHJcbiAgICAgICAgICAgIC8vIFRhZ3MgOlxyXG4gICAgICAgICAgICAvLyAgLSB0YWcgbmFtZXMgYXV0b21hdGljYWxseSBtYXRjaCB0eXBlIG5hbWVzXHJcbiAgICAgICAgICAgIC8vICAtIGR1ZSB0byB0YWcgbmFtZXMgaW4gSFRNTCBlbGVtZW50cyBiZWluZyB3aXRob3V0IGNhc2UgLSB0aGV5IGJlY29tZSBsb3dlciBjYXNlIGluIHRoZVxyXG4gICAgICAgICAgICAvLyAgICBsb2NhbG5hbWUgcHJvcGVydHksIHdlIHdpbGwgaGF2ZSB0byBzZWFyY2ggZm9yIHR5cGUgYnkgbG93ZXJjYXNlXHJcbiAgICAgICAgICAgIC8vICAtIG11bHRpcGxlIHR5cGVzIGZvdW5kIHdpdGggZGlmZmVyZW50IGNhc2luZyBpbiBzYW1lIG5hbWVzcGFjZSBzaG91bGQgdGhyb3cgYW4gZXhjZXB0aW9uXHJcbiAgICAgICAgICAgIC8vIE5hbWVzcGFjZXMgOlxyXG4gICAgICAgICAgICAvLyAgLSBzcGxpdCBieSAnOidcclxuICAgICAgICAgICAgLy8gIC0gaWYgbW9yZSB0aGFuIG9uZSAnOicgLSB0aHJvdyBhbiBleGNlcHRpb25cclxuICAgICAgICAgICAgLy8gIC0gaWYgbm8gbmFtZXNwYWNlIGlzIGRlZmluZWQsIHRyeSB0byByZXNvbHZlIGluIHRoZSBnbG9iYWwgbmFtZXNwYWNlXHJcbiAgICAgICAgICAgIC8vICAtIG5hbWVzcGFjZXMgaW4gdGhlIG9iamVjdCBtb2RlbCBjYW4gcG9pbnQgdG8gbXVsdGlwbGUgSmF2YVNjcmlwdCBuYW1lc3BhY2VzXHJcbiAgICAgICAgICAgIC8vICAtIG11bHRpcGxlIHR5cGVzIHdpdGggc2FtZSBuYW1lIGluIG5hbWVzcGFjZSBncm91cGluZ3Mgc2hvdWxkIHRocm93IGFuIGV4Y2VwdGlvblxyXG4gICAgICAgICAgICAvLyAgLSByZWdpc3RlcmluZyBhIG5hbWVzcGFjZSBjYW4gYmUgZG9uZSBvbiBhbnkgdGFnIGJ5IGFkZGluZyBuczpuYW1lPVwicG9pbnQgdG8gSlMgbmFtZXNwYWNlXCJcclxuICAgICAgICAgICAgLy8gIC0gV2lsZGNhcmQgcmVnaXN0cmF0aW9ucyB0byBjYXB0dXJlIGFueXRoaW5nIGluIGEgbmFtZXNwYWNlIGUuZy4gbnM6Y29udHJvbHM9XCJXZWIuQ29udHJvbHMuKlwiXHJcbiAgICAgICAgICAgIC8vICAtIElmIG9uZSByZWdpc3RlcnMgYSBuYW1lc3BhY2Ugd2l0aCBhIHByZWZpeCBhIHBhcmVudCBhbHJlYWR5IGhhcyBhbmQgbm8gbmFtaW5nIHJvb3Qgc2l0cyBpbiBiZXR3ZWVuLFxyXG4gICAgICAgICAgICAvLyAgICBpdCBzaG91bGQgYWRkIHRoZSBuYW1lc3BhY2UgdGFyZ2V0IG9uIHRoZSBzYW1lIGRlZmluaXRpb25cclxuICAgICAgICAgICAgLy8gIC0gTmFtaW5nIHJvb3RzIGFyZSBpbXBvcnRhbnQgLSBpZiB0aGVyZSBvY2N1cnMgYSBuYW1pbmcgcm9vdCwgZXZlcnl0aGluZyBpcyByZWxhdGl2ZSB0byB0aGF0IGFuZFxyXG4gICAgICAgICAgICAvLyAgICBicmVha2luZyBhbnkgXCJpbmhlcml0YW5jZVwiXHJcbiAgICAgICAgICAgIC8vIFByb3BlcnRpZXMgOlxyXG4gICAgICAgICAgICAvLyAgLSBBdHRyaWJ1dGVzIG9uIGFuIGVsZW1lbnQgaXMgYSBwcm9wZXJ0eVxyXG4gICAgICAgICAgICAvLyAgLSBWYWx1ZXMgaW4gcHJvcGVydHkgc2hvdWxkIGFsd2F5cyBnbyB0aHJvdWdoIHR5cGUgY29udmVyc2lvbiBzdWIgc3lzdGVtXHJcbiAgICAgICAgICAgIC8vICAtIFZhbHVlcyB3aXRoIGVuY2Fwc3VsYXRlZCBpbiB7fSBzaG91bGQgYmUgY29uc2lkZXJlZCBtYXJrdXAgZXh0ZW5zaW9ucywgZ28gdGhyb3VnaFxyXG4gICAgICAgICAgICAvLyAgICBtYXJrdXAgZXh0ZW5zaW9uIHN5c3RlbSBmb3IgcmVzb2x2aW5nIHRoZW0gYW5kIHRoZW4gcGFzcyBvbiB0aGUgcmVzdWx0aW5nIHZhbHVlXHJcbiAgICAgICAgICAgIC8vICAgIHRvIHR5cGUgY29udmVyc2lvbiBzdWIgc3lzdGVtXHJcbiAgICAgICAgICAgIC8vICAtIFByb3BlcnRpZXMgY2FuIGJlIHNldCB3aXRoIHRhZyBzdWZmaXhlZCB3aXRoIC48bmFtZSBvZiBwcm9wZXJ0eT4gLSBtb3JlIHRoYW4gb25lXHJcbiAgICAgICAgICAgIC8vICAgICcuJyBpbiBhIHRhZyBuYW1lIHNob3VsZCB0aHJvdyBhbiBleGNlcHRpb25cclxuICAgICAgICAgICAgLy8gVmFsdWUgUHJvdmlkZXIgOlxyXG4gICAgICAgICAgICAvLyAgLSBBbnkgdmFsdWUgZXNjYXBlZCB3aXRoIHt7IH19IHNob3VsZCBiZSBjb25zaWRlcmVkIGEgdmFsdWUgcHJvdmlkZXJcclxuICAgICAgICAgICAgLy8gVmFsdWUgQ29uc3VtZXIgOlxyXG4gICAgICAgICAgICAvLyAgLSBJbiB0aGUgb3Bwb3NpdGUgZW5kIG9mIGEgdmFsdWUgc2l0cyBhIGNvbnN1bWVyLiBJZiB0aGUgdGFyZ2V0IHByb3BlcnR5IGlzIGEgY29uc3VtZXIsIHBhc3MgdGhpc1xyXG4gICAgICAgICAgICAvLyAgICBpbiB0byB0aGUgdmFsdWUgcHJvdmlkZXIuIElmIHRoZSBwcm9wZXJ0eSBpcyBqdXN0IGEgcmVndWxhciBwcm9wZXJ0eSwgdXNlIHRoZSBkZWZhdWx0IHByb3BlcnR5XHJcbiAgICAgICAgICAgIC8vICAgIHZhbHVlIGNvbnN1bWVyXHJcbiAgICAgICAgICAgIC8vIERlcGVuZGVuY3kgUHJvcGVydGllc1xyXG4gICAgICAgICAgICAvLyAgLSBBIHByb3BlcnR5IHR5cGUgdGhhdCBoYXMgdGhlIGFiaWxpdHkgb2Ygbm90aWZ5aW5nIHNvbWV0aGluZyB3aGVuIGl0IGNoYW5nZXNcclxuICAgICAgICAgICAgLy8gICAgVHlwaWNhbGx5IGEgcHJvcGVydHkgZ2V0cyByZWdpc3RlcmVkIHdpdGggdGhlIGFiaWxpdHkgdG8gb2ZmZXIgYSBjYWxsYmFja1xyXG4gICAgICAgICAgICAvLyAgICBEZXBlbmRlbmN5IHByb3BlcnRpZXMgbmVlZHMgdG8gYmUgZXhwbGljaXRseSBzZXR1cFxyXG4gICAgICAgICAgICAvLyAgLSBBdHRhY2hlZCBkZXBlbmRlbmN5IHByb3BlcnRpZXMgLSBvbmUgc2hvdWxkIGJlIGFibGUgdG8gYXR0YWNoIGRlcGVuZGVuY3kgcHJvcGVydGllc1xyXG4gICAgICAgICAgICAvLyAgICBBZGRpbmcgbmV3IGZ1bmN0aW9uYWxpdHkgdG8gYW4gZXhpc3RpbmcgZWxlbWVudCB0aHJvdWdoIGV4cG9zaW5nIG5ldyBwcm9wZXJ0aWVzIG9uXHJcbiAgICAgICAgICAgIC8vICAgIGV4aXN0aW5nIGVsZW1lbnRzLiBJdCBkb2VzIG5vdCBtYXR0ZXIgd2hhdCBlbGVtZW50cywgaXQgY291bGQgYmUgZXhpc3Rpbmcgb25lcy5cclxuICAgICAgICAgICAgLy8gICAgVGhlIGF0dGFjaGVkIGRlcGVuZGVuY3kgcHJvcGVydHkgZGVmaW5lcyB3aGF0IGl0IGlzIGZvciBieSBzcGVjaWZ5aW5nIGEgdHlwZS4gT25jZVxyXG4gICAgICAgICAgICAvLyAgICB3ZSdyZSBtYXRjaGluZyBhIHBhcnRpY3VsYXIgZGVwZW5kZW5jeSBwcm9wZXJ0eSBpbiB0aGUgbWFya3VwIHdpdGggdGhlIHR5cGUgaXQgc3VwcG9ydHNcclxuICAgICAgICAgICAgLy8gICAgaXRzIGFsbCBnb29kXHJcbiAgICAgICAgICAgIC8vIFNlcnZpY2VzXHJcbiAgICAgICAgICAgIC8vICAtIE5vZGVzIHNob3VsZCBoYXZlIHRoZSBhYmlsaXR5IHRvIHNwZWNpZnkgYSBzZXJ2aWNlIHRoYXQgaXMgcmVsZXZhbnQgZm9yIHRoZSBub2RlLlxyXG4gICAgICAgICAgICAvLyAgICBUaGUgc2VydmljZSB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSBlbGVtZW50IGl0c2VsZi4gSXQgaXMgZGVmaW5lZCBhcyBhbiBhdHRyaWJ1dGUgb25cclxuICAgICAgICAgICAgLy8gICAgYSBub2RlLCBhbnkgdmFsdWVzIGluIHRoZSBhdHRyaWJ1dGUgd2lsbCBiZSBoYW5kZWQgaW4sIG9idmlvdXNseSByZXNvbHZlZCB0aHJvdWdoXHJcbiAgICAgICAgICAgIC8vICAgIHRoZSB2YWx1ZSBwcm92aWRlciBzeXN0ZW0uXHJcbiAgICAgICAgICAgIC8vIENoaWxkIHRhZ3MgOlxyXG4gICAgICAgICAgICAvLyAgLSBDaGlsZHJlbiB3aGljaCBhcmUgbm90IGEgcHJvcGVydHkgcmVmZXJlbmNlIGFyZSBvbmx5IGFsbG93ZWQgaWYgYSBjb250ZW50IG9yXHJcbiAgICAgICAgICAgIC8vICAgIGl0ZW1zIHByb3BlcnR5IGV4aXN0LiBUaGVyZSBjYW4gb25seSBiZSBvbmUgb2YgdGhlIG90aGVyLCB0d28gb2YgZWl0aGVyIG9yIGJvdGhcclxuICAgICAgICAgICAgLy8gICAgYXQgdGhlIHNhbWUgdGltZSBzaG91bGQgeWllbGQgYW4gZXhjZXB0aW9uXHJcbiAgICAgICAgICAgIC8vIFRlbXBsYXRpbmcgOlxyXG4gICAgICAgICAgICAvLyAgLSBJZiBhIFVJRWxlbWVudCBpcyBmb3VuZCwgaXQgd2lsbCBuZWVkIHRvIGJlIGluc3RhbnRpYXRlZFxyXG4gICAgICAgICAgICAvLyAgLSBJZiB0aGUgaW5zdGFuY2UgaXMgb2YgYSBDb250cm9sIHR5cGUgLSB3ZSB3aWxsIGxvb2sgYXQgdGhlXHJcbiAgICAgICAgICAgIC8vICAgIENvbnRyb2xUZW1wbGF0ZSBwcm9wZXJ0eSBmb3IgaXRzIHRlbXBsYXRlIGFuZCB1c2UgdGhhdCB0byByZXBsYWNlIGNvbnRlbnRcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gRXhhbXBsZSA6XHJcbiAgICAgICAgICAgIC8vIFNpbXBsZSBjb250cm9sOlxyXG4gICAgICAgICAgICAvLyA8c29tZWNvbnRyb2wgcHJvcGVydHk9XCI0MlwiLz5cclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gQ29udHJvbCBpbiBkaWZmZXJlbnQgbmFtZXNwYWNlOlxyXG4gICAgICAgICAgICAvLyA8bnM6c29tZWNvbnRyb2wgcHJvcGVydHk9XCI0MlwiLz5cclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gQXNzaWduaW5nIHByb3BlcnR5IHdpdGggdGFnczpcclxuICAgICAgICAgICAgLy8gPG5zOnNvbWVjb250cm9sPlxyXG4gICAgICAgICAgICAvLyAgICA8bnM6c29tZWNvbnRyb2wucHJvcGVydHk+NDI8L25zOnNvbWNvbnRyb2wucHJvcGVydHk+XHJcbiAgICAgICAgICAgIC8vIDwvbnM6c29tZWNvbnRyb2w+XHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vIFVzaW5nIGEgbWFya3VwIGV4dGVuc2lvbjpcclxuICAgICAgICAgICAgLy8gPG5zOnNvbWVjb250cm9sIHNvbWV2YWx1ZT1cInt7YmluZGluZyBwcm9wZXJ0eX19XCI+XHJcbiAgICAgICAgICAgIC8vIDxuczpzb21lY29udHJvbFxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAvLyA8c3Bhbj57e2JpbmRpbmcgcHJvcGVydHl9fTwvc3Bhbj5cclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gPG5zOnNvbWVjb250cm9sPlxyXG4gICAgICAgICAgICAvLyAgICA8bnM6c29tZWNvbnRyb2wucHJvcGVydHk+e3tiaW5kaW5nIHByb3BlcnR5fX08L25zOnNvbWNvbnRyb2wucHJvcGVydHk+XHJcbiAgICAgICAgICAgIC8vIDwvbnM6c29tZWNvbnRyb2w+XHJcblxyXG4gICAgICAgICAgICBuYW1lc3BhY2VzLmV4cGFuZE5hbWVzcGFjZURlZmluaXRpb25zKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICBiaW5kaW5nQ29udGV4dE1hbmFnZXIuZW5zdXJlKGVsZW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuaXNLbm93blR5cGUoKSkge1xyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlVmFsdWVzLmV4cGFuZEZvcihlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGxvY2FsTmFtZSA9IGVsZW1lbnROYW1pbmcuZ2V0TG9jYWxOYW1lRm9yKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB2YXIgbmFtZXNwYWNlRGVmaW5pdGlvbiA9IG5hbWVzcGFjZXMucmVzb2x2ZUZvcihlbGVtZW50KTtcclxuICAgICAgICAgICAgb2JqZWN0TW9kZWxGYWN0b3J5LmNyZWF0ZUZyb20oZWxlbWVudCwgbG9jYWxOYW1lLCBuYW1lc3BhY2VEZWZpbml0aW9uLFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlFeHBhbmRlci5leHBhbmQoZWxlbWVudCwgaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIFVJRWxlbWVudFByZXBhcmVyLnByZXBhcmUoZWxlbWVudCwgaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXJrdXBcIiwge1xyXG4gICAgTmFtaW5nUm9vdDogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmZpbmQgPSBmdW5jdGlvbiAobmFtZSwgZWxlbWVudCkge1xyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChlbGVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoc2VsZi50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gc2VsZi50YXJnZXQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpID09PSBuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuaGFzQ2hpbGROb2RlcygpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBlbGVtZW50LmZpcnN0Q2hpbGQ7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoY2hpbGQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGQubm9kZVR5cGUgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZvdW5kRWxlbWVudCA9IHNlbGYuZmluZChuYW1lLCBjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZEVsZW1lbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZvdW5kRWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGNoaWxkLm5leHRTaWJsaW5nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcmt1cFwiLCB7XHJcbiAgICBVSUVsZW1lbnQ6IEJpZnJvc3QubWFya3VwLk5hbWluZ1Jvb3QuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5wcmVwYXJlID0gZnVuY3Rpb24gKHR5cGUsIGVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXJrdXBcIiwge1xyXG4gICAgVUlFbGVtZW50UHJlcGFyZXI6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnByZXBhcmUgPSBmdW5jdGlvbiAoZWxlbWVudCwgaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLnByZXBhcmUoaW5zdGFuY2UuX3R5cGUsIGVsZW1lbnQpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChpbnN0YW5jZS50ZW1wbGF0ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFVJTWFuYWdlciA9IEJpZnJvc3Qudmlld3MuVUlNYW5hZ2VyLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgVUlNYW5hZ2VyLmhhbmRsZShpbnN0YW5jZS50ZW1wbGF0ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrby5hcHBseUJpbmRpbmdzVG9Ob2RlKGluc3RhbmNlLnRlbXBsYXRlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIndpdGhcIjogaW5zdGFuY2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnBhcmVudEVsZW1lbnQucmVwbGFjZUNoaWxkKGluc3RhbmNlLnRlbXBsYXRlLCBlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFya3VwXCIsIHtcclxuICAgIENvbnRyb2w6IEJpZnJvc3QubWFya3VwLlVJRWxlbWVudC5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnRlbXBsYXRlID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5wcmVwYXJlID0gZnVuY3Rpb24gKHR5cGUsIGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGZpbGUgPSB0eXBlLl9uYW1lc3BhY2UuX3BhdGggKyB0eXBlLl9uYW1lICsgXCIuaHRtbFwiO1xyXG4gICAgICAgICAgICByZXF1aXJlKFtcInRleHQhXCIgKyBmaWxlICsgXCIhc3RyaXBcIl0sIGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSB2O1xyXG4gICAgICAgICAgICAgICAgc2VsZi50ZW1wbGF0ZSA9IGNvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgUG9zdEJpbmRpbmdWaXNpdG9yOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMudmlzaXQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG5cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIFVJTWFuYWdlcjogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24oZG9jdW1lbnRTZXJ2aWNlKSB7XHJcbiAgICAgICAgdmFyIGVsZW1lbnRWaXNpdG9yVHlwZXMgPSBCaWZyb3N0Lm1hcmt1cC5FbGVtZW50VmlzaXRvci5nZXRFeHRlbmRlcnMoKTtcclxuICAgICAgICB2YXIgZWxlbWVudFZpc2l0b3JzID0gW107XHJcbiAgICAgICAgdmFyIHBvc3RCaW5kaW5nVmlzaXRvclR5cGVzID0gQmlmcm9zdC52aWV3cy5Qb3N0QmluZGluZ1Zpc2l0b3IuZ2V0RXh0ZW5kZXJzKCk7XHJcbiAgICAgICAgdmFyIHBvc3RCaW5kaW5nVmlzaXRvcnMgPSBbXTtcclxuXHJcbiAgICAgICAgZWxlbWVudFZpc2l0b3JUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnRWaXNpdG9ycy5wdXNoKHR5cGUuY3JlYXRlKCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBwb3N0QmluZGluZ1Zpc2l0b3JUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgIHBvc3RCaW5kaW5nVmlzaXRvcnMucHVzaCh0eXBlLmNyZWF0ZSgpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGUgPSBmdW5jdGlvbiAocm9vdCkge1xyXG4gICAgICAgICAgICBkb2N1bWVudFNlcnZpY2UudHJhdmVyc2VPYmplY3RzKGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnRWaXNpdG9ycy5mb3JFYWNoKGZ1bmN0aW9uKHZpc2l0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYWN0aW9ucyA9IEJpZnJvc3QubWFya3VwLkVsZW1lbnRWaXNpdG9yUmVzdWx0QWN0aW9ucy5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB2aXNpdG9yLnZpc2l0KGVsZW1lbnQsIGFjdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sIHJvb3QpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlUG9zdEJpbmRpbmcgPSBmdW5jdGlvbiAocm9vdCkge1xyXG4gICAgICAgICAgICBkb2N1bWVudFNlcnZpY2UudHJhdmVyc2VPYmplY3RzKGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICBwb3N0QmluZGluZ1Zpc2l0b3JzLmZvckVhY2goZnVuY3Rpb24gKHZpc2l0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICB2aXNpdG9yLnZpc2l0KGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sIHJvb3QpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy5VSU1hbmFnZXIgPSBCaWZyb3N0LnZpZXdzLlVJTWFuYWdlcjsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgQ29udGVudDogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIEl0ZW1zOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgQ29tcG9zZVRhc2s6IEJpZnJvc3QudGFza3MuVGFzay5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGEgYmFzZSB0YXNrIHRoYXQgcmVwcmVzZW50cyBhbnl0aGluZyB0aGF0IGlzIGV4ZWN1dGluZzwvc3VtbWFyeT5cclxuICAgICAgICB0aGlzLmV4ZWN1dGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICB2aWV3TWFuYWdlcjogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKHZpZXdGYWN0b3J5LCBwYXRoUmVzb2x2ZXJzLCByZWdpb25NYW5hZ2VyLCBVSU1hbmFnZXIsIHZpZXdNb2RlbE1hbmFnZXIsIHZpZXdNb2RlbExvYWRlciwgdmlld01vZGVsVHlwZXMsIGRvY3VtZW50U2VydmljZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNldFZpZXdNb2RlbEZvckVsZW1lbnQoZWxlbWVudCwgdmlld01vZGVsKSB7XHJcbiAgICAgICAgICAgIHZpZXdNb2RlbE1hbmFnZXIubWFzdGVyVmlld01vZGVsLnNldEZvcihlbGVtZW50LCB2aWV3TW9kZWwpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHZpZXdNb2RlbE5hbWUgPSBkb2N1bWVudFNlcnZpY2UuZ2V0Vmlld01vZGVsTmFtZUZvcihlbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBkYXRhQmluZFN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIHZhciBkYXRhQmluZCA9IGVsZW1lbnQuYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oXCJkYXRhLWJpbmRcIik7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChkYXRhQmluZCkpIHtcclxuICAgICAgICAgICAgICAgIGRhdGFCaW5kU3RyaW5nID0gZGF0YUJpbmQudmFsdWUgKyBcIiwgXCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhQmluZCA9IGRvY3VtZW50LmNyZWF0ZUF0dHJpYnV0ZShcImRhdGEtYmluZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkYXRhQmluZC52YWx1ZSA9IGRhdGFCaW5kU3RyaW5nICsgXCJ2aWV3TW9kZWw6ICRyb290WydcIiArIHZpZXdNb2RlbE5hbWUgKyBcIiddXCI7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuYXR0cmlidXRlcy5zZXROYW1lZEl0ZW0oZGF0YUJpbmQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplTGFuZGluZ1BhZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgdmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xyXG4gICAgICAgICAgICBpZiAoYm9keSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZpbGUgPSBCaWZyb3N0LlBhdGguZ2V0RmlsZW5hbWVXaXRob3V0RXh0ZW5zaW9uKGRvY3VtZW50LmxvY2F0aW9uLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGZpbGUgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWxlID0gXCJpbmRleFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwYXRoUmVzb2x2ZXJzLmNhblJlc29sdmUoYm9keSwgZmlsZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYWN0dWFsUGF0aCA9IHBhdGhSZXNvbHZlcnMucmVzb2x2ZShib2R5LCBmaWxlKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmlldyA9IHZpZXdGYWN0b3J5LmNyZWF0ZUZyb20oYWN0dWFsUGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5lbGVtZW50ID0gYm9keTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LmNvbnRlbnQgPSBib2R5LmlubmVySFRNTDtcclxuICAgICAgICAgICAgICAgICAgICBib2R5LnZpZXcgPSB2aWV3O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVnaW9uID0gcmVnaW9uTWFuYWdlci5nZXRGb3Iodmlldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVnaW9uTWFuYWdlci5kZXNjcmliZSh2aWV3LCByZWdpb24pLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2aWV3TW9kZWxNYW5hZ2VyLmhhc0ZvclZpZXcoYWN0dWFsUGF0aCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2aWV3TW9kZWxQYXRoID0gdmlld01vZGVsTWFuYWdlci5nZXRWaWV3TW9kZWxQYXRoRm9yVmlldyhhY3R1YWxQYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdmlld01vZGVsTWFuYWdlci5pc0xvYWRlZCh2aWV3TW9kZWxQYXRoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdNb2RlbExvYWRlci5sb2FkKHZpZXdNb2RlbFBhdGgsIHJlZ2lvbikuY29udGludWVXaXRoKGZ1bmN0aW9uICh2aWV3TW9kZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHZpZXdNb2RlbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFZpZXdNb2RlbEZvckVsZW1lbnQoYm9keSwgdmlld01vZGVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3TW9kZWxUeXBlcy5iZWdpbkNyZWF0ZUluc3RhbmNlT2ZWaWV3TW9kZWwodmlld01vZGVsUGF0aCwgcmVnaW9uKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHZpZXdNb2RlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodmlld01vZGVsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Vmlld01vZGVsRm9yRWxlbWVudChib2R5LCB2aWV3TW9kZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFVJTWFuYWdlci5oYW5kbGUoYm9keSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hdHRhY2ggPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBVSU1hbmFnZXIuaGFuZGxlKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB2aWV3TW9kZWxNYW5hZ2VyLm1hc3RlclZpZXdNb2RlbC5hcHBseVRvKGVsZW1lbnQpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy52aWV3TWFuYWdlciA9IEJpZnJvc3Qudmlld3Mudmlld01hbmFnZXI7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIFBhdGhSZXNvbHZlcjogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jYW5SZXNvbHZlID0gZnVuY3Rpb24gKGVsZW1lbnQsIHBhdGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucmVzb2x2ZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBwYXRoKSB7XHJcblxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgcGF0aFJlc29sdmVyczogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRSZXNvbHZlcnMoKSB7XHJcbiAgICAgICAgICAgIHZhciByZXNvbHZlcnMgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gQmlmcm9zdC52aWV3cy5wYXRoUmVzb2x2ZXJzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC52aWV3cy5wYXRoUmVzb2x2ZXJzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IEJpZnJvc3Qudmlld3MucGF0aFJlc29sdmVyc1twcm9wZXJ0eV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiB2YWx1ZS5jcmVhdGUgPT09IFwiZnVuY3Rpb25cIikge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc29sdmVyID0gdmFsdWUuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzb2x2ZXIuY2FuUmVzb2x2ZSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlcnMucHVzaChyZXNvbHZlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVycztcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLmNhblJlc29sdmUgPSBmdW5jdGlvbiAoZWxlbWVudCwgcGF0aCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzb2x2ZXJzID0gZ2V0UmVzb2x2ZXJzKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHJlc29sdmVySW5kZXggPSAwOyByZXNvbHZlckluZGV4IDwgcmVzb2x2ZXJzLmxlbmd0aDsgcmVzb2x2ZXJJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzb2x2ZXIgPSByZXNvbHZlcnNbcmVzb2x2ZXJJbmRleF07XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gcmVzb2x2ZXIuY2FuUmVzb2x2ZShlbGVtZW50LCBwYXRoKTtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXNvbHZlID0gZnVuY3Rpb24gKGVsZW1lbnQsIHBhdGgpIHtcclxuICAgICAgICAgICAgdmFyIHJlc29sdmVycyA9IGdldFJlc29sdmVycygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciByZXNvbHZlckluZGV4ID0gMDsgcmVzb2x2ZXJJbmRleCA8IHJlc29sdmVycy5sZW5ndGg7IHJlc29sdmVySW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc29sdmVyID0gcmVzb2x2ZXJzW3Jlc29sdmVySW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc29sdmVyLmNhblJlc29sdmUoZWxlbWVudCwgcGF0aCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZXIucmVzb2x2ZShlbGVtZW50LCBwYXRoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIFVyaU1hcHBlclBhdGhSZXNvbHZlcjogQmlmcm9zdC52aWV3cy5QYXRoUmVzb2x2ZXIuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmNhblJlc29sdmUgPSBmdW5jdGlvbiAoZWxlbWVudCwgcGF0aCkge1xyXG4gICAgICAgICAgICB2YXIgY2xvc2VzdCA9ICQoZWxlbWVudCkuY2xvc2VzdChcIltkYXRhLXVyaW1hcHBlcl1cIik7XHJcbiAgICAgICAgICAgIGlmIChjbG9zZXN0Lmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hcHBlck5hbWUgPSAkKGNsb3Nlc3RbMF0pLmRhdGEoXCJ1cmltYXBwZXJcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC51cmlNYXBwZXJzW21hcHBlck5hbWVdLmhhc01hcHBpbmdGb3IocGF0aCkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gQmlmcm9zdC51cmlNYXBwZXJzLmRlZmF1bHQuaGFzTWFwcGluZ0ZvcihwYXRoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnJlc29sdmUgPSBmdW5jdGlvbiAoZWxlbWVudCwgcGF0aCkge1xyXG4gICAgICAgICAgICB2YXIgY2xvc2VzdCA9ICQoZWxlbWVudCkuY2xvc2VzdChcIltkYXRhLXVyaW1hcHBlcl1cIik7XHJcbiAgICAgICAgICAgIGlmIChjbG9zZXN0Lmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hcHBlck5hbWUgPSAkKGNsb3Nlc3RbMF0pLmRhdGEoXCJ1cmltYXBwZXJcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC51cmlNYXBwZXJzW21hcHBlck5hbWVdLmhhc01hcHBpbmdGb3IocGF0aCkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQmlmcm9zdC51cmlNYXBwZXJzW21hcHBlck5hbWVdLnJlc29sdmUocGF0aCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIEJpZnJvc3QudXJpTWFwcGVycy5kZWZhdWx0LnJlc29sdmUocGF0aCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5pZiAodHlwZW9mIEJpZnJvc3Qudmlld3MucGF0aFJlc29sdmVycyAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgQmlmcm9zdC52aWV3cy5wYXRoUmVzb2x2ZXJzLlVyaU1hcHBlclBhdGhSZXNvbHZlciA9IEJpZnJvc3Qudmlld3MuVXJpTWFwcGVyUGF0aFJlc29sdmVyO1xyXG59IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIFJlbGF0aXZlUGF0aFJlc29sdmVyOiBCaWZyb3N0LnZpZXdzLlBhdGhSZXNvbHZlci5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY2FuUmVzb2x2ZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBwYXRoKSB7XHJcbiAgICAgICAgICAgIHZhciBjbG9zZXN0ID0gJChlbGVtZW50KS5jbG9zZXN0KFwiW2RhdGEtdmlld11cIik7XHJcbiAgICAgICAgICAgIGlmIChjbG9zZXN0Lmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZpZXcgPSAkKGNsb3Nlc3RbMF0pLnZpZXc7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnJlc29sdmUgPSBmdW5jdGlvbiAoZWxlbWVudCwgcGF0aCkge1xyXG4gICAgICAgICAgICB2YXIgY2xvc2VzdCA9ICQoZWxlbWVudCkuY2xvc2VzdChcIltkYXRhLXVyaW1hcHBlcl1cIik7XHJcbiAgICAgICAgICAgIGlmIChjbG9zZXN0Lmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hcHBlck5hbWUgPSAkKGNsb3Nlc3RbMF0pLmRhdGEoXCJ1cmltYXBwZXJcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC51cmlNYXBwZXJzW21hcHBlck5hbWVdLmhhc01hcHBpbmdGb3IocGF0aCkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQmlmcm9zdC51cmlNYXBwZXJzW21hcHBlck5hbWVdLnJlc29sdmUocGF0aCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIEJpZnJvc3QudXJpTWFwcGVycy5kZWZhdWx0LnJlc29sdmUocGF0aCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5pZiAodHlwZW9mIEJpZnJvc3Qudmlld3MucGF0aFJlc29sdmVycyAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgQmlmcm9zdC52aWV3cy5wYXRoUmVzb2x2ZXJzLlJlbGF0aXZlUGF0aFJlc29sdmVyID0gQmlmcm9zdC52aWV3cy5SZWxhdGl2ZVBhdGhSZXNvbHZlcjtcclxufSIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICBWaWV3OiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICh2aWV3TG9hZGVyLCB2aWV3TW9kZWxUeXBlcywgdmlld01vZGVsTWFuYWdlciwgcGF0aCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcclxuICAgICAgICB0aGlzLmNvbnRlbnQgPSBcIltDT05URU5UIE5PVCBMT0FERURdXCI7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLnZpZXdNb2RlbFR5cGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudmlld01vZGVsUGF0aCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5yZWdpb24gPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWQgPSBmdW5jdGlvbiAocmVnaW9uKSB7XHJcbiAgICAgICAgICAgIHNlbGYucmVnaW9uID0gcmVnaW9uO1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHNlbGYudmlld01vZGVsUGF0aCA9IHZpZXdNb2RlbE1hbmFnZXIuZ2V0Vmlld01vZGVsUGF0aEZvclZpZXcocGF0aCk7XHJcbiAgICAgICAgICAgIHZpZXdMb2FkZXIubG9hZChzZWxmLnBhdGgsIHJlZ2lvbikuY29udGludWVXaXRoKGZ1bmN0aW9uIChodG1sKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmNvbnRlbnQgPSBodG1sO1xyXG4gICAgICAgICAgICAgICAgc2VsZi52aWV3TW9kZWxUeXBlID0gdmlld01vZGVsVHlwZXMuZ2V0Vmlld01vZGVsVHlwZUZvclBhdGgoc2VsZi52aWV3TW9kZWxQYXRoKTtcclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKHNlbGYpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgdmlld0ZhY3Rvcnk6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZUZyb20gPSBmdW5jdGlvbiAocGF0aCkge1xyXG4gICAgICAgICAgICB2YXIgdmlldyA9IEJpZnJvc3Qudmlld3MuVmlldy5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgcGF0aDogcGF0aFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHZpZXc7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLnZpZXdGYWN0b3J5ID0gQmlmcm9zdC52aWV3cy52aWV3RmFjdG9yeTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgVmlld0xvYWRUYXNrOiBCaWZyb3N0LnZpZXdzLkNvbXBvc2VUYXNrLmV4dGVuZChmdW5jdGlvbiAoZmlsZXMsIGZpbGVNYW5hZ2VyKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSB0YXNrIGZvciBsb2FkaW5nIGZpbGVzIGFzeW5jaHJvbm91c2x5PC9zdW1tYXJ5PlxyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuZmlsZXMgPSBbXTtcclxuICAgICAgICBmaWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChmaWxlKSB7XHJcbiAgICAgICAgICAgIHNlbGYuZmlsZXMucHVzaChmaWxlLnBhdGguZnVsbFBhdGgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmV4ZWN1dGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIGZpbGVNYW5hZ2VyLmxvYWQoZmlsZXMpLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoaW5zdGFuY2VzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmlldyA9IGluc3RhbmNlc1swXTtcclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKHZpZXcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICB2aWV3TG9hZGVyOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAodmlld01vZGVsTWFuYWdlciwgdGFza0ZhY3RvcnksIGZpbGVGYWN0b3J5LCByZWdpb25NYW5hZ2VyKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkID0gZnVuY3Rpb24gKHBhdGgscmVnaW9uKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmaWxlcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgdmFyIHZpZXdGaWxlID0gZmlsZUZhY3RvcnkuY3JlYXRlKHBhdGgsIEJpZnJvc3QuaW8uZmlsZVR5cGUuaHRtbCk7XHJcbiAgICAgICAgICAgIGlmIChwYXRoLmluZGV4T2YoXCI/XCIpID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdmlld0ZpbGUucGF0aC5mdWxsUGF0aCA9IHZpZXdGaWxlLnBhdGguZnVsbFBhdGggKyBwYXRoLnN1YnN0cihwYXRoLmluZGV4T2YoXCI/XCIpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmaWxlcy5wdXNoKHZpZXdGaWxlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB2aWV3TW9kZWxQYXRoID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHZpZXdNb2RlbE1hbmFnZXIuaGFzRm9yVmlldyhwYXRoKSkge1xyXG4gICAgICAgICAgICAgICAgdmlld01vZGVsUGF0aCA9IHZpZXdNb2RlbE1hbmFnZXIuZ2V0Vmlld01vZGVsUGF0aEZvclZpZXcocGF0aCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXZpZXdNb2RlbE1hbmFnZXIuaXNMb2FkZWQodmlld01vZGVsUGF0aCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmlld01vZGVsRmlsZSA9IGZpbGVGYWN0b3J5LmNyZWF0ZSh2aWV3TW9kZWxQYXRoLCBCaWZyb3N0LmlvLmZpbGVUeXBlLmphdmFTY3JpcHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGVzLnB1c2godmlld01vZGVsRmlsZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciB0YXNrID0gdGFza0ZhY3RvcnkuY3JlYXRlVmlld0xvYWQoZmlsZXMpO1xyXG4gICAgICAgICAgICByZWdpb24udGFza3MuZXhlY3V0ZSh0YXNrKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHZpZXcpIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKHZpZXcpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgdmlld0JpbmRpbmdIYW5kbGVyOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uIChWaWV3QmluZGluZ0hhbmRsZXJUZW1wbGF0ZUVuZ2luZSwgVUlNYW5hZ2VyLCB2aWV3RmFjdG9yeSwgdmlld01hbmFnZXIsIHZpZXdNb2RlbE1hbmFnZXIsIGRvY3VtZW50U2VydmljZSwgcmVnaW9uTWFuYWdlciwgcGF0aFJlc29sdmVycykge1xyXG4gICAgICAgIGZ1bmN0aW9uIG1ha2VUZW1wbGF0ZVZhbHVlQWNjZXNzb3IoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3NBY2Nlc3NvciwgYmluZGluZ0NvbnRleHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2aWV3VXJpID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnZpZXdVcmkgIT09IHZpZXdVcmkpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNoaWxkcmVuLmZvckVhY2goa28ucmVtb3ZlTm9kZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudmlld01vZGVsID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnZpZXcgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudGVtcGxhdGVTb3VyY2UgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnZpZXdVcmkgPSB2aWV3VXJpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB2aWV3TW9kZWwgPSBrby5vYnNlcnZhYmxlKGVsZW1lbnQudmlld01vZGVsKTtcclxuICAgICAgICAgICAgICAgIHZhciB2aWV3TW9kZWxQYXJhbWV0ZXJzID0gYWxsQmluZGluZ3NBY2Nlc3NvcigpLnZpZXdNb2RlbFBhcmFtZXRlcnMgfHwge307XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlRW5naW5lID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHZhciB2aWV3ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHZhciByZWdpb24gPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHZpZXdVcmkpIHx8IHZpZXdVcmkgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZUVuZ2luZSA9IG5ldyBrby5uYXRpdmVUZW1wbGF0ZUVuZ2luZSgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZUVuZ2luZSA9IFZpZXdCaW5kaW5nSGFuZGxlclRlbXBsYXRlRW5naW5lO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhY3R1YWxQYXRoID0gcGF0aFJlc29sdmVycy5yZXNvbHZlKGVsZW1lbnQsIHZpZXdVcmkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcgPSB2aWV3RmFjdG9yeS5jcmVhdGVGcm9tKGFjdHVhbFBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVnaW9uID0gcmVnaW9uTWFuYWdlci5nZXRGb3Iodmlldyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBpZjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB2aWV3TW9kZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogZWxlbWVudCxcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZUVuZ2luZTogdGVtcGxhdGVFbmdpbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlld1VyaTogdmlld1VyaSxcclxuICAgICAgICAgICAgICAgICAgICB2aWV3TW9kZWxQYXJhbWV0ZXJzOiB2aWV3TW9kZWxQYXJhbWV0ZXJzLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXc6IHZpZXcsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVnaW9uOiByZWdpb25cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmluaXQgPSBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3NBY2Nlc3Nvciwgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCkge1xyXG4gICAgICAgICAgICByZXR1cm4ga28uYmluZGluZ0hhbmRsZXJzLnRlbXBsYXRlLmluaXQoZWxlbWVudCwgbWFrZVRlbXBsYXRlVmFsdWVBY2Nlc3NvcihlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5nc0FjY2Vzc29yLCBiaW5kaW5nQ29udGV4dCksIGFsbEJpbmRpbmdzQWNjZXNzb3IsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzQWNjZXNzb3IsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGtvLmJpbmRpbmdIYW5kbGVycy50ZW1wbGF0ZS51cGRhdGUoZWxlbWVudCwgbWFrZVRlbXBsYXRlVmFsdWVBY2Nlc3NvcihlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5nc0FjY2Vzc29yLCBiaW5kaW5nQ29udGV4dCksIGFsbEJpbmRpbmdzQWNjZXNzb3IsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC52aWV3cy52aWV3QmluZGluZ0hhbmRsZXIuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGtvLmJpbmRpbmdIYW5kbGVycy52aWV3ID0gQmlmcm9zdC52aWV3cy52aWV3QmluZGluZ0hhbmRsZXIuY3JlYXRlKCk7XHJcbiAgICBrby5qc29uRXhwcmVzc2lvblJld3JpdGluZy5iaW5kaW5nUmV3cml0ZVZhbGlkYXRvcnMudmlldyA9IGZhbHNlOyAvLyBDYW4ndCByZXdyaXRlIGNvbnRyb2wgZmxvdyBiaW5kaW5nc1xyXG4gICAga28udmlydHVhbEVsZW1lbnRzLmFsbG93ZWRCaW5kaW5ncy52aWV3ID0gdHJ1ZTtcclxufTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgVmlld0JpbmRpbmdIYW5kbGVyVGVtcGxhdGVTb3VyY2U6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKHZpZXdGYWN0b3J5KSB7XHJcbiAgICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5sb2FkRm9yID0gZnVuY3Rpb24gKGVsZW1lbnQsIHZpZXcsIHJlZ2lvbikge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgICAgICB2aWV3LmxvYWQocmVnaW9uKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKGxvYWRlZFZpZXcpIHtcclxuICAgICAgICAgICAgICAgIHZhciB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgIHdyYXBwZXIuaW5uZXJIVE1MID0gbG9hZGVkVmlldy5jb250ZW50O1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gd3JhcHBlci5pbm5lckhUTUw7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQobG9hZGVkVmlldy52aWV3TW9kZWxUeXBlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGxvYWRlZFZpZXcpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBCaWZyb3N0LnZpZXdzLlJlZ2lvbi5jdXJyZW50ID0gcmVnaW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcudmlld01vZGVsVHlwZS5lbnN1cmUoKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChsb2FkZWRWaWV3KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmRhdGEgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkgeyB9O1xyXG5cclxuICAgICAgICB0aGlzLnRleHQgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICBWaWV3QmluZGluZ0hhbmRsZXJUZW1wbGF0ZUVuZ2luZTogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAodmlld01vZGVsTWFuYWdlciwgcmVnaW9uTWFuYWdlciwgVUlNYW5hZ2VyKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMucmVuZGVyVGVtcGxhdGUgPSBmdW5jdGlvbiAodGVtcGxhdGUsIGJpbmRpbmdDb250ZXh0LCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZVNvdXJjZTtcclxuICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQob3B0aW9ucy5lbGVtZW50LnRlbXBsYXRlU291cmNlKSkge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVTb3VyY2UgPSBCaWZyb3N0LnZpZXdzLlZpZXdCaW5kaW5nSGFuZGxlclRlbXBsYXRlU291cmNlLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlld1VyaTogb3B0aW9ucy52aWV3VXJpLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlZ2lvbjogb3B0aW9ucy5yZWdpb25cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5lbGVtZW50LnRlbXBsYXRlU291cmNlID0gdGVtcGxhdGVTb3VyY2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVNvdXJjZSA9IG9wdGlvbnMuZWxlbWVudC50ZW1wbGF0ZVNvdXJjZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQob3B0aW9ucy5lbGVtZW50LnZpZXcpKSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVNvdXJjZS5sb2FkRm9yKG9wdGlvbnMuZWxlbWVudCwgb3B0aW9ucy52aWV3LCBvcHRpb25zLnJlZ2lvbikuY29udGludWVXaXRoKGZ1bmN0aW9uICh2aWV3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5lbGVtZW50LnZpZXcgPSB2aWV3O1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZ2lvbk1hbmFnZXIuZGVzY3JpYmUob3B0aW9ucy52aWV3LCBvcHRpb25zLnJlZ2lvbikuY29udGludWVXaXRoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBiaXQgZG9kZ3ksIGJ1dCBjYW4ndCBmaW5kIGFueSB3YXkgYXJvdW5kIGl0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQdXQgYW4gZW1wdHkgb2JqZWN0IGZvciBkZXBlbmRlbmN5IGRldGVjdGlvbiAtIHdlIGRvbid0IHdhbnQgS25vY2tvdXQgdG8gYmUgb2JzZXJ2aW5nIGFueSBvYnNlcnZhYmxlcyBvbiBvdXIgdmlld01vZGVsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmJlZ2luKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh2aWV3LnZpZXdNb2RlbFR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZpZXdNb2RlbFBhcmFtZXRlcnMgPSBvcHRpb25zLnZpZXdNb2RlbFBhcmFtZXRlcnM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlld01vZGVsUGFyYW1ldGVycy5yZWdpb24gPSBvcHRpb25zLnJlZ2lvbjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UgPSB2aWV3LnZpZXdNb2RlbFR5cGUuY3JlYXRlKHZpZXdNb2RlbFBhcmFtZXRlcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZWxlbWVudC52aWV3TW9kZWwgPSBpbnN0YW5jZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmRhdGEoaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kaW5nQ29udGV4dC4kZGF0YSA9IGluc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZGF0YShpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZGluZ0NvbnRleHQuJGRhdGEgPSBpbnN0YW5jZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uZW5kKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBiaW5kaW5nQ29udGV4dC4kcm9vdCA9IGJpbmRpbmdDb250ZXh0LiRkYXRhO1xyXG4gICAgICAgICAgICB2YXIgcmVuZGVyZWRUZW1wbGF0ZVNvdXJjZSA9IHNlbGYucmVuZGVyVGVtcGxhdGVTb3VyY2UodGVtcGxhdGVTb3VyY2UsIGJpbmRpbmdDb250ZXh0LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIHJlbmRlcmVkVGVtcGxhdGVTb3VyY2UuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuY29uc3RydWN0b3IgIT09IFRleHQgJiYgZWxlbWVudC5jb25zdHJ1Y3RvciAhPT0gQ29tbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIFVJTWFuYWdlci5oYW5kbGUoZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZW5kZXJlZFRlbXBsYXRlU291cmNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgbmF0aXZlVGVtcGxhdGVFbmdpbmUgPSBuZXcga28ubmF0aXZlVGVtcGxhdGVFbmdpbmUoKTtcclxuICAgIHZhciBiYXNlQ3JlYXRlID0gQmlmcm9zdC52aWV3cy5WaWV3QmluZGluZ0hhbmRsZXJUZW1wbGF0ZUVuZ2luZS5jcmVhdGU7XHJcbiAgICBCaWZyb3N0LnZpZXdzLlZpZXdCaW5kaW5nSGFuZGxlclRlbXBsYXRlRW5naW5lLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaW5zdGFuY2UgPSBiYXNlQ3JlYXRlLmNhbGwoQmlmcm9zdC52aWV3cy5WaWV3QmluZGluZ0hhbmRsZXJUZW1wbGF0ZUVuZ2luZSwgYXJndW1lbnRzKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gbmF0aXZlVGVtcGxhdGVFbmdpbmUpIHtcclxuICAgICAgICAgICAgaWYgKCFpbnN0YW5jZS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlW3Byb3BlcnR5XSA9IG5hdGl2ZVRlbXBsYXRlRW5naW5lW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfTtcclxufSkoKTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIE1hc3RlclZpZXdNb2RlbDogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoZG9jdW1lbnRTZXJ2aWNlKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBkZWFjdGl2YXRlVmlld01vZGVsKHZpZXdNb2RlbCkge1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodmlld01vZGVsKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNGdW5jdGlvbih2aWV3TW9kZWwuZGVhY3RpdmF0ZWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlld01vZGVsLmRlYWN0aXZhdGVkKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGVWaWV3TW9kZWwodmlld01vZGVsKSB7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh2aWV3TW9kZWwpICYmIEJpZnJvc3QuaXNGdW5jdGlvbih2aWV3TW9kZWwuYWN0aXZhdGVkKSkge1xyXG4gICAgICAgICAgICAgICAgdmlld01vZGVsLmFjdGl2YXRlZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zZXRGb3IgPSBmdW5jdGlvbiAoZWxlbWVudCwgdmlld01vZGVsKSB7XHJcbiAgICAgICAgICAgIHZhciBleGlzdGluZ1ZpZXdNb2RlbCA9IHNlbGYuZ2V0Rm9yKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdWaWV3TW9kZWwgIT09IHZpZXdNb2RlbCkge1xyXG4gICAgICAgICAgICAgICAgZGVhY3RpdmF0ZVZpZXdNb2RlbChleGlzdGluZ1ZpZXdNb2RlbCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gZG9jdW1lbnRTZXJ2aWNlLmdldFZpZXdNb2RlbE5hbWVGb3IoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIHNlbGZbbmFtZV0gPSB2aWV3TW9kZWw7XHJcblxyXG4gICAgICAgICAgICBhY3RpdmF0ZVZpZXdNb2RlbCh2aWV3TW9kZWwpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0Rm9yID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSBkb2N1bWVudFNlcnZpY2UuZ2V0Vmlld01vZGVsTmFtZUZvcihlbGVtZW50KTtcclxuICAgICAgICAgICAgaWYgKHNlbGYuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmW25hbWVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICB0aGlzLmNsZWFyRm9yID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSBkb2N1bWVudFNlcnZpY2UuZ2V0Vmlld01vZGVsTmFtZUZvcihlbGVtZW50KTtcclxuICAgICAgICAgICAgaWYgKCFzZWxmLmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICBkZWFjdGl2YXRlVmlld01vZGVsKHNlbGZbbmFtZV0pO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHNlbGZbbmFtZV07XHJcbiAgICAgICAgICAgICAgICBzZWxmW25hbWVdID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuYXBwbHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3Moc2VsZik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hcHBseVRvID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAga28uYXBwbHlCaW5kaW5ncyhzZWxmLCBlbGVtZW50KTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIFZpZXdNb2RlbDogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAocmVnaW9uKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0Vmlld01vZGVsID0gdGhpcztcclxuICAgICAgICB0aGlzLnJlZ2lvbiA9IHJlZ2lvbjtcclxuXHJcbiAgICAgICAgdGhpcy5hY3RpdmF0ZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc2VsZi50YXJnZXRWaWV3TW9kZWwub25BY3RpdmF0ZWQgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgc2VsZi50YXJnZXRWaWV3TW9kZWwub25BY3RpdmF0ZWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc2VsZi50YXJnZXRWaWV3TW9kZWwub25EZWFjdGl2YXRlZCA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnRhcmdldFZpZXdNb2RlbC5vbkRlYWN0aXZhdGVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9uQ3JlYXRlZCA9IGZ1bmN0aW9uIChsYXN0RGVzY2VuZGFudCkge1xyXG4gICAgICAgICAgICBzZWxmLnRhcmdldFZpZXdNb2RlbCA9IGxhc3REZXNjZW5kYW50O1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgdmlld01vZGVsVHlwZXM6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldE5hbWVzcGFjZUZyb20ocGF0aCkge1xyXG4gICAgICAgICAgICB2YXIgbG9jYWxQYXRoID0gQmlmcm9zdC5QYXRoLmdldFBhdGhXaXRob3V0RmlsZW5hbWUocGF0aCk7XHJcbiAgICAgICAgICAgIHZhciBuYW1lc3BhY2VQYXRoID0gQmlmcm9zdC5uYW1lc3BhY2VNYXBwZXJzLm1hcFBhdGhUb05hbWVzcGFjZShsb2NhbFBhdGgpO1xyXG4gICAgICAgICAgICBpZiAobmFtZXNwYWNlUGF0aCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmFtZXNwYWNlID0gQmlmcm9zdC5uYW1lc3BhY2UobmFtZXNwYWNlUGF0aCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmFtZXNwYWNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0VHlwZU5hbWVGcm9tKHBhdGgpIHtcclxuICAgICAgICAgICAgdmFyIGxvY2FsUGF0aCA9IEJpZnJvc3QuUGF0aC5nZXRQYXRoV2l0aG91dEZpbGVuYW1lKHBhdGgpO1xyXG4gICAgICAgICAgICB2YXIgZmlsZW5hbWUgPSBCaWZyb3N0LlBhdGguZ2V0RmlsZW5hbWVXaXRob3V0RXh0ZW5zaW9uKHBhdGgpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmlsZW5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5pc0xvYWRlZCA9IGZ1bmN0aW9uIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHZhciBuYW1lc3BhY2UgPSBnZXROYW1lc3BhY2VGcm9tKHBhdGgpO1xyXG4gICAgICAgICAgICBpZiAobmFtZXNwYWNlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0eXBlbmFtZSA9IGdldFR5cGVOYW1lRnJvbShwYXRoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlbmFtZSBpbiBuYW1lc3BhY2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFZpZXdNb2RlbFR5cGVGb3JQYXRoSW1wbGVtZW50YXRpb24ocGF0aCkge1xyXG4gICAgICAgICAgICB2YXIgbmFtZXNwYWNlID0gZ2V0TmFtZXNwYWNlRnJvbShwYXRoKTtcclxuICAgICAgICAgICAgaWYgKG5hbWVzcGFjZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHlwZW5hbWUgPSBnZXRUeXBlTmFtZUZyb20ocGF0aCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC5pc1R5cGUobmFtZXNwYWNlW3R5cGVuYW1lXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmFtZXNwYWNlW3R5cGVuYW1lXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdldFZpZXdNb2RlbFR5cGVGb3JQYXRoID0gZnVuY3Rpb24gKHBhdGgpIHtcclxuICAgICAgICAgICAgdmFyIHR5cGUgPSBnZXRWaWV3TW9kZWxUeXBlRm9yUGF0aEltcGxlbWVudGF0aW9uKHBhdGgpO1xyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh0eXBlKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlZXBQYXRoID0gcGF0aC5yZXBsYWNlKFwiLmpzXCIsIFwiL2luZGV4LmpzXCIpO1xyXG4gICAgICAgICAgICAgICAgdHlwZSA9IGdldFZpZXdNb2RlbFR5cGVGb3JQYXRoSW1wbGVtZW50YXRpb24oZGVlcFBhdGgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodHlwZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWVwUGF0aCA9IHBhdGgucmVwbGFjZShcIi5qc1wiLCBcIi9JbmRleC5qc1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBnZXRWaWV3TW9kZWxUeXBlRm9yUGF0aEltcGxlbWVudGF0aW9uKGRlZXBQYXRoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHR5cGU7XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuYmVnaW5DcmVhdGVJbnN0YW5jZU9mVmlld01vZGVsID0gZnVuY3Rpb24gKHBhdGgsIHJlZ2lvbiwgdmlld01vZGVsUGFyYW1ldGVycykge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdHlwZSA9IHNlbGYuZ2V0Vmlld01vZGVsVHlwZUZvclBhdGgocGF0aCk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcmV2aW91c1JlZ2lvbiA9IEJpZnJvc3Qudmlld3MuUmVnaW9uLmN1cnJlbnQ7XHJcbiAgICAgICAgICAgICAgICBCaWZyb3N0LnZpZXdzLlJlZ2lvbi5jdXJyZW50ID0gcmVnaW9uO1xyXG5cclxuICAgICAgICAgICAgICAgIHZpZXdNb2RlbFBhcmFtZXRlcnMgPSB2aWV3TW9kZWxQYXJhbWV0ZXJzIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgdmlld01vZGVsUGFyYW1ldGVycy5yZWdpb24gPSByZWdpb247XHJcblxyXG4gICAgICAgICAgICAgICAgdHlwZS5iZWdpbkNyZWF0ZSh2aWV3TW9kZWxQYXJhbWV0ZXJzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY29udGludWVXaXRoKGZ1bmN0aW9uIChpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KS5vbkZhaWwoZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlZpZXdNb2RlbCAnXCIgKyBwYXRoICsgXCInIGZhaWxlZCBpbnN0YW50aWF0aW9uXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJWaWV3TW9kZWwgJ1wiICsgcGF0aCArIFwiJyBkb2VzIG5vdCBleGlzdFwiKTtcclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLnZpZXdNb2RlbFR5cGVzID0gQmlmcm9zdC52aWV3cy52aWV3TW9kZWxUeXBlczsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgdmlld01vZGVsTG9hZGVyOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAodGFza0ZhY3RvcnksIGZpbGVGYWN0b3J5LCB2aWV3TW9kZWxUeXBlcykge1xyXG4gICAgICAgIHRoaXMubG9hZCA9IGZ1bmN0aW9uIChwYXRoLCByZWdpb24sIHZpZXdNb2RlbFBhcmFtZXRlcnMpIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB2YXIgZmlsZSA9IGZpbGVGYWN0b3J5LmNyZWF0ZShwYXRoLCBCaWZyb3N0LmlvLmZpbGVUeXBlLmphdmFTY3JpcHQpO1xyXG4gICAgICAgICAgICB2YXIgdGFzayA9IHRhc2tGYWN0b3J5LmNyZWF0ZVZpZXdNb2RlbExvYWQoW2ZpbGVdKTtcclxuICAgICAgICAgICAgcmVnaW9uLnRhc2tzLmV4ZWN1dGUodGFzaykuY29udGludWVXaXRoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZpZXdNb2RlbFR5cGVzLmJlZ2luQ3JlYXRlSW5zdGFuY2VPZlZpZXdNb2RlbChwYXRoLCByZWdpb24sIHZpZXdNb2RlbFBhcmFtZXRlcnMpLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIFZpZXdNb2RlbExvYWRUYXNrOiBCaWZyb3N0LnZpZXdzLkNvbXBvc2VUYXNrLmV4dGVuZChmdW5jdGlvbiAoZmlsZXMsIGZpbGVNYW5hZ2VyKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSB0YXNrIGZvciBsb2FkaW5nIHZpZXdNb2RlbHM8L3N1bW1hcnk+XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmZpbGVzID0gW107XHJcbiAgICAgICAgZmlsZXMuZm9yRWFjaChmdW5jdGlvbiAoZmlsZSkge1xyXG4gICAgICAgICAgICBzZWxmLmZpbGVzLnB1c2goZmlsZS5wYXRoLmZ1bGxQYXRoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgICAgICBmaWxlTWFuYWdlci5sb2FkKGZpbGVzKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKGluc3RhbmNlcykge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoaW5zdGFuY2VzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgdmlld01vZGVsTWFuYWdlcjogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24oYXNzZXRzTWFuYWdlciwgZG9jdW1lbnRTZXJ2aWNlLCB2aWV3TW9kZWxMb2FkZXIsIHJlZ2lvbk1hbmFnZXIsIHRhc2tGYWN0b3J5LCB2aWV3RmFjdG9yeSwgTWFzdGVyVmlld01vZGVsKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuYXNzZXRzTWFuYWdlciA9IGFzc2V0c01hbmFnZXI7XHJcbiAgICAgICAgdGhpcy52aWV3TW9kZWxMb2FkZXIgPSB2aWV3TW9kZWxMb2FkZXI7XHJcbiAgICAgICAgdGhpcy5kb2N1bWVudFNlcnZpY2UgPSBkb2N1bWVudFNlcnZpY2U7XHJcblxyXG4gICAgICAgIHRoaXMubWFzdGVyVmlld01vZGVsID0gTWFzdGVyVmlld01vZGVsO1xyXG5cclxuICAgICAgICB0aGlzLmhhc0ZvclZpZXcgPSBmdW5jdGlvbiAodmlld1BhdGgpIHtcclxuICAgICAgICAgICAgdmFyIHNjcmlwdEZpbGUgPSBCaWZyb3N0LlBhdGguY2hhbmdlRXh0ZW5zaW9uKHZpZXdQYXRoLCBcImpzXCIpO1xyXG4gICAgICAgICAgICBzY3JpcHRGaWxlID0gQmlmcm9zdC5QYXRoLm1ha2VSZWxhdGl2ZShzY3JpcHRGaWxlKTtcclxuICAgICAgICAgICAgdmFyIGhhc1ZpZXdNb2RlbCA9IHNlbGYuYXNzZXRzTWFuYWdlci5oYXNTY3JpcHQoc2NyaXB0RmlsZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBoYXNWaWV3TW9kZWw7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRWaWV3TW9kZWxQYXRoRm9yVmlldyA9IGZ1bmN0aW9uICh2aWV3UGF0aCkge1xyXG4gICAgICAgICAgICB2YXIgc2NyaXB0RmlsZSA9IEJpZnJvc3QuUGF0aC5jaGFuZ2VFeHRlbnNpb24odmlld1BhdGgsIFwianNcIik7XHJcbiAgICAgICAgICAgIHJldHVybiBzY3JpcHRGaWxlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuaXNMb2FkZWQgPSBmdW5jdGlvbiAocGF0aCkge1xyXG4gICAgICAgICAgICB2YXIgbG9jYWxQYXRoID0gQmlmcm9zdC5QYXRoLmdldFBhdGhXaXRob3V0RmlsZW5hbWUocGF0aCk7XHJcbiAgICAgICAgICAgIHZhciBmaWxlbmFtZSA9IEJpZnJvc3QuUGF0aC5nZXRGaWxlbmFtZVdpdGhvdXRFeHRlbnNpb24ocGF0aCk7XHJcbiAgICAgICAgICAgIHZhciBuYW1lc3BhY2VQYXRoID0gQmlmcm9zdC5uYW1lc3BhY2VNYXBwZXJzLm1hcFBhdGhUb05hbWVzcGFjZShsb2NhbFBhdGgpO1xyXG4gICAgICAgICAgICBpZiAobmFtZXNwYWNlUGF0aCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmFtZXNwYWNlID0gQmlmcm9zdC5uYW1lc3BhY2UobmFtZXNwYWNlUGF0aCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGZpbGVuYW1lIGluIG5hbWVzcGFjZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIHZpZXdNb2RlbEJpbmRpbmdIYW5kbGVyOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uKGRvY3VtZW50U2VydmljZSwgdmlld0ZhY3RvcnksIHZpZXdNb2RlbExvYWRlciwgdmlld01vZGVsTWFuYWdlciwgdmlld01vZGVsVHlwZXMsIHJlZ2lvbk1hbmFnZXIpIHtcclxuICAgICAgICB0aGlzLmluaXQgPSBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3NBY2Nlc3NvciwgcGFyZW50Vmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCkge1xyXG4gICAgICAgICAgICB2YXIgcGF0aCA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKTtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuX2lzTG9hZGluZyA9PT0gdHJ1ZSB8fCAoZWxlbWVudC5fdmlld01vZGVsUGF0aCA9PT0gcGF0aCAmJiAhQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChlbGVtZW50Ll92aWV3TW9kZWwpKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBlbGVtZW50Ll9pc0xvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICBlbGVtZW50Ll92aWV3TW9kZWxQYXRoID0gcGF0aDtcclxuXHJcbiAgICAgICAgICAgIHZhciB2aWV3UGF0aCA9IFwiL1wiO1xyXG5cclxuICAgICAgICAgICAgaWYoIGRvY3VtZW50U2VydmljZS5oYXNWaWV3RmlsZShlbGVtZW50KSApIHtcclxuICAgICAgICAgICAgICAgIHZpZXdQYXRoID0gZG9jdW1lbnRTZXJ2aWNlLmdldFZpZXdGaWxlRnJvbShlbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHZpZXcgPSB2aWV3RmFjdG9yeS5jcmVhdGVGcm9tKHZpZXdQYXRoKTtcclxuICAgICAgICAgICAgdmlldy5jb250ZW50ID0gZWxlbWVudC5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgIHZpZXcuZWxlbWVudCA9IGVsZW1lbnQ7XHJcblxyXG4gICAgICAgICAgICB2YXIgdmlld01vZGVsSW5zdGFuY2UgPSBrby5vYnNlcnZhYmxlKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVnaW9uID0gcmVnaW9uTWFuYWdlci5nZXRGb3Iodmlldyk7XHJcbiAgICAgICAgICAgIHJlZ2lvbk1hbmFnZXIuZGVzY3JpYmUodmlldyxyZWdpb24pLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmlld01vZGVsUGFyYW1ldGVycyA9IGFsbEJpbmRpbmdzQWNjZXNzb3IoKS52aWV3TW9kZWxQYXJhbWV0ZXJzIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgdmlld01vZGVsUGFyYW1ldGVycy5yZWdpb24gPSByZWdpb247XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHZpZXdNb2RlbFR5cGVzLmlzTG9hZGVkKHBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZpZXdNb2RlbFR5cGUgPSB2aWV3TW9kZWxUeXBlcy5nZXRWaWV3TW9kZWxUeXBlRm9yUGF0aChwYXRoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RSZWdpb24gPSBCaWZyb3N0LnZpZXdzLlJlZ2lvbi5jdXJyZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIEJpZnJvc3Qudmlld3MuUmVnaW9uLmN1cnJlbnQgPSByZWdpb247XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXdNb2RlbFR5cGUuYmVnaW5DcmVhdGUodmlld01vZGVsUGFyYW1ldGVycykuY29udGludWVXaXRoKGZ1bmN0aW9uICh2aWV3TW9kZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkQmluZGluZ0NvbnRleHQgPSBiaW5kaW5nQ29udGV4dC5jcmVhdGVDaGlsZENvbnRleHQodmlld01vZGVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRCaW5kaW5nQ29udGV4dC4kcm9vdCA9IHZpZXdNb2RlbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5fdmlld01vZGVsID0gdmlld01vZGVsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlld01vZGVsSW5zdGFuY2Uodmlld01vZGVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQmlmcm9zdC52aWV3cy5SZWdpb24uY3VycmVudCA9IGxhc3RSZWdpb247XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50Ll9pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9KS5vbkZhaWwoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkIG5vdCBjcmVhdGUgYW4gaW5zdGFuY2Ugb2YgJ1wiICsgdmlld01vZGVsVHlwZS5fbmFtZXNwYWNlLm5hbWUgKyBcIi5cIiArIHZpZXdNb2RlbFR5cGUuX25hbWUrXCIgLSBSZWFzb24gOiBcIitlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlld01vZGVsTG9hZGVyLmxvYWQocGF0aCwgcmVnaW9uLCB2aWV3TW9kZWxQYXJhbWV0ZXJzKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHZpZXdNb2RlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGRCaW5kaW5nQ29udGV4dCA9IGJpbmRpbmdDb250ZXh0LmNyZWF0ZUNoaWxkQ29udGV4dCh2aWV3TW9kZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZEJpbmRpbmdDb250ZXh0LiRyb290ID0gdmlld01vZGVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50Ll92aWV3TW9kZWwgPSB2aWV3TW9kZWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3TW9kZWxJbnN0YW5jZSh2aWV3TW9kZWwpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5faXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGtvLmJpbmRpbmdIYW5kbGVycy53aXRoLmluaXQoZWxlbWVudCwgdmlld01vZGVsSW5zdGFuY2UsIGFsbEJpbmRpbmdzQWNjZXNzb3IsIHBhcmVudFZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC52aWV3cy52aWV3TW9kZWxCaW5kaW5nSGFuZGxlci5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xyXG4gICAga28uYmluZGluZ0hhbmRsZXJzLnZpZXdNb2RlbCA9IEJpZnJvc3Qudmlld3Mudmlld01vZGVsQmluZGluZ0hhbmRsZXIuY3JlYXRlKCk7XHJcbn07XHJcblxyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgUmVnaW9uOiBmdW5jdGlvbihtZXNzZW5nZXJGYWN0b3J5LCBvcGVyYXRpb25zRmFjdG9yeSwgdGFza3NGYWN0b3J5KSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSByZWdpb24gaW4gdGhlIHZpc3VhbCBjb21wb3NpdGlvbiBvbiBhIHBhZ2U8L3N1bW1hcnk+XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJ2aWV3XCIgdHlwZT1cIm9ic2VydmFibGUgb2YgQmlmcm9zdC52aWV3cy5WaWV3XCI+T2JzZXJ2YWJsZSBob2xkaW5nIFZpZXcgZm9yIHRoZSBjb21wb3NpdGlvbjwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy52aWV3ID0ga28ub2JzZXJ2YWJsZSgpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJ2aWV3TW9kZWxcIiB0eXBlPVwiQmlmcm9zdC52aWV3cy5WaWV3TW9kZWxcIj5UaGUgVmlld01vZGVsIGFzc29jaWF0ZWQgd2l0aCB0aGUgdmlldzwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy52aWV3TW9kZWwgPSBudWxsO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJtZXNzZW5nZXJcIiB0eXBlPVwiQmlmcm9zdC5tZXNzYWdpbmcuTWVzc2VuZ2VyXCI+VGhlIG1lc3NlbmdlciBmb3IgdGhlIHJlZ2lvbjwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5tZXNzZW5nZXIgPSBtZXNzZW5nZXJGYWN0b3J5LmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJnbG9iYWxNZXNzZW5nZXJcIiB0eXBlPVwiQmlmcm9zdC5tZXNzYWdpbmcuTWVzc2VuZ2VyXCI+VGhlIGdsb2JhbCBtZXNzZW5nZXI8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuZ2xvYmFsTWVzc2VuZ2VyID0gbWVzc2VuZ2VyRmFjdG9yeS5nbG9iYWwoKTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwib3BlcmF0aW9uc1wiIHR5cGU9XCJCaWZyb3N0LmludGVyYWN0aW9uLk9wZXJhdGlvbnNcIj5PcGVyYXRpb25zIGZvciB0aGUgcmVnaW9uPC9maWVsZD5cclxuICAgICAgICB0aGlzLm9wZXJhdGlvbnMgPSBvcGVyYXRpb25zRmFjdG9yeS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwidGFza3NcIiB0eXBlPVwiQmlmcm9zdC50YXNrcy5UYXNrc1wiPlRhc2tzIGZvciB0aGUgcmVnaW9uPC9maWVsZD5cclxuICAgICAgICB0aGlzLnRhc2tzID0gdGFza3NGYWN0b3J5LmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJwYXJlbnRcIiB0eXBlPVwiQmlmcm9zdC52aWV3cy5SZWdpb25cIj5QYXJlbnQgcmVnaW9uLCBudWxsIGlmIHRoZXJlIGlzIG5vIHBhcmVudDwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJjaGlsZHJlblwiIHR5cGU9XCJCaWZyb3N0LnZpZXdzLlJlZ2lvbltdXCI+Q2hpbGQgcmVnaW9ucyB3aXRoaW4gdGhpcyByZWdpb248L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiY29tbWFuZHNcIiB0eXBlPVwib2JzZXJ2YWJsZUFycmF5XCI+QXJyYXkgb2YgY29tbWFuZHMgaW5zaWRlIHRoZSByZWdpb248L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuY29tbWFuZHMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiaXNDb21tYW5kUm9vdFwiIHR5cGU9XCJvYnNlcnZhYmxlXCI+V2hldGhlciB0aGlzIHJlZ2lvbiBpcyBhIGNvbW1hbmQgcm9vdC5cclxuICAgICAgICAvLy8gKGkuZSBkb2VzIG5vdCBidWJibGUgaXRzIGNvbW1hbmRzIHVwd2FyZHMpPC9maWVsZD5cclxuICAgICAgICB0aGlzLmlzQ29tbWFuZFJvb3QgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiYWdncmVnYXRlZENvbW1hbmRzXCIgdHlwZT1cIm9ic2VydmFibGVBcnJheVwiPlJlcHJlc2VudHMgYWxsIGNvbW1hbmRzIGluIHRoaXMgcmVnaW9uIGFuZCBhbnkgY2hpbGQgcmVnaW9uczwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5hZ2dyZWdhdGVkQ29tbWFuZHMgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBjb21tYW5kcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5jb21tYW5kcygpLmZvckVhY2goZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmRzLnB1c2goY29tbWFuZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5jaGlsZHJlbigpLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkUmVnaW9uKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNoaWxkUmVnaW9uLmlzQ29tbWFuZFJvb3QoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkUmVnaW9uLmFnZ3JlZ2F0ZWRDb21tYW5kcygpLmZvckVhY2goZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZHMucHVzaChjb21tYW5kKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21tYW5kcztcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRoaXNPckNoaWxkSGFzVGFza1R5cGUodGFza1R5cGUsIHByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGhhc1Rhc2sgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHNlbGYuY2hpbGRyZW4oKS5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZFJlZ2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZFJlZ2lvbltwcm9wZXJ0eU5hbWVdKCkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzVGFzayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnRhc2tzLmFsbCgpLmZvckVhY2goZnVuY3Rpb24gKHRhc2spIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGFzay5fdHlwZS50eXBlT2YodGFza1R5cGUpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc1Rhc2sgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBoYXNUYXNrO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aGlzT3JDaGlsZENvbW1hbmRIYXNQcm9wZXJ0eVNldFRvVHJ1ZShjb21tYW5kUHJvcGVydHlOYW1lLCBicmVha0lmVGhpc0hhc05vQ29tbWFuZHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpc1NldCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGNvbW1hbmRzID0gc2VsZi5hZ2dyZWdhdGVkQ29tbWFuZHMoKTtcclxuICAgICAgICAgICAgICAgIGlmIChicmVha0lmVGhpc0hhc05vQ29tbWFuZHMgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tbWFuZHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kcy5mb3JFYWNoKGZ1bmN0aW9uIChjb21tYW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbW1hbmRbY29tbWFuZFByb3BlcnR5TmFtZV0oKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNTZXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBpc1NldDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aGlzT3JDaGlsZENvbW1hbmRIYXNQcm9wZXJ0eVNldFRvRmFsc2UoY29tbWFuZFByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGlzU2V0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGNvbW1hbmRzID0gc2VsZi5hZ2dyZWdhdGVkQ29tbWFuZHMoKTtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmRzLmZvckVhY2goZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tbWFuZFtjb21tYW5kUHJvcGVydHlOYW1lXSgpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzU2V0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBpc1NldDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJpc1ZhbGlkXCIgdHlwZT1cIm9ic2VydmFibGVcIj5JbmRpY2lhdGVzIHdldGhlciBvciBub3QgcmVnaW9uIG9yIGFueSBvZiBpdHMgY2hpbGQgcmVnaW9ucyBhcmUgaW4gYW4gaW52YWxpZCBzdGF0ZTwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5pc1ZhbGlkID0gdGhpc09yQ2hpbGRDb21tYW5kSGFzUHJvcGVydHlTZXRUb1RydWUoXCJpc1ZhbGlkXCIpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJjYW5Db21tYW5kc0V4ZWN1dGVcIiB0eXBlPVwib2JzZXJ2YWJsZVwiPkluZGljYXRlcyB3ZXRoZXIgb3Igbm90IHJlZ2lvbiBvciBhbnkgb2YgaXRzIGNoaWxkIHJlZ2lvbnMgY2FuIGV4ZWN1dGUgdGhlaXIgY29tbWFuZHM8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuY2FuQ29tbWFuZHNFeGVjdXRlID0gdGhpc09yQ2hpbGRDb21tYW5kSGFzUHJvcGVydHlTZXRUb1RydWUoXCJjYW5FeGVjdXRlXCIsIHRydWUpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJhcmVDb21tYW5kc0F1dGhvcml6ZWRcIiB0eXBlPVwib2JzZXJ2YWJsZVwiPkluZGljYXRlcyB3ZXRoZXIgb3Igbm90IHJlZ2lvbiBvciBhbnkgb2YgaXRzIGNoaWxkIHJlZ2lvbnMgaGF2ZSB0aGVpciBjb21tYW5kcyBhdXRob3JpemVkPC9maWVsZD5cclxuICAgICAgICB0aGlzLmFyZUNvbW1hbmRzQXV0aG9yaXplZCA9IHRoaXNPckNoaWxkQ29tbWFuZEhhc1Byb3BlcnR5U2V0VG9UcnVlKFwiaXNBdXRob3JpemVkXCIpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJhcmVDb21tYW5kc0F1dGhvcml6ZWRcIiB0eXBlPVwib2JzZXJ2YWJsZVwiPkluZGljYXRlcyB3ZXRoZXIgb3Igbm90IHJlZ2lvbiBvciBhbnkgb2YgaXRzIGNoaWxkIHJlZ2lvbnMgaGF2ZSB0aGVpciBjb21tYW5kcyBjaGFuZ2VkPC9maWVsZD5cclxuICAgICAgICB0aGlzLmNvbW1hbmRzSGF2ZUNoYW5nZXMgPSB0aGlzT3JDaGlsZENvbW1hbmRIYXNQcm9wZXJ0eVNldFRvRmFsc2UoXCJoYXNDaGFuZ2VzXCIpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJhcmVDb21tYW5kc0F1dGhvcml6ZWRcIiB0eXBlPVwib2JzZXJ2YWJsZVwiPkluZGljYXRlcyB3ZXRoZXIgb3Igbm90IHJlZ2lvbiBvciBhbnkgb2YgaXRzIGNoaWxkIHJlZ2lvbnMgaGF2ZSB0aGVpciBjb21tYW5kcyByZWFkeSB0byBleGVjdXRlPC9maWVsZD5cclxuICAgICAgICB0aGlzLmFyZUNvbW1hbmRzUmVhZHlUb0V4ZWN1dGUgPSB0aGlzT3JDaGlsZENvbW1hbmRIYXNQcm9wZXJ0eVNldFRvVHJ1ZShcImlzUmVhZHlUb0V4ZWN1dGVcIiwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImFyZUNvbW1hbmRzQXV0aG9yaXplZFwiIHR5cGU9XCJvYnNlcnZhYmxlXCI+SW5kaWNhdGVzIHdldGhlciBvciBub3QgcmVnaW9uIG9yIGFueSBvZiBpdHMgY2hpbGQgcmVnaW9ucyBoYXZlIGNoYW5nZXMgaW4gdGhlaXIgY29tbWFuZHMgb3IgaGFzIGFueSBvcGVyYXRpb25zPC9maWVsZD5cclxuICAgICAgICB0aGlzLmhhc0NoYW5nZXMgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBjb21tYW5kc0hhdmVDaGFuZ2VzID0gc2VsZi5jb21tYW5kc0hhdmVDaGFuZ2VzKCk7XHJcblxyXG5cclxuICAgICAgICAgICAgdmFyIGNoaWxkcmVuSGFzQ2hhbmdlcyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBzZWxmLmNoaWxkcmVuKCkuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGRSZWdpb24pIHtcclxuICAgICAgICAgICAgICAgIGlmICghY2hpbGRSZWdpb24uaXNDb21tYW5kUm9vdCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkUmVnaW9uLmhhc0NoYW5nZXMoKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbkhhc0NoYW5nZXMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb21tYW5kc0hhdmVDaGFuZ2VzIHx8IChzZWxmLm9wZXJhdGlvbnMuc3RhdGVmdWwoKS5sZW5ndGggPiAwKSB8fCBjaGlsZHJlbkhhc0NoYW5nZXM7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cInZhbGlkYXRpb25NZXNzYWdlc1wiIHR5cGU9XCJvYnNlcnZhYmxlQXJyYXlcIj5Ib2xkcyB0aGUgcmVnaW9ucyBhbmQgYW55IG9mIGl0cyBjaGlsZCByZWdpb25zIHZhbGlkYXRpb24gbWVzc2FnZXM8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMudmFsaWRhdGlvbk1lc3NhZ2VzID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbWVzc2FnZXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjb21tYW5kcyA9IHNlbGYuYWdncmVnYXRlZENvbW1hbmRzKCk7XHJcbiAgICAgICAgICAgIGNvbW1hbmRzLmZvckVhY2goZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb21tYW5kLmlzVmFsaWQoKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRvcnMoKS5mb3JFYWNoKGZ1bmN0aW9uICh2YWxpZGF0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkYXRvci5pc1ZhbGlkKCkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoKHZhbGlkYXRvci5tZXNzYWdlKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2VzO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJpc0V4ZWN1dGluZ1wiIHR5cGU9XCJvYnNlcnZhYmxlXCI+SW5kaWNpYXRlcyB3ZXRoZXIgb3Igbm90IGV4ZWN1dGlvbiB0YXNrcyBhcmUgYmVpbmcgcGVyZm9ybWVuZCBpbiB0aGlzIHJlZ2lvbiBvciBhbnkgb2YgaXRzIGNoaWxkIHJlZ2lvbnM8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuaXNFeGVjdXRpbmcgPSB0aGlzT3JDaGlsZEhhc1Rhc2tUeXBlKEJpZnJvc3QudGFza3MuRXhlY3V0aW9uVGFzaywgXCJpc0V4ZWN1dGluZ1wiKTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiaXNDb21wb3NpbmdcIiB0eXBlPVwib2JzZXJ2YWJsZVwiPkluZGljaWF0ZXMgd2V0aGVyIG9yIG5vdCBleGVjdXRpb24gdGFza3MgYXJlIGJlaW5nIHBlcmZvcm1lbmQgaW4gdGhpcyByZWdpb24gb3IgYW55IG9mIGl0cyBjaGlsZCByZWdpb25zPC9maWVsZD5cclxuICAgICAgICB0aGlzLmlzQ29tcG9zaW5nID0gdGhpc09yQ2hpbGRIYXNUYXNrVHlwZShCaWZyb3N0LnZpZXdzLkNvbXBvc2VUYXNrLCBcImlzQ29tcG9zaW5nXCIpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJpc0xvYWRpbmdcIiB0eXBlPVwib2JzZXJ2YWJsZVwiPkluZGljaWF0ZXMgd2V0aGVyIG9yIG5vdCBsb2FkaW5nIHRhc2tzIGFyZSBiZWluZyBwZXJmb3JtZW5kIGluIHRoaXMgcmVnaW9uIG9yIGFueSBvZiBpdHMgY2hpbGQgcmVnaW9uczwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0aGlzT3JDaGlsZEhhc1Rhc2tUeXBlKEJpZnJvc3QudGFza3MuTG9hZFRhc2ssIFwiaXNMb2FkaW5nXCIpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJpc0J1c3lcIiB0eXBlPVwib2JzZXJ2YWJsZVwiPkluZGljYXRlcyB3ZXRoZXIgb3Igbm90IHRhc2tzIGFyZSBiZWluZyBwZXJmb3JtZWQgaW4gdGhpcyByZWdpb24gb3IgYW55IG9mIGl0cyBjaGlsZCByZWdpb25zPC9maWVsZD5cclxuICAgICAgICB0aGlzLmlzQnVzeSA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGlzQnVzeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBzZWxmLmNoaWxkcmVuKCkuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGRSZWdpb24pIHtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZFJlZ2lvbi5pc0J1c3koKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzQnVzeSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWxmLnRhc2tzLmFsbCgpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGlzQnVzeSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBpc0J1c3k7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0pO1xyXG5CaWZyb3N0LnZpZXdzLlJlZ2lvbi5jdXJyZW50ID0gbnVsbDsiLCJCaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlcnMuUmVnaW9uID0ge1xyXG4gICAgY2FuUmVzb2x2ZTogZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgIHJldHVybiBuYW1lID09PSBcInJlZ2lvblwiO1xyXG4gICAgfSxcclxuXHJcbiAgICByZXNvbHZlOiBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIEJpZnJvc3Qudmlld3MuUmVnaW9uLmN1cnJlbnQ7XHJcbiAgICB9XHJcbn07IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIHJlZ2lvbk1hbmFnZXI6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uIChkb2N1bWVudFNlcnZpY2UsIHJlZ2lvbkRlc2NyaXB0b3JNYW5hZ2VyLCBtZXNzZW5nZXJGYWN0b3J5LCBvcGVyYXRpb25zRmFjdG9yeSwgdGFza3NGYWN0b3J5KSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSBtYW5hZ2VyIHRoYXQga25vd3MgaG93IHRvIGRlYWwgd2l0aCBSZWdpb25zIG9uIHRoZSBwYWdlPC9zdW1tYXJ5PlxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlUmVnaW9uSW5zdGFuY2UoKSB7XHJcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IG5ldyBCaWZyb3N0LnZpZXdzLlJlZ2lvbihtZXNzZW5nZXJGYWN0b3J5LCBvcGVyYXRpb25zRmFjdG9yeSwgdGFza3NGYWN0b3J5KTtcclxuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG1hbmFnZUluaGVyaXRhbmNlKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdmFyIHBhcmVudFJlZ2lvbiA9IGRvY3VtZW50U2VydmljZS5nZXRQYXJlbnRSZWdpb25Gb3IoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRSZWdpb24pIHtcclxuICAgICAgICAgICAgICAgIEJpZnJvc3Qudmlld3MuUmVnaW9uLnByb3RvdHlwZSA9IHBhcmVudFJlZ2lvbjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciB0b3BMZXZlbCA9IGNyZWF0ZVJlZ2lvbkluc3RhbmNlKCk7XHJcbiAgICAgICAgICAgICAgICByZWdpb25EZXNjcmlwdG9yTWFuYWdlci5kZXNjcmliZVRvcExldmVsKHRvcExldmVsKTtcclxuICAgICAgICAgICAgICAgIEJpZnJvc3Qudmlld3MuUmVnaW9uLnByb3RvdHlwZSA9IHRvcExldmVsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnRSZWdpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBtYW5hZ2VIaWVyYXJjaHkocGFyZW50UmVnaW9uKSB7XHJcbiAgICAgICAgICAgIHZhciByZWdpb24gPSBjcmVhdGVSZWdpb25JbnN0YW5jZSgpO1xyXG4gICAgICAgICAgICByZWdpb24ucGFyZW50ID0gcGFyZW50UmVnaW9uO1xyXG4gICAgICAgICAgICBpZiAocGFyZW50UmVnaW9uKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRSZWdpb24uY2hpbGRyZW4ucHVzaChyZWdpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZWdpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdldEZvciA9IGZ1bmN0aW9uICh2aWV3KSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5HZXRzIHRoZSByZWdpb24gZm9yIHRoZSBnaXZlbiB2aWV3IGFuZCBjcmVhdGVzIG9uZSBpZiBub25lIGV4aXN0PC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJ2aWV3XCIgdHlwZT1cIlZpZXdcIj5WaWV3IHRvIGdldCBhIHJlZ2lvbiBmb3I8L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHJldHVybnM+VGhlIHJlZ2lvbiBmb3IgdGhlIGVsZW1lbnQ8L3JldHVybnM+XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVnaW9uO1xyXG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IHZpZXcuZWxlbWVudDtcclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50U2VydmljZS5oYXNPd25SZWdpb24oZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgIHJlZ2lvbiA9IGRvY3VtZW50U2VydmljZS5nZXRSZWdpb25Gb3IoZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICByZWdpb24udmlldyh2aWV3KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZWdpb247XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBwYXJlbnRSZWdpb24gPSBtYW5hZ2VJbmhlcml0YW5jZShlbGVtZW50KTtcclxuICAgICAgICAgICAgcmVnaW9uID0gbWFuYWdlSGllcmFyY2h5KHBhcmVudFJlZ2lvbik7XHJcbiAgICAgICAgICAgIHJlZ2lvbi52aWV3KHZpZXcpO1xyXG4gICAgICAgICAgICBkb2N1bWVudFNlcnZpY2Uuc2V0UmVnaW9uT24oZWxlbWVudCwgcmVnaW9uKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZWdpb247XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5kZXNjcmliZSA9IGZ1bmN0aW9uICh2aWV3LCByZWdpb24pIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkRlc2NyaWJlcyBhIHJlZ2lvbiBmb3IgYSB2aWV3PC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJ2aWV3XCIgdHlwZT1cIlZpZXdcIj5WaWV3IHRvIGRlc2NyaWJlIHJlZ2lvbiBmb3I8L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJyZWdpb25cIiB0eXBlPVwiUmVnaW9uXCI+UmVnaW9uIHRvIGRlc2NyaWJlIGZvcjwvcGFyYW0+XHJcbiAgICAgICAgICAgIC8vLyA8cmV0dXJucz5BIHByb21pc2UgdGhhdCBjYW4gYmUgY29udGludWVkIGZvciB3aGVuIHRoZSBkZXNjcmlwdGlvbiBpcyBkb25lPC9yZXR1cm5zPlxyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gdmlldy5lbGVtZW50O1xyXG5cclxuICAgICAgICAgICAgcmVnaW9uRGVzY3JpcHRvck1hbmFnZXIuZGVzY3JpYmUodmlldywgcmVnaW9uKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0Q3VycmVudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkdldHMgdGhlIGN1cnJlbnQgcmVnaW9uPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICByZXR1cm4gQmlmcm9zdC52aWV3cy5SZWdpb24uY3VycmVudDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmV2aWN0ID0gZnVuY3Rpb24gKHJlZ2lvbikge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+RXZpY3QgYSByZWdpb24gZnJvbSB0aGUgcGFnZTwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwicmVnaW9uXCIgdHlwZT1cIkJpZnJvc3Qudmlld3MuUmVnaW9uXCI+UmVnaW9uIHRvIGV2aWN0PC9wYXJhbT5cclxuXHJcbiAgICAgICAgICAgIGlmIChyZWdpb24ucGFyZW50UmVnaW9uKSB7XHJcbiAgICAgICAgICAgICAgICByZWdpb24ucGFyZW50UmVnaW9uLmNoaWxkcmVuLnJlbW92ZShyZWdpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlZ2lvbi5wYXJlbnRSZWdpb24gPSBudWxsO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy5yZWdpb25NYW5hZ2VyID0gQmlmcm9zdC52aWV3cy5yZWdpb25NYW5hZ2U7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIFJlZ2lvbkRlc2NyaXB0b3I6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZGVzY3JpYmUgPSBmdW5jdGlvbiAocmVnaW9uKSB7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICByZWdpb25EZXNjcmlwdG9yTWFuYWdlcjogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGEgbWFuYWdlciB0aGF0IGtub3dzIGhvdyB0byBtYW5hZ2UgcmVnaW9uIGRlc2NyaXB0b3JzPC9zdW1tYXJ5PlxyXG5cclxuICAgICAgICB0aGlzLmRlc2NyaWJlID0gZnVuY3Rpb24gKHZpZXcsIHJlZ2lvbikge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+RGVzY3JpYmUgYSBzcGVjaWZpYyByZWdpb24gcmVsYXRlZCB0byBhIHZpZXc8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cInZpZXdcIiB0eXBlPVwiQmlmcm9zdC52aWV3cy5WaWV3XCI+VmlldyByZWxhdGVkIHRvIHRoZSByZWdpb248L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJyZWdpb25cIiB0eXBlPVwiQmlmcm9zdC52aWV3cy5SZWdpb25cIj5SZWdpb24gdGhhdCBuZWVkcyB0byBiZSBkZXNjcmliZWQ8L3BhcmFtPlxyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHZhciBsb2NhbFBhdGggPSBCaWZyb3N0LlBhdGguZ2V0UGF0aFdpdGhvdXRGaWxlbmFtZSh2aWV3LnBhdGgpO1xyXG4gICAgICAgICAgICB2YXIgbmFtZXNwYWNlUGF0aCA9IEJpZnJvc3QubmFtZXNwYWNlTWFwcGVycy5tYXBQYXRoVG9OYW1lc3BhY2UobG9jYWxQYXRoKTtcclxuICAgICAgICAgICAgaWYgKG5hbWVzcGFjZVBhdGggIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5hbWVzcGFjZSA9IEJpZnJvc3QubmFtZXNwYWNlKG5hbWVzcGFjZVBhdGgpO1xyXG5cclxuICAgICAgICAgICAgICAgIEJpZnJvc3Qudmlld3MuUmVnaW9uLmN1cnJlbnQgPSByZWdpb247XHJcbiAgICAgICAgICAgICAgICBCaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlci5iZWdpblJlc29sdmUobmFtZXNwYWNlLCBcIlJlZ2lvbkRlc2NyaXB0b3JcIikuY29udGludWVXaXRoKGZ1bmN0aW9uIChkZXNjcmlwdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRvci5kZXNjcmliZShyZWdpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKCk7XHJcbiAgICAgICAgICAgICAgICB9KS5vbkZhaWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5kZXNjcmliZVRvcExldmVsID0gZnVuY3Rpb24gKHJlZ2lvbikge1xyXG5cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5kZXBlbmRlbmN5UmVzb2x2ZXJzLlJlZ2lvbkRlc2NyaXB0b3IgPSB7XHJcbiAgICBjYW5SZXNvbHZlOiBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIG5hbWUgPT09IFwiUmVnaW9uRGVzY3JpcHRvclwiO1xyXG4gICAgfSxcclxuXHJcbiAgICByZXNvbHZlOiBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZGVzY3JpYmU6IGZ1bmN0aW9uICgpIHsgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn07IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIERhdGFWaWV3QXR0cmlidXRlRWxlbWVudFZpc2l0b3I6IEJpZnJvc3QubWFya3VwLkVsZW1lbnRWaXNpdG9yLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy52aXNpdCA9IGZ1bmN0aW9uIChlbGVtZW50LCBhY3Rpb25zKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZGF0YVZpZXcgPSBlbGVtZW50LmF0dHJpYnV0ZXMuZ2V0TmFtZWRJdGVtKFwiZGF0YS12aWV3XCIpO1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoZGF0YVZpZXcpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YUJpbmRTdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGFCaW5kID0gZWxlbWVudC5hdHRyaWJ1dGVzLmdldE5hbWVkSXRlbShcImRhdGEtYmluZFwiKTtcclxuICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChkYXRhQmluZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhQmluZFN0cmluZyA9IGRhdGFCaW5kLnZhbHVlICsgXCIsIFwiO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhQmluZCA9IGRvY3VtZW50LmNyZWF0ZUF0dHJpYnV0ZShcImRhdGEtYmluZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRhdGFCaW5kLnZhbHVlID0gZGF0YUJpbmRTdHJpbmcgKyBcInZpZXc6ICdcIiArIGRhdGFWaWV3LnZhbHVlICsgXCInXCI7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmF0dHJpYnV0ZXMuc2V0TmFtZWRJdGVtKGRhdGFCaW5kKTtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cmlidXRlcy5yZW1vdmVOYW1lZEl0ZW0oXCJkYXRhLXZpZXdcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIERhdGFWaWV3TW9kZWxGaWxlQXR0cmlidXRlRWxlbWVudFZpc2l0b3I6IEJpZnJvc3QubWFya3VwLkVsZW1lbnRWaXNpdG9yLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy52aXNpdCA9IGZ1bmN0aW9uIChlbGVtZW50LCBhY3Rpb25zKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZGF0YVZpZXcgPSBlbGVtZW50LmF0dHJpYnV0ZXMuZ2V0TmFtZWRJdGVtKFwiZGF0YS12aWV3bW9kZWwtZmlsZVwiKTtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGRhdGFWaWV3KSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGFCaW5kU3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRhQmluZCA9IGVsZW1lbnQuYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oXCJkYXRhLWJpbmRcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoZGF0YUJpbmQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YUJpbmRTdHJpbmcgPSBkYXRhQmluZC52YWx1ZSArIFwiLCBcIjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YUJpbmQgPSBkb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGUoXCJkYXRhLWJpbmRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkYXRhQmluZC52YWx1ZSA9IGRhdGFCaW5kU3RyaW5nICsgXCJ2aWV3TW9kZWw6ICdcIiArIGRhdGFWaWV3LnZhbHVlICsgXCInXCI7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmF0dHJpYnV0ZXMuc2V0TmFtZWRJdGVtKGRhdGFCaW5kKTtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cmlidXRlcy5yZW1vdmVOYW1lZEl0ZW0oXCJkYXRhLXZpZXdtb2RlbC1maWxlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5pbnRlcmFjdGlvblwiLCB7XHJcbiAgICBWaXN1YWxTdGF0ZU1hbmFnZXJFbGVtZW50VmlzaXRvcjogQmlmcm9zdC5tYXJrdXAuRWxlbWVudFZpc2l0b3IuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdmlzdWFsU3RhdGVBY3Rpb25UeXBlcyA9IEJpZnJvc3QuaW50ZXJhY3Rpb24uVmlzdWFsU3RhdGVBY3Rpb24uZ2V0RXh0ZW5kZXJzKCk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcGFyc2VBY3Rpb25zKG5hbWluZ1Jvb3QsIHN0YXRlRWxlbWVudCwgc3RhdGUpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gcGFyc2VBY3Rpb24odHlwZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGUuX25hbWUudG9Mb3dlckNhc2UoKSA9PT0gY2hpbGQubG9jYWxOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFjdGlvbiA9IHR5cGUuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGF0dHJpYnV0ZUluZGV4ID0gMDsgYXR0cmlidXRlSW5kZXggPCBjaGlsZC5hdHRyaWJ1dGVzLmxlbmd0aDsgYXR0cmlidXRlSW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IGNoaWxkLmF0dHJpYnV0ZXNbYXR0cmlidXRlSW5kZXhdLmxvY2FsTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gY2hpbGQuYXR0cmlidXRlc1thdHRyaWJ1dGVJbmRleF0udmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3Rpb24uaGFzT3duUHJvcGVydHkobmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbltuYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbi5pbml0aWFsaXplKG5hbWluZ1Jvb3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFkZEFjdGlvbihhY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc3RhdGVFbGVtZW50Lmhhc0NoaWxkTm9kZXMoKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gc3RhdGVFbGVtZW50LmZpcnN0Q2hpbGQ7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoY2hpbGQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2aXN1YWxTdGF0ZUFjdGlvblR5cGVzLmZvckVhY2gocGFyc2VBY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkID0gY2hpbGQubmV4dFNpYmxpbmc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBhcnNlU3RhdGVzKG5hbWluZ1Jvb3QsIGdyb3VwRWxlbWVudCwgZ3JvdXApIHtcclxuICAgICAgICAgICAgaWYoIGdyb3VwRWxlbWVudC5oYXNDaGlsZE5vZGVzKCkgKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBncm91cEVsZW1lbnQuZmlyc3RDaGlsZDtcclxuICAgICAgICAgICAgICAgIHdoaWxlKCBjaGlsZCApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiggY2hpbGQubG9jYWxOYW1lID09PSBcInZpc3VhbHN0YXRlXCIgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IEJpZnJvc3QuaW50ZXJhY3Rpb24uVmlzdWFsU3RhdGUuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLm5hbWUgPSBjaGlsZC5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cC5hZGRTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlQWN0aW9ucyhuYW1pbmdSb290LCBjaGlsZCwgc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGNoaWxkLm5leHRTaWJsaW5nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy52aXNpdCA9IGZ1bmN0aW9uIChlbGVtZW50LCBhY3Rpb25zKSB7XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmxvY2FsTmFtZSA9PT0gXCJ2aXN1YWxzdGF0ZW1hbmFnZXJcIikge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZpc3VhbFN0YXRlTWFuYWdlciA9IEJpZnJvc3QuaW50ZXJhY3Rpb24uVmlzdWFsU3RhdGVNYW5hZ2VyLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5hbWluZ1Jvb3QgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQubmFtaW5nUm9vdDtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQucGFyZW50RWxlbWVudC52aXN1YWxTdGF0ZU1hbmFnZXIgPSB2aXN1YWxTdGF0ZU1hbmFnZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuaGFzQ2hpbGROb2RlcygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gZWxlbWVudC5maXJzdENoaWxkO1xyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChjaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGQubG9jYWxOYW1lID09PSBcInZpc3VhbHN0YXRlZ3JvdXBcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdyb3VwID0gQmlmcm9zdC5pbnRlcmFjdGlvbi5WaXN1YWxTdGF0ZUdyb3VwLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzdWFsU3RhdGVNYW5hZ2VyLmFkZEdyb3VwKGdyb3VwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZHVyYXRpb24gPSBjaGlsZC5nZXRBdHRyaWJ1dGUoXCJkdXJhdGlvblwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChkdXJhdGlvbikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbiA9IHBhcnNlRmxvYXQoZHVyYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNOYU4oZHVyYXRpb24pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uID0gZHVyYXRpb24gKiAxMDAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGltZXNwYW4gPSBCaWZyb3N0LlRpbWVTcGFuLmZyb21NaWxsaXNlY29uZHMoZHVyYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cC5kZWZhdWx0RHVyYXRpb24gPSB0aW1lc3BhbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VTdGF0ZXMobmFtaW5nUm9vdCwgY2hpbGQsIGdyb3VwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGNoaWxkLm5leHRTaWJsaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm5hdmlnYXRpb25cIiwge1xyXG4gICAgTmF2aWdhdGlvbkZyYW1lOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uIChob21lLCB1cmlNYXBwZXIsIGhpc3RvcnkpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuaG9tZSA9IGhvbWU7XHJcbiAgICAgICAgdGhpcy5oaXN0b3J5ID0gaGlzdG9yeTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFVyaSA9IGtvLm9ic2VydmFibGUoaG9tZSk7XHJcbiAgICAgICAgdGhpcy51cmlNYXBwZXIgPSB1cmlNYXBwZXIgfHwgbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRDdXJyZW50VXJpID0gZnVuY3Rpb24gKHBhdGgpIHtcclxuICAgICAgICAgICAgaWYgKHBhdGguaW5kZXhPZihcIi9cIikgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cigxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocGF0aC5sYXN0SW5kZXhPZihcIi9cIikgPT09IHBhdGgubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDAsIHBhdGgubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBhdGggPT0gbnVsbCB8fCBwYXRoLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHNlbGYuaG9tZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2VsZi51cmlNYXBwZXIgIT0gbnVsbCAmJiAhc2VsZi51cmlNYXBwZXIuaGFzTWFwcGluZ0ZvcihwYXRoKSkge1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHNlbGYuaG9tZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZWxmLmN1cnJlbnRVcmkocGF0aCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRDdXJyZW50VXJpRnJvbUN1cnJlbnRMb2NhdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHN0YXRlID0gc2VsZi5oaXN0b3J5LmdldFN0YXRlKCk7XHJcbiAgICAgICAgICAgIHZhciB1cmkgPSBCaWZyb3N0LlVyaS5jcmVhdGUoc3RhdGUudXJsKTtcclxuICAgICAgICAgICAgc2VsZi5zZXRDdXJyZW50VXJpKHVyaS5wYXRoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBoaXN0b3J5LkFkYXB0ZXIuYmluZCh3aW5kb3csIFwic3RhdGVjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZWxmLnNldEN1cnJlbnRVcmlGcm9tQ3VycmVudExvY2F0aW9uKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29uZmlndXJlRm9yID0gZnVuY3Rpb24gKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgICBzZWxmLnNldEN1cnJlbnRVcmlGcm9tQ3VycmVudExvY2F0aW9uKCk7XHJcbiAgICAgICAgICAgIHNlbGYuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG5cclxuICAgICAgICAgICAgdmFyIHVyaU1hcHBlciA9ICQoY29udGFpbmVyKS5jbG9zZXN0KFwiW2RhdGEtdXJpbWFwcGVyXVwiKTtcclxuICAgICAgICAgICAgaWYgKHVyaU1hcHBlci5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIHZhciB1cmlNYXBwZXJOYW1lID0gJCh1cmlNYXBwZXJbMF0pLmRhdGEoXCJ1cmltYXBwZXJcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAodXJpTWFwcGVyTmFtZSBpbiBCaWZyb3N0LnVyaU1hcHBlcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnVyaU1hcHBlciA9IEJpZnJvc3QudXJpTWFwcGVyc1t1cmlNYXBwZXJOYW1lXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2VsZi51cmlNYXBwZXIgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi51cmlNYXBwZXIgPSBCaWZyb3N0LnVyaU1hcHBlcnMuZGVmYXVsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMubmF2aWdhdGUgPSBmdW5jdGlvbiAodXJpKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0Q3VycmVudFVyaSh1cmkpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfSlcclxufSk7IiwiaWYgKHR5cGVvZiBrbyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIEhpc3RvcnkgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIEhpc3RvcnkuQWRhcHRlciAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAga28uYmluZGluZ0hhbmRsZXJzLm5hdmlnYXRlVG8gPSB7XHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdBY2Nlc3Nvciwgdmlld01vZGVsKSB7XHJcbiAgICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3NUb05vZGUoZWxlbWVudCwge1xyXG4gICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBmZWF0dXJlTmFtZSA9IHZhbHVlQWNjZXNzb3IoKSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIEhpc3RvcnkucHVzaFN0YXRlKHtmZWF0dXJlOmZlYXR1cmVOYW1lfSwkKGVsZW1lbnQpLmF0dHIoXCJ0aXRsZVwiKSxcIi9cIisgZmVhdHVyZU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCB2aWV3TW9kZWwpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubmF2aWdhdGlvblwiLCB7XHJcbiAgICBuYXZpZ2F0ZVRvOiBmdW5jdGlvbiAoZmVhdHVyZU5hbWUsIHF1ZXJ5U3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIHVybCA9IGZlYXR1cmVOYW1lO1xyXG5cclxuICAgICAgICBpZiAoZmVhdHVyZU5hbWUuY2hhckF0KDApICE9PSBcIi9cIikge1xyXG4gICAgICAgICAgICB1cmwgPSBcIi9cIiArIHVybDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChxdWVyeVN0cmluZykge1xyXG4gICAgICAgICAgICB1cmwgKz0gcXVlcnlTdHJpbmc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUT0RPOiBTdXBwb3J0IHRpdGxlIHNvbWVob3dcclxuICAgICAgICBpZiAodHlwZW9mIEhpc3RvcnkgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIEhpc3RvcnkuQWRhcHRlciAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICBIaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJcIiwgdXJsKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgbmF2aWdhdGlvbk1hbmFnZXI6IHtcclxuICAgICAgICBnZXRDdXJyZW50TG9jYXRpb246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgdXJpID0gQmlmcm9zdC5VcmkuY3JlYXRlKHdpbmRvdy5sb2NhdGlvbi50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgcmV0dXJuIHVyaTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBob29rdXA6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBIaXN0b3J5ICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBIaXN0b3J5LkFkYXB0ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICQoXCJib2R5XCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhyZWYgPSBlLnRhcmdldC5ocmVmO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaHJlZiA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2xvc2VzdEFuY2hvciA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoXCJhXCIpWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNsb3Nlc3RBbmNob3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBocmVmID0gY2xvc2VzdEFuY2hvci5ocmVmO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaHJlZi5pbmRleE9mKFwiIyFcIikgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhyZWYgPSBocmVmLnN1YnN0cigwLCBocmVmLmluZGV4T2YoXCIjIVwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaHJlZi5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHJlZiA9IFwiL1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0VXJpID0gQmlmcm9zdC5VcmkuY3JlYXRlKGhyZWYpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRVcmkuaXNTYW1lQXNPcmlnaW4gJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VXJpLnF1ZXJ5U3RyaW5nLmluZGV4T2YoXCJwb3N0YmFja1wiKTwwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSB0YXJnZXRVcmkucGF0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRhcmdldC5pbmRleE9mKFwiL1wiKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnN1YnN0cigxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gJChlLnRhcmdldCkuY2xvc2VzdChcIltkYXRhLW5hdmlnYXRpb24tdGFyZ2V0XVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZCA9ICQocmVzdWx0WzBdKS5kYXRhKFwibmF2aWdhdGlvbi10YXJnZXRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9ICQoXCIjXCIraWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQubGVuZ3RoID09PSAxICYmIHR5cGVvZiBlbGVtZW50WzBdLm5hdmlnYXRpb25GcmFtZSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRbMF0ubmF2aWdhdGlvbkZyYW1lLm5hdmlnYXRlKHRhcmdldFVyaS5wYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRWxlbWVudCBub3QgZm91bmRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBxdWVyeVN0cmluZyA9IHRhcmdldFVyaS5xdWVyeVN0cmluZy5sZW5ndGggPiAwID8gXCI/XCIgKyB0YXJnZXRVcmkucXVlcnlTdHJpbmcgOiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSGlzdG9yeS5wdXNoU3RhdGUoe30sIFwiXCIsIFwiL1wiICsgdGFyZ2V0ICsgcXVlcnlTdHJpbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5uYXZpZ2F0aW9uXCIsIHtcclxuICAgIG9ic2VydmFibGVRdWVyeVBhcmFtZXRlckZhY3Rvcnk6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciBoaXN0b3J5RW5hYmxlZCA9IHR5cGVvZiBIaXN0b3J5ICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBIaXN0b3J5LkFkYXB0ZXIgIT09IFwidW5kZWZpbmVkXCI7XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKHBhcmFtZXRlck5hbWUsIGRlZmF1bHRWYWx1ZSwgbmF2aWdhdGlvbk1hbmFnZXIpIHtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldFN0YXRlKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHVyaSA9IG5hdmlnYXRpb25NYW5hZ2VyLmdldEN1cnJlbnRMb2NhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHVyaS5wYXJhbWV0ZXJzLmhhc093blByb3BlcnR5KHBhcmFtZXRlck5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVyaS5wYXJhbWV0ZXJzW3BhcmFtZXRlck5hbWVdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgb2JzZXJ2YWJsZSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAoaGlzdG9yeUVuYWJsZWQpIHtcclxuICAgICAgICAgICAgICAgIEhpc3RvcnkuQWRhcHRlci5iaW5kKHdpbmRvdywgXCJzdGF0ZWNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9ic2VydmFibGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZhYmxlKGdldFN0YXRlKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJoYXNoY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JzZXJ2YWJsZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYnNlcnZhYmxlKCkgIT09IHN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZhYmxlKHN0YXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHN0YXRlID0gZ2V0U3RhdGUoKTtcclxuICAgICAgICAgICAgb2JzZXJ2YWJsZSA9IGtvLm9ic2VydmFibGUoc3RhdGUgfHwgZGVmYXVsdFZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldFF1ZXJ5U3RyaW5nUGFyYW1ldGVyc1dpdGhWYWx1ZUZvclBhcmFtZXRlcih1cmwsIHBhcmFtZXRlclZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyYW1ldGVycyA9IEJpZnJvc3QuaGFzaFN0cmluZy5kZWNvZGUodXJsKTtcclxuICAgICAgICAgICAgICAgIHBhcmFtZXRlcnNbcGFyYW1ldGVyTmFtZV0gPSBwYXJhbWV0ZXJWYWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcXVlcnlTdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtZXRlckluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHBhcmFtZXRlciBpbiBwYXJhbWV0ZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gcGFyYW1ldGVyc1twYXJhbWV0ZXJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtZXRlckluZGV4ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlTdHJpbmcgKz0gXCImXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlTdHJpbmcgKz0gcGFyYW1ldGVyICsgXCI9XCIgKyB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVySW5kZXgrKztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcXVlcnlTdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNsZWFuUXVlcnlTdHJpbmcocXVlcnlTdHJpbmcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChxdWVyeVN0cmluZy5pbmRleE9mKFwiI1wiKSA9PT0gMCB8fCBxdWVyeVN0cmluZy5pbmRleE9mKFwiP1wiKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5U3RyaW5nID0gcXVlcnlTdHJpbmcuc3Vic3RyKDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5U3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBxdWVyeVN0cmluZztcclxuICAgICAgICAgICAgICAgIGlmIChoaXN0b3J5RW5hYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IEhpc3RvcnkuZ2V0U3RhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZVtwYXJhbWV0ZXJOYW1lXSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5U3RyaW5nID0gXCI/XCIgKyBnZXRRdWVyeVN0cmluZ1BhcmFtZXRlcnNXaXRoVmFsdWVGb3JQYXJhbWV0ZXIoY2xlYW5RdWVyeVN0cmluZyhzdGF0ZS51cmwpLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgSGlzdG9yeS5wdXNoU3RhdGUoc3RhdGUsIHN0YXRlLnRpdGxlLCBxdWVyeVN0cmluZyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5U3RyaW5nID0gXCIjXCIgKyBnZXRRdWVyeVN0cmluZ1BhcmFtZXRlcnNXaXRoVmFsdWVGb3JQYXJhbWV0ZXIoY2xlYW5RdWVyeVN0cmluZyhkb2N1bWVudC5sb2NhdGlvbi5oYXNoKSwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhhc2ggPSBxdWVyeVN0cmluZztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcblxyXG5rby5vYnNlcnZhYmxlUXVlcnlQYXJhbWV0ZXIgPSBmdW5jdGlvbiAocGFyYW1ldGVyTmFtZSwgZGVmYXVsdFZhbHVlKSB7XHJcbiAgICB2YXIgbmF2aWdhdGlvbk1hbmFnZXIgPSBCaWZyb3N0Lm5hdmlnYXRpb24ubmF2aWdhdGlvbk1hbmFnZXI7XHJcbiAgICB2YXIgb2JzZXJ2YWJsZSA9IEJpZnJvc3QubmF2aWdhdGlvbi5vYnNlcnZhYmxlUXVlcnlQYXJhbWV0ZXJGYWN0b3J5LmNyZWF0ZSgpLmNyZWF0ZShwYXJhbWV0ZXJOYW1lLCBkZWZhdWx0VmFsdWUsIG5hdmlnYXRpb25NYW5hZ2VyKTtcclxuICAgIHJldHVybiBvYnNlcnZhYmxlO1xyXG59O1xyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubmF2aWdhdGlvblwiLCB7XHJcbiAgICBEYXRhTmF2aWdhdGlvbkZyYW1lQXR0cmlidXRlRWxlbWVudFZpc2l0b3I6IEJpZnJvc3QubWFya3VwLkVsZW1lbnRWaXNpdG9yLmV4dGVuZChmdW5jdGlvbiAoZG9jdW1lbnRTZXJ2aWNlKSB7XHJcbiAgICAgICAgdGhpcy52aXNpdCA9IGZ1bmN0aW9uIChlbGVtZW50LCBhY3Rpb25zKSB7XHJcbiAgICAgICAgICAgIHZhciBkYXRhTmF2aWdhdGlvbkZyYW1lID0gZWxlbWVudC5hdHRyaWJ1dGVzLmdldE5hbWVkSXRlbShcImRhdGEtbmF2aWdhdGlvbi1mcmFtZVwiKTtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGRhdGFOYXZpZ2F0aW9uRnJhbWUpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YUJpbmRTdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGFCaW5kID0gZWxlbWVudC5hdHRyaWJ1dGVzLmdldE5hbWVkSXRlbShcImRhdGEtYmluZFwiKTtcclxuICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChkYXRhQmluZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhQmluZFN0cmluZyA9IGRhdGFCaW5kLnZhbHVlICsgXCIsIFwiO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhQmluZCA9IGRvY3VtZW50LmNyZWF0ZUF0dHJpYnV0ZShcImRhdGEtYmluZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRhdGFCaW5kLnZhbHVlID0gZGF0YUJpbmRTdHJpbmcgKyBcIm5hdmlnYXRpb246ICdcIiArIGRhdGFOYXZpZ2F0aW9uRnJhbWUudmFsdWUgKyBcIidcIjtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cmlidXRlcy5zZXROYW1lZEl0ZW0oZGF0YUJpbmQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cmlidXRlcy5yZW1vdmVOYW1lZEl0ZW0oXCJkYXRhLW5hdmlnYXRpb24tZnJhbWVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5uYXZpZ2F0aW9uXCIsIHtcclxuICAgIG5hdmlnYXRpb25CaW5kaW5nSGFuZGxlcjogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0TmF2aWdhdGlvbkZyYW1lRm9yKHZhbHVlQWNjZXNzb3IpIHtcclxuICAgICAgICAgICAgdmFyIGNvbmZpZ3VyYXRpb25TdHJpbmcgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSk7XHJcbiAgICAgICAgICAgIHZhciBjb25maWd1cmF0aW9uSXRlbXMgPSBrby5leHByZXNzaW9uUmV3cml0aW5nLnBhcnNlT2JqZWN0TGl0ZXJhbChjb25maWd1cmF0aW9uU3RyaW5nKTtcclxuICAgICAgICAgICAgdmFyIGNvbmZpZ3VyYXRpb24gPSB7fTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBjb25maWd1cmF0aW9uSXRlbXMubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGNvbmZpZ3VyYXRpb25JdGVtc1tpbmRleF07XHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uW2l0ZW0ua2V5LnRyaW0oKV0gPSBpdGVtLnZhbHVlLnRyaW0oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHVyaU1hcHBlck5hbWUgPSBjb25maWd1cmF0aW9uLnVyaU1hcHBlcjtcclxuICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodXJpTWFwcGVyTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIHVyaU1hcHBlck5hbWUgPSBcImRlZmF1bHRcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIG1hcHBlciA9IEJpZnJvc3QudXJpTWFwcGVyc1t1cmlNYXBwZXJOYW1lXTtcclxuICAgICAgICAgICAgdmFyIGZyYW1lID0gQmlmcm9zdC5uYXZpZ2F0aW9uLk5hdmlnYXRpb25GcmFtZS5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgbG9jYXRpb25Bd2FyZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB1cmlNYXBwZXI6IG1hcHBlcixcclxuICAgICAgICAgICAgICAgIGhvbWU6IGNvbmZpZ3VyYXRpb24uaG9tZSB8fCAnJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmcmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG1ha2VWYWx1ZUFjY2Vzc29yKG5hdmlnYXRpb25GcmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5hdmlnYXRpb25GcmFtZS5jdXJyZW50VXJpKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmluaXQgPSBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3NBY2Nlc3Nvciwgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCkge1xyXG4gICAgICAgICAgICB2YXIgbmF2aWdhdGlvbkZyYW1lID0gZ2V0TmF2aWdhdGlvbkZyYW1lRm9yKHZhbHVlQWNjZXNzb3IpO1xyXG4gICAgICAgICAgICBuYXZpZ2F0aW9uRnJhbWUuY29uZmlndXJlRm9yKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4ga28uYmluZGluZ0hhbmRsZXJzLnZpZXcuaW5pdChlbGVtZW50LCBtYWtlVmFsdWVBY2Nlc3NvcihuYXZpZ2F0aW9uRnJhbWUpLCBhbGxCaW5kaW5nc0FjY2Vzc29yLCB2aWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzQWNjZXNzb3IsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpIHtcclxuICAgICAgICAgICAgdmFyIG5hdmlnYXRpb25GcmFtZSA9IGdldE5hdmlnYXRpb25GcmFtZUZvcih2YWx1ZUFjY2Vzc29yKTtcclxuICAgICAgICAgICAgbmF2aWdhdGlvbkZyYW1lLmNvbmZpZ3VyZUZvcihlbGVtZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIGtvLmJpbmRpbmdIYW5kbGVycy52aWV3LnVwZGF0ZShlbGVtZW50LCBtYWtlVmFsdWVBY2Nlc3NvcihuYXZpZ2F0aW9uRnJhbWUpLCBhbGxCaW5kaW5nc0FjY2Vzc29yLCB2aWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QubmF2aWdhdGlvbi5uYXZpZ2F0aW9uQmluZGluZ0hhbmRsZXIuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGtvLmJpbmRpbmdIYW5kbGVycy5uYXZpZ2F0aW9uID0gQmlmcm9zdC5uYXZpZ2F0aW9uLm5hdmlnYXRpb25CaW5kaW5nSGFuZGxlci5jcmVhdGUoKTtcclxuICAgIGtvLmpzb25FeHByZXNzaW9uUmV3cml0aW5nLmJpbmRpbmdSZXdyaXRlVmFsaWRhdG9ycy5uYXZpZ2F0aW9uID0gZmFsc2U7IC8vIENhbid0IHJld3JpdGUgY29udHJvbCBmbG93IGJpbmRpbmdzXHJcbiAgICBrby52aXJ0dWFsRWxlbWVudHMuYWxsb3dlZEJpbmRpbmdzLm5hdmlnYXRpb24gPSB0cnVlO1xyXG59O1xyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsdWVzXCIsIHtcclxuICAgIFR5cGVDb252ZXJ0ZXI6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuc3VwcG9ydGVkVHlwZSA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuY29udmVydEZyb20gPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY29udmVydFRvID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbHVlc1wiLCB7XHJcbiAgICBOdW1iZXJUeXBlQ29udmVydGVyOiBCaWZyb3N0LnZhbHVlcy5UeXBlQ29udmVydGVyLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFsbG93ZWRDaGFyYWN0ZXJzID0gXCIwMTIzNDU2Nzg5LiwtXCI7XHJcblxyXG4gICAgICAgIHRoaXMuc3VwcG9ydGVkVHlwZSA9IE51bWJlcjtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc3RyaXBMZXR0ZXJzKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgdmFyIHJldHVyblZhbHVlID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGNoYXJJbmRleCA9IDA7IGNoYXJJbmRleCA8IHZhbHVlLmxlbmd0aDsgY2hhckluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgYWxsb3dlZENoYXJJbmRleCA9IDA7IGFsbG93ZWRDaGFySW5kZXggPCBhbGxvd2VkQ2hhcmFjdGVycy5sZW5ndGg7IGFsbG93ZWRDaGFySW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZVtjaGFySW5kZXhdID09PSBhbGxvd2VkQ2hhcmFjdGVyc1thbGxvd2VkQ2hhckluZGV4XSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblZhbHVlID0gcmV0dXJuVmFsdWUgKyB2YWx1ZVtjaGFySW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY29udmVydEZyb20gPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlLmNvbnN0cnVjdG9yID09PSBOdW1iZXIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhbHVlID0gc3RyaXBMZXR0ZXJzKHZhbHVlKTtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IDA7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5pbmRleE9mKFwiLlwiKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBwYXJzZUZsb2F0KHZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHBhcnNlSW50KHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsdWVzXCIsIHtcclxuICAgIERhdGVUeXBlQ29udmVydGVyOiBCaWZyb3N0LnZhbHVlcy5UeXBlQ29udmVydGVyLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5zdXBwb3J0ZWRUeXBlID0gRGF0ZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaXNOdWxsKHRpbWUpIHtcclxuICAgICAgICAgICAgLy8gVHJlYXQgc2VyaWFsaXphdGlvbiBvZiBkZWZhdWx0KERhdGVUaW1lKSBmcm9tIHNlcnZlciBhcyBudWxsLlxyXG4gICAgICAgICAgICByZXR1cm4gQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh0aW1lKSB8fFxyXG4gICAgICAgICAgICAgICAgLy8gSVNPIDg2MDEgZm9ybWF0cyBmb3IgZGVmYXVsdChEYXRlVGltZSk6XHJcbiAgICAgICAgICAgICAgICB0aW1lID09PSBcIjAwMDEtMDEtMDFUMDA6MDA6MDBcIiB8fFxyXG4gICAgICAgICAgICAgICAgdGltZSA9PT0gXCIwMDAxLTAxLTAxVDAwOjAwOjAwWlwiIHx8XHJcbiAgICAgICAgICAgICAgICAvLyBuZXcgRGF0ZShcIjAwMDEtMDEtMDFUMDA6MDA6MDBcIikgaW4gQ2hyb21lIGFuZCBGaXJlZm94OlxyXG4gICAgICAgICAgICAgICAgKHRpbWUgaW5zdGFuY2VvZiBEYXRlICYmIHRpbWUuZ2V0VGltZSgpID09PSAtNjIxMzU1OTY4MDAwMDApIHx8XHJcbiAgICAgICAgICAgICAgICAvLyBuZXcgRGF0ZShcIjAwMDEtMDEtMDFUMDA6MDA6MDBcIikgb3IgYW55IG90aGVyIGludmFsaWQgZGF0ZSBpbiBJbnRlcm5ldCBFeHBsb3JlcjpcclxuICAgICAgICAgICAgICAgICh0aW1lIGluc3RhbmNlb2YgRGF0ZSAmJiBpc05hTih0aW1lLmdldFRpbWUoKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb252ZXJ0RnJvbSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAoaXNOdWxsKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY29udmVydFRvID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5mb3JtYXQoXCJ5eXl5LU1NLWRkXCIpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsdWVzXCIsIHtcclxuICAgIFN0cmluZ1R5cGVDb252ZXJ0ZXI6IEJpZnJvc3QudmFsdWVzLlR5cGVDb252ZXJ0ZXIuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnN1cHBvcnRlZFR5cGUgPSBTdHJpbmc7XHJcblxyXG4gICAgICAgIHRoaXMuY29udmVydEZyb20gPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWx1ZXNcIiwge1xyXG4gICAgdHlwZUNvbnZlcnRlcnM6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgY29udmVydGVyc0J5VHlwZSA9IHt9O1xyXG5cclxuICAgICAgICB2YXIgdHlwZUNvbnZlcnRlclR5cGVzID0gQmlmcm9zdC52YWx1ZXMuVHlwZUNvbnZlcnRlci5nZXRFeHRlbmRlcnMoKTtcclxuICAgICAgICB0eXBlQ29udmVydGVyVHlwZXMuZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgICAgICB2YXIgY29udmVydGVyID0gdHlwZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgY29udmVydGVyc0J5VHlwZVtjb252ZXJ0ZXIuc3VwcG9ydGVkVHlwZV0gPSBjb252ZXJ0ZXI7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udmVydEZyb20gPSBmdW5jdGlvbiAodmFsdWUsIHR5cGUpIHtcclxuICAgICAgICAgICAgdmFyIGFjdHVhbFR5cGUgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc1N0cmluZyh0eXBlKSkge1xyXG4gICAgICAgICAgICAgICAgYWN0dWFsVHlwZSA9IGV2YWwodHlwZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhY3R1YWxUeXBlID0gdHlwZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY29udmVydGVyc0J5VHlwZS5oYXNPd25Qcm9wZXJ0eShhY3R1YWxUeXBlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnZlcnRlcnNCeVR5cGVbYWN0dWFsVHlwZV0uY29udmVydEZyb20odmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jb252ZXJ0VG8gPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yICh2YXIgY29udmVydGVyIGluIGNvbnZlcnRlcnNCeVR5cGUpIHtcclxuICAgICAgICAgICAgICAgIC8qIGpzaGludCBlcWVxZXE6IGZhbHNlICovXHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUuY29uc3RydWN0b3IgPT0gY29udmVydGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnZlcnRlcnNCeVR5cGVbY29udmVydGVyXS5jb252ZXJ0VG8odmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLnR5cGVDb252ZXJ0ZXJzID0gQmlmcm9zdC52YWx1ZXMudHlwZUNvbnZlcnRlcnM7XHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWx1ZXNcIiwge1xyXG4gICAgdHlwZUV4dGVuZGVyOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5leHRlbmQgPSBmdW5jdGlvbiAodGFyZ2V0LCB0eXBlQXNTdHJpbmcpIHtcclxuICAgICAgICAgICAgdGFyZ2V0Ll90eXBlQXNTdHJpbmcgPSB0eXBlQXNTdHJpbmc7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5rby5leHRlbmRlcnMudHlwZSA9IEJpZnJvc3QudmFsdWVzLnR5cGVFeHRlbmRlci5jcmVhdGUoKS5leHRlbmQ7XHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWx1ZXNcIiwge1xyXG4gICAgRm9ybWF0dGVyOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnN1cHBvcnRlZFR5cGUgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmZvcm1hdCA9IGZ1bmN0aW9uICh2YWx1ZSwgZm9ybWF0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbHVlc1wiLCB7XHJcbiAgICBEYXRlRm9ybWF0dGVyOiBCaWZyb3N0LnZhbHVlcy5Gb3JtYXR0ZXIuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnN1cHBvcnRlZFR5cGUgPSBEYXRlO1xyXG5cclxuICAgICAgICB0aGlzLmZvcm1hdCA9IGZ1bmN0aW9uICh2YWx1ZSwgZm9ybWF0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5mb3JtYXQoZm9ybWF0KTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbHVlc1wiLCB7XHJcbiAgICBzdHJpbmdGb3JtYXR0ZXI6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZm9ybWF0dGVyVHlwZXMgPSBCaWZyb3N0LnZhbHVlcy5Gb3JtYXR0ZXIuZ2V0RXh0ZW5kZXJzKCk7XHJcbiAgICAgICAgdmFyIGZvcm1hdHRlcnNCeVR5cGUgPSB7fTtcclxuXHJcbiAgICAgICAgZm9ybWF0dGVyVHlwZXMuZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgICAgICB2YXIgZm9ybWF0dGVyID0gdHlwZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgZm9ybWF0dGVyc0J5VHlwZVtmb3JtYXR0ZXIuc3VwcG9ydGVkVHlwZV0gPSBmb3JtYXR0ZXI7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldEZvcm1hdChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50Lm5vZGVUeXBlICE9PSAxIHx8IEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoZWxlbWVudC5hdHRyaWJ1dGVzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHN0cmluZ0Zvcm1hdEF0dHJpYnV0ZSA9IGVsZW1lbnQuYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oXCJkYXRhLXN0cmluZ2Zvcm1hdFwiKTtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHN0cmluZ0Zvcm1hdEF0dHJpYnV0ZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdHJpbmdGb3JtYXRBdHRyaWJ1dGUudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5oYXNGb3JtYXQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICB2YXIgZm9ybWF0ID0gZ2V0Rm9ybWF0KGVsZW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0ICE9PSBudWxsO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZm9ybWF0ID0gZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhciBmb3JtYXQgPSBnZXRGb3JtYXQoZWxlbWVudCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZm9ybWF0dGVyc0J5VHlwZS5oYXNPd25Qcm9wZXJ0eSh2YWx1ZS5jb25zdHJ1Y3RvcikpIHtcclxuICAgICAgICAgICAgICAgIHZhciBmb3JtYXR0ZXIgPSBmb3JtYXR0ZXJzQnlUeXBlW3ZhbHVlLmNvbnN0cnVjdG9yXTtcclxuICAgICAgICAgICAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJ7KC5bXnt9XSkqfVwiLCBcImdcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZm9ybWF0LnJlcGxhY2UocmVnZXgsIGZ1bmN0aW9uIChmb3JtYXRFeHByZXNzaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGV4cHJlc3Npb24gPSBmb3JtYXRFeHByZXNzaW9uLnN1YnN0cigxLCBmb3JtYXRFeHByZXNzaW9uLmxlbmd0aCAtIDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXR0ZXIuZm9ybWF0KHZhbHVlLCBleHByZXNzaW9uKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdDtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbHVlc1wiLCB7XHJcbiAgICB2YWx1ZVBpcGVsaW5lOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAodHlwZUNvbnZlcnRlcnMsIHN0cmluZ0Zvcm1hdHRlcikge1xyXG4gICAgICAgIHRoaXMuZ2V0VmFsdWVGb3JWaWV3ID0gZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBhY3R1YWxWYWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWUpO1xyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChhY3R1YWxWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHJldHVyblZhbHVlID0gYWN0dWFsVmFsdWU7XHJcblxyXG4gICAgICAgICAgICBpZiAoc3RyaW5nRm9ybWF0dGVyLmhhc0Zvcm1hdChlbGVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSBzdHJpbmdGb3JtYXR0ZXIuZm9ybWF0KGVsZW1lbnQsIGFjdHVhbFZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh2YWx1ZS5fdHlwZUFzU3RyaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblZhbHVlID0gdHlwZUNvbnZlcnRlcnMuY29udmVydFRvKGFjdHVhbFZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRWYWx1ZUZvclByb3BlcnR5ID0gZnVuY3Rpb24gKHByb3BlcnR5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQocHJvcGVydHkuX3R5cGVBc1N0cmluZykpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gdHlwZUNvbnZlcnRlcnMuY29udmVydEZyb20odmFsdWUsIHByb3BlcnR5Ll90eXBlQXNTdHJpbmcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB2YWx1ZVBpcGVsaW5lID0gQmlmcm9zdC52YWx1ZXMudmFsdWVQaXBlbGluZS5jcmVhdGUoKTtcclxuXHJcbiAgICB2YXIgb2xkUmVhZFZhbHVlID0ga28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWU7XHJcbiAgICBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gb2xkUmVhZFZhbHVlKGVsZW1lbnQpO1xyXG5cclxuICAgICAgICB2YXIgYmluZGluZ3MgPSBrby5iaW5kaW5nUHJvdmlkZXIuaW5zdGFuY2UuZ2V0QmluZGluZ3MoZWxlbWVudCwga28uY29udGV4dEZvcihlbGVtZW50KSk7XHJcbiAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoYmluZGluZ3MpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHZhbHVlUGlwZWxpbmUuZ2V0VmFsdWVGb3JQcm9wZXJ0eShiaW5kaW5ncy52YWx1ZSwgdmFsdWUpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBvbGRXcml0ZVZhbHVlID0ga28uc2VsZWN0RXh0ZW5zaW9ucy53cml0ZVZhbHVlO1xyXG4gICAga28uc2VsZWN0RXh0ZW5zaW9ucy53cml0ZVZhbHVlID0gZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlLCBhbGxvd1Vuc2V0KSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHZhbHVlO1xyXG4gICAgICAgIHZhciBiaW5kaW5ncyA9IGtvLmJpbmRpbmdQcm92aWRlci5pbnN0YW5jZS5nZXRCaW5kaW5ncyhlbGVtZW50LCBrby5jb250ZXh0Rm9yKGVsZW1lbnQpKTtcclxuICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoYmluZGluZ3MpKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVQaXBlbGluZS5nZXRWYWx1ZUZvclZpZXcoZWxlbWVudCwgYmluZGluZ3MudmFsdWUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb2xkV3JpdGVWYWx1ZShlbGVtZW50LCByZXN1bHQsIGFsbG93VW5zZXQpO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgb2xkU2V0VGV4dENvbnRlbnQgPSBrby51dGlscy5zZXRUZXh0Q29udGVudDtcclxuICAgIGtvLnV0aWxzLnNldFRleHRDb250ZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHZhbHVlUGlwZWxpbmUuZ2V0VmFsdWVGb3JWaWV3KGVsZW1lbnQsIHZhbHVlKTtcclxuICAgICAgICBvbGRTZXRUZXh0Q29udGVudChlbGVtZW50LCByZXN1bHQpO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgb2xkU2V0SHRtbCA9IGtvLnV0aWxzLnNldEh0bWw7XHJcbiAgICBrby51dGlscy5zZXRIdG1sID0gZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHZhbHVlUGlwZWxpbmUuZ2V0VmFsdWVGb3JWaWV3KGVsZW1lbnQsIHZhbHVlKTtcclxuICAgICAgICBvbGRTZXRIdG1sKGVsZW1lbnQsIHJlc3VsdCk7XHJcbiAgICB9O1xyXG59KSgpOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWx1ZXNcIiwge1xyXG4gICAgVmFsdWVQcm92aWRlcjogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZGVmYXVsdFByb3BlcnR5ID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5wcm92aWRlID0gZnVuY3Rpb24gKGNvbnN1bWVyKSB7XHJcblxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsdWVzXCIsIHtcclxuICAgIHZhbHVlUHJvdmlkZXJzOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaXNLbm93biA9IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgdmFsdWVQcm92aWRlcnMgPSBCaWZyb3N0LnZhbHVlcy5WYWx1ZVByb3ZpZGVyLmdldEV4dGVuZGVycygpO1xyXG4gICAgICAgICAgICB2YWx1ZVByb3ZpZGVycy5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZVByb3ZpZGVyVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlUHJvdmlkZXJUeXBlLl9uYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGZvdW5kO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0SW5zdGFuY2VPZiA9IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IG51bGw7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZVByb3ZpZGVycyA9IEJpZnJvc3QudmFsdWVzLlZhbHVlUHJvdmlkZXIuZ2V0RXh0ZW5kZXJzKCk7XHJcbiAgICAgICAgICAgIHZhbHVlUHJvdmlkZXJzLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlUHJvdmlkZXJUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVQcm92aWRlclR5cGUuX25hbWUudG9Mb3dlckNhc2UoKSA9PT0gbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlID0gdmFsdWVQcm92aWRlclR5cGUuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIudHlwZXMudmFsdWVQcm92aWRlcnMgPSBCaWZyb3N0LnZhbHVlcy52YWx1ZVByb3ZpZGVyczsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsdWVzXCIsIHtcclxuICAgIFZhbHVlQ29uc3VtZXI6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB0aGlzLmNhbk5vdGlmeUNoYW5nZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZXMgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNvbnN1bWUgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsdWVzXCIsIHtcclxuICAgIHZhbHVlQ29uc3VtZXJzOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0Rm9yID0gZnVuY3Rpb24gKGluc3RhbmNlLCBwcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIGNvbnN1bWVyID0gQmlmcm9zdC52YWx1ZXMuRGVmYXVsdFZhbHVlQ29uc3VtZXIuY3JlYXRlKHtcclxuICAgICAgICAgICAgICAgIHRhcmdldDogaW5zdGFuY2UsXHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eTogcHJvcGVydHlOYW1lXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gY29uc3VtZXI7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy52YWx1ZUNvbnN1bWVycyA9IEJpZnJvc3QudmFsdWVzLnZhbHVlQ29uc3VtZXJzOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWx1ZXNcIiwge1xyXG4gICAgQmluZGluZzogQmlmcm9zdC52YWx1ZXMuVmFsdWVQcm92aWRlci5leHRlbmQoZnVuY3Rpb24gKGJpbmRpbmdDb250ZXh0TWFuYWdlcikge1xyXG5cclxuICAgICAgICB0aGlzLmRlZmF1bHRQcm9wZXJ0eSA9IFwicGF0aFwiO1xyXG5cclxuICAgICAgICB0aGlzLnBhdGggPSBcIlwiO1xyXG4gICAgICAgIHRoaXMubW9kZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jb252ZXJ0ZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZm9ybWF0ID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5wcm92aWRlID0gZnVuY3Rpb24gKGNvbnN1bWVyKSB7XHJcblxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsdWVzXCIsIHtcclxuICAgIERlZmF1bHRWYWx1ZUNvbnN1bWVyOiBCaWZyb3N0LnZhbHVlcy5WYWx1ZUNvbnN1bWVyLmV4dGVuZChmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eSkge1xyXG4gICAgICAgIHRoaXMuY29uc3VtZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRhcmdldFtwcm9wZXJ0eV0gPSB2YWx1ZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIGNvbmZpZ3VyYXRvcjogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWd1cmUgPSBmdW5jdGlvbiAoY29uZmlndXJlKSB7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBjb25maWd1cmVUeXBlOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbihhc3NldHNNYW5hZ2VyKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgZGVmYXVsdFVyaU1hcHBlciA9IEJpZnJvc3QuU3RyaW5nTWFwcGVyLmNyZWF0ZSgpO1xyXG4gICAgICAgIGRlZmF1bHRVcmlNYXBwZXIuYWRkTWFwcGluZyhcIntib3VuZGVkQ29udGV4dH0ve21vZHVsZX0ve2ZlYXR1cmV9L3t2aWV3fVwiLCBcIntib3VuZGVkQ29udGV4dH0ve21vZHVsZX0ve2ZlYXR1cmV9L3t2aWV3fS5odG1sXCIpO1xyXG4gICAgICAgIGRlZmF1bHRVcmlNYXBwZXIuYWRkTWFwcGluZyhcIntib3VuZGVkQ29udGV4dH0ve2ZlYXR1cmV9L3t2aWV3fVwiLCBcIntib3VuZGVkQ29udGV4dH0ve2ZlYXR1cmV9L3t2aWV3fS5odG1sXCIpO1xyXG4gICAgICAgIGRlZmF1bHRVcmlNYXBwZXIuYWRkTWFwcGluZyhcIntmZWF0dXJlfS97dmlld31cIiwgXCJ7ZmVhdHVyZX0ve3ZpZXd9Lmh0bWxcIik7XHJcbiAgICAgICAgZGVmYXVsdFVyaU1hcHBlci5hZGRNYXBwaW5nKFwie3ZpZXd9XCIsIFwie3ZpZXd9Lmh0bWxcIik7XHJcbiAgICAgICAgQmlmcm9zdC51cmlNYXBwZXJzLmRlZmF1bHQgPSBkZWZhdWx0VXJpTWFwcGVyO1xyXG5cclxuICAgICAgICB0aGlzLmlzUmVhZHkgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlYWR5Q2FsbGJhY2tzID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUxhbmRpbmdQYWdlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmFwcGx5TWFzdGVyVmlld01vZGVsID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb25SZWFkeSgpIHtcclxuICAgICAgICAgICAgQmlmcm9zdC52aWV3cy5SZWdpb24uY3VycmVudCA9IGRvY3VtZW50LmJvZHkucmVnaW9uO1xyXG4gICAgICAgICAgICBzZWxmLmlzUmVhZHkgPSB0cnVlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBjYWxsYmFja0luZGV4ID0gMDsgY2FsbGJhY2tJbmRleCA8IHNlbGYucmVhZHlDYWxsYmFja3MubGVuZ3RoOyBjYWxsYmFja0luZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucmVhZHlDYWxsYmFja3NbY2FsbGJhY2tJbmRleF0oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaG9va1VwTmF2aWdhaW9uQW5kQXBwbHlWaWV3TW9kZWwoKSB7XHJcbiAgICAgICAgICAgIEJpZnJvc3QubmF2aWdhdGlvbi5uYXZpZ2F0aW9uTWFuYWdlci5ob29rdXAoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWxmLmFwcGx5TWFzdGVyVmlld01vZGVsID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBCaWZyb3N0LnZpZXdzLnZpZXdNb2RlbE1hbmFnZXIuY3JlYXRlKCkubWFzdGVyVmlld01vZGVsLmFwcGx5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9uU3RhcnR1cCgpIHtcclxuICAgICAgICAgICAgdmFyIGNvbmZpZ3VyYXRvcnMgPSBCaWZyb3N0LmNvbmZpZ3VyYXRvci5nZXRFeHRlbmRlcnMoKTtcclxuICAgICAgICAgICAgY29uZmlndXJhdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChjb25maWd1cmF0b3JUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29uZmlndXJhdG9yID0gY29uZmlndXJhdG9yVHlwZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRvci5jb25maWcoc2VsZik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIEJpZnJvc3QuZGVwZW5kZW5jeVJlc29sdmVycy5ET01Sb290RGVwZW5kZW5jeVJlc29sdmVyLmRvY3VtZW50SXNSZWFkeSgpO1xyXG4gICAgICAgICAgICBCaWZyb3N0LnZpZXdzLnZpZXdNb2RlbEJpbmRpbmdIYW5kbGVyLmluaXRpYWxpemUoKTtcclxuICAgICAgICAgICAgQmlmcm9zdC52aWV3cy52aWV3QmluZGluZ0hhbmRsZXIuaW5pdGlhbGl6ZSgpO1xyXG4gICAgICAgICAgICBCaWZyb3N0Lm5hdmlnYXRpb24ubmF2aWdhdGlvbkJpbmRpbmdIYW5kbGVyLmluaXRpYWxpemUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgSGlzdG9yeSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgSGlzdG9yeS5BZGFwdGVyICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICBCaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLmhpc3RvcnkgPSBIaXN0b3J5O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBhc3NldHNNYW5hZ2VyLmluaXRpYWxpemUoKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuaW5pdGlhbGl6ZUxhbmRpbmdQYWdlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQmlmcm9zdC52aWV3cy52aWV3TWFuYWdlci5jcmVhdGUoKS5pbml0aWFsaXplTGFuZGluZ1BhZ2UoKS5jb250aW51ZVdpdGgoaG9va1VwTmF2aWdhaW9uQW5kQXBwbHlWaWV3TW9kZWwpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBob29rVXBOYXZpZ2Fpb25BbmRBcHBseVZpZXdNb2RlbCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgb25SZWFkeSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlc2V0KCkge1xyXG4gICAgICAgICAgICBzZWxmLmlzUmVhZHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgc2VsZi5yZWFkeUNhbGxiYWNrcyA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZWFkeSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmlzUmVhZHkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnJlYWR5Q2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIG9uU3RhcnR1cCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QuY29uZmlndXJlID0gQmlmcm9zdC5jb25maWd1cmVUeXBlLmNyZWF0ZSgpO1xyXG4iXX0=
