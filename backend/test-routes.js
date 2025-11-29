/**
 * Test script to verify all routes are properly loaded
 */

console.log('🧪 Testing route imports...\n');

const routes = [
  { name: 'auth.routes', path: './routes/auth.routes' },
  { name: 'event.routes', path: './routes/event.routes' },
  { name: 'student.routes', path: './routes/student.routes' },
  { name: 'mentor.routes', path: './routes/mentor.routes' },
  { name: 'connection.routes', path: './routes/connection.routes' },
  { name: 'notification.routes', path: './routes/notification.routes' },
  { name: 'search.routes', path: './routes/search.routes' },
];

let allPassed = true;

routes.forEach(route => {
  try {
    require(route.path);
    console.log(`✅ ${route.name} - OK`);
  } catch (error) {
    console.error(`❌ ${route.name} - FAILED:`, error.message);
    allPassed = false;
  }
});

console.log('\n🧪 Testing controllers...\n');

const controllers = [
  { name: 'mentor.controller', path: './controllers/mentor.controller' },
  { name: 'connection.controller', path: './controllers/connection.controller' },
  { name: 'notification.controller', path: './controllers/notification.controller' },
  { name: 'search.controller', path: './controllers/search.controller' },
];

controllers.forEach(controller => {
  try {
    require(controller.path);
    console.log(`✅ ${controller.name} - OK`);
  } catch (error) {
    console.error(`❌ ${controller.name} - FAILED:`, error.message);
    allPassed = false;
  }
});

console.log('\n🧪 Testing services...\n');

const services = [
  { name: 'mentor.service', path: './services/mentor.service' },
  { name: 'connection.service', path: './services/connection.service' },
  { name: 'notification.service', path: './services/notification.service' },
];

services.forEach(service => {
  try {
    require(service.path);
    console.log(`✅ ${service.name} - OK`);
  } catch (error) {
    console.error(`❌ ${service.name} - FAILED:`, error.message);
    allPassed = false;
  }
});

console.log('\n🧪 Testing repositories...\n');

const repositories = [
  { name: 'mentor.repository', path: './repositories/mentor.repository' },
  { name: 'connection.repository', path: './repositories/connection.repository' },
  { name: 'notification.repository', path: './repositories/notification.repository' },
];

repositories.forEach(repo => {
  try {
    require(repo.path);
    console.log(`✅ ${repo.name} - OK`);
  } catch (error) {
    console.error(`❌ ${repo.name} - FAILED:`, error.message);
    allPassed = false;
  }
});

console.log('\n🧪 Testing main routes index...\n');

try {
  const mainRoutes = require('./routes/index.js');
  console.log('✅ routes/index.js - OK');
} catch (error) {
  console.error('❌ routes/index.js - FAILED:', error.message);
  allPassed = false;
}

if (allPassed) {
  console.log('\n✅ All routes loaded successfully!');
  process.exit(0);
} else {
  console.log('\n❌ Some routes failed to load. Check errors above.');
  process.exit(1);
}




