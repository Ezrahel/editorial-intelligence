import * as dotenv from 'dotenv';
dotenv.config();

// dynamic import so dotenv runs first
const { createSupabaseUser, generateConfirmationLink, sendResendEmail } = await import('./src/lib/api-shared.ts');

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

    console.log('Sending email...');
    await sendResendEmail(email, link);
    console.log('Email sent successfully');

  } catch (e) {
    console.error('Error:', e);
  }
}
run();
