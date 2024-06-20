const cheerio = require('cheerio');

/**
 * Parses the given HTML and extracts data from elements matching the selector.
 * Generates additional entries based on numeric suffix in the text of the last element.
 *
 * @param {string} html - The HTML content to parse.
 * @returns {Array<Object>} - The extracted and generated data entries.
 */
function parsePage(html) {
  if (typeof html !== 'string') {
    throw new Error('Invalid HTML input');
  }

  const $ = cheerio.load(html);
  const result = $('.data_list .data a').map((i, el) => {
    const $el = $(el);
    return {
      text: $el.text(),
      link: $el.attr('href')
    };
  }).get();

  const perPage = result.length;
  if (!perPage) return result;

  let { text, link } = result[result.length - 1];
  let num = extractNum(text);
  if (!num) return result;

  num = parseInt(num, 10); // Ensure num is an integer
  for (let i = num - 1; i > 0; i--) {
    let newText = text.replace(/(\d+)$/, match => padNumber(i, match.length));
    let newLink = link.replace(text.replace(' ', '-'), newText.replace(' ', '-'));
    result.push({
      text: newText,
      link: newLink
    });
  }

  return result;
}

/**
 * Extracts the first numeric value from the given string.
 *
 * @param {string} string - The string to extract the number from.
 * @returns {string|null} - The extracted number as a string or null if no number is found.
 */
function extractNum(string) {
  const match = string.match(/(\d+)/);
  return match ? match[0] : null;
}

/**
 * Pads the given number with leading zeros to match the desired length.
 *
 * @param {number} num - The number to pad.
 * @param {number} length - The desired length of the resulting string.
 * @returns {string} - The padded number as a string.
 */
function padNumber(num, length) {
  return String(num).padStart(length, '0');
}

module.exports = {
  parsePage
};
