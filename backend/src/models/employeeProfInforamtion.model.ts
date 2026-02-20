import {Table, Column, Model, DataType, BelongsTo, HasMany} from 'sequelize-typescript';
import Employee from './employee.model';

@Table({
    paranoid : true,
    timestamps: true,
    tableName : 'EmployeeProfInformations',
    createdAt : false,
    updatedAt : false
})
class EmployeeProfInformation extends Model {

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
    jobTitle! : string;

    @Column({
        type : DataType.STRING,
        allowNull : false
    })
    discipline! : string;

    @Column({
        type : DataType.STRING,
        allowNull : true
    })
    profLic! : string;

    @Column({
        type : DataType.STRING,
        allowNull : false
    })
    npi! : string;

    @Column({
        type : DataType.DATEONLY,
        allowNull : true
    })
    startDate! : string;

    @Column({
        type : DataType.DATEONLY,
        allowNull : true
    })
    endDate! : string;

    @Column({
        type : DataType.DATEONLY,
        allowNull : true
    })
    validTill! : string;

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
export default EmployeeProfInformation;