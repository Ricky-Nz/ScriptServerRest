module.exports = function() {
  return function(err, req, res, next) {
  	console.log(2222);
    err = req.app.buildError(err);
    next(err);
  };
};
