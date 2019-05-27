const toolTipDimensions = {
  width: 200,
  height: 150
};

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
      target.classList.contains("has-tooltip") ||
      !(textNode.nodeType === 3)
    )
      return;

    if (document.querySelector(".has-tooltip"))
      document.querySelector(".has-tooltip").classList.remove("has-tooltip");

    textNode.parentElement.classList.add("has-tooltip");

    let toolTipText = `${
      textNode.textContent
    }: Tony Montana and his close friend Manny, build a strong drug empire in Miami. However as his power begins to grow, so does his ego and his enemies...`;
    let toolTipElement = document.getElementById("tool-tip");
    toolTipElement.innerHTML = toolTipText;
    toolTipElement.style.width = `${toolTipDimensions.width}px`;
    toolTipElement.style.height = `${toolTipDimensions.height}px`;
    toolTipElement.style.display = "block";

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
      left: coordXY.left - coordXYContainer.left,
      right: coordXYContainer.right - coordXY.right,
      top: coordXY.top - coordXYContainer.top,
      bottom: coordXYContainer.bottom - coordXY.bottom
    };

    if (spaceObj.left >= spaceObj.right) {
      toolTipElement.style.left = `${spaceObj.left -
        (toolTipDimensions.width + coordXY.width)}px`;
    } else {
      toolTipElement.style.left = `${spaceObj.left + coordXY.width}px`;
    }

    if (spaceObj.top >= spaceObj.bottom) {
      toolTipElement.style.top = `${spaceObj.top -
        (toolTipDimensions.height + coordXY.height)}px`;
    } else {
      toolTipElement.style.top = `${spaceObj.top + coordXY.height}px`;
    }
  },
  false
);
