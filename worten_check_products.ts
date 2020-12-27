import {DOMParser} from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';
import {blue, brightGreen, brightMagenta, brightRed, brightYellow, cyan} from 'https://deno.land/std/fmt/colors.ts';
import {Table} from 'https://deno.land/x/cliffy/table/mod.ts';
import {TerminalSpinner} from 'https://deno.land/x/spinners/mod.ts';

const getProductDetails = async (url: string) => {
    const res = await fetch(url);
    const html = await res.text();

    const doc: any = new DOMParser().parseFromString(html, 'text/html');

    const title = doc.querySelector('.pdp-product__title h1').textContent;
    const available = !doc.querySelectorAll('.w-product__actions')[1].querySelector('div').className.endsWith('unavailable');
    const currentPrice = doc.querySelector('.w-product__price__current').getAttribute('content');
    const currency = doc.querySelector('.w-product-price__currency').textContent;
    const description = doc.querySelector('.w-product-about__info__wrapper').innerHTML;

    return {title, currency, currentPrice, available, description};
};

const printTable = (products: any[]) => {
    new Table()
        .header([brightYellow('Title'), brightYellow('Price'), brightYellow('Availability'), brightYellow('Link')])
        .body(
            products.map(p => {
                const available = p.available ? brightGreen('Available') : brightRed('Unavailable');
                return [brightMagenta(p.title), cyan(`${p.currency}${p.currentPrice}`), available, blue(p.shortUrl)]
            })
        )
        .padding(1)
        .indent(2)
        .border(true)
        .render();
}

const getTinyUrl = async (url: string) => (await fetch(`http://tinyurl.com/api-create.php?url=${url}`)).text();

const links = [
    'https://www.worten.pt/gaming/playstation/consolas/ps5/consola-ps5-825gb-7196053',
    'https://www.worten.pt/gaming/playstation/consolas/ps5/consola-ps5-edicao-digital-825-gb-7196054',
    'https://www.worten.pt/gaming/xbox/consolas/xbox-series-x-s/consola-xbox-series-x-1-tb-7240976',
    'https://www.worten.pt/gaming/xbox/consolas/xbox-series-x-s/consola-xbox-series-s-512-gb-7253966'
];

const terminalSpinner = new TerminalSpinner(`Fetching ${links.length} products...`);
terminalSpinner.start();

const products = await Promise.all(
    links.map(async url => (
        {...await getProductDetails(url), url, shortUrl: await getTinyUrl(url)}
    ))
);

terminalSpinner.succeed();
printTable(products);
