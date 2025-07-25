import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';

const CardWrapper = styled.div`
  background-color: ${theme.colors.neutralSurface};
  border-radius: ${theme.borderRadius};
  box-shadow: ${theme.boxShadow};
  padding: ${theme.spacing(3)};
  width: 100%;
`;

const Card = ({ children, style }) => {
  return <CardWrapper style={style}>{children}</CardWrapper>;
};

export default Card;