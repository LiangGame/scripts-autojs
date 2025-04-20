// 弹窗处理模块
var Utils = require("./utils.js");

var PopupHandler = {
  // 检测并处理所有类型的弹窗
  detectAndHandlePopups: function () {
    Utils.log("检测是否有弹窗");

    return (
      this.handleRewardPopup() ||
      this.handleContinueWatchingPopup() ||
      this.handleDownloadPopup() ||
      this.handleLikePopup() ||
      this.handleSuccessPopup()
    );
  },

  // 处理奖励弹窗
  handleRewardPopup: function () {
    var popupText = textMatches(/再看一个.*/).findOne(1000);
    if (popupText && Utils.isInMiddleRegion(popupText)) {
      var rewardButton = text("领取奖励").findOne(1000);
      if (rewardButton && Utils.isInMiddleRegion(rewardButton)) {
        var bounds = rewardButton.bounds();
        Utils.randomClick(bounds.centerX(), bounds.centerY());
        Utils.log("点击领取奖励");
        return true;
      }
    }
    return false;
  },

  // 处理继续观看弹窗
  handleContinueWatchingPopup: function () {
    var continueWatchingText = textMatches(/再看.*秒/).findOne(1000);
    if (continueWatchingText && Utils.isInMiddleRegion(continueWatchingText)) {
      Utils.log("检测到'再看xx秒'弹窗");
      var continueButton = text("继续观看").findOne(1000);
      if (continueButton && Utils.isInMiddleRegion(continueButton)) {
        var bounds = continueButton.bounds();
        Utils.randomClick(bounds.centerX(), bounds.centerY());
        Utils.log("点击'继续观看'按钮完成");
        return true;
      }
    }
    return false;
  },

  // 处理下载弹窗
  handleDownloadPopup: function () {
    var downloadText = textMatches(/下载并体验[\s\S]*/).findOne(1000);
    var otherText = textMatches(/点击额外获取.*金币/).findOne(1000);
    if (
      (downloadText && Utils.isInMiddleRegion(downloadText)) ||
      (otherText && Utils.isInMiddleRegion(otherText))
    ) {
      Utils.log("检测到下载相关弹窗");
      var giveUpButton = text("放弃奖励").findOne(1000);
      if (giveUpButton && Utils.isInMiddleRegion(giveUpButton)) {
        var bounds = giveUpButton.bounds();
        Utils.randomClick(bounds.centerX(), bounds.centerY());
        Utils.log("点击'放弃奖励'按钮");
        return true;
      }
      back();
      Utils.randomSleep(800, 1500);
      return true;
    }
    return false;
  },

  // 处理关注弹窗
  handleLikePopup: function () {
    var likeText = textMatches(/看了这么久，留个关注再走吧.*/).findOne(1000);
    var likeText2 = textMatches(/猜你喜欢.*/).findOne(1000);
    if (
      (likeText && Utils.isInMiddleRegion(likeText)) ||
      (likeText2 && Utils.isInMiddleRegion(likeText2))
    ) {
      Utils.log("检测到'关注'or'猜你喜欢'弹窗");
      var exitButton = text("退出直播间").findOne(1000);
      if (exitButton && Utils.isInMiddleRegion(exitButton)) {
        var bounds = exitButton.bounds();
        Utils.randomClick(bounds.centerX(), bounds.centerY());
        Utils.log("点击'退出直播间'按钮完成");
        return true;
      }
    }
    return false;
  },

  // 处理成功领取弹窗
  handleSuccessPopup: function () {
    var successText = textMatches(/已成功领取.*金币/).findOne(1000);
    if (successText && Utils.isInMiddleRegion(successText)) {
      Utils.log("检测到'已成功领取xxx金币'弹窗");
      var closeButton = desc("关闭").findOne(1000);
      if (closeButton && Utils.isInMiddleRegion(closeButton)) {
        var bounds = closeButton.bounds();
        Utils.randomClick(bounds.centerX(), bounds.centerY());
        Utils.log("关闭'已成功领取xxx金币'弹窗");
        return true;
      }
    }
    return false;
  },
};

module.exports = PopupHandler;
