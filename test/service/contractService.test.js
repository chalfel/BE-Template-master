const { ENTITY_NOT_FOUND } = require("../../src/constant/error");
const { Contract } = require("../../src/model");
const contractService = require("../../src/service/contractService");
const appMock = require("../mock/appMock");

describe("Contract Service", () => {
  describe("Get Contract By Id", () => {
    it("should return contract by id for contractor", async () => {
      const contractFindOneSpy = jest
        .spyOn(Contract, "findOne")
        .mockResolvedValue({});

      const sut = contractService(appMock);

      await expect(
        sut.getContractById(10, { id: 1, type: "contractor" })
      ).resolves.toBeDefined();
      expect(contractFindOneSpy).toHaveBeenCalled();
    });

    it("should return contract by id for client", async () => {
      const contractFindOneSpy = jest
        .spyOn(Contract, "findOne")
        .mockResolvedValue({});

      const sut = contractService(appMock);

      await expect(
        sut.getContractById(10, { id: 1, type: "client" })
      ).resolves.toBeDefined();
      expect(contractFindOneSpy).toHaveBeenCalled();
    });

    it("should return error if contract is not found", async () => {
      const contractFindOneSpy = jest
        .spyOn(Contract, "findOne")
        .mockResolvedValue(null);

      const sut = contractService(appMock);

      await expect(
        sut.getContractById(10, { id: 1, type: "contractor" })
      ).rejects.toThrow(ENTITY_NOT_FOUND);
      expect(contractFindOneSpy).toHaveBeenCalled();
    });
  });

  describe("Get Contracts ", () => {
    it("should return contracts for contractor", async () => {
      const contractFindAllSpy = jest
        .spyOn(Contract, "findAll")
        .mockResolvedValue([{}]);

      const sut = contractService(appMock);

      await expect(
        sut.getContracts({ id: 1, type: "contractor" })
      ).resolves.toBeDefined();
      expect(contractFindAllSpy).toHaveBeenCalled();
    });

    it("should return contracts for client", async () => {
      const contractFindAllSpy = jest
        .spyOn(Contract, "findAll")
        .mockResolvedValue([{}]);

      const sut = contractService(appMock);

      await expect(
        sut.getContracts({ id: 1, type: "client" })
      ).resolves.toBeDefined();
      expect(contractFindAllSpy).toHaveBeenCalled();
    });

    it("should return error if contract is not found", async () => {
      const contractFindAllSpy = jest
        .spyOn(Contract, "findAll")
        .mockResolvedValue(null);

      const sut = contractService(appMock);

      await expect(
        sut.getContracts({ id: 1, type: "client" })
      ).rejects.toThrow(ENTITY_NOT_FOUND);
      expect(contractFindAllSpy).toHaveBeenCalled();
    });
  });
});
