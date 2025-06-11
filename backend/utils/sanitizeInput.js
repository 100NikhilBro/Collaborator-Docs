const sanitizeHtml = require('sanitize-html');

exports.cleanInput = (obj) => {
    const clean = {};
    for (let key in obj) {
        if (typeof obj[key] === 'string') {
            clean[key] = sanitizeHtml(obj[key], {
                allowedTags: [],
                allowedAttributes: {},
            });
        } else {
            clean[key] = obj[key];
        }
    }
    return clean;
};