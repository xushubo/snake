//手指按下的坐标
var startX = 0;
var startY = 0;

//手指在canvas移动的坐标
var moveX = 0;
var moveY = 0;

//移动位置跟开始位置的差值
var X = 0;
var Y = 0;

//蛇头的对象
var snakeHead = {
  x: 0,
  y: 0,
  color: '#ff0000',
  w:20,
  h:20,

}


Page({
  canvasStart: function (e) {
    startX = e.touches[0].x;
    startY = e.touches[0].y;
  },
  canvasMove:function (e) {
    moveX = e.touches[0].x;
    moveY = e.touches[0].y;

    X = moveX - startX;
    Y = moveY - startY;

    if (Math.abs(X) > Math.abs(Y) && X > 0) {
      console.log('right');
    }else if (Math.abs(X) > Math.abs(Y) && X < 0) {
      console.log('left');
    } else if (Math.abs(Y) > Math.abs(X) && Y > 0) {
      console.log('bottom');
    } else if (Math.abs(Y) > Math.abs(X) && Y < 0) {
      console.log('top');
    }
  },
  onReady: function () {
    //获取画布的上下文
    var context = wx.createContext('snakeCanvas');

    function animate () {

      context.setFillStyle(snakeHead.color);
      context.beginPath();
      context.rect(snakeHead.x, snakeHead.y, snakeHead.w, snakeHead.h);
      context.closePath();
      context.fill();

      wx.drawCanvas({
        canvasId: 'snakeCanvas',
        actions: context.getActions()
      });
      
      requestAnimationFrame(animate);
    }
    animate();
  }
})
