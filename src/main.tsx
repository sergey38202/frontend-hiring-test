import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ApolloProvider } from '@apollo/client';

import { client } from './graphql/client.ts';
import './index.css';

const ChatPage = React.lazy(() => import('./pages/Chat'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <ChatPage />
    </ApolloProvider>
  </StrictMode>
);
