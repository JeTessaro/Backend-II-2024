const { userModel } = require("./models/users.model")

class UserDaoMongo {
    constructor(){
        this.model = userModel
    }
    createUser = async newUser => await this.model.create(newUser) 
    getUsers   = async () => await this.model.find()
    getUser    = async filter =>  await this.model.findOne(filter)
    updateUser = () => {}
    deleteUser = () => {}
}

module.exports = UserDaoMongo