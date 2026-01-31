import {Table, Column, Model, DataType, HasMany} from 'sequelize-typescript';
import User from './user.model';


@Table({
    paranoid : true,
    timestamps: true,
    tableName : 'Companies',
    createdAt : false,
    updatedAt : false
})
class Company extends Model {

    @Column({
        type : DataType.INTEGER,
        autoIncrement : true,
        primaryKey : true,
    })
    id! : number;

    @Column({
        type : DataType.STRING,
        allowNull : false
    })
    name! : string;
    
    @Column({
        type : DataType.DATE,
        allowNull : true
    })
    expirationDate! : any;
    
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


    @HasMany(() => User,{
        foreignKey : 'companyId',
        sourceKey : 'id',
        as : 'users'
    })
    users! : User[];



}

export default Company;