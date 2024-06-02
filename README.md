# createlilypadconfyui
cli app to help create [lilypad job module](https://docs.lilypad.tech/lilypad/lilypad-milky-way-reference/build-a-job-module) using comfyui workflow.
```bash
npx createlilypadconfyui workflow $pwd/workflow_api.jsonsh
```
```bash
? What huggingface repo for you checkpoint with name "ckpt/OrangeMixs":
? What huggingface repo for you VAE with name "vae-ft-mse-840000-ema-pruned.safetensors":
? Does your workarflow have embeddings? no
? Does your workarflow have custom confyui nodes? no
? Name for your docker image,<dockerUser/name:tag>
```
