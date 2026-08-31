import { Sequelize } from "sequelize";
import { enableUsersRLS } from "./usersRLS.ts";
import { enableEmployeesRLS } from "./employeesRLS.ts";
import { enableEmployeeAddressRLS } from "./employeeAddressRLS.ts";
import { enableEmployeeFinancialsRLS } from "./employeeFinancialsRLS.ts";
import { enableEmployeePayslipsRLS } from "./employeePayslipsRLS.ts";
import { enableEmployeeSalaryPaymentsRLS } from "./employeeSalaryPaymentsRLS.ts";

export const initAllRLSPolicies = async (sequelize: Sequelize) => {
    try {
        console.log("--- Initializing Row Level Security ---");

        await enableUsersRLS(sequelize);
        // await enableEmployeesRLS(sequelize);
        // await enableEmployeeAddressRLS(sequelize);
        // await enableEmployeeFinancialsRLS(sequelize);
        // await enableEmployeePayslipsRLS(sequelize);
        // await enableEmployeeSalaryPaymentsRLS(sequelize);

        console.log("--- All RLS Policies Applied Successfully ---");
    } catch (error) {
        console.error("Critical Error applying RLS policies:", error);
        throw error;
    }
};
