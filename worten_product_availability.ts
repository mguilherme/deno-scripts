import {DOMParser} from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';
import {brightBlue, brightGreen, brightRed, brightYellow} from 'https://deno.land/std/fmt/colors.ts';

const abbreviate = (text: string, num: number) => (text.length <= num) ? text : `${text.slice(0, num)}...`

const productInfo = async (url: string) => {
    const res = await fetch(url);
    const html = await res.text();

    const doc: any = new DOMParser().parseFromString(html, 'text/html');

    const title = doc.querySelector('.pdp-product__title h1').textContent;
    const available = !doc.querySelectorAll('.w-product__actions')[1].querySelector('div').className.endsWith('unavailable')
    const currentPrice = doc.querySelector('.w-product__price__current').getAttribute('content')
    const currency = doc.querySelector('.w-product-price__currency').textContent
    const description = doc.querySelector('.w-product-about__info__wrapper').innerHTML


    return {title, currency, currentPrice, available, description}
};

const printContent = (content: any) => {
    console.log(`${brightYellow("Title =>")} ${brightBlue(content.title)}`);
    console.log(`${brightYellow("Price =>")} ${brightBlue(content.currentPrice)}`);
    console.log(`${brightYellow("Availability =>")} ${content.available ? brightGreen('Available!') : brightRed('Unavailable!')}`);
    console.log(`${brightYellow("Description =>")} ${brightBlue(abbreviate(content.description, 50))}\n`)
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
