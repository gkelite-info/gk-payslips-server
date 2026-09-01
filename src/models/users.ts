import { DataTypes, Model, Sequelize, type Optional } from "sequelize";
import sequelizeConnection from "../config.ts";

type UserRole = "fullstack" | "frontend" | "backend" | "database" | "designer" | "automationtester" | "manualtester" | "devops";

interface UserAttributes {
    userId: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
    email: string;
    mobile: string;
    alternateMobile?: string | null;
    isActive?: boolean | null;
    is_deleted?: boolean | null;

    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface UserInput extends Optional<UserAttributes, "userId" | "role" | "alternateMobile" | "isActive" | "is_deleted"> { }
export interface UserOutput extends UserAttributes { }

class Users extends Model<UserAttributes, UserInput> implements UserAttributes {
    public userId!: string;
    public firstName!: string;
    public lastName!: string;
    public role?: UserRole;
    public email!: string;
    public mobile!: string;
    public alternateMobile?: string | null;
    public isActive?: boolean | null;
    public is_deleted?: boolean | null;

    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;
    public readonly deletedAt?: Date;
}

Users.init({
    userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },

    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },

    role: {
        type: DataTypes.ENUM("fullstack", "frontend", "backend", "database", "designer", "automationtester", "manualtester", "devops"),
        allowNull: true,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },

    mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    alternateMobile: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },

    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
    },

    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
}, {
    timestamps: true,
    paranoid: true,
    sequelize: sequelizeConnection,
    tableName: "users",
    indexes: [
        {
            name: "unq_users_mobile",
            unique: true,
            fields: ["mobile"]
        },
        {
            name: "unq_users_alternate_mobile",
            unique: true,
            fields: ["alternateMobile"]
        },
        {
            name: "unq_users_email",
            unique: true,
            fields: ["email"]
        }
    ]
});


export default Users;