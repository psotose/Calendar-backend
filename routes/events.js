/*
  Rutas de Events / Events
  host + /api/events
*/
const { getEvents, createEvent, updateEvent, destroyEvent } = require("../controllers/events");
const { validateJWT } = require("../middlewares/jwtValidator");
const { check } = require('express-validator')
const { fieldValidator } = require("../middlewares/fieldValidator");
const { isDate } = require("../helpers/isDate");

const express = require("express");
const router = express.Router();
//Como todas tiene que pasar por el middleware esta es una manera de refactorizar
router.use( validateJWT );

router.get("/", getEvents);

router.post(
  "/",
  [
    check('title','El titulo es obligatorio').not().isEmpty(),
    check('start','Fecha de inicio es obligatoria').custom( isDate ),
    check('end','Fecha de finalización es obligatoria').custom( isDate ),
    fieldValidator
  ],
  createEvent
);

router.put(
  "/:id",
  [
    check('title','El titulo es obligatorio').not().isEmpty(),
    check('start','Fecha de inicio es obligatoria').custom( isDate ),
    check('end','Fecha de finalización es obligatoria').custom( isDate ),
    fieldValidator
  ], 
  updateEvent
);

router.delete("/:id", destroyEvent);

module.exports = router;