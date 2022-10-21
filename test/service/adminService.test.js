const adminService = require('../../src/service/adminService');
const appMock = require('../mock/appMock');

describe('Admin Service', () => {
    it('should return best clients', async () => {
        const sut = adminService(appMock);

        const response = await sut.getBestClients(new Date(1998, 10, 10), new Date(2022, 10, 10), 2)
        expect(response).toBeDefined()
        expect(response.length).toBeGreaterThan(0)
    }) 

    it('should return best professions', async () => {
        const sut = adminService(appMock);

        const response = await sut.getBestProfessions(new Date(1998, 10, 10), new Date(2022, 10, 10))

        expect(response).toBeDefined()
        expect(response.length).toBeGreaterThan(0)
    }) 
})