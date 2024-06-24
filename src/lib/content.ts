const API_URL = "http://localhost:5174/content";

/**
 * Fetch the content from the api
 * In case of an error, return content as "<speak><s>There was an error</s></speak>"
 */
const fetchContent = async (url = API_URL): Promise<string> => {
    try {
        const res = await fetch(url);
        const txt = await res.text();
        return txt;
    } catch {
        return "<speak><s>There was an error</s></speak>";
    }
};

/**
 * Parse the content into sentences, and return an array of sentences. Look at the Readme for sample input and expected output.
 * Avoid using DOMParser for implementing this function.
 */
const parseContentIntoSentences = (content: string) => {
    const reg = /<s(\s\S+)*>([^>]+)<\/s>/img;
    const sentences = [];
    let m;
    while(m = reg.exec(content)) {
        if (!!m && m.length >= 3 && m[2]) {
            sentences.push(m[2]);
        }
    }
    return sentences;
};

export { fetchContent, parseContentIntoSentences };
