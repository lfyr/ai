
const axios = require('axios');

/*
* 对话
* const messages = 
[
    { role: 'user', content: '你好！' }, // 提问历史
    { role: 'assistant', content: '你好！需要什么帮助？' }, // 回答历史
    { role: 'user', content: '告诉我关于AI的历史。' } // 当前提问
]    // 内容
*const model = 'Qwen/QwQ-32B-Preview'  // 模型
*await chat(model,messages)
*/
async function chat(model, messages) {
    try {
        const response = await axios.post("https://api.siliconflow.cn/v1/chat/completions", {
            model,
            messages: messages,
            stream: false
        }, {
            headers: {
                "Authorization": "Bearer " + process.env.SILICONFLOW_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        console.log('对话成功:', response.data);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('对话失败:', error.message);
    }
}

/*
 * 文档重排
 * const query = "人工智能的应用场景"; // 搜索关键词
 * const documents = ["人工智能在医疗领域的应用","人工智能在教育领域的应用","人工智能在金融领域的应用","人工智能在农业领域的应用"]; // 文档列表
 * const model = "netease-youdao/bce-reranker-base_v1"; // 模型
 * const return_documents = true; // 是否返回文档
 * await rerank(model, query, documents, return_documents)
 * 
 */
async function rerank(model, query, documents, return_documents) {
    try {
        const data = {
            model,
            query,
            documents,
            return_documents,
        };
        const response = await axios.post("https://api.siliconflow.cn/v1/rerank", data, {
            headers: {
                "Authorization": "Bearer " + process.env.SILICONFLOW_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        console.log('文档重排成功:', response.data);
        return response.data.results;
    } catch (error) {
        console.error('文档重排失败:', error.message);
    }
}

module.exports = {
    chat,
    rerank
}