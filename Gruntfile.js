
module.exports = function(grunt) {

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 8000,
                    keepalive: true,
                    base: ['node_modules', 'client']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
};
