(function () { 'use strict';

  function copyStyle (srcEl, destEl) {
    if (!srcEl || !destEl) return;

    var srcStyles = document.defaultView.getComputedStyle(srcEl,null);
    destEl.style.cssText = srcStyles.cssText;
  }

  function elementToHtml (element) {
    var tmp = document.createElement("div");
    tmp.appendChild(element);
    return tmp.innerHTML;
  }

  function exportElementWithStyles (srcEl) {

    if (!srcEl) return null;

    var cloneEl = srcEl.cloneNode(true);

    var cloneWalker = document.createTreeWalker(cloneEl, NodeFilter.SHOW_ELEMENT, null, null),
      srcWalker = document.createTreeWalker(srcEl, NodeFilter.SHOW_ELEMENT, null, null);

    var iterSrc = srcWalker.currentNode,
      iterClone = cloneWalker.currentNode;

    while (iterSrc && iterClone) {
      copyStyle(srcWalker.currentNode, cloneWalker.currentNode);

      cloneWalker.currentNode.removeAttribute('class');
      cloneWalker.currentNode.removeAttribute('id');

      iterSrc = srcWalker.nextNode();
      iterClone = cloneWalker.nextNode();
    }

    return elementToHtml(cloneEl);
  }

  function appendAfter (element, newElement) {
    if (element.nextSibling) {
      element.parentNode.insertBefore(newElement, element.nextSibling);
    }
    else {
      element.parentNode.appendChild(newElement);
    }
  }

  window.JSBridge = function (element) {
    var html = exportElementWithStyles(element);

    var iframeEl = document.createElement('iframe');
    iframeEl.setAttribute('src', 'index.html');
    iframeEl.style.cssText = 'display: block; border: 0;';

    iframeEl.onload = function () {
      iframeEl.contentWindow.postMessage(html, '*');
    };


    appendAfter(element, iframeEl);
    element.style.display = 'none !important';
    //element.parentNode.replaceChild(iframeEl, element);

  }

})();
