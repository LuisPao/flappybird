/*
 * @Author: pao
 * @Date:   2016-11-28 21:21:17
 * @Last Modified by:   pao
 * @Last Modified time: 2016-12-22 10:28:53
 */

'use strict';
define(function(require, exports, module) {
    var Fly = require('./Fly.js')
    var Game = function(options) {
        this.ctx = options.ctx;
        this.cvW = this.ctx.canvas.width;
        this.cvH = this.ctx.canvas.height;
        this.lastFrameT = Date.now();
        this.cb = options.callback;
        this.curFrameT = 0;
        this.delay = 0;
        this.drawObjArr = [];
        this.hero = null;
        this.speed = .15; //除小鸟外其他游戏角色向左移动的默认速度
        this.isFlying = false;
        this.isStart = false;
        this.imgList = null;
        this.scoreTxt = '分数:';
        this.score=0;
        this.startEle = document.getElementById('start'); //遮罩元素
        this.startBtn = start.querySelector('button'); //遮罩元素上的btn
        this.p = start.querySelector('p'); //存放激励语的p元素
        this.level = start.querySelector('ul'); //设置游戏难度的ul
        var _this = this;
        this.eventBind();
        Fly.loadImg(function(imgList) {
            _this.imgList = imgList;
            _this.initdrawObj(imgList);
            _this.initRender();
            _this.selectDifficulty();
        })
    };
    Game.prototype = {
        constructor: Game,
        start: function(speed) {
            this.speed = speed;
            this.score = 0;
            this.isStart = true;
            this.lastFrameT = Date.now();
            this.drawObjArr = [];
            this.drawObj(this.imgList);
            this.render();
        },
        gameOver: function() {
            var ctx = this.ctx;
            if (this.hero.y <= 0 || this.hero.y >= ctx.canvas.height - 112 || ctx.isPointInPath(this.hero.x, this.hero.y)) {
                this.isFlying = false;
                var textArr = [
                    '哎呦,不错喔！',
                    '是男人就过100管！',
                    '是不是太难了？亲',
                    '现在还早,不急哈',
                    '行啊,有本事再过一管！',
                    '行不行啊你？',
                    '进步了喔',
                    '嫌管道太挤？怪我咯',
                    '不服来战！'
                ];
                this.p.innerHTML = textArr[Math.floor(Math.random() * textArr.length)];
                this.startBtn.innerHTML = '再来一次';
                this.cb();
            }
        },
        constrolTime: function() {
            this.curFrameT = Date.now();
            this.delay = this.curFrameT - this.lastFrameT;
            this.lastFrameT = this.curFrameT;
        },
        initdrawObj: function(imgList) {
            var i = 0,
                sky, land,
                skyImg = imgList['sky'],
                landImg = imgList['land'],
                skyNum = Math.ceil(this.cvW / skyImg.width) + 1,
                landNum = Math.ceil(this.cvW / landImg.width) + 1,
                landH = this.ctx.canvas.height - skyImg.height - landImg.height;
            //增加landH目的是因为在大屏手机上sky和land之间有空隙，通过计算空隙的大小
            //假如大于0就在绘制land的时候增加land的绘制高度
            for (; i < skyNum; i++) {
                sky = new Fly.Sky({
                    ctx: this.ctx,
                    img: skyImg,
                    x: skyImg.width * i,
                    imgNum: skyNum
                });
                this.drawObjArr.push(sky);
            }
            for (i = 0; i < landNum; i++) {
                land = new Fly.Land({
                    ctx: this.ctx,
                    img: landImg,
                    x: landImg.width * i,
                    imgNum: landNum,
                    landH: landH > 0 ? landH : 0
                });
                this.drawObjArr.push(land);
            }
            var bird = new Fly.Bird({
                img: imgList['birds'],
                ctx: this.ctx
            });

            this.hero = bird;
        },
        initRender: function() {
            var ctx = this.ctx,
                _this = this;
            ! function draw() {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                _this.constrolTime();

                //遍历其他要绘制的对象（sky,land）调用其绘制方法
                _this.drawObjArr.forEach(function(value) {
                    value.draw(_this.speed, _this.delay);
                })
                //调用小鸟对象初始绘制方法
                _this.hero.initDraw(_this.delay);
                if (!_this.isStart) {
                    window.requestAnimationFrame(draw);
                }

            }();
        },
        countScore:function(){//计算分数,作为
            this.score++;
        },
        drawObj: function(imgList) { //创建要绘制的所有对象
            var i = 0,
                sky, land, pipe,
                skyImg = imgList['sky'],
                landImg = imgList['land'],
                pipeUpImg = imgList['pipe2'],
                pipeDownImg = imgList['pipe1'],
                skyNum = Math.ceil(this.cvW / skyImg.width) + 1,
                landNum = Math.ceil(this.cvW / landImg.width) + 1,
                pipeNum = Math.ceil(this.cvW / (pipeUpImg.width * 3)) + 1,
                landH = this.ctx.canvas.height - skyImg.height - landImg.height,
                flyAreaH = landH > 0 ? skyImg.height : this.ctx.canvas.height - landImg.height;

            for (; i < skyNum; i++) {
                sky = new Fly.Sky({
                    ctx: this.ctx,
                    img: skyImg,
                    x: skyImg.width * i,
                    imgNum: skyNum
                });
                this.drawObjArr.push(sky);
            }
            for (i = 0; i < pipeNum; i++) {
                pipe = new Fly.Pipe({
                    ctx: this.ctx,
                    imgUp: pipeUpImg,
                    imgDown: pipeDownImg,
                    x: this.ctx.canvas.width + pipeUpImg.width * 3 * i,
                    imgNum: pipeNum,
                    flyAreaH: flyAreaH
                        //管道在x方向的坐标，开始时第一个管道对象距离画布至少300
                        //每个管道对象x方向相距2倍管道的宽度，所以要*3*i
                });
                this.drawObjArr.push(pipe);
                pipe.addListener({ctx:this,cb:this.countScore});//为每个管道对象添加订阅者信息
            }
            for (i = 0; i < landNum; i++) {
                land = new Fly.Land({
                    ctx: this.ctx,
                    img: landImg,
                    x: landImg.width * i,
                    imgNum: landNum,
                    landH: landH > 0 ? landH : 0
                });
                this.drawObjArr.push(land);
            }
            var bird = new Fly.Bird({
                img: imgList['birds'],
                ctx: this.ctx
            });
            this.hero = bird;
        },
        render: function() {
            this.isFlying = true;
            var ctx = this.ctx;
            var _this = this;
            ! function draw() {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.beginPath();
                //时间
                _this.constrolTime();
                //遍历其他要绘制的对象调用其绘制方法
                _this.drawObjArr.forEach(function(value) {
                        value.draw(_this.speed, _this.delay);
                    })
                    //调用小鸟对象绘制方法
                _this.hero.draw(_this.delay);
                _this.strokeScore();

                _this.gameOver();

                if (_this.isFlying) {
                    window.requestAnimationFrame(draw);
                }
            }()
        },
        strokeScore: function() {
            var ctx = this.ctx;
            ctx.save();
            ctx.fillStyle = 'red';
            ctx.font = "24px '幼圆'";
            ctx.fillText(this.scoreTxt + this.score, 10, 40);
            ctx.restore();
        },
        eventBind: function() {
            var _this = this;
            var changeSpeed = function() {
                _this.hero.speed = -.3;
            }
            if (Fly.isPC()) {
                this.ctx.canvas.addEventListener('click', changeSpeed);
            } else {
                Fly.tap(this.ctx.canvas, changeSpeed);
            }
        },
        selectDifficulty: function() {
            var that = this;
            var levelcb = function(e) {
                var targetLi = e.target;
                var active = that.startEle.querySelector('.active');
                active.classList.remove('active');
                targetLi.classList.add('active');
            };
            var startBtncb = function(e) {//开始(再来一次)绑定的函数
                e.preventDefault();
                that.startEle.style.display = 'none';//隐藏‘开始’遮罩
                var active = that.level.querySelector('.active');//获取难度系数的值
                var speed = active.dataset['speed'];
                that.start(speed);//将难度系数传递给整个游戏,并开始游戏
            };
            if (Fly.isPC()) {
                this.level.addEventListener('click', levelcb);
                this.startBtn.addEventListener('click', startBtncb);
            } else {
                Fly.tap(this.level, levelcb);
                Fly.tap(this.startBtn, startBtncb);
            }
        }
    }
    module.exports = Game;
})
