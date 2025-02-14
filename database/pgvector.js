const pg = require("pg");
const parse = require("pg-connection-string").parse;

if (!process.env.PG_DB_DSN) throw new Error("PG_DB_DSN dsn 不存在");
var config = parse(process.env.PG_DB_DSN);
const pgDb = new pg.Pool({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
    max: 20, // 连接最大连接数
    idleTimeoutMillis: 15000, // 连接最大空闲时间
});

// async function pgConnect() {
//   ass = await pgDb.query("SELECT * FROM resource");
//   console.log(ass);
// }
// pgConnect();

module.exports = { pgDb };
