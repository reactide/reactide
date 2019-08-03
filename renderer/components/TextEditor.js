import React from 'react';
import ESLintWorker from './../workers/eslint.worker';
import * as monaco from 'monaco-editor';
import PropTypes from 'prop-types';
//import { StaticServices } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices'; 
import light from './../themes/light';
import dark from './../themes/dark';

//const codeEditorService = StaticServices.codeEditorService.get();

// Disable the built-in linter
monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: true
});

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

const compilerOptions = {
  allowJs: true,
  allowSyntheticDefaultImports: true,
  alwaysStrict: true,
  jsx: 'React',
  jsxFactory: 'React.createElement',
};

// Set compiler options to typescriptDefaults and javascriptDefaults
monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions);
monaco.languages.typescript.javascriptDefaults.setCompilerOptions(compilerOptions);

monaco.editor.defineTheme('ayu-light', light);
monaco.editor.defineTheme('ayu-dark', dark);

export default class TextEditor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.editor = null;
    this._linterWorker = null;
    this.editorStates = new Map();
  }

  // Render eslint message as marker in monaco
  _updateMarkers(message) {
    window.requestAnimationFrame(() => {
      const model = this.editor.getModel();
      if (model && model.getVersionId() === message.data.version) {
        monaco.editor.setModelMarkers(model, 'eslint', message.data.markers);
      }
    });
  };

  // Pass code to eslint linterWorker for processing
  _lintCode(code) {
    const model = this.editor.getModel();

    monaco.editor.setModelMarkers(model, 'eslint', []);

    this._linterWorker.postMessage({
      code,
      version: model.getVersionId(),
    });
  };

  // Return existing model or create a new model if not exists
  _initializeFile(path) {
    const fs = window.require('fs');

    const value = fs.readFileSync(path, { encoding: 'utf-8' });
    let model = monaco.editor
      .getModels()
      .find(model => model.uri.path === path);

    if (model) {
      // If a model exists, we need to update it's value
      // This is needed because the content for the file might have been modified externally
      // Use `pushEditOperations` instead of `setValue` or `applyEdits` to preserve undo stack
      model.pushEditOperations(
        [],
        [
          {
            range: model.getFullModelRange(),
            text: value,
          },
        ]
      );
    } else {
      model = monaco.editor.createModel(
        value,
        this._getLanguage(this.props.path),
        new monaco.Uri().with({ path }),
        
      );
      model.updateOptions({
        tabSize: 2,
        insertSpaces: true,
      });
    }
    this.editor.setModel(model);
    return model;
  };

  // Setup or restore monaco model for the opening file path 
  _openFile(path) {
    let model = this._initializeFile(path);

    // Restore the editor state for the file
    const editorState = this.editorStates.get(path);

    if (editorState) {
      this.editor.restoreViewState(editorState);
    }

    // Bring browser focus to the editor text
    this.editor.focus();

    // Subscribe to change in value so we can notify the parent
    this._subscription = model.onDidChangeContent(() => {
      const value = model.getValue();
      this.props.onValueChange(value);
      this._lintCode(value);
    });
  };

  // Return language type as a string
  _getLanguage(path) {
    if (path.includes('.')) {
      switch (path.split('.').pop()) {
        case 'js':
          return 'javascript';
        case 'jsx':
          return 'javascript';
        case 'ts':
          return 'typescript';
        case 'json':
          return 'json';
        case 'css':
          return 'css';
        case 'html':
          return 'html';
        case 'md':
          return 'markdown';
        default:
          return undefined;
      }
    }
  };

  

  componentDidMount() {
    const path = window.require('path');
    const fs = window.require('fs');
    var file = fs.readFileSync(this.props.path, { encoding: 'utf8' });
    // initialize editor
    this.editor = monaco.editor.create(document.getElementById('editor-container'),
      {
        language: this._getLanguage(this.props.path),
        theme: 'ayu-dark',
        lineNumbers: 'on',
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        glyphMargin: true

      },

    );


    // Intialize the linter
    this._linterWorker = new ESLintWorker();
    this._linterWorker.addEventListener('message', (message) => { this._updateMarkers(message); });

    this._openFile(this.props.path);

  }

  componentDidUpdate(prevProps) {
    const { path/*, ...rest*/ } = this.props;

    //this._editor.updateOptions(rest); * TODO - Ryan

    if (path !== prevProps.path) {
      this.editorStates.set(prevProps.path, this.editor.saveViewState());
      this._openFile(path);
    }
    else {
      const model = this.editor.getModel();
      if (value !== model.getValue()) {
        model.pushEditOperations(
          [],
          [
            {
              range: model.getFullModelRange(),
              text: value,
            }
          ]
        );
      }
    }
  }

  componentWillUnmount() {
    // dispose to prevent memory leaks
    this._linterWorker && this._linterWorker.terminate();
    this.editor && this.editor.dispose();
    this._subscription && this._subscription.dispose();
  }

  render() {
    return (
      <div className="item-views">
        <div className="styleguide pane-item">
          <div id="editor-container" style={{ height: '100%', width: '100%' }} />
        </div>
      </div>
    );
  }
}