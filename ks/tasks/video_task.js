var BaseTask = require("./base_task.js");
var Utils = require("../utils.js");
var App = require("../app.js");

function VideoTask() {
  BaseTask.call(this, "看视频赚金币", "观看视频获取金币");
}

VideoTask.prototype = Object.create(BaseTask.prototype);

VideoTask.prototype.waitForVideoComplete = function () {
  Utils.log("等待视频播放完成");

  // 随机等待时间 20-40秒
  var waitTime = Math.floor(Math.random() * 21) + 20; // 20-40秒
  Utils.log("将等待 " + waitTime + " 秒");

  // 等待视频播放完成
  for (var i = waitTime; i > 0; i--) {
    if (i % 5 === 0) {
      Utils.log("视频播放中，还剩 " + i + " 秒");
    }

    // 检查是否有弹窗需要处理
    if (PopupHandler.detectAndHandlePopups()) {
      Utils.randomSleep(800, 1500);
      continue;
    }

    sleep(1000);
  }

  Utils.log("视频播放完成");
  return true;
};

VideoTask.prototype.swipeToNextVideo = function () {
  Utils.log("滑动到下一个视频");

  // 获取屏幕尺寸
  var screenWidth = device.width;
  var screenHeight = device.height;

  // 计算滑动起点和终点
  var startX = screenWidth / 2;
  var startY = screenHeight * 0.8;
  var endX = screenWidth / 2;
  var endY = screenHeight * 0.2;

  // 执行滑动
  swipe(startX, startY, endX, endY, 500);
  Utils.randomSleep(1000, 2000);

  return true;
};

VideoTask.prototype.execute = function () {
  Utils.log("开始执行视频任务");

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

  // 查找"刷广告视频赚金币"文本
  Utils.log("查找'刷广告视频赚金币'文本");

  // 尝试查找包含"刷广告视频赚金币"的文本
  var videoTaskText = text("刷广告视频赚金币").findOne();
  if (
    videoTaskText &&
    videoTaskText.visibleToUser() &&
    Utils.isInMiddleRegion(videoTaskText, this.getMiddleRegion())
  ) {
    Utils.log("找到视频任务文本");
  } else {
    // 如果没找到，尝试滑动查找
    Utils.log("未找到视频任务文本，尝试滑动查找");
    for (var i = 0; i < 6; i++) {
      Utils.randomSwipe(
        device.width / 2,
        device.height * 0.7,
        device.width / 2,
        device.height * 0.3,
        500
      );
      Utils.randomSleep(1000, 2000);

      videoTaskText = text("刷广告视频赚金币").findOne();
      if (
        videoTaskText &&
        videoTaskText.visibleToUser() &&
        Utils.isInMiddleRegion(videoTaskText, this.getMiddleRegion())
      ) {
        Utils.log("滑动后找到可见的视频任务文本");
        break;
      }
    }
  }

  if (!videoTaskText) {
    Utils.log("未找到可见的视频任务文本");
    return false;
  }

  // 检查任务是否已完成
  var completedText = Utils.findInParents(videoTaskText, text("明天再来"), 4);
  Utils.log("completedText: " + completedText.bounds());
  if (
    completedText &&
    completedText.visibleToUser()
  ) {
    Utils.log("视频任务已完成");
    return false;
  }

  // 点击领福利按钮
  var goTaskBtn = Utils.findInParents(videoTaskText, text("领福利"));
  if (goTaskBtn) {
    Utils.log("找到领福利按钮，点击领福利");
    goTaskBtn.click();
    Utils.randomClick(
      goTaskBtn.bounds().centerX(),
      goTaskBtn.bounds().centerY()
    );
    Utils.randomSleep(1000, 2000);
  } else {
    Utils.log("未找到领福利按钮，判断是否在冷却中");
    if (this.checkCooldown(videoTaskText)) {
      Utils.log("任务在冷却中，等待冷却时间");
      return false;
    }
  }

  // 等待视频播放完成
  if (!this.waitForVideoComplete()) {
    Utils.log("视频未播放完成，任务终止");
    back();
    sleep(1000);
    return false;
  }

  // 滑动到下一个视频
  this.swipeToNextVideo();

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

module.exports = VideoTask;
