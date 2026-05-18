import { createSupabaseUser, generateConfirmationLink } from './src/lib/api-shared.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  try {
    const email = `test+${Date.now()}@example.com`;
    console.log('Creating user:', email);
    const created = await createSupabaseUser(email, 'Password123!', 'Test User', 'School', 'SS1');
    console.log('User created:', created.status, created.ok);
    if (!created.ok) console.log(created.json);
    
    console.log('Generating link...');
    const link = await generateConfirmationLink(email, 'http://localhost:3000');
    console.log('Link:', link);
  } catch (e) {
    console.error(e);
  }
}
run();
