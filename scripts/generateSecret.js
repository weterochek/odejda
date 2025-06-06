const crypto = require('crypto');

// Генерация случайного ключа длиной 64 байта (512 бит)
const generateSecret = () => {
    const secret = crypto.randomBytes(64).toString('hex');
    console.log('Сгенерированный JWT_SECRET:');
    console.log(secret);
    console.log('\nДобавьте этот ключ в ваш .env файл:');
    console.log('JWT_SECRET=' + secret);
};

generateSecret(); 