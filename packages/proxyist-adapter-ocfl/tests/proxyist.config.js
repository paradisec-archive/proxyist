class BadIdentifierError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadIdentifierError';
  }
}

const adapterConfig = {
  storageConfig: {
    root: 'tests/data',
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

export default adapterConfig;
