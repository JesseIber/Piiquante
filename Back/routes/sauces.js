const express = require('express');
const router = express.Router();
const sauceController = require('../controllers/sauces');
const jwtAuth = require('../service/security');
const multer = require('../service/multer');

router.get('/:id', jwtAuth.authenticateJWT, sauceController.getSaucesById);
router.get('/', jwtAuth.authenticateJWT, sauceController.getSauces);
router.post('/', jwtAuth.authenticateJWT, multer, sauceController.add);
router.put('/:id', jwtAuth.authenticateJWT, multer, sauceController.update);
router.delete('/:id', jwtAuth.authenticateJWT, sauceController.delete);
router.post('/:id/like', jwtAuth.authenticateJWT, sauceController.like);

module.exports = router;