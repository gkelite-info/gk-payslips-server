import { DataTypes, Model, type Optional } from "sequelize";
import sequelizeConnection from "../config.ts";
import Employees from "./employees.ts";

export interface EmployeeFinancialAttributes {
    employeeFinancialId: string;
    employeeId: string;
    bankName: string;
    bankAccountNumber: string;
    bankIfscCode: string;
    panNumber: string;
    basicSalary: number;
    houseRentAllowance: number;
    transportationAllowance: number;
    telephoneAllowance: number;
    statutoryBonus: number;
    specialAllowance: number;
    companyDeduction: number;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface EmployeeFinancialInput extends Optional<EmployeeFinancialAttributes, "employeeFinancialId"> { }
export interface EmployeeFinancialOutput extends EmployeeFinancialAttributes { }

class EmployeeFinancials extends Model<EmployeeFinancialAttributes, EmployeeFinancialInput> implements EmployeeFinancialAttributes {
    public employeeFinancialId!: string;
    public employeeId!: string;
    public bankName!: string;
    public bankAccountNumber!: string;
    public bankIfscCode!: string;
    public panNumber!: string;
    public basicSalary!: number;
    public houseRentAllowance!: number;
    public transportationAllowance!: number;
    public telephoneAllowance!: number;
    public statutoryBonus!: number;
    public specialAllowance!: number;
    public companyDeduction!: number;

    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;
}

EmployeeFinancials.init({
    employeeFinancialId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    employeeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "employees",
            key: "employeeId"
        },
        onUpdate: "CASCADE"
    },

    bankName: {
        type: DataTypes.STRING,
        allowNull: false
    },

    bankAccountNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },

    bankIfscCode: {
        type: DataTypes.STRING,
        allowNull: false
    },

    panNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },

    basicSalary: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },

    houseRentAllowance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },

    transportationAllowance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },

    telephoneAllowance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },

    statutoryBonus: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },

    specialAllowance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },

    companyDeduction: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    }
}, {
    timestamps: true,
    sequelize: sequelizeConnection,
    tableName: "employee_financials",
    indexes: [
        {
            name: "idx_employee_financials_employee_id",
            fields: ["employeeId"]
        }
    ]
});

EmployeeFinancials.belongsTo(Employees, { foreignKey: "employeeId", as: "employee", onUpdate: "CASCADE" });
Employees.hasMany(EmployeeFinancials, { foreignKey: "employeeId", as: "employeeFinancials" });

export default EmployeeFinancials;