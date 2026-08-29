import { DataTypes, Model, type Optional } from "sequelize";
import sequelizeConnection from "../config.ts";
import Users from "./users.ts";

export type EmploymentType = "full-time" | "part-time" | "contract" | "intern";
export type WorkShift = "general" | "morning" | "night";
export type EmployeeStatus = "active" | "on-leave" | "terminated" | "probation";

export interface EmployeeAttributes {
    employeePk: string;
    userId: string;
    employeeId: string;
    joinedAt: Date | string;
    shift?: WorkShift;
    employmentType: EmploymentType;
    status: EmployeeStatus;
    probationEndDate?: Date | null;
    exitDate?: Date | null;
    emergencyContactName?: string;
    emergencyContactPhone?: string;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface EmployeeInput extends Optional<EmployeeAttributes, "employeePk" | "shift" | "probationEndDate" | "exitDate" | "emergencyContactName" | "emergencyContactPhone"> { }
export interface EmployeeOutput extends EmployeeAttributes { }

class Employees extends Model<EmployeeAttributes, EmployeeInput> implements EmployeeAttributes {
    public employeePk!: string;
    public userId!: string;
    public employeeId!: string;
    public joinedAt!: Date | string;
    public shift?: WorkShift;
    public employmentType!: EmploymentType;
    public status!: EmployeeStatus;
    public probationEndDate?: Date | null;
    public exitDate?: Date | null;
    public emergencyContactName?: string;
    public emergencyContactPhone?: string;

    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;
}

Employees.init({
    employeePk: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    employeeId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    joinedAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    shift: {
        type: DataTypes.ENUM("general", "morning", "night"),
        allowNull: true,
        defaultValue: "general"
    },
    employmentType: {
        type: DataTypes.ENUM("full-time", "part-time", "contract", "intern"),
        allowNull: false,
        defaultValue: "full-time"
    },
    status: {
        type: DataTypes.ENUM("active", "on-leave", "terminated", "probation"),
        allowNull: false,
        defaultValue: "active"
    },
    probationEndDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    exitDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    emergencyContactName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    emergencyContactPhone: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    sequelize: sequelizeConnection,
    tableName: "employees",
    indexes: [
        {
            name: "unq_employees_employee_id",
            unique: true,
            fields: ["employeeId"]
        },
        {
            name: "idx_employees_user_id",
            fields: ["userId"]
        }
    ]
});

Employees.belongsTo(Users, { foreignKey: "userId", as: "user", onUpdate: "CASCADE" });
Users.hasMany(Employees, { foreignKey: "userId", as: "employees" })

export default Employees;