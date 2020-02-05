# Jupyter Invalidation

Invalidation for Juptyer notebook cells: a hook to run code when cell output is overwritten or deleted by a notebook event like reexecution or cell deletion.

What versions of Jupyter Notebooks does it work with? Who knows!
Does it work with JupyterLab? I doubt it!


Adds a global function to the window object called `onCellReexecuteOrDelete()`.

Render an HTML element in a cell output and call this function on it along with a cleanup function you'd like to run when that cell is:
* reexecuted, replacing the output - function will be called with the string "cell reexecute"
* deleted, removing the output - function will be called with the string "cell delete"

Here's an example:

~~~
%%html
<div id="wheeeee">
hello
</div>

<script>
onCellReexecuteOrDelete(document.getElementById('wheeeee'), (reason) => console.log("cleanup because", reason))
</script>

~~~
