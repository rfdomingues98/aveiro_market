module.exports = {
  "development": {
    "username": "admin",
    "password": 'password',
    "database": "aveiromarket",
    "host": "127.0.0.1",
    "dialect": "mariadb",
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
  },
  "production": {
    "username": process.env.MYSQL_USER,
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "host": process.env.MYSQL_HOST,
    "dialect": "mariadb",
  }
}