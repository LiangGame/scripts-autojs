var BaseTask = require("./base_task.js");
var Utils = require("../utils.js");
var App = require("../app.js");

function CommentTask() {
  BaseTask.call(this, "评论任务", "评论指定数量的作品");
  this.comments = [
    "真不错",
    "支持一下",
    "666",
    "加油",
    "继续努力",
    "看好你",
    "不错不错",
    "真棒",
    "继续加油",
    "支持",
  ];
}

CommentTask.prototype = Object.create(BaseTask.prototype);

CommentTask.prototype.execute = function () {
  Utils.log("开始执行评论任务");

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

  // 查找"评论x个作品"文本
  Utils.log("查找'评论x个作品'文本");

  // 尝试查找包含"评论"和"作品"的文本
  var commentTaskText = textMatches(/评论.*作品/).findOne();
  if (
    commentTaskText &&
    commentTaskText.visibleToUser() &&
    Utils.isInMiddleRegion(commentTaskText, this.getMiddleRegion())
  ) {
    Utils.log("找到评论任务文本");
  } else {
    // 如果没找到，尝试滑动查找
    Utils.log("未找到评论任务文本，尝试滑动查找");
    for (var i = 0; i < 6; i++) {
      Utils.randomSwipe(
        device.width / 2,
        device.height * 0.7,
        device.width / 2,
        device.height * 0.3,
        500
      );
      Utils.randomSleep(1000, 2000);

      commentTaskText = textMatches(/评论.*作品/).findOne();
      if (
        commentTaskText &&
        commentTaskText.visibleToUser() &&
        Utils.isInMiddleRegion(commentTaskText, this.getMiddleRegion())
      ) {
        Utils.log("滑动后找到可见的评论任务文本");
        break;
      }
    }
  }

  if (!commentTaskText) {
    Utils.log("未找到可见的评论任务文本");
    return false;
  }

  // 检查任务是否已完成
  var completedText = Utils.findInParents(commentTaskText, text("已完成"));
  if (
    completedText &&
    completedText.visibleToUser()
  ) {
    Utils.log("评论任务已完成");
    return false;
  }

  var goTaskBtn = Utils.findInParents(commentTaskText, text("去评论"));
  if (goTaskBtn) {
    Utils.log("找到去评论按钮，点击去评论");
    Utils.randomClick(
      goTaskBtn.bounds().centerX(),
      goTaskBtn.bounds().centerY()
    );
    Utils.randomSleep(1000, 2000);
  } else {
    Utils.log("未找到去评论按钮，无法完成任务");
    return false;
  }

  // 查找并点击评论按钮
  Utils.log("查找评论按钮");
  var commentElement = id("com.kuaishou.nebula:id/click_area_comment").findOne(
    5000
  );
  if (!commentElement) {
    Utils.log("未找到评论按钮");
    return false;
  } else if (
    !commentElement.visibleToUser() ||
    !Utils.isInMiddleRegion(commentElement, this.getMiddleRegion())
  ) {
    Utils.log("评论按钮不在中间区域，尝试重新查找");
    commentElement = id("com.kuaishou.nebula:id/click_area_comment").findOne(
      5000
    );
  }

  // 点击评论按钮
  Utils.log("点击评论按钮");
  var bounds = commentElement.bounds();
  if (bounds) {
    Utils.randomClick(bounds.centerX(), bounds.centerY());
    Utils.randomSleep(2000, 3000);
  } else {
    Utils.log("无法获取评论按钮位置");
    return false;
  }

  // 查找评论输入框
  Utils.log("查找评论输入框");
  var commentInput = id("com.kuaishou.nebula:id/comment_edit_text").findOne(
    3000
  );
  if (commentInput) {
    // 随机选择一条评论
    var comment =
      this.comments[Math.floor(Math.random() * this.comments.length)];
    commentInput.setText(comment);
    Utils.randomSleep(1000, 2000);

    // 点击发送按钮
    var sendButton = id("com.kuaishou.nebula:id/comment_send_btn").findOne(
      3000
    );
    if (sendButton) {
      bounds = sendButton.bounds();
      Utils.randomClick(bounds.centerX(), bounds.centerY());
      Utils.randomSleep(2000, 3000);
    }
  }

  Utils.log("评论成功");
  return true;
};

module.exports = CommentTask;
