// 快手极速版自动任务脚本
// 作者：Claude
// 说明：此脚本仅用于学习研究，请勿用于非法用途

// 请求截图权限
if (!requestScreenCapture()) {
    toast("请求截图权限失败");
    exit();
}

// 配置参数
const config = {
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
            maxRuns: 50,
            interval: 2000
        },
        // 任务2: 刷广告视频赚金币
        task2: {
            enabled: false,
            maxRuns: 50,
            interval: 3000
        },
        // 任务3: 待实现
        task3: {
            enabled: false,
            maxRuns: 10,
            interval: 3000
        },
        // 任务4: 待实现
        task4: {
            enabled: false,
            maxRuns: 10,
            interval: 3000
        }
    }
};

// ===================== 通用工具函数 =====================

// 日志函数
function log(text) {
    if (config.debug) {
        console.log(text);
        toast(text);
    }
}

// 查找并点击文本
function clickText(textStr) {
    log("尝试查找并点击文本: " + textStr);

    // 方法1: 使用findOne
    let target = text(textStr).findOne(3000);
    if (target) {
        log("找到文本: " + textStr + ", 尝试点击");
        target.click();
        log("点击完成: " + textStr);
        sleep(1000);
        return true;
    }

    // 方法2: 使用find
    let targets = text(textStr).find();
    if (targets.length > 0) {
        log("找到多个文本: " + textStr + ", 尝试点击第一个");
        targets[0].click();
        log("点击完成: " + textStr);
        sleep(1000);
        return true;
    }

    // 方法3: 使用bounds点击
    let bounds = text(textStr).bounds();
    if (bounds) {
        log("找到文本边界: " + textStr + ", 尝试点击中心位置");
        click(bounds.centerX(), bounds.centerY());
        log("点击完成: " + textStr);
        sleep(1000);
        return true;
    }

    log("未找到文本: " + textStr);
    return false;
}

// 查找并点击描述
function clickDesc(descStr) {
    log("尝试查找并点击描述: " + descStr);

    // 方法1: 使用findOne
    let target = desc(descStr).findOne(3000);
    if (target) {
        log("找到描述: " + descStr + ", 尝试点击");
        target.click();
        log("点击完成: " + descStr);
        sleep(1000);
        return true;
    }

    // 方法2: 使用find
    let targets = desc(descStr).find();
    if (targets.length > 0) {
        log("找到多个描述: " + descStr + ", 尝试点击第一个");
        targets[0].click();
        log("点击完成: " + descStr);
        sleep(1000);
        return true;
    }

    // 方法3: 使用bounds点击
    let bounds = desc(descStr).bounds();
    if (bounds) {
        log("找到描述边界: " + descStr + ", 尝试点击中心位置");
        click(bounds.centerX(), bounds.centerY());
        log("点击完成: " + descStr);
        sleep(1000);
        return true;
    }

    log("未找到描述: " + descStr);
    return false;
}

// 查找文本是否存在
function textExists(textStr) {
    return text(textStr).exists();
}

// 检查元素是否在屏幕中间区域
function isInMiddleRegion(element, region) {
    if (!element) return false;

    let bounds = element.bounds();
    if (!bounds) return false;

    // 计算元素的中心点
    let centerX = bounds.centerX();
    let centerY = bounds.centerY();

    // 检查中心点是否在中间区域内
    return (centerX >= region.left && centerX <= region.right &&
        centerY >= region.top && centerY <= region.bottom);
}

// 查找元素在指定层级内的父元素中
function findInParents(element, selector, maxDepth) {
    if (!element) {
        log("起始元素为空");
        return null;
    }

    log("开始查找父元素中的目标，最大深度: " + maxDepth);
    let current = element;
    let depth = 0;

    while (current && depth < maxDepth) {
        log("当前深度: " + depth);
        let parent = current.parent();
        if (!parent) {
            log("没有更多父元素");
            break;
        }

        log("查找父元素中的目标");
        let result = parent.find(selector);
        if (result.length > 0) {
            log("在第 " + depth + " 层父元素中找到目标，数量: " + result.length);
            return result;
        }

        current = parent;
        depth++;
    }

    log("在指定深度内未找到目标");
    return null;
}

// ===================== 应用基础功能 =====================

// 启动快手极速版
function launchApp() {
    log("启动快手极速版");
    // 检查应用是否已经运行
    if (currentPackage().includes("com.kuaishou.nebula")) {
        log("快手极速版已经在运行中");
        return true;
    }

    // 启动应用
    app.launch("com.kuaishou.nebula");
    sleep(5000); // 等待应用启动

    // 检查是否成功启动
    if (currentPackage().includes("com.kuaishou.nebula")) {
        log("快手极速版启动成功");
        return true;
    } else {
        log("快手极速版启动失败");
        return false;
    }
}

// 检查登录状态
function checkLogin() {
    log("检查登录状态");
    // 如果存在"登录"按钮，则表示未登录
    if (text("登录").exists()) {
        log("未登录状态，请先登录");
        return false;
    }
    log("已登录状态");
    return true;
}

// 进入赚钱页面
function enterMoneyPage() {
    log("尝试进入赚钱页面");

    // 使用desc属性查找"去赚钱"按钮
    log("尝试使用desc属性查找'去赚钱'按钮");
    let moneyButton = desc("去赚钱").findOne(3000);
    if (moneyButton) {
        log("找到'去赚钱'按钮，尝试点击");
        moneyButton.click();
        log("点击'去赚钱'按钮完成");

        // 使用waitFor等待赚钱页面特征元素出现
        log("等待赚钱页面加载...");
        let success = false;

        // 等待"看广告得金币"元素出现
        if (textContains("看广告得金币").findOne(5000)) {
            log("检测到'看广告得金币'元素，确认已进入赚钱页面");
            success = true;
        }
        // 等待"我的金币"元素出现
        else if (textContains("我的金币").findOne(5000)) {
            log("检测到'我的金币'元素，确认已进入赚钱页面");
            success = true;
        }
        // 等待"日常任务"元素出现
        else if (textContains("日常任务").findOne(5000)) {
            log("检测到'日常任务'元素，确认已进入赚钱页面");
            success = true;
        }

        if (success) {
            return true;
        } else {
            log("点击'去赚钱'后未检测到赚钱页面特征，可能未成功进入");
        }
    }

    log("无法进入赚钱页面，所有方法都失败");
    return false;
}

// 全局弹窗检测函数
function detectAndHandlePopups() {
    log("检测是否有弹窗");

    // 获取屏幕尺寸
    let screenWidth = device.width;
    let screenHeight = device.height;

    // 定义中间区域的范围（屏幕中间60%的区域）
    let middleRegion = {
        left: screenWidth * 0.2,
        top: screenHeight * 0.2,
        right: screenWidth * 0.8,
        bottom: screenHeight * 0.8
    };

    // 查找"再看一个xxxx"的弹窗
    let popupText = textMatches(/再看一个.*/).findOne(1000);
    if (popupText && isInMiddleRegion(popupText, middleRegion)) {
        // 点击"领取奖励"按钮
        let rewardButton = text("领取奖励").findOne(1000);
        if (rewardButton && isInMiddleRegion(rewardButton, middleRegion)) {
            rewardButton.click();
            log("点击领取奖励");
            sleep(1000);
            return true;
        }
    }

    // 查找"已成功领取xxx金币"的弹窗
    let successText = textMatches(/已成功领取.*金币/).findOne(1000);
    if (successText && isInMiddleRegion(successText, middleRegion)) {
        log("检测到'已成功领取xxx金币'弹窗");
        // 尝试点击"关闭"按钮
        let closeButton = desc("关闭").findOne(1000);
        if (closeButton && isInMiddleRegion(closeButton, middleRegion)) {
            closeButton.click();
            log("关闭'已成功领取xxx金币'弹窗");
            sleep(1000);
            return true;
        }
    }

    // 查找"恭喜获得xxx金币"的弹窗
    let congratsText = textMatches(/恭喜获得.*金币/).findOne(1000);
    if (congratsText && isInMiddleRegion(congratsText, middleRegion)) {
        log("检测到'恭喜获得xxx金币'弹窗");
        // 尝试点击"关闭"按钮
        let closeButton = desc("关闭").findOne(1000);
        if (closeButton && isInMiddleRegion(closeButton, middleRegion)) {
            closeButton.click();
            log("关闭'恭喜获得xxx金币'弹窗");
            sleep(1000);
            return true;
        }
    }

    // 查找"下载并体验"的弹窗
    let downloadText = textMatches(/下载并体验[\s\S]*/).findOne(1000);
    let otherText = textMatches(/点击额外获取.*金币/).findOne(1000);
    if ((downloadText && isInMiddleRegion(downloadText, middleRegion)) ||
        (otherText && isInMiddleRegion(otherText, middleRegion))) {
        log("检测到'下载并体验'or'点击额外获取金币'弹窗");
        // 尝试点击"放弃奖励"按钮
        let giveUpButton = text("放弃奖励").findOne(1000);
        if (giveUpButton && isInMiddleRegion(giveUpButton, middleRegion)) {
            giveUpButton.click();
            log("点击'放弃奖励'按钮");
            sleep(1000);
            return true;
        }

        // 如果没有找到"放弃奖励"按钮，尝试查找包含"放弃"的文本
        let giveUpTexts = textMatches(/.*放弃.*/).find();
        for (let i = 0; i < giveUpTexts.length; i++) {
            if (isInMiddleRegion(giveUpTexts[i], middleRegion)) {
                log("找到包含'放弃'的文本，点击");
                giveUpTexts[i].click();
                log("点击包含'放弃'的文本完成");
                sleep(1000);
                return true;
            }
        }

        // 如果没有找到任何可点击的按钮，尝试点击返回键
        log("未找到可点击的按钮，尝试返回");
        back();
        sleep(1000);
        return true;
    }

    // 查找"再看xx秒"的弹窗
    let continueWatchingText = textMatches(/再看.*秒/).findOne(1000);
    if (continueWatchingText && isInMiddleRegion(continueWatchingText, middleRegion)) {
        log("检测到'再看xx秒'弹窗");
        // 尝试点击"继续观看"按钮
        let continueButton = text("继续观看").findOne(1000);
        if (continueButton && isInMiddleRegion(continueButton, middleRegion)) {
            log("找到'继续观看'按钮，点击");
            continueButton.parent().click();
            log("点击'继续观看'按钮完成");
            sleep(1000);
            return true;
        }

        // 如果没有找到"继续观看"按钮，尝试查找包含"继续"的文本
        let continueTexts = textMatches(/.*继续.*/).find();
        for (let i = 0; i < continueTexts.length; i++) {
            if (isInMiddleRegion(continueTexts[i], middleRegion)) {
                log("找到包含'继续'的文本，点击");
                continueTexts[i].click();
                log("点击包含'继续'的文本完成");
                sleep(1000);
                return true;
            }
        }
    }

    // 查找"留个关注"的弹窗
    let likeText = textMatches(/看了这么久，留个关注再走吧.*/).findOne(1000);
    let likeText2 = textMatches(/猜你喜欢.*/).findOne(1000);
    if (likeText && isInMiddleRegion(likeText, middleRegion) || likeText2 && isInMiddleRegion(likeText2, middleRegion)) {
        log("检测到'关注'or'猜你喜欢'弹窗");
        // 尝试点击"继续观看"按钮
        let continueButton = text("退出直播间").findOne(1000);
        if (continueButton && isInMiddleRegion(continueButton, middleRegion)) {
            log("找到'退出直播间'按钮，点击");
            continueButton.parent().click();
            log("点击'退出直播间'按钮完成");
            sleep(1000);
            return true;
        }

        // 如果没有找到"退出直播间"按钮，尝试查找包含"退出"的文本
        let continueTexts = textMatches(/.*退出.*/).find();
        for (let i = 0; i < continueTexts.length; i++) {
            if (isInMiddleRegion(continueTexts[i], middleRegion)) {
                log("找到包含'退出'的文本，点击");
                continueTexts[i].parent().click();
                log("点击包含'退出'的文本完成");
                sleep(1000);
                return true;
            }
        }
    }

    return false;
}

// 处理奖励弹窗
function handleRewardPopup() {
    // 使用全局弹窗检测函数
    return detectAndHandlePopups();
}

// ===================== 任务模块 =====================

// 任务1: 看广告得金币
const TaskWatchAds = {
    name: "看广告得金币",
    description: "自动观看广告获取金币",
    isInMoneyPage: false,
    
    // 点击领福利按钮
    clickRewardButton: function(btnText) {
        log("查找领福利按钮");

        // 查找"看广告得金币"右侧的"领福利"文本
        log("尝试查找'看广告得金币'右侧的'领福利'文本");
        let videoText = text("看广告得金币").findOne(3000);
        if (videoText) {
            log("找到'看广告得金币'文本");

            // 尝试在不同层级的父元素中查找"领福利"文本
            let maxDepth = 5; // 最大遍历深度
            let rewardTexts = findInParents(videoText, text(btnText), maxDepth);

            if (rewardTexts && rewardTexts.length > 0) {
                log("找到'" + btnText + "'文本，尝试点击");
                rewardTexts[0].click();
                log("点击'" + btnText + "'文本完成");
                sleep(1000);
                return true;
            }
        }

        log("未找到领福利按钮");
        return false;
    },
    
    // 等待广告播放完成
    waitForAdComplete: function() {
        log("等待广告播放完成");
        let startTime = new Date().getTime();
        sleep(3000);
        while (new Date().getTime() - startTime < config.adTimeout) {
            // 首先检查是否是直播间
            let liveContainer = id("com.kuaishou.nebula.live_audience_plugin:id/live_player_float_element_container").findOne(5000);
            if (liveContainer) {
                log("检测到直播间任务，等待60秒后完成");
                // 等待60秒
                sleep(60000);
                log("直播间任务完成");
                return true;
            } else {
                // 检查是否有"xx秒后可领取xxx金币"的文本
                let waitingText = textMatches(/.*s后可领取.*金币.*/).findOne(3000);
                if (waitingText) {
                    log("广告正在播放中...");
                    // 检测并处理弹窗
                    detectAndHandlePopups();
                    sleep(1000);
                    continue;
                }

                // 检查是否有"已成功领取xxx金币"的文本
                let successText = textMatches(/已成功领取.*金币.*/).findOne(3000);
                if (successText) {
                    log("广告播放完成");
                    return true;
                }
            }

            // 检测并处理其他弹窗
            detectAndHandlePopups();

            sleep(1000);
        }

        log("广告等待超时");
        return false;
    },
    
    // 关闭广告
    closeAd: function() {
        log("尝试关闭广告");

        // 查找"已成功领取xxx金币"右侧的"X"按钮
        let closeButton = desc("关闭").findOne(3000);
        if (closeButton) {
            closeButton.click();
            log("关闭广告");
            sleep(1000);

            // 检测并处理弹窗
            detectAndHandlePopups();
            return true;
        }

        // 尝试查找其他可能的关闭按钮
        let closeButtons = descMatches(/关闭|关闭广告|跳过|跳过广告/).find();
        for (let i = 0; i < closeButtons.length; i++) {
            closeButtons[i].click();
            log("点击其他关闭按钮");
            sleep(1000);

            // 检测并处理弹窗
            detectAndHandlePopups();
            return true;
        }

        // 尝试点击返回键
        back();
        log("点击返回键");
        sleep(1000);

        // 检测并处理弹窗
        detectAndHandlePopups();
        return true;
    },
    checkInMoneyPage: function() {
        if (textContains("看广告得金币").findOne(1000) || textContains("我的金币").findOne(1000) || textContains("日常任务").findOne(1000)) {
            log("当前在赚钱页面");
            return true;
        }
        return false;
    },
    
    // 执行任务
    execute: function() {
        log("开始执行任务: " + this.name);
        
        // 检查是否在赚钱页面，如果不在则重新进入
        if (!this.isInMoneyPage) {
            log("当前不在赚钱页面，重新进入");
            // 确保在赚钱页面
            if (!enterMoneyPage()) {
                log("无法进入赚钱页面，任务终止");
                return false;
            } else {
                this.isInMoneyPage = true;
            }
            
            // 点击领福利按钮
            if (!this.clickRewardButton("领福利")) {
                log("未找到领福利按钮，任务终止");
                return false;
            }
        }
        
        // 等待广告播放完成
        if (!this.waitForAdComplete()) {
            log("广告未播放完成，任务终止");
            back();
            sleep(1000);
            return false;
        }
        
        // 关闭广告
        this.closeAd();
        
        log("任务完成: " + this.name);

        // 确认是否是在"任务中心页面"
        if (this.checkInMoneyPage()) {
            log("检测到当前在任务中心页面，点击「领福利」执行任务");
            // 点击领福利按钮
            if (!this.clickRewardButton("领福利")) {
                log("未找到领福利按钮，判断是否在冷却中");
                if (this.clickRewardButton("冷却中")) {
                    log("检测到当前在冷却中，切换到任务2并等待5分钟后重试");
                    // 暂时禁用当前任务并启用任务2
                    config.tasks.watchAds.enabled = false;
                    config.tasks.task2.enabled = true;
                    
                    // 等待5分钟
                    for (let i = 5; i > 0; i--) {
                        log("还剩 " + i + " 分钟重新检查任务1状态");
                        sleep(60000); // 等待1分钟
                    }
                    
                    log("5分钟已到，重新检查任务1状态");
                    // 重新进入赚钱页面
                    if (enterMoneyPage()) {
                        // 检查是否仍在冷却
                        if (!this.clickRewardButton("冷却中")) {
                            log("冷却已结束，重新启用任务1");
                            config.tasks.watchAds.enabled = true;
                            config.tasks.task2.enabled = false;
                        } else {
                            log("任务1仍在冷却中，继续执行任务2");
                        }
                    }
                }
            }
        }

        return true;
    }
};

// 任务2: 刷广告视频赚金币
const Task2 = {
    name: "刷广告视频赚金币",
    description: "自动浏览广告视频获取金币",
    isInMoneyPage: false,
    
    // 点击领福利按钮
    clickRewardButton: function(btnText) {
        log("查找领福利按钮");

        // 查找"刷广告视频赚金币"右侧的"领福利"文本
        log("尝试查找'刷广告视频赚金币'右侧的'领福利'文本");
        let videoText = text("刷广告视频赚金币").findOne(3000);
        if (videoText) {
            log("找到'刷广告视频赚金币'文本");

            // 尝试在不同层级的父元素中查找"领福利"文本
            let maxDepth = 5; // 最大遍历深度
            let rewardTexts = findInParents(videoText, text(btnText), maxDepth);

            if (rewardTexts && rewardTexts.length > 0) {
                log("找到'" + btnText + "'文本，尝试点击");
                rewardTexts[0].click();
                log("点击'" + btnText + "'文本完成");
                sleep(1000);
                return true;
            }
        }

        log("未找到领福利按钮");
        return false;
    },
    
    // 等待广告播放完成
    waitForAdComplete: function() {
        log("等待广告播放完成");
        let startTime = new Date().getTime();
        sleep(3000);
        
        // 随机等待10-30秒
        let waitTime = Math.floor(Math.random() * 21) + 10; // 10-30秒
        log("将等待 " + waitTime + " 秒");
        
        for (let i = waitTime; i > 0; i--) {
            if (i % 5 === 0) {
                log("广告播放中，还剩 " + i + " 秒");
            }
            sleep(1000);
        }
        
        log("广告播放完成");
        return true;
    },
    
    // 上滑到下一个视频
    swipeToNextVideo: function() {
        log("执行上滑操作切换到下一个视频");
        
        // 获取屏幕尺寸
        let screenWidth = device.width;
        let screenHeight = device.height;
        
        // 计算滑动起点和终点
        let startX = screenWidth * 0.5;
        let startY = screenHeight * 0.8;
        let endX = screenWidth * 0.5;
        let endY = screenHeight * 0.2;
        
        // 执行滑动操作
        swipe(startX, startY, endX, endY, 500);
        log("上滑操作完成");
        sleep(2000);
        
        return true;
    },
    
    checkInMoneyPage: function() {
        if (textContains("我的现金").findOne(1000) || textContains("我的金币").findOne(1000) || textContains("日常任务").findOne(1000)) {
            log("当前在赚钱页面");
            return true;
        }
        return false;
    },
    
    // 执行任务
    execute: function() {
        log("开始执行任务: " + this.name);
        
        // 检查是否在赚钱页面，如果不在则重新进入
        if (!this.isInMoneyPage) {
            log("当前不在赚钱页面，重新进入");
            // 确保在赚钱页面
            if (!enterMoneyPage()) {
                log("无法进入赚钱页面，任务终止");
                return false;
            } else {
                this.isInMoneyPage = true;
            }
            
            // 点击领福利按钮
            if (!this.clickRewardButton("领福利")) {
                log("未找到领福利按钮，任务终止");
                return false;
            }
        }
        
        // 等待广告播放完成
        if (!this.waitForAdComplete()) {
            log("广告未播放完成，任务终止");
            back();
            sleep(1000);
            return false;
        }
        
        // 上滑到下一个视频
        this.swipeToNextVideo();
        
        log("任务完成: " + this.name);

        return true;
    }
};

// 任务3: 待实现
const Task3 = {
    name: "任务3",
    description: "待实现的任务3",
    
    // 执行任务
    execute: function() {
        log("开始执行任务: " + this.name);
        log("任务3尚未实现");
        return false;
    }
};

// 任务4: 待实现
const Task4 = {
    name: "任务4",
    description: "待实现的任务4",
    
    // 执行任务
    execute: function() {
        log("开始执行任务: " + this.name);
        log("任务4尚未实现");
        return false;
    }
};

// ===================== 任务管理器 =====================

// 任务管理器
const TaskManager = {
    // 所有可用任务
    tasks: {
        watchAds: TaskWatchAds,
        task2: Task2,
        task3: Task3,
        task4: Task4
    },
    
    // 执行指定任务
    executeTask: function(taskName, maxRuns) {
        const task = this.tasks[taskName];
        if (!task) {
            log("任务不存在: " + taskName);
            return false;
        }
        
        log("开始执行任务: " + task.name);
        log("任务描述: " + task.description);
        
        let runCount = 0;
        let successCount = 0;
        
        while (runCount < maxRuns) {
            try {
                // 确保应用仍在运行
                if (!currentPackage().includes("com.kuaishou.nebula")) {
                    log("应用已退出，重新启动");
                    if (!launchApp()) {
                        toast("无法重新启动快手极速版");
                        return false;
                    }
                    if (!checkLogin()) {
                        toast("请先登录快手极速版");
                        return false;
                    }
                }
                
                // 执行任务
                if (task.execute()) {
                    successCount++;
                }
                
                runCount++;
                log("完成第 " + runCount + " 次执行，成功: " + successCount + " 次");
                
                // 等待间隔时间
                sleep(config.tasks[taskName].interval);
                
            } catch (error) {
                log("执行任务时发生错误: " + error);
                // 出错时尝试返回
                back();
                sleep(1000);
            }
        }
        
        log("任务执行完成: " + task.name);
        log("共执行 " + runCount + " 次，成功 " + successCount + " 次");
        return true;
    },
    
    // 执行所有启用的任务
    executeAllEnabledTasks: function() {
        log("开始执行所有启用的任务");
        
        for (let taskName in config.tasks) {
            if (config.tasks[taskName].enabled) {
                log("执行任务: " + taskName);
                this.executeTask(taskName, config.tasks[taskName].maxRuns);
            }
        }
        
        log("所有启用的任务执行完成");
    }
};

// ===================== 主函数 =====================

// 主函数
function main() {
    // 启动应用（只启动一次）
    if (!launchApp()) {
        toast("无法启动快手极速版，请检查应用是否安装");
        exit();
    }

    // 检查登录状态
    if (!checkLogin()) {
        toast("请先登录快手极速版");
        exit();
    }
    
    // 执行所有启用的任务
    TaskManager.executeAllEnabledTasks();
    
    toast("所有任务执行完成");
}

// 启动脚本
main(); 