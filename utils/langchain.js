const { Ollama } = require("@langchain/community/llms/ollama");
const { PromptTemplate } = require("@langchain/core/prompts");
const { LLMChain, ConversationChain, SequentialChain } = require("langchain/chains");
const { BufferMemory } = require("langchain/memory");

// 简单使用
async function simple(question) {

    // 初始化 Ollama 模型
    const ollama = new Ollama({
        baseUrl: "http://localhost:11434", // 本地 Ollama 服务地址
        model: "deepseek-r1:1.5b",                   // 模型名称
    });

    // 调用模型生成文本
    const response = await ollama.invoke(question);
    console.log(response);

    // 流式响应 如果需要实时逐词输出结果
    // const stream = await ollama.stream("讲一个关于太空旅行的故事。");
    // for await (const chunk of stream) {
    //     // process.stdout.write(chunk); // 逐词打印
    //     console.log(chunk);
    // }
}


async function chain(topicContent) {

    // 初始化 Ollama 模型
    const ollama = new Ollama({
        baseUrl: "http://localhost:11434", // 本地 Ollama 服务地址
        model: "llama3.2:1b", // 可根据实际情况更换模型
    });

    // 步骤 1：定义生成诗的提示模板
    const poemTemplate = "你是一位诗人，请根据主题 '{topic}' 写一首诗。";
    const poemPrompt = new PromptTemplate({
        template: poemTemplate,
        inputVariables: ["topic"],
    });

    // 创建生成诗的链
    const poemChain = new LLMChain({
        llm: ollama,
        prompt: poemPrompt,
        // verbose: true, // 可选：打印详细日志
    });

    // 步骤 2：定义为诗生成介绍的提示模板
    const introTemplate = "请赏析下面这首诗：\n{poem}";
    const introPrompt = new PromptTemplate({
        template: introTemplate,
        inputVariables: ["poem"],
    });

    // 创建为诗生成介绍的链
    const introChain = new LLMChain({
        llm: ollama,
        prompt: introPrompt,
        // verbose: true, // 可选：打印详细日志
    });

    // 步骤 3：将两个链组合成一个更大的链
    const overallChain = async (input) => {

        // 第一步：生成诗
        const poemResult = await poemChain.call(input);
        const poem = poemResult.text;

        // 第二步：为生成的诗生成介绍
        const introResult = await introChain.call({ poem });
        const introduction = introResult.text;
        return {
            poem,
            introduction,
        };
    };

    // 执行链
    const result = await overallChain({ topic: topicContent });
    console.log(result);
}

// 生成诗歌并给出赏析
async function poem(topicContent) {

    // 初始化 Ollama 模型
    const ollama = new Ollama({
        baseUrl: "http://localhost:11434", // 本地 Ollama 服务地址
        model: "llama3.2:1b", // 可根据实际情况更换模型
    });

    // 定义生成标题的 PromptTemplate
    const titlePrompt = new PromptTemplate({
        template: "你是一名诗人请以“{topic}”为主题写一首古诗",
        inputVariables: ["topic"],
    });

    const titleChain = new LLMChain({
        llm: ollama,
        prompt: titlePrompt,
        outputKey: "poem",
        // verbose: true, // 可选：打印详细日志
    })


    // 定义生成摘要的 PromptTemplate
    const summaryPrompt = new PromptTemplate({
        template: "请基于：{poem}这首诗做一个赏析",
        inputVariables: ["poem"],
    });

    const summaryChain = new LLMChain({
        llm: ollama,
        prompt: summaryPrompt,
        outputKey: "review",
    });
    const overallChain = new SequentialChain({
        chains: [titleChain, summaryChain],
        inputVariables: ["topic"],
        // Here we return multiple variables
        outputVariables: ["poem", "review"],
        verbose: false,
    });

    const chainExecutionResult = await overallChain.call({
        topic: topicContent,
    });
    console.log("诗词：\n" + chainExecutionResult.poem, "\n\n赏析：" + chainExecutionResult.review);
}


// 记忆存储
async function memory() {

    // 初始化 Ollama 模型
    const ollama = new Ollama({
        baseUrl: "http://localhost:11434", // 本地 Ollama 服务地址
        model: "qwen:0.5b",                   // 模型名称
    });

    // 初始化带记忆的对话链
    const memory = new BufferMemory();
    const conversation = new ConversationChain({
        llm: ollama,
        memory,
    });

    // 多轮对话
    await conversation.invoke({ input: "你好！" });
    const response = await conversation.invoke({ input: "我刚才说了什么？" });
    console.log(response.response)
}



async function test() {


}
module.exports = {
    simple,
    chain,
    memory,
    poem,
    test
}
