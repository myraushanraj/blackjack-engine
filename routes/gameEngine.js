const express = require('express');
const router = express.Router();
const gameEngineController = require("../controllers/GameEngineController");

router.post('/initialize',gameEngineController.initialize);
router.post('/deal',gameEngineController.gamedeal);
router.post('/hit',gameEngineController.gamehit);
router.post('/stand',gameEngineController.gameStand);
router.post('/shuffle-card',gameEngineController.gameShuffleCard);


module.exports = router;
