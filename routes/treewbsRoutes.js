const express = require('express');
const router = express.Router();
const treewbsController = require('../controllers/treewbsController');

router.get('/treewbs', (req, res) => {
    res.render('index', { 
        currentPage: 'pages/treewbs',
        user: req.session.user  
    });
});

//router.get('/treewbs', (req, res) => res.render('treewbs'));
router.get('/treewbs/data', treewbsController.getAll);
router.post('/treewbs/create', treewbsController.create);
router.put('/treewbs/update/:id', treewbsController.update);
router.delete('/treewbs/delete/:id', treewbsController.delete);
router.post('/treewbs/upload', treewbsController.upload);
//router.post('/treewbs/batch-save', treewbsController.batchSave);

module.exports = router;