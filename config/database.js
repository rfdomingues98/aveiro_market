const Sequelize = require('sequelize');
const mariadb = require('mariadb');

var checkIfDbExists = function () {

	var dbName = process.env.MYSQL_DATABASE,
		dbUser = process.env.NODE_ENV == 'production' ? process.env.MYSQL_USER : 'admin',
		password = process.env.NODE_ENV == 'production' ? process.env.MYSQL_PASSWORD : 'password',
		host = process.env.NODE_ENV == 'production' ? process.env.MYSQL_HOST : '127.0.0.1';

	mariadb.createConnection({
		host,
		user: dbUser,
		password,
		connectionLimit: 5
	}).then(conn => {
		conn.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`).then(() => {
			console.log(`MARIADB: ${dbName} database was created.`);
			conn.end();
		}).catch(err => {
			console.log(`MARIADB: Error creating ${dbName} database!`);
		});
	});
}

var db = new Sequelize(
	process.env.MYSQL_DATABASE,
	process.env.NODE_ENV == 'production' ? process.env.MYSQL_USER : 'admin',
	process.env.NODE_ENV == 'production' ? process.env.MYSQL_PASSWORD : 'password', {
		dialect: 'mariadb',
		dialectOptions: {
			timezone: process.env.DB_TIMEZONE
		},
		host: process.env.NODE_ENV == 'production' ? process.env.MYSQL_HOST : '127.0.0.1',
		logging: false,
		define: {
			timestamps: true
		}
	},
);

module.exports = {
	checkIfDbExists: checkIfDbExists,
	db: db
}