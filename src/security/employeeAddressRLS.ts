import { Sequelize } from 'sequelize';

export async function enableEmployeeAddressRLS(sequelizeConnection: Sequelize): Promise<void> {
  try {
    await sequelizeConnection.query(`
      ALTER TABLE "employee_addresses" ENABLE ROW LEVEL SECURITY;
    `);

    await sequelizeConnection.query(`
      DROP POLICY IF EXISTS "employee_addresses_public_read_policy" ON "employee_addresses";
      CREATE POLICY "employee_addresses_public_read_policy" ON "employee_addresses"
        FOR SELECT
        USING (true);
    `);

    await sequelizeConnection.query(`
      DROP POLICY IF EXISTS "employee_addresses_public_insert_policy" ON "employee_addresses";
      CREATE POLICY "employee_addresses_public_insert_policy" ON "employee_addresses"
        FOR INSERT
        WITH CHECK (true);
    `);

    await sequelizeConnection.query(`
      DROP POLICY IF EXISTS "employee_addresses_authenticated_all_policy" ON "employee_addresses";
      CREATE POLICY "employee_addresses_authenticated_all_policy" ON "employee_addresses"
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

    console.log('✅ Row Level Security (RLS) enabled on "employee_addresses" table.');
  } catch (error) {
    console.error('❌ Error setting up RLS on "employee_addresses" table:', error);
  }
}
