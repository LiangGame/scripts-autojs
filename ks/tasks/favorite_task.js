var BaseTask = require("./base_task.js");
var Utils = require("../utils.js");
var App = require("../app.js");

function FavoriteTask() {
  BaseTask.call(this, "收藏任务", "收藏指定数量的作品");
}

FavoriteTask.prototype = Object.create(BaseTask.prototype);

FavoriteTask.prototype.execute = function () {
  Utils.log("开始执行收藏任务");

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

  // 查找"收藏x个作品"文本
  Utils.log("查找'收藏x个作品'文本");

  // 尝试查找包含"收藏"和"作品"的文本
  var collectTaskText = textMatches(/收藏.*作品/).findOne();
  if (
    collectTaskText &&
    collectTaskText.visibleToUser() &&
    Utils.isInMiddleRegion(collectTaskText, this.getMiddleRegion())
  ) {
    Utils.log("找到收藏任务文本");
  } else {
    // 如果没找到，尝试滑动查找
    Utils.log("未找到收藏任务文本，尝试滑动查找");
    for (var i = 0; i < 6; i++) {
      Utils.randomSwipe(
        device.width / 2,
        device.height * 0.7,
        device.width / 2,
        device.height * 0.3,
        500
      );
      Utils.randomSleep(1000, 2000);

      collectTaskText = textMatches(/收藏.*作品/).findOne();
      if (
        collectTaskText &&
        collectTaskText.visibleToUser() &&
        Utils.isInMiddleRegion(collectTaskText, this.getMiddleRegion())
      ) {
        Utils.log("滑动后找到可见的收藏任务文本");
        break;
      }
    }
  }

  if (!collectTaskText) {
    Utils.log("未找到可见的收藏任务文本");
    return false;
  }

  // 检查任务是否已完成
  var completedText = Utils.findInParents(collectTaskText, text("已完成"));
  if (
    completedText &&
    completedText.visibleToUser()
  ) {
    Utils.log("收藏任务已完成");
    return false;
  }

  var goTaskBtn = Utils.findInParents(collectTaskText, text("去收藏"));
  if (goTaskBtn) {
    Utils.log("找到去收藏按钮，点击去收藏");
    Utils.randomClick(
      goTaskBtn.bounds().centerX(),
      goTaskBtn.bounds().centerY()
    );
    Utils.randomSleep(1000, 2000);
  } else {
    Utils.log("未找到去收藏按钮，无法完成任务");
    return false;
  }

  // 查找并点击收藏按钮
  Utils.log("查找收藏按钮");
  var collectElement = id("com.kuaishou.nebula:id/click_area_collect").findOne(
    5000
  );
  if (!collectElement) {
    Utils.log("未找到收藏按钮");
    return false;
  } else if (
    !collectElement.visibleToUser() ||
    !Utils.isInMiddleRegion(collectElement, this.getMiddleRegion())
  ) {
    Utils.log("收藏按钮不在中间区域，尝试重新查找");
    collectElement = id("com.kuaishou.nebula:id/click_area_collect").findOne(
      5000
    );
  }

  // 点击收藏按钮
  Utils.log("点击收藏按钮");
  var bounds = collectElement.bounds();
  if (bounds) {
    Utils.randomClick(bounds.centerX(), bounds.centerY());
    Utils.randomSleep(5000, 8000);
  } else {
    Utils.log("无法获取收藏按钮位置");
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

module.exports = FavoriteTask;
