// controllers/authController.js
const UserModel = require('../models/user');
const authModel = require('../models/authModel');

const authController = {
  getLogin(req, res) {
    console.log('[AuthController] getLogin: Checking if user is already logged in');
    if (req.session.user) {
      console.log('[AuthController] getLogin: User already logged in, redirecting to /');
      return res.redirect('/');
    }
    console.log('[AuthController] getLogin: Rendering login page');
    res.render('pages/login', { error: null });
  },

  async postLogin(req, res) {
    const { email, password } = req.body;
    console.log('[AuthController] postLogin: Attempting login with email:', email);
    try {
      const user = await UserModel.findByEmail(email);
      if (!user) {
        console.log('[AuthController] postLogin: User not found for email:', email);
        return res.render('pages/login', { error: 'Invalid email or password' });
      }
      console.log('[AuthController] postLogin: User found:', user.user_name);
      const isMatch = await UserModel.comparePassword(password, user.password);
      if (!isMatch) {
        console.log('[AuthController] postLogin: Password does not match for email:', email);
        return res.render('pages/login', { error: 'Invalid email or password' });
      }

      console.log('[AuthController] postLogin: Password matched, fetching roles and permissions');
      const roles = await authModel.getUserRoles(user.id);
      const permissions = await authModel.getUserPermissions(user.id);
      console.log('[AuthController] postLogin: Roles:', roles, 'Permissions:', permissions);

      req.session.user = {
        id: user.id,
        email: user.email,
        user_name: user.user_name,
        roles: roles,
        permissions: permissions
      };
      console.log('[AuthController] postLogin: Session updated with user:', req.session.user);

      res.redirect('/');
    } catch (error) {
      console.error('[AuthController] postLogin: Error during login:', error);
      res.render('pages/login', { error: 'Server error' });
    }
  },

  logout(req, res) {
    console.log('[AuthController] logout: Destroying session');
    req.session.destroy((err) => {
      if (err) {
        console.error('[AuthController] logout: Error during logout:', err);
        return res.redirect('/');
      }
      console.log('[AuthController] logout: Session destroyed, redirecting to /login');
      res.redirect('/login');
    });
  },

  checkPermission: (permission) => {
    return async (req, res, next) => {
      try {
        console.log('[AuthController] checkPermission: Checking permission:', permission, 'for path:', req.path, 'method:', req.method);
        const user = req.session.user;
        if (!user) {
          console.log('[AuthController] checkPermission: No user in session, redirecting to /login');
          return res.redirect('/login');
        }
        console.log('[AuthController] checkPermission: User in session:', user.user_name);

        const userId = user.id;
        const roles = user.roles || await authModel.getUserRoles(userId);
        const permissions = user.permissions || await authModel.getUserPermissions(userId);
        console.log('[AuthController] checkPermission: Roles:', roles, 'Permissions:', permissions);

        if (!req.session.user.roles || !req.session.user.permissions) {
          console.log('[AuthController] checkPermission: Updating session with roles and permissions');
          req.session.user.roles = roles;
          req.session.user.permissions = permissions;
        }

        if (roles.includes('SUPER_ADMIN')) {
          console.log('[AuthController] checkPermission: User is SUPER_ADMIN, granting access');
          return next();
        }

        if (!permissions.includes(permission)) {
          console.log('[AuthController] checkPermission: User lacks required permission:', permission);
          if (req.xhr || req.headers.accept.includes('json')) {
            console.log('[AuthController] checkPermission: AJAX request, returning 403 JSON response');
            return res.status(403).json({ message: '권한이 없습니다.' });
          }
          console.log('[AuthController] checkPermission: Rendering permission-error page');
          return res.render('pages/permission-error', {
            currentPage: 'pages/permission-error',
            user: req.session.user,
            message: '권한이 없습니다.'
          });
        }

        if (permission.endsWith('_MANAGE') && req.method !== 'GET') {
          const { id } = req.params;
          console.log('[AuthController] checkPermission: Checking creator for object ID:', id);
          const tableName = authController.getTableNameFromRoute(req.path);
          if (!tableName) {
            console.log('[AuthController] checkPermission: Invalid table name for path:', req.path);
            if (req.xhr || req.headers.accept.includes('json')) {
              console.log('[AuthController] checkPermission: AJAX request, returning 400 JSON response');
              return res.status(400).json({ message: '잘못된 요청 경로입니다.' });
            }
            console.log('[AuthController] checkPermission: Rendering permission-error page for invalid path');
            return res.render('pages/permission-error', {
              currentPage: 'pages/permission-error',
              user: req.session.user,
              message: '잘못된 요청 경로입니다.'
            });
          }
          const creator = await authModel.getCreatorId(tableName, id);
          console.log('[AuthController] checkPermission: Creator of object:', creator, 'Current user:', user.user_name);

          if (!roles.includes('SUPER_ADMIN') && creator !== user.user_name) {
            console.log('[AuthController] checkPermission: User is not the creator and not SUPER_ADMIN');
            if (req.xhr || req.headers.accept.includes('json')) {
              console.log('[AuthController] checkPermission: AJAX request, returning 403 JSON response');
              return res.status(403).json({ message: '본인이 생성한 객체만 수정/삭제할 수 있습니다.' });
            }
            console.log('[AuthController] checkPermission: Rendering permission-error page for creator mismatch');
            return res.render('pages/permission-error', {
              currentPage: 'pages/permission-error',
              user: req.session.user,
              message: '본인이 생성한 객체만 수정/삭제할 수 있습니다.'
            });
          }
        }

        console.log('[AuthController] checkPermission: Permission granted, proceeding to next middleware');
        next();
      } catch (error) {
        console.error('[AuthController] checkPermission: Permission check error:', error);
        if (req.xhr || req.headers.accept.includes('json')) {
          console.log('[AuthController] checkPermission: AJAX request, returning 500 JSON response');
          return res.status(500).json({ message: '서버 오류' });
        }
        console.log('[AuthController] checkPermission: Rendering permission-error page for server error');
        res.render('pages/permission-error', {
          currentPage: 'pages/permission-error',
          user: req.session.user,
          message: '서버 오류'
        });
      }
    };
  },

  getTableNameFromRoute(path) {
    console.log('[AuthController] getTableNameFromRoute: Mapping path to table name for path:', path);
    const routeMap = {
      '/project': 'tb_project',
      '/wbs': 'tb_wbs',
      '/treewbs': 'tb_treewbs',
      '/contents': 'tb_contents',
      '/issue': 'tb_issue',
      '/calendar': 'tb_calendar'
    };
    for (const [route, table] of Object.entries(routeMap)) {
      if (path.startsWith(route)) {
        console.log('[AuthController] getTableNameFromRoute: Found table:', table, 'for route:', route);
        return table;
      }
    }
    console.log('[AuthController] getTableNameFromRoute: No matching table found for path:', path);
    return null;
  }
};

module.exports = authController;