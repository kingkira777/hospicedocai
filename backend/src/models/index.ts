import { Sequelize } from "sequelize-typescript";

const dbName: string = process.env.DB_NAME || "";
const dbUser: string = process.env.DB_USERNAME || "";
const dbPwd: string = process.env.DB_PASSWORD || "";
const dbHostname: string = process.env.DB_HOST || "";


const db = new Sequelize({
    dialect : 'mysql',
    dialectOptions : {
      options : { "requestTimeout": 300000 }
    },
    host : dbHostname,
    database : dbName,
    username : dbUser,
    password : dbPwd,
    logging : false,
    models :  [__dirname + '/**/*{.model.ts,.model.js}']
});

export default db;
