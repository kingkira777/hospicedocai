import {Table, Column, Model, DataType, BelongsTo, HasMany} from 'sequelize-typescript';
import Company from './company.model';
import User from './user.model';
import File from './files.model';
import PatientADR from './patientAdr.model';

@Table({
    paranoid : true,
    timestamps: true,
    tableName : 'Patients',
    createdAt : false,
    updatedAt : false
})
class Patient extends Model {

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
        type : DataType.STRING(50),
        allowNull : false
    })
    gender! : string;

    @Column({
        type : DataType.DATEONLY,
        allowNull : false
    })
    dateOfBirth! : any;

    @Column({
        type : DataType.DATEONLY,
        allowNull : false
    })
    startOfCare! : any;

    @Column({
        type : DataType.INTEGER,
        allowNull : false
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


    @BelongsTo(() => Company,{
        foreignKey : 'companyId',
        targetKey : 'id',
        as : 'company'
    })
    company! : Company;

    @BelongsTo(() => User,{
        foreignKey : 'userId',
        targetKey : 'id',
        as : 'user'
    })
    user! : User;

    @HasMany(() => File,{
        foreignKey : 'patientId',
        sourceKey : 'id',
        as : 'files'
    })
    files! : File[];

    @HasMany(() => PatientADR,{
        foreignKey : 'patientId',
        sourceKey : 'id',
        as : 'patientAdr'
    })
    patientAdr! : PatientADR[];
    
}
export default Patient;