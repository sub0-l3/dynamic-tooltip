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

function insertBreakAtPoint(e) {
  e.preventDefault();
  let range;
  let textNode;
  let offset;

  if (document.caretPositionFromPoint) {
    // standard
    range = document.caretPositionFromPoint(e.pageX, e.pageY);
    textNode = range.offsetNode;
    offset = range.offset;
  } else if (document.caretRangeFromPoint) {
    // WebKit
    range = document.caretRangeFromPoint(e.pageX, e.pageY);
    textNode = range.startContainer;
    offset = range.startOffset;
  }

  // do whatever you want here!
  // console.log(range);
  // console.log(textNode);
  // console.log(offset);
  textNode.parentElement.classList.add("tooltip");

  let para = document.createElement("span");
  let node = document.createTextNode(`--------------${textNode.textContent}-------------Tony Montana and his close friend Manny, build a strong drug empire in Miami. However as his power begins to grow, so does his ego and his enemies, and his own paranoia begins to plague his empire...`);
  para.appendChild(node);
  para.className = "tooltiptext"
  textNode.parentElement.appendChild(para);

  // coordinates of span element
  let coordXYContainer = document.getElementById("storyReader").getBoundingClientRect()
  let coordXY = textNode.parentElement.getBoundingClientRect()
  document.getElementById('coordinates').innerHTML = `Top: ${coordXY.top}, Left: ${coordXY.left}` // coordinates is id in HTML doc
  document.getElementById('coordinates-container').innerHTML = `Top: ${coordXY.top - coordXYContainer.top}, Left: ${coordXY.left - coordXYContainer.left}` // 
  
}
