JS Import Compiler
==============

JS Import Compiler is a node.js application that looks for dependencies recursively in the source file and
 resolves them in the destination file. It feels like require/include statement in PHP.

STATUS: 0.1.0


## Usage

Define dependencies in your code
```
var foo = $import("./path/filename");
```

Compile the source file
```
node ../../jsic.js main.js ../../build/main.js
```