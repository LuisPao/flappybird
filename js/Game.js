/*
 * @Author: pao
 * @Date:   2016-11-28 21:21:17
 * @Last Modified by:   pao
 * @Last Modified time: 2016-12-02 10:22:56
 */

'use strict';
! function(f) {
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
        this.score = '分数:';
        var _this = this;
        this.eventBind();

        Fly.loadImg(function(imgList) {
            _this.imgList = imgList;
            _this.initdrawObj(imgList);
            _this.initRender();
        })

    };
    Game.prototype = {
        constructor: Game,
        start: function(speed) {
            this.speed = speed;
            Fly.score = 0;
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
                landNum = Math.ceil(this.cvW / landImg.width) + 1;
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
                    imgNum: landNum
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
        drawObj: function(imgList) { //创建要绘制的所有对象
            var i = 0,
                sky, land, pipe,
                skyImg = imgList['sky'],
                landImg = imgList['land'],
                pipeUpImg = imgList['pipe2'],
                pipeDownImg = imgList['pipe1'],
                skyNum = Math.ceil(this.cvW / skyImg.width) + 1,
                landNum = Math.ceil(this.cvW / landImg.width) + 1,
                pipeNum = Math.ceil(this.cvW / (pipeUpImg.width * 3)) + 1;
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
                    imgNum: pipeNum
                        //管道在x方向的坐标，开始时第一个管道对象距离画布至少300
                        //每个管道对象x方向相距2倍管道的宽度，所以要*3*i
                });
                this.drawObjArr.push(pipe);
            }
            for (i = 0; i < landNum; i++) {
                land = new Fly.Land({
                    ctx: this.ctx,
                    img: landImg,
                    x: landImg.width * i,
                    imgNum: landNum
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
            ctx.fillText(this.score + Fly.score, 10, 40);
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

        }
    }
    f.Game = Game;

}(Fly);
