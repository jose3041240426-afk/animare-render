import React from 'react';
import {Composition} from 'remotion';
import {AnimareDev} from './Composition';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AnimareDev"
      component={AnimareDev}
      durationInFrames={210}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
