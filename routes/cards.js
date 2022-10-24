const router = require('express').Router();

const auth = require('../middlewares/auth');
const {
  createCardValid,
  parameterIdValid,
} = require('../middlewares/joi');

const {
  getAllCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', auth, getAllCards);
router.post('/cards', auth, createCardValid, createCard);
router.delete('/cards/:cardId', auth, parameterIdValid('cardId'), deleteCardById);
router.put('/cards/:cardId/likes', auth, parameterIdValid('cardId'), likeCard);
router.delete('/cards/:cardId/likes', auth, parameterIdValid('cardId'), dislikeCard);

module.exports = router;
