export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    uri: process.env.MONGODB_URI,
  },
  throttle: {
    ttl: 60,
    limit: 100,
  },
});
