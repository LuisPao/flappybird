/*
 * @Author: pao
 * @Date:   2016-11-29 12:02:58
 * @Last Modified by:   pao
 * @Last Modified time: 2016-12-20 23:36:47
 */

'use strict';
// ! function(f) {
define(function(require, exports, module) {

    var Pipe = function(options) {
        this.ctx = options.ctx;
        this.imgUp = options.imgUp;
        this.imgDown = options.imgDown;
        this.imgNum = options.imgNum;
        this.flyAreaH = options.flyAreaH;
        this.imgH = this.imgUp.height;
        this.imgW = this.imgUp.width;
        this.x = options.x;
        this.UpY = 0;
        this.DownY = 0;
        this.pipeGapY = options.pipeGapY || 120;
        this.isCounted = false;
        this._initY(); //创建对象的时候初始化上下管道的Y坐标
    };
    Pipe.prototype = {
        constructor: Pipe,
        _initY: function() {
            var pipeAverageH = (this.flyAreaH - this.pipeGapY) / 2,
                pipeUpH = Math.random() * (this.flyAreaH - this.pipeGapY - 140) + 70; //随机生成上管道高度范围
            this.UpY = pipeUpH - this.imgH; //获取上管道的Y坐标，负值:上管道高度-图片高度
            this.DownY = pipeUpH + this.pipeGapY; //下管道Y坐标，上管道高度+上下管道之间的间隔
        },
        draw: function(speed, delay) {
            var ctx = this.ctx,
                imgW = this.imgW,
                imgH = this.imgH;

            this.x -= speed * delay

            if (this.x < -imgW) {
                this.x += imgW * 3 * this.imgNum;
                this._initY();
                this.isCounted = false;
            }
            this.countScore();
            // console.log(this.x);
            //绘制上管道
            ctx.drawImage(this.imgUp, 0, 0, imgW, imgH, this.x, this.UpY, imgW, imgH)
                //为管道绘制路径，用于判断小鸟是否在路径中，确定小鸟是否发生碰撞
            ctx.rect(this.x, this.UpY, imgW, imgH);

            //绘制下管道
            ctx.drawImage(this.imgDown, 0, 0, imgW, imgH, this.x, this.DownY, imgW, imgH)
            ctx.rect(this.x, this.DownY, imgW, imgH);
        },
        countScore: function() {
            if (this.x < 100 - this.imgW / 2 && !this.isCounted) {
                //管道在指定的范围内分数+1，只会加一分
                window.worldScore++;
                this.isCounted = true;
            }
        }
    }

    module.exports=Pipe;

})


//     f.Pipe = Pipe;
// }(Fly);
