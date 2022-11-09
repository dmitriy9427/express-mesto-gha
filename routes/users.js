const router = require("express").Router();

const {
  userAvatarValid,
  parameterIdValid,
  userValid,
} = require("../middlewares/joi");

const {
  getAllUsers,
  getCurrentUser,
  getUserById,
  updateProfile,
  updateAvatar,
} = require("../controllers/users");

router.get("/users", getAllUsers);
router.get("/users/me", getCurrentUser);
router.get("/users/:userId", parameterIdValid("userId"), getUserById);
router.patch("/users/me", userValid, updateProfile);
router.patch("/users/me/avatar", userAvatarValid, updateAvatar);

module.exports = router;
