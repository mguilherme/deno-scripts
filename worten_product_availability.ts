import {DOMParser} from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';
import {brightBlue, brightGreen, brightRed, brightYellow} from 'https://deno.land/std/fmt/colors.ts';

const productInfo = async (url: string) => {
    const res = await fetch(url);
    const html = await res.text();

    const doc: any = new DOMParser().parseFromString(html, 'text/html');
    const description = doc.querySelector('.pdp-product__title').querySelector('h1').textContent;
    const available = !doc.querySelectorAll('.w-product__actions')[1].querySelector('div').className.endsWith('unavailable')

    return {description, available}
};

const printContent = (content: any) => {
    console.log(`${brightYellow("Description =>")} ${brightBlue(content.description)}`);
    console.log(`${brightYellow("Availability =>")} ${content.available ? brightGreen('Available!') : brightRed('Unavailable!')}\n`);
};

const products = [
    'https://www.worten.pt/gaming/playstation/consolas/ps5/consola-ps5-825gb-7196053',
    'https://www.worten.pt/gaming/playstation/consolas/ps5/consola-ps5-edicao-digital-825-gb-7196054',
    'https://www.worten.pt/gaming/xbox/consolas/xbox-series-x-s/consola-xbox-series-x-1-tb-7240976'
];

products.forEach(async url => {
    const info = await productInfo(url);
    printContent(info)
})
