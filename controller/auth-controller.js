const UserModel = require('../model/user-model');

exports.signup = async (req, res, next) => {
  try {
    const user = await UserModel.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      role: req.body.role,
      gender: req.body.gender,
      'location.type': req.body.location.type,
      'location.coordinates': req.body.location.coordinates,
      'location.street': req.body.location.street,
      'location.city': req.body.location.city,
      'location.zipcode': req.body.location.zipcode,
      'location.country': req.body.location.country,
      'name.firstName': req.body.name.firstName,
      'name.lastName': req.body.name.lastName,
    });

    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
