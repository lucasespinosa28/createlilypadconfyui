function clearNode(node) {
    let url = node.replace(".git", "");
    let name = url.split("/");
    name = name[name.length - 1];
    return { url, name };
  }

export function addCustomNode(listNodes) {
    let customNode = "";
    let array = listNodes.replace(/\.git/g, "").split(" ");
    for (let index = 0; index < array.length; index++) {
        let data = clearNode(array[index]);
        customNode += `RUN git clone ${data.url} app/ComfyUI/custom_nodes/${data.name}\n`;
    }
    return customNode;
}
