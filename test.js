const connectDB = require('./config/database');
const mongoose = require('mongoose');

// Тестируем подключение
const testConnection = async () => {
  try {
    await connectDB();
    console.log('Тест подключения успешен!');
    
    // Проверяем состояние подключения
    console.log('Статус подключения:', mongoose.connection.readyState);
    
  } catch (error) {
    console.error('Ошибка при тестировании:', error);
  } finally {
    // Закрываем соединение
    await mongoose.connection.close();
    console.log('Соединение закрыто');
    process.exit(0);
  }
};

testConnection(); 