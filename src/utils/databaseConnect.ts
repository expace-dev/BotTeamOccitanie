import * as mysql from 'mysql'
import config from '../config';


   export const db = mysql.createConnection({
        host: config.DB_HOST,
        user: config.DB_USER,
        password: config.DB_PASSWORD,
        database: config.DB_BASE
    });