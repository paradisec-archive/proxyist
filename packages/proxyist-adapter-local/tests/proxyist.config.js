import { BadIdentifierError } from '@paradisec/proxyist-adapter-common';

export default {
  directory: 'tests/data',
  transform: (identifier) => {
    if (identifier.includes('/')) {
      throw new BadIdentifierError('Identifer cannot contain "/"');
    }

    if (identifier.includes('-')) {
      const [, item] = identifier.split('-', 2);
      if (item === 'root') {
        throw new BadIdentifierError('Item cannot be named "root"');
      }

      return identifier.replace(/-/, '/');
    }

    return `${identifier}/root`;
  },
};
