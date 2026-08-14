{\rtf1\ansi\ansicpg1251\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const MONTHS = [\
    "\uc0\u1071 \u1085 \u1074 \u1072 \u1088 \u1100 ",\
    "\uc0\u1060 \u1077 \u1074 \u1088 \u1072 \u1083 \u1100 ",\
    "\uc0\u1052 \u1072 \u1088 \u1090 ",\
    "\uc0\u1040 \u1087 \u1088 \u1077 \u1083 \u1100 ",\
    "\uc0\u1052 \u1072 \u1081 ",\
    "\uc0\u1048 \u1102 \u1085 \u1100 ",\
    "\uc0\u1048 \u1102 \u1083 \u1100 ",\
    "\uc0\u1040 \u1074 \u1075 \u1091 \u1089 \u1090 ",\
    "\uc0\u1057 \u1077 \u1085 \u1090 \u1103 \u1073 \u1088 \u1100 ",\
    "\uc0\u1054 \u1082 \u1090 \u1103 \u1073 \u1088 \u1100 ",\
    "\uc0\u1053 \u1086 \u1103 \u1073 \u1088 \u1100 ",\
    "\uc0\u1044 \u1077 \u1082 \u1072 \u1073 \u1088 \u1100 "\
];\
\
const STORAGE_KEY = "birthdays-local";\
\
let birthdays = [];\
\
\
/* -------------------------\
   INIT\
------------------------- */\
\
document.addEventListener("DOMContentLoaded", async () => \{\
\
    createMonthSelect();\
\
    birthdays = await loadBirthdays();\
\
    render();\
\
    document\
        .getElementById("birthday-form")\
        .addEventListener("submit", addBirthday);\
\
    document\
        .getElementById("download")\
        .addEventListener("click", downloadJSON);\
\
    document\
        .getElementById("reset")\
        .addEventListener("click", resetLocal);\
\
\});\
\
\
/* -------------------------\
   LOAD DATA\
------------------------- */\
\
async function loadBirthdays() \{\
\
    let remote = [];\
\
    try \{\
\
        const response = await fetch(\
            "data/birthdays.json",\
            \{ cache: "no-store" \}\
        );\
\
        if (response.ok) \{\
            remote = await response.json();\
        \}\
\
    \} catch (error) \{\
\
        console.warn(\
            "\uc0\u1053 \u1077  \u1091 \u1076 \u1072 \u1083 \u1086 \u1089 \u1100  \u1079 \u1072 \u1075 \u1088 \u1091 \u1079 \u1080 \u1090 \u1100  birthdays.json",\
            error\
        );\
\
    \}\
\
\
    const local = localStorage.getItem(STORAGE_KEY);\
\
    if (local) \{\
\
        try \{\
\
            const parsed = JSON.parse(local);\
\
            if (Array.isArray(parsed)) \{\
                return parsed;\
            \}\
\
        \} catch (error) \{\
\
            console.warn(\
                "\uc0\u1051 \u1086 \u1082 \u1072 \u1083 \u1100 \u1085 \u1099 \u1077  \u1076 \u1072 \u1085 \u1085 \u1099 \u1077  \u1087 \u1086 \u1074 \u1088 \u1077 \u1078 \u1076 \u1077 \u1085 \u1099 ",\
                error\
            );\
\
        \}\
    \}\
\
\
    return Array.isArray(remote)\
        ? remote\
        : [];\
\}\
\
\
/* -------------------------\
   MONTH SELECT\
------------------------- */\
\
function createMonthSelect() \{\
\
    const select = document.getElementById("month");\
\
    select.innerHTML = "";\
\
    MONTHS.forEach((month, index) => \{\
\
        const option = document.createElement("option");\
\
        option.value = index + 1;\
        option.textContent = month;\
\
        select.appendChild(option);\
\
    \});\
\}\
\
\
/* -------------------------\
   RENDER\
------------------------- */\
\
function render() \{\
\
    renderMonths();\
\
    renderSoon();\
\
\}\
\
\
/* -------------------------\
   MONTHS\
------------------------- */\
\
function renderMonths() \{\
\
    const container = document.getElementById("months");\
\
    container.innerHTML = "";\
\
    const sorted = [...birthdays].sort(compareBirthdays);\
\
\
    MONTHS.forEach((monthName, index) => \{\
\
        const monthNumber = index + 1;\
\
        const people = sorted.filter(\
            person => Number(person.month) === monthNumber\
        );\
\
\
        const month = document.createElement("article");\
\
        month.className = "month";\
\
\
        const title = document.createElement("div");\
\
        title.className = "month-title";\
\
        title.textContent =\
            `$\{monthName\} \'b7 $\{people.length\}`;\
\
\
        const list = document.createElement("ul");\
\
        list.className = "month-list";\
\
\
        if (people.length === 0) \{\
\
            const empty = document.createElement("li");\
\
            empty.className = "month-empty";\
\
            empty.textContent = "\uc0\u1055 \u1086 \u1082 \u1072  \u1085 \u1080 \u1082 \u1086 \u1075 \u1086  \u1085 \u1077 \u1090 .";\
\
            list.appendChild(empty);\
\
        \} else \{\
\
            people.forEach(person => \{\
\
                list.appendChild(\
                    createPersonElement(person)\
                );\
\
            \});\
\
        \}\
\
\
        month.appendChild(title);\
        month.appendChild(list);\
\
        container.appendChild(month);\
\
    \});\
\}\
\
\
/* -------------------------\
   PERSON\
------------------------- */\
\
function createPersonElement(person) \{\
\
    const item = document.createElement("li");\
\
    item.className = "person";\
\
\
    const day = document.createElement("div");\
\
    day.className = "person-day";\
\
    day.textContent =\
        String(person.day).padStart(2, "0");\
\
\
    const name = document.createElement("div");\
\
    name.className = "person-name";\
\
    name.textContent = person.name;\
\
\
    const info = document.createElement("div");\
\
    info.className = "person-info";\
\
\
    const details = [];\
\
    if (\
        person.age !== undefined &&\
        person.age !== null &&\
        person.age !== ""\
    ) \{\
        details.push(\
            `$\{person.age\} $\{pluralYears(person.age)\}`\
        );\
    \}\
\
    if (person.note) \{\
        details.push(person.note);\
    \}\
\
    info.textContent = details.join(" \'b7 ");\
\
\
    item.appendChild(day);\
    item.appendChild(name);\
    item.appendChild(info);\
\
\
    return item;\
\}\
\
\
/* -------------------------\
   SOON\
------------------------- */\
\
function renderSoon() \{\
\
    const container = document.getElementById("soon-list");\
\
    container.innerHTML = "";\
\
\
    if (birthdays.length === 0) \{\
\
        container.innerHTML =\
            `<div class="empty">\
                \uc0\u1044 \u1086 \u1073 \u1072 \u1074 \u1100  \u1087 \u1077 \u1088 \u1074 \u1099 \u1081  \u1076 \u1077 \u1085 \u1100  \u1088 \u1086 \u1078 \u1076 \u1077 \u1085 \u1080 \u1103  \u1085 \u1080 \u1078 \u1077 .\
            </div>`;\
\
        return;\
    \}\
\
\
    const today = new Date();\
\
    today.setHours(0, 0, 0, 0);\
\
\
    const upcoming = birthdays\
        .map(person => \{\
\
            const date = nextBirthdayDate(person, today);\
\
            return \{\
                person,\
                date,\
                days: differenceInDays(today, date)\
            \};\
\
        \})\
        .sort((a, b) => \{\
\
            if (a.days !== b.days) \{\
                return a.days - b.days;\
            \}\
\
            return compareBirthdays(\
                a.person,\
                b.person\
            );\
\
        \})\
        .slice(0, 5);\
\
\
    upcoming.forEach(item => \{\
\
        const element = document.createElement("div");\
\
        element.className = "soon-item";\
\
\
        const left = document.createElement("div");\
\
        const name = document.createElement("span");\
\
        name.className = "soon-name";\
\
        name.textContent = item.person.name;\
\
\
        const date = document.createElement("span");\
\
        date.className = "soon-date";\
\
        date.textContent =\
            ` \'b7 $\{formatDate(item.person)\}`;\
\
\
        left.appendChild(name);\
        left.appendChild(date);\
\
\
        const days = document.createElement("span");\
\
        days.className = "soon-days";\
\
        days.textContent =\
            formatDaysLeft(item.days);\
\
\
        element.appendChild(left);\
        element.appendChild(days);\
\
        container.appendChild(element);\
\
    \});\
\}\
\
\
/* -------------------------\
   NEXT BIRTHDAY\
------------------------- */\
\
function nextBirthdayDate(person, today) \{\
\
    const year = today.getFullYear();\
\
    let date = new Date(\
        year,\
        Number(person.month) - 1,\
        Number(person.day)\
    );\
\
    date.setHours(0, 0, 0, 0);\
\
\
    if (date < today) \{\
\
        date = new Date(\
            year + 1,\
            Number(person.month) - 1,\
            Number(person.day)\
        );\
\
        date.setHours(0, 0, 0, 0);\
\
    \}\
\
\
    return date;\
\}\
\
\
/* -------------------------\
   ADD\
------------------------- */\
\
function addBirthday(event) \{\
\
    event.preventDefault();\
\
\
    const name =\
        document.getElementById("name")\
            .value\
            .trim();\
\
    const day =\
        Number(\
            document.getElementById("day").value\
        );\
\
    const month =\
        Number(\
            document.getElementById("month").value\
        );\
\
    const ageValue =\
        document.getElementById("age").value;\
\
    const note =\
        document.getElementById("note")\
            .value\
            .trim();\
\
\
    if (!name) \{\
        alert("\uc0\u1059 \u1082 \u1072 \u1078 \u1080  \u1080 \u1084 \u1103 .");\
        return;\
    \}\
\
    if (\
        !Number.isInteger(day) ||\
        day < 1 ||\
        day > daysInMonth(month)\
    ) \{\
\
        alert("\uc0\u1053 \u1077 \u1074 \u1077 \u1088 \u1085 \u1099 \u1081  \u1076 \u1077 \u1085 \u1100 .");\
\
        return;\
    \}\
\
\
    const birthday = \{\
        name,\
        day,\
        month\
    \};\
\
\
    if (ageValue !== "") \{\
\
        const age = Number(ageValue);\
\
        if (\
            !Number.isInteger(age) ||\
            age < 0\
        ) \{\
\
            alert("\uc0\u1053 \u1077 \u1074 \u1077 \u1088 \u1085 \u1099 \u1081  \u1074 \u1086 \u1079 \u1088 \u1072 \u1089 \u1090 .");\
\
            return;\
        \}\
\
        birthday.age = age;\
    \}\
\
\
    if (note) \{\
        birthday.note = note;\
    \}\
\
\
    birthdays.push(birthday);\
\
    saveLocal();\
\
    render();\
\
\
    document\
        .getElementById("birthday-form")\
        .reset();\
\
\
    window.location.hash = "list";\
\}\
\
\
/* -------------------------\
   LOCAL STORAGE\
------------------------- */\
\
function saveLocal() \{\
\
    localStorage.setItem(\
        STORAGE_KEY,\
        JSON.stringify(birthdays, null, 2)\
    );\
\}\
\
\
/* -------------------------\
   DOWNLOAD JSON\
------------------------- */\
\
function downloadJSON() \{\
\
    const json =\
        JSON.stringify(\
            birthdays,\
            null,\
            2\
        );\
\
\
    const blob =\
        new Blob(\
            [json],\
            \{\
                type: "application/json"\
            \}\
        );\
\
\
    const url =\
        URL.createObjectURL(blob);\
\
\
    const link =\
        document.createElement("a");\
\
    link.href = url;\
\
    link.download =\
        "birthdays.json";\
\
\
    document.body.appendChild(link);\
\
    link.click();\
\
    link.remove();\
\
    URL.revokeObjectURL(url);\
\}\
\
\
/* -------------------------\
   RESET\
------------------------- */\
\
function resetLocal() \{\
\
    const confirmed =\
        confirm(\
            "\uc0\u1057 \u1073 \u1088 \u1086 \u1089 \u1080 \u1090 \u1100  \u1083 \u1086 \u1082 \u1072 \u1083 \u1100 \u1085 \u1099 \u1077  \u1080 \u1079 \u1084 \u1077 \u1085 \u1077 \u1085 \u1080 \u1103  \u1080  \u1089 \u1085 \u1086 \u1074 \u1072  \u1080 \u1089 \u1087 \u1086 \u1083 \u1100 \u1079 \u1086 \u1074 \u1072 \u1090 \u1100  birthdays.json?"\
        );\
\
\
    if (!confirmed) \{\
        return;\
    \}\
\
\
    localStorage.removeItem(\
        STORAGE_KEY\
    );\
\
\
    location.reload();\
\}\
\
\
/* -------------------------\
   SORT\
------------------------- */\
\
function compareBirthdays(a, b) \{\
\
    const monthA = Number(a.month);\
    const monthB = Number(b.month);\
\
    if (monthA !== monthB) \{\
        return monthA - monthB;\
    \}\
\
\
    const dayA = Number(a.day);\
    const dayB = Number(b.day);\
\
    if (dayA !== dayB) \{\
        return dayA - dayB;\
    \}\
\
\
    return String(a.name)\
        .localeCompare(\
            String(b.name),\
            "ru"\
        );\
\}\
\
\
/* -------------------------\
   HELPERS\
------------------------- */\
\
function daysInMonth(month) \{\
\
    return new Date(\
        2024,\
        month,\
        0\
    ).getDate();\
\}\
\
\
function differenceInDays(a, b) \{\
\
    const milliseconds =\
        b.getTime() - a.getTime();\
\
    return Math.round(\
        milliseconds / 86400000\
    );\
\}\
\
\
function formatDate(person) \{\
\
    return (\
        String(person.day).padStart(2, "0")\
        + "."\
        +\
        String(person.month).padStart(2, "0")\
    );\
\}\
\
\
function formatDaysLeft(days) \{\
\
    if (days === 0) \{\
        return "\uc0\u1089 \u1077 \u1075 \u1086 \u1076 \u1085 \u1103  \u55356 \u57225 ";\
    \}\
\
    if (days === 1) \{\
        return "\uc0\u1079 \u1072 \u1074 \u1090 \u1088 \u1072 ";\
    \}\
\
    return `\uc0\u1095 \u1077 \u1088 \u1077 \u1079  $\{days\} $\{pluralDays(days)\}`;\
\}\
\
\
function pluralDays(number) \{\
\
    const n = Math.abs(number) % 100;\
    const last = n % 10;\
\
    if (n >= 11 && n <= 19) \{\
        return "\uc0\u1076 \u1085 \u1077 \u1081 ";\
    \}\
\
    if (last === 1) \{\
        return "\uc0\u1076 \u1077 \u1085 \u1100 ";\
    \}\
\
    if (last >= 2 && last <= 4) \{\
        return "\uc0\u1076 \u1085 \u1103 ";\
    \}\
\
    return "\uc0\u1076 \u1085 \u1077 \u1081 ";\
\}\
\
\
function pluralYears(number) \{\
\
    const n = Math.abs(number) % 100;\
    const last = n % 10;\
\
    if (n >= 11 && n <= 19) \{\
        return "\uc0\u1083 \u1077 \u1090 ";\
    \}\
\
    if (last === 1) \{\
        return "\uc0\u1075 \u1086 \u1076 ";\
    \}\
\
    if (last >= 2 && last <= 4) \{\
        return "\uc0\u1075 \u1086 \u1076 \u1072 ";\
    \}\
\
    return "\uc0\u1083 \u1077 \u1090 ";\
\}}