const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

router.get('/calendar', calendarController.getCalendar);
router.get('/calendar/events', calendarController.getEvents);
router.post('/calendar/events', calendarController.addEvent);
router.put('/calendar/events/:id', calendarController.updateEvent);
router.delete('/calendar/events/:id', calendarController.deleteEvent);

module.exports = router;