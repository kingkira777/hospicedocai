import User from "../models/user.model";
import Company from "../models/company.model";
import bcrypt from "bcrypt";


export type UserCreateInput = {
    id?: number;
    company?: string;
    companyId?: number;
    email: string;
    password: string;
}

class UserController {

    List = async () => {
        try {
            const users = await User.findAll();
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

            const findCompany = await Company.findOne({ where: { name: userData.company } });
            if (!findCompany) {
                throw new Error("Company not found");
            }
            userData.companyId = findCompany.id;

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
            await user.update(updateData);
            return user;
        } catch (error) {
            console.error("Error in UserController Update:", error);
            throw error;
        }
    };

    Delete = async (id: number) => {
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
