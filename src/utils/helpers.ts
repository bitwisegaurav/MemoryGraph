import { URL_REGEX } from "../constants";
import { convert } from 'html-to-text'

async function fetchPartialHtml(url: string, maxChars = 1200) {
    const isUrl = url.match(URL_REGEX) !== null;
    if (!isUrl) {
        throw new Error('Invalid URL format');
    }
    try {
        // 1. Modern Fetch API se poora page download karein
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Poora HTML as text text format me nikaliye
        let html = await response.text();

        html = html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, ''); // JavaScript remove karein
        html = html.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '');   // CSS Styles remove karein
        html = html.replace(/<svg[^>]*>([\s\S]*?)<\/svg>/gi, '');

        html = html.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '');
        html = html.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '');

        let textToAnalyze = convert(html, {
            wordwrap: false,
            selectors: [
                { selector: 'a', options: { ignoreHref: true } }, // Links remove karein
                { selector: 'img', format: 'skip' }              // Images ignore karein
            ]
        });

        textToAnalyze = textToAnalyze = textToAnalyze
            .replace(URL_REGEX, '')   // 1. Agar text ke beech me koi bacha-kucha raw link ho toh saaf karein
            .replace(/[\r\n]+/g, ' ') // 2. Saare Enters (Newlines) ko Single Space se badlein
            .replace(/\s+/g, ' ')

        const croppedText = textToAnalyze.substring(0, maxChars);

        return croppedText;

    } catch (error: any) {
        console.error("Scraping error:", error.message);
        throw error;
    }
}

export { fetchPartialHtml };
