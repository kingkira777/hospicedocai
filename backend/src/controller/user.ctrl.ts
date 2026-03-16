import User from "../models/user.model";
import Company from "../models/company.model";
import UserActivity from "../models/userActivity.model";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { Request  } from "express";


export type UserCreateInput = {
    id?: number;
    company?: string;
    companyId?: number;
    email: string;
    password: string;
}

export type UserActivityInput = {
    userId: number;
    module: string;
    action: string;
    req: Request
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

    GetUserActivity = async (userId: number, limit?: number, offset?: number) => {
        try {
            const userActivity = await UserActivity.findAndCountAll({
                where: { userId },
                limit: limit || 10,
                offset: offset || 0,
                order: [['createdAt', 'DESC']]
            });
            return userActivity;
        } catch (error) {
            console.error("Error in UserController GetUserActivity:", error);
            throw error;
        }
    };


    LogUserActivity = async (data : UserActivityInput)  => {
        try {
            const payload = {
                userId: data.userId,
                module: data.module,
                action: data.action,
                ipAddress: this.CleanIPAddress(data.req),
            };
            const userActivity = await UserActivity.create(payload);
            return userActivity;
        } catch (error) {
            console.error("Error in UserController LogUserActivity:", error);
            throw error;
        }
    };


    CleanIPAddress = (req: Request) => {
        try {
            const xForwardedFor = req.headers['x-forwarded-for'];
            let ip = '';
            if (xForwardedFor) {
                const list = Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor.split(',')[0];
                ip = list.trim();
            } else {
                ip = req.headers['cf-connecting-ip'] as string || 
                    req.headers['x-real-ip'] as string || 
                    req.socket.remoteAddress || 
                    '';
            }

            // Clean up the IPv6 loopback prefix (::ffff:) for IPv4 compatibility
            if (ip.includes('::ffff:')) {
                ip = ip.split('::ffff:')[1];
            }
            return ip;
        } catch (error) {
            console.error("Error in UserController CleanIPAddress:", error);
            throw error;
        }
    };


};


export default new UserController();
