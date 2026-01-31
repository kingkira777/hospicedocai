import Patient from "../models/patient.model";


export type PatientInput = {
    companyId : number;
    firstName : string;
    lastName : string;
    gender : string;
    dateOfBirth : any;
    startOfCare : any;
};


class PatientController {


    ListSelect = async (companyId: number) => {
        try {
            const patients = await Patient.findAll({ where: { companyId } });
            return patients;
        } catch (error) {
            console.error("Error in PatientController ListSelect:", error);
            throw error;
        }
    };

    List = async (companyId: number, offset: number, limit: number) => {
        try {
            console.log("offset", offset);
            console.log("limit", limit);
            const patients =  	await Patient.findAndCountAll({ 
                where: { companyId }, 
                limit: limit, 
                offset: offset,
                order: [['id', 'DESC']] 
            });
            return patients;
        } catch (error) {
            console.error("Error in PatientController List:", error);
            throw error;
        }
    };


    Create = async (data: PatientInput) => {
        try {

            const countPatients = await Patient.count({ where: { companyId: data.companyId } });
            if (countPatients >= 15) {
                return false;
            }

            const newPatient = await Patient.create(data);
            return newPatient;
        } catch (error) {
            console.error("Error in PatientController Create:", error);
            throw error;
        }
    };

    GetById = async (id: number) => {
        try {
            const patient = await Patient.findByPk(id);
            return patient;
        } catch (error) {
            console.error("Error in PatientController GetById:", error);
            throw error;
        }
    };

    Update = async (id: number, data: Partial<PatientInput>) => {
        try {
            const patient = await Patient.findByPk(id);
            if (!patient) {
                throw new Error("Patient not found");
            }
            await patient.update(data);
            return patient;
        } catch (error) {
            console.error("Error in PatientController Update:", error);
            throw error;
        }
    };


    Remove = async (id: number) => {
        try {
            const patient = await Patient.findByPk(id);
            if (!patient) {
                throw new Error("Patient not found");
            }
            await patient.destroy();
            return patient;
        } catch (error) {
            console.error("Error in PatientController Remove:", error);
            throw error;
        }
    };

}

export default new PatientController();