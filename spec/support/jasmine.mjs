export default {
  spec_dir: "src/tests",          // 👈 point to your test folder
  spec_files: ["**/*[sS]pec.ts"],
  helpers: ["helpers/reporter.ts"], // 👈 relative to spec_dir
  requires: ["ts-node/register"],
  env: {
    random: true,
    stopSpecOnExpectationFailure: false
  }
};