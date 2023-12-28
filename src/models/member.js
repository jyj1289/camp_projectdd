module.exports = (sequelize, DataTypes) => {
    const Member = sequelize.define(
        "Member",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password:{
                type: DataTypes.STRING,
                allowNull: false,
            },
            nickname:{
                type: DataTypes.STRING,
                allowNull: false
            },
            score: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
        }
    )
    return Member;
};