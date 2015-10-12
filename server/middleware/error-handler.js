module.exports = function() {
  return function(err, req, res, next) {
    next(err);
  };
};
