import {Client} from "minio";

let minioClient = new Client({
    endPoint: 'localhost',
    port: 9009,
    secure: false,
    accessKey: 'access_key',
    secretKey: 'secret_key'
});

export function makeBucket(bucketName, region = 'us-east-1') {
        const client = minioClient;
        client.bucketExists(bucketName, function(err){
            if (err) {
                if (err.code == 'NoSuchBucket') {
                    return client.makeBucket(bucketName, region, function(err){
                        if (err) return console.log('Error creating bucket.', err)
                        console.log('Bucket created successfully in "us-east-1".')
                    });
                }
                return new Promise();
            }
        });
}

makeBucket("test")

export function upload(bucketName, fileName, buffer, type){
        minioClient.putObject(bucketName, fileName, buffer, type, function(err, etag) {
            if (err) return console.log(err)
            console.log('File uploaded successfully.')
        });      
};
