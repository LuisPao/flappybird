/*
 * @Author: pao
 * @Date:   2016-11-29 11:14:13
 * @Last Modified by:   pao
 * @Last Modified time: 2016-12-20 21:23:23
 */

'use strict';
// ! function(f) {
define(function(require, exports, module) {
    var Land = function(options) {
        this.ctx = options.ctx;
        this.img = options.img;
        this.imgNum = options.imgNum;
        this.landH = options.landH;
        this.x = options.x;
        this.y = this.ctx.canvas.height - this.img.height;

    };
    Land.prototype = {
        constructor: Land,
        draw: function(speed, delay) {

            var ctx = this.ctx,
                imgW = this.img.width,
                imgH = this.img.height;
            this.x -= speed * delay;
            if (this.x <= -imgW) {
                this.x += imgW * this.imgNum;
            }
            ctx.drawImage(this.img, 0, 0, imgW, imgH, this.x, this.y - this.landH, imgW, imgH + this.landH);

        }
    }

    module.exports=Land;

})

//     f.Land = Land;

// }(Fly);
