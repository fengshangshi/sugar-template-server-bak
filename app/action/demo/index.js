exports.config = {
	get: {
		url: '/demo_url',
		auto: true
	 },
	 
	post: {
		url: '/home'
	}
};

exports.get = function(req, res) {
	res.send('Hollo, S(uper) Sugar!');
};

exports.post = function(req, res) {
	res.send('哇塞，你居然POST我!');
};
