// routes/codemgmtRoutes.js
const express = require('express');
const router = express.Router();
const codemgmtController = require('../controllers/codemgmtController');

router.get('/codemgmt', codemgmtController.getCodeManagement);
router.post('/codemgmt/master', codemgmtController.createMasterCode);
router.post('/codemgmt/master/update', codemgmtController.updateMasterCode);
router.post('/codemgmt/master/:id', codemgmtController.deleteMasterCode);
router.post('/codemgmt/slave', codemgmtController.createSlaveCode);
router.post('/codemgmt/slave/update', codemgmtController.updateSlaveCode);
router.post('/codemgmt/slave/:id/:master_id', codemgmtController.deleteSlaveCode);

module.exports = router;