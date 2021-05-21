const express = require("express");
const router = express.Router();

//import middlewares
const { authCheck , adminCheck} = require("../middlewares/auth"); 

//import controller
const { create, list, read, update, remove } = require("../controllers/subCategory");

router.post("/sub", authCheck, adminCheck, create);
router.get("/subs", list);
router.get("/sub/:slug", read);
router.put("/sub/:slug", authCheck, adminCheck, update);
router.delete("/sub/:slug", authCheck, adminCheck, remove);

module.exports = router;