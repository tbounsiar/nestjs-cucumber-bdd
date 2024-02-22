let common = [
  'test/bdd/feature/**/*.feature', // Specify our feature files
  '--require-module ts-node/register', // Load TypeScript module
  '--require test/bdd/step/**/*.ts', // Load step definitions
  '--format progress-bar', // Load custom formatter
  '--format @cucumber/pretty-formatter',
  '--format html:test/bdd/report/cucumber.html',
  `--format-options '{"snippetInterface": "synchronous"}'`
].join(' ');

module.exports = {
  default: common,
};
