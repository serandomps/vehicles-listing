var dust = require('dust')();
var serand = require('serand');
var utils = require('utils');

dust.loadSource(dust.compile(require('./template'), 'vehicles-find'));

module.exports = function (sandbox, fn, options) {
    dust.render('vehicles-find', options, function (err, out) {
        sandbox.append(out);
        sandbox.on('click', '.edit', function (e) {
            serand.redirect($(this).closest('.thumbnail').attr('href') + '/edit');
            return false;
        });
        if (!fn) {
            return;
        }
        fn(false, function () {
            $('.vehicles-find', sandbox).remove();
        });
    });
};
