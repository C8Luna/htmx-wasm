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
