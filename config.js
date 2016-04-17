module.exports = {
	host: process.env.HOST || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
	port: process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 5000,
	key: '1234'
};
