export * from './BaseHands';

export interface BaseHandsProps {
  type: 'hours' | 'minutes' | 'seconds';
  mode?: 'classic' | 'modern';
  baseDeg?: number;
  step?: number;
  interval?: number;
  width: number;
  height: number;
  color?: string;
  children?: any;
}
