const { storeChunks, searchChunks, generateWithOllama } = require("./service/documents")
const { chat, rerank } = require("./utils/siliconflow")
async function main() {

    // // 一、导入知识库
    // // await storeChunks("./knowledge/rqbs.pdf")

    // /*******************/
    // // 检索知识库
    // const question = "维纳股份"
    // // 查询database 中匹配到的数据
    // const queryDbData = await searchChunks(question)
    // const context = queryDbData.map(item => item.content).join('\n');

    // // 调用模型生成结果
    // const response = await generateWithOllama(question, context)
    // console.info(`response:${response}`);

    // //二、 硅基流动
    // const query = "人工智能的应用场景"; // 搜索关键词
    // const documents = ["人工智能在医疗领域的应用", "人工智能在教育领域的应用", "人工智能在金融领域的应用", "人工智能在农业领域的应用"]; // 文档列表
    // const model = "netease-youdao/bce-reranker-base_v1"; // 模型
    // const return_documents = true; // 是否返回文档
    // const res = await rerank(model, query, documents, return_documents)
    // console.log(res)
}

(async () => {

    await main();
})()



// 分块策略：按段落或语义分割（如 langchain/text_splitter）。

// 混合检索：结合关键词检索（如 BM25）和向量检索。

// 缓存：对常见查询结果缓存，提升响应速度。

// 前端界面：使用 Vue/React 构建查询页面。

// 知识库更新：监听文件变化，自动增量更新向量库。
