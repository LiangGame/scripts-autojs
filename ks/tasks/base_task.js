// 基础任务类
var Utils = require("../utils.js");
var PopupHandler = require("../popup_handler.js");

function BaseTask(name, description) {
  this.name = name;
  this.description = description;
  this.enabled = true;
  this.isInMoneyPage = false;
  this.isInCooldown = false;
  this.cooldownStartTime = 0;
  this.lastExecuteTime = 0;
  this.successRate = 0;
  this.reward = 0;

  // 任务状态追踪
  this.consecutiveFailures = 0;
  this.totalExecutions = 0;
  this.successfulExecutions = 0;
  this.successCount = 0;
  this.failureCount = 0;

  // 任务配置
  this.maxRetries = 3;
  this.interval = 5000;
  this.adTimeout = 30000;

  this.middleRegion = null; // 添加 middleRegion 属性
  this.runCount = 0;
  this.maxRuns = 1;

  // 任务完成状态存储
  this.storagePath = "/sdcard/ks_task_status.json";
  this.loadTaskStatus();
}

BaseTask.prototype = {
  // 加载任务完成状态
  loadTaskStatus: function() {
    try {
      if (files.exists(this.storagePath)) {
        var content = files.read(this.storagePath);
        var status = JSON.parse(content);
        if (status[this.name]) {
          this.lastCompletedDate = status[this.name].lastCompletedDate;
        }
      }
    } catch (e) {
      Utils.log("加载任务状态失败: " + e);
    }
  },

  // 保存任务完成状态
  saveTaskStatus: function() {
    try {
      var status = {};
      if (files.exists(this.storagePath)) {
        var content = files.read(this.storagePath);
        status = JSON.parse(content);
      }
      
      status[this.name] = {
        lastCompletedDate: new Date().toLocaleDateString()
      };
      
      files.write(this.storagePath, JSON.stringify(status));
    } catch (e) {
      Utils.log("保存任务状态失败: " + e);
    }
  },

  // 检查任务今天是否已完成
  isCompletedToday: function() {
    if (!this.lastCompletedDate) {
      return false;
    }
    var today = new Date().toLocaleDateString();
    return this.lastCompletedDate === today;
  },

  // 检查是否在赚钱页面
  checkInMoneyPage: function () {
    Utils.log("检查是否在赚钱页面");
    var text1 = textContains("我的金币").findOne(1000);
    var text2 = textContains("日常任务").findOne(1000);
    var text3 = textContains("我的现金").findOne(1000);
    if (
      (text1 && text1.visibleToUser()) ||
      (text2 && text2.visibleToUser()) ||
      (text3 && text3.visibleToUser())
    ) {
      Utils.log("checkInMoneyPage => 当前在赚钱页面");
      return true;
    }
    return false;
  },

  // 检查是否在冷却中
  checkCooldown: function (element) {
    Utils.log("检查任务是否在冷却中");
    for (var i = 0; i < 3; i++) {
      if (element) {
        var cooldownTexts = Utils.findInParents(element, text("冷却中"), 3);
        if (cooldownTexts) {
          Utils.log("检查任务是否在冷却中 => 当前在冷却中");
          this.isInCooldown = true;
          this.cooldownStartTime = new Date().getTime();
          return true;
        }
      }
      sleep(1000);
    }
    this.isInCooldown = false;
    Utils.log("检查任务是否在冷却中 => 当前不在冷却中");
    return false;
  },

  // 检查冷却是否应该结束
  shouldEndCooldown: function () {
    if (!this.isInCooldown) return false;
    var now = new Date().getTime();
    var cooldownDuration = 10 * 60 * 1000; // 30分钟
    if (now - this.cooldownStartTime > cooldownDuration) {
      Utils.log("冷却时间已超过10分钟，自动结束冷却");
      this.isInCooldown = false;
      return true;
    }
    return false;
  },

  // 等待广告播放完成 - 由子类实现
  waitForAdComplete: function () {
    Utils.log("等待广告播放完成 - 基类方法，应由子类重写");
    return false;
  },

  // 执行任务 - 由子类实现
  execute: function () {
    Utils.log("执行任务 - 基类方法，应由子类重写");
    return false;
  },

  // 关闭广告
  closeAd: function () {
    Utils.log("尝试关闭广告");

    // 查找关闭按钮
    var closeButton = desc("关闭").findOne(3000);
    if (closeButton) {
      var bounds = closeButton.bounds();
      Utils.randomClick(bounds.centerX(), bounds.centerY());
      Utils.log("关闭广告");
      PopupHandler.detectAndHandlePopups();
      return true;
    }

    // 尝试查找其他可能的关闭按钮
    var closeButtons = descMatches(/关闭|关闭广告|跳过|跳过广告/).find();
    for (var i = 0; i < closeButtons.length; i++) {
      var bounds = closeButtons[i].bounds();
      Utils.randomClick(bounds.centerX(), bounds.centerY());
      Utils.log("点击其他关闭按钮");
      PopupHandler.detectAndHandlePopups();
      return true;
    }

    // 尝试点击返回键
    back();
    Utils.log("点击返回键");
    PopupHandler.detectAndHandlePopups();
    return true;
  },

  // 更新任务统计
  updateStats: function (success) {
    this.totalExecutions++;
    if (success) {
      this.successfulExecutions++;
      this.consecutiveFailures = 0;
      this.successRate = this.successfulExecutions / this.totalExecutions;
    } else {
      this.consecutiveFailures++;
    }
  },

  // 检查网络状态
  checkNetwork: function () {
    if (!device.isWifiConnected() && !device.isMobileDataEnabled()) {
      Utils.log("网络连接不可用");
      return false;
    }
    return true;
  },

  // 检查应用状态
  checkAppState: function () {
    if (!this.checkInMoneyPage()) {
      Utils.log("不在赚钱页面");
      return false;
    }
    if (this.checkCooldown()) {
      Utils.log("任务在冷却中");
      return false;
    }
    if (!this.checkNetwork()) {
      Utils.log("网络状态异常");
      return false;
    }
    return true;
  },

  // 执行任务前的准备工作
  prepare: function () {
    if (!this.checkAppState()) {
      return false;
    }
    return true;
  },

  // 执行任务后的清理工作
  cleanup: function () {
    this.lastExecuteTime = new Date().getTime();
    this.saveTaskStatus(); // 保存任务完成状态
    PopupHandler.detectAndHandlePopups();
    return true;
  },

  // 添加初始化 middleRegion 的方法
  initMiddleRegion: function () {
    if (!this.middleRegion) {
      var screenWidth = device.width;
      var screenHeight = device.height;
      this.middleRegion = {
        left: screenWidth * 0.2,
        top: screenHeight * 0.3,
        right: screenWidth * 0.8,
        bottom: screenHeight * 0.7,
      };
    }
    return this.middleRegion;
  },

  // 添加获取 middleRegion 的方法
  getMiddleRegion: function () {
    return this.initMiddleRegion();
  },
};

module.exports = BaseTask;
