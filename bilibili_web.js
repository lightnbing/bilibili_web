(async function () {
    // 工具函数：时间字符串转为秒数
    function timeStrToSeconds(timeStr) {
        const parts = timeStr.split(':').map(Number);
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        return 0;
    }

    // 工具函数：等待一定时间
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 工具函数：滚动到页面底部以触发懒加载
    function scrollToBottom() {
        return new Promise(resolve => {
            window.scrollTo(0, document.body.scrollHeight);
            setTimeout(resolve, 1000);
        });
    }

    // 工具函数：提取当前页面的所有视频标题和时长
    function extractDataFromPage() {
        const result = [];
        const items = document.querySelectorAll('.list-video-item');
        items.forEach(item => {
            const titleElement = item.querySelector('.bili-video-card__title a');
            const timeElement = item.querySelector('.bili-cover-card__stat:nth-child(2) span');
            if (titleElement && timeElement) {
                const title = titleElement.textContent.trim();
                const time = timeElement.textContent.trim();
                result.push({ title, time });
            }
        });
        return result;
    }

    // 工具函数：点击“下一页”按钮
    function clickNextPage() {
        const nextBtn = document.querySelector('.vui_pagenation--btn-side:last-child');
        if (nextBtn && !nextBtn.classList.contains('vui_button--disabled')) {
            nextBtn.click();
            return true;
        }
        return false;
    }

    // 工具函数：保存数据为txt文件
    function downloadTextFile(text, filename = 'bilibili_video_list.txt') {
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    // 主逻辑
    const allData = [];

    while (true) {
        await scrollToBottom();
        await wait(1000);
        const pageData = extractDataFromPage();
        console.log(`📄 当前页获取 ${pageData.length} 条数据`);
        allData.push(...pageData);

        if (!clickNextPage()) break;
        await wait(2000); // 等待翻页加载
    }

    // 格式化并导出
    const textOutput = allData.map((item, idx) => `${idx + 1}. ${item.title} [${item.time}]`).join('\n');
    console.log(`✅ 共获取 ${allData.length} 条视频信息`);
    downloadTextFile(textOutput);
})();
