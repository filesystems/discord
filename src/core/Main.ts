window.onerror = (e) => console.log(e.toString());

import Main from "./Main.svelte";

const main = new Main({ target: document.body });

console.log(main);