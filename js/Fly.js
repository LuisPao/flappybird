/*
 * @Author: pao
 * @Date:   2016-11-28 21:03:25
 * @Last Modified by:   pao
 * @Last Modified time: 2016-11-29 20:46:40
 */

'use strict';
var Fly = {};
Fly.score = 0;
Fly.loadImg = function(callback) {
    var imgsArr = ['birds', 'land', 'pipe1', 'pipe2', 'sky'];
    var imgList = {}, //用于存储创建要绘制的img对象
        count = 0, //标记
        len = imgsArr.length;
    imgsArr.forEach(function(value, index) {
        var img = new Image();
        img.src = 'imgs/' + value + '.png';
        imgList[value] = img;
        img.onload = function() {
            count++;
            if (count >= len) {
                callback(imgList);
                // console.log(imgList);
            }
        }
    })
};
Fly.toRadian = function(angle) {
    return angle * Math.PI / 180;
};
Fly.tap = function() {

    } //移动端的点击函数
