import {Table, Column, Model, DataType, BelongsTo} from 'sequelize-typescript';
import Patient from './patient.model';

@Table({
    paranoid : true,
    timestamps: true,
    tableName : 'PatientADR',
    createdAt : false,
    updatedAt : false
})
class PatientADR extends Model {
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
        type : DataType.TEXT,
        allowNull : true
    })
    data! : string;
    
    @Column({
        type : DataType.BOOLEAN,
        allowNull : false,
        defaultValue : false
    })
    isDefault! : boolean;
    
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
export default PatientADR;