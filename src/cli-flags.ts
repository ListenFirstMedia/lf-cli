import { flags } from '@oclif/command';

export const profileFlag = flags.build({
    char: 'p',
    description: 'the name of the configuration profile',
    env: 'LFM_API_PROFILE',
});
