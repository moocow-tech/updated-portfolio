const StuSession = require("../models/appModel.js");
const { body, validationResult } = require('express-validator')

exports.listErrors = (req, res) => {
  res.send(req.session.errors);
};

exports.listCurrentSession = (req, res) => {
  StuSession.getCurrentSession((err, session) => {
    if (err) res.send(err);
    //console.log('res', session);
    res.send(session);
  });
};

exports.createSession = (req, res) => {
  
  // if (!req.body) {
  //   res.status(400).send({
  //     message: "Content cannot be empty!",
  //   });
  // }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //need this to display on frontend
   //res.status(422).json({ errors: errors.array() });
   req.session.errors = errors;
   res.send(req.session.errors)//.redirect('/');
   return
  }
  //Create session
  const new_session = new StuSession({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    course: req.body.course,
  });

  StuSession.createSession(new_session, (err) => {
    if (err) res.status(500).send(err);
    else
      res.redirect(
        "https://us.bbcollab.com/collab/ui/session/guest/c0c1ffb8200a40b59fe35072badfe631"
      );
  });
};

exports.getStats = (req, res) => {
  StuSession.getSessStats((err, session) => {
    if (err) res.send(err);
    //console.log('res', session);
    res.send(session);
  });
};

exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  StuSession.updateById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Student with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Customer with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.validate = (method) => {
  switch (method) {
    case 'createSession' : {
      return [
        body('firstname','first name is required').notEmpty(),
        body('lastname','last name is required').notEmpty(),
        body('email', 'email is required').notEmpty(),
        body('email', 'please enter correct email').isEmail(),
      ]
    }
  }
}