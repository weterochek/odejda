const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Подключение к MongoDB
mongoose.connect('mongodb://diplom_followlow:6848665fffb200107266c7d62335967f91ff800a@ty58z.h.filess.io:27018/diplom_followlow', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB подключена'))
  .catch(err => console.error('Ошибка подключения к MongoDB:', err));

// Определение схемы и модели пользователя
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
});

// Хеширование пароля перед сохранением
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Метод для проверки пароля
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Middleware
app.use(cors());
app.use(express.json());

mongoose.connection.once('open', async () => {
  try {
    await mongoose.connection.db.collection('users').dropIndex('email_1');
    console.log('❎ Индекс email_1 удалён');
  } catch (err) {
    if (err.codeName === 'IndexNotFound') {
      console.log('ℹ️ Индекс email_1 не найден — уже удалён');
    } else {
      console.error('Ошибка при удалении индекса:', err.message);
    }
  }
});
// Регистрация
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("🟢 Регистрация: ", req.body);

    if (!username || !password) {
      return res.status(400).json({ message: 'Укажите логин и пароль' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь уже существует' });
    }

    const user = new User({ username, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '24h' });

    res.status(201).json({
      token,
      user: { id: user._id, username: user.username }
    });
  } catch (err) {
    console.error("❌ Ошибка при регистрации:", err.message);
    res.status(500).json({ message: 'Ошибка сервера при регистрации' });
  }
});

// Вход
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("🟠 Вход:", req.body);

    if (!username || !password) {
      return res.status(400).json({ message: 'Укажите логин и пароль' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Неверный логин или пароль' });
    }

    console.log("🔐 Вход для:", username);
    console.log("→ Введённый пароль:", password);
    console.log("→ Пароль в БД:", user.password);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный логин или пароль' });
    }

    const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '24h' });

    res.json({
      token,
      user: { id: user._id, username: user.username }
    });
  } catch (err) {
    console.error('❌ Ошибка при входе:', err.message);
    res.status(500).json({ message: 'Ошибка сервера при входе' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
