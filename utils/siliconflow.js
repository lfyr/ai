
const axios = require('axios');

async function chat(messages, model = 'Qwen/QwQ-32B-Preview') {
    try {
        const response = await axios.post("https://api.siliconflow.cn/v1/chat/completions", {
            model,
            messages: [
                { role: 'user', content: '你好！' }, // 提问历史
                { role: 'assistant', content: '你好！需要什么帮助？' }, // 回答历史
                { role: 'user', content: '告诉我关于AI的历史。' } // 当前提问
            ],
            stream: false
        }, {
            headers: {
                "Authorization": '',
                'Content-Type': 'application/json'
            }
        });
        console.log('对话成功:', response.data);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('对话失败:', error.message);
    }
}

module.exports = {
    chat
}