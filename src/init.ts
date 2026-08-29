import Users from "./models/users.ts";
import sequelizeConnection from "./config.ts";
import { initAllRLSPolicies } from "./security/index.ts";
import Employees from "./models/employees.ts";
import EmployeeAddress from "./models/employeeAddress.ts";
import EmployeeFinancials from "./models/employeeFinancials.ts";
import EmployeePayslips from "./models/employeePayslips.ts";
import EmployeeSalaryPayments from "./models/employeeSalaryPayments.ts";

async function dbinit() {
    const isDev = false;
    await Users.sync({ alter: isDev });
    await Employees.sync({ alter: isDev });
    await EmployeeAddress.sync({ alter: isDev });
    await EmployeeFinancials.sync({ alter: isDev });
    await EmployeePayslips.sync({ alter: isDev });
    await EmployeeSalaryPayments.sync({ alter: isDev });

    await initAllRLSPolicies(sequelizeConnection);
}

const dbInit = () => {
    dbinit();
}

export default dbInit;