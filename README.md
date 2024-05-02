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
export const isReady = (
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

Here we have an element that is marked up with HTMX to request a calculate endpoint and putting the 
result of the calculation in the target. This was the initial approach 
```html
<input type="text" id="expressionInput"  hx-post="/calculate" hx-trigger="change" hx-target="#result">
<div id="result"></div>
```

Now I'm playing with the idea of 'hx-wasm' attribute to automate the steering but looks like a proper
version to consume the request and generate a response will require work in the htmx core.

```html
<input type="text" id="expressionInput" hx-wasm  hx-post="/calculate" hx-trigger="change" hx-target="#result">
<div id="result"></div>
<div id="shopping-list" hx-wasm hx-get="/shopping-list" hx-trigger="load" />
```


The hx-wasm tells the process to run locally. It currently uses the name of the url & passes the source.value to the function of same name (converted to camelCase). 
I need to tap into the htmx xhr so can consume the req and provide a resp to be 'server like' as noted above. Without it the cool merge, header triggers and OOB
are missing. It is promise based to work as expected


```js
  
    <script type="module">
        import * as wasm from './index.js';

	//wire the processing of hx-wasm
        handleLocal();
        wasm.isReady.then(() => {
            console.log("Wasm ready");
        });

	//handle the shopping list request
        function shoppingList(){
            let res=wasm.isReady.then(() => {
              let shoppingListHtml=wasm.gen_list();
              return shoppingListHtml;
            });
            return res;
        }

	//handle the expr evaluation request
        function calculate(expr){
          return wasm.isReady.then(() => {
            let result;
            try {
              result = wasm.expr_eval(expr);
              result = result.toString();
            } catch (error) {
              result = "Error: " + error.message;
            }
            return result;
          });
        }

	//the processing of the local/wasm request
        function handleLocal(){
          document.body.addEventListener('htmx:beforeRequest', function (event) {
            const source = event.target || event.srcElement;
            const hxwasm = source.getAttribute('hx-wasm');
            if (hxwasm!=null){
              const target = document.querySelector(source.getAttribute('hx-target'))||source;
              event.preventDefault();
              let v=source.value;
              let fn=event.detail.pathInfo.requestPath.replace('/','').replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
              eval(`${fn}('${v}')`).then((r)=>{target.innerHTML=r;});
              return;
            }
          });
        };
    </script>

```


The shoppinglist is generated by a [hypertext template](https://github.com/vidhanio/hypertext) in the Rust Wasm function. You can see where this is going. Easy Rust SPA or PWA
 
```rust
use hypertext::{html_elements, GlobalAttributes, RenderIterator, Renderable};

#[wasm_bindgen]
pub fn gen_list() -> String {
    let shopping_list = ["milk", "eggs", "bread"];

    let shopping_list_maud = hypertext::maud! {
        div {
            h1 { "Shopping List" }
            ul {
                @for (&item, i) in shopping_list.iter().zip(1..) {
                    li.item {
                        input #{ "item-" (i) } type="checkbox";
                        label for={ "item-" (i) } { (item) }
                    }
                }
            }
        }
    }
    .render();
    shopping_list_maud.0
}
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

