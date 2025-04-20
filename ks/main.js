// 主脚本
var Utils = require("./utils.js");
var App = require("./app.js");
var PopupHandler = require("./popup_handler.js");
var TaskManager = require("./task_manager.js");
var TaskFactory = require("./tasks/task_factory.js");

// 创建任务管理器实例
var taskManager = new TaskManager();

// 配置参数
var config = {
  // 每次运行间隔时间（毫秒）
  interval: 2000,
  // 最大运行次数
  maxRuns: 50,
  // 广告等待超时时间（毫秒）
  adTimeout: 80000,
  // 是否开启日志
  debug: true,
  // 任务配置
  tasks: {
    // 任务1: 看广告得金币
    watchAds: {
      enabled: true,
      maxRuns: 500,
      interval: 2000,
    },
    // 任务2: 刷广告视频赚金币
    task2: {
      enabled: true,
      maxRuns: 50,
      interval: 3000,
    },
    // 任务3: 点赞任务
    task3: {
      enabled: true,
      maxRuns: 1,
      interval: 3000,
    },
    // 任务4: 收藏任务
    task4: {
      enabled: true,
      maxRuns: 1,
      interval: 3000,
    },
    // 任务5: 评论任务
    task5: {
      enabled: true,
      maxRuns: 1,
      interval: 3000,
    },
  },
};

// 创建任务实例
function createTasks() {
  var tasks = TaskFactory.createAllTasks();
  for (var taskName in tasks) {
    taskManager.addTask(tasks[taskName]);
  }
}

// 主函数
function main() {
  // 请求截图权限
  if (!requestScreenCapture()) {
    toast("请求截图权限失败");
    exit();
  }

  // 启动应用
  if (!App.launch()) {
    toast("无法启动快手极速版，请检查应用是否安装");
    exit();
  }

  // 检查登录状态
  if (!App.checkLogin()) {
    toast("请先登录快手极速版");
    exit();
  }

  // 创建任务实例
  createTasks();

  // 执行优先级最高的任务
  taskManager.executeAllEnabledTasks();

  // 等待任务执行完成
  while (Object.keys(taskManager.runningThreads).length > 0) {
    sleep(1000);
  }

  toast("任务执行完成");
}

// 启动脚本
main();
