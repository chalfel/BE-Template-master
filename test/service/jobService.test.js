const { ENTITY_NOT_FOUND } = require("../../src/constant/error");
const { Job, Profile } = require("../../src/model");
const jobService = require("../../src/service/jobService");

const appMock = require("../mock/appMock");

describe("Job Service", () => {
  describe("pay job", () => {
    it("should pay job", async () => {
      const jobFindOneSpy = jest.spyOn(Job, "findOne").mockResolvedValue({
        id: 1,
        price: 10,
        Contract: { Contractor: { id: 1 }, Client: { id: 5 } },
      });

      const profileFindOneSpy = jest
        .spyOn(Profile, "findOne")
        .mockResolvedValue({ balance: 10, id: 1 });
      const profileUpdateSpy = jest
        .spyOn(Profile, "update")
        .mockImplementationOnce();

      const jobUpdateSpy = jest.spyOn(Job, "update").mockImplementationOnce();

      const sut = jobService(appMock);

      await expect(
        sut.payJob({ id: 1, type: "contractor" }, 10)
      ).resolves.toBeUndefined();
      expect(jobFindOneSpy).toHaveBeenCalled();
      expect(profileFindOneSpy).toHaveBeenCalled();
      expect(profileUpdateSpy).toHaveBeenCalled();
      expect(jobUpdateSpy).toHaveBeenCalled();
    });

    it("should return error if job is not found", async () => {
      const jobFindOneSpy = jest.spyOn(Job, "findOne").mockResolvedValue(null);

      const profileFindOneSpy = jest
        .spyOn(Profile, "findOne")
        .mockResolvedValue({ balance: 10, id: 1 });
      const profileUpdateSpy = jest
        .spyOn(Profile, "update")
        .mockImplementationOnce();

      const jobUpdateSpy = jest.spyOn(Job, "update").mockImplementationOnce();

      const sut = jobService(appMock);

      await expect(
        sut.payJob({ id: 1, type: "contractor" }, 10)
      ).rejects.toThrow(ENTITY_NOT_FOUND);
      expect(jobFindOneSpy).toHaveBeenCalled();
      expect(profileFindOneSpy).not.toHaveBeenCalled();
      expect(profileUpdateSpy).not.toHaveBeenCalled();
      expect(jobUpdateSpy).not.toHaveBeenCalled();
    });

    it("should return error if client is not found", async () => {
      const jobFindOneSpy = jest.spyOn(Job, "findOne").mockResolvedValue({
        id: 1,
        price: 10,
        Contract: { Contractor: { id: 1 }, Client: { id: 5 } },
      });

      const profileFindOneSpy = jest
        .spyOn(Profile, "findOne")
        .mockResolvedValue(null);
      const profileUpdateSpy = jest
        .spyOn(Profile, "update")
        .mockImplementationOnce();

      const sut = jobService(appMock);

      await expect(
        sut.payJob({ id: 1, type: "contractor" }, 10)
      ).rejects.toThrow(ENTITY_NOT_FOUND);
      expect(jobFindOneSpy).toHaveBeenCalled();
      expect(profileFindOneSpy).toHaveBeenCalled();
      expect(profileUpdateSpy).not.toHaveBeenCalled();
    });

    it("should return error if something went wrong", async () => {
      const errorMessage = "test";
      const jobFindOneSpy = jest
        .spyOn(Job, "findOne")
        .mockImplementation(() => {
          throw new Error(errorMessage);
        });

      const profileFindOneSpy = jest
        .spyOn(Profile, "findOne")
        .mockResolvedValue(null);
      const profileUpdateSpy = jest
        .spyOn(Profile, "update")
        .mockImplementationOnce();

      const sut = jobService(appMock);

      await expect(
        sut.payJob({ id: 1, type: "contractor" }, 10)
      ).rejects.toThrow(errorMessage);
      expect(jobFindOneSpy).toHaveBeenCalled();
      expect(profileFindOneSpy).not.toHaveBeenCalled();
      expect(profileUpdateSpy).not.toHaveBeenCalled();
    });
  });

  describe("get unpaid jobs", () => {
    it("should return unpaid jobs for contractors", async () => {
      const jobFindAllSpy = jest
        .spyOn(Job, "findAll")
        .mockResolvedValue([{ id: 1 }]);

      const sut = jobService(appMock);

      const response = await sut.getUnpaidJobs(
        { id: 1, type: "contractor" },
        10
      );
      expect(response.length).toBeGreaterThan(0);
      expect(jobFindAllSpy).toHaveBeenCalled();
    });
    it("should return unpaid jobs for client", async () => {
      const jobFindAllSpy = jest
        .spyOn(Job, "findAll")
        .mockResolvedValue([{ id: 1 }]);

      const sut = jobService(appMock);

      const response = await sut.getUnpaidJobs({ id: 1, type: "client" }, 10);
      expect(response.length).toBeGreaterThan(0);
      expect(jobFindAllSpy).toHaveBeenCalled();
    });
    it("should return error if unpaid job is not found", async () => {
      const jobFindAllSpy = jest.spyOn(Job, "findAll").mockResolvedValue([]);

      const sut = jobService(appMock);

      await expect(
        sut.getUnpaidJobs({ id: 1, type: "contractor" }, 10)
      ).rejects.toThrow(ENTITY_NOT_FOUND);
      expect(jobFindAllSpy).toHaveBeenCalled();
    });
  });
});
