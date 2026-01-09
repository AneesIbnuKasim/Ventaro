const router = require("express").Router();
const { default: upload } = require("../config/multer");
const BannerController = require("../controllers/BannerController");
const { authenticateAdmin } = require("../middlewares/auth");
const Banner = require("../models/Banner")

router.post('/', upload.single('image'), authenticateAdmin, BannerController.createBanner)
router.get('/', authenticateAdmin, BannerController.fetchBanner)



module.exports = router