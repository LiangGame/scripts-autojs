// 快手极速版自动看广告脚本
// 作者：Claude
// 说明：此脚本仅用于学习研究，请勿用于非法用途

// 导入必要的模块
const $ = require("jsbox");
const ui = require("ui");
const app = require("app");

// 配置参数
const config = {
    // 每次运行间隔时间（毫秒）
    interval: 3000,
    // 最大运行次数
    maxRuns: 10,
    // 是否自动点击关闭按钮
    autoClose: true
};

// 主函数
async function main() {
    // 检查是否在快手极速版中
    if (!app.isAppRunning("com.kuaishou.nebula")) {
        ui.alert("错误", "请先打开快手极速版");
        return;
    }

    let runCount = 0;
    
    while (runCount < config.maxRuns) {
        try {
            // 等待广告加载
            await $.sleep(2000);
            
            // 查找并点击"看视频得金币"按钮
            let watchButton = $("看视频得金币").find();
            if (watchButton.exists()) {
                watchButton.click();
                console.log("点击看视频按钮");
            }
            
            // 等待广告播放
            await $.sleep(15000);
            
            // 自动关闭广告
            if (config.autoClose) {
                let closeButton = $("关闭广告").find();
                if (closeButton.exists()) {
                    closeButton.click();
                    console.log("关闭广告");
                }
            }
            
            runCount++;
            console.log(`完成第 ${runCount} 次观看`);
            
            // 等待间隔时间
            await $.sleep(config.interval);
            
        } catch (error) {
            console.error("发生错误:", error);
            break;
        }
    }
    
    ui.alert("完成", `已观看 ${runCount} 个广告`);
}

// 启动脚本
main().catch(console.error); 