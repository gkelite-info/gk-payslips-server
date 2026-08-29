import { Sequelize } from 'sequelize';

export async function enableUsersRLS(sequelizeConnection: Sequelize): Promise<void> {
  try {
    await sequelizeConnection.query(`
      ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
    `);

    await sequelizeConnection.query(`
      DROP POLICY IF EXISTS "users_public_read_policy" ON "users";
      CREATE POLICY "users_public_read_policy" ON "users"
        FOR SELECT
        USING (true);
    `);

    await sequelizeConnection.query(`
      DROP POLICY IF EXISTS "users_public_insert_policy" ON "users";
      CREATE POLICY "users_public_insert_policy" ON "users"
        FOR INSERT
        WITH CHECK (true);
    `);

    await sequelizeConnection.query(`
      DROP POLICY IF EXISTS "users_authenticated_all_policy" ON "users";
      CREATE POLICY "users_authenticated_all_policy" ON "users"
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

    console.log('✅ Row Level Security (RLS) enabled on "users" table.');
  } catch (error) {
    console.error('❌ Error setting up RLS on "users" table:', error);
  }
}
