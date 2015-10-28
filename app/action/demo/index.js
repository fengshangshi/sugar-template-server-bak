exports.config = {};

exports.get = function(req, res) {
	res.send('Hollo, S(uper) Sugar!');
};

exports.post = function(req, res) {
	res.send('哇塞，你居然POST我!');
};
