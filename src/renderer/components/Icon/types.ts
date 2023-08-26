import { ICON_NAMES } from './icons';

export type IconName = (typeof ICON_NAMES)[number];

export type IconProps = {
  className?: string;
  /**
   * Name of the svg icon file
   */
  name: IconName;
  /**
   * A flag to add a spinning animatation to icon
   */
  spin?: boolean;
  /**
   * A flag to add a spinning animatation to icon
   */
  hover?: boolean;
};

export { ICON_NAMES };
