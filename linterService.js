// linterService.js
var http = require('http');
exports.hello = function() {
    return "Hello";
}

exports.lintFile = function(content){
    var headers = {
        'Content-Type': 'text/plain',
        'Origin': 'https://lightning-linter.herokuapp.com/lint_code',
        'Accept': 'text/plain, */*; q=0.01',
        'Connection': 'keep-alive'
    }
    var options = {
        host: 'lightning-linter.herokuapp.com',
        path: '/lint-json',
        method: 'POST',
        headers: headers
    };
    return httpRequest(options,content);
}

// Raw htpp post request wrapped in promise.
function httpRequest(options, content) {
    return new Promise(function(resolve, reject) {
        var req = http.request(options, function(res) {
            // reject on bad status
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }
            // cumulate data
            //var body = [];
            var str = '';
            res.on('data', function(chunk) {
                str += chunk;
            });
            // resolve on end
            res.on('end', function() {
                try {} catch (e) {
                    reject(e);
                }
                resolve(str);
            });
        });
        req.on('error', function(err) {
            // This is not a "Second reject", just a different sort of failure
            reject(err);
        });
        if (content) {
            req.write(content);
        }
        // IMPORTANT
        req.end();
    });
};