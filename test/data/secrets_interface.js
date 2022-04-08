module.exports = class Secrets {
  constructor(params) {
    this.mongodb = {
      username: params.mongodb.username,
      password: params.mongodb.password,
      host: params.mongodb.host,
      port: params.mongodb.port,
      database: params.mongodb.database,

    };
  }
};
