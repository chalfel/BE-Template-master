const contractService = require("./contractService");
const adminService = require("./adminService");
const balanceService = require("./balanceService");
const jobService = require("./jobService");

module.exports = (app) => ({
    contractService: contractService(app),
    jobService: jobService(app),
    balanceService: balanceService(app),
    adminService: adminService(app),
})