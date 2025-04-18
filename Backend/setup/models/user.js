import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isEmailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        emailVerificationToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        emailVerificationExpires: {
            type: DataTypes.DATE,
            allowNull: true
        },
        passwordResetToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        passwordResetExpires: {
            type: DataTypes.DATE,
            allowNull: true
        },
        role: {
            type: DataTypes.ENUM('admin', 'staff', 'healthcare_worker'),
            defaultValue: 'healthcare_worker'
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive', 'suspended'),
            defaultValue: 'inactive'
        },
        lastLogin: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        timestamps: true
    });

    return User;
};