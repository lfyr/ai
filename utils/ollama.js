const axios = require('axios');
const OLLAMA_HOST = 'http://127.0.0.1:11434'; // Ollama 服务地址

// 生成文本
async function generateText(prompt, model = 'llama3.2:1b', stream = false) {
    try {
        const response = await axios.post(`${OLLAMA_HOST}/api/generate`,
            {
                "model": model,
                "prompt": prompt,
                "stream": stream
            }
        );
        // console.log('生成文本成功:', response.data.response);
        return stream ? response : response.data.response;
    } catch (error) {
        console.error('生成文本失败:', error.message);
    }
}

// 携带历史多轮对话
async function chat(messages, model = 'llama3.2:1b') {
    try {
        const response = await axios.post(`${OLLAMA_HOST}/api/chat`, {
            model,
            messages: [
                { role: 'user', content: '你好！' }, // 提问历史
                { role: 'assistant', content: '你好！需要什么帮助？' }, // 回答历史
                { role: 'user', content: '告诉我关于AI的历史。' } // 当前提问
            ],
            stream: false
        });
        console.log('对话成功:', response.data.message.content);
        return response.data.message.content;
    } catch (error) {
        console.error('对话失败:', error.message);
    }
}

// 列出本地模型
async function listModels() {
    try {
        const response = await axios.get(`${OLLAMA_HOST}/api/tags`);
        return response.data.models.map(m => m.name);
    } catch (error) {
        console.error('获取模型列表失败:', error.message);
    }
}

// 查看模型详情
async function showModel(modelName) {
    try {
        const response = await axios.post(`${OLLAMA_HOST}/api/show`, {
            name: modelName
        });
        return response.data;
    } catch (error) {
        console.error('获取模型信息失败:', error.message);
    }
}

// 拉取模型
async function pullModel(modelName) {
    try {
        const response = await axios.post(`${OLLAMA_HOST}/api/pull`, {
            name: modelName,
            stream: false
        });
        return response.data;
    } catch (error) {
        console.error('拉取模型失败:', error.message);
    }
}

// 删除模型
async function deleteModel(modelName) {
    try {
        const response = await axios.delete(`${OLLAMA_HOST}/api/delete`, {
            data: { name: modelName }
        });
        return response.data;
    } catch (error) {
        console.error('删除模型失败:', error.message);
    }
}



// 生成词向量
async function getEmbedding(keyword) {
    try {
        const response = await axios.post(`${OLLAMA_HOST}/api/embeddings`,
            {
                "model": "nomic-embed-text:latest", // 模型
                "prompt": keyword // 关键字
            }
        );
        // console.log('生成向量成功:', response.data.embedding);
        return JSON.stringify(response.data.embedding);
    } catch (error) {
        console.error('生成向量失败:', error.message);
    }
}

module.exports = {
    generateText,
    chat,
    getEmbedding
}