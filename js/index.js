const fromChooserInput = document.querySelector('.from');
const fromChooserPopup = document.querySelector('.from-chooser-popup');
const hardWay = document.querySelector('.hard-way');
fromChooserInput.addEventListener('click', () => {
    fromChooserPopup.classList.toggle('visually-hidden');
    hardWay.classList.toggle('z-0');
    hardWay.classList.toggle('z-1');
});

const whereChooserInput = document.querySelector('.where');
const whereChooserPopup = document.querySelector('.where-chooser-popup');
whereChooserInput.addEventListener('click', () => {
    whereChooserPopup.classList.toggle('visually-hidden');
});

const passengerBtn = document.querySelector('.passenger');
const passengerPopup = document.querySelector('.passenger-popup');
passengerBtn.addEventListener('click', () => {
    passengerPopup.classList.toggle('visually-hidden');
});

//Изменяем списки футера на селекты

function convertToSelect() {
    const footerInfo = document.querySelectorAll('.footer-info > div');
    

    footerInfo.forEach(div => {
        const label = div.querySelector('b').innerText;
        const ul = div.querySelector('ul');
        const select = document.createElement('select');

        // Создаем лейбл
        const labelElement = document.createElement('label');
        labelElement.innerText = label;
        select.prepend(labelElement);

        // Переносим элементы li в select как option
        Array.from(ul.children).forEach(li => {
            const option = document.createElement('option');
            option.textContent = li.textContent;
            select.appendChild(option);
        });

        // Заменяем ul на select
        div.replaceChild(select, ul);
    });
}

function convertToUL() {
    const footerInfo = document.querySelectorAll('.footer-info > div');

    footerInfo.forEach(div => {
        const label = div.querySelector('label').innerText;
        const select = div.querySelector('select');
        const ul = document.createElement('ul');

        // Создаем лейбл
        const bElement = document.createElement('b');
        bElement.innerText = label;

        Array.from(select.children).forEach(option => {
            const li = document.createElement('li');
            li.textContent = option.textContent;
            ul.appendChild(li);
        });

        // Заменяем ul на select
        div.replaceChild(ul, select);
    });
}
        
function handleResize() {
    const footerInfo = document.querySelector('.footer-info');
    //const language = document.getElementById('language');
    if (window.innerWidth >= 320 && window.innerWidth <= 768) {
        // Если меньше 320px, преобразуем в select
        if (!footerInfo.querySelector('select')) {
            convertToSelect();
            footerInfo.classList.toggle('list-info');
            footerInfo.classList.toggle('select-info');
        }
    } else {
        // Если больше 320px, преобразуем обратно в ul
        if (footerInfo.querySelector('select')) {
            convertToUL();
            footerInfo.classList.toggle('list-info');
            footerInfo.classList.toggle('select-info');
        }
    }
}

window.addEventListener('resize', handleResize);
window.addEventListener('DOMContentLoaded', handleResize);

// Языки

const langBtn = document.querySelector('.lang');
const langSelect = document.querySelector('.language');

if (window.innerWidth >= 320 && window.innerWidth <= 768) {
    langSelect.classList.toggle('visually-hidden');
    langBtn.addEventListener('click', () => {
        langSelect.classList.toggle('visually-hidden');
    })

}

//Бургер

const burgerBtn = document.querySelector('.burger');
const headerNav = document.querySelector('.header-navigation');

if (window.innerWidth >= 320 && window.innerWidth <= 768) {
    burgerBtn.classList.toggle('visually-hidden');
    headerNav.classList.toggle('visually-hidden');
    burgerBtn.addEventListener('click', () => {
        headerNav.classList.toggle('visually-hidden');
    })

}

// пассажирский попап

document.addEventListener('DOMContentLoaded', () => {
    const adultsInput = document.getElementById('adultsInput');
    const childrenInput = document.getElementById('childrenInput');
    const infantsInput = document.getElementById('infantsInput');
    const infoPassenger = document.querySelector('.info-passenger');
    const incrementButtons = document.querySelectorAll('.increment');

    const updateInfo = () => {
        const adults = parseInt(adultsInput.value) || 0;
        const children = parseInt(childrenInput.value) || 0;
        const infants = parseInt(infantsInput.value) || 0;
        const totalPassengers = adults + children + infants;

        // Обновляем текст в info-passenger
        let passengerText = `${totalPassengers} пассажир${totalPassengers === 1 ? '' : 'а'}`;
        const selectedClass = document.querySelector('input[name="class-quality"]:checked').value;
        
        infoPassenger.textContent = `${passengerText}, ${selectedClass}`;

        // Деактивируем кнопки increment, если сумма пассажиров 9
        incrementButtons.forEach(button => {
            button.disabled = totalPassengers >= 9;
        });
    };

    const adjustValue = (input, increment) => {
        const currentValue = parseInt(input.value) || 0;
        const newValue = currentValue + (increment ? 1 : -1);
        input.value = Math.max(newValue, 0); // Не допускаем отрицательных значений
        updateInfo();
    };

    // Обработчики событий для кнопок увеличения и уменьшения
    document.querySelectorAll('.increment').forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            adjustValue(input, true); // Увеличиваем значение
        });
    });

    document.querySelectorAll('.decrement').forEach(button => {
        button.addEventListener('click', () => {
            const input = button.nextElementSibling;
            adjustValue(input, false); // Уменьшаем значение
        });
    });

    // Обработчик изменения для полей ввода
    adultsInput.addEventListener('input', updateInfo);
    childrenInput.addEventListener('input', updateInfo);
    infantsInput.addEventListener('input', updateInfo);
    
    // Обработчик для изменения радиокнопок
    document.querySelectorAll('input[name="class-quality"]').forEach(radio => {
        radio.addEventListener('change', updateInfo);
    });

    // Начальная загрузка информации
    updateInfo();
});

//инпуты откуда и куда

document.addEventListener('DOMContentLoaded', () => {
    const fromInput = document.querySelector('.from');
    const cityFromElement = document.querySelector('.city-from');
    
    // Функция для обновления текста city-from
    const updateCityFrom = () => {
        cityFromElement.textContent = fromInput.value;
    };

    // Добавляем обработчик события для ввода текста
    fromInput.addEventListener('input', updateCityFrom);
});

document.addEventListener('DOMContentLoaded', () => {
    const fromInput = document.querySelector('.where');
    const cityFromElement = document.querySelector('.city-where');
    
    // Функция для обновления текста city-from
    const updateCityTo = () => {
        cityFromElement.textContent = fromInput.value;
    };

    // Добавляем обработчик события для ввода текста
    fromInput.addEventListener('input', updateCityTo);
});