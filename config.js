module.exports = {
	debug: 0,
	host: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
	port: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 80,
	key: '1234'	
};
