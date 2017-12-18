import {Client} from 'minio';
import config from 'config';

const client = new Client(config.minio);

export function checkBucket(bucket) {
    return new Promise((resolve, reject) => {
        client.bucketExists(bucket, (err) => {
            if (err) {
                if (err.code === 'NoSuchBucket') {
                    resolve(bucket);
                    return;
                }
                throw err;
            }
            console.log("`makeBucket` do nothing since already exists bucket named " + bucket);
            return;
        });
    })
};

export function makeBucket(bucket, region = 'us-east-1') {
    return new Promise((resolve, reject) => {
        client.makeBucket(bucket, region, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        })
    });
};

export function uploadObject(bucket, file, buffer, type) {
    client.putObject(bucket, file, buffer, type, (err, etag) => {
        if (err) return console.log(err);
        console.log('Successfully file uploaded.')
    })
};

export function readObject(bucket, id) {
    return new Promise((resolve, reject) => {
        client.getObject(bucket, id, (err, stream) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(stream);
        })
    });
}
