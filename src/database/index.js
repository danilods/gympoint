import Sequelize from "sequelize";
import User from "../app/models/User";
import File from "../app/models/File";
import Enrollment from "../app/models/Enrollment";
import Checkin from "../app/models/Checkin";
import Student from "../app/models/Student";
import Plan from "../app/models/Plan";
import Helper from "../app/models/Helper";

import databaseConfig from "../config/database";

const models = [User, File, Enrollment, Checkin, Student, Plan, Helper];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      // fazer a chamada do metodo associate(relacionamentos) somente nos models
      // que estiverem com o mesmo declarado
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
