// utils/passwordUtils.js
const bcrypt = require('bcrypt');

class PasswordUtils {
  static async hashPassword(password) {
    try {
      const saltRounds = 10; // 솔트 라운드 수 (기본값 10)
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      console.log('Hashed Password:', hashedPassword);
      return hashedPassword;
    } catch (error) {
      console.error('Error hashing password:', error);
      throw error;
    }
  }


}

module.exports = PasswordUtils;