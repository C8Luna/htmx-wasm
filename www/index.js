import init, {  expr_eval } from './wasm/htmx_wasm.js'; 

export const wasmReady = (
  async () => { 
    await init();})
();

export { expr_eval };
