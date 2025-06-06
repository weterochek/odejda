const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { adminAuth } = require('../middleware/auth');

// Отправка сообщения обратной связи
router.post('/', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({ 
      message: 'Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.',
      feedback 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Получить все сообщения (только для админа)
router.get('/', adminAuth, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить статус сообщения (только для админа)
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!feedback) {
      return res.status(404).json({ message: 'Сообщение не найдено' });
    }
    res.json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 