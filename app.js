var http = require('http'),
    director = require('director'),
    controller = require('./controller'),
    union = require('union');

var port = process.env.PORT || 5000;

var router = new director.http.Router({
    '/about': {
        get: controller.helloFromWebMatrix
    }
});

var server = union.createServer({
    buffer: false,
    before: [
        function (req, res) {
            var found = router.dispatch(req, res);
            if (!found) {
                res.emit('next');
            }
        }
    ]
});

router.get('/', controller.showRoot);
router.get('/upload', controller.showUploadForm);
router.post('/upload', {stream: true }, controller.upload);
router.get('/music', controller.showMusic);

server.listen(port);
console.log('server listening on localhost:5000');

