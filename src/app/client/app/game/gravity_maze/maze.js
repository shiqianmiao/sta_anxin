var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var _ = require('underscore');
var handleIntersection = require('./handleIntersection');
var NativeAPI = require('app/client/common/lib/native/native.js');
var Cookie = require('com/mobile/lib/cookie/cookie.js');

var startAnimation =  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(f) {
            return setTimeout(f,1e3/60);
        };

function Maze () {
    this.gamma = 0;
    this.beta = 0;
}

function Ball (config) {
    this.x = config.position.x;
    this.y = config.position.y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.mass = 1;
    this.radius = 10;

    this.img = new Image();
    this.img.src = G.config('baseUrl') + require.resolve('./image/ball.png');
}

Ball.prototype.reset = function () {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
};

function Block (config) {
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
}

function Pit (config) {
    this.x = config.x;
    this.y = config.y;
    this.radius = config.radius;
    this.isEnd = config.isEnd;
}

Pit.prototype.checkCollision  = function (ball) {
    if (pow2(ball.x + ball.radius - this.x - this.radius) + pow2(ball.y + ball.radius - this.y - this.radius) <= pow2(this.radius) ) {
        return true;
    } else {
        return false;
    }
};

function getAcceleration (angle, a, v, u) {
    var g = 10;
    u = u|| 0;
    a = sin(angle) * g - sign(sin(angle)) * (u || 0) * cos(angle) * g;

    return a;
}

function sign (n) {
    return n < 0 ? -1 : 1;
}

function sin (r) {
    return Math.sin(r * Math.PI / 180);
}
function cos (r) {
    return Math.cos(r * Math.PI / 180);
}
function pow2(n) {
    return Math.pow(n, 2);
}

var blocks = [
    [0,0,6,370],
    [0,0,320,6],
    [314,0,6,370],
    [0,364,320,6],
    [55,0,20,85],
    [193, 0, 20, 96],
    [0,115,130,20],
    [120, 47, 20, 125],
    [120, 155, 150, 20],
    [253, 95, 20, 80],
    [58, 188, 20, 51],
    [58, 219, 263, 20],
    [0, 287, 80, 20],
    [143, 230, 20, 96],
    [215, 290, 20, 80]
];

var pits = [
    [191, 103],
    [169, 246],
    [21, 324]
];

var endPoint = [263, 326];

exports.game = Widget.define({
    events: {
        'click [data-role="start"]': 'start',
        'click [data-role="stop"]': 'stop'
    },
    init: function (config) {
        var self = this;
        var maze;

        this.config = config;
        this.ball = new Ball({
            position: {x: 20, y: 20}
        });
        this.maze = new Maze();
        this.blocks = blocks.map(function (block) {
            return new Block({
                x: block[0],
                y: block[1],
                width: block[2],
                height: block[3]
            });
        });

        this.pits = pits.map(function (pit) {
            return new Pit({
                radius: 13,
                x: pit[0],
                y: pit[1]
            });
        });

        this.pits.push(new Pit({
            isEnd: true,
            radius: 13,
            x: endPoint[0],
            y: endPoint[1]
        }));
        maze = this.maze;
        this.addDeviceOrientationListenner = function () {
            self.lastUpdate = Date.now();
            $(window).on('deviceorientation', onDeviceOrientation);
        };

        this.removeDeviceOrientationListenner = function () {
            $(window).off('deviceorientation', onDeviceOrientation);
        };

        function onDeviceOrientation (e) {
            maze.beta = e.beta;
            maze.gamma = e.gamma;
        }
    },
    start: function () {
        var self = this;
        if (this.disabled) {
            return;
        }
        this.login(function () {
            self.stop(); // stop prev action;
            self.reset();
            self.addDeviceOrientationListenner();
            self.lastExec = Date.now();
            self.loop = true;

            self.config.$start.hide();
            $(self.config.$mask).hide();

            var loop = function () {
                self.step();
                if (self.loop) {
                    startAnimation(loop);
                }
            };
            loop();
        });
    },
    login: function (callback) {
        var loginUrl = 'http://3g.ganji.com/bj_user/login/?backUrl=' + encodeURIComponent('http://3g.ganji.com/tuiguang/zhuanti/?_a=appActive0821');
        var self = this;
        if (this.userInfo) {
            return callback();
        }
        NativeAPI.invoke('getUserInfo', null, function (err, userInfo) {
            if (!err) {
                self.userInfo = userInfo;
                return callback(userInfo);
            }
            if (err.code === -32603) {
                if (!Cookie.get('GanjiUserInfo')) {
                    window.location.href = loginUrl;
                    return;
                } else {
                    try {
                        self.userInfo = JSON.parse(Cookie.get('GanjiUserInfo'));
                    } catch (ex) {
                        window.location.href = loginUrl;
                        return;
                    }
                    return callback();
                }
            } else {
                NativeAPI.invoke('login', null, function (err, userInfo) {
                    if (!err) {
                        self.userInfo = userInfo;
                        callback();
                    }
                });
            }
        });
    },
    stop: function () {
        this.loop = false;
        this.addDeviceOrientationListenner();

        this.reset();
        this.config.$start.show();
        $(this.config.$mask).show();
    },
    reset: function () {
        this.ball.reset();
        this.ball.x = 20;
        this.ball.y = 20;
    },
    step: function () {
        var ball = this.ball;
        var maze = this.maze;
        var deltT = 0.017;

        ball.ax = getAcceleration(maze.gamma, ball.ax, ball.vx, 0);
        ball.ay = getAcceleration(maze.beta, ball.ay, ball.vy, 0);

        ball.vx += ball.ax * deltT;
        ball.vy += ball.ay * deltT;

        ball.deltX = (ball.vx * deltT + 0.5 * ball.ax * Math.pow(deltT, 2)) * 100;
        ball.deltY = (ball.vy * deltT + 0.5 * ball.ay * Math.pow(deltT, 2)) * 100;

        this.processCollision();
        this.draw();
        this.lastExec = Date.now();
    },
    draw: function () {
        var ball = this.ball;
        this.config.$ball
            .css($.fx.cssPrefix + 'transform', 'translate(' + (ball.x) +'px, '+ (ball.y) + 'px)');
    },
    processCollision: function () {
        var ball = this.ball;
        var pit;
        var bounce = 0.5;
        var fix = 0.1;

        this.blocks.forEach(function (block) {
            var intersection = handleIntersection(block, ball);
            if (intersection) {

                if (intersection.nx) {
                    ball.deltX = 0;
                    ball.x = intersection.cx - ball.radius;

                    ball.vx = -1 * bounce * ball.vx;
                }

                if (intersection.ny) {
                    ball.deltY = 0;
                    ball.y = intersection.cy - ball.radius;

                    ball.vy = -1  * bounce * ball.vy;
                }
                if (intersection.ny && intersection.nx) {
                    if (ball.y + ball.radius <= block.y) {
                        ball.deltY -= fix;
                    } else {
                        ball.deltY += fix;
                    }
                    if (ball.x + ball.radius <= block.x) {
                        ball.deltX -= fix;
                    } else {
                        ball.deltX += fix;
                    }
                }
            }
        });
        ball.y += ball.deltY;
        ball.x += ball.deltX;
        pit = _.find(this.pits, function (pit) {
            return pit.checkCollision(ball);
        });
        if (pit) {
            if (pit.isEnd) {
                this.success();
            } else {
                this.fail();
            }
        }
    },
    success: function () {
        var self = this;
        this.stop();
        this.disabled = true;
        this.getTicket(function (err, data) {
            var ssid = data.ssid;
            self.disabled = false;
            data = {
                amount: data.amount,
                user_id: self.userInfo.user_id,
                link: 'http://3g.ganji.com/bj_refresh/option/?f=all&ifid=ganji_3g_uc_refresh'
            };

            if (err) {
                window.alert('网络异常, 请稍候再试');
                return;
            }

            NativeAPI.invoke('getDeviceInfo', null, function (err, deviceInfo) {
                if (!err) {
                    data.link += '&source=' + (deviceInfo.os.indexOf('ios') !== -1 ? 'ios' : 'android') + '&ver=' + deviceInfo.versionId + '&ssid=' + ssid;
                }

                self.config.$el.trigger('success', data);
            });

        });
    },
    fail: function () {
        this.stop();
        this.config.$el.trigger('fail');
    },
    getTicket: function (callback) {
        var self = this;
        if (!self.userInfo) {
            return callback(new Error('请先登录'));
        }
        NativeAPI.invoke('getDeviceInfo', null, function (err, deviceInfo) {
            var headers;
            var server = 'http://mobds.ganji.cn/';
            if (err) {
                if (err.code === -32603) {
                    headers = {
                        'agency': 'wapbrowser',
                        'clientAgent': 'wap#320*480',
                        'customerId': '1000',
                        'model': 'wap/unknow',
                        'userId': '8C80842520F8DD3AABDB888F1E549C38',
                        'versionId': '1.0.0'
                    };
                } else {
                    return callback(err);
                }
            } else {
                headers = {
                    'customerId': deviceInfo.customerId,
                    'clientAgent': deviceInfo.clientAgent,
                    'GjData-Version': deviceInfo['GjData-Version'],
                    'versionId': deviceInfo.versionId,
                    'model': deviceInfo.model,
                    'agency': deviceInfo.agency,
                    'contentformat': deviceInfo.contentformat,
                    'userId': deviceInfo.userId,
                    'token': deviceInfo.token,
                    'mac': deviceInfo.mac
                };
                switch (deviceInfo.env) {
                    case 'test1' :
                        server = 'http://mobds.ganjistatic3.com/';
                        break;
                    case 'web6' :
                        server = 'http://mobtestweb6.ganji.com/';
                        break;
                    default:
                        server = 'http://mobds.ganji.cn/';
                }
            }

            $.ajax({
                url: server + '/webapp/myad/?controller=SelfTuiguang&action=myad6192&debug_ignore_login=1',
                data: {
                    user_id: self.userInfo.user_id
                },
                headers: headers
            })
                .done(function (data) {
                    if (data && data.Code) {
                        callback(new Error(data.Message));
                        return;
                    }
                    callback(null, data.Data);
                })
                .fail(function () {
                    callback(new Error('网络异常, 请稍候再试'));
                });
        });
    }
});

exports.successPop = Widget.define({
    events: {

    },
    init: function (config) {
        this.config = config;
    },
    render: function (data) {
        this.config.$link.attr('href', data.link);
        this.config.$amount.text(['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][parseInt(data.amount * 10, 10) - 1]);
    }
});