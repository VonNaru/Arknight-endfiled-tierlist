import bcrypt from 'bcrypt';

const storedHash = '$2b$10$V/GrUpStaayTLdP1EVizxOyLIykDunX7ruCEMSCOXQ.NeU5nR0TfO';

const passwords = ['Admin123', 'admin123', 'admin', 'Admin', 'ADMIN123'];

console.log('Testing passwords against stored hash:');
console.log('Stored hash:', storedHash);
console.log('');

passwords.forEach(password => {
  const isValid = bcrypt.compareSync(password, storedHash);
  console.log(`Password: "${password}" => ${isValid ? '✅ VALID' : '❌ INVALID'}`);
});

// Generate new hash for Admin123
console.log('\n--- Generating new hash for Admin123 ---');
const newHash = bcrypt.hashSync('Admin123', 10);
console.log('New hash:', newHash);
console.log('Verify new hash:', bcrypt.compareSync('Admin123', newHash) ? '✅ VALID' : '❌ INVALID');
