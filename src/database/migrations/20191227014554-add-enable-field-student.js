module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("students", "enable", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn("students", "enable");
  }
};
