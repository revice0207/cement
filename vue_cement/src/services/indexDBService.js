const dbName = 'Cement';
const dbVersion = 1;

let db

const request = indexDB.open(dbName, dbVersion)