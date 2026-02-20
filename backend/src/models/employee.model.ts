import {Table, Column, Model, DataType, BelongsTo, HasMany, HasOne} from 'sequelize-typescript';
import Company from './company.model';
import EmployeeAccount from './employeeAccount.model';
import EmployeeProfInformation from './employeeProfInforamtion.model';

@Table({
    paranoid : true,
    timestamps: true,
    tableName : 'Employees',
    createdAt : false,
    updatedAt : false
})
class Employee extends Model {

    @Column({
        type : DataType.INTEGER,
        autoIncrement : true,
        primaryKey : true,
    })
    id! : number;

    @Column({
        type : DataType.INTEGER,
        allowNull : false
    })
    companyId! : number;

    @Column({
        type : DataType.STRING,
        allowNull : false
    })
    firstName! : string;

    @Column({
        type : DataType.STRING,
        allowNull : false
    })
    lastName! : string;

    @Column({
        type : DataType.DATEONLY,
        allowNull : true
    })
    dateOfBirth! : string;

    @Column({
        type : DataType.STRING,
        allowNull : true
    })
    address! : string;

    @Column({
        type : DataType.STRING,
        allowNull : true
    })
    zipcode! : string;

    @Column({
        type : DataType.STRING,
        allowNull : true
    })
    ssn! : string;

    @Column({
        type : DataType.STRING,
        allowNull : true
    })
    driverLic! : string;

    @Column({
        type : DataType.STRING,
        allowNull :true,
    })
    phoneNumber! : string;

    @Column({
        type : DataType.STRING,
        allowNull :true,
    })
    cellPhoneNumber! : string;

    @Column({
        type : DataType.STRING,
        allowNull :true,
    })
    faxNumber! : string;
    
    @Column({
        type : DataType.DATE,
        allowNull : false,
        defaultValue : DataType.NOW
    })
    createdAt! : any;

    
    @Column({
        type : DataType.DATE,
        allowNull : false,
        defaultValue : DataType.NOW
    })
    updatedAt! : any;

    @BelongsTo(() => Company,{
        foreignKey : 'companyId',
        targetKey : 'id',
        as : 'company'
    })
    company! : Company;
    
    @HasOne(() => EmployeeAccount,{
        foreignKey : 'employeeId',
        sourceKey : 'id',
        as : 'account'
    })
    employeeAccount! : EmployeeAccount;

    @HasOne(() => EmployeeProfInformation,{
        foreignKey : 'employeeId',
        sourceKey : 'id',
        as : 'profInfo'
    })
    employeeProfInformation! : EmployeeProfInformation;
}
export default Employee;