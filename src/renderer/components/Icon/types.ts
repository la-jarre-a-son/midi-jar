import { ICON_NAMES } from './icons';

export type IconName = (typeof ICON_NAMES)[number];

export const IconIntents = [
  'default',
  'subtle',
  'contrast',
  'neutral',
  'primary',
  'danger',
  'warning',
  'success',
  'inherit',
] as const;

export type IconIntent = (typeof IconIntents)[number];

export type IconProps = {
  className?: string;
  /**
   * Name of the svg icon file
   */
  name: IconName;

  /**
   * The Icon semantic intent
   */
  intent?: IconIntent;

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
