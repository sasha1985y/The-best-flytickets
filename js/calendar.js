const calendarContainer = document.querySelector(".calendar-container");

const monthTemplate = document
  .querySelector("#calendar-template")
  .content
  .querySelector(".calendar-month");

const monthContainer = document.querySelector(".calendar-dates");

const ClassName = {
  DATE: "calendar-month-dates-day",
  FROM: "calendar-month-dates-day-from",
  IN_RANGE: "calendar-month-dates-day-in-range",
  PAST_DATE: "calendar-month-dates-day-past",
  TO: "calendar-month-dates-day-to",
  TODAY: "calendar-month-dates-day-today",
};

function getMonth(idx) {
  const objDate = new Date();
  objDate.setDate(1);
  objDate.setMonth(idx);

  const month = objDate.toLocaleString("ru-RU", {
    month: "long",
  });

  return month;
}

function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function renderCalendarMonth(
  container,
  monthNumber = new Date().getMonth(),
  yearNumber = new Date().getFullYear(),
) {
  const monthElement = monthTemplate.cloneNode(true);
  // Все изменения в DOM мы производим до отрисовки элемента на страницу
  // чтобы не вызывать слишком много повторных рендерингов

  const monthNameElement = monthElement.querySelector(".calendar-month-name");
  monthNameElement.textContent = `${getMonth(monthNumber)} ${yearNumber}`;

  // 1. Взять первый день месяца
  // 2. Определить день недели этого дня
  let firstDayInMonth = new Date(yearNumber, monthNumber, 1).getDay();
  if (firstDayInMonth === 0) {
    firstDayInMonth = 7;
  }

  const daysContainer = monthElement.querySelector(".calendar-month-dates-days");

  // 3. До этого дня заполнить контейнер филлерами (пустыми элементами)
  let daysLeft = firstDayInMonth;
  while (--daysLeft) {
    const fillerDate = document.createElement("li");
    daysContainer.appendChild(fillerDate);
  }

  // 4. Определить количество дней в месяце
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = getDaysInMonth(monthNumber, yearNumber);
  // 5. В цикле заполнить контейнер блоками под дни по их количеству
  // 6. Попутно отмечая прошедние дни и текущий день
  for (let day = 1; day <= daysInMonth; day++) {
    const date = document.createElement("li");
    const renderedDate = new Date(yearNumber, monthNumber, day, 0, 0, 0, 0);

    date.textContent = day;

    date.classList.add(ClassName.DATE);
    date.classList.toggle(ClassName.PAST_DATE, renderedDate - today < 0);
    date.classList.toggle(ClassName.TODAY, renderedDate - today === 0);

    date.dataset.date = renderedDate.toISOString();

    daysContainer.appendChild(date);
  }

  container.appendChild(monthElement);
}

function clearCalendarMonths() {
  monthContainer.innerHTML = "";
}

function showCalendarDialog() {
  calendarContainer.open = true;
}

function hideCalendarDialog() {
  calendarContainer.open = false;
  clearCalendarMonths();
}

function highlightRange(container, dateFrom, dateTo = null) {
  const allDates = container.querySelectorAll(`.${ClassName.DATE}`);

  for (date of allDates) {
    const currentDate = new Date(date.dataset.date);

    date.classList.toggle(ClassName.FROM, +currentDate === +dateFrom);
    date.classList.toggle(ClassName.IN_RANGE, dateTo !== null && currentDate > dateFrom && currentDate < dateTo);
    date.classList.toggle(ClassName.TO, dateTo !== null && +currentDate === +dateTo);
  }
}

function initializeDatePicker(dateFromElement, dateToElement) {
  let isCalendarOpen = false;

  const selectedDates = {
    from: null,
    to: null,
  };

  dateFromElement.onfocus = function () {
    // Fail fast
    if (isCalendarOpen) {
      return;
    }

    showCalendarDialog();
    renderCalendarMonth(monthContainer, new Date().getMonth());
    renderCalendarMonth(monthContainer, new Date().getMonth() + 1);

    isCalendarOpen = true;
  }

  monthContainer.onclick = function (evt) {
    const isSelectableDateClicked = (
      evt.target.classList.contains(ClassName.DATE) &&
      !evt.target.classList.contains(ClassName.PAST_DATE)
    );

    if (!isSelectableDateClicked) {
      return;
    }

    const clickedDate = new Date(evt.target.dataset.date);

    // 1. Если не выбрана никакая дата, первая нажатая дата становится from
    // 2. Если дата выбрана, вторая нажатая дата становится 
    //   2.1. Если вторая нажатая дата больше или равна выбранной, она становится to
    //   2.2. Если вторая нажатая дата меньше выбранной, она становится from, а
    //        выбранная дата становится to
    // if (selectedDates.from === null) {
    //   selectedDates.from = selectedDate;
    // } else {
    //   if (selectedDate > selectedDates.from) {
    //     selectedDates.to = selectedDate;
    //   } else {
    //     selectedDates.to = selectedDates.from;
    //     selectedDates.from = selectedDate;
    //   }
    // }

    if (selectedDates.from === null && selectedDates.to === null) {
      // Выбрано ноль дат — подсвечиваем то, на что навели
      selectedDates.from = clickedDate;
      selectedDates.to = null;
    } else if (selectedDates.from !== null && selectedDates.to === null) {
      // Выбрана одна дата
      // - from - меньшая дата из hoveredDate или selectedDates.from
      // - to — большая дата из hoveredDate или selectedDates.from

      selectedDates.from = +clickedDate < +selectedDates.from ? clickedDate : selectedDates.from;
      selectedDates.to = +clickedDate > +selectedDates.from ? clickedDate : selectedDates.from;
    } else {
      selectedDates.from = +clickedDate < +selectedDates.to ? clickedDate : selectedDates.from;
      selectedDates.to = +clickedDate >= +selectedDates.to ? clickedDate : selectedDates.to;
    }

    if (selectedDates.from !== null && selectedDates.to !== null) {
      dateFromElement.value = selectedDates.from.toLocaleString("ru-RU");
      dateToElement.value = selectedDates.to.toLocaleString("ru-RU");

      // hideCalendarDialog();
      // isCalendarOpen = false;
    }

    highlightRange(monthContainer, selectedDates.from, selectedDates.to);
  }

  monthContainer.onmouseover = function (evt) {
    const isSelectableDateHovered = (
      evt.target.classList.contains(ClassName.DATE) &&
      !evt.target.classList.contains(ClassName.PAST_DATE)
    );

    if (!isSelectableDateHovered) {
      return;
    }

    const hoveredDate = new Date(evt.target.dataset.date);

    if (selectedDates.from === null && selectedDates.to === null) {
      // Выбрано ноль дат — подсвечиваем то, на что навели
      highlightRange(monthContainer, hoveredDate);
    } else if (selectedDates.from !== null && selectedDates.to === null) {
      // Выбрана одна дата
      // - from - меньшая дата из hoveredDate или selectedDates.from
      // - to — большая дата из hoveredDate или selectedDates.from
      highlightRange(
        monthContainer,
        +hoveredDate < +selectedDates.from ? hoveredDate : selectedDates.from,
        +hoveredDate > +selectedDates.from ? hoveredDate : selectedDates.from,
      );
    } else {
      // Выбрано две даты
      // - from меньшая дата из hoveredDate или selectedDates.from
      // - to — большая дата из hoveredDate или selectedDates.to
      highlightRange(
        monthContainer,
        +hoveredDate < +selectedDates.to ? hoveredDate : selectedDates.from,
        +hoveredDate >= +selectedDates.to ? hoveredDate : selectedDates.to,
      );
    }
  }
}


// — Визуализация выбранных дат
//   — [x] Если нет выбранных дат — ничего не подсвечено по умолчанию
//   — [ ] Если нет выбранных дат при перемещении курсора по полю мы подсвечиваем дату
//   — [x] Если выбрана одна дата, ее блок подсвечен
//   — [ ] Если выбрана одна дата при перемещении курсора по полю мы подсвечиваем
//     диапазон до той даты, на которую наведен курсор
//   — [x] Если выбрано две даты — подсветить обе и диапазон
//   — [-] Если выбрана одна дата без обратного билета, подсвечена только она
// 
//     при открытии
//     по клику на дату
//     при перемещении курсора

// — Инициализация календаря с уже выбранными датами
// — Закрытие календаря
// — Одна дата
// — Переключение месяцев

const closeCalendarBtn = document.querySelector(".close-calendar-btn");

closeCalendarBtn.addEventListener('click', () => {
  hideCalendarDialog();
  initializeDatePicker(
    document.querySelector("#date-from"),
    document.querySelector("#date-to"),
  );
});

// Закрытие попапа по нажатию клавиши Esc
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    hideCalendarDialog();
    initializeDatePicker(
      document.querySelector("#date-from"),
      document.querySelector("#date-to"),
    );
  }
});


initializeDatePicker(
  document.querySelector("#date-from"),
  document.querySelector("#date-to"),
);