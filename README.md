# Deno Scripts

> The purpose of this repo is to create some useful scripts using [Deno](https://deno.land/) runtime.
>
> Deno is a simple, modern and secure runtime for JavaScript and TypeScript that uses V8 and is built in Rust.

## Chuck Norris

Retrieves a random quote from `https://api.chucknorris.io/`.

#### Run:

```bash
$ deno run --allow-net chuck_norris.ts
```

#### Resources:

* Source File - [chuck_norris.ts](chuck_norris.ts)

## OTP

Generates a time based one-time password for a given secret at the current time.

For this to work, make sure you define an environment variable `TOTP` with the secret or use a `.env` and define
a `TOTP` property.

#### Run:

```bash
$ deno run --allow-read --allow-env otp.ts
```

#### Resources
* Source File - [otp.ts](otp.ts)

## Worten Check Products

Web-Scrapper for [Worten.pt](https://www.worten.pt) web site products.
Make sure you have a `products.txt` file with the product links (one per line).

#### Run:

```bash
$ deno run --allow-net --allow-read worten_check_products.ts
```

#### Resources
* Source File - [worten_check_products.ts](worten_check_products.ts)
* Products - [products.txt](products.txt)