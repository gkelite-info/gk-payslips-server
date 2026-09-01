import { DataTypes, Model, type Optional } from "sequelize";
import sequelizeConnection from "../config.ts";
import Employees from "./employees.ts";

export type PayslipStatus = "draft" | "approved" | "paid";

export interface EmployeePayslipAttributes {
    employeePayslipId: string;
    employeeId: string;
    month: string;
    year: number;
    basicSalary: number;
    houseRentAllowance: number;
    transportationAllowance: number;
    telephoneAllowance: number;
    statutoryBonus: number;
    specialAllowance: number;
    companyDeduction: number;
    lossOfPay?: number;
    totalSalaryBeforeDeduction: number;
    totalSalaryAfterDeduction: number;
    status: PayslipStatus;
    is_deleted?: boolean | null;

    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface EmployeePayslipInput extends Optional<EmployeePayslipAttributes, "employeePayslipId" | "lossOfPay" | "status" | "is_deleted"> { }
export interface EmployeePayslipOutput extends EmployeePayslipAttributes { }

class EmployeePayslips extends Model<EmployeePayslipAttributes, EmployeePayslipInput> implements EmployeePayslipAttributes {
    public employeePayslipId!: string;
    public employeeId!: string;
    public month!: string;
    public year!: number;
    public basicSalary!: number;
    public houseRentAllowance!: number;
    public transportationAllowance!: number;
    public telephoneAllowance!: number;
    public statutoryBonus!: number;
    public specialAllowance!: number;
    public companyDeduction!: number;
    public lossOfPay?: number;
    public totalSalaryBeforeDeduction!: number;
    public totalSalaryAfterDeduction!: number;
    public status!: PayslipStatus;
    public is_deleted?: boolean | null;

    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;
    public readonly deletedAt?: Date;
}

EmployeePayslips.init({
    employeePayslipId: {
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

    month: {
        type: DataTypes.STRING,
        allowNull: false
    },

    year: {
        type: DataTypes.INTEGER,
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
    },

    lossOfPay: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    },

    totalSalaryBeforeDeduction: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },

    totalSalaryAfterDeduction: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },

    status: {
        type: DataTypes.ENUM("draft", "approved", "paid"),
        allowNull: false,
        defaultValue: "draft"
    },

    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true,
    paranoid: true,
    sequelize: sequelizeConnection,
    tableName: "employee_payslips",
    indexes: [
        {
            name: "idx_employee_payslips_employee_id",
            fields: ["employeeId"]
        },
        {
            name: "unq_employee_payslips_month_year",
            unique: true,
            fields: ["employeeId", "month", "year"],
            where: {
                deletedAt: null
            }
        }
    ]
});

EmployeePayslips.belongsTo(Employees, { foreignKey: "employeeId", as: "employee", onUpdate: "CASCADE" });
Employees.hasMany(EmployeePayslips, { foreignKey: "employeeId", as: "employeePayslips" });

export default EmployeePayslips;