mod utils;
use evalexpr::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn expr_eval(expr: &str) -> JsValue {
    let result = eval(expr);

    match result {
        Ok(v) => JsValue::from_str(&format!("{}", v)),
        Err(e) => JsValue::from_str(&format!("Error evaluating: {}", e)),
    }
}
