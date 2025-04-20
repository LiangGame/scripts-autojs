var WatchAdsTask = require('./watch_ads_task.js');
var VideoTask = require('./video_task.js');
var LikeTask = require('./like_task.js');
var FavoriteTask = require('./favorite_task.js');
var CommentTask = require('./comment_task.js');
var config = require('../config.js');

var TaskFactory = {
    // 创建所有任务实例
    createAllTasks: function() {
        var tasks = {
            watchAds: new WatchAdsTask(),
            task2: new VideoTask(),
            task3: new LikeTask(),
            task4: new FavoriteTask(),
            task5: new CommentTask()
        };
        
        // 从配置中设置任务状态
        for (var taskName in tasks) {
            if (config.tasks[taskName]) {
                tasks[taskName].enabled = config.tasks[taskName].enabled;
                if (config.tasks[taskName].maxRuns) {
                    tasks[taskName].maxRuns = config.tasks[taskName].maxRuns;
                }
                if (config.tasks[taskName].interval) {
                    tasks[taskName].interval = config.tasks[taskName].interval;
                }
            }
        }
        
        return tasks;
    },
    
    // 创建单个任务实例
    createTask: function(taskName) {
        var task;
        switch(taskName) {
            case 'watchAds':
                task = new WatchAdsTask();
                break;
            case 'task2':
                task = new VideoTask();
                break;
            case 'task3':
                task = new LikeTask();
                break;
            case 'task4':
                task = new FavoriteTask();
                break;
            case 'task5':
                task = new CommentTask();
                break;
            default:
                throw new Error('未知的任务类型: ' + taskName);
        }
        
        // 从配置中设置任务状态
        if (config.tasks[taskName]) {
            task.enabled = config.tasks[taskName].enabled;
            if (config.tasks[taskName].maxRuns) {
                task.maxRuns = config.tasks[taskName].maxRuns;
            }
            if (config.tasks[taskName].interval) {
                task.interval = config.tasks[taskName].interval;
            }
        }
        
        return task;
    }
};

module.exports = TaskFactory; 