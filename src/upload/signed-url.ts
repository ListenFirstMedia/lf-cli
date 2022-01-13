import fetch from 'node-fetch';

export const uploadFileViaSignedUrl = async (
    body: string,
    fetcher: (
        relPath: string,
        fetchOpts?: any,
        actionMsg?: string
    ) => Promise<any>
) => {
    try {
        const res = await fetcher(
            '/v20200626/bulk_tagging_upload_url',
            {},
            'Fetching signed url for upload'
        );
        const signedUrl = res.url;
        const response = await fetch(signedUrl, { method: 'PUT', body: body });
        return response;
    } catch (error) {}
};
