#!/usr/bin/env node
import "zx/globals";
import { input, confirm } from "@inquirer/prompts";
import { readFileSync, writeFileSync, unlinkSync, existsSync, write } from "fs";
import { dockfile } from "./dockfile.mjs";
import { entrypoint } from "./entrypoint.mjs";
import { addEmbeddings } from "./addEmbeddings.mjs";
import { addCustomNode } from "./addCustomNode.mjs";
import { addLora } from "./addLora.mjs";
import { cwd } from "node:process";
import { createTemaplate } from "./createTemaplate.mjs";
import { Command } from "commander";
import { addREADME } from "./addREADME.mjs";
import { dockerEntry } from "./dockerEntry.mjs";
import { pythonEntry } from "./pythonEntry.mjs";
const program = new Command();

program
  .name("createlilypadconfyui")
  .description("CLI to convert your confyui to run at lilypad")
  .version("0.0.1");

program
  .command("workflow")
  .description("parse your confyui workflow to create your module")
  .argument("<string>", "Path of your confyui workflow");

const path = process.cwd();
const workflow = program.parse().args[1];
const jsonString = readFileSync(workflow, "utf8");
if (existsSync(workflow))
  writeFileSync(path + "/workflow.json", jsonString, { flag: "w" });
const json = JSON.parse(jsonString);
let firstPromt = true;

for (const key in json) {
  switch (json[`${key}`].class_type) {
    case "CheckpointLoaderSimple":
      let checkpoint = json[`${key}`].inputs["ckpt_name"]
        .replace(/\\/g, ",")
        .split(",");
      dockerEntry.checkpoint = checkpoint[checkpoint.length - 1];
      pythonEntry.checkpoint = key;
      break;
    case "CLIPTextEncode":
      if (firstPromt) {
        pythonEntry.promptNode = key;
        pythonEntry.defaultPrompt = json[`${key}`].inputs.text;
        firstPromt = false;
      }
      break;
    case "EmptyLatentImage":
      pythonEntry.latent = key;
      break;
    case "KSampler":
      pythonEntry.ksampler = key;
      break;
    case "SaveImage":
      pythonEntry.saveImage = key;
      break;
    case "LoraLoader":
      dockerEntry.lora = json[`${key}`].inputs.lora_name;
      break;
  }
}
if (existsSync(path + "/entrypoint.py")) unlinkSync(path + "/entrypoint.py");
writeFileSync(path + "/entrypoint.py", entrypoint(pythonEntry), { flag: "w" });
if (existsSync(path + "/entrypoint.py"))
  console.log("entrypoint.py was created!");
console.log(cwd());

const huggingfaceCheckpointRepo = await input({
  message: `What huggingface repo for you checkpoint with name ${dockerEntry.checkpoint}:`,
});
dockerEntry.checkpointRepo = huggingfaceCheckpointRepo;

let question = await confirm({
  message: "Does your workarflow have embeddings?",
});
if (question) {
  const embeddings = await input({
    message:
      "add a list embeddings with huggingface <repo:file> and space beetween list:",
  });
  dockerEntry.embeddings = addEmbeddings(embeddings).embeddingsDocker;
}
question = await confirm({
  message: "Does your workarflow have custom confyui nodes?",
});
if (question) {
  const customNode = await input({
    message:
      "add a list custom nodes confy with github <repo> and space beetween list:",
  });
  dockerEntry.customNode = addCustomNode(customNode);
}

if (dockerEntry.lora) {
  const lora = await input({
    message: `add link to download for the LoRA ${dockerEntry.lora}`,
  });
  9;
  dockerEntry.lora = addLora(lora, dockerEntry.lora).loraDocker;
}

writeFileSync(path + "/dockerfile", dockfile(dockerEntry), { flag: "w" });

const dockerName = await input({
  message: "Name for your docker image,<dockerUser/name:tag>",
});

console.log("Now running this docker command");
console.log(`docker build . -f Dockerfile -t ${dockerName} --target runner`);
await $`docker build . -f Dockerfile -t ${dockerName} --target runner`;
console.log();
console.log("To test local run:");
console.log(
  `docker run -it --gpus all -v $PWD/outputs:/outputs -e PROMPT='${pythonEntry.defaultPrompt}' -e STEPS=30 ${dockerName}`
);
console.log();
question = await confirm({
  message: "Want to publish you docker image now?",
});
console.log(`docker push ${dockerName}`);
if (question) {
  const  publish = await $`docker push ${dockerName}`;
  console.log(publish);
}

writeFileSync(path + "/lilypad_module.json.tmpl", createTemaplate(dockerName), {
  flag: "w",
});

writeFileSync(path + "/README.md", addREADME(dockerName, pythonEntry.defaultPrompt), {
  flag: "w",
});
console.log("Now publish it folder to github");
process.exit();
