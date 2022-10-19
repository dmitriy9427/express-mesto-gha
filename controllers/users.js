const User = require('../models/user');
const statusCodes = require('../utils/statusCodes');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(statusCodes.ERROR_CODE_500).send({ message: 'Ошибка на стороне сервера.' }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(statusCodes.ERROR_CODE_400)
          .send({
            message: `Попытка использования некорректных данных при поиске пользователя -- ${err.name}`,
          });
      } else if (err.message === 'NotFound') {
        res
          .status(statusCodes.ERROR_CODE_404)
          .send({ message: 'По указанному id пользователь не найден' });
      } else {
        res.status(statusCodes.ERROR_CODE_500).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res
          .status(statusCodes.ERROR_CODE_400)
          .send({
            message: `Попытка использования некорректных данных при создании пользователя -- ${err.name}`,
          });
      } else {
        res.status(statusCodes.ERROR_CODE_500).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(statusCodes.ERROR_CODE_404).send({ message: 'Пользователь отсутствует' });
      }
      return res.send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(statusCodes.ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(statusCodes.ERROR_CODE_500).send({ message: 'Серверная ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((userAvatar) => {
      if (!userAvatar) {
        return res.status(statusCodes.ERROR_CODE_404).send({ message: 'Пользователь отсутствует' });
      }
      return res.send(userAvatar);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(statusCodes.ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(statusCodes.ERROR_CODE_500).send({ message: 'Серверная ошибка' });
    });
};
