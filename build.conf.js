module.exports = {
    module: { 
        name: 'pipEntry',
        index: 'entry'
    },
    build: {
        js: true,
        ts: true,
        html: true,
        css: true,
        lib: true,
        images: true
    },
    samples: {
        port: 8009,
        publish: {
            bucket: 'webui.pipdevs.com',
            accessKeyId: 'AKIAJCEXE5ML6CKW4I2Q',
            secretAccessKey: 'Mtqe9QlWWgRZvS8AXaZqJXaG98BR3qq8gbJqeEk+',
            region: 'us-west-1'
        }
    }
};