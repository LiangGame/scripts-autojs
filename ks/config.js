// 任务配置
module.exports = {
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
      enabled: false,
      maxRuns: 500,
      interval: 2000,
    },
    // 任务2: 刷广告视频赚金币
    task2: {
      enabled: false,
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
      enabled: false,
      maxRuns: 1,
      interval: 3000,
    },
    // 任务5: 评论任务
    task5: {
      enabled: false,
      maxRuns: 1,
      interval: 3000,
    },
  },
};
