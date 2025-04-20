// 任务管理器模块
var Utils = require("./utils.js");

const MAX_CONSECUTIVE_FAILURES = 3;

function TaskManager() {
  this.tasks = {};
  this.runningThreads = {};
}

TaskManager.prototype.addTask = function (task) {
  this.tasks[task.name] = task;
};

TaskManager.prototype.addThread = function (thread, taskName) {
  this.runningThreads[taskName] = thread;
};

TaskManager.prototype.stopTaskThreads = function (taskName) {
  if (this.runningThreads[taskName]) {
    this.runningThreads[taskName].interrupt();
    delete this.runningThreads[taskName];
  }
};

TaskManager.prototype.calculateTaskPriority = function (taskName) {
  var task = this.tasks[taskName];
  var priority = 0;

  // 如果任务从未执行过，给予较高优先级
  if (!task.lastExecuteTime) {
    priority += 100;
  } else {
    // 根据上次执行时间计算优先级
    var now = new Date().getTime();
    var timeSinceLastExecute = now - task.lastExecuteTime;
    // 时间间隔越长，优先级越高
    priority += Math.min(timeSinceLastExecute / (60 * 60 * 1000), 24);
  }

  // 如果任务成功率较高，提高优先级
  if (task.successRate > 0.8) {
    priority += 20;
  }

  // 如果任务收益较高，提高优先级
  if (task.reward > 100) {
    priority += 10;
  }

  return priority;
};

TaskManager.prototype.switchToAnotherTask = function (currentTaskName) {
  var maxPriority = -1;
  var nextTaskName = null;

  for (var taskName in this.tasks) {
    if (taskName === currentTaskName) continue;

    var priority = this.calculateTaskPriority(taskName);
    if (priority > maxPriority) {
      maxPriority = priority;
      nextTaskName = taskName;
    }
  }

  return nextTaskName;
};

TaskManager.prototype.executeTask = function (taskName, maxRuns) {
  var that = this;
  var task = this.tasks[taskName];
  if (!task) {
    Utils.log("任务不存在: " + taskName);
    return;
  }

  if (!task.enabled) {
    Utils.log("任务已禁用: " + taskName);
    return;
  }

  // 检查任务今天是否已完成
  if (task.isCompletedToday()) {
    Utils.log("任务今天已完成: " + taskName);
    // 切换到下一个任务
    var nextTaskName = this.switchToAnotherTask(taskName);
    if (nextTaskName) {
      this.executeTask(nextTaskName, this.tasks[nextTaskName].maxRuns);
    }
    return;
  }

  Utils.log("开始执行任务: " + taskName + "; maxRuns: " + maxRuns);

  var runs = 0;
  while (runs < maxRuns) {
    if (task.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
      Utils.log("任务连续失败次数过多，切换到其他任务: " + taskName);
      var nextTaskName = this.switchToAnotherTask(taskName);
      if (nextTaskName) {
        this.executeTask(nextTaskName, maxRuns);
      }
      return;
    }

    if (task.checkInMoneyPage() && task.checkCooldown()) {
      if (task.shouldEndCooldown()) {
        // 冷却已自动结束，继续执行任务
      } else {
        // 切换到另一个任务
        var newTaskName = this.switchToAnotherTask(taskName);
        if (newTaskName) {
          // 中断当前任务的线程
          this.stopTaskThreads(taskName);

          // 创建新线程执行新任务
          var newThread = threads.start(function () {
            that.executeTask(newTaskName, config.tasks[newTaskName].maxRuns);
          });

          // 将新线程添加到管理列表
          this.addThread(newThread, newTaskName);

          // 直接返回，不再继续执行当前任务
          return false;
        }
      }
    }

    try {
      var success = task.execute();
      if (success) {
        task.consecutiveFailures = 0;
        task.successCount++;
      } else {
        task.consecutiveFailures++;
        task.failureCount++;
      }
    } catch (e) {
      Utils.log("任务执行出错: " + taskName + ", 错误: " + e);
      task.consecutiveFailures++;
      task.failureCount++;
    }

    runs++;
    if (runs < maxRuns) {
      Utils.randomSleep(3000, 5000);
    }
  }

  Utils.log(
    "任务执行完成: " +
      taskName +
      ", 成功: " +
      task.successCount +
      ", 失败: " +
      task.failureCount
  );

  // 任务执行完成后，自动切换到下一个任务
  var nextTaskName = this.switchToAnotherTask(taskName);
  Utils.log("自动切换到下一个任务: " + nextTaskName);
  if (nextTaskName) {
    // 创建新线程执行新任务
    var newThread = threads.start(function () {
      that.executeTask(nextTaskName, that.tasks[nextTaskName].maxRuns);
    });

    // 将新线程添加到管理列表
    this.addThread(newThread, nextTaskName);
  }
};

TaskManager.prototype.executeAllEnabledTasks = function () {
  var enabledTasks = [];
  for (var taskName in this.tasks) {
    if (this.tasks[taskName].enabled) {
      enabledTasks.push(taskName);
    }
  }

  if (enabledTasks.length === 0) {
    Utils.log("没有启用的任务");
    return;
  }

  // 按优先级排序任务
  enabledTasks.sort((a, b) => {
    return this.calculateTaskPriority(b) - this.calculateTaskPriority(a);
  });

  // 执行最高优先级的任务
  var taskName = enabledTasks[0];
  this.executeTask(taskName, this.tasks[taskName].maxRuns);
};

module.exports = TaskManager;
