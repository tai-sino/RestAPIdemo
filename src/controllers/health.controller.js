const { getDatabaseHealth } = require('../db/sqlite');
const { sendSuccess } = require('../utils/response');

function healthController(_req, res) {
  return sendSuccess(res, 'Service healthy', {
    app: 'ok',
    db: getDatabaseHealth(),
  });
}

module.exports = {
  healthController,
};
