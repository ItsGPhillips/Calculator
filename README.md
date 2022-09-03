# Calculator Project

![screenshot](https://github.com/ItsGPhillips/Calculator/blob/main/resources/calculator-screenshot.png)

> Functioning calulator built **without** using [eval()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval).

The UI is built using [Next.js](https://nextjs.org/) and [typescript](https://www.typescriptlang.org/)

## Implementation
<ol>
    <li>Button clicks post a command to a command queue.</li>
    <li>The queue is parsed into an AST correctly applying precidence rules.</li>
    <li>The resulting AST is passed to a custom built evaluator to obtain the result</li>
</ol>

## Details
<ul>
   <li>Use of React Context Hooks and HOC providers</li>
   <li>Styling implimentated using <a href="https://styled-components.com/">Styled Components</a> and <a href="https://www.framer.com/motion/">Framer Motion</a></li>
</ul>
