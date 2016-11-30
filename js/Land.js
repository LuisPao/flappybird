/*
 * @Author: pao
 * @Date:   2016-11-29 11:14:13
 * @Last Modified by:   pao
 * @Last Modified time: 2016-11-30 23:02:01
 */

'use strict';
! function(f) {
    var Land = function(options) {
        this.ctx = options.ctx;
        this.img = options.img;
        this.imgNum = options.imgNum;
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
            ctx.drawImage(this.img, 0, 0, imgW, imgH, this.x, this.y, imgW, imgH);

        }
    }
    f.Land = Land;

}(Fly);
