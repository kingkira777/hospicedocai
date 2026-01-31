import {Table, Column, Model, DataType, BelongsTo, HasMany} from 'sequelize-typescript';
import Company from './company.model';
import Patient from './patient.model';

@Table({
    paranoid : true,
    timestamps: true,
    tableName : 'Files',
    createdAt : false,
    updatedAt : false
})
class File extends Model {
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
    patientId! : number;

    @Column({
        type : DataType.STRING,
        allowNull : false
    })
    name! : string;

    @Column({
        type : DataType.STRING,
        allowNull : false
    })
    fileName! : string;

    @Column({
        type : DataType.STRING,
        allowNull : false
    })
    originalName! : string;

    @Column({
        type : DataType.TEXT,
        allowNull : false
    })
    filePath! : string;
    
    @Column({
        type : DataType.INTEGER,
        allowNull : false,
    })
    userId! : number;
    
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


    @BelongsTo(() => Patient,{
        foreignKey : 'patientId',
        targetKey : 'id',
        as : 'patient'
    })
    patient! : Patient;
    
}
export default File;