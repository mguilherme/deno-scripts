import {DOMParser} from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';
import {brightBlue, brightGreen, brightRed, brightYellow} from 'https://deno.land/std/fmt/colors.ts';

const url = 'https://www.worten.pt/gaming/playstation/consolas/ps5/consola-ps5-825gb-7196053';

try {
    const res = await fetch(url);
    const html = await res.text();

    const doc: any = new DOMParser().parseFromString(html, 'text/html');
    const description = doc.querySelector('.pdp-product__title').querySelector('h1').textContent;
    const isAvailable = !doc.querySelectorAll('.w-product__actions')[1].querySelector('div').className.endsWith('unavailable')

    console.log(`${brightYellow("Description =>")} ${brightBlue(description)}`);
    console.log(`${brightYellow("Availability =>")} ${isAvailable ? brightGreen('Available!') : brightRed('Unavailable!')}`);
} catch (error) {
    console.log(error);
}
