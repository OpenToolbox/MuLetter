var config = {
	debug: 0,
	host: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
	port: {
		http: process.env.OPENSHIFT_NODEJS_PORT || 8080,
		ws: 8000,
		sendmail: 587
	}
};

module.exports = config;
