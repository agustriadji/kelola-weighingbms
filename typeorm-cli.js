require("ts-node/register");
require("tsconfig-paths/register");

const { AppDataSource } = require("./src/database/source-database.ts");

module.exports = AppDataSource;
