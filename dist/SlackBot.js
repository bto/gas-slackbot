!function(exports) {
    void 0 === exports && (exports = {});
    function Controller(e, opts) {
        this.initialize(e, opts);
    }
    function DI(services) {
        this.initialize(services);
    }
    function EventsApi(di) {
        this.initialize(di);
    }
    function Log(level) {
        this.initialize(level);
    }
    (exports.Controller = Controller).prototype = {
        initialize: function(e, opts) {
            if (e instanceof DI) return this.di = e, this.config = this.di.getShared("config"), 
            void (this.logger = this.di.getShared("logger"));
            var config = this.config = opts || {}, logger = this.logger = new Log(config.logLevel), di = this.di = this.createDI();
            di.setShared("config", config), di.setShared("controller", this), di.setShared("event", e), 
            di.setShared("logger", new Log(config.logLevel)), logger.info(JSON.stringify(e));
        },
        check: function() {
            this.config.botAccessToken || this.logger.error("bot access token is not set"), 
            this.config.verificationToken || this.logger.error("verification token is not set");
        },
        createDI: function() {
            return new DI({
                eventsApi: function(di) {
                    return new EventsApi(di);
                },
                outgoingWebhook: function(di) {
                    return new OutgoingWebhook(di);
                },
                slashCommands: function(di) {
                    return new SlashCommands(di);
                },
                webApi: function(di) {
                    return new WebApi(di.getShared("config").botAccessToken);
                }
            });
        },
        createModule: function() {
            var e = this.di.getShared("event");
            return e.parameter.command ? this.di.getShared("slashCommands") : e.parameter.text ? this.di.getShared("outgoingWebhook") : this.di.getShared("eventsApi");
        },
        createOutputJson: function(content) {
            var output = JSON.stringify(content);
            return this.logger.info("output application/json: " + output), ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JSON);
        },
        createOutputText: function(content) {
            var output = content || "";
            return this.logger.info("output text/plain: " + output), ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.TEXT);
        },
        execute: function() {
            this.check(), this.module = this.createModule();
            var content = this.fire(), output = this.finish(content);
            return this.sendLog(), output;
        },
        finish: function(content) {
            if (!content) return this.createOutputText();
            if (Obj.isString(content)) try {
                return this.send(content) ? this.createOutputText() : this.createOutputText(content);
            } catch (e) {
                return console.error(e.message), this.createOutputText(e.message);
            }
            return Obj.isObject(content) ? this.createOutputJson(content) : Obj.isGASObject(content) ? content : (this.logger.error("invalid output content: " + content), 
            this.createOutputText());
        },
        fire: function() {
            try {
                return this.module.execute();
            } catch (e) {
                return e.message;
            }
        },
        getChannelId: function() {
            if (!this.module) return this.config.channelId;
            var channelId = this.module.getChannelId();
            return channelId || this.config.channelId;
        },
        send: function(message) {
            if (!message) return !0;
            var channelId = this.getChannelId();
            if (!channelId) return !1;
            var webApi = this.di.get("webApi"), params = {
                channel: channelId,
                text: message
            };
            if (!webApi.call("chat.postMessage", "post", params)) throw new Error(webApi.errorMessage);
            return !0;
        },
        sendLog: function() {
            var content = this.logger.toString();
            try {
                return !!this.send(content) || (console.error(content), !1);
            } catch (e) {
                return console.error(e.message), !1;
            }
        },
        verifyToken: function(token) {
            if (this.config.verificationToken === token) return null;
            var message = "invalid verification token: " + token;
            throw this.logger.warn(message), new Error(message);
        }
    }, DI.prototype = {
        initialize: function(services) {
            return this.setAll(services), this;
        },
        get: function(name) {
            var service = this.services[name];
            if (!service) return null;
            if ("[object Object]" === service.toString()) return service;
            if ("function" == typeof service) return this.services[name](this);
            throw new Error("not supported service value");
        },
        getShared: function(name) {
            if (this.objects[name]) return this.objects[name];
            var obj = this.get(name);
            return obj ? (this.objects[name] = obj, this.objects[name]) : null;
        },
        set: function(name, func) {
            return this.objects[name] = null, this.services[name] = func, this;
        },
        setAll: function(services) {
            return this.objects = {}, this.services = services || {}, this;
        },
        setShared: function(name, object) {
            return this.objects[name] = object, this;
        }
    }, exports.registerBotCommand = function(name, func) {
        EventsApi.prototype.commands[name] = func;
    }, exports.registerEvent = function(eventType, func) {
        EventsApi.prototype.handlers[eventType] || (EventsApi.prototype.handlers[eventType] = []), 
        EventsApi.prototype.handlers[eventType].push(func);
    }, EventsApi.prototype = {
        defaultMessage: "そんなコマンドはないよ。",
        commands: {
            nop: function(di) {
                return di.getShared("logger").info("nop command was called"), null;
            },
            help: function(di) {
                return di.getShared("logger").info("help command was called"), "吾輩はBotである。ヘルプはまだない。";
            },
            ping: function(di) {
                return di.getShared("logger").info("ping command was called"), "PONG";
            }
        },
        handlers: {
            app_mention: [ function(di, params) {
                var message, eventsApi = di.getShared("eventsApi"), logger = di.getShared("logger"), command = params.event.text.split(/\s+/)[1];
                logger.info("bot command: " + command), message = eventsApi.commands.hasOwnProperty(command) ? (logger.info("call command handler for " + command), 
                eventsApi.commands[command](di, params)) : (logger.info("does not have any command handler for " + command), 
                eventsApi.getDefaultMessage()), logger.info("output of command handler: " + message);
                var channelId = params.event.channel;
                return di.get("webApi").call("chat.postMessage", "post", {
                    channel: channelId,
                    text: message
                }), message;
            } ]
        },
        initialize: function(di) {
            if (!(di && di instanceof DI)) throw new Error("DI object must be passed");
            this.di = di, this.logger = di.getShared("logger"), this.params = JSON.parse(di.getShared("event").postData.contents);
        },
        callEventHandlers: function() {
            var type = this.params.event.type, handlers = this.handlers[type];
            if (!handlers) return this.logger.error("does not have any event handler for " + type), 
            null;
            this.logger.info("call event handlers for " + type);
            for (var output = null, i = 0; i < handlers.length; i++) output = handlers[i](this.di, this.params), 
            this.logger.info("output of handler: " + output);
            return output;
        },
        execute: function() {
            var controller = this.di.getShared("controller");
            controller.verifyToken(this.params.token);
            var type = this.params.type;
            switch (type) {
              case "event_callback":
                return this.callEventHandlers();

              case "url_verification":
                return controller.createOutputText(this.params.challenge);

              default:
                var message = "not supported events api: " + type;
                throw this.logger.error(message), new Error(message);
            }
        },
        getChannelId: function() {
            return this.params.event.channel;
        },
        getDefaultMessage: function() {
            return this.defaultMessage;
        }
    }, Log.DEBUG = 0, Log.INFO = 1, Log.WARN = 2, Log.ERROR = 3, Log.FATAL = 4, Log.prototype = {
        messages: [],
        initialize: function(level) {
            this.level = void 0 === level ? Log.WARN : level, this.messages = [];
        },
        debug: function() {
            return this.write(Log.DEBUG, arguments);
        },
        info: function() {
            return this.write(Log.INFO, arguments);
        },
        warn: function() {
            return this.write(Log.WARN, arguments);
        },
        error: function() {
            return this.write(Log.ERROR, arguments);
        },
        fatal: function() {
            return this.write(Log.FATAL, arguments);
        },
        toString: function() {
            var levels = [];
            return levels[Log.DEBUG] = "DEBUG", levels[Log.INFO] = "INFO", levels[Log.WARN] = "WARN", 
            levels[Log.ERROR] = "ERROR", levels[Log.FATAL] = "FATAL", this.messages.reduce(function(message, v) {
                return message + v.time + ": " + levels[v.level] + ": " + v.message + "\n";
            }, "");
        },
        write: function(level, args) {
            return level < this.level || this.messages.push({
                level: level,
                message: Utilities.formatString.apply(null, args),
                time: new Date()
            }), this;
        }
    };
    var Obj = {
        isArray: function(x) {
            return "[object Array]" === Object.prototype.toString.call(x);
        },
        isGASObject: function(x, className) {
            return "[object JavaObject]" === Object.prototype.toString.call(x) && (!className || x.toString() === className);
        },
        isInteger: function(x) {
            return "number" == typeof x && x % 1 == 0;
        },
        isNumber: function(x) {
            return "number" == typeof x;
        },
        isObject: function(x) {
            return "[object Object]" === Object.prototype.toString.call(x);
        },
        isString: function(x) {
            return "string" == typeof x;
        },
        merge: function() {
            for (var obj = {}, i = 0; i < arguments.length; i++) {
                var argument = arguments[i];
                for (var key in argument) argument.hasOwnProperty(key) && (obj[key] = argument[key]);
            }
            return obj;
        }
    };
    function OutgoingWebhook(di) {
        this.initialize(di);
    }
    function SlashCommands(di) {
        this.initialize(di);
    }
    function WebApi(token) {
        this.initialize(token);
    }
    exports.registerOutgoingWebhook = function(func) {
        OutgoingWebhook.prototype.handler = func;
    }, OutgoingWebhook.prototype = {
        handler: function(di, params) {
            return params.text;
        },
        initialize: function(di) {
            if (!(di && di instanceof DI)) throw new Error("DI object must be passed");
            this.di = di, this.logger = di.getShared("logger"), this.params = di.getShared("event").parameter;
        },
        execute: function() {
            this.di.getShared("controller").verifyToken(this.params.token), this.logger.info("call outgoing webhook handler");
            var output = this.handler(this.di, this.params);
            return this.logger.info("output of outgoing webhook handler: " + output), "string" == typeof output ? {
                text: output
            } : output;
        },
        getChannelId: function() {
            return this.params.channel_id;
        }
    }, exports.registerSlashCommand = function(name, func) {
        SlashCommands.prototype.handlers[name] = func;
    }, SlashCommands.prototype = {
        handlers: {
            ping: function(di) {
                return di.getShared("logger").info("ping slash command was called"), "PONG";
            }
        },
        initialize: function(di) {
            if (!(di && di instanceof DI)) throw new Error("DI object must be passed");
            this.di = di, this.logger = di.getShared("logger"), this.params = di.getShared("event").parameter;
        },
        execute: function() {
            this.di.getShared("controller").verifyToken(this.params.token);
            var command = this.params.command.substring(1), handler = this.handlers[command];
            if (!handler) return this.logger.error("does not have any slash command handler for " + command), 
            null;
            this.logger.info("call slash command handler for " + command);
            var output = handler(this.di, this.params);
            return this.logger.info("output of slash command handler: " + output), "string" == typeof output ? {
                response_type: "in_channel",
                text: output
            } : output;
        },
        getArgs: function() {
            return this.params.text ? this.params.text.trim().split(/\s+/) : [];
        },
        getChannelId: function() {
            return this.params.channel_id;
        }
    }, WebApi.prototype = {
        initialize: function(token) {
            this.token = token;
        },
        call: function(apiMethod, httpMethod, params) {
            if ("get" !== httpMethod && "json" !== httpMethod && "post" !== httpMethod) throw new Error("invalid HTTP method");
            var reqParams = this.createRequestParams(params), url = this.createApiUrl(apiMethod, httpMethod, reqParams), fetchOpts = this.createFetchOptions(httpMethod, reqParams);
            return this.fetch(url, fetchOpts);
        },
        createApiUrl: function(apiMethod, httpMethod, params) {
            var url = "https://slack.com/api/" + apiMethod;
            return "get" === httpMethod && (url += this.createQueryString(params)), url;
        },
        createFetchOptions: function(httpMethod, params) {
            var options = {
                headers: {
                    Authorization: "Bearer " + this.token
                },
                method: "json" === httpMethod ? "post" : httpMethod,
                muteHttpExceptions: !0
            };
            return "json" === httpMethod ? (options.contentType = "application/json; charset=utf-8", 
            options.payload = JSON.stringify(params)) : "post" === httpMethod && (options.payload = params), 
            options;
        },
        createRequestParams: function(params) {
            return Obj.merge({
                token: this.token
            }, params || {});
        },
        createQueryString: function(params) {
            return Object.keys(params).reduce(function(queryString, key, i) {
                return queryString + (0 === i ? "?" : "&") + encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
            }, "");
        },
        fetch: function(url, options) {
            this.error = null, this.errorMessage = null, this.response = null, this.result = null;
            try {
                this.response = UrlFetchApp.fetch(url, options);
            } catch (e) {
                return this.error = e, this.errorMessage = e.errorMessage, !1;
            }
            return 200 !== this.response.getResponseCode() ? (this.errorMessage = this.response.getContentText(), 
            !1) : (this.result = JSON.parse(this.response.getContentText()), this.result.ok ? this.result : (this.errorMessage = this.result.error, 
            !1));
        }
    };
}("undefined" == typeof SlackBot ? SlackBot = {} : SlackBot);