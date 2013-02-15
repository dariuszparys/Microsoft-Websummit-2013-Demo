"use strict";

var jade = require('jade'),
    fs = require('fs'),
    formidable = require('formidable'),
    util = require('util'),
    azure = require('azure');

process.env.AZURE_STORAGE_ACCOUNT = "dpdeployments";
process.env.AZURE_STORAGE_ACCESS_KEY = "oKZ5O8MAlqHEOF0rq/7eSwCRirvdjySpAHe2jTuMTZGZHpYZFARSmgm33hXRK1ZVxq0/x5YzCIZjVZf+MxJu6Q==";

var blobService = azure.createBlobService();
blobService.createContainerIfNotExists('uploads', { publicAccessLevel: 'blob' }, function (error) {
    if (error) {
        console.dir(error);
        return;
    }
});

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

            blobService.createBlockBlobFromFile('uploads', file.name, file.path, options, function (error) {
                if (error) {
                    console.dir(error);
                }
            })

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

exports.showMusic = function () {
    var res = this.res,
        req = this.req;

    // read blobs from Windows Azure Storage
    blobService.listBlobs('uploads', function (error, blobs) {
        if (!error) {
            var renderFunction = getRenderFunction('music');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(renderFunction({ blobs: blobs }));
        }
    });
}