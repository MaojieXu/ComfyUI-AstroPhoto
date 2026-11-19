const path = require('node:path');
const frontend = path.resolve(__dirname, '../../../../../frontend');
const current = require(path.join(frontend, 'jest.config.cjs'));
module.exports = {
  ...current,
  rootDir: frontend,
  moduleNameMapper: {
    ...current.moduleNameMapper,
    '\\.css$': path.join(__dirname, 'audit-empty-css.cjs')
  }
};
