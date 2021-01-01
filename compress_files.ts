import {join, posix} from 'https://deno.land/x/std/path/mod.ts';

const sourceFolder = join(Deno.cwd(), '../../Roms/TurboGrafx-16');
const targetFolder = join(Deno.cwd(), '../../Desktop/test-zip');
const FILE_EXTENSION = '.pce';

const compress = async (file: Deno.DirEntry) => {

    const source = join(sourceFolder, file.name);
    const target = `${join(targetFolder, posix.parse(file.name).name)}.zip`;

    const cmd = Deno.run({
        cmd: ['zip', '-j', target, source],
        stdout: "piped",
        stderr: "piped"
    });

    const output = await cmd.output();
    cmd.close();
    return new TextDecoder().decode(output);
}

try {
    for await (const file of Deno.readDir(sourceFolder)) {
        if (file.name.toLowerCase().endsWith(FILE_EXTENSION)) {
            console.log(await compress(file));
        }
    }
} catch (err) {
    console.error(err);
}
