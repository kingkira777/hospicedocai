import {Table, Column, Model, DataType, BelongsTo, HasMany} from 'sequelize-typescript';
import Company from './company.model';
import Patient from './patient.model';

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
        allowNull : false
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
    
}
export default User;