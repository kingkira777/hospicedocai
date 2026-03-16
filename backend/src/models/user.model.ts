import {Table, Column, Model, DataType, BelongsTo, HasMany} from 'sequelize-typescript';
import Company from './company.model';
import Patient from './patient.model';
import UserActivity from './userActivity.model';

@Table({
    paranoid : true,
    timestamps: true,
    tableName : 'Users',
    createdAt : false,
    updatedAt : false
})
class User extends Model {

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
        unique : true,
        allowNull : false
    })
    email! : string;

    @Column({
        type : DataType.STRING,
        allowNull : true
    })
    password! : string;

    @Column({
        type : DataType.TEXT,
        allowNull : false,
        defaultValue : 'admin'
    })
    role! : string;
    
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

    @HasMany(() => Patient,{
        foreignKey : 'userId',
        sourceKey : 'id',
        as : 'patients'
    })
    patients! : Patient[];

    @HasMany(() => UserActivity,{
        foreignKey : 'userId',
        sourceKey : 'id',
        as : 'userActivities'
    })
    userActivities! : UserActivity[];
    
}
export default User;