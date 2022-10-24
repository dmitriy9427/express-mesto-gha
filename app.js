const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');
const NotFound = require('./errors/NotFound');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { registerValid, loginValid } = require('./middlewares/joi');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// логин
app.post('/signin', loginValid, login);

// регистрация
app.post('/signup', registerValid, createUser);

app.use(auth);

app.use(routesUsers);
app.use(routesCards);

app.use(() => {
  throw new NotFound('Запрашиваемый ресурс не найден');
});

app.use(errors());

// централизованный обработчик ошибок
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = status === 500 ? 'На сервере произошла ошибка' : err.message;
  res.status(status).send({ message });
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`Сервер работает на ${PORT} порту`);
});
