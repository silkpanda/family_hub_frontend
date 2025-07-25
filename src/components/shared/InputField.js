import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Label = styled.label`
  margin-bottom: ${theme.spacing(1)};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.caption.fontSize};
`;

const StyledInput = styled.input`
  padding: ${theme.spacing(1.5)};
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: ${theme.typography.body.fontSize};
  color: ${theme.colors.textPrimary};
  transition: border-color 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accentAction};
  }
`;

const InputField = ({ label, value, onChange, placeholder, type = 'text' }) => {
  return (
    <InputWrapper>
      {label && <Label>{label}</Label>}
      <StyledInput
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </InputWrapper>
  );
};

export default InputField;