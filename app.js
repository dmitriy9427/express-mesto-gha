const express = require('express');
const mongoose = require('mongoose');
const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');
const statusCodes = require('./utils/statusCodes');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '634be5075dd685d24ed12cfb',
  };

  next();
});

app.use(routesUsers);
app.use(routesCards);

app.use((req, res) => {
  res.status(statusCodes.ERROR_CODE_404).send({ message: 'Запрашиваемый ресурс не найден' });
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`Сервер работает на ${PORT} порту`);
});
