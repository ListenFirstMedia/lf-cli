import * as fs from 'fs';
import fetch from 'node-fetch';

export const uploadFileViaSignedUrl = async (
    filename: string,
    fetcher: (
        relPath: string,
        fetchOpts?: any,
        actionMsg?: string
    ) => Promise<any>
) => {
    const signed_url_res = await fetcher(
        '/v20200626/get_upload_url',
        {},
        'Fetching signed url for upload'
    );
    const signedUrl = signed_url_res.url;
    const contents = fs.readFileSync(filename);
    await fetch(signedUrl, {
        method: 'PUT',
        body: contents,
    });
    return signed_url_res;
};
