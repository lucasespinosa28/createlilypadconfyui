# createlilypadconfyui
cli app to help create [lilypad job module](https://docs.lilypad.tech/lilypad/lilypad-milky-way-reference/build-a-job-module) using comfyui workflow.
## How to use example

1 - Create a new github for your module

2 - add or save your custom comfy ui workflow in a folder with cloned github repo
![Captura de tela_2-6-2024_143155_127 0 0 1](https://github.com/lucasespinosa28/createlilypadconfyui/assets/52639395/e6811a93-744b-419e-aaaf-8cda326d8de3)

3 - open the terminal an run de command
```bash
npx createlilypadconfyui workflow $pwd/workflow_api.jsonsh
```
4 - anser the question about workflow
```bash
? What huggingface repo for you checkpoint with name "ckpt/OrangeMixs":
? What huggingface repo for you VAE with name "vae-ft-mse-840000-ema-pruned.safetensors":
? Does your workarflow have embeddings? no
? Does your workarflow have custom confyui nodes? no
? Name for your docker image,<dockerUser/name:tag>
```

5 - the app will build your docker image, but your yet neet do publish or run a test
6 - git push the your local module, in github add a tag
6 - run lilypad with repo tag exemple, <github.com/YOUR_USER/REPO_NAME:TAG
