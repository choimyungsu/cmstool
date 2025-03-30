// routes/authManagementRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authManagementController = require('../controllers/authManagementController');

// 권한 관리 페이지 (슈퍼어드민만 접근 가능)
router.get('/auth-management', authController.checkPermission('USER_MANAGE'), authManagementController.getAuthManagement);

// 사용자-역할 매핑 추가
router.post('/auth-management/user-role', authController.checkPermission('USER_MANAGE'), authManagementController.addUserRole);

// 사용자-역할 매핑 삭제
router.delete('/auth-management/user-role', authController.checkPermission('USER_MANAGE'), authManagementController.removeUserRole);

// 역할-권한 매핑 추가
router.post('/auth-management/role-permission', authController.checkPermission('USER_MANAGE'), authManagementController.addRolePermission);

// 역할-권한 매핑 삭제
router.delete('/auth-management/role-permission', authController.checkPermission('USER_MANAGE'), authManagementController.removeRolePermission);

// 역할(Role) CRUD
router.post('/auth-management/role', authController.checkPermission('USER_MANAGE'), authManagementController.createRole);
router.put('/auth-management/role/:id', authController.checkPermission('USER_MANAGE'), authManagementController.updateRole);
router.delete('/auth-management/role/:id', authController.checkPermission('USER_MANAGE'), authManagementController.deleteRole);

// 권한(Permission) CRUD
router.post('/auth-management/permission', authController.checkPermission('USER_MANAGE'), authManagementController.createPermission);
router.put('/auth-management/permission/:id', authController.checkPermission('USER_MANAGE'), authManagementController.updatePermission);
router.delete('/auth-management/permission/:id', authController.checkPermission('USER_MANAGE'), authManagementController.deletePermission);

module.exports = router;