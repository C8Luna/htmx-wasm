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
// wasm-pack build
// export NODE_OPTIONS=--openssl-legacy-provider && npm run start/ export NODE_OPTIONS=--openssl-legacy-provider && npm run start
