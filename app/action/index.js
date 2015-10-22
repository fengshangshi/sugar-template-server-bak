exports.config = {
	get: {
		url: '/huguoyun',
		auto: true
	 },
	 
	post: {
		url: '/fdsfdf'
	}
};

exports.get = function(req, res) {
	res.send('我不好，胡国云');
};

exports.post = function(req, res) {
	res.send('胡国云，你好');
};
