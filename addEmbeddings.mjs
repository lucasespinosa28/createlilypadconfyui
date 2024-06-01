export function addEmbeddings(listEmbeddings) {
    let array = listEmbeddings.split(" ");
    let embeddingsDocker = "";
    for (let index = 0; index < array.length; index++) {
        embeddingsDocker += `RUN huggingface-cli download --repo-type dataset  ${array[index].split(":")[0]} ${array[index].split(":")[1]} --local-dir /app/ComfyUI/embeddings/\n`;
    }
    return { embeddingsDocker };
}
