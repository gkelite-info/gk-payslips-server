import { Sequelize } from 'sequelize';

export async function enableEmployeesRLS(sequelizeConnection: Sequelize): Promise<void> {
  try {
    await sequelizeConnection.query(`
      ALTER TABLE "employees" ENABLE ROW LEVEL SECURITY;
    `);

    await sequelizeConnection.query(`
      DROP POLICY IF EXISTS "employees_authenticated_all_policy" ON "employees";
      CREATE POLICY "employees_authenticated_all_policy" ON "employees"
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

    console.log('✅ Row Level Security (RLS) enabled on "employees" table.');
  } catch (error) {
    console.error('❌ Error setting up RLS on "employees" table:', error);
  }
}
