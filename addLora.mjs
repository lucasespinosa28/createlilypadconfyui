export function addLora(urlLore,loraName) {
    //curl -o ${}  https://www.digitalocean.com/robots.txt
    //curl -o ${listLora.split(":")[1]}  --create-dirs -O --output-dir app/ComfyUI/Lora/ ${listLora.split(":")[0]}
    // curl -o ${listLora.split(":")[2]}  ${listLora.split(":")[0]}:${listLora.split(":")[1]} && mv ${listLora.split(":")[2]} app/ComfyUI/Lora/
    let loraDocker = `RUN cd /app/ComfyUI/models/loras/ && curl -o ${loraName}  ${urlLore}\n`;
    return { loraDocker };
}
