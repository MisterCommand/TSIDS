const prompts = require('prompts');
require('dotenv').config();
const fs = require('fs');
const mysql = require("mysql");

const table = "tsids"

const questions = [
    {
        type: 'text',
        name: 'db_host',
        message: 'MySQL database host IP'
    },
    {
        type: 'number',
        name: 'db_port',
        message: 'MySQL database port'
    },
    {
        type: 'text',
        name: 'db_user',
        message: 'MySQL database user'
    },
    {
        type: 'password',
        name: 'db_password',
        message: 'MySQL database password'
    },
    {
        type: 'text',
        name: 'db_database',
        message: 'MySQL database name'
    }
]
async function init() {
    // Warning If .env Is Set
    if (process.env.DB_HOST) {
        console.log("WARNING: .env file exists, will overwrite .env if continue")
    }
    const response = await prompts(questions);

    // Write To .env
    fs.writeFileSync('.env', `DB_HOST=${response.db_host}\nDB_PORT=${response.db_port}\nDB_USER=${response.db_user}\nDB_PASSWORD=${response.db_password}\nDB_DATABASE=${response.db_database}\nDB_TABLE=${table}`);

    // MYSQL
    var connection = mysql.createConnection({
        host: response.db_host,
        port: response.db_port,
        user: response.db_user,
        password: response.db_password,
        database: response.db_database,
    });

    sql = "CREATE TABLE " + table + " (title VARCHAR(255) PRIMARY KEY,content TEXT,subject VARCHAR(255),teacher VARCHAR(255),start DATE,end DATE,work VARCHAR(255),required VARCHAR(255),duplicate INT(255))";
    connection.query(sql, (error) => {
        if (error) {
            console.log(error)
        }
        connection.end();
    });
}

init()