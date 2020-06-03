
module.exports = (app) => {
    const TutorTrac = require('../controllers/appController');

    app.route('/session')
        .get(TutorTrac.listCurrentSession)
        .post(TutorTrac.validate('createSession'),TutorTrac.createSession);

    app.route('/stats')
        .get(TutorTrac.getStats);

    app.route('/time/:id')
        .put(TutorTrac.update);
    app.route('/')
        .get(TutorTrac.listErrors);
};