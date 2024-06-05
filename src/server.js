const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    // eslint-disable-next-line max-len
    // This special IP address ('0.0.0.0') means "all IPv4 addresses on the local machine".This is typically used
    // in production environments, when application needs to be accessible from the outside world.
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();

  console.log(`Server running on ${server.info.uri}`);
};

init();
