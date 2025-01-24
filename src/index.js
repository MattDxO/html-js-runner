import Resolver from '@forge/resolver';

const resolver = new Resolver();

// Return the raw HTML/JS that the user entered in the macro parameter
resolver.define('getCode', (req) => {
  // This is how you access macro parameters in the resolver:
  const code = req.context.extensionContext.parameters.code;
  // If code is empty, you can supply a fallback:
  return code || 'No code provided.';
});

export const handler = resolver.getDefinitions();
