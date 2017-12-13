import {Client} from 'minio';
import config from 'config';

const client = new Client(config.minio);

export function readObject(bucket, id, cb) {
    return client.getObject(bucket, id, cb);
}
