import init, {  expr_eval,gen_list } from './wasm/htmx_wasm.js'; 

export const isReady = (async () => {
  await init();
})();
export { expr_eval,gen_list }