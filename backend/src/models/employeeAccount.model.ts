import {Table, Column, Model, DataType, BelongsTo, HasMany} from 'sequelize-typescript';
import Employee from './employee.model';

@Table({
    paranoid : true,
    timestamps: true,
    tableName : 'EmployeeAccounts',
    createdAt : false,
    updatedAt : false
})
class EmployeeAccount extends Model {

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
    employeeId! : number;

    @Column({
        type : DataType.STRING,
        allowNull : false
    })
    email! : string;

    @Column({
        type : DataType.STRING(50),
        allowNull : false
    })
    accessLevel! : string;

    @Column({
        type : DataType.STRING(50),
        allowNull : false
    })
    status! : string;

    @Column({
        type : DataType.STRING,
        allowNull : true
    })
    password! : string;

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

    @BelongsTo(() => Employee,{
        foreignKey : 'employeeId',
        targetKey : 'id',
        as : 'employee'
    })
    employee! : Employee;
    
}
export default EmployeeAccount;