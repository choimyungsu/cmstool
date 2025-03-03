import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';

document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        events: [
            { title: '이벤트 1', start: '2025-03-01' },
            { title: '이벤트 2', start: '2025-03-10' }
        ]
    });
    calendar.render();
});
