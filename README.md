# 基础准备

npm init # 初始化包

npm install langchain @langchain/community # 安装依赖

# 1.使用 OpenAI 模型，还需安装 OpenAI 包：

npm install @langchain/openai

# 1.1 基础使用示例

```javascript
import { OpenAI } from "@langchain/openai";

// 初始化 OpenAI 模型
const llm = new OpenAI({
  openAIApiKey: "YOUR_API_KEY", // 替换为你的 OpenAI API 密钥
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
});

// 调用模型生成文本
const response = await llm.invoke("请用一句话解释量子力学。");
console.log(response);
```

# 2.使用本地 Ollama 模型

```javascript
const { Ollama } = require("@langchain/community/llms/ollama");

// 初始化 Ollama 模型
const ollama = new Ollama({
  baseUrl: "http://localhost:11434", // 本地 Ollama 服务地址
  model: "llama2", // 模型名称
});

// 调用模型生成文本
const response = await ollama.invoke("请用一句话解释量子力学。");
console.log(response);
```
