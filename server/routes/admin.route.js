const express = require('express');
const { check } = require('express-validator');

const adminController = require('../controllers/admin.controller');
const verifyToken = require('../middlewares/verifyAuth.middleware');
const { verifyAdmin } = require('../middlewares/verifyRole.middleware');

const router = express.Router()

/* Session */

router.delete(
    '/session/:id', 
    verifyToken,
    verifyAdmin,
    adminController.deleteRefreshToken
)

/* Offers */

router.get(
    '/offers', 
    verifyToken,
    verifyAdmin 

)
router.get(
    '/offers:id', 
    verifyToken,
)

router.patch(
    '/offers/:id', 
    verifyToken,
    verifyAdmin

)

router.put(
    '/offers/:id', 
    verifyToken,
    verifyAdmin

)

router.delete(
    '/offers/:id', 
    verifyToken,
    verifyAdmin,
    adminController.deleteOfferAdmin
)

/* Users */

router.get(
    '/users', 
    verifyToken,
    verifyAdmin

)

router.get(
    '/users/:id', 
    verifyToken,
    verifyAdmin

)

router.put(
    '/users/:id', 
    verifyToken,
    verifyAdmin
)

router.delete(
    '/users/:id', 
    verifyToken,
    verifyAdmin
)

/* Uploads */

router.delete(
    '/uploads/image/:id', 
    verifyToken,
    verifyAdmin
)

module.exports = router;
