import { DataTypes, Model, type Optional } from "sequelize";
import sequelizeConnection from "../config.ts";
import Employees from "./employees.ts";

export type AddressType = "current" | "permanent";

export interface EmployeeAddressAttributes {
    employeeAddressId: string;
    employeeId: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    addressType: AddressType;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface EmployeeAddressInput extends Optional<EmployeeAddressAttributes, "employeeAddressId" | "addressLine2"> { }
export interface EmployeeAddressOutput extends EmployeeAddressAttributes { }

class EmployeeAddress extends Model<EmployeeAddressAttributes, EmployeeAddressInput> implements EmployeeAddressAttributes {
    public employeeAddressId!: string;
    public employeeId!: string;
    public addressLine1!: string;
    public addressLine2?: string;
    public city!: string;
    public state!: string;
    public zipCode!: string;
    public country!: string;
    public addressType!: AddressType;

    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;
}

EmployeeAddress.init({
    employeeAddressId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    employeeId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    addressLine1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    addressLine2: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    zipCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    addressType: {
        type: DataTypes.ENUM("current", "permanent"),
        allowNull: false,
        defaultValue: "current"
    }
}, {
    timestamps: true,
    sequelize: sequelizeConnection,
    tableName: "employee_addresses",
    indexes: [
        {
            name: "idx_employee_addresses_employee_id",
            fields: ["employeeId"]
        }
    ]
});

EmployeeAddress.belongsTo(Employees, { foreignKey: "employeeId", as: "employee", onUpdate: "CASCADE" });
Employees.hasMany(EmployeeAddress, { foreignKey: "employeeId", as: "employeeAddresses" });

export default EmployeeAddress;