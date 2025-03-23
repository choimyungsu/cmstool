const calendarModel = require('../models/calendarModel');

exports.getCalendar = (req, res) => {
    const user = req.session.user;
    const projectList = req.session.projectList;
    const selectedProjectId = req.session.selectedProjectId;
    if (!user || !user.user_name) {
        return res.redirect('/login');
    }
    res.render('index', {
        currentPage: 'pages/calendar',
        user: user,
        projectList: projectList,
        selectedProjectId: selectedProjectId
      });


};

exports.getEvents = async (req, res) => {
    try {
        const events = await calendarModel.getAllEvents();
        res.json(events.map(event => ({
            id: event.id,
            title: `${event.title} (by ${event.created_by})`,
            start: event.start,
            end: event.end,
            allDay: event.all_day,
            backgroundColor: event.background_color,
            borderColor: event.border_color,
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addEvent = async (req, res) => {
    try {
        const user = req.session.user || { user_name: 'Guest' };
        const { title, start, end, all_day, background_color } = req.body;
        const createdBy = user.user_name;

        console.log('Received add event:', { title, start, end, all_day, background_color, createdBy });

        const newEvent = await calendarModel.addEvent(
            title,
            start,
            end || null,
            all_day === true || all_day === 'true', // 명시적 boolean 처리
            background_color,
            background_color,
            createdBy
        );
        console.log('Saved event:', newEvent);

        res.json({
            id: newEvent.id,
            title: `${newEvent.title} (by ${newEvent.created_by})`,
            start: newEvent.start,
            end: newEvent.end,
            allDay: newEvent.all_day,
            backgroundColor: newEvent.background_color,
            borderColor: newEvent.border_color,
        });
    } catch (err) {
        console.error('Add event error:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { start, end, all_day } = req.body;
        console.log('Update request:', { id, start, end, all_day });

        const updatedEvent = await calendarModel.updateEvent(id, start, end, all_day === true || all_day === 'true');
        res.json({
            id: updatedEvent.id,
            title: `${updatedEvent.title} (by ${updatedEvent.created_by})`,
            start: updatedEvent.start,
            end: updatedEvent.end,
            allDay: updatedEvent.all_day,
            backgroundColor: updatedEvent.background_color,
            borderColor: updatedEvent.border_color,
        });
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await calendarModel.deleteEvent(id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};