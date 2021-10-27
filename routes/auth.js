/*
  Rutas de Users / Auth
  host + /api/auth
*/

const express = require("express");
const router = express.Router(); // o directamente const { Router } = require('express');
                                // y:             const router = Router();
const { check } = require('express-validator');

const { createUser, userLogin, tokenRevalidation } = require("../controllers/auth");
const { fieldValidator } = require("../middlewares/fieldValidator");
const { validateJWT } = require("../middlewares/jwtValidator");

router.post(
  "/new",
  [//middlewares
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe tener al menos 6 caracteres').isLength({ min: 6 }), 
    fieldValidator
  ],
  createUser
);

router.post(
  "/",
  [//middlewares
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe tener al menos 6 caracteres').isLength({ min: 6 }),
    fieldValidator
  ], 
  userLogin
);

router.get("/renew", validateJWT, tokenRevalidation);

module.exports = router;
