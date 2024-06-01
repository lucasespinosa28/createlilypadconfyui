import { readFileSync, writeFileSync } from "fs";
import { dockfile } from "./dockfile.mjs";
import { entrypoint } from "./entrypoint.mjs";

const workflow = "./workflow.json";
const jsonString = readFileSync(workflow, "utf8");
const json = JSON.parse(jsonString);

const pythonEntry = {
  checkpoint: "",
  defaultPrompt: "",
  promptNode: "",
  latent: "",
  ksampler: "",
  saveImage: "",
};
const dockerEntry = {
  checkpoint: "",
  embeddings: "",
  lora: "",
  customNode: "",
};

for (const key in json) {
  console.log(json[`${key}`].class_type);
  let firstPromt = true;
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
//https://github.com/TinyTerra/ComfyUI_tinyterraNodes

//https://github.com/TinyTerra/ComfyUI_tinyterraNodes.git
function clearNode(node) {
  let url = node.replace(".git", "");
  let name = url.split("/");
  name = name[name.length - 1];
  return { url, name };
}

let nodes =
  "https://github.com/Tropfchen/ComfyUI-Embedding_Picker.git";
function addCustomNode(listNodes) {
  let customNode =  "";
  let array = listNodes.replace(/\.git/g, "").split(" ");
  console.log(array);
  for (let index = 0; index < array.length; index++) {
    let data = clearNode(array[index]);
    customNode += `RUN git clone ${data.url} app/ComfyUI/custom_nodes/${data.name}\n`;
  }
  return customNode;
}

// huggingface-cli download runwayml/stable-diffusion-v1-5 v1-5-pruned-emaonly.ckpt --local-dir .

let embeddings =
  "AsciiP/DeepNegative:ng_deepnegative_v1_75t.pt AsciiP/DeepNegative:ng_deepnegative_v1_75t.pt AsciiP/DeepNegative:ng_deepnegative_v1_75t.pt";
//ADD EarthAnimix-Neg-neg.pt /app/ComfyUI/models/embeddings/EarthAnimix-Neg-neg.pt

function addEmbeddings(listEmbeddings) {
  let array = listEmbeddings.split(" ");
  let embeddingsDocker = "";
  let embeddingsHuggingface = [];
  for (let index = 0; index < array.length; index++) {
    embeddingsHuggingface[index] = `huggingface-cli download ${array[index].split(":")[0]} ${array[index].split(":")[1]} --local-dir .`;
    
  }
  for (let index = 0; index < array.length; index++) {
    embeddingsDocker += `ADD ${
      array[index].split(":")[1]
    } app/ComfyUI/embeddings/${array[index].split(":")[1]}\n`;
  }
  return {embeddingsDocker,embeddingsHuggingface}
}

function addLora(listLora) {
  let loraDocker = `ADD ${listLora.split(":")[1]} app/ComfyUI/Lora/${listLora.split(":")[1]}\n`;
  let loraHuggingface = `huggingface-cli download ${listLora.split(":")[0]} ${listLora.split(":")[1]} --local-dir .`
  return {loraDocker,loraHuggingface}
}

dockerEntry.customNode = addCustomNode(nodes);
dockerEntry.embeddings = addEmbeddings(embeddings).embeddingsDocker;
dockerEntry.lora = addLora("AsciiP/DeepNegative:ng_deepnegative_v1_75t.pt").loraDocker;
writeFileSync("./entrypoint.py", entrypoint(pythonEntry), { flag: "w" });
writeFileSync("./dockerfile.py", dockfile(dockerEntry), { flag: "w" });

