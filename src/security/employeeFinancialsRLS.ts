import { Sequelize } from 'sequelize';

export async function enableEmployeeFinancialsRLS(sequelizeConnection: Sequelize): Promise<void> {
  try {
    await sequelizeConnection.query(`
      ALTER TABLE "employee_financials" ENABLE ROW LEVEL SECURITY;
    `);

    await sequelizeConnection.query(`
      DROP POLICY IF EXISTS "employee_financials_public_read_policy" ON "employee_financials";
      CREATE POLICY "employee_financials_public_read_policy" ON "employee_financials"
        FOR SELECT
        USING (true);
    `);

    await sequelizeConnection.query(`
      DROP POLICY IF EXISTS "employee_financials_public_insert_policy" ON "employee_financials";
      CREATE POLICY "employee_financials_public_insert_policy" ON "employee_financials"
        FOR INSERT
        WITH CHECK (true);
    `);

    await sequelizeConnection.query(`
      DROP POLICY IF EXISTS "employee_financials_authenticated_all_policy" ON "employee_financials";
      CREATE POLICY "employee_financials_authenticated_all_policy" ON "employee_financials"
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

    console.log('✅ Row Level Security (RLS) enabled on "employee_financials" table.');
  } catch (error) {
    console.error('❌ Error setting up RLS on "employee_financials" table:', error);
  }
}
