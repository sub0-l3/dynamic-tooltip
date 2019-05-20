function insertBreakAtPoint(e) {
  e.preventDefault();
  var range;
  var textNode;
  var offset;

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
  console.log(range);
  console.log(textNode);
  console.log(offset);
}
