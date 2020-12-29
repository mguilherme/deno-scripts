import {DOMParser} from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';
import {blue, brightGreen, brightMagenta, brightRed, brightYellow, cyan} from 'https://deno.land/std/fmt/colors.ts';
import {Table} from 'https://deno.land/x/cliffy/table/mod.ts';
import {TerminalSpinner} from 'https://deno.land/x/spinners/mod.ts';
import {readLines} from 'https://deno.land/x/std/io/mod.ts';
import {join} from 'https://deno.land/x/std/path/mod.ts';
import {shorten} from 'https://deno.land/x/tinyurl/mod.ts';

interface Product {
    title: string;
    currentPrice: string;
    currency: string;
    available: boolean;
    description: string;
    url: string;
    shortUrl: string;
}

const getProductDetails = async (url: string): Promise<Product> => {

    const res = await fetch(url);
    const html = await res.text();

    const doc: any = new DOMParser().parseFromString(html, 'text/html');

    const title = doc.querySelector('.pdp-product__title h1').textContent;
    const currentPrice = doc.querySelector('.w-product__price__current').getAttribute('content');
    const available = !doc.querySelectorAll('.w-product__actions')[1].querySelector('div').className.endsWith('unavailable');
    const currency = doc.querySelector('.w-product-price__currency').textContent;
    const description = doc.querySelector('.w-product-about__info__wrapper').innerHTML;

    return {title, currentPrice, currency, available, description, url, shortUrl: await shorten(url)};
};

const printTable = (products: Product[]) => {

    const header = [brightYellow('Title'), brightYellow('Price'), brightYellow('Availability'), brightYellow('Link')];
    const availability = (available: boolean) => available ? brightGreen('Available') : brightRed('Unavailable');
    const body = products.map(product => [
        brightMagenta(product.title),
        cyan(`${product.currency}${product.currentPrice}`),
        availability(product.available),
        blue(product.shortUrl)
    ]);

    new Table()
        .header(header)
        .body(body)
        .padding(1)
        .indent(2)
        .border(true)
        .render();
}

const getLinks = async (file: string) => {

    const filename = join(Deno.cwd(), file);
    const fileReader = await Deno.open(filename);

    const links: string[] = [];
    for await (const line of readLines(fileReader)) {
        links.push(line);
    }
    return links.filter(item => item);
}

// Main execution
const spinner = new TerminalSpinner();

spinner.start('Reading links from file...');
const links = await getLinks(Deno.args[0]);
spinner.succeed();

spinner.start(`Fetching ${links.length} products...`);
const products = await Promise.all(
    links.map(url => getProductDetails(url))
);
spinner.succeed();

printTable(products);
