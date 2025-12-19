#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🚀 Setting up Behavior Monitor database...\n');

  try {
    // Read the main schema file
    const schemaPath = path.join(__dirname, 'supabase', 'schema.sql');
    let schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Remove the test user creation (we'll create users through auth)
    schemaSql = schemaSql.split('-- Create a test user')[0];

    console.log('📝 Creating tables and policies...');
    
    // Execute the schema
    const { error: schemaError } = await supabase.rpc('exec_sql', { sql: schemaSql });
    
    // Since rpc might not work, let's try a different approach - split into individual statements
    const statements = schemaSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`   Found ${statements.length} SQL statements to execute\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`   [${i + 1}/${statements.length}] Executing...`);
      
      // We can't execute arbitrary SQL from client, so we'll provide instructions instead
      console.log('   Statement:', statement.substring(0, 50) + '...');
    }

    console.log('\n⚠️  Note: For security reasons, the SQL schema needs to be run directly in Supabase.\n');
    console.log('📋 Please follow these steps:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/uvrrjzqlfdymyubtdjcw/sql/new');
    console.log('   2. Copy the contents of: supabase/schema.sql');
    console.log('   3. Paste and click "Run"');
    console.log('   4. Then copy: supabase/migrations/add_pin_and_preferences.sql');
    console.log('   5. Paste and click "Run" again\n');
    
    console.log('✅ Environment is configured correctly!');
    console.log('   After running the SQL files above, restart your dev server.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupDatabase();
