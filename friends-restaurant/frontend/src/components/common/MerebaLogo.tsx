import React from 'react';
import { KabunLogo, KabunLogoProps } from './KabunLogo';

export type MerebaLogoProps = KabunLogoProps;

export const MerebaLogo: React.FC<MerebaLogoProps> = (props) => {
  return <KabunLogo {...props} />;
};
