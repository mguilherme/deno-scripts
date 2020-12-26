export {}

const url = 'https://api.chucknorris.io/jokes/random';

try {
    const response = await fetch(url);
    const json = await response.json();
    console.log(json.value);
} catch (error) {
    console.log(error);
}
