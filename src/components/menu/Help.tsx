import React from 'react';
import styled, { keyframes } from 'styled-components';
import { ReactComponent as HelpSvg } from '../../svg/help.svg';
import SvgButton from '../SvgButton';

const pulse = keyframes`
25% {
  transform: scale(0.8);
}
75% {
  transform: scale(1.2);
}
`;

const StyledHelpSvg = styled(HelpSvg)`
  animation: ${pulse} 1s linear 5;
  animation-delay: 10s;
`;

const openInNewTab = (url: string) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
};

const Help: React.FC = () => {
  return (
    <SvgButton
      onClick={() => openInNewTab('https://plcsimulator.online/docs')}
      Svg={StyledHelpSvg}
    />
  );
};

export default Help;
