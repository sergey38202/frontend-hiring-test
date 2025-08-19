import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ItemContent, Virtuoso } from 'react-virtuoso';
import { useQuery, useMutation, useSubscription } from '@apollo/client';

import {
  type Message,
  type MessagePage,
} from '../../../__generated__/resolvers-types';
import {
  GET_MESSAGES,
  SEND_MESSAGE,
  MESSAGE_ADDED_SUBSCRIPTION,
  MESSAGE_UPDATED_SUBSCRIPTION,
} from '../../graphql/operations';
import { ChatItem } from '../../components';

import { MESSAGES_PER_PAGE } from './constants';
import css from './styles.module.css';

const getItem: ItemContent<Message, unknown> = (_, data) => {
  return <ChatItem {...data} />;
};

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const pendingMessages = useRef<Set<string>>(new Set());

  // Query for fetching messages with pagination
  const { loading, error, fetchMore, data: queryData } = useQuery<{ messages: MessagePage }>(
    GET_MESSAGES,
    {
      variables: {
        first: MESSAGES_PER_PAGE,
      },
    }
  );

  // Initialize messages from query data
  useEffect(() => {
    if (queryData?.messages) {
      const newMessages = queryData.messages.edges.map(edge => edge.node);
      setMessages(newMessages);
      setHasMore(queryData.messages.pageInfo.hasNextPage);
      setEndCursor(queryData.messages.pageInfo.endCursor || null);
    }
  }, [queryData]);

  const [sendMessage, { loading: sendingMessage }] = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      // Don't clear input here - let the handleSendMessage do it immediately
    },
    update: (cache, { data }) => {
      if (data?.sendMessage) {
        // Only add to cache if it doesn't exist (to avoid conflicts with subscription)
        const existing = cache.identify(data.sendMessage);
        if (!existing) {
          cache.modify({
            fields: {
              messages(existingMessages = { edges: [], pageInfo: {} }) {
                const newEdge = {
                  __typename: 'MessageEdge',
                  node: data.sendMessage,
                  cursor: data.sendMessage.id,
                };
                return {
                  ...existingMessages,
                  edges: [newEdge, ...existingMessages.edges],
                };
              },
            },
          });
        }
      }
    },
  });

  // Subscription for new messages
  useSubscription(MESSAGE_ADDED_SUBSCRIPTION, {
    onData: ({ data }) => {
      if (data.data?.messageAdded) {
        const newMessage = data.data.messageAdded;
        setMessages(prev => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some(msg => msg.id === newMessage.id);
          if (exists) return prev;
          
          // Add to pending messages set
          pendingMessages.current.add(newMessage.id);
          
          // Add new message to the end of the list
          return [...prev, newMessage];
        });
      }
    },
  });

  // Subscription for message updates
  useSubscription(MESSAGE_UPDATED_SUBSCRIPTION, {
    onData: ({ data }) => {
      if (data.data?.messageUpdated) {
        const updatedMessage = data.data.messageUpdated;
        setMessages(prev => 
          prev.map(msg => {
            if (msg.id === updatedMessage.id) {
              // Only update if the subscription has newer data
              const currentTime = new Date(msg.updatedAt).getTime();
              const newTime = new Date(updatedMessage.updatedAt).getTime();
              if (newTime > currentTime) {
                // Remove from pending messages if status is no longer Sending
                if (updatedMessage.status !== 'Sending') {
                  pendingMessages.current.delete(updatedMessage.id);
                }
                return updatedMessage;
              }
            }
            return msg;
          })
        );
      }
    },
  });

  // Load more messages function
  const loadMore = useCallback(() => {
    if (!hasMore || !endCursor) return;

    fetchMore({
      variables: {
        first: MESSAGES_PER_PAGE,
        after: endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        
        const newMessages = fetchMoreResult.messages.edges.map(edge => edge.node);
        setMessages(prevMessages => [...prevMessages, ...newMessages]);
        setHasMore(fetchMoreResult.messages.pageInfo.hasNextPage);
        setEndCursor(fetchMoreResult.messages.pageInfo.endCursor || null);
        
        return fetchMoreResult;
      },
    });
  }, [hasMore, endCursor, fetchMore]);

  // Handle send message
  const handleSendMessage = useCallback(() => {
    if (!messageText.trim() || sendingMessage) return;
    
    // Clear input immediately for better UX
    const textToSend = messageText.trim();
    setMessageText('');
    
    sendMessage({
      variables: {
        text: textToSend,
      },
    });
  }, [messageText, sendingMessage, sendMessage]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  if (error) {
    return (
      <div className={css.root}>
        <div className={css.chatContainer}>
          <div className={css.errorMessage}>
            Error loading messages: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={css.root}>
      <div className={css.chatContainer}>
        <div className={css.header}>
          <h1 className={css.headerTitle}>Chat Application</h1>
          <p className={css.headerSubtitle}>Real-time messaging with GraphQL</p>
        </div>
        
        <div className={css.container}>
          <Virtuoso
            className={css.messagesList}
            data={messages}
            itemContent={getItem}
            endReached={loadMore}
            components={{
              Footer: () =>
                hasMore ? (
                  <div className={css.loadingIndicator}>
                    {loading ? 'Loading more messages...' : 'Scroll to load more'}
                  </div>
                ) : null,
            }}
          />
        </div>
        
        <div className={css.footer}>
          <div className={css.inputContainer}>
            <input
              type="text"
              className={css.textInput}
              placeholder="Type your message..."
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sendingMessage}
            />
          </div>
          <button
            className={css.sendButton}
            onClick={handleSendMessage}
            disabled={!messageText.trim() || sendingMessage}
          >
            {sendingMessage ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
