var BaseTask = require("./base_task.js");
var Utils = require("../utils.js");
var PopupHandler = require("../popup_handler.js");
var App = require("../app.js");

function WatchAdsTask() {
  BaseTask.call(this, "看广告赚金币", "观看广告视频获取金币");
}

WatchAdsTask.prototype = Object.create(BaseTask.prototype);

WatchAdsTask.prototype.waitForAdComplete = function () {
  Utils.log("等待广告播放完成");

  // 检查是否是直播间广告
  var isLiveRoom = id("com.kuaishou.nebula:id/live_room_container").findOne(
    1000
  );
  if (isLiveRoom) {
    Utils.log("检测到直播间广告");
    // 直播间广告必须停留60秒以上
    var waitTime = 60;
    Utils.log("将等待 " + waitTime + " 秒");

    // 等待广告播放完成
    for (var i = waitTime; i > 0; i--) {
      if (i % 5 === 0) {
        Utils.log("广告播放中，还剩 " + i + " 秒");
      }

      // 检查是否有弹窗需要处理
      if (PopupHandler.detectAndHandlePopups()) {
        Utils.randomSleep(800, 1500);
        continue;
      }

      sleep(1000);
    }
  } else {
    Utils.log("检测到普通视频广告");
    // 等待广告播放完成
    var startTime = new Date().getTime();
    var maxWaitTime = 35 * 1000; // 最大等待35秒

    while (true) {
      // 检查是否已成功领取金币
      var successText = textMatches(/已成功领取.*金币/).findOne(1000);
      if (successText) {
        Utils.log("检测到广告播放完成，已成功领取金币");
        break;
      }

      // 检查是否正在播放中
      var playingText = textMatches(/.*后可领取.*金币/).findOne(1000);
      if (playingText) {
        Utils.log("广告正在播放中");
        // 检查是否有弹窗需要处理
        if (PopupHandler.detectAndHandlePopups()) {
          Utils.randomSleep(800, 1500);
          continue;
        }
      } else {
        Utils.log("未检测到广告播放状态，等待中...");
      }

      // 检查是否超时
      if (new Date().getTime() - startTime > maxWaitTime) {
        Utils.log("等待超时，强制结束");
        break;
      }

      sleep(1000);
    }
  }

  Utils.log("广告播放完成");
  return true;
};

WatchAdsTask.prototype.closeAd = function () {
  Utils.log("尝试关闭广告");

  // 尝试点击关闭按钮
  var closeBtn = id("tt_video_ad_close").findOne(1000);
  if (closeBtn) {
    Utils.log("找到关闭按钮，点击关闭");
    closeBtn.click();
    sleep(1000);
    return true;
  }

  // 尝试点击跳过按钮
  var skipBtn = text("跳过").findOne(1000);
  if (skipBtn) {
    Utils.log("找到跳过按钮，点击跳过");
    skipBtn.click();
    sleep(1000);
    return true;
  }

  // 尝试点击返回按钮
  var backBtn = id("com.kuaishou.nebula:id/back_button").findOne(1000);
  if (backBtn) {
    Utils.log("找到返回按钮，点击返回");
    backBtn.click();
    sleep(1000);
    return true;
  }

  Utils.log("未找到关闭按钮，尝试返回键");
  back();
  sleep(1000);
  return true;
};

WatchAdsTask.prototype.execute = function () {
  Utils.log("开始执行广告任务");

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

  if (this.checkInMoneyPage()) {
    // 查找"看广告得金币"文本
    Utils.log("查找'看广告得金币'文本");

    // 尝试查找包含"看广告得金币"的文本
    var adsTaskText = text("看广告得金币").findOne();
    if (
      adsTaskText &&
      adsTaskText.visibleToUser() &&
      Utils.isInMiddleRegion(adsTaskText, this.getMiddleRegion())
    ) {
      Utils.log("找到广告任务文本");
    } else {
      // 如果没找到，尝试滑动查找
      Utils.log("未找到广告任务文本，尝试滑动查找");
      for (var i = 0; i < 6; i++) {
        Utils.randomSwipe(
          device.width / 2,
          device.height * 0.7,
          device.width / 2,
          device.height * 0.3,
          500
        );
        Utils.randomSleep(1000, 2000);

        adsTaskText = text("看广告得金币").findOne();
        if (
          adsTaskText &&
          adsTaskText.visibleToUser() &&
          Utils.isInMiddleRegion(adsTaskText, this.getMiddleRegion())
        ) {
          Utils.log("滑动后找到可见的广告任务文本");
          break;
        }
      }
    }

    if (!adsTaskText) {
      Utils.log("未找到可见的广告任务文本");
      return false;
    }

    // 检查任务是否已完成
    var completedText = Utils.findInParents(adsTaskText, text("已完成"));
    if (
      completedText &&
      completedText.visibleToUser() &&
      Utils.isInMiddleRegion(completedText, this.getMiddleRegion())
    ) {
      Utils.log("广告任务已完成");
      return false;
    }

    // 点击领福利按钮
    var goTaskBtn = Utils.findInParents(adsTaskText, text("领福利"));
    if (goTaskBtn) {
      Utils.log("找到领福利按钮，点击领福利");
      Utils.randomClick(
        goTaskBtn.bounds().centerX(),
        goTaskBtn.bounds().centerY()
      );
      Utils.randomSleep(1000, 2000);
    } else {
      Utils.log("未找到领福利按钮，判断是否在冷却中");
      if (this.checkCooldown(adsTaskText)) {
        Utils.log("任务在冷却中，等待冷却时间");
        return false;
      }
    }
  }

  // 等待广告播放完成
  if (!this.waitForAdComplete()) {
    Utils.log("广告未播放完成，任务终止");
    back();
    sleep(1000);
    return false;
  }

  // 关闭广告
  this.closeAd();

  PopupHandler.detectAndHandlePopups();

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

module.exports = WatchAdsTask;
