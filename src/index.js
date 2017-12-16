import restify from 'restify';
import oracledb from 'oracledb';
import config from '../config.js';
import routes from './routes';


let server = restify.createServer({
  name: config.name,
  version: config.version,
  url: config.hostname
});

const connAttr = {
  "user": config.user,
  "password": config.password,
  "connectString": config.connectString
}

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.listen(config.port, () => {
  console.log('%s listening at %s', server.name, server.url);
});

// Routes to Function Assaignment
server.get('/roullet', routes.roulette.get);
/*
server.get('/api/todos', routes.todo.get);
server.post('/api/todos', routes.todo.post);
server.del('/api/todos/:id', routes.todo.del);
*/