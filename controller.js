"use strict";

var jade = require('jade'),
    fs = require('fs'),
    formidable = require('formidable'),
    util = require('util');

function getRenderFunction(name) {
    var path = __dirname + '/' + name + '.jade';
    var content = fs.readFileSync(path, 'utf8');
    var renderFunction = jade.compile(content, { filename: path, pretty: true });
    return renderFunction;
}

exports.helloFromWebMatrix = function () {
    var res = this.res,
        req = this.req;

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello from webmatrix');
}

exports.showRoot = function () {
    var res = this.res,
        req = this.req;

    var renderFunction = getRenderFunction('root');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(renderFunction());
}

exports.showUploadForm = function() {
    var res = this.res,
        req = this.req;

    var renderFunction = getRenderFunction('upload');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(renderFunction());
}

exports.upload = function () {
    var res = this.res,
        req = this.req;

    var form = formidable.IncomingForm();

    form
        .on('file', function (field, file) {
            var options = {
                contentType: file.type
            };

            console.log("file path: " + file.path);
        })
        .parse(req, function (err, fields, files) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            if (err) {
                res.end('error: Upload failed');
            } else {
                res.end('sucess: Uploaded file(s) ' + util.inspect({ fields: fields, files: files }));
            }
        });
}