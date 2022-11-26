const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./model");
const { getProfile } = require("./middleware/getProfile");
const { isContractor } = require("./middleware/isContractor");
const service = require("./service");
const {
  ENTITY_NOT_FOUND,
  AMOUNT_GREATHER_THAN_ALLOWED,
} = require("./constant/error");

const app = express();

app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);
app.set("services", service(app));

/**
 * @returns contract by id
 */
app.get("/contracts/:id", getProfile, async (req, res) => {
  const { profile, app, params } = req;
  const { contractService } = app.get("services");
  const { id } = params;
  try {
    const contract = await contractService.getContractById(id, profile);

    return res.json(contract);
  } catch (err) {
    if (err === ENTITY_NOT_FOUND) {
      return res.status(404).json({ message: err.message });
    }
    return res.status(500).end();
  }
});

/**
 * @returns contracts
 */
app.get("/contracts", getProfile, async (req, res) => {
  const { profile, app } = req;

  const { contractService } = app.get("services");
  try {
    const contracts = await contractService.getContracts(profile);

    return res.json(contracts);
  } catch (err) {
    if (err === ENTITY_NOT_FOUND) {
      return res.status(404).json({ message: err.message });
    }
    return res.status(500).end();
  }
});

/**
 * @returns unpaid jobs
 */
app.get("/jobs/unpaid", getProfile, async (req, res) => {
  const { jobService } = req.app.get("services")
  try {
    const unpaidJobs = await jobService.getUnpaidJobs(req.profile)
    return res.status(200).json(unpaidJobs)
  } catch (err) {
    if (err.message === ENTITY_NOT_FOUND) {
      return res.status(404).json({ message: err.message });
    }
    return res.status(500).end();
  }
});

/**
 * @returns void
 */
app.post("/jobs/:job_id/pay", getProfile, isContractor, async (req, res) => {
  const { Job, Profile, Contract } = req.app.get("models");
  const sequelize = req.app.get("sequelize");
  const transaction = await sequelize.transaction();

  const { profile } = req;

  const { job_id: id } = req.params;
  const { jobService } = req.app.get("services");

  try {
    await jobService.payJob(profile, id);
    return res.status(200).json({});
  } catch (err) {
    if (err.message === "Not found") {
      return res.status(400).end();
    }

    return res.status(500).end();
  }
});

app.post(
  "/balances/deposit/:userId",
  getProfile,
  isContractor,
  async (req, res) => {
    const { profile, params, body } = req;
    const { userId: id } = params;
    const { amount } = body;

    const { balanceService } = req.app.get("services");
    try {
      await balanceService.deposit(profile, amount, id);

      return res.status(200).json();
    } catch (err) {
      if (err.message === ENTITY_NOT_FOUND) {
        return res.status(404).json({ message: err.message });
      }

      if (err.message === AMOUNT_GREATHER_THAN_ALLOWED) {
        return res.status(400).json({ message: err.message });
      }

      return res.status(500).end();
    }
  }
);

app.get("/admin/best-profession", getProfile, async (req, res) => {
  const { start, end } = req.query;
  const { adminService } = req.app.get("services");

  const bestProfessions = await adminService.getBestProfessions(start, end);

  res.status(200).json(bestProfessions);
});

app.get("/admin/best-clients", getProfile, async (req, res) => {
  const { start, end, limit } = req.query;
  const { adminService } = req.app.get("services");

  const bestClients = await adminService.getBestClients(start, end, limit);

  res.status(200).json(bestClients);
});

module.exports = app;
