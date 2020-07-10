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
  declarations: null,
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

  console.log(state.declarations);
  if (state.declarations === null) {
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
          <FroalaEditor tag="textarea" config={config} model={state.declarations} onModelChange={handleChange} />
          <textarea value={this.state.myTitle} onChange={this.handleInputChange} />
        </Flex>
      </ThemeProvider>
    </Fragment>
  );
}
