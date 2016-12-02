/*
 * @Author: pao
 * @Date:   2016-11-28 21:03:25
 * @Last Modified by:   pao
 * @Last Modified time: 2016-12-02 10:25:16
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
Fly.tap = function(dom, callback) {
    /*1.不能滑动过
     * 2.end与start时间间隔一般在150ms内*/
    var isMove = false; //标记是否滑动过
    var startTime = 0; //记录开始触摸的时间
    var preventDrag = function(e) {
        e.preventDefault();
    }
    dom.addEventListener("touchstart", function(e) {
        /*记录开始触摸时间--以毫秒做为单位*/
        startTime = Date.now();
    });
    dom.addEventListener("touchmove", function(e) {
        isMove = true;
        document.body.addEventListener('touchmove', preventDrag);
    });
    dom.addEventListener("touchend", function(e) {
        if (isMove == false && Date.now() - startTime <= 250) {
            callback && callback.call(this, e);
        }
        if (isMove) {
            document.body.removeEventListener('touchmove', preventDrag);
        }
        /*重置标记是否滑动*/
        isMove = false;
    });
};
Fly.isPC = function() { //判断是否为pc端
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
