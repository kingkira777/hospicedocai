import User from "../models/user.model";
import Company from "../models/company.model";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

export type UserCreateInput = {
    id?: number;
    company?: string;
    companyId?: number;
    email: string;
    password: string;
}

class UserController {

    List = async (companyId: number, userId: number) => {
        try {
            const users = await User.findAndCountAll({
                where: { 
                    companyId,
                    id: { [Op.ne]: userId }
                },
                include: [
                    {
                        model: Company,
                        as: 'company',
                        attributes: ['id', 'name']
                    }
                ],
                limit: 5,
                offset: 0,
                order: [['createdAt', 'DESC']]
            });
            return users;
        } catch (error) {
            console.error("Error in UserController List:", error);
            throw error;
        }
    };


    GetById = async (id: number) => {
        try {
            const user = await User.findByPk(id);
            return user;
        } catch (error) {
            console.error("Error in UserController GetById:", error);
            throw error;
        }
    };

    Create = async (userData: Partial<UserCreateInput>) => {
        try {

            const countUser = await User.count({ where: { companyId: userData.companyId } });
            if(countUser >= 4) {
                return "limit of users reached";
            }
            const encryptedPassword = await bcrypt.hash(userData.password || '', 10);
            userData.password = encryptedPassword;
            const newUser = await User.create(userData);
            return newUser;
        } catch (error) {
            console.error("Error in UserController Create:", error);
            throw error;
        }
    };

    Update = async (id: number, updateData: Partial<User>) => {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error("User not found");
            }

            if(updateData.password?.trim() === ""){
                delete updateData.password;
            }else{
                const encryptedPassword = await bcrypt.hash(updateData.password || '', 10);
                updateData.password = encryptedPassword;
            }

            console.log(updateData);

            await user.update(updateData);
            return user;
        } catch (error) {
            console.error("Error in UserController Update:", error);
            throw error;
        }
    };

    Remove = async (id: number) => {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error("User not found");
            }
            await user.destroy();
        } catch (error) {
            console.error("Error in UserController Delete:", error);
            throw error;
        }
    };

};


export default new UserController();
