require('dotenv').config();
module.exports = {
  development: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: false  // local, pas besoin de SSL
    }
  }
};