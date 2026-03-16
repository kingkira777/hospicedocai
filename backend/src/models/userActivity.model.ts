import {Table, Column, Model, DataType, BelongsTo, HasMany} from 'sequelize-typescript';
import User from './user.model';

@Table({
    paranoid : true,
    timestamps: true,
    tableName : 'UserActivity',
    createdAt : false,
    updatedAt : false
})
class UserActivity extends Model {

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
    userId! : number;

    @Column({
        type : DataType.STRING,
        allowNull : false
    })
    module! : string;

    @Column({
        type : DataType.STRING,
        allowNull : false
    })
    action! : string;

    @Column({
        type : DataType.STRING,
        allowNull : false
    })
    ipAddress! : string;
    
    @Column({
        type : DataType.DATE,
        allowNull : false,
        defaultValue : DataType.NOW
    })
    createdAt! : any;

    @BelongsTo(() => User,{
        foreignKey : 'userId',
        targetKey : 'id',
        as : 'user'
    })
    company! : User;
    
}
export default UserActivity;