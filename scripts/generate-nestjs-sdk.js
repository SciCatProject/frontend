/**
 * NOTE: This file contains commands that generate new typescript-angular sdk against the running scicat backend
 * which overwrites the node_modules/@scicatproject/scicat-sdk-ts-angular for development purpose
 * It should NOT be used in production because the real (@scicatproject/scicat-sdk-ts-angular) npm package will be installed and used.
 */

const execSync = require("child_process").execSync;
const os = require("os");

function isWindows() {
  return os.platform() === "win32";
}

function getCurrentDirectory() {
  if (isWindows()) {
    return "%cd%";
  }

  return "$(pwd)";
}

if (isWindows()) {
  // NOTE: First do some cleanup before starting the generation
  console.log("Cleanup old files...");
  execSync(
    "rm -rf node_modules/@scicatproject/scicat-sdk-ts-angular && rm -rf @scicatproject/scicat-sdk-ts-angular",
    { encoding: "utf-8" },
  );

  console.log("Generating the new sdk...");
  /**
   * NOTE: parameter --skip-validate-spec is passed to avoid some errors like not supporting the "content" in the @ApiQuery() parameter that we use in the dataset v4 controller.
   * This should not be a risk as after the generation we can get a feedback immediately if something is broken here when we run and test the frontend.
   */

  const backendUrl = process.env.BACKEND_URL ?? "http://host.docker.internal:3000";
  const backendHost = new URL(backendUrl).hostname;
  const sdkMountPath = process.env.SDK_MOUNT_PATH ?? getCurrentDirectory();
  const generationOutput = execSync(
    `docker run --rm --add-host ${backendHost}:host-gateway -v "${sdkMountPath}:/local" openapitools/openapi-generator-cli:v7.13.0 generate -i ${backendUrl}/explorer-json -g typescript-angular -o local/@scicatproject/scicat-sdk-ts-angular --additional-properties=ngVersion=19.0.0,npmName=@scicatproject/scicat-sdk-ts-angular,supportsES6=true,withInterfaces=true,paramNaming=original,modelPropertyNaming=original,enumPropertyNaming=original --skip-validate-spec`,
    { encoding: "utf-8" },
  );
  console.log(generationOutput);

  console.log("Installing dependencies and building the sdk...");
  const installBuildOutput = execSync(
    "cd @scicatproject/scicat-sdk-ts-angular && npm install && npm run build",
    { encoding: "utf-8" },
  );
  console.log(installBuildOutput);

  console.log("Copying the build files in node_modules...");
  const copyToNodeModulesOutput = execSync(
    "cp -r @scicatproject/scicat-sdk-ts-angular/dist node_modules/@scicatproject/scicat-sdk-ts-angular",
    { encoding: "utf-8" },
  );
  console.log(copyToNodeModulesOutput);

  console.log("Final cleanup...");
  execSync("rm -rf @scicatproject", {
    encoding: "utf-8",
  });

  console.log("Local SDK generation completed");
} else {
  if (process.getuid && process.getuid() === 0) {
      execSync('. ./scripts/generate-nestjs-sdk.bash', { stdio: 'inherit' });
  } else {
    console.log("Your environment is a linux/unix");
    console.log("Please run the following command on your terminal:");
    console.log("> sudo -E ./scripts/generate-nestjs-sdk.bash");
    console.log("");
    console.log(
      "IMPORTANT: the script runs under sudo. You will be asked your password.",
    );
    console.log("");
  }
}
