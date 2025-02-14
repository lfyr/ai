// 示例：解析 PDF
const pdf = require('pdf-parse');
const fs = require('fs');
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");

async function parsePDF(path) {
    const dataBuffer = fs.readFileSync(path);
    const data = await pdf(dataBuffer);
    return data.text;
}

async function chunkText(text, chunkSize = 100) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: chunkSize,       // 每个块的最大字符数
        chunkOverlap: 20,     // 块之间的重叠字符数（保持上下文连贯）
        separators: ["\n\n", "\n", "。", "，", " "], // 分割符优先级（按顺序尝试）
    });

    // 分割文本
    const chunks = await splitter.splitText(text);
    return chunks;
}
module.exports = { parsePDF, chunkText };