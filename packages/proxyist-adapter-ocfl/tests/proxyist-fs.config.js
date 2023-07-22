import { BadIdentifierError } from '@paradisec/proxyist-adapter-common';

export default {
  type: 'fs',
  ocflConfig: {
    root: 'tests/data-fs',
  },
  transformIdentifier: (identifier) => {
    if (identifier.includes('/')) {
      throw new BadIdentifierError('Identifer cannot contain "/"');
    }

    if (identifier.includes('-')) {
      return identifier;
    }

    return `${identifier}-root`;
  },
  transformPath: (path) => path,
};
