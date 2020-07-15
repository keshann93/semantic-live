import React from 'react';
import styled from 'styled-components';
import { getThemeColors } from './theme';

const Container = styled.div<{ backgroundColor: string }>`
  display: flex;
  align-items: center;
  background-color: white;
  justify-content: center;
  padding: 25px;
  background-color: ${props => props.backgroundColor};
  height: 100vh;
`;

export default function Empty() {
  const colors = getThemeColors();
  return <Container backgroundColor={colors.background}>Please place cursor on the active html page</Container>;
}
