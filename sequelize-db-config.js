const yaml = require('js-yaml');
const { readFileSync } = require('fs');
const { join } = require('path');

const dir = process.cwd();
const filename = 'config.yaml';
const rawConfig = yaml.load(readFileSync(join(dir, filename), 'utf8'));

module.exports = rawConfig.database;
