const { AMOUNT_GREATHER_THAN_ALLOWED, ENTITY_NOT_FOUND } = require("../../src/constant/error")
const { Job, Profile } = require("../../src/model")
const balanceService = require("../../src/service/balanceService")

const appMock = require("../mock/appMock")

describe('Balance Service', () => {
 it('should deposit money on user balance', async () => {
        const jobFindAllSpy = jest.spyOn(Job, 'findAll').mockResolvedValueOnce([{ price: 10 }, { price: 200 }])
        const profileFindOneSpy = jest.spyOn(Profile, 'findOne').mockResolvedValueOnce({ balance: 10 })
        const profileUpdateSpy = jest.spyOn(Profile, 'update').mockImplementationOnce()

        const sut = balanceService(appMock)

        await expect(sut.deposit({ id: 1, type: 'contractor'}, 10, 1)).resolves.toBeUndefined()
        expect(jobFindAllSpy).toHaveBeenCalled()
        expect(profileFindOneSpy).toHaveBeenCalled()
        expect(profileUpdateSpy).toHaveBeenCalled()
    })

 it('should return error if amount is over than 25% of maximum job price', async () => {
        const jobFindAllSpy = jest.spyOn(Job, 'findAll').mockResolvedValueOnce([{ price: 10 }, { price: 10 }])
        const profileFindOneSpy = jest.spyOn(Profile, 'findOne').mockResolvedValue({ balance: 10 })
        const profileUpdateSpy = jest.spyOn(Profile, 'update').mockImplementationOnce()

        const sut = balanceService(appMock)

        await expect(sut.deposit({ id: 1, type: 'contractor'}, 10, 1)).rejects.toThrow(AMOUNT_GREATHER_THAN_ALLOWED)
        expect(jobFindAllSpy).toHaveBeenCalled()
        expect(profileFindOneSpy).not.toHaveBeenCalled()
        expect(profileUpdateSpy).not.toHaveBeenCalled()

        profileFindOneSpy.mockClear()
    })

 it('should return error if client is not found', async () => {
        const jobFindAllSpy = jest.spyOn(Job, 'findAll').mockResolvedValueOnce([{ price: 10 }, { price: 200 }])
        const profileFindOneSpy = jest.spyOn(Profile, 'findOne').mockResolvedValue(null)
        const profileUpdateSpy = jest.spyOn(Profile, 'update').mockImplementationOnce()

        const sut = balanceService(appMock)

        await expect(sut.deposit({ id: 1, type: 'contractor'}, 10, 1)).rejects.toThrow(ENTITY_NOT_FOUND)
        expect(jobFindAllSpy).toHaveBeenCalled()
        expect(profileFindOneSpy).toHaveBeenCalled()
        expect(profileUpdateSpy).not.toHaveBeenCalled()
    })

 it('should return error if job is not found', async () => {
        const jobFindAllSpy = jest.spyOn(Job, 'findAll').mockResolvedValue([])
        const profileFindOneSpy = jest.spyOn(Profile, 'findOne').mockResolvedValue(null)
        const profileUpdateSpy = jest.spyOn(Profile, 'update').mockImplementationOnce()

        const sut = balanceService(appMock)

        await expect(sut.deposit({ id: 1, type: 'contractor'}, 10, 1)).rejects.toThrow(ENTITY_NOT_FOUND)
        expect(jobFindAllSpy).toHaveBeenCalled()
        expect(profileFindOneSpy).not.toHaveBeenCalled()
        expect(profileUpdateSpy).not.toHaveBeenCalled()
    })
})