export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  mongo: {
    mongoUrl: process.env.MONGO_URL,
    db_name: process.env.DB_NAME,
  },
});
