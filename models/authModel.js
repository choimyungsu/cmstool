// models/authModel.js
const pool = require("../config/db");

const authModel = {
  // 기존 함수들 유지
  async getUserRoles(userId) {
    const query = `
      SELECT r.role_name
      FROM tb_user_role ur
      JOIN tb_role r ON ur.role_id = r.id
      WHERE ur.user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows.map(row => row.role_name);
  },

  async getUserPermissions(userId) {
    const query = `
      SELECT DISTINCT p.permission_name
      FROM tb_user_role ur
      JOIN tb_role_permission rp ON ur.role_id = rp.role_id
      JOIN tb_permission p ON rp.permission_id = p.id
      WHERE ur.user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows.map(row => row.permission_name);
  },

  async getCreatorId(tableName, objectId) {
    const query = `
      SELECT create_user AS creator
      FROM ${tableName}
      WHERE id = $1
    `;
    const result = await pool.query(query, [objectId]);
    return result.rows[0]?.creator;
  },

  async getAllUsers() {
    const query = `SELECT id, user_name, email FROM tb_user ORDER BY user_name`;
    const result = await pool.query(query);
    return result.rows;
  },

  async getAllRoles() {
    const query = `SELECT id, role_name, description FROM tb_role ORDER BY role_name`;
    const result = await pool.query(query);
    return result.rows;
  },

  async getAllPermissions() {
    const query = `SELECT id, permission_name, description FROM tb_permission ORDER BY permission_name`;
    const result = await pool.query(query);
    return result.rows;
  },

  async getUserRoleMappings() {
    const query = `
      SELECT ur.user_id, u.user_name, r.role_name
      FROM tb_user_role ur
      JOIN tb_user u ON ur.user_id = u.id
      JOIN tb_role r ON ur.role_id = r.id
      ORDER BY u.user_name, r.role_name
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  async getRolePermissionMappings() {
    const query = `
      SELECT rp.role_id, r.role_name, p.permission_name
      FROM tb_role_permission rp
      JOIN tb_role r ON rp.role_id = r.id
      JOIN tb_permission p ON rp.permission_id = p.id
      ORDER BY r.role_name, p.permission_name
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  async addUserRole(userId, roleId) {
    const query = `
      INSERT INTO tb_user_role (user_id, role_id)
      VALUES ($1, $2)
      ON CONFLICT ON CONSTRAINT unique_user_role DO NOTHING
      RETURNING *
    `;
    const result = await pool.query(query, [userId, roleId]);
    return result.rows[0];
  },

  async removeUserRole(userId, roleId) {
    const query = `
      DELETE FROM tb_user_role
      WHERE user_id = $1 AND role_id = $2
    `;
    await pool.query(query, [userId, roleId]);
  },

  async addRolePermission(roleId, permissionId) {
    const query = `
      INSERT INTO tb_role_permission (role_id, permission_id)
      VALUES ($1, $2)
      ON CONFLICT ON CONSTRAINT unique_role_permission DO NOTHING
      RETURNING *
    `;
    const result = await pool.query(query, [roleId, permissionId]);
    return result.rows[0];
  },

  async removeRolePermission(roleId, permissionId) {
    const query = `
      DELETE FROM tb_role_permission
      WHERE role_id = $1 AND permission_id = $2
    `;
    await pool.query(query, [roleId, permissionId]);
  },

  // 역할(Role) CRUD
  async createRole(roleName, description) {
    const query = `
      INSERT INTO tb_role (role_name, description)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await pool.query(query, [roleName, description]);
    return result.rows[0];
  },

  async updateRole(roleId, roleName, description) {
    const query = `
      UPDATE tb_role
      SET role_name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [roleName, description, roleId]);
    return result.rows[0];
  },

  async deleteRole(roleId) {
    const query = `DELETE FROM tb_role WHERE id = $1`;
    await pool.query(query, [roleId]);
  },

  // 권한(Permission) CRUD
  async createPermission(permissionName, description) {
    const query = `
      INSERT INTO tb_permission (permission_name, description)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await pool.query(query, [permissionName, description]);
    return result.rows[0];
  },

  async updatePermission(permissionId, permissionName, description) {
    const query = `
      UPDATE tb_permission
      SET permission_name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [permissionName, description, permissionId]);
    return result.rows[0];
  },

  async deletePermission(permissionId) {
    const query = `DELETE FROM tb_permission WHERE id = $1`;
    await pool.query(query, [permissionId]);
  }
};

module.exports = authModel;