var JSON_RPC_ERROR = {
    PARSE_ERROR: {
        code: -32700,
        message: 'Parse error'
    },
    INVALID_REQUEST: {
        code: -32600,
        message: 'Invalid Request'
    },
    METHOD_NOT_FOUND: {
        code: -32601,
        message: 'Method not found'
    },
    INVALID_PARAMS: {
        code: -32602,
        message: 'Invalid params'
    },
    INTERNAL_ERROR: {
        code: -32603,
        message: 'Internal error'
    }
};

function RPC () {
    this.methods = {};
    this.callbacks = {};
    this.buffer = [];
    this.idCounter = 1;
    this.isReady = false;
}

Object.keys(JSON_RPC_ERROR).forEach(function (key) {
    RPC[key] = JSON_RPC_ERROR[key];
});

module.exports = RPC;

RPC.prototype.invoke = function (method, params, callback) {
    var message = {
        jsonrpc: '2.0',
        method: method,
        params: params
    };
    var id;

    if (callback) {
        id = 'jsonp_' + this.idCounter;
        this.idCounter++;

        this.callbacks[id] = callback;
        message.id = id;
    }

    if (this.isReady) {
        this.send(message);
    } else {
        this.buffer.push(message);
    }
};

RPC.prototype.registerHandler = function (name, method) {
    this.methods[name] = method;
};

RPC.prototype.ready = function (err) {
    var self = this;
    if (err) {
        this.send = this.handleInternalError;
    }

    this.isReady = true;

    this.buffer.forEach(function (message) {
        setTimeout(function () {
            self.send(message);
        });
    });

    this.buffer = null;
};

RPC.prototype.send = function () {
    throw new Error('this method needs to overwrite');
};

RPC.prototype.onMessage = function (message) {
    if (message.method) {
        this.executeMethod(message);
    } else if (message.id) {
        this.handleCallback(message);
    }
};

RPC.prototype.handleCallback = function (message) {
    var callback = this.callbacks[message.id];
    this.callbacks[message.id] = null;

    if (!callback) {
        return;
    }

    setTimeout(function () {
        callback(message.error || null, message.result);
    }, 0);
};

RPC.prototype.executeMethod = function (message) {
    var fn = this.methods[message.method];
    var send = this.send;
    if (!fn) {
        send({
            jsonrpc: '2.0',
            error: JSON_RPC_ERROR.METHOD_NOT_FOUND,
            id: message.id || null
        });
        return;
    }
    setTimeout(function () {
        try {
            fn(message.params, function (err, result) {
                if (!message.id) {
                    return;
                }

                if (err) {
                    send({
                        jsonrpc: '2.0',
                        error: {
                            code: err.code,
                            message: err.message
                        },
                        id: message.id
                    });
                } else {
                    send({
                        jsonrpc: '2.0',
                        result: result,
                        id: message.id
                    });
                }
            });
        } catch (ex) {
            send({
                jsonrpc: '2.0',
                error: {
                    code: ex.code || -32000,
                    message: ex.message
                },
                id: message.id
            });
        }
    }, 0);
};

RPC.prototype.handleInternalError = function (message) {
    try {
        message = JSON.parse(message);
    } catch (ex) {
        return;
    }
    if (message.id) {
        this.handleCallback({
            jsonrpc: '2.0',
            error: JSON_RPC_ERROR.INTERNAL_ERROR,
            id: message.id
        });
    }
};