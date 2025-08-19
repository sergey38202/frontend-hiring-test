import { MessageSender } from '../../../__generated__/resolvers-types';
import styles from './styles.module.css';
import { colors } from '../../styles/colors';

export const MESSAGE_STYLES: Record<MessageSender, string> = {
  [MessageSender.Admin]: styles.out,
  [MessageSender.Customer]: styles.in,
};

export const MESSAGE_STATUS_ICONS: Record<string, string> = {
  Sending: '⏳',
  Sent: '✓',
  Read: '✓✓',
};

export const MESSAGE_STATUS_LABELS: Record<string, string> = {
  Sending: 'Sending...',
  Sent: 'Sent',
  Read: 'Read',
};

export const MESSAGE_STATUS_COLORS: Record<string, string> = {
  Sending: colors.status.sending,
  Sent: colors.status.sent,
  Read: colors.status.read,
};
