import { userModel } from "./models/user.model.js";

class UserManager{
    constructor(){
        this.model = userModel
    }

    async getAllUsers(){
        let users;
    try{
        users = await userModel.find().lean();
    }catch(error){
        console.log(error);
    }
    return users;
    }

    async getUserById(id){
        let user;
    try{
        user = await userModel.findOne({_id:id});
    }catch(error){
        console.log(error);
    }
        return user;
    }

    async addUser(first_name, last_name, email){
        let user;
        try{
            user = await userModel.create({
                first_name, last_name, email
            });
        }catch(error){
            console.log(error);
        }
        return user;
    }

    async updateUser(userid, props){
        let user;
        try{
            user = await userModel.updateOne({_id:userid}, props)
        }catch(error){
            console.log(error);
        }
        return user;
    }
}

export default UserManager;