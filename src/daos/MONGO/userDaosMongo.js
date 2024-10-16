const { userModel } = require("../../models/users.model")

class UserDaoMongo {
    constructor(){
        this.model = userModel
    }

    async getUsers(){
        return await this.model.find({})           
    }

    async getUser(filter){
        return await this.model.findOne(filter)
    }

    async createUser(newUser){
        return await this.model.create(newUser)
    }
    
    async updateUser(filter, update) {
        try {
            const result = await this.model.updateOne(filter, update);
            return result; 
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            throw error; 
        }
    }
        async deleteUser(uid){}
}

module.exports = UserDaoMongo