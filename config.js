var config = {
	debug: 0,
	host: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
	port: {
		http: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 80,
		ws: 8000
	}
};

module.exports = config;
