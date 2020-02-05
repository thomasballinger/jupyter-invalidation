# Jupyter Invalidation

Invalidation for Juptyer notebook cells: a hook to run code when cell output is overwritten or deleted by a notebook event like reexecution or cell deletion.

What versions of Jupyter Notebooks does it work with? Who knows!
Does it work with JupyterLab? I doubt it!

## Limitations
(it would be nice to fix these)

* If the script tag that loads this script appears in the same `%%html` magic cell as the call to the function, unfortunately the function will be called before the script loads.
* Requires a DOM element to deduce which cell the invalidation is for. It would be nice not to need this.

## Use

Adds a global function to the window object called `onCellReexecuteOrDelete()`.

Render an HTML element in a cell output and call this function on it along with a cleanup function you'd like to run when that cell is:
* reexecuted, replacing the output - function will be called with the string "cell reexecute"
* deleted, removing the output - function will be called with the string "cell delete"

Here's an example. In an earlier cell in a notebook, load this script:

~~~
%%html
<script src="https://unpkg.com/jupyter-invalidation/index.js"></script>
~~~

Then in later cells that use resources you'd like free up, call this function.

~~~
%%html
<div id="wheeeee">
hello
</div>

<script>
function myCleanupFunction(reason) {
  console.log("cleanup because", reason);
  // clean up resoures here
  clearTimeout(myTimer);
  window.removeEventListener('mousedown', myMousedownCallbackFunction);
}
onCellReexecuteOrDelete(document.getElementById('wheeeee'), myCleanupFunction);
</script>
~~~
