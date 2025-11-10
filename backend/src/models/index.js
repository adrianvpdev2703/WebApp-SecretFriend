// 1. Importa la conexión Y la librería Sequelize
const Sequelize = require("sequelize"); // <--- MODIFICADO
const sequelize = require("../config/db.config.js");

const db = {};

db.sequelize = sequelize;
db.Op = Sequelize.Op;

db.User = require("./user.model.js")(sequelize);
db.Sorteo = require("./sorteo.model.js")(sequelize);
db.Participant = require("./participant.model.js")(sequelize);

db.User.hasMany(db.Sorteo, {
    foreignKey: { name: "ownerId", allowNull: false },
    as: "sorteos",
});
db.Sorteo.belongsTo(db.User, {
    foreignKey: "ownerId",
    as: "owner",
});

db.Sorteo.hasMany(db.Participant, {
    foreignKey: { name: "sorteoId", allowNull: false },
    as: "participants",
    onDelete: "CASCADE",
});
db.Participant.belongsTo(db.Sorteo, {
    foreignKey: "sorteoId",
    as: "sorteo",
});

db.Participant.belongsTo(db.Participant, {
    as: "assignedPerson",
    foreignKey: "assignedPersonId",
});

module.exports = db;
