import { MessageSender } from '../../../__generated__/resolvers-types';
import { MESSAGE_STYLES, MESSAGE_STATUS_ICONS } from './constants';

export const useChatItem = (sender: MessageSender, status: string) => {
  const messageStyle = MESSAGE_STYLES[sender];
  const messageStatusIcon = MESSAGE_STATUS_ICONS[status];

  return {
    messageStyle,
    messageStatusIcon,
  };
};
