import { flags } from '@oclif/command';

export const profileFlag = flags.build({
    char: 'p',
    description: 'the name of the profile',
    env: 'LFM_API_PROFILE',
});
