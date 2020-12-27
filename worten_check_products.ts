import {DOMParser} from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';
import {blue, brightGreen, brightMagenta, brightRed, brightYellow, cyan} from 'https://deno.land/std/fmt/colors.ts';
import {Table} from 'https://deno.land/x/cliffy/table/mod.ts';
import {TerminalSpinner} from 'https://deno.land/x/spinners/mod.ts';
import {readLines} from 'https://deno.land/x/std/io/mod.ts';
import {join} from 'https://deno.land/x/std/path/mod.ts';

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

const getLinks = async (file: string) => {
    const filename = join(Deno.cwd(), file);
    const fileReader = await Deno.open(filename);

    const links: string[] = [];
    for await (let line of readLines(fileReader)) {
        links.push(line);
    }
    return links.filter(item => item);
}


const spinner = new TerminalSpinner();

spinner.start('Reading product links from file...');
const links = await getLinks('products.txt');
spinner.succeed();

spinner.start(`Fetching ${links.length} products...`)
const products = await Promise.all(
    links.map(async url => (
        {...await getProductDetails(url), url, shortUrl: await getTinyUrl(url)}
    ))
);
spinner.succeed();

printTable(products);
