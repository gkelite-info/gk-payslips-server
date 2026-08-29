import { Sequelize } from 'sequelize';

export async function enableEmployeePayslipsRLS(sequelizeConnection: Sequelize): Promise<void> {
  try {
    await sequelizeConnection.query(`
      ALTER TABLE "employee_payslips" ENABLE ROW LEVEL SECURITY;
    `);

    await sequelizeConnection.query(`
      DROP POLICY IF EXISTS "employee_payslips_public_read_policy" ON "employee_payslips";
      CREATE POLICY "employee_payslips_public_read_policy" ON "employee_payslips"
        FOR SELECT
        USING (true);
    `);

    await sequelizeConnection.query(`
      DROP POLICY IF EXISTS "employee_payslips_public_insert_policy" ON "employee_payslips";
      CREATE POLICY "employee_payslips_public_insert_policy" ON "employee_payslips"
        FOR INSERT
        WITH CHECK (true);
    `);

    await sequelizeConnection.query(`
      DROP POLICY IF EXISTS "employee_payslips_authenticated_all_policy" ON "employee_payslips";
      CREATE POLICY "employee_payslips_authenticated_all_policy" ON "employee_payslips"
        FOR ALL
        USING (
          NULLIF(current_setting('app.current_user_id', true), '') IS NOT NULL
          OR auth.uid() IS NOT NULL
        )
        WITH CHECK (
          NULLIF(current_setting('app.current_user_id', true), '') IS NOT NULL
          OR auth.uid() IS NOT NULL
        );
    `);

    console.log('✅ Row Level Security (RLS) enabled on "employee_payslips" table.');
  } catch (error) {
    console.error('❌ Error setting up RLS on "employee_payslips" table:', error);
  }
}
