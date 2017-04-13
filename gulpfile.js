let gulp = require('gulp'),
    //nodemon = require('gulp-nodemon'),
    //concat = require('gulp-concat'),
    //wrap = require('gulp-wrap'),
    //declare = require('gulp-declare'),
    argv = require('yargs').argv,
    path = require("path"),
    zip = require('gulp-zip'),
    //gulpSequence = require('gulp-sequence'),
    exit = require('gulp-exit'),
    //util = require("util"),
    mySSH = require('./gulpfile/ssh');


    let deployConfig = {
      test : {
        servers : [{
            sshConfig: {
                host: '10.0.1.175',
                port: 22,
                username: 'zgy',
                password: 'zgy',
                readyTimeout: 200000
            }
        }],
        deployPath : "/home/zgy/idealens-admin",
        deploySrc : [],
        deployServers : []
    },
    production : {
        servers : [{
            sshConfig: {
                host: '...',
                port: 22,
                username: 'idealensadmin',
                password: 'idealens@2016',
                readyTimeout: 200000
            }
        }],
        deployPath : "/home/idealens/idealens-admin",
        deploySrc : [],
        deployServers : []
    }
};

let cfg;

function getEnvConf(type){
    let conf = {};
    conf.env = argv.env || "test";
    conf.type = type;
    conf.rootDir = path.normalize(path.join(__dirname,  type));
    conf.distDir = path.normalize(path.join(__dirname, "/dist"));
    conf.distTempDir = path.normalize(__dirname + "/dist/temp");
    console.log("env: %s", conf.env);
    console.log("root dir : %s", conf.rootDir);
    console.log("dist dir : %s", conf.distDir);
    return conf;
}

gulp.task('deploy', function (cb) {
    let env = argv.env || "test";
    cfg = deployConfig[env];
    if(!cfg){
        console.error("Invalid env !!!");
    }
    cfg.isDevelopment = false;
    cfg.deploySrc = ["dist/**"];
    cfg.deployServers = cfg.servers;

    let logName = "deploy-admin";

    return gulp.src(cfg.deploySrc, { base: './' })
      .pipe(zip('publish.zip'))
      .pipe(mySSH({
            servers: [cfg.deployServers[0]],
            dest: cfg.deployPath + '/publish.zip',
            shell:['cd ' + cfg.deployPath,
                'shopt -s extglob',
                'rm -rf !(logs|node_modules|publish.zip)',
                'unzip -o publish.zip -d dist',
                'cp -rf dist/** .',
                'rm -rf dist',
                "rm publish.zip"//,
                //'npm install --production',
                //'pm2 startOrRestart pm2-job-' + env + '.json'
              ],
            logPath: logName
        })).pipe(exit());
});
