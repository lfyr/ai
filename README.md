# 1.基础准备

npm i install # 初始化包

# 2.目录结构

database----- 数据库  
-----pgvector 数据库扩展  
knowledge 知识库文件  
service----- 服务逻辑  
-----document 核心逻辑  
utils----- 工具  
-----langchain.js langchain 基本使用  
-----ollama.js ollama api 服务  
-----parser.js parser 文本文档解析  
index.js----- 入口文件  
package.json----- 包管理

# 3.数据表

```sql
CREATE TABLE "public"."documents" (
  "id" int4 NOT NULL DEFAULT nextval('documents_id_seq'::regclass),
  "content" text COLLATE "pg_catalog"."default",
  "vector" "public"."vector",
  "created_at" timestamp(6),
  "updated_at" timestamp(6),
  CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
)
;

ALTER TABLE "public"."documents"
  OWNER TO "pgvector";
```
