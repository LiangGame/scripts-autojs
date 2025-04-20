// 应用功能模块
var Utils = require("./utils.js");

var App = {
  killAppNonRoot: function (packageName) {
    // 打开应用设置
    app.openAppSetting(packageName);

    // 这里需要模拟用户操作来找到并点击“结束运行”或类似按钮
    // 这部分通常依赖于设备的UI布局，因此可能需要定制化处理
    // 以下代码仅为示意，具体实现需要根据你的设备UI进行适配
    text("快手极速版").waitFor(); // 等待出现应用名
    if (text("强行停止").findOne(3000)) {
      // 查找“结束运行”按钮
      text("强行停止").findOne().click(); // 点击“结束运行”
      text("强行停止").findOne().click(); // 如果需要确认，则点击“确定”
    }

    // 返回桌面
    home();
  },
  // 启动快手极速版
  launch: function () {
    // 先关闭应用
    Utils.log("关闭应用");
    this.killAppNonRoot("com.kuaishou.nebula");
    Utils.randomSleep(5000, 8000); // 等待应用完全关闭

    Utils.log("启动快手极速版");
    if (currentPackage().includes("com.kuaishou.nebula")) {
      Utils.log("快手极速版已经在运行中");
      return true;
    }

    app.launch("com.kuaishou.nebula");
    sleep(5000);

    if (currentPackage().includes("com.kuaishou.nebula")) {
      Utils.log("快手极速版启动成功");
      return true;
    }
    Utils.log("快手极速版启动失败");
    return false;
  },

  // 检查登录状态
  checkLogin: function () {
    Utils.log("检查登录状态");
    if (text("登录").exists()) {
      Utils.log("未登录状态，请先登录");
      return false;
    }
    Utils.log("已登录状态");
    return true;
  },

  // 进入赚钱页面
  enterMoneyPage: function () {
    Utils.log("尝试进入赚钱页面");
    var moneyButton = desc("去赚钱").findOne(3000);
    if (moneyButton) {
      Utils.log("找到'去赚钱'按钮，尝试点击");
      moneyButton.click();
      Utils.log("点击'去赚钱'按钮完成");

      Utils.log("等待赚钱页面加载...");
      var success = false;

      if (
        textContains("看广告得金币").findOne(5000) ||
        textContains("我的金币").findOne(5000) ||
        textContains("日常任务").findOne(5000)
      ) {
        Utils.log("确认已进入赚钱页面");
        success = true;
      }

      if (success) {
        return true;
      }
      Utils.log("点击'去赚钱'后未检测到赚钱页面特征");
    }

    Utils.log("无法进入赚钱页面，所有方法都失败");
    return false;
  },
};

module.exports = App;
