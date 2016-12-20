/*
 * @Author: pao
 * @Date:   2016-11-28 20:55:16
 * @Last Modified by:   pao
 * @Last Modified time: 2016-12-20 21:26:12
 */

// 'use strict';
// ! function(f) {
define(function(require, exports, module) {


    var Bird = function(options) {
        this.img = options.img; //小鸟的序列帧图片
        this.ctx = options.ctx;
        this.x = 100; //小鸟的在画笔中的x轴位置
        this.y = 100;
        this.frameIndex = 0;
        this.speed = 0; //小鸟在初始位置垂直方向的速度
        this.a = 0.0005; //小鸟的下落加速度
        this.xframeDelay = 0; //用于设置小鸟煽动翅膀的速度时间，就是控制在指定的时间间隔内水平方向才换帧
        this.maxSpeed = .5;
        this.maxAngle = 45;
        this.rotateAngle = 0; //rotateAngle/maxAngle=speed/maxSpeed
    };
    Bird.prototype = {
        constructor: Bird,
        initDraw: function(delay) {
            var ctx = this.ctx,
                imgW = this.img.width / 3,
                imgH = this.img.height;

            ctx.drawImage(this.img, this.frameIndex * imgW, 0, imgW, imgH, this.x, this.y, imgW, imgH)

            this.xframeDelay += delay;
            if (this.xframeDelay > 100) {
                this.frameIndex++;
                this.frameIndex %= 3;
                this.xframeDelay = 0;
            }

        },
        toRadian: function(angle) {
            return angle * Math.PI / 180;
        },
        draw: function(delay) { //小鸟对象自身的绘制方法，只需要负责绘制自己就行
            var ctx = this.ctx,
                imgW = this.img.width / 3, //图片有3个序列帧
                imgH = this.img.height;

            ctx.save();

            this.speed += this.a * delay; //下落速度的变化
            this.y += this.speed * delay + 1 / 2 * this.a * delay * delay; //下落位移变化

            ctx.translate(this.x, this.y);
            this.rotateAngle = this.speed * this.maxAngle / this.maxSpeed;
            if (this.rotateAngle >= this.maxAngle) {
                this.rotateAngle = this.maxAngle;
            }
            ctx.rotate(this.toRadian(this.rotateAngle))

            ctx.drawImage(this.img, this.frameIndex * imgW, 0, imgW, imgH, -imgW / 2, -imgH / 2, imgW, imgH)

            this.xframeDelay += delay;
            if (this.xframeDelay > 100) {
                this.frameIndex++;
                this.frameIndex %= 3;
                this.xframeDelay = 0;
            }
            ctx.restore();
        }
    }

    module.exports=Bird;
})

// Fly.Bird = Bird;

// }(Fly);
