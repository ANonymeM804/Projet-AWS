module.exports = {
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './migrations'
    },
    ssl: { rejectUnauthorized: false }
  }
};