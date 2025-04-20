var BaseTask = require("./base_task.js");
var Utils = require("../utils.js");
var App = require("../app.js");

function LikeTask() {
  BaseTask.call(this, "点赞任务", "点赞指定数量的作品");
}

LikeTask.prototype = Object.create(BaseTask.prototype);

LikeTask.prototype.execute = function () {
  Utils.log("开始执行点赞任务");

  // 检查是否在赚钱页面
  if (!this.isInMoneyPage) {
    Utils.log("未在赚钱页面，尝试进入");
    if (!App.enterMoneyPage()) {
      Utils.log("进入赚钱页面失败");
      return false;
    }
    this.isInMoneyPage = true;
  }

  Utils.randomSleep(3000, 5000);

  // 查找"点赞x个作品"文本
  Utils.log("查找'点赞x个作品'文本");

  // 尝试查找包含"点赞"和"作品"的文本
  var likeTaskText = textMatches(/点赞.*作品/).findOne();
  if (
    likeTaskText &&
    likeTaskText.visibleToUser() &&
    Utils.isInMiddleRegion(likeTaskText, this.getMiddleRegion())
  ) {
    Utils.log("找到点赞任务文本");
  } else {
    // 如果没找到，尝试滑动查找
    Utils.log("未找到点赞任务文本，尝试滑动查找");
    for (var i = 0; i < 6; i++) {
      Utils.randomSwipe(
        device.width / 2,
        device.height * 0.7,
        device.width / 2,
        device.height * 0.3,
        500
      );
      Utils.randomSleep(1000, 2000);

      likeTaskText = textMatches(/点赞.*作品/).findOne();
      if (
        likeTaskText &&
        likeTaskText.visibleToUser() &&
        Utils.isInMiddleRegion(likeTaskText, this.getMiddleRegion())
      ) {
        Utils.log("滑动后找到可见的点赞任务文本");
        break;
      }
    }
  }

  if (!likeTaskText) {
    Utils.log("未找到可见的点赞任务文本");
    return false;
  }

  // 检查任务是否已完成
  var completedText = Utils.findInParents(likeTaskText, text("已完成"), 3);
  if (
    completedText &&
    completedText.visibleToUser()
  ) {
    Utils.log("点赞任务已完成");
    return false;
  }

  // 查找"去点赞"按钮
  var goTaskBtn = Utils.findInParents(likeTaskText, text("去点赞"));
  if (goTaskBtn) {
    Utils.log("找到去点赞按钮，点击去点赞");
    Utils.randomClick(
      goTaskBtn.bounds().centerX(),
      goTaskBtn.bounds().centerY()
    );
    Utils.randomSleep(1000, 2000);
  } else {
    Utils.log("未找到去点赞按钮，无法完成任务");
    return false;
  }

  // 查找并点击点赞按钮
  Utils.log("查找点赞按钮");
  var likeElement = id("com.kuaishou.nebula:id/click_area_like").findOne(5000);
  if (!likeElement) {
    Utils.log("未找到点赞按钮");
    return false;
  } else if (
    !likeElement.visibleToUser() ||
    !Utils.isInMiddleRegion(likeElement, this.getMiddleRegion())
  ) {
    Utils.log("点赞按钮不在中间区域，尝试重新查找");
    likeElement = id("com.kuaishou.nebula:id/click_area_like").findOne(5000);
  }

  // 点击点赞按钮
  Utils.log("点击点赞按钮");
  var bounds = likeElement.bounds();
  if (bounds) {
    Utils.randomClick(bounds.centerX(), bounds.centerY());
    Utils.randomSleep(2000, 3000);
  } else {
    Utils.log("无法获取点赞按钮位置");
    return false;
  }

  // 更新执行次数
  this.runCount++;

  // 如果未达到最大执行次数，继续执行
  if (this.runCount < this.maxRuns) {
    Utils.log(
      "任务执行成功，继续执行下一次 (当前: " +
        this.runCount +
        "/" +
        this.maxRuns +
        ")"
    );
    sleep(2000); // 等待2秒后继续执行
    return this.execute();
  }

  // 如果达到最大执行次数，重置计数器
  if (this.runCount >= this.maxRuns) {
    Utils.log("任务已达到最大执行次数: " + this.maxRuns);
    this.runCount = 0;
  }

  return true;
};

module.exports = LikeTask;
