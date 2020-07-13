import React, { useReducer, useEffect, Fragment } from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import theme from './theme';
import { Flex } from 'rebass';
import Theme from './theme';
import { reducer } from './store';
import 'react-tippy/dist/tippy.css';
import Empty from './Empty';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

import FroalaEditor from 'react-froala-wysiwyg';

declare var acquireVsCodeApi: any;
const vscode = acquireVsCodeApi();

const GlobalStyles = createGlobalStyle`
body {
  background-color: ${Theme.colors.background};
  color: ${Theme.colors.textColor};
  height: 100vh;
  padding: 0px;
}
`;

const InitialState = {
  payload: null,
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, InitialState);
  const config = {
    placeholderText: 'Add a Title',
    charCounterCount: false,
    toolbarInline: true,
    events: {
      initialized: function() {
        console.log('initialized');
      },
    },
  };

  const createMarkup = () => {
    return { __html: state.payload };
  };

  const handleChange = (value: any) => {
    dispatch({
      type: 'resetReclarations',
      payload: value,
    });

    vscode.postMessage({
      value,
      type: 'add',
    });
  };

  useEffect(() => {
    window.addEventListener('message', ({ data }) => {
      if (data.type === 'activeBlock') {
        dispatch({
          type: 'resetReclarations',
          payload: data.payload,
        });
      }
    });
  }, []);

  console.log(state.payload);
  if (state.payload === null) {
    return (
      <Fragment>
        <GlobalStyles />
        <ThemeProvider theme={theme}>
          <Empty />
        </ThemeProvider>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <GlobalStyles />
      <ThemeProvider theme={theme}>
        <Flex p="3" flexDirection="column" backgroundColor="background">
          <div dangerouslySetInnerHTML={createMarkup()} />
        </Flex>
      </ThemeProvider>
    </Fragment>
  );
}
