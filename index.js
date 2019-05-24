function init() {
  contentEl = document.getElementById("storyReader");
  if (!contentEl.classList.contains("is-spanified")) {
    contentEl.classList.add("is-spanified");
    setTimeout(() => getLeafNodes(contentEl), 1000);
  }
}

function getLeafNodes(node) {
  if (!node.hasChildNodes()) {
    // nodeType 3 indicates Text node
    if (node.nodeType === 3 && node.wholeText.trim() !== "") {
      let text = node.wholeText;
      let newNode = document.createElement("span");
      newNode.innerHTML = wrapWords(text);
      let parentNode = node.parentNode;
      // Bail out if already comment is attached
      if (parentNode.classList.contains("has_comments")) {
        return;
      }
      parentNode.insertBefore(newNode, node);
      parentNode.removeChild(node);
    }
    return;
  } else {
    node.childNodes.forEach(childNode => getLeafNodes(childNode));
  }
}

function wrapWords(str) {
  return str.replace(/(\S+\s*)/g, "<span>$&</span>");
}

function insertBreakAtPoint(e) {}

document.addEventListener(
  "click",
  function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement,
      textNode = target.firstChild;
    e.preventDefault();
    if (
      !(target.nodeType === 1 && target.nodeName === "SPAN") ||
      target.classList.contains("tooltip") ||
      !(textNode.nodeType === 3)
    )
      return;

    textNode.parentElement.classList.add("tooltip");

    let para = document.createElement("span");
    let node = document.createTextNode(
      `--------------${
        textNode.textContent
      }-------------Tony Montana and his close friend Manny, build a strong drug empire in Miami. However as his power begins to grow, so does his ego and his enemies, and his own paranoia begins to plague his empire...`
    );
    para.appendChild(node);
    para.className = "tooltiptext";
    textNode.parentElement.appendChild(para);

    // coordinates of span element
    let coordXYContainer = document
      .getElementById("storyReader")
      .getBoundingClientRect();
    let coordXY = textNode.parentElement.getBoundingClientRect();
    document.getElementById("coordinates").innerHTML = `Top: ${
      coordXY.top
    }, Left: ${coordXY.left}, Bottom: ${coordXY.bottom}, Right: ${
      coordXY.right
    }`; // coordinates is id in HTML doc
    document.getElementById(
      "coordinates-container"
    ).innerHTML = `Top: ${coordXY.top -
      coordXYContainer.top}, Left: ${coordXY.left -
      coordXYContainer.left}, Bottom: ${coordXYContainer.bottom -
      coordXY.bottom}, Right: ${coordXYContainer.right - coordXY.right}`;
    let spaceObj = {
      top: coordXY.top - coordXYContainer.top,
      left: coordXY.left - coordXYContainer.left,
      bottom: coordXYContainer.bottom - coordXY.bottom,
      right: coordXYContainer.right - coordXY.right
    };
    const maxSpace = Math.max(...Object.values(spaceObj));
    let maxProp = Object.entries(spaceObj).filter(e => e[1] === maxSpace)[0];
    // console.log(maxSpace)
    //TODO: width and height of textNode (coordXY) to be taken into consideration

    let popup = textNode.nextElementSibling;
    popup.classList.add(`show-on-${maxProp[0]}`);
    // if (maxProp[0] == "left") {
    //   popup.setAttribute("style", "color: green;");
    // }
  },
  false
);
