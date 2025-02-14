const moment = require("moment")
const { pgDb } = require("../database/pgvector");
const { parsePDF, chunkText } = require("../utils/parser")
const { generateText, getEmbedding } = require("../utils/ollama")

// 检索文档
async function searchChunks(query, topK = 3, score = 0.5) {
    const queryEmbedding = await getEmbedding(query);
    const client = await pgDb.connect();
    try {
        const sql = `SELECT id, content, 1 - (vector <=> $1) AS similarity FROM documents WHERE 1-(vector <=> $2 ) > $3  ORDER BY similarity DESC LIMIT $4`
        const queryResult = await client.query(sql, [queryEmbedding, queryEmbedding, score, topK]);
        return queryResult.rows;
    } catch (error) {
        console.error(`searchChunks Error:${error}`);
    } finally {
        await client.end();
    }
}

// 存储文档
async function createDocuments(data) {
    const client = await pgDb.connect();
    try {
        let dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
        let sql =
            'INSERT INTO "public"."documents" ("content", "vector", "created_at", "updated_at") VALUES ($1, $2, $3, $4) RETURNING id';
        let params = [
            data.content,
            data.vector,
            dateTime,
            dateTime,
        ];
        await client.query(sql, params);
    } catch (err) {
        console.error(`createDocuments Error:${err}`);
    } finally {
        client.end();
    };
}

// documents 切分存储
async function storeChunks(path) {
    try {

        // 导入知识库
        const text = await parsePDF(path)

        // 切割文档
        const chunkTextRes = await chunkText(text);
        for (let i = 0; i < chunkTextRes.length; i++) {
            // 转为向量
            let embedding = await getEmbedding(chunkTextRes[i])
            let insertData = {
                "content": chunkTextRes[i],
                "vector": embedding
            }
            await createDocuments(insertData)
        }
        console.info(`导入知识库success`);
    } catch (err) {
        console.error(`storeChunks Error:${err}`);
    }
}

// 根据提示词获取内容
async function generateWithOllama(question, context) {
    const prompt = `基于以下上下文回答问题：\n${context}\n\n问题：${question}`
    return await generateText(prompt)
}

module.exports = {
    storeChunks,
    searchChunks,
    generateWithOllama
};