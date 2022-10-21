const { ENTITY_NOT_FOUND } = require("../constant/error");

const contractService = (app) => ({
  async getContractById(id, profile) {
    const { Contract } = app.get("models");
    const { id: profileId, type } = profile;

    const clientOrContractQuery =
      type === "contractor"
        ? { ContractorId: profileId }
        : { ClientId: profileId };

    const contract = await Contract.findOne({
      where: { id, ...clientOrContractQuery },
    });

    if (!contract) throw new Error(ENTITY_NOT_FOUND);

    return contract;
  },

  async getContracts(profile) {
    const { Contract } = app.get("models");

    const { id, type } = profile;

    const clientOrContractQuery =
      type === "contractor" ? { ContractorId: id } : { ClientId: id };

    const contracts = await Contract.findAll({
      where: { ...clientOrContractQuery, status: "terminated" },
    });

    if (!contracts || contracts.length === 0) throw new Error(ENTITY_NOT_FOUND);
    return contracts;
  },
});

module.exports = contractService;
