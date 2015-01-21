var dust = require('dust')();
var serand = require('serand');

var user;

var cdn = serand.configs['cdn-images'];

var update = function (data) {
    data.forEach(function (v) {
        var photos = v.photos;
        if (!photos) {
            return;
        }
        var i;
        var length = photos.length;
        for (i = 0; i < length; i++) {
            photos[i] = cdn + photos[i];
        }
    });
    return data;
};

var list = function (el, options, paging, fn) {
    $.ajax({
        url: '/apis/v/vehicles',
        headers: {
            'x-host': 'autos.serandives.com'
        },
        dataType: 'json',
        success: function (data) {
            dust.render('auto-listing', update(data), function (err, out) {
                $('.auto-listing', el).remove();
                el.off('click', '.auto-sort .btn');
                el.append(out);
                el.on('click', '.auto-sort .btn', function () {
                    var sort = $(this).attr('name');
                    var serand = require('serand');
                    serand.emit('auto', 'sort', {sort: sort});
                    list(options, {
                        sort: sort
                    });
                });
                el.on('click', '.edit', function (e) {
                    serand.redirect($(this).closest('.thumbnail').attr('href') + '/edit');
                    return false;
                });
                if (!fn) {
                    return;
                }
                fn(false, function () {
                    el.remove('.auto-listing');
                });
            });
        },
        error: function () {
            fn(true, function () {

            });
        }
    });
};

dust.loadSource(dust.compile(require('./template'), 'auto-listing'));

module.exports = function (sandbox, fn, options) {
    list(sandbox, options, {
        sort: 'recent'
    }, fn);
};

serand.on('user', 'logged in', function (data) {
    user = data;
});
