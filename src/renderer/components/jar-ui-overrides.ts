import {
  Icon as JarIcon,
  ModalHeader,
  Switch,
  SelectTrigger,
  StateButton,
  TreeViewItem,
} from '@la-jarre-a-son/ui';
import { Icon } from './Icon';

JarIcon.IconComponent = Icon;
ModalHeader.ICON_CLOSE = 'cross';
Switch.ICON_CHECKED = 'check';
Switch.ICON_UNCHECKED = 'cross';
SelectTrigger.ICON_OPEN = 'angle-up';
SelectTrigger.ICON_CLOSED = 'angle-down';
StateButton.ICON_ERROR = 'cross';
StateButton.ICON_SUCCESS = 'check';
StateButton.ICON_PENDING = 'loading';
TreeViewItem.ICON_OPEN = 'angle-up';
TreeViewItem.ICON_CLOSED = 'angle-down';
