import { ApolloClient, HttpLink, split, InMemoryCache } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

const PORT = 4000;

const httpLink = new HttpLink({
  uri: operation =>
    `http://localhost:${PORT}/graphql?op=${operation.operationName}`,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://localhost:${PORT}/graphql`,
  })
);

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const cache = new InMemoryCache({
  typePolicies: {
    Message: {
      keyFields: ['id'],
      fields: {
        updatedAt: {
          read(existing) {
            return existing;
          },
          merge(existing, incoming) {
            if (!existing || new Date(incoming) > new Date(existing)) {
              return incoming;
            }
            return existing;
          },
        },
      },
    },
  },
});

export const client = new ApolloClient({
  link,
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
