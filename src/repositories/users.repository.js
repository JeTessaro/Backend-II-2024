class UsersRepository {
    constructor(userDao) {
        this.userDao = userDao
    }
    getUsers = async () => await this.userDao.get()
    createUsers = async (addUsers) => await this.userDao.create(addUsers)
    getUsersById = async (userId) => {
        return await this.userDao.getById(userId)
    }
    updateUsers = async (userId, updatedData) => {
        return await this.userDao.update({ id: userId, ...updatedData })
    }
    deleteUsers = async (userId) => {
        return await this.userDao.delete(userId)
    }
}

module.exports = UsersRepository