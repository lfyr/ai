const { storeChunks, searchChunks, generateWithOllama } = require("./service/documents")
const { chat } = require("./utils/siliconflow")
async function main() {

    // 导入知识库
    // await storeChunks("./knowledge/rqbs.pdf")

    /*******************/
    // 检索知识库
    const question = "维纳股份"
    // 查询database 中匹配到的数据
    const queryDbData = await searchChunks(question)
    const context = queryDbData.map(item => item.content).join('\n');

    // 调用模型生成结果
    const response = await generateWithOllama(question, context)
    console.info(`response:${response}`);

    // // 硅基流动
    // const message = [
    //     { role: "user", content: "Who won the world series in 2020?" },
    //     { role: "assistant", content: "The Los Angeles Dodgers won the World Series in 2020." },
    //     { role: "user", content: "Where was it played?" }
    // ]
    // const model = "deepseek-ai/DeepSeek-R1"
    // const content = await chat(message, model)
    // console.log(content)
}
(async () => {
    await main();
})()



// 分块策略：按段落或语义分割（如 langchain/text_splitter）。

// 混合检索：结合关键词检索（如 BM25）和向量检索。

// 缓存：对常见查询结果缓存，提升响应速度。

// 前端界面：使用 Vue/React 构建查询页面。

// 知识库更新：监听文件变化，自动增量更新向量库。
