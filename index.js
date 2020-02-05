(function() {
  // Find deepest DOM ancestor that does not change on reexecute
  const findParentOutputDiv = el => {
    let candidate = el;
    while (candidate) {
      candidate = candidate.parentElement;
      if (candidate.className === "output") {
        return candidate;
      }
    }
    throw Error("parent output div not found");
  };

  // Find shallowest DOM ancestor that is removed on delete
  const findParentCell = el => {
    let candidate = el;
    while (candidate) {
      candidate = candidate.parentElement;
      if (candidate.classList.contains("cell")) {
        return candidate;
      }
    }
    throw Error("cell not found not found");
  };

  const onCellReexecuteOrDelete = (element, cb) => {
    if (!(element instanceof Elements)) {
      throw TypeError(
        "First argument of onCellReexecuteOrDelete should be a DOM element."
      );
    }
    if (!(cb instanceof "function")) {
      throw TypeError(
        "Second argument of onCellReexecuteOrDelete should be a function."
      );
    }

    const outputDiv = findParentOutputDiv(element);
    const cellDiv = findParentCell(element);
    const notebookContainer = cellDiv.parentElement;
    let onEither = () => {
      throw Error("callback not initialized yet");
    };

    const reexecuteDetector = function(mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          onEither("cell reexecute");
          return;
        }
      }
    };

    const cellDeleteDetector = function(mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          for (let node of mutation.removedNodes) {
            if (node === cellDiv) {
              onEither("cell delete");
              return;
            }
          }
        }
      }
    };

    const outputMutationObserver = new MutationObserver(reexecuteDetector);
    const notebookMutationObserver = new MutationObserver(cellDeleteDetector);

    onEither = reason => {
      outputMutationObserver.disconnect();
      notebookMutationObserver.disconnect();
      cb(reason);
    };

    outputMutationObserver.observe(outputDiv, { childList: true });
    notebookMutationObserver.observe(notebookContainer, { childList: true });
  };

  if (typeof window.onCellReexecuteOrDelete === "undefined") {
    window.onCellReexecuteOrDelete = onCellReexecuteOrDelete;
  }
})();
