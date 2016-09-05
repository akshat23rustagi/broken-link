'use strict'

// Module for making HTTP requests
var request = require('request');

//Regex to find hyperlinks in a webpage
var REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

/**
 * Used to find broken links on a webapage
 */
function findBrokenLinks() {
    var regex = new RegExp(REGEX);
    var url = process.argv[2];
    if (url && url.match(regex)) {
        //Valid input URL
        request.get(url, function (err, resp, body) {
            if (!err && resp.statusCode == 200) {
                var urls = body.match(regex);
                if (urls) {
                    console.log('Got some URL\'s');
                    for (let i = 0; i < urls.length; ++i) {
                        // Used a promise to check invalid url or not
                        executeLinkPromsified(urls[i])
                            .then()
                            .catch(function(error) {
                            console.log('Got invalid URL ' + error.url + ' with error code ' + error.statusCode);
                        });
                    }
                } else {
                    console.log('No links Found in the page');
                    process.exit(0);
                }
            } else {
                console.log('Something went wrong!!!!! ' + err);
                process.exit(1);
            }
        });
    } else {
        console.log('No URL provided or invalid URL');
        process.exit(0);
    }
}

/**
 * Executes the link to check whether it is broken or not
 * @param {string} element
 * @param {number} index
 * @param array
 */
var executeLinkPromsified = function (element) {
    return new Promise(
      function (resolve, reject) {
          request.get(element, function (err, res, body) {
              if (err || res.statusCode != 200) {
                  reject({
                      error : err,
                      statusCode : res.statusCode || '',
                      url : element
                  });
              } else {
                  resolve(body);
              }
          });
      }
    );
};

/**
 * Checks whether HTTP status code is success or not (2xx)
 * @param {number} code
 * @returns {boolean}
 */
var isSuccessCode = function(code) {
    var result = false;
    if (code >=200 && code < 300) {
        result = true;
    }
    return result;
};

findBrokenLinks();