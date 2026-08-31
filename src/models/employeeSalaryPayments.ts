import { DataTypes, Model, type Optional } from "sequelize";
import sequelizeConnection from "../config.ts";
import Employees from "./employees.ts";
import EmployeePayslips from "./employeePayslips.ts";

export type PaymentMethod = "bank_transfer" | "cheque" | "cash";

export interface EmployeeSalaryPaymentAttributes {
    employeeSalaryPaymentId: string;
    employeePayslipId: string;
    employeeId: string;
    amountPaid: number;
    paymentDate: Date | string;
    paymentMethod: PaymentMethod;
    transactionReference?: string;
    remarks?: string;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface EmployeeSalaryPaymentInput extends Optional<EmployeeSalaryPaymentAttributes, "employeeSalaryPaymentId" | "transactionReference" | "remarks"> { }
export interface EmployeeSalaryPaymentOutput extends EmployeeSalaryPaymentAttributes { }

class EmployeeSalaryPayments extends Model<EmployeeSalaryPaymentAttributes, EmployeeSalaryPaymentInput> implements EmployeeSalaryPaymentAttributes {
    public employeeSalaryPaymentId!: string;
    public employeePayslipId!: string;
    public employeeId!: string;
    public amountPaid!: number;
    public paymentDate!: Date | string;
    public paymentMethod!: PaymentMethod;
    public transactionReference?: string;
    public remarks?: string;

    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;
}

EmployeeSalaryPayments.init({
    employeeSalaryPaymentId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    employeePayslipId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "employee_payslips",
            key: "employeePayslipId"
        },
        onUpdate: "CASCADE"
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

    amountPaid: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },

    paymentDate: {
        type: DataTypes.DATE,
        allowNull: false
    },

    paymentMethod: {
        type: DataTypes.ENUM("bank_transfer", "cheque", "cash"),
        allowNull: false,
        defaultValue: "bank_transfer"
    },

    transactionReference: {
        type: DataTypes.STRING,
        allowNull: true
    },

    remarks: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true,
    sequelize: sequelizeConnection,
    tableName: "employee_salary_payments",
    indexes: [
        {
            name: "idx_employee_salary_payments_employee_id",
            fields: ["employeeId"]
        },
        {
            name: "idx_employee_salary_payments_payslip_id",
            fields: ["employeePayslipId"]
        }
    ]
});

EmployeeSalaryPayments.belongsTo(Employees, { foreignKey: "employeeId", as: "employee", onUpdate: "CASCADE" });
Employees.hasMany(EmployeeSalaryPayments, { foreignKey: "employeeId", as: "employeeSalaryPayments" });

EmployeeSalaryPayments.belongsTo(EmployeePayslips, { foreignKey: "employeePayslipId", as: "payslip", onUpdate: "CASCADE" });
EmployeePayslips.hasMany(EmployeeSalaryPayments, { foreignKey: "employeePayslipId", as: "salaryPayments" });

export default EmployeeSalaryPayments;