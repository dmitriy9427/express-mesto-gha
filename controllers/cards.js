const Cards = require("../models/card");
const NotFound = require("../errors/NotFound");
const BadRequest = require("../errors/BadRequest");
const ForbiddenError = require("../errors/ForbiddenError");

module.exports.getAllCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Cards.create({ name, link, owner: ownerId })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequest("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Cards.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound("Карточка с указанным id не найдена");
      }
      if (card.owner._id.toString() !== req.user._id.toString()) {
        throw new ForbiddenError("Вы не можете удалить чужую карточку");
      }
      card.remove();
      res.send({ data: card, message: "Карточка успешно удалена" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequest("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .orFail(() => {
      throw new NotFound("Карточка по указанному id не найдена");
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequest("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFound("Карточка не найдена");
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequest("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
};
