// Функция для открытия модального окна с деталями товара
function openProductDetails(productName, price, image, sizes) {
    const modal = document.getElementById('product-modal');
    const modalContent = document.querySelector('.modal-content');
    
    // Формируем HTML для модального окна
    modalContent.innerHTML = `
        <span class="close-modal">&times;</span>
        <div class="product-details">
            <div class="product-image">
                <img src="${image}" alt="${productName}">
            </div>
            <div class="product-info">
                <h2 class="product-title">${productName}</h2>
                <p class="product-price">${price} ₽</p>
                <div class="product-description">
                    <p>Описание товара будет добавлено позже.</p>
                </div>
                <div class="size-buttons">
                    ${sizes.map(size => `
                        <button class="size-button" onclick="addToCart('${productName}', ${price}, '${size}')">${size}</button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // Показываем модальное окно
    modal.style.display = 'block';

    // Обработчик для закрытия модального окна
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };

    // Закрытие модального окна при клике вне его области
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

// Функция для преобразования карточек товаров в кликабельные
function makeProductCardsClickable() {
    const productCards = document.querySelectorAll('.item');
    
    productCards.forEach(card => {
        // Находим все элементы внутри карточки
        const image = card.querySelector('img');
        const title = card.querySelector('h3');
        const priceElement = card.querySelector('p');
        
        if (!image || !title || !priceElement) return;

        // Извлекаем цену из текста, убирая все кроме цифр
        const priceMatch = priceElement.textContent.match(/\d+/);
        if (!priceMatch) return;
        const price = parseInt(priceMatch[0]);

        // Получаем размеры из существующих кнопок
        const sizeButtons = card.querySelectorAll('button');
        const sizes = Array.from(sizeButtons).map(button => button.textContent);

        // Добавляем обработчик клика на всю карточку
        const clickHandler = function(e) {
            // Проверяем, не был ли клик по кнопке или ссылке
            if (!e.target.matches('button') && !e.target.matches('a')) {
                e.preventDefault(); // Предотвращаем переход по ссылке
                openProductDetails(title.textContent, price, image.src, sizes);
            }
        };

        // Удаляем предыдущие обработчики, если они есть
        card.removeEventListener('click', clickHandler);
        
        // Добавляем новый обработчик
        card.addEventListener('click', clickHandler);
        
        // Добавляем стиль курсора
        card.style.cursor = 'pointer';
    });
}

// Вызываем функцию после загрузки DOM
document.addEventListener('DOMContentLoaded', makeProductCardsClickable);

// Также вызываем функцию сразу, если DOM уже загружен
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    makeProductCardsClickable();
} 