const express = require('express');
const router = express.Router();
const commonController = require("../controllers/common/authController");

router.post('/register',commonController.register);


module.exports = router;
