import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function createTable() {
  try {
    console.log('Creating jet_sharing_routes table...\n')

    // Read SQL file
    const sqlPath = path.join(process.cwd(), 'scripts', 'supabase-jet-sharing-routes-schema.sql')
    const sql = fs.readFileSync(sqlPath, 'utf-8')

    console.log('SQL Schema:')
    console.log('=' + '='.repeat(60))
    console.log(sql)
    console.log('=' + '='.repeat(60))
    console.log('\n⚠️  Please run this SQL manually in Supabase Dashboard:')
    console.log('1. Go to https://supabase.com/dashboard')
    console.log('2. Select your project')
    console.log('3. Go to SQL Editor')
    console.log('4. Paste and run the SQL above\n')

    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

createTable()
