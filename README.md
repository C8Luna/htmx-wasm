# HTMX-WASM

HTMX-WASM is an example programn of using HTMX with WebAssembly.
Wasm-bindgen is used to generate the bindings between Rust and JavaScript.
The Rust code is compiled to WebAssembly and is used to perform the calcs.
The results are then sent back to the client using HTMX.

This example uses the [EvalExpr](https://crates.io/crates/evalexpr) crate to perform the calculation.
It can be anything in your WASM.  

## Running the example

Run the build.sh from project root. It will build the Wasm, copy files to the dist folder and start the server.

```bash
./build.sh
```
Open localhost:8080 enter an expression: ```2+5``` then tab out

The result should display

## Notes

The wasm is being loaded here in the `index.js` and reexporting the expr_eval. 

```js
import init, {  expr_eval } from './wasm/htmx_wasm.js'; 
export const wasmReady = (
  async () => { 
    await init();})
();

export { expr_eval };
```


You can see the wasm init here in the module in the `index.html` file. You can
also see the HTMX event being captured. You could easily push this to the server by
or use both. The idea is not caring from the UI what is serving the response, you
can decide later to do this on the server or even use the server until the wasm is 
initialized

```js
<script type="module">
        import * as wasm from './index.js';
        document.body.addEventListener('htmx:beforeRequest', function (event) {
          if (event.detail.pathInfo.requestPath === '/calculate') {
              event.preventDefault();
              const source = event.target || event.srcElement;
              const target = document.querySelector(source.getAttribute('hx-target'));
              let expression =source.value;// document.getElementById('expressionInput').value;
                const expr = expression;
                wasm.wasmReady.then(() => {
                    let result;
                    try {
                        result = wasm.expr_eval(expr);
                        result = result.toString();
                    } catch (error) {
                        result = "Error: " + error.message;
                    }
                    target.innerHTML = result;
                });
          }
        });
    </script>

```
The `build.sh` does the wasm-pack and targets web.
```bash
#!/usr/bin/env bash
wasm-pack build --target web
...
```

It also runs a symple python webserver. You could use whatever, it is just easy and flexible
```bash
if [ "$1" != "noserve" ]; then
	echo "Starting server"
	python3 -m http.server -d ./dist/www 8080
fi
```

