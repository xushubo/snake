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
  w:10,
  h:10,

}

//身体对象（数组）
var snakeBodys = [];

//食物的对象(数组)
var foods = [];

//窗口宽高
var windowWidth = 0;
var windowHeight = 0;

//用于确定是否删除
var collideBol = true;

//手指移动的方向
var direction = null;

//蛇移动的方向
var snakeDirection = 'right';

//已吃数量
var eatnum = 0;

//移动的速度
var speed = 15;

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
      direction = 'right';
    }else if (Math.abs(X) > Math.abs(Y) && X < 0) {
      direction = 'left';
    } else if (Math.abs(Y) > Math.abs(X) && Y > 0) {
      direction = 'bottom';
    } else if (Math.abs(Y) > Math.abs(X) && Y < 0) {
      direction = 'top';
    }
  },
  canvasEnd: function () {
    snakeDirection = direction;
  },
  onReady: function () {
    //获取画布的上下文
    var context = wx.createContext('snakeCanvas');
    //帧数
    var frameNum = 0;

    function draw (obj) {
      context.setFillStyle(obj.color);
      context.beginPath();
      context.rect(obj.x, obj.y, obj.w, obj.h);
      context.closePath();
      context.fill();
    }
    //碰撞函数
    function collide (obj1, obj2) {
      var l1 = obj1.x;
      var r1 = l1 + obj1.w;
      var t1 = obj1.y;
      var b1 = t1 + obj1.h;
      
      var l2 = obj2.x;
      var r2 = l2 + obj2.w;
      var t2 = obj2.y;
      var b2 = t2 + obj2.h;
      if (l2 < r1 && r2 > l1 && t2< b1 && b2 > t1) {
        return true;
      }else {
        return false;
      }

    }


    function animate () {
      if (eatnum > 10 && eatnum%10==0){
        speed = 15 - eatnum/10;
        if (eatnum > 90){
          speed = 2
        }
      }
      frameNum ++;
      if (frameNum % 10 == 0) {
        //向蛇身体数组添加一个蛇头的上一个的位置（身体对象）
        snakeBodys.push({
          x: snakeHead.x,
          y: snakeHead.y,
          w: 10,
          h: 10,
          color: '#00ff00'
        });

        if (snakeBodys.length > 6) {
          if (collideBol) {
            //移除不用的身体位置
            snakeBodys.shift();
          }else {
            collideBol = true;
          }
        }
        switch (snakeDirection) {
          case 'left':
            snakeHead.x -= snakeHead.w;
            if (snakeHead.x < 0) {
              snakeHead.x = windowWidth
            }
            break;
          case 'right':
            snakeHead.x += snakeHead.w;
            if (snakeHead.x > windowWidth) {
              snakeHead.x = 0
            }
            break;
          case 'bottom':
            snakeHead.y += snakeHead.h;
            if (snakeHead.y > windowHeight) {
              snakeHead.y = 0
            }
            break;
          case 'top':
            snakeHead.y -= snakeHead.h;
            if (snakeHead.y < 0) {
              snakeHead.y = windowHeight
            }
            break;
        }
      }
      
      //绘制蛇头
      draw(snakeHead);

      //绘制蛇身
      for (var i=0; i<snakeBodys.length; i++) {
        var snakeBody = snakeBodys[i]
        draw(snakeBody);
      }
      //绘制食物
      for (var i=0; i<foods.length; i++) {
        var foodObj = foods[i];
        draw(foodObj);
        if (collide(snakeHead, foodObj)) {
          console.log('撞上');
          collideBol = false;
          foodObj.reset();
          eatnum ++;
        }
      }

      wx.drawCanvas({
        canvasId: 'snakeCanvas',
        actions: context.getActions()
      });
      
      setTimeout(animate, speed);
    }
    function rand (min, max) {
      return parseInt(Math.random()*(max-min)) + min;
    }

    //构造食物对象
    function Food () {
      this.x = rand(0, windowWidth);
      this.y = rand(0, windowHeight);
      var w = 10;
      this.w = w;
      this.h = w;
      this.color = 'rgb('+rand(0, 255)+', '+rand(0, 255)+', '+rand(0, 255)+')';
      this.reset = function () {
        this.x = rand(0, windowWidth);
        this.y = rand(0, windowHeight);
        this.color = 'rgb(' + rand(0, 255) + ', ' + rand(0, 255) + ', ' + rand(0, 255) + ')';
      }
    }

    wx.getSystemInfo({
      success: function (res) {
        windowWidth = res.windowWidth;
        windowHeight = res.windowHeight;

        for (var i=0; i<20; i++) {
          var foodObj = new Food();
          foods.push(foodObj);
        }

        animate();
      },
    })
    
  }
})
