/**
 * Password Hash Generator for ODPC1
 * 
 * This script generates bcrypt password hashes for the superadmin account
 * 
 * Usage:
 *   node generate-password.js <your_password>
 * 
 * Example:
 *   node generate-password.js MySecurePassword123
 */

const bcrypt = require('bcrypt');

// Get password from command line argument
const password = process.argv[2];

if (!password) {
  console.error('❌ Error: Please provide a password');
  console.log('\nUsage:');
  console.log('  node generate-password.js <your_password>');
  console.log('\nExample:');
  console.log('  node generate-password.js MySecurePassword123');
  process.exit(1);
}

// Validate password strength
if (password.length < 8) {
  console.error('❌ Error: Password must be at least 8 characters long');
  process.exit(1);
}

console.log('🔐 Generating password hash...\n');

// Generate hash
bcrypt.hash(password, 10)
  .then(hash => {
    console.log('✅ Password hash generated successfully!\n');
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\n📋 SQL Update Query:');
    console.log('-----------------------------------');
    console.log(`UPDATE tb_employee`);
    console.log(`SET password = '${hash}'`);
    console.log(`WHERE employee_id = '0000000000000';`);
    console.log('-----------------------------------\n');
    console.log('⚠️  IMPORTANT: Keep this hash secure and delete this output after use!');
  })
  .catch(err => {
    console.error('❌ Error generating hash:', err.message);
    process.exit(1);
  });
