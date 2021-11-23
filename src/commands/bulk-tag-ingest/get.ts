import ApiCommand from '../../api-command';

export default class BulkTagIngestGet extends ApiCommand {
    static description = `Ingest tags`;

    static flags = {
        ...ApiCommand.flags,
    };

    static args = [
        {
            name: 'filename',
            description: 's3 file to ingest',
            required: true,
        },
    ];

    static examples = ['$ lf-cli bulk-tag-ingest:get tags.csv'];

    async run() {
        const opts = this.parse(BulkTagIngestGet);

        if (opts.args.ID === 'help') {
            await BulkTagIngestGet.run(['-h']);
            this.exit(0);
        }

        const filename = opts.args.filename;

        const res = await this.fetch(
            `/v20200626/tag?job_id=5678&filename=${filename}`,
            undefined,
            `Ingesting tags from ${filename}'`
        );

        this.outputRecords(res);
    }
}
