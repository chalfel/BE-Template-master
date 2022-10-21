const { QueryTypes } = require("sequelize");

const adminService = (app) => ({
  async getBestProfessions(start, end) {
    const sequelize = app.get("sequelize");

    return sequelize.query(
      `
    SELECT p.profession, SUM(j.price) as amount from jobs j
    INNER JOIN contracts c
    ON c.id = j.ContractId
    INNER JOIN profiles p
    ON c.ContractorId = p.id
    WHERE j.paymentDate >= :startDate AND j.paymentDate <= :endDate
    AND j.paid = true
    AND p.type = 'contractor' 
    GROUP by p.profession
   `,
      {
        type: QueryTypes.SELECT,
        replacements: { startDate: start, endDate: end },
        raw: true,
      }
    );
  },

  async getBestClients(start, end, limit) {
    const sequelize = app.get("sequelize");

    return sequelize.query(
      `
      SELECT p.*, SUM(j.price) as paid from jobs j
      INNER JOIN contracts c
      ON c.id = j.ContractId
      INNER JOIN profiles p
      ON c.ClientId = p.id
      WHERE j.paymentDate >= :startDate AND j.paymentDate <= :endDate
      AND j.paid = true
      AND p.type = 'client' 
      LIMIT :limit
   `,
      {
        replacements: { startDate: start, endDate: end, limit: limit || 2 },
        type: QueryTypes.SELECT,
      }
    );
  },
});

module.exports = adminService;
