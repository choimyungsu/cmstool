// routes/projectUserRoutes.js
const express = require('express');
const router = express.Router();
const projectUserController = require('../controllers/projectUserController');

router.get('/pjt_user', projectUserController.getProjectUsers); // ID 없는 경우
router.get('/pjt_user/:projectId', projectUserController.getProjectUsers); // ID 있는 경우
router.post('/pjt_user/add', projectUserController.addUserToProject);
router.post('/pjt_user/remove', projectUserController.removeUserFromProject);

module.exports = router;