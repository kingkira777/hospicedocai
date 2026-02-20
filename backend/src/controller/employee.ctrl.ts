import Employee from "../models/employee.model";
import EmployeeAccount from "../models/employeeAccount.model";
import EmployeeProfInformation from "../models/employeeProfInforamtion.model";
import bcrypt from "bcrypt";



class EmployeeController {


    List = (companyId : number, limit:number, offset:number) => {
        try {
            const employees = Employee.findAndCountAll({
                where : {
                    companyId : companyId
                },
                include : [
                    {
                        model : EmployeeAccount,
                        as : 'account'
                    },
                    {
                        model : EmployeeProfInformation,
                        as : 'profInfo'
                    }
                ],
                order : [['createdAt','DESC']],
                offset,
                limit
            });
            return employees;
        } catch (error) {
            console.error('Error fetching employees:', error);
            return null;
        }
    };


    Create = async (employeeData : any) => {
        try {
            
            const employeePayload = {
                companyId : employeeData.companyId,
                firstName : employeeData.firstName,
                lastName : employeeData.lastName,
                dateOfBirth : employeeData.dateOfBirth,
                address : employeeData.address,
                zipcode : employeeData.zipcode,
                ssn : employeeData.ssn,
                driverLic : employeeData.driverLic,
                phoneNumber : employeeData.phoneNumber,
                cellPhoneNumber : employeeData.cellPhoneNumber,
                faxNumber : employeeData.faxNumber,
            };

            const employee = await Employee.create(employeePayload);

            const profInformationPayload = {
                employeeId : employee.id,
                jobTitle : employeeData.profInfo.jobTitle,
                discipline : employeeData.profInfo.discipline,
                profLic : employeeData.profInfo.profLic,
                npi : employeeData.profInfo.npi,
                startDate : employeeData.profInfo.startDate,
                endDate : employeeData.profInfo.endDate,
                validTill : employeeData.profInfo.validTill
            }; 

            await EmployeeProfInformation.create(profInformationPayload);

            const accountPayload = {
                employeeId : employee.id,
                email : employeeData.account.email,
                status : employeeData.account.status,
                accessLevel : employeeData.account.accessLevel
            }; 
            
            await EmployeeAccount.create(accountPayload);

            return employee;
        } catch (error) {
            console.error('Error creating employee:', error);
            return null;
        }
    };

    Update = async (employeeId : number, employeeData : any) => {
        try {
            const employeePayload = {
                companyId : employeeData.companyId,
                firstName : employeeData.firstName,
                lastName : employeeData.lastName,
                dateOfBirth : employeeData.dateOfBirth,
                address : employeeData.address,
                zipcode : employeeData.zipcode,
                ssn : employeeData.ssn,
                driverLic : employeeData.driverLic,
                phoneNumber : employeeData.phoneNumber,
                cellPhoneNumber : employeeData.cellPhoneNumber,
                faxNumber : employeeData.faxNumber,
            }

            const employee = await Employee.update(employeePayload,{
                where : {
                    id : employeeId
                }
            });

            const profInformationPayload = {
                jobTitle : employeeData.profInfo.jobTitle,
                discipline : employeeData.profInfo.discipline,
                profLic : employeeData.profInfo.profLic,
                npi : employeeData.profInfo.npi,
                startDate : employeeData.profInfo.startDate,
                endDate : employeeData.profInfo.endDate,
                validTill : employeeData.profInfo.validTill
            };
            await EmployeeProfInformation.update(profInformationPayload,{
                where : {
                    employeeId : employeeId
                }
            });
            return employee;
        } catch (error) {
            console.error('Error updating employee:', error);
            return null;
        }
    };

    UpdateAccount = async (employeeId : number, accountData : any) => {
        try {

            const encryptedPassword = await bcrypt.hash(accountData.password || '', 10);

            const accountPayload = {
                password : encryptedPassword,
            };
            const account = await EmployeeAccount.update(accountPayload, {
                where : {
                    employeeId : employeeId
                }
            });
            return account;
        } catch (error) {
            console.error('Error updating employee account:', error);
            return null;
        }
    };

    Remove = async (employeeId : number) => {
        try {
            const employee = await Employee.destroy({
                where : {
                    id : employeeId
                }
            });
            await EmployeeProfInformation.destroy({
                where : {
                    employeeId : employeeId
                }
            });

            await EmployeeAccount.destroy({
                where : {
                    employeeId : employeeId
                }
            });
            return employee;
        } catch (error) {
            console.error('Error removing employee:', error);
            return null;
        }
    };

};


export default new EmployeeController();
