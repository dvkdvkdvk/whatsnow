import { neon } from '@neondatabase/serverless'

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set')
  process.exit(1)
}

const sql = neon(DATABASE_URL)

async function setupDatabase() {
  try {
    console.log('Creating profiles table...')
    await sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        subscription_status VARCHAR(50) DEFAULT 'free' CHECK (subscription_status IN ('free', 'pro')),
        ls_customer_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log('✓ profiles table created')

    console.log('Creating automation_settings table...')
    await sql`
      CREATE TABLE IF NOT EXISTS automation_settings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        bsuid VARCHAR(255) NOT NULL,
        contact_name VARCHAR(255),
        last_message_preview TEXT,
        last_message_at TIMESTAMP,
        is_enabled BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, bsuid)
      )
    `
    console.log('✓ automation_settings table created')

    console.log('Creating messages table...')
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        bsuid VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant')),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log('✓ messages table created')

    console.log('Creating indexes...')
    await sql`CREATE INDEX IF NOT EXISTS idx_automation_settings_user_id ON automation_settings(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_automation_settings_bsuid ON automation_settings(bsuid)`
    await sql`CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_messages_bsuid ON messages(bsuid)`
    await sql`CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC)`
    console.log('✓ indexes created')

    console.log('\n✅ Database setup completed successfully!')
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    process.exit(1)
  }
}

setupDatabase()
