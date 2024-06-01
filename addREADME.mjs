export function addREADME(dockerName,promptName) {
  return (`# ${dockerName.split("/")[1].split(":")[0]}
To create your lilypad workflow use the command above
creatad using [createlilypadconfyui](https://github.com/lucasespinosa28/createlilypadconfyui).
## To build
\`\`\`bash
docker build . -f Dockerfile -t ${dockerName} --target runner
\`\`\`
## To run
\`\`\`bash
docker run -it --gpus all -v $PWD/outputs:/outputs -e PROMPT="${promptName}"
\`\`\`
## To publish
\`\`\`bash
docker push ${dockerName}
\`\`\`
## To run your worklow at lilypad
\`\`\`bash
export WEB3_PRIVATE_KEY=<walletprivatekey>
lilypad run <this github repo:realease tag> -i Prompt="${promptName}"
\`\`\`
`);
}
