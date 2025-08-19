import React from 'react';
import cn from 'clsx';

import { Message, MessageSender } from '../../../__generated__/resolvers-types';
import { useChatItem } from './useChatItem';
import { MESSAGE_STATUS_LABELS } from './constants';
import styles from './styles.module.css';

export const ChatItem: React.FC<Message> = ({ text, sender, status, updatedAt }) => {
  const { messageStyle, messageStatusIcon } = useChatItem(sender, status);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusIconClass = (status: string) => {
    switch (status) {
      case 'Sending':
        return cn(styles.statusIcon, styles.sending);
      case 'Sent':
        return cn(styles.statusIcon, styles.sent);
      case 'Read':
        return cn(styles.statusIcon, styles.read);
      default:
        return styles.statusIcon;
    }
  };

  return (
    <div className={styles.item}>
      <div className={cn(styles.message, messageStyle)}>
        <div className={styles.messageContent}>
          {text}
        </div>
        {sender === MessageSender.Admin && (
          <div className={styles.status}>
            <span className={getStatusIconClass(status)}>
              {messageStatusIcon}
            </span>
            {status === 'Sending' && (
              <span className={styles.statusLabel}>
                {MESSAGE_STATUS_LABELS[status]}
              </span>
            )}
          </div>
        )}
        <div className={styles.timestamp}>
          {formatTime(updatedAt)}
        </div>
      </div>
    </div>
  );
};
