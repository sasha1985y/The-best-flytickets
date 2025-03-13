const calendarContainer = document.querySelector(".calendar-container");

const monthTemplate = document
  .querySelector("#calendar-template")
  .content
  .querySelector(".calendar-month");

const monthContainer = document.querySelector(".calendar-dates");

const ClassName = {
  DATE: "calendar-month-dates-day",
  PAST_DATE: "calendar-month-dates-day-past",
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

function initializeDatePicker(dateFromElement, dateToElement) {
  let isCalendarOpen = false;

  const selectedDates = {
    FROM: null,
    TO: null,
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

    const selectedDate = new Date(evt.target.dataset.date);

    // 1. Если не выбрана никакая дата, первая нажатая дата становится from
    // 2. Если дата выбрана, вторая нажатая дата становится 
    //   2.1. Если вторая нажатая дата больше или равна выбранной, она становится to
    //   2.2. Если вторая нажатая дата меньше выбранной, она становится from, а
    //        выбранная дата становится to
    if (selectedDates.FROM === null) {
      selectedDates.FROM = selectedDate;
    } else {
      if (selectedDate > selectedDates.FROM) {
        selectedDates.TO = selectedDate;
      } else {
        selectedDates.TO = selectedDates.FROM;
        selectedDates.FROM = selectedDate;
      }
    }

    if (selectedDates.FROM !== null && selectedDates.TO !== null) {
      dateFromElement.value = selectedDates.FROM.toLocaleString("ru-RU");
      dateToElement.value = selectedDates.TO.toLocaleString("ru-RU");

      hideCalendarDialog();
      isCalendarOpen = false;
    }
  }
}

initializeDatePicker(
  document.querySelector("#date-from"),
  document.querySelector("#date-to"),
);