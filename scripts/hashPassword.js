// scripts/hashPassword.js
const PasswordUtils = require('../utils/passwordUtils');

async function run() {
  try {
    const hashedPassword = await PasswordUtils.hashPassword('1');
    console.log('Hashed Password:', hashedPassword);
  } catch (error) {
    console.error('Error:', error);
  }
}

run();