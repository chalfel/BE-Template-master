const { Op } = require("sequelize");
const { AMOUNT_GREATHER_THAN_ALLOWED, ENTITY_NOT_FOUND } = require("../constant/error");

const balanceService = (app) => ({
    async deposit(profile, amount, id) {

    const { Job, Profile, Contract } = app.get("models");

    const sequelize = app.get("sequelize");
    const transaction = await sequelize.transaction();

    try {
      const unpaidJobs = await Job.findAll({
        where: {
          id,
          paid: { [Op.or]: [{ [Op.is]: null }, { [Op.eq]: true }] },
        },
        lock: true,
        transaction,
        include: [
          {
            model: Contract,
            required: true,
            include: [
              {
                model: Profile,
                as: "Contractor",
                required: true,
                where: { id: profile.id },
              },
            ],
          },
        ],
      });

      if (!unpaidJobs || unpaidJobs.length === 0) throw new Error(ENTITY_NOT_FOUND);

      const maxiumMoneyToPay = unpaidJobs.reduce(
        (prev, curr) => prev + curr.price,
        0
      );

      if (amount > maxiumMoneyToPay * 0.25) throw new Error(AMOUNT_GREATHER_THAN_ALLOWED);

      const client = await Profile.findOne({
        lock: true,
        transaction,
        where: { id: profile.id, type: "contractor" },
      });

      if (!client) throw new Error(ENTITY_NOT_FOUND);

      await Profile.update(
        { balance: client.balance + amount },
        { where: { id: client.id }, lock: true, transaction }
      );

      transaction.commit();

      return
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }
    }
)


module.exports = balanceService;