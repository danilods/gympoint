module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("enrollments", "enable", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn("enrollments", "enable");
  }
};
