// Функция для открытия модального окна
function openModal(image, title, description, sizes, price) {
    const modal = document.getElementById('productModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalSizes = document.getElementById('modalSizes');
    const modalPrice = document.getElementById('modalPrice');

    modalImage.src = image;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    
    // Создаем кнопки размеров с анимацией
    modalSizes.innerHTML = sizes.map((size, index) => 
        `<button 
            onclick="selectSize('${size}')"
            style="animation: fadeIn 0.3s ease forwards ${index * 0.1}s; opacity: 0;"
        >${size}</button>`
    ).join('');

    // Устанавливаем цену
    modalPrice.textContent = price ? `${price} руб.` : '';

    // Открываем модальное окно
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Запрещаем прокрутку фона
}

// Функция для закрытия модального окна
function closeModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Возвращаем прокрутку
}

// Закрыть модальное окно при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target == modal) {
        closeModal();
    }
}

// Функция для выбора размера
function selectSize(size) {
    const title = document.getElementById('modalTitle').textContent;
    const priceText = document.getElementById('modalPrice').textContent;
    const price = parseInt(priceText.replace(/[^0-9]/g, '')); // Извлекаем только цифры из цены
    
    addToCart(title, price, size);
    closeModal(); // Закрываем окно после добавления в корзину
} 