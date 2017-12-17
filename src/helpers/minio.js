import {Client} from 'minio';
import config from 'config';

const client = new Client(config.minio);

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
