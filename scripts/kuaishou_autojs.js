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
            maxRuns: 500,
            interval: 2000
        },
        // 任务2: 刷广告视频赚金币
        task2: {
            enabled: true,
            maxRuns: 50,
            interval: 3000
        },
        // 任务3: 点赞任务
        task3: {
            enabled: true,
            maxRuns: 1,
            interval: 3000
        },
        // 任务4: 收藏任务
        task4: {
            enabled: true,
            maxRuns: 1,
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

// 随机延迟函数
function randomSleep(min, max) {
    let delay = Math.floor(Math.random() * (max - min + 1)) + min;
    log("随机延迟 " + delay + " 毫秒");
    sleep(delay);
}

// 随机点击函数
function randomClick(x, y, range) {
    // 如果没有提供range参数，使用默认值5
    if (range === undefined) {
        range = 5;
    }
    
    // 获取屏幕尺寸
    var screenWidth = device.width;
    var screenHeight = device.height;
    
    // 在指定坐标周围随机选择一个点，并确保在屏幕范围内
    var randomX = x + Math.floor(Math.random() * range);
    var randomY = y + Math.floor(Math.random() * range);
    
    log("实际点击坐标: (" + x + ", " + y + ")");
    log("随机点击坐标: (" + randomX + ", " + randomY + ")");
    click(randomX, randomY);
    randomSleep(500, 1500);
}

// 随机滑动函数
function randomSwipe(startX, startY, endX, endY, duration, range) {
    // 如果没有提供range参数，使用默认值10
    if (range === undefined) {
        range = 10;
    }
    
    // 在起点和终点周围随机选择一个点
    var randomStartX = startX + Math.floor(Math.random() * range * 2) - range;
    var randomStartY = startY + Math.floor(Math.random() * range * 2) - range;
    var randomEndX = endX + Math.floor(Math.random() * range * 2) - range;
    var randomEndY = endY + Math.floor(Math.random() * range * 2) - range;
    
    // 随机调整滑动时间
    var randomDuration = duration + Math.floor(Math.random() * 200) - 100;
    
    log("随机滑动: 从(" + randomStartX + ", " + randomStartY + ")到(" + randomEndX + ", " + randomEndY + "), 持续时间: " + randomDuration + "ms");
    swipe(randomStartX, randomStartY, randomEndX, randomEndY, randomDuration);
    randomSleep(1000, 2000);
}

// 查找并点击文本
function clickText(textStr) {
    log("尝试查找并点击文本: " + textStr);

    // 方法1: 使用findOne
    var target = text(textStr).findOne(3000);
    if (target) {
        log("找到文本: " + textStr + ", 尝试点击");
        var bounds = target.bounds();
        if (bounds) {
            // 检查坐标是否有效
            if (bounds.centerX() < 0 || bounds.centerY() < 0) {
                log("文本坐标无效，尝试滑动屏幕使元素可见");
                // 尝试滑动屏幕使元素可见
                var screenHeight = device.height;
                var screenWidth = device.width;
                
                // 如果元素在屏幕上方不可见，向下滑动
                if (bounds.centerY() < 0) {
                    log("元素在屏幕上方不可见，向下滑动");
                    randomSwipe(screenWidth / 2, screenHeight * 0.3, screenWidth / 2, screenHeight * 0.7, 500);
                    sleep(1000);
                    // 重新查找元素
                    target = text(textStr).findOne(3000);
                    if (target) {
                        bounds = target.bounds();
                        if (bounds && bounds.centerY() >= 0) {
                            log("滑动后元素可见，尝试点击");
        randomClick(bounds.centerX(), bounds.centerY());
        log("点击完成: " + textStr);
        randomSleep(800, 1500);
        return true;
                        }
                    }
                }
                
                // 如果元素在屏幕左侧不可见，向右滑动
                if (bounds.centerX() < 0) {
                    log("元素在屏幕左侧不可见，向右滑动");
                    randomSwipe(screenWidth * 0.3, screenHeight / 2, screenWidth * 0.7, screenHeight / 2, 500);
                    sleep(1000);
                    // 重新查找元素
                    target = text(textStr).findOne(3000);
                    if (target) {
                        bounds = target.bounds();
                        if (bounds && bounds.centerX() >= 0) {
                            log("滑动后元素可见，尝试点击");
                            randomClick(bounds.centerX(), bounds.centerY());
                            log("点击完成: " + textStr);
                            randomSleep(800, 1500);
                            return true;
                        }
                    }
                }
                
                log("滑动后元素仍不可见，尝试其他方法");
            } else {
                randomClick(bounds.centerX(), bounds.centerY());
                log("点击完成: " + textStr);
                randomSleep(800, 1500);
                return true;
            }
        }
    }

    // 方法2: 使用find
    var targets = text(textStr).find();
    if (targets.length > 0) {
        log("找到多个文本: " + textStr + ", 尝试点击第一个");
        var bounds = targets[0].bounds();
        if (bounds) {
            // 检查坐标是否有效
            if (bounds.centerX() < 0 || bounds.centerY() < 0) {
                log("文本坐标无效，尝试滑动屏幕使元素可见");
                // 尝试滑动屏幕使元素可见
                var screenHeight = device.height;
                var screenWidth = device.width;
                
                // 如果元素在屏幕上方不可见，向下滑动
                if (bounds.centerY() < 0) {
                    log("元素在屏幕上方不可见，向下滑动");
                    randomSwipe(screenWidth / 2, screenHeight * 0.3, screenWidth / 2, screenHeight * 0.7, 500);
                    sleep(1000);
                    // 重新查找元素
                    targets = text(textStr).find();
                    if (targets.length > 0) {
                        bounds = targets[0].bounds();
                        if (bounds && bounds.centerY() >= 0) {
                            log("滑动后元素可见，尝试点击");
        randomClick(bounds.centerX(), bounds.centerY());
        log("点击完成: " + textStr);
        randomSleep(800, 1500);
        return true;
                        }
                    }
                }
                
                // 如果元素在屏幕左侧不可见，向右滑动
                if (bounds.centerX() < 0) {
                    log("元素在屏幕左侧不可见，向右滑动");
                    randomSwipe(screenWidth * 0.3, screenHeight / 2, screenWidth * 0.7, screenHeight / 2, 500);
                    sleep(1000);
                    // 重新查找元素
                    targets = text(textStr).find();
                    if (targets.length > 0) {
                        bounds = targets[0].bounds();
                        if (bounds && bounds.centerX() >= 0) {
                            log("滑动后元素可见，尝试点击");
                            randomClick(bounds.centerX(), bounds.centerY());
                            log("点击完成: " + textStr);
                            randomSleep(800, 1500);
                            return true;
                        }
                    }
                }
                
                log("滑动后元素仍不可见，尝试其他方法");
            } else {
                randomClick(bounds.centerX(), bounds.centerY());
                log("点击完成: " + textStr);
                randomSleep(800, 1500);
                return true;
            }
        }
    }

    // 方法3: 使用bounds点击
    var bounds = text(textStr).bounds();
    if (bounds) {
        // 检查坐标是否有效
        if (bounds.centerX() < 0 || bounds.centerY() < 0) {
            log("文本坐标无效，尝试滑动屏幕使元素可见");
            // 尝试滑动屏幕使元素可见
            var screenHeight = device.height;
            var screenWidth = device.width;
            
            // 如果元素在屏幕上方不可见，向下滑动
            if (bounds.centerY() < 0) {
                log("元素在屏幕上方不可见，向下滑动");
                randomSwipe(screenWidth / 2, screenHeight * 0.3, screenWidth / 2, screenHeight * 0.7, 500);
                sleep(1000);
                // 重新查找元素
                bounds = text(textStr).bounds();
                if (bounds && bounds.centerY() >= 0) {
                    log("滑动后元素可见，尝试点击");
                    randomClick(bounds.centerX(), bounds.centerY());
                    log("点击完成: " + textStr);
                    randomSleep(800, 1500);
                    return true;
                }
            }
            
            // 如果元素在屏幕左侧不可见，向右滑动
            if (bounds.centerX() < 0) {
                log("元素在屏幕左侧不可见，向右滑动");
                randomSwipe(screenWidth * 0.3, screenHeight / 2, screenWidth * 0.7, screenHeight / 2, 500);
                sleep(1000);
                // 重新查找元素
                bounds = text(textStr).bounds();
                if (bounds && bounds.centerX() >= 0) {
                    log("滑动后元素可见，尝试点击");
                    randomClick(bounds.centerX(), bounds.centerY());
                    log("点击完成: " + textStr);
                    randomSleep(800, 1500);
                    return true;
                }
            }
            
            log("滑动后元素仍不可见，尝试其他方法");
        } else {
        log("找到文本边界: " + textStr + ", 尝试点击中心位置");
        randomClick(bounds.centerX(), bounds.centerY());
        log("点击完成: " + textStr);
        randomSleep(800, 1500);
        return true;
        }
    }

    log("未找到文本: " + textStr);
    return false;
}

// 查找并点击描述
function clickDesc(descStr) {
    log("尝试查找并点击描述: " + descStr);

    // 方法1: 使用findOne
    var target = desc(descStr).findOne(3000);
    if (target) {
        log("找到描述: " + descStr + ", 尝试点击");
        var bounds = target.bounds();
        if (bounds) {
            // 检查坐标是否有效
            if (bounds.centerX() < 0 || bounds.centerY() < 0) {
                log("描述坐标无效，尝试滑动屏幕使元素可见");
                // 尝试滑动屏幕使元素可见
                var screenHeight = device.height;
                var screenWidth = device.width;
                
                // 如果元素在屏幕上方不可见，向下滑动
                if (bounds.centerY() < 0) {
                    log("元素在屏幕上方不可见，向下滑动");
                    randomSwipe(screenWidth / 2, screenHeight * 0.3, screenWidth / 2, screenHeight * 0.7, 500);
                    sleep(1000);
                    // 重新查找元素
                    target = desc(descStr).findOne(3000);
                    if (target) {
                        bounds = target.bounds();
                        if (bounds && bounds.centerY() >= 0) {
                            log("滑动后元素可见，尝试点击");
        randomClick(bounds.centerX(), bounds.centerY());
        log("点击完成: " + descStr);
        randomSleep(800, 1500);
        return true;
                        }
                    }
                }
                
                // 如果元素在屏幕左侧不可见，向右滑动
                if (bounds.centerX() < 0) {
                    log("元素在屏幕左侧不可见，向右滑动");
                    randomSwipe(screenWidth * 0.3, screenHeight / 2, screenWidth * 0.7, screenHeight / 2, 500);
                    sleep(1000);
                    // 重新查找元素
                    target = desc(descStr).findOne(3000);
                    if (target) {
                        bounds = target.bounds();
                        if (bounds && bounds.centerX() >= 0) {
                            log("滑动后元素可见，尝试点击");
                            randomClick(bounds.centerX(), bounds.centerY());
                            log("点击完成: " + descStr);
                            randomSleep(800, 1500);
                            return true;
                        }
                    }
                }
                
                log("滑动后元素仍不可见，尝试其他方法");
            } else {
                randomClick(bounds.centerX(), bounds.centerY());
                log("点击完成: " + descStr);
                randomSleep(800, 1500);
                return true;
            }
        }
    }

    // 方法2: 使用find
    var targets = desc(descStr).find();
    if (targets.length > 0) {
        log("找到多个描述: " + descStr + ", 尝试点击第一个");
        var bounds = targets[0].bounds();
        if (bounds) {
            // 检查坐标是否有效
            if (bounds.centerX() < 0 || bounds.centerY() < 0) {
                log("描述坐标无效，尝试滑动屏幕使元素可见");
                // 尝试滑动屏幕使元素可见
                var screenHeight = device.height;
                var screenWidth = device.width;
                
                // 如果元素在屏幕上方不可见，向下滑动
                if (bounds.centerY() < 0) {
                    log("元素在屏幕上方不可见，向下滑动");
                    randomSwipe(screenWidth / 2, screenHeight * 0.3, screenWidth / 2, screenHeight * 0.7, 500);
                    sleep(1000);
                    // 重新查找元素
                    targets = desc(descStr).find();
                    if (targets.length > 0) {
                        bounds = targets[0].bounds();
                        if (bounds && bounds.centerY() >= 0) {
                            log("滑动后元素可见，尝试点击");
        randomClick(bounds.centerX(), bounds.centerY());
        log("点击完成: " + descStr);
        randomSleep(800, 1500);
        return true;
                        }
                    }
                }
                
                // 如果元素在屏幕左侧不可见，向右滑动
                if (bounds.left < 0) {
                    log("元素在屏幕左侧不可见，向右滑动");
                    randomSwipe(screenWidth * 0.3, screenHeight / 2, screenWidth * 0.7, screenHeight / 2, 500);
                    sleep(1000);
                    // 重新查找元素
                    targets = desc(descStr).find();
                    if (targets.length > 0) {
                        bounds = targets[0].bounds();
                        if (bounds && bounds.left >= 0) {
                            log("滑动后元素可见，尝试点击");
                            randomClick(bounds.centerX(), bounds.centerY());
                            log("点击完成: " + descStr);
                            randomSleep(800, 1500);
                            return true;
                        }
                    }
                }
                
                log("滑动后元素仍不可见，尝试其他方法");
            } else {
                randomClick(bounds.centerX(), bounds.centerY());
                log("点击完成: " + descStr);
                randomSleep(800, 1500);
                return true;
            }
        }
    }

    // 方法3: 使用bounds点击
    var bounds = desc(descStr).bounds();
    if (bounds) {
        // 检查坐标是否有效
        if (bounds.left < 0 || bounds.top < 0) {
            log("描述坐标无效，尝试滑动屏幕使元素可见");
            // 尝试滑动屏幕使元素可见
            var screenHeight = device.height;
            var screenWidth = device.width;
            
            // 如果元素在屏幕上方不可见，向下滑动
            if (bounds.top < 0) {
                log("元素在屏幕上方不可见，向下滑动");
                randomSwipe(screenWidth / 2, screenHeight * 0.3, screenWidth / 2, screenHeight * 0.7, 500);
                sleep(1000);
                // 重新查找元素
                bounds = desc(descStr).bounds();
                if (bounds && bounds.top >= 0) {
                    log("滑动后元素可见，尝试点击");
                    randomClick(bounds.centerX(), bounds.centerY());
                    log("点击完成: " + descStr);
                    randomSleep(800, 1500);
                    return true;
                }
            }
            
            // 如果元素在屏幕左侧不可见，向右滑动
            if (bounds.left < 0) {
                log("元素在屏幕左侧不可见，向右滑动");
                randomSwipe(screenWidth * 0.3, screenHeight / 2, screenWidth * 0.7, screenHeight / 2, 500);
                sleep(1000);
                // 重新查找元素
                bounds = desc(descStr).bounds();
                if (bounds && bounds.left >= 0) {
                    log("滑动后元素可见，尝试点击");
                    randomClick(bounds.centerX(), bounds.centerY());
                    log("点击完成: " + descStr);
                    randomSleep(800, 1500);
                    return true;
                }
            }
            
            log("滑动后元素仍不可见，尝试其他方法");
        } else {
        log("找到描述边界: " + descStr + ", 尝试点击中心位置");
        randomClick(bounds.centerX(), bounds.centerY());
        log("点击完成: " + descStr);
        randomSleep(800, 1500);
        return true;
        }
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
    var current = element;
    var depth = 0;

    while (current && depth < maxDepth) {
        log("当前深度: " + depth);
        var parent = current.parent();
        if (!parent) {
            log("没有更多父元素");
            break;
        }

        log("查找父元素中的目标");
        var result = parent.find(selector);
        if (result.length > 0) {
            log("在第 " + depth + " 层父元素中找到目标，数量: " + result.length);
            
            // 检查结果中是否有负坐标的元素
            var validResults = [];
            for (var i = 0; i < result.length; i++) {
                var item = result[i];
                var bounds = item.bounds();
                if (bounds) {
                    // 检查坐标是否有效
                    if (bounds.centerX() < 0 || bounds.centerY() < 0) {
                        log("元素坐标无效，尝试滑动屏幕使元素可见");
                        // 尝试滑动屏幕使元素可见
                        var screenHeight = device.height;
                        var screenWidth = device.width;
                        
                        // 如果元素在屏幕上方不可见，向下滑动
                        if (bounds.centerY() < 0) {
                            log("元素在屏幕上方不可见，向下滑动");
                            randomSwipe(screenWidth / 2, screenHeight * 0.3, screenWidth / 2, screenHeight * 0.7, 500);
                            sleep(1000);
                            // 重新查找元素
                            var newResult = parent.find(selector);
                            if (newResult.length > 0) {
                                var newBounds = newResult[0].bounds();
                                if (newBounds && newBounds.centerY() >= 0) {
                                    log("滑动后元素可见，添加到有效结果");
                                    validResults.push(newResult[0]);
                                }
                            }
                        }
                        
                        // 如果元素在屏幕左侧不可见，向右滑动
                        if (bounds.centerX() < 0) {
                            log("元素在屏幕左侧不可见，向右滑动");
                            randomSwipe(screenWidth * 0.3, screenHeight / 2, screenWidth * 0.7, screenHeight / 2, 500);
                            sleep(1000);
                            // 重新查找元素
                            var newResult = parent.find(selector);
                            if (newResult.length > 0) {
                                var newBounds = newResult[0].bounds();
                                if (newBounds && newBounds.centerX() >= 0) {
                                    log("滑动后元素可见，添加到有效结果");
                                    validResults.push(newResult[0]);
                                }
                            }
                        }
                    } else {
                        // 坐标有效，直接添加到结果
                        validResults.push(item);
                    }
                }
            }
            
            // 如果有有效结果，返回
            if (validResults.length > 0) {
                log("找到 " + validResults.length + " 个有效结果");
                return validResults;
            }
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
            let bounds = rewardButton.bounds();
            randomClick(bounds.centerX(), bounds.centerY());
            log("点击领取奖励");
            randomSleep(800, 1500);
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
            let bounds = closeButton.bounds();
            randomClick(bounds.centerX(), bounds.centerY());
            log("关闭'已成功领取xxx金币'弹窗");
            randomSleep(800, 1500);
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
            let bounds = closeButton.bounds();
            randomClick(bounds.centerX(), bounds.centerY());
            log("关闭'恭喜获得xxx金币'弹窗");
            randomSleep(800, 1500);
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
            let bounds = giveUpButton.bounds();
            randomClick(bounds.centerX(), bounds.centerY());
            log("点击'放弃奖励'按钮");
            randomSleep(800, 1500);
            return true;
        }

        // 如果没有找到"放弃奖励"按钮，尝试查找包含"放弃"的文本
        let giveUpTexts = textMatches(/.*放弃.*/).find();
        for (let i = 0; i < giveUpTexts.length; i++) {
            if (isInMiddleRegion(giveUpTexts[i], middleRegion)) {
                log("找到包含'放弃'的文本，点击");
                let bounds = giveUpTexts[i].bounds();
                randomClick(bounds.centerX(), bounds.centerY());
                log("点击包含'放弃'的文本完成");
                randomSleep(800, 1500);
                return true;
            }
        }

        // 如果没有找到任何可点击的按钮，尝试点击返回键
        log("未找到可点击的按钮，尝试返回");
        back();
        randomSleep(800, 1500);
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
            let bounds = continueButton.bounds();
            randomClick(bounds.centerX(), bounds.centerY());
            log("点击'继续观看'按钮完成");
            randomSleep(800, 1500);
            return true;
        }

        // 如果没有找到"继续观看"按钮，尝试查找包含"继续"的文本
        let continueTexts = textMatches(/.*继续.*/).find();
        for (let i = 0; i < continueTexts.length; i++) {
            if (isInMiddleRegion(continueTexts[i], middleRegion)) {
                log("找到包含'继续'的文本，点击");
                let bounds = continueTexts[i].bounds();
                randomClick(bounds.centerX(), bounds.centerY());
                log("点击包含'继续'的文本完成");
                randomSleep(800, 1500);
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
            let bounds = continueButton.bounds();
            randomClick(bounds.centerX(), bounds.centerY());
            log("点击'退出直播间'按钮完成");
            randomSleep(800, 1500);
            return true;
        }

        // 如果没有找到"退出直播间"按钮，尝试查找包含"退出"的文本
        let continueTexts = textMatches(/.*退出.*/).find();
        for (let i = 0; i < continueTexts.length; i++) {
            if (isInMiddleRegion(continueTexts[i], middleRegion)) {
                log("找到包含'退出'的文本，点击");
                let bounds = continueTexts[i].bounds();
                randomClick(bounds.centerX(), bounds.centerY());
                log("点击包含'退出'的文本完成");
                randomSleep(800, 1500);
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

// ===================== 基础任务类 =====================

// 基础任务类
function BaseTask(name, description, successRate, reward) {
    this.name = name;
    this.description = description;
    this.isInMoneyPage = false;
    this.isInCooldown = false;
    this.cooldownStartTime = 0;
    this.lastExecuteTime = 0;
    this.successRate = successRate;
    this.reward = reward;
    
    // 点击领福利按钮, maxDepth为最大遍历深度
    this.clickRewardButton = function(btnText, maxDepth) {
        log("查找领福利按钮");

        // 查找任务名称右侧的按钮文本
        log("尝试查找'" + this.name + "'右侧的'" + btnText + "'文本");
        let taskText = text(this.name).findOne(3000);
        if (taskText) {
            log("找到'" + this.name + "'文本");
            
            // 尝试在不同层级的父元素中查找按钮文本
            let rewardTexts = findInParents(taskText, text(btnText), maxDepth);

            if (rewardTexts && rewardTexts.length > 0) {
                log("找到'" + btnText + "'文本，尝试点击");
                let bounds = rewardTexts[0].bounds();
                log("点击坐标: (" + bounds.centerX() + ", " + bounds.centerY() + ")");
                randomClick(bounds.centerX(), bounds.centerY());
                log("点击'" + btnText + "'文本完成");
                randomSleep(800, 1500);
                return true;
            }
        }

        log("未找到'" + btnText + "'按钮");
        return false;
    };
    
    // 检查是否在赚钱页面
    this.checkInMoneyPage = function() {
        if (textContains("看广告得金币").findOne(1000) || 
            textContains("我的金币").findOne(1000) || 
            textContains("日常任务").findOne(1000) ||
            textContains("我的现金").findOne(1000)) {
            log("当前在赚钱页面");
            return true;
        }
        return false;
    };
    
    // 检查是否在冷却中
    this.checkCooldown = function() {
        log("检查任务是否在冷却中");
        // 增加重试机制
        for (var i = 0; i < 3; i++) {
            // 查找任务名称右侧的"冷却中"文本
            log("尝试查找'" + this.name + "'右侧的'冷却中'文本");
            var taskText = text(this.name).findOne(3000);
            if (taskText) {
                log("找到'" + this.name + "'文本");
                
                // 尝试在不同层级的父元素中查找"冷却中"文本
                var cooldownTexts = findInParents(taskText, text("冷却中"), 3);
                
                if (cooldownTexts && cooldownTexts.length > 0) {
                    log("找到'冷却中'文本，任务在冷却中");
                    this.isInCooldown = true;
                    this.cooldownStartTime = new Date().getTime(); // 记录开始冷却的时间
                    return true;
                }
            }
            sleep(1000); // 等待1秒后重试
        }
        log("未找到'冷却中'文本，任务不在冷却中");
        this.isInCooldown = false;
        return false;
    };
    
    // 检查冷却是否应该结束
    this.shouldEndCooldown = function() {
        if (!this.isInCooldown) return false;
        
        // 如果冷却时间超过30分钟，自动结束冷却
        var now = new Date().getTime();
        var cooldownDuration = 30 * 60 * 1000; // 30分钟
        if (now - this.cooldownStartTime > cooldownDuration) {
            log("冷却时间已超过30分钟，自动结束冷却");
            this.isInCooldown = false;
            return true;
        }
        return false;
    };
    
    // 等待广告播放完成 - 由子类实现
    this.waitForAdComplete = function() {
        log("等待广告播放完成 - 基类方法，应由子类重写");
        return false;
    };
    
    // 执行任务 - 由子类实现
    this.execute = function() {
        log("执行任务 - 基类方法，应由子类重写");
        return false;
    };
}

// ===================== 任务模块 =====================

// 任务1: 看广告得金币
var TaskWatchAds = new BaseTask("看广告得金币", "自动观看广告获取金币");

// 重写等待广告播放完成方法
TaskWatchAds.waitForAdComplete = function() {
        log("等待广告播放完成");
    var startTime = new Date().getTime();
        randomSleep(2000, 4000);
        while (new Date().getTime() - startTime < config.adTimeout) {
            // 首先检查是否是直播间
        var liveContainer = id("com.kuaishou.nebula.live_audience_plugin:id/live_player_float_element_container").findOne(5000);
            if (liveContainer) {
                log("检测到直播间任务，等待60秒后完成");
                // 等待60秒
                randomSleep(60000, 70000);
                log("直播间任务完成");
                return true;
            } else {
                // 检查是否有"xx秒后可领取xxx金币"的文本
            var waitingText = textMatches(/.*s后可领取.*金币.*/).findOne(3000);
                if (waitingText) {
                    log("广告正在播放中...");
                    // 检测并处理弹窗
                    detectAndHandlePopups();
                    randomSleep(800, 1500);
                    continue;
                }

                // 检查是否有"已成功领取xxx金币"的文本
            var successText = textMatches(/已成功领取.*金币.*/).findOne(3000);
                if (successText) {
                    log("广告播放完成");
                    return true;
                }
            }

            // 检测并处理其他弹窗
            detectAndHandlePopups();

            randomSleep(800, 1500);
        }

        log("广告等待超时");
        return false;
};

// 重写执行任务方法
TaskWatchAds.execute = function() {
    log("开始执行任务: " + this.name + " isInMoneyPage: " + this.isInMoneyPage);
        
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
        }

    // 检查是否应该自动结束冷却
    if (this.shouldEndCooldown()) {
        log("冷却已自动结束，继续执行任务");
    }

    // 确保在赚钱页面后再检查冷却状态
        if (this.checkInMoneyPage()) {
            // 点击领福利按钮
            if (!this.clickRewardButton("领福利", 3)) {
                log("未找到领福利按钮，判断是否在冷却中");
                if (this.checkCooldown()) {
                log("检测到当前在冷却中");
                // 尝试自动切换到其他任务
                var newTaskName = TaskManager.switchToAnotherTask(this.name);
                if (newTaskName) {
                    log("已切换到任务: " + newTaskName);
                    return false;
                } else {
                    // 如果没有其他可用任务，等待一段时间后重试
                    log("没有其他可用任务，等待5分钟后重试");
                    sleep(5 * 60 * 1000);
                    return this.execute(); // 递归重试
                }
                }
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
        return true;
};

// 关闭广告
TaskWatchAds.closeAd = function() {
    log("尝试关闭广告");
    
    // 查找"已成功领取xxx金币"右侧的"X"按钮
    var closeButton = desc("关闭").findOne(3000);
    if (closeButton) {
        var bounds = closeButton.bounds();
        randomClick(bounds.centerX(), bounds.centerY());
        log("关闭广告");
        randomSleep(800, 1500);
        
        // 检测并处理弹窗
        detectAndHandlePopups();
        return true;
    }
    
    // 尝试查找其他可能的关闭按钮
    var closeButtons = descMatches(/关闭|关闭广告|跳过|跳过广告/).find();
    for (var i = 0; i < closeButtons.length; i++) {
        var bounds = closeButtons[i].bounds();
                randomClick(bounds.centerX(), bounds.centerY());
        log("点击其他关闭按钮");
                randomSleep(800, 1500);
        
        // 检测并处理弹窗
        detectAndHandlePopups();
                return true;
    }
    
    // 尝试点击返回键
    back();
    log("点击返回键");
    randomSleep(800, 1500);
    
    // 检测并处理弹窗
    detectAndHandlePopups();
    return true;
};

// 任务2: 刷广告视频赚金币
var Task2 = new BaseTask("刷广告视频赚金币", "自动浏览广告视频获取金币");

// 重写等待广告播放完成方法
Task2.waitForAdComplete = function() {
    log("等待广告播放完成");
        // 随机等待10-30秒
    var waitTime = Math.floor(Math.random() * 21) + 10; // 10-30秒
        log("将等待 " + waitTime + " 秒");
        
    for (var i = waitTime; i > 0; i--) {
            if (i % 5 === 0) {
                log("视频播放中，还剩 " + i + " 秒");
            }
            sleep(1000);
        }
        
        log("广告播放完成");
        return true;
};
    
    // 上滑到下一个视频
Task2.swipeToNextVideo = function() {
        log("执行上滑操作切换到下一个视频");
        
        // 获取屏幕尺寸
    var screenWidth = device.width;
    var screenHeight = device.height;
        
        // 计算滑动起点和终点
    var startX = screenWidth * 0.5;
    var startY = screenHeight * 0.8;
    var endX = screenWidth * 0.5;
    var endY = screenHeight * 0.2;
        
        // 执行随机滑动操作
        randomSwipe(startX, startY, endX, endY, 500);
        log("上滑操作完成");
        randomSleep(1500, 2500);
        
        return true;
};

// 重写执行任务方法
Task2.execute = function() {
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
            }
            
    // 确保在赚钱页面后再检查冷却状态
    if (this.checkInMoneyPage()) {
            // 先小幅上滑一下
            log("执行小幅上滑操作");
            // 获取屏幕尺寸
        var screenWidth = device.width;
        var screenHeight = device.height;
            
            // 计算小幅滑动的起点和终点（只滑动屏幕高度的20%）
        var startX = screenWidth * 0.5;
        var startY = screenHeight * 0.6; // 从屏幕60%处开始
        var endX = screenWidth * 0.5;
        var endY = screenHeight * 0.4; // 滑动到屏幕40%处
            
            // 执行随机滑动操作，时间较短（300-500ms）
            randomSwipe(startX, startY, endX, endY, 200);
            log("小幅上滑操作完成");
            randomSleep(1000, 2000);
        
        // 检查是否应该自动结束冷却
        if (this.shouldEndCooldown()) {
            log("冷却已自动结束，继续执行任务");
        }
            
            // 点击领福利按钮
            if (!this.clickRewardButton("领福利", 3)) {
                log("未找到领福利按钮，判断是否在冷却中");
                if (this.checkCooldown()) {
                log("检测到当前在冷却中");
                // 尝试自动切换到其他任务
                var newTaskName = TaskManager.switchToAnotherTask(this.name);
                if (newTaskName) {
                    log("已切换到任务: " + newTaskName);
                    return false;
                } else {
                    // 如果没有其他可用任务，等待一段时间后重试
                    log("没有其他可用任务，等待5分钟后重试");
                    sleep(5 * 60 * 1000);
                    return this.execute(); // 递归重试
                }
                }
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
};

// 任务3: 点赞任务
var Task3 = new BaseTask("点赞任务", "点赞指定数量的作品");

// 重写execute方法
Task3.execute = function() {
    log("开始执行点赞任务");
    
    // 检查是否在赚钱页面
    if (!this.isInMoneyPage) {
        log("未在赚钱页面，尝试进入");
        if (!enterMoneyPage()) {
            log("进入赚钱页面失败");
            return false;
        }
        this.isInMoneyPage = true;
    }
    
    // 查找"点赞x个作品"文本
    log("查找'点赞x个作品'文本");
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
    
    // 尝试查找包含"点赞"和"作品"的文本
    var likeTaskText = textMatches(/点赞.*作品/).findOne();
    if (likeTaskText.visibleToUser() && isInMiddleRegion(likeTaskText, middleRegion)) {
        log("找到点赞任务文本");
    } else {
        // 如果没找到，尝试滑动查找
        log("未找到点赞任务文本，尝试滑动查找");
        for (var i = 0; i < 3; i++) {
            randomSwipe(device.width / 2, device.height * 0.7, device.width / 2, device.height * 0.3, 500);
            randomSleep(1000, 2000);
            
            likeTaskText = textMatches(/点赞.*作品/).findOne();
            if (likeTaskText.visibleToUser() && isInMiddleRegion(likeTaskText, middleRegion)) {
                log("滑动后找到点赞任务文本");
                break;
            }
        }
    }
    
    if (!likeTaskText) {
        log("未找到点赞任务文本");
        return false;
    }
    
    // 检查任务是否已完成
    var completedText = text("已完成").findOne(1000);
    if (completedText) {
        // 检查"已完成"是否在"点赞x个作品"的父元素中
        var parent = findInParents(likeTaskText, text("已完成"), 3);
        if (parent && parent.length > 0) {
            log("点赞任务已完成");
        return true;
    }
    }
    
    // 查找"去点赞"按钮
    log("查找'去点赞'按钮");
    var likeButton = null;
    
    // 尝试在"点赞x个作品"的父元素中查找"去点赞"按钮
    var likeButtons = findInParents(likeTaskText, text("去点赞"), 3);
    if (likeButtons && likeButtons.length > 0) {
        log("找到去点赞按钮");
        likeButton = likeButtons[0];
    } else {
        // 如果没找到，尝试在"点赞x个作品"的右侧查找
        log("在父元素中未找到去点赞按钮，尝试在右侧查找");
        
        // 获取"点赞x个作品"的位置
        var taskBounds = likeTaskText.bounds();
        if (taskBounds) {
            // 在"点赞x个作品"右侧区域查找"去点赞"按钮
            var rightButtons = text("去点赞").find();
            for (var i = 0; i < rightButtons.length; i++) {
                var btnBounds = rightButtons[i].bounds();
                if (btnBounds && btnBounds.centerX() > taskBounds.centerX()) {
                    log("在右侧找到去点赞按钮");
                    likeButton = rightButtons[i];
                    break;
                }
            }
        }
    }
    
    if (!likeButton) {
        log("未找到去点赞按钮");
        return false;
    }
    
    // 点击"去点赞"按钮
    log("点击去点赞按钮");
    var bounds = likeButton.bounds();
    if (bounds) {
        randomClick(bounds.centerX(), bounds.centerY());
        randomSleep(2000, 3000);
    } else {
        log("无法获取按钮位置");
        return false;
    }
    
    // 查找并点击点赞按钮
    log("查找点赞按钮");
    var likeElement = id("com.kuaishou.nebula:id/like_element_click_layout").findOne(5000);
    if (!likeElement) {
        log("未找到点赞按钮");
        return false;
    }
    
    // 点击点赞按钮
    log("点击点赞按钮");
    bounds = likeElement.bounds();
    if (bounds) {
        randomClick(bounds.centerX(), bounds.centerY());
        randomSleep(2000, 3000);
    } else {
        log("无法获取点赞按钮位置");
        return false;
    }
};

// 任务4: 收藏任务
var Task4 = new BaseTask("收藏任务", "收藏指定数量的作品");

// 重写execute方法
Task4.execute = function() {
    log("开始执行收藏任务");
    
    // 检查是否在赚钱页面
    if (!this.isInMoneyPage) {
        log("未在赚钱页面，尝试进入");
        if (!enterMoneyPage()) {
            log("进入赚钱页面失败");
            return false;
        }
        this.isInMoneyPage = true;
    }
    
    // 查找"收藏x个作品"文本
    log("查找'收藏x个作品'文本");
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
    
    // 尝试查找包含"收藏"和"作品"的文本
    var collectTaskText = textMatches(/收藏.*作品/).findOne();
    if (collectTaskText.visibleToUser() && isInMiddleRegion(collectTaskText, middleRegion)) {
        log("找到收藏任务文本");
    } else {
        // 如果没找到，尝试滑动查找
        log("未找到收藏任务文本，尝试滑动查找");
        for (var i = 0; i < 3; i++) {
            randomSwipe(device.width / 2, device.height * 0.7, device.width / 2, device.height * 0.3, 500);
            randomSleep(1000, 2000);
            
            collectTaskText = textMatches(/收藏.*作品/).findOne();
            if (collectTaskText.visibleToUser() && isInMiddleRegion(collectTaskText, middleRegion)) {
                log("滑动后找到可见的收藏任务文本");
                break;
            }
        }
    }
    
    if (!collectTaskText) {
        log("未找到可见的收藏任务文本");
        return false;
    }
    
    // 检查任务是否已完成
    var completedText = text("已完成").findOne(1000);
    if (completedText) {
        // 检查"已完成"是否在"收藏x个作品"的父元素中
        var parent = findInParents(collectTaskText, text("已完成"), 3);
        if (parent && parent.length > 0) {
            log("收藏任务已完成");
            return true;
        }
    }
    
    // 查找"去收藏"按钮
    log("查找'去收藏'按钮");
    var collectButton = null;
    
    // 尝试在"收藏x个作品"的父元素中查找"去收藏"按钮
    var collectButtons = findInParents(collectTaskText, text("去收藏"), 3);
    if (collectButtons && collectButtons.length > 0) {
        log("找到去收藏按钮");
        collectButton = collectButtons[0];
    } else {
        // 如果没找到，尝试在"收藏x个作品"的右侧查找
        log("在父元素中未找到去收藏按钮，尝试在右侧查找");
        
        // 获取"收藏x个作品"的位置
        var taskBounds = collectTaskText.bounds();
        if (taskBounds) {
            // 在"收藏x个作品"右侧区域查找"去收藏"按钮
            var rightButtons = text("去收藏").find();
            for (var i = 0; i < rightButtons.length; i++) {
                var btnBounds = rightButtons[i].bounds();
                if (btnBounds && btnBounds.centerX() > taskBounds.centerX()) {
                    log("在右侧找到去收藏按钮");
                    collectButton = rightButtons[i];
                    break;
                }
            }
        }
    }
    
    if (!collectButton) {
        log("未找到去收藏按钮");
        return false;
    }
    
    // 点击"去收藏"按钮
    log("点击去收藏按钮");
    var bounds = collectButton.bounds();
    if (bounds) {
        randomClick(bounds.centerX(), bounds.centerY());
        randomSleep(5000, 8000);
    } else {
        log("无法获取按钮位置");
        return false;
    }
    
    // 查找并点击收藏按钮
    log("查找收藏按钮");
    var collectElement = id("com.kuaishou.nebula:id/click_area_collect").findOne(5000);
    if (!collectElement) {
        log("未找到收藏按钮");
        return false;
    }
    
    // 点击收藏按钮
    log("点击收藏按钮");
    bounds = collectElement.bounds();
    if (bounds) {
        randomClick(bounds.centerX(), bounds.centerY());
        randomSleep(2000, 3000);
    } else {
        log("无法获取收藏按钮位置");
        return false;
    }
};

// ===================== 任务管理器 =====================

// 任务管理器
var TaskManager = {
    // 所有可用任务
    tasks: {
        watchAds: TaskWatchAds,
        task2: Task2,
        task3: Task3,
        task4: Task4
    },
    
    // 存储所有运行中的线程，使用对象来关联任务名称和线程
    runningThreads: {},
    
    // 添加线程到管理列表
    addThread: function(thread, taskName) {
        // 如果任务已有线程在运行，先停止它
        if (this.runningThreads[taskName]) {
            log("任务 " + taskName + " 已有线程在运行，先停止它");
            this.stopTaskThreads(taskName);
        }
        
        // 添加新线程
        this.runningThreads[taskName] = thread;
        log("添加新线程到任务 " + taskName);
    },
    
    // 停止指定任务的线程
    stopTaskThreads: function(taskName) {
        log("尝试停止任务 " + taskName + " 的线程");
        var stoppedCount = 0;
        
        if (taskName === "all") {
            // 停止所有任务的线程
            for (var task in this.runningThreads) {
                stoppedCount += this.stopTaskThreads(task);
            }
            return stoppedCount;
        }
        
        // 获取指定任务的线程
        var thread = this.runningThreads[taskName];
        if (!thread) {
            log("任务 " + taskName + " 没有运行中的线程");
            return 0;
        }
        
        try {
            // 从对象中移除线程
            delete this.runningThreads[taskName];
            stoppedCount++;
            log("成功停止任务 " + taskName + " 的线程");
        } catch (error) {
            log("停止任务 " + taskName + " 的线程时出错: " + error);
        }
        
        log("已停止任务 " + taskName + " 的线程");
        return stoppedCount;
    },
    
    // 停止所有线程
    stopAllThreads: function() {
        log("尝试停止所有线程");
        return this.stopTaskThreads("all");
    },
    
    // 检查任务是否在冷却中
    isTaskInCooldown: function(taskName) {
        var task = this.tasks[taskName];
        if (!task) {
            log("任务不存在: " + taskName);
            return false;
        }
        
        // 确保在赚钱页面
        if (!task.isInMoneyPage) {
            log("当前不在赚钱页面，先进入赚钱页面");
            if (!enterMoneyPage()) {
                log("无法进入赚钱页面，无法检查冷却状态");
                return false;
            } else {
                task.isInMoneyPage = true;
            }
        } else if (!task.checkInMoneyPage()) {
            // 即使isInMoneyPage为true，也再次检查是否真的在赚钱页面
            log("isInMoneyPage标记为true但实际不在赚钱页面，重新进入");
            if (!enterMoneyPage()) {
                log("无法进入赚钱页面，无法检查冷却状态");
                return false;
            }
        }
        
        // 检查是否在冷却中
        return task.checkCooldown();
    },
    
    // 切换到另一个可用任务
    switchToAnotherTask: function(currentTaskName) {
        log("尝试切换到另一个可用任务");
        
        // 获取所有启用的任务
        var enabledTasks = [];
        var taskPriorities = {};
        
        for (var taskName in config.tasks) {
            if (config.tasks[taskName].enabled && taskName !== currentTaskName) {
                enabledTasks.push(taskName);
                // 计算任务优先级
                taskPriorities[taskName] = this.calculateTaskPriority(taskName);
            }
        }
        
        if (enabledTasks.length === 0) {
            log("没有其他可用的任务");
            return false;
        }
        
        // 根据优先级排序任务
        enabledTasks.sort(function(a, b) {
            return taskPriorities[b] - taskPriorities[a];
        });
        
        // 选择优先级最高的任务
        var newTaskName = enabledTasks[0];
        log("切换到优先级最高的任务: " + newTaskName);
        return newTaskName;
    },
    
    // 计算任务优先级
    calculateTaskPriority: function(taskName) {
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
            priority += Math.min(timeSinceLastExecute / (60 * 60 * 1000), 24); // 最多24小时
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
    },
    
    // 等待冷却结束并检查
    waitForCooldown: function(taskName, checkIntervalMinutes) {
        log("等待任务 " + taskName + " 冷却结束，每 " + checkIntervalMinutes + " 分钟检查一次");
        
        // 等待指定时间
        for (var i = checkIntervalMinutes; i > 0; i--) {
            log("还剩 " + i + " 分钟重新检查任务状态");
            sleep(60000); // 等待1分钟
        }
        
        // 检查冷却是否结束
        if (!this.isTaskInCooldown(taskName)) {
            log("任务 " + taskName + " 冷却已结束");
            return true;
        } else {
            log("任务 " + taskName + " 仍在冷却中");
            return false;
        }
    },
    
    // 执行指定任务
    executeTask: function(taskName, maxRuns) {
        var task = this.tasks[taskName];
        if (!task) {
            log("任务不存在: " + taskName);
            return false;
        }
        
        log("开始执行任务: " + task.name);
        log("任务描述: " + task.description);
        
        var runCount = 0;
        var successCount = 0;
        var consecutiveFailures = 0;
        var MAX_CONSECUTIVE_FAILURES = 3;
        
        while (runCount < maxRuns) {
            try {
                // 检查线程是否已被删除（表示被中断）
                if (!this.runningThreads[taskName]) {
                    log("任务被中断，停止执行");
                    return false;
                }
                
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
                
                // 确保在赚钱页面后再检查冷却状态
                if (!task.isInMoneyPage) {
                    log("当前不在赚钱页面，先进入赚钱页面");
                    if (!enterMoneyPage()) {
                        log("无法进入赚钱页面，无法检查冷却状态");
                        return false;
                    } else {
                        task.isInMoneyPage = true;
                    }
                }
                
                // 检查任务是否在冷却中
                if (task.checkInMoneyPage() && task.checkCooldown()) {
                    log("任务 " + taskName + " 在冷却中");
                    
                    // 检查是否应该自动结束冷却
                    if (task.shouldEndCooldown()) {
                        log("冷却已自动结束，继续执行任务");
                        task.isInCooldown = false;
                    } else {
                    // 切换到另一个任务
                        var newTaskName = this.switchToAnotherTask(taskName);
                    if (newTaskName) {
                        log("切换到任务: " + newTaskName);
                            
                            // 先中断当前任务的线程
                            log("中断当前任务 " + taskName + " 的线程");
                            this.stopTaskThreads(taskName);
                            
                            // 创建新线程执行新任务
                            var that = this;
                            var newThread = threads.start(function() {
                            log("新线程开始执行");
                            try {
                                that.executeTask(newTaskName, config.tasks[newTaskName].maxRuns);
                            } catch (error) {
                                log("切换任务执行出错: " + error);
                            }
                            log("新线程执行结束");
                        });
                            
                            // 将新线程添加到管理列表
                        this.addThread(newThread, newTaskName);
                            log("新任务线程已创建并添加到管理列表");
                            
                            // 直接返回，不再继续执行当前任务
                            return false;
                    } else {
                        log("没有其他可用任务，等待冷却结束");
                        // 等待5分钟后重新检查
                            for (var i = 5; i > 0; i--) {
                            if (!this.runningThreads[taskName]) {
                                log("任务被中断，停止执行");
                                return false;
                            }
                            log("等待冷却结束，还剩 " + i + " 分钟");
                            sleep(60000);
                        }
                            continue;
                        }
                    }
                }
                
                // 执行任务
                var success = task.execute();
                if (success) {
                    successCount++;
                    consecutiveFailures = 0;
                    task.lastExecuteTime = new Date().getTime();
                    task.successRate = successCount / (runCount + 1);
                } else {
                    consecutiveFailures++;
                    if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
                        log("连续失败次数过多，切换到其他任务");
                        var newTaskName = this.switchToAnotherTask(taskName);
                        if (newTaskName) {
                            log("切换到任务: " + newTaskName);
                            
                            // 先中断当前任务的线程
                            log("中断当前任务 " + taskName + " 的线程");
                            this.stopTaskThreads(taskName);
                            
                            // 创建新线程执行新任务
                            var that = this;
                            var newThread = threads.start(function() {
                                that.executeTask(newTaskName, config.tasks[newTaskName].maxRuns);
                            });
                            
                            // 将新线程添加到管理列表
                            this.addThread(newThread, newTaskName);
                            log("新任务线程已创建并添加到管理列表");
                            
                            // 直接返回，不再继续执行当前任务
                            return false;
                        }
                    }
                }
                
                runCount++;
                log("完成第 " + runCount + " 次执行，成功: " + successCount + " 次");
                
                // 随机等待间隔时间
                var interval = config.tasks[taskName].interval;
                var randomInterval = interval + Math.floor(Math.random() * 1000) - 500;
                log("随机等待 " + randomInterval + " 毫秒");
                sleep(randomInterval);
                
            } catch (error) {
                log("执行任务时发生错误: " + error);
                consecutiveFailures++;
                // 出错时尝试返回
                back();
                randomSleep(800, 1500);
                
                if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
                    log("连续失败次数过多，切换到其他任务");
                    var newTaskName = this.switchToAnotherTask(taskName);
                    if (newTaskName) {
                        log("切换到任务: " + newTaskName);
                        
                        // 先中断当前任务的线程
                        log("中断当前任务 " + taskName + " 的线程");
                        this.stopTaskThreads(taskName);
                        
                        // 创建新线程执行新任务
                        var that = this;
                        var newThread = threads.start(function() {
                            that.executeTask(newTaskName, config.tasks[newTaskName].maxRuns);
                        });
                        
                        // 将新线程添加到管理列表
                        this.addThread(newThread, newTaskName);
                        log("新任务线程已创建并添加到管理列表");
                        
                        // 直接返回，不再继续执行当前任务
                        return false;
                    }
                }
            }
        }
        
        log("任务执行完成: " + task.name);
        log("共执行 " + runCount + " 次，成功 " + successCount + " 次");
        
        // 任务执行完成后，自动切换到下一个任务
        log("任务 " + taskName + " 执行完成，尝试切换到下一个任务");
        var nextTaskName = this.switchToAnotherTask(taskName);
        if (nextTaskName) {
            log("切换到下一个任务: " + nextTaskName);
            
            // 创建新线程执行新任务
            var that = this;
            var newThread = threads.start(function() {
                log("新线程开始执行下一个任务");
                try {
                    that.executeTask(nextTaskName, config.tasks[nextTaskName].maxRuns);
                } catch (error) {
                    log("执行下一个任务时出错: " + error);
                }
                log("新线程执行结束");
            });
            
            // 将新线程添加到管理列表
            this.addThread(newThread, nextTaskName);
            log("下一个任务线程已创建并添加到管理列表");
        } else {
            log("没有其他可用任务，所有任务已完成");
        }
        
        return true;
    },
    
    // 执行所有启用的任务
    executeAllEnabledTasks: function() {
        log("开始执行所有启用的任务");

        // 获取所有启用的任务并按优先级排序
        var enabledTasks = [];
        var taskPriorities = {};
        
        for (var taskName in config.tasks) {
            if (config.tasks[taskName].enabled) {
                enabledTasks.push(taskName);
                taskPriorities[taskName] = this.calculateTaskPriority(taskName);
            }
        }
        
        if (enabledTasks.length === 0) {
            log("没有启用的任务");
            return;
        }
        
        // 根据优先级排序任务
        enabledTasks.sort(function(a, b) {
            return taskPriorities[b] - taskPriorities[a];
        });
        
        // 只执行优先级最高的任务
        var highestPriorityTask = enabledTasks[0];
        log("执行优先级最高的任务: " + highestPriorityTask);
        
        // 创建新线程执行任务
        var that = this;
        var thread = threads.start(function() {
            try {
                that.executeTask(highestPriorityTask, config.tasks[highestPriorityTask].maxRuns);
                    } catch (error) {
                        log("任务线程执行出错: " + error);
                    }
                });

        // 将线程添加到管理列表
        this.addThread(thread, highestPriorityTask);
        
        log("任务开始执行");
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
    
    // 执行优先级最高的任务
    TaskManager.executeAllEnabledTasks();
    
    // 等待任务执行完成
    while (Object.keys(TaskManager.runningThreads).length > 0) {
        sleep(1000);
    }
    
    toast("任务执行完成");
}

// 启动脚本
main(); 