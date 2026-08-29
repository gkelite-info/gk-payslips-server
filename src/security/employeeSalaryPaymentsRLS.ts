import { Sequelize } from 'sequelize';

export async function enableEmployeeSalaryPaymentsRLS(sequelizeConnection: Sequelize): Promise<void> {
  try {
    await sequelizeConnection.query(`
      ALTER TABLE "employee_salary_payments" ENABLE ROW LEVEL SECURITY;
    `);

    await sequelizeConnection.query(`
      DROP POLICY IF EXISTS "employee_salary_payments_public_read_policy" ON "employee_salary_payments";
      CREATE POLICY "employee_salary_payments_public_read_policy" ON "employee_salary_payments"
        FOR SELECT
        USING (true);
    `);

    await sequelizeConnection.query(`
      DROP POLICY IF EXISTS "employee_salary_payments_public_insert_policy" ON "employee_salary_payments";
      CREATE POLICY "employee_salary_payments_public_insert_policy" ON "employee_salary_payments"
        FOR INSERT
        WITH CHECK (true);
    `);

    await sequelizeConnection.query(`
      DROP POLICY IF EXISTS "employee_salary_payments_authenticated_all_policy" ON "employee_salary_payments";
      CREATE POLICY "employee_salary_payments_authenticated_all_policy" ON "employee_salary_payments"
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

    console.log('✅ Row Level Security (RLS) enabled on "employee_salary_payments" table.');
  } catch (error) {
    console.error('❌ Error setting up RLS on "employee_salary_payments" table:', error);
  }
}
