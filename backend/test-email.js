// Local test for Elastic Email.
// Place this file inside the "backend" folder (next to package.json) and run:
//     node test-email.js your-inbox@example.com
// It does NOT need MongoDB and does NOT print your API key.

require('dotenv').config();
const { isConfigured, verifyEmailTransport, sendEmail } = require('./src/utils/email');

const to = process.argv[2];

(async () => {
  console.log('--- Elastic Email test ---');
  console.log('ELASTIC_EMAIL_API_KEY present :', Boolean(process.env.ELASTIC_EMAIL_API_KEY));
  console.log('EMAIL_FROM                   :', process.env.EMAIL_FROM || '(missing)');
  console.log('EMAIL_FROM_NAME              :', process.env.EMAIL_FROM_NAME || '(missing)');

  if (!isConfigured()) {
    console.error('\nX Config missing. Add ELASTIC_EMAIL_API_KEY and EMAIL_FROM to backend/.env');
    process.exit(1);
  }
  if (!to) {
    console.error('\nX Usage: node test-email.js your-inbox@example.com');
    process.exit(1);
  }

  console.log('\n1) Checking API key...');
  console.log('   ', await verifyEmailTransport());

  console.log('\n2) Sending test mail to', to, '...');
  try {
    const result = await sendEmail({
      to,
      subject: 'ThinkAHead – Elastic Email test',
      html: '<h2>It works</h2><p>Elastic Email HTTP API is connected to the ThinkAHead backend.</p>',
      text: 'It works. Elastic Email HTTP API is connected to the ThinkAHead backend.'
    });
    console.log('\nOK Sent:', result);
  } catch (error) {
    console.error('\nX Failed:', error.message);
    process.exit(1);
  }
})();
