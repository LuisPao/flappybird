/*
 * @Author: pao
 * @Date:   2016-11-28 20:37:22
 * @Last Modified by:   pao
 * @Last Modified time: 2016-12-20 21:20:18
 */

'use strict';
// ! function(f) {
define(function(require, exports, module) {
    var Sky = function(options) {
        this.ctx = options.ctx;
        this.img = options.img;
        this.imgNum = options.imgNum;
        this.x = options.x; //画布绘制的起始位置
        this.y = 0;
    };
    Sky.prototype = {
        constructor: Sky,
        draw: function(speed, delay) {
            var ctx = this.ctx,
                imgW = this.img.width,
                imgH = this.img.height;
            this.x -= speed * delay;
            if (this.x <= -imgW) {
                this.x += imgW * this.imgNum;
            }
            ctx.drawImage(this.img, 0, 0, imgW, imgH, this.x, this.y, imgW, imgH)
        }
    }

    module.exports=Sky;

})

// f.Sky = Sky;
// }(Fly)
