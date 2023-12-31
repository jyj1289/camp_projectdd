const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development"
const config = require("../config/index")[env];
const db = {};

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

db.member = require("./member")(sequelize, Sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;