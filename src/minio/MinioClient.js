import {Client} from "minio";

const bucketName = 'test';
const reagion = 'us-east-1';

export class MinioClient {
    constructor(){
        this.minioClient = new Client({
            endPoint: 'localhost',
            port: 9009,
            secure: false,
            accessKey: 'access_key',
            secretKey: 'secret_key'
        });
        this.minioClient.bucketExists(bucketName, function(err){
            if (err) {
                if (err.code == 'NoSuchBucket') {
                    return minioClient.makeBucket(bucketName, reagion, function(err){
                        if (err) return console.log('Error creating bucket.', err)
                        console.log('Bucket created successfully in "us-east-1".')
                    });
                }
                return new Promise();
            }
        });
    }
    upload(name, buffer, type){
        this.minioClient.putObject(bucketName, name, buffer, type, function(err, etag) {
            if (err) return console.log(err)
            console.log('File uploaded successfully.')
        });      
    };
}
