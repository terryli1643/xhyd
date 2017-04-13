
let path = require('path')
    ,gulp = require('gulp')
    ,gutil = require('gulp-util')
    ,through = require('through2')
    ,ScpClient = require('scp2').Client
    ,ssh = require('gulp-ssh')
    ,async = require('async')
    ,ProgressBar = require('progress');


const PLUGIN_NAME = 'my-ssh';

module.exports = function (options) {
    let servers = options.servers;
    let dest = options.dest;
    let shell = options.shell;
    let logPath = options.logPath;

    return through.obj(function (file, enc, callback) {
        if (file.isNull()) {
            callback(null, file);
            return;
        }

        if (file.isStream()) {
            return callback(new gutil.PluginError(PLUGIN_NAME, 'No stream support'));
        }

        let i = 0;
        async.eachSeries(servers, function(server, done) {
            let hostName = server.sshConfig.host;
            gutil.log(PLUGIN_NAME, "start deploy:" + hostName);
            let client = new ScpClient(server.sshConfig);

            let bar = null;
            client.on("transfer",  function(buffer, uploaded, total){
                if(bar === null){
                    bar = new ProgressBar(hostName + ' uploading [:bar] :percent :elapsed s', {
                        complete: '=',
                        incomplete: ' ',
                        width: 50,
                        total: total
                    });
                }
                bar.tick(1);
            });

            client.write({
                destination: dest,
                content: file.contents
            }, function () {
                ssh(server).shell(shell, { filePath: logPath + "-" + hostName + ".log", autoExit: true }).on('error', function (err) {
                    done(err);
                    gutil.PluginError(PLUGIN_NAME,  err)
                }).on('finish', function () {
                    gutil.log(PLUGIN_NAME, "finish deploy:" + hostName);
                    done();
                    if (++i === servers.length) {
                        callback(null, file);
                    }
                }).pipe(gulp.dest('logs'));
            });
        });

    });

};