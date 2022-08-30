const { awscdk } = require('projen');

const cdkVersion = '2.37.0';

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion,
  defaultReleaseBranch: 'main',
  name: 'serverless-spy-test-e2e',
  eslint: false,
  packageManager: 'npm',

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();
