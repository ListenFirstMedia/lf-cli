import { flags } from '@oclif/command';

function getDefaultProfile() {
    return 'default';
}

export const profileFlag = flags.build({
    char: 'p',
    description: 'the name of the profile',
    env: 'LFM_API_PROFILE',
    default: () => getDefaultProfile(),
});
