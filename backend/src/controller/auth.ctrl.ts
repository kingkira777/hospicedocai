import User from "../models/user.model";
import Employee from "../models/employee.model";
import EmployeeAccount from "../models/employeeAccount.model";
import Company from "../models/company.model";
import bcrypt from "bcrypt";


export type RegisterInput = {
    company: string;
    companyId?: number;
    email: string;
    password: string;
}

class AuthController {


    Login = async (email: string, password: string) => {
        try {

            const employee = await EmployeeAccount.findOne({
                where: { email },
                attributes: ['id','email','password','accessLevel'], 
                include: [
                    {
                        model: Employee,
                        as: 'employee',
                        attributes: ['id', 'firstName', 'lastName'],
                        include : [
                            {
                                model : Company,
                                as : 'company',
                                attributes : ['id', 'name']
                            }
                        ]
                    },
                ]
            });

            if (employee) {
                const passwordMatch = await bcrypt.compare(password, employee.password || '');
                if (!passwordMatch) {
                    return 'invalid password';
                }
                return employee;
            }

            const user = await User.findOne({ 
                where: { email },
                attributes: ['id','email','password','role'], 
                include: [
                    {
                        model: Company,
                        as: 'company',
                        attributes: ['id', 'name']
                    }
                ] 
            });
            if (!user) {
                return 'user not found';
            }
            

            const passwordMatch = await bcrypt.compare(password, user.password || '');
            if (!passwordMatch) {
                return 'invalid password';
            }
            return user;
        } catch (error) {
            console.error("Error in AuthController Login:", error);
            throw error;
        }
    };


    Register = async (userData: Partial<RegisterInput>) => {
        try {

            //Create company first
            const findCompany = await Company.findOne({ where: { name: userData.company } });
            if (findCompany) {
                throw new Error("Company already exists");
            }
            const company = await Company.create({ name: userData.company });
            userData.companyId = company.id;

            const encryptedPassword = await bcrypt.hash(userData.password || '', 10);
            userData.password = encryptedPassword;

            const user = await User.create(userData);
            return user;
        } catch (error) {
            console.error("Error in AuthController Register:", error);
            throw error;
        }
    };
    

};

export default new AuthController();


