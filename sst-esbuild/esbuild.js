const fs = require('fs');

const getCopyFunction =
  (files = {}) =>
  async () => {
    // const operations = Object.entries(files).map(([target, source]) =>
    //   cp(source, target)
    // );
    // await Promise.all(operations);
    //console.log("************** getCopyFunction");
  };

const afterFunction =
  (out = {}) =>
  async (e) => {
    // const operations = Object.entries(files).map(([target, source]) =>
    //   cp(source, target)
    // );
    // await Promise.all(operations);
    //console.log("AFTER", out);

    // fs.appendFileSync(
    //   out,
    //   "\nconsole.log('*************** INJECTED ***************')"
    // );

    const data = fs.readFileSync(out, 'utf8');
    //console.log(data);
  };

const copyFilePlugin = ({ before, after }) => ({
  name: 'copyFile',
  async setup(build) {
    //console.log("************** before: " + before);
    //console.log("BUILD ", build);
    const out = build.initialOptions.outfile;

    //before && build.onStart(getCopyFunction(before));
    //after && build.onEnd(getCopyFunction(after));
    build.onEnd(afterFunction(out));
  },
});

console.log('**************** DELA *****************');

module.exports = [
  copyFilePlugin({
    before: {
      // copy before bundling
      './assets/favicon.png': './media/images/favicon.png',
    },
    after: {
      // copy after bundling
      './logs/build-report.json': './dist/report.json',
    },
  }),
];
