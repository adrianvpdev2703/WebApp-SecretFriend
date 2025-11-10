const { DataTypes } = require("sequelize");

module.exports = sequelize => {
    const Participant = sequelize.define("Participant", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isIdentified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        wishlist: {
            type: DataTypes.TEXT,
        },
        personalHash: {
            type: DataTypes.STRING,
            unique: true,
        },
    });

    return Participant;
};
