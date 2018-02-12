import {Client} from 'minio';
import config from 'config';

const client = new Client(config.minio);

export function checkBucket(bucket) {
    return new Promise((resolve) => {
        client.bucketExists(bucket, (err) => {
            if (err) {
                if (err.code === 'NoSuchBucket') {
                    resolve(bucket);
                    return;
                }
                throw err;
            }
            console.log('`makeBucket` do nothing since already exists bucket named ' + bucket); // eslint-disable-line no-console
        });
    });
}

export function makeBucket(bucket, region = 'us-east-1') {
    return new Promise((resolve, reject) => {
        client.makeBucket(bucket, region, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
}

export function uploadObject(bucket, file, buffer, type) {
    client.putObject(bucket, file, buffer, type, (err) => {
        if (err) {
            console.log(err); // eslint-disable-line no-console
            return;
        }
        console.log('Successfully file uploaded.'); // eslint-disable-line no-console
    });
}

export function readObject(bucket, id) {
    return client.getObject(bucket, id);
}
