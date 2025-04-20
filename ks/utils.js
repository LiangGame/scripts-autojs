// 通用工具函数模块
var Utils = {
  // 日志函数
  log: function (text) {
    if (config.debug) {
      console.log(text);
      toast(text);
    }
  },

  // 随机延迟函数
  randomSleep: function (min, max) {
    var delay = Math.floor(Math.random() * (max - min + 1)) + min;
    this.log("随机延迟 " + delay + " 毫秒");
    sleep(delay);
  },

  // 随机点击函数
  randomClick: function (x, y, range) {
    range = range || 5;
    var screenWidth = device.width;
    var screenHeight = device.height;
    var randomX = x + Math.floor(Math.random() * range);
    var randomY = y + Math.floor(Math.random() * range);

    this.log("实际点击坐标: (" + x + ", " + y + ")");
    this.log("随机点击坐标: (" + randomX + ", " + randomY + ")");
    click(randomX, randomY);
    this.randomSleep(500, 1500);
  },

  // 随机滑动函数
  randomSwipe: function (startX, startY, endX, endY, duration, range) {
    range = range || 10;
    var randomStartX = startX + Math.floor(Math.random() * range * 2) - range;
    var randomStartY = startY + Math.floor(Math.random() * range * 2) - range;
    var randomEndX = endX + Math.floor(Math.random() * range * 2) - range;
    var randomEndY = endY + Math.floor(Math.random() * range * 2) - range;
    var randomDuration = duration + Math.floor(Math.random() * 200) - 100;

    this.log(
      "随机滑动: 从(" +
        randomStartX +
        ", " +
        randomStartY +
        ")到(" +
        randomEndX +
        ", " +
        randomEndY +
        "), 持续时间: " +
        randomDuration +
        "ms"
    );
    swipe(randomStartX, randomStartY, randomEndX, randomEndY, randomDuration);
    this.randomSleep(1000, 2000);
  },

  // 检查元素是否在屏幕中间区域
  isInMiddleRegion: function (element, customRegion) {
    if (!element) return false;

    var bounds = element.bounds();
    if (!bounds) return false;

    var screenWidth = device.width;
    var screenHeight = device.height;

    var region = customRegion || {
      left: screenWidth * 0.2,
      top: screenHeight * 0.2,
      right: screenWidth * 0.8,
      bottom: screenHeight * 0.8,
    };

    var centerX = bounds.centerX();
    var centerY = bounds.centerY();

    return (
      centerX >= region.left &&
      centerX <= region.right &&
      centerY >= region.top &&
      centerY <= region.bottom
    );
  },

  // 查找元素在指定层级内的父元素中的目标元素
  findInParents: function (element, selector, maxDepth) {
    if (!element) {
      this.log("起始元素为空");
      return null;
    }

    if (!maxDepth) {
      maxDepth = 3;
    }

    this.log("开始查找父元素中的目标，最大深度: " + maxDepth);
    var current = element;
    var depth = 0;

    while (current && depth < maxDepth) {
      this.log("当前深度: " + depth);
      var parent = current.parent();
      if (!parent) {
        this.log("没有更多父元素");
        break;
      }

      this.log("查找父元素中的目标" + parent.className() + selector.toString());
      var result = parent.find(selector);
      if (result.length > 0) {
        this.log("在第 " + depth + " 层父元素中找到目标");
        return result[0];
      }

      current = parent;
      depth++;
    }

    this.log("在指定深度内未找到目标" );
    return null;
  },

  // 查找并点击文本
  clickText: function (textStr) {
    this.log("尝试查找并点击文本: " + textStr);
    var target = text(textStr).findOne(3000);
    if (target) {
      var bounds = target.bounds();
      if (bounds) {
        this.randomClick(bounds.centerX(), bounds.centerY());
        return true;
      }
    }
    return false;
  },

  // 查找并点击描述
  clickDesc: function (descStr) {
    this.log("尝试查找并点击描述: " + descStr);
    var target = desc(descStr).findOne(3000);
    if (target) {
      var bounds = target.bounds();
      if (bounds) {
        this.randomClick(bounds.centerX(), bounds.centerY());
        return true;
      }
    }
    return false;
  },

  // 检查文本是否存在
  textExists: function (textStr) {
    return text(textStr).exists();
  },
};

module.exports = Utils;
