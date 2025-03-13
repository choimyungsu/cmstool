// controllers/authController.js
const UserModel = require('../models/user');

const authController = {
  getLogin(req, res) {
    if (req.session.user) {
      return res.redirect('/'); // /dashboard 에서 변경
    }
    res.render('pages/login', { error: null });
  },

  async postLogin(req, res) {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.render('pages/login', { error: 'Invalid email or password' });
      }
      const isMatch = await UserModel.comparePassword(password, user.password);
      if (!isMatch) {
        return res.render('pages/login', { error: 'Invalid email or password' });
      }
      req.session.user = { id: user.id, email: user.email, user_name: user.user_name };
      res.redirect('/'); // /dashboard 에서 변경
    } catch (error) {
      console.error('Error during login:', error);
      res.render('pages/login', { error: 'Server error' });
    }
  },

  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error during logout:', err);
        return res.redirect('/'); // /dashboard 에서 변경
      }
      res.redirect('/login');
    });
  }
};

module.exports = authController;