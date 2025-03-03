const express = require("express");
const router = express.Router();
const WbsController = require("../controllers/wbsController");

router.get("/wbs", WbsController.listWbs);
router.post("/wbsCreate", WbsController.createWbs);
router.post("/wbsUpdate/:id", WbsController.updateWbs);
router.post("/wbsDelete/:id", WbsController.deleteWbs);

// 엑셀 import 라우터 추가
router.post("/wbs/import", WbsController.importWbs);

module.exports = router;
