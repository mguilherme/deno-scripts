import Behin from 'https://deno.land/x/behin/mod.ts';
import 'https://deno.land/x/dotenv/load.ts';

const secret = Deno.env.get('TOTP');
if (!secret) throw new Error('TOTP is not provided');

const token = Behin.totp.generate(secret);
console.log(token);
