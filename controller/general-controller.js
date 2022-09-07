const AppError = require('../utils/app-error');
const catchAsync = require('../utils/catch-async');
const Roles = require('../utils/roles');
const StatusCode = require('../utils/status-code');

exports.protectModel = (Model) =>
  catchAsync(async (req, res, next) => {
    // Take Id from the params
    const { id } = req.params;

    // Check if the document exists
    const document = await Model.findById(id);
    if (!document) {
      return next(
        new AppError('No document found with this Id', StatusCode.BAD_REQUEST)
      );
    }

    // Take creatorId and role from the document Object
    const creatorId = document.creator._id.toString();
    const { role, _id: currentUserId } = req.user;

    // Check if the role is admin or document creator has same of currentUser
    if (role === Roles.admin || creatorId === currentUserId.toString())
      return next();

    return next(
      new AppError(
        'Only admin and creator can delete or update a document',
        StatusCode.UNAUTHORIZED
      )
    );
  });
