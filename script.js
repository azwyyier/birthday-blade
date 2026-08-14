const MONTHS = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь"
];

const STORAGE_KEY = "birthday-blade-data";

let birthdays = [];


/* =========================
   ЗАПУСК
========================= */

document.addEventListener("DOMContentLoaded", async () => {

    createMonthSelect();

    /*
       Убираем старое поле "Заметка",
       даже если оно осталось в index.html.
    */

    const note = document.getElementById("note");

    if (note) {
        const label = note.closest("label");

        if (label) {
            label.remove();
        }
    }


    /*
       Исправляем название старой кнопки.
    */

    const resetButton =
        document.getElementById("reset");

    if (resetButton) {

        resetButton.textContent =
            "Сбросить";

        resetButton.addEventListener(
            "click",
            resetForm
        );
    }


    /*
       Загружаем дни рождения.
    */

    await loadBirthdays();

    render();


    /*
       Добавление.
    */

    const form =
        document.getElementById(
            "birthday-form"
        );

    if (form) {

        form.addEventListener(
            "submit",
            addBirthday
        );
    }


    /*
       Скачать JSON.
    */

    const download =
        document.getElementById(
            "download"
        );

    if (download) {

        download.addEventListener(
            "click",
            downloadJSON
        );
    }

});


/* =========================
   ЗАГРУЗКА
========================= */

async function loadBirthdays() {

    let remote = [];


    try {

        const response =
            await fetch(
                "data/birthdays.json",
                {
                    cache: "no-store"
                }
            );


        if (response.ok) {

            const data =
                await response.json();


            if (Array.isArray(data)) {

                remote = data;

            }

        }

    } catch (error) {

        console.warn(
            "Не удалось загрузить birthdays.json",
            error
        );

    }


    /*
       Если есть локальные изменения,
       используем их.
    */

    const local =
        localStorage.getItem(
            STORAGE_KEY
        );


    if (local) {

        try {

            const parsed =
                JSON.parse(local);


            if (Array.isArray(parsed)) {

                birthdays =
                    cleanData(parsed);

                return;

            }

        } catch (error) {

            console.warn(
                "Ошибка локальных данных",
                error
            );

        }

    }


    birthdays =
        cleanData(remote);

}


/* =========================
   ОЧИСТКА ДАННЫХ
========================= */

function cleanData(data) {

    return data

        .filter(person => {

            return (
                person &&
                person.name &&
                person.day &&
                person.month
            );

        })

        .map(person => {

            const result = {

                name:
                    String(person.name),

                day:
                    Number(person.day),

                month:
                    Number(person.month)

            };


            /*
               Возраст сохраняем,
               если он указан.
            */

            if (
                person.age !== undefined &&
                person.age !== null &&
                person.age !== ""
            ) {

                const age =
                    Number(person.age);


                if (
                    Number.isInteger(age) &&
                    age >= 0
                ) {

                    result.age = age;

                }

            }


            return result;

        });

}


/* =========================
   МЕСЯЦЫ
========================= */

function createMonthSelect() {

    const select =
        document.getElementById(
            "month"
        );


    if (!select) {
        return;
    }


    select.innerHTML = "";


    MONTHS.forEach(
        (month, index) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                index + 1;


            option.textContent =
                month;


            select.appendChild(
                option
            );

        }
    );

}


/* =========================
   RENDER
========================= */

function render() {

    renderMonths();

    renderSoon();

}


/* =========================
   МЕСЯЦЫ
========================= */

function renderMonths() {

    const container =
        document.getElementById(
            "months"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    MONTHS.forEach(
        (monthName, index) => {

            const monthNumber =
                index + 1;


            const people =
                birthdays
                    .filter(person => {

                        return (
                            Number(person.month)
                            ===
                            monthNumber
                        );

                    })
                    .sort(
                        compareBirthdays
                    );


            const month =
                document.createElement(
                    "article"
                );


            month.className =
                "month";


            const title =
                document.createElement(
                    "div"
                );


            title.className =
                "month-title";


            title.textContent =
                `${monthName} · ${people.length}`;


            const list =
                document.createElement(
                    "ul"
                );


            list.className =
                "month-list";


            if (
                people.length === 0
            ) {

                const empty =
                    document.createElement(
                        "li"
                    );


                empty.className =
                    "month-empty";


                empty.textContent =
                    "Пока никого нет.";


                list.appendChild(
                    empty
                );

            }


            people.forEach(
                person => {

                    list.appendChild(
                        createPerson(
                            person
                        )
                    );

                }
            );


            month.appendChild(
                title
            );


            month.appendChild(
                list
            );


            container.appendChild(
                month
            );

        }
    );

}


/* =========================
   ЧЕЛОВЕК
========================= */

function createPerson(person) {

    const item =
        document.createElement(
            "li"
        );


    item.className =
        "person";


    const day =
        document.createElement(
            "div"
        );


    day.className =
        "person-day";


    day.textContent =
        String(
            person.day
        ).padStart(2, "0");


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "person-name-wrapper";


    const name =
        document.createElement(
            "div"
        );


    name.className =
        "person-name";


    name.textContent =
        person.name;


    /*
       КРЕСТИК УДАЛЕНИЯ
    */

    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.type =
        "button";


    deleteButton.className =
        "delete-person";


    deleteButton.textContent =
        "×";


    deleteButton.title =
        "Удалить этого человека";


    deleteButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            deleteBirthday(person);

        }
    );


    wrapper.appendChild(
        name
    );


    wrapper.appendChild(
        deleteButton
    );


    item.appendChild(
        day
    );


    item.appendChild(
        wrapper
    );


    /*
       Возраст.
    */

    if (
        person.age !== undefined
    ) {

        const age =
            document.createElement(
                "div"
            );


        age.className =
            "person-age";


        age.textContent =
            `${person.age} ${yearsWord(person.age)}`;


        item.appendChild(
            age
        );

    }


    return item;

}


/* =========================
   УДАЛИТЬ ОДНОГО
========================= */

function deleteBirthday(person) {

    const confirmed =
        confirm(
            `Удалить ${person.name} из списка?`
        );


    if (!confirmed) {
        return;
    }


    birthdays =
        birthdays.filter(item => {

            return !(
                String(item.name)
                ===
                String(person.name)

                &&

                Number(item.day)
                ===
                Number(person.day)

                &&

                Number(item.month)
                ===
                Number(person.month)
            );

        });


    saveLocal();

    render();

}


/* =========================
   СКОРО
========================= */

function renderSoon() {

    const container =
        document.getElementById(
            "soon-list"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        birthdays.length === 0
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "empty";


        empty.textContent =
            "Пока нет ближайших дней рождения.";


        container.appendChild(
            empty
        );


        return;

    }


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    /*
       Получаем следующий день
       рождения каждого человека.
    */

    const upcoming =
        birthdays
            .map(person => {

                const date =
                    nextBirthday(
                        person,
                        today
                    );


                const days =
                    Math.round(
                        (
                            date.getTime()
                            -
                            today.getTime()
                        )
                        /
                        86400000
                    );


                return {
                    person,
                    date,
                    days
                };

            })
            .sort((a, b) => {

                if (
                    a.days !==
                    b.days
                ) {

                    return (
                        a.days -
                        b.days
                    );

                }


                return compareBirthdays(
                    a.person,
                    b.person
                );

            });


    /*
       В "Скоро" показываем
       ТОЛЬКО ближайшего.
    */

    const next =
        upcoming[0];


    const row =
        document.createElement(
            "div"
        );


    row.className =
        "soon-item";


    const left =
        document.createElement(
            "div"
        );


    const name =
        document.createElement(
            "span"
        );


    name.className =
        "soon-name";


    name.textContent =
        next.person.name;


    const date =
        document.createElement(
            "span"
        );


    date.className =
        "soon-date";


    date.textContent =
        ` · ${formatDate(next.person)}`;


    left.appendChild(
        name
    );


    left.appendChild(
        date
    );


    const days =
        document.createElement(
            "span"
        );


    days.className =
        "soon-days";


    days.textContent =
        formatDays(
            next.days
        );


    row.appendChild(
        left
    );


    row.appendChild(
        days
    );


    container.appendChild(
        row
    );

}


/* =========================
   СЛЕДУЮЩИЙ ДР
========================= */

function nextBirthday(
    person,
    today
) {

    const year =
        today.getFullYear();


    let date =
        new Date(
            year,
            Number(person.month) - 1,
            Number(person.day)
        );


    date.setHours(
        0,
        0,
        0,
        0
    );


    if (
        date < today
    ) {

        date =
            new Date(
                year + 1,
                Number(person.month) - 1,
                Number(person.day)
            );


        date.setHours(
            0,
            0,
            0,
            0
        );

    }


    return date;

}


/* =========================
   ДОБАВЛЕНИЕ
========================= */

function addBirthday(event) {

    event.preventDefault();


    const name =
        document
            .getElementById("name")
            .value
            .trim();


    const day =
        Number(
            document
                .getElementById("day")
                .value
        );


    const month =
        Number(
            document
                .getElementById("month")
                .value
        );


    const ageInput =
        document
            .getElementById("age")
            .value;


    if (!name) {

        alert(
            "Введите имя."
        );

        return;

    }


    const maxDay =
        new Date(
            2024,
            month,
            0
        ).getDate();


    if (
        !Number.isInteger(day)
        ||
        day < 1
        ||
        day > maxDay
    ) {

        alert(
            "Введите правильный день."
        );

        return;

    }


    const birthday = {

        name,
        day,
        month

    };


    if (
        ageInput !== ""
    ) {

        const age =
            Number(ageInput);


        if (
            !Number.isInteger(age)
            ||
            age < 0
        ) {

            alert(
                "Введите правильный возраст."
            );

            return;

        }


        birthday.age =
            age;

    }


    birthdays.push(
        birthday
    );


    birthdays.sort(
        compareBirthdays
    );


    saveLocal();

    render();


    /*
       После добавления
       очищаем форму.
    */

    document
        .getElementById(
            "birthday-form"
        )
        .reset();


    window.location.hash =
        "list";

}


/* =========================
   СОХРАНИТЬ
========================= */

function saveLocal() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(
            birthdays,
            null,
            2
        )

    );

}


/* =========================
   КНОПКА "СБРОСИТЬ"
========================= */

function resetForm() {

    /*
       ВОТ ЗДЕСЬ ГЛАВНОЕ:

       Мы НЕ удаляем birthdays.
       Мы НЕ трогаем localStorage.
       Мы НЕ перезагружаем страницу.

       Очищается только форма.
    */

    const form =
        document.getElementById(
            "birthday-form"
        );


    if (!form) {
        return;
    }


    form.reset();


    /*
       Возвращаем первый месяц.
    */

    const month =
        document.getElementById(
            "month"
        );


    if (month) {

        month.value =
            "1";

    }


    /*
       Фокус снова на имени.
    */

    const name =
        document.getElementById(
            "name"
        );


    if (name) {

        name.focus();

    }

}


/* =========================
   СКАЧАТЬ JSON
========================= */

function downloadJSON() {

    const json =
        JSON.stringify(
            birthdays,
            null,
            2
        );


    const blob =
        new Blob(
            [json],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "birthdays.json";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}


/* =========================
   СОРТИРОВКА
========================= */

function compareBirthdays(
    a,
    b
) {

    const monthA =
        Number(a.month);


    const monthB =
        Number(b.month);


    if (
        monthA !== monthB
    ) {

        return (
            monthA -
            monthB
        );

    }


    const dayA =
        Number(a.day);


    const dayB =
        Number(b.day);


    if (
        dayA !== dayB
    ) {

        return (
            dayA -
            dayB
        );

    }


    return String(a.name)
        .localeCompare(
            String(b.name),
            "ru"
        );

}


/* =========================
   ДАТА
========================= */

function formatDate(person) {

    return (

        String(
            person.day
        ).padStart(2, "0")

        +

        "."

        +

        String(
            person.month
        ).padStart(2, "0")

    );

}


/* =========================
   ДНИ
========================= */

function formatDays(days) {

    if (
        days === 0
    ) {

        return "сегодня 🎉";

    }


    if (
        days === 1
    ) {

        return "завтра";

    }


    return (
        `через ${days} ${daysWord(days)}`
    );

}


function daysWord(number) {

    const n =
        Math.abs(number)
        % 100;


    const last =
        n % 10;


    if (
        n >= 11 &&
        n <= 19
    ) {

        return "дней";

    }


    if (
        last === 1
    ) {

        return "день";

    }


    if (
        last >= 2 &&
        last <= 4
    ) {

        return "дня";

    }


    return "дней";

}


/* =========================
   ГОДЫ
========================= */

function yearsWord(number) {

    const n =
        Math.abs(number)
        % 100;


    const last =
        n % 10;


    if (
        n >= 11 &&
        n <= 19
    ) {

        return "лет";

    }


    if (
        last === 1
    ) {

        return "год";

    }


    if (
        last >= 2 &&
        last <= 4
    ) {

        return "года";

    }


    return "лет";

}
