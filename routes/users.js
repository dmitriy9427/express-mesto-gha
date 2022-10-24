const router = require('express').Router();

const auth = require('../middlewares/auth');
const {
  userAvatarValid,
  parameterIdValid,
  userValid,
} = require('../middlewares/joi');

const {
  getAllUsers,
  getCurrentUser,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', auth, getAllUsers);
router.get('/users/me', auth, getCurrentUser);
router.get('/users/:userId', auth, parameterIdValid('userId'), getUserById);
router.patch('/users/me', auth, userValid, updateProfile);
router.patch('/users/me/avatar', auth, userAvatarValid, updateAvatar);

module.exports = router;
