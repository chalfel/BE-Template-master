const { Op } = require("sequelize");
const { ENTITY_NOT_FOUND } = require("../constant/error");

const jobService = (app) => ({
  async payJob(profile, id) {
    const { Job, Profile, Contract } = app.get("models");
    const sequelize = app.get("sequelize");
    const transaction = await sequelize.transaction();

    try {
      const unpaidJob = await Job.findOne({
        where: {
          id,
          paid: { [Op.or]: [{ [Op.is]: null }, { [Op.eq]: false }] },
        },
        lock: true,
        transaction,
        include: [
          {
            model: Contract,
            required: true,
            include: [
              {
                as: "Contractor",
                model: Profile,
                required: true,
                where: { id: profile.id },
              },
              {
                as: "Client",
                model: Profile,
                required: true,
              },
            ],
          },
        ],
      });

      if (!unpaidJob) throw new Error(ENTITY_NOT_FOUND);

      const client = await Profile.findOne({
        lock: true,
        transaction,
        where: { id: unpaidJob.Contract.Client.id, type: "client" },
      });

      if (!client || client.balance < unpaidJob.price)
        throw new Error(ENTITY_NOT_FOUND);

      const contractor = await Profile.findOne({
        lock: true,
        transaction,
        where: { id: unpaidJob.Contract.Contractor.id, type: "contractor" },
      });

      if (!contractor) throw new Error(ENTITY_NOT_FOUND);

      await Profile.update(
        { balance: contractor.balance + unpaidJob.price },
        { where: { id: contractor.id }, lock: true, transaction }
      );
      await Profile.update(
        { balance: client.balance - unpaidJob.price },
        { where: { id: client.id }, lock: true, transaction }
      );

      await Job.update(
        { paid: true },
        { where: { id: unpaidJob.id }, lock: true, transaction }
      );

      transaction.commit();

      return;
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  },

  async getUnpaidJobs(profile) {
    const { Job, Contract } = app.get("models");

    const { id, type } = profile;

    const clientOrContractQuery =
      type === "contractor" ? { ContractorId: id } : { ClientId: id };

    const unpaidJobs = await Job.findAll({
      where: { paid: { [Op.or]: [{ [Op.is]: null }, { [Op.eq]: false }] } },
      include: [{ model: Contract, where: { ...clientOrContractQuery } }],
    });

    if (!unpaidJobs || unpaidJobs.length === 0)
      throw new Error(ENTITY_NOT_FOUND);

    return unpaidJobs;
  },
});

module.exports = jobService;
