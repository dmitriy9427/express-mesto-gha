const router = require("express").Router();

const { createCardValid, parameterIdValid } = require("../middlewares/joi");

const {
  getAllCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

router.get("/cards", getAllCards);
router.post("/cards", createCardValid, createCard);
router.delete("/cards/:cardId", parameterIdValid("cardId"), deleteCardById);
router.put("/cards/:cardId/likes", parameterIdValid("cardId"), likeCard);
router.delete("/cards/:cardId/likes", parameterIdValid("cardId"), dislikeCard);

module.exports = router;
