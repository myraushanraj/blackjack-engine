var User = require('../../models/user');
const uuidv1 = require('uuid/v1');
var randomstring = require('randomstring');



module.exports = {
  // User register

  register: (req, res) => {
    var UUID = uuidv1();
    console.log(3333333333)
    try {
      req.checkBody({
        'name': {
          notEmpty: true,
          isLength: {
            options: [{ min: 2, max: 25 }],
            errorMessage: 'Name too short, must be of atleast 2 and less than 25'
          },
          errorMessage: 'Please enter your name'
        },
        'username': {
          notEmpty: true,
          isLength: {
            options: [{ min: 5, max: 13 }],
            errorMessage: 'Username too short, must be of atleast 5 and less than 13'
          },
          errorMessage: 'Please enter your username'
        },
        'useremail': {
          notEmpty: true,
          errorMessage: 'Please enter your email'
        },
        'mobilenumber': {
          notEmpty: true,
          isNumeric: {
            errorMessage: 'Entered number must be numeric'
          },
          isLength: {
            options: [{ min: 10, max: 10 }],
            errorMessage: 'Please enter a valid phone number'
          },
          errorMessage: 'Please enter your phone number'
        },
        'password': {
          notEmpty: true,
          errorMessage: 'Please enter password '
        },
        'confirmpassword': {
          notEmpty: true,
          errorMessage: 'Please enter confirm password'
        }
      });

      const errors = req.validationErrors();
      if (errors) {
        var errorsMessage = [];
        errors.forEach(function (err) {
          errorsMessage.push(err.msg);
        });

        res.json({
          'status': 'error',
          'msg': errorsMessage[0]
        });
      } else {

        if (req.body.password === req.body.confirmpassword) {
          User.findOne({ $or: [{ 'useremail': req.body.useremail.toLowerCase() }, { 'username': req.body.username.toLowerCase() }] }, (err, user) => {
            if (err) {
              res.json({
                'status': 'error',
                'msg': err
              });
            }
            if (user !== null) {
              res.json({
                'status': 'error',
                'msg': 'user already registered'
              });
            } else {
              var verifyemailtoken = randomstring.generate(64);
              var verifyemailtokenexpiry = Date.now() + 1800000;       //30 minutes
              var register = new User({
                'user_id': UUID,
                'name': req.body.name.toLowerCase(),
                'displayname': req.body.name,
                'username': req.body.username.toLowerCase(),
                'displayusername': req.body.username,
                'useremail': req.body.useremail.toLowerCase(),
                'verifyemailtoken': verifyemailtoken,
                'verifyemailtokenexpiry': verifyemailtokenexpiry,
                'mobilenumber': req.body.mobilenumber,
                'password': req.body.password,
                'created': Date.now()
              });

              register.save((err) => {
                if (err) {
                  res.json({
                    'status': 'error',
                    'msg': 'error encountered'
                  });
                } else {
                  res.json({
                    'status': 'success',
                    'msg': 'Registered Successfully'
                  });
                }
              });
            }
          });
        } else {
          res.json({
            'status': 'error',
            'msg': 'password and confirm passowrd should be same!'
          });
        }
      }
    } catch (e) {
      res.json({
        'status': 'error',
        'msg': e
      });
    }
  }




};

//