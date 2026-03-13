module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./database/app.db"
    },
    useNullAsDefault: true
  }
};