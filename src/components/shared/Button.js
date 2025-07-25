import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../theme/theme';

const getVariantStyles = ({ variant = 'primary' }) => {
  switch (variant) {
    case 'secondary':
      return css`
        background-color: ${theme.colors.secondaryBrand};
        color: #fff;
        &:hover {
          opacity: 0.9;
        }
      `;
    case 'tertiary':
      return css`
        background-color: transparent;
        color: ${theme.colors.textPrimary};
        border: 1px solid ${theme.colors.textSecondary};
        &:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
      `;
    case 'primary':
    default:
      return css`
        background-color: ${theme.colors.accentAction};
        color: ${theme.colors.textPrimary};
        &:hover {
          filter: brightness(105%);
        }
      `;
  }
};

const StyledButton = styled.button`
  padding: ${theme.spacing(1.5)} ${theme.spacing(3)};
  border-radius: ${theme.borderRadius};
  border: none;
  cursor: pointer;
  font-size: ${theme.typography.body.fontSize};
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  
  ${(props) => getVariantStyles(props)}

  &:disabled {
    background-color: #ced4da;
    color: #6c757d;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const Button = ({ children, variant, disabled, onClick, type = 'button' }) => {
  return (
    <StyledButton variant={variant} disabled={disabled} onClick={onClick} type={type}>
      {children}
    </StyledButton>
  );
};

export default Button;