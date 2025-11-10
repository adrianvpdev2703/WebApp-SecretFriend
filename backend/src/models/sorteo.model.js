const { DataTypes } = require("sequelize");

module.exports = sequelize => {
    const Sorteo = sequelize.define("Sorteo", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
        },
        status: {
            type: DataTypes.ENUM("pendiente", "iniciado"),
            defaultValue: "pendiente",
        },
        accessHash: {
            type: DataTypes.STRING,
            unique: true,
        },
    });

    return Sorteo;
};
