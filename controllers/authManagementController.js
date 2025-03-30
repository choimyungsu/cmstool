// controllers/authManagementController.js
const authModel = require('../models/authModel');

const authManagementController = {
  async getAuthManagement(req, res) {
    try {
      const users = await authModel.getAllUsers();
      const roles = await authModel.getAllRoles();
      const permissions = await authModel.getAllPermissions();
      const userRoleMappings = await authModel.getUserRoleMappings();
      const rolePermissionMappings = await authModel.getRolePermissionMappings();

      res.render('index', {
        currentPage: 'pages/authMgmt',
        user: req.session.user,
        users,
        roles,
        permissions,
        userRoleMappings,
        rolePermissionMappings
      });
    } catch (error) {
      console.error('Error in getAuthManagement:', error);
      res.status(500).send('Server Error');
    }
  },

  async addUserRole(req, res) {
    const { userId, roleId } = req.body;
    try {
      await authModel.addUserRole(userId, roleId);
      res.redirect('/auth-management');
    } catch (error) {
      console.error('Error adding user-role mapping:', error);
      res.status(500).send('Server Error');
    }
  },

  async removeUserRole(req, res) {
    const { userId, roleId } = req.body;
    try {
      await authModel.removeUserRole(userId, roleId);
      res.redirect('/auth-management');
    } catch (error) {
      console.error('Error removing user-role mapping:', error);
      res.status(500).send('Server Error');
    }
  },

  async addRolePermission(req, res) {
    const { roleId, permissionId } = req.body;
    try {
      await authModel.addRolePermission(roleId, permissionId);
      res.redirect('/auth-management');
    } catch (error) {
      console.error('Error adding role-permission mapping:', error);
      res.status(500).send('Server Error');
    }
  },

  async removeRolePermission(req, res) {
    const { roleId, permissionId } = req.body;
    try {
      await authModel.removeRolePermission(roleId, permissionId);
      res.redirect('/auth-management');
    } catch (error) {
      console.error('Error removing role-permission mapping:', error);
      res.status(500).send('Server Error');
    }
  },

  // 역할(Role) CRUD
  async createRole(req, res) {
    const { roleName, description } = req.body;
    try {
      await authModel.createRole(roleName, description);
      res.redirect('/auth-management');
    } catch (error) {
      console.error('Error creating role:', error);
      res.status(500).send('Server Error');
    }
  },

  async updateRole(req, res) {
    const { id } = req.params;
    const { roleName, description } = req.body;
    try {
      await authModel.updateRole(id, roleName, description);
      res.redirect('/auth-management');
    } catch (error) {
      console.error('Error updating role:', error);
      res.status(500).send('Server Error');
    }
  },

  async deleteRole(req, res) {
    const { id } = req.params;
    try {
      await authModel.deleteRole(id);
      res.redirect('/auth-management');
    } catch (error) {
      console.error('Error deleting role:', error);
      res.status(500).send('Server Error');
    }
  },

  // 권한(Permission) CRUD
  async createPermission(req, res) {
    const { permissionName, description } = req.body;
    try {
      await authModel.createPermission(permissionName, description);
      res.redirect('/auth-management');
    } catch (error) {
      console.error('Error creating permission:', error);
      res.status(500).send('Server Error');
    }
  },

  async updatePermission(req, res) {
    const { id } = req.params;
    const { permissionName, description } = req.body;
    try {
      await authModel.updatePermission(id, permissionName, description);
      res.redirect('/auth-management');
    } catch (error) {
      console.error('Error updating permission:', error);
      res.status(500).send('Server Error');
    }
  },

  async deletePermission(req, res) {
    const { id } = req.params;
    try {
      await authModel.deletePermission(id);
      res.redirect('/auth-management');
    } catch (error) {
      console.error('Error deleting permission:', error);
      res.status(500).send('Server Error');
    }
  }
};

module.exports = authManagementController;