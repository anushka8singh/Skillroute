const express = require('express');
const router = express.Router();
const { getPaths, createPath } = require('../controllers/pathController');

router.get('/', getPaths);
router.post('/', createPath);

module.exports = router;
