module.exports = {
  "secret": process.env.SECRET,
  "database": process.env.MONGO_CONNECTION_STRING,
  "api": {
    "profileAPI": process.env.USER_ENTITY_MICROSERVICE_URL
  }
}