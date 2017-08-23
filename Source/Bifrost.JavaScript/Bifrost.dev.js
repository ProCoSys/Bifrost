Bifrost.namespace("Bifrost", {
    dispatcher: Bifrost.Singleton(function () {
        this.schedule = function (milliseconds, callback) {
            setTimeout(callback, milliseconds);
        };
    })
});
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
Bifrost.namespace("Bifrost", {
    systemEvents: Bifrost.Singleton(function () {
        this.readModels = Bifrost.read.readModelSystemEvents.create();
        this.commands = Bifrost.commands.commandEvents.create();
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.systemEvents = Bifrost.systemEvents;
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


Bifrost.namespace("Bifrost.commands", {
    commandEvents: Bifrost.Singleton(function () {
        this.succeeded = Bifrost.Event.create();
        this.failed = Bifrost.Event.create();
    })
});
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
HTMLCollection.prototype.forEach = Array.prototype.forEach;
HTMLCollection.prototype.length = Array.prototype.length;
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
NodeList.prototype.forEach = Array.prototype.forEach;
NodeList.prototype.length = Array.prototype.length;
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
Bifrost.namespace("Bifrost.interaction", {
    Action: Bifrost.Type.extend(function () {
        this.perform = function () {
        };
    })
});
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
                    if (!file.path.hasExtension()) {
                        path = "noext!" + path;
                    }
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
Bifrost.namespace("Bifrost.io", {
    fileType: {
        unknown: 0,
        text: 1,
        javaScript: 2,
        html: 3
    }
});
/*
 RequireJS 1.0.3 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
var requirejs,require,define;
(function(){function J(a){return M.call(a)==="[object Function]"}function E(a){return M.call(a)==="[object Array]"}function Z(a,c,h){for(var k in c)if(!(k in K)&&(!(k in a)||h))a[k]=c[k];return d}function N(a,c,d){a=Error(c+"\nhttp://requirejs.org/docs/errors.html#"+a);if(d)a.originalError=d;return a}function $(a,c,d){var k,j,q;for(k=0;q=c[k];k++){q=typeof q==="string"?{name:q}:q;j=q.location;if(d&&(!j||j.indexOf("/")!==0&&j.indexOf(":")===-1))j=d+"/"+(j||q.name);a[q.name]={name:q.name,location:j||
q.name,main:(q.main||"main").replace(ea,"").replace(aa,"")}}}function U(a,c){a.holdReady?a.holdReady(c):c?a.readyWait+=1:a.ready(!0)}function fa(a){function c(b,l){var f,a;if(b&&b.charAt(0)===".")if(l){p.pkgs[l]?l=[l]:(l=l.split("/"),l=l.slice(0,l.length-1));f=b=l.concat(b.split("/"));var c;for(a=0;c=f[a];a++)if(c===".")f.splice(a,1),a-=1;else if(c==="..")if(a===1&&(f[2]===".."||f[0]===".."))break;else a>0&&(f.splice(a-1,2),a-=2);a=p.pkgs[f=b[0]];b=b.join("/");a&&b===f+"/"+a.main&&(b=f)}else b.indexOf("./")===
0&&(b=b.substring(2));return b}function h(b,l){var f=b?b.indexOf("!"):-1,a=null,d=l?l.name:null,i=b,e,h;f!==-1&&(a=b.substring(0,f),b=b.substring(f+1,b.length));a&&(a=c(a,d));b&&(a?e=(f=m[a])&&f.normalize?f.normalize(b,function(b){return c(b,d)}):c(b,d):(e=c(b,d),h=E[e],h||(h=g.nameToUrl(e,null,l),E[e]=h)));return{prefix:a,name:e,parentMap:l,url:h,originalName:i,fullName:a?a+"!"+(e||""):e}}function k(){var b=!0,l=p.priorityWait,f,a;if(l){for(a=0;f=l[a];a++)if(!s[f]){b=!1;break}b&&delete p.priorityWait}return b}
function j(b,l,f){return function(){var a=ga.call(arguments,0),c;if(f&&J(c=a[a.length-1]))c.__requireJsBuild=!0;a.push(l);return b.apply(null,a)}}function q(b,l){var a=j(g.require,b,l);Z(a,{nameToUrl:j(g.nameToUrl,b),toUrl:j(g.toUrl,b),defined:j(g.requireDefined,b),specified:j(g.requireSpecified,b),isBrowser:d.isBrowser});return a}function o(b){var l,a,c,B=b.callback,i=b.map,e=i.fullName,ba=b.deps;c=b.listeners;if(B&&J(B)){if(p.catchError.define)try{a=d.execCb(e,b.callback,ba,m[e])}catch(k){l=k}else a=
d.execCb(e,b.callback,ba,m[e]);if(e)(B=b.cjsModule)&&B.exports!==void 0&&B.exports!==m[e]?a=m[e]=b.cjsModule.exports:a===void 0&&b.usingExports?a=m[e]:(m[e]=a,F[e]&&(Q[e]=!0))}else e&&(a=m[e]=B,F[e]&&(Q[e]=!0));if(C[b.id])delete C[b.id],b.isDone=!0,g.waitCount-=1,g.waitCount===0&&(I=[]);delete R[e];if(d.onResourceLoad&&!b.placeholder)d.onResourceLoad(g,i,b.depArray);if(l)return a=(e?h(e).url:"")||l.fileName||l.sourceURL,c=l.moduleTree,l=N("defineerror",'Error evaluating module "'+e+'" at location "'+
a+'":\n'+l+"\nfileName:"+a+"\nlineNumber: "+(l.lineNumber||l.line),l),l.moduleName=e,l.moduleTree=c,d.onError(l);for(l=0;B=c[l];l++)B(a)}function r(b,a){return function(f){b.depDone[a]||(b.depDone[a]=!0,b.deps[a]=f,b.depCount-=1,b.depCount||o(b))}}function u(b,a){var f=a.map,c=f.fullName,h=f.name,i=L[b]||(L[b]=m[b]),e;if(!a.loading)a.loading=!0,e=function(b){a.callback=function(){return b};o(a);s[a.id]=!0;w()},e.fromText=function(b,a){var l=O;s[b]=!1;g.scriptCount+=1;g.fake[b]=!0;l&&(O=!1);d.exec(a);
l&&(O=!0);g.completeLoad(b)},c in m?e(m[c]):i.load(h,q(f.parentMap,!0),e,p)}function v(b){C[b.id]||(C[b.id]=b,I.push(b),g.waitCount+=1)}function D(b){this.listeners.push(b)}function t(b,a){var f=b.fullName,c=b.prefix,d=c?L[c]||(L[c]=m[c]):null,i,e;f&&(i=R[f]);if(!i&&(e=!0,i={id:(c&&!d?M++ +"__p@:":"")+(f||"__r@"+M++),map:b,depCount:0,depDone:[],depCallbacks:[],deps:[],listeners:[],add:D},x[i.id]=!0,f&&(!c||L[c])))R[f]=i;c&&!d?(f=t(h(c),!0),f.add(function(){var a=h(b.originalName,b.parentMap),a=t(a,
!0);i.placeholder=!0;a.add(function(b){i.callback=function(){return b};o(i)})})):e&&a&&(s[i.id]=!1,g.paused.push(i),v(i));return i}function A(b,a,f,c){var b=h(b,c),d=b.name,i=b.fullName,e=t(b),k=e.id,j=e.deps,n;if(i){if(i in m||s[k]===!0||i==="jquery"&&p.jQuery&&p.jQuery!==f().fn.jquery)return;x[k]=!0;s[k]=!0;i==="jquery"&&f&&V(f())}e.depArray=a;e.callback=f;for(f=0;f<a.length;f++)if(k=a[f])k=h(k,d?b:c),n=k.fullName,a[f]=n,n==="require"?j[f]=q(b):n==="exports"?(j[f]=m[i]={},e.usingExports=!0):n===
"module"?e.cjsModule=j[f]={id:d,uri:d?g.nameToUrl(d,null,c):void 0,exports:m[i]}:n in m&&!(n in C)&&(!(i in F)||i in F&&Q[n])?j[f]=m[n]:(i in F&&(F[n]=!0,delete m[n],S[k.url]=!1),e.depCount+=1,e.depCallbacks[f]=r(e,f),t(k,!0).add(e.depCallbacks[f]));e.depCount?v(e):o(e)}function n(b){A.apply(null,b)}function y(b,a){if(!b.isDone){var c=b.map.fullName,d=b.depArray,g,i,e,k;if(c){if(a[c])return m[c];a[c]=!0}if(d)for(g=0;g<d.length;g++)if(i=d[g])if((e=h(i).prefix)&&(k=C[e])&&y(k,a),(e=C[i])&&!e.isDone&&
s[i])i=y(e,a),b.depCallbacks[g](i);return c?m[c]:void 0}}function z(){var b=p.waitSeconds*1E3,a=b&&g.startTime+b<(new Date).getTime(),b="",c=!1,h=!1,j;if(!(g.pausedCount>0)){if(p.priorityWait)if(k())w();else return;for(j in s)if(!(j in K)&&(c=!0,!s[j]))if(a)b+=j+" ";else{h=!0;break}if(c||g.waitCount){if(a&&b)return j=N("timeout","Load timeout for modules: "+b),j.requireType="timeout",j.requireModules=b,d.onError(j);if(h||g.scriptCount){if((G||ca)&&!W)W=setTimeout(function(){W=0;z()},50)}else{if(g.waitCount){for(H=
0;b=I[H];H++)y(b,{});g.paused.length&&w();X<5&&(X+=1,z())}X=0;d.checkReadyState()}}}}var g,w,p={waitSeconds:7,baseUrl:"./",paths:{},pkgs:{},catchError:{}},P=[],x={require:!0,exports:!0,module:!0},E={},m={},s={},C={},I=[],S={},M=0,R={},L={},F={},Q={},Y=0;V=function(b){if(!g.jQuery&&(b=b||(typeof jQuery!=="undefined"?jQuery:null))&&!(p.jQuery&&b.fn.jquery!==p.jQuery)&&("holdReady"in b||"readyWait"in b))if(g.jQuery=b,n(["jquery",[],function(){return jQuery}]),g.scriptCount)U(b,!0),g.jQueryIncremented=
!0};w=function(){var b,a,c,h,j,i;Y+=1;if(g.scriptCount<=0)g.scriptCount=0;for(;P.length;)if(b=P.shift(),b[0]===null)return d.onError(N("mismatch","Mismatched anonymous define() module: "+b[b.length-1]));else n(b);if(!p.priorityWait||k())for(;g.paused.length;){j=g.paused;g.pausedCount+=j.length;g.paused=[];for(h=0;b=j[h];h++)a=b.map,c=a.url,i=a.fullName,a.prefix?u(a.prefix,b):!S[c]&&!s[i]&&(d.load(g,i,c),c.indexOf("empty:")!==0&&(S[c]=!0));g.startTime=(new Date).getTime();g.pausedCount-=j.length}Y===
1&&z();Y-=1};g={contextName:a,config:p,defQueue:P,waiting:C,waitCount:0,specified:x,loaded:s,urlMap:E,urlFetched:S,scriptCount:0,defined:m,paused:[],pausedCount:0,plugins:L,needFullExec:F,fake:{},fullExec:Q,managerCallbacks:R,makeModuleMap:h,normalize:c,configure:function(b){var a,c,d;b.baseUrl&&b.baseUrl.charAt(b.baseUrl.length-1)!=="/"&&(b.baseUrl+="/");a=p.paths;d=p.pkgs;Z(p,b,!0);if(b.paths){for(c in b.paths)c in K||(a[c]=b.paths[c]);p.paths=a}if((a=b.packagePaths)||b.packages){if(a)for(c in a)c in
K||$(d,a[c],c);b.packages&&$(d,b.packages);p.pkgs=d}if(b.priority)c=g.requireWait,g.requireWait=!1,g.takeGlobalQueue(),w(),g.require(b.priority),w(),g.requireWait=c,p.priorityWait=b.priority;if(b.deps||b.callback)g.require(b.deps||[],b.callback)},requireDefined:function(b,a){return h(b,a).fullName in m},requireSpecified:function(b,a){return h(b,a).fullName in x},require:function(b,c,f){if(typeof b==="string"){if(J(c))return d.onError(N("requireargs","Invalid require call"));if(d.get)return d.get(g,
b,c);c=h(b,c);b=c.fullName;return!(b in m)?d.onError(N("notloaded","Module name '"+c.fullName+"' has not been loaded yet for context: "+a)):m[b]}(b&&b.length||c)&&A(null,b,c,f);if(!g.requireWait)for(;!g.scriptCount&&g.paused.length;)g.takeGlobalQueue(),w();return g.require},takeGlobalQueue:function(){T.length&&(ha.apply(g.defQueue,[g.defQueue.length-1,0].concat(T)),T=[])},completeLoad:function(b){var a;for(g.takeGlobalQueue();P.length;)if(a=P.shift(),a[0]===null){a[0]=b;break}else if(a[0]===b)break;
else n(a),a=null;a?n(a):n([b,[],b==="jquery"&&typeof jQuery!=="undefined"?function(){return jQuery}:null]);d.isAsync&&(g.scriptCount-=1);w();d.isAsync||(g.scriptCount-=1)},toUrl:function(a,c){var d=a.lastIndexOf("."),h=null;d!==-1&&(h=a.substring(d,a.length),a=a.substring(0,d));return g.nameToUrl(a,h,c)},nameToUrl:function(a,h,f){var j,k,i,e,m=g.config,a=c(a,f&&f.fullName);if(d.jsExtRegExp.test(a))h=a+(h?h:"");else{j=m.paths;k=m.pkgs;f=a.split("/");for(e=f.length;e>0;e--)if(i=f.slice(0,e).join("/"),
j[i]){f.splice(0,e,j[i]);break}else if(i=k[i]){a=a===i.name?i.location+"/"+i.main:i.location;f.splice(0,e,a);break}h=f.join("/")+(h||".js");h=(h.charAt(0)==="/"||h.match(/^\w+:/)?"":m.baseUrl)+h}return m.urlArgs?h+((h.indexOf("?")===-1?"?":"&")+m.urlArgs):h}};g.jQueryCheck=V;g.resume=w;return g}function ia(){var a,c,d;if(n&&n.readyState==="interactive")return n;a=document.getElementsByTagName("script");for(c=a.length-1;c>-1&&(d=a[c]);c--)if(d.readyState==="interactive")return n=d;return null}var ja=
/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,ka=/require\(\s*["']([^'"\s]+)["']\s*\)/g,ea=/^\.\//,aa=/\.js$/,M=Object.prototype.toString,r=Array.prototype,ga=r.slice,ha=r.splice,G=!!(typeof window!=="undefined"&&navigator&&document),ca=!G&&typeof importScripts!=="undefined",la=G&&navigator.platform==="PLAYSTATION 3"?/^complete$/:/^(complete|loaded)$/,da=typeof opera!=="undefined"&&opera.toString()==="[object Opera]",K={},D={},T=[],n=null,X=0,O=!1,d,r={},I,v,t,x,u,y,z,H,A,V,W;if(typeof define==="undefined"){if(typeof requirejs!==
"undefined")if(J(requirejs))return;else r=requirejs,requirejs=void 0;typeof require!=="undefined"&&!J(require)&&(r=require,require=void 0);d=requirejs=function(a,c,d){var k="_",j;!E(a)&&typeof a!=="string"&&(j=a,E(c)?(a=c,c=d):a=[]);if(j&&j.context)k=j.context;d=D[k]||(D[k]=fa(k));j&&d.configure(j);return d.require(a,c)};d.config=function(a){return d(a)};require||(require=d);d.toUrl=function(a){return D._.toUrl(a)};d.version="1.0.3";d.jsExtRegExp=/^\/|:|\?|\.js$/;v=d.s={contexts:D,skipAsync:{}};if(d.isAsync=
d.isBrowser=G)if(t=v.head=document.getElementsByTagName("head")[0],x=document.getElementsByTagName("base")[0])t=v.head=x.parentNode;d.onError=function(a){throw a;};d.load=function(a,c,h){d.resourcesReady(!1);a.scriptCount+=1;d.attach(h,a,c);if(a.jQuery&&!a.jQueryIncremented)U(a.jQuery,!0),a.jQueryIncremented=!0};define=function(a,c,d){var k,j;typeof a!=="string"&&(d=c,c=a,a=null);E(c)||(d=c,c=[]);!c.length&&J(d)&&d.length&&(d.toString().replace(ja,"").replace(ka,function(a,d){c.push(d)}),c=(d.length===
1?["require"]:["require","exports","module"]).concat(c));if(O&&(k=I||ia()))a||(a=k.getAttribute("data-requiremodule")),j=D[k.getAttribute("data-requirecontext")];(j?j.defQueue:T).push([a,c,d])};define.amd={multiversion:!0,plugins:!0,jQuery:!0};d.exec=function(a){return eval(a)};d.execCb=function(a,c,d,k){return c.apply(k,d)};d.addScriptToDom=function(a){I=a;x?t.insertBefore(a,x):t.appendChild(a);I=null};d.onScriptLoad=function(a){var c=a.currentTarget||a.srcElement,h;if(a.type==="load"||c&&la.test(c.readyState))n=
null,a=c.getAttribute("data-requirecontext"),h=c.getAttribute("data-requiremodule"),D[a].completeLoad(h),c.detachEvent&&!da?c.detachEvent("onreadystatechange",d.onScriptLoad):c.removeEventListener("load",d.onScriptLoad,!1)};d.attach=function(a,c,h,k,j,n){var o;if(G)return k=k||d.onScriptLoad,o=c&&c.config&&c.config.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):document.createElement("script"),o.type=j||"text/javascript",o.charset="utf-8",o.async=!v.skipAsync[a],c&&o.setAttribute("data-requirecontext",
c.contextName),o.setAttribute("data-requiremodule",h),o.attachEvent&&!da?(O=!0,n?o.onreadystatechange=function(){if(o.readyState==="loaded")o.onreadystatechange=null,o.attachEvent("onreadystatechange",k),n(o)}:o.attachEvent("onreadystatechange",k)):o.addEventListener("load",k,!1),o.src=a,n||d.addScriptToDom(o),o;else ca&&(importScripts(a),c.completeLoad(h));return null};if(G){u=document.getElementsByTagName("script");for(H=u.length-1;H>-1&&(y=u[H]);H--){if(!t)t=y.parentNode;if(z=y.getAttribute("data-main")){if(!r.baseUrl)u=
z.split("/"),y=u.pop(),u=u.length?u.join("/")+"/":"./",r.baseUrl=u,z=y.replace(aa,"");r.deps=r.deps?r.deps.concat(z):[z];break}}}d.checkReadyState=function(){var a=v.contexts,c;for(c in a)if(!(c in K)&&a[c].waitCount)return;d.resourcesReady(!0)};d.resourcesReady=function(a){var c,h;d.resourcesDone=a;if(d.resourcesDone)for(h in a=v.contexts,a)if(!(h in K)&&(c=a[h],c.jQueryIncremented))U(c.jQuery,!1),c.jQueryIncremented=!1};d.pageLoaded=function(){if(document.readyState!=="complete")document.readyState=
"complete"};if(G&&document.addEventListener&&!document.readyState)document.readyState="loading",window.addEventListener("load",d.pageLoaded,!1);d(r);if(d.isAsync&&typeof setTimeout!=="undefined")A=v.contexts[r.context||"_"],A.requireWait=!0,setTimeout(function(){A.requireWait=!1;A.takeGlobalQueue();A.scriptCount||A.resume();d.checkReadyState()},0)}})();

/*
 RequireJS text 1.0.2 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
(function(){var k=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"],n=/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,o=/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,i=typeof location!=="undefined"&&location.href,p=i&&location.protocol&&location.protocol.replace(/\:/,""),q=i&&location.hostname,r=i&&(location.port||void 0),j=[];define(function(){var g,h,l;typeof window!=="undefined"&&window.navigator&&window.document?h=function(a,c){var b=g.createXhr();b.open("GET",a,!0);b.onreadystatechange=
function(){b.readyState===4&&c(b.responseText)};b.send(null)}:typeof process!=="undefined"&&process.versions&&process.versions.node?(l=require.nodeRequire("fs"),h=function(a,c){c(l.readFileSync(a,"utf8"))}):typeof Packages!=="undefined"&&(h=function(a,c){var b=new java.io.File(a),e=java.lang.System.getProperty("line.separator"),b=new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(b),"utf-8")),d,f,g="";try{d=new java.lang.StringBuffer;(f=b.readLine())&&f.length()&&
f.charAt(0)===65279&&(f=f.substring(1));for(d.append(f);(f=b.readLine())!==null;)d.append(e),d.append(f);g=String(d.toString())}finally{b.close()}c(g)});return g={version:"1.0.2",strip:function(a){if(a){var a=a.replace(n,""),c=a.match(o);c&&(a=c[1])}else a="";return a},jsEscape:function(a){return a.replace(/(['\\])/g,"\\$1").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r")},createXhr:function(){var a,c,b;if(typeof XMLHttpRequest!==
"undefined")return new XMLHttpRequest;else for(c=0;c<3;c++){b=k[c];try{a=new ActiveXObject(b)}catch(e){}if(a){k=[b];break}}if(!a)throw Error("createXhr(): XMLHttpRequest not available");return a},get:h,parseName:function(a){var c=!1,b=a.indexOf("."),e=a.substring(0,b),a=a.substring(b+1,a.length),b=a.indexOf("!");b!==-1&&(c=a.substring(b+1,a.length),c=c==="strip",a=a.substring(0,b));return{moduleName:e,ext:a,strip:c}},xdRegExp:/^((\w+)\:)?\/\/([^\/\\]+)/,useXhr:function(a,c,b,e){var d=g.xdRegExp.exec(a),
f;if(!d)return!0;a=d[2];d=d[3];d=d.split(":");f=d[1];d=d[0];return(!a||a===c)&&(!d||d===b)&&(!f&&!d||f===e)},finishLoad:function(a,c,b,e,d){b=c?g.strip(b):b;d.isBuild&&(j[a]=b);e(b)},load:function(a,c,b,e){if(e.isBuild&&!e.inlineText)b();else{var d=g.parseName(a),f=d.moduleName+"."+d.ext,m=c.toUrl(f),h=e&&e.text&&e.text.useXhr||g.useXhr;!i||h(m,p,q,r)?g.get(m,function(c){g.finishLoad(a,d.strip,c,b,e)}):c([f],function(a){g.finishLoad(d.moduleName+"."+d.ext,d.strip,a,b,e)})}},write:function(a,c,b){if(c in
j){var e=g.jsEscape(j[c]);b.asModule(a+"!"+c,"define(function () { return '"+e+"';});\n")}},writeFile:function(a,c,b,e,d){var c=g.parseName(c),f=c.moduleName+"."+c.ext,h=b.toUrl(c.moduleName+"."+c.ext)+".js";g.load(f,b,function(){var b=function(a){return e(h,a)};b.asModule=function(a,b){return e.asModule(a,h,b)};g.write(a,f,b,d)},d)}}})})();

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
Bifrost.namespace("Bifrost.markup", {
    AttachedProperty: Bifrost.values.ValueConsumer.extend(function () {
        this.canNotifyChanges = function () {
            return false;
        };

        this.notifyChanges = function (callback) {
        };

        this.consume = function (value) {
        };
    })
});
Bifrost.namespace("Bifrost.markup", {
    attributeValues: Bifrost.Singleton(function (valueProviderParser) {
        this.expandFor = function (element) {

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
    ParentTagNameMismatched: Bifrost.Type.extend(function (tagName, parentTagName) {
        // "Setting property using tag '"+name+"' does not match parent tag of '"+parentName+"'";
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
Bifrost.namespace("Bifrost.read", {
    PagingInfo: Bifrost.Type.extend(function (size, number) {
        this.size = size;
        this.number = number;
    })
});
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
Bifrost.namespace("Bifrost.read", {
    readModelService: Bifrost.Singleton(function() {
    })
});
Bifrost.namespace("Bifrost.read", {
    readModelSystemEvents: Bifrost.Singleton(function () {
        this.noInstance = Bifrost.Event.create();
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
Bifrost.namespace("Bifrost.tasks", {
    ExecutionTask: Bifrost.tasks.Task.extend(function () {
        /// <summary>Represents a base task that represents anything that is executing</summary>
        this.execute = function () {
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
Bifrost.namespace("Bifrost.types", {
    PropertyInfo: Bifrost.Type.extend(function (name, type) {
        this.name = name;
        this.type = type;
    })
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
var Bifrost = Bifrost || {};
(function(global, undefined) {
    Bifrost.extend = function extend(destination, source) {
        return $.extend(destination, source);
    };
})(window);
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

Bifrost.namespace("Bifrost", {
    isArray : function(o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    }
});
Bifrost.namespace("Bifrost", {
    isFunction: function (value) {
        return typeof value === "function";
    }
});
Bifrost.namespace("Bifrost", {
    isNull: function (value) {
        return value === null;
    }
});
Bifrost.namespace("Bifrost", {
    isNullOrUndefined: function (value) {
        return Bifrost.isUndefined(value) || Bifrost.isNull(value);
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
    isObject: function (o) {
        if (o === null || typeof o === "undefined" ) {
            return false;
        }
        return Object.prototype.toString.call(o) === '[object Object]';
    }
});
Bifrost.namespace("Bifrost", {
    isString: function (value) {
        return typeof value === "string";
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
    isUndefined: function (value) {
        return typeof value === "undefined";
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
    Singleton: function (typeDefinition) {
        return Bifrost.Type.extend(typeDefinition).scopeTo(window);
    }
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
    systemClock: Bifrost.Singleton(function () {
        this.nowInMilliseconds = function () {
            return window.performance.now();
        };
    })
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
    uriMappers: {
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
    notNull: Bifrost.validation.Rule.extend(function () {
        this.validate = function (value) {
            return !(Bifrost.isUndefined(value) || Bifrost.isNull(value));
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



Bifrost.namespace("Bifrost.validation", {
    required: Bifrost.validation.Rule.extend(function () {
        this.validate = function (value) {
            return !(Bifrost.isUndefined(value) || Bifrost.isNull(value) || value === "" || value === 0);
        };
    })
});


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
Bifrost.validation.ruleHandlers = (function () {
    return Bifrost.validation.ruleHandlers || { };
})();

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
    DateFormatter: Bifrost.values.Formatter.extend(function () {
        this.supportedType = Date;

        this.format = function (value, format) {
            return value.format(format);
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
    DefaultValueConsumer: Bifrost.values.ValueConsumer.extend(function (target, property) {
        this.consume = function(value) {
            target[property] = value;
        };
    })
});
Bifrost.namespace("Bifrost.values", {
    Formatter: Bifrost.Type.extend(function () {
        this.supportedType = null;

        this.format = function (value, format) {
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
    StringTypeConverter: Bifrost.values.TypeConverter.extend(function () {
        this.supportedType = String;

        this.convertFrom = function (value) {
            return value.toString();
        };
    })
});
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
Bifrost.namespace("Bifrost.views", {
    ComposeTask: Bifrost.tasks.Task.extend(function () {
        /// <summary>Represents a base task that represents anything that is executing</summary>
        this.execute = function () {
        };
    })
});
Bifrost.namespace("Bifrost.views", {
    Content: Bifrost.Type.extend(function () {

    })
});
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
Bifrost.namespace("Bifrost.views", {
    Items: Bifrost.Type.extend(function () {

    })
});
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
    PostBindingVisitor: Bifrost.Type.extend(function() {
        this.visit = function (element) {

        };
    })
});
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
    RegionDescriptor: Bifrost.Type.extend(function () {
        this.describe = function (region) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpc3BhdGNoZXIuanMiLCJkb2N1bWVudFNlcnZpY2UuanMiLCJFdmVudC5qcyIsImxpbmtlZC5qcyIsInN5c3RlbUV2ZW50cy5qcyIsInRhc2tGYWN0b3J5LmpzIiwiVGltZVNwYW4uanMiLCJjb21tYW5kcy9iaW5kaW5nSGFuZGxlcnMuanMiLCJjb21tYW5kcy9Db21tYW5kLmpzIiwiY29tbWFuZHMvY29tbWFuZENvb3JkaW5hdG9yLmpzIiwiY29tbWFuZHMvY29tbWFuZERlcGVuZGVuY3lSZXNvbHZlci5qcyIsImNvbW1hbmRzL0NvbW1hbmREZXNjcmlwdG9yLmpzIiwiY29tbWFuZHMvY29tbWFuZEV2ZW50cy5qcyIsImNvbW1hbmRzL0NvbW1hbmRSZXN1bHQuanMiLCJjb21tYW5kcy9Db21tYW5kU2VjdXJpdHlDb250ZXh0LmpzIiwiY29tbWFuZHMvY29tbWFuZFNlY3VyaXR5Q29udGV4dEZhY3RvcnkuanMiLCJjb21tYW5kcy9jb21tYW5kU2VjdXJpdHlTZXJ2aWNlLmpzIiwiY29tbWFuZHMvY29tbWFuZFZhbGlkYXRpb25TZXJ2aWNlLmpzIiwiY29tbWFuZHMvSGFuZGxlQ29tbWFuZHNUYXNrLmpzIiwiY29tbWFuZHMvSGFuZGxlQ29tbWFuZFRhc2suanMiLCJjb21tYW5kcy9oYXNDaGFuZ2VzLmpzIiwiZXhlY3V0aW9uL1Byb21pc2UuanMiLCJleHRlbnNpb25zL0FycmF5RXh0ZW5zaW9ucy5qcyIsImV4dGVuc2lvbnMvRGF0ZUV4dGVuc2lvbnMuanMiLCJleHRlbnNpb25zL0hUTUxDb2xsZWN0aW9uRXh0ZW5zaW9ucy5qcyIsImV4dGVuc2lvbnMvSFRNTEVsZW1lbnRFeHRlbnNpb25zLmpzIiwiZXh0ZW5zaW9ucy9Ob2RlTGlzdEV4dGVuc2lvbnMuanMiLCJleHRlbnNpb25zL3N0cmluZ0V4dGVuc2lvbnMuanMiLCJodWJzL0h1Yi5qcyIsImh1YnMvaHViQ29ubmVjdGlvbi5qcyIsImh1YnMvaHViRGVwZW5kZW5jeVJlc29sdmVyLmpzIiwiaW50ZXJhY3Rpb24vQWN0aW9uLmpzIiwiaW50ZXJhY3Rpb24vQ29tbWFuZE9wZXJhdGlvbi5qcyIsImludGVyYWN0aW9uL0V2ZW50VHJpZ2dlci5qcyIsImludGVyYWN0aW9uL09wZXJhdGlvbi5qcyIsImludGVyYWN0aW9uL09wZXJhdGlvbkNvbnRleHQuanMiLCJpbnRlcmFjdGlvbi9PcGVyYXRpb25FbnRyeS5qcyIsImludGVyYWN0aW9uL29wZXJhdGlvbkVudHJ5RmFjdG9yeS5qcyIsImludGVyYWN0aW9uL09wZXJhdGlvbnMuanMiLCJpbnRlcmFjdGlvbi9vcGVyYXRpb25zRmFjdG9yeS5qcyIsImludGVyYWN0aW9uL1RyaWdnZXIuanMiLCJpbnRlcmFjdGlvbi9WaXN1YWxTdGF0ZS5qcyIsImludGVyYWN0aW9uL1Zpc3VhbFN0YXRlQWN0aW9uLmpzIiwiaW50ZXJhY3Rpb24vVmlzdWFsU3RhdGVHcm91cC5qcyIsImludGVyYWN0aW9uL1Zpc3VhbFN0YXRlTWFuYWdlci5qcyIsImludGVyYWN0aW9uL1Zpc3VhbFN0YXRlTWFuYWdlckVsZW1lbnRWaXNpdG9yLmpzIiwiaW50ZXJhY3Rpb24vVmlzdWFsU3RhdGVUcmFuc2l0aW9uLmpzIiwiaW8vRmlsZS5qcyIsImlvL2ZpbGVGYWN0b3J5LmpzIiwiaW8vZmlsZU1hbmFnZXIuanMiLCJpby9maWxlVHlwZS5qcyIsIkxpYnJhcmllcy9yZXF1aXJlLmpzIiwiTGlicmFyaWVzL3RleHQuanMiLCJtYXBwaW5nL01hcC5qcyIsIm1hcHBpbmcvbWFwcGVyLmpzIiwibWFwcGluZy9tYXBzLmpzIiwibWFwcGluZy9NaXNzaW5nUHJvcGVydHlTdHJhdGVneS5qcyIsIm1hcHBpbmcvUHJvcGVydHlNYXAuanMiLCJtYXJrdXAvQXR0YWNoZWRQcm9wZXJ0eS5qcyIsIm1hcmt1cC9hdHRyaWJ1dGVWYWx1ZXMuanMiLCJtYXJrdXAvQmluZGluZ0NvbnRleHQuanMiLCJtYXJrdXAvYmluZGluZ0NvbnRleHRNYW5hZ2VyLmpzIiwibWFya3VwL0NvbnRyb2wuanMiLCJtYXJrdXAvZWxlbWVudE5hbWluZy5qcyIsIm1hcmt1cC9FbGVtZW50VmlzaXRvci5qcyIsIm1hcmt1cC9FbGVtZW50VmlzaXRvclJlc3VsdEFjdGlvbnMuanMiLCJtYXJrdXAvTXVsdGlwbGVOYW1lc3BhY2VzSW5OYW1lTm90QWxsb3dlZC5qcyIsIm1hcmt1cC9NdWx0aXBsZVByb3BlcnR5UmVmZXJlbmNlc05vdEFsbG93ZWQuanMiLCJtYXJrdXAvTmFtZXNwYWNlRGVmaW5pdGlvbi5qcyIsIm1hcmt1cC9uYW1lc3BhY2VEZWZpbml0aW9ucy5qcyIsIm1hcmt1cC9uYW1lc3BhY2VzLmpzIiwibWFya3VwL05hbWluZ1Jvb3QuanMiLCJtYXJrdXAvT2JqZWN0TW9kZWxFbGVtZW50VmlzaXRvci5qcyIsIm1hcmt1cC9vYmplY3RNb2RlbEZhY3RvcnkuanMiLCJtYXJrdXAvUGFyZW50VGFnTmFtZU1pc21hdGNoZWQuanMiLCJtYXJrdXAvcHJvcGVydHlFeHBhbmRlci5qcyIsIm1hcmt1cC9VSUVsZW1lbnQuanMiLCJtYXJrdXAvVUlFbGVtZW50UHJlcGFyZXIuanMiLCJtYXJrdXAvdmFsdWVQcm92aWRlclBhcnNlci5qcyIsIm5hdmlnYXRpb24vRGF0YU5hdmlnYXRpb25GcmFtZUF0dHJpYnV0ZUVsZW1lbnRWaXNpdG9yLmpzIiwibmF2aWdhdGlvbi9uYXZpZ2F0ZVRvLmpzIiwibmF2aWdhdGlvbi9uYXZpZ2F0aW9uQmluZGluZ0hhbmRsZXIuanMiLCJuYXZpZ2F0aW9uL05hdmlnYXRpb25GcmFtZS5qcyIsIm5hdmlnYXRpb24vbmF2aWdhdGlvbk1hbmFnZXIuanMiLCJuYXZpZ2F0aW9uL29ic2VydmFibGVRdWVyeVBhcmFtZXRlci5qcyIsIm1lc3NhZ2luZy9NZXNzZW5nZXIuanMiLCJtZXNzYWdpbmcvbWVzc2VuZ2VyRmFjdG9yeS5qcyIsIm1lc3NhZ2luZy9vYnNlcnZhYmxlTWVzc2FnZS5qcyIsInBvbHlmaWxscy9jbGFzc0xpc3QuanMiLCJwb2x5ZmlsbHMvRWxlbWVudFBvbHlmaWxscy5qcyIsInJlYWQvUGFnaW5nSW5mby5qcyIsInJlYWQvUXVlcnkuanMiLCJyZWFkL1F1ZXJ5YWJsZS5qcyIsInJlYWQvcXVlcnlhYmxlRmFjdG9yeS5qcyIsInJlYWQvcXVlcnlEZXBlbmRlbmN5UmVzb2x2ZXIuanMiLCJyZWFkL3F1ZXJ5U2VydmljZS5qcyIsInJlYWQvUXVlcnlUYXNrLmpzIiwicmVhZC9SZWFkTW9kZWwuanMiLCJyZWFkL1JlYWRNb2RlbE9mLmpzIiwicmVhZC9yZWFkTW9kZWxPZkRlcGVuZGVuY3lSZXNvbHZlci5qcyIsInJlYWQvcmVhZE1vZGVsU2VydmljZS5qcyIsInJlYWQvcmVhZE1vZGVsU3lzdGVtRXZlbnRzLmpzIiwicmVhZC9SZWFkTW9kZWxUYXNrLmpzIiwic2FnYXMvU2FnYS5qcyIsInNhZ2FzL3NhZ2FOYXJyYXRvci5qcyIsInNlcnZpY2VzL1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9zZXJ2aWNlRGVwZW5kZW5jeVJlc29sdmVyLmpzIiwic3BlY2lmaWNhdGlvbnMvQW5kLmpzIiwic3BlY2lmaWNhdGlvbnMvT3IuanMiLCJzcGVjaWZpY2F0aW9ucy9TcGVjaWZpY2F0aW9uLmpzIiwidGFza3MvRXhlY3V0aW9uVGFzay5qcyIsInRhc2tzL0ZpbGVMb2FkVGFzay5qcyIsInRhc2tzL0h0dHBHZXRUYXNrLmpzIiwidGFza3MvSHR0cFBvc3RUYXNrLmpzIiwidGFza3MvTG9hZFRhc2suanMiLCJ0YXNrcy9UYXNrLmpzIiwidGFza3MvdGFza0hpc3RvcnkuanMiLCJ0YXNrcy9UYXNrSGlzdG9yeUVudHJ5LmpzIiwidGFza3MvVGFza3MuanMiLCJ0YXNrcy90YXNrc0ZhY3RvcnkuanMiLCJ0eXBlcy9Qcm9wZXJ0eUluZm8uanMiLCJ0eXBlcy9UeXBlSW5mby5qcyIsInV0aWxzL2FyZUVxdWFsLmpzIiwidXRpbHMvYXNzZXRzTWFuYWdlci5qcyIsInV0aWxzL2NvbmZpZ3VyYXRvci5qcyIsInV0aWxzL2NvbmZpZ3VyZS5qcyIsInV0aWxzL2RlZXBDbG9uZS5qcyIsInV0aWxzL0RlZmF1bHREZXBlbmRlbmN5UmVzb2x2ZXIuanMiLCJ1dGlscy9kZXBlbmRlbmN5UmVzb2x2ZXIuanMiLCJ1dGlscy9kZXBlbmRlbmN5UmVzb2x2ZXJzLmpzIiwidXRpbHMvRE9NUm9vdERlcGVuZGVuY3lSZXNvbHZlci5qcyIsInV0aWxzL0V4Y2VwdGlvbi5qcyIsInV0aWxzL2V4Y2VwdGlvbnMuanMiLCJ1dGlscy9leHRlbmQuanMiLCJ1dGlscy9mdW5jdGlvblBhcnNlci5qcyIsInV0aWxzL2d1aWQuanMiLCJ1dGlscy9oYXNoU3RyaW5nLmpzIiwidXRpbHMvaXNBcnJheS5qcyIsInV0aWxzL2lzRnVuY3Rpb24uanMiLCJ1dGlscy9pc051bGwuanMiLCJ1dGlscy9pc051bGxPclVuZGVmaW5lZC5qcyIsInV0aWxzL2lzTnVtYmVyLmpzIiwidXRpbHMvaXNPYmplY3QuanMiLCJ1dGlscy9pc1N0cmluZy5qcyIsInV0aWxzL2lzVHlwZS5qcyIsInV0aWxzL2lzVW5kZWZpbmVkLmpzIiwidXRpbHMvS25vd25BcnRpZmFjdEluc3RhbmNlc0RlcGVuZGVuY3lSZXNvbHZlci5qcyIsInV0aWxzL0tub3duQXJ0aWZhY3RUeXBlc0RlcGVuZGVuY3lSZXNvbHZlci5qcyIsInV0aWxzL25hbWVzcGFjZS5qcyIsInV0aWxzL25hbWVzcGFjZU1hcHBlcnMuanMiLCJ1dGlscy9uYW1lc3BhY2VzLmpzIiwidXRpbHMvUGF0aC5qcyIsInV0aWxzL3NlcnZlci5qcyIsInV0aWxzL1NpbmdsZXRvbi5qcyIsInV0aWxzL1N0cmluZ01hcHBlci5qcyIsInV0aWxzL1N0cmluZ01hcHBpbmcuanMiLCJ1dGlscy9zdHJpbmdNYXBwaW5nRmFjdG9yeS5qcyIsInV0aWxzL3N5c3RlbUNsb2NrLmpzIiwidXRpbHMvVHlwZS5qcyIsInV0aWxzL1VyaS5qcyIsInV0aWxzL3VyaU1hcHBlcnMuanMiLCJ1dGlscy9XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci5qcyIsInZhbGlkYXRpb24vZW1haWwuanMiLCJ2YWxpZGF0aW9uL2V4Y2VwdGlvbnMuanMiLCJ2YWxpZGF0aW9uL2dyZWF0ZXJUaGFuLmpzIiwidmFsaWRhdGlvbi9ncmVhdGVyVGhhbk9yRXF1YWwuanMiLCJ2YWxpZGF0aW9uL2xlbmd0aC5qcyIsInZhbGlkYXRpb24vbGVzc1RoYW4uanMiLCJ2YWxpZGF0aW9uL2xlc3NUaGFuT3JFcXVhbC5qcyIsInZhbGlkYXRpb24vbWF4TGVuZ3RoLmpzIiwidmFsaWRhdGlvbi9taW5MZW5ndGguanMiLCJ2YWxpZGF0aW9uL25vdE51bGwuanMiLCJ2YWxpZGF0aW9uL3JhbmdlLmpzIiwidmFsaWRhdGlvbi9yZWdleC5qcyIsInZhbGlkYXRpb24vcmVxdWlyZWQuanMiLCJ2YWxpZGF0aW9uL1J1bGUuanMiLCJ2YWxpZGF0aW9uL3J1bGVIYW5kbGVycy5qcyIsInZhbGlkYXRpb24vdmFsaWRhdGlvbi5qcyIsInZhbGlkYXRpb24vdmFsaWRhdGlvbk1lc3NhZ2VGb3IuanMiLCJ2YWxpZGF0aW9uL3ZhbGlkYXRpb25TdW1tYXJ5Rm9yLmpzIiwidmFsaWRhdGlvbi9WYWxpZGF0b3IuanMiLCJ2YWx1ZXMvYmluZGluZy5qcyIsInZhbHVlcy9EYXRlRm9ybWF0dGVyLmpzIiwidmFsdWVzL0RhdGVUeXBlQ29udmVydGVyLmpzIiwidmFsdWVzL0RlZmF1bHRWYWx1ZUNvbnN1bWVyLmpzIiwidmFsdWVzL0Zvcm1hdHRlci5qcyIsInZhbHVlcy9OdW1iZXJUeXBlQ29udmVydGVyLmpzIiwidmFsdWVzL3N0cmluZ0Zvcm1hdHRlci5qcyIsInZhbHVlcy9TdHJpbmdUeXBlQ29udmVydGVyLmpzIiwidmFsdWVzL1R5cGVDb252ZXJ0ZXIuanMiLCJ2YWx1ZXMvdHlwZUNvbnZlcnRlcnMuanMiLCJ2YWx1ZXMvdHlwZUV4dGVuZGVyLmpzIiwidmFsdWVzL1ZhbHVlQ29uc3VtZXIuanMiLCJ2YWx1ZXMvdmFsdWVDb25zdW1lcnMuanMiLCJ2YWx1ZXMvdmFsdWVQaXBlbGluZS5qcyIsInZhbHVlcy9WYWx1ZVByb3ZpZGVyLmpzIiwidmFsdWVzL3ZhbHVlUHJvdmlkZXJzLmpzIiwidmlld3MvQ29tcG9zZVRhc2suanMiLCJ2aWV3cy9Db250ZW50LmpzIiwidmlld3MvRGF0YVZpZXdBdHRyaWJ1dGVFbGVtZW50VmlzaXRvci5qcyIsInZpZXdzL0RhdGFWaWV3TW9kZWxGaWxlQXR0cmlidXRlRWxlbWVudFZpc2l0b3IuanMiLCJ2aWV3cy9JdGVtcy5qcyIsInZpZXdzL01hc3RlclZpZXdNb2RlbC5qcyIsInZpZXdzL1BhdGhSZXNvbHZlci5qcyIsInZpZXdzL3BhdGhSZXNvbHZlcnMuanMiLCJ2aWV3cy9Qb3N0QmluZGluZ1Zpc2l0b3IuanMiLCJ2aWV3cy9SZWdpb24uanMiLCJ2aWV3cy9SZWdpb25EZXBlbmRlbmN5UmVzb2x2ZXIuanMiLCJ2aWV3cy9SZWdpb25EZXNjcmlwdG9yLmpzIiwidmlld3MvUmVnaW9uRGVzY3JpcHRvckRlcGVuZGVuY3lSZXNvbHZlci5qcyIsInZpZXdzL3JlZ2lvbkRlc2NyaXB0b3JNYW5hZ2VyLmpzIiwidmlld3MvcmVnaW9uTWFuYWdlci5qcyIsInZpZXdzL1JlbGF0aXZlUGF0aFJlc29sdmVyLmpzIiwidmlld3MvVUlNYW5hZ2VyLmpzIiwidmlld3MvVXJpTWFwcGVyUGF0aFJlc29sdmVyLmpzIiwidmlld3MvVmlldy5qcyIsInZpZXdzL3ZpZXdCaW5kaW5nSGFuZGxlci5qcyIsInZpZXdzL1ZpZXdCaW5kaW5nSGFuZGxlclRlbXBsYXRlRW5naW5lLmpzIiwidmlld3MvVmlld0JpbmRpbmdIYW5kbGVyVGVtcGxhdGVTb3VyY2UuanMiLCJ2aWV3cy92aWV3RmFjdG9yeS5qcyIsInZpZXdzL3ZpZXdMb2FkZXIuanMiLCJ2aWV3cy9WaWV3TG9hZFRhc2suanMiLCJ2aWV3cy92aWV3TWFuYWdlci5qcyIsInZpZXdzL1ZpZXdNb2RlbC5qcyIsInZpZXdzL3ZpZXdNb2RlbEJpbmRpbmdIYW5kbGVyLmpzIiwidmlld3Mvdmlld01vZGVsTG9hZGVyLmpzIiwidmlld3MvVmlld01vZGVsTG9hZFRhc2suanMiLCJ2aWV3cy92aWV3TW9kZWxNYW5hZ2VyLmpzIiwidmlld3Mvdmlld01vZGVsVHlwZXMuanMiLCJpbnRlcmFjdGlvbi92aXN1YWxTdGF0ZUFjdGlvbnMvT3BhY2l0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwS0E7QUFDQTtBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJCaWZyb3N0LmRldi5qcyIsInNvdXJjZXNDb250ZW50IjpbIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBkaXNwYXRjaGVyOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZSA9IGZ1bmN0aW9uIChtaWxsaXNlY29uZHMsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIG1pbGxpc2Vjb25kcyk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBkb2N1bWVudFNlcnZpY2U6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uIChET01Sb290KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLkRPTVJvb3QgPSBET01Sb290O1xyXG5cclxuICAgICAgICB0aGlzLnBhZ2VIYXNWaWV3TW9kZWwgPSBmdW5jdGlvbiAodmlld01vZGVsKSB7XHJcbiAgICAgICAgICAgIHZhciBjb250ZXh0ID0ga28uY29udGV4dEZvcigkKFwiYm9keVwiKVswXSk7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzVW5kZWZpbmVkKGNvbnRleHQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQuJGRhdGEgPT09IHZpZXdNb2RlbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldFZpZXdNb2RlbE5hbWVGb3IgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICB2YXIgZGF0YVZpZXdNb2RlbE5hbWUgPSBlbGVtZW50LmF0dHJpYnV0ZXMuZ2V0TmFtZWRJdGVtKFwiZGF0YS12aWV3bW9kZWwtbmFtZVwiKTtcclxuICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoZGF0YVZpZXdNb2RlbE5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhVmlld01vZGVsTmFtZSA9IGRvY3VtZW50LmNyZWF0ZUF0dHJpYnV0ZShcImRhdGEtdmlld21vZGVsLW5hbWVcIik7XHJcbiAgICAgICAgICAgICAgICBkYXRhVmlld01vZGVsTmFtZS52YWx1ZSA9IEJpZnJvc3QuR3VpZC5jcmVhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbGVtZW50LmF0dHJpYnV0ZXMuc2V0TmFtZWRJdGVtKGRhdGFWaWV3TW9kZWxOYW1lKTtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGFWaWV3TW9kZWxOYW1lLnZhbHVlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2V0Vmlld01vZGVsUGFyYW1ldGVyc09uID0gZnVuY3Rpb24gKGVsZW1lbnQsIHBhcmFtZXRlcnMpIHtcclxuICAgICAgICAgICAgZWxlbWVudC52aWV3TW9kZWxQYXJhbWV0ZXJzID0gcGFyYW1ldGVycztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldFZpZXdNb2RlbFBhcmFtZXRlcnNGcm9tID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQudmlld01vZGVsUGFyYW1ldGVycztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmhhc1ZpZXdNb2RlbFBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICByZXR1cm4gIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoZWxlbWVudC52aWV3TW9kZWxQYXJhbWV0ZXJzKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNsZWFuQ2hpbGRyZW5PZiA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHNlbGYudHJhdmVyc2VPYmplY3RzKGZ1bmN0aW9uIChjaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkICE9PSBlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChjaGlsZCkudW5iaW5kKCk7XHJcbiAgICAgICAgICAgICAgICAgICAga28uY2xlYW5Ob2RlKGNoaWxkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgZWxlbWVudCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5oYXNWaWV3RmlsZSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGUgPSBlbGVtZW50LmF0dHJpYnV0ZXNbXCJkYXRhLXZpZXctZmlsZVwiXTtcclxuICAgICAgICAgICAgcmV0dXJuICFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGF0dHJpYnV0ZSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRWaWV3RmlsZUZyb20gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5oYXNWaWV3RmlsZShlbGVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZSA9IGVsZW1lbnQuYXR0cmlidXRlc1tcImRhdGEtdmlldy1maWxlXCJdO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZS52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5oYXNPd25SZWdpb24gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+Q2hlY2sgaWYgZWxlbWVudCBoYXMgaXRzIG93biByZWdpb248L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cImVsZW1lbnRcIiB0eXBlPVwiSFRNTEVsZW1lbnRcIj5IVE1MIEVsZW1lbnQgdG8gY2hlY2s8L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHJldHVybnM+dHJ1ZSBpZiBpdCBoYXMgaXRzIG93biByZWdpb24sIGZhbHNlIGl0IG5vdDwvcmV0dXJucz5cclxuXHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LnJlZ2lvbikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0UGFyZW50UmVnaW9uRm9yID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkdldCB0aGUgcGFyZW50IHJlZ2lvbiBmb3IgYSBnaXZlbiBlbGVtZW50PC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJlbGVtZW50XCIgdHlwZT1cIkhUTUxFbGVtZW50XCI+SFRNTCBFbGVtZW50IHRvIGdldCBmb3I8L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHJldHVybnM+QW4gaW5zdGFuY2Ugb2YgdGhlIHJlZ2lvbiwgaWYgbm8gcmVnaW9uIGlzIGZvdW5kIGl0IHdpbGwgcmV0dXJuIG51bGw8L3JldHVybnM+XHJcbiAgICAgICAgICAgIHZhciBmb3VuZCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoZWxlbWVudC5wYXJlbnROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQucmVnaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQucmVnaW9uO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZm91bmQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRSZWdpb25Gb3IgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+R2V0IHJlZ2lvbiBmb3IgYW4gZWxlbWVudCwgZWl0aGVyIGRpcmVjdGx5IG9yIGltcGxpY2l0bHkgdGhyb3VnaCB0aGUgbmVhcmVzdCBwYXJlbnQsIG51bGwgaWYgbm9uZTwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiZWxlbWVudFwiIHR5cGU9XCJIVE1MRWxlbWVudFwiPkhUTUwgRWxlbWVudCB0byBnZXQgZm9yPC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxyZXR1cm5zPkFuIGluc3RhbmNlIG9mIHRoZSByZWdpb24sIGlmIG5vIHJlZ2lvbiBpcyBmb3VuZCBpdCB3aWxsIHJldHVybiBudWxsPC9yZXR1cm5zPlxyXG4gICAgICAgICAgICB2YXIgZm91bmQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQucmVnaW9uKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5yZWdpb247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm91bmQgPSBzZWxmLmdldFBhcmVudFJlZ2lvbkZvcihlbGVtZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIGZvdW5kO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2V0UmVnaW9uT24gPSBmdW5jdGlvbiAoZWxlbWVudCwgcmVnaW9uKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5TZXQgcmVnaW9uIG9uIGEgc3BlY2lmaWMgZWxlbWVudDwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiZWxlbWVudFwiIHR5cGU9XCJIVE1MRWxlbWVudFwiPkhUTUwgRWxlbWVudCB0byBzZXQgb248L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJyZWdpb25cIiB0eXBlPVwiQmlmcm9zdC52aWV3cy5SZWdpb25cIj5SZWdpb24gdG8gc2V0IG9uIGVsZW1lbnQ8L3BhcmFtPlxyXG5cclxuICAgICAgICAgICAgZWxlbWVudC5yZWdpb24gPSByZWdpb247XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jbGVhclJlZ2lvbk9uID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkNsZWFyIHJlZ2lvbiBvbiBhIHNwZWNpZmljIGVsZW1lbnQ8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cImVsZW1lbnRcIiB0eXBlPVwiSFRNTEVsZW1lbnRcIj5IVE1MIEVsZW1lbnQgdG8gc2V0IG9uPC9wYXJhbT5cclxuICAgICAgICAgICAgZWxlbWVudC5yZWdpb24gPSBudWxsO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMudHJhdmVyc2VPYmplY3RzID0gZnVuY3Rpb24oY2FsbGJhY2ssIGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PlRyYXZlcnNlIG9iamVjdHMgYW5kIGNhbGwgYmFjayBmb3IgZWFjaCBlbGVtZW50PC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJjYWxsYmFja1wiIHR5cGU9XCJGdW5jdGlvblwiPkNhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggZWxlbWVudCBmb3VuZDwvcGFyYW0+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cImVsZW1lbnRcIiB0eXBlPVwiSFRNTEVsZW1lbnRcIiBvcHRpb25hbD1cInRydWVcIj5PcHRpb25hbCByb290IGVsZW1lbnQ8L3BhcmFtPlxyXG4gICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudCB8fCBzZWxmLkRPTVJvb3Q7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChlbGVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZWxlbWVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoIGVsZW1lbnQuaGFzQ2hpbGROb2RlcygpICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IGVsZW1lbnQuZmlyc3RDaGlsZDtcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoY2hpbGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5leHRTaWJsaW5nID0gY2hpbGQubmV4dFNpYmxpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBjaGlsZC5ub2RlVHlwZSA9PT0gMSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudHJhdmVyc2VPYmplY3RzKGNhbGxiYWNrLCBjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQgPSBuZXh0U2libGluZztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldFVuaXF1ZVN0eWxlTmFtZSA9IGZ1bmN0aW9uKHByZWZpeCkge1xyXG4gICAgICAgICAgICB2YXIgaWQgPSBCaWZyb3N0Lkd1aWQuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gcHJlZml4K1wiX1wiK2lkO1xyXG4gICAgICAgICAgICByZXR1cm4gbmFtZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmFkZFN0eWxlID0gZnVuY3Rpb24oc2VsZWN0b3IsIHN0eWxlKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5BZGQgYSBzdHlsZSBkeW5hbWljYWxseSBpbnRvIHRoZSBicm93c2VyPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJzZWxlY3RvclwiIHR5cGU9XCJTdHJpbmdcIj5TZWxlY3RvciB0aGF0IHJlcHJlc2VudHMgdGhlIGNsYXNzPC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwic3R5bGVcIiB0eXBlPVwiT2JqZWN0XCI+S2V5L3ZhbHVlIHBhaXIgb2JqZWN0IGZvciBzdHlsZXM8L3BhcmFtPlxyXG4gICAgICAgICAgICBpZighZG9jdW1lbnQuc3R5bGVTaGVldHMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgaTtcclxuICAgICAgICAgICAgdmFyIHN0eWxlU3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgZm9yKCB2YXIgcHJvcGVydHkgaW4gc3R5bGUgKSB7XHJcbiAgICAgICAgICAgICAgICBzdHlsZVN0cmluZyA9IHN0eWxlU3RyaW5nICsgcHJvcGVydHkgK1wiOlwiICsgc3R5bGVbcHJvcGVydHldK1wiO1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN0eWxlID0gc3R5bGVTdHJpbmc7XHJcblxyXG4gICAgICAgICAgICBpZihkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIikubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBzdHlsZVNoZWV0O1xyXG4gICAgICAgICAgICB2YXIgbWVkaWE7XHJcbiAgICAgICAgICAgIHZhciBtZWRpYVR5cGU7XHJcbiAgICAgICAgICAgIGlmKGRvY3VtZW50LnN0eWxlU2hlZXRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGZvciggaSA9IDA7IGkgPCBkb2N1bWVudC5zdHlsZVNoZWV0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBtZWRpYSA9IGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldLm1lZGlhO1xyXG4gICAgICAgICAgICAgICAgICAgIG1lZGlhVHlwZSA9IHR5cGVvZiBtZWRpYTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYobWVkaWFUeXBlID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKG1lZGlhID09PSBcIlwiIHx8IChtZWRpYS5pbmRleE9mKFwic2NyZWVuXCIpICE9PSAtMSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlU2hlZXQgPSBkb2N1bWVudC5zdHlsZVNoZWV0c1tpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihtZWRpYVR5cGUgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYobWVkaWEubWVkaWFUZXh0ID09PSBcIlwiIHx8IChtZWRpYS5tZWRpYVRleHQuaW5kZXhPZihcInNjcmVlblwiKSAhPT0gLTEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZVNoZWV0ID0gZG9jdW1lbnQuc3R5bGVTaGVldHNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCB0eXBlb2Ygc3R5bGVTaGVldCAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKCB0eXBlb2Ygc3R5bGVTaGVldCA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0eWxlU2hlZXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xyXG4gICAgICAgICAgICAgICAgc3R5bGVTaGVldEVsZW1lbnQudHlwZSA9IFwidGV4dC9jc3NcIjtcclxuXHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQoc3R5bGVTaGVldEVsZW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciggaSA9IDA7IGkgPCBkb2N1bWVudC5zdHlsZVNoZWV0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZVNoZWV0ID0gZG9jdW1lbnQuc3R5bGVTaGVldHNbaV07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbWVkaWEgPSBzdHlsZVNoZWV0Lm1lZGlhO1xyXG4gICAgICAgICAgICAgICAgbWVkaWFUeXBlID0gdHlwZW9mIG1lZGlhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihtZWRpYVR5cGUgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgIGZvciggaSA9IDA7IGkgPCBzdHlsZVNoZWV0LnJ1bGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc3R5bGVTaGVldC5ydWxlc1tpXS5zZWxlY3RvclRleHQgJiYgc3R5bGVTaGVldC5ydWxlc1tpXS5zZWxlY3RvclRleHQudG9Mb3dlckNhc2UoKSA9PT0gc2VsZWN0b3IudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZVNoZWV0LnJ1bGVzW2ldLnN0eWxlLmNzc1RleHQgPSBzdHlsZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzdHlsZVNoZWV0LmFkZFJ1bGUoc2VsZWN0b3IsIHN0eWxlKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmKG1lZGlhVHlwZSA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICAgICAgZm9yKCBpID0gMDsgaSA8IHN0eWxlU2hlZXQuY3NzUnVsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihzdHlsZVNoZWV0LmNzc1J1bGVzW2ldLnNlbGVjdG9yVGV4dCAmJiBzdHlsZVNoZWV0LmNzc1J1bGVzW2ldLnNlbGVjdG9yVGV4dC50b0xvd2VyQ2FzZSgpID09PSBzZWxlY3Rvci50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlU2hlZXQuY3NzUnVsZXNbaV0uc3R5bGUuY3NzVGV4dCA9IHN0eWxlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHN0eWxlU2hlZXQuaW5zZXJ0UnVsZShzZWxlY3RvciArIFwie1wiICsgc3R5bGUgKyBcIn1cIiwgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIEV2ZW50OiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc3Vic2NyaWJlcnMgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5zdWJzY3JpYmUgPSBmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xyXG4gICAgICAgICAgICBzdWJzY3JpYmVycy5wdXNoKHN1YnNjcmliZXIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMudHJpZ2dlciA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIHN1YnNjcmliZXJzLmZvckVhY2goZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcclxuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJrby5leHRlbmRlcnMubGlua2VkID0gZnVuY3Rpb24gKHRhcmdldCwgb3B0aW9ucykge1xyXG4gICAgZnVuY3Rpb24gc2V0dXBWYWx1ZVN1YnNjcmlwdGlvbih2YWx1ZSkge1xyXG4gICAgICAgIGlmIChrby5pc09ic2VydmFibGUodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHZhciBzdWJzY3JpcHRpb24gPSB2YWx1ZS5zdWJzY3JpYmUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LnZhbHVlSGFzTXV0YXRlZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGFyZ2V0Ll9wcmV2aW91c0xpbmtlZFN1YnNjcmlwdGlvbiA9IHN1YnNjcmlwdGlvbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGFyZ2V0LnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgICBpZiAodGFyZ2V0Ll9wcmV2aW91c0xpbmtlZFN1YnNjcmlwdGlvbikge1xyXG4gICAgICAgICAgICB0YXJnZXQuX3ByZXZpb3VzTGlua2VkU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0dXBWYWx1ZVN1YnNjcmlwdGlvbihuZXdWYWx1ZSk7XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIGN1cnJlbnRWYWx1ZSA9IHRhcmdldCgpO1xyXG4gICAgc2V0dXBWYWx1ZVN1YnNjcmlwdGlvbihjdXJyZW50VmFsdWUpO1xyXG59OyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBzeXN0ZW1FdmVudHM6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnJlYWRNb2RlbHMgPSBCaWZyb3N0LnJlYWQucmVhZE1vZGVsU3lzdGVtRXZlbnRzLmNyZWF0ZSgpO1xyXG4gICAgICAgIHRoaXMuY29tbWFuZHMgPSBCaWZyb3N0LmNvbW1hbmRzLmNvbW1hbmRFdmVudHMuY3JlYXRlKCk7XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy5zeXN0ZW1FdmVudHMgPSBCaWZyb3N0LnN5c3RlbUV2ZW50czsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgdGFza0ZhY3Rvcnk6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZUh0dHBQb3N0ID0gZnVuY3Rpb24gKHVybCwgcGF5bG9hZCkge1xyXG4gICAgICAgICAgICB2YXIgdGFzayA9IEJpZnJvc3QudGFza3MuSHR0cFBvc3RUYXNrLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IHBheWxvYWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0YXNrO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlSHR0cEdldCA9IGZ1bmN0aW9uICh1cmwsIHBheWxvYWQpIHtcclxuICAgICAgICAgICAgdmFyIHRhc2sgPSBCaWZyb3N0LnRhc2tzLkh0dHBHZXRUYXNrLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IHBheWxvYWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0YXNrO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlUXVlcnkgPSBmdW5jdGlvbiAocXVlcnksIHBhZ2luZykge1xyXG4gICAgICAgICAgICB2YXIgdGFzayA9IEJpZnJvc3QucmVhZC5RdWVyeVRhc2suY3JlYXRlKHtcclxuICAgICAgICAgICAgICAgIHF1ZXJ5OiBxdWVyeSxcclxuICAgICAgICAgICAgICAgIHBhZ2luZzogcGFnaW5nXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdGFzaztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZVJlYWRNb2RlbCA9IGZ1bmN0aW9uIChyZWFkTW9kZWxPZiwgcHJvcGVydHlGaWx0ZXJzKSB7XHJcbiAgICAgICAgICAgIHZhciB0YXNrID0gQmlmcm9zdC5yZWFkLlJlYWRNb2RlbFRhc2suY3JlYXRlKHtcclxuICAgICAgICAgICAgICAgIHJlYWRNb2RlbE9mOiByZWFkTW9kZWxPZixcclxuICAgICAgICAgICAgICAgIHByb3BlcnR5RmlsdGVyczogcHJvcGVydHlGaWx0ZXJzXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdGFzaztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZUhhbmRsZUNvbW1hbmQgPSBmdW5jdGlvbiAoY29tbWFuZCkge1xyXG4gICAgICAgICAgICB2YXIgdGFzayA9IEJpZnJvc3QuY29tbWFuZHMuSGFuZGxlQ29tbWFuZFRhc2suY3JlYXRlKHtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmQ6IGNvbW1hbmRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0YXNrO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlSGFuZGxlQ29tbWFuZHMgPSBmdW5jdGlvbiAoY29tbWFuZHMpIHtcclxuICAgICAgICAgICAgdmFyIHRhc2sgPSBCaWZyb3N0LmNvbW1hbmRzLkhhbmRsZUNvbW1hbmRzVGFzay5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZHM6IGNvbW1hbmRzXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdGFzaztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZVZpZXdMb2FkID0gZnVuY3Rpb24gKGZpbGVzKSB7XHJcbiAgICAgICAgICAgIHZhciB0YXNrID0gQmlmcm9zdC52aWV3cy5WaWV3TG9hZFRhc2suY3JlYXRlKHtcclxuICAgICAgICAgICAgICAgIGZpbGVzOiBmaWxlc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRhc2s7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGVWaWV3TW9kZWxMb2FkID0gZnVuY3Rpb24gKGZpbGVzKSB7XHJcbiAgICAgICAgICAgIHZhciB0YXNrID0gQmlmcm9zdC52aWV3cy5WaWV3TW9kZWxMb2FkVGFzay5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgZmlsZXM6IGZpbGVzXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdGFzaztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZUZpbGVMb2FkID0gZnVuY3Rpb24gKGZpbGVzKSB7XHJcbiAgICAgICAgICAgIHZhciB0YXNrID0gQmlmcm9zdC50YXNrcy5GaWxlTG9hZFRhc2suY3JlYXRlKHtcclxuICAgICAgICAgICAgICAgIGZpbGVzOiBmaWxlc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRhc2s7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIi8qIVxyXG4qIEphdmFTY3JpcHQgVGltZVNwYW4gTGlicmFyeVxyXG4qXHJcbiogQ29weXJpZ2h0IChjKSAyMDEwIE1pY2hhZWwgU3R1bSwgaHR0cDovL3d3dy5TdHVtLmRlL1xyXG4qIFxyXG4qIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZ1xyXG4qIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxyXG4qIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xyXG4qIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcclxuKiBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cclxuKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cclxuKiB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XHJcbiogXHJcbiogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcclxuKiBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuKiBcclxuKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxyXG4qIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxyXG4qIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXHJcbiogTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxyXG4qIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cclxuKiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cclxuKiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIC8vIENvbnN0cnVjdG9yIGZ1bmN0aW9uLCBhbGwgcGFyYW1ldGVycyBhcmUgb3B0aW9uYWxcclxuICAgIFRpbWVTcGFuIDogZnVuY3Rpb24gKG1pbGxpc2Vjb25kcywgc2Vjb25kcywgbWludXRlcywgaG91cnMsIGRheXMpIHtcclxuICAgICAgICB2YXIgdmVyc2lvbiA9IFwiMS4yXCIsXHJcbiAgICAgICAgICAgIC8vIE1pbGxpc2Vjb25kLWNvbnN0YW50c1xyXG4gICAgICAgICAgICBtc2VjUGVyU2Vjb25kID0gMTAwMCxcclxuICAgICAgICAgICAgbXNlY1Blck1pbnV0ZSA9IDYwMDAwLFxyXG4gICAgICAgICAgICBtc2VjUGVySG91ciA9IDM2MDAwMDAsXHJcbiAgICAgICAgICAgIG1zZWNQZXJEYXkgPSA4NjQwMDAwMCxcclxuICAgICAgICAgICAgLy8gSW50ZXJuYWxseSB3ZSBzdG9yZSB0aGUgVGltZVNwYW4gYXMgTWlsbGlzZWNvbmRzXHJcbiAgICAgICAgICAgIG1zZWNzID0gMCxcclxuXHJcbiAgICAgICAgICAgIC8vIEhlbHBlciBmdW5jdGlvbnNcclxuICAgICAgICAgICAgaXNOdW1lcmljID0gZnVuY3Rpb24gKGlucHV0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQoaW5wdXQpKSAmJiBpc0Zpbml0ZShpbnB1dCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIENvbnN0cnVjdG9yIExvZ2ljXHJcbiAgICAgICAgaWYgKGlzTnVtZXJpYyhkYXlzKSkge1xyXG4gICAgICAgICAgICBtc2VjcyArPSAoZGF5cyAqIG1zZWNQZXJEYXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNOdW1lcmljKGhvdXJzKSkge1xyXG4gICAgICAgICAgICBtc2VjcyArPSAoaG91cnMgKiBtc2VjUGVySG91cik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc051bWVyaWMobWludXRlcykpIHtcclxuICAgICAgICAgICAgbXNlY3MgKz0gKG1pbnV0ZXMgKiBtc2VjUGVyTWludXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzTnVtZXJpYyhzZWNvbmRzKSkge1xyXG4gICAgICAgICAgICBtc2VjcyArPSAoc2Vjb25kcyAqIG1zZWNQZXJTZWNvbmQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNOdW1lcmljKG1pbGxpc2Vjb25kcykpIHtcclxuICAgICAgICAgICAgbXNlY3MgKz0gbWlsbGlzZWNvbmRzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQWRkaXRpb24gRnVuY3Rpb25zXHJcbiAgICAgICAgdGhpcy5hZGRNaWxsaXNlY29uZHMgPSBmdW5jdGlvbiAobWlsbGlzZWNvbmRzKSB7XHJcbiAgICAgICAgICAgIGlmICghaXNOdW1lcmljKG1pbGxpc2Vjb25kcykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtc2VjcyArPSBtaWxsaXNlY29uZHM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmFkZFNlY29uZHMgPSBmdW5jdGlvbiAoc2Vjb25kcykge1xyXG4gICAgICAgICAgICBpZiAoIWlzTnVtZXJpYyhzZWNvbmRzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1zZWNzICs9IChzZWNvbmRzICogbXNlY1BlclNlY29uZCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmFkZE1pbnV0ZXMgPSBmdW5jdGlvbiAobWludXRlcykge1xyXG4gICAgICAgICAgICBpZiAoIWlzTnVtZXJpYyhtaW51dGVzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1zZWNzICs9IChtaW51dGVzICogbXNlY1Blck1pbnV0ZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmFkZEhvdXJzID0gZnVuY3Rpb24gKGhvdXJzKSB7XHJcbiAgICAgICAgICAgIGlmICghaXNOdW1lcmljKGhvdXJzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1zZWNzICs9IChob3VycyAqIG1zZWNQZXJIb3VyKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuYWRkRGF5cyA9IGZ1bmN0aW9uIChkYXlzKSB7XHJcbiAgICAgICAgICAgIGlmICghaXNOdW1lcmljKGRheXMpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbXNlY3MgKz0gKGRheXMgKiBtc2VjUGVyRGF5KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBTdWJ0cmFjdGlvbiBGdW5jdGlvbnNcclxuICAgICAgICB0aGlzLnN1YnRyYWN0TWlsbGlzZWNvbmRzID0gZnVuY3Rpb24gKG1pbGxpc2Vjb25kcykge1xyXG4gICAgICAgICAgICBpZiAoIWlzTnVtZXJpYyhtaWxsaXNlY29uZHMpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbXNlY3MgLT0gbWlsbGlzZWNvbmRzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5zdWJ0cmFjdFNlY29uZHMgPSBmdW5jdGlvbiAoc2Vjb25kcykge1xyXG4gICAgICAgICAgICBpZiAoIWlzTnVtZXJpYyhzZWNvbmRzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1zZWNzIC09IChzZWNvbmRzICogbXNlY1BlclNlY29uZCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnN1YnRyYWN0TWludXRlcyA9IGZ1bmN0aW9uIChtaW51dGVzKSB7XHJcbiAgICAgICAgICAgIGlmICghaXNOdW1lcmljKG1pbnV0ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbXNlY3MgLT0gKG1pbnV0ZXMgKiBtc2VjUGVyTWludXRlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuc3VidHJhY3RIb3VycyA9IGZ1bmN0aW9uIChob3Vycykge1xyXG4gICAgICAgICAgICBpZiAoIWlzTnVtZXJpYyhob3VycykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtc2VjcyAtPSAoaG91cnMgKiBtc2VjUGVySG91cik7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnN1YnRyYWN0RGF5cyA9IGZ1bmN0aW9uIChkYXlzKSB7XHJcbiAgICAgICAgICAgIGlmICghaXNOdW1lcmljKGRheXMpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbXNlY3MgLT0gKGRheXMgKiBtc2VjUGVyRGF5KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBGdW5jdGlvbnMgdG8gaW50ZXJhY3Qgd2l0aCBvdGhlciBUaW1lU3BhbnNcclxuICAgICAgICB0aGlzLmlzVGltZVNwYW4gPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuYWRkID0gZnVuY3Rpb24gKG90aGVyVGltZVNwYW4pIHtcclxuICAgICAgICAgICAgaWYgKCFvdGhlclRpbWVTcGFuLmlzVGltZVNwYW4pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtc2VjcyArPSBvdGhlclRpbWVTcGFuLnRvdGFsTWlsbGlzZWNvbmRzKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnN1YnRyYWN0ID0gZnVuY3Rpb24gKG90aGVyVGltZVNwYW4pIHtcclxuICAgICAgICAgICAgaWYgKCFvdGhlclRpbWVTcGFuLmlzVGltZVNwYW4pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtc2VjcyAtPSBvdGhlclRpbWVTcGFuLnRvdGFsTWlsbGlzZWNvbmRzKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmVxdWFscyA9IGZ1bmN0aW9uIChvdGhlclRpbWVTcGFuKSB7XHJcbiAgICAgICAgICAgIGlmICghb3RoZXJUaW1lU3Bhbi5pc1RpbWVTcGFuKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG1zZWNzID09PSBvdGhlclRpbWVTcGFuLnRvdGFsTWlsbGlzZWNvbmRzKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gR2V0dGVyc1xyXG4gICAgICAgIHRoaXMudG90YWxNaWxsaXNlY29uZHMgPSBmdW5jdGlvbiAocm91bmREb3duKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBtc2VjcztcclxuICAgICAgICAgICAgaWYgKHJvdW5kRG93biA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gTWF0aC5mbG9vcihyZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnRvdGFsU2Vjb25kcyA9IGZ1bmN0aW9uIChyb3VuZERvd24pIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG1zZWNzIC8gbXNlY1BlclNlY29uZDtcclxuICAgICAgICAgICAgaWYgKHJvdW5kRG93biA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gTWF0aC5mbG9vcihyZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnRvdGFsTWludXRlcyA9IGZ1bmN0aW9uIChyb3VuZERvd24pIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG1zZWNzIC8gbXNlY1Blck1pbnV0ZTtcclxuICAgICAgICAgICAgaWYgKHJvdW5kRG93biA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gTWF0aC5mbG9vcihyZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnRvdGFsSG91cnMgPSBmdW5jdGlvbiAocm91bmREb3duKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBtc2VjcyAvIG1zZWNQZXJIb3VyO1xyXG4gICAgICAgICAgICBpZiAocm91bmREb3duID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBNYXRoLmZsb29yKHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudG90YWxEYXlzID0gZnVuY3Rpb24gKHJvdW5kRG93bikge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbXNlY3MgLyBtc2VjUGVyRGF5O1xyXG4gICAgICAgICAgICBpZiAocm91bmREb3duID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBNYXRoLmZsb29yKHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIFJldHVybiBhIEZyYWN0aW9uIG9mIHRoZSBUaW1lU3BhblxyXG4gICAgICAgIHRoaXMubWlsbGlzZWNvbmRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbXNlY3MgJSAxMDAwO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5zZWNvbmRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihtc2VjcyAvIG1zZWNQZXJTZWNvbmQpICUgNjA7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm1pbnV0ZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKG1zZWNzIC8gbXNlY1Blck1pbnV0ZSkgJSA2MDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuaG91cnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKG1zZWNzIC8gbXNlY1BlckhvdXIpICUgMjQ7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmRheXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKG1zZWNzIC8gbXNlY1BlckRheSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gTWlzYy4gRnVuY3Rpb25zXHJcbiAgICAgICAgdGhpcy5nZXRWZXJzaW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdmVyc2lvbjtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KTtcclxuXHJcbi8vIFwiU3RhdGljIENvbnN0cnVjdG9yc1wiXHJcbkJpZnJvc3QuVGltZVNwYW4uemVybyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIG5ldyBCaWZyb3N0LlRpbWVTcGFuKDAsIDAsIDAsIDAsIDApO1xyXG59O1xyXG5CaWZyb3N0LlRpbWVTcGFuLmZyb21NaWxsaXNlY29uZHMgPSBmdW5jdGlvbiAobWlsbGlzZWNvbmRzKSB7XHJcbiAgICByZXR1cm4gbmV3IEJpZnJvc3QuVGltZVNwYW4obWlsbGlzZWNvbmRzLCAwLCAwLCAwLCAwKTtcclxufTtcclxuQmlmcm9zdC5UaW1lU3Bhbi5mcm9tU2Vjb25kcyA9IGZ1bmN0aW9uIChzZWNvbmRzKSB7XHJcbiAgICByZXR1cm4gbmV3IEJpZnJvc3QuVGltZVNwYW4oMCwgc2Vjb25kcywgMCwgMCwgMCk7XHJcbn07XHJcbkJpZnJvc3QuVGltZVNwYW4uZnJvbU1pbnV0ZXMgPSBmdW5jdGlvbiAobWludXRlcykge1xyXG4gICAgcmV0dXJuIG5ldyBCaWZyb3N0LlRpbWVTcGFuKDAsIDAsIG1pbnV0ZXMsIDAsIDApO1xyXG59O1xyXG5CaWZyb3N0LlRpbWVTcGFuLmZyb21Ib3VycyA9IGZ1bmN0aW9uIChob3Vycykge1xyXG4gICAgcmV0dXJuIG5ldyBCaWZyb3N0LlRpbWVTcGFuKDAsIDAsIDAsIGhvdXJzLCAwKTtcclxufTtcclxuQmlmcm9zdC5UaW1lU3Bhbi5mcm9tRGF5cyA9IGZ1bmN0aW9uIChkYXlzKSB7XHJcbiAgICByZXR1cm4gbmV3IEJpZnJvc3QuVGltZVNwYW4oMCwgMCwgMCwgMCwgZGF5cyk7XHJcbn07XHJcbkJpZnJvc3QuVGltZVNwYW4uZnJvbURhdGVzID0gZnVuY3Rpb24gKGZpcnN0RGF0ZSwgc2Vjb25kRGF0ZSwgZm9yY2VQb3NpdGl2ZSkge1xyXG4gICAgdmFyIGRpZmZlcmVuY2VNc2VjcyA9IHNlY29uZERhdGUudmFsdWVPZigpIC0gZmlyc3REYXRlLnZhbHVlT2YoKTtcclxuICAgIGlmIChmb3JjZVBvc2l0aXZlID09PSB0cnVlKSB7XHJcbiAgICAgICAgZGlmZmVyZW5jZU1zZWNzID0gTWF0aC5hYnMoZGlmZmVyZW5jZU1zZWNzKTtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgQmlmcm9zdC5UaW1lU3BhbihkaWZmZXJlbmNlTXNlY3MsIDAsIDAsIDAsIDApO1xyXG59O1xyXG4iLCJpZiAodHlwZW9mIGtvICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAga28uYmluZGluZ0hhbmRsZXJzLmNvbW1hbmQgPSB7XHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdBY2Nlc3Nvciwgdmlld01vZGVsKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHZhbHVlQWNjZXNzb3IoKTtcclxuICAgICAgICAgICAgdmFyIGNvbW1hbmQ7XHJcbiAgICAgICAgICAgIHZhciBjb250ZXh0Qm91bmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYodHlwZW9mIHZhbHVlLmNhbkV4ZWN1dGUgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmQgPSB2YWx1ZS50YXJnZXQ7XHJcblxyXG4gICAgICAgICAgICAgICAgY29tbWFuZC5wYXJhbWV0ZXJzID0gY29tbWFuZC5wYXJhbWV0ZXJzIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtZXRlcnMgPSB2YWx1ZS5wYXJhbWV0ZXJzIHx8IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHBhcmFtZXRlciBpbiBwYXJhbWV0ZXJzICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJhbWV0ZXJWYWx1ZSA9IHBhcmFtZXRlcnNbcGFyYW1ldGVyXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIGNvbW1hbmQucGFyYW1ldGVycy5oYXNPd25Qcm9wZXJ0eShwYXJhbWV0ZXIpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtvLmlzT2JzZXJ2YWJsZShjb21tYW5kLnBhcmFtZXRlcnNbcGFyYW1ldGVyXSkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmQucGFyYW1ldGVyc1twYXJhbWV0ZXJdKHBhcmFtZXRlclZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kLnBhcmFtZXRlcnNbcGFyYW1ldGVyXSA9IGtvLm9ic2VydmFibGUocGFyYW1ldGVyVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnRleHRCb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAga28uYXBwbHlCaW5kaW5nc1RvTm9kZShlbGVtZW50LCB7IGNsaWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmQuZXhlY3V0ZSgpO1xyXG4gICAgICAgICAgICB9fSwgdmlld01vZGVsKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmNvbW1hbmRzXCIsIHtcclxuICAgIENvbW1hbmQ6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKGNvbW1hbmRDb29yZGluYXRvciwgY29tbWFuZFZhbGlkYXRpb25TZXJ2aWNlLCBjb21tYW5kU2VjdXJpdHlTZXJ2aWNlLCBtYXBwZXIsIG9wdGlvbnMsIHJlZ2lvbikge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgaGFzQ2hhbmdlc09ic2VydmFibGVzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcblxyXG4gICAgICAgIHRoaXMucmVnaW9uID0gcmVnaW9uO1xyXG4gICAgICAgIHRoaXMuX25hbWUgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuX2dlbmVyYXRlZEZyb20gPSBcIlwiO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0Q29tbWFuZCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0b3JzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0aW9uTWVzc2FnZXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICB0aGlzLnNlY3VyaXR5Q29udGV4dCA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcbiAgICAgICAgdGhpcy5wb3B1bGF0ZWRGcm9tRXh0ZXJuYWxTb3VyY2UgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuaXNCdXN5ID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5pc1ZhbGlkID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdmFsaWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBzZWxmLnZhbGlkYXRvcnMoKS5zb21lKGZ1bmN0aW9uICh2YWxpZGF0b3IpIHtcclxuICAgICAgICAgICAgICAgIGlmIChrby5pc09ic2VydmFibGUodmFsaWRhdG9yLmlzVmFsaWQpICYmIHZhbGlkYXRvci5pc1ZhbGlkKCkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VsZi52YWxpZGF0aW9uTWVzc2FnZXMoKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2YWxpZDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmlzQXV0aG9yaXplZCA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuY2FuRXhlY3V0ZSA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuaXNWYWxpZCgpICYmIHNlbGYuaXNBdXRob3JpemVkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5pc1BvcHVsYXRlZEV4dGVybmFsbHkgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgICAgICB0aGlzLmlzUmVhZHkgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmlzUG9wdWxhdGVkRXh0ZXJuYWxseSgpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYucG9wdWxhdGVkRnJvbUV4dGVybmFsU291cmNlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5pc1JlYWR5VG9FeGVjdXRlID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5pc1BvcHVsYXRlZEV4dGVybmFsbHkoKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5oYXNDaGFuZ2VzKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmhhc0NoYW5nZXMgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBoYXNDaGFuZ2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgaGFzQ2hhbmdlc09ic2VydmFibGVzKCkuc29tZShmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0oKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhhc0NoYW5nZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGhhc0NoYW5nZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5mYWlsZWRDYWxsYmFja3MgPSBbXTtcclxuICAgICAgICB0aGlzLnN1Y2NlZWRlZENhbGxiYWNrcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuY29tcGxldGVkQ2FsbGJhY2tzID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuY29tbWFuZENvb3JkaW5hdG9yID0gY29tbWFuZENvb3JkaW5hdG9yO1xyXG4gICAgICAgIHRoaXMuY29tbWFuZFZhbGlkYXRpb25TZXJ2aWNlID0gY29tbWFuZFZhbGlkYXRpb25TZXJ2aWNlO1xyXG4gICAgICAgIHRoaXMuY29tbWFuZFNlY3VyaXR5U2VydmljZSA9IGNvbW1hbmRTZWN1cml0eVNlcnZpY2U7XHJcblxyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgYmVmb3JlRXhlY3V0ZTogZnVuY3Rpb24gKCkgeyB9LFxyXG4gICAgICAgICAgICBmYWlsZWQ6IGZ1bmN0aW9uICgpIHsgfSxcclxuICAgICAgICAgICAgc3VjY2VlZGVkOiBmdW5jdGlvbiAoKSB7IH0sXHJcbiAgICAgICAgICAgIGNvbXBsZXRlZDogZnVuY3Rpb24gKCkgeyB9LFxyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7fVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZmFpbGVkID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHNlbGYuZmFpbGVkQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuc3VjY2VlZGVkID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc3VjY2VlZGVkQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuY29tcGxldGVkID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHNlbGYuY29tcGxldGVkQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNldE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgICAgICBCaWZyb3N0LmV4dGVuZChzZWxmLm9wdGlvbnMsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMubmFtZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2Ygb3B0aW9ucy5uYW1lID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLl9uYW1lID0gb3B0aW9ucy5uYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jb3B5UHJvcGVydGllc0Zyb21PcHRpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBzZWxmLnRhcmdldENvbW1hbmQub3B0aW9ucy5wcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBzZWxmLnRhcmdldENvbW1hbmQub3B0aW9ucy5wcm9wZXJ0aWVzW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgICAgIGlmICgha28uaXNPYnNlcnZhYmxlKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0ga28ub2JzZXJ2YWJsZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi50YXJnZXRDb21tYW5kW3Byb3BlcnR5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBzZWxmLnRhcmdldENvbW1hbmQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLnRhcmdldENvbW1hbmQuaGFzT3duUHJvcGVydHkocHJvcGVydHkpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgIShzZWxmLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2gocHJvcGVydHkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvcGVydGllcztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm1ha2VQcm9wZXJ0aWVzT2JzZXJ2YWJsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBzZWxmLmdldFByb3BlcnRpZXMoKTtcclxuICAgICAgICAgICAgcHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eVZhbHVlID0gc2VsZi50YXJnZXRDb21tYW5kW3Byb3BlcnR5XTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWtvLmlzT2JzZXJ2YWJsZShwcm9wZXJ0eVZhbHVlKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAodHlwZW9mIHByb3BlcnR5VmFsdWUgIT09IFwib2JqZWN0XCIgfHwgQmlmcm9zdC5pc0FycmF5KHByb3BlcnR5VmFsdWUpKSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHByb3BlcnR5VmFsdWUgIT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC5pc0FycmF5KHByb3BlcnR5VmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGtvLm9ic2VydmFibGVBcnJheShwcm9wZXJ0eVZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0ga28ub2JzZXJ2YWJsZShwcm9wZXJ0eVZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnRhcmdldENvbW1hbmRbcHJvcGVydHldID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmV4dGVuZFByb3BlcnRpZXNXaXRoSGFzQ2hhbmdlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBzZWxmLmdldFByb3BlcnRpZXMoKTtcclxuICAgICAgICAgICAgcHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlWYWx1ZSA9IHNlbGYudGFyZ2V0Q29tbWFuZFtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgICAgICBpZiAoa28uaXNPYnNlcnZhYmxlKHByb3BlcnR5VmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZS5leHRlbmQoeyBoYXNDaGFuZ2VzOiB7fSB9KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQocHJvcGVydHlWYWx1ZS5oYXNDaGFuZ2VzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNDaGFuZ2VzT2JzZXJ2YWJsZXMucHVzaChwcm9wZXJ0eVZhbHVlLmhhc0NoYW5nZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vbkJlZm9yZUV4ZWN1dGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYub3B0aW9ucy5iZWZvcmVFeGVjdXRlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vbkZhaWxlZCA9IGZ1bmN0aW9uIChjb21tYW5kUmVzdWx0KSB7XHJcbiAgICAgICAgICAgIHNlbGYub3B0aW9ucy5mYWlsZWQoY29tbWFuZFJlc3VsdCk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLmZhaWxlZENhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soY29tbWFuZFJlc3VsdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2V0SW5pdGlhbFZhbHVlc0ZvclByb3BlcnRpZXMgPSBmdW5jdGlvbiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gc2VsZi50YXJnZXRDb21tYW5kW3Byb3BlcnR5TmFtZV07XHJcbiAgICAgICAgICAgICAgICBpZiAoa28uaXNPYnNlcnZhYmxlKHByb3BlcnR5KSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGtvLmlzV3JpdGVhYmxlT2JzZXJ2YWJsZShwcm9wZXJ0eSkgJiZcclxuICAgICAgICAgICAgICAgICAgICBCaWZyb3N0LmlzRnVuY3Rpb24ocHJvcGVydHkuc2V0SW5pdGlhbFZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHByb3BlcnR5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkuc2V0SW5pdGlhbFZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsVmFsdWVzRnJvbUN1cnJlbnRWYWx1ZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gc2VsZi5nZXRQcm9wZXJ0aWVzKCk7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0SW5pdGlhbFZhbHVlc0ZvclByb3BlcnRpZXMocHJvcGVydGllcyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vblN1Y2NlZWRlZCA9IGZ1bmN0aW9uIChjb21tYW5kUmVzdWx0KSB7XHJcbiAgICAgICAgICAgIHNlbGYub3B0aW9ucy5zdWNjZWVkZWQoY29tbWFuZFJlc3VsdCk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnNldEluaXRpYWxWYWx1ZXNGcm9tQ3VycmVudFZhbHVlcygpO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5zdWNjZWVkZWRDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGNvbW1hbmRSZXN1bHQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9uQ29tcGxldGVkID0gZnVuY3Rpb24gKGNvbW1hbmRSZXN1bHQpIHtcclxuICAgICAgICAgICAgc2VsZi5vcHRpb25zLmNvbXBsZXRlZChjb21tYW5kUmVzdWx0KTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuY29tcGxldGVkQ2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhjb21tYW5kUmVzdWx0KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVDb21tYW5kUmVzdWx0ID0gZnVuY3Rpb24gKGNvbW1hbmRSZXN1bHQpIHtcclxuICAgICAgICAgICAgc2VsZi5pc0J1c3koZmFsc2UpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbW1hbmRSZXN1bHQuY29tbWFuZFZhbGlkYXRpb25NZXNzYWdlcyAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgc2VsZi52YWxpZGF0aW9uTWVzc2FnZXMoY29tbWFuZFJlc3VsdC5jb21tYW5kVmFsaWRhdGlvbk1lc3NhZ2VzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGNvbW1hbmRSZXN1bHQuc3VjY2VzcyA9PT0gZmFsc2UgfHwgY29tbWFuZFJlc3VsdC5pbnZhbGlkID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29tbWFuZFJlc3VsdC5pbnZhbGlkICYmIHR5cGVvZiBjb21tYW5kUmVzdWx0LnZhbGlkYXRpb25SZXN1bHRzICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb21tYW5kVmFsaWRhdGlvblNlcnZpY2UuYXBwbHlWYWxpZGF0aW9uUmVzdWx0VG9Qcm9wZXJ0aWVzKHNlbGYudGFyZ2V0Q29tbWFuZCwgY29tbWFuZFJlc3VsdC52YWxpZGF0aW9uUmVzdWx0cyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzZWxmLm9uRmFpbGVkKGNvbW1hbmRSZXN1bHQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vblN1Y2NlZWRlZChjb21tYW5kUmVzdWx0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZWxmLm9uQ29tcGxldGVkKGNvbW1hbmRSZXN1bHQpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0Q29tbWFuZFJlc3VsdEZyb21WYWxpZGF0aW9uUmVzdWx0ID0gZnVuY3Rpb24gKHZhbGlkYXRpb25SZXN1bHQpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IEJpZnJvc3QuY29tbWFuZHMuQ29tbWFuZFJlc3VsdC5jcmVhdGUoKTtcclxuICAgICAgICAgICAgcmVzdWx0LmludmFsaWQgPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZXhlY3V0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2VsZi5pc0J1c3kodHJ1ZSk7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLm9uQmVmb3JlRXhlY3V0ZSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbGlkYXRpb25SZXN1bHQgPSBzZWxmLmNvbW1hbmRWYWxpZGF0aW9uU2VydmljZS52YWxpZGF0ZSh0aGlzKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0aW9uUmVzdWx0LnZhbGlkID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29tbWFuZENvb3JkaW5hdG9yLmhhbmRsZShzZWxmLnRhcmdldENvbW1hbmQpLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoY29tbWFuZFJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oYW5kbGVDb21tYW5kUmVzdWx0KGNvbW1hbmRSZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbW1hbmRSZXN1bHQgPSBzZWxmLmdldENvbW1hbmRSZXN1bHRGcm9tVmFsaWRhdGlvblJlc3VsdCh2YWxpZGF0aW9uUmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmhhbmRsZUNvbW1hbmRSZXN1bHQoY29tbWFuZFJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmlzQnVzeShmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnBvcHVsYXRlZEV4dGVybmFsbHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYuaXNQb3B1bGF0ZWRFeHRlcm5hbGx5KHRydWUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucG9wdWxhdGVGcm9tRXh0ZXJuYWxTb3VyY2UgPSBmdW5jdGlvbiAodmFsdWVzKSB7XHJcbiAgICAgICAgICAgIHNlbGYuaXNQb3B1bGF0ZWRFeHRlcm5hbGx5KHRydWUpO1xyXG4gICAgICAgICAgICBzZWxmLnNldFByb3BlcnR5VmFsdWVzRnJvbSh2YWx1ZXMpO1xyXG4gICAgICAgICAgICBzZWxmLnBvcHVsYXRlZEZyb21FeHRlcm5hbFNvdXJjZSh0cnVlKTtcclxuICAgICAgICAgICAgY29tbWFuZFZhbGlkYXRpb25TZXJ2aWNlLmNsZWFyVmFsaWRhdGlvbk1lc3NhZ2VzRm9yKHNlbGYudGFyZ2V0Q29tbWFuZCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRQcm9wZXJ0eVZhbHVlc0Zyb20gPSBmdW5jdGlvbiAodmFsdWVzKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXBwZWRQcm9wZXJ0aWVzID0gbWFwcGVyLm1hcFRvSW5zdGFuY2Uoc2VsZi50YXJnZXRDb21tYW5kLl90eXBlLCB2YWx1ZXMsIHNlbGYudGFyZ2V0Q29tbWFuZCk7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0SW5pdGlhbFZhbHVlc0ZvclByb3BlcnRpZXMobWFwcGVkUHJvcGVydGllcyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vbkNyZWF0ZWQgPSBmdW5jdGlvbiAobGFzdERlc2NlbmRhbnQpIHtcclxuICAgICAgICAgICAgc2VsZi50YXJnZXRDb21tYW5kID0gbGFzdERlc2NlbmRhbnQ7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb3B5UHJvcGVydGllc0Zyb21PcHRpb25zKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5tYWtlUHJvcGVydGllc09ic2VydmFibGUoKTtcclxuICAgICAgICAgICAgdGhpcy5leHRlbmRQcm9wZXJ0aWVzV2l0aEhhc0NoYW5nZXMoKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBsYXN0RGVzY2VuZGFudC5fbmFtZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBsYXN0RGVzY2VuZGFudC5fbmFtZSAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZFZhbGlkYXRpb25TZXJ2aWNlLmV4dGVuZFByb3BlcnRpZXNXaXRob3V0VmFsaWRhdGlvbihsYXN0RGVzY2VuZGFudCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsaWRhdG9ycyA9IGNvbW1hbmRWYWxpZGF0aW9uU2VydmljZS5nZXRWYWxpZGF0b3JzRm9yKGxhc3REZXNjZW5kYW50KTtcclxuICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzQXJyYXkodmFsaWRhdG9ycykgJiYgdmFsaWRhdG9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi52YWxpZGF0b3JzKHZhbGlkYXRvcnMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29tbWFuZFZhbGlkYXRpb25TZXJ2aWNlLnZhbGlkYXRlU2lsZW50bHkodGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbW1hbmRTZWN1cml0eVNlcnZpY2UuZ2V0Q29udGV4dEZvcihsYXN0RGVzY2VuZGFudCkuY29udGludWVXaXRoKGZ1bmN0aW9uIChzZWN1cml0eUNvbnRleHQpIHtcclxuICAgICAgICAgICAgICAgIGxhc3REZXNjZW5kYW50LnNlY3VyaXR5Q29udGV4dChzZWN1cml0eUNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChrby5pc09ic2VydmFibGUoc2VjdXJpdHlDb250ZXh0LmlzQXV0aG9yaXplZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsYXN0RGVzY2VuZGFudC5pc0F1dGhvcml6ZWQoc2VjdXJpdHlDb250ZXh0LmlzQXV0aG9yaXplZCgpKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWN1cml0eUNvbnRleHQuaXNBdXRob3JpemVkLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdERlc2NlbmRhbnQuaXNBdXRob3JpemVkKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5jb21tYW5kc1wiLCB7XHJcbiAgICBjb21tYW5kQ29vcmRpbmF0b3I6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICh0YXNrRmFjdG9yeSkge1xyXG4gICAgICAgIHRoaXMuaGFuZGxlID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB2YXIgdGFzayA9IHRhc2tGYWN0b3J5LmNyZWF0ZUhhbmRsZUNvbW1hbmQoY29tbWFuZCk7XHJcblxyXG4gICAgICAgICAgICBjb21tYW5kLnJlZ2lvbi50YXNrcy5leGVjdXRlKHRhc2spLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoY29tbWFuZFJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoY29tbWFuZFJlc3VsdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVNYW55ID0gZnVuY3Rpb24gKGNvbW1hbmRzLCByZWdpb24pIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHZhciB0YXNrID0gdGFza0ZhY3RvcnkuY3JlYXRlSGFuZGxlQ29tbWFuZHMoY29tbWFuZHMpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlZ2lvbi50YXNrcy5leGVjdXRlKHRhc2spLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoY29tbWFuZFJlc3VsdHMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kcy5mb3JFYWNoKGZ1bmN0aW9uIChjb21tYW5kLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29tbWFuZFJlc3VsdCA9IGNvbW1hbmRSZXN1bHRzW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbW1hbmRSZXN1bHQgIT0gbnVsbCAmJiAhQmlmcm9zdC5pc1VuZGVmaW5lZChjb21tYW5kUmVzdWx0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZC5oYW5kbGVDb21tYW5kUmVzdWx0KGNvbW1hbmRSZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmQuaXNCdXN5KGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoY29tbWFuZFJlc3VsdHMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZHMuZm9yRWFjaChmdW5jdGlvbihjb21tYW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZC5pc0J1c3koZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy5jb21tYW5kQ29vcmRpbmF0b3IgPSBCaWZyb3N0LmNvbW1hbmRzLmNvbW1hbmRDb29yZGluYXRvcjsiLCJCaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlcnMuY29tbWFuZCA9IHtcclxuICAgIGNhblJlc29sdmU6IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGNvbW1hbmRzICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lIGluIGNvbW1hbmRzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc29sdmU6IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gY29tbWFuZHNbbmFtZV0uY3JlYXRlKCk7XHJcbiAgICB9XHJcbn07IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmNvbW1hbmRzXCIpO1xyXG5CaWZyb3N0LmNvbW1hbmRzLkNvbW1hbmREZXNjcmlwdG9yID0gZnVuY3Rpb24oY29tbWFuZCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHZhciBidWlsdEluQ29tbWFuZCA9IHt9O1xyXG4gICAgaWYgKHR5cGVvZiBCaWZyb3N0LmNvbW1hbmRzLkNvbW1hbmQgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICBidWlsdEluQ29tbWFuZCA9IEJpZnJvc3QuY29tbWFuZHMuQ29tbWFuZC5jcmVhdGUoe1xyXG4gICAgICAgICAgICByZWdpb246IHsgY29tbWFuZHM6IFtdIH0sXHJcbiAgICAgICAgICAgIGNvbW1hbmRDb29yZGluYXRvcjoge30sXHJcbiAgICAgICAgICAgIGNvbW1hbmRWYWxpZGF0aW9uU2VydmljZToge30sXHJcbiAgICAgICAgICAgIGNvbW1hbmRTZWN1cml0eVNlcnZpY2U6IHsgZ2V0Q29udGV4dEZvcjogZnVuY3Rpb24gKCkgeyByZXR1cm4geyBjb250aW51ZVdpdGg6IGZ1bmN0aW9uICgpIHsgfSB9OyB9IH0sXHJcbiAgICAgICAgICAgIG1hcHBlcjoge30sXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHt9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2hvdWxkU2tpcFByb3BlcnR5KHRhcmdldCwgcHJvcGVydHkpIHtcclxuICAgICAgICBpZiAoIXRhcmdldC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChidWlsdEluQ29tbWFuZC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChrby5pc09ic2VydmFibGUodGFyZ2V0W3Byb3BlcnR5XSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIHRhcmdldFtwcm9wZXJ0eV0gPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHByb3BlcnR5ID09PSBcIl90eXBlXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gXCJfbmFtZXNwYWNlXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UHJvcGVydGllc0Zyb21Db21tYW5kKGNvbW1hbmQpIHtcclxuICAgICAgICB2YXIgcHJvcGVydGllcyA9IHt9O1xyXG5cclxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBjb21tYW5kKSB7XHJcbiAgICAgICAgICAgIGlmICghc2hvdWxkU2tpcFByb3BlcnR5KGNvbW1hbmQsIHByb3BlcnR5KSApIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXNbcHJvcGVydHldID0gY29tbWFuZFtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHByb3BlcnRpZXM7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5uYW1lID0gY29tbWFuZC5fbmFtZTtcclxuICAgIHRoaXMuZ2VuZXJhdGVkRnJvbSA9IGNvbW1hbmQuX2dlbmVyYXRlZEZyb207XHJcbiAgICB0aGlzLmlkID0gQmlmcm9zdC5HdWlkLmNyZWF0ZSgpO1xyXG5cclxuICAgIHZhciBwcm9wZXJ0aWVzID0gZ2V0UHJvcGVydGllc0Zyb21Db21tYW5kKGNvbW1hbmQpO1xyXG4gICAgdmFyIGNvbW1hbmRDb250ZW50ID0ga28udG9KUyhwcm9wZXJ0aWVzKTtcclxuICAgIGNvbW1hbmRDb250ZW50LklkID0gQmlmcm9zdC5HdWlkLmNyZWF0ZSgpO1xyXG4gICAgdGhpcy5jb21tYW5kID0ga28udG9KU09OKGNvbW1hbmRDb250ZW50KTtcclxufTtcclxuXHJcblxyXG5CaWZyb3N0LmNvbW1hbmRzLkNvbW1hbmREZXNjcmlwdG9yLmNyZWF0ZUZyb20gPSBmdW5jdGlvbiAoY29tbWFuZCkge1xyXG4gICAgdmFyIGNvbW1hbmREZXNjcmlwdG9yID0gbmV3IEJpZnJvc3QuY29tbWFuZHMuQ29tbWFuZERlc2NyaXB0b3IoY29tbWFuZCk7XHJcbiAgICByZXR1cm4gY29tbWFuZERlc2NyaXB0b3I7XHJcbn07XHJcblxyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuY29tbWFuZHNcIiwge1xyXG4gICAgY29tbWFuZEV2ZW50czogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuc3VjY2VlZGVkID0gQmlmcm9zdC5FdmVudC5jcmVhdGUoKTtcclxuICAgICAgICB0aGlzLmZhaWxlZCA9IEJpZnJvc3QuRXZlbnQuY3JlYXRlKCk7XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuY29tbWFuZHNcIik7XHJcbkJpZnJvc3QuY29tbWFuZHMuQ29tbWFuZFJlc3VsdCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBDb21tYW5kUmVzdWx0KGV4aXN0aW5nKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuY29tbWFuZElkID09PSBCaWZyb3N0Lkd1aWQuZW1wdHk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jb21tYW5kTmFtZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5jb21tYW5kSWQgPSBCaWZyb3N0Lkd1aWQuZW1wdHk7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0aW9uUmVzdWx0cyA9IFtdO1xyXG4gICAgICAgIHRoaXMuc3VjY2VzcyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5pbnZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5wYXNzZWRTZWN1cml0eSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5leGNlcHRpb24gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5leGNlcHRpb25NZXNzYWdlID0gXCJcIjtcclxuICAgICAgICB0aGlzLmNvbW1hbmRWYWxpZGF0aW9uTWVzc2FnZXMgPSBbXTtcclxuICAgICAgICB0aGlzLnNlY3VyaXR5TWVzc2FnZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmFsbFZhbGlkYXRpb25NZXNzYWdlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZGV0YWlscyA9IFwiXCI7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgZXhpc3RpbmcgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgQmlmcm9zdC5leHRlbmQodGhpcywgZXhpc3RpbmcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNyZWF0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBjb21tYW5kUmVzdWx0ID0gbmV3IENvbW1hbmRSZXN1bHQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbW1hbmRSZXN1bHQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjcmVhdGVGcm9tOiBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIHZhciBleGlzdGluZyA9IHR5cGVvZiByZXN1bHQgPT09IFwic3RyaW5nXCIgPyBKU09OLnBhcnNlKHJlc3VsdCkgOiByZXN1bHQ7XHJcbiAgICAgICAgICAgIHZhciBjb21tYW5kUmVzdWx0ID0gbmV3IENvbW1hbmRSZXN1bHQoZXhpc3RpbmcpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29tbWFuZFJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59KSgpOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5jb21tYW5kc1wiLCB7XHJcbiAgICBDb21tYW5kU2VjdXJpdHlDb250ZXh0OiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmlzQXV0aG9yaXplZCA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmNvbW1hbmRzXCIsIHtcclxuICAgIGNvbW1hbmRTZWN1cml0eUNvbnRleHRGYWN0b3J5OiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBjb250ZXh0ID0gQmlmcm9zdC5jb21tYW5kcy5Db21tYW5kU2VjdXJpdHlDb250ZXh0LmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dDtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmNvbW1hbmRzXCIsIHtcclxuICAgIGNvbW1hbmRTZWN1cml0eVNlcnZpY2U6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uIChjb21tYW5kU2VjdXJpdHlDb250ZXh0RmFjdG9yeSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5jb21tYW5kU2VjdXJpdHlDb250ZXh0RmFjdG9yeSA9IGNvbW1hbmRTZWN1cml0eUNvbnRleHRGYWN0b3J5O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRUeXBlTmFtZUZvcihjb21tYW5kKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21tYW5kLl90eXBlLl9uYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0U2VjdXJpdHlDb250ZXh0TmFtZUZvcih0eXBlKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWN1cml0eUNvbnRleHROYW1lID0gdHlwZSArIFwiU2VjdXJpdHlDb250ZXh0XCI7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWN1cml0eUNvbnRleHROYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFzU2VjdXJpdHlDb250ZXh0SW5OYW1lc3BhY2VGb3IodHlwZSwgbmFtZXNwYWNlKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWN1cml0eUNvbnRleHROYW1lID0gZ2V0U2VjdXJpdHlDb250ZXh0TmFtZUZvcih0eXBlKTtcclxuICAgICAgICAgICAgcmV0dXJuICFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHNlY3VyaXR5Q29udGV4dE5hbWUpICYmXHJcbiAgICAgICAgICAgICAgICAhQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChuYW1lc3BhY2UpICYmXHJcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2UuaGFzT3duUHJvcGVydHkoc2VjdXJpdHlDb250ZXh0TmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRTZWN1cml0eUNvbnRleHRJbk5hbWVzcGFjZUZvcih0eXBlLCBuYW1lc3BhY2UpIHtcclxuICAgICAgICAgICAgdmFyIHNlY3VyaXR5Q29udGV4dE5hbWUgPSBnZXRTZWN1cml0eUNvbnRleHROYW1lRm9yKHR5cGUsIG5hbWVzcGFjZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lc3BhY2Vbc2VjdXJpdHlDb250ZXh0TmFtZV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdldENvbnRleHRGb3IgPSBmdW5jdGlvbiAoY29tbWFuZCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHZhciBjb250ZXh0O1xyXG5cclxuICAgICAgICAgICAgdmFyIHR5cGUgPSBnZXRUeXBlTmFtZUZvcihjb21tYW5kKTtcclxuICAgICAgICAgICAgaWYgKGhhc1NlY3VyaXR5Q29udGV4dEluTmFtZXNwYWNlRm9yKHR5cGUsIGNvbW1hbmQuX3R5cGUuX25hbWVzcGFjZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb250ZXh0VHlwZSA9IGdldFNlY3VyaXR5Q29udGV4dEluTmFtZXNwYWNlRm9yKHR5cGUsIGNvbW1hbmQuX3R5cGUuX25hbWVzcGFjZSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0ID0gY29udGV4dFR5cGUuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChjb250ZXh0KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQgPSBzZWxmLmNvbW1hbmRTZWN1cml0eUNvbnRleHRGYWN0b3J5LmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoY29tbWFuZC5fZ2VuZXJhdGVkRnJvbSkgfHwgY29tbWFuZC5fZ2VuZXJhdGVkRnJvbSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdXJsID0gXCIvQmlmcm9zdC9Db21tYW5kU2VjdXJpdHkvR2V0Rm9yQ29tbWFuZD9jb21tYW5kTmFtZT1cIiArIGNvbW1hbmQuX2dlbmVyYXRlZEZyb207XHJcbiAgICAgICAgICAgICAgICAgICAgJC5nZXRKU09OKHVybCwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5pc0F1dGhvcml6ZWQoZS5pc0F1dGhvcml6ZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRDb250ZXh0Rm9yVHlwZSA9IGZ1bmN0aW9uIChjb21tYW5kVHlwZSkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHZhciBjb250ZXh0O1xyXG5cclxuICAgICAgICAgICAgaWYgKGhhc1NlY3VyaXR5Q29udGV4dEluTmFtZXNwYWNlRm9yKGNvbW1hbmRUeXBlLl9uYW1lLCBjb21tYW5kVHlwZS5fbmFtZXNwYWNlKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbnRleHRUeXBlID0gZ2V0U2VjdXJpdHlDb250ZXh0SW5OYW1lc3BhY2VGb3IoY29tbWFuZFR5cGUuX25hbWUsIGNvbW1hbmRUeXBlLl9uYW1lc3BhY2UpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dCA9IGNvbnRleHRUeXBlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoY29udGV4dCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0ID0gQmlmcm9zdC5jb21tYW5kcy5Db21tYW5kU2VjdXJpdHlDb250ZXh0LmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5pc0F1dGhvcml6ZWQodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChjb250ZXh0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLmNvbW1hbmRTZWN1cml0eVNlcnZpY2UgPSBCaWZyb3N0LmNvbW1hbmRzLmNvbW1hbmRTZWN1cml0eVNlcnZpY2U7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmNvbW1hbmRzXCIsIHtcclxuICAgIGNvbW1hbmRWYWxpZGF0aW9uU2VydmljZTogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2hvdWxkU2tpcFByb3BlcnR5KHRhcmdldCwgcHJvcGVydHkpIHtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09PSBcInJlZ2lvblwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGFyZ2V0Lmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZSh0YXJnZXRbcHJvcGVydHldKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0W3Byb3BlcnR5XSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvcGVydHkgPT09IFwiX3R5cGVcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09PSBcIl9kZXBlbmRlbmNpZXNcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09PSBcIl9uYW1lc3BhY2VcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCh0YXJnZXRbcHJvcGVydHldID09IG51bGwpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoKHR5cGVvZiB0YXJnZXRbcHJvcGVydHldLnByb3RvdHlwZSAhPT0gXCJ1bmRlZmluZWRcIikgJiZcclxuICAgICAgICAgICAgICAgICh0YXJnZXRbcHJvcGVydHldLnByb3RvdHlwZSAhPT0gbnVsbCkgJiZcclxuICAgICAgICAgICAgICAgICh0YXJnZXRbcHJvcGVydHldIGluc3RhbmNlb2YgQmlmcm9zdC5UeXBlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGV4dGVuZFByb3BlcnRpZXModGFyZ2V0LCB2YWxpZGF0b3JzKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNob3VsZFNraXBQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXRbcHJvcGVydHldLnZhbGlkYXRvciAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChrby5pc09ic2VydmFibGUodGFyZ2V0W3Byb3BlcnR5XSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcGVydHldLmV4dGVuZCh7IHZhbGlkYXRpb246IHt9IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFtwcm9wZXJ0eV0udmFsaWRhdG9yLnByb3BlcnR5TmFtZSA9IHByb3BlcnR5O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0W3Byb3BlcnR5XSA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGV4dGVuZFByb3BlcnRpZXModGFyZ2V0W3Byb3BlcnR5XSwgdmFsaWRhdG9ycyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHZhbGlkYXRlUHJvcGVydGllc0Zvcih0YXJnZXQsIHJlc3VsdCwgc2lsZW50KSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNob3VsZFNraXBQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0W3Byb3BlcnR5XS52YWxpZGF0b3IgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWVUb1ZhbGlkYXRlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh0YXJnZXRbcHJvcGVydHldKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaWxlbnQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BlcnR5XS52YWxpZGF0b3IudmFsaWRhdGVTaWxlbnRseSh2YWx1ZVRvVmFsaWRhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFtwcm9wZXJ0eV0udmFsaWRhdG9yLnZhbGlkYXRlKHZhbHVlVG9WYWxpZGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0W3Byb3BlcnR5XS52YWxpZGF0b3IuaXNWYWxpZCgpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQudmFsaWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0YXJnZXRbcHJvcGVydHldID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGVQcm9wZXJ0aWVzRm9yKHRhcmdldFtwcm9wZXJ0eV0sIHJlc3VsdCwgc2lsZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFwcGx5VmFsaWRhdGlvbk1lc3NhZ2VUb01lbWJlcnMoY29tbWFuZCwgbWVtYmVycywgbWVzc2FnZSkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBmaXhNZW1iZXIobWVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eSA9IG1lbWJlci50b0NhbWVsQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5IGluIHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0W3Byb3BlcnR5XSA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXRbcHJvcGVydHldO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgbWVtYmVySW5kZXggPSAwOyBtZW1iZXJJbmRleCA8IG1lbWJlcnMubGVuZ3RoOyBtZW1iZXJJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGF0aCA9IG1lbWJlcnNbbWVtYmVySW5kZXhdLnNwbGl0KFwiLlwiKTtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gY29tbWFuZDtcclxuXHJcbiAgICAgICAgICAgICAgICBwYXRoLmZvckVhY2goZml4TWVtYmVyKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgIT0gbnVsbCAmJiBwcm9wZXJ0eS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbWVtYmVyID0gdGFyZ2V0W3Byb3BlcnR5XTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtZW1iZXIudmFsaWRhdG9yICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbWJlci52YWxpZGF0b3IuaXNWYWxpZChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbWJlci52YWxpZGF0b3IubWVzc2FnZShtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYXBwbHlWYWxpZGF0aW9uUmVzdWx0VG9Qcm9wZXJ0aWVzID0gZnVuY3Rpb24gKGNvbW1hbmQsIHZhbGlkYXRpb25SZXN1bHRzKSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbGlkYXRpb25SZXN1bHRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsaWRhdGlvblJlc3VsdCA9IHZhbGlkYXRpb25SZXN1bHRzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSB2YWxpZGF0aW9uUmVzdWx0LmVycm9yTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIHZhciBtZW1iZXJOYW1lcyA9IHZhbGlkYXRpb25SZXN1bHQubWVtYmVyTmFtZXM7XHJcbiAgICAgICAgICAgICAgICBpZiAobWVtYmVyTmFtZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFwcGx5VmFsaWRhdGlvbk1lc3NhZ2VUb01lbWJlcnMoY29tbWFuZCwgbWVtYmVyTmFtZXMsIG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZSA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB7IHZhbGlkOiB0cnVlIH07XHJcbiAgICAgICAgICAgIHZhbGlkYXRlUHJvcGVydGllc0Zvcihjb21tYW5kLCByZXN1bHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMudmFsaWRhdGVTaWxlbnRseSA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB7IHZhbGlkOiB0cnVlIH07XHJcbiAgICAgICAgICAgIHZhbGlkYXRlUHJvcGVydGllc0Zvcihjb21tYW5kLCByZXN1bHQsIHRydWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY2xlYXJWYWxpZGF0aW9uTWVzc2FnZXNGb3IgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNob3VsZFNraXBQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh0YXJnZXRbcHJvcGVydHldLnZhbGlkYXRvcikpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcGVydHldLnZhbGlkYXRvci5tZXNzYWdlKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5leHRlbmRQcm9wZXJ0aWVzV2l0aG91dFZhbGlkYXRpb24gPSBmdW5jdGlvbiAoY29tbWFuZCkge1xyXG4gICAgICAgICAgICBleHRlbmRQcm9wZXJ0aWVzKGNvbW1hbmQpO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBjb2xsZWN0VmFsaWRhdG9ycyhzb3VyY2UsIHZhbGlkYXRvcnMpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBzb3VyY2VbcHJvcGVydHldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzaG91bGRTa2lwUHJvcGVydHkoc291cmNlLCBwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoa28uaXNPYnNlcnZhYmxlKHZhbHVlKSAmJiB0eXBlb2YgdmFsdWUudmFsaWRhdG9yICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9ycy5wdXNoKHZhbHVlLnZhbGlkYXRvcik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKEJpZnJvc3QuaXNPYmplY3QodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sbGVjdFZhbGlkYXRvcnModmFsdWUsIHZhbGlkYXRvcnMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdldFZhbGlkYXRvcnNGb3IgPSBmdW5jdGlvbiAoY29tbWFuZCkge1xyXG4gICAgICAgICAgICB2YXIgdmFsaWRhdG9ycyA9IFtdO1xyXG4gICAgICAgICAgICBjb2xsZWN0VmFsaWRhdG9ycyhjb21tYW5kLCB2YWxpZGF0b3JzKTtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRvcnM7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5jb21tYW5kc1wiLCB7XHJcbiAgICBIYW5kbGVDb21tYW5kc1Rhc2s6IEJpZnJvc3QudGFza3MuRXhlY3V0aW9uVGFzay5leHRlbmQoZnVuY3Rpb24gKGNvbW1hbmRzLCBzZXJ2ZXIpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyBhIHRhc2sgdGhhdCBjYW4gaGFuZGxlIGFuIGFycmF5IG9mIGNvbW1hbmQ8L3N1bW1hcnk+XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLm5hbWVzID0gW107XHJcbiAgICAgICAgY29tbWFuZHMuZm9yRWFjaChmdW5jdGlvbiAoY29tbWFuZCkge1xyXG4gICAgICAgICAgICBzZWxmLm5hbWVzLnB1c2goY29tbWFuZC5uYW1lKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY29tbWFuZERlc2NyaXB0b3JzID0gW107XHJcblxyXG4gICAgICAgICAgICBjb21tYW5kcy5mb3JFYWNoKGZ1bmN0aW9uIChjb21tYW5kKSB7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kLmlzQnVzeSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIHZhciBjb21tYW5kRGVzY3JpcHRvciA9IEJpZnJvc3QuY29tbWFuZHMuQ29tbWFuZERlc2NyaXB0b3IuY3JlYXRlRnJvbShjb21tYW5kKTtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmREZXNjcmlwdG9ycy5wdXNoKGNvbW1hbmREZXNjcmlwdG9yKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcGFyYW1ldGVycyA9IHtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmREZXNjcmlwdG9yczogY29tbWFuZERlc2NyaXB0b3JzXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB2YXIgdXJsID0gXCIvQmlmcm9zdC9Db21tYW5kQ29vcmRpbmF0b3IvSGFuZGxlTWFueVwiO1xyXG5cclxuICAgICAgICAgICAgc2VydmVyLnBvc3QodXJsLCBwYXJhbWV0ZXJzKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHJlc3VsdHMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb21tYW5kUmVzdWx0cyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlc3VsdHMuZm9yRWFjaChmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbW1hbmRSZXN1bHQgPSBCaWZyb3N0LmNvbW1hbmRzLkNvbW1hbmRSZXN1bHQuY3JlYXRlRnJvbShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmRSZXN1bHRzLnB1c2goY29tbWFuZFJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGNvbW1hbmRSZXN1bHRzKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmNvbW1hbmRzXCIsIHtcclxuICAgIEhhbmRsZUNvbW1hbmRUYXNrOiBCaWZyb3N0LnRhc2tzLkV4ZWN1dGlvblRhc2suZXh0ZW5kKGZ1bmN0aW9uIChjb21tYW5kLCBzZXJ2ZXIsIHN5c3RlbUV2ZW50cykge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGEgdGFzayB0aGF0IGNhbiBoYW5kbGUgYSBjb21tYW5kPC9zdW1tYXJ5PlxyXG4gICAgICAgIHRoaXMubmFtZSA9IGNvbW1hbmQubmFtZTtcclxuXHJcbiAgICAgICAgdGhpcy5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY29tbWFuZERlc2NyaXB0b3IgPSBCaWZyb3N0LmNvbW1hbmRzLkNvbW1hbmREZXNjcmlwdG9yLmNyZWF0ZUZyb20oY29tbWFuZCk7XHJcbiAgICAgICAgICAgIHZhciBwYXJhbWV0ZXJzID0ge1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZERlc2NyaXB0b3I6IGNvbW1hbmREZXNjcmlwdG9yXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB2YXIgdXJsID0gXCIvQmlmcm9zdC9Db21tYW5kQ29vcmRpbmF0b3IvSGFuZGxlP19jbWQ9XCIgKyBjb21tYW5kLl9nZW5lcmF0ZWRGcm9tO1xyXG5cclxuICAgICAgICAgICAgc2VydmVyLnBvc3QodXJsLCBwYXJhbWV0ZXJzKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbW1hbmRSZXN1bHQgPSBCaWZyb3N0LmNvbW1hbmRzLkNvbW1hbmRSZXN1bHQuY3JlYXRlRnJvbShyZXN1bHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjb21tYW5kUmVzdWx0LnN1Y2Nlc3MgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzeXN0ZW1FdmVudHMuY29tbWFuZHMuc3VjY2VlZGVkLnRyaWdnZXIocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3lzdGVtRXZlbnRzLmNvbW1hbmRzLmZhaWxlZC50cmlnZ2VyKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoY29tbWFuZFJlc3VsdCk7XHJcbiAgICAgICAgICAgIH0pLm9uRmFpbChmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb21tYW5kUmVzdWx0ID0gQmlmcm9zdC5jb21tYW5kcy5Db21tYW5kUmVzdWx0LmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZFJlc3VsdC5leGNlcHRpb24gPSBcIkhUVFAgNTAwXCI7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kUmVzdWx0LmV4Y2VwdGlvbk1lc3NhZ2UgPSByZXNwb25zZS5zdGF0dXNUZXh0O1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZFJlc3VsdC5kZXRhaWxzID0gcmVzcG9uc2UucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgICAgICAgICAgc3lzdGVtRXZlbnRzLmNvbW1hbmRzLmZhaWxlZC50cmlnZ2VyKGNvbW1hbmRSZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoY29tbWFuZFJlc3VsdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsImtvLmV4dGVuZGVycy5oYXNDaGFuZ2VzID0gZnVuY3Rpb24gKHRhcmdldCkge1xyXG4gICAgdGFyZ2V0Ll9pbml0aWFsVmFsdWVTZXQgPSBmYWxzZTtcclxuICAgIHRhcmdldC5oYXNDaGFuZ2VzID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcbiAgICBmdW5jdGlvbiB1cGRhdGVIYXNDaGFuZ2VzKCkge1xyXG4gICAgICAgIGlmICh0YXJnZXQuX2luaXRpYWxWYWx1ZVNldCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdGFyZ2V0Lmhhc0NoYW5nZXMoZmFsc2UpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzQXJyYXkodGFyZ2V0Ll9pbml0aWFsVmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuaGFzQ2hhbmdlcyghdGFyZ2V0Ll9pbml0aWFsVmFsdWUuc2hhbGxvd0VxdWFscyh0YXJnZXQoKSkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRhcmdldC5oYXNDaGFuZ2VzKHRhcmdldC5faW5pdGlhbFZhbHVlICE9PSB0YXJnZXQoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRhcmdldC5zdWJzY3JpYmUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHVwZGF0ZUhhc0NoYW5nZXMoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRhcmdldC5zZXRJbml0aWFsVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICB2YXIgaW5pdGlhbFZhbHVlO1xyXG4gICAgICAgIGlmIChCaWZyb3N0LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIGluaXRpYWxWYWx1ZSA9IHZhbHVlLmNsb25lKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaW5pdGlhbFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0YXJnZXQuX2luaXRpYWxWYWx1ZSA9IGluaXRpYWxWYWx1ZTtcclxuICAgICAgICB0YXJnZXQuX2luaXRpYWxWYWx1ZVNldCA9IHRydWU7XHJcbiAgICAgICAgdXBkYXRlSGFzQ2hhbmdlcygpO1xyXG4gICAgfTtcclxufTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuZXhlY3V0aW9uXCIsIHtcclxuICAgIFByb21pc2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuaWQgPSBCaWZyb3N0Lkd1aWQuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2lnbmFsbGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5lcnJvciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5oYXNGYWlsZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmZhaWxlZENhbGxiYWNrID0gbnVsbDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb25TaWduYWwoKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmNhbGxiYWNrICE9IG51bGwgJiYgdHlwZW9mIHNlbGYuY2FsbGJhY2sgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc2VsZi5zaWduYWxQYXJhbWV0ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNhbGxiYWNrKHNlbGYuc2lnbmFsUGFyYW1ldGVyLCBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jYWxsYmFjayhCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5mYWlsID0gZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmZhaWxlZENhbGxiYWNrICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuZmFpbGVkQ2FsbGJhY2soZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNlbGYuaGFzRmFpbGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgc2VsZi5lcnJvciA9IGVycm9yO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMub25GYWlsID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmhhc0ZhaWxlZCkge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soc2VsZi5lcnJvcik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmZhaWxlZENhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHNlbGY7XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2lnbmFsID0gZnVuY3Rpb24gKHBhcmFtZXRlcikge1xyXG4gICAgICAgICAgICBzZWxmLnNpZ25hbGxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHNlbGYuc2lnbmFsUGFyYW1ldGVyID0gcGFyYW1ldGVyO1xyXG4gICAgICAgICAgICBvblNpZ25hbCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY29udGludWVXaXRoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgICAgICAgICAgaWYgKHNlbGYuc2lnbmFsbGVkID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBvblNpZ25hbCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBwcm9taXNlID0gbmV3IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UoKTtcclxuICAgIHJldHVybiBwcm9taXNlO1xyXG59OyIsIlxyXG5mdW5jdGlvbiBwb2x5ZmlsbEZvckVhY2goKSB7XHJcbiAgICBpZiAodHlwZW9mIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaywgdGhpc0FyZykge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXNBcmcgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXNBcmcgPSB3aW5kb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHRoaXNbaV0sIGksIHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcG9seUZpbGxDbG9uZSgpIHtcclxuICAgIGlmICh0eXBlb2YgQXJyYXkucHJvdG90eXBlLmNsb25lICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNsaWNlKDApO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNoYWxsb3dFcXVhbHMoKSB7XHJcbiAgICBpZiAodHlwZW9mIEFycmF5LnByb3RvdHlwZS5zaGFsbG93RXF1YWxzICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUuc2hhbGxvd0VxdWFscyA9IGZ1bmN0aW9uIChvdGhlcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcyA9PT0gb3RoZXIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzID09PSBudWxsIHx8IG90aGVyID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMubGVuZ3RoICE9PSBvdGhlci5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpc1tpXSAhPT0gb3RoZXJbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5cclxuQXJyYXkucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xyXG4gICAgdGhpcy5zcGxpY2UoaW5kZXgsIDAsIGl0ZW0pO1xyXG59O1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgIHBvbHlmaWxsRm9yRWFjaCgpO1xyXG4gICAgcG9seUZpbGxDbG9uZSgpO1xyXG4gICAgc2hhbGxvd0VxdWFscygpO1xyXG59KSgpOyIsIi8vIEZyb20gdGhlIGZvbGxvd2luZyB0aHJlYWQgOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwNTY3MjgvZm9ybWF0dGluZy1hLWRhdGUtaW4tamF2YXNjcmlwdFxyXG4vLyBhdXRob3I6IG1laXp6XHJcbkRhdGUucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uIChmb3JtYXQpIHtcclxuICAgIHZhciBvID0ge1xyXG4gICAgICAgIFwiTStcIjogdGhpcy5nZXRNb250aCgpICsgMSwgLy9tb250aFxyXG4gICAgICAgIFwiZCtcIjogdGhpcy5nZXREYXRlKCksICAgIC8vZGF5XHJcbiAgICAgICAgXCJoK1wiOiB0aGlzLmdldEhvdXJzKCksICAgLy9ob3VyXHJcbiAgICAgICAgXCJtK1wiOiB0aGlzLmdldE1pbnV0ZXMoKSwgLy9taW51dGVcclxuICAgICAgICBcInMrXCI6IHRoaXMuZ2V0U2Vjb25kcygpLCAvL3NlY29uZFxyXG4gICAgICAgIFwicStcIjogTWF0aC5mbG9vcigodGhpcy5nZXRNb250aCgpICsgMykgLyAzKSwgIC8vcXVhcnRlclxyXG4gICAgICAgIFwiU1wiOiB0aGlzLmdldE1pbGxpc2Vjb25kcygpIC8vbWlsbGlzZWNvbmRcclxuICAgIH07XHJcblxyXG4gICAgaWYgKC8oeSspLy50ZXN0KGZvcm1hdCkpIHtcclxuICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZShSZWdFeHAuJDEsICh0aGlzLmdldEZ1bGxZZWFyKCkgKyBcIlwiKS5zdWJzdHIoNCAtIFJlZ0V4cC4kMS5sZW5ndGgpKTtcclxuICAgIH1cclxuICAgIGZvciAodmFyIGsgaW4gbykge1xyXG4gICAgICAgIGlmIChuZXcgUmVnRXhwKFwiKFwiICsgayArIFwiKVwiKS50ZXN0KGZvcm1hdCkpIHtcclxuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoUmVnRXhwLiQxLFxyXG4gICAgICAgICAgICAgIFJlZ0V4cC4kMS5sZW5ndGggPT09IDEgPyBvW2tdIDpcclxuICAgICAgICAgICAgICAgIChcIjAwXCIgKyBvW2tdKS5zdWJzdHIoKFwiXCIgKyBvW2tdKS5sZW5ndGgpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZm9ybWF0O1xyXG59OyIsIkhUTUxDb2xsZWN0aW9uLnByb3RvdHlwZS5mb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2g7XHJcbkhUTUxDb2xsZWN0aW9uLnByb3RvdHlwZS5sZW5ndGggPSBBcnJheS5wcm90b3R5cGUubGVuZ3RoOyIsIkhUTUxFbGVtZW50LnByb3RvdHlwZS5rbm93bkVsZW1lbnRUeXBlcyA9IFtcclxuICAgIFwiYVwiLFxyXG4gICAgXCJhYmJyXCIsXHJcbiAgICBcImFjcm9ueW1cIixcclxuICAgIFwiYWRkcmVzc1wiLFxyXG4gICAgXCJhcHBsZXRcIixcclxuICAgIFwiYXJlYVwiLFxyXG4gICAgXCJhcnRpY2xlXCIsXHJcbiAgICBcImFzaWRlXCIsXHJcbiAgICBcImF1ZGlvXCIsXHJcbiAgICBcImJcIixcclxuICAgIFwiYmFzZVwiLFxyXG4gICAgXCJiYXNlZm9udFwiLFxyXG4gICAgXCJiZGlcIixcclxuICAgIFwiYmRvXCIsXHJcbiAgICBcImJnc291bmRcIixcclxuICAgIFwiYmlnXCIsXHJcbiAgICBcImJsaW5rXCIsXHJcbiAgICBcImJsb2NrcXVvdGVcIixcclxuICAgIFwiYm9keVwiLFxyXG4gICAgXCJiclwiLFxyXG4gICAgXCJidXR0b25cIixcclxuICAgIFwiY2FudmFzXCIsXHJcbiAgICBcImNhcHRpb25cIixcclxuICAgIFwiY2VudGVyXCIsXHJcbiAgICBcImNpdGVcIixcclxuICAgIFwiY29sXCIsXHJcbiAgICBcImNvbGdyb3VwXCIsXHJcbiAgICBcImNvbnRlbnRcIixcclxuICAgIFwiY29kZVwiLFxyXG4gICAgXCJkYXRhXCIsXHJcbiAgICBcImRhdGFsaXN0XCIsXHJcbiAgICBcImRkXCIsXHJcbiAgICBcImRlY29yYXRvclwiLFxyXG4gICAgXCJkZWxcIixcclxuICAgIFwiZGV0YWlsc1wiLFxyXG4gICAgXCJkZm5cIixcclxuICAgIFwiZGlyXCIsXHJcbiAgICBcImRpdlwiLFxyXG4gICAgXCJkbFwiLFxyXG4gICAgXCJkdFwiLFxyXG4gICAgXCJlbVwiLFxyXG4gICAgXCJlbWJlZFwiLFxyXG4gICAgXCJmaWVsZHNldFwiLFxyXG4gICAgXCJmaWdjYXB0aW9uXCIsXHJcbiAgICBcImZpZ3VyZVwiLFxyXG4gICAgXCJmb250XCIsXHJcbiAgICBcImZvb3RlclwiLFxyXG4gICAgXCJmb3JtXCIsXHJcbiAgICBcImZyYW1lXCIsXHJcbiAgICBcImZyYW1lc2V0XCIsXHJcbiAgICBcImgxXCIsXHJcbiAgICBcImgyXCIsXHJcbiAgICBcImgzXCIsXHJcbiAgICBcImg0XCIsXHJcbiAgICBcImg1XCIsXHJcbiAgICBcImg2XCIsXHJcbiAgICBcImhlYWRcIixcclxuICAgIFwiaGVhZGVyXCIsXHJcbiAgICBcImhncm91cFwiLFxyXG4gICAgXCJoclwiLFxyXG4gICAgXCJodG1sXCIsXHJcbiAgICBcImlcIixcclxuICAgIFwiaWZyYW1lXCIsXHJcbiAgICBcImltZ1wiLFxyXG4gICAgXCJpbnB1dFwiLFxyXG4gICAgXCJpbnNcIixcclxuICAgIFwiaXNpbmRleFwiLFxyXG4gICAgXCJrYmRcIixcclxuICAgIFwia2V5Z2VuXCIsXHJcbiAgICBcImxhYmVsXCIsXHJcbiAgICBcImxlZ2VuZFwiLFxyXG4gICAgXCJsaVwiLFxyXG4gICAgXCJsaW5rXCIsXHJcbiAgICBcImxpc3RpbmdcIixcclxuICAgIFwibWFpblwiLFxyXG4gICAgXCJtYXBcIixcclxuICAgIFwibWFya1wiLFxyXG4gICAgXCJtYXJxdWVcIixcclxuICAgIFwibWVudVwiLFxyXG4gICAgXCJtZW51aXRlbVwiLFxyXG4gICAgXCJtZXRhXCIsXHJcbiAgICBcIm1ldGVyXCIsXHJcbiAgICBcIm5hdlwiLFxyXG4gICAgXCJub2JyXCIsXHJcbiAgICBcIm5vZnJhbWVzXCIsXHJcbiAgICBcIm5vc2NyaXB0XCIsXHJcbiAgICBcIm9iamVjdFwiLFxyXG4gICAgXCJvbFwiLFxyXG4gICAgXCJvcHRncm91cFwiLFxyXG4gICAgXCJvcHRpb25cIixcclxuICAgIFwib3V0cHV0XCIsXHJcbiAgICBcInBcIixcclxuICAgIFwicGFyYW1cIixcclxuICAgIFwicGxhaW50ZXh0XCIsXHJcbiAgICBcInByZVwiLFxyXG4gICAgXCJwcm9ncmVzc1wiLFxyXG4gICAgXCJxXCIsXHJcbiAgICBcInJwXCIsXHJcbiAgICBcInJ0XCIsXHJcbiAgICBcInJ1YnlcIixcclxuICAgIFwic1wiLFxyXG4gICAgXCJzYW1wXCIsXHJcbiAgICBcInNjcmlwdFwiLFxyXG4gICAgXCJzZWN0aW9uXCIsXHJcbiAgICBcInNlbGVjdFwiLFxyXG4gICAgXCJzaGFkb3dcIixcclxuICAgIFwic21hbGxcIixcclxuICAgIFwic291cmNlXCIsXHJcbiAgICBcInNwYWNlclwiLFxyXG4gICAgXCJzcGFuXCIsXHJcbiAgICBcInN0cmlrZVwiLFxyXG4gICAgXCJzdHJvbmdcIixcclxuICAgIFwic3R5bGVcIixcclxuICAgIFwic3ViXCIsXHJcbiAgICBcInN1bW1hcnlcIixcclxuICAgIFwic3VwXCIsXHJcbiAgICBcInRhYmxlXCIsXHJcbiAgICBcInRib2R5XCIsXHJcbiAgICBcInRkXCIsXHJcbiAgICBcInRlbXBsYXRlXCIsXHJcbiAgICBcInRleHRhcmVhXCIsXHJcbiAgICBcInRmb290XCIsXHJcbiAgICBcInRoXCIsXHJcbiAgICBcInRoZWFkXCIsXHJcbiAgICBcInRpbWVcIixcclxuICAgIFwidGl0bGVcIixcclxuICAgIFwidHJcIixcclxuICAgIFwidHJhY2tcIixcclxuICAgIFwidHRcIixcclxuICAgIFwidVwiLFxyXG4gICAgXCJ1bFwiLFxyXG4gICAgXCJ2YXJcIixcclxuICAgIFwidmlkZW9cIixcclxuICAgIFwid2JyXCIsXHJcbiAgICBcInhtcFwiXHJcbl07XHJcbkhUTUxFbGVtZW50LnByb3RvdHlwZS5pc0tub3duVHlwZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChcIkhUTUxVbmtub3duRWxlbWVudFwiKSkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkuaW5kZXhPZihcIkhUTUxVbmtub3duRWxlbWVudFwiKSA8IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaXNLbm93biA9IHRoaXMuY29uc3RydWN0b3IgIT09IEhUTUxFbGVtZW50O1xyXG4gICAgaWYgKGlzS25vd24gPT09IGZhbHNlKSB7XHJcbiAgICAgICAgdmFyIHRhZ05hbWUgPSB0aGlzLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBpc0tub3duID0gdGhpcy5rbm93bkVsZW1lbnRUeXBlcy5zb21lKGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGlmICh0YWdOYW1lID09PSB0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGlzS25vd247XHJcbn07XHJcbkhUTUxFbGVtZW50LnByb3RvdHlwZS5nZXRDaGlsZEVsZW1lbnRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGNoaWxkcmVuID0gW107XHJcbiAgICB0aGlzLmNoaWxkTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2gobm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbn07IiwiTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2ggPSBBcnJheS5wcm90b3R5cGUuZm9yRWFjaDtcclxuTm9kZUxpc3QucHJvdG90eXBlLmxlbmd0aCA9IEFycmF5LnByb3RvdHlwZS5sZW5ndGg7IiwiaWYgKHR5cGVvZiBTdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGggIT09ICdmdW5jdGlvbicpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aCA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgICAgICByZXR1cm4gc3RyLmxlbmd0aCA+IDAgJiYgdGhpcy5zdWJzdHJpbmcoMCwgc3RyLmxlbmd0aCkgPT09IHN0cjtcclxuICAgIH07XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aCAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aCA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgICAgICByZXR1cm4gc3RyLmxlbmd0aCA+IDAgJiYgdGhpcy5zdWJzdHJpbmcodGhpcy5sZW5ndGggLSBzdHIubGVuZ3RoLCB0aGlzLmxlbmd0aCkgPT09IHN0cjtcclxuICAgIH07XHJcbn1cclxuXHJcblN0cmluZy5wcm90b3R5cGUucmVwbGFjZUFsbCA9IGZ1bmN0aW9uICh0b1JlcGxhY2UsIHJlcGxhY2VtZW50KSB7XHJcbiAgICB2YXIgcmVzdWx0ID0gdGhpcy5zcGxpdCh0b1JlcGxhY2UpLmpvaW4ocmVwbGFjZW1lbnQpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcblN0cmluZy5wcm90b3R5cGUudG9DYW1lbENhc2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcmVzdWx0ID0gdGhpcy5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIHRoaXMuc3Vic3RyaW5nKDEpO1xyXG4gICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2VBbGwoXCItXCIsIFwiXCIpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcblN0cmluZy5wcm90b3R5cGUudG9QYXNjYWxDYXNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHJlc3VsdCA9IHRoaXMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0aGlzLnN1YnN0cmluZygxKTtcclxuICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlQWxsKFwiLVwiLCBcIlwiKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG5TdHJpbmcucHJvdG90eXBlLmhhc2hDb2RlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGNoYXJDb2RlLCBoYXNoID0gMDtcclxuICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHJldHVybiBoYXNoO1xyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY2hhckNvZGUgPSB0aGlzLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgaGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2hhckNvZGU7XHJcbiAgICAgICAgaGFzaCA9IGhhc2ggJiBoYXNoO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGhhc2g7XHJcbn07IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lmh1YnNcIiwge1xyXG4gICAgSHViOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uIChodWJDb25uZWN0aW9uKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgcHJveHkgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX25hbWUgPSBcIlwiO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBtYWtlQ2xpZW50UHJveHlGdW5jdGlvbihjYWxsYmFjaykge1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY2xpZW50ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHZhciBjbGllbnQgPSB7fTtcclxuICAgICAgICAgICAgY2FsbGJhY2soY2xpZW50KTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGNsaWVudCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gY2xpZW50W3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc0Z1bmN0aW9uKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHByb3h5Lm9uKHByb3BlcnR5LCBtYWtlQ2xpZW50UHJveHlGdW5jdGlvbih2YWx1ZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXJ2ZXIgPSB7fTtcclxuXHJcbiAgICAgICAgdmFyIGRlbGF5ZWRTZXJ2ZXJJbnZvY2F0aW9ucyA9IFtdO1xyXG5cclxuICAgICAgICBodWJDb25uZWN0aW9uLmNvbm5lY3RlZC5zdWJzY3JpYmUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkZWxheWVkU2VydmVySW52b2NhdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoaW52b2NhdGlvbkZ1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBpbnZvY2F0aW9uRnVuY3Rpb24oKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG1ha2VJbnZvY2F0aW9uRnVuY3Rpb24ocHJvbWlzZSwgbWV0aG9kLCBhcmdzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJndW1lbnRzQXNBcnJheSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgYXJnID0gMDsgYXJnIDwgYXJncy5sZW5ndGg7IGFyZysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzQXNBcnJheS5wdXNoKGFyZ3NbYXJnXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGFsbEFyZ3VtZW50cyA9IFttZXRob2RdLmNvbmNhdChhcmd1bWVudHNBc0FycmF5KTtcclxuICAgICAgICAgICAgICAgIHByb3h5Lmludm9rZS5hcHBseShwcm94eSwgYWxsQXJndW1lbnRzKS5kb25lKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmludm9rZVNlcnZlck1ldGhvZCA9IGZ1bmN0aW9uIChtZXRob2QsIGFyZ3MpIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGludm9jYXRpb25GdW5jdGlvbiA9IG1ha2VJbnZvY2F0aW9uRnVuY3Rpb24ocHJvbWlzZSwgbWV0aG9kLCBhcmdzKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChodWJDb25uZWN0aW9uLmlzQ29ubmVjdGVkID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgZGVsYXllZFNlcnZlckludm9jYXRpb25zLnB1c2goaW52b2NhdGlvbkZ1bmN0aW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGludm9jYXRpb25GdW5jdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9uQ3JlYXRlZCA9IGZ1bmN0aW9uIChsYXN0RGVzY2VuZGFudCkge1xyXG4gICAgICAgICAgICBwcm94eSA9IGh1YkNvbm5lY3Rpb24uY3JlYXRlUHJveHkobGFzdERlc2NlbmRhbnQuX25hbWUpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lmh1YnNcIiwge1xyXG4gICAgaHViQ29ubmVjdGlvbjogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgaHViID0gJC5odWJDb25uZWN0aW9uKFwiL3NpZ25hbHJcIiwgeyB1c2VEZWZhdWx0UGF0aDogZmFsc2UgfSk7XHJcbiAgICAgICAgLyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xyXG4gICAgICAgICQuc2lnbmFsUi5odWIgPSBodWI7XHJcbiAgICAgICAgLyoganNoaW50IGlnbm9yZTplbmQgKi9cclxuXHJcbiAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGVkID0gQmlmcm9zdC5FdmVudC5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGVQcm94eSA9IGZ1bmN0aW9uIChodWJOYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm94eSA9IGh1Yi5jcmVhdGVIdWJQcm94eShodWJOYW1lKTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb3h5O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vJC5jb25uZWN0aW9uLmh1Yi5sb2dnaW5nID0gdHJ1ZTtcclxuICAgICAgICAkLmNvbm5lY3Rpb24uaHViLnN0YXJ0KCkuZG9uZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSHViIGNvbm5lY3Rpb24gdXAgYW5kIHJ1bm5pbmdcIik7XHJcbiAgICAgICAgICAgIHNlbGYuaXNDb25uZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBzZWxmLmNvbm5lY3RlZC50cmlnZ2VyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy5odWJDb25uZWN0aW9uID0gQmlmcm9zdC5odWJzLmh1YkNvbm5lY3Rpb247IiwiQmlmcm9zdC5kZXBlbmRlbmN5UmVzb2x2ZXJzLmh1YiA9IHtcclxuICAgIGNhblJlc29sdmU6IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGh1YnMgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5hbWUgaW4gaHVicztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICByZXNvbHZlOiBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIGh1YnNbbmFtZV0uY3JlYXRlKCk7XHJcbiAgICB9XHJcbn07IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmludGVyYWN0aW9uXCIsIHtcclxuICAgIEFjdGlvbjogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5wZXJmb3JtID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW50ZXJhY3Rpb25cIiwge1xyXG4gICAgQ29tbWFuZE9wZXJhdGlvbjogQmlmcm9zdC5pbnRlcmFjdGlvbi5PcGVyYXRpb24uZXh0ZW5kKGZ1bmN0aW9uIChjb21tYW5kU2VjdXJpdHlTZXJ2aWNlKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYW4gb3BlcmF0aW9uIHRoYXQgcmVzdWx0IGluIGEgY29tbWFuZDwvc3VtbWFyeT5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImNvbW1hbmRUeXBlXCIgdHlwZT1cIkJpZnJvc3QuVHlwZVwiPlR5cGUgb2YgY29tbWFuZCB0byBjcmVhdGU8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuY29tbWFuZFR5cGUgPSBrby5vYnNlcnZhYmxlKCk7XHJcblxyXG4gICAgICAgIC8vIDxmaWVsZCBuYW1lPVwiaXNBdXRob3JpemFlZFwiIHR5cGU9XCJvYnNlcnZhYmxlXCI+SG9sZHMgYSBib29sZWFuOyB0cnVlIGlmIGF1dGhvcml6ZWQgLyBmYWxzZSBpZiBub3Q8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuaXNBdXRob3JpemVkID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcblxyXG4gICAgICAgIC8vIDxmaWVsZCBuYW1lPVwiY29tbWFuZENyZWF0ZWRcIiB0eXBlPVwiQmlmcm9zdC5FdmVudFwiPkV2ZW50IHRoYXQgZ2V0cyB0cmlnZ2VyZWQgd2hlbiBjb21tYW5kIGlzIGNyZWF0ZWQ8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuY29tbWFuZENyZWF0ZWQgPSBCaWZyb3N0LkV2ZW50LmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmNhblBlcmZvcm0ud2hlbih0aGlzLmlzQXV0aG9yaXplZCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tbWFuZFR5cGUuc3Vic2NyaWJlKGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNvbW1hbmRTZWN1cml0eVNlcnZpY2UuZ2V0Q29udGV4dEZvclR5cGUodHlwZSkuY29udGludWVXaXRoKGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoY29udGV4dCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmlzQXV0aG9yaXplZChjb250ZXh0LmlzQXV0aG9yaXplZCgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlQ29tbWFuZE9mVHlwZSA9IGZ1bmN0aW9uIChjb21tYW5kVHlwZSkge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+Q3JlYXRlIGFuIGluc3RhbmNlIG9mIGEgZ2l2ZW4gY29tbWFuZCB0eXBlPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBjb21tYW5kVHlwZS5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgcmVnaW9uOiBzZWxmLnJlZ2lvblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuY29tbWFuZENyZWF0ZWQudHJpZ2dlcihpbnN0YW5jZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5pbnRlcmFjdGlvblwiLCB7XHJcbiAgICBFdmVudFRyaWdnZXI6IEJpZnJvc3QuaW50ZXJhY3Rpb24uVHJpZ2dlci5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5ldmVudE5hbWUgPSBudWxsO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lmRXZlbnROYW1lSXNOb3RTZXQodHJpZ2dlcikge1xyXG4gICAgICAgICAgICBpZiAoIXRyaWdnZXIuZXZlbnROYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkV2ZW50TmFtZSBpcyBub3Qgc2V0IGZvciB0cmlnZ2VyXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRocm93SWZFdmVudE5hbWVJc05vdFNldCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhY3R1YWxFdmVudE5hbWUgPSBcIm9uXCIgKyBzZWxmLmV2ZW50TmFtZTtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnRbYWN0dWFsRXZlbnROYW1lXSA9PSBudWxsIHx8IHR5cGVvZiBlbGVtZW50W2FjdHVhbEV2ZW50TmFtZV0gPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9yaWdpbmFsRXZlbnRIYW5kbGVyID0gZWxlbWVudFthY3R1YWxFdmVudE5hbWVdO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudFthY3R1YWxFdmVudE5hbWVdID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3JpZ2luYWxFdmVudEhhbmRsZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudEhhbmRsZXIoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnNpZ25hbCgpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmludGVyYWN0aW9uXCIsIHtcclxuICAgIE9wZXJhdGlvbjogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAocmVnaW9uLCBjb250ZXh0KSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PkRlZmluZXMgYW4gb3BlcmF0aW9uIHRoYXQgYmUgcGVyZm9ybWVkPC9zdW1tYXJ5PlxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY2FuUGVyZm9ybU9ic2VydmFibGVzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgdmFyIGludGVybmFsQ2FuUGVyZm9ybSA9IGtvLm9ic2VydmFibGUodHJ1ZSk7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImNvbnRleHRcIiB0eXBlPVwiQmlmcm9zdC5pbnRlcmFjdGlvbi5PcGVyYXRpb25cIj5Db250ZXh0IGluIHdoaWNoIHRoZSBvcGVyYXRpb24gZXhpc3RzIGluPC9maWVsZD5cclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJpZGVudGlmaWVyXCIgdHlwZT1cIkJpZnJvc3QuR3VpZFwiPlVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgb3BlcmF0aW9uIGluc3RhbmNlPGZpZWxkPlxyXG4gICAgICAgIHRoaXMuaWRlbnRpZmllciA9IEJpZnJvc3QuR3VpZC5lbXB0eTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwicmVnaW9uXCIgdHlwZT1cIkJpZnJvc3Qudmlld3MuUmVnaW9uXCI+UmVnaW9uIHRoYXQgdGhlIG9wZXJhdGlvbiB3YXMgY3JlYXRlZCBpbjwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5yZWdpb24gPSByZWdpb247XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImNhblBlcmZvcm1cIiB0eXBlPVwib2JzZXJ2YWJsZVwiPlNldCB0byB0cnVlIGlmIHRoZSBvcGVyYXRpb24gY2FuIGJlIHBlcmZvcm1lZCwgZmFsc2UgaWYgbm90PC9maWVsZD5cclxuICAgICAgICB0aGlzLmNhblBlcmZvcm0gPSBrby5jb21wdXRlZCh7XHJcbiAgICAgICAgICAgIHJlYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjYW5QZXJmb3JtT2JzZXJ2YWJsZXMoKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY2FuUGVyZm9ybSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBjYW5QZXJmb3JtT2JzZXJ2YWJsZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChvYnNlcnZhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9ic2VydmFibGUoKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuUGVyZm9ybSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhblBlcmZvcm07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHdyaXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGludGVybmFsQ2FuUGVyZm9ybSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jYW5QZXJmb3JtLndoZW4gPSBmdW5jdGlvbiAob2JzZXJ2YWJsZSkge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+Q2hhaW5hYmxlIGNsYXVzZXM8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cIm9ic2VydmFibGVcIiB0eXBlPVwib2JzZXJ2YWJsZVwiPlRoZSBvYnNlcnZhYmxlIHRvIHVzZSBmb3IgZGVjaWRpbmcgd2V0aGVyIG9yIG5vdCB0aGUgb3BlcmF0aW9uIGNhbiBwZXJmb3JtPC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxyZXR1cm5zPlRoZSBjYW5QZXJmb3JtIHRoYXQgY2FuIGJlIGZ1cnRoZXIgY2hhaW5lZDwvcmV0dXJucz5cclxuICAgICAgICAgICAgY2FuUGVyZm9ybU9ic2VydmFibGVzLnB1c2gob2JzZXJ2YWJsZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmNhblBlcmZvcm07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jYW5QZXJmb3JtLndoZW4oaW50ZXJuYWxDYW5QZXJmb3JtKTtcclxuXHJcbiAgICAgICAgdGhpcy5wZXJmb3JtID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+RnVuY3Rpb24gdGhhdCBnZXRzIGNhbGxlZCB3aGVuIGFuIG9wZXJhdGlvbiBnZXRzIHBlcmZvcm1lZDwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxyZXR1cm5zPlN0YXRlIGNoYW5nZSwgaWYgYW55IC0gdHlwaWNhbGx5IGhlbHBmdWwgd2hlbiB1bmRvaW5nPC9yZXR1cm5zPlxyXG4gICAgICAgICAgICByZXR1cm4ge307XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy51bmRvID0gZnVuY3Rpb24gKHN0YXRlKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5GdW5jdGlvbiB0aGF0IGdldHMgY2FsbGVkIHdoZW4gYW4gb3BlcmF0aW9uIGdldHMgdW5kb2VkPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJzdGF0ZVwiIHR5cGU9XCJvYmplY3RcIj5TdGF0ZSBnZW5lcmF0ZWQgd2hlbiB0aGUgb3BlcmF0aW9uIHdhcyBwZXJmb3JtZWQ8L3BhcmFtPlxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW50ZXJhY3Rpb25cIiwge1xyXG4gICAgT3BlcmF0aW9uQ29udGV4dDogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PkRlZmluZXMgdGhlIGNvbnRleHQgaW4gd2hpY2ggYW4gb3BlcmF0aW9uIGlzIGJlaW5nIHBlcmZvcm1lZCBvciB1bmRvZWQgd2l0aGluPC9zdW1tYXJ5PlxyXG5cclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5pbnRlcmFjdGlvblwiLCB7XHJcbiAgICBPcGVyYXRpb25FbnRyeTogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAob3BlcmF0aW9uLCBzdGF0ZSkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGFuIGVudHJ5IGZvciBhbiBvcGVyYXRpb24gaW4gYSBzcGVjaWZpYyBjb250ZXh0IHdpdGggcmVzdWx0aW5nIHN0YXRlPC9zdW1tYXJ5PlxyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJvcGVyYXRpb25cIiB0eXBlPVwiQmlmcm9zdC5pbnRlcmFjdGlvbi5PcGVyYXRpb25cIj5PcGVyYXRpb24gdGhhdCB3YXMgcGVyZm9ybWVkPC9maWVsZD5cclxuICAgICAgICB0aGlzLm9wZXJhdGlvbiA9IG9wZXJhdGlvbjtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwic3RhdGVcIiB0eXBlPVwib2JqZWN0XCI+U3RhdGUgdGhhdCBvcGVyYXRpb24gZ2VuZXJhdGVkPC9maWVsZD5cclxuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW50ZXJhY3Rpb25cIiwge1xyXG4gICAgb3BlcmF0aW9uRW50cnlGYWN0b3J5OiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSBmYWN0b3J5IHRoYXQgY2FuIGNyZWF0ZSBPcGVyYXRpb25FbnRyaWVzPC9zdW1tYXJ5PlxyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uIChvcGVyYXRpb24sIHN0YXRlKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtYXJ5PkNyZWF0ZSBhbiBpbnN0YW5jZSBvZiBhIE9wZXJhdGlvbkVudHJ5PC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJjb250ZXh0XCIgdHlwZT1cIkJpZnJvc3QuaW50ZXJhY3Rpb24uT3BlcmF0aW9uQ29udGV4dFwiPkNvbnRleHQgdGhlIG9wZXJhdGlvbiB3YXMgcGVyZm9ybWVkIGluPC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwib3BlcmF0aW9uXCIgdHlwZT1cIkJpZnJvc3QuaW50ZXJhY3Rpb24uT3BlcmF0aW9uXCI+T3BlcmF0aW9uIHRoYXQgd2FzIHBlcmZvcm1lZDwvcGFyYW0+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cInN0YXRlXCIgdHlwZT1cIm9iamVjdFwiPlN0YXRlIHRoYXQgb3BlcmF0aW9uIGdlbmVyYXRlZDwvcGFyYW0+XHJcbiAgICAgICAgICAgIC8vLyA8cmV0dXJucz5BbiBPcGVyYXRpb25FbnRyeTwvcmV0dXJucz5cclxuXHJcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IEJpZnJvc3QuaW50ZXJhY3Rpb24uT3BlcmF0aW9uRW50cnkuY3JlYXRlKHtcclxuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogb3BlcmF0aW9uLFxyXG4gICAgICAgICAgICAgICAgc3RhdGU6IHN0YXRlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5pbnRlcmFjdGlvblwiLCB7XHJcbiAgICBPcGVyYXRpb25zOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uIChvcGVyYXRpb25FbnRyeUZhY3RvcnkpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyBhIHN0YWNrIG9mIG9wZXJhdGlvbnMgYW5kIHRoZSBhYmlsaXR5IHRvIHBlcmZvcm0gYW5kIHB1dCBvcGVyYXRpb25zIG9uIHRoZSBzdGFjazwvc3VtbWFyeT5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImFsbFwiIHR5cGU9XCJvYnNlcnZhYmxlQXJyYXlcIj5Ib2xkcyBhbGwgb3BlcmF0aW9uczwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5hbGwgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwic3RhdGVmdWxcIiB0eXBlPVwib2JzZXJ2YWJsZUFycmF5XCI+SG9sZHMgYWxsIG9wZXJhdGlvbnMgdGhhdCBhcmUgc3RhdGVmdWwgLSBtZWFuaW5nIHRoYXQgdGhleSBwcm9kdWNlIHN0YXRlIGZyb20gYmVpbmcgcGVyZm9ybWVkPC9maWVsZD5cclxuICAgICAgICB0aGlzLnN0YXRlZnVsID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgZW50cmllcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5hbGwoKS5mb3JFYWNoKGZ1bmN0aW9uIChlbnRyeSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmFyZUVxdWFsKGVudHJ5LnN0YXRlLCB7fSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbnRyaWVzLnB1c2goZW50cnkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBlbnRyaWVzO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmdldEJ5SWRlbnRpZmllciA9IGZ1bmN0aW9uIChpZGVudGlmaWVyKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5HZXQgYW4gb3BlcmF0aW9uIGJ5IGl0cyBpZGVudGlmaWVyPC9pZGVudGlmaWVyPlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJpZGVudGlmaWVyXCIgdHlwZT1cIkJpZnJvc3QuR3VpZFwiPklkZW50aWZpZXIgb2YgdGhlIG9wZXJhdGlvbiB0byBnZXQ8cGFyYW0+XHJcbiAgICAgICAgICAgIC8vLyA8cmV0dXJucz5BbiBpbnN0YW5jZSBvZiB0aGUgb3BlcmF0aW9uIGlmIGZvdW5kLCBudWxsIGlmIG5vdCBmb3VuZDwvcmV0dXJucz5cclxuXHJcbiAgICAgICAgICAgIHZhciBmb3VuZCA9IG51bGw7XHJcbiAgICAgICAgICAgIHNlbGYuYWxsKCkuZm9yRWFjaChmdW5jdGlvbiAob3BlcmF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9uLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IG9wZXJhdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZvdW5kO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucGVyZm9ybSA9IGZ1bmN0aW9uIChvcGVyYXRpb24pIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PlBlcmZvcm0gYW4gb3BlcmF0aW9uIGluIGEgZ2l2ZW4gY29udGV4dDwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiY29udGV4dFwiIHR5cGU9XCJCaWZyb3N0LmludGVyYWN0aW9uLk9wZXJhdGlvbkNvbnRleHRcIj5Db250ZXh0IGluIHdoaWNoIHRoZSBvcGVyYXRpb24gaXMgYmVpbmcgcGVyZm9ybWVkIGluPC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwib3BlcmF0aW9uXCIgdHlwZT1cIkJpZnJvc3QuaW50ZXJhY3Rpb24uT3BlcmF0aW9uXCI+T3BlcmF0aW9uIHRvIHBlcmZvcm08L3BhcmFtPlxyXG5cclxuICAgICAgICAgICAgaWYgKG9wZXJhdGlvbi5jYW5QZXJmb3JtKCkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IG9wZXJhdGlvbi5wZXJmb3JtKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZW50cnkgPSBvcGVyYXRpb25FbnRyeUZhY3RvcnkuY3JlYXRlKG9wZXJhdGlvbiwgc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5hbGwucHVzaChlbnRyeSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnVuZG8gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5VbmRvIHRoZSBsYXN0IG9wZXJhdGlvbiBvbiB0aGUgc3RhY2sgYW5kIHJlbW92ZSBpdCBhcyBhbiBvcGVyYXRpb248L3N1bW1hcnk+XHJcblxyXG4gICAgICAgICAgICB0aHJvdyBcIk5vdCBpbXBsZW1lbnRlZFwiO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW50ZXJhY3Rpb25cIiwge1xyXG4gICAgb3BlcmF0aW9uc0ZhY3Rvcnk6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG9wZXJhdGlvbnMgPSBCaWZyb3N0LmludGVyYWN0aW9uLk9wZXJhdGlvbnMuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBvcGVyYXRpb25zO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy5vcGVyYXRpb25zRmFjdG9yeSA9IEJpZnJvc3QuaW50ZXJhY3Rpb24ub3BlcmF0aW9uc0ZhY3Rvcnk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmludGVyYWN0aW9uXCIsIHtcclxuICAgIFRyaWdnZXI6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5hY3Rpb25zID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQWN0aW9uID0gZnVuY3Rpb24gKGFjdGlvbikge1xyXG4gICAgICAgICAgICBzZWxmLmFjdGlvbnMucHVzaChhY3Rpb24pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zaWduYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYuYWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIGFjdGlvbi5wZXJmb3JtKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW50ZXJhY3Rpb25cIiwge1xyXG4gICAgVmlzdWFsU3RhdGU6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGEgdmlzdWFsIHN0YXRlIG9mIGEgY29udHJvbCBvciBlbGVtZW50PC9zdW1tYXJ5PlxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwibmFtZVwiIHR5cGU9XCJTdHJpbmdcIj5OYW1lIG9mIHRoZSB2aXN1YWwgc3RhdGU8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMubmFtZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImFjdGlvbnNcIiB0eXBlPVwiQXJyYXlcIiBlbGVtZW50VHlwZT1cIkJpZnJvc3QuaW50ZXJhY3Rpb24uVmlzdWFsU3RhdGVUcmFuc2l0aW9uQWN0aW9uXCI+VHJhbnNpdGlvbiBhY3Rpb25zIHRoYXQgd2lsbCBleGVjdXRlIHdoZW4gdHJhbnNpdGlvbmluZzwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQWN0aW9uID0gZnVuY3Rpb24gKGFjdGlvbikge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+QWRkIGFjdGlvbiB0byB0aGUgdmlzdWFsIHN0YXRlPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJhY3Rpb25cIiB0eXBlPVwiQmlmcm9zdC5pbnRlcmFjdGlvbi5WaXN1YWxTdGF0ZUFjdGlvblwiPlxyXG4gICAgICAgICAgICBzZWxmLmFjdGlvbnMucHVzaChhY3Rpb24pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZW50ZXIgPSBmdW5jdGlvbiAobmFtaW5nUm9vdCwgZHVyYXRpb24pIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkVudGVyIHRoZSBzdGF0ZSB3aXRoIGEgZ2l2ZW4gZHVyYXRpb248L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cImR1cmF0aW9uXCIgdHlwZT1cIkJpZnJvc3QuVGltZVNwYW5cIj5UaW1lIHRvIHNwZW5kIGVudGVyaW5nIHRoZSBzdGF0ZTwvcGFyYW0+XHJcbiAgICAgICAgICAgIHNlbGYuYWN0aW9ucygpLmZvckVhY2goZnVuY3Rpb24gKGFjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uLm9uRW50ZXIobmFtaW5nUm9vdCwgZHVyYXRpb24pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmV4aXQgPSBmdW5jdGlvbiAobmFtaW5nUm9vdCwgZHVyYXRpb24pIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkV4aXQgdGhlIHN0YXRlIHdpdGggYSBnaXZlbiBkdXJhdGlvbjwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiZHVyYXRpb25cIiB0eXBlPVwiQmlmcm9zdC5UaW1lU3BhblwiPlRpbWUgdG8gc3BlbmQgZW50ZXJpbmcgdGhlIHN0YXRlPC9wYXJhbT5cclxuICAgICAgICAgICAgc2VsZi5hY3Rpb25zKCkuZm9yRWFjaChmdW5jdGlvbiAoYWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBhY3Rpb24ub25FeGl0KG5hbWluZ1Jvb3QsIGR1cmF0aW9uKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5pbnRlcmFjdGlvblwiLCB7XHJcbiAgICBWaXN1YWxTdGF0ZUFjdGlvbjogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChuYW1pbmdSb290KSB7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMub25FbnRlciA9IGZ1bmN0aW9uIChuYW1pbmdSb290LCBkdXJhdGlvbikge1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9uRXhpdCA9IGZ1bmN0aW9uIChuYW1pbmdSb290LCBkdXJhdGlvbikge1xyXG5cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmludGVyYWN0aW9uXCIsIHtcclxuICAgIFZpc3VhbFN0YXRlR3JvdXA6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKGRpc3BhdGNoZXIpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyBhIGdyb3VwIHRoYXQgaG9sZHMgdmlzdWFsIHN0YXRlczwvc3VtbWFyeT5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuZGVmYXVsdER1cmF0aW9uID0gQmlmcm9zdC5UaW1lU3Bhbi56ZXJvKCk7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImN1cnJlbnRTdGF0ZVwiIHR5cGU9XCJCaWZyb3N0LmludGVyYWN0aW9uLlZpc3VhbFN0YXRlXCI+SG9sZHMgdGhlIGN1cnJlbnQgc3RhdGUsIHRoaXMgaXMgYW4gb2JzZXJ2YWJsZTwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBrby5vYnNlcnZhYmxlKHtuYW1lOiBcIm51bGwgc3RhdGVcIiwgZW50ZXI6IGZ1bmN0aW9uICgpIHt9LCBleGl0OiBmdW5jdGlvbiAoKSB7fX0pO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJzdGF0ZXNcIiB0eXBlPVwiQXJyYXlcIiBlbGVtZW50VHlwZT1cIkJpZnJvc3QuaW50ZXJhY3Rpb24uVmlzdWFsU3RhdGVcIj5Ib2xkcyBhbiBvYnNlcnZhYmxlIGFycmF5IG9mIHZpc3VhbCBzdGF0ZXM8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuc3RhdGVzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cInRyYW5zaXRpb25zXCIgdHlwZT1cIkFycmF5XCIgZWxlbWVudFR5cGU9XCJCaWZyb3N0LmludGVyYWN0aW9uLlZpc3VhbFN0YXRlVHJhbnNpdGlvblwiPkhvbGRzIGFuIG9ic2VydmFibGUgYXJyYXkgb2YgdmlzdWFsIHN0YXRlIHRyYW5zaXRpb25zPC9maWVsZD5cclxuICAgICAgICB0aGlzLnRyYW5zaXRpb25zID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkU3RhdGUgPSBmdW5jdGlvbiAoc3RhdGUpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkFkZCBhIHN0YXRlIHRvIHRoZSBncm91cDwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwic3RhdGVcIiB0eXBlPVwiQmlmcm9zdC5pbnRlcmFjdGlvbi5WaXN1YWxTdGF0ZVwiPlN0YXRlIHRvIGFkZDwvcGFyYW0+XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmhhc1N0YXRlKHN0YXRlLm5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlZpc3VhbFN0YXRlIHdpdGggbmFtZSBvZiAnXCIgKyBzdGF0ZS5uYW1lICsgXCInIGFscmVhZHkgZXhpc3RzXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2VsZi5zdGF0ZXMucHVzaChzdGF0ZSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRUcmFuc2l0aW9uID0gZnVuY3Rpb24gKHRyYW5zaXRpb24pIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkFkZCB0cmFuc2l0aW9uIHRvIGdyb3VwPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJ0cmFuc2l0aW9uXCIgdHlwZT1cIkJpZnJvc3QuaW50ZXJhY3Rpb24uVmlzdWFsU3RhdGVUcmFuc2l0aW9uXCI+VHJhbnNpdGlvbiB0byBhZGQ8L3BhcmFtPlxyXG4gICAgICAgICAgICBzZWxmLnRyYW5zaXRpb25zLnB1c2godHJhbnNpdGlvbik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5oYXNTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZU5hbWUpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkNoZWNrIGlmIGdyb3VwIGhhcyBzdGF0ZSBieSB0aGUgbmFtZSBvZiB0aGUgc3RhdGU8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cInN0YXRlTmFtZVwiIHR5cGU9XCJTdHJpbmdcIj5OYW1lIG9mIHRoZSBzdGF0ZSB0byBjaGVjayBmb3I8L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHJldHVybnMgdHlwZT1cIkJvb2xlYW5cIj5UcnVlIGlmIHRoZSBzdGF0ZSBleGlzdHMsIGZhbHNlIGlmIG5vdDwvcmV0dXJucz5cclxuICAgICAgICAgICAgdmFyIGhhc1N0YXRlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHNlbGYuc3RhdGVzKCkuZm9yRWFjaChmdW5jdGlvbiAoc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5uYW1lID09PSBzdGF0ZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBoYXNTdGF0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoYXNTdGF0ZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldFN0YXRlQnlOYW1lID0gZnVuY3Rpb24gKHN0YXRlTmFtZSkge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+R2V0cyBhIHN0YXRlIGJ5IGl0cyBuYW1lPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJzdGF0ZU5hbWVcIiB0eXBlPVwiU3RyaW5nXCI+TmFtZSBvZiB0aGUgc3RhdGUgdG8gZ2V0PC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxyZXR1cm5zIHR5cGU9XCJCaWZyb3N0LmludGVyYWN0aW9uLlZpc3VhbFN0YXRlXCI+U3RhdGUgZm91bmQgb3IgbnVsbCBpZiBpdCBkb2VzIG5vdCBoYXZlIGEgc3RhdGUgYnkgdGhlIGdpdmVuIG5hbWU8L3JldHVybnM+XHJcbiAgICAgICAgICAgIHZhciBzdGF0ZUZvdW5kID0gbnVsbDtcclxuICAgICAgICAgICAgc2VsZi5zdGF0ZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlLm5hbWUgPT09IHN0YXRlTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlRm91bmQgPSBzdGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGVGb3VuZDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdvVG8gPSBmdW5jdGlvbiAobmFtaW5nUm9vdCwgc3RhdGVOYW1lKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5HbyB0byBhIHNwZWNpZmljIHN0YXRlIGJ5IHRoZSBuYW1lIG9mIHRoZSBzdGF0ZTwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwic3RhdGVOYW1lXCIgdHlwZT1cIlN0cmluZ1wiPk5hbWUgb2YgdGhlIHN0YXRlIHRvIGdvIHRvPC9wYXJhbT5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRTdGF0ZSA9IHNlbGYuY3VycmVudFN0YXRlKCk7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChjdXJyZW50U3RhdGUpICYmIGN1cnJlbnRTdGF0ZS5uYW1lID09PSBzdGF0ZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHN0YXRlID0gc2VsZi5nZXRTdGF0ZUJ5TmFtZShzdGF0ZU5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoc3RhdGUpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZHVyYXRpb24gPSBzZWxmLmRlZmF1bHREdXJhdGlvbjtcclxuICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChjdXJyZW50U3RhdGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFN0YXRlLmV4aXQobmFtaW5nUm9vdCwgZHVyYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3RhdGUuZW50ZXIobmFtaW5nUm9vdCwgZHVyYXRpb24pO1xyXG5cclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIuc2NoZWR1bGUoZHVyYXRpb24udG90YWxNaWxsaXNlY29uZHMoKSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY3VycmVudFN0YXRlKHN0YXRlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5pbnRlcmFjdGlvblwiLCB7XHJcbiAgICBWaXN1YWxTdGF0ZU1hbmFnZXI6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGEgc3RhdGUgbWFuYWdlciBmb3IgZGVhbGluZyB3aXRoIHZpc3VhbCBzdGF0ZXMsIHR5cGljYWxseSByZWxhdGVkIHRvIGEgY29udHJvbCBvciBvdGhlciBlbGVtZW50IG9uIGEgcGFnZTwvc3VtbWFyeT5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cIm5hbWluZ1Jvb3RcIiB0eXBlPVwiQmlmcm9zdC52aWV3cy5OYW1pbmdSb290XCI+QSByb290IGZvciBuYW1lZCBvYmplY3RzPC9maWVsZD5cclxuICAgICAgICB0aGlzLm5hbWluZ1Jvb3QgPSBudWxsO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJncm91cHNcIiB0eXBlPVwiQXJyYXlcIiBlbGVtZW50VHlwZT1cIkJpZnJvc3QuaW50ZXJhY3Rpb24uVmlzdWFsU3RhdGVHcm91cFwiPkhvbGRzIGFsbCBncm91cHMgaW4gdGhlIHN0YXRlIG1hbmFnZXI8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuZ3JvdXBzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkR3JvdXAgPSBmdW5jdGlvbiAoZ3JvdXApIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkFkZHMgYSBWaXN1YWxTdGF0ZUdyb3VwIHRvIHRoZSBtYW5hZ2VyPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJncm91cFwiIHR5cGU9XCJCaWZyb3N0LmludGVyYWN0aW9uLlZpc3VhbFN0YXRlR3JvdXBcIj5Hcm91cCB0byBhZGQ8L3BhcmFtPlxyXG4gICAgICAgICAgICBzZWxmLmdyb3Vwcy5wdXNoKGdyb3VwKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdvVG8gPSBmdW5jdGlvbiAoc3RhdGVOYW1lKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5HbyB0byBhIHNwZWNpZmljIHN0YXRlIGJ5IGl0cyBuYW1lPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJzdGF0ZU5hbWVcIiB0eXBlPVwiU3RyaW5nXCI+TmFtZSBvZiBzdGF0ZSB0byBnbyB0bzwvcGFyYW0+XHJcbiAgICAgICAgICAgIHNlbGYuZ3JvdXBzKCkuZm9yRWFjaChmdW5jdGlvbiAoZ3JvdXApIHtcclxuICAgICAgICAgICAgICAgIGlmIChncm91cC5oYXNTdGF0ZShzdGF0ZU5hbWUpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAuZ29UbyhzZWxmLm5hbWluZ1Jvb3QsIHN0YXRlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW50ZXJhY3Rpb25cIiwge1xyXG4gICAgVmlzdWFsU3RhdGVNYW5hZ2VyRWxlbWVudFZpc2l0b3I6IEJpZnJvc3QubWFya3VwLkVsZW1lbnRWaXNpdG9yLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHZpc3VhbFN0YXRlQWN0aW9uVHlwZXMgPSBCaWZyb3N0LmludGVyYWN0aW9uLlZpc3VhbFN0YXRlQWN0aW9uLmdldEV4dGVuZGVycygpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBhcnNlQWN0aW9ucyhuYW1pbmdSb290LCBzdGF0ZUVsZW1lbnQsIHN0YXRlKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHBhcnNlQWN0aW9uKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlLl9uYW1lLnRvTG93ZXJDYXNlKCkgPT09IGNoaWxkLmxvY2FsTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhY3Rpb24gPSB0eXBlLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBhdHRyaWJ1dGVJbmRleCA9IDA7IGF0dHJpYnV0ZUluZGV4IDwgY2hpbGQuYXR0cmlidXRlcy5sZW5ndGg7IGF0dHJpYnV0ZUluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWUgPSBjaGlsZC5hdHRyaWJ1dGVzW2F0dHJpYnV0ZUluZGV4XS5sb2NhbE5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGNoaWxkLmF0dHJpYnV0ZXNbYXR0cmlidXRlSW5kZXhdLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25bbmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24uaW5pdGlhbGl6ZShuYW1pbmdSb290KTtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5hZGRBY3Rpb24oYWN0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHN0YXRlRWxlbWVudC5oYXNDaGlsZE5vZGVzKCkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IHN0YXRlRWxlbWVudC5maXJzdENoaWxkO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGNoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlzdWFsU3RhdGVBY3Rpb25UeXBlcy5mb3JFYWNoKHBhcnNlQWN0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGNoaWxkLm5leHRTaWJsaW5nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwYXJzZVN0YXRlcyhuYW1pbmdSb290LCBncm91cEVsZW1lbnQsIGdyb3VwKSB7XHJcbiAgICAgICAgICAgIGlmKCBncm91cEVsZW1lbnQuaGFzQ2hpbGROb2RlcygpICkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gZ3JvdXBFbGVtZW50LmZpcnN0Q2hpbGQ7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSggY2hpbGQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIGNoaWxkLmxvY2FsTmFtZSA9PT0gXCJ2aXN1YWxzdGF0ZVwiICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBCaWZyb3N0LmludGVyYWN0aW9uLlZpc3VhbFN0YXRlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5uYW1lID0gY2hpbGQuZ2V0QXR0cmlidXRlKFwibmFtZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXAuYWRkU3RhdGUoc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUFjdGlvbnMobmFtaW5nUm9vdCwgY2hpbGQsIHN0YXRlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQgPSBjaGlsZC5uZXh0U2libGluZztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMudmlzaXQgPSBmdW5jdGlvbiAoZWxlbWVudCwgYWN0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5sb2NhbE5hbWUgPT09IFwidmlzdWFsc3RhdGVtYW5hZ2VyXCIpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2aXN1YWxTdGF0ZU1hbmFnZXIgPSBCaWZyb3N0LmludGVyYWN0aW9uLlZpc3VhbFN0YXRlTWFuYWdlci5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgIHZhciBuYW1pbmdSb290ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50Lm5hbWluZ1Jvb3Q7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnBhcmVudEVsZW1lbnQudmlzdWFsU3RhdGVNYW5hZ2VyID0gdmlzdWFsU3RhdGVNYW5hZ2VyO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50Lmhhc0NoaWxkTm9kZXMoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IGVsZW1lbnQuZmlyc3RDaGlsZDtcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoY2hpbGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkLmxvY2FsTmFtZSA9PT0gXCJ2aXN1YWxzdGF0ZWdyb3VwXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBncm91cCA9IEJpZnJvc3QuaW50ZXJhY3Rpb24uVmlzdWFsU3RhdGVHcm91cC5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpc3VhbFN0YXRlTWFuYWdlci5hZGRHcm91cChncm91cCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGR1cmF0aW9uID0gY2hpbGQuZ2V0QXR0cmlidXRlKFwiZHVyYXRpb25cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoZHVyYXRpb24pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb24gPSBwYXJzZUZsb2F0KGR1cmF0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKGR1cmF0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbiA9IGR1cmF0aW9uICogMTAwMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRpbWVzcGFuID0gQmlmcm9zdC5UaW1lU3Bhbi5mcm9tTWlsbGlzZWNvbmRzKGR1cmF0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXAuZGVmYXVsdER1cmF0aW9uID0gdGltZXNwYW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlU3RhdGVzKG5hbWluZ1Jvb3QsIGNoaWxkLCBncm91cCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQgPSBjaGlsZC5uZXh0U2libGluZztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5pbnRlcmFjdGlvblwiLCB7XHJcbiAgICBWaXN1YWxTdGF0ZVRyYW5zaXRpb246IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSBkZXNjcmlwdGlvbiBvZiB0cmFuc2l0aW9uIGJldHdlZW4gdHdvIG5hbWVkIHN0YXRlczwvc3VtbWFyeT5cclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiZnJvbVwiIHR5cGU9XCJTdHJpbmdcIj5OYW1lIG9mIHZpc3VhbCBzdGF0ZSB0aGF0IHdlIGFyZSBkZXNjcmliaW5nIHRyYW5zaXRpb25pbmcgZnJvbTwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5mcm9tID0gXCJcIjtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwidG9cIiB0eXBlPVwiU3RyaW5nXCI+TmFtZSBvZiB2aXN1YWwgc3RhdGUgdGhhdCB3ZSBhcmUgZGVzY3JpYmluZyB0cmFuc2l0aW9uaW5nIHRvPC9maWVsZD5cclxuICAgICAgICB0aGlzLnRvID0gXCJcIjtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiZHVyYXRpb25cIiB0eXBlPVwiQmlmcm9zdC5UaW1lU3RhbXBcIj5EdXJhdGlvbiBmb3IgdGhlIHRyYW5zaXRpb248L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuZHVyYXRpb24gPSBCaWZyb3N0LlRpbWVTdGFtcC56ZXJvKCk7XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW9cIiwge1xyXG4gICAgRmlsZTogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAocGF0aCkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGEgZmlsZTwvc3VtbWFyeT5cclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwidHlwZVwiIHR5cGU9XCJCaWZyb3N0LmlvLmZpbGVUeXBlXCI+VHlwZSBvZiBmaWxlIHJlcHJlc2VudGVkPC9maWVsZD5cclxuICAgICAgICB0aGlzLnR5cGUgPSBCaWZyb3N0LmlvLmZpbGVUeXBlLnVua25vd247XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cInBhdGhcIiB0eXBlPVwiQmlmcm9zdC5QYXRoXCI+VGhlIHBhdGggcmVwcmVzZW50aW5nIHRoZSBmaWxlPC9maWVsZD5cclxuICAgICAgICB0aGlzLnBhdGggPSBCaWZyb3N0LlBhdGguY3JlYXRlKHsgZnVsbFBhdGg6IHBhdGggfSk7XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW9cIiwge1xyXG4gICAgZmlsZUZhY3Rvcnk6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyBhIGZhY3RvcnkgZm9yIGNyZWF0aW5nIGluc3RhbmNlcyBvZiBCaWZyb3N0LmlvLkZpbGU8L3N1bW1hcnk+XHJcbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAocGF0aCwgZmlsZVR5cGUpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkNyZWF0ZXMgYSBuZXcgZmlsZTwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwicGF0aFwiIHR5cGU9XCJTdHJpbmdcIj5QYXRoIG9mIGZpbGU8L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJmaWxlVHlwZVwiIHR5cGU9XCJCaWZyb3N0LmlvLmZpbGVUeXBlXCIgb3B0aW9uYWw9XCJ0cnVlXCI+VHlwZSBvZiBmaWxlIHRvIHVzZTwvcGFyYW0+XHJcbiAgICAgICAgICAgIC8vLyA8cmV0dXJucyB0eXBlPVwiQmlmcm9zdC5pby5GaWxlXCI+QW4gaW5zdGFuY2Ugb2YgYSBmaWxlPC9yZXR1cm5zPlxyXG5cclxuICAgICAgICAgICAgdmFyIGZpbGUgPSBCaWZyb3N0LmlvLkZpbGUuY3JlYXRlKHsgcGF0aDogcGF0aCB9KTtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGZpbGVUeXBlKSkge1xyXG4gICAgICAgICAgICAgICAgZmlsZS5maWxlVHlwZSA9IGZpbGVUeXBlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmaWxlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy5maWxlRmFjdG9yeSA9IEJpZnJvc3QuaW8uZmlsZUZhY3Rvcnk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmlvXCIsIHtcclxuICAgIGZpbGVNYW5hZ2VyOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSBtYW5hZ2VyIGZvciBmaWxlcywgcHJvdmlkaW5nIGNhcGFiaWxpdGllcyBvZiBsb2FkaW5nIGFuZCBtb3JlPC9zdW1tYXJ5PlxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIHVyaSA9IEJpZnJvc3QuVXJpLmNyZWF0ZSh3aW5kb3cubG9jYXRpb24uaHJlZik7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCA9PT0gXCJmaWxlOlwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0gdGhpcy5vcmlnaW4uc3Vic3RyKDAsIHRoaXMub3JpZ2luLmxhc3RJbmRleE9mKFwiL1wiKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5vcmlnaW4ubGFzdEluZGV4T2YoXCIvXCIpID09PSB0aGlzLm9yaWdpbi5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9yaWdpbiA9IHRoaXMub3JpZ2luLnN1YnN0cigwLCB0aGlzLm9yaWdpbi5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBwb3J0ID0gdXJpLnBvcnQgfHwgXCJcIjtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzVW5kZWZpbmVkKHBvcnQpICYmIHBvcnQgIT09IFwiXCIgJiYgcG9ydCAhPT0gODApIHtcclxuICAgICAgICAgICAgICAgIHBvcnQgPSBcIjpcIiArIHBvcnQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0gdXJpLnNjaGVtZSArIFwiOi8vXCIgKyB1cmkuaG9zdCArIHBvcnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRBY3R1YWxGaWxlbmFtZShmaWxlbmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgYWN0dWFsRmlsZW5hbWUgPSBzZWxmLm9yaWdpbjtcclxuXHJcbiAgICAgICAgICAgIGlmIChmaWxlbmFtZS5pbmRleE9mKFwiL1wiKSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgYWN0dWFsRmlsZW5hbWUgKz0gXCIvXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYWN0dWFsRmlsZW5hbWUgKz0gZmlsZW5hbWU7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYWN0dWFsRmlsZW5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmxvYWQgPSBmdW5jdGlvbiAoZmlsZXMpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkxvYWQgZmlsZXM8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gcGFyYW1ldGVyQXJyYXk9XCJ0cnVlXCIgZWxlbWVudFR5cGU9XCJCaWZyb3N0LmlvLkZpbGVcIj5GaWxlcyB0byBsb2FkPC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxyZXR1cm5zIHR5cGU9XCJCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlXCI+QSBwcm9taXNlIHRoYXQgY2FuIGJlIGNvbnRpbnVlZCB3aXRoIHRoZSBhY3R1YWwgZmlsZXMgY29taW5nIGluIGFzIGFuIGFycmF5PC9yZXR1cm5zPlxyXG4gICAgICAgICAgICB2YXIgZmlsZXNUb0xvYWQgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIGZpbGVzLmZvckVhY2goZnVuY3Rpb24gKGZpbGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYXRoID0gZ2V0QWN0dWFsRmlsZW5hbWUoZmlsZS5wYXRoLmZ1bGxQYXRoKTtcclxuICAgICAgICAgICAgICAgIGlmIChmaWxlLmZpbGVUeXBlID09PSBCaWZyb3N0LmlvLmZpbGVUeXBlLmh0bWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXRoID0gXCJ0ZXh0IVwiICsgcGF0aCArIFwiIXN0cmlwXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmaWxlLnBhdGguaGFzRXh0ZW5zaW9uKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aCA9IFwibm9leHQhXCIgKyBwYXRoO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmaWxlc1RvTG9hZC5wdXNoKHBhdGgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVpcmUoZmlsZXNUb0xvYWQsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLmZpbGVNYW5hZ2VyID0gQmlmcm9zdC5pby5maWxlTWFuYWdlcjsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QuaW9cIiwge1xyXG4gICAgZmlsZVR5cGU6IHtcclxuICAgICAgICB1bmtub3duOiAwLFxyXG4gICAgICAgIHRleHQ6IDEsXHJcbiAgICAgICAgamF2YVNjcmlwdDogMixcclxuICAgICAgICBodG1sOiAzXHJcbiAgICB9XHJcbn0pOyIsIi8qXHJcbiBSZXF1aXJlSlMgMS4wLjMgQ29weXJpZ2h0IChjKSAyMDEwLTIwMTEsIFRoZSBEb2pvIEZvdW5kYXRpb24gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cclxuIEF2YWlsYWJsZSB2aWEgdGhlIE1JVCBvciBuZXcgQlNEIGxpY2Vuc2UuXHJcbiBzZWU6IGh0dHA6Ly9naXRodWIuY29tL2pyYnVya2UvcmVxdWlyZWpzIGZvciBkZXRhaWxzXHJcbiovXHJcbnZhciByZXF1aXJlanMscmVxdWlyZSxkZWZpbmU7XHJcbihmdW5jdGlvbigpe2Z1bmN0aW9uIEooYSl7cmV0dXJuIE0uY2FsbChhKT09PVwiW29iamVjdCBGdW5jdGlvbl1cIn1mdW5jdGlvbiBFKGEpe3JldHVybiBNLmNhbGwoYSk9PT1cIltvYmplY3QgQXJyYXldXCJ9ZnVuY3Rpb24gWihhLGMsaCl7Zm9yKHZhciBrIGluIGMpaWYoIShrIGluIEspJiYoIShrIGluIGEpfHxoKSlhW2tdPWNba107cmV0dXJuIGR9ZnVuY3Rpb24gTihhLGMsZCl7YT1FcnJvcihjK1wiXFxuaHR0cDovL3JlcXVpcmVqcy5vcmcvZG9jcy9lcnJvcnMuaHRtbCNcIithKTtpZihkKWEub3JpZ2luYWxFcnJvcj1kO3JldHVybiBhfWZ1bmN0aW9uICQoYSxjLGQpe3ZhciBrLGoscTtmb3Ioaz0wO3E9Y1trXTtrKyspe3E9dHlwZW9mIHE9PT1cInN0cmluZ1wiP3tuYW1lOnF9OnE7aj1xLmxvY2F0aW9uO2lmKGQmJighanx8ai5pbmRleE9mKFwiL1wiKSE9PTAmJmouaW5kZXhPZihcIjpcIik9PT0tMSkpaj1kK1wiL1wiKyhqfHxxLm5hbWUpO2FbcS5uYW1lXT17bmFtZTpxLm5hbWUsbG9jYXRpb246anx8XHJcbnEubmFtZSxtYWluOihxLm1haW58fFwibWFpblwiKS5yZXBsYWNlKGVhLFwiXCIpLnJlcGxhY2UoYWEsXCJcIil9fX1mdW5jdGlvbiBVKGEsYyl7YS5ob2xkUmVhZHk/YS5ob2xkUmVhZHkoYyk6Yz9hLnJlYWR5V2FpdCs9MTphLnJlYWR5KCEwKX1mdW5jdGlvbiBmYShhKXtmdW5jdGlvbiBjKGIsbCl7dmFyIGYsYTtpZihiJiZiLmNoYXJBdCgwKT09PVwiLlwiKWlmKGwpe3AucGtnc1tsXT9sPVtsXToobD1sLnNwbGl0KFwiL1wiKSxsPWwuc2xpY2UoMCxsLmxlbmd0aC0xKSk7Zj1iPWwuY29uY2F0KGIuc3BsaXQoXCIvXCIpKTt2YXIgYztmb3IoYT0wO2M9ZlthXTthKyspaWYoYz09PVwiLlwiKWYuc3BsaWNlKGEsMSksYS09MTtlbHNlIGlmKGM9PT1cIi4uXCIpaWYoYT09PTEmJihmWzJdPT09XCIuLlwifHxmWzBdPT09XCIuLlwiKSlicmVhaztlbHNlIGE+MCYmKGYuc3BsaWNlKGEtMSwyKSxhLT0yKTthPXAucGtnc1tmPWJbMF1dO2I9Yi5qb2luKFwiL1wiKTthJiZiPT09ZitcIi9cIithLm1haW4mJihiPWYpfWVsc2UgYi5pbmRleE9mKFwiLi9cIik9PT1cclxuMCYmKGI9Yi5zdWJzdHJpbmcoMikpO3JldHVybiBifWZ1bmN0aW9uIGgoYixsKXt2YXIgZj1iP2IuaW5kZXhPZihcIiFcIik6LTEsYT1udWxsLGQ9bD9sLm5hbWU6bnVsbCxpPWIsZSxoO2YhPT0tMSYmKGE9Yi5zdWJzdHJpbmcoMCxmKSxiPWIuc3Vic3RyaW5nKGYrMSxiLmxlbmd0aCkpO2EmJihhPWMoYSxkKSk7YiYmKGE/ZT0oZj1tW2FdKSYmZi5ub3JtYWxpemU/Zi5ub3JtYWxpemUoYixmdW5jdGlvbihiKXtyZXR1cm4gYyhiLGQpfSk6YyhiLGQpOihlPWMoYixkKSxoPUVbZV0saHx8KGg9Zy5uYW1lVG9VcmwoZSxudWxsLGwpLEVbZV09aCkpKTtyZXR1cm57cHJlZml4OmEsbmFtZTplLHBhcmVudE1hcDpsLHVybDpoLG9yaWdpbmFsTmFtZTppLGZ1bGxOYW1lOmE/YStcIiFcIisoZXx8XCJcIik6ZX19ZnVuY3Rpb24gaygpe3ZhciBiPSEwLGw9cC5wcmlvcml0eVdhaXQsZixhO2lmKGwpe2ZvcihhPTA7Zj1sW2FdO2ErKylpZighc1tmXSl7Yj0hMTticmVha31iJiZkZWxldGUgcC5wcmlvcml0eVdhaXR9cmV0dXJuIGJ9XHJcbmZ1bmN0aW9uIGooYixsLGYpe3JldHVybiBmdW5jdGlvbigpe3ZhciBhPWdhLmNhbGwoYXJndW1lbnRzLDApLGM7aWYoZiYmSihjPWFbYS5sZW5ndGgtMV0pKWMuX19yZXF1aXJlSnNCdWlsZD0hMDthLnB1c2gobCk7cmV0dXJuIGIuYXBwbHkobnVsbCxhKX19ZnVuY3Rpb24gcShiLGwpe3ZhciBhPWooZy5yZXF1aXJlLGIsbCk7WihhLHtuYW1lVG9Vcmw6aihnLm5hbWVUb1VybCxiKSx0b1VybDpqKGcudG9VcmwsYiksZGVmaW5lZDpqKGcucmVxdWlyZURlZmluZWQsYiksc3BlY2lmaWVkOmooZy5yZXF1aXJlU3BlY2lmaWVkLGIpLGlzQnJvd3NlcjpkLmlzQnJvd3Nlcn0pO3JldHVybiBhfWZ1bmN0aW9uIG8oYil7dmFyIGwsYSxjLEI9Yi5jYWxsYmFjayxpPWIubWFwLGU9aS5mdWxsTmFtZSxiYT1iLmRlcHM7Yz1iLmxpc3RlbmVycztpZihCJiZKKEIpKXtpZihwLmNhdGNoRXJyb3IuZGVmaW5lKXRyeXthPWQuZXhlY0NiKGUsYi5jYWxsYmFjayxiYSxtW2VdKX1jYXRjaChrKXtsPWt9ZWxzZSBhPVxyXG5kLmV4ZWNDYihlLGIuY2FsbGJhY2ssYmEsbVtlXSk7aWYoZSkoQj1iLmNqc01vZHVsZSkmJkIuZXhwb3J0cyE9PXZvaWQgMCYmQi5leHBvcnRzIT09bVtlXT9hPW1bZV09Yi5janNNb2R1bGUuZXhwb3J0czphPT09dm9pZCAwJiZiLnVzaW5nRXhwb3J0cz9hPW1bZV06KG1bZV09YSxGW2VdJiYoUVtlXT0hMCkpfWVsc2UgZSYmKGE9bVtlXT1CLEZbZV0mJihRW2VdPSEwKSk7aWYoQ1tiLmlkXSlkZWxldGUgQ1tiLmlkXSxiLmlzRG9uZT0hMCxnLndhaXRDb3VudC09MSxnLndhaXRDb3VudD09PTAmJihJPVtdKTtkZWxldGUgUltlXTtpZihkLm9uUmVzb3VyY2VMb2FkJiYhYi5wbGFjZWhvbGRlcilkLm9uUmVzb3VyY2VMb2FkKGcsaSxiLmRlcEFycmF5KTtpZihsKXJldHVybiBhPShlP2goZSkudXJsOlwiXCIpfHxsLmZpbGVOYW1lfHxsLnNvdXJjZVVSTCxjPWwubW9kdWxlVHJlZSxsPU4oXCJkZWZpbmVlcnJvclwiLCdFcnJvciBldmFsdWF0aW5nIG1vZHVsZSBcIicrZSsnXCIgYXQgbG9jYXRpb24gXCInK1xyXG5hKydcIjpcXG4nK2wrXCJcXG5maWxlTmFtZTpcIithK1wiXFxubGluZU51bWJlcjogXCIrKGwubGluZU51bWJlcnx8bC5saW5lKSxsKSxsLm1vZHVsZU5hbWU9ZSxsLm1vZHVsZVRyZWU9YyxkLm9uRXJyb3IobCk7Zm9yKGw9MDtCPWNbbF07bCsrKUIoYSl9ZnVuY3Rpb24gcihiLGEpe3JldHVybiBmdW5jdGlvbihmKXtiLmRlcERvbmVbYV18fChiLmRlcERvbmVbYV09ITAsYi5kZXBzW2FdPWYsYi5kZXBDb3VudC09MSxiLmRlcENvdW50fHxvKGIpKX19ZnVuY3Rpb24gdShiLGEpe3ZhciBmPWEubWFwLGM9Zi5mdWxsTmFtZSxoPWYubmFtZSxpPUxbYl18fChMW2JdPW1bYl0pLGU7aWYoIWEubG9hZGluZylhLmxvYWRpbmc9ITAsZT1mdW5jdGlvbihiKXthLmNhbGxiYWNrPWZ1bmN0aW9uKCl7cmV0dXJuIGJ9O28oYSk7c1thLmlkXT0hMDt3KCl9LGUuZnJvbVRleHQ9ZnVuY3Rpb24oYixhKXt2YXIgbD1PO3NbYl09ITE7Zy5zY3JpcHRDb3VudCs9MTtnLmZha2VbYl09ITA7bCYmKE89ITEpO2QuZXhlYyhhKTtcclxubCYmKE89ITApO2cuY29tcGxldGVMb2FkKGIpfSxjIGluIG0/ZShtW2NdKTppLmxvYWQoaCxxKGYucGFyZW50TWFwLCEwKSxlLHApfWZ1bmN0aW9uIHYoYil7Q1tiLmlkXXx8KENbYi5pZF09YixJLnB1c2goYiksZy53YWl0Q291bnQrPTEpfWZ1bmN0aW9uIEQoYil7dGhpcy5saXN0ZW5lcnMucHVzaChiKX1mdW5jdGlvbiB0KGIsYSl7dmFyIGY9Yi5mdWxsTmFtZSxjPWIucHJlZml4LGQ9Yz9MW2NdfHwoTFtjXT1tW2NdKTpudWxsLGksZTtmJiYoaT1SW2ZdKTtpZighaSYmKGU9ITAsaT17aWQ6KGMmJiFkP00rKyArXCJfX3BAOlwiOlwiXCIpKyhmfHxcIl9fckBcIitNKyspLG1hcDpiLGRlcENvdW50OjAsZGVwRG9uZTpbXSxkZXBDYWxsYmFja3M6W10sZGVwczpbXSxsaXN0ZW5lcnM6W10sYWRkOkR9LHhbaS5pZF09ITAsZiYmKCFjfHxMW2NdKSkpUltmXT1pO2MmJiFkPyhmPXQoaChjKSwhMCksZi5hZGQoZnVuY3Rpb24oKXt2YXIgYT1oKGIub3JpZ2luYWxOYW1lLGIucGFyZW50TWFwKSxhPXQoYSxcclxuITApO2kucGxhY2Vob2xkZXI9ITA7YS5hZGQoZnVuY3Rpb24oYil7aS5jYWxsYmFjaz1mdW5jdGlvbigpe3JldHVybiBifTtvKGkpfSl9KSk6ZSYmYSYmKHNbaS5pZF09ITEsZy5wYXVzZWQucHVzaChpKSx2KGkpKTtyZXR1cm4gaX1mdW5jdGlvbiBBKGIsYSxmLGMpe3ZhciBiPWgoYixjKSxkPWIubmFtZSxpPWIuZnVsbE5hbWUsZT10KGIpLGs9ZS5pZCxqPWUuZGVwcyxuO2lmKGkpe2lmKGkgaW4gbXx8c1trXT09PSEwfHxpPT09XCJqcXVlcnlcIiYmcC5qUXVlcnkmJnAualF1ZXJ5IT09ZigpLmZuLmpxdWVyeSlyZXR1cm47eFtrXT0hMDtzW2tdPSEwO2k9PT1cImpxdWVyeVwiJiZmJiZWKGYoKSl9ZS5kZXBBcnJheT1hO2UuY2FsbGJhY2s9Zjtmb3IoZj0wO2Y8YS5sZW5ndGg7ZisrKWlmKGs9YVtmXSlrPWgoayxkP2I6Yyksbj1rLmZ1bGxOYW1lLGFbZl09bixuPT09XCJyZXF1aXJlXCI/altmXT1xKGIpOm49PT1cImV4cG9ydHNcIj8oaltmXT1tW2ldPXt9LGUudXNpbmdFeHBvcnRzPSEwKTpuPT09XHJcblwibW9kdWxlXCI/ZS5janNNb2R1bGU9altmXT17aWQ6ZCx1cmk6ZD9nLm5hbWVUb1VybChkLG51bGwsYyk6dm9pZCAwLGV4cG9ydHM6bVtpXX06biBpbiBtJiYhKG4gaW4gQykmJighKGkgaW4gRil8fGkgaW4gRiYmUVtuXSk/altmXT1tW25dOihpIGluIEYmJihGW25dPSEwLGRlbGV0ZSBtW25dLFNbay51cmxdPSExKSxlLmRlcENvdW50Kz0xLGUuZGVwQ2FsbGJhY2tzW2ZdPXIoZSxmKSx0KGssITApLmFkZChlLmRlcENhbGxiYWNrc1tmXSkpO2UuZGVwQ291bnQ/dihlKTpvKGUpfWZ1bmN0aW9uIG4oYil7QS5hcHBseShudWxsLGIpfWZ1bmN0aW9uIHkoYixhKXtpZighYi5pc0RvbmUpe3ZhciBjPWIubWFwLmZ1bGxOYW1lLGQ9Yi5kZXBBcnJheSxnLGksZSxrO2lmKGMpe2lmKGFbY10pcmV0dXJuIG1bY107YVtjXT0hMH1pZihkKWZvcihnPTA7ZzxkLmxlbmd0aDtnKyspaWYoaT1kW2ddKWlmKChlPWgoaSkucHJlZml4KSYmKGs9Q1tlXSkmJnkoayxhKSwoZT1DW2ldKSYmIWUuaXNEb25lJiZcclxuc1tpXSlpPXkoZSxhKSxiLmRlcENhbGxiYWNrc1tnXShpKTtyZXR1cm4gYz9tW2NdOnZvaWQgMH19ZnVuY3Rpb24geigpe3ZhciBiPXAud2FpdFNlY29uZHMqMUUzLGE9YiYmZy5zdGFydFRpbWUrYjwobmV3IERhdGUpLmdldFRpbWUoKSxiPVwiXCIsYz0hMSxoPSExLGo7aWYoIShnLnBhdXNlZENvdW50PjApKXtpZihwLnByaW9yaXR5V2FpdClpZihrKCkpdygpO2Vsc2UgcmV0dXJuO2ZvcihqIGluIHMpaWYoIShqIGluIEspJiYoYz0hMCwhc1tqXSkpaWYoYSliKz1qK1wiIFwiO2Vsc2V7aD0hMDticmVha31pZihjfHxnLndhaXRDb3VudCl7aWYoYSYmYilyZXR1cm4gaj1OKFwidGltZW91dFwiLFwiTG9hZCB0aW1lb3V0IGZvciBtb2R1bGVzOiBcIitiKSxqLnJlcXVpcmVUeXBlPVwidGltZW91dFwiLGoucmVxdWlyZU1vZHVsZXM9YixkLm9uRXJyb3Ioaik7aWYoaHx8Zy5zY3JpcHRDb3VudCl7aWYoKEd8fGNhKSYmIVcpVz1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7Vz0wO3ooKX0sNTApfWVsc2V7aWYoZy53YWl0Q291bnQpe2ZvcihIPVxyXG4wO2I9SVtIXTtIKyspeShiLHt9KTtnLnBhdXNlZC5sZW5ndGgmJncoKTtYPDUmJihYKz0xLHooKSl9WD0wO2QuY2hlY2tSZWFkeVN0YXRlKCl9fX19dmFyIGcsdyxwPXt3YWl0U2Vjb25kczo3LGJhc2VVcmw6XCIuL1wiLHBhdGhzOnt9LHBrZ3M6e30sY2F0Y2hFcnJvcjp7fX0sUD1bXSx4PXtyZXF1aXJlOiEwLGV4cG9ydHM6ITAsbW9kdWxlOiEwfSxFPXt9LG09e30scz17fSxDPXt9LEk9W10sUz17fSxNPTAsUj17fSxMPXt9LEY9e30sUT17fSxZPTA7Vj1mdW5jdGlvbihiKXtpZighZy5qUXVlcnkmJihiPWJ8fCh0eXBlb2YgalF1ZXJ5IT09XCJ1bmRlZmluZWRcIj9qUXVlcnk6bnVsbCkpJiYhKHAualF1ZXJ5JiZiLmZuLmpxdWVyeSE9PXAualF1ZXJ5KSYmKFwiaG9sZFJlYWR5XCJpbiBifHxcInJlYWR5V2FpdFwiaW4gYikpaWYoZy5qUXVlcnk9YixuKFtcImpxdWVyeVwiLFtdLGZ1bmN0aW9uKCl7cmV0dXJuIGpRdWVyeX1dKSxnLnNjcmlwdENvdW50KVUoYiwhMCksZy5qUXVlcnlJbmNyZW1lbnRlZD1cclxuITB9O3c9ZnVuY3Rpb24oKXt2YXIgYixhLGMsaCxqLGk7WSs9MTtpZihnLnNjcmlwdENvdW50PD0wKWcuc2NyaXB0Q291bnQ9MDtmb3IoO1AubGVuZ3RoOylpZihiPVAuc2hpZnQoKSxiWzBdPT09bnVsbClyZXR1cm4gZC5vbkVycm9yKE4oXCJtaXNtYXRjaFwiLFwiTWlzbWF0Y2hlZCBhbm9ueW1vdXMgZGVmaW5lKCkgbW9kdWxlOiBcIitiW2IubGVuZ3RoLTFdKSk7ZWxzZSBuKGIpO2lmKCFwLnByaW9yaXR5V2FpdHx8aygpKWZvcig7Zy5wYXVzZWQubGVuZ3RoOyl7aj1nLnBhdXNlZDtnLnBhdXNlZENvdW50Kz1qLmxlbmd0aDtnLnBhdXNlZD1bXTtmb3IoaD0wO2I9altoXTtoKyspYT1iLm1hcCxjPWEudXJsLGk9YS5mdWxsTmFtZSxhLnByZWZpeD91KGEucHJlZml4LGIpOiFTW2NdJiYhc1tpXSYmKGQubG9hZChnLGksYyksYy5pbmRleE9mKFwiZW1wdHk6XCIpIT09MCYmKFNbY109ITApKTtnLnN0YXJ0VGltZT0obmV3IERhdGUpLmdldFRpbWUoKTtnLnBhdXNlZENvdW50LT1qLmxlbmd0aH1ZPT09XHJcbjEmJnooKTtZLT0xfTtnPXtjb250ZXh0TmFtZTphLGNvbmZpZzpwLGRlZlF1ZXVlOlAsd2FpdGluZzpDLHdhaXRDb3VudDowLHNwZWNpZmllZDp4LGxvYWRlZDpzLHVybE1hcDpFLHVybEZldGNoZWQ6UyxzY3JpcHRDb3VudDowLGRlZmluZWQ6bSxwYXVzZWQ6W10scGF1c2VkQ291bnQ6MCxwbHVnaW5zOkwsbmVlZEZ1bGxFeGVjOkYsZmFrZTp7fSxmdWxsRXhlYzpRLG1hbmFnZXJDYWxsYmFja3M6UixtYWtlTW9kdWxlTWFwOmgsbm9ybWFsaXplOmMsY29uZmlndXJlOmZ1bmN0aW9uKGIpe3ZhciBhLGMsZDtiLmJhc2VVcmwmJmIuYmFzZVVybC5jaGFyQXQoYi5iYXNlVXJsLmxlbmd0aC0xKSE9PVwiL1wiJiYoYi5iYXNlVXJsKz1cIi9cIik7YT1wLnBhdGhzO2Q9cC5wa2dzO1oocCxiLCEwKTtpZihiLnBhdGhzKXtmb3IoYyBpbiBiLnBhdGhzKWMgaW4gS3x8KGFbY109Yi5wYXRoc1tjXSk7cC5wYXRocz1hfWlmKChhPWIucGFja2FnZVBhdGhzKXx8Yi5wYWNrYWdlcyl7aWYoYSlmb3IoYyBpbiBhKWMgaW5cclxuS3x8JChkLGFbY10sYyk7Yi5wYWNrYWdlcyYmJChkLGIucGFja2FnZXMpO3AucGtncz1kfWlmKGIucHJpb3JpdHkpYz1nLnJlcXVpcmVXYWl0LGcucmVxdWlyZVdhaXQ9ITEsZy50YWtlR2xvYmFsUXVldWUoKSx3KCksZy5yZXF1aXJlKGIucHJpb3JpdHkpLHcoKSxnLnJlcXVpcmVXYWl0PWMscC5wcmlvcml0eVdhaXQ9Yi5wcmlvcml0eTtpZihiLmRlcHN8fGIuY2FsbGJhY2spZy5yZXF1aXJlKGIuZGVwc3x8W10sYi5jYWxsYmFjayl9LHJlcXVpcmVEZWZpbmVkOmZ1bmN0aW9uKGIsYSl7cmV0dXJuIGgoYixhKS5mdWxsTmFtZSBpbiBtfSxyZXF1aXJlU3BlY2lmaWVkOmZ1bmN0aW9uKGIsYSl7cmV0dXJuIGgoYixhKS5mdWxsTmFtZSBpbiB4fSxyZXF1aXJlOmZ1bmN0aW9uKGIsYyxmKXtpZih0eXBlb2YgYj09PVwic3RyaW5nXCIpe2lmKEooYykpcmV0dXJuIGQub25FcnJvcihOKFwicmVxdWlyZWFyZ3NcIixcIkludmFsaWQgcmVxdWlyZSBjYWxsXCIpKTtpZihkLmdldClyZXR1cm4gZC5nZXQoZyxcclxuYixjKTtjPWgoYixjKTtiPWMuZnVsbE5hbWU7cmV0dXJuIShiIGluIG0pP2Qub25FcnJvcihOKFwibm90bG9hZGVkXCIsXCJNb2R1bGUgbmFtZSAnXCIrYy5mdWxsTmFtZStcIicgaGFzIG5vdCBiZWVuIGxvYWRlZCB5ZXQgZm9yIGNvbnRleHQ6IFwiK2EpKTptW2JdfShiJiZiLmxlbmd0aHx8YykmJkEobnVsbCxiLGMsZik7aWYoIWcucmVxdWlyZVdhaXQpZm9yKDshZy5zY3JpcHRDb3VudCYmZy5wYXVzZWQubGVuZ3RoOylnLnRha2VHbG9iYWxRdWV1ZSgpLHcoKTtyZXR1cm4gZy5yZXF1aXJlfSx0YWtlR2xvYmFsUXVldWU6ZnVuY3Rpb24oKXtULmxlbmd0aCYmKGhhLmFwcGx5KGcuZGVmUXVldWUsW2cuZGVmUXVldWUubGVuZ3RoLTEsMF0uY29uY2F0KFQpKSxUPVtdKX0sY29tcGxldGVMb2FkOmZ1bmN0aW9uKGIpe3ZhciBhO2ZvcihnLnRha2VHbG9iYWxRdWV1ZSgpO1AubGVuZ3RoOylpZihhPVAuc2hpZnQoKSxhWzBdPT09bnVsbCl7YVswXT1iO2JyZWFrfWVsc2UgaWYoYVswXT09PWIpYnJlYWs7XHJcbmVsc2UgbihhKSxhPW51bGw7YT9uKGEpOm4oW2IsW10sYj09PVwianF1ZXJ5XCImJnR5cGVvZiBqUXVlcnkhPT1cInVuZGVmaW5lZFwiP2Z1bmN0aW9uKCl7cmV0dXJuIGpRdWVyeX06bnVsbF0pO2QuaXNBc3luYyYmKGcuc2NyaXB0Q291bnQtPTEpO3coKTtkLmlzQXN5bmN8fChnLnNjcmlwdENvdW50LT0xKX0sdG9Vcmw6ZnVuY3Rpb24oYSxjKXt2YXIgZD1hLmxhc3RJbmRleE9mKFwiLlwiKSxoPW51bGw7ZCE9PS0xJiYoaD1hLnN1YnN0cmluZyhkLGEubGVuZ3RoKSxhPWEuc3Vic3RyaW5nKDAsZCkpO3JldHVybiBnLm5hbWVUb1VybChhLGgsYyl9LG5hbWVUb1VybDpmdW5jdGlvbihhLGgsZil7dmFyIGosayxpLGUsbT1nLmNvbmZpZyxhPWMoYSxmJiZmLmZ1bGxOYW1lKTtpZihkLmpzRXh0UmVnRXhwLnRlc3QoYSkpaD1hKyhoP2g6XCJcIik7ZWxzZXtqPW0ucGF0aHM7az1tLnBrZ3M7Zj1hLnNwbGl0KFwiL1wiKTtmb3IoZT1mLmxlbmd0aDtlPjA7ZS0tKWlmKGk9Zi5zbGljZSgwLGUpLmpvaW4oXCIvXCIpLFxyXG5qW2ldKXtmLnNwbGljZSgwLGUsaltpXSk7YnJlYWt9ZWxzZSBpZihpPWtbaV0pe2E9YT09PWkubmFtZT9pLmxvY2F0aW9uK1wiL1wiK2kubWFpbjppLmxvY2F0aW9uO2Yuc3BsaWNlKDAsZSxhKTticmVha31oPWYuam9pbihcIi9cIikrKGh8fFwiLmpzXCIpO2g9KGguY2hhckF0KDApPT09XCIvXCJ8fGgubWF0Y2goL15cXHcrOi8pP1wiXCI6bS5iYXNlVXJsKStofXJldHVybiBtLnVybEFyZ3M/aCsoKGguaW5kZXhPZihcIj9cIik9PT0tMT9cIj9cIjpcIiZcIikrbS51cmxBcmdzKTpofX07Zy5qUXVlcnlDaGVjaz1WO2cucmVzdW1lPXc7cmV0dXJuIGd9ZnVuY3Rpb24gaWEoKXt2YXIgYSxjLGQ7aWYobiYmbi5yZWFkeVN0YXRlPT09XCJpbnRlcmFjdGl2ZVwiKXJldHVybiBuO2E9ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7Zm9yKGM9YS5sZW5ndGgtMTtjPi0xJiYoZD1hW2NdKTtjLS0paWYoZC5yZWFkeVN0YXRlPT09XCJpbnRlcmFjdGl2ZVwiKXJldHVybiBuPWQ7cmV0dXJuIG51bGx9dmFyIGphPVxyXG4vKFxcL1xcKihbXFxzXFxTXSo/KVxcKlxcL3woW146XXxeKVxcL1xcLyguKikkKS9tZyxrYT0vcmVxdWlyZVxcKFxccypbXCInXShbXidcIlxcc10rKVtcIiddXFxzKlxcKS9nLGVhPS9eXFwuXFwvLyxhYT0vXFwuanMkLyxNPU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcscj1BcnJheS5wcm90b3R5cGUsZ2E9ci5zbGljZSxoYT1yLnNwbGljZSxHPSEhKHR5cGVvZiB3aW5kb3chPT1cInVuZGVmaW5lZFwiJiZuYXZpZ2F0b3ImJmRvY3VtZW50KSxjYT0hRyYmdHlwZW9mIGltcG9ydFNjcmlwdHMhPT1cInVuZGVmaW5lZFwiLGxhPUcmJm5hdmlnYXRvci5wbGF0Zm9ybT09PVwiUExBWVNUQVRJT04gM1wiPy9eY29tcGxldGUkLzovXihjb21wbGV0ZXxsb2FkZWQpJC8sZGE9dHlwZW9mIG9wZXJhIT09XCJ1bmRlZmluZWRcIiYmb3BlcmEudG9TdHJpbmcoKT09PVwiW29iamVjdCBPcGVyYV1cIixLPXt9LEQ9e30sVD1bXSxuPW51bGwsWD0wLE89ITEsZCxyPXt9LEksdix0LHgsdSx5LHosSCxBLFYsVztpZih0eXBlb2YgZGVmaW5lPT09XCJ1bmRlZmluZWRcIil7aWYodHlwZW9mIHJlcXVpcmVqcyE9PVxyXG5cInVuZGVmaW5lZFwiKWlmKEoocmVxdWlyZWpzKSlyZXR1cm47ZWxzZSByPXJlcXVpcmVqcyxyZXF1aXJlanM9dm9pZCAwO3R5cGVvZiByZXF1aXJlIT09XCJ1bmRlZmluZWRcIiYmIUoocmVxdWlyZSkmJihyPXJlcXVpcmUscmVxdWlyZT12b2lkIDApO2Q9cmVxdWlyZWpzPWZ1bmN0aW9uKGEsYyxkKXt2YXIgaz1cIl9cIixqOyFFKGEpJiZ0eXBlb2YgYSE9PVwic3RyaW5nXCImJihqPWEsRShjKT8oYT1jLGM9ZCk6YT1bXSk7aWYoaiYmai5jb250ZXh0KWs9ai5jb250ZXh0O2Q9RFtrXXx8KERba109ZmEoaykpO2omJmQuY29uZmlndXJlKGopO3JldHVybiBkLnJlcXVpcmUoYSxjKX07ZC5jb25maWc9ZnVuY3Rpb24oYSl7cmV0dXJuIGQoYSl9O3JlcXVpcmV8fChyZXF1aXJlPWQpO2QudG9Vcmw9ZnVuY3Rpb24oYSl7cmV0dXJuIEQuXy50b1VybChhKX07ZC52ZXJzaW9uPVwiMS4wLjNcIjtkLmpzRXh0UmVnRXhwPS9eXFwvfDp8XFw/fFxcLmpzJC87dj1kLnM9e2NvbnRleHRzOkQsc2tpcEFzeW5jOnt9fTtpZihkLmlzQXN5bmM9XHJcbmQuaXNCcm93c2VyPUcpaWYodD12LmhlYWQ9ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLHg9ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJiYXNlXCIpWzBdKXQ9di5oZWFkPXgucGFyZW50Tm9kZTtkLm9uRXJyb3I9ZnVuY3Rpb24oYSl7dGhyb3cgYTt9O2QubG9hZD1mdW5jdGlvbihhLGMsaCl7ZC5yZXNvdXJjZXNSZWFkeSghMSk7YS5zY3JpcHRDb3VudCs9MTtkLmF0dGFjaChoLGEsYyk7aWYoYS5qUXVlcnkmJiFhLmpRdWVyeUluY3JlbWVudGVkKVUoYS5qUXVlcnksITApLGEualF1ZXJ5SW5jcmVtZW50ZWQ9ITB9O2RlZmluZT1mdW5jdGlvbihhLGMsZCl7dmFyIGssajt0eXBlb2YgYSE9PVwic3RyaW5nXCImJihkPWMsYz1hLGE9bnVsbCk7RShjKXx8KGQ9YyxjPVtdKTshYy5sZW5ndGgmJkooZCkmJmQubGVuZ3RoJiYoZC50b1N0cmluZygpLnJlcGxhY2UoamEsXCJcIikucmVwbGFjZShrYSxmdW5jdGlvbihhLGQpe2MucHVzaChkKX0pLGM9KGQubGVuZ3RoPT09XHJcbjE/W1wicmVxdWlyZVwiXTpbXCJyZXF1aXJlXCIsXCJleHBvcnRzXCIsXCJtb2R1bGVcIl0pLmNvbmNhdChjKSk7aWYoTyYmKGs9SXx8aWEoKSkpYXx8KGE9ay5nZXRBdHRyaWJ1dGUoXCJkYXRhLXJlcXVpcmVtb2R1bGVcIikpLGo9RFtrLmdldEF0dHJpYnV0ZShcImRhdGEtcmVxdWlyZWNvbnRleHRcIildOyhqP2ouZGVmUXVldWU6VCkucHVzaChbYSxjLGRdKX07ZGVmaW5lLmFtZD17bXVsdGl2ZXJzaW9uOiEwLHBsdWdpbnM6ITAsalF1ZXJ5OiEwfTtkLmV4ZWM9ZnVuY3Rpb24oYSl7cmV0dXJuIGV2YWwoYSl9O2QuZXhlY0NiPWZ1bmN0aW9uKGEsYyxkLGspe3JldHVybiBjLmFwcGx5KGssZCl9O2QuYWRkU2NyaXB0VG9Eb209ZnVuY3Rpb24oYSl7ST1hO3g/dC5pbnNlcnRCZWZvcmUoYSx4KTp0LmFwcGVuZENoaWxkKGEpO0k9bnVsbH07ZC5vblNjcmlwdExvYWQ9ZnVuY3Rpb24oYSl7dmFyIGM9YS5jdXJyZW50VGFyZ2V0fHxhLnNyY0VsZW1lbnQsaDtpZihhLnR5cGU9PT1cImxvYWRcInx8YyYmbGEudGVzdChjLnJlYWR5U3RhdGUpKW49XHJcbm51bGwsYT1jLmdldEF0dHJpYnV0ZShcImRhdGEtcmVxdWlyZWNvbnRleHRcIiksaD1jLmdldEF0dHJpYnV0ZShcImRhdGEtcmVxdWlyZW1vZHVsZVwiKSxEW2FdLmNvbXBsZXRlTG9hZChoKSxjLmRldGFjaEV2ZW50JiYhZGE/Yy5kZXRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGQub25TY3JpcHRMb2FkKTpjLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsZC5vblNjcmlwdExvYWQsITEpfTtkLmF0dGFjaD1mdW5jdGlvbihhLGMsaCxrLGosbil7dmFyIG87aWYoRylyZXR1cm4gaz1rfHxkLm9uU2NyaXB0TG9hZCxvPWMmJmMuY29uZmlnJiZjLmNvbmZpZy54aHRtbD9kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCIsXCJodG1sOnNjcmlwdFwiKTpkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpLG8udHlwZT1qfHxcInRleHQvamF2YXNjcmlwdFwiLG8uY2hhcnNldD1cInV0Zi04XCIsby5hc3luYz0hdi5za2lwQXN5bmNbYV0sYyYmby5zZXRBdHRyaWJ1dGUoXCJkYXRhLXJlcXVpcmVjb250ZXh0XCIsXHJcbmMuY29udGV4dE5hbWUpLG8uc2V0QXR0cmlidXRlKFwiZGF0YS1yZXF1aXJlbW9kdWxlXCIsaCksby5hdHRhY2hFdmVudCYmIWRhPyhPPSEwLG4/by5vbnJlYWR5c3RhdGVjaGFuZ2U9ZnVuY3Rpb24oKXtpZihvLnJlYWR5U3RhdGU9PT1cImxvYWRlZFwiKW8ub25yZWFkeXN0YXRlY2hhbmdlPW51bGwsby5hdHRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGspLG4obyl9Om8uYXR0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixrKSk6by5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLGssITEpLG8uc3JjPWEsbnx8ZC5hZGRTY3JpcHRUb0RvbShvKSxvO2Vsc2UgY2EmJihpbXBvcnRTY3JpcHRzKGEpLGMuY29tcGxldGVMb2FkKGgpKTtyZXR1cm4gbnVsbH07aWYoRyl7dT1kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtmb3IoSD11Lmxlbmd0aC0xO0g+LTEmJih5PXVbSF0pO0gtLSl7aWYoIXQpdD15LnBhcmVudE5vZGU7aWYoej15LmdldEF0dHJpYnV0ZShcImRhdGEtbWFpblwiKSl7aWYoIXIuYmFzZVVybCl1PVxyXG56LnNwbGl0KFwiL1wiKSx5PXUucG9wKCksdT11Lmxlbmd0aD91LmpvaW4oXCIvXCIpK1wiL1wiOlwiLi9cIixyLmJhc2VVcmw9dSx6PXkucmVwbGFjZShhYSxcIlwiKTtyLmRlcHM9ci5kZXBzP3IuZGVwcy5jb25jYXQoeik6W3pdO2JyZWFrfX19ZC5jaGVja1JlYWR5U3RhdGU9ZnVuY3Rpb24oKXt2YXIgYT12LmNvbnRleHRzLGM7Zm9yKGMgaW4gYSlpZighKGMgaW4gSykmJmFbY10ud2FpdENvdW50KXJldHVybjtkLnJlc291cmNlc1JlYWR5KCEwKX07ZC5yZXNvdXJjZXNSZWFkeT1mdW5jdGlvbihhKXt2YXIgYyxoO2QucmVzb3VyY2VzRG9uZT1hO2lmKGQucmVzb3VyY2VzRG9uZSlmb3IoaCBpbiBhPXYuY29udGV4dHMsYSlpZighKGggaW4gSykmJihjPWFbaF0sYy5qUXVlcnlJbmNyZW1lbnRlZCkpVShjLmpRdWVyeSwhMSksYy5qUXVlcnlJbmNyZW1lbnRlZD0hMX07ZC5wYWdlTG9hZGVkPWZ1bmN0aW9uKCl7aWYoZG9jdW1lbnQucmVhZHlTdGF0ZSE9PVwiY29tcGxldGVcIilkb2N1bWVudC5yZWFkeVN0YXRlPVxyXG5cImNvbXBsZXRlXCJ9O2lmKEcmJmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXImJiFkb2N1bWVudC5yZWFkeVN0YXRlKWRvY3VtZW50LnJlYWR5U3RhdGU9XCJsb2FkaW5nXCIsd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsZC5wYWdlTG9hZGVkLCExKTtkKHIpO2lmKGQuaXNBc3luYyYmdHlwZW9mIHNldFRpbWVvdXQhPT1cInVuZGVmaW5lZFwiKUE9di5jb250ZXh0c1tyLmNvbnRleHR8fFwiX1wiXSxBLnJlcXVpcmVXYWl0PSEwLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtBLnJlcXVpcmVXYWl0PSExO0EudGFrZUdsb2JhbFF1ZXVlKCk7QS5zY3JpcHRDb3VudHx8QS5yZXN1bWUoKTtkLmNoZWNrUmVhZHlTdGF0ZSgpfSwwKX19KSgpO1xyXG4iLCIvKlxyXG4gUmVxdWlyZUpTIHRleHQgMS4wLjIgQ29weXJpZ2h0IChjKSAyMDEwLTIwMTEsIFRoZSBEb2pvIEZvdW5kYXRpb24gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cclxuIEF2YWlsYWJsZSB2aWEgdGhlIE1JVCBvciBuZXcgQlNEIGxpY2Vuc2UuXHJcbiBzZWU6IGh0dHA6Ly9naXRodWIuY29tL2pyYnVya2UvcmVxdWlyZWpzIGZvciBkZXRhaWxzXHJcbiovXHJcbihmdW5jdGlvbigpe3ZhciBrPVtcIk1zeG1sMi5YTUxIVFRQXCIsXCJNaWNyb3NvZnQuWE1MSFRUUFwiLFwiTXN4bWwyLlhNTEhUVFAuNC4wXCJdLG49L15cXHMqPFxcP3htbChcXHMpK3ZlcnNpb249W1xcJ1xcXCJdKFxcZCkqLihcXGQpKltcXCdcXFwiXShcXHMpKlxcPz4vaW0sbz0vPGJvZHlbXj5dKj5cXHMqKFtcXHNcXFNdKylcXHMqPFxcL2JvZHk+L2ltLGk9dHlwZW9mIGxvY2F0aW9uIT09XCJ1bmRlZmluZWRcIiYmbG9jYXRpb24uaHJlZixwPWkmJmxvY2F0aW9uLnByb3RvY29sJiZsb2NhdGlvbi5wcm90b2NvbC5yZXBsYWNlKC9cXDovLFwiXCIpLHE9aSYmbG9jYXRpb24uaG9zdG5hbWUscj1pJiYobG9jYXRpb24ucG9ydHx8dm9pZCAwKSxqPVtdO2RlZmluZShmdW5jdGlvbigpe3ZhciBnLGgsbDt0eXBlb2Ygd2luZG93IT09XCJ1bmRlZmluZWRcIiYmd2luZG93Lm5hdmlnYXRvciYmd2luZG93LmRvY3VtZW50P2g9ZnVuY3Rpb24oYSxjKXt2YXIgYj1nLmNyZWF0ZVhocigpO2Iub3BlbihcIkdFVFwiLGEsITApO2Iub25yZWFkeXN0YXRlY2hhbmdlPVxyXG5mdW5jdGlvbigpe2IucmVhZHlTdGF0ZT09PTQmJmMoYi5yZXNwb25zZVRleHQpfTtiLnNlbmQobnVsbCl9OnR5cGVvZiBwcm9jZXNzIT09XCJ1bmRlZmluZWRcIiYmcHJvY2Vzcy52ZXJzaW9ucyYmcHJvY2Vzcy52ZXJzaW9ucy5ub2RlPyhsPXJlcXVpcmUubm9kZVJlcXVpcmUoXCJmc1wiKSxoPWZ1bmN0aW9uKGEsYyl7YyhsLnJlYWRGaWxlU3luYyhhLFwidXRmOFwiKSl9KTp0eXBlb2YgUGFja2FnZXMhPT1cInVuZGVmaW5lZFwiJiYoaD1mdW5jdGlvbihhLGMpe3ZhciBiPW5ldyBqYXZhLmlvLkZpbGUoYSksZT1qYXZhLmxhbmcuU3lzdGVtLmdldFByb3BlcnR5KFwibGluZS5zZXBhcmF0b3JcIiksYj1uZXcgamF2YS5pby5CdWZmZXJlZFJlYWRlcihuZXcgamF2YS5pby5JbnB1dFN0cmVhbVJlYWRlcihuZXcgamF2YS5pby5GaWxlSW5wdXRTdHJlYW0oYiksXCJ1dGYtOFwiKSksZCxmLGc9XCJcIjt0cnl7ZD1uZXcgamF2YS5sYW5nLlN0cmluZ0J1ZmZlcjsoZj1iLnJlYWRMaW5lKCkpJiZmLmxlbmd0aCgpJiZcclxuZi5jaGFyQXQoMCk9PT02NTI3OSYmKGY9Zi5zdWJzdHJpbmcoMSkpO2ZvcihkLmFwcGVuZChmKTsoZj1iLnJlYWRMaW5lKCkpIT09bnVsbDspZC5hcHBlbmQoZSksZC5hcHBlbmQoZik7Zz1TdHJpbmcoZC50b1N0cmluZygpKX1maW5hbGx5e2IuY2xvc2UoKX1jKGcpfSk7cmV0dXJuIGc9e3ZlcnNpb246XCIxLjAuMlwiLHN0cmlwOmZ1bmN0aW9uKGEpe2lmKGEpe3ZhciBhPWEucmVwbGFjZShuLFwiXCIpLGM9YS5tYXRjaChvKTtjJiYoYT1jWzFdKX1lbHNlIGE9XCJcIjtyZXR1cm4gYX0sanNFc2NhcGU6ZnVuY3Rpb24oYSl7cmV0dXJuIGEucmVwbGFjZSgvKFsnXFxcXF0pL2csXCJcXFxcJDFcIikucmVwbGFjZSgvW1xcZl0vZyxcIlxcXFxmXCIpLnJlcGxhY2UoL1tcXGJdL2csXCJcXFxcYlwiKS5yZXBsYWNlKC9bXFxuXS9nLFwiXFxcXG5cIikucmVwbGFjZSgvW1xcdF0vZyxcIlxcXFx0XCIpLnJlcGxhY2UoL1tcXHJdL2csXCJcXFxcclwiKX0sY3JlYXRlWGhyOmZ1bmN0aW9uKCl7dmFyIGEsYyxiO2lmKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCE9PVxyXG5cInVuZGVmaW5lZFwiKXJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3Q7ZWxzZSBmb3IoYz0wO2M8MztjKyspe2I9a1tjXTt0cnl7YT1uZXcgQWN0aXZlWE9iamVjdChiKX1jYXRjaChlKXt9aWYoYSl7az1bYl07YnJlYWt9fWlmKCFhKXRocm93IEVycm9yKFwiY3JlYXRlWGhyKCk6IFhNTEh0dHBSZXF1ZXN0IG5vdCBhdmFpbGFibGVcIik7cmV0dXJuIGF9LGdldDpoLHBhcnNlTmFtZTpmdW5jdGlvbihhKXt2YXIgYz0hMSxiPWEuaW5kZXhPZihcIi5cIiksZT1hLnN1YnN0cmluZygwLGIpLGE9YS5zdWJzdHJpbmcoYisxLGEubGVuZ3RoKSxiPWEuaW5kZXhPZihcIiFcIik7YiE9PS0xJiYoYz1hLnN1YnN0cmluZyhiKzEsYS5sZW5ndGgpLGM9Yz09PVwic3RyaXBcIixhPWEuc3Vic3RyaW5nKDAsYikpO3JldHVybnttb2R1bGVOYW1lOmUsZXh0OmEsc3RyaXA6Y319LHhkUmVnRXhwOi9eKChcXHcrKVxcOik/XFwvXFwvKFteXFwvXFxcXF0rKS8sdXNlWGhyOmZ1bmN0aW9uKGEsYyxiLGUpe3ZhciBkPWcueGRSZWdFeHAuZXhlYyhhKSxcclxuZjtpZighZClyZXR1cm4hMDthPWRbMl07ZD1kWzNdO2Q9ZC5zcGxpdChcIjpcIik7Zj1kWzFdO2Q9ZFswXTtyZXR1cm4oIWF8fGE9PT1jKSYmKCFkfHxkPT09YikmJighZiYmIWR8fGY9PT1lKX0sZmluaXNoTG9hZDpmdW5jdGlvbihhLGMsYixlLGQpe2I9Yz9nLnN0cmlwKGIpOmI7ZC5pc0J1aWxkJiYoalthXT1iKTtlKGIpfSxsb2FkOmZ1bmN0aW9uKGEsYyxiLGUpe2lmKGUuaXNCdWlsZCYmIWUuaW5saW5lVGV4dCliKCk7ZWxzZXt2YXIgZD1nLnBhcnNlTmFtZShhKSxmPWQubW9kdWxlTmFtZStcIi5cIitkLmV4dCxtPWMudG9VcmwoZiksaD1lJiZlLnRleHQmJmUudGV4dC51c2VYaHJ8fGcudXNlWGhyOyFpfHxoKG0scCxxLHIpP2cuZ2V0KG0sZnVuY3Rpb24oYyl7Zy5maW5pc2hMb2FkKGEsZC5zdHJpcCxjLGIsZSl9KTpjKFtmXSxmdW5jdGlvbihhKXtnLmZpbmlzaExvYWQoZC5tb2R1bGVOYW1lK1wiLlwiK2QuZXh0LGQuc3RyaXAsYSxiLGUpfSl9fSx3cml0ZTpmdW5jdGlvbihhLGMsYil7aWYoYyBpblxyXG5qKXt2YXIgZT1nLmpzRXNjYXBlKGpbY10pO2IuYXNNb2R1bGUoYStcIiFcIitjLFwiZGVmaW5lKGZ1bmN0aW9uICgpIHsgcmV0dXJuICdcIitlK1wiJzt9KTtcXG5cIil9fSx3cml0ZUZpbGU6ZnVuY3Rpb24oYSxjLGIsZSxkKXt2YXIgYz1nLnBhcnNlTmFtZShjKSxmPWMubW9kdWxlTmFtZStcIi5cIitjLmV4dCxoPWIudG9VcmwoYy5tb2R1bGVOYW1lK1wiLlwiK2MuZXh0KStcIi5qc1wiO2cubG9hZChmLGIsZnVuY3Rpb24oKXt2YXIgYj1mdW5jdGlvbihhKXtyZXR1cm4gZShoLGEpfTtiLmFzTW9kdWxlPWZ1bmN0aW9uKGEsYil7cmV0dXJuIGUuYXNNb2R1bGUoYSxoLGIpfTtnLndyaXRlKGEsZixiLGQpfSxkKX19fSl9KSgpO1xyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFwcGluZ1wiLCB7XHJcbiAgICBNYXA6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB7fTtcclxuXHJcbiAgICAgICAgdGhpcy5zb3VyY2VUeXBlID0gbnVsbDtcclxuICAgICAgICB0aGlzLnRhcmdldFR5cGUgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnNvdXJjZSA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc291cmNlVHlwZSA9IHR5cGU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgICAgICBzZWxmLnRhcmdldFR5cGUgPSB0eXBlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucHJvcGVydHkgPSBmdW5jdGlvbiAocHJvcGVydHkpIHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnR5TWFwID0gQmlmcm9zdC5tYXBwaW5nLlByb3BlcnR5TWFwLmNyZWF0ZSh7IHNvdXJjZVByb3BlcnR5OiBwcm9wZXJ0eSB9KTtcclxuICAgICAgICAgICAgcHJvcGVydGllc1twcm9wZXJ0eV0gPSBwcm9wZXJ0eU1hcDtcclxuICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5TWFwO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY2FuTWFwUHJvcGVydHkgPSBmdW5jdGlvbiAocHJvcGVydHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMubWFwUHJvcGVydHkgPSBmdW5jdGlvbiAocHJvcGVydHksIHNvdXJjZSwgdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmNhbk1hcFByb3BlcnR5KHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllc1twcm9wZXJ0eV0ubWFwKHNvdXJjZSwgdGFyZ2V0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFwcGluZ1wiLCB7XHJcbiAgICBtYXBwZXI6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKHR5cGVDb252ZXJ0ZXJzLCBtYXBzKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRUeXBlQXNTdHJpbmcodG8sIHByb3BlcnR5LCB2YWx1ZSwgdG9WYWx1ZSkge1xyXG4gICAgICAgICAgICB2YXIgdHlwZUFzU3RyaW5nID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHZhbHVlKSAmJlxyXG4gICAgICAgICAgICAgICAgIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodG9WYWx1ZSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUuY29uc3RydWN0b3IgIT09IHRvVmFsdWUuY29uc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlQXNTdHJpbmcgPSB0b1ZhbHVlLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkubWF0Y2goL2Z1bmN0aW9uXFwwNDArKFxcdyopLylbMV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh0b1twcm9wZXJ0eV0pICYmXHJcbiAgICAgICAgICAgICAgICAhQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh0b1twcm9wZXJ0eV0uX3R5cGVBc1N0cmluZykpIHtcclxuICAgICAgICAgICAgICAgIHR5cGVBc1N0cmluZyA9IHRvW3Byb3BlcnR5XS5fdHlwZUFzU3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0eXBlQXNTdHJpbmc7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNvcHlQcm9wZXJ0aWVzKG1hcHBlZFByb3BlcnRpZXMsIGZyb20sIHRvLCBtYXApIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZnJvbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5LmluZGV4T2YoXCJfXCIpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzVW5kZWZpbmVkKGZyb21bcHJvcGVydHldKSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC5pc09iamVjdChmcm9tW3Byb3BlcnR5XSkgJiYgQmlmcm9zdC5pc09iamVjdCh0b1twcm9wZXJ0eV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvcHlQcm9wZXJ0aWVzKG1hcHBlZFByb3BlcnRpZXMsIGZyb21bcHJvcGVydHldLCB0b1twcm9wZXJ0eV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChtYXApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwLmNhbk1hcFByb3BlcnR5KHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcC5tYXBQcm9wZXJ0eShwcm9wZXJ0eSwgZnJvbSwgdG8pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwcGVkUHJvcGVydGllcy5pbmRleE9mKHByb3BlcnR5KSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwcGVkUHJvcGVydGllcy5wdXNoKHByb3BlcnR5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNVbmRlZmluZWQodG9bcHJvcGVydHldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0ga28udW53cmFwKGZyb21bcHJvcGVydHldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b1ZhbHVlID0ga28udW53cmFwKHRvW3Byb3BlcnR5XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGVBc1N0cmluZyA9IGdldFR5cGVBc1N0cmluZyh0bywgcHJvcGVydHksIHZhbHVlLCB0b1ZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodHlwZUFzU3RyaW5nKSAmJiAhQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHR5cGVDb252ZXJ0ZXJzLmNvbnZlcnRGcm9tKHZhbHVlLnRvU3RyaW5nKCksIHR5cGVBc1N0cmluZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hcHBlZFByb3BlcnRpZXMuaW5kZXhPZihwcm9wZXJ0eSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwcGVkUHJvcGVydGllcy5wdXNoKHByb3BlcnR5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZSh0b1twcm9wZXJ0eV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFrby5pc1dyaXRlYWJsZU9ic2VydmFibGUodG9bcHJvcGVydHldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvW3Byb3BlcnR5XSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvW3Byb3BlcnR5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBtYXBTaW5nbGVJbnN0YW5jZSh0eXBlLCBkYXRhLCBtYXBwZWRQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoZGF0YS5fc291cmNlVHlwZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gZXZhbChkYXRhLl9zb3VyY2VUeXBlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gdHlwZS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWFwID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmIChtYXBzLmhhc01hcEZvcihkYXRhLl90eXBlLCB0eXBlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcCA9IG1hcHMuZ2V0TWFwRm9yKGRhdGEuX3R5cGUsIHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvcHlQcm9wZXJ0aWVzKG1hcHBlZFByb3BlcnRpZXMsIGRhdGEsIGluc3RhbmNlLCBtYXApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG1hcE11bHRpcGxlSW5zdGFuY2VzKHR5cGUsIGRhdGEsIG1hcHBlZFByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgdmFyIG1hcHBlZEluc3RhbmNlcyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBzaW5nbGVEYXRhID0gZGF0YVtpXTtcclxuICAgICAgICAgICAgICAgIG1hcHBlZEluc3RhbmNlcy5wdXNoKG1hcFNpbmdsZUluc3RhbmNlKHR5cGUsIHNpbmdsZURhdGEsIG1hcHBlZFByb3BlcnRpZXMpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbWFwcGVkSW5zdGFuY2VzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5tYXAgPSBmdW5jdGlvbiAodHlwZSwgZGF0YSkge1xyXG4gICAgICAgICAgICB2YXIgbWFwcGVkUHJvcGVydGllcyA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc0FycmF5KGRhdGEpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFwTXVsdGlwbGVJbnN0YW5jZXModHlwZSwgZGF0YSwgbWFwcGVkUHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFwU2luZ2xlSW5zdGFuY2UodHlwZSwgZGF0YSwgbWFwcGVkUHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm1hcFRvSW5zdGFuY2UgPSBmdW5jdGlvbiAodGFyZ2V0VHlwZSwgZGF0YSwgdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHZhciBtYXBwZWRQcm9wZXJ0aWVzID0gW107XHJcblxyXG4gICAgICAgICAgICB2YXIgbWFwID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKG1hcHMuaGFzTWFwRm9yKGRhdGEuX3R5cGUsIHRhcmdldFR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICBtYXAgPSBtYXBzLmdldE1hcEZvcihkYXRhLl90eXBlLCB0YXJnZXRUeXBlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb3B5UHJvcGVydGllcyhtYXBwZWRQcm9wZXJ0aWVzLCBkYXRhLCB0YXJnZXQsIG1hcCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbWFwcGVkUHJvcGVydGllcztcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIudHlwZXMubWFwcGVyID0gQmlmcm9zdC5tYXBwaW5nLm1hcHBlcjsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFwcGluZ1wiLCB7XHJcbiAgICBtYXBzOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBtYXBzID0ge307XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldEtleUZyb20oc291cmNlVHlwZSwgdGFyZ2V0VHlwZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc291cmNlVHlwZS5fdHlwZUlkICsgXCIgLSBcIiArIHRhcmdldFR5cGUuX3R5cGVJZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBleHRlbmRlcnMgPSBCaWZyb3N0Lm1hcHBpbmcuTWFwLmdldEV4dGVuZGVycygpO1xyXG5cclxuICAgICAgICBleHRlbmRlcnMuZm9yRWFjaChmdW5jdGlvbiAoZXh0ZW5kZXIpIHtcclxuICAgICAgICAgICAgdmFyIG1hcCA9IGV4dGVuZGVyLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gZ2V0S2V5RnJvbShtYXAuc291cmNlVHlwZSwgbWFwLnRhcmdldFR5cGUpO1xyXG4gICAgICAgICAgICBtYXBzW2tleV0gPSBtYXA7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuaGFzTWFwRm9yID0gZnVuY3Rpb24gKHNvdXJjZVR5cGUsIHRhcmdldFR5cGUpIHtcclxuICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoc291cmNlVHlwZSkgfHwgQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh0YXJnZXRUeXBlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBnZXRLZXlGcm9tKHNvdXJjZVR5cGUsIHRhcmdldFR5cGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gbWFwcy5oYXNPd25Qcm9wZXJ0eShrZXkpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0TWFwRm9yID0gZnVuY3Rpb24gKHNvdXJjZVR5cGUsIHRhcmdldFR5cGUpIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuaGFzTWFwRm9yKHNvdXJjZVR5cGUsIHRhcmdldFR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gZ2V0S2V5RnJvbShzb3VyY2VUeXBlLCB0YXJnZXRUeXBlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtYXBzW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcHBpbmdcIiwge1xyXG4gICAgTWlzc2luZ1Byb3BlcnR5U3RyYXRlZ3k6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXBwaW5nXCIsIHtcclxuICAgIFByb3BlcnR5TWFwOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uIChzb3VyY2VQcm9wZXJ0eSwgdHlwZUNvbnZlcnRlcnMpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuc3RyYXRlZ3kgPSBudWxsO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lmTWlzc2luZ1Byb3BlcnR5U3RyYXRlZ3koKSB7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHNlbGYuc3RyYXRlZ3kpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBCaWZyb3N0Lm1hcHBpbmcuTWlzc2luZ1Byb3BlcnR5U3RyYXRlZ3kuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudG8gPSBmdW5jdGlvbiAodGFyZ2V0UHJvcGVydHkpIHtcclxuICAgICAgICAgICAgc2VsZi5zdHJhdGVneSA9IGZ1bmN0aW9uIChzb3VyY2UsIHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0ga28udW53cmFwKHNvdXJjZVtzb3VyY2VQcm9wZXJ0eV0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldFZhbHVlID0ga28udW53cmFwKHRhcmdldFt0YXJnZXRQcm9wZXJ0eV0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0eXBlQXNTdHJpbmcgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh0YXJnZXRWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmNvbnN0cnVjdG9yICE9PSB0YXJnZXRWYWx1ZS5jb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZUFzU3RyaW5nID0gdGFyZ2V0VmFsdWUuY29uc3RydWN0b3IubmFtZS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodGFyZ2V0W3RhcmdldFByb3BlcnR5XS5fdHlwZUFzU3RyaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZUFzU3RyaW5nID0gdGFyZ2V0W3RhcmdldFByb3BlcnR5XS5fdHlwZUFzU3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodHlwZUFzU3RyaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHR5cGVDb252ZXJ0ZXJzLmNvbnZlcnRGcm9tKHZhbHVlLnRvU3RyaW5nKCksIHR5cGVBc1N0cmluZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChrby5pc09ic2VydmFibGUodGFyZ2V0W3RhcmdldFByb3BlcnR5XSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRbdGFyZ2V0UHJvcGVydHldKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W3RhcmdldFByb3BlcnR5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMubWFwID0gZnVuY3Rpb24gKHNvdXJjZSwgdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRocm93SWZNaXNzaW5nUHJvcGVydHlTdHJhdGVneSgpO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5zdHJhdGVneShzb3VyY2UsIHRhcmdldCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXJrdXBcIiwge1xyXG4gICAgQXR0YWNoZWRQcm9wZXJ0eTogQmlmcm9zdC52YWx1ZXMuVmFsdWVDb25zdW1lci5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY2FuTm90aWZ5Q2hhbmdlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcyA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY29uc3VtZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFya3VwXCIsIHtcclxuICAgIGF0dHJpYnV0ZVZhbHVlczogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKHZhbHVlUHJvdmlkZXJQYXJzZXIpIHtcclxuICAgICAgICB0aGlzLmV4cGFuZEZvciA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcblxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFya3VwXCIsIHtcclxuICAgIEJpbmRpbmdDb250ZXh0OiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5jaGFuZ2VkID0gQmlmcm9zdC5FdmVudC5jcmVhdGUoKTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXJrdXBcIiwge1xyXG4gICAgYmluZGluZ0NvbnRleHRNYW5hZ2VyOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZW5zdXJlID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgc3BlY2lmaWMgYmluZGluZ0NvbnRleHQgZm9yIGVsZW1lbnQsIHJldHVybiBpdFxyXG5cclxuICAgICAgICAgICAgLy8gSWYgbm8gc3BlY2lmaWMsIGZpbmQgbmVhcmVzdCBmcm9tIHBhcmVudCBlbGVtZW50XHJcblxyXG4gICAgICAgICAgICAvLyBJZiBubyBwYXJlbnQgZWxlbWVudCBoYXMgb25lIGVpdGhlciwgdGhlcmUgaXMgbm9uZSAtIHJldHVybiBudWxsXHJcblxyXG4gICAgICAgICAgICAvLyBJZiBlbGVtZW50IGhhcyBhbiBhdHRyaWJ1dGUgb2YgYmluZGluZ0NvbnRleHQgLSB3ZSBjYW4gbm93IGNoYW5nZSBpdCB0byB3aGF0IGl0IGlzIHBvaW50aW5nIGF0XHJcblxyXG4gICAgICAgICAgICAvLyBJZiBiaW5kaW5nQ29udGV4dCBjaGFuZ2VzIGR1ZSB0byBhIGJpbmRpbmcgYmVpbmcgcmVsYXRlZCB0byB0aGUgY29udGV4dCBmcm9tIHRoZSBhdHRyaWJ1dGUgb24gdGhlIGVsZW1lbnQsIGl0IHNob3VsZCBmaXJlIHRoZSBjaGFuZ2VkIHRoaW5nIG9uIHRoZSBiaW5kaW5nIGNvbnRleHRcclxuXHJcbiAgICAgICAgICAgIC8vIEluaGVyaXQgZnJvbSBwYXJlbnQgLSBhbHdheXMgLSBwYXJlbnQgaXMgcHJvdG90eXBlIG9mIGN1cnJlbnQsIHBvaW50IGJhY2sgdG8gcGFyZW50XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5oYXNGb3IgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldEZvciA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcblxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy5iaW5kaW5nQ29udGV4dE1hbmFnZXIgPSBCaWZyb3N0Lm1hcmt1cC5iaW5kaW5nQ29udGV4dE1hbmFnZXI7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcmt1cFwiLCB7XHJcbiAgICBDb250cm9sOiBCaWZyb3N0Lm1hcmt1cC5VSUVsZW1lbnQuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMucHJlcGFyZSA9IGZ1bmN0aW9uICh0eXBlLCBlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmaWxlID0gdHlwZS5fbmFtZXNwYWNlLl9wYXRoICsgdHlwZS5fbmFtZSArIFwiLmh0bWxcIjtcclxuICAgICAgICAgICAgcmVxdWlyZShbXCJ0ZXh0IVwiICsgZmlsZSArIFwiIXN0cmlwXCJdLCBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gdjtcclxuICAgICAgICAgICAgICAgIHNlbGYudGVtcGxhdGUgPSBjb250YWluZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcmt1cFwiLCB7XHJcbiAgICBlbGVtZW50TmFtaW5nOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldE5hbWVBbmROYW1lc3BhY2UoZWxlbWVudCkge1xyXG4gICAgICAgICAgICB2YXIgbmFtZXNwYWNlO1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IGVsZW1lbnQubG9jYWxOYW1lLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgbmFtZXNwYWNlU3BsaXQgPSBuYW1lLnNwbGl0KFwiOlwiKTtcclxuICAgICAgICAgICAgaWYgKG5hbWVzcGFjZVNwbGl0Lmxlbmd0aCA+IDIpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IEJpZnJvc3QubWFya3VwLk11bHRpcGxlTmFtZXNwYWNlc0luTmFtZU5vdEFsbG93ZWQuY3JlYXRlKHsgdGFnTmFtZTogbmFtZSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobmFtZXNwYWNlU3BsaXQubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lID0gbmFtZXNwYWNlU3BsaXRbMV07XHJcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2UgPSBuYW1lc3BhY2VTcGxpdFswXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IG5hbWVzcGFjZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMuZ2V0TmFtZXNwYWNlUHJlZml4Rm9yID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdmFyIG5hbWVBbmROYW1lc3BhY2UgPSBnZXROYW1lQW5kTmFtZXNwYWNlKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChuYW1lQW5kTmFtZXNwYWNlLm5hbWVzcGFjZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lQW5kTmFtZXNwYWNlLm5hbWVzcGFjZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldExvY2FsTmFtZUZvciA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBuYW1lQW5kTmFtZXNwYWNlID0gZ2V0TmFtZUFuZE5hbWVzcGFjZShlbGVtZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIG5hbWVBbmROYW1lc3BhY2UubmFtZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcmt1cFwiLCB7XHJcbiAgICBFbGVtZW50VmlzaXRvcjogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnZpc2l0ID0gZnVuY3Rpb24gKGVsZW1lbnQsIHJlc3VsdEFjdGlvbnMpIHtcclxuXHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXJrdXBcIiwge1xyXG4gICAgRWxlbWVudFZpc2l0b3JSZXN1bHRBY3Rpb25zOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXJrdXBcIiwge1xyXG4gICAgTXVsdGlwbGVOYW1lc3BhY2VzSW5OYW1lTm90QWxsb3dlZDogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAodGFnTmFtZSkge1xyXG4gICAgICAgIC8vXCJTeW50YXggZXJyb3I6IHRhZ25hbWUgJ1wiICsgbmFtZSArIFwiJyBoYXMgbXVsdGlwbGUgbmFtZXNwYWNlc1wiO1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcmt1cFwiLCB7XHJcbiAgICBNdWx0aXBsZVByb3BlcnR5UmVmZXJlbmNlc05vdEFsbG93ZWQ6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24odGFnTmFtZSkge1xyXG4gICAgICAgIC8vIFwiU3ludGF4IGVycm9yOiB0YWduYW1lICdcIituYW1lK1wiJyBoYXMgbXVsdGlwbGUgcHJvcGVydGllcyBpdHMgcmVmZXJyaW5nIHRvXCI7XHJcbiAgICB9KVxyXG59KTsgIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcmt1cFwiLCB7XHJcbiAgICBOYW1lc3BhY2VEZWZpbml0aW9uOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uIChwcmVmaXgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5wcmVmaXggPSBwcmVmaXg7XHJcblxyXG4gICAgICAgIHRoaXMudGFyZ2V0cyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmFkZFRhcmdldCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuICAgICAgICAgICAgc2VsZi50YXJnZXRzLnB1c2godGFyZ2V0KTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcmt1cFwiLCB7XHJcbiAgICBuYW1lc3BhY2VEZWZpbml0aW9uczogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uIChwcmVmaXgpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmluaXRpb24gPSBCaWZyb3N0Lm1hcmt1cC5OYW1lc3BhY2VEZWZpbml0aW9uLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBwcmVmaXg6IHByZWZpeCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWZpbml0aW9uO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFya3VwXCIsIHtcclxuICAgIG5hbWVzcGFjZXM6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uIChuYW1lc3BhY2VEZWZpbml0aW9ucywgZWxlbWVudE5hbWluZykge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgbnMgPSBcIm5zOlwiO1xyXG5cclxuICAgICAgICB0aGlzLmdsb2JhbCA9IG5hbWVzcGFjZURlZmluaXRpb25zLmNyZWF0ZShcIl9fZ2xvYmFsXCIpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBmaW5kTmFtZXNwYWNlRGVmaW5pdGlvbkluRWxlbWVudE9yUGFyZW50KHByZWZpeCwgZWxlbWVudCkge1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoZWxlbWVudC5fX25hbWVzcGFjZXMpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZm91bmQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5fX25hbWVzcGFjZXMuZm9yRWFjaChmdW5jdGlvbiAoZGVmaW5pdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWZpbml0aW9uLnByZWZpeCA9PT0gcHJlZml4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gZGVmaW5pdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChmb3VuZCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZvdW5kO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGVsZW1lbnQucGFyZW50RWxlbWVudCkgfHxcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQucGFyZW50RWxlbWVudC5jb25zdHJ1Y3RvciA9PT0gSFRNTEh0bWxFbGVtZW50KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBwYXJlbnRSZXN1bHQgPSBmaW5kTmFtZXNwYWNlRGVmaW5pdGlvbkluRWxlbWVudE9yUGFyZW50KHByZWZpeCwgZWxlbWVudC5wYXJlbnRFbGVtZW50KTtcclxuICAgICAgICAgICAgaWYgKHBhcmVudFJlc3VsdCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50UmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLmV4cGFuZE5hbWVzcGFjZURlZmluaXRpb25zID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgYXR0cmlidXRlSW5kZXggPSAwOyBhdHRyaWJ1dGVJbmRleCA8IGVsZW1lbnQuYXR0cmlidXRlcy5sZW5ndGg7IGF0dHJpYnV0ZUluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGUgPSBlbGVtZW50LmF0dHJpYnV0ZXNbYXR0cmlidXRlSW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgaWYoIGF0dHJpYnV0ZS5uYW1lLmluZGV4T2YobnMpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByZWZpeCA9IGF0dHJpYnV0ZS5uYW1lLnN1YnN0cihucy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBhdHRyaWJ1dGUudmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuYW1lc3BhY2VEZWZpbml0aW9uID0gZmluZE5hbWVzcGFjZURlZmluaXRpb25JbkVsZW1lbnRPclBhcmVudChwcmVmaXgsIGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKG5hbWVzcGFjZURlZmluaXRpb24pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGVsZW1lbnQuX19uYW1lc3BhY2VzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5fX25hbWVzcGFjZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2VEZWZpbml0aW9uID0gbmFtZXNwYWNlRGVmaW5pdGlvbnMuY3JlYXRlKHByZWZpeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuX19uYW1lc3BhY2VzLnB1c2gobmFtZXNwYWNlRGVmaW5pdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2VEZWZpbml0aW9uLmFkZFRhcmdldCh0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXNvbHZlRm9yID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdmFyIHByZWZpeCA9IGVsZW1lbnROYW1pbmcuZ2V0TmFtZXNwYWNlUHJlZml4Rm9yKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChwcmVmaXgpIHx8IHByZWZpeCA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZ2xvYmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBkZWZpbml0aW9uID0gZmluZE5hbWVzcGFjZURlZmluaXRpb25JbkVsZW1lbnRPclBhcmVudChwcmVmaXgsIGVsZW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVmaW5pdGlvbjtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcmt1cFwiLCB7XHJcbiAgICBOYW1pbmdSb290OiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnRhcmdldCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuZmluZCA9IGZ1bmN0aW9uIChuYW1lLCBlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChzZWxmLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBzZWxmLnRhcmdldDtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZShcIm5hbWVcIikgPT09IG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5oYXNDaGlsZE5vZGVzKCkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IGVsZW1lbnQuZmlyc3RDaGlsZDtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChjaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm91bmRFbGVtZW50ID0gc2VsZi5maW5kKG5hbWUsIGNoaWxkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kRWxlbWVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm91bmRFbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkID0gY2hpbGQubmV4dFNpYmxpbmc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFya3VwXCIsIHtcclxuICAgIE9iamVjdE1vZGVsRWxlbWVudFZpc2l0b3I6IEJpZnJvc3QubWFya3VwLkVsZW1lbnRWaXNpdG9yLmV4dGVuZChmdW5jdGlvbiAoZWxlbWVudE5hbWluZywgbmFtZXNwYWNlcywgb2JqZWN0TW9kZWxGYWN0b3J5LCBwcm9wZXJ0eUV4cGFuZGVyLCBVSUVsZW1lbnRQcmVwYXJlciwgYXR0cmlidXRlVmFsdWVzLCBiaW5kaW5nQ29udGV4dE1hbmFnZXIpIHtcclxuICAgICAgICB0aGlzLnZpc2l0ID0gZnVuY3Rpb24oZWxlbWVudCwgYWN0aW9ucykge1xyXG4gICAgICAgICAgICAvLyBUYWdzIDpcclxuICAgICAgICAgICAgLy8gIC0gdGFnIG5hbWVzIGF1dG9tYXRpY2FsbHkgbWF0Y2ggdHlwZSBuYW1lc1xyXG4gICAgICAgICAgICAvLyAgLSBkdWUgdG8gdGFnIG5hbWVzIGluIEhUTUwgZWxlbWVudHMgYmVpbmcgd2l0aG91dCBjYXNlIC0gdGhleSBiZWNvbWUgbG93ZXIgY2FzZSBpbiB0aGVcclxuICAgICAgICAgICAgLy8gICAgbG9jYWxuYW1lIHByb3BlcnR5LCB3ZSB3aWxsIGhhdmUgdG8gc2VhcmNoIGZvciB0eXBlIGJ5IGxvd2VyY2FzZVxyXG4gICAgICAgICAgICAvLyAgLSBtdWx0aXBsZSB0eXBlcyBmb3VuZCB3aXRoIGRpZmZlcmVudCBjYXNpbmcgaW4gc2FtZSBuYW1lc3BhY2Ugc2hvdWxkIHRocm93IGFuIGV4Y2VwdGlvblxyXG4gICAgICAgICAgICAvLyBOYW1lc3BhY2VzIDpcclxuICAgICAgICAgICAgLy8gIC0gc3BsaXQgYnkgJzonXHJcbiAgICAgICAgICAgIC8vICAtIGlmIG1vcmUgdGhhbiBvbmUgJzonIC0gdGhyb3cgYW4gZXhjZXB0aW9uXHJcbiAgICAgICAgICAgIC8vICAtIGlmIG5vIG5hbWVzcGFjZSBpcyBkZWZpbmVkLCB0cnkgdG8gcmVzb2x2ZSBpbiB0aGUgZ2xvYmFsIG5hbWVzcGFjZVxyXG4gICAgICAgICAgICAvLyAgLSBuYW1lc3BhY2VzIGluIHRoZSBvYmplY3QgbW9kZWwgY2FuIHBvaW50IHRvIG11bHRpcGxlIEphdmFTY3JpcHQgbmFtZXNwYWNlc1xyXG4gICAgICAgICAgICAvLyAgLSBtdWx0aXBsZSB0eXBlcyB3aXRoIHNhbWUgbmFtZSBpbiBuYW1lc3BhY2UgZ3JvdXBpbmdzIHNob3VsZCB0aHJvdyBhbiBleGNlcHRpb25cclxuICAgICAgICAgICAgLy8gIC0gcmVnaXN0ZXJpbmcgYSBuYW1lc3BhY2UgY2FuIGJlIGRvbmUgb24gYW55IHRhZyBieSBhZGRpbmcgbnM6bmFtZT1cInBvaW50IHRvIEpTIG5hbWVzcGFjZVwiXHJcbiAgICAgICAgICAgIC8vICAtIFdpbGRjYXJkIHJlZ2lzdHJhdGlvbnMgdG8gY2FwdHVyZSBhbnl0aGluZyBpbiBhIG5hbWVzcGFjZSBlLmcuIG5zOmNvbnRyb2xzPVwiV2ViLkNvbnRyb2xzLipcIlxyXG4gICAgICAgICAgICAvLyAgLSBJZiBvbmUgcmVnaXN0ZXJzIGEgbmFtZXNwYWNlIHdpdGggYSBwcmVmaXggYSBwYXJlbnQgYWxyZWFkeSBoYXMgYW5kIG5vIG5hbWluZyByb290IHNpdHMgaW4gYmV0d2VlbixcclxuICAgICAgICAgICAgLy8gICAgaXQgc2hvdWxkIGFkZCB0aGUgbmFtZXNwYWNlIHRhcmdldCBvbiB0aGUgc2FtZSBkZWZpbml0aW9uXHJcbiAgICAgICAgICAgIC8vICAtIE5hbWluZyByb290cyBhcmUgaW1wb3J0YW50IC0gaWYgdGhlcmUgb2NjdXJzIGEgbmFtaW5nIHJvb3QsIGV2ZXJ5dGhpbmcgaXMgcmVsYXRpdmUgdG8gdGhhdCBhbmRcclxuICAgICAgICAgICAgLy8gICAgYnJlYWtpbmcgYW55IFwiaW5oZXJpdGFuY2VcIlxyXG4gICAgICAgICAgICAvLyBQcm9wZXJ0aWVzIDpcclxuICAgICAgICAgICAgLy8gIC0gQXR0cmlidXRlcyBvbiBhbiBlbGVtZW50IGlzIGEgcHJvcGVydHlcclxuICAgICAgICAgICAgLy8gIC0gVmFsdWVzIGluIHByb3BlcnR5IHNob3VsZCBhbHdheXMgZ28gdGhyb3VnaCB0eXBlIGNvbnZlcnNpb24gc3ViIHN5c3RlbVxyXG4gICAgICAgICAgICAvLyAgLSBWYWx1ZXMgd2l0aCBlbmNhcHN1bGF0ZWQgaW4ge30gc2hvdWxkIGJlIGNvbnNpZGVyZWQgbWFya3VwIGV4dGVuc2lvbnMsIGdvIHRocm91Z2hcclxuICAgICAgICAgICAgLy8gICAgbWFya3VwIGV4dGVuc2lvbiBzeXN0ZW0gZm9yIHJlc29sdmluZyB0aGVtIGFuZCB0aGVuIHBhc3Mgb24gdGhlIHJlc3VsdGluZyB2YWx1ZVxyXG4gICAgICAgICAgICAvLyAgICB0byB0eXBlIGNvbnZlcnNpb24gc3ViIHN5c3RlbVxyXG4gICAgICAgICAgICAvLyAgLSBQcm9wZXJ0aWVzIGNhbiBiZSBzZXQgd2l0aCB0YWcgc3VmZml4ZWQgd2l0aCAuPG5hbWUgb2YgcHJvcGVydHk+IC0gbW9yZSB0aGFuIG9uZVxyXG4gICAgICAgICAgICAvLyAgICAnLicgaW4gYSB0YWcgbmFtZSBzaG91bGQgdGhyb3cgYW4gZXhjZXB0aW9uXHJcbiAgICAgICAgICAgIC8vIFZhbHVlIFByb3ZpZGVyIDpcclxuICAgICAgICAgICAgLy8gIC0gQW55IHZhbHVlIGVzY2FwZWQgd2l0aCB7eyB9fSBzaG91bGQgYmUgY29uc2lkZXJlZCBhIHZhbHVlIHByb3ZpZGVyXHJcbiAgICAgICAgICAgIC8vIFZhbHVlIENvbnN1bWVyIDpcclxuICAgICAgICAgICAgLy8gIC0gSW4gdGhlIG9wcG9zaXRlIGVuZCBvZiBhIHZhbHVlIHNpdHMgYSBjb25zdW1lci4gSWYgdGhlIHRhcmdldCBwcm9wZXJ0eSBpcyBhIGNvbnN1bWVyLCBwYXNzIHRoaXNcclxuICAgICAgICAgICAgLy8gICAgaW4gdG8gdGhlIHZhbHVlIHByb3ZpZGVyLiBJZiB0aGUgcHJvcGVydHkgaXMganVzdCBhIHJlZ3VsYXIgcHJvcGVydHksIHVzZSB0aGUgZGVmYXVsdCBwcm9wZXJ0eVxyXG4gICAgICAgICAgICAvLyAgICB2YWx1ZSBjb25zdW1lclxyXG4gICAgICAgICAgICAvLyBEZXBlbmRlbmN5IFByb3BlcnRpZXNcclxuICAgICAgICAgICAgLy8gIC0gQSBwcm9wZXJ0eSB0eXBlIHRoYXQgaGFzIHRoZSBhYmlsaXR5IG9mIG5vdGlmeWluZyBzb21ldGhpbmcgd2hlbiBpdCBjaGFuZ2VzXHJcbiAgICAgICAgICAgIC8vICAgIFR5cGljYWxseSBhIHByb3BlcnR5IGdldHMgcmVnaXN0ZXJlZCB3aXRoIHRoZSBhYmlsaXR5IHRvIG9mZmVyIGEgY2FsbGJhY2tcclxuICAgICAgICAgICAgLy8gICAgRGVwZW5kZW5jeSBwcm9wZXJ0aWVzIG5lZWRzIHRvIGJlIGV4cGxpY2l0bHkgc2V0dXBcclxuICAgICAgICAgICAgLy8gIC0gQXR0YWNoZWQgZGVwZW5kZW5jeSBwcm9wZXJ0aWVzIC0gb25lIHNob3VsZCBiZSBhYmxlIHRvIGF0dGFjaCBkZXBlbmRlbmN5IHByb3BlcnRpZXNcclxuICAgICAgICAgICAgLy8gICAgQWRkaW5nIG5ldyBmdW5jdGlvbmFsaXR5IHRvIGFuIGV4aXN0aW5nIGVsZW1lbnQgdGhyb3VnaCBleHBvc2luZyBuZXcgcHJvcGVydGllcyBvblxyXG4gICAgICAgICAgICAvLyAgICBleGlzdGluZyBlbGVtZW50cy4gSXQgZG9lcyBub3QgbWF0dGVyIHdoYXQgZWxlbWVudHMsIGl0IGNvdWxkIGJlIGV4aXN0aW5nIG9uZXMuXHJcbiAgICAgICAgICAgIC8vICAgIFRoZSBhdHRhY2hlZCBkZXBlbmRlbmN5IHByb3BlcnR5IGRlZmluZXMgd2hhdCBpdCBpcyBmb3IgYnkgc3BlY2lmeWluZyBhIHR5cGUuIE9uY2VcclxuICAgICAgICAgICAgLy8gICAgd2UncmUgbWF0Y2hpbmcgYSBwYXJ0aWN1bGFyIGRlcGVuZGVuY3kgcHJvcGVydHkgaW4gdGhlIG1hcmt1cCB3aXRoIHRoZSB0eXBlIGl0IHN1cHBvcnRzXHJcbiAgICAgICAgICAgIC8vICAgIGl0cyBhbGwgZ29vZFxyXG4gICAgICAgICAgICAvLyBTZXJ2aWNlc1xyXG4gICAgICAgICAgICAvLyAgLSBOb2RlcyBzaG91bGQgaGF2ZSB0aGUgYWJpbGl0eSB0byBzcGVjaWZ5IGEgc2VydmljZSB0aGF0IGlzIHJlbGV2YW50IGZvciB0aGUgbm9kZS5cclxuICAgICAgICAgICAgLy8gICAgVGhlIHNlcnZpY2Ugd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgZWxlbWVudCBpdHNlbGYuIEl0IGlzIGRlZmluZWQgYXMgYW4gYXR0cmlidXRlIG9uXHJcbiAgICAgICAgICAgIC8vICAgIGEgbm9kZSwgYW55IHZhbHVlcyBpbiB0aGUgYXR0cmlidXRlIHdpbGwgYmUgaGFuZGVkIGluLCBvYnZpb3VzbHkgcmVzb2x2ZWQgdGhyb3VnaFxyXG4gICAgICAgICAgICAvLyAgICB0aGUgdmFsdWUgcHJvdmlkZXIgc3lzdGVtLlxyXG4gICAgICAgICAgICAvLyBDaGlsZCB0YWdzIDpcclxuICAgICAgICAgICAgLy8gIC0gQ2hpbGRyZW4gd2hpY2ggYXJlIG5vdCBhIHByb3BlcnR5IHJlZmVyZW5jZSBhcmUgb25seSBhbGxvd2VkIGlmIGEgY29udGVudCBvclxyXG4gICAgICAgICAgICAvLyAgICBpdGVtcyBwcm9wZXJ0eSBleGlzdC4gVGhlcmUgY2FuIG9ubHkgYmUgb25lIG9mIHRoZSBvdGhlciwgdHdvIG9mIGVpdGhlciBvciBib3RoXHJcbiAgICAgICAgICAgIC8vICAgIGF0IHRoZSBzYW1lIHRpbWUgc2hvdWxkIHlpZWxkIGFuIGV4Y2VwdGlvblxyXG4gICAgICAgICAgICAvLyBUZW1wbGF0aW5nIDpcclxuICAgICAgICAgICAgLy8gIC0gSWYgYSBVSUVsZW1lbnQgaXMgZm91bmQsIGl0IHdpbGwgbmVlZCB0byBiZSBpbnN0YW50aWF0ZWRcclxuICAgICAgICAgICAgLy8gIC0gSWYgdGhlIGluc3RhbmNlIGlzIG9mIGEgQ29udHJvbCB0eXBlIC0gd2Ugd2lsbCBsb29rIGF0IHRoZVxyXG4gICAgICAgICAgICAvLyAgICBDb250cm9sVGVtcGxhdGUgcHJvcGVydHkgZm9yIGl0cyB0ZW1wbGF0ZSBhbmQgdXNlIHRoYXQgdG8gcmVwbGFjZSBjb250ZW50XHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vIEV4YW1wbGUgOlxyXG4gICAgICAgICAgICAvLyBTaW1wbGUgY29udHJvbDpcclxuICAgICAgICAgICAgLy8gPHNvbWVjb250cm9sIHByb3BlcnR5PVwiNDJcIi8+XHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vIENvbnRyb2wgaW4gZGlmZmVyZW50IG5hbWVzcGFjZTpcclxuICAgICAgICAgICAgLy8gPG5zOnNvbWVjb250cm9sIHByb3BlcnR5PVwiNDJcIi8+XHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vIEFzc2lnbmluZyBwcm9wZXJ0eSB3aXRoIHRhZ3M6XHJcbiAgICAgICAgICAgIC8vIDxuczpzb21lY29udHJvbD5cclxuICAgICAgICAgICAgLy8gICAgPG5zOnNvbWVjb250cm9sLnByb3BlcnR5PjQyPC9uczpzb21jb250cm9sLnByb3BlcnR5PlxyXG4gICAgICAgICAgICAvLyA8L25zOnNvbWVjb250cm9sPlxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAvLyBVc2luZyBhIG1hcmt1cCBleHRlbnNpb246XHJcbiAgICAgICAgICAgIC8vIDxuczpzb21lY29udHJvbCBzb21ldmFsdWU9XCJ7e2JpbmRpbmcgcHJvcGVydHl9fVwiPlxyXG4gICAgICAgICAgICAvLyA8bnM6c29tZWNvbnRyb2xcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gPHNwYW4+e3tiaW5kaW5nIHByb3BlcnR5fX08L3NwYW4+XHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vIDxuczpzb21lY29udHJvbD5cclxuICAgICAgICAgICAgLy8gICAgPG5zOnNvbWVjb250cm9sLnByb3BlcnR5Pnt7YmluZGluZyBwcm9wZXJ0eX19PC9uczpzb21jb250cm9sLnByb3BlcnR5PlxyXG4gICAgICAgICAgICAvLyA8L25zOnNvbWVjb250cm9sPlxyXG5cclxuICAgICAgICAgICAgbmFtZXNwYWNlcy5leHBhbmROYW1lc3BhY2VEZWZpbml0aW9ucyhlbGVtZW50KTtcclxuICAgICAgICAgICAgYmluZGluZ0NvbnRleHRNYW5hZ2VyLmVuc3VyZShlbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmlzS25vd25UeXBlKCkpIHtcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlcy5leHBhbmRGb3IoZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBsb2NhbE5hbWUgPSBlbGVtZW50TmFtaW5nLmdldExvY2FsTmFtZUZvcihlbGVtZW50KTtcclxuICAgICAgICAgICAgdmFyIG5hbWVzcGFjZURlZmluaXRpb24gPSBuYW1lc3BhY2VzLnJlc29sdmVGb3IoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIG9iamVjdE1vZGVsRmFjdG9yeS5jcmVhdGVGcm9tKGVsZW1lbnQsIGxvY2FsTmFtZSwgbmFtZXNwYWNlRGVmaW5pdGlvbixcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5RXhwYW5kZXIuZXhwYW5kKGVsZW1lbnQsIGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgICAgICBVSUVsZW1lbnRQcmVwYXJlci5wcmVwYXJlKGVsZW1lbnQsIGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFya3VwXCIsIHtcclxuICAgIG9iamVjdE1vZGVsRmFjdG9yeTogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKGRlcGVuZGVuY3lSZXNvbHZlciwgZG9jdW1lbnRTZXJ2aWNlKSB7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRyeVJlc29sdmVUYXJnZXROYW1lc3BhY2VzKGxvY2FsTmFtZSwgdGFyZ2V0cywgc3VjY2VzcywgZXJyb3IpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gdHJ5UmVzb2x2ZShxdWV1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuYW1lc3BhY2UgPSBCaWZyb3N0Lm5hbWVzcGFjZSh0YXJnZXRzLnNoaWZ0KCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgZm91bmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2UuX3NjcmlwdHMuZm9yRWFjaChmdW5jdGlvbiAoc2NyaXB0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY3JpcHQudG9Mb3dlckNhc2UoKSA9PT0gbG9jYWxOYW1lLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlcGVuZGVuY3lSZXNvbHZlci5iZWdpblJlc29sdmUobmFtZXNwYWNlLCBzY3JpcHQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyhpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAub25GYWlsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5UmVzb2x2ZVRhcmdldE5hbWVzcGFjZXMobG9jYWxOYW1lLCB0YXJnZXRzLCBzdWNjZXNzLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnlSZXNvbHZlVGFyZ2V0TmFtZXNwYWNlcyhsb2NhbE5hbWUsIHRhcmdldHMsIHN1Y2Nlc3MsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdHJ5UmVzb2x2ZSh0YXJnZXRzKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZUZyb20gPSBmdW5jdGlvbiAoZWxlbWVudCwgbG9jYWxOYW1lLCBuYW1lc3BhY2VEZWZpbml0aW9uLCBzdWNjZXNzLCBlcnJvcikge1xyXG4gICAgICAgICAgICB0cnlSZXNvbHZlVGFyZ2V0TmFtZXNwYWNlcyhsb2NhbE5hbWUsIG5hbWVzcGFjZURlZmluaXRpb24udGFyZ2V0cywgc3VjY2VzcywgZXJyb3IpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFya3VwXCIsIHtcclxuICAgIFBhcmVudFRhZ05hbWVNaXNtYXRjaGVkOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICh0YWdOYW1lLCBwYXJlbnRUYWdOYW1lKSB7XHJcbiAgICAgICAgLy8gXCJTZXR0aW5nIHByb3BlcnR5IHVzaW5nIHRhZyAnXCIrbmFtZStcIicgZG9lcyBub3QgbWF0Y2ggcGFyZW50IHRhZyBvZiAnXCIrcGFyZW50TmFtZStcIidcIjtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXJrdXBcIiwge1xyXG4gICAgcHJvcGVydHlFeHBhbmRlcjogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKHZhbHVlUHJvdmlkZXJQYXJzZXIpIHtcclxuICAgICAgICB0aGlzLmV4cGFuZCA9IGZ1bmN0aW9uIChlbGVtZW50LCB0YXJnZXQpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgYXR0cmlidXRlSW5kZXggPSAwOyBhdHRyaWJ1dGVJbmRleCA8IGVsZW1lbnQuYXR0cmlidXRlcy5sZW5ndGg7IGF0dHJpYnV0ZUluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gZWxlbWVudC5hdHRyaWJ1dGVzW2F0dHJpYnV0ZUluZGV4XS5sb2NhbE5hbWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBlbGVtZW50LmF0dHJpYnV0ZXNbYXR0cmlidXRlSW5kZXhdLnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChuYW1lIGluIHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZVByb3ZpZGVyUGFyc2VyLmhhc1ZhbHVlUHJvdmlkZXIodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlUHJvdmlkZXJQYXJzZXIucGFyc2VGb3IodGFyZ2V0LCBuYW1lLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5tYXJrdXBcIiwge1xyXG4gICAgVUlFbGVtZW50OiBCaWZyb3N0Lm1hcmt1cC5OYW1pbmdSb290LmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMucHJlcGFyZSA9IGZ1bmN0aW9uICh0eXBlLCBlbGVtZW50KSB7XHJcblxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWFya3VwXCIsIHtcclxuICAgIFVJRWxlbWVudFByZXBhcmVyOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwYXJlID0gZnVuY3Rpb24gKGVsZW1lbnQsIGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5wcmVwYXJlKGluc3RhbmNlLl90eXBlLCBlbGVtZW50KTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5jb250aW51ZVdpdGgoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoaW5zdGFuY2UudGVtcGxhdGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBVSU1hbmFnZXIgPSBCaWZyb3N0LnZpZXdzLlVJTWFuYWdlci5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFVJTWFuYWdlci5oYW5kbGUoaW5zdGFuY2UudGVtcGxhdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAga28uYXBwbHlCaW5kaW5nc1RvTm9kZShpbnN0YW5jZS50ZW1wbGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ3aXRoXCI6IGluc3RhbmNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlcGxhY2VDaGlsZChpbnN0YW5jZS50ZW1wbGF0ZSwgZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1hcmt1cFwiLCB7XHJcbiAgICB2YWx1ZVByb3ZpZGVyUGFyc2VyOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAodmFsdWVQcm92aWRlcnMsIHZhbHVlQ29uc3VtZXJzLCB0eXBlQ29udmVydGVycykge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKFwie3soW2EteiAsOnt7fX19XSopfX1cIiwgXCJnXCIpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVWYWx1ZShpbnN0YW5jZSwgcHJvcGVydHksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhciBjb25zdW1lciA9IHZhbHVlQ29uc3VtZXJzLmdldEZvcihpbnN0YW5jZSwgcHJvcGVydHkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNlbGYuaGFzVmFsdWVQcm92aWRlcih2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm92aWRlcnMgPSBzZWxmLnBhcnNlRm9yKGluc3RhbmNlLCBwcm9wZXJ0eSwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgcHJvdmlkZXJzLmZvckVhY2goZnVuY3Rpb24gKHByb3ZpZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXIucHJvdmlkZShjb25zdW1lcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN1bWVyLmNvbnN1bWUodmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5oYXNWYWx1ZVByb3ZpZGVyID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB2YWx1ZS5tYXRjaChyZWdleCk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJzZUZvciA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgbmFtZSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgdmFyIHByb3ZpZGVycyA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdmFsdWUubWF0Y2gocmVnZXgpO1xyXG4gICAgICAgICAgICB2YXIgZXhwcmVzc2lvbiA9IHJlc3VsdFswXS5zdWJzdHIoMiwgcmVzdWx0WzBdLmxlbmd0aCAtIDQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJ4ID0gbmV3IFJlZ0V4cChcIihbYS16XSopICtcIiwgXCJnXCIpO1xyXG4gICAgICAgICAgICByZXN1bHQgPSBleHByZXNzaW9uLm1hdGNoKHJ4KTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZVByb3ZpZGVyTmFtZSA9IHJlc3VsdFswXS50cmltKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlUHJvdmlkZXJzLmlzS25vd24odmFsdWVQcm92aWRlck5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3ZpZGVyID0gdmFsdWVQcm92aWRlcnMuZ2V0SW5zdGFuY2VPZih2YWx1ZVByb3ZpZGVyTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJzLnB1c2gocHJvdmlkZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXhwcmVzc2lvbi5sZW5ndGggPiByZXN1bHRbMF0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb25maWd1cmF0aW9uU3RyaW5nID0gZXhwcmVzc2lvbi5zdWJzdHIocmVzdWx0WzBdLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGNvbmZpZ3VyYXRpb25TdHJpbmcuc3BsaXQoXCIsXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQudHJpbSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrZXlWYWx1ZVBhaXIgPSBlbGVtZW50LnNwbGl0KFwiOlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXlWYWx1ZVBhaXIubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc29tZXRoaW5nIGlzIHdyb25nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5VmFsdWVQYWlyLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFZhbHVlIG9ubHlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT25seSB2YWxpZCBpZiB2YWx1ZSBwcm92aWRlciBoYXMgZGVmYXVsdCBwcm9wZXJ0eSBhbmQgdGhhdCBwcm9wZXJ0eSBleGlzdFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBrZXlWYWx1ZVBhaXJbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlVmFsdWUocHJvdmlkZXIsIHByb3ZpZGVyLmRlZmF1bHRQcm9wZXJ0eSwgdmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5VmFsdWVQYWlyLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFByb3BlcnR5IGFuZCB2YWx1ZVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJbnZhbGlkIGlmIHByb3BlcnR5IGRvZXMgbm90IGV4aXN0XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZVZhbHVlKHByb3ZpZGVyLCBrZXlWYWx1ZVBhaXJbMF0sIGtleVZhbHVlUGFpclsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNvbWV0aGluZyBpcyB3cm9uZyAtIHRoZXJlIGFyZSB0b28gbWFueVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHByb3ZpZGVycztcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm5hdmlnYXRpb25cIiwge1xyXG4gICAgRGF0YU5hdmlnYXRpb25GcmFtZUF0dHJpYnV0ZUVsZW1lbnRWaXNpdG9yOiBCaWZyb3N0Lm1hcmt1cC5FbGVtZW50VmlzaXRvci5leHRlbmQoZnVuY3Rpb24gKGRvY3VtZW50U2VydmljZSkge1xyXG4gICAgICAgIHRoaXMudmlzaXQgPSBmdW5jdGlvbiAoZWxlbWVudCwgYWN0aW9ucykge1xyXG4gICAgICAgICAgICB2YXIgZGF0YU5hdmlnYXRpb25GcmFtZSA9IGVsZW1lbnQuYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oXCJkYXRhLW5hdmlnYXRpb24tZnJhbWVcIik7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChkYXRhTmF2aWdhdGlvbkZyYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGFCaW5kU3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRhQmluZCA9IGVsZW1lbnQuYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oXCJkYXRhLWJpbmRcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoZGF0YUJpbmQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YUJpbmRTdHJpbmcgPSBkYXRhQmluZC52YWx1ZSArIFwiLCBcIjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YUJpbmQgPSBkb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGUoXCJkYXRhLWJpbmRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkYXRhQmluZC52YWx1ZSA9IGRhdGFCaW5kU3RyaW5nICsgXCJuYXZpZ2F0aW9uOiAnXCIgKyBkYXRhTmF2aWdhdGlvbkZyYW1lLnZhbHVlICsgXCInXCI7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmF0dHJpYnV0ZXMuc2V0TmFtZWRJdGVtKGRhdGFCaW5kKTtcclxuXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmF0dHJpYnV0ZXMucmVtb3ZlTmFtZWRJdGVtKFwiZGF0YS1uYXZpZ2F0aW9uLWZyYW1lXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG4iLCJpZiAodHlwZW9mIGtvICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgSGlzdG9yeSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgSGlzdG9yeS5BZGFwdGVyICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICBrby5iaW5kaW5nSGFuZGxlcnMubmF2aWdhdGVUbyA9IHtcclxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ0FjY2Vzc29yLCB2aWV3TW9kZWwpIHtcclxuICAgICAgICAgICAga28uYXBwbHlCaW5kaW5nc1RvTm9kZShlbGVtZW50LCB7XHJcbiAgICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZlYXR1cmVOYW1lID0gdmFsdWVBY2Nlc3NvcigpKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgSGlzdG9yeS5wdXNoU3RhdGUoe2ZlYXR1cmU6ZmVhdHVyZU5hbWV9LCQoZWxlbWVudCkuYXR0cihcInRpdGxlXCIpLFwiL1wiKyBmZWF0dXJlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHZpZXdNb2RlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5uYXZpZ2F0aW9uXCIsIHtcclxuICAgIG5hdmlnYXRpb25CaW5kaW5nSGFuZGxlcjogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0TmF2aWdhdGlvbkZyYW1lRm9yKHZhbHVlQWNjZXNzb3IpIHtcclxuICAgICAgICAgICAgdmFyIGNvbmZpZ3VyYXRpb25TdHJpbmcgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSk7XHJcbiAgICAgICAgICAgIHZhciBjb25maWd1cmF0aW9uSXRlbXMgPSBrby5leHByZXNzaW9uUmV3cml0aW5nLnBhcnNlT2JqZWN0TGl0ZXJhbChjb25maWd1cmF0aW9uU3RyaW5nKTtcclxuICAgICAgICAgICAgdmFyIGNvbmZpZ3VyYXRpb24gPSB7fTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBjb25maWd1cmF0aW9uSXRlbXMubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGNvbmZpZ3VyYXRpb25JdGVtc1tpbmRleF07XHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uW2l0ZW0ua2V5LnRyaW0oKV0gPSBpdGVtLnZhbHVlLnRyaW0oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHVyaU1hcHBlck5hbWUgPSBjb25maWd1cmF0aW9uLnVyaU1hcHBlcjtcclxuICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodXJpTWFwcGVyTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIHVyaU1hcHBlck5hbWUgPSBcImRlZmF1bHRcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIG1hcHBlciA9IEJpZnJvc3QudXJpTWFwcGVyc1t1cmlNYXBwZXJOYW1lXTtcclxuICAgICAgICAgICAgdmFyIGZyYW1lID0gQmlmcm9zdC5uYXZpZ2F0aW9uLk5hdmlnYXRpb25GcmFtZS5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgbG9jYXRpb25Bd2FyZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB1cmlNYXBwZXI6IG1hcHBlcixcclxuICAgICAgICAgICAgICAgIGhvbWU6IGNvbmZpZ3VyYXRpb24uaG9tZSB8fCAnJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmcmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG1ha2VWYWx1ZUFjY2Vzc29yKG5hdmlnYXRpb25GcmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5hdmlnYXRpb25GcmFtZS5jdXJyZW50VXJpKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmluaXQgPSBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3NBY2Nlc3Nvciwgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCkge1xyXG4gICAgICAgICAgICB2YXIgbmF2aWdhdGlvbkZyYW1lID0gZ2V0TmF2aWdhdGlvbkZyYW1lRm9yKHZhbHVlQWNjZXNzb3IpO1xyXG4gICAgICAgICAgICBuYXZpZ2F0aW9uRnJhbWUuY29uZmlndXJlRm9yKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4ga28uYmluZGluZ0hhbmRsZXJzLnZpZXcuaW5pdChlbGVtZW50LCBtYWtlVmFsdWVBY2Nlc3NvcihuYXZpZ2F0aW9uRnJhbWUpLCBhbGxCaW5kaW5nc0FjY2Vzc29yLCB2aWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzQWNjZXNzb3IsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpIHtcclxuICAgICAgICAgICAgdmFyIG5hdmlnYXRpb25GcmFtZSA9IGdldE5hdmlnYXRpb25GcmFtZUZvcih2YWx1ZUFjY2Vzc29yKTtcclxuICAgICAgICAgICAgbmF2aWdhdGlvbkZyYW1lLmNvbmZpZ3VyZUZvcihlbGVtZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIGtvLmJpbmRpbmdIYW5kbGVycy52aWV3LnVwZGF0ZShlbGVtZW50LCBtYWtlVmFsdWVBY2Nlc3NvcihuYXZpZ2F0aW9uRnJhbWUpLCBhbGxCaW5kaW5nc0FjY2Vzc29yLCB2aWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QubmF2aWdhdGlvbi5uYXZpZ2F0aW9uQmluZGluZ0hhbmRsZXIuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGtvLmJpbmRpbmdIYW5kbGVycy5uYXZpZ2F0aW9uID0gQmlmcm9zdC5uYXZpZ2F0aW9uLm5hdmlnYXRpb25CaW5kaW5nSGFuZGxlci5jcmVhdGUoKTtcclxuICAgIGtvLmpzb25FeHByZXNzaW9uUmV3cml0aW5nLmJpbmRpbmdSZXdyaXRlVmFsaWRhdG9ycy5uYXZpZ2F0aW9uID0gZmFsc2U7IC8vIENhbid0IHJld3JpdGUgY29udHJvbCBmbG93IGJpbmRpbmdzXHJcbiAgICBrby52aXJ0dWFsRWxlbWVudHMuYWxsb3dlZEJpbmRpbmdzLm5hdmlnYXRpb24gPSB0cnVlO1xyXG59O1xyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubmF2aWdhdGlvblwiLCB7XHJcbiAgICBOYXZpZ2F0aW9uRnJhbWU6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKGhvbWUsIHVyaU1hcHBlciwgaGlzdG9yeSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5ob21lID0gaG9tZTtcclxuICAgICAgICB0aGlzLmhpc3RvcnkgPSBoaXN0b3J5O1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VXJpID0ga28ub2JzZXJ2YWJsZShob21lKTtcclxuICAgICAgICB0aGlzLnVyaU1hcHBlciA9IHVyaU1hcHBlciB8fCBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnNldEN1cnJlbnRVcmkgPSBmdW5jdGlvbiAocGF0aCkge1xyXG4gICAgICAgICAgICBpZiAocGF0aC5pbmRleE9mKFwiL1wiKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwYXRoLmxhc3RJbmRleE9mKFwiL1wiKSA9PT0gcGF0aC5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICBwYXRoID0gcGF0aC5zdWJzdHIoMCwgcGF0aC5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocGF0aCA9PSBudWxsIHx8IHBhdGgubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBwYXRoID0gc2VsZi5ob21lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnVyaU1hcHBlciAhPSBudWxsICYmICFzZWxmLnVyaU1hcHBlci5oYXNNYXBwaW5nRm9yKHBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICBwYXRoID0gc2VsZi5ob21lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNlbGYuY3VycmVudFVyaShwYXRoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNldEN1cnJlbnRVcmlGcm9tQ3VycmVudExvY2F0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgc3RhdGUgPSBzZWxmLmhpc3RvcnkuZ2V0U3RhdGUoKTtcclxuICAgICAgICAgICAgdmFyIHVyaSA9IEJpZnJvc3QuVXJpLmNyZWF0ZShzdGF0ZS51cmwpO1xyXG4gICAgICAgICAgICBzZWxmLnNldEN1cnJlbnRVcmkodXJpLnBhdGgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGhpc3RvcnkuQWRhcHRlci5iaW5kKHdpbmRvdywgXCJzdGF0ZWNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0Q3VycmVudFVyaUZyb21DdXJyZW50TG9jYXRpb24oKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25maWd1cmVGb3IgPSBmdW5jdGlvbiAoY29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0Q3VycmVudFVyaUZyb21DdXJyZW50TG9jYXRpb24oKTtcclxuICAgICAgICAgICAgc2VsZi5jb250YWluZXIgPSBjb250YWluZXI7XHJcblxyXG4gICAgICAgICAgICB2YXIgdXJpTWFwcGVyID0gJChjb250YWluZXIpLmNsb3Nlc3QoXCJbZGF0YS11cmltYXBwZXJdXCIpO1xyXG4gICAgICAgICAgICBpZiAodXJpTWFwcGVyLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHVyaU1hcHBlck5hbWUgPSAkKHVyaU1hcHBlclswXSkuZGF0YShcInVyaW1hcHBlclwiKTtcclxuICAgICAgICAgICAgICAgIGlmICh1cmlNYXBwZXJOYW1lIGluIEJpZnJvc3QudXJpTWFwcGVycykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXJpTWFwcGVyID0gQmlmcm9zdC51cmlNYXBwZXJzW3VyaU1hcHBlck5hbWVdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnVyaU1hcHBlciA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnVyaU1hcHBlciA9IEJpZnJvc3QudXJpTWFwcGVycy5kZWZhdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZSA9IGZ1bmN0aW9uICh1cmkpIHtcclxuICAgICAgICAgICAgc2VsZi5zZXRDdXJyZW50VXJpKHVyaSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubmF2aWdhdGlvblwiLCB7XHJcbiAgICBuYXZpZ2F0ZVRvOiBmdW5jdGlvbiAoZmVhdHVyZU5hbWUsIHF1ZXJ5U3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIHVybCA9IGZlYXR1cmVOYW1lO1xyXG5cclxuICAgICAgICBpZiAoZmVhdHVyZU5hbWUuY2hhckF0KDApICE9PSBcIi9cIikge1xyXG4gICAgICAgICAgICB1cmwgPSBcIi9cIiArIHVybDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChxdWVyeVN0cmluZykge1xyXG4gICAgICAgICAgICB1cmwgKz0gcXVlcnlTdHJpbmc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUT0RPOiBTdXBwb3J0IHRpdGxlIHNvbWVob3dcclxuICAgICAgICBpZiAodHlwZW9mIEhpc3RvcnkgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIEhpc3RvcnkuQWRhcHRlciAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICBIaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJcIiwgdXJsKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgbmF2aWdhdGlvbk1hbmFnZXI6IHtcclxuICAgICAgICBnZXRDdXJyZW50TG9jYXRpb246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgdXJpID0gQmlmcm9zdC5VcmkuY3JlYXRlKHdpbmRvdy5sb2NhdGlvbi50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgcmV0dXJuIHVyaTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBob29rdXA6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBIaXN0b3J5ICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBIaXN0b3J5LkFkYXB0ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICQoXCJib2R5XCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhyZWYgPSBlLnRhcmdldC5ocmVmO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaHJlZiA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2xvc2VzdEFuY2hvciA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoXCJhXCIpWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNsb3Nlc3RBbmNob3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBocmVmID0gY2xvc2VzdEFuY2hvci5ocmVmO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaHJlZi5pbmRleE9mKFwiIyFcIikgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhyZWYgPSBocmVmLnN1YnN0cigwLCBocmVmLmluZGV4T2YoXCIjIVwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaHJlZi5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHJlZiA9IFwiL1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0VXJpID0gQmlmcm9zdC5VcmkuY3JlYXRlKGhyZWYpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRVcmkuaXNTYW1lQXNPcmlnaW4gJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VXJpLnF1ZXJ5U3RyaW5nLmluZGV4T2YoXCJwb3N0YmFja1wiKTwwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSB0YXJnZXRVcmkucGF0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRhcmdldC5pbmRleE9mKFwiL1wiKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnN1YnN0cigxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gJChlLnRhcmdldCkuY2xvc2VzdChcIltkYXRhLW5hdmlnYXRpb24tdGFyZ2V0XVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZCA9ICQocmVzdWx0WzBdKS5kYXRhKFwibmF2aWdhdGlvbi10YXJnZXRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9ICQoXCIjXCIraWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQubGVuZ3RoID09PSAxICYmIHR5cGVvZiBlbGVtZW50WzBdLm5hdmlnYXRpb25GcmFtZSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRbMF0ubmF2aWdhdGlvbkZyYW1lLm5hdmlnYXRlKHRhcmdldFVyaS5wYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRWxlbWVudCBub3QgZm91bmRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBxdWVyeVN0cmluZyA9IHRhcmdldFVyaS5xdWVyeVN0cmluZy5sZW5ndGggPiAwID8gXCI/XCIgKyB0YXJnZXRVcmkucXVlcnlTdHJpbmcgOiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSGlzdG9yeS5wdXNoU3RhdGUoe30sIFwiXCIsIFwiL1wiICsgdGFyZ2V0ICsgcXVlcnlTdHJpbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5uYXZpZ2F0aW9uXCIsIHtcclxuICAgIG9ic2VydmFibGVRdWVyeVBhcmFtZXRlckZhY3Rvcnk6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciBoaXN0b3J5RW5hYmxlZCA9IHR5cGVvZiBIaXN0b3J5ICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBIaXN0b3J5LkFkYXB0ZXIgIT09IFwidW5kZWZpbmVkXCI7XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKHBhcmFtZXRlck5hbWUsIGRlZmF1bHRWYWx1ZSwgbmF2aWdhdGlvbk1hbmFnZXIpIHtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldFN0YXRlKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHVyaSA9IG5hdmlnYXRpb25NYW5hZ2VyLmdldEN1cnJlbnRMb2NhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHVyaS5wYXJhbWV0ZXJzLmhhc093blByb3BlcnR5KHBhcmFtZXRlck5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVyaS5wYXJhbWV0ZXJzW3BhcmFtZXRlck5hbWVdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgb2JzZXJ2YWJsZSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAoaGlzdG9yeUVuYWJsZWQpIHtcclxuICAgICAgICAgICAgICAgIEhpc3RvcnkuQWRhcHRlci5iaW5kKHdpbmRvdywgXCJzdGF0ZWNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9ic2VydmFibGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZhYmxlKGdldFN0YXRlKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJoYXNoY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JzZXJ2YWJsZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYnNlcnZhYmxlKCkgIT09IHN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZhYmxlKHN0YXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHN0YXRlID0gZ2V0U3RhdGUoKTtcclxuICAgICAgICAgICAgb2JzZXJ2YWJsZSA9IGtvLm9ic2VydmFibGUoc3RhdGUgfHwgZGVmYXVsdFZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldFF1ZXJ5U3RyaW5nUGFyYW1ldGVyc1dpdGhWYWx1ZUZvclBhcmFtZXRlcih1cmwsIHBhcmFtZXRlclZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyYW1ldGVycyA9IEJpZnJvc3QuaGFzaFN0cmluZy5kZWNvZGUodXJsKTtcclxuICAgICAgICAgICAgICAgIHBhcmFtZXRlcnNbcGFyYW1ldGVyTmFtZV0gPSBwYXJhbWV0ZXJWYWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcXVlcnlTdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtZXRlckluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHBhcmFtZXRlciBpbiBwYXJhbWV0ZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gcGFyYW1ldGVyc1twYXJhbWV0ZXJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtZXRlckluZGV4ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlTdHJpbmcgKz0gXCImXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlTdHJpbmcgKz0gcGFyYW1ldGVyICsgXCI9XCIgKyB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVySW5kZXgrKztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcXVlcnlTdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNsZWFuUXVlcnlTdHJpbmcocXVlcnlTdHJpbmcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChxdWVyeVN0cmluZy5pbmRleE9mKFwiI1wiKSA9PT0gMCB8fCBxdWVyeVN0cmluZy5pbmRleE9mKFwiP1wiKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5U3RyaW5nID0gcXVlcnlTdHJpbmcuc3Vic3RyKDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5U3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBxdWVyeVN0cmluZztcclxuICAgICAgICAgICAgICAgIGlmIChoaXN0b3J5RW5hYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IEhpc3RvcnkuZ2V0U3RhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZVtwYXJhbWV0ZXJOYW1lXSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5U3RyaW5nID0gXCI/XCIgKyBnZXRRdWVyeVN0cmluZ1BhcmFtZXRlcnNXaXRoVmFsdWVGb3JQYXJhbWV0ZXIoY2xlYW5RdWVyeVN0cmluZyhzdGF0ZS51cmwpLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgSGlzdG9yeS5wdXNoU3RhdGUoc3RhdGUsIHN0YXRlLnRpdGxlLCBxdWVyeVN0cmluZyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5U3RyaW5nID0gXCIjXCIgKyBnZXRRdWVyeVN0cmluZ1BhcmFtZXRlcnNXaXRoVmFsdWVGb3JQYXJhbWV0ZXIoY2xlYW5RdWVyeVN0cmluZyhkb2N1bWVudC5sb2NhdGlvbi5oYXNoKSwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhhc2ggPSBxdWVyeVN0cmluZztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcblxyXG5rby5vYnNlcnZhYmxlUXVlcnlQYXJhbWV0ZXIgPSBmdW5jdGlvbiAocGFyYW1ldGVyTmFtZSwgZGVmYXVsdFZhbHVlKSB7XHJcbiAgICB2YXIgbmF2aWdhdGlvbk1hbmFnZXIgPSBCaWZyb3N0Lm5hdmlnYXRpb24ubmF2aWdhdGlvbk1hbmFnZXI7XHJcbiAgICB2YXIgb2JzZXJ2YWJsZSA9IEJpZnJvc3QubmF2aWdhdGlvbi5vYnNlcnZhYmxlUXVlcnlQYXJhbWV0ZXJGYWN0b3J5LmNyZWF0ZSgpLmNyZWF0ZShwYXJhbWV0ZXJOYW1lLCBkZWZhdWx0VmFsdWUsIG5hdmlnYXRpb25NYW5hZ2VyKTtcclxuICAgIHJldHVybiBvYnNlcnZhYmxlO1xyXG59O1xyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QubWVzc2FnaW5nXCIsIHtcclxuICAgIE1lc3NlbmdlcjogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHN1YnNjcmliZXJzID0gW107XHJcblxyXG4gICAgICAgIHRoaXMucHVibGlzaCA9IGZ1bmN0aW9uICh0b3BpYywgbWVzc2FnZSkge1xyXG4gICAgICAgICAgICBpZiAoc3Vic2NyaWJlcnMuaGFzT3duUHJvcGVydHkodG9waWMpKSB7XHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyc1t0b3BpY10uc3Vic2NyaWJlcnMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0obWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc3Vic2NyaWJlVG8gPSBmdW5jdGlvbiAodG9waWMsIHN1YnNjcmliZXIpIHtcclxuICAgICAgICAgICAgdmFyIHN1YnNjcmliZXJzQnlUb3BpYztcclxuXHJcbiAgICAgICAgICAgIGlmIChzdWJzY3JpYmVycy5oYXNPd25Qcm9wZXJ0eSh0b3BpYykpIHtcclxuICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzQnlUb3BpYyA9IHN1YnNjcmliZXJzW3RvcGljXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzQnlUb3BpYyA9IHsgc3Vic2NyaWJlcnM6IFtdIH07XHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyc1t0b3BpY10gPSBzdWJzY3JpYmVyc0J5VG9waWM7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZXJzQnlUb3BpYy5zdWJzY3JpYmVycy5wdXNoKHN1YnNjcmliZXIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHB1Ymxpc2g6IHRoaXMucHVibGlzaCxcclxuICAgICAgICAgICAgc3Vic2NyaWJlVG86IHRoaXMuc3Vic2NyaWJlVG9cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QubWVzc2FnaW5nLk1lc3Nlbmdlci5nbG9iYWwgPSBCaWZyb3N0Lm1lc3NhZ2luZy5NZXNzZW5nZXIuY3JlYXRlKCk7XHJcbkJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIudHlwZXMuZ2xvYmFsTWVzc2VuZ2VyID0gQmlmcm9zdC5tZXNzYWdpbmcuTWVzc2VuZ2VyLmdsb2JhbDtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0Lm1lc3NhZ2luZ1wiLCB7XHJcbiAgICBtZXNzZW5nZXJGYWN0b3J5OiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBtZXNzZW5nZXIgPSBCaWZyb3N0Lm1lc3NhZ2luZy5NZXNzZW5nZXIuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXNzZW5nZXI7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nbG9iYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBCaWZyb3N0Lm1lc3NhZ2luZy5NZXNzZW5nZXIuZ2xvYmFsO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy5tZXNzZW5nZXJGYWN0b3J5ID0gQmlmcm9zdC5tZXNzYWdpbmcubWVzc2VuZ2VyRmFjdG9yeTsiLCJpZiAodHlwZW9mIGtvICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAga28ub2JzZXJ2YWJsZU1lc3NhZ2UgPSBmdW5jdGlvbiAobWVzc2FnZSwgZGVmYXVsdFZhbHVlKSB7XHJcbiAgICAgICAgdmFyIG9ic2VydmFibGUgPSBrby5vYnNlcnZhYmxlKGRlZmF1bHRWYWx1ZSk7XHJcblxyXG4gICAgICAgIHZhciBpbnRlcm5hbCA9IGZhbHNlO1xyXG4gICAgICAgIG9ic2VydmFibGUuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAoaW50ZXJuYWwgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBCaWZyb3N0Lm1lc3NhZ2luZy5NZXNzZW5nZXIuZ2xvYmFsLnB1Ymxpc2gobWVzc2FnZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBCaWZyb3N0Lm1lc3NhZ2luZy5NZXNzZW5nZXIuZ2xvYmFsLnN1YnNjcmliZVRvKG1lc3NhZ2UsIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBpbnRlcm5hbCA9IHRydWU7XHJcbiAgICAgICAgICAgIG9ic2VydmFibGUodmFsdWUpO1xyXG4gICAgICAgICAgICBpbnRlcm5hbCA9IGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlO1xyXG4gICAgfTtcclxufSIsIi8qXHJcbiAqIGNsYXNzTGlzdC5qczogQ3Jvc3MtYnJvd3NlciBmdWxsIGVsZW1lbnQuY2xhc3NMaXN0IGltcGxlbWVudGF0aW9uLlxyXG4gKiAyMDEyLTExLTE1XHJcbiAqXHJcbiAqIEJ5IEVsaSBHcmV5LCBodHRwOi8vZWxpZ3JleS5jb21cclxuICogUHVibGljIERvbWFpbi5cclxuICogTk8gV0FSUkFOVFkgRVhQUkVTU0VEIE9SIElNUExJRUQuIFVTRSBBVCBZT1VSIE9XTiBSSVNLLlxyXG4gKi9cclxuXHJcbi8qZ2xvYmFsIHNlbGYsIGRvY3VtZW50LCBET01FeGNlcHRpb24gKi9cclxuXHJcbi8qISBAc291cmNlIGh0dHA6Ly9wdXJsLmVsaWdyZXkuY29tL2dpdGh1Yi9jbGFzc0xpc3QuanMvYmxvYi9tYXN0ZXIvY2xhc3NMaXN0LmpzKi9cclxuXHJcbmlmIChcImRvY3VtZW50XCIgaW4gc2VsZiAmJiAhKFxyXG4gICAgICAgIFwiY2xhc3NMaXN0XCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIl9cIikgJiZcclxuICAgICAgICBcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwic3ZnXCIpXHJcbiAgICApKSB7XHJcblxyXG4gICAgKGZ1bmN0aW9uICh2aWV3KSB7XHJcblxyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgICAgICBpZiAoISgnRWxlbWVudCcgaW4gdmlldykpIHJldHVybjtcclxuXHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAgICAgY2xhc3NMaXN0UHJvcCA9IFwiY2xhc3NMaXN0XCJcclxuICAgICAgICAgICAgLCBwcm90b1Byb3AgPSBcInByb3RvdHlwZVwiXHJcbiAgICAgICAgICAgICwgZWxlbUN0clByb3RvID0gdmlldy5FbGVtZW50W3Byb3RvUHJvcF1cclxuICAgICAgICAgICAgLCBvYmpDdHIgPSBPYmplY3RcclxuICAgICAgICAgICAgLCBzdHJUcmltID0gU3RyaW5nW3Byb3RvUHJvcF0udHJpbSB8fCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCBcIlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAsIGFyckluZGV4T2YgPSBBcnJheVtwcm90b1Byb3BdLmluZGV4T2YgfHwgZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHZhclxyXG4gICAgICAgICAgICAgICAgICAgICAgaSA9IDBcclxuICAgICAgICAgICAgICAgICAgICAsIGxlbiA9IHRoaXMubGVuZ3RoXHJcbiAgICAgICAgICAgICAgICA7XHJcbiAgICAgICAgICAgICAgICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBWZW5kb3JzOiBwbGVhc2UgYWxsb3cgY29udGVudCBjb2RlIHRvIGluc3RhbnRpYXRlIERPTUV4Y2VwdGlvbnNcclxuICAgICAgICAgICAgLCBET01FeCA9IGZ1bmN0aW9uICh0eXBlLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5hbWUgPSB0eXBlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2RlID0gRE9NRXhjZXB0aW9uW3R5cGVdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAsIGNoZWNrVG9rZW5BbmRHZXRJbmRleCA9IGZ1bmN0aW9uIChjbGFzc0xpc3QsIHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4gPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRE9NRXgoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJTWU5UQVhfRVJSXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgLCBcIkFuIGludmFsaWQgb3IgaWxsZWdhbCBzdHJpbmcgd2FzIHNwZWNpZmllZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICgvXFxzLy50ZXN0KHRva2VuKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBET01FeChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcIklOVkFMSURfQ0hBUkFDVEVSX0VSUlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICwgXCJTdHJpbmcgY29udGFpbnMgYW4gaW52YWxpZCBjaGFyYWN0ZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJySW5kZXhPZi5jYWxsKGNsYXNzTGlzdCwgdG9rZW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICwgQ2xhc3NMaXN0ID0gZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICAgICAgICAgIHZhclxyXG4gICAgICAgICAgICAgICAgICAgICAgdHJpbW1lZENsYXNzZXMgPSBzdHJUcmltLmNhbGwoZWxlbS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiKVxyXG4gICAgICAgICAgICAgICAgICAgICwgY2xhc3NlcyA9IHRyaW1tZWRDbGFzc2VzID8gdHJpbW1lZENsYXNzZXMuc3BsaXQoL1xccysvKSA6IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgLCBpID0gMFxyXG4gICAgICAgICAgICAgICAgICAgICwgbGVuID0gY2xhc3Nlcy5sZW5ndGhcclxuICAgICAgICAgICAgICAgIDtcclxuICAgICAgICAgICAgICAgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2goY2xhc3Nlc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVDbGFzc05hbWUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGlzLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAsIGNsYXNzTGlzdFByb3RvID0gQ2xhc3NMaXN0W3Byb3RvUHJvcF0gPSBbXVxyXG4gICAgICAgICAgICAsIGNsYXNzTGlzdEdldHRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQ2xhc3NMaXN0KHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgO1xyXG4gICAgICAgIC8vIE1vc3QgRE9NRXhjZXB0aW9uIGltcGxlbWVudGF0aW9ucyBkb24ndCBhbGxvdyBjYWxsaW5nIERPTUV4Y2VwdGlvbidzIHRvU3RyaW5nKClcclxuICAgICAgICAvLyBvbiBub24tRE9NRXhjZXB0aW9ucy4gRXJyb3IncyB0b1N0cmluZygpIGlzIHN1ZmZpY2llbnQgaGVyZS5cclxuICAgICAgICBET01FeFtwcm90b1Byb3BdID0gRXJyb3JbcHJvdG9Qcm9wXTtcclxuICAgICAgICBjbGFzc0xpc3RQcm90by5pdGVtID0gZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNbaV0gfHwgbnVsbDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNsYXNzTGlzdFByb3RvLmNvbnRhaW5zID0gZnVuY3Rpb24gKHRva2VuKSB7XHJcbiAgICAgICAgICAgIHRva2VuICs9IFwiXCI7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pICE9PSAtMTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNsYXNzTGlzdFByb3RvLmFkZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyXHJcbiAgICAgICAgICAgICAgICAgIHRva2VucyA9IGFyZ3VtZW50c1xyXG4gICAgICAgICAgICAgICAgLCBpID0gMFxyXG4gICAgICAgICAgICAgICAgLCBsID0gdG9rZW5zLmxlbmd0aFxyXG4gICAgICAgICAgICAgICAgLCB0b2tlblxyXG4gICAgICAgICAgICAgICAgLCB1cGRhdGVkID0gZmFsc2VcclxuICAgICAgICAgICAgO1xyXG4gICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICB0b2tlbiA9IHRva2Vuc1tpXSArIFwiXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2godG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdoaWxlICgrK2kgPCBsKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh1cGRhdGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2xhc3NMaXN0UHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXJcclxuICAgICAgICAgICAgICAgICAgdG9rZW5zID0gYXJndW1lbnRzXHJcbiAgICAgICAgICAgICAgICAsIGkgPSAwXHJcbiAgICAgICAgICAgICAgICAsIGwgPSB0b2tlbnMubGVuZ3RoXHJcbiAgICAgICAgICAgICAgICAsIHRva2VuXHJcbiAgICAgICAgICAgICAgICAsIHVwZGF0ZWQgPSBmYWxzZVxyXG4gICAgICAgICAgICA7XHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgIHRva2VuID0gdG9rZW5zW2ldICsgXCJcIjtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbik7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdoaWxlICgrK2kgPCBsKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh1cGRhdGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2xhc3NMaXN0UHJvdG8udG9nZ2xlID0gZnVuY3Rpb24gKHRva2VuLCBmb3JzZSkge1xyXG4gICAgICAgICAgICB0b2tlbiArPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgdmFyXHJcbiAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuY29udGFpbnModG9rZW4pXHJcbiAgICAgICAgICAgICAgICAsIG1ldGhvZCA9IHJlc3VsdCA/XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yc2UgIT09IHRydWUgJiYgXCJyZW1vdmVcIlxyXG4gICAgICAgICAgICAgICAgOlxyXG4gICAgICAgICAgICAgICAgICAgIGZvcnNlICE9PSBmYWxzZSAmJiBcImFkZFwiXHJcbiAgICAgICAgICAgIDtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRob2QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXNbbWV0aG9kXSh0b2tlbik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAhcmVzdWx0O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2xhc3NMaXN0UHJvdG8udG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmpvaW4oXCIgXCIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChvYmpDdHIuZGVmaW5lUHJvcGVydHkpIHtcclxuICAgICAgICAgICAgdmFyIGNsYXNzTGlzdFByb3BEZXNjID0ge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBjbGFzc0xpc3RHZXR0ZXJcclxuICAgICAgICAgICAgICAgICwgZW51bWVyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgLCBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHsgLy8gSUUgOCBkb2Vzbid0IHN1cHBvcnQgZW51bWVyYWJsZTp0cnVlXHJcbiAgICAgICAgICAgICAgICBpZiAoZXgubnVtYmVyID09PSAtMHg3RkY1RUM1NCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTGlzdFByb3BEZXNjLmVudW1lcmFibGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBvYmpDdHIuZGVmaW5lUHJvcGVydHkoZWxlbUN0clByb3RvLCBjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RQcm9wRGVzYyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKG9iakN0cltwcm90b1Byb3BdLl9fZGVmaW5lR2V0dGVyX18pIHtcclxuICAgICAgICAgICAgZWxlbUN0clByb3RvLl9fZGVmaW5lR2V0dGVyX18oY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0R2V0dGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfShzZWxmKSk7XHJcbn0iLCIvLyBGcm9tOiBodHRwOi8vd3d3LmpvbmF0aGFudG5lYWwuY29tL2Jsb2cvZmFraW5nLXRoZS1mdXR1cmUvXHJcbnRoaXMuRWxlbWVudCAmJiAoZnVuY3Rpb24gKEVsZW1lbnRQcm90b3R5cGUsIHBvbHlmaWxsKSB7XHJcbiAgICBmdW5jdGlvbiBOb2RlTGlzdCgpIHsgW3BvbHlmaWxsXSB9XHJcbiAgICBOb2RlTGlzdC5wcm90b3R5cGUubGVuZ3RoID0gQXJyYXkucHJvdG90eXBlLmxlbmd0aDtcclxuXHJcbiAgICBFbGVtZW50UHJvdG90eXBlLm1hdGNoZXNTZWxlY3RvciA9IEVsZW1lbnRQcm90b3R5cGUubWF0Y2hlc1NlbGVjdG9yIHx8XHJcbiAgICBFbGVtZW50UHJvdG90eXBlLm1vek1hdGNoZXNTZWxlY3RvciB8fFxyXG4gICAgRWxlbWVudFByb3RvdHlwZS5tc01hdGNoZXNTZWxlY3RvciB8fFxyXG4gICAgRWxlbWVudFByb3RvdHlwZS5vTWF0Y2hlc1NlbGVjdG9yIHx8XHJcbiAgICBFbGVtZW50UHJvdG90eXBlLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fFxyXG4gICAgZnVuY3Rpb24gbWF0Y2hlc1NlbGVjdG9yKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdHMgPSB0aGlzLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgICAgICAgdmFyIHJlc3VsdHNJbmRleCA9IC0xO1xyXG5cclxuICAgICAgICB3aGlsZSAocmVzdWx0c1srK3Jlc3VsdHNJbmRleF0gJiYgcmVzdWx0c1tyZXN1bHRzSW5kZXhdICE9IHRoaXMpIHt9XHJcblxyXG4gICAgICAgIHJldHVybiAhIXJlc3VsdHNbcmVzdWx0c0luZGV4XTtcclxuICAgIH07XHJcblxyXG4gICAgRWxlbWVudFByb3RvdHlwZS5hbmNlc3RvclF1ZXJ5U2VsZWN0b3JBbGwgPSBFbGVtZW50UHJvdG90eXBlLmFuY2VzdG9yUXVlcnlTZWxlY3RvckFsbCB8fFxyXG4gICAgRWxlbWVudFByb3RvdHlwZS5tb3pBbmNlc3RvclF1ZXJ5U2VsZWN0b3JBbGwgfHxcclxuICAgIEVsZW1lbnRQcm90b3R5cGUubXNBbmNlc3RvclF1ZXJ5U2VsZWN0b3JBbGwgfHxcclxuICAgIEVsZW1lbnRQcm90b3R5cGUub0FuY2VzdG9yUXVlcnlTZWxlY3RvckFsbCB8fFxyXG4gICAgRWxlbWVudFByb3RvdHlwZS53ZWJraXRBbmNlc3RvclF1ZXJ5U2VsZWN0b3JBbGwgfHxcclxuICAgIGZ1bmN0aW9uIGFuY2VzdG9yUXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcikge1xyXG4gICAgICAgIGZvciAodmFyIGNpdGUgPSB0aGlzLCBuZXdOb2RlTGlzdCA9IG5ldyBOb2RlTGlzdCgpOyBjaXRlID0gY2l0ZS5wYXJlbnRFbGVtZW50Oykge1xyXG4gICAgICAgICAgICBpZiAoY2l0ZS5tYXRjaGVzU2VsZWN0b3Ioc2VsZWN0b3IpKSBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKG5ld05vZGVMaXN0LCBjaXRlKTtcclxuICAgICAgICB9XHJcbiBcclxuICAgICAgICByZXR1cm4gbmV3Tm9kZUxpc3Q7XHJcbiAgICB9O1xyXG4gXHJcbiAgICBFbGVtZW50UHJvdG90eXBlLmFuY2VzdG9yUXVlcnlTZWxlY3RvciA9IEVsZW1lbnRQcm90b3R5cGUuYW5jZXN0b3JRdWVyeVNlbGVjdG9yIHx8XHJcbiAgICBFbGVtZW50UHJvdG90eXBlLm1vekFuY2VzdG9yUXVlcnlTZWxlY3RvciB8fFxyXG4gICAgRWxlbWVudFByb3RvdHlwZS5tc0FuY2VzdG9yUXVlcnlTZWxlY3RvciB8fFxyXG4gICAgRWxlbWVudFByb3RvdHlwZS5vQW5jZXN0b3JRdWVyeVNlbGVjdG9yIHx8XHJcbiAgICBFbGVtZW50UHJvdG90eXBlLndlYmtpdEFuY2VzdG9yUXVlcnlTZWxlY3RvciB8fFxyXG4gICAgZnVuY3Rpb24gYW5jZXN0b3JRdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5jZXN0b3JRdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKVswXSB8fCBudWxsO1xyXG4gICAgfTtcclxufSkoRWxlbWVudC5wcm90b3R5cGUpOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5yZWFkXCIsIHtcclxuICAgIFBhZ2luZ0luZm86IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKHNpemUsIG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuc2l6ZSA9IHNpemU7XHJcbiAgICAgICAgdGhpcy5udW1iZXIgPSBudW1iZXI7XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QucmVhZFwiLCB7XHJcbiAgICBRdWVyeTogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAocXVlcnlhYmxlRmFjdG9yeSwgcmVnaW9uKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5fZ2VuZXJhdGVkRnJvbSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5fcmVhZE1vZGVsID0gbnVsbDtcclxuICAgICAgICB0aGlzLnJlZ2lvbiA9IHJlZ2lvbjtcclxuXHJcbiAgICAgICAgdGhpcy5hcmVBbGxQYXJhbWV0ZXJzU2V0ID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5oYXNSZWFkTW9kZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2Ygc2VsZi50YXJnZXQuX3JlYWRNb2RlbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBzZWxmLnRhcmdldC5fcmVhZE1vZGVsICE9IG51bGw7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKHBhcmFtZXRlcnMpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHBhcmFtZXRlcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi50YXJnZXQuaGFzT3duUHJvcGVydHkocHJvcGVydHkpICYmIGtvLmlzT2JzZXJ2YWJsZShzZWxmLnRhcmdldFtwcm9wZXJ0eV0pID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudGFyZ2V0W3Byb3BlcnR5XShwYXJhbWV0ZXJzW3Byb3BlcnR5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoKGV4KSB7fVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0UGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHBhcmFtZXRlcnMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHNlbGYudGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoa28uaXNPYnNlcnZhYmxlKHNlbGYudGFyZ2V0W3Byb3BlcnR5XSkgJiZcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eSAhPT0gXCJhcmVBbGxQYXJhbWV0ZXJzU2V0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzW3Byb3BlcnR5XSA9IHNlbGYudGFyZ2V0W3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHBhcmFtZXRlcnM7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRQYXJhbWV0ZXJWYWx1ZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJhbWV0ZXJWYWx1ZXMgPSB7fTtcclxuICAgICAgICAgICAgdmFyIHZhbHVlO1xyXG5cclxuICAgICAgICAgICAgdmFyIHBhcmFtZXRlcnMgPSBzZWxmLmdldFBhcmFtZXRlcnMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcGFyYW1ldGVycykge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBwYXJhbWV0ZXJzW3Byb3BlcnR5XSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJWYWx1ZXNbcHJvcGVydHldID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwYXJhbWV0ZXJWYWx1ZXM7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hbGwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVyeWFibGUgPSBxdWVyeWFibGVGYWN0b3J5LmNyZWF0ZShzZWxmLnRhcmdldCwgcmVnaW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5YWJsZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnBhZ2VkID0gZnVuY3Rpb24gKHBhZ2VTaXplLCBwYWdlTnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVyeWFibGUgPSBxdWVyeWFibGVGYWN0b3J5LmNyZWF0ZShzZWxmLnRhcmdldCwgcmVnaW9uKTtcclxuICAgICAgICAgICAgcXVlcnlhYmxlLnNldFBhZ2VJbmZvKHBhZ2VTaXplLCBwYWdlTnVtYmVyKTtcclxuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5YWJsZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9uQ3JlYXRlZCA9IGZ1bmN0aW9uIChxdWVyeSkge1xyXG4gICAgICAgICAgICBzZWxmLnRhcmdldCA9IHF1ZXJ5O1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gc2VsZi50YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChrby5pc09ic2VydmFibGUoc2VsZi50YXJnZXRbcHJvcGVydHldKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudGFyZ2V0W3Byb3BlcnR5XS5leHRlbmQoeyBsaW5rZWQ6IHt9IH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLmFyZUFsbFBhcmFtZXRlcnNTZXQgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXNTZXQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGhhc1BhcmFtZXRlcnMgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHNlbGYudGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZShzZWxmLnRhcmdldFtwcm9wZXJ0eV0pID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc1BhcmFtZXRlcnMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBrby51bndyYXAoc2VsZi50YXJnZXRbcHJvcGVydHldKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInVuZGVmaW5lZFwiIHx8IHZhbHVlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1NldCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoaGFzUGFyYW1ldGVycyA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBpc1NldDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5yZWFkXCIsIHtcclxuICAgIFF1ZXJ5YWJsZTogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAocXVlcnksIHF1ZXJ5U2VydmljZSwgcmVnaW9uLCB0YXJnZXRPYnNlcnZhYmxlKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmNhbkV4ZWN1dGUgPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldE9ic2VydmFibGU7XHJcbiAgICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5O1xyXG4gICAgICAgIHRoaXMucXVlcnlTZXJ2aWNlID0gcXVlcnlTZXJ2aWNlO1xyXG4gICAgICAgIHRoaXMucGFnZVNpemUgPSBrby5vYnNlcnZhYmxlKDApO1xyXG4gICAgICAgIHRoaXMucGFnZU51bWJlciA9IGtvLm9ic2VydmFibGUoMCk7XHJcbiAgICAgICAgdGhpcy50b3RhbEl0ZW1zID0ga28ub2JzZXJ2YWJsZSgwKTtcclxuICAgICAgICB0aGlzLmNvbXBsZXRlZENhbGxiYWNrcyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLnBhZ2VTaXplLnN1YnNjcmliZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmNhbkV4ZWN1dGUpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuZXhlY3V0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucGFnZU51bWJlci5zdWJzY3JpYmUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5jYW5FeGVjdXRlKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmV4ZWN1dGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBvYnNlcnZlUHJvcGVydGllc0Zyb20ocXVlcnkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHlOYW1lIGluIHF1ZXJ5KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHkgPSBxdWVyeVtwcm9wZXJ0eU5hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZShwcm9wZXJ0eSkgPT09IHRydWUgJiYgcXVlcnkuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSAmJiBwcm9wZXJ0eU5hbWUgIT09IFwiYXJlQWxsUGFyYW1ldGVyc1NldFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkuc3Vic2NyaWJlKHNlbGYuZXhlY3V0ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY29tcGxldGVkID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHNlbGYuY29tcGxldGVkQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9uQ29tcGxldGVkID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgc2VsZi5jb21wbGV0ZWRDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmV4ZWN1dGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnF1ZXJ5LmFyZUFsbFBhcmFtZXRlcnNTZXQoKSAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogRGlhZ25vc3RpY3MgLSB3YXJuaW5nXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi50YXJnZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2VsZi5xdWVyeS5fcHJldmlvdXNBcmVBbGxQYXJhbWV0ZXJzU2V0ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwYWdpbmcgPSBCaWZyb3N0LnJlYWQuUGFnaW5nSW5mby5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgc2l6ZTogc2VsZi5wYWdlU2l6ZSgpLFxyXG4gICAgICAgICAgICAgICAgbnVtYmVyOiBzZWxmLnBhZ2VOdW1iZXIoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc2VsZi5xdWVyeVNlcnZpY2UuZXhlY3V0ZShxdWVyeSwgcGFnaW5nKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHJlc3VsdCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnRvdGFsSXRlbXMocmVzdWx0LnRvdGFsSXRlbXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudGFyZ2V0KHJlc3VsdC5pdGVtcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5vbkNvbXBsZXRlZChyZXN1bHQuaXRlbXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnRhcmdldDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNldFBhZ2VJbmZvID0gZnVuY3Rpb24gKHBhZ2VTaXplLCBwYWdlTnVtYmVyKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFnZVNpemUgPT09IHNlbGYucGFnZVNpemUoKSAmJiBwYWdlTnVtYmVyID09PSBzZWxmLnBhZ2VOdW1iZXIoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLmNhbkV4ZWN1dGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgc2VsZi5wYWdlU2l6ZShwYWdlU2l6ZSk7XHJcbiAgICAgICAgICAgIHNlbGYucGFnZU51bWJlcihwYWdlTnVtYmVyKTtcclxuICAgICAgICAgICAgc2VsZi5jYW5FeGVjdXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgc2VsZi5leGVjdXRlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgb2JzZXJ2ZVByb3BlcnRpZXNGcm9tKHNlbGYucXVlcnkpO1xyXG5cclxuICAgICAgICBpZiAoc2VsZi5xdWVyeS5hcmVBbGxQYXJhbWV0ZXJzU2V0KCkpIHtcclxuICAgICAgICAgICAgc2VsZi5leGVjdXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LnJlYWQuUXVlcnlhYmxlLm5ldyA9IGZ1bmN0aW9uIChvcHRpb25zLCByZWdpb24pIHtcclxuICAgIHZhciBvYnNlcnZhYmxlID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICBvcHRpb25zLnRhcmdldE9ic2VydmFibGUgPSBvYnNlcnZhYmxlO1xyXG4gICAgb3B0aW9ucy5yZWdpb24gPSByZWdpb247XHJcbiAgICB2YXIgcXVlcnlhYmxlID0gQmlmcm9zdC5yZWFkLlF1ZXJ5YWJsZS5jcmVhdGUob3B0aW9ucyk7XHJcbiAgICBCaWZyb3N0LmV4dGVuZChvYnNlcnZhYmxlLCBxdWVyeWFibGUpO1xyXG4gICAgb2JzZXJ2YWJsZS5pc1F1ZXJ5YWJsZSA9IHRydWU7XHJcbiAgICByZXR1cm4gb2JzZXJ2YWJsZTtcclxufTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QucmVhZFwiLCB7XHJcbiAgICBxdWVyeWFibGVGYWN0b3J5OiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAocXVlcnksIHJlZ2lvbikge1xyXG4gICAgICAgICAgICB2YXIgcXVlcnlhYmxlID0gQmlmcm9zdC5yZWFkLlF1ZXJ5YWJsZS5uZXcoe1xyXG4gICAgICAgICAgICAgICAgcXVlcnk6IHF1ZXJ5XHJcbiAgICAgICAgICAgIH0sIHJlZ2lvbik7XHJcbiAgICAgICAgICAgIHJldHVybiBxdWVyeWFibGU7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLnF1ZXJ5YWJsZUZhY3RvcnkgPSBCaWZyb3N0LmludGVyYWN0aW9uLnF1ZXJ5YWJsZUZhY3Rvcnk7IiwiQmlmcm9zdC5kZXBlbmRlbmN5UmVzb2x2ZXJzLnF1ZXJ5ID0ge1xyXG4gICAgY2FuUmVzb2x2ZTogZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgcmVhZCAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gbmFtZSBpbiByZWFkO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc29sdmU6IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gcmVhZFtuYW1lXS5jcmVhdGUoKTtcclxuICAgIH1cclxufTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QucmVhZFwiLCB7XHJcbiAgICBxdWVyeVNlcnZpY2U6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uIChtYXBwZXIsIHRhc2tGYWN0b3J5KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmV4ZWN1dGUgPSBmdW5jdGlvbiAocXVlcnksIHBhZ2luZykge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHZhciByZWdpb24gPSBxdWVyeS5yZWdpb247XHJcblxyXG4gICAgICAgICAgICB2YXIgdGFzayA9IHRhc2tGYWN0b3J5LmNyZWF0ZVF1ZXJ5KHF1ZXJ5LCBwYWdpbmcpO1xyXG4gICAgICAgICAgICByZWdpb24udGFza3MuZXhlY3V0ZSh0YXNrKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQgPT09IFwidW5kZWZpbmVkXCIgfHwgcmVzdWx0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB7fTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzdWx0Lml0ZW1zID09PSBcInVuZGVmaW5lZFwiIHx8IHJlc3VsdC5pdGVtcyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0Lml0ZW1zID0gW107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlc3VsdC50b3RhbEl0ZW1zID09PSBcInVuZGVmaW5lZFwiIHx8IHJlc3VsdC50b3RhbEl0ZW1zID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQudG90YWxJdGVtcyA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHF1ZXJ5Lmhhc1JlYWRNb2RlbCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0Lml0ZW1zID0gbWFwcGVyLm1hcChxdWVyeS5fcmVhZE1vZGVsLCByZXN1bHQuaXRlbXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwocmVzdWx0KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnJlYWRcIiwge1xyXG4gICAgUXVlcnlUYXNrOiBCaWZyb3N0LnRhc2tzLkxvYWRUYXNrLmV4dGVuZChmdW5jdGlvbiAocXVlcnksIHBhZ2luZywgdGFza0ZhY3RvcnkpIHtcclxuICAgICAgICB2YXIgdXJsID0gXCIvQmlmcm9zdC9RdWVyeS9FeGVjdXRlP19xPVwiICsgcXVlcnkuX2dlbmVyYXRlZEZyb207XHJcbiAgICAgICAgdmFyIHBheWxvYWQgPSB7XHJcbiAgICAgICAgICAgIGRlc2NyaXB0b3I6IHtcclxuICAgICAgICAgICAgICAgIG5hbWVPZlF1ZXJ5OiBxdWVyeS5fbmFtZSxcclxuICAgICAgICAgICAgICAgIGdlbmVyYXRlZEZyb206IHF1ZXJ5Ll9nZW5lcmF0ZWRGcm9tLFxyXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyczogcXVlcnkuZ2V0UGFyYW1ldGVyVmFsdWVzKClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcGFnaW5nOiB7XHJcbiAgICAgICAgICAgICAgICBzaXplOiBwYWdpbmcuc2l6ZSxcclxuICAgICAgICAgICAgICAgIG51bWJlcjogcGFnaW5nLm51bWJlclxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5Ll9uYW1lO1xyXG4gICAgICAgIHRoaXMucGFnaW5nID0gcGF5bG9hZC5wYWdpbmc7XHJcblxyXG4gICAgICAgIHZhciBpbm5lclRhc2sgPSB0YXNrRmFjdG9yeS5jcmVhdGVIdHRwUG9zdCh1cmwsIHBheWxvYWQpO1xyXG5cclxuICAgICAgICB0aGlzLmV4ZWN1dGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gaW5uZXJUYXNrLmV4ZWN1dGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5yZWFkXCIsIHtcclxuICAgIFJlYWRNb2RlbDogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBhY3R1YWxSZWFkTW9kZWwgPSB0aGlzO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5jb3B5VG8gPSBmdW5jdGlvbiAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGFjdHVhbFJlYWRNb2RlbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdHVhbFJlYWRNb2RlbC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkgJiYgcHJvcGVydHkuaW5kZXhPZihcIl9cIikgIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGFjdHVhbFJlYWRNb2RlbFtwcm9wZXJ0eV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGFyZ2V0Lmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcGVydHldID0ga28ub2JzZXJ2YWJsZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZSh0YXJnZXRbcHJvcGVydHldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BlcnR5XSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcGVydHldID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9uQ3JlYXRlZCA9IGZ1bmN0aW9uIChsYXN0RGVzY2VuZGFudCkge1xyXG4gICAgICAgICAgICBhY3R1YWxSZWFkTW9kZWwgPSBsYXN0RGVzY2VuZGFudDtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnJlYWRcIiwge1xyXG4gICAgUmVhZE1vZGVsT2Y6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKHJlZ2lvbiwgbWFwcGVyLCB0YXNrRmFjdG9yeSwgcmVhZE1vZGVsU3lzdGVtRXZlbnRzKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5fZ2VuZXJhdGVkRnJvbSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5fcmVhZE1vZGVsVHlwZSA9IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkgeyB9KTtcclxuICAgICAgICB0aGlzLmluc3RhbmNlID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgIHRoaXMuY29tbWFuZFRvUG9wdWxhdGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMucmVnaW9uID0gcmVnaW9uO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiB1bndyYXBQcm9wZXJ0eUZpbHRlcnMocHJvcGVydHlGaWx0ZXJzKSB7XHJcbiAgICAgICAgICAgIHZhciB1bndyYXBwZWRQcm9wZXJ0eUZpbHRlcnMgPSB7fTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcHJvcGVydHlGaWx0ZXJzKSB7XHJcbiAgICAgICAgICAgICAgICB1bndyYXBwZWRQcm9wZXJ0eUZpbHRlcnNbcHJvcGVydHldID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShwcm9wZXJ0eUZpbHRlcnNbcHJvcGVydHldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdW53cmFwcGVkUHJvcGVydHlGaWx0ZXJzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcGVyZm9ybUxvYWQodGFyZ2V0LCBwcm9wZXJ0eUZpbHRlcnMpIHtcclxuICAgICAgICAgICAgdmFyIHRhc2sgPSB0YXNrRmFjdG9yeS5jcmVhdGVSZWFkTW9kZWwodGFyZ2V0LCBwcm9wZXJ0eUZpbHRlcnMpO1xyXG4gICAgICAgICAgICB0YXJnZXQucmVnaW9uLnRhc2tzLmV4ZWN1dGUodGFzaykuY29udGludWVXaXRoKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoZGF0YSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbWFwcGVkUmVhZE1vZGVsID0gbWFwcGVyLm1hcCh0YXJnZXQuX3JlYWRNb2RlbFR5cGUsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaW5zdGFuY2UobWFwcGVkUmVhZE1vZGVsKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVhZE1vZGVsU3lzdGVtRXZlbnRzLm5vSW5zdGFuY2UudHJpZ2dlcih0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VNYXRjaGluZyA9IGZ1bmN0aW9uIChwcm9wZXJ0eUZpbHRlcnMpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gbG9hZCgpIHtcclxuICAgICAgICAgICAgICAgIHZhciB1bndyYXBwZWRQcm9wZXJ0eUZpbHRlcnMgPSB1bndyYXBQcm9wZXJ0eUZpbHRlcnMocHJvcGVydHlGaWx0ZXJzKTtcclxuICAgICAgICAgICAgICAgIHBlcmZvcm1Mb2FkKHNlbGYudGFyZ2V0LCB1bndyYXBwZWRQcm9wZXJ0eUZpbHRlcnMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsb2FkKCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBwcm9wZXJ0eUZpbHRlcnMpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHByb3BlcnR5RmlsdGVyc1twcm9wZXJ0eV07XHJcbiAgICAgICAgICAgICAgICBpZiAoa28uaXNPYnNlcnZhYmxlKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLnN1YnNjcmliZShsb2FkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucG9wdWxhdGVDb21tYW5kT25DaGFuZ2VzID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgY29tbWFuZC5wb3B1bGF0ZWRFeHRlcm5hbGx5KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHNlbGYuaW5zdGFuY2UoKSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBzZWxmLmluc3RhbmNlKCkgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZC5wb3B1bGF0ZUZyb21FeHRlcm5hbFNvdXJjZShzZWxmLmluc3RhbmNlKCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLmluc3RhbmNlLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmQucG9wdWxhdGVGcm9tRXh0ZXJuYWxTb3VyY2UobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9uQ3JlYXRlZCA9IGZ1bmN0aW9uIChsYXN0RGVzY2VuZGFudCkge1xyXG4gICAgICAgICAgICBzZWxmLnRhcmdldCA9IGxhc3REZXNjZW5kYW50O1xyXG4gICAgICAgICAgICB2YXIgcmVhZE1vZGVsSW5zdGFuY2UgPSBsYXN0RGVzY2VuZGFudC5fcmVhZE1vZGVsVHlwZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgc2VsZi5pbnN0YW5jZShyZWFkTW9kZWxJbnN0YW5jZSk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QuZGVwZW5kZW5jeVJlc29sdmVycy5yZWFkTW9kZWxPZiA9IHtcclxuICAgIGNhblJlc29sdmU6IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHJlYWQgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5hbWUgaW4gcmVhZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICByZXNvbHZlOiBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlYWRbbmFtZV0uY3JlYXRlKCk7XHJcbiAgICB9XHJcbn07IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnJlYWRcIiwge1xyXG4gICAgcmVhZE1vZGVsU2VydmljZTogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24oKSB7XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QucmVhZFwiLCB7XHJcbiAgICByZWFkTW9kZWxTeXN0ZW1FdmVudHM6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLm5vSW5zdGFuY2UgPSBCaWZyb3N0LkV2ZW50LmNyZWF0ZSgpO1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnJlYWRcIiwge1xyXG4gICAgUmVhZE1vZGVsVGFzazogQmlmcm9zdC50YXNrcy5Mb2FkVGFzay5leHRlbmQoZnVuY3Rpb24gKHJlYWRNb2RlbE9mLCBwcm9wZXJ0eUZpbHRlcnMsIHRhc2tGYWN0b3J5KSB7XHJcbiAgICAgICAgdmFyIHVybCA9IFwiL0JpZnJvc3QvUmVhZE1vZGVsL0luc3RhbmNlTWF0Y2hpbmc/X3JtPVwiICsgcmVhZE1vZGVsT2YuX2dlbmVyYXRlZEZyb207XHJcbiAgICAgICAgdmFyIHBheWxvYWQgPSB7XHJcbiAgICAgICAgICAgIGRlc2NyaXB0b3I6IHtcclxuICAgICAgICAgICAgICAgIHJlYWRNb2RlbDogcmVhZE1vZGVsT2YuX25hbWUsXHJcbiAgICAgICAgICAgICAgICBnZW5lcmF0ZWRGcm9tOiByZWFkTW9kZWxPZi5fZ2VuZXJhdGVkRnJvbSxcclxuICAgICAgICAgICAgICAgIHByb3BlcnR5RmlsdGVyczogcHJvcGVydHlGaWx0ZXJzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnJlYWRNb2RlbCA9IHJlYWRNb2RlbE9mLl9nZW5lcmF0ZWRGcm9tO1xyXG5cclxuICAgICAgICB2YXIgaW5uZXJUYXNrID0gdGFza0ZhY3RvcnkuY3JlYXRlSHR0cFBvc3QodXJsLCBwYXlsb2FkKTtcclxuXHJcbiAgICAgICAgdGhpcy5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IGlubmVyVGFzay5leGVjdXRlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Quc2FnYXNcIik7XHJcbkJpZnJvc3Quc2FnYXMuU2FnYSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBTYWdhKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5leGVjdXRlQ29tbWFuZHMgPSBmdW5jdGlvbiAoY29tbWFuZHMsIG9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBjYW5FeGVjdXRlU2FnYSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBjb21tYW5kcy5mb3JFYWNoKGZ1bmN0aW9uIChjb21tYW5kKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29tbWFuZC5vbkJlZm9yZUV4ZWN1dGUoKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYW5FeGVjdXRlU2FnYSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FuRXhlY3V0ZVNhZ2EgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgQmlmcm9zdC5jb21tYW5kcy5jb21tYW5kQ29vcmRpbmF0b3IuaGFuZGxlRm9yU2FnYShzZWxmLCBjb21tYW5kcywgb3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKGNvbmZpZ3VyYXRpb24pIHtcclxuICAgICAgICAgICAgdmFyIHNhZ2EgPSBuZXcgU2FnYSgpO1xyXG4gICAgICAgICAgICBCaWZyb3N0LmV4dGVuZChzYWdhLCBjb25maWd1cmF0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNhZ2E7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSkoKTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnNhZ2FzXCIpO1xyXG5CaWZyb3N0LnNhZ2FzLnNhZ2FOYXJyYXRvciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgYmFzZVVybCA9IFwiL0JpZnJvc3QvU2FnYU5hcnJhdG9yXCI7XHJcbiAgICAvLyBUb2RvIDogYWJzdHJhY3QgYXdheSBpbnRvIGdlbmVyYWwgU2VydmljZSBjb2RlIC0gbG9vayBhdCBDb21tYW5kQ29vcmRpbmF0b3IuanMgZm9yIHRoZSBvdGhlciBjb3B5IG9mIHRoaXMhc1xyXG4gICAgZnVuY3Rpb24gcG9zdCh1cmwsIGRhdGEsIGNvbXBsZXRlSGFuZGxlcikge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBjb21wbGV0ZUhhbmRsZXJcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpc1JlcXVlc3RTdWNjZXNzKGpxWEhSLCBjb21tYW5kUmVzdWx0KSB7XHJcbiAgICAgICAgaWYgKGpxWEhSLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIGlmIChjb21tYW5kUmVzdWx0LnN1Y2Nlc3MgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvbmNsdWRlOiBmdW5jdGlvbiAoc2FnYSwgc3VjY2VzcywgZXJyb3IpIHtcclxuICAgICAgICAgICAgdmFyIG1ldGhvZFBhcmFtZXRlcnMgPSB7XHJcbiAgICAgICAgICAgICAgICBzYWdhSWQ6IHNhZ2EuSWRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcG9zdChiYXNlVXJsICsgXCIvQ29uY2x1ZGVcIiwgSlNPTi5zdHJpbmdpZnkobWV0aG9kUGFyYW1ldGVycyksIGZ1bmN0aW9uIChqcVhIUikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbW1hbmRSZXN1bHQgPSBCaWZyb3N0LmNvbW1hbmRzLkNvbW1hbmRSZXN1bHQuY3JlYXRlRnJvbShqcVhIUi5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlzU3VjY2VzcyA9IGlzUmVxdWVzdFN1Y2Nlc3MoanFYSFIsIGNvbW1hbmRSZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzU3VjY2VzcyA9PT0gdHJ1ZSAmJiB0eXBlb2Ygc3VjY2VzcyA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyhzYWdhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpc1N1Y2Nlc3MgPT09IGZhbHNlICYmIHR5cGVvZiBlcnJvciA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3Ioc2FnYSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0pKCk7XHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5zZXJ2aWNlc1wiLCB7XHJcbiAgICBTZXJ2aWNlOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMudXJsID0gXCJcIjtcclxuICAgICAgICB0aGlzLm5hbWUgPSBcIlwiO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBwcmVwYXJlQXJndW1lbnRzKGFyZ3MpIHtcclxuICAgICAgICAgICAgdmFyIHByZXBhcmVkID0ge307XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBhcmdzKSB7XHJcbiAgICAgICAgICAgICAgICBwcmVwYXJlZFtwcm9wZXJ0eV0gPSBKU09OLnN0cmluZ2lmeShhcmdzW3Byb3BlcnR5XSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBzdHJpbmdpZmllZCA9IEpTT04uc3RyaW5naWZ5KHByZXBhcmVkKTtcclxuICAgICAgICAgICAgcmV0dXJuIHN0cmluZ2lmaWVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2FsbChtZXRob2QsIGFyZ3MsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHNlbGYudXJsICsgXCIvXCIgKyBtZXRob2QsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogcHJlcGFyZUFyZ3VtZW50cyhhcmdzKSxcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcsXHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2ID0gJC5wYXJzZUpTT04ocmVzdWx0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sodik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMuY2FsbFdpdGhvdXRSZXR1cm5WYWx1ZSA9IGZ1bmN0aW9uIChtZXRob2QsIGFyZ3MpIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICBjYWxsKG1ldGhvZCwgYXJncywgZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNhbGxXaXRoT2JqZWN0QXNSZXR1cm4gPSBmdW5jdGlvbiAobWV0aG9kLCBhcmdzKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICAgICAgY2FsbChtZXRob2QsIGFyZ3MsIGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSh2KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNhbGxXaXRoQXJyYXlBc1JldHVybiA9IGZ1bmN0aW9uIChtZXRob2QsIGFyZ3MpIHtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgICAgIGNhbGwobWV0aG9kLCBhcmdzLCBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUodik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vbkNyZWF0ZWQgPSBmdW5jdGlvbiAobGFzdERlc2NlbmRhbnQpIHtcclxuICAgICAgICAgICAgc2VsZi51cmwgPSBsYXN0RGVzY2VuZGFudC51cmw7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnVybC5pbmRleE9mKFwiL1wiKSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi51cmwgPSBcIi9cIiArIHNlbGYudXJsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLm5hbWUgPSBsYXN0RGVzY2VuZGFudC5uYW1lO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlcnMuc2VydmljZSA9IHtcclxuICAgIGNhblJlc29sdmU6IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHNlcnZpY2VzICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lIGluIHNlcnZpY2VzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc29sdmU6IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gc2VydmljZXNbbmFtZV0uY3JlYXRlKCk7XHJcbiAgICB9XHJcbn07IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnNwZWNpZmljYXRpb25zXCIsIHtcclxuICAgIEFuZDogQmlmcm9zdC5zcGVjaWZpY2F0aW9ucy5TcGVjaWZpY2F0aW9uLmV4dGVuZChmdW5jdGlvbiAobGVmdEhhbmRTaWRlLCByaWdodEhhbmRTaWRlKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgdGhlIFwiYW5kXCIgY29tcG9zaXRlIHJ1bGUgYmFzZWQgb24gdGhlIHNwZWNpZmljYXRpb24gcGF0dGVybjwvc3VtbWFyeT5cclxuXHJcbiAgICAgICAgdGhpcy5pc1NhdGlzZmllZCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxlZnRIYW5kU2lkZS5pc1NhdGlzZmllZCgpICYmXHJcbiAgICAgICAgICAgICAgICByaWdodEhhbmRTaWRlLmlzU2F0aXNmaWVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZXZhbHVhdGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgbGVmdEhhbmRTaWRlLmV2YWx1YXRlKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgcmlnaHRIYW5kU2lkZS5ldmFsdWF0ZShpbnN0YW5jZSk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC5zcGVjaWZpY2F0aW9uc1wiLCB7XHJcbiAgICBPcjogQmlmcm9zdC5zcGVjaWZpY2F0aW9ucy5TcGVjaWZpY2F0aW9uLmV4dGVuZChmdW5jdGlvbiAobGVmdEhhbmRTaWRlLCByaWdodEhhbmRTaWRlKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgdGhlIFwib3JcIiBjb21wb3NpdGUgcnVsZSBiYXNlZCBvbiB0aGUgc3BlY2lmaWNhdGlvbiBwYXR0ZXJuPC9zdW1tYXJ5PlxyXG5cclxuICAgICAgICB0aGlzLmlzU2F0aXNmaWVkID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbGVmdEhhbmRTaWRlLmlzU2F0aXNmaWVkKCkgfHxcclxuICAgICAgICAgICAgICAgIHJpZ2h0SGFuZFNpZGUuaXNTYXRpc2ZpZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5ldmFsdWF0ZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICBsZWZ0SGFuZFNpZGUuZXZhbHVhdGUoaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICByaWdodEhhbmRTaWRlLmV2YWx1YXRlKGluc3RhbmNlKTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnNwZWNpZmljYXRpb25zXCIsIHtcclxuICAgIFNwZWNpZmljYXRpb246IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGEgcnVsZSBiYXNlZCBvbiB0aGUgc3BlY2lmaWNhdGlvbiBwYXR0ZXJuPC9zdW1tYXJ5PlxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY3VycmVudEluc3RhbmNlID0ga28ub2JzZXJ2YWJsZSgpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJldmFsdWF0b3JcIj5cclxuICAgICAgICAvLy8gSG9sZHMgdGhlIGV2YWx1YXRvciB0byBiZSB1c2VkIHRvIGV2YWx1YXRlIHdldGhlciBvciBub3QgdGhlIHJ1bGUgaXMgc2F0aXNmaWVkXHJcbiAgICAgICAgLy8vIDwvZmllbGQ+XHJcbiAgICAgICAgLy8vIDxyZW1hcmtzPlxyXG4gICAgICAgIC8vLyBUaGUgZXZhbHVhdG9yIGNhbiBlaXRoZXIgYmUgYSBmdW5jdGlvbiB0aGF0IGdldHMgY2FsbGVkIHdpdGggdGhlIGluc3RhbmNlXHJcbiAgICAgICAgLy8vIG9yIGFuIG9ic2VydmFibGUuIFRoZSBvYnNlcnZhYmxlIG5vdCBiZWluZyBhIHJlZ3VsYXIgZnVuY3Rpb24gd2lsbCBvYnZpb3VzbHlcclxuICAgICAgICAvLy8gbm90IGhhdmUgdGhlIGluc3RhbmNlIHBhc3NlZFxyXG4gICAgICAgIC8vLyA8L3JlbWFya3M+XHJcbiAgICAgICAgdGhpcy5ldmFsdWF0b3IgPSBudWxsO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJpc1NhdGlzZmllZFwiPk9ic2VydmFibGUgdGhhdCBob2xkcyB0aGUgcmVzdWx0IG9mIGFueSBldmFsdWF0aW9ucyBiZWluZyBkb25lPC9maWVsZD5cclxuICAgICAgICAvLy8gPHJlbWFya3M+XHJcbiAgICAgICAgLy8vIER1ZSB0byBpdHMgbmF0dXJlIG9mIGJlaW5nIGFuIG9ic2VydmFibGUsIGl0IHdpbGwgcmUtZXZhbHVhdGUgaWYgdGhlIGV2YWx1YXRvclxyXG4gICAgICAgIC8vLyBpcyBhbiBvYnNlcnZhYmxlIGFuZCBpdHMgc3RhdGUgY2hhbmdlcy5cclxuICAgICAgICAvLy8gPC9yZW1hcmtzPlxyXG4gICAgICAgIHRoaXMuaXNTYXRpc2ZpZWQgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChrby5pc09ic2VydmFibGUoc2VsZi5ldmFsdWF0b3IpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5ldmFsdWF0b3IoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBjdXJyZW50SW5zdGFuY2UoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChpbnN0YW5jZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmV2YWx1YXRvcihpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmV2YWx1YXRlID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5FdmFsdWF0ZXMgdGhlIHJ1bGU8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cImluc3RhbmNlXCI+T2JqZWN0IGluc3RhbmNlIHVzZWQgZHVyaW5nIGV2YWx1YXRpb248L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHJldHVybnM+VHJ1ZSBpZiBzYXRpc2ZpZWQsIGZhbHNlIGlmIG5vdDwvcmV0dXJucz5cclxuICAgICAgICAgICAgY3VycmVudEluc3RhbmNlKGluc3RhbmNlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmlzU2F0aXNmaWVkKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hbmQgPSBmdW5jdGlvbiAocnVsZSkge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+VGFrZXMgdGhpcyBydWxlIGFuZCBcImFuZHNcIiBpdCB0b2dldGhlciB3aXRoIGFub3RoZXIgcnVsZTwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwicnVsZVwiPlxyXG4gICAgICAgICAgICAvLy8gVGhpcyBjYW4gZWl0aGVyIGJlIHRoZSBpbnN0YW5jZSBvZiBhbm90aGVyIHNwZWNpZmljIHJ1bGUsXHJcbiAgICAgICAgICAgIC8vLyBvciBhbiBldmFsdWF0b3IgdGhhdCBjYW4gYmUgdXNlZCBkaXJlY3RseSBieSB0aGUgZGVmYXVsdCBydWxlIGltcGxlbWVudGF0aW9uXHJcbiAgICAgICAgICAgIC8vLyA8L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHJldHVybnM+QSBuZXcgY29tcG9zZWQgcnVsZTwvcmV0dXJucz5cclxuXHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzRnVuY3Rpb24ocnVsZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBvbGRSdWxlID0gcnVsZTtcclxuICAgICAgICAgICAgICAgIHJ1bGUgPSBCaWZyb3N0LnNwZWNpZmljYXRpb25zLlNwZWNpZmljYXRpb24uY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBydWxlLmV2YWx1YXRvciA9IG9sZFJ1bGU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBhbmQgPSBCaWZyb3N0LnNwZWNpZmljYXRpb25zLkFuZC5jcmVhdGUodGhpcywgcnVsZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBhbmQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vciA9IGZ1bmN0aW9uIChydWxlKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5UYWtlcyB0aGlzIHJ1bGUgYW5kIFwib3JzXCIgaXQgdG9nZXRoZXIgd2l0aCBhbm90aGVyIHJ1bGU8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cInJ1bGVcIj5cclxuICAgICAgICAgICAgLy8vIFRoaXMgY2FuIGVpdGhlciBiZSB0aGUgaW5zdGFuY2Ugb2YgYW5vdGhlciBzcGVjaWZpYyBydWxlLFxyXG4gICAgICAgICAgICAvLy8gb3IgYW4gZXZhbHVhdG9yIHRoYXQgY2FuIGJlIHVzZWQgZGlyZWN0bHkgYnkgdGhlIGRlZmF1bHQgcnVsZSBpbXBsZW1lbnRhdGlvblxyXG4gICAgICAgICAgICAvLy8gPC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxyZXR1cm5zPkEgbmV3IGNvbXBvc2VkIHJ1bGU8L3JldHVybnM+XHJcblxyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc0Z1bmN0aW9uKHJ1bGUpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2xkUnVsZSA9IHJ1bGU7XHJcbiAgICAgICAgICAgICAgICBydWxlID0gQmlmcm9zdC5zcGVjaWZpY2F0aW9ucy5TcGVjaWZpY2F0aW9uLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgcnVsZS5ldmFsdWF0b3IgPSBvbGRSdWxlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgb3IgPSBCaWZyb3N0LnNwZWNpZmljYXRpb25zLk9yLmNyZWF0ZSh0aGlzLCBydWxlKTtcclxuICAgICAgICAgICAgcmV0dXJuIG9yO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5zcGVjaWZpY2F0aW9ucy5TcGVjaWZpY2F0aW9uLndoZW4gPSBmdW5jdGlvbiAoZXZhbHVhdG9yKSB7XHJcbiAgICAvLy8gPHN1bW1hcnk+U3RhcnRzIGEgcnVsZSBjaGFpbjwvc3VtbWFyeT5cclxuICAgIC8vLyA8cGFyYW0gbmFtZT1cImV2YWx1YXRvclwiPlxyXG4gICAgLy8vIFRoZSBldmFsdWF0b3IgY2FuIGVpdGhlciBiZSBhIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgd2l0aCB0aGUgaW5zdGFuY2VcclxuICAgIC8vLyBvciBhbiBvYnNlcnZhYmxlLiBUaGUgb2JzZXJ2YWJsZSBub3QgYmVpbmcgYSByZWd1bGFyIGZ1bmN0aW9uIHdpbGwgb2J2aW91c2x5XHJcbiAgICAvLy8gbm90IGhhdmUgdGhlIGluc3RhbmNlIHBhc3NlZFxyXG4gICAgLy8vIDwvcGFyYW0+XHJcbiAgICAvLy8gPHJldHVybnM+QSBuZXcgY29tcG9zZWQgcnVsZTwvcmV0dXJucz5cclxuICAgIHZhciBydWxlID0gQmlmcm9zdC5zcGVjaWZpY2F0aW9ucy5TcGVjaWZpY2F0aW9uLmNyZWF0ZSgpO1xyXG4gICAgcnVsZS5ldmFsdWF0b3IgPSBldmFsdWF0b3I7XHJcbiAgICByZXR1cm4gcnVsZTtcclxufTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudGFza3NcIiwge1xyXG4gICAgRXhlY3V0aW9uVGFzazogQmlmcm9zdC50YXNrcy5UYXNrLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSBiYXNlIHRhc2sgdGhhdCByZXByZXNlbnRzIGFueXRoaW5nIHRoYXQgaXMgZXhlY3V0aW5nPC9zdW1tYXJ5PlxyXG4gICAgICAgIHRoaXMuZXhlY3V0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnRhc2tzXCIsIHtcclxuICAgIEZpbGVMb2FkVGFzazogQmlmcm9zdC50YXNrcy5Mb2FkVGFzay5leHRlbmQoZnVuY3Rpb24gKGZpbGVzLCBmaWxlTWFuYWdlcikge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGEgdGFzayBmb3IgbG9hZGluZyB2aWV3IHJlbGF0ZWQgZmlsZXMgYXN5bmNocm9ub3VzbHk8L3N1bW1hcnk+XHJcbiAgICAgICAgdGhpcy5maWxlcyA9IGZpbGVzO1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuZmlsZXMgPSBbXTtcclxuICAgICAgICBmaWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChmaWxlKSB7XHJcbiAgICAgICAgICAgIHNlbGYuZmlsZXMucHVzaChmaWxlLnBhdGguZnVsbFBhdGgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmV4ZWN1dGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIGZpbGVNYW5hZ2VyLmxvYWQoZmlsZXMpLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoaW5zdGFuY2VzKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChpbnN0YW5jZXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC50YXNrc1wiLCB7XHJcbiAgICBIdHRwR2V0VGFzazogQmlmcm9zdC50YXNrcy5UYXNrLmV4dGVuZChmdW5jdGlvbiAoc2VydmVyLCB1cmwsIHBheWxvYWQpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyBhIHRhc2sgdGhhdCBjYW4gcGVyZm9ybSBIdHRwIEdldCByZXF1ZXN0czwvc3VtbWFyeT5cclxuXHJcbiAgICAgICAgdGhpcy5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHNlcnZlclxyXG4gICAgICAgICAgICAgICAgLmdldCh1cmwsIHBheWxvYWQpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAub25GYWlsKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLmZhaWwoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnRhc2tzXCIsIHtcclxuICAgIEh0dHBQb3N0VGFzazogQmlmcm9zdC50YXNrcy5UYXNrLmV4dGVuZChmdW5jdGlvbiAoc2VydmVyLCB1cmwsIHBheWxvYWQpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+UmVwcmVzZW50cyBhIHRhc2sgdGhhdCBjYW4gcGVyZm9ybSBhIEh0dHAgUG9zdCByZXF1ZXN0PC9zdW1tYXJ5PlxyXG5cclxuICAgICAgICB0aGlzLmV4ZWN1dGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIHNlcnZlclxyXG4gICAgICAgICAgICAgICAgLnBvc3QodXJsLCBwYXlsb2FkKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLm9uRmFpbChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5mYWlsKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC50YXNrc1wiLCB7XHJcbiAgICBMb2FkVGFzazogQmlmcm9zdC50YXNrcy5UYXNrLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSBiYXNlIHRhc2sgdGhhdCByZXByZXNlbnRzIGFueXRoaW5nIHRoYXQgaXMgbG9hZGluZyB0aGluZ3M8L3N1bW1hcnk+XHJcbiAgICAgICAgdGhpcy5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudGFza3NcIiwge1xyXG4gICAgVGFzazogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSB0YXNrIHRoYXQgY2FuIGJlIGRvbmUgaW4gdGhlIHN5c3RlbTwvc3VtbWFyeT5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImVycm9yc1wiIHR5cGU9XCJvYnNlcnZhYmxlQXJyYXlcIj5PYnNlcnZhYmxlIGFycmF5IG9mIGVycm9yczwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5lcnJvcnMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiaXNFeGNldXRpbmdcIiB0eXBlPVwiYm9vbGVhblwiPlRydWUgLyBmYWxzZSBmb3IgdGVsbGluZyB3ZXRoZXIgb3Igbm90IHRoZSB0YXNrIGlzIGV4ZWN1dGluZyBvciBub3Q8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuaXNFeGVjdXRpbmcgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+RXhlY3V0ZXMgdGhlIHRhc2s8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cmV0dXJucz5BIHByb21pc2U8L3JldHVybnM+XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXBvcnRFcnJvciA9IGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+UmVwb3J0IGFuIGVycm9yIGZyb20gZXhlY3V0aW5nIHRoZSB0YXNrPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJlcnJvclwiIHR5cGU9XCJTdHJpbmdcIj5FcnJvciBjb21pbmcgYmFjazwvcGFyYW0+XHJcbiAgICAgICAgICAgIHNlbGYuZXJyb3JzLnB1c2goZXJyb3IpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudGFza3NcIiwge1xyXG4gICAgdGFza0hpc3Rvcnk6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uIChzeXN0ZW1DbG9jaykge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIHRoZSBoaXN0b3J5IG9mIHRhc2tzIHRoYXQgaGFzIGJlZW4gZXhlY3V0ZWQgc2luY2UgdGhlIHN0YXJ0IG9mIHRoZSBhcHBsaWNhdGlvbjwvc3VtbWFyeT5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciBlbnRyaWVzQnlJZCA9IHt9O1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIHBhcmFtPVwiZW50cmllc1wiIHR5cGU9XCJvYnNlcnZhYmxlQXJyYXlcIj5PYnNlcnZhYmxlIGFycmF5IG9mIGVudHJpZXM8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuZW50cmllcyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG5cclxuICAgICAgICB0aGlzLmJlZ2luID0gZnVuY3Rpb24gKHRhc2spIHtcclxuICAgICAgICAgICAgdmFyIGlkID0gQmlmcm9zdC5HdWlkLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHZhciBlbnRyeSA9IEJpZnJvc3QudGFza3MuVGFza0hpc3RvcnlFbnRyeS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBlbnRyeS50eXBlID0gdGFzay5fdHlwZS5fbmFtZTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY29udGVudCA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHRhc2spIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkuaW5kZXhPZihcIl9cIikgIT09IDAgJiYgdGFzay5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkgJiYgdHlwZW9mIHRhc2tbcHJvcGVydHldICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFtwcm9wZXJ0eV0gPSB0YXNrW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZW50cnkuY29udGVudCA9IEpTT04uc3RyaW5naWZ5KGNvbnRlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGVudHJ5LmJlZ2luKHN5c3RlbUNsb2NrLm5vd0luTWlsbGlzZWNvbmRzKCkpO1xyXG4gICAgICAgICAgICAgICAgZW50cmllc0J5SWRbaWRdID0gZW50cnk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmVudHJpZXMucHVzaChlbnRyeSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBUb2RvOiBwZXJmZWN0IHBsYWNlIGZvciBsb2dnaW5nIHNvbWV0aGluZ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpZDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmVuZCA9IGZ1bmN0aW9uIChpZCwgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmIChlbnRyaWVzQnlJZC5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBlbnRyeSA9IGVudHJpZXNCeUlkW2lkXTtcclxuICAgICAgICAgICAgICAgIGVudHJ5LmVuZChzeXN0ZW1DbG9jay5ub3dJbk1pbGxpc2Vjb25kcygpKTtcclxuICAgICAgICAgICAgICAgIGVudHJ5LnJlc3VsdChyZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5mYWlsZWQgPSBmdW5jdGlvbiAoaWQsIGVycm9yKSB7XHJcbiAgICAgICAgICAgIGlmIChlbnRyaWVzQnlJZC5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBlbnRyeSA9IGVudHJpZXNCeUlkW2lkXTtcclxuICAgICAgICAgICAgICAgIGVudHJ5LmVuZChzeXN0ZW1DbG9jay5ub3dJbk1pbGxpc2Vjb25kcygpKTtcclxuICAgICAgICAgICAgICAgIGVudHJ5LmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy50YXNrSGlzdG9yeSA9IEJpZnJvc3QudGFza3MudGFza0hpc3Rvcnk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnRhc2tzXCIsIHtcclxuICAgIFRhc2tIaXN0b3J5RW50cnk6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy50eXBlID0gXCJcIjtcclxuICAgICAgICB0aGlzLmNvbnRlbnQgPSBcIlwiO1xyXG5cclxuICAgICAgICB0aGlzLmJlZ2luID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgIHRoaXMuZW5kID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgIHRoaXMudG90YWwgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChzZWxmLmVuZCgpKSAmJlxyXG4gICAgICAgICAgICAgICAgIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoc2VsZi5iZWdpbigpKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZW5kKCkgLSBzZWxmLmJlZ2luKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZXN1bHQgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5lcnJvciA9IGtvLm9ic2VydmFibGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5pc0ZpbmlzaGVkID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoc2VsZi5lbmQoKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5oYXNGYWlsZWQgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAhQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChzZWxmLmVycm9yKCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmlzU3VjY2VzcyA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuaXNGaW5pc2hlZCgpICYmICFzZWxmLmhhc0ZhaWxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnRhc2tzXCIsIHtcclxuICAgIFRhc2tzOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICh0YXNrSGlzdG9yeSkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGFuIGFnZ3JlZ2F0aW9uIG9mIHRhc2tzPC9zdW1tYXJ5PlxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwidW5maWx0ZXJlZFwiIHR5cGU9XCJCaWZyb3N0LnRhc2tzLlRhc2tbXVwiPkFsbCB0YXNrcyBjb21wbGV0ZWx5IHVuZmlsdGVyZWQ8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMudW5maWx0ZXJlZCA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJleGVjdXRlV2hlblwiIHR5cGU9XCJCaWZyb3N0LnNwZWNpZmljYXRpb25zLlNwZWNpZmljYXRpb25cIj5HZXRzIG9yIHNldHMgdGhlIHJ1bGUgZm9yIGV4ZWN1dGlvbjwvZmllbGQ+XHJcbiAgICAgICAgLy8vIDxyZW1hcmtzPlxyXG4gICAgICAgIC8vLyBJZiBhIHRhc2sgZ2V0cyBleGVjdXRlZCB0aGF0IGRvZXMgbm90IGdldCBzYXRpc2ZpZWQgYnkgdGhlIHJ1bGUsIGl0IHdpbGwganVzdCBxdWV1ZSBpdCB1cFxyXG4gICAgICAgIC8vLyA8L3JlbWFya3M+XHJcbiAgICAgICAgdGhpcy5jYW5FeGVjdXRlV2hlbiA9IGtvLm9ic2VydmFibGUoKTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiYWxsXCIgdHlwZT1cIkJpZnJvc3QudGFza3MuVGFza1tdXCI+QWxsIHRhc2tzIGJlaW5nIGV4ZWN1dGVkPC9maWVsZD5cclxuICAgICAgICB0aGlzLmFsbCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGFsbCA9IHNlbGYudW5maWx0ZXJlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJ1bGUgPSBzZWxmLmNhbkV4ZWN1dGVXaGVuKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQocnVsZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBmaWx0ZXJlZCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIGFsbC5mb3JFYWNoKGZ1bmN0aW9uICh0YXNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcnVsZS5ldmFsdWF0ZSh0YXNrKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocnVsZS5pc1NhdGlzZmllZCgpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkLnB1c2godGFzayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyZWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhbGw7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImVycm9yc1wiIHR5cGU9XCJvYnNlcnZhYmxlQXJyYXlPZlN0cmluZ1wiPkFsbCBlcnJvcnMgdGhhdCBvY2N1cmVkIGR1cmluZyBleGVjdXRpb24gb2YgdGhlIHRhc2s8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuZXJyb3JzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImlzQnVzeVwiIHR5cGU9XCJCb29sZWFuXCI+UmV0dXJucyB0cnVlIGlmIHRoZSBzeXN0ZW0gaXMgYnVzeSB3b3JraW5nLCBmYWxzZSBpZiBub3Q8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuaXNCdXN5ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5hbGwoKS5sZW5ndGggPiAwO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBleGVjdXRlVGFza0lmTm90RXhlY3V0aW5nKHRhc2spIHtcclxuICAgICAgICAgICAgaWYgKHRhc2suaXNFeGVjdXRpbmcoKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRhc2suaXNFeGVjdXRpbmcodHJ1ZSk7XHJcbiAgICAgICAgICAgIHZhciB0YXNrSGlzdG9yeUlkID0gdGFza0hpc3RvcnkuYmVnaW4odGFzayk7XHJcblxyXG4gICAgICAgICAgICB0YXNrLmV4ZWN1dGUoKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi51bmZpbHRlcmVkLnJlbW92ZSh0YXNrKTtcclxuICAgICAgICAgICAgICAgIHRhc2tIaXN0b3J5LmVuZCh0YXNrSGlzdG9yeUlkLCByZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgdGFzay5wcm9taXNlLnNpZ25hbChyZXN1bHQpO1xyXG4gICAgICAgICAgICB9KS5vbkZhaWwoZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnVuZmlsdGVyZWQucmVtb3ZlKHRhc2spO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5lcnJvcnMucHVzaCh0YXNrKTtcclxuICAgICAgICAgICAgICAgIHRhc2tIaXN0b3J5LmZhaWxlZCh0YXNrSGlzdG9yeUlkLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB0YXNrLnByb21pc2UuZmFpbChlcnJvcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5hbGwuc3Vic2NyaWJlKGZ1bmN0aW9uIChjaGFuZ2VkVGFza3MpIHtcclxuICAgICAgICAgICAgY2hhbmdlZFRhc2tzLmZvckVhY2goZnVuY3Rpb24gKHRhc2spIHtcclxuICAgICAgICAgICAgICAgIGV4ZWN1dGVUYXNrSWZOb3RFeGVjdXRpbmcodGFzayk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmV4ZWN1dGUgPSBmdW5jdGlvbiAodGFzaykge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+QWRkcyBhIHRhc2sgYW5kIHN0YXJ0cyBleGVjdXRpbmcgaXQgcmlnaHQgYXdheTwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwidGFza1wiIHR5cGU9XCJCaWZyb3N0LnRhc2tzLlRhc2tcIj5UYXNrIHRvIGFkZDwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxyZXR1cm5zPkEgcHJvbWlzZSB0byB3b3JrIHdpdGggZm9yIGNoYWluaW5nIGZ1cnRoZXIgZXZlbnRzPC9yZXR1cm5zPlxyXG5cclxuICAgICAgICAgICAgdGFzay5wcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgc2VsZi51bmZpbHRlcmVkLnB1c2godGFzayk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcnVsZSA9IHNlbGYuY2FuRXhlY3V0ZVdoZW4oKTtcclxuICAgICAgICAgICAgdmFyIGNhbkV4ZWN1dGUgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQocnVsZSkpIHtcclxuICAgICAgICAgICAgICAgIGNhbkV4ZWN1dGUgPSBydWxlLmV2YWx1YXRlKHRhc2spO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FuRXhlY3V0ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgZXhlY3V0ZVRhc2tJZk5vdEV4ZWN1dGluZyh0YXNrKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRhc2sucHJvbWlzZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnRhc2tzXCIsIHtcclxuICAgIHRhc2tzRmFjdG9yeTogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdGFza3MgPSBCaWZyb3N0LnRhc2tzLlRhc2tzLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGFza3M7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLnRhc2tzRmFjdG9yeSA9IEJpZnJvc3QudGFza3MudGFza3NGYWN0b3J5OyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC50eXBlc1wiLCB7XHJcbiAgICBQcm9wZXJ0eUluZm86IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKG5hbWUsIHR5cGUpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudHlwZXNcIiwge1xyXG4gICAgVHlwZUluZm86IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IFtdO1xyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QudHlwZXMuVHlwZUluZm8uY3JlYXRlRnJvbSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xyXG4gICAgdmFyIHR5cGVJbmZvID0gQmlmcm9zdC50eXBlcy5UeXBlSW5mby5jcmVhdGUoKTtcclxuICAgIHZhciBwcm9wZXJ0eUluZm87XHJcbiAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBpbnN0YW5jZSkge1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IGluc3RhbmNlW3Byb3BlcnR5XTtcclxuICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodmFsdWUpKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgdHlwZSA9IHZhbHVlLmNvbnN0cnVjdG9yO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGluc3RhbmNlW3Byb3BlcnR5XS5fdHlwZSkpIHtcclxuICAgICAgICAgICAgICAgIHR5cGUgPSBpbnN0YW5jZVtwcm9wZXJ0eV0uX3R5cGU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHByb3BlcnR5SW5mbyA9IEJpZnJvc3QudHlwZXMuUHJvcGVydHlJbmZvLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBwcm9wZXJ0eSxcclxuICAgICAgICAgICAgICAgIHR5cGU6IHR5cGVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHR5cGVJbmZvLnByb3BlcnRpZXMucHVzaChwcm9wZXJ0eUluZm8pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHR5cGVJbmZvO1xyXG59O1xyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgYXJlRXF1YWw6IGZ1bmN0aW9uIChzb3VyY2UsIHRhcmdldCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGlzUmVzZXJ2ZWRNZW1iZXJOYW1lKG1lbWJlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gbWVtYmVyLmluZGV4T2YoXCJfXCIpID49IDAgfHwgbWVtYmVyID09PSBcIm1vZGVsXCIgfHwgbWVtYmVyID09PSBcImNvbW1vbnNcIiB8fCBtZW1iZXIgPT09IFwidGFyZ2V0Vmlld01vZGVsXCIgfHwgbWVtYmVyID09PSBcInJlZ2lvblwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZShzb3VyY2UpKSB7XHJcbiAgICAgICAgICAgIHNvdXJjZSA9IHNvdXJjZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoa28uaXNPYnNlcnZhYmxlKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChzb3VyY2UpICYmIEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodGFyZ2V0KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHNvdXJjZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChCaWZyb3N0LmlzQXJyYXkoc291cmNlKSAmJiBCaWZyb3N0LmlzQXJyYXkodGFyZ2V0KSkge1xyXG4gICAgICAgICAgICBpZiAoc291cmNlLmxlbmd0aCAhPT0gdGFyZ2V0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgc291cmNlLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKEJpZnJvc3QuYXJlRXF1YWwoc291cmNlW2luZGV4XSwgdGFyZ2V0W2luZGV4XSkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgbWVtYmVyIGluIHNvdXJjZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzUmVzZXJ2ZWRNZW1iZXJOYW1lKG1lbWJlcikpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQuaGFzT3duUHJvcGVydHkobWVtYmVyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzb3VyY2VWYWx1ZSA9IHNvdXJjZVttZW1iZXJdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXRWYWx1ZSA9IHRhcmdldFttZW1iZXJdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC5pc09iamVjdChzb3VyY2VWYWx1ZSkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgQmlmcm9zdC5pc0FycmF5KHNvdXJjZVZhbHVlKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrby5pc09ic2VydmFibGUoc291cmNlVmFsdWUpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuYXJlRXF1YWwoc291cmNlVmFsdWUsIHRhcmdldFZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNvdXJjZVZhbHVlICE9PSB0YXJnZXRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgYXNzZXRzTWFuYWdlcjoge1xyXG4gICAgICAgIHNjcmlwdHM6IFtdLFxyXG4gICAgICAgIGlzSW5pdGlhbGl6ZWQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gQmlmcm9zdC5hc3NldHNNYW5hZ2VyLnNjcmlwdHMubGVuZ3RoID4gMDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuYXNzZXRzTWFuYWdlci5pc0luaXRpYWxpemVkKCkpIHtcclxuICAgICAgICAgICAgICAgICQuZ2V0KFwiL0JpZnJvc3QvQXNzZXRzTWFuYWdlclwiLCB7IGV4dGVuc2lvbjogXCJqc1wiIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBCaWZyb3N0LmFzc2V0c01hbmFnZXIuaW5pdGlhbGl6ZUZyb21Bc3NldHMocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbCgpO1xyXG4gICAgICAgICAgICAgICAgfSwgXCJqc29uXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGluaXRpYWxpemVGcm9tQXNzZXRzOiBmdW5jdGlvbiAoYXNzZXRzKSB7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5hc3NldHNNYW5hZ2VyLmlzSW5pdGlhbGl6ZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgQmlmcm9zdC5hc3NldHNNYW5hZ2VyLnNjcmlwdHMgPSBhc3NldHM7XHJcbiAgICAgICAgICAgICAgICBCaWZyb3N0Lm5hbWVzcGFjZXMuY3JlYXRlKCkuaW5pdGlhbGl6ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRTY3JpcHRzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBCaWZyb3N0LmFzc2V0c01hbmFnZXIuc2NyaXB0cztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGhhc1NjcmlwdDogZnVuY3Rpb24oc2NyaXB0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBCaWZyb3N0LmFzc2V0c01hbmFnZXIuc2NyaXB0cy5zb21lKGZ1bmN0aW9uIChzY3JpcHRJblN5c3RlbSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNjcmlwdEluU3lzdGVtID09PSBzY3JpcHQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0U2NyaXB0UGF0aHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHBhdGhzID0gW107XHJcblxyXG4gICAgICAgICAgICBCaWZyb3N0LmFzc2V0c01hbmFnZXIuc2NyaXB0cy5mb3JFYWNoKGZ1bmN0aW9uIChmdWxsUGF0aCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhdGggPSBCaWZyb3N0LlBhdGguZ2V0UGF0aFdpdGhvdXRGaWxlbmFtZShmdWxsUGF0aCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGF0aHMuaW5kZXhPZihwYXRoKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXRocy5wdXNoKHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHBhdGhzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIGNvbmZpZ3VyYXRvcjogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWd1cmUgPSBmdW5jdGlvbiAoY29uZmlndXJlKSB7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBjb25maWd1cmVUeXBlOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbihhc3NldHNNYW5hZ2VyKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgZGVmYXVsdFVyaU1hcHBlciA9IEJpZnJvc3QuU3RyaW5nTWFwcGVyLmNyZWF0ZSgpO1xyXG4gICAgICAgIGRlZmF1bHRVcmlNYXBwZXIuYWRkTWFwcGluZyhcIntib3VuZGVkQ29udGV4dH0ve21vZHVsZX0ve2ZlYXR1cmV9L3t2aWV3fVwiLCBcIntib3VuZGVkQ29udGV4dH0ve21vZHVsZX0ve2ZlYXR1cmV9L3t2aWV3fS5odG1sXCIpO1xyXG4gICAgICAgIGRlZmF1bHRVcmlNYXBwZXIuYWRkTWFwcGluZyhcIntib3VuZGVkQ29udGV4dH0ve2ZlYXR1cmV9L3t2aWV3fVwiLCBcIntib3VuZGVkQ29udGV4dH0ve2ZlYXR1cmV9L3t2aWV3fS5odG1sXCIpO1xyXG4gICAgICAgIGRlZmF1bHRVcmlNYXBwZXIuYWRkTWFwcGluZyhcIntmZWF0dXJlfS97dmlld31cIiwgXCJ7ZmVhdHVyZX0ve3ZpZXd9Lmh0bWxcIik7XHJcbiAgICAgICAgZGVmYXVsdFVyaU1hcHBlci5hZGRNYXBwaW5nKFwie3ZpZXd9XCIsIFwie3ZpZXd9Lmh0bWxcIik7XHJcbiAgICAgICAgQmlmcm9zdC51cmlNYXBwZXJzLmRlZmF1bHQgPSBkZWZhdWx0VXJpTWFwcGVyO1xyXG5cclxuICAgICAgICB0aGlzLmlzUmVhZHkgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlYWR5Q2FsbGJhY2tzID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUxhbmRpbmdQYWdlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmFwcGx5TWFzdGVyVmlld01vZGVsID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb25SZWFkeSgpIHtcclxuICAgICAgICAgICAgQmlmcm9zdC52aWV3cy5SZWdpb24uY3VycmVudCA9IGRvY3VtZW50LmJvZHkucmVnaW9uO1xyXG4gICAgICAgICAgICBzZWxmLmlzUmVhZHkgPSB0cnVlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBjYWxsYmFja0luZGV4ID0gMDsgY2FsbGJhY2tJbmRleCA8IHNlbGYucmVhZHlDYWxsYmFja3MubGVuZ3RoOyBjYWxsYmFja0luZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucmVhZHlDYWxsYmFja3NbY2FsbGJhY2tJbmRleF0oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaG9va1VwTmF2aWdhaW9uQW5kQXBwbHlWaWV3TW9kZWwoKSB7XHJcbiAgICAgICAgICAgIEJpZnJvc3QubmF2aWdhdGlvbi5uYXZpZ2F0aW9uTWFuYWdlci5ob29rdXAoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWxmLmFwcGx5TWFzdGVyVmlld01vZGVsID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBCaWZyb3N0LnZpZXdzLnZpZXdNb2RlbE1hbmFnZXIuY3JlYXRlKCkubWFzdGVyVmlld01vZGVsLmFwcGx5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9uU3RhcnR1cCgpIHtcclxuICAgICAgICAgICAgdmFyIGNvbmZpZ3VyYXRvcnMgPSBCaWZyb3N0LmNvbmZpZ3VyYXRvci5nZXRFeHRlbmRlcnMoKTtcclxuICAgICAgICAgICAgY29uZmlndXJhdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChjb25maWd1cmF0b3JUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29uZmlndXJhdG9yID0gY29uZmlndXJhdG9yVHlwZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRvci5jb25maWcoc2VsZik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIEJpZnJvc3QuZGVwZW5kZW5jeVJlc29sdmVycy5ET01Sb290RGVwZW5kZW5jeVJlc29sdmVyLmRvY3VtZW50SXNSZWFkeSgpO1xyXG4gICAgICAgICAgICBCaWZyb3N0LnZpZXdzLnZpZXdNb2RlbEJpbmRpbmdIYW5kbGVyLmluaXRpYWxpemUoKTtcclxuICAgICAgICAgICAgQmlmcm9zdC52aWV3cy52aWV3QmluZGluZ0hhbmRsZXIuaW5pdGlhbGl6ZSgpO1xyXG4gICAgICAgICAgICBCaWZyb3N0Lm5hdmlnYXRpb24ubmF2aWdhdGlvbkJpbmRpbmdIYW5kbGVyLmluaXRpYWxpemUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgSGlzdG9yeSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgSGlzdG9yeS5BZGFwdGVyICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICBCaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLmhpc3RvcnkgPSBIaXN0b3J5O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBhc3NldHNNYW5hZ2VyLmluaXRpYWxpemUoKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuaW5pdGlhbGl6ZUxhbmRpbmdQYWdlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQmlmcm9zdC52aWV3cy52aWV3TWFuYWdlci5jcmVhdGUoKS5pbml0aWFsaXplTGFuZGluZ1BhZ2UoKS5jb250aW51ZVdpdGgoaG9va1VwTmF2aWdhaW9uQW5kQXBwbHlWaWV3TW9kZWwpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBob29rVXBOYXZpZ2Fpb25BbmRBcHBseVZpZXdNb2RlbCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgb25SZWFkeSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlc2V0KCkge1xyXG4gICAgICAgICAgICBzZWxmLmlzUmVhZHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgc2VsZi5yZWFkeUNhbGxiYWNrcyA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZWFkeSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmlzUmVhZHkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnJlYWR5Q2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIG9uU3RhcnR1cCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QuY29uZmlndXJlID0gQmlmcm9zdC5jb25maWd1cmVUeXBlLmNyZWF0ZSgpO1xyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgZGVlcENsb25lOiBmdW5jdGlvbiAoc291cmNlLCB0YXJnZXQpIHtcclxuICAgICAgICBmdW5jdGlvbiBpc1Jlc2VydmVkTWVtYmVyTmFtZShtZW1iZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1lbWJlci5pbmRleE9mKFwiX1wiKSA+PSAwIHx8IG1lbWJlciA9PT0gXCJtb2RlbFwiIHx8IG1lbWJlciA9PT0gXCJjb21tb25zXCIgfHwgbWVtYmVyID09PSBcInRhcmdldFZpZXdNb2RlbFwiIHx8IG1lbWJlciA9PT0gXCJyZWdpb25cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChrby5pc09ic2VydmFibGUoc291cmNlKSkge1xyXG4gICAgICAgICAgICBzb3VyY2UgPSBzb3VyY2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0YXJnZXQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc0FycmF5KHNvdXJjZSkpIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldCA9IFtdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzb3VyY2VWYWx1ZTtcclxuICAgICAgICBpZiAoQmlmcm9zdC5pc0FycmF5KHNvdXJjZSkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHNvdXJjZS5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIHNvdXJjZVZhbHVlID0gc291cmNlW2luZGV4XTtcclxuICAgICAgICAgICAgICAgIHZhciBjbG9uZWRWYWx1ZSA9IEJpZnJvc3QuZGVlcENsb25lKHNvdXJjZVZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5wdXNoKGNsb25lZFZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIG1lbWJlciBpbiBzb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc1Jlc2VydmVkTWVtYmVyTmFtZShtZW1iZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc291cmNlVmFsdWUgPSBzb3VyY2VbbWVtYmVyXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoa28uaXNPYnNlcnZhYmxlKHNvdXJjZVZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZVZhbHVlID0gc291cmNlVmFsdWUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC5pc0Z1bmN0aW9uKHNvdXJjZVZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXRWYWx1ZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC5pc09iamVjdChzb3VyY2VWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRWYWx1ZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChCaWZyb3N0LmlzQXJyYXkoc291cmNlVmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VmFsdWUgPSBbXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W21lbWJlcl0gPSBzb3VyY2VWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0VmFsdWUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFttZW1iZXJdID0gdGFyZ2V0VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgQmlmcm9zdC5kZWVwQ2xvbmUoc291cmNlVmFsdWUsIHRhcmdldFZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgIH1cclxufSk7XHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBEZWZhdWx0RGVwZW5kZW5jeVJlc29sdmVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmRvZXNOYW1lc3BhY2VIYXZlID0gZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmFtZXNwYWNlLmhhc093blByb3BlcnR5KG5hbWUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZG9lc05hbWVzcGFjZUhhdmVTY3JpcHRSZWZlcmVuY2UgPSBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgICAgIGlmIChuYW1lc3BhY2UuaGFzT3duUHJvcGVydHkoXCJfc2NyaXB0c1wiKSAmJiBCaWZyb3N0LmlzQXJyYXkobmFtZXNwYWNlLl9zY3JpcHRzKSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lc3BhY2UuX3NjcmlwdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2NyaXB0ID0gbmFtZXNwYWNlLl9zY3JpcHRzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzY3JpcHQgPT09IG5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldEZpbGVOYW1lID0gZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG5hbWVzcGFjZS5fcGF0aCAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWUgKz0gbmFtZXNwYWNlLl9wYXRoO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFmaWxlTmFtZS5lbmRzV2l0aChcIi9cIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSArPSBcIi9cIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmaWxlTmFtZSArPSBuYW1lO1xyXG4gICAgICAgICAgICBpZiAoIWZpbGVOYW1lLmVuZHNXaXRoKFwiLmpzXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlTmFtZSArPSBcIi5qc1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZpbGVOYW1lID0gZmlsZU5hbWUucmVwbGFjZUFsbChcIi8vXCIsIFwiL1wiKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbGVOYW1lO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRTY3JpcHRSZWZlcmVuY2UgPSBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lLCBwcm9taXNlKSB7XHJcbiAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IHNlbGYuZ2V0RmlsZU5hbWUobmFtZXNwYWNlLCBuYW1lKTtcclxuICAgICAgICAgICAgdmFyIGZpbGUgPSBCaWZyb3N0LmlvLmZpbGVGYWN0b3J5LmNyZWF0ZSgpLmNyZWF0ZShmaWxlTmFtZSwgQmlmcm9zdC5pby5maWxlVHlwZS5qYXZhU2NyaXB0KTtcclxuXHJcbiAgICAgICAgICAgIEJpZnJvc3QuaW8uZmlsZU1hbmFnZXIuY3JlYXRlKCkubG9hZChbZmlsZV0pLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAodHlwZXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzeXN0ZW0gPSB0eXBlc1swXTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmRvZXNOYW1lc3BhY2VIYXZlKG5hbWVzcGFjZSwgbmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzeXN0ZW0gPSBuYW1lc3BhY2VbbmFtZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChzeXN0ZW0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5jYW5SZXNvbHZlID0gZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudCA9IG5hbWVzcGFjZTtcclxuICAgICAgICAgICAgd2hpbGUgKGN1cnJlbnQgIT0gbnVsbCAmJiBjdXJyZW50ICE9PSB3aW5kb3cpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmRvZXNOYW1lc3BhY2VIYXZlKGN1cnJlbnQsIG5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5kb2VzTmFtZXNwYWNlSGF2ZVNjcmlwdFJlZmVyZW5jZShjdXJyZW50LCBuYW1lKSApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50ID09PSBjdXJyZW50LnBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXNvbHZlID0gZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudCA9IG5hbWVzcGFjZTtcclxuICAgICAgICAgICAgd2hpbGUgKGN1cnJlbnQgIT0gbnVsbCAmJiBjdXJyZW50ICE9PSB3aW5kb3cpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmRvZXNOYW1lc3BhY2VIYXZlKGN1cnJlbnQsIG5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRbbmFtZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5kb2VzTmFtZXNwYWNlSGF2ZVNjcmlwdFJlZmVyZW5jZShjdXJyZW50LCBuYW1lKSApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2FkU2NyaXB0UmVmZXJlbmNlKGN1cnJlbnQsIG5hbWUsIHByb21pc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnQgPT09IGN1cnJlbnQucGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnQ7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIGRlcGVuZGVuY3lSZXNvbHZlcjogKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmdW5jdGlvbiByZXNvbHZlSW1wbGVtZW50YXRpb24obmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciByZXNvbHZlcnMgPSBCaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlcnMuZ2V0QWxsKCk7XHJcbiAgICAgICAgICAgIHZhciByZXNvbHZlZFN5c3RlbSA9IG51bGw7XHJcbiAgICAgICAgICAgIHJlc29sdmVycy5mb3JFYWNoKGZ1bmN0aW9uIChyZXNvbHZlcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc29sdmVkU3lzdGVtICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FuUmVzb2x2ZSA9IHJlc29sdmVyLmNhblJlc29sdmUobmFtZXNwYWNlLCBuYW1lKTtcclxuICAgICAgICAgICAgICAgIGlmIChjYW5SZXNvbHZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZWRTeXN0ZW0gPSByZXNvbHZlci5yZXNvbHZlKG5hbWVzcGFjZSwgbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlZFN5c3RlbTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGlzVHlwZShzeXN0ZW0pIHtcclxuICAgICAgICAgICAgaWYgKHN5c3RlbSAhPSBudWxsICYmXHJcbiAgICAgICAgICAgICAgICBzeXN0ZW0uX3N1cGVyICE9PSBudWxsKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzeXN0ZW0uX3N1cGVyICE9PSBcInVuZGVmaW5lZFwiICYmXHJcbiAgICAgICAgICAgICAgICAgICAgc3lzdGVtLl9zdXBlciA9PT0gQmlmcm9zdC5UeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlzVHlwZShzeXN0ZW0uX3N1cGVyKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVTeXN0ZW1JbnN0YW5jZShzeXN0ZW0pIHtcclxuICAgICAgICAgICAgaWYgKGlzVHlwZShzeXN0ZW0pKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3lzdGVtLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzeXN0ZW07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBiZWdpbkhhbmRsZVN5c3RlbUluc3RhbmNlKHN5c3RlbSkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc3lzdGVtICE9IG51bGwgJiZcclxuICAgICAgICAgICAgICAgIHN5c3RlbS5fc3VwZXIgIT09IG51bGwgJiZcclxuICAgICAgICAgICAgICAgIHR5cGVvZiBzeXN0ZW0uX3N1cGVyICE9PSBcInVuZGVmaW5lZFwiICYmXHJcbiAgICAgICAgICAgICAgICBzeXN0ZW0uX3N1cGVyID09PSBCaWZyb3N0LlR5cGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBzeXN0ZW0uYmVnaW5DcmVhdGUoKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHJlc3VsdCwgbmV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKHN5c3RlbSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZ2V0RGVwZW5kZW5jaWVzRm9yOiBmdW5jdGlvbiAoZnVuYykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlcGVuZGVuY2llcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtZXRlcnMgPSBCaWZyb3N0LmZ1bmN0aW9uUGFyc2VyLnBhcnNlKGZ1bmMpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJhbWV0ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVwZW5kZW5jaWVzLnB1c2gocGFyYW1ldGVyc1tpXS5uYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBkZXBlbmRlbmNpZXM7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBjYW5SZXNvbHZlOiBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBMb29wIHRocm91Z2ggcmVzb2x2ZXJzIGFuZCBjaGVjayBpZiBhbnlvbmUgY2FuIHJlc29sdmUgaXQsIGlmIHNvIHJldHVybiB0cnVlIC0gaWYgbm90IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzb2x2ZXJzID0gQmlmcm9zdC5kZXBlbmRlbmN5UmVzb2x2ZXJzLmdldEFsbCgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNhblJlc29sdmUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlcnMuZm9yRWFjaChmdW5jdGlvbiAocmVzb2x2ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FuUmVzb2x2ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYW5SZXNvbHZlID0gcmVzb2x2ZXIuY2FuUmVzb2x2ZShuYW1lc3BhY2UsIG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhblJlc29sdmU7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICByZXNvbHZlOiBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzb2x2ZWRTeXN0ZW0gPSByZXNvbHZlSW1wbGVtZW50YXRpb24obmFtZXNwYWNlLCBuYW1lKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzb2x2ZWRTeXN0ZW0gPT09IFwidW5kZWZpbmVkXCIgfHwgcmVzb2x2ZWRTeXN0ZW0gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVuYWJsZSB0byByZXNvbHZlICdcIiArIG5hbWUgKyBcIicgaW4gJ1wiICsgbmFtZXNwYWNlICsgXCInXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LlVucmVzb2x2ZWREZXBlbmRlbmNpZXMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzb2x2ZWRTeXN0ZW0gaW5zdGFuY2VvZiBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCInXCIgKyBuYW1lICsgXCInIHdhcyByZXNvbHZlZCBhcyBhbiBhc3luY2hyb25vdXMgZGVwZW5kZW5jeSwgY29uc2lkZXIgdXNpbmcgYmVnaW5DcmVhdGUoKSBvciBtYWtlIHRoZSBkZXBlbmRlbmN5IGF2YWlsYWJsZSBwcmlvciB0byBjYWxsaW5nIGNyZWF0ZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC5Bc3luY2hyb25vdXNEZXBlbmRlbmNpZXNEZXRlY3RlZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBoYW5kbGVTeXN0ZW1JbnN0YW5jZShyZXNvbHZlZFN5c3RlbSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBiZWdpblJlc29sdmU6IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgIEJpZnJvc3QuY29uZmlndXJlLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzb2x2ZWRTeXN0ZW0gPSByZXNvbHZlSW1wbGVtZW50YXRpb24obmFtZXNwYWNlLCBuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlc29sdmVkU3lzdGVtID09PSBcInVuZGVmaW5lZFwiIHx8IHJlc29sdmVkU3lzdGVtID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5hYmxlIHRvIHJlc29sdmUgJ1wiICsgbmFtZSArIFwiJyBpbiAnXCIgKyBuYW1lc3BhY2UgKyBcIidcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2UuZmFpbChuZXcgQmlmcm9zdC5VbnJlc29sdmVkRGVwZW5kZW5jaWVzKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc29sdmVkU3lzdGVtIGluc3RhbmNlb2YgQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlZFN5c3RlbS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHN5c3RlbSwgaW5uZXJQcm9taXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWdpbkhhbmRsZVN5c3RlbUluc3RhbmNlKHN5c3RlbSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jb250aW51ZVdpdGgoZnVuY3Rpb24gKGFjdHVhbFN5c3RlbSwgbmV4dCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChoYW5kbGVTeXN0ZW1JbnN0YW5jZShhY3R1YWxTeXN0ZW0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLm9uRmFpbChmdW5jdGlvbiAoZSkgeyBwcm9taXNlLmZhaWwoZSk7IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChoYW5kbGVTeXN0ZW1JbnN0YW5jZShyZXNvbHZlZFN5c3RlbSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pKClcclxufSk7XHJcbkJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIudHlwZXMuZGVwZW5kZW5jeVJlc29sdmVyID0gQmlmcm9zdC5kZXBlbmRlbmN5UmVzb2x2ZXI7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIGRlcGVuZGVuY3lSZXNvbHZlcnM6IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZ2V0QWxsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzb2x2ZXJzID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBCaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyKCksXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IEJpZnJvc3QuRGVmYXVsdERlcGVuZGVuY3lSZXNvbHZlcigpLFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBCaWZyb3N0Lktub3duQXJ0aWZhY3RUeXBlc0RlcGVuZGVuY3lSZXNvbHZlcigpLFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBCaWZyb3N0Lktub3duQXJ0aWZhY3RJbnN0YW5jZXNEZXBlbmRlbmN5UmVzb2x2ZXIoKSxcclxuXHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gdGhpcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5pbmRleE9mKFwiX1wiKSAhPT0gMCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgdGhpc1twcm9wZXJ0eV0gIT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlcnMucHVzaCh0aGlzW3Byb3BlcnR5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVycztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KSgpXHJcbn0pOyIsIkJpZnJvc3QuZGVwZW5kZW5jeVJlc29sdmVycy5ET01Sb290RGVwZW5kZW5jeVJlc29sdmVyID0ge1xyXG4gICAgY2FuUmVzb2x2ZTogZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgIHJldHVybiBuYW1lID09PSBcIkRPTVJvb3RcIjtcclxuICAgIH0sXHJcblxyXG4gICAgcmVzb2x2ZTogZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5ib2R5ICE9IG51bGwgJiYgdHlwZW9mIGRvY3VtZW50LmJvZHkgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmJvZHk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgQmlmcm9zdC5kZXBlbmRlbmN5UmVzb2x2ZXJzLkRPTVJvb3REZXBlbmRlbmN5UmVzb2x2ZXIucHJvbWlzZXMucHVzaChwcm9taXNlKTtcclxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH1cclxufTtcclxuXHJcbkJpZnJvc3QuZGVwZW5kZW5jeVJlc29sdmVycy5ET01Sb290RGVwZW5kZW5jeVJlc29sdmVyLnByb21pc2VzID0gW107XHJcbkJpZnJvc3QuZGVwZW5kZW5jeVJlc29sdmVycy5ET01Sb290RGVwZW5kZW5jeVJlc29sdmVyLmRvY3VtZW50SXNSZWFkeSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIEJpZnJvc3QuZGVwZW5kZW5jeVJlc29sdmVycy5ET01Sb290RGVwZW5kZW5jeVJlc29sdmVyLnByb21pc2VzLmZvckVhY2goZnVuY3Rpb24gKHByb21pc2UpIHtcclxuICAgICAgICBwcm9taXNlLnNpZ25hbChkb2N1bWVudC5ib2R5KTtcclxuICAgIH0pO1xyXG59OyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiKTtcclxuXHJcbkJpZnJvc3QuRGVmaW5pdGlvbk11c3RCZUZ1bmN0aW9uID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcclxuICAgIHRoaXMucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xyXG4gICAgdGhpcy5uYW1lID0gXCJEZWZpbml0aW9uTXVzdEJlRnVuY3Rpb25cIjtcclxuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2UgfHwgXCJEZWZpbml0aW9uIG11c3QgYmUgZnVuY3Rpb25cIjtcclxufTtcclxuXHJcbkJpZnJvc3QuTWlzc2luZ05hbWUgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xyXG4gICAgdGhpcy5wcm90b3R5cGUgPSBFcnJvci5wcm90b3R5cGU7XHJcbiAgICB0aGlzLm5hbWUgPSBcIk1pc3NpbmdOYW1lXCI7XHJcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlIHx8IFwiTWlzc2luZyBuYW1lXCI7XHJcbn07XHJcblxyXG5CaWZyb3N0LkV4Y2VwdGlvbiA9IChmdW5jdGlvbihnbG9iYWwsIHVuZGVmaW5lZCkge1xyXG4gICAgZnVuY3Rpb24gdGhyb3dJZk5hbWVNaXNzaW5nKG5hbWUpIHtcclxuICAgICAgICBpZiAoIW5hbWUgfHwgdHlwZW9mIG5hbWUgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QuTWlzc2luZ05hbWUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGhyb3dJZkRlZmluaXRpb25Ob3RBRnVuY3Rpb24oZGVmaW5pdGlvbikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgZGVmaW5pdGlvbiAhPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LkRlZmluaXRpb25NdXN0QmVGdW5jdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRFeGNlcHRpb25OYW1lKG5hbWUpIHtcclxuICAgICAgICB2YXIgbGFzdERvdCA9IG5hbWUubGFzdEluZGV4T2YoXCIuXCIpO1xyXG4gICAgICAgIGlmIChsYXN0RG90ID09PSAtMSAmJiBsYXN0RG90ICE9PSBuYW1lLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5hbWUuc3Vic3RyKGxhc3REb3QrMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGVmaW5lQW5kR2V0VGFyZ2V0U2NvcGUobmFtZSkge1xyXG4gICAgICAgIHZhciBsYXN0RG90ID0gbmFtZS5sYXN0SW5kZXhPZihcIi5cIik7XHJcbiAgICAgICAgaWYoIGxhc3REb3QgPT09IC0xICkge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG5zID0gbmFtZS5zdWJzdHIoMCxsYXN0RG90KTtcclxuICAgICAgICBCaWZyb3N0Lm5hbWVzcGFjZShucyk7XHJcblxyXG4gICAgICAgIHZhciBzY29wZSA9IGdsb2JhbDtcclxuICAgICAgICB2YXIgcGFydHMgPSBucy5zcGxpdCgnLicpO1xyXG4gICAgICAgIHBhcnRzLmZvckVhY2goZnVuY3Rpb24ocGFydCkge1xyXG4gICAgICAgICAgICBzY29wZSA9IHNjb3BlW3BhcnRdO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gc2NvcGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBkZWZpbmU6IGZ1bmN0aW9uKG5hbWUsIGRlZmF1bHRNZXNzYWdlLCBkZWZpbml0aW9uKSB7XHJcbiAgICAgICAgICAgIHRocm93SWZOYW1lTWlzc2luZyhuYW1lKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzY29wZSA9IGRlZmluZUFuZEdldFRhcmdldFNjb3BlKG5hbWUpO1xyXG4gICAgICAgICAgICB2YXIgZXhjZXB0aW9uTmFtZSA9IGdldEV4Y2VwdGlvbk5hbWUobmFtZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZXhjZXB0aW9uID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmFtZSA9IGV4Y2VwdGlvbk5hbWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlIHx8IGRlZmF1bHRNZXNzYWdlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBleGNlcHRpb24ucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xyXG5cclxuICAgICAgICAgICAgaWYoIGRlZmluaXRpb24gJiYgdHlwZW9mIGRlZmluaXRpb24gIT09IFwidW5kZWZpbmVkXCIgKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvd0lmRGVmaW5pdGlvbk5vdEFGdW5jdGlvbihkZWZpbml0aW9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkZWZpbml0aW9uLnByb3RvdHlwZSA9IEVycm9yLnByb3RvdHlwZTtcclxuICAgICAgICAgICAgICAgIGV4Y2VwdGlvbi5wcm90b3R5cGUgPSBuZXcgZGVmaW5pdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzY29wZVtleGNlcHRpb25OYW1lXSA9IGV4Y2VwdGlvbjtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59KSh3aW5kb3cpOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiKTtcclxuQmlmcm9zdC5FeGNlcHRpb24uZGVmaW5lKFwiQmlmcm9zdC5Mb2NhdGlvbk5vdFNwZWNpZmllZFwiLFwiTG9jYXRpb24gd2FzIG5vdCBzcGVjaWZpZWRcIik7XHJcbkJpZnJvc3QuRXhjZXB0aW9uLmRlZmluZShcIkJpZnJvc3QuSW52YWxpZFVyaUZvcm1hdFwiLCBcIlVyaSBmb3JtYXQgc3BlY2lmaWVkIGlzIG5vdCB2YWxpZFwiKTtcclxuQmlmcm9zdC5FeGNlcHRpb24uZGVmaW5lKFwiQmlmcm9zdC5PYmplY3RMaXRlcmFsTm90QWxsb3dlZFwiLCBcIk9iamVjdCBsaXRlcmFsIGlzIG5vdCBhbGxvd2VkXCIpO1xyXG5CaWZyb3N0LkV4Y2VwdGlvbi5kZWZpbmUoXCJCaWZyb3N0Lk1pc3NpbmdUeXBlRGVmaW5pdGlvblwiLCBcIlR5cGUgZGVmaW5pdGlvbiB3YXMgbm90IHNwZWNpZmllZFwiKTtcclxuQmlmcm9zdC5FeGNlcHRpb24uZGVmaW5lKFwiQmlmcm9zdC5Bc3luY2hyb25vdXNEZXBlbmRlbmNpZXNEZXRlY3RlZFwiLCBcIllvdSBzaG91bGQgY29uc2lkZXIgdXNpbmcgVHlwZS5iZWdpbkNyZWF0ZSgpIG9yIGRlcGVuZGVuY3lSZXNvbHZlci5iZWdpblJlc29sdmUoKSBmb3Igc3lzdGVtcyB0aGF0IGhhcyBhc3luY2hyb25vdXMgZGVwZW5kZW5jaWVzXCIpO1xyXG5CaWZyb3N0LkV4Y2VwdGlvbi5kZWZpbmUoXCJCaWZyb3N0LlVucmVzb2x2ZWREZXBlbmRlbmNpZXNcIiwgXCJTb21lIGRlcGVuZGVuY2llcyB3YXMgbm90IHBvc3NpYmxlIHRvIHJlc29sdmVcIik7IiwidmFyIEJpZnJvc3QgPSBCaWZyb3N0IHx8IHt9O1xyXG4oZnVuY3Rpb24oZ2xvYmFsLCB1bmRlZmluZWQpIHtcclxuICAgIEJpZnJvc3QuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kKGRlc3RpbmF0aW9uLCBzb3VyY2UpIHtcclxuICAgICAgICByZXR1cm4gJC5leHRlbmQoZGVzdGluYXRpb24sIHNvdXJjZSk7XHJcbiAgICB9O1xyXG59KSh3aW5kb3cpOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBmdW5jdGlvblBhcnNlcjoge1xyXG4gICAgICAgIHBhcnNlOiBmdW5jdGlvbihmdW5jKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IGZ1bmMudG9TdHJpbmcoKS5tYXRjaCgvZnVuY3Rpb25cXHcqXFxzKlxcKCguKj8pXFwpLyk7XHJcbiAgICAgICAgICAgIGlmIChtYXRjaCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uQXJndW1lbnRzID0gbWF0Y2hbMV0uc3BsaXQoL1xccyosXFxzKi8pO1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb25Bcmd1bWVudHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnRyaW0oKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGl0ZW1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgR3VpZCA6IHtcclxuICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBTNCgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoKCgxICsgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwKSB8IDApLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIChTNCgpICsgUzQoKSArIFwiLVwiICsgUzQoKSArIFwiLVwiICsgUzQoKSArIFwiLVwiICsgUzQoKSArIFwiLVwiICsgUzQoKSArIFM0KCkgKyBTNCgpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtcHR5OiBcIjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMFwiXHJcbiAgICB9XHJcbn0pO1xyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIik7XHJcbkJpZnJvc3QuaGFzaFN0cmluZyA9IChmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZGVjb2RlOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICAgICAgICBpZiAoYSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGEgPSBhLnJlcGxhY2UoXCIvP1wiLCBcIlwiKS5zcGxpdCgnJicpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGIgPSB7fTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcCA9IGFbaV0uc3BsaXQoJz0nLCAyKTtcclxuICAgICAgICAgICAgICAgIGlmIChwLmxlbmd0aCAhPT0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGRlY29kZVVSSUNvbXBvbmVudChwWzFdLnJlcGxhY2UoL1xcKy9nLCBcIiBcIikpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gXCJcIiAmJiAhaXNOYU4odmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBiW3BbMF1dID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGI7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSkoKTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIGlzQXJyYXkgOiBmdW5jdGlvbihvKSB7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcclxuICAgIH1cclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIGlzRnVuY3Rpb246IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIjtcclxuICAgIH1cclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIGlzTnVsbDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsO1xyXG4gICAgfVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgaXNOdWxsT3JVbmRlZmluZWQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiBCaWZyb3N0LmlzVW5kZWZpbmVkKHZhbHVlKSB8fCBCaWZyb3N0LmlzTnVsbCh2YWx1ZSk7XHJcbiAgICB9XHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBpc051bWJlcjogZnVuY3Rpb24gKG51bWJlcikge1xyXG4gICAgICAgIGlmIChCaWZyb3N0LmlzU3RyaW5nKG51bWJlcikpIHtcclxuICAgICAgICAgICAgaWYgKG51bWJlci5sZW5ndGggPiAxICYmIG51bWJlclswXSA9PT0gJzAnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChudW1iZXIpKSAmJiBpc0Zpbml0ZShudW1iZXIpO1xyXG4gICAgfVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgaXNPYmplY3Q6IGZ1bmN0aW9uIChvKSB7XHJcbiAgICAgICAgaWYgKG8gPT09IG51bGwgfHwgdHlwZW9mIG8gPT09IFwidW5kZWZpbmVkXCIgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XHJcbiAgICB9XHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBpc1N0cmluZzogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIjtcclxuICAgICAgICB9XHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBpc1R5cGU6IGZ1bmN0aW9uIChvKSB7XHJcbiAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQobykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHlwZW9mIG8uX3R5cGVJZCAhPT0gXCJ1bmRlZmluZWRcIjtcclxuICAgIH1cclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIGlzVW5kZWZpbmVkOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcInVuZGVmaW5lZFwiO1xyXG4gICAgfVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgS25vd25BcnRpZmFjdEluc3RhbmNlc0RlcGVuZGVuY3lSZXNvbHZlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgc3VwcG9ydGVkQXJ0aWZhY3RzID0ge1xyXG4gICAgICAgICAgICByZWFkTW9kZWxzOiBCaWZyb3N0LnJlYWQuUmVhZE1vZGVsT2YsXHJcbiAgICAgICAgICAgIGNvbW1hbmRzOiBCaWZyb3N0LmNvbW1hbmRzLkNvbW1hbmQsXHJcbiAgICAgICAgICAgIHF1ZXJpZXM6IEJpZnJvc3QucmVhZC5RdWVyeVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGlzTW9yZVNwZWNpZmljTmFtZXNwYWNlKGJhc2UsIGNvbXBhcmVUbykge1xyXG4gICAgICAgICAgICB2YXIgaXNEZWVwZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIG1hdGNoZXNiYXNlID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB2YXIgYmFzZVBhcnRzID0gYmFzZS5uYW1lLnNwbGl0KFwiLlwiKTtcclxuICAgICAgICAgICAgdmFyIGNvbXBhcmVUb1BhcnRzID0gY29tcGFyZVRvLm5hbWUuc3BsaXQoXCIuXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGJhc2VQYXJ0cy5sZW5ndGggPiBjb21wYXJlVG9QYXJ0cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBiYXNlUGFydHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChiYXNlUGFydHNbaV0gIT09IGNvbXBhcmVUb1BhcnRzW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jYW5SZXNvbHZlID0gZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmFtZSBpbiBzdXBwb3J0ZWRBcnRpZmFjdHM7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXNvbHZlID0gZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgdHlwZSA9IHN1cHBvcnRlZEFydGlmYWN0c1tuYW1lXTtcclxuICAgICAgICAgICAgdmFyIGV4dGVuZGVycyA9IHR5cGUuZ2V0RXh0ZW5kZXJzSW4obmFtZXNwYWNlKTtcclxuICAgICAgICAgICAgdmFyIHJlc29sdmVkVHlwZXMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIGV4dGVuZGVycy5mb3JFYWNoKGZ1bmN0aW9uIChleHRlbmRlcikge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5hbWUgPSBleHRlbmRlci5fbmFtZTtcclxuICAgICAgICAgICAgICAgIGlmIChyZXNvbHZlZFR5cGVzW25hbWVdICYmICFpc01vcmVTcGVjaWZpY05hbWVzcGFjZShyZXNvbHZlZFR5cGVzW25hbWVdLl9uYW1lc3BhY2UsIGV4dGVuZGVyLl9uYW1lc3BhY2UpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJlc29sdmVkVHlwZXNbbmFtZV0gPSBleHRlbmRlcjtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVzb2x2ZWRJbnN0YW5jZXMgPSB7fTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiByZXNvbHZlZFR5cGVzKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlZEluc3RhbmNlc1twcm9wXSA9IHJlc29sdmVkVHlwZXNbcHJvcF0uY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlZEluc3RhbmNlcztcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgS25vd25BcnRpZmFjdFR5cGVzRGVwZW5kZW5jeVJlc29sdmVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBzdXBwb3J0ZWRBcnRpZmFjdHMgPSB7XHJcbiAgICAgICAgICAgIHJlYWRNb2RlbFR5cGVzOiBCaWZyb3N0LnJlYWQuUmVhZE1vZGVsT2YsXHJcbiAgICAgICAgICAgIGNvbW1hbmRUeXBlczogQmlmcm9zdC5jb21tYW5kcy5Db21tYW5kLFxyXG4gICAgICAgICAgICBxdWVyeVR5cGVzOiBCaWZyb3N0LnJlYWQuUXVlcnlcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBpc01vcmVTcGVjaWZpY05hbWVzcGFjZShiYXNlLCBjb21wYXJlVG8pIHtcclxuICAgICAgICAgICAgdmFyIGlzRGVlcGVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBtYXRjaGVzYmFzZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdmFyIGJhc2VQYXJ0cyA9IGJhc2UubmFtZS5zcGxpdChcIi5cIik7XHJcbiAgICAgICAgICAgIHZhciBjb21wYXJlVG9QYXJ0cyA9IGNvbXBhcmVUby5uYW1lLnNwbGl0KFwiLlwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChiYXNlUGFydHMubGVuZ3RoID4gY29tcGFyZVRvUGFydHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmFzZVBhcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmFzZVBhcnRzW2ldICE9PSBjb21wYXJlVG9QYXJ0c1tpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY2FuUmVzb2x2ZSA9IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5hbWUgaW4gc3VwcG9ydGVkQXJ0aWZhY3RzO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucmVzb2x2ZSA9IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIHR5cGUgPSBzdXBwb3J0ZWRBcnRpZmFjdHNbbmFtZV07XHJcbiAgICAgICAgICAgIHZhciBleHRlbmRlcnMgPSB0eXBlLmdldEV4dGVuZGVyc0luKG5hbWVzcGFjZSk7XHJcbiAgICAgICAgICAgIHZhciByZXNvbHZlZFR5cGVzID0ge307XHJcblxyXG4gICAgICAgICAgICBleHRlbmRlcnMuZm9yRWFjaChmdW5jdGlvbiAoZXh0ZW5kZXIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gZXh0ZW5kZXIuX25hbWU7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzb2x2ZWRUeXBlc1tuYW1lXSAmJiAhaXNNb3JlU3BlY2lmaWNOYW1lc3BhY2UocmVzb2x2ZWRUeXBlc1tuYW1lXS5fbmFtZXNwYWNlLCBleHRlbmRlci5fbmFtZXNwYWNlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlZFR5cGVzW25hbWVdID0gZXh0ZW5kZXI7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVkVHlwZXM7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSk7IiwidmFyIEJpZnJvc3QgPSBCaWZyb3N0IHx8IHt9O1xyXG5CaWZyb3N0Lm5hbWVzcGFjZSA9IGZ1bmN0aW9uIChucywgY29udGVudCkge1xyXG5cclxuICAgIC8vIFRvZG86IHRoaXMgc2hvdWxkIG5vdCBiZSBuZWVkZWQsIGl0IGlzIGEgc3ltcHRvbSBvZiBzb21ldGhpbmcgdXNpbmcgaXQgYmVpbmcgd3JvbmchISEgU2UgaXNzdWUgIzIzMiBvbiBHaXRIdWIgKGh0dHA6Ly9naXRodWIuY29tL2RvbGl0dGxlL0JpZnJvc3QvaXNzdWVzLzIzMilcclxuICAgIG5zID0gbnMucmVwbGFjZUFsbChcIi4uXCIsIFwiLlwiKTtcclxuICAgIGlmIChucy5lbmRzV2l0aChcIi5cIikpIHtcclxuICAgICAgICBucyA9IG5zLnN1YnN0cigwLCBucy5sZW5ndGggLSAxKTtcclxuICAgIH1cclxuICAgIGlmIChucy5zdGFydHNXaXRoKFwiLlwiKSkge1xyXG4gICAgICAgIG5zID0gbnMuc3Vic3RyKDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBwYXJlbnQgPSB3aW5kb3c7XHJcbiAgICB2YXIgbmFtZSA9IFwiXCI7XHJcbiAgICB2YXIgcGFydHMgPSBucy5zcGxpdCgnLicpO1xyXG4gICAgcGFydHMuZm9yRWFjaChmdW5jdGlvbiAocGFydCkge1xyXG4gICAgICAgIGlmIChuYW1lLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbmFtZSArPSBcIi5cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbmFtZSArPSBwYXJ0O1xyXG4gICAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmVudCwgcGFydCkpIHtcclxuICAgICAgICAgICAgcGFyZW50W3BhcnRdID0ge307XHJcbiAgICAgICAgICAgIHBhcmVudFtwYXJ0XS5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgICAgICAgIHBhcmVudFtwYXJ0XS5uYW1lID0gbmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcGFyZW50ID0gcGFyZW50W3BhcnRdO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgQmlmcm9zdC5uYW1lc3BhY2UuY3VycmVudCA9IHBhcmVudDtcclxuXHJcbiAgICAgICAgdmFyIHByb3BlcnR5O1xyXG5cclxuICAgICAgICBmb3IgKHByb3BlcnR5IGluIGNvbnRlbnQpIHtcclxuICAgICAgICAgICAgcGFyZW50W3Byb3BlcnR5XSA9IGNvbnRlbnRbcHJvcGVydHldO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChwcm9wZXJ0eSBpbiBwYXJlbnQpIHtcclxuICAgICAgICAgICAgaWYgKHBhcmVudC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudFtwcm9wZXJ0eV0uX25hbWVzcGFjZSA9IHBhcmVudDtcclxuICAgICAgICAgICAgICAgIHBhcmVudFtwcm9wZXJ0eV0uX25hbWUgPSBwcm9wZXJ0eTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBCaWZyb3N0Lm5hbWVzcGFjZS5jdXJyZW50ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGFyZW50O1xyXG59OyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBuYW1lc3BhY2VNYXBwZXJzOiB7XHJcblxyXG4gICAgICAgIG1hcFBhdGhUb05hbWVzcGFjZTogZnVuY3Rpb24gKHBhdGgpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgbWFwcGVyS2V5IGluIEJpZnJvc3QubmFtZXNwYWNlTWFwcGVycykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hcHBlciA9IEJpZnJvc3QubmFtZXNwYWNlTWFwcGVyc1ttYXBwZXJLZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtYXBwZXIuaGFzTWFwcGluZ0ZvciA9PT0gXCJmdW5jdGlvblwiICYmIG1hcHBlci5oYXNNYXBwaW5nRm9yKHBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWVzcGFjZVBhdGggPSBtYXBwZXIucmVzb2x2ZShwYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmFtZXNwYWNlUGF0aDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgbmFtZXNwYWNlczogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLnN0cmlwUGF0aCA9IGZ1bmN0aW9uIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGlmIChwYXRoLnN0YXJ0c1dpdGgoXCIvXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBwYXRoID0gcGF0aC5zdWJzdHIoMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBhdGguZW5kc1dpdGgoXCIvXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBwYXRoID0gcGF0aC5zdWJzdHIoMCwgcGF0aC5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBzY3JpcHRzID0gQmlmcm9zdC5hc3NldHNNYW5hZ2VyLmdldFNjcmlwdHMoKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzY3JpcHRzID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNjcmlwdHMuZm9yRWFjaChmdW5jdGlvbiAoZnVsbFBhdGgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYXRoID0gQmlmcm9zdC5QYXRoLmdldFBhdGhXaXRob3V0RmlsZW5hbWUoZnVsbFBhdGgpO1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHNlbGYuc3RyaXBQYXRoKHBhdGgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIG1hcHBlcktleSBpbiBCaWZyb3N0Lm5hbWVzcGFjZU1hcHBlcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbWFwcGVyID0gQmlmcm9zdC5uYW1lc3BhY2VNYXBwZXJzW21hcHBlcktleV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtYXBwZXIuaGFzTWFwcGluZ0ZvciA9PT0gXCJmdW5jdGlvblwiICYmIG1hcHBlci5oYXNNYXBwaW5nRm9yKHBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuYW1lc3BhY2VQYXRoID0gbWFwcGVyLnJlc29sdmUocGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuYW1lc3BhY2UgPSBCaWZyb3N0Lm5hbWVzcGFjZShuYW1lc3BhY2VQYXRoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb290ID0gXCIvXCIgKyBwYXRoICsgXCIvXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZS5fcGF0aCA9IHJvb3Q7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG5hbWVzcGFjZS5fc2NyaXB0cyA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlLl9zY3JpcHRzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlSW5kZXggPSBmdWxsUGF0aC5sYXN0SW5kZXhPZihcIi9cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlID0gZnVsbFBhdGguc3Vic3RyKGZpbGVJbmRleCArIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXh0ZW5zaW9uSW5kZXggPSBmaWxlLmxhc3RJbmRleE9mKFwiLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN5c3RlbSA9IGZpbGUuc3Vic3RyKDAsIGV4dGVuc2lvbkluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZS5fc2NyaXB0cy5wdXNoKHN5c3RlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIFBhdGg6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKGZ1bGxQYXRoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvLyBCYXNlZCBvbiBub2RlLmpzIGltcGxlbWVudGF0aW9uIDogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy85NDUxMTAwL2ZpbGVuYW1lLWV4dGVuc2lvbi1pbi1qYXZhc2NyaXB0XHJcbiAgICAgICAgdmFyIHNwbGl0RGV2aWNlUmUgPVxyXG4gICAgICAgICAgICAvXihbYS16QS1aXTp8W1xcXFxcXC9dezJ9W15cXFxcXFwvXStbXFxcXFxcL11bXlxcXFxcXC9dKyk/KFtcXFxcXFwvXSk/KFtcXHNcXFNdKj8pJC87XHJcblxyXG4gICAgICAgIC8vIFJlZ2V4IHRvIHNwbGl0IHRoZSB0YWlsIHBhcnQgb2YgdGhlIGFib3ZlIGludG8gWyosIGRpciwgYmFzZW5hbWUsIGV4dF1cclxuICAgICAgICB2YXIgc3BsaXRUYWlsUmUgPVxyXG4gICAgICAgICAgICAvXihbXFxzXFxTXStbXFxcXFxcL10oPyEkKXxbXFxcXFxcL10pPygoPzpcXC57MSwyfSR8W1xcc1xcU10rPyk/KFxcLlteLlxcL1xcXFxdKik/KSQvO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiByZW1vdmVVbnN1cHBvcnRlZFBhcnRzKGZpbGVuYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVyeVN0cmluZ1N0YXJ0ID0gZmlsZW5hbWUuaW5kZXhPZihcIj9cIik7XHJcbiAgICAgICAgICAgIGlmIChxdWVyeVN0cmluZ1N0YXJ0ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgZmlsZW5hbWUgPSBmaWxlbmFtZS5zdWJzdHIoMCwgcXVlcnlTdHJpbmdTdGFydCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZpbGVuYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc3BsaXRQYXRoKGZpbGVuYW1lKSB7XHJcbiAgICAgICAgICAgIC8vIFNlcGFyYXRlIGRldmljZStzbGFzaCBmcm9tIHRhaWxcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHNwbGl0RGV2aWNlUmUuZXhlYyhmaWxlbmFtZSksXHJcbiAgICAgICAgICAgICAgICBkZXZpY2UgPSAocmVzdWx0WzFdIHx8ICcnKSArIChyZXN1bHRbMl0gfHwgJycpLFxyXG4gICAgICAgICAgICAgICAgdGFpbCA9IHJlc3VsdFszXSB8fCAnJztcclxuICAgICAgICAgICAgLy8gU3BsaXQgdGhlIHRhaWwgaW50byBkaXIsIGJhc2VuYW1lIGFuZCBleHRlbnNpb25cclxuICAgICAgICAgICAgdmFyIHJlc3VsdDIgPSBzcGxpdFRhaWxSZS5leGVjKHRhaWwpLFxyXG4gICAgICAgICAgICAgICAgZGlyID0gcmVzdWx0MlsxXSB8fCAnJyxcclxuICAgICAgICAgICAgICAgIGJhc2VuYW1lID0gcmVzdWx0MlsyXSB8fCAnJyxcclxuICAgICAgICAgICAgICAgIGV4dCA9IHJlc3VsdDJbM10gfHwgJyc7XHJcbiAgICAgICAgICAgIHJldHVybiBbZGV2aWNlLCBkaXIsIGJhc2VuYW1lLCBleHRdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVsbFBhdGggPSByZW1vdmVVbnN1cHBvcnRlZFBhcnRzKGZ1bGxQYXRoKTtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gc3BsaXRQYXRoKGZ1bGxQYXRoKTtcclxuICAgICAgICB0aGlzLmRldmljZSA9IHJlc3VsdFswXSB8fCBcIlwiO1xyXG4gICAgICAgIHRoaXMuZGlyZWN0b3J5ID0gcmVzdWx0WzFdIHx8IFwiXCI7XHJcbiAgICAgICAgdGhpcy5maWxlbmFtZSA9IHJlc3VsdFsyXSB8fCBcIlwiO1xyXG4gICAgICAgIHRoaXMuZXh0ZW5zaW9uID0gcmVzdWx0WzNdIHx8IFwiXCI7XHJcbiAgICAgICAgdGhpcy5maWxlbmFtZVdpdGhvdXRFeHRlbnNpb24gPSB0aGlzLmZpbGVuYW1lLnJlcGxhY2VBbGwodGhpcy5leHRlbnNpb24sIFwiXCIpO1xyXG4gICAgICAgIHRoaXMuZnVsbFBhdGggPSBmdWxsUGF0aDtcclxuXHJcbiAgICAgICAgdGhpcy5oYXNFeHRlbnNpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHNlbGYuZXh0ZW5zaW9uKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmV4dGVuc2lvbiA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5QYXRoLm1ha2VSZWxhdGl2ZSA9IGZ1bmN0aW9uIChmdWxsUGF0aCkge1xyXG4gICAgaWYgKGZ1bGxQYXRoLmluZGV4T2YoXCIvXCIpID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bGxQYXRoLnN1YnN0cigxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZnVsbFBhdGg7XHJcbn07XHJcbkJpZnJvc3QuUGF0aC5nZXRQYXRoV2l0aG91dEZpbGVuYW1lID0gZnVuY3Rpb24gKGZ1bGxQYXRoKSB7XHJcbiAgICB2YXIgbGFzdEluZGV4ID0gZnVsbFBhdGgubGFzdEluZGV4T2YoXCIvXCIpO1xyXG4gICAgcmV0dXJuIGZ1bGxQYXRoLnN1YnN0cigwLCBsYXN0SW5kZXgpO1xyXG59O1xyXG5CaWZyb3N0LlBhdGguZ2V0RmlsZW5hbWUgPSBmdW5jdGlvbiAoZnVsbFBhdGgpIHtcclxuICAgIHZhciBsYXN0SW5kZXggPSBmdWxsUGF0aC5sYXN0SW5kZXhPZihcIi9cIik7XHJcbiAgICByZXR1cm4gZnVsbFBhdGguc3Vic3RyKGxhc3RJbmRleCsxKTtcclxufTtcclxuQmlmcm9zdC5QYXRoLmdldEZpbGVuYW1lV2l0aG91dEV4dGVuc2lvbiA9IGZ1bmN0aW9uIChmdWxsUGF0aCkge1xyXG4gICAgdmFyIGZpbGVuYW1lID0gdGhpcy5nZXRGaWxlbmFtZShmdWxsUGF0aCk7XHJcbiAgICB2YXIgbGFzdEluZGV4ID0gZmlsZW5hbWUubGFzdEluZGV4T2YoXCIuXCIpO1xyXG4gICAgcmV0dXJuIGZpbGVuYW1lLnN1YnN0cigwLGxhc3RJbmRleCk7XHJcbn07XHJcbkJpZnJvc3QuUGF0aC5oYXNFeHRlbnNpb24gPSBmdW5jdGlvbiAocGF0aCkge1xyXG4gICAgaWYgKHBhdGguaW5kZXhPZihcIj9cIikgPiAwKSB7XHJcbiAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDAsIHBhdGguaW5kZXhPZihcIj9cIikpO1xyXG4gICAgfVxyXG4gICAgdmFyIGxhc3RJbmRleCA9IHBhdGgubGFzdEluZGV4T2YoXCIuXCIpO1xyXG4gICAgcmV0dXJuIGxhc3RJbmRleCA+IDA7XHJcbn07XHJcbkJpZnJvc3QuUGF0aC5jaGFuZ2VFeHRlbnNpb24gPSBmdW5jdGlvbiAoZnVsbFBhdGgsIG5ld0V4dGVuc2lvbikge1xyXG4gICAgdmFyIHBhdGggPSBCaWZyb3N0LlBhdGguY3JlYXRlKHsgZnVsbFBhdGg6IGZ1bGxQYXRoIH0pO1xyXG4gICAgdmFyIG5ld1BhdGggPSBwYXRoLmRpcmVjdG9yeSArIHBhdGguZmlsZW5hbWVXaXRob3V0RXh0ZW5zaW9uICsgXCIuXCIgKyBuZXdFeHRlbnNpb247XHJcbiAgICByZXR1cm4gbmV3UGF0aDtcclxufTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIHNlcnZlcjogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSBcIlwiO1xyXG5cclxuICAgICAgICB0aGlzLmRlZmF1bHRQYXJhbWV0ZXJzID0ge307XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGRlc2VyaWFsaXplKGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNBcnJheShkYXRhKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1zID0gW107XHJcbiAgICAgICAgICAgICAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKGRlc2VyaWFsaXplKGl0ZW0pKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1zO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzQXJyYXkoZGF0YVtwcm9wZXJ0eV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbcHJvcGVydHldID0gZGVzZXJpYWxpemUoZGF0YVtwcm9wZXJ0eV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGRhdGFbcHJvcGVydHldO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdW1iZXIodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhW3Byb3BlcnR5XSA9IHBhcnNlRmxvYXQodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtwcm9wZXJ0eV0gPSBkYXRhW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5wb3N0ID0gZnVuY3Rpb24gKHVybCwgcGFyYW1ldGVycykge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuVXJpLmlzQWJzb2x1dGUodXJsKSkge1xyXG4gICAgICAgICAgICAgICAgdXJsID0gc2VsZi50YXJnZXQgKyB1cmw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBhY3R1YWxQYXJhbWV0ZXJzID0ge307XHJcbiAgICAgICAgICAgIEJpZnJvc3QuZXh0ZW5kKGFjdHVhbFBhcmFtZXRlcnMsIHNlbGYuZGVmYXVsdFBhcmFtZXRlcnMpO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcGFyYW1ldGVycykge1xyXG4gICAgICAgICAgICAgICAgYWN0dWFsUGFyYW1ldGVyc1twcm9wZXJ0eV0gPSBKU09OLnN0cmluZ2lmeShwYXJhbWV0ZXJzW3Byb3BlcnR5XSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGFjdHVhbFBhcmFtZXRlcnMpLFxyXG4gICAgICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyxcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSAkLnBhcnNlSlNPTihyZXN1bHQucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICBkZXNlcmlhbGl6ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UuZmFpbChqcVhIUik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXQgPSBmdW5jdGlvbiAodXJsLCBwYXJhbWV0ZXJzKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5VcmkuaXNBYnNvbHV0ZSh1cmwpKSB7XHJcbiAgICAgICAgICAgICAgICB1cmwgPSBzZWxmLnRhcmdldCArIHVybDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGFjdHVhbFBhcmFtZXRlcnMgPSB7fTtcclxuICAgICAgICAgICAgQmlmcm9zdC5leHRlbmQoYWN0dWFsUGFyYW1ldGVycywgc2VsZi5kZWZhdWx0UGFyYW1ldGVycyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc09iamVjdChwYXJhbWV0ZXJzKSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcGFyYW1ldGVyTmFtZSBpbiBwYXJhbWV0ZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNBcnJheShwYXJhbWV0ZXJzW3BhcmFtZXRlck5hbWVdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3R1YWxQYXJhbWV0ZXJzW3BhcmFtZXRlck5hbWVdID0gSlNPTi5zdHJpbmdpZnkocGFyYW1ldGVyc1twYXJhbWV0ZXJOYW1lXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0dWFsUGFyYW1ldGVyc1twYXJhbWV0ZXJOYW1lXSA9IHBhcmFtZXRlcnNbcGFyYW1ldGVyTmFtZV07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGFjdHVhbFBhcmFtZXRlcnMsXHJcbiAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxyXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uIChyZXN1bHQsIHRleHRTdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9ICQucGFyc2VKU09OKHJlc3VsdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc2VyaWFsaXplKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5mYWlsKGpxWEhSKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIudHlwZXMuc2VydmVyID0gQmlmcm9zdC5zZXJ2ZXI7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIFNpbmdsZXRvbjogZnVuY3Rpb24gKHR5cGVEZWZpbml0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIEJpZnJvc3QuVHlwZS5leHRlbmQodHlwZURlZmluaXRpb24pLnNjb3BlVG8od2luZG93KTtcclxuICAgIH1cclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIFN0cmluZ01hcHBlcjogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoc3RyaW5nTWFwcGluZ0ZhY3RvcnkpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuc3RyaW5nTWFwcGluZ0ZhY3RvcnkgPSBzdHJpbmdNYXBwaW5nRmFjdG9yeTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXBwaW5ncyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLnJldmVyc2VNYXBwaW5ncyA9IFtdO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBoYXNNYXBwaW5nRm9yKG1hcHBpbmdzLCBpbnB1dCkge1xyXG4gICAgICAgICAgICB2YXIgZm91bmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgbWFwcGluZ3Muc29tZShmdW5jdGlvbiAobSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG0ubWF0Y2hlcyhpbnB1dCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZm91bmQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZm91bmQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRNYXBwaW5nRm9yKG1hcHBpbmdzLCBpbnB1dCkge1xyXG4gICAgICAgICAgICB2YXIgZm91bmQ7XHJcbiAgICAgICAgICAgIG1hcHBpbmdzLnNvbWUoZnVuY3Rpb24gKG0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChtLm1hdGNoZXMoaW5wdXQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBtO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZm91bmQgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmb3VuZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhyb3cge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJBcmd1bWVudEVycm9yXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlN0cmluZyBtYXBwaW5nIGZvciAoXCIgKyBpbnB1dCArIFwiKSBjb3VsZCBub3QgYmUgZm91bmRcIlxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcmVzb2x2ZShtYXBwaW5ncywgaW5wdXQpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGlmIChpbnB1dCA9PT0gbnVsbCB8fCB0eXBlb2YgaW5wdXQgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbWFwcGluZyA9IHNlbGYuZ2V0TWFwcGluZ0ZvcihpbnB1dCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChtYXBwaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBtYXBwaW5nLnJlc29sdmUoaW5wdXQpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5oYXNNYXBwaW5nRm9yID0gZnVuY3Rpb24gKGlucHV0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBoYXNNYXBwaW5nRm9yKHNlbGYubWFwcGluZ3MsIGlucHV0KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ2V0TWFwcGluZ0ZvciA9IGZ1bmN0aW9uIChpbnB1dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2V0TWFwcGluZ0ZvcihzZWxmLm1hcHBpbmdzLCBpbnB1dCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnJlc29sdmUgPSBmdW5jdGlvbiAoaW5wdXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoc2VsZi5tYXBwaW5ncywgaW5wdXQpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucmV2ZXJzZSA9IHtcclxuICAgICAgICAgICAgaGFzTWFwcGluZ0ZvcjogZnVuY3Rpb24gKGlucHV0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5oYXNNYXBwaW5nRm9yKHNlbGYucmV2ZXJzZU1hcHBpbmdzLCBpbnB1dCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRNYXBwaW5nRm9yOiBmdW5jdGlvbiAoaW5wdXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmdldE1hcHBpbmdGb3Ioc2VsZi5yZXZlcnNlTWFwcGluZ3MsIGlucHV0KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHJlc29sdmU6IGZ1bmN0aW9uIChpbnB1dCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYucmVzb2x2ZShzZWxmLnJldmVyc2VNYXBwaW5ncywgaW5wdXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRNYXBwaW5nID0gZnVuY3Rpb24gKGZvcm1hdCwgbWFwcGVkRm9ybWF0KSB7XHJcbiAgICAgICAgICAgIHZhciBtYXBwaW5nID0gc2VsZi5zdHJpbmdNYXBwaW5nRmFjdG9yeS5jcmVhdGUoZm9ybWF0LCBtYXBwZWRGb3JtYXQpO1xyXG4gICAgICAgICAgICBzZWxmLm1hcHBpbmdzLnB1c2gobWFwcGluZyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmV2ZXJzZU1hcHBpbmcgPSBzZWxmLnN0cmluZ01hcHBpbmdGYWN0b3J5LmNyZWF0ZShtYXBwZWRGb3JtYXQsIGZvcm1hdCk7XHJcbiAgICAgICAgICAgIHNlbGYucmV2ZXJzZU1hcHBpbmdzLnB1c2gocmV2ZXJzZU1hcHBpbmcpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3RcIiwge1xyXG4gICAgU3RyaW5nTWFwcGluZzogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoZm9ybWF0LCBtYXBwZWRGb3JtYXQpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuZm9ybWF0ID0gZm9ybWF0O1xyXG4gICAgICAgIHRoaXMubWFwcGVkRm9ybWF0ID0gbWFwcGVkRm9ybWF0O1xyXG5cclxuICAgICAgICB2YXIgcGxhY2Vob2xkZXJFeHByZXNzaW9uID0gXCJ7W2EtekEtWl0rfVwiO1xyXG4gICAgICAgIHZhciBwbGFjZWhvbGRlclJlZ2V4ID0gbmV3IFJlZ0V4cChwbGFjZWhvbGRlckV4cHJlc3Npb24sIFwiZ1wiKTtcclxuXHJcbiAgICAgICAgdmFyIHdpbGRjYXJkRXhwcmVzc2lvbiA9IFwiXFxcXCp7Mn1bLy98fC5dXCI7XHJcbiAgICAgICAgdmFyIHdpbGRjYXJkUmVnZXggPSBuZXcgUmVnRXhwKHdpbGRjYXJkRXhwcmVzc2lvbiwgXCJnXCIpO1xyXG5cclxuICAgICAgICB2YXIgY29tYmluZWRFeHByZXNzaW9uID0gXCIoXCIgKyBwbGFjZWhvbGRlckV4cHJlc3Npb24gKyBcIikqKFwiICsgd2lsZGNhcmRFeHByZXNzaW9uICsgXCIpKlwiO1xyXG4gICAgICAgIHZhciBjb21iaW5lZFJlZ2V4ID0gbmV3IFJlZ0V4cChjb21iaW5lZEV4cHJlc3Npb24sIFwiZ1wiKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbXBvbmVudHMgPSBbXTtcclxuXHJcbiAgICAgICAgdmFyIHJlc29sdmVFeHByZXNzaW9uID0gZm9ybWF0LnJlcGxhY2UoY29tYmluZWRSZWdleCwgZnVuY3Rpb24obWF0Y2gpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBtYXRjaCA9PT0gXCJ1bmRlZmluZWRcIiB8fCBtYXRjaCA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29tcG9uZW50cy5wdXNoKG1hdGNoKTtcclxuICAgICAgICAgICAgaWYgKG1hdGNoLmluZGV4T2YoXCIqKlwiKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiKFtcXFxcdy4vL10qKVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBcIihbXFxcXHcuXSopXCI7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBtYXBwZWRGb3JtYXRXaWxkY2FyZE1hdGNoID0gbWFwcGVkRm9ybWF0Lm1hdGNoKHdpbGRjYXJkUmVnZXgpO1xyXG4gICAgICAgIHZhciBmb3JtYXRSZWdleCA9IG5ldyBSZWdFeHAocmVzb2x2ZUV4cHJlc3Npb24pO1xyXG5cclxuICAgICAgICB0aGlzLm1hdGNoZXMgPSBmdW5jdGlvbiAoaW5wdXQpIHtcclxuICAgICAgICAgICAgdmFyIG1hdGNoID0gaW5wdXQubWF0Y2goZm9ybWF0UmVnZXgpO1xyXG4gICAgICAgICAgICBpZiAobWF0Y2gpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldFZhbHVlcyA9IGZ1bmN0aW9uIChpbnB1dCkge1xyXG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0ge307XHJcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IGlucHV0Lm1hdGNoKGZvcm1hdFJlZ2V4KTtcclxuICAgICAgICAgICAgY29tcG9uZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjLCBpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29tcG9uZW50ID0gYy5zdWJzdHIoMSwgYy5sZW5ndGggLSAyKTtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IG1hdGNoW2kgKyAyXTtcclxuICAgICAgICAgICAgICAgIGlmIChjLmluZGV4T2YoXCIqKlwiKSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dFtjb21wb25lbnRdID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnJlc29sdmUgPSBmdW5jdGlvbiAoaW5wdXQpIHtcclxuICAgICAgICAgICAgdmFyIG1hdGNoID0gaW5wdXQubWF0Y2goZm9ybWF0UmVnZXgpO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbWFwcGVkRm9ybWF0O1xyXG4gICAgICAgICAgICB2YXIgd2lsZGNhcmRPZmZzZXQgPSAwO1xyXG5cclxuICAgICAgICAgICAgY29tcG9uZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjLCBpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBtYXRjaFtpICsgMV07XHJcbiAgICAgICAgICAgICAgICBpZiAoYy5pbmRleE9mKFwiKipcIikgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgd2lsZGNhcmQgPSBtYXBwZWRGb3JtYXRXaWxkY2FyZE1hdGNoW3dpbGRjYXJkT2Zmc2V0XTtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2VBbGwoY1syXSwgd2lsZGNhcmRbMl0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKHdpbGRjYXJkLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgd2lsZGNhcmRPZmZzZXQrKztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoYywgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBzdHJpbmdNYXBwaW5nRmFjdG9yeTogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uIChmb3JtYXQsIG1hcHBlZEZvcm1hdCkge1xyXG4gICAgICAgICAgICB2YXIgbWFwcGluZyA9IEJpZnJvc3QuU3RyaW5nTWFwcGluZy5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgZm9ybWF0OiBmb3JtYXQsXHJcbiAgICAgICAgICAgICAgICBtYXBwZWRGb3JtYXQ6IG1hcHBlZEZvcm1hdFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIG1hcHBpbmc7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBzeXN0ZW1DbG9jazogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMubm93SW5NaWxsaXNlY29uZHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdFwiLCB7XHJcbiAgICBUeXBlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIHRocm93SWZNaXNzaW5nVHlwZURlZmluaXRpb24odHlwZURlZmluaXRpb24pIHtcclxuICAgICAgICBpZiAodHlwZURlZmluaXRpb24gPT0gbnVsbCB8fCB0eXBlb2YgdHlwZURlZmluaXRpb24gPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QuTWlzc2luZ1R5cGVEZWZpbml0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRocm93SWZUeXBlRGVmaW5pdGlvbklzT2JqZWN0TGl0ZXJhbCh0eXBlRGVmaW5pdGlvbikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdHlwZURlZmluaXRpb24gPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QuT2JqZWN0TGl0ZXJhbE5vdEFsbG93ZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYWRkU3RhdGljUHJvcGVydGllcyh0eXBlRGVmaW5pdGlvbikge1xyXG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIEJpZnJvc3QuVHlwZSkge1xyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5UeXBlLmhhc093blByb3BlcnR5KHByb3BlcnR5KSAmJiBwcm9wZXJ0eSAhPT0gXCJfZXh0ZW5kZXJzXCIpIHtcclxuICAgICAgICAgICAgICAgIHR5cGVEZWZpbml0aW9uW3Byb3BlcnR5XSA9IEJpZnJvc3QuVHlwZVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0dXBEZXBlbmRlbmNpZXModHlwZURlZmluaXRpb24pIHtcclxuICAgICAgICB0eXBlRGVmaW5pdGlvbi5fZGVwZW5kZW5jaWVzID0gQmlmcm9zdC5kZXBlbmRlbmN5UmVzb2x2ZXIuZ2V0RGVwZW5kZW5jaWVzRm9yKHR5cGVEZWZpbml0aW9uKTtcclxuXHJcbiAgICAgICAgdmFyIGZpcnN0UGFyYW1ldGVyID0gdHJ1ZTtcclxuICAgICAgICB2YXIgY3JlYXRlRnVuY3Rpb25TdHJpbmcgPSBcIkZ1bmN0aW9uKCdkZWZpbml0aW9uJywgJ2RlcGVuZGVuY2llcycsJ3JldHVybiBuZXcgZGVmaW5pdGlvbihcIjtcclxuXHJcbiAgICAgICAgaWYoIHR5cGVvZiB0eXBlRGVmaW5pdGlvbi5fZGVwZW5kZW5jaWVzICE9PSBcInVuZGVmaW5lZFwiICkge1xyXG4gICAgICAgICAgICB0eXBlRGVmaW5pdGlvbi5fZGVwZW5kZW5jaWVzLmZvckVhY2goZnVuY3Rpb24oZGVwZW5kZW5jeSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGlmICghZmlyc3RQYXJhbWV0ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVGdW5jdGlvblN0cmluZyArPSBcIixcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZpcnN0UGFyYW1ldGVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVGdW5jdGlvblN0cmluZyArPSBcImRlcGVuZGVuY2llc1tcIiArIGluZGV4ICsgXCJdXCI7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjcmVhdGVGdW5jdGlvblN0cmluZyArPSBcIik7JylcIjtcclxuXHJcbiAgICAgICAgdHlwZURlZmluaXRpb24uY3JlYXRlRnVuY3Rpb24gPSBldmFsKGNyZWF0ZUZ1bmN0aW9uU3RyaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXREZXBlbmRlbmN5SW5zdGFuY2VzKG5hbWVzcGFjZSwgdHlwZURlZmluaXRpb24pIHtcclxuICAgICAgICB2YXIgZGVwZW5kZW5jeUluc3RhbmNlcyA9IFtdO1xyXG4gICAgICAgIGlmKCB0eXBlb2YgdHlwZURlZmluaXRpb24uX2RlcGVuZGVuY2llcyAhPT0gXCJ1bmRlZmluZWRcIiApIHtcclxuICAgICAgICAgICAgdHlwZURlZmluaXRpb24uX2RlcGVuZGVuY2llcy5mb3JFYWNoKGZ1bmN0aW9uKGRlcGVuZGVuY3kpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkZXBlbmRlbmN5SW5zdGFuY2UgPSBCaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlci5yZXNvbHZlKG5hbWVzcGFjZSwgZGVwZW5kZW5jeSk7XHJcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmN5SW5zdGFuY2VzLnB1c2goZGVwZW5kZW5jeUluc3RhbmNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZXBlbmRlbmN5SW5zdGFuY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlc29sdmUobmFtZXNwYWNlLCBkZXBlbmRlbmN5LCBpbmRleCwgaW5zdGFuY2VzLCB0eXBlRGVmaW5pdGlvbiwgcmVzb2x2ZWRDYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBwcm9taXNlID1cclxuICAgICAgICAgICAgQmlmcm9zdC5kZXBlbmRlbmN5UmVzb2x2ZXJcclxuICAgICAgICAgICAgICAgIC5iZWdpblJlc29sdmUobmFtZXNwYWNlLCBkZXBlbmRlbmN5KVxyXG4gICAgICAgICAgICAgICAgLmNvbnRpbnVlV2l0aChmdW5jdGlvbihyZXN1bHQsIG5leHRQcm9taXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2VzW2luZGV4XSA9IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlZENhbGxiYWNrKHJlc3VsdCwgbmV4dFByb21pc2UpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGJlZ2luR2V0RGVwZW5kZW5jeUluc3RhbmNlcyhuYW1lc3BhY2UsIHR5cGVEZWZpbml0aW9uLCBpbnN0YW5jZUhhc2gpIHtcclxuICAgICAgICBmdW5jdGlvbiByZXNvbHZlZChyZXN1bHQsIG5leHRQcm9taXNlKSB7XHJcbiAgICAgICAgICAgIHNvbHZlZERlcGVuZGVuY2llcysrO1xyXG4gICAgICAgICAgICBpZiAoc29sdmVkRGVwZW5kZW5jaWVzID09PSBkZXBlbmRlbmNpZXNUb1Jlc29sdmUpIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGRlcGVuZGVuY3lJbnN0YW5jZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgdmFyIGRlcGVuZGVuY3lJbnN0YW5jZXMgPSBbXTtcclxuICAgICAgICB2YXIgc29sdmVkRGVwZW5kZW5jaWVzID0gMDtcclxuICAgICAgICBpZiggdHlwZW9mIHR5cGVEZWZpbml0aW9uLl9kZXBlbmRlbmNpZXMgIT09IFwidW5kZWZpbmVkXCIgKSB7XHJcbiAgICAgICAgICAgIHZhciBkZXBlbmRlbmNpZXNUb1Jlc29sdmUgPSB0eXBlRGVmaW5pdGlvbi5fZGVwZW5kZW5jaWVzLmxlbmd0aDtcclxuICAgICAgICAgICAgdmFyIGFjdHVhbERlcGVuZGVuY3lJbmRleCA9IDA7XHJcbiAgICAgICAgICAgIHZhciBkZXBlbmRlbmN5ID0gXCJcIjtcclxuICAgICAgICAgICAgZm9yKCB2YXIgZGVwZW5kZW5jeUluZGV4PTA7IGRlcGVuZGVuY3lJbmRleDxkZXBlbmRlbmNpZXNUb1Jlc29sdmU7IGRlcGVuZGVuY3lJbmRleCsrICkge1xyXG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jeSA9IHR5cGVEZWZpbml0aW9uLl9kZXBlbmRlbmNpZXNbZGVwZW5kZW5jeUluZGV4XTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2VIYXNoICYmIGluc3RhbmNlSGFzaC5oYXNPd25Qcm9wZXJ0eShkZXBlbmRlbmN5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlcGVuZGVuY3lJbnN0YW5jZXNbZGVwZW5kZW5jeUluZGV4XSA9IGluc3RhbmNlSGFzaFtkZXBlbmRlbmN5XTtcclxuICAgICAgICAgICAgICAgICAgICBzb2x2ZWREZXBlbmRlbmNpZXMrKztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc29sdmVkRGVwZW5kZW5jaWVzID09PSBkZXBlbmRlbmNpZXNUb1Jlc29sdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoZGVwZW5kZW5jeUluc3RhbmNlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG5hbWVzcGFjZSwgZGVwZW5kZW5jeSwgZGVwZW5kZW5jeUluZGV4LCBkZXBlbmRlbmN5SW5zdGFuY2VzLCB0eXBlRGVmaW5pdGlvbiwgcmVzb2x2ZWQpLm9uRmFpbChwcm9taXNlLmZhaWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBleHBhbmRJbnN0YW5jZXNIYXNoVG9EZXBlbmRlbmNpZXModHlwZURlZmluaXRpb24sIGluc3RhbmNlSGFzaCwgZGVwZW5kZW5jeUluc3RhbmNlcykge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdHlwZURlZmluaXRpb24uX2RlcGVuZGVuY2llcyA9PT0gXCJ1bmRlZmluZWRcIiB8fCB0eXBlRGVmaW5pdGlvbi5fZGVwZW5kZW5jaWVzID09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IoIHZhciBkZXBlbmRlbmN5IGluIGluc3RhbmNlSGFzaCApIHtcclxuICAgICAgICAgICAgZm9yKCB2YXIgZGVwZW5kZW5jeUluZGV4PTA7IGRlcGVuZGVuY3lJbmRleDx0eXBlRGVmaW5pdGlvbi5fZGVwZW5kZW5jaWVzLmxlbmd0aDsgZGVwZW5kZW5jeUluZGV4KysgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiggdHlwZURlZmluaXRpb24uX2RlcGVuZGVuY2llc1tkZXBlbmRlbmN5SW5kZXhdID09PSBkZXBlbmRlbmN5ICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlcGVuZGVuY3lJbnN0YW5jZXNbZGVwZW5kZW5jeUluZGV4XSA9IGluc3RhbmNlSGFzaFtkZXBlbmRlbmN5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBleHBhbmREZXBlbmRlbmNpZXNUb0luc3RhbmNlSGFzaCh0eXBlRGVmaW5pdGlvbiwgZGVwZW5kZW5jaWVzLCBpbnN0YW5jZUhhc2gpIHtcclxuICAgICAgICBmb3IoIHZhciBkZXBlbmRlbmN5SW5kZXg9MDsgZGVwZW5kZW5jeUluZGV4PGRlcGVuZGVuY2llcy5sZW5ndGg7IGRlcGVuZGVuY3lJbmRleCsrICkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZUhhc2hbdHlwZURlZmluaXRpb24uX2RlcGVuZGVuY2llc1tkZXBlbmRlbmN5SW5kZXhdXSA9IGRlcGVuZGVuY2llc1tkZXBlbmRlbmN5SW5kZXhdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZXNvbHZlRGVwZW5kZW5jeUluc3RhbmNlc1RoYXRIYXNOb3RCZWVuUmVzb2x2ZWQoZGVwZW5kZW5jeUluc3RhbmNlcywgdHlwZURlZmluaXRpb24pIHtcclxuICAgICAgICBkZXBlbmRlbmN5SW5zdGFuY2VzLmZvckVhY2goZnVuY3Rpb24oZGVwZW5kZW5jeUluc3RhbmNlLCBpbmRleCkge1xyXG4gICAgICAgICAgICBpZiggZGVwZW5kZW5jeUluc3RhbmNlID09IG51bGwgfHwgdHlwZW9mIGRlcGVuZGVuY3lJbnN0YW5jZSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcclxuICAgICAgICAgICAgICAgIHZhciBkZXBlbmRlbmN5ID0gdHlwZURlZmluaXRpb24uX2RlcGVuZGVuY2llc1tpbmRleF07XHJcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmN5SW5zdGFuY2VzW2luZGV4XSA9IEJpZnJvc3QuZGVwZW5kZW5jeVJlc29sdmVyLnJlc29sdmUodHlwZURlZmluaXRpb24uX25hbWVzcGFjZSwgZGVwZW5kZW5jeSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZXNvbHZlRGVwZW5kZW5jeUluc3RhbmNlcyhpbnN0YW5jZUhhc2gsIHR5cGVEZWZpbml0aW9uKSB7XHJcbiAgICAgICAgdmFyIGRlcGVuZGVuY3lJbnN0YW5jZXMgPSBbXTtcclxuICAgICAgICBpZiggdHlwZW9mIGluc3RhbmNlSGFzaCA9PT0gXCJvYmplY3RcIiApIHtcclxuICAgICAgICAgICAgZXhwYW5kSW5zdGFuY2VzSGFzaFRvRGVwZW5kZW5jaWVzKHR5cGVEZWZpbml0aW9uLCBpbnN0YW5jZUhhc2gsIGRlcGVuZGVuY3lJbnN0YW5jZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggdHlwZW9mIHR5cGVEZWZpbml0aW9uLl9kZXBlbmRlbmNpZXMgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZURlZmluaXRpb24uX2RlcGVuZGVuY2llcy5sZW5ndGggPiAwICkge1xyXG4gICAgICAgICAgICBpZiggZGVwZW5kZW5jeUluc3RhbmNlcy5sZW5ndGggPiAwICkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZURlcGVuZGVuY3lJbnN0YW5jZXNUaGF0SGFzTm90QmVlblJlc29sdmVkKGRlcGVuZGVuY3lJbnN0YW5jZXMsIHR5cGVEZWZpbml0aW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlcGVuZGVuY3lJbnN0YW5jZXMgPSBnZXREZXBlbmRlbmN5SW5zdGFuY2VzKHR5cGVEZWZpbml0aW9uLl9uYW1lc3BhY2UsIHR5cGVEZWZpbml0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGVwZW5kZW5jeUluc3RhbmNlcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhZGRNaXNzaW5nRGVwZW5kZW5jaWVzQXNOdWxsRnJvbVR5cGVEZWZpbml0aW9uKGluc3RhbmNlSGFzaCwgdHlwZURlZmluaXRpb24pIHtcclxuICAgICAgICBpZiAodHlwZW9mIHR5cGVEZWZpbml0aW9uLl9kZXBlbmRlbmNpZXMgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIGluc3RhbmNlSGFzaCA9PT0gXCJ1bmRlZmluZWRcIiB8fCBpbnN0YW5jZUhhc2ggPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciggdmFyIGluZGV4PTA7IGluZGV4PHR5cGVEZWZpbml0aW9uLl9kZXBlbmRlbmNpZXMubGVuZ3RoOyBpbmRleCsrICkge1xyXG4gICAgICAgICAgICB2YXIgZGVwZW5kZW5jeSA9IHR5cGVEZWZpbml0aW9uLl9kZXBlbmRlbmNpZXNbaW5kZXhdO1xyXG4gICAgICAgICAgICBpZiAoIShkZXBlbmRlbmN5IGluIGluc3RhbmNlSGFzaCkpIHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlSGFzaFtkZXBlbmRlbmN5XSA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaGFuZGxlT25DcmVhdGUodHlwZSwgbGFzdERlc2NlbmRhbnQsIGN1cnJlbnRJbnN0YW5jZSkge1xyXG4gICAgICAgIGlmIChjdXJyZW50SW5zdGFuY2UgPT0gbnVsbCB8fCB0eXBlb2YgY3VycmVudEluc3RhbmNlID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCB0eXBlb2YgdHlwZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgdHlwZS5wcm90b3R5cGUgIT09IFwidW5kZWZpbmVkXCIgKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZU9uQ3JlYXRlKHR5cGUuX3N1cGVyLCBsYXN0RGVzY2VuZGFudCwgdHlwZS5wcm90b3R5cGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIGN1cnJlbnRJbnN0YW5jZS5oYXNPd25Qcm9wZXJ0eShcIm9uQ3JlYXRlZFwiKSAmJiB0eXBlb2YgY3VycmVudEluc3RhbmNlLm9uQ3JlYXRlZCA9PT0gXCJmdW5jdGlvblwiICkge1xyXG4gICAgICAgICAgICBjdXJyZW50SW5zdGFuY2Uub25DcmVhdGVkKGxhc3REZXNjZW5kYW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQmlmcm9zdC5UeXBlLl9leHRlbmRlcnMgPSBbXTtcclxuXHJcbiAgICBCaWZyb3N0LlR5cGUuc2NvcGUgPSB7XHJcbiAgICAgICAgZ2V0Rm9yIDogZnVuY3Rpb24obmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgQmlmcm9zdC5UeXBlLnR5cGVPZiA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5fc3VwZXIgPT09IFwidW5kZWZpbmVkXCIgfHxcclxuICAgICAgICAgICAgdHlwZW9mIHRoaXMuX3N1cGVyLl90eXBlSWQgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3N1cGVyLl90eXBlSWQgPT09IHR5cGUuX3R5cGVJZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgdHlwZS5fc3VwZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgdmFyIGlzVHlwZSA9IHRoaXMuX3N1cGVyLnR5cGVPZih0eXBlKTtcclxuICAgICAgICAgICAgaWYgKGlzVHlwZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIEJpZnJvc3QuVHlwZS5nZXRFeHRlbmRlcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2V4dGVuZGVycztcclxuICAgIH07XHJcblxyXG4gICAgQmlmcm9zdC5UeXBlLmdldEV4dGVuZGVyc0luID0gZnVuY3Rpb24gKG5hbWVzcGFjZSkge1xyXG4gICAgICAgIHZhciBpbk5hbWVzcGFjZSA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLl9leHRlbmRlcnMuZm9yRWFjaChmdW5jdGlvbiAoZXh0ZW5kZXIpIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSBuYW1lc3BhY2U7XHJcbiAgICAgICAgICAgIHdoaWxlIChjdXJyZW50ICE9PSB3aW5kb3cpIHtcclxuICAgICAgICAgICAgICAgIGlmIChleHRlbmRlci5fbmFtZXNwYWNlID09PSBjdXJyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5OYW1lc3BhY2UucHVzaChleHRlbmRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNVbmRlZmluZWQoY3VycmVudC5wYXJlbnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBpbk5hbWVzcGFjZTtcclxuICAgIH07XHJcblxyXG5cclxuXHJcbiAgICBCaWZyb3N0LlR5cGUuZXh0ZW5kID0gZnVuY3Rpb24gKHR5cGVEZWZpbml0aW9uKSB7XHJcbiAgICAgICAgdGhyb3dJZk1pc3NpbmdUeXBlRGVmaW5pdGlvbih0eXBlRGVmaW5pdGlvbik7XHJcbiAgICAgICAgdGhyb3dJZlR5cGVEZWZpbml0aW9uSXNPYmplY3RMaXRlcmFsKHR5cGVEZWZpbml0aW9uKTtcclxuXHJcbiAgICAgICAgYWRkU3RhdGljUHJvcGVydGllcyh0eXBlRGVmaW5pdGlvbik7XHJcbiAgICAgICAgc2V0dXBEZXBlbmRlbmNpZXModHlwZURlZmluaXRpb24pO1xyXG4gICAgICAgIHR5cGVEZWZpbml0aW9uLl9zdXBlciA9IHRoaXM7XHJcbiAgICAgICAgdHlwZURlZmluaXRpb24uX3R5cGVJZCA9IEJpZnJvc3QuR3VpZC5jcmVhdGUoKTtcclxuICAgICAgICB0eXBlRGVmaW5pdGlvbi5fZXh0ZW5kZXJzID0gW107XHJcbiAgICAgICAgQmlmcm9zdC5UeXBlLnJlZ2lzdGVyRXh0ZW5kZXIodGhpcywgdHlwZURlZmluaXRpb24pO1xyXG4gICAgICAgIHJldHVybiB0eXBlRGVmaW5pdGlvbjtcclxuICAgIH07XHJcblxyXG4gICAgQmlmcm9zdC5UeXBlLnJlZ2lzdGVyRXh0ZW5kZXIgPSBmdW5jdGlvbiAodHlwZUV4dGVuZGVkLCB0eXBlRGVmaW5lZCkge1xyXG4gICAgICAgIHZhciBzdXBlclR5cGUgPSB0eXBlRXh0ZW5kZWQ7XHJcblxyXG4gICAgICAgIHdoaWxlIChzdXBlclR5cGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoc3VwZXJUeXBlLl9leHRlbmRlcnMuaW5kZXhPZih0eXBlRGVmaW5lZCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlclR5cGUuX2V4dGVuZGVycy5wdXNoKHR5cGVEZWZpbmVkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdXBlclR5cGUgPSBzdXBlclR5cGUuX3N1cGVyO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgQmlmcm9zdC5UeXBlLnNjb3BlVG8gPSBmdW5jdGlvbihzY29wZSkge1xyXG4gICAgICAgIGlmKCB0eXBlb2Ygc2NvcGUgPT09IFwiZnVuY3Rpb25cIiApIHtcclxuICAgICAgICAgICAgdGhpcy5zY29wZSA9IHtcclxuICAgICAgICAgICAgICAgIGdldEZvcjogc2NvcGVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiggdHlwZW9mIHNjb3BlLmdldEZvciA9PT0gXCJmdW5jdGlvblwiICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY29wZSA9IHNjb3BlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY29wZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBnZXRGb3I6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIEJpZnJvc3QuVHlwZS5kZWZhdWx0U2NvcGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnNjb3BlID0ge1xyXG4gICAgICAgICAgICBnZXRGb3I6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBCaWZyb3N0LlR5cGUucmVxdWlyZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZm9yICh2YXIgYXJndW1lbnRJbmRleCA9IDA7IGFyZ3VtZW50SW5kZXggPCBhcmd1bWVudHMubGVuZ3RoOyBhcmd1bWVudEluZGV4KyspIHtcclxuICAgICAgICAgICAgdGhpcy5fZGVwZW5kZW5jaWVzLnB1c2goYXJndW1lbnRzW2FyZ3VtZW50SW5kZXhdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBCaWZyb3N0LlR5cGUuY3JlYXRlID0gZnVuY3Rpb24gKGluc3RhbmNlSGFzaCwgaXNTdXBlcikge1xyXG4gICAgICAgIHZhciBhY3R1YWxUeXBlID0gdGhpcztcclxuICAgICAgICBpZiggdGhpcy5fc3VwZXIgIT0gbnVsbCApIHtcclxuICAgICAgICAgICAgYWN0dWFsVHlwZS5wcm90b3R5cGUgPSB0aGlzLl9zdXBlci5jcmVhdGUoaW5zdGFuY2VIYXNoLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYWRkTWlzc2luZ0RlcGVuZGVuY2llc0FzTnVsbEZyb21UeXBlRGVmaW5pdGlvbihpbnN0YW5jZUhhc2gsIHRoaXMpO1xyXG4gICAgICAgIHZhciBzY29wZSA9IG51bGw7XHJcbiAgICAgICAgaWYoIHRoaXMgIT09IEJpZnJvc3QuVHlwZSApIHtcclxuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZXNQZXJTY29wZSA9IHRoaXMuaW5zdGFuY2VzUGVyU2NvcGUgfHwge307XHJcblxyXG4gICAgICAgICAgICBzY29wZSA9IHRoaXMuc2NvcGUuZ2V0Rm9yKHRoaXMuX25hbWVzcGFjZSwgdGhpcy5fbmFtZSwgdGhpcy5fdHlwZUlkKTtcclxuICAgICAgICAgICAgaWYgKHNjb3BlICE9IG51bGwgJiYgdGhpcy5pbnN0YW5jZXNQZXJTY29wZS5oYXNPd25Qcm9wZXJ0eShzY29wZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlc1BlclNjb3BlW3Njb3BlXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGluc3RhbmNlID0gbnVsbDtcclxuICAgICAgICBpZiggdHlwZW9mIHRoaXMuY3JlYXRlRnVuY3Rpb24gIT09IFwidW5kZWZpbmVkXCIgKSB7XHJcbiAgICAgICAgICAgIHZhciBkZXBlbmRlbmN5SW5zdGFuY2VzID0gcmVzb2x2ZURlcGVuZGVuY3lJbnN0YW5jZXMoaW5zdGFuY2VIYXNoLCB0aGlzKTtcclxuICAgICAgICAgICAgaW5zdGFuY2UgPSB0aGlzLmNyZWF0ZUZ1bmN0aW9uKHRoaXMsIGRlcGVuZGVuY3lJbnN0YW5jZXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlID0gbmV3IGFjdHVhbFR5cGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluc3RhbmNlLl90eXBlID0gYWN0dWFsVHlwZTtcclxuXHJcbiAgICAgICAgaWYoIGlzU3VwZXIgIT09IHRydWUgKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZU9uQ3JlYXRlKGFjdHVhbFR5cGUsIGluc3RhbmNlLCBpbnN0YW5jZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiggc2NvcGUgIT0gbnVsbCApIHtcclxuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZXNQZXJTY29wZVtzY29wZV0gPSBpbnN0YW5jZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgIH07XHJcblxyXG4gICAgQmlmcm9zdC5UeXBlLmNyZWF0ZVdpdGhvdXRTY29wZSA9IGZ1bmN0aW9uIChpbnN0YW5jZUhhc2gsIGlzU3VwZXIpIHtcclxuICAgICAgICB2YXIgc2NvcGUgPSB0aGlzLnNjb3BlO1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdFNjb3BlKCk7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlID0gdGhpcy5jcmVhdGUoaW5zdGFuY2VIYXNoLCBpc1N1cGVyKTtcclxuICAgICAgICB0aGlzLnNjb3BlID0gc2NvcGU7XHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfTtcclxuXHJcbiAgICBCaWZyb3N0LlR5cGUuZW5zdXJlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgdmFyIGxvYWRlZERlcGVuZGVuY2llcyA9IDA7XHJcbiAgICAgICAgdmFyIGRlcGVuZGVuY2llc1RvUmVzb2x2ZSA9IHRoaXMuX2RlcGVuZGVuY2llcy5sZW5ndGg7XHJcbiAgICAgICAgdmFyIG5hbWVzcGFjZSA9IHRoaXMuX25hbWVzcGFjZTtcclxuICAgICAgICB2YXIgcmVzb2x2ZXIgPSBCaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlcjtcclxuICAgICAgICBpZiAoZGVwZW5kZW5jaWVzVG9SZXNvbHZlID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kZXBlbmRlbmNpZXMuZm9yRWFjaChmdW5jdGlvbiAoZGVwZW5kZW5jeSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChyZXNvbHZlci5jYW5SZXNvbHZlKG5hbWVzcGFjZSwgZGVwZW5kZW5jeSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlci5iZWdpblJlc29sdmUobmFtZXNwYWNlLCBkZXBlbmRlbmN5KS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHJlc29sdmVkU3lzdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRlZERlcGVuZGVuY2llcysrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9hZGVkRGVwZW5kZW5jaWVzID09PSBkZXBlbmRlbmNpZXNUb1Jlc29sdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVwZW5kZW5jaWVzVG9SZXNvbHZlLS07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvYWRlZERlcGVuZGVuY2llcyA9PT0gZGVwZW5kZW5jaWVzVG9SZXNvbHZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwcm9taXNlLnNpZ25hbCgpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH07XHJcblxyXG4gICAgQmlmcm9zdC5UeXBlLmJlZ2luQ3JlYXRlID0gZnVuY3Rpb24oaW5zdGFuY2VIYXNoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgdmFyIHN1cGVyUHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgc3VwZXJQcm9taXNlLm9uRmFpbChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBwcm9taXNlLmZhaWwoZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmKCB0aGlzLl9zdXBlciAhPSBudWxsICkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdXBlci5iZWdpbkNyZWF0ZShpbnN0YW5jZUhhc2gpLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoX3N1cGVyLCBuZXh0UHJvbWlzZSkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXJQcm9taXNlLnNpZ25hbChfc3VwZXIpO1xyXG4gICAgICAgICAgICB9KS5vbkZhaWwoZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2UuZmFpbChlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc3VwZXJQcm9taXNlLnNpZ25hbChudWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1cGVyUHJvbWlzZS5jb250aW51ZVdpdGgoZnVuY3Rpb24oX3N1cGVyLCBuZXh0UHJvbWlzZSkge1xyXG4gICAgICAgICAgICBzZWxmLnByb3RvdHlwZSA9IF9zdXBlcjtcclxuXHJcbiAgICAgICAgICAgIGlmKCBzZWxmLl9kZXBlbmRlbmNpZXMgPT0gbnVsbCB8fFxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIHNlbGYuX2RlcGVuZGVuY2llcyA9PT0gXCJ1bmRlZmluZWRcIiB8fFxyXG4gICAgICAgICAgICAgICAgc2VsZi5fZGVwZW5kZW5jaWVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gc2VsZi5jcmVhdGUoaW5zdGFuY2VIYXNoKTtcclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGJlZ2luR2V0RGVwZW5kZW5jeUluc3RhbmNlcyhzZWxmLl9uYW1lc3BhY2UsIHNlbGYsIGluc3RhbmNlSGFzaClcclxuICAgICAgICAgICAgICAgICAgICAuY29udGludWVXaXRoKGZ1bmN0aW9uKGRlcGVuZGVuY2llcywgbmV4dFByb21pc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlcGVuZGVuY3lJbnN0YW5jZXMgPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kRGVwZW5kZW5jaWVzVG9JbnN0YW5jZUhhc2goc2VsZiwgZGVwZW5kZW5jaWVzLCBkZXBlbmRlbmN5SW5zdGFuY2VzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHR5cGVvZiBpbnN0YW5jZUhhc2ggPT09IFwib2JqZWN0XCIgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IoIHZhciBwcm9wZXJ0eSBpbiBpbnN0YW5jZUhhc2ggKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwZW5kZW5jeUluc3RhbmNlc1twcm9wZXJ0eV0gPSBpbnN0YW5jZUhhc2hbcHJvcGVydHldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gc2VsZi5jcmVhdGUoZGVwZW5kZW5jeUluc3RhbmNlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2UuZmFpbChlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH07XHJcbn0pKCk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIpO1xyXG5CaWZyb3N0LlVyaSA9IChmdW5jdGlvbih3aW5kb3csIHVuZGVmaW5lZCkge1xyXG4gICAgLyogcGFyc2VVcmkgSlMgdjAuMSwgYnkgU3RldmVuIExldml0aGFuIChodHRwOi8vYmFkYXNzZXJ5LmJsb2dzcG90LmNvbSlcclxuICAgIFNwbGl0cyBhbnkgd2VsbC1mb3JtZWQgVVJJIGludG8gdGhlIGZvbGxvd2luZyBwYXJ0cyAoYWxsIGFyZSBvcHRpb25hbCk6XHJcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICDigKIgc291cmNlIChzaW5jZSB0aGUgZXhlYygpIG1ldGhvZCByZXR1cm5zIGJhY2tyZWZlcmVuY2UgMCBbaS5lLiwgdGhlIGVudGlyZSBtYXRjaF0gYXMga2V5IDAsIHdlIG1pZ2h0IGFzIHdlbGwgdXNlIGl0KVxyXG4gICAg4oCiIHByb3RvY29sIChzY2hlbWUpXHJcbiAgICDigKIgYXV0aG9yaXR5IChpbmNsdWRlcyBib3RoIHRoZSBkb21haW4gYW5kIHBvcnQpXHJcbiAgICAgICAg4oCiIGRvbWFpbiAocGFydCBvZiB0aGUgYXV0aG9yaXR5OyBjYW4gYmUgYW4gSVAgYWRkcmVzcylcclxuICAgICAgICDigKIgcG9ydCAocGFydCBvZiB0aGUgYXV0aG9yaXR5KVxyXG4gICAg4oCiIHBhdGggKGluY2x1ZGVzIGJvdGggdGhlIGRpcmVjdG9yeSBwYXRoIGFuZCBmaWxlbmFtZSlcclxuICAgICAgICDigKIgZGlyZWN0b3J5UGF0aCAocGFydCBvZiB0aGUgcGF0aDsgc3VwcG9ydHMgZGlyZWN0b3JpZXMgd2l0aCBwZXJpb2RzLCBhbmQgd2l0aG91dCBhIHRyYWlsaW5nIGJhY2tzbGFzaClcclxuICAgICAgICDigKIgZmlsZU5hbWUgKHBhcnQgb2YgdGhlIHBhdGgpXHJcbiAgICDigKIgcXVlcnkgKGRvZXMgbm90IGluY2x1ZGUgdGhlIGxlYWRpbmcgcXVlc3Rpb24gbWFyaylcclxuICAgIOKAoiBhbmNob3IgKGZyYWdtZW50KVxyXG4gICAgKi9cclxuICAgIGZ1bmN0aW9uIHBhcnNlVXJpKHNvdXJjZVVyaSl7XHJcbiAgICAgICAgdmFyIHVyaVBhcnROYW1lcyA9IFtcInNvdXJjZVwiLFwicHJvdG9jb2xcIixcImF1dGhvcml0eVwiLFwiZG9tYWluXCIsXCJwb3J0XCIsXCJwYXRoXCIsXCJkaXJlY3RvcnlQYXRoXCIsXCJmaWxlTmFtZVwiLFwicXVlcnlcIixcImFuY2hvclwiXTtcclxuICAgICAgICB2YXIgdXJpUGFydHMgPSBuZXcgUmVnRXhwKFwiXig/OihbXjovPyMuXSspOik/KD86Ly8pPygoW146Lz8jXSopKD86OihcXFxcZCopKT8pPygoLyg/OltePyNdKD8hW14/Iy9dKlxcXFwuW14/Iy8uXSsoPzpbXFxcXD8jXXwkKSkpKi8/KT8oW14/Iy9dKikpPyg/OlxcXFw/KFteI10qKSk/KD86IyguKikpP1wiKS5leGVjKHNvdXJjZVVyaSk7XHJcbiAgICAgICAgdmFyIHVyaSA9IHt9O1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspe1xyXG4gICAgICAgICAgICB1cmlbdXJpUGFydE5hbWVzW2ldXSA9ICh1cmlQYXJ0c1tpXSA/IHVyaVBhcnRzW2ldIDogXCJcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBbHdheXMgZW5kIGRpcmVjdG9yeVBhdGggd2l0aCBhIHRyYWlsaW5nIGJhY2tzbGFzaCBpZiBhIHBhdGggd2FzIHByZXNlbnQgaW4gdGhlIHNvdXJjZSBVUklcclxuICAgICAgICAvLyBOb3RlIHRoYXQgYSB0cmFpbGluZyBiYWNrc2xhc2ggaXMgTk9UIGF1dG9tYXRpY2FsbHkgaW5zZXJ0ZWQgd2l0aGluIG9yIGFwcGVuZGVkIHRvIHRoZSBcInBhdGhcIiBrZXlcclxuICAgICAgICBpZih1cmkuZGlyZWN0b3J5UGF0aC5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgdXJpLmRpcmVjdG9yeVBhdGggPSB1cmkuZGlyZWN0b3J5UGF0aC5yZXBsYWNlKC9cXC8/JC8sIFwiL1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB1cmk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIFVyaShsb2NhdGlvbikge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnNldExvY2F0aW9uID0gZnVuY3Rpb24gKGxvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgIHNlbGYuZnVsbFBhdGggPSBsb2NhdGlvbjtcclxuICAgICAgICAgICAgbG9jYXRpb24gPSBsb2NhdGlvbi5yZXBsYWNlKFwiIyFcIiwgXCIvXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHBhcnNlVXJpKGxvY2F0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0LnByb3RvY29sIHx8IHR5cGVvZiByZXN1bHQucHJvdG9jb2wgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LkludmFsaWRVcmlGb3JtYXQoXCJVcmkgKCdcIiArIGxvY2F0aW9uICsgXCInKSB3YXMgaW4gdGhlIHdyb25nIGZvcm1hdFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5zY2hlbWUgPSByZXN1bHQucHJvdG9jb2w7XHJcbiAgICAgICAgICAgIHNlbGYuaG9zdCA9IHJlc3VsdC5kb21haW47XHJcbiAgICAgICAgICAgIHNlbGYucGF0aCA9IHJlc3VsdC5wYXRoO1xyXG4gICAgICAgICAgICBzZWxmLmFuY2hvciA9IHJlc3VsdC5hbmNob3I7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnF1ZXJ5U3RyaW5nID0gcmVzdWx0LnF1ZXJ5O1xyXG4gICAgICAgICAgICBzZWxmLnBvcnQgPSBwYXJzZUludChyZXN1bHQucG9ydCk7XHJcbiAgICAgICAgICAgIHNlbGYucGFyYW1ldGVycyA9IEJpZnJvc3QuaGFzaFN0cmluZy5kZWNvZGUocmVzdWx0LnF1ZXJ5KTtcclxuICAgICAgICAgICAgc2VsZi5wYXJhbWV0ZXJzID0gQmlmcm9zdC5leHRlbmQoQmlmcm9zdC5oYXNoU3RyaW5nLmRlY29kZShyZXN1bHQuYW5jaG9yKSwgc2VsZi5wYXJhbWV0ZXJzKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuaXNTYW1lQXNPcmlnaW4gPSAod2luZG93LmxvY2F0aW9uLnByb3RvY29sID09PSByZXN1bHQucHJvdG9jb2wgKyBcIjpcIiAmJlxyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lID09PSBzZWxmLmhvc3QpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TG9jYXRpb24obG9jYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRocm93SWZMb2NhdGlvbk5vdFNwZWNpZmllZChsb2NhdGlvbikge1xyXG4gICAgICAgIGlmICghbG9jYXRpb24gfHwgdHlwZW9mIGxvY2F0aW9uID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LkxvY2F0aW9uTm90U3BlY2lmaWVkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNyZWF0ZTogZnVuY3Rpb24obG9jYXRpb24pIHtcclxuICAgICAgICAgICAgdGhyb3dJZkxvY2F0aW9uTm90U3BlY2lmaWVkKGxvY2F0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB1cmkgPSBuZXcgVXJpKGxvY2F0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIHVyaTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpc0Fic29sdXRlOiBmdW5jdGlvbiAodXJsKSB7XHJcbiAgICAgICAgICAgIC8vIEJhc2VkIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTA2ODcwOTkvaG93LXRvLXRlc3QtaWYtYS11cmwtc3RyaW5nLWlzLWFic29sdXRlLW9yLXJlbGF0aXZlXHJcbiAgICAgICAgICAgIHZhciBleHByZXNzaW9uID0gbmV3IFJlZ0V4cCgnXig/OlthLXpdKzopPy8vJywgJ2knKTtcclxuICAgICAgICAgICAgcmV0dXJuIGV4cHJlc3Npb24udGVzdCh1cmwpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0pKHdpbmRvdyk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIHVyaU1hcHBlcnM6IHtcclxuICAgIH1cclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0XCIsIHtcclxuICAgIFdlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMudHlwZXMgPSBCaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzO1xyXG5cclxuICAgICAgICB0aGlzLmNhblJlc29sdmUgPSBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnR5cGVzLmhhc093blByb3BlcnR5KG5hbWUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucmVzb2x2ZSA9IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG5hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYudHlwZXNbbmFtZV07XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSk7XHJcblxyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzID0ge1xyXG4gICAgb3B0aW9uczoge31cclxufTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbGlkYXRpb25cIiwge1xyXG4gICAgZW1haWw6IEJpZnJvc3QudmFsaWRhdGlvbi5SdWxlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHJlZ2V4ID0gL14oKChbYS16XXxcXGR8WyEjXFwkJSYnXFwqXFwrXFwtXFwvPVxcP1xcXl9ge1xcfH1+XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkrKFxcLihbYS16XXxcXGR8WyEjXFwkJSYnXFwqXFwrXFwtXFwvPVxcP1xcXl9ge1xcfH1+XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkrKSopfCgoXFx4MjIpKCgoKFxceDIwfFxceDA5KSooXFx4MGRcXHgwYSkpPyhcXHgyMHxcXHgwOSkrKT8oKFtcXHgwMS1cXHgwOFxceDBiXFx4MGNcXHgwZS1cXHgxZlxceDdmXXxcXHgyMXxbXFx4MjMtXFx4NWJdfFtcXHg1ZC1cXHg3ZV18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfChcXFxcKFtcXHgwMS1cXHgwOVxceDBiXFx4MGNcXHgwZC1cXHg3Zl18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKSkpKigoKFxceDIwfFxceDA5KSooXFx4MGRcXHgwYSkpPyhcXHgyMHxcXHgwOSkrKT8oXFx4MjIpKSlAKCgoW2Etel18XFxkfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoKFthLXpdfFxcZHxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkoW2Etel18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkqKFthLXpdfFxcZHxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkpKVxcLikrKChbYS16XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KChbYS16XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkoW2Etel18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkqKFthLXpdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSkpJC87XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG5vdFNldCh2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gQmlmcm9zdC5pc051bGwodmFsdWUpIHx8IEJpZnJvc3QuaXNVbmRlZmluZWQodmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAobm90U2V0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNTdHJpbmcodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk5vdEFTdHJpbmcoXCJWYWx1ZSBcIiArIHZhbHVlICsgXCIgaXMgbm90IGEgc3RyaW5nXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gKHZhbHVlLm1hdGNoKHJlZ2V4KSA9PSBudWxsKSA/IGZhbHNlIDogdHJ1ZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH0pXHJcbn0pO1xyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsaWRhdGlvblwiKTtcclxuQmlmcm9zdC5FeGNlcHRpb24uZGVmaW5lKFwiQmlmcm9zdC52YWxpZGF0aW9uLk9wdGlvbnNOb3REZWZpbmVkXCIsIFwiT3B0aW9uIHdhcyB1bmRlZmluZWRcIik7XHJcbkJpZnJvc3QuRXhjZXB0aW9uLmRlZmluZShcIkJpZnJvc3QudmFsaWRhdGlvbi5PcHRpb25zVmFsdWVOb3RTcGVjaWZpZWRcIiwgXCJSZXF1aXJlZCB2YWx1ZSBpbiBPcHRpb25zIGlzIG5vdCBzcGVjaWZpZWQuIFwiKTtcclxuQmlmcm9zdC5FeGNlcHRpb24uZGVmaW5lKFwiQmlmcm9zdC52YWxpZGF0aW9uLk5vdEFOdW1iZXJcIiwgXCJWYWx1ZSBpcyBub3QgYSBudW1iZXJcIik7XHJcbkJpZnJvc3QuRXhjZXB0aW9uLmRlZmluZShcIkJpZnJvc3QudmFsaWRhdGlvbi5Ob3RBU3RyaW5nXCIsIFwiVmFsdWUgaXMgbm90IGEgc3RyaW5nXCIpO1xyXG5CaWZyb3N0LkV4Y2VwdGlvbi5kZWZpbmUoXCJCaWZyb3N0LnZhbGlkYXRpb24uVmFsdWVOb3RTcGVjaWZpZWRcIixcIlZhbHVlIGlzIG5vdCBzcGVjaWZpZWRcIik7XHJcbkJpZnJvc3QuRXhjZXB0aW9uLmRlZmluZShcIkJpZnJvc3QudmFsaWRhdGlvbi5NaW5Ob3RTcGVjaWZpZWRcIixcIk1pbiBpcyBub3Qgc3BlY2lmaWVkXCIpO1xyXG5CaWZyb3N0LkV4Y2VwdGlvbi5kZWZpbmUoXCJCaWZyb3N0LnZhbGlkYXRpb24uTWF4Tm90U3BlY2lmaWVkXCIsXCJNYXggaXMgbm90IHNwZWNpZmllZFwiKTtcclxuQmlmcm9zdC5FeGNlcHRpb24uZGVmaW5lKFwiQmlmcm9zdC52YWxpZGF0aW9uLk1pbkxlbmd0aE5vdFNwZWNpZmllZFwiLFwiTWluIGxlbmd0aCBpcyBub3Qgc3BlY2lmaWVkXCIpO1xyXG5CaWZyb3N0LkV4Y2VwdGlvbi5kZWZpbmUoXCJCaWZyb3N0LnZhbGlkYXRpb24uTWF4TGVuZ3RoTm90U3BlY2lmaWVkXCIsXCJNYXggbGVuZ3RoIGlzIG5vdCBzcGVjaWZpZWRcIik7XHJcbkJpZnJvc3QuRXhjZXB0aW9uLmRlZmluZShcIkJpZnJvc3QudmFsaWRhdGlvbi5NaXNzaW5nRXhwcmVzc2lvblwiLFwiRXhwcmVzc2lvbiBpcyBub3Qgc3BlY2lmaWVkXCIpOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWxpZGF0aW9uXCIsIHtcclxuICAgIGdyZWF0ZXJUaGFuOiBCaWZyb3N0LnZhbGlkYXRpb24uUnVsZS5leHRlbmQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBub3RTZXQodmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEJpZnJvc3QuaXNVbmRlZmluZWQodmFsdWUpIHx8IEJpZnJvc3QuaXNOdWxsKHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRocm93SWZPcHRpb25zSW52YWxpZChvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGlmIChub3RTZXQob3B0aW9ucykpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uT3B0aW9uc05vdERlZmluZWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobm90U2V0KG9wdGlvbnMudmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXhjZXB0aW9uID0gbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5PcHRpb25zVmFsdWVOb3RTcGVjaWZpZWQoKTtcclxuICAgICAgICAgICAgICAgIGV4Y2VwdGlvbi5tZXNzYWdlID0gZXhjZXB0aW9uLm1lc3NhZ2UgKyBcIiAndmFsdWUnIGlzIG5vdCBzZXQuXCI7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBleGNlcHRpb247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3dJZlZhbHVlVG9DaGVja0lzTm90QU51bWJlcihvcHRpb25zLnZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRocm93SWZWYWx1ZVRvQ2hlY2tJc05vdEFOdW1iZXIodmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVtYmVyKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5Ob3RBTnVtYmVyKFwiVmFsdWUgXCIgKyB2YWx1ZSArIFwiIGlzIG5vdCBhIG51bWJlclwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aHJvd0lmT3B0aW9uc0ludmFsaWQoc2VsZi5vcHRpb25zKTtcclxuICAgICAgICAgICAgaWYgKG5vdFNldCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aHJvd0lmVmFsdWVUb0NoZWNrSXNOb3RBTnVtYmVyKHZhbHVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpID4gcGFyc2VGbG9hdChzZWxmLm9wdGlvbnMudmFsdWUpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbGlkYXRpb24ucnVsZUhhbmRsZXJzXCIpO1xyXG5CaWZyb3N0LnZhbGlkYXRpb24ucnVsZUhhbmRsZXJzLmdyZWF0ZXJUaGFuT3JFcXVhbCA9IHtcclxuICAgIHRocm93SWZPcHRpb25zSW52YWxpZDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICBpZiAodGhpcy5ub3RTZXQob3B0aW9ucykpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5PcHRpb25zTm90RGVmaW5lZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5ub3RTZXQob3B0aW9ucy52YWx1ZSkpIHtcclxuICAgICAgICAgICAgdmFyIGV4Y2VwdGlvbiA9IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uT3B0aW9uc1ZhbHVlTm90U3BlY2lmaWVkKCk7XHJcbiAgICAgICAgICAgIGV4Y2VwdGlvbi5tZXNzYWdlID0gZXhjZXB0aW9uLm1lc3NhZ2UgKyBcIiAndmFsdWUnIGlzIG5vdCBzZXQuXCI7XHJcbiAgICAgICAgICAgIHRocm93IGV4Y2VwdGlvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50aHJvd0lmVmFsdWVUb0NoZWNrSXNOb3RBTnVtYmVyKG9wdGlvbnMudmFsdWUpO1xyXG4gICAgfSxcclxuXHJcbiAgICB0aHJvd0lmVmFsdWVUb0NoZWNrSXNOb3RBTnVtYmVyOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdW1iZXIodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uTm90QU51bWJlcihcIlZhbHVlIFwiICsgdmFsdWUgKyBcIiBpcyBub3QgYSBudW1iZXJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBub3RTZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiBCaWZyb3N0LmlzVW5kZWZpbmVkKHZhbHVlKSB8fCBCaWZyb3N0LmlzTnVsbCh2YWx1ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHZhbGlkYXRlOiBmdW5jdGlvbiAodmFsdWUsIG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLnRocm93SWZPcHRpb25zSW52YWxpZChvcHRpb25zKTtcclxuICAgICAgICBpZiAodGhpcy5ub3RTZXQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50aHJvd0lmVmFsdWVUb0NoZWNrSXNOb3RBTnVtYmVyKHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSkgPj0gcGFyc2VGbG9hdChvcHRpb25zLnZhbHVlKTtcclxuICAgIH1cclxufTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbGlkYXRpb25cIiwge1xyXG4gICAgbGVuZ3RoOiBCaWZyb3N0LnZhbGlkYXRpb24uUnVsZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbm90U2V0KHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBCaWZyb3N0LmlzVW5kZWZpbmVkKHZhbHVlKSB8fCBCaWZyb3N0LmlzTnVsbCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lmVmFsdWVJc05vdEFOdW1iZXIodmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVtYmVyKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5Ob3RBTnVtYmVyKFwiVmFsdWUgXCIgKyB2YWx1ZSArIFwiIGlzIG5vdCBhIG51bWJlclwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGhyb3dJZk9wdGlvbnNJbnZhbGlkKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKG5vdFNldChvcHRpb25zKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5PcHRpb25zTm90RGVmaW5lZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChub3RTZXQob3B0aW9ucy5tYXgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk1heExlbmd0aE5vdFNwZWNpZmllZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChub3RTZXQob3B0aW9ucy5taW4pKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk1pbkxlbmd0aE5vdFNwZWNpZmllZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRocm93SWZWYWx1ZUlzTm90QU51bWJlcihvcHRpb25zLm1pbik7XHJcbiAgICAgICAgICAgIHRocm93SWZWYWx1ZUlzTm90QU51bWJlcihvcHRpb25zLm1heCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZhbGlkYXRlID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRocm93SWZPcHRpb25zSW52YWxpZChzZWxmLm9wdGlvbnMpO1xyXG4gICAgICAgICAgICBpZiAobm90U2V0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc1N0cmluZyh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5vcHRpb25zLm1pbiA8PSB2YWx1ZS5sZW5ndGggJiYgdmFsdWUubGVuZ3RoIDw9IHNlbGYub3B0aW9ucy5tYXg7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWxpZGF0aW9uXCIsIHtcclxuICAgIGxlc3NUaGFuOiBCaWZyb3N0LnZhbGlkYXRpb24uUnVsZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbm90U2V0KHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBCaWZyb3N0LmlzVW5kZWZpbmVkKHZhbHVlKSB8fCBCaWZyb3N0LmlzTnVsbCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lmT3B0aW9uc0ludmFsaWQob3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAobm90U2V0KG9wdGlvbnMpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk9wdGlvbnNOb3REZWZpbmVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5vdFNldChvcHRpb25zLnZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGV4Y2VwdGlvbiA9IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uT3B0aW9uc1ZhbHVlTm90U3BlY2lmaWVkKCk7XHJcbiAgICAgICAgICAgICAgICBleGNlcHRpb24ubWVzc2FnZSA9IGV4Y2VwdGlvbi5tZXNzYWdlICsgXCIgJ3ZhbHVlJyBpcyBub3Qgc2V0LlwiO1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lzVmFsdWVUb0NoZWNrSXNOb3RBTnVtYmVyKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bWJlcih2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uTm90QU51bWJlcihcIlZhbHVlIFwiICsgdmFsdWUgKyBcIiBpcyBub3QgYSBudW1iZXJcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudmFsaWRhdGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhyb3dJZk9wdGlvbnNJbnZhbGlkKHNlbGYub3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGlmIChub3RTZXQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3dJc1ZhbHVlVG9DaGVja0lzTm90QU51bWJlcih2YWx1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKSA8IHBhcnNlRmxvYXQoc2VsZi5vcHRpb25zLnZhbHVlKTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWxpZGF0aW9uLnJ1bGVIYW5kbGVyc1wiKTtcclxuQmlmcm9zdC52YWxpZGF0aW9uLnJ1bGVIYW5kbGVycy5sZXNzVGhhbk9yRXF1YWwgPSB7XHJcbiAgICB0aHJvd0lmT3B0aW9uc0ludmFsaWQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubm90U2V0KG9wdGlvbnMpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uT3B0aW9uc05vdERlZmluZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubm90U2V0KG9wdGlvbnMudmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHZhciBleGNlcHRpb24gPSBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk9wdGlvbnNWYWx1ZU5vdFNwZWNpZmllZCgpO1xyXG4gICAgICAgICAgICBleGNlcHRpb24ubWVzc2FnZSA9IGV4Y2VwdGlvbi5tZXNzYWdlICsgXCIgJ3ZhbHVlJyBpcyBub3Qgc2V0LlwiO1xyXG4gICAgICAgICAgICB0aHJvdyBleGNlcHRpb247XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICB0aHJvd0lzVmFsdWVUb0NoZWNrSXNOb3RBTnVtYmVyOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdW1iZXIodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uTm90QU51bWJlcihcIlZhbHVlIFwiICsgdmFsdWUgKyBcIiBpcyBub3QgYSBudW1iZXJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBub3RTZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiBCaWZyb3N0LmlzVW5kZWZpbmVkKHZhbHVlKSB8fCBCaWZyb3N0LmlzTnVsbCh2YWx1ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHZhbGlkYXRlOiBmdW5jdGlvbiAodmFsdWUsIG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLnRocm93SWZPcHRpb25zSW52YWxpZChvcHRpb25zKTtcclxuICAgICAgICBpZiAodGhpcy5ub3RTZXQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50aHJvd0lzVmFsdWVUb0NoZWNrSXNOb3RBTnVtYmVyKHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSkgPD0gcGFyc2VGbG9hdChvcHRpb25zLnZhbHVlKTtcclxuICAgIH1cclxufTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbGlkYXRpb25cIiwge1xyXG4gICAgbWF4TGVuZ3RoOiBCaWZyb3N0LnZhbGlkYXRpb24uUnVsZS5leHRlbmQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBub3RTZXQodmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEJpZnJvc3QuaXNVbmRlZmluZWQodmFsdWUpIHx8IEJpZnJvc3QuaXNOdWxsKHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRocm93SWZWYWx1ZUlzTm90QU51bWJlcih2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdW1iZXIodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk5vdEFOdW1iZXIoXCJWYWx1ZSBcIiArIHZhbHVlICsgXCIgaXMgbm90IGEgbnVtYmVyXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lmT3B0aW9uc0ludmFsaWQob3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAobm90U2V0KG9wdGlvbnMpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk9wdGlvbnNOb3REZWZpbmVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5vdFNldChvcHRpb25zLmxlbmd0aCkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uTWF4Tm90U3BlY2lmaWVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3dJZlZhbHVlSXNOb3RBTnVtYmVyKG9wdGlvbnMubGVuZ3RoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lmVmFsdWVJc05vdEFTdHJpbmcoc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc1N0cmluZyhzdHJpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk5vdEFTdHJpbmcoXCJWYWx1ZSBcIiArIHN0cmluZyArIFwiIGlzIG5vdCBhIHN0cmluZ1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aHJvd0lmT3B0aW9uc0ludmFsaWQoc2VsZi5vcHRpb25zKTtcclxuICAgICAgICAgICAgaWYgKG5vdFNldCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aHJvd0lmVmFsdWVJc05vdEFTdHJpbmcodmFsdWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUubGVuZ3RoIDw9IHNlbGYub3B0aW9ucy5sZW5ndGg7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5cclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbGlkYXRpb25cIiwge1xyXG4gICAgbWluTGVuZ3RoOiBCaWZyb3N0LnZhbGlkYXRpb24uUnVsZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbm90U2V0KHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBCaWZyb3N0LmlzVW5kZWZpbmVkKHZhbHVlKSB8fCBCaWZyb3N0LmlzTnVsbCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lmVmFsdWVJc05vdEFOdW1iZXIodmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVtYmVyKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5Ob3RBTnVtYmVyKFwiVmFsdWUgXCIgKyB2YWx1ZSArIFwiIGlzIG5vdCBhIG51bWJlclwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGhyb3dJZk9wdGlvbnNJbnZhbGlkKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKG5vdFNldChvcHRpb25zKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5PcHRpb25zTm90RGVmaW5lZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChub3RTZXQob3B0aW9ucy5sZW5ndGgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk1heE5vdFNwZWNpZmllZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRocm93SWZWYWx1ZUlzTm90QU51bWJlcihvcHRpb25zLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGhyb3dJZlZhbHVlSXNOb3RBU3RyaW5nKHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNTdHJpbmcoc3RyaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5Ob3RBU3RyaW5nKFwiVmFsdWUgXCIgKyBzdHJpbmcgKyBcIiBpcyBub3QgYSBzdHJpbmdcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudmFsaWRhdGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhyb3dJZk9wdGlvbnNJbnZhbGlkKHNlbGYub3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGlmIChub3RTZXQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3dJZlZhbHVlSXNOb3RBU3RyaW5nKHZhbHVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA+PSBzZWxmLm9wdGlvbnMubGVuZ3RoO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuXHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWxpZGF0aW9uXCIsIHtcclxuICAgIG5vdE51bGw6IEJpZnJvc3QudmFsaWRhdGlvbi5SdWxlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gIShCaWZyb3N0LmlzVW5kZWZpbmVkKHZhbHVlKSB8fCBCaWZyb3N0LmlzTnVsbCh2YWx1ZSkpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuXHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWxpZGF0aW9uXCIsIHtcclxuICAgIHJhbmdlOiBCaWZyb3N0LnZhbGlkYXRpb24uUnVsZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbm90U2V0KHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBCaWZyb3N0LmlzVW5kZWZpbmVkKHZhbHVlKSB8fCBCaWZyb3N0LmlzTnVsbCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lmVmFsdWVJc05vdEFOdW1iZXIodmFsdWUsIHBhcmFtKSB7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bWJlcih2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uTm90QU51bWJlcihwYXJhbSArIFwiIHZhbHVlIFwiICsgdmFsdWUgKyBcIiBpcyBub3QgYSBudW1iZXJcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aHJvd0lmT3B0aW9uc0ludmFsaWQob3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAobm90U2V0KG9wdGlvbnMpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk9wdGlvbnNOb3REZWZpbmVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5vdFNldChvcHRpb25zLm1heCkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uTWF4Tm90U3BlY2lmaWVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5vdFNldChvcHRpb25zLm1pbikpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBCaWZyb3N0LnZhbGlkYXRpb24uTWluTm90U3BlY2lmaWVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3dJZlZhbHVlSXNOb3RBTnVtYmVyKG9wdGlvbnMubWluLCBcIm1pblwiKTtcclxuICAgICAgICAgICAgdGhyb3dJZlZhbHVlSXNOb3RBTnVtYmVyKG9wdGlvbnMubWF4LCBcIm1heFwiKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLnZhbGlkYXRlID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRocm93SWZPcHRpb25zSW52YWxpZChzZWxmLm9wdGlvbnMpO1xyXG4gICAgICAgICAgICBpZiAobm90U2V0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRocm93SWZWYWx1ZUlzTm90QU51bWJlcih2YWx1ZSwgXCJ2YWx1ZVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYub3B0aW9ucy5taW4gPD0gdmFsdWUgJiYgdmFsdWUgPD0gc2VsZi5vcHRpb25zLm1heDtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH0pXHJcbn0pO1xyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsaWRhdGlvblwiLCB7XHJcbiAgICByZWdleDogQmlmcm9zdC52YWxpZGF0aW9uLlJ1bGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG5vdFNldCh2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gQmlmcm9zdC5pc1VuZGVmaW5lZCh2YWx1ZSkgfHwgQmlmcm9zdC5pc051bGwodmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGhyb3dJZk9wdGlvbnNJbnZhbGlkKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKG5vdFNldChvcHRpb25zKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5PcHRpb25zTm90RGVmaW5lZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChub3RTZXQob3B0aW9ucy5leHByZXNzaW9uKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5NaXNzaW5nRXhwcmVzc2lvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc1N0cmluZyhvcHRpb25zLmV4cHJlc3Npb24pKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmlmcm9zdC52YWxpZGF0aW9uLk5vdEFTdHJpbmcoXCJFeHByZXNzaW9uIFwiICsgb3B0aW9ucy5leHByZXNzaW9uICsgXCIgaXMgbm90IGEgc3RyaW5nLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGhyb3dJZlZhbHVlSXNOb3RTdHJpbmcodmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzU3RyaW5nKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5Ob3RBU3RyaW5nKFwiVmFsdWUgXCIgKyB2YWx1ZSArIFwiIGlzIG5vdCBhIHN0cmluZy5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudmFsaWRhdGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhyb3dJZk9wdGlvbnNJbnZhbGlkKHNlbGYub3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGlmIChub3RTZXQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3dJZlZhbHVlSXNOb3RTdHJpbmcodmFsdWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gKHZhbHVlLm1hdGNoKHNlbGYub3B0aW9ucy5leHByZXNzaW9uKSA9PSBudWxsKSA/IGZhbHNlIDogdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcblxyXG5cclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbGlkYXRpb25cIiwge1xyXG4gICAgcmVxdWlyZWQ6IEJpZnJvc3QudmFsaWRhdGlvbi5SdWxlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gIShCaWZyb3N0LmlzVW5kZWZpbmVkKHZhbHVlKSB8fCBCaWZyb3N0LmlzTnVsbCh2YWx1ZSkgfHwgdmFsdWUgPT09IFwiXCIgfHwgdmFsdWUgPT09IDApO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuXHJcbiIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWxpZGF0aW9uXCIsIHtcclxuICAgIFJ1bGU6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHwgXCJcIjtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7fTtcclxuICAgICAgICBCaWZyb3N0LmV4dGVuZCh0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICB0aGlzLnZhbGlkYXRlID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsaWRhdGlvblwiKTtcclxuQmlmcm9zdC52YWxpZGF0aW9uLnJ1bGVIYW5kbGVycyA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gQmlmcm9zdC52YWxpZGF0aW9uLnJ1bGVIYW5kbGVycyB8fCB7IH07XHJcbn0pKCk7XHJcbiIsImlmICh0eXBlb2Yga28gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICBrby5leHRlbmRlcnMudmFsaWRhdGlvbiA9IGZ1bmN0aW9uICh0YXJnZXQsIG9wdGlvbnMpIHtcclxuICAgICAgICBCaWZyb3N0LnZhbGlkYXRpb24uVmFsaWRhdG9yLmFwcGx5VG8odGFyZ2V0LCBvcHRpb25zKTtcclxuICAgICAgICB0YXJnZXQuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICB0YXJnZXQudmFsaWRhdG9yLnZhbGlkYXRlKG5ld1ZhbHVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gVG9kbyA6IGxvb2sgaW50byBhZ2dyZXNzaXZlIHZhbGlkYXRpb25cclxuICAgICAgICAvL3RhcmdldC52YWxpZGF0b3IudmFsaWRhdGUodGFyZ2V0KCkpO1xyXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICB9O1xyXG59XHJcbiIsImlmICh0eXBlb2Yga28gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICBrby5iaW5kaW5nSGFuZGxlcnMudmFsaWRhdGlvbk1lc3NhZ2VGb3IgPSB7XHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzQWNjZXNzb3IsIHZpZXdNb2RlbCkge1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB2YWx1ZUFjY2Vzc29yKCk7XHJcbiAgICAgICAgICAgIHZhciB2YWxpZGF0b3IgPSB2YWx1ZS52YWxpZGF0b3I7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHZhbGlkYXRvcikpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFsaWRhdG9yLmlzVmFsaWQuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChlbGVtZW50KS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZWxlbWVudCkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAga28uYXBwbHlCaW5kaW5nc1RvTm9kZShlbGVtZW50LCB7IHRleHQ6IHZhbGlkYXRvci5tZXNzYWdlIH0sIHZhbGlkYXRvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSIsImlmICh0eXBlb2Yga28gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICBCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsaWRhdGlvblwiLCB7XHJcbiAgICAgICAgVmFsaWRhdGlvblN1bW1hcnk6IGZ1bmN0aW9uIChjb21tYW5kcywgY29udGFpbmVyRWxlbWVudCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZHMgPSBrby5vYnNlcnZhYmxlKGNvbW1hbmRzKTtcclxuICAgICAgICAgICAgdGhpcy5tZXNzYWdlcyA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XHJcbiAgICAgICAgICAgIHRoaXMuaGFzTWVzc2FnZXMgPSBrby5jb21wdXRlZChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWVzc2FnZXMoKS5sZW5ndGggPiAwO1xyXG4gICAgICAgICAgICB9LHNlbGYpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gYWdncmVnYXRlTWVzc2FnZXMoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYWN0dWFsTWVzc2FnZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIHNlbGYuY29tbWFuZHMoKS5mb3JFYWNoKGZ1bmN0aW9uIChjb21tYW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVud3JhcHBlZENvbW1hbmQgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGNvbW1hbmQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB1bndyYXBwZWRDb21tYW5kLnZhbGlkYXRvcnMoKS5mb3JFYWNoKGZ1bmN0aW9uICh2YWxpZGF0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF2YWxpZGF0b3IuaXNWYWxpZCgpICYmIHZhbGlkYXRvci5tZXNzYWdlKCkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3R1YWxNZXNzYWdlcy5wdXNoKHZhbGlkYXRvci5tZXNzYWdlKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHNlbGYubWVzc2FnZXMoYWN0dWFsTWVzc2FnZXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb21tYW5kcy5mb3JFYWNoKGZ1bmN0aW9uIChjb21tYW5kKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdW53cmFwcGVkQ29tbWFuZCA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoY29tbWFuZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdW53cmFwcGVkQ29tbWFuZC52YWxpZGF0b3JzKCkuZm9yRWFjaChmdW5jdGlvbiAodmFsaWRhdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yLm1lc3NhZ2Uuc3Vic2NyaWJlKGFnZ3JlZ2F0ZU1lc3NhZ2VzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBrby5iaW5kaW5nSGFuZGxlcnMudmFsaWRhdGlvblN1bW1hcnlGb3IgPSB7XHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzQWNjZXNzb3IsIHZpZXdNb2RlbCkge1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0ga28uYmluZGluZ0hhbmRsZXJzLnZhbGlkYXRpb25TdW1tYXJ5Rm9yLmdldFZhbHVlQXNBcnJheSh2YWx1ZUFjY2Vzc29yKTtcclxuICAgICAgICAgICAgdmFyIHZhbGlkYXRpb25TdW1tYXJ5ID0gbmV3IEJpZnJvc3QudmFsaWRhdGlvbi5WYWxpZGF0aW9uU3VtbWFyeSh0YXJnZXQpO1xyXG4gICAgICAgICAgICB2YXIgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodWwpO1xyXG4gICAgICAgICAgICB1bC5pbm5lckhUTUwgPSBcIjxsaT48c3BhbiBkYXRhLWJpbmQ9J3RleHQ6ICRkYXRhJz48L3NwYW4+PC9saT5cIjtcclxuXHJcbiAgICAgICAgICAgIGtvLnV0aWxzLmRvbURhdGEuc2V0KGVsZW1lbnQsICd2YWxpZGF0aW9uc3VtbWFyeScsIHZhbGlkYXRpb25TdW1tYXJ5KTtcclxuXHJcbiAgICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3NUb05vZGUoZWxlbWVudCwgeyB2aXNpYmxlOiB2YWxpZGF0aW9uU3VtbWFyeS5oYXNNZXNzYWdlcyB9LCB2YWxpZGF0aW9uU3VtbWFyeSk7XHJcbiAgICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3NUb05vZGUodWwsIHsgZm9yZWFjaDogdmFsaWRhdGlvblN1bW1hcnkubWVzc2FnZXMgfSwgdmFsaWRhdGlvblN1bW1hcnkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3Nvcikge1xyXG4gICAgICAgICAgICB2YXIgdmFsaWRhdGlvblN1bW1hcnkgPSBrby51dGlscy5kb21EYXRhLmdldChlbGVtZW50LCAndmFsaWRhdGlvbnN1bW1hcnknKTtcclxuICAgICAgICAgICAgdmFsaWRhdGlvblN1bW1hcnkuY29tbWFuZHMoa28uYmluZGluZ0hhbmRsZXJzLnZhbGlkYXRpb25TdW1tYXJ5Rm9yLmdldFZhbHVlQXNBcnJheSh2YWx1ZUFjY2Vzc29yKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRWYWx1ZUFzQXJyYXk6IGZ1bmN0aW9uICh2YWx1ZUFjY2Vzc29yKSB7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSk7XHJcbiAgICAgICAgICAgIGlmICghKEJpZnJvc3QuaXNBcnJheSh0YXJnZXQpKSkgeyB0YXJnZXQgPSBbdGFyZ2V0XTsgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsaWRhdGlvblwiKTtcclxuQmlmcm9zdC52YWxpZGF0aW9uLlZhbGlkYXRvciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBWYWxpZGF0b3Iob3B0aW9ucykge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmlzVmFsaWQgPSBrby5vYnNlcnZhYmxlKHRydWUpO1xyXG4gICAgICAgIHRoaXMubWVzc2FnZSA9IGtvLm9ic2VydmFibGUoXCJcIik7XHJcbiAgICAgICAgdGhpcy5ydWxlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaXNSZXF1aXJlZCA9IGZhbHNlO1xyXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgICAgICB0aGlzLnNldE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBzZXR1cFJ1bGUocnVsZVR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChydWxlVHlwZS5fbmFtZSA9PT0gcHJvcGVydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcnVsZSA9IHJ1bGVUeXBlLmNyZWF0ZSh7IG9wdGlvbnM6IG9wdGlvbnNbcHJvcGVydHldIHx8IHt9IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucnVsZXMucHVzaChydWxlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocnVsZVR5cGUuX25hbWUgPT09IFwicmVxdWlyZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaXNSZXF1aXJlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gb3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJ1bGVUeXBlcyA9IEJpZnJvc3QudmFsaWRhdGlvbi5SdWxlLmdldEV4dGVuZGVycygpO1xyXG4gICAgICAgICAgICAgICAgcnVsZVR5cGVzLnNvbWUoc2V0dXBSdWxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMudmFsaWRhdGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgc2VsZi5pc1ZhbGlkKHRydWUpO1xyXG4gICAgICAgICAgICBzZWxmLm1lc3NhZ2UoXCJcIik7XHJcbiAgICAgICAgICAgIHZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHNlbGYucnVsZXMuc29tZShmdW5jdGlvbihydWxlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJ1bGUudmFsaWRhdGUodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pc1ZhbGlkKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLm1lc3NhZ2UocnVsZS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pc1ZhbGlkKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYubWVzc2FnZShcIlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZVNpbGVudGx5ID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHNlbGYucnVsZXMuc29tZShmdW5jdGlvbiAocnVsZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFydWxlLnZhbGlkYXRlKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaXNWYWxpZChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaXNWYWxpZCh0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgdmFyIHZhbGlkYXRvciA9IG5ldyBWYWxpZGF0b3Iob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWxpZGF0b3I7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhcHBseVRvOiBmdW5jdGlvbiAoaXRlbU9ySXRlbXMsIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gYXBwbHlUb0l0ZW0oaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbGlkYXRvciA9IHNlbGYuY3JlYXRlKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgaXRlbS52YWxpZGF0b3IgPSB2YWxpZGF0b3I7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpdGVtT3JJdGVtcyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtT3JJdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGFwcGx5VG9JdGVtKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhcHBseVRvSXRlbShpdGVtT3JJdGVtcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGFwcGx5VG9Qcm9wZXJ0aWVzOiBmdW5jdGlvbiAoaXRlbSwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICB2YXIgaXRlbXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2goaXRlbVtwcm9wZXJ0eV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHlUbyhpdGVtcywgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSkoKTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbHVlc1wiLCB7XHJcbiAgICBCaW5kaW5nOiBCaWZyb3N0LnZhbHVlcy5WYWx1ZVByb3ZpZGVyLmV4dGVuZChmdW5jdGlvbiAoYmluZGluZ0NvbnRleHRNYW5hZ2VyKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZGVmYXVsdFByb3BlcnR5ID0gXCJwYXRoXCI7XHJcblxyXG4gICAgICAgIHRoaXMucGF0aCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5tb2RlID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvbnZlcnRlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5mb3JtYXQgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnByb3ZpZGUgPSBmdW5jdGlvbiAoY29uc3VtZXIpIHtcclxuXHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWx1ZXNcIiwge1xyXG4gICAgRGF0ZUZvcm1hdHRlcjogQmlmcm9zdC52YWx1ZXMuRm9ybWF0dGVyLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5zdXBwb3J0ZWRUeXBlID0gRGF0ZTtcclxuXHJcbiAgICAgICAgdGhpcy5mb3JtYXQgPSBmdW5jdGlvbiAodmFsdWUsIGZvcm1hdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUuZm9ybWF0KGZvcm1hdCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWx1ZXNcIiwge1xyXG4gICAgRGF0ZVR5cGVDb252ZXJ0ZXI6IEJpZnJvc3QudmFsdWVzLlR5cGVDb252ZXJ0ZXIuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnN1cHBvcnRlZFR5cGUgPSBEYXRlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBpc051bGwodGltZSkge1xyXG4gICAgICAgICAgICAvLyBUcmVhdCBzZXJpYWxpemF0aW9uIG9mIGRlZmF1bHQoRGF0ZVRpbWUpIGZyb20gc2VydmVyIGFzIG51bGwuXHJcbiAgICAgICAgICAgIHJldHVybiBCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHRpbWUpIHx8XHJcbiAgICAgICAgICAgICAgICAvLyBJU08gODYwMSBmb3JtYXRzIGZvciBkZWZhdWx0KERhdGVUaW1lKTpcclxuICAgICAgICAgICAgICAgIHRpbWUgPT09IFwiMDAwMS0wMS0wMVQwMDowMDowMFwiIHx8XHJcbiAgICAgICAgICAgICAgICB0aW1lID09PSBcIjAwMDEtMDEtMDFUMDA6MDA6MDBaXCIgfHxcclxuICAgICAgICAgICAgICAgIC8vIG5ldyBEYXRlKFwiMDAwMS0wMS0wMVQwMDowMDowMFwiKSBpbiBDaHJvbWUgYW5kIEZpcmVmb3g6XHJcbiAgICAgICAgICAgICAgICAodGltZSBpbnN0YW5jZW9mIERhdGUgJiYgdGltZS5nZXRUaW1lKCkgPT09IC02MjEzNTU5NjgwMDAwMCkgfHxcclxuICAgICAgICAgICAgICAgIC8vIG5ldyBEYXRlKFwiMDAwMS0wMS0wMVQwMDowMDowMFwiKSBvciBhbnkgb3RoZXIgaW52YWxpZCBkYXRlIGluIEludGVybmV0IEV4cGxvcmVyOlxyXG4gICAgICAgICAgICAgICAgKHRpbWUgaW5zdGFuY2VvZiBEYXRlICYmIGlzTmFOKHRpbWUuZ2V0VGltZSgpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbnZlcnRGcm9tID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmIChpc051bGwodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jb252ZXJ0VG8gPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmZvcm1hdChcInl5eXktTU0tZGRcIik7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWx1ZXNcIiwge1xyXG4gICAgRGVmYXVsdFZhbHVlQ29uc3VtZXI6IEJpZnJvc3QudmFsdWVzLlZhbHVlQ29uc3VtZXIuZXh0ZW5kKGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5KSB7XHJcbiAgICAgICAgdGhpcy5jb25zdW1lID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgdGFyZ2V0W3Byb3BlcnR5XSA9IHZhbHVlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsdWVzXCIsIHtcclxuICAgIEZvcm1hdHRlcjogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5zdXBwb3J0ZWRUeXBlID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5mb3JtYXQgPSBmdW5jdGlvbiAodmFsdWUsIGZvcm1hdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWx1ZXNcIiwge1xyXG4gICAgTnVtYmVyVHlwZUNvbnZlcnRlcjogQmlmcm9zdC52YWx1ZXMuVHlwZUNvbnZlcnRlci5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhbGxvd2VkQ2hhcmFjdGVycyA9IFwiMDEyMzQ1Njc4OS4sLVwiO1xyXG5cclxuICAgICAgICB0aGlzLnN1cHBvcnRlZFR5cGUgPSBOdW1iZXI7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHN0cmlwTGV0dGVycyh2YWx1ZSkge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIHZhciByZXR1cm5WYWx1ZSA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBjaGFySW5kZXggPSAwOyBjaGFySW5kZXggPCB2YWx1ZS5sZW5ndGg7IGNoYXJJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZm91bmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGFsbG93ZWRDaGFySW5kZXggPSAwOyBhbGxvd2VkQ2hhckluZGV4IDwgYWxsb3dlZENoYXJhY3RlcnMubGVuZ3RoOyBhbGxvd2VkQ2hhckluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWVbY2hhckluZGV4XSA9PT0gYWxsb3dlZENoYXJhY3RlcnNbYWxsb3dlZENoYXJJbmRleF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSA9IHJldHVyblZhbHVlICsgdmFsdWVbY2hhckluZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbnZlcnRGcm9tID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gTnVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YWx1ZSA9IHN0cmlwTGV0dGVycyh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSAwO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUuaW5kZXhPZihcIi5cIikgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcGFyc2VGbG9hdCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBwYXJzZUludCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbHVlc1wiLCB7XHJcbiAgICBzdHJpbmdGb3JtYXR0ZXI6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZm9ybWF0dGVyVHlwZXMgPSBCaWZyb3N0LnZhbHVlcy5Gb3JtYXR0ZXIuZ2V0RXh0ZW5kZXJzKCk7XHJcbiAgICAgICAgdmFyIGZvcm1hdHRlcnNCeVR5cGUgPSB7fTtcclxuXHJcbiAgICAgICAgZm9ybWF0dGVyVHlwZXMuZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgICAgICB2YXIgZm9ybWF0dGVyID0gdHlwZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgZm9ybWF0dGVyc0J5VHlwZVtmb3JtYXR0ZXIuc3VwcG9ydGVkVHlwZV0gPSBmb3JtYXR0ZXI7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldEZvcm1hdChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50Lm5vZGVUeXBlICE9PSAxIHx8IEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoZWxlbWVudC5hdHRyaWJ1dGVzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHN0cmluZ0Zvcm1hdEF0dHJpYnV0ZSA9IGVsZW1lbnQuYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oXCJkYXRhLXN0cmluZ2Zvcm1hdFwiKTtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHN0cmluZ0Zvcm1hdEF0dHJpYnV0ZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdHJpbmdGb3JtYXRBdHRyaWJ1dGUudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5oYXNGb3JtYXQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICB2YXIgZm9ybWF0ID0gZ2V0Rm9ybWF0KGVsZW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0ICE9PSBudWxsO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZm9ybWF0ID0gZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhciBmb3JtYXQgPSBnZXRGb3JtYXQoZWxlbWVudCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZm9ybWF0dGVyc0J5VHlwZS5oYXNPd25Qcm9wZXJ0eSh2YWx1ZS5jb25zdHJ1Y3RvcikpIHtcclxuICAgICAgICAgICAgICAgIHZhciBmb3JtYXR0ZXIgPSBmb3JtYXR0ZXJzQnlUeXBlW3ZhbHVlLmNvbnN0cnVjdG9yXTtcclxuICAgICAgICAgICAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJ7KC5bXnt9XSkqfVwiLCBcImdcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZm9ybWF0LnJlcGxhY2UocmVnZXgsIGZ1bmN0aW9uIChmb3JtYXRFeHByZXNzaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGV4cHJlc3Npb24gPSBmb3JtYXRFeHByZXNzaW9uLnN1YnN0cigxLCBmb3JtYXRFeHByZXNzaW9uLmxlbmd0aCAtIDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXR0ZXIuZm9ybWF0KHZhbHVlLCBleHByZXNzaW9uKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdDtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbHVlc1wiLCB7XHJcbiAgICBTdHJpbmdUeXBlQ29udmVydGVyOiBCaWZyb3N0LnZhbHVlcy5UeXBlQ29udmVydGVyLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5zdXBwb3J0ZWRUeXBlID0gU3RyaW5nO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnZlcnRGcm9tID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsdWVzXCIsIHtcclxuICAgIFR5cGVDb252ZXJ0ZXI6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuc3VwcG9ydGVkVHlwZSA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuY29udmVydEZyb20gPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY29udmVydFRvID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbHVlc1wiLCB7XHJcbiAgICB0eXBlQ29udmVydGVyczogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBjb252ZXJ0ZXJzQnlUeXBlID0ge307XHJcblxyXG4gICAgICAgIHZhciB0eXBlQ29udmVydGVyVHlwZXMgPSBCaWZyb3N0LnZhbHVlcy5UeXBlQ29udmVydGVyLmdldEV4dGVuZGVycygpO1xyXG4gICAgICAgIHR5cGVDb252ZXJ0ZXJUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgIHZhciBjb252ZXJ0ZXIgPSB0eXBlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICBjb252ZXJ0ZXJzQnlUeXBlW2NvbnZlcnRlci5zdXBwb3J0ZWRUeXBlXSA9IGNvbnZlcnRlcjtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb252ZXJ0RnJvbSA9IGZ1bmN0aW9uICh2YWx1ZSwgdHlwZSkge1xyXG4gICAgICAgICAgICB2YXIgYWN0dWFsVHlwZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzU3RyaW5nKHR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICBhY3R1YWxUeXBlID0gZXZhbCh0eXBlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFjdHVhbFR5cGUgPSB0eXBlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb252ZXJ0ZXJzQnlUeXBlLmhhc093blByb3BlcnR5KGFjdHVhbFR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udmVydGVyc0J5VHlwZVthY3R1YWxUeXBlXS5jb252ZXJ0RnJvbSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNvbnZlcnRUbyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKHZhciBjb252ZXJ0ZXIgaW4gY29udmVydGVyc0J5VHlwZSkge1xyXG4gICAgICAgICAgICAgICAgLyoganNoaW50IGVxZXFlcTogZmFsc2UgKi9cclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5jb25zdHJ1Y3RvciA9PSBjb252ZXJ0ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udmVydGVyc0J5VHlwZVtjb252ZXJ0ZXJdLmNvbnZlcnRUbyh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIudHlwZXMudHlwZUNvbnZlcnRlcnMgPSBCaWZyb3N0LnZhbHVlcy50eXBlQ29udmVydGVycztcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbHVlc1wiLCB7XHJcbiAgICB0eXBlRXh0ZW5kZXI6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmV4dGVuZCA9IGZ1bmN0aW9uICh0YXJnZXQsIHR5cGVBc1N0cmluZykge1xyXG4gICAgICAgICAgICB0YXJnZXQuX3R5cGVBc1N0cmluZyA9IHR5cGVBc1N0cmluZztcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbmtvLmV4dGVuZGVycy50eXBlID0gQmlmcm9zdC52YWx1ZXMudHlwZUV4dGVuZGVyLmNyZWF0ZSgpLmV4dGVuZDtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbHVlc1wiLCB7XHJcbiAgICBWYWx1ZUNvbnN1bWVyOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5jYW5Ob3RpZnlDaGFuZ2VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25zdW1lID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbHVlc1wiLCB7XHJcbiAgICB2YWx1ZUNvbnN1bWVyczogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB0aGlzLmdldEZvciA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgcHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciBjb25zdW1lciA9IEJpZnJvc3QudmFsdWVzLkRlZmF1bHRWYWx1ZUNvbnN1bWVyLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IGluc3RhbmNlLFxyXG4gICAgICAgICAgICAgICAgcHJvcGVydHk6IHByb3BlcnR5TmFtZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbnN1bWVyO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIudHlwZXMudmFsdWVDb25zdW1lcnMgPSBCaWZyb3N0LnZhbHVlcy52YWx1ZUNvbnN1bWVyczsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3QudmFsdWVzXCIsIHtcclxuICAgIHZhbHVlUGlwZWxpbmU6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICh0eXBlQ29udmVydGVycywgc3RyaW5nRm9ybWF0dGVyKSB7XHJcbiAgICAgICAgdGhpcy5nZXRWYWx1ZUZvclZpZXcgPSBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGFjdHVhbFZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGFjdHVhbFZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgcmV0dXJuVmFsdWUgPSBhY3R1YWxWYWx1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzdHJpbmdGb3JtYXR0ZXIuaGFzRm9ybWF0KGVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSA9IHN0cmluZ0Zvcm1hdHRlci5mb3JtYXQoZWxlbWVudCwgYWN0dWFsVmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHZhbHVlLl90eXBlQXNTdHJpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSB0eXBlQ29udmVydGVycy5jb252ZXJ0VG8oYWN0dWFsVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldFZhbHVlRm9yUHJvcGVydHkgPSBmdW5jdGlvbiAocHJvcGVydHksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChwcm9wZXJ0eS5fdHlwZUFzU3RyaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0eXBlQ29udmVydGVycy5jb252ZXJ0RnJvbSh2YWx1ZSwgcHJvcGVydHkuX3R5cGVBc1N0cmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHZhbHVlUGlwZWxpbmUgPSBCaWZyb3N0LnZhbHVlcy52YWx1ZVBpcGVsaW5lLmNyZWF0ZSgpO1xyXG5cclxuICAgIHZhciBvbGRSZWFkVmFsdWUgPSBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZTtcclxuICAgIGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICB2YXIgdmFsdWUgPSBvbGRSZWFkVmFsdWUoZWxlbWVudCk7XHJcblxyXG4gICAgICAgIHZhciBiaW5kaW5ncyA9IGtvLmJpbmRpbmdQcm92aWRlci5pbnN0YW5jZS5nZXRCaW5kaW5ncyhlbGVtZW50LCBrby5jb250ZXh0Rm9yKGVsZW1lbnQpKTtcclxuICAgICAgICBpZiAoQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChiaW5kaW5ncykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcmVzdWx0ID0gdmFsdWVQaXBlbGluZS5nZXRWYWx1ZUZvclByb3BlcnR5KGJpbmRpbmdzLnZhbHVlLCB2YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIG9sZFdyaXRlVmFsdWUgPSBrby5zZWxlY3RFeHRlbnNpb25zLndyaXRlVmFsdWU7XHJcbiAgICBrby5zZWxlY3RFeHRlbnNpb25zLndyaXRlVmFsdWUgPSBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWUsIGFsbG93VW5zZXQpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gdmFsdWU7XHJcbiAgICAgICAgdmFyIGJpbmRpbmdzID0ga28uYmluZGluZ1Byb3ZpZGVyLmluc3RhbmNlLmdldEJpbmRpbmdzKGVsZW1lbnQsIGtvLmNvbnRleHRGb3IoZWxlbWVudCkpO1xyXG4gICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChiaW5kaW5ncykpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZVBpcGVsaW5lLmdldFZhbHVlRm9yVmlldyhlbGVtZW50LCBiaW5kaW5ncy52YWx1ZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvbGRXcml0ZVZhbHVlKGVsZW1lbnQsIHJlc3VsdCwgYWxsb3dVbnNldCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBvbGRTZXRUZXh0Q29udGVudCA9IGtvLnV0aWxzLnNldFRleHRDb250ZW50O1xyXG4gICAga28udXRpbHMuc2V0VGV4dENvbnRlbnQgPSBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWUpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gdmFsdWVQaXBlbGluZS5nZXRWYWx1ZUZvclZpZXcoZWxlbWVudCwgdmFsdWUpO1xyXG4gICAgICAgIG9sZFNldFRleHRDb250ZW50KGVsZW1lbnQsIHJlc3VsdCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBvbGRTZXRIdG1sID0ga28udXRpbHMuc2V0SHRtbDtcclxuICAgIGtvLnV0aWxzLnNldEh0bWwgPSBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWUpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gdmFsdWVQaXBlbGluZS5nZXRWYWx1ZUZvclZpZXcoZWxlbWVudCwgdmFsdWUpO1xyXG4gICAgICAgIG9sZFNldEh0bWwoZWxlbWVudCwgcmVzdWx0KTtcclxuICAgIH07XHJcbn0pKCk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZhbHVlc1wiLCB7XHJcbiAgICBWYWx1ZVByb3ZpZGVyOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5kZWZhdWx0UHJvcGVydHkgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnByb3ZpZGUgPSBmdW5jdGlvbiAoY29uc3VtZXIpIHtcclxuXHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52YWx1ZXNcIiwge1xyXG4gICAgdmFsdWVQcm92aWRlcnM6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5pc0tub3duID0gZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZVByb3ZpZGVycyA9IEJpZnJvc3QudmFsdWVzLlZhbHVlUHJvdmlkZXIuZ2V0RXh0ZW5kZXJzKCk7XHJcbiAgICAgICAgICAgIHZhbHVlUHJvdmlkZXJzLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlUHJvdmlkZXJUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVQcm92aWRlclR5cGUuX25hbWUudG9Mb3dlckNhc2UoKSA9PT0gbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZm91bmQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRJbnN0YW5jZU9mID0gZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gbnVsbDtcclxuICAgICAgICAgICAgdmFyIHZhbHVlUHJvdmlkZXJzID0gQmlmcm9zdC52YWx1ZXMuVmFsdWVQcm92aWRlci5nZXRFeHRlbmRlcnMoKTtcclxuICAgICAgICAgICAgdmFsdWVQcm92aWRlcnMuZm9yRWFjaChmdW5jdGlvbiAodmFsdWVQcm92aWRlclR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZVByb3ZpZGVyVHlwZS5fbmFtZS50b0xvd2VyQ2FzZSgpID09PSBuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UgPSB2YWx1ZVByb3ZpZGVyVHlwZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy52YWx1ZVByb3ZpZGVycyA9IEJpZnJvc3QudmFsdWVzLnZhbHVlUHJvdmlkZXJzOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICBDb21wb3NlVGFzazogQmlmcm9zdC50YXNrcy5UYXNrLmV4dGVuZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSBiYXNlIHRhc2sgdGhhdCByZXByZXNlbnRzIGFueXRoaW5nIHRoYXQgaXMgZXhlY3V0aW5nPC9zdW1tYXJ5PlxyXG4gICAgICAgIHRoaXMuZXhlY3V0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIENvbnRlbnQ6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICBEYXRhVmlld0F0dHJpYnV0ZUVsZW1lbnRWaXNpdG9yOiBCaWZyb3N0Lm1hcmt1cC5FbGVtZW50VmlzaXRvci5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMudmlzaXQgPSBmdW5jdGlvbiAoZWxlbWVudCwgYWN0aW9ucykge1xyXG5cclxuICAgICAgICAgICAgdmFyIGRhdGFWaWV3ID0gZWxlbWVudC5hdHRyaWJ1dGVzLmdldE5hbWVkSXRlbShcImRhdGEtdmlld1wiKTtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGRhdGFWaWV3KSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGFCaW5kU3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRhQmluZCA9IGVsZW1lbnQuYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oXCJkYXRhLWJpbmRcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoZGF0YUJpbmQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YUJpbmRTdHJpbmcgPSBkYXRhQmluZC52YWx1ZSArIFwiLCBcIjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YUJpbmQgPSBkb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGUoXCJkYXRhLWJpbmRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkYXRhQmluZC52YWx1ZSA9IGRhdGFCaW5kU3RyaW5nICsgXCJ2aWV3OiAnXCIgKyBkYXRhVmlldy52YWx1ZSArIFwiJ1wiO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyaWJ1dGVzLnNldE5hbWVkSXRlbShkYXRhQmluZCk7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmF0dHJpYnV0ZXMucmVtb3ZlTmFtZWRJdGVtKFwiZGF0YS12aWV3XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICBEYXRhVmlld01vZGVsRmlsZUF0dHJpYnV0ZUVsZW1lbnRWaXNpdG9yOiBCaWZyb3N0Lm1hcmt1cC5FbGVtZW50VmlzaXRvci5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMudmlzaXQgPSBmdW5jdGlvbiAoZWxlbWVudCwgYWN0aW9ucykge1xyXG5cclxuICAgICAgICAgICAgdmFyIGRhdGFWaWV3ID0gZWxlbWVudC5hdHRyaWJ1dGVzLmdldE5hbWVkSXRlbShcImRhdGEtdmlld21vZGVsLWZpbGVcIik7XHJcbiAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChkYXRhVmlldykpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRhQmluZFN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YUJpbmQgPSBlbGVtZW50LmF0dHJpYnV0ZXMuZ2V0TmFtZWRJdGVtKFwiZGF0YS1iaW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGRhdGFCaW5kKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFCaW5kU3RyaW5nID0gZGF0YUJpbmQudmFsdWUgKyBcIiwgXCI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFCaW5kID0gZG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKFwiZGF0YS1iaW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZGF0YUJpbmQudmFsdWUgPSBkYXRhQmluZFN0cmluZyArIFwidmlld01vZGVsOiAnXCIgKyBkYXRhVmlldy52YWx1ZSArIFwiJ1wiO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyaWJ1dGVzLnNldE5hbWVkSXRlbShkYXRhQmluZCk7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmF0dHJpYnV0ZXMucmVtb3ZlTmFtZWRJdGVtKFwiZGF0YS12aWV3bW9kZWwtZmlsZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgSXRlbXM6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICBNYXN0ZXJWaWV3TW9kZWw6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKGRvY3VtZW50U2VydmljZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZGVhY3RpdmF0ZVZpZXdNb2RlbCh2aWV3TW9kZWwpIHtcclxuICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHZpZXdNb2RlbCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzRnVuY3Rpb24odmlld01vZGVsLmRlYWN0aXZhdGVkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXdNb2RlbC5kZWFjdGl2YXRlZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlVmlld01vZGVsKHZpZXdNb2RlbCkge1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodmlld01vZGVsKSAmJiBCaWZyb3N0LmlzRnVuY3Rpb24odmlld01vZGVsLmFjdGl2YXRlZCkpIHtcclxuICAgICAgICAgICAgICAgIHZpZXdNb2RlbC5hY3RpdmF0ZWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2V0Rm9yID0gZnVuY3Rpb24gKGVsZW1lbnQsIHZpZXdNb2RlbCkge1xyXG4gICAgICAgICAgICB2YXIgZXhpc3RpbmdWaWV3TW9kZWwgPSBzZWxmLmdldEZvcihlbGVtZW50KTtcclxuICAgICAgICAgICAgaWYgKGV4aXN0aW5nVmlld01vZGVsICE9PSB2aWV3TW9kZWwpIHtcclxuICAgICAgICAgICAgICAgIGRlYWN0aXZhdGVWaWV3TW9kZWwoZXhpc3RpbmdWaWV3TW9kZWwpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IGRvY3VtZW50U2VydmljZS5nZXRWaWV3TW9kZWxOYW1lRm9yKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICBzZWxmW25hbWVdID0gdmlld01vZGVsO1xyXG5cclxuICAgICAgICAgICAgYWN0aXZhdGVWaWV3TW9kZWwodmlld01vZGVsKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdldEZvciA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gZG9jdW1lbnRTZXJ2aWNlLmdldFZpZXdNb2RlbE5hbWVGb3IoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZltuYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5jbGVhckZvciA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gZG9jdW1lbnRTZXJ2aWNlLmdldFZpZXdNb2RlbE5hbWVGb3IoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGlmICghc2VsZi5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgZGVhY3RpdmF0ZVZpZXdNb2RlbChzZWxmW25hbWVdKTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBzZWxmW25hbWVdO1xyXG4gICAgICAgICAgICAgICAgc2VsZltuYW1lXSA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmFwcGx5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBrby5hcHBseUJpbmRpbmdzKHNlbGYpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuYXBwbHlUbyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3Moc2VsZiwgZWxlbWVudCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICBQYXRoUmVzb2x2ZXI6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY2FuUmVzb2x2ZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBwYXRoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnJlc29sdmUgPSBmdW5jdGlvbiAoZWxlbWVudCwgcGF0aCkge1xyXG5cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIHBhdGhSZXNvbHZlcnM6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UmVzb2x2ZXJzKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzb2x2ZXJzID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIEJpZnJvc3Qudmlld3MucGF0aFJlc29sdmVycykge1xyXG4gICAgICAgICAgICAgICAgaWYgKEJpZnJvc3Qudmlld3MucGF0aFJlc29sdmVycy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBCaWZyb3N0LnZpZXdzLnBhdGhSZXNvbHZlcnNbcHJvcGVydHldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgdmFsdWUuY3JlYXRlID09PSBcImZ1bmN0aW9uXCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNvbHZlciA9IHZhbHVlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlc29sdmVyLmNhblJlc29sdmUgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZXJzLnB1c2gocmVzb2x2ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlcnM7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5jYW5SZXNvbHZlID0gZnVuY3Rpb24gKGVsZW1lbnQsIHBhdGgpIHtcclxuICAgICAgICAgICAgdmFyIHJlc29sdmVycyA9IGdldFJlc29sdmVycygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciByZXNvbHZlckluZGV4ID0gMDsgcmVzb2x2ZXJJbmRleCA8IHJlc29sdmVycy5sZW5ndGg7IHJlc29sdmVySW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc29sdmVyID0gcmVzb2x2ZXJzW3Jlc29sdmVySW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHJlc29sdmVyLmNhblJlc29sdmUoZWxlbWVudCwgcGF0aCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucmVzb2x2ZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBwYXRoKSB7XHJcbiAgICAgICAgICAgIHZhciByZXNvbHZlcnMgPSBnZXRSZXNvbHZlcnMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcmVzb2x2ZXJJbmRleCA9IDA7IHJlc29sdmVySW5kZXggPCByZXNvbHZlcnMubGVuZ3RoOyByZXNvbHZlckluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXNvbHZlciA9IHJlc29sdmVyc1tyZXNvbHZlckluZGV4XTtcclxuICAgICAgICAgICAgICAgIGlmIChyZXNvbHZlci5jYW5SZXNvbHZlKGVsZW1lbnQsIHBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVyLnJlc29sdmUoZWxlbWVudCwgcGF0aCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICBQb3N0QmluZGluZ1Zpc2l0b3I6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy52aXNpdCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcblxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgUmVnaW9uOiBmdW5jdGlvbihtZXNzZW5nZXJGYWN0b3J5LCBvcGVyYXRpb25zRmFjdG9yeSwgdGFza3NGYWN0b3J5KSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSByZWdpb24gaW4gdGhlIHZpc3VhbCBjb21wb3NpdGlvbiBvbiBhIHBhZ2U8L3N1bW1hcnk+XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJ2aWV3XCIgdHlwZT1cIm9ic2VydmFibGUgb2YgQmlmcm9zdC52aWV3cy5WaWV3XCI+T2JzZXJ2YWJsZSBob2xkaW5nIFZpZXcgZm9yIHRoZSBjb21wb3NpdGlvbjwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy52aWV3ID0ga28ub2JzZXJ2YWJsZSgpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJ2aWV3TW9kZWxcIiB0eXBlPVwiQmlmcm9zdC52aWV3cy5WaWV3TW9kZWxcIj5UaGUgVmlld01vZGVsIGFzc29jaWF0ZWQgd2l0aCB0aGUgdmlldzwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy52aWV3TW9kZWwgPSBudWxsO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJtZXNzZW5nZXJcIiB0eXBlPVwiQmlmcm9zdC5tZXNzYWdpbmcuTWVzc2VuZ2VyXCI+VGhlIG1lc3NlbmdlciBmb3IgdGhlIHJlZ2lvbjwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5tZXNzZW5nZXIgPSBtZXNzZW5nZXJGYWN0b3J5LmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJnbG9iYWxNZXNzZW5nZXJcIiB0eXBlPVwiQmlmcm9zdC5tZXNzYWdpbmcuTWVzc2VuZ2VyXCI+VGhlIGdsb2JhbCBtZXNzZW5nZXI8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuZ2xvYmFsTWVzc2VuZ2VyID0gbWVzc2VuZ2VyRmFjdG9yeS5nbG9iYWwoKTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwib3BlcmF0aW9uc1wiIHR5cGU9XCJCaWZyb3N0LmludGVyYWN0aW9uLk9wZXJhdGlvbnNcIj5PcGVyYXRpb25zIGZvciB0aGUgcmVnaW9uPC9maWVsZD5cclxuICAgICAgICB0aGlzLm9wZXJhdGlvbnMgPSBvcGVyYXRpb25zRmFjdG9yeS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwidGFza3NcIiB0eXBlPVwiQmlmcm9zdC50YXNrcy5UYXNrc1wiPlRhc2tzIGZvciB0aGUgcmVnaW9uPC9maWVsZD5cclxuICAgICAgICB0aGlzLnRhc2tzID0gdGFza3NGYWN0b3J5LmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJwYXJlbnRcIiB0eXBlPVwiQmlmcm9zdC52aWV3cy5SZWdpb25cIj5QYXJlbnQgcmVnaW9uLCBudWxsIGlmIHRoZXJlIGlzIG5vIHBhcmVudDwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJjaGlsZHJlblwiIHR5cGU9XCJCaWZyb3N0LnZpZXdzLlJlZ2lvbltdXCI+Q2hpbGQgcmVnaW9ucyB3aXRoaW4gdGhpcyByZWdpb248L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiY29tbWFuZHNcIiB0eXBlPVwib2JzZXJ2YWJsZUFycmF5XCI+QXJyYXkgb2YgY29tbWFuZHMgaW5zaWRlIHRoZSByZWdpb248L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuY29tbWFuZHMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiaXNDb21tYW5kUm9vdFwiIHR5cGU9XCJvYnNlcnZhYmxlXCI+V2hldGhlciB0aGlzIHJlZ2lvbiBpcyBhIGNvbW1hbmQgcm9vdC5cclxuICAgICAgICAvLy8gKGkuZSBkb2VzIG5vdCBidWJibGUgaXRzIGNvbW1hbmRzIHVwd2FyZHMpPC9maWVsZD5cclxuICAgICAgICB0aGlzLmlzQ29tbWFuZFJvb3QgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiYWdncmVnYXRlZENvbW1hbmRzXCIgdHlwZT1cIm9ic2VydmFibGVBcnJheVwiPlJlcHJlc2VudHMgYWxsIGNvbW1hbmRzIGluIHRoaXMgcmVnaW9uIGFuZCBhbnkgY2hpbGQgcmVnaW9uczwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5hZ2dyZWdhdGVkQ29tbWFuZHMgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBjb21tYW5kcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5jb21tYW5kcygpLmZvckVhY2goZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmRzLnB1c2goY29tbWFuZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5jaGlsZHJlbigpLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkUmVnaW9uKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNoaWxkUmVnaW9uLmlzQ29tbWFuZFJvb3QoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkUmVnaW9uLmFnZ3JlZ2F0ZWRDb21tYW5kcygpLmZvckVhY2goZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZHMucHVzaChjb21tYW5kKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21tYW5kcztcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRoaXNPckNoaWxkSGFzVGFza1R5cGUodGFza1R5cGUsIHByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGhhc1Rhc2sgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHNlbGYuY2hpbGRyZW4oKS5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZFJlZ2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZFJlZ2lvbltwcm9wZXJ0eU5hbWVdKCkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzVGFzayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnRhc2tzLmFsbCgpLmZvckVhY2goZnVuY3Rpb24gKHRhc2spIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGFzay5fdHlwZS50eXBlT2YodGFza1R5cGUpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc1Rhc2sgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBoYXNUYXNrO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aGlzT3JDaGlsZENvbW1hbmRIYXNQcm9wZXJ0eVNldFRvVHJ1ZShjb21tYW5kUHJvcGVydHlOYW1lLCBicmVha0lmVGhpc0hhc05vQ29tbWFuZHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpc1NldCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGNvbW1hbmRzID0gc2VsZi5hZ2dyZWdhdGVkQ29tbWFuZHMoKTtcclxuICAgICAgICAgICAgICAgIGlmIChicmVha0lmVGhpc0hhc05vQ29tbWFuZHMgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tbWFuZHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kcy5mb3JFYWNoKGZ1bmN0aW9uIChjb21tYW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbW1hbmRbY29tbWFuZFByb3BlcnR5TmFtZV0oKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNTZXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBpc1NldDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0aGlzT3JDaGlsZENvbW1hbmRIYXNQcm9wZXJ0eVNldFRvRmFsc2UoY29tbWFuZFByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGlzU2V0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGNvbW1hbmRzID0gc2VsZi5hZ2dyZWdhdGVkQ29tbWFuZHMoKTtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmRzLmZvckVhY2goZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tbWFuZFtjb21tYW5kUHJvcGVydHlOYW1lXSgpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzU2V0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBpc1NldDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJpc1ZhbGlkXCIgdHlwZT1cIm9ic2VydmFibGVcIj5JbmRpY2lhdGVzIHdldGhlciBvciBub3QgcmVnaW9uIG9yIGFueSBvZiBpdHMgY2hpbGQgcmVnaW9ucyBhcmUgaW4gYW4gaW52YWxpZCBzdGF0ZTwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5pc1ZhbGlkID0gdGhpc09yQ2hpbGRDb21tYW5kSGFzUHJvcGVydHlTZXRUb1RydWUoXCJpc1ZhbGlkXCIpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJjYW5Db21tYW5kc0V4ZWN1dGVcIiB0eXBlPVwib2JzZXJ2YWJsZVwiPkluZGljYXRlcyB3ZXRoZXIgb3Igbm90IHJlZ2lvbiBvciBhbnkgb2YgaXRzIGNoaWxkIHJlZ2lvbnMgY2FuIGV4ZWN1dGUgdGhlaXIgY29tbWFuZHM8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuY2FuQ29tbWFuZHNFeGVjdXRlID0gdGhpc09yQ2hpbGRDb21tYW5kSGFzUHJvcGVydHlTZXRUb1RydWUoXCJjYW5FeGVjdXRlXCIsIHRydWUpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJhcmVDb21tYW5kc0F1dGhvcml6ZWRcIiB0eXBlPVwib2JzZXJ2YWJsZVwiPkluZGljYXRlcyB3ZXRoZXIgb3Igbm90IHJlZ2lvbiBvciBhbnkgb2YgaXRzIGNoaWxkIHJlZ2lvbnMgaGF2ZSB0aGVpciBjb21tYW5kcyBhdXRob3JpemVkPC9maWVsZD5cclxuICAgICAgICB0aGlzLmFyZUNvbW1hbmRzQXV0aG9yaXplZCA9IHRoaXNPckNoaWxkQ29tbWFuZEhhc1Byb3BlcnR5U2V0VG9UcnVlKFwiaXNBdXRob3JpemVkXCIpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJhcmVDb21tYW5kc0F1dGhvcml6ZWRcIiB0eXBlPVwib2JzZXJ2YWJsZVwiPkluZGljYXRlcyB3ZXRoZXIgb3Igbm90IHJlZ2lvbiBvciBhbnkgb2YgaXRzIGNoaWxkIHJlZ2lvbnMgaGF2ZSB0aGVpciBjb21tYW5kcyBjaGFuZ2VkPC9maWVsZD5cclxuICAgICAgICB0aGlzLmNvbW1hbmRzSGF2ZUNoYW5nZXMgPSB0aGlzT3JDaGlsZENvbW1hbmRIYXNQcm9wZXJ0eVNldFRvRmFsc2UoXCJoYXNDaGFuZ2VzXCIpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJhcmVDb21tYW5kc0F1dGhvcml6ZWRcIiB0eXBlPVwib2JzZXJ2YWJsZVwiPkluZGljYXRlcyB3ZXRoZXIgb3Igbm90IHJlZ2lvbiBvciBhbnkgb2YgaXRzIGNoaWxkIHJlZ2lvbnMgaGF2ZSB0aGVpciBjb21tYW5kcyByZWFkeSB0byBleGVjdXRlPC9maWVsZD5cclxuICAgICAgICB0aGlzLmFyZUNvbW1hbmRzUmVhZHlUb0V4ZWN1dGUgPSB0aGlzT3JDaGlsZENvbW1hbmRIYXNQcm9wZXJ0eVNldFRvVHJ1ZShcImlzUmVhZHlUb0V4ZWN1dGVcIiwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cImFyZUNvbW1hbmRzQXV0aG9yaXplZFwiIHR5cGU9XCJvYnNlcnZhYmxlXCI+SW5kaWNhdGVzIHdldGhlciBvciBub3QgcmVnaW9uIG9yIGFueSBvZiBpdHMgY2hpbGQgcmVnaW9ucyBoYXZlIGNoYW5nZXMgaW4gdGhlaXIgY29tbWFuZHMgb3IgaGFzIGFueSBvcGVyYXRpb25zPC9maWVsZD5cclxuICAgICAgICB0aGlzLmhhc0NoYW5nZXMgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBjb21tYW5kc0hhdmVDaGFuZ2VzID0gc2VsZi5jb21tYW5kc0hhdmVDaGFuZ2VzKCk7XHJcblxyXG5cclxuICAgICAgICAgICAgdmFyIGNoaWxkcmVuSGFzQ2hhbmdlcyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBzZWxmLmNoaWxkcmVuKCkuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGRSZWdpb24pIHtcclxuICAgICAgICAgICAgICAgIGlmICghY2hpbGRSZWdpb24uaXNDb21tYW5kUm9vdCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkUmVnaW9uLmhhc0NoYW5nZXMoKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbkhhc0NoYW5nZXMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb21tYW5kc0hhdmVDaGFuZ2VzIHx8IChzZWxmLm9wZXJhdGlvbnMuc3RhdGVmdWwoKS5sZW5ndGggPiAwKSB8fCBjaGlsZHJlbkhhc0NoYW5nZXM7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vLyA8ZmllbGQgbmFtZT1cInZhbGlkYXRpb25NZXNzYWdlc1wiIHR5cGU9XCJvYnNlcnZhYmxlQXJyYXlcIj5Ib2xkcyB0aGUgcmVnaW9ucyBhbmQgYW55IG9mIGl0cyBjaGlsZCByZWdpb25zIHZhbGlkYXRpb24gbWVzc2FnZXM8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMudmFsaWRhdGlvbk1lc3NhZ2VzID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbWVzc2FnZXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjb21tYW5kcyA9IHNlbGYuYWdncmVnYXRlZENvbW1hbmRzKCk7XHJcbiAgICAgICAgICAgIGNvbW1hbmRzLmZvckVhY2goZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb21tYW5kLmlzVmFsaWQoKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kLnZhbGlkYXRvcnMoKS5mb3JFYWNoKGZ1bmN0aW9uICh2YWxpZGF0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkYXRvci5pc1ZhbGlkKCkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoKHZhbGlkYXRvci5tZXNzYWdlKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2VzO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJpc0V4ZWN1dGluZ1wiIHR5cGU9XCJvYnNlcnZhYmxlXCI+SW5kaWNpYXRlcyB3ZXRoZXIgb3Igbm90IGV4ZWN1dGlvbiB0YXNrcyBhcmUgYmVpbmcgcGVyZm9ybWVuZCBpbiB0aGlzIHJlZ2lvbiBvciBhbnkgb2YgaXRzIGNoaWxkIHJlZ2lvbnM8L2ZpZWxkPlxyXG4gICAgICAgIHRoaXMuaXNFeGVjdXRpbmcgPSB0aGlzT3JDaGlsZEhhc1Rhc2tUeXBlKEJpZnJvc3QudGFza3MuRXhlY3V0aW9uVGFzaywgXCJpc0V4ZWN1dGluZ1wiKTtcclxuXHJcbiAgICAgICAgLy8vIDxmaWVsZCBuYW1lPVwiaXNDb21wb3NpbmdcIiB0eXBlPVwib2JzZXJ2YWJsZVwiPkluZGljaWF0ZXMgd2V0aGVyIG9yIG5vdCBleGVjdXRpb24gdGFza3MgYXJlIGJlaW5nIHBlcmZvcm1lbmQgaW4gdGhpcyByZWdpb24gb3IgYW55IG9mIGl0cyBjaGlsZCByZWdpb25zPC9maWVsZD5cclxuICAgICAgICB0aGlzLmlzQ29tcG9zaW5nID0gdGhpc09yQ2hpbGRIYXNUYXNrVHlwZShCaWZyb3N0LnZpZXdzLkNvbXBvc2VUYXNrLCBcImlzQ29tcG9zaW5nXCIpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJpc0xvYWRpbmdcIiB0eXBlPVwib2JzZXJ2YWJsZVwiPkluZGljaWF0ZXMgd2V0aGVyIG9yIG5vdCBsb2FkaW5nIHRhc2tzIGFyZSBiZWluZyBwZXJmb3JtZW5kIGluIHRoaXMgcmVnaW9uIG9yIGFueSBvZiBpdHMgY2hpbGQgcmVnaW9uczwvZmllbGQ+XHJcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0aGlzT3JDaGlsZEhhc1Rhc2tUeXBlKEJpZnJvc3QudGFza3MuTG9hZFRhc2ssIFwiaXNMb2FkaW5nXCIpO1xyXG5cclxuICAgICAgICAvLy8gPGZpZWxkIG5hbWU9XCJpc0J1c3lcIiB0eXBlPVwib2JzZXJ2YWJsZVwiPkluZGljYXRlcyB3ZXRoZXIgb3Igbm90IHRhc2tzIGFyZSBiZWluZyBwZXJmb3JtZWQgaW4gdGhpcyByZWdpb24gb3IgYW55IG9mIGl0cyBjaGlsZCByZWdpb25zPC9maWVsZD5cclxuICAgICAgICB0aGlzLmlzQnVzeSA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGlzQnVzeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBzZWxmLmNoaWxkcmVuKCkuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGRSZWdpb24pIHtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZFJlZ2lvbi5pc0J1c3koKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzQnVzeSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWxmLnRhc2tzLmFsbCgpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGlzQnVzeSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBpc0J1c3k7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0pO1xyXG5CaWZyb3N0LnZpZXdzLlJlZ2lvbi5jdXJyZW50ID0gbnVsbDsiLCJCaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlcnMuUmVnaW9uID0ge1xyXG4gICAgY2FuUmVzb2x2ZTogZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgIHJldHVybiBuYW1lID09PSBcInJlZ2lvblwiO1xyXG4gICAgfSxcclxuXHJcbiAgICByZXNvbHZlOiBmdW5jdGlvbiAobmFtZXNwYWNlLCBuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIEJpZnJvc3Qudmlld3MuUmVnaW9uLmN1cnJlbnQ7XHJcbiAgICB9XHJcbn07IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIFJlZ2lvbkRlc2NyaXB0b3I6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZGVzY3JpYmUgPSBmdW5jdGlvbiAocmVnaW9uKSB7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QuZGVwZW5kZW5jeVJlc29sdmVycy5SZWdpb25EZXNjcmlwdG9yID0ge1xyXG4gICAgY2FuUmVzb2x2ZTogZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgIHJldHVybiBuYW1lID09PSBcIlJlZ2lvbkRlc2NyaXB0b3JcIjtcclxuICAgIH0sXHJcblxyXG4gICAgcmVzb2x2ZTogZnVuY3Rpb24gKG5hbWVzcGFjZSwgbmFtZSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGRlc2NyaWJlOiBmdW5jdGlvbiAoKSB7IH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59OyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICByZWdpb25EZXNjcmlwdG9yTWFuYWdlcjogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGEgbWFuYWdlciB0aGF0IGtub3dzIGhvdyB0byBtYW5hZ2UgcmVnaW9uIGRlc2NyaXB0b3JzPC9zdW1tYXJ5PlxyXG5cclxuICAgICAgICB0aGlzLmRlc2NyaWJlID0gZnVuY3Rpb24gKHZpZXcsIHJlZ2lvbikge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+RGVzY3JpYmUgYSBzcGVjaWZpYyByZWdpb24gcmVsYXRlZCB0byBhIHZpZXc8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cInZpZXdcIiB0eXBlPVwiQmlmcm9zdC52aWV3cy5WaWV3XCI+VmlldyByZWxhdGVkIHRvIHRoZSByZWdpb248L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJyZWdpb25cIiB0eXBlPVwiQmlmcm9zdC52aWV3cy5SZWdpb25cIj5SZWdpb24gdGhhdCBuZWVkcyB0byBiZSBkZXNjcmliZWQ8L3BhcmFtPlxyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHZhciBsb2NhbFBhdGggPSBCaWZyb3N0LlBhdGguZ2V0UGF0aFdpdGhvdXRGaWxlbmFtZSh2aWV3LnBhdGgpO1xyXG4gICAgICAgICAgICB2YXIgbmFtZXNwYWNlUGF0aCA9IEJpZnJvc3QubmFtZXNwYWNlTWFwcGVycy5tYXBQYXRoVG9OYW1lc3BhY2UobG9jYWxQYXRoKTtcclxuICAgICAgICAgICAgaWYgKG5hbWVzcGFjZVBhdGggIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5hbWVzcGFjZSA9IEJpZnJvc3QubmFtZXNwYWNlKG5hbWVzcGFjZVBhdGgpO1xyXG5cclxuICAgICAgICAgICAgICAgIEJpZnJvc3Qudmlld3MuUmVnaW9uLmN1cnJlbnQgPSByZWdpb247XHJcbiAgICAgICAgICAgICAgICBCaWZyb3N0LmRlcGVuZGVuY3lSZXNvbHZlci5iZWdpblJlc29sdmUobmFtZXNwYWNlLCBcIlJlZ2lvbkRlc2NyaXB0b3JcIikuY29udGludWVXaXRoKGZ1bmN0aW9uIChkZXNjcmlwdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRvci5kZXNjcmliZShyZWdpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKCk7XHJcbiAgICAgICAgICAgICAgICB9KS5vbkZhaWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5kZXNjcmliZVRvcExldmVsID0gZnVuY3Rpb24gKHJlZ2lvbikge1xyXG5cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIHJlZ2lvbk1hbmFnZXI6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uIChkb2N1bWVudFNlcnZpY2UsIHJlZ2lvbkRlc2NyaXB0b3JNYW5hZ2VyLCBtZXNzZW5nZXJGYWN0b3J5LCBvcGVyYXRpb25zRmFjdG9yeSwgdGFza3NGYWN0b3J5KSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSBtYW5hZ2VyIHRoYXQga25vd3MgaG93IHRvIGRlYWwgd2l0aCBSZWdpb25zIG9uIHRoZSBwYWdlPC9zdW1tYXJ5PlxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlUmVnaW9uSW5zdGFuY2UoKSB7XHJcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IG5ldyBCaWZyb3N0LnZpZXdzLlJlZ2lvbihtZXNzZW5nZXJGYWN0b3J5LCBvcGVyYXRpb25zRmFjdG9yeSwgdGFza3NGYWN0b3J5KTtcclxuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG1hbmFnZUluaGVyaXRhbmNlKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdmFyIHBhcmVudFJlZ2lvbiA9IGRvY3VtZW50U2VydmljZS5nZXRQYXJlbnRSZWdpb25Gb3IoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRSZWdpb24pIHtcclxuICAgICAgICAgICAgICAgIEJpZnJvc3Qudmlld3MuUmVnaW9uLnByb3RvdHlwZSA9IHBhcmVudFJlZ2lvbjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciB0b3BMZXZlbCA9IGNyZWF0ZVJlZ2lvbkluc3RhbmNlKCk7XHJcbiAgICAgICAgICAgICAgICByZWdpb25EZXNjcmlwdG9yTWFuYWdlci5kZXNjcmliZVRvcExldmVsKHRvcExldmVsKTtcclxuICAgICAgICAgICAgICAgIEJpZnJvc3Qudmlld3MuUmVnaW9uLnByb3RvdHlwZSA9IHRvcExldmVsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnRSZWdpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBtYW5hZ2VIaWVyYXJjaHkocGFyZW50UmVnaW9uKSB7XHJcbiAgICAgICAgICAgIHZhciByZWdpb24gPSBjcmVhdGVSZWdpb25JbnN0YW5jZSgpO1xyXG4gICAgICAgICAgICByZWdpb24ucGFyZW50ID0gcGFyZW50UmVnaW9uO1xyXG4gICAgICAgICAgICBpZiAocGFyZW50UmVnaW9uKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRSZWdpb24uY2hpbGRyZW4ucHVzaChyZWdpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZWdpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdldEZvciA9IGZ1bmN0aW9uICh2aWV3KSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5HZXRzIHRoZSByZWdpb24gZm9yIHRoZSBnaXZlbiB2aWV3IGFuZCBjcmVhdGVzIG9uZSBpZiBub25lIGV4aXN0PC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJ2aWV3XCIgdHlwZT1cIlZpZXdcIj5WaWV3IHRvIGdldCBhIHJlZ2lvbiBmb3I8L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHJldHVybnM+VGhlIHJlZ2lvbiBmb3IgdGhlIGVsZW1lbnQ8L3JldHVybnM+XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVnaW9uO1xyXG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IHZpZXcuZWxlbWVudDtcclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50U2VydmljZS5oYXNPd25SZWdpb24oZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgIHJlZ2lvbiA9IGRvY3VtZW50U2VydmljZS5nZXRSZWdpb25Gb3IoZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICByZWdpb24udmlldyh2aWV3KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZWdpb247XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBwYXJlbnRSZWdpb24gPSBtYW5hZ2VJbmhlcml0YW5jZShlbGVtZW50KTtcclxuICAgICAgICAgICAgcmVnaW9uID0gbWFuYWdlSGllcmFyY2h5KHBhcmVudFJlZ2lvbik7XHJcbiAgICAgICAgICAgIHJlZ2lvbi52aWV3KHZpZXcpO1xyXG4gICAgICAgICAgICBkb2N1bWVudFNlcnZpY2Uuc2V0UmVnaW9uT24oZWxlbWVudCwgcmVnaW9uKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZWdpb247XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5kZXNjcmliZSA9IGZ1bmN0aW9uICh2aWV3LCByZWdpb24pIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkRlc2NyaWJlcyBhIHJlZ2lvbiBmb3IgYSB2aWV3PC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJ2aWV3XCIgdHlwZT1cIlZpZXdcIj5WaWV3IHRvIGRlc2NyaWJlIHJlZ2lvbiBmb3I8L3BhcmFtPlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJyZWdpb25cIiB0eXBlPVwiUmVnaW9uXCI+UmVnaW9uIHRvIGRlc2NyaWJlIGZvcjwvcGFyYW0+XHJcbiAgICAgICAgICAgIC8vLyA8cmV0dXJucz5BIHByb21pc2UgdGhhdCBjYW4gYmUgY29udGludWVkIGZvciB3aGVuIHRoZSBkZXNjcmlwdGlvbiBpcyBkb25lPC9yZXR1cm5zPlxyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gdmlldy5lbGVtZW50O1xyXG5cclxuICAgICAgICAgICAgcmVnaW9uRGVzY3JpcHRvck1hbmFnZXIuZGVzY3JpYmUodmlldywgcmVnaW9uKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0Q3VycmVudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PkdldHMgdGhlIGN1cnJlbnQgcmVnaW9uPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICByZXR1cm4gQmlmcm9zdC52aWV3cy5SZWdpb24uY3VycmVudDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmV2aWN0ID0gZnVuY3Rpb24gKHJlZ2lvbikge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+RXZpY3QgYSByZWdpb24gZnJvbSB0aGUgcGFnZTwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwicmVnaW9uXCIgdHlwZT1cIkJpZnJvc3Qudmlld3MuUmVnaW9uXCI+UmVnaW9uIHRvIGV2aWN0PC9wYXJhbT5cclxuXHJcbiAgICAgICAgICAgIGlmIChyZWdpb24ucGFyZW50UmVnaW9uKSB7XHJcbiAgICAgICAgICAgICAgICByZWdpb24ucGFyZW50UmVnaW9uLmNoaWxkcmVuLnJlbW92ZShyZWdpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlZ2lvbi5wYXJlbnRSZWdpb24gPSBudWxsO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy5yZWdpb25NYW5hZ2VyID0gQmlmcm9zdC52aWV3cy5yZWdpb25NYW5hZ2U7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIFJlbGF0aXZlUGF0aFJlc29sdmVyOiBCaWZyb3N0LnZpZXdzLlBhdGhSZXNvbHZlci5leHRlbmQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY2FuUmVzb2x2ZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBwYXRoKSB7XHJcbiAgICAgICAgICAgIHZhciBjbG9zZXN0ID0gJChlbGVtZW50KS5jbG9zZXN0KFwiW2RhdGEtdmlld11cIik7XHJcbiAgICAgICAgICAgIGlmIChjbG9zZXN0Lmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZpZXcgPSAkKGNsb3Nlc3RbMF0pLnZpZXc7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnJlc29sdmUgPSBmdW5jdGlvbiAoZWxlbWVudCwgcGF0aCkge1xyXG4gICAgICAgICAgICB2YXIgY2xvc2VzdCA9ICQoZWxlbWVudCkuY2xvc2VzdChcIltkYXRhLXVyaW1hcHBlcl1cIik7XHJcbiAgICAgICAgICAgIGlmIChjbG9zZXN0Lmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hcHBlck5hbWUgPSAkKGNsb3Nlc3RbMF0pLmRhdGEoXCJ1cmltYXBwZXJcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC51cmlNYXBwZXJzW21hcHBlck5hbWVdLmhhc01hcHBpbmdGb3IocGF0aCkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQmlmcm9zdC51cmlNYXBwZXJzW21hcHBlck5hbWVdLnJlc29sdmUocGF0aCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIEJpZnJvc3QudXJpTWFwcGVycy5kZWZhdWx0LnJlc29sdmUocGF0aCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5pZiAodHlwZW9mIEJpZnJvc3Qudmlld3MucGF0aFJlc29sdmVycyAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgQmlmcm9zdC52aWV3cy5wYXRoUmVzb2x2ZXJzLlJlbGF0aXZlUGF0aFJlc29sdmVyID0gQmlmcm9zdC52aWV3cy5SZWxhdGl2ZVBhdGhSZXNvbHZlcjtcclxufSIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICBVSU1hbmFnZXI6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uKGRvY3VtZW50U2VydmljZSkge1xyXG4gICAgICAgIHZhciBlbGVtZW50VmlzaXRvclR5cGVzID0gQmlmcm9zdC5tYXJrdXAuRWxlbWVudFZpc2l0b3IuZ2V0RXh0ZW5kZXJzKCk7XHJcbiAgICAgICAgdmFyIGVsZW1lbnRWaXNpdG9ycyA9IFtdO1xyXG4gICAgICAgIHZhciBwb3N0QmluZGluZ1Zpc2l0b3JUeXBlcyA9IEJpZnJvc3Qudmlld3MuUG9zdEJpbmRpbmdWaXNpdG9yLmdldEV4dGVuZGVycygpO1xyXG4gICAgICAgIHZhciBwb3N0QmluZGluZ1Zpc2l0b3JzID0gW107XHJcblxyXG4gICAgICAgIGVsZW1lbnRWaXNpdG9yVHlwZXMuZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgICAgICBlbGVtZW50VmlzaXRvcnMucHVzaCh0eXBlLmNyZWF0ZSgpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcG9zdEJpbmRpbmdWaXNpdG9yVHlwZXMuZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgICAgICBwb3N0QmluZGluZ1Zpc2l0b3JzLnB1c2godHlwZS5jcmVhdGUoKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlID0gZnVuY3Rpb24gKHJvb3QpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnRTZXJ2aWNlLnRyYXZlcnNlT2JqZWN0cyhmdW5jdGlvbihlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50VmlzaXRvcnMuZm9yRWFjaChmdW5jdGlvbih2aXNpdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFjdGlvbnMgPSBCaWZyb3N0Lm1hcmt1cC5FbGVtZW50VmlzaXRvclJlc3VsdEFjdGlvbnMuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaXRvci52aXNpdChlbGVtZW50LCBhY3Rpb25zKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LCByb290KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZVBvc3RCaW5kaW5nID0gZnVuY3Rpb24gKHJvb3QpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnRTZXJ2aWNlLnRyYXZlcnNlT2JqZWN0cyhmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgcG9zdEJpbmRpbmdWaXNpdG9ycy5mb3JFYWNoKGZ1bmN0aW9uICh2aXNpdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaXRvci52aXNpdChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LCByb290KTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIudHlwZXMuVUlNYW5hZ2VyID0gQmlmcm9zdC52aWV3cy5VSU1hbmFnZXI7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIFVyaU1hcHBlclBhdGhSZXNvbHZlcjogQmlmcm9zdC52aWV3cy5QYXRoUmVzb2x2ZXIuZXh0ZW5kKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmNhblJlc29sdmUgPSBmdW5jdGlvbiAoZWxlbWVudCwgcGF0aCkge1xyXG4gICAgICAgICAgICB2YXIgY2xvc2VzdCA9ICQoZWxlbWVudCkuY2xvc2VzdChcIltkYXRhLXVyaW1hcHBlcl1cIik7XHJcbiAgICAgICAgICAgIGlmIChjbG9zZXN0Lmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hcHBlck5hbWUgPSAkKGNsb3Nlc3RbMF0pLmRhdGEoXCJ1cmltYXBwZXJcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC51cmlNYXBwZXJzW21hcHBlck5hbWVdLmhhc01hcHBpbmdGb3IocGF0aCkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gQmlmcm9zdC51cmlNYXBwZXJzLmRlZmF1bHQuaGFzTWFwcGluZ0ZvcihwYXRoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnJlc29sdmUgPSBmdW5jdGlvbiAoZWxlbWVudCwgcGF0aCkge1xyXG4gICAgICAgICAgICB2YXIgY2xvc2VzdCA9ICQoZWxlbWVudCkuY2xvc2VzdChcIltkYXRhLXVyaW1hcHBlcl1cIik7XHJcbiAgICAgICAgICAgIGlmIChjbG9zZXN0Lmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hcHBlck5hbWUgPSAkKGNsb3Nlc3RbMF0pLmRhdGEoXCJ1cmltYXBwZXJcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoQmlmcm9zdC51cmlNYXBwZXJzW21hcHBlck5hbWVdLmhhc01hcHBpbmdGb3IocGF0aCkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQmlmcm9zdC51cmlNYXBwZXJzW21hcHBlck5hbWVdLnJlc29sdmUocGF0aCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIEJpZnJvc3QudXJpTWFwcGVycy5kZWZhdWx0LnJlc29sdmUocGF0aCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5pZiAodHlwZW9mIEJpZnJvc3Qudmlld3MucGF0aFJlc29sdmVycyAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgQmlmcm9zdC52aWV3cy5wYXRoUmVzb2x2ZXJzLlVyaU1hcHBlclBhdGhSZXNvbHZlciA9IEJpZnJvc3Qudmlld3MuVXJpTWFwcGVyUGF0aFJlc29sdmVyO1xyXG59IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIFZpZXc6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKHZpZXdMb2FkZXIsIHZpZXdNb2RlbFR5cGVzLCB2aWV3TW9kZWxNYW5hZ2VyLCBwYXRoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xyXG4gICAgICAgIHRoaXMuY29udGVudCA9IFwiW0NPTlRFTlQgTk9UIExPQURFRF1cIjtcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudmlld01vZGVsVHlwZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy52aWV3TW9kZWxQYXRoID0gbnVsbDtcclxuICAgICAgICB0aGlzLnJlZ2lvbiA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZCA9IGZ1bmN0aW9uIChyZWdpb24pIHtcclxuICAgICAgICAgICAgc2VsZi5yZWdpb24gPSByZWdpb247XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gQmlmcm9zdC5leGVjdXRpb24uUHJvbWlzZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgc2VsZi52aWV3TW9kZWxQYXRoID0gdmlld01vZGVsTWFuYWdlci5nZXRWaWV3TW9kZWxQYXRoRm9yVmlldyhwYXRoKTtcclxuICAgICAgICAgICAgdmlld0xvYWRlci5sb2FkKHNlbGYucGF0aCwgcmVnaW9uKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKGh0bWwpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuY29udGVudCA9IGh0bWw7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnZpZXdNb2RlbFR5cGUgPSB2aWV3TW9kZWxUeXBlcy5nZXRWaWV3TW9kZWxUeXBlRm9yUGF0aChzZWxmLnZpZXdNb2RlbFBhdGgpO1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoc2VsZik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICB2aWV3QmluZGluZ0hhbmRsZXI6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKFZpZXdCaW5kaW5nSGFuZGxlclRlbXBsYXRlRW5naW5lLCBVSU1hbmFnZXIsIHZpZXdGYWN0b3J5LCB2aWV3TWFuYWdlciwgdmlld01vZGVsTWFuYWdlciwgZG9jdW1lbnRTZXJ2aWNlLCByZWdpb25NYW5hZ2VyLCBwYXRoUmVzb2x2ZXJzKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gbWFrZVRlbXBsYXRlVmFsdWVBY2Nlc3NvcihlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5nc0FjY2Vzc29yLCBiaW5kaW5nQ29udGV4dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZpZXdVcmkgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQudmlld1VyaSAhPT0gdmlld1VyaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2hpbGRyZW4uZm9yRWFjaChrby5yZW1vdmVOb2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC52aWV3TW9kZWwgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudmlldyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC50ZW1wbGF0ZVNvdXJjZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGVsZW1lbnQudmlld1VyaSA9IHZpZXdVcmk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHZpZXdNb2RlbCA9IGtvLm9ic2VydmFibGUoZWxlbWVudC52aWV3TW9kZWwpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZpZXdNb2RlbFBhcmFtZXRlcnMgPSBhbGxCaW5kaW5nc0FjY2Vzc29yKCkudmlld01vZGVsUGFyYW1ldGVycyB8fCB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGVFbmdpbmUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZpZXcgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlZ2lvbiA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodmlld1VyaSkgfHwgdmlld1VyaSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlRW5naW5lID0gbmV3IGtvLm5hdGl2ZVRlbXBsYXRlRW5naW5lKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlRW5naW5lID0gVmlld0JpbmRpbmdIYW5kbGVyVGVtcGxhdGVFbmdpbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFjdHVhbFBhdGggPSBwYXRoUmVzb2x2ZXJzLnJlc29sdmUoZWxlbWVudCwgdmlld1VyaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldyA9IHZpZXdGYWN0b3J5LmNyZWF0ZUZyb20oYWN0dWFsUGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgICByZWdpb24gPSByZWdpb25NYW5hZ2VyLmdldEZvcih2aWV3KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHZpZXdNb2RlbCxcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlRW5naW5lOiB0ZW1wbGF0ZUVuZ2luZSxcclxuICAgICAgICAgICAgICAgICAgICB2aWV3VXJpOiB2aWV3VXJpLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXdNb2RlbFBhcmFtZXRlcnM6IHZpZXdNb2RlbFBhcmFtZXRlcnMsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlldzogdmlldyxcclxuICAgICAgICAgICAgICAgICAgICByZWdpb246IHJlZ2lvblxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5nc0FjY2Vzc29yLCB2aWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBrby5iaW5kaW5nSGFuZGxlcnMudGVtcGxhdGUuaW5pdChlbGVtZW50LCBtYWtlVGVtcGxhdGVWYWx1ZUFjY2Vzc29yKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzQWNjZXNzb3IsIGJpbmRpbmdDb250ZXh0KSwgYWxsQmluZGluZ3NBY2Nlc3Nvciwgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3NBY2Nlc3Nvciwgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCkge1xyXG4gICAgICAgICAgICByZXR1cm4ga28uYmluZGluZ0hhbmRsZXJzLnRlbXBsYXRlLnVwZGF0ZShlbGVtZW50LCBtYWtlVGVtcGxhdGVWYWx1ZUFjY2Vzc29yKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzQWNjZXNzb3IsIGJpbmRpbmdDb250ZXh0KSwgYWxsQmluZGluZ3NBY2Nlc3Nvciwgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LnZpZXdzLnZpZXdCaW5kaW5nSGFuZGxlci5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xyXG4gICAga28uYmluZGluZ0hhbmRsZXJzLnZpZXcgPSBCaWZyb3N0LnZpZXdzLnZpZXdCaW5kaW5nSGFuZGxlci5jcmVhdGUoKTtcclxuICAgIGtvLmpzb25FeHByZXNzaW9uUmV3cml0aW5nLmJpbmRpbmdSZXdyaXRlVmFsaWRhdG9ycy52aWV3ID0gZmFsc2U7IC8vIENhbid0IHJld3JpdGUgY29udHJvbCBmbG93IGJpbmRpbmdzXHJcbiAgICBrby52aXJ0dWFsRWxlbWVudHMuYWxsb3dlZEJpbmRpbmdzLnZpZXcgPSB0cnVlO1xyXG59OyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICBWaWV3QmluZGluZ0hhbmRsZXJUZW1wbGF0ZUVuZ2luZTogQmlmcm9zdC5UeXBlLmV4dGVuZChmdW5jdGlvbiAodmlld01vZGVsTWFuYWdlciwgcmVnaW9uTWFuYWdlciwgVUlNYW5hZ2VyKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMucmVuZGVyVGVtcGxhdGUgPSBmdW5jdGlvbiAodGVtcGxhdGUsIGJpbmRpbmdDb250ZXh0LCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZVNvdXJjZTtcclxuICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQob3B0aW9ucy5lbGVtZW50LnRlbXBsYXRlU291cmNlKSkge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVTb3VyY2UgPSBCaWZyb3N0LnZpZXdzLlZpZXdCaW5kaW5nSGFuZGxlclRlbXBsYXRlU291cmNlLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlld1VyaTogb3B0aW9ucy52aWV3VXJpLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlZ2lvbjogb3B0aW9ucy5yZWdpb25cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5lbGVtZW50LnRlbXBsYXRlU291cmNlID0gdGVtcGxhdGVTb3VyY2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVNvdXJjZSA9IG9wdGlvbnMuZWxlbWVudC50ZW1wbGF0ZVNvdXJjZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQob3B0aW9ucy5lbGVtZW50LnZpZXcpKSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVNvdXJjZS5sb2FkRm9yKG9wdGlvbnMuZWxlbWVudCwgb3B0aW9ucy52aWV3LCBvcHRpb25zLnJlZ2lvbikuY29udGludWVXaXRoKGZ1bmN0aW9uICh2aWV3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5lbGVtZW50LnZpZXcgPSB2aWV3O1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZ2lvbk1hbmFnZXIuZGVzY3JpYmUob3B0aW9ucy52aWV3LCBvcHRpb25zLnJlZ2lvbikuY29udGludWVXaXRoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBiaXQgZG9kZ3ksIGJ1dCBjYW4ndCBmaW5kIGFueSB3YXkgYXJvdW5kIGl0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQdXQgYW4gZW1wdHkgb2JqZWN0IGZvciBkZXBlbmRlbmN5IGRldGVjdGlvbiAtIHdlIGRvbid0IHdhbnQgS25vY2tvdXQgdG8gYmUgb2JzZXJ2aW5nIGFueSBvYnNlcnZhYmxlcyBvbiBvdXIgdmlld01vZGVsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmJlZ2luKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh2aWV3LnZpZXdNb2RlbFR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZpZXdNb2RlbFBhcmFtZXRlcnMgPSBvcHRpb25zLnZpZXdNb2RlbFBhcmFtZXRlcnM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlld01vZGVsUGFyYW1ldGVycy5yZWdpb24gPSBvcHRpb25zLnJlZ2lvbjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UgPSB2aWV3LnZpZXdNb2RlbFR5cGUuY3JlYXRlKHZpZXdNb2RlbFBhcmFtZXRlcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZWxlbWVudC52aWV3TW9kZWwgPSBpbnN0YW5jZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmRhdGEoaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kaW5nQ29udGV4dC4kZGF0YSA9IGluc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZGF0YShpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZGluZ0NvbnRleHQuJGRhdGEgPSBpbnN0YW5jZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uZW5kKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBiaW5kaW5nQ29udGV4dC4kcm9vdCA9IGJpbmRpbmdDb250ZXh0LiRkYXRhO1xyXG4gICAgICAgICAgICB2YXIgcmVuZGVyZWRUZW1wbGF0ZVNvdXJjZSA9IHNlbGYucmVuZGVyVGVtcGxhdGVTb3VyY2UodGVtcGxhdGVTb3VyY2UsIGJpbmRpbmdDb250ZXh0LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIHJlbmRlcmVkVGVtcGxhdGVTb3VyY2UuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuY29uc3RydWN0b3IgIT09IFRleHQgJiYgZWxlbWVudC5jb25zdHJ1Y3RvciAhPT0gQ29tbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIFVJTWFuYWdlci5oYW5kbGUoZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZW5kZXJlZFRlbXBsYXRlU291cmNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgbmF0aXZlVGVtcGxhdGVFbmdpbmUgPSBuZXcga28ubmF0aXZlVGVtcGxhdGVFbmdpbmUoKTtcclxuICAgIHZhciBiYXNlQ3JlYXRlID0gQmlmcm9zdC52aWV3cy5WaWV3QmluZGluZ0hhbmRsZXJUZW1wbGF0ZUVuZ2luZS5jcmVhdGU7XHJcbiAgICBCaWZyb3N0LnZpZXdzLlZpZXdCaW5kaW5nSGFuZGxlclRlbXBsYXRlRW5naW5lLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaW5zdGFuY2UgPSBiYXNlQ3JlYXRlLmNhbGwoQmlmcm9zdC52aWV3cy5WaWV3QmluZGluZ0hhbmRsZXJUZW1wbGF0ZUVuZ2luZSwgYXJndW1lbnRzKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gbmF0aXZlVGVtcGxhdGVFbmdpbmUpIHtcclxuICAgICAgICAgICAgaWYgKCFpbnN0YW5jZS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlW3Byb3BlcnR5XSA9IG5hdGl2ZVRlbXBsYXRlRW5naW5lW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfTtcclxufSkoKTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIFZpZXdCaW5kaW5nSGFuZGxlclRlbXBsYXRlU291cmNlOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uICh2aWV3RmFjdG9yeSkge1xyXG4gICAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcclxuXHJcblxyXG4gICAgICAgIHRoaXMubG9hZEZvciA9IGZ1bmN0aW9uIChlbGVtZW50LCB2aWV3LCByZWdpb24pIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgdmlldy5sb2FkKHJlZ2lvbikuY29udGludWVXaXRoKGZ1bmN0aW9uIChsb2FkZWRWaWV3KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgICAgICB3cmFwcGVyLmlubmVySFRNTCA9IGxvYWRlZFZpZXcuY29udGVudDtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgY29udGVudCA9IHdyYXBwZXIuaW5uZXJIVE1MO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKGxvYWRlZFZpZXcudmlld01vZGVsVHlwZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChsb2FkZWRWaWV3KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQmlmcm9zdC52aWV3cy5SZWdpb24uY3VycmVudCA9IHJlZ2lvbjtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnZpZXdNb2RlbFR5cGUuZW5zdXJlKCkuY29udGludWVXaXRoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwobG9hZGVkVmlldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHsgfTtcclxuXHJcbiAgICAgICAgdGhpcy50ZXh0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgdmlld0ZhY3Rvcnk6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZUZyb20gPSBmdW5jdGlvbiAocGF0aCkge1xyXG4gICAgICAgICAgICB2YXIgdmlldyA9IEJpZnJvc3Qudmlld3MuVmlldy5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgcGF0aDogcGF0aFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHZpZXc7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pO1xyXG5CaWZyb3N0LldlbGxLbm93blR5cGVzRGVwZW5kZW5jeVJlc29sdmVyLnR5cGVzLnZpZXdGYWN0b3J5ID0gQmlmcm9zdC52aWV3cy52aWV3RmFjdG9yeTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgdmlld0xvYWRlcjogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24gKHZpZXdNb2RlbE1hbmFnZXIsIHRhc2tGYWN0b3J5LCBmaWxlRmFjdG9yeSwgcmVnaW9uTWFuYWdlcikge1xyXG4gICAgICAgIHRoaXMubG9hZCA9IGZ1bmN0aW9uIChwYXRoLHJlZ2lvbikge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZmlsZXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIHZhciB2aWV3RmlsZSA9IGZpbGVGYWN0b3J5LmNyZWF0ZShwYXRoLCBCaWZyb3N0LmlvLmZpbGVUeXBlLmh0bWwpO1xyXG4gICAgICAgICAgICBpZiAocGF0aC5pbmRleE9mKFwiP1wiKSA+IDApIHtcclxuICAgICAgICAgICAgICAgIHZpZXdGaWxlLnBhdGguZnVsbFBhdGggPSB2aWV3RmlsZS5wYXRoLmZ1bGxQYXRoICsgcGF0aC5zdWJzdHIocGF0aC5pbmRleE9mKFwiP1wiKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZmlsZXMucHVzaCh2aWV3RmlsZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdmlld01vZGVsUGF0aCA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICh2aWV3TW9kZWxNYW5hZ2VyLmhhc0ZvclZpZXcocGF0aCkpIHtcclxuICAgICAgICAgICAgICAgIHZpZXdNb2RlbFBhdGggPSB2aWV3TW9kZWxNYW5hZ2VyLmdldFZpZXdNb2RlbFBhdGhGb3JWaWV3KHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF2aWV3TW9kZWxNYW5hZ2VyLmlzTG9hZGVkKHZpZXdNb2RlbFBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZpZXdNb2RlbEZpbGUgPSBmaWxlRmFjdG9yeS5jcmVhdGUodmlld01vZGVsUGF0aCwgQmlmcm9zdC5pby5maWxlVHlwZS5qYXZhU2NyaXB0KTtcclxuICAgICAgICAgICAgICAgICAgICBmaWxlcy5wdXNoKHZpZXdNb2RlbEZpbGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgdGFzayA9IHRhc2tGYWN0b3J5LmNyZWF0ZVZpZXdMb2FkKGZpbGVzKTtcclxuICAgICAgICAgICAgcmVnaW9uLnRhc2tzLmV4ZWN1dGUodGFzaykuY29udGludWVXaXRoKGZ1bmN0aW9uICh2aWV3KSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbCh2aWV3KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIFZpZXdMb2FkVGFzazogQmlmcm9zdC52aWV3cy5Db21wb3NlVGFzay5leHRlbmQoZnVuY3Rpb24gKGZpbGVzLCBmaWxlTWFuYWdlcikge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5SZXByZXNlbnRzIGEgdGFzayBmb3IgbG9hZGluZyBmaWxlcyBhc3luY2hyb25vdXNseTwvc3VtbWFyeT5cclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmZpbGVzID0gW107XHJcbiAgICAgICAgZmlsZXMuZm9yRWFjaChmdW5jdGlvbiAoZmlsZSkge1xyXG4gICAgICAgICAgICBzZWxmLmZpbGVzLnB1c2goZmlsZS5wYXRoLmZ1bGxQYXRoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgICAgICBmaWxlTWFuYWdlci5sb2FkKGZpbGVzKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKGluc3RhbmNlcykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZpZXcgPSBpbnN0YW5jZXNbMF07XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbCh2aWV3KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgdmlld01hbmFnZXI6IEJpZnJvc3QuU2luZ2xldG9uKGZ1bmN0aW9uICh2aWV3RmFjdG9yeSwgcGF0aFJlc29sdmVycywgcmVnaW9uTWFuYWdlciwgVUlNYW5hZ2VyLCB2aWV3TW9kZWxNYW5hZ2VyLCB2aWV3TW9kZWxMb2FkZXIsIHZpZXdNb2RlbFR5cGVzLCBkb2N1bWVudFNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzZXRWaWV3TW9kZWxGb3JFbGVtZW50KGVsZW1lbnQsIHZpZXdNb2RlbCkge1xyXG4gICAgICAgICAgICB2aWV3TW9kZWxNYW5hZ2VyLm1hc3RlclZpZXdNb2RlbC5zZXRGb3IoZWxlbWVudCwgdmlld01vZGVsKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB2aWV3TW9kZWxOYW1lID0gZG9jdW1lbnRTZXJ2aWNlLmdldFZpZXdNb2RlbE5hbWVGb3IoZWxlbWVudCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZGF0YUJpbmRTdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICB2YXIgZGF0YUJpbmQgPSBlbGVtZW50LmF0dHJpYnV0ZXMuZ2V0TmFtZWRJdGVtKFwiZGF0YS1iaW5kXCIpO1xyXG4gICAgICAgICAgICBpZiAoIUJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQoZGF0YUJpbmQpKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhQmluZFN0cmluZyA9IGRhdGFCaW5kLnZhbHVlICsgXCIsIFwiO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGF0YUJpbmQgPSBkb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGUoXCJkYXRhLWJpbmRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGF0YUJpbmQudmFsdWUgPSBkYXRhQmluZFN0cmluZyArIFwidmlld01vZGVsOiAkcm9vdFsnXCIgKyB2aWV3TW9kZWxOYW1lICsgXCInXVwiO1xyXG4gICAgICAgICAgICBlbGVtZW50LmF0dHJpYnV0ZXMuc2V0TmFtZWRJdGVtKGRhdGFCaW5kKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUxhbmRpbmdQYWdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHZhciBib2R5ID0gZG9jdW1lbnQuYm9keTtcclxuICAgICAgICAgICAgaWYgKGJvZHkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHZhciBmaWxlID0gQmlmcm9zdC5QYXRoLmdldEZpbGVuYW1lV2l0aG91dEV4dGVuc2lvbihkb2N1bWVudC5sb2NhdGlvbi50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgIGlmIChmaWxlID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZSA9IFwiaW5kZXhcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocGF0aFJlc29sdmVycy5jYW5SZXNvbHZlKGJvZHksIGZpbGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFjdHVhbFBhdGggPSBwYXRoUmVzb2x2ZXJzLnJlc29sdmUoYm9keSwgZmlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZpZXcgPSB2aWV3RmFjdG9yeS5jcmVhdGVGcm9tKGFjdHVhbFBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuZWxlbWVudCA9IGJvZHk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5jb250ZW50ID0gYm9keS5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9keS52aWV3ID0gdmlldztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlZ2lvbiA9IHJlZ2lvbk1hbmFnZXIuZ2V0Rm9yKHZpZXcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZ2lvbk1hbmFnZXIuZGVzY3JpYmUodmlldywgcmVnaW9uKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmlld01vZGVsTWFuYWdlci5oYXNGb3JWaWV3KGFjdHVhbFBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmlld01vZGVsUGF0aCA9IHZpZXdNb2RlbE1hbmFnZXIuZ2V0Vmlld01vZGVsUGF0aEZvclZpZXcoYWN0dWFsUGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXZpZXdNb2RlbE1hbmFnZXIuaXNMb2FkZWQodmlld01vZGVsUGF0aCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3TW9kZWxMb2FkZXIubG9hZCh2aWV3TW9kZWxQYXRoLCByZWdpb24pLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAodmlld01vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZCh2aWV3TW9kZWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRWaWV3TW9kZWxGb3JFbGVtZW50KGJvZHksIHZpZXdNb2RlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlld01vZGVsVHlwZXMuYmVnaW5DcmVhdGVJbnN0YW5jZU9mVmlld01vZGVsKHZpZXdNb2RlbFBhdGgsIHJlZ2lvbikuY29udGludWVXaXRoKGZ1bmN0aW9uICh2aWV3TW9kZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHZpZXdNb2RlbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFZpZXdNb2RlbEZvckVsZW1lbnQoYm9keSwgdmlld01vZGVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBVSU1hbmFnZXIuaGFuZGxlKGJvZHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuYXR0YWNoID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgVUlNYW5hZ2VyLmhhbmRsZShlbGVtZW50KTtcclxuICAgICAgICAgICAgdmlld01vZGVsTWFuYWdlci5tYXN0ZXJWaWV3TW9kZWwuYXBwbHlUbyhlbGVtZW50KTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7XHJcbkJpZnJvc3QuV2VsbEtub3duVHlwZXNEZXBlbmRlbmN5UmVzb2x2ZXIudHlwZXMudmlld01hbmFnZXIgPSBCaWZyb3N0LnZpZXdzLnZpZXdNYW5hZ2VyOyIsIkJpZnJvc3QubmFtZXNwYWNlKFwiQmlmcm9zdC52aWV3c1wiLCB7XHJcbiAgICBWaWV3TW9kZWw6IEJpZnJvc3QuVHlwZS5leHRlbmQoZnVuY3Rpb24gKHJlZ2lvbikge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnRhcmdldFZpZXdNb2RlbCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5yZWdpb24gPSByZWdpb247XHJcblxyXG4gICAgICAgIHRoaXMuYWN0aXZhdGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHNlbGYudGFyZ2V0Vmlld01vZGVsLm9uQWN0aXZhdGVkID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYudGFyZ2V0Vmlld01vZGVsLm9uQWN0aXZhdGVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmRlYWN0aXZhdGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHNlbGYudGFyZ2V0Vmlld01vZGVsLm9uRGVhY3RpdmF0ZWQgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgc2VsZi50YXJnZXRWaWV3TW9kZWwub25EZWFjdGl2YXRlZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vbkNyZWF0ZWQgPSBmdW5jdGlvbiAobGFzdERlc2NlbmRhbnQpIHtcclxuICAgICAgICAgICAgc2VsZi50YXJnZXRWaWV3TW9kZWwgPSBsYXN0RGVzY2VuZGFudDtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIHZpZXdNb2RlbEJpbmRpbmdIYW5kbGVyOiBCaWZyb3N0LlR5cGUuZXh0ZW5kKGZ1bmN0aW9uKGRvY3VtZW50U2VydmljZSwgdmlld0ZhY3RvcnksIHZpZXdNb2RlbExvYWRlciwgdmlld01vZGVsTWFuYWdlciwgdmlld01vZGVsVHlwZXMsIHJlZ2lvbk1hbmFnZXIpIHtcclxuICAgICAgICB0aGlzLmluaXQgPSBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3NBY2Nlc3NvciwgcGFyZW50Vmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCkge1xyXG4gICAgICAgICAgICB2YXIgcGF0aCA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKTtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuX2lzTG9hZGluZyA9PT0gdHJ1ZSB8fCAoZWxlbWVudC5fdmlld01vZGVsUGF0aCA9PT0gcGF0aCAmJiAhQmlmcm9zdC5pc051bGxPclVuZGVmaW5lZChlbGVtZW50Ll92aWV3TW9kZWwpKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBlbGVtZW50Ll9pc0xvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICBlbGVtZW50Ll92aWV3TW9kZWxQYXRoID0gcGF0aDtcclxuXHJcbiAgICAgICAgICAgIHZhciB2aWV3UGF0aCA9IFwiL1wiO1xyXG5cclxuICAgICAgICAgICAgaWYoIGRvY3VtZW50U2VydmljZS5oYXNWaWV3RmlsZShlbGVtZW50KSApIHtcclxuICAgICAgICAgICAgICAgIHZpZXdQYXRoID0gZG9jdW1lbnRTZXJ2aWNlLmdldFZpZXdGaWxlRnJvbShlbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHZpZXcgPSB2aWV3RmFjdG9yeS5jcmVhdGVGcm9tKHZpZXdQYXRoKTtcclxuICAgICAgICAgICAgdmlldy5jb250ZW50ID0gZWxlbWVudC5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgIHZpZXcuZWxlbWVudCA9IGVsZW1lbnQ7XHJcblxyXG4gICAgICAgICAgICB2YXIgdmlld01vZGVsSW5zdGFuY2UgPSBrby5vYnNlcnZhYmxlKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVnaW9uID0gcmVnaW9uTWFuYWdlci5nZXRGb3Iodmlldyk7XHJcbiAgICAgICAgICAgIHJlZ2lvbk1hbmFnZXIuZGVzY3JpYmUodmlldyxyZWdpb24pLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmlld01vZGVsUGFyYW1ldGVycyA9IGFsbEJpbmRpbmdzQWNjZXNzb3IoKS52aWV3TW9kZWxQYXJhbWV0ZXJzIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgdmlld01vZGVsUGFyYW1ldGVycy5yZWdpb24gPSByZWdpb247XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHZpZXdNb2RlbFR5cGVzLmlzTG9hZGVkKHBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZpZXdNb2RlbFR5cGUgPSB2aWV3TW9kZWxUeXBlcy5nZXRWaWV3TW9kZWxUeXBlRm9yUGF0aChwYXRoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RSZWdpb24gPSBCaWZyb3N0LnZpZXdzLlJlZ2lvbi5jdXJyZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIEJpZnJvc3Qudmlld3MuUmVnaW9uLmN1cnJlbnQgPSByZWdpb247XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXdNb2RlbFR5cGUuYmVnaW5DcmVhdGUodmlld01vZGVsUGFyYW1ldGVycykuY29udGludWVXaXRoKGZ1bmN0aW9uICh2aWV3TW9kZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkQmluZGluZ0NvbnRleHQgPSBiaW5kaW5nQ29udGV4dC5jcmVhdGVDaGlsZENvbnRleHQodmlld01vZGVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRCaW5kaW5nQ29udGV4dC4kcm9vdCA9IHZpZXdNb2RlbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5fdmlld01vZGVsID0gdmlld01vZGVsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlld01vZGVsSW5zdGFuY2Uodmlld01vZGVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQmlmcm9zdC52aWV3cy5SZWdpb24uY3VycmVudCA9IGxhc3RSZWdpb247XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50Ll9pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9KS5vbkZhaWwoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkIG5vdCBjcmVhdGUgYW4gaW5zdGFuY2Ugb2YgJ1wiICsgdmlld01vZGVsVHlwZS5fbmFtZXNwYWNlLm5hbWUgKyBcIi5cIiArIHZpZXdNb2RlbFR5cGUuX25hbWUrXCIgLSBSZWFzb24gOiBcIitlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlld01vZGVsTG9hZGVyLmxvYWQocGF0aCwgcmVnaW9uLCB2aWV3TW9kZWxQYXJhbWV0ZXJzKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKHZpZXdNb2RlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGRCaW5kaW5nQ29udGV4dCA9IGJpbmRpbmdDb250ZXh0LmNyZWF0ZUNoaWxkQ29udGV4dCh2aWV3TW9kZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZEJpbmRpbmdDb250ZXh0LiRyb290ID0gdmlld01vZGVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50Ll92aWV3TW9kZWwgPSB2aWV3TW9kZWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3TW9kZWxJbnN0YW5jZSh2aWV3TW9kZWwpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5faXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGtvLmJpbmRpbmdIYW5kbGVycy53aXRoLmluaXQoZWxlbWVudCwgdmlld01vZGVsSW5zdGFuY2UsIGFsbEJpbmRpbmdzQWNjZXNzb3IsIHBhcmVudFZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC52aWV3cy52aWV3TW9kZWxCaW5kaW5nSGFuZGxlci5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xyXG4gICAga28uYmluZGluZ0hhbmRsZXJzLnZpZXdNb2RlbCA9IEJpZnJvc3Qudmlld3Mudmlld01vZGVsQmluZGluZ0hhbmRsZXIuY3JlYXRlKCk7XHJcbn07XHJcblxyXG4iLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgdmlld01vZGVsTG9hZGVyOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAodGFza0ZhY3RvcnksIGZpbGVGYWN0b3J5LCB2aWV3TW9kZWxUeXBlcykge1xyXG4gICAgICAgIHRoaXMubG9hZCA9IGZ1bmN0aW9uIChwYXRoLCByZWdpb24sIHZpZXdNb2RlbFBhcmFtZXRlcnMpIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB2YXIgZmlsZSA9IGZpbGVGYWN0b3J5LmNyZWF0ZShwYXRoLCBCaWZyb3N0LmlvLmZpbGVUeXBlLmphdmFTY3JpcHQpO1xyXG4gICAgICAgICAgICB2YXIgdGFzayA9IHRhc2tGYWN0b3J5LmNyZWF0ZVZpZXdNb2RlbExvYWQoW2ZpbGVdKTtcclxuICAgICAgICAgICAgcmVnaW9uLnRhc2tzLmV4ZWN1dGUodGFzaykuY29udGludWVXaXRoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZpZXdNb2RlbFR5cGVzLmJlZ2luQ3JlYXRlSW5zdGFuY2VPZlZpZXdNb2RlbChwYXRoLCByZWdpb24sIHZpZXdNb2RlbFBhcmFtZXRlcnMpLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTtcclxuIiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIFZpZXdNb2RlbExvYWRUYXNrOiBCaWZyb3N0LnZpZXdzLkNvbXBvc2VUYXNrLmV4dGVuZChmdW5jdGlvbiAoZmlsZXMsIGZpbGVNYW5hZ2VyKSB7XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlJlcHJlc2VudHMgYSB0YXNrIGZvciBsb2FkaW5nIHZpZXdNb2RlbHM8L3N1bW1hcnk+XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmZpbGVzID0gW107XHJcbiAgICAgICAgZmlsZXMuZm9yRWFjaChmdW5jdGlvbiAoZmlsZSkge1xyXG4gICAgICAgICAgICBzZWxmLmZpbGVzLnB1c2goZmlsZS5wYXRoLmZ1bGxQYXRoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IEJpZnJvc3QuZXhlY3V0aW9uLlByb21pc2UuY3JlYXRlKCk7XHJcblxyXG4gICAgICAgICAgICBmaWxlTWFuYWdlci5sb2FkKGZpbGVzKS5jb250aW51ZVdpdGgoZnVuY3Rpb24gKGluc3RhbmNlcykge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zaWduYWwoaW5zdGFuY2VzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG59KTsiLCJCaWZyb3N0Lm5hbWVzcGFjZShcIkJpZnJvc3Qudmlld3NcIiwge1xyXG4gICAgdmlld01vZGVsTWFuYWdlcjogQmlmcm9zdC5TaW5nbGV0b24oZnVuY3Rpb24oYXNzZXRzTWFuYWdlciwgZG9jdW1lbnRTZXJ2aWNlLCB2aWV3TW9kZWxMb2FkZXIsIHJlZ2lvbk1hbmFnZXIsIHRhc2tGYWN0b3J5LCB2aWV3RmFjdG9yeSwgTWFzdGVyVmlld01vZGVsKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuYXNzZXRzTWFuYWdlciA9IGFzc2V0c01hbmFnZXI7XHJcbiAgICAgICAgdGhpcy52aWV3TW9kZWxMb2FkZXIgPSB2aWV3TW9kZWxMb2FkZXI7XHJcbiAgICAgICAgdGhpcy5kb2N1bWVudFNlcnZpY2UgPSBkb2N1bWVudFNlcnZpY2U7XHJcblxyXG4gICAgICAgIHRoaXMubWFzdGVyVmlld01vZGVsID0gTWFzdGVyVmlld01vZGVsO1xyXG5cclxuICAgICAgICB0aGlzLmhhc0ZvclZpZXcgPSBmdW5jdGlvbiAodmlld1BhdGgpIHtcclxuICAgICAgICAgICAgdmFyIHNjcmlwdEZpbGUgPSBCaWZyb3N0LlBhdGguY2hhbmdlRXh0ZW5zaW9uKHZpZXdQYXRoLCBcImpzXCIpO1xyXG4gICAgICAgICAgICBzY3JpcHRGaWxlID0gQmlmcm9zdC5QYXRoLm1ha2VSZWxhdGl2ZShzY3JpcHRGaWxlKTtcclxuICAgICAgICAgICAgdmFyIGhhc1ZpZXdNb2RlbCA9IHNlbGYuYXNzZXRzTWFuYWdlci5oYXNTY3JpcHQoc2NyaXB0RmlsZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBoYXNWaWV3TW9kZWw7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRWaWV3TW9kZWxQYXRoRm9yVmlldyA9IGZ1bmN0aW9uICh2aWV3UGF0aCkge1xyXG4gICAgICAgICAgICB2YXIgc2NyaXB0RmlsZSA9IEJpZnJvc3QuUGF0aC5jaGFuZ2VFeHRlbnNpb24odmlld1BhdGgsIFwianNcIik7XHJcbiAgICAgICAgICAgIHJldHVybiBzY3JpcHRGaWxlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuaXNMb2FkZWQgPSBmdW5jdGlvbiAocGF0aCkge1xyXG4gICAgICAgICAgICB2YXIgbG9jYWxQYXRoID0gQmlmcm9zdC5QYXRoLmdldFBhdGhXaXRob3V0RmlsZW5hbWUocGF0aCk7XHJcbiAgICAgICAgICAgIHZhciBmaWxlbmFtZSA9IEJpZnJvc3QuUGF0aC5nZXRGaWxlbmFtZVdpdGhvdXRFeHRlbnNpb24ocGF0aCk7XHJcbiAgICAgICAgICAgIHZhciBuYW1lc3BhY2VQYXRoID0gQmlmcm9zdC5uYW1lc3BhY2VNYXBwZXJzLm1hcFBhdGhUb05hbWVzcGFjZShsb2NhbFBhdGgpO1xyXG4gICAgICAgICAgICBpZiAobmFtZXNwYWNlUGF0aCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmFtZXNwYWNlID0gQmlmcm9zdC5uYW1lc3BhY2UobmFtZXNwYWNlUGF0aCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGZpbGVuYW1lIGluIG5hbWVzcGFjZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxufSk7IiwiQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LnZpZXdzXCIsIHtcclxuICAgIHZpZXdNb2RlbFR5cGVzOiBCaWZyb3N0LlNpbmdsZXRvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXROYW1lc3BhY2VGcm9tKHBhdGgpIHtcclxuICAgICAgICAgICAgdmFyIGxvY2FsUGF0aCA9IEJpZnJvc3QuUGF0aC5nZXRQYXRoV2l0aG91dEZpbGVuYW1lKHBhdGgpO1xyXG4gICAgICAgICAgICB2YXIgbmFtZXNwYWNlUGF0aCA9IEJpZnJvc3QubmFtZXNwYWNlTWFwcGVycy5tYXBQYXRoVG9OYW1lc3BhY2UobG9jYWxQYXRoKTtcclxuICAgICAgICAgICAgaWYgKG5hbWVzcGFjZVBhdGggIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5hbWVzcGFjZSA9IEJpZnJvc3QubmFtZXNwYWNlKG5hbWVzcGFjZVBhdGgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5hbWVzcGFjZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFR5cGVOYW1lRnJvbShwYXRoKSB7XHJcbiAgICAgICAgICAgIHZhciBsb2NhbFBhdGggPSBCaWZyb3N0LlBhdGguZ2V0UGF0aFdpdGhvdXRGaWxlbmFtZShwYXRoKTtcclxuICAgICAgICAgICAgdmFyIGZpbGVuYW1lID0gQmlmcm9zdC5QYXRoLmdldEZpbGVuYW1lV2l0aG91dEV4dGVuc2lvbihwYXRoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbGVuYW1lO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMuaXNMb2FkZWQgPSBmdW5jdGlvbiAocGF0aCkge1xyXG4gICAgICAgICAgICB2YXIgbmFtZXNwYWNlID0gZ2V0TmFtZXNwYWNlRnJvbShwYXRoKTtcclxuICAgICAgICAgICAgaWYgKG5hbWVzcGFjZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHlwZW5hbWUgPSBnZXRUeXBlTmFtZUZyb20ocGF0aCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW5hbWUgaW4gbmFtZXNwYWNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRWaWV3TW9kZWxUeXBlRm9yUGF0aEltcGxlbWVudGF0aW9uKHBhdGgpIHtcclxuICAgICAgICAgICAgdmFyIG5hbWVzcGFjZSA9IGdldE5hbWVzcGFjZUZyb20ocGF0aCk7XHJcbiAgICAgICAgICAgIGlmIChuYW1lc3BhY2UgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHR5cGVuYW1lID0gZ2V0VHlwZU5hbWVGcm9tKHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNUeXBlKG5hbWVzcGFjZVt0eXBlbmFtZV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWVzcGFjZVt0eXBlbmFtZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5nZXRWaWV3TW9kZWxUeXBlRm9yUGF0aCA9IGZ1bmN0aW9uIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHZhciB0eXBlID0gZ2V0Vmlld01vZGVsVHlwZUZvclBhdGhJbXBsZW1lbnRhdGlvbihwYXRoKTtcclxuICAgICAgICAgICAgaWYgKEJpZnJvc3QuaXNOdWxsT3JVbmRlZmluZWQodHlwZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkZWVwUGF0aCA9IHBhdGgucmVwbGFjZShcIi5qc1wiLCBcIi9pbmRleC5qc1wiKTtcclxuICAgICAgICAgICAgICAgIHR5cGUgPSBnZXRWaWV3TW9kZWxUeXBlRm9yUGF0aEltcGxlbWVudGF0aW9uKGRlZXBQYXRoKTtcclxuICAgICAgICAgICAgICAgIGlmIChCaWZyb3N0LmlzTnVsbE9yVW5kZWZpbmVkKHR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVlcFBhdGggPSBwYXRoLnJlcGxhY2UoXCIuanNcIiwgXCIvSW5kZXguanNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0Vmlld01vZGVsVHlwZUZvclBhdGhJbXBsZW1lbnRhdGlvbihkZWVwUGF0aCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICB0aGlzLmJlZ2luQ3JlYXRlSW5zdGFuY2VPZlZpZXdNb2RlbCA9IGZ1bmN0aW9uIChwYXRoLCByZWdpb24sIHZpZXdNb2RlbFBhcmFtZXRlcnMpIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBCaWZyb3N0LmV4ZWN1dGlvbi5Qcm9taXNlLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHR5cGUgPSBzZWxmLmdldFZpZXdNb2RlbFR5cGVGb3JQYXRoKHBhdGgpO1xyXG4gICAgICAgICAgICBpZiAodHlwZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJldmlvdXNSZWdpb24gPSBCaWZyb3N0LnZpZXdzLlJlZ2lvbi5jdXJyZW50O1xyXG4gICAgICAgICAgICAgICAgQmlmcm9zdC52aWV3cy5SZWdpb24uY3VycmVudCA9IHJlZ2lvbjtcclxuXHJcbiAgICAgICAgICAgICAgICB2aWV3TW9kZWxQYXJhbWV0ZXJzID0gdmlld01vZGVsUGFyYW1ldGVycyB8fCB7fTtcclxuICAgICAgICAgICAgICAgIHZpZXdNb2RlbFBhcmFtZXRlcnMucmVnaW9uID0gcmVnaW9uO1xyXG5cclxuICAgICAgICAgICAgICAgIHR5cGUuYmVnaW5DcmVhdGUodmlld01vZGVsUGFyYW1ldGVycylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNvbnRpbnVlV2l0aChmdW5jdGlvbiAoaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2Uuc2lnbmFsKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSkub25GYWlsKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJWaWV3TW9kZWwgJ1wiICsgcGF0aCArIFwiJyBmYWlsZWQgaW5zdGFudGlhdGlvblwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVmlld01vZGVsICdcIiArIHBhdGggKyBcIicgZG9lcyBub3QgZXhpc3RcIik7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnNpZ25hbChudWxsKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9KVxyXG59KTtcclxuQmlmcm9zdC5XZWxsS25vd25UeXBlc0RlcGVuZGVuY3lSZXNvbHZlci50eXBlcy52aWV3TW9kZWxUeXBlcyA9IEJpZnJvc3Qudmlld3Mudmlld01vZGVsVHlwZXM7IiwidmFyIGdsb2JhbElkID0gMDtcclxuQmlmcm9zdC5uYW1lc3BhY2UoXCJCaWZyb3N0LmludGVyYWN0aW9uLnZpc3VhbFN0YXRlQWN0aW9uc1wiLCB7XHJcbiAgICBPcGFjaXR5OiBCaWZyb3N0LmludGVyYWN0aW9uLlZpc3VhbFN0YXRlQWN0aW9uLmV4dGVuZChmdW5jdGlvbiAoZG9jdW1lbnRTZXJ2aWNlKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gbnVsbDtcclxuICAgICAgICB2YXIgaWQgPSBkb2N1bWVudFNlcnZpY2UuZ2V0VW5pcXVlU3R5bGVOYW1lKFwib3BhY2l0eVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSBcIlwiO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplID0gZnVuY3Rpb24gKG5hbWluZ1Jvb3QpIHtcclxuICAgICAgICAgICAgZWxlbWVudCA9IG5hbWluZ1Jvb3QuZmluZChzZWxmLnRhcmdldCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vbkVudGVyID0gZnVuY3Rpb24gKG5hbWluZ1Jvb3QsIGR1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHBhcnNlRmxvYXQoc2VsZi52YWx1ZSk7XHJcbiAgICAgICAgICAgIGlmIChpc05hTih2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gMC4wO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgYWN0dWFsRHVyYXRpb24gPSBkdXJhdGlvbi50b3RhbE1pbGxpc2Vjb25kcygpIC8gMTAwMDtcclxuXHJcbiAgICAgICAgICAgIGRvY3VtZW50U2VydmljZS5hZGRTdHlsZShcIi5cIiArIGlkLCB7XHJcbiAgICAgICAgICAgICAgICBcIi13ZWJraXQtdHJhbnNpdGlvblwiOiBcIm9wYWNpdHkgXCIgKyBhY3R1YWxEdXJhdGlvbiArIFwicyBlYXNlLWluLW91dFwiLFxyXG4gICAgICAgICAgICAgICAgXCItbW96LXRyYW5zaXRpb25cIjogXCJvcGFjaXR5IFwiICsgYWN0dWFsRHVyYXRpb24gKyBcInMgZWFzZS1pbi1vdXRcIixcclxuICAgICAgICAgICAgICAgIFwiLW1zLXRyYW5zaXRpb25cIjogXCJvcGFjaXR5IFwiICsgYWN0dWFsRHVyYXRpb24gKyBcInMgZWFzZS1pbi1vdXRcIixcclxuICAgICAgICAgICAgICAgIFwiLW8tdHJhbnNpdGlvblwiOiBcIm9wYWNpdHkgXCIgKyBhY3R1YWxEdXJhdGlvbiArIFwicyBlYXNlLWluLW91dFwiLFxyXG4gICAgICAgICAgICAgICAgXCJ0cmFuc2l0aW9uXCI6IFwib3BhY2l0eSBcIiArIGFjdHVhbER1cmF0aW9uICsgXCJzIGVhc2UtaW4tb3V0XCIsXHJcbiAgICAgICAgICAgICAgICBcIm9wYWNpdHlcIjogdmFsdWVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoaWQpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMub25FeGl0ID0gZnVuY3Rpb24gKG5hbWluZ1Jvb3QsIGR1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShpZCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pOyJdfQ==
