const { sequelize } = require("../../src/model");

const appMock = new Map();
appMock.set("sequelize", sequelize);
appMock.set("models", sequelize.models);

module.exports = appMock;
