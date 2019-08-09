const expect = require('expect')
const {shallow} = require('enzyme');
const React = require('react');
const sinon = require('sinon');
const chaiEnzyme = require('chai-enzyme');
const chai = require('chai');
const Application = require('spectron').Application;
const path = require('path');

chai.use(chaiEnzyme());

import App from '../renderer/components/App';
import CreateForm from '../renderer/components/CreateForm';
import CreateMenu from '../renderer/components/CreateMenu';
import DeletePrompt from '../renderer/components/DeletePrompt';
import File from '../renderer/components/File';
import FileTree from '../renderer/components/FileTree';
import Directory from '../renderer/components/Directory';
import TextEditor from '../renderer/components/TextEditor';
import Tab from '../renderer/components/Tab';
import TabContainer from '../renderer/components/TabContainer'
import TextEditorPane from '../renderer/components/TextEditorPane';
import RenameForm from '../renderer/components/RenameForm';

describe('React Components', () => {


  describe('CreateForm', () => {

    it('should render', () => {
      const wrapper = shallow(
      <CreateForm 
        createItem={()=>{}}
      />);
      expect(wrapper.exists()).toEqual(true);
    });

    it('should fire keypress event when key is pressed', () => {
      const spy = sinon.spy();
      const wrapper = shallow(
        <CreateForm
          createItem={spy}
        />
      );
      wrapper.find('input').simulate('keyPress');
      expect(spy.called).toEqual(true);
    });
  });

  describe('CreateMenu', () => {

    it('should render', () => {
      const wrapper = shallow(
        <CreateMenu
          createMenuHandler={() => { }}
          id={1}
        />
      );
      expect(wrapper.exists()).toEqual(true);
    });

    describe('File create onClick', () => {

      it('should fire', () => {
        const spy = sinon.spy();
        const wrapper = shallow(
          <CreateMenu
            createMenuHandler={spy}
            id={1}
          />
        );
        wrapper.find('button').first().simulate('click');
        expect(spy.called).toEqual(true);
      });

      it('should be called with proper params', () => {
        const spy = sinon.spy();
        const wrapper = shallow(
          <CreateMenu
            createMenuHandler={spy}
            id={1}
          />
        );
        wrapper.find('button').first().simulate('click');
        expect(spy.calledWith(1, 'file')).toEqual(true);
      });

    });

    describe('Directory create onClick', () => {

      it('should fire', () => {
        const spy = sinon.spy();
        const wrapper = shallow(
          <CreateMenu
            createMenuHandler={spy}
          />
        );
        wrapper.find('button').at(1).simulate('click');
        expect(spy.called).toEqual(true);
      });

      it('should be called with proper params', () => {
        const spy = sinon.spy();
        const wrapper = shallow(
          <CreateMenu
            createMenuHandler={spy}
            id={1}
          />
        );
        wrapper.find('button').at(1).simulate('click');
        expect(spy.calledWith(1, 'directory')).toEqual(true);
      });
    });
  });

  describe('DeletePrompt', () => {

    it('should render', () => {
      const wrapper = shallow(
        <DeletePrompt
          deletePromptHandler={() => { }}
        />
      );
      expect(wrapper.exists()).toEqual(true);
    });

    it('should render prop name', () => {
      const wrapper = shallow(
        <DeletePrompt
          deletePromptHandler={() => { }}
          name="Jonny Greenwood"
        />
      );
      expect(wrapper.find('h1').text()).toEqual('Are you sure you want to delete Jonny Greenwood?');
    });

    it('should be false when no is clicked', () => {
      const spy = sinon.spy();
      const wrapper = shallow(
        <DeletePrompt
          deletePromptHandler={spy}
          name="Jonny Greenwood"
        />
      );
      wrapper.find('button').first().simulate('click');
      expect(spy.calledWith(false)).toEqual(true);
    });

    it('should be true when yes is clicked', () => {
      const spy = sinon.spy();
      const wrapper = shallow(
        <DeletePrompt
          deletePromptHandler={spy}
          name="Jonny Greenwood"
        />
      );
      wrapper.find('button').at(1).simulate('click');
      expect(spy.calledWith(true)).toEqual(true);
    });
  });

  describe('Directory', () => {

    it('should render', () => {
      const wrapper = shallow(
        <Directory
          directory={{ subdirectories: [], files: [] }}
          clickHandler={() => { }}
          openCreateMenu={() => { }}
          selectedItem={{ id: 1 }}
          createMenuInfo={{ id: 1 }}
        />
      );
      expect(wrapper.exists()).toEqual(true);
    });

    it('should render the right amount of subdirectories', () => {
      const wrapper = shallow(
        <Directory
          directory={{ subdirectories: [{ id: 1 }, { id: 2 }], files: [], opened: true }}
          clickHandler={() => { }}
          openCreateMenu={() => { }}
          selectedItem={{ id: 1 }}
          createMenuInfo={{ id: 1 }}
        />
      );
      expect(wrapper.find(Directory).length).toEqual(2);
    });

    it('should render the right amount of files', () => {
      const wrapper = shallow(
        <Directory
          directory={{ subdirectories: [], files: [{ id: 1 }, { id: 2 }], opened: true }}
          clickHandler={() => { }}
          openCreateMenu={() => { }}
          selectedItem={{ id: 1 }}
          createMenuInfo={{ id: 1 }}
        />
      );
      expect(wrapper.find(File).length).toEqual(2);
    });

    it('should render the right amount of both subdirectories and files', () => {
      const wrapper = shallow(
        <Directory
          directory={{ subdirectories: [{ id: 1 }, { id: 2 }], files: [{ id: 1 }, { id: 2 }], opened: true }}
          clickHandler={() => { }}
          openCreateMenu={() => { }}
          selectedItem={{ id: 1 }}
          createMenuInfo={{ id: 1 }}
        />
      );
      expect(wrapper.find(File).length).toEqual(2);
      expect(wrapper.find(Directory).length).toEqual(2);
    });

    it('shouldn\'t render any subdirectories or files if directory.opened = false', () => {
      const wrapper = shallow(
        <Directory
          directory={{ subdirectories: [{ id: 1 }, { id: 2 }], files: [{ id: 1 }, { id: 2 }], opened: false }}
          clickHandler={() => { }}
          openCreateMenu={() => { }}
          selectedItem={{ id: 1 }}
          createMenuInfo={{ id: 1 }}
        />
      );
      expect(wrapper.find(File).length).toEqual(0);
      expect(wrapper.find(Directory).length).toEqual(0);
    });

    it('should invoke clickHandler on click', () => {
      const spy = sinon.spy();
      const wrapper = shallow(
        <Directory
          directory={{ subdirectories: [], files: [] }}
          clickHandler={spy}
          openCreateMenu={() => { }}
          selectedItem={{ id: 1 }}
          createMenuInfo={{ id: 1 }}
        />
      );
      wrapper.find('.list-item').simulate('click');
      expect(spy.called).toEqual(true);
    });

    it('should invoke clickHandler with the right arguments', () => {
      const spy = sinon.spy();
      const wrapper = shallow(
        <Directory
          directory={{ subdirectories: [], files: [], path: 'light', type: 'my' }}
          clickHandler={spy}
          openCreateMenu={() => { }}
          selectedItem={{ id: 1 }}
          createMenuInfo={{ id: 1 }}
          id={1}
        />
      );
      wrapper.find('.list-item').simulate('click');
      expect(spy.calledWith(1, 'light', 'my')).toEqual(true);
    });

    it('should render CreateMenu if openMenuId is equal to id', () => {
      const wrapper = shallow(
        <Directory
          directory={{ subdirectories: [], files: [] }}
          clickHandler={() => { }}
          openCreateMenu={() => { }}
          selectedItem={{ id: 1 }}
          createMenuInfo={{ id: 1 }}
          id={1}
          openMenuId={1}
        />);
      expect(wrapper.find(CreateMenu).exists()).toEqual(true);
    });

    it('shouldn\'t render CreateMenu if openMenuId is not equal to id', () => {
      const wrapper = shallow(
        <Directory
          directory={{ subdirectories: [], files: [] }}
          clickHandler={() => { }}
          openCreateMenu={() => { }}
          selectedItem={{ id: 1 }}
          createMenuInfo={{ id: 1 }}
          id={1}
          openMenuId={2}
        />
      );
      expect(wrapper.find(CreateMenu).exists()).toEqual(false);
    });

    it('should render CreateForm if createMenuInfo.id is equal to id', () => {
      const wrapper = shallow(
        <Directory
          directory={{ subdirectories: [], files: [] }}
          clickHandler={() => { }}
          openCreateMenu={() => { }}
          selectedItem={{ id: 1 }}
          createMenuInfo={{ id: 1 }}
          id={1}
          openMenuId={2}
        />
      );
      expect(wrapper.find(CreateForm).exists()).toEqual(true);
    });

    it('should not render CreateForm if createMenuInfo.id is not equal to id', () => {
      const wrapper = shallow(
        <Directory
          directory={{ subdirectories: [], files: [] }}
          clickHandler={() => { }}
          openCreateMenu={() => { }}
          selectedItem={{ id: 1 }}
          createMenuInfo={{ id: 2 }}
          id={1}
          openMenuId={2}
        />
      );
      expect(wrapper.find(CreateForm).exists()).toEqual(false);
    });

    it('item should have class name selected if selected (selectedItem.id === id)', () => {
      const wrapper = shallow(
        <Directory
          directory={{ subdirectories: [], files: [] }}
          clickHandler={() => { }}
          openCreateMenu={() => { }}
          selectedItem={{ id: 1 }}
          createMenuInfo={{ id: 2 }}
          id={1}
          openMenuId={2}
        />
      );
      expect(wrapper.find('.list-nested-item .selected').exists()).toEqual(true);
    });

    it('item should not have class name selected if not selected (selectedItem.id !== id)', () => {
      const wrapper = shallow(
        <Directory
          directory={{ subdirectories: [], files: [] }}
          clickHandler={() => { }}
          openCreateMenu={() => { }}
          selectedItem={{ id: 2 }}
          createMenuInfo={{ id: 2 }}
          id={1}
          openMenuId={2}
        />
      );
      expect(wrapper.find('.list-nested-item .selected').exists()).toEqual(false);
    });

    it('should render RenameForm if renameFlag && selectedItem.id === id', () => {
      const wrapper = shallow(
        <Directory
          directory={{ subdirectories: [], files: [] }}
          clickHandler={() => { }}
          openCreateMenu={() => { }}
          selectedItem={{ id: 1 }}
          createMenuInfo={{ id: 2 }}
          id={1}
          openMenuId={2}
          renameFlag={true}
        />
      );
      expect(wrapper.find(RenameForm).exists()).toEqual(true);
    });

    it('should not render RenameForm if renameFlag && selectedItem.id !== id', () => {
      const wrapper = shallow(
        <Directory
          directory={{ subdirectories: [], files: [] }}
          clickHandler={() => { }}
          openCreateMenu={() => { }}
          selectedItem={{ id: 2 }}
          createMenuInfo={{ id: 2 }}
          id={1}
          openMenuId={2}
          renameFlag={false}
        />
      );
      expect(wrapper.find(RenameForm).exists()).toEqual(false);
    });

    it('should not render the directory/file if renameFlag && selectedItem.id === id', () => {
      const wrapper = shallow(
        <Directory
          directory={{ subdirectories: [], files: [] }}
          clickHandler={() => { }}
          openCreateMenu={() => { }}
          selectedItem={{ id: 1 }}
          createMenuInfo={{ id: 2 }}
          id={1}
          openMenuId={2}
          renameFlag={true}
        />
      );
      expect(wrapper.find('.list-item').exists()).toEqual(false);
    });
  });

  describe('File', () => {
    it('should render', () => {
      const wrapper = shallow(
        <File
          selectedItem={{ id: 1 }}
          file={{ path: '', name: '' }}
          dblClickHandler={() => { }}
          clickHandler={() => { }}
        />
      );
      expect(wrapper.exists()).toEqual(true);
    });

    it('should call dblClickHandler on doubleClick', () => {
      const spy = sinon.spy();
      const wrapper = shallow(
        <File
          selectedItem={{ id: 1 }}
          file={{ path: '', name: '' }}
          dblClickHandler={spy}
          clickHandler={() => { }}
        />
      );
      wrapper.simulate('doubleClick');
      expect(spy.called).toEqual(true);
    });

    it('should call dblClickHandler with file on doubleClick', () => {
      const spy = sinon.spy();
      const wrapper = shallow(
        <File
          selectedItem={{ id: 1 }}
          file={{ path: 'a', name: 'a' }}
          dblClickHandler={spy}
          clickHandler={() => { }}
        />
      );
      wrapper.simulate('doubleClick');
      expect(spy.calledWith({ path: 'a', name: 'a' })).toEqual(true);
    });

    it('should call clickHandler on single click', () => {
      const spy = sinon.spy();
      const wrapper = shallow(
        <File
          selectedItem={{ id: 1 }}
          file={{ path: '', name: '' }}
          dblClickHandler={() => { }}
          clickHandler={spy}
        />
      );
      wrapper.simulate('click');
      expect(spy.called).toEqual(true);
    });

    it('should call clickHandler with id and file.path on single click', () => {
      const spy = sinon.spy();
      const wrapper = shallow(
        <File
          selectedItem={{ id: 1 }}
          id={1}
          file={{ path: 'a', name: '' }}
          dblClickHandler={() => { }}
          clickHandler={spy}
        />
      );
      wrapper.simulate('click');
      expect(spy.calledWith(1, 'a')).toEqual(true);
    });

    it('should render the name of the file', () => {
      const wrapper = shallow(
        <File
          selectedItem={{ id: 1 }}
          file={{ path: '', name: 'Jonny Greenwood' }}
          dblClickHandler={() => { }}
          clickHandler={() => { }}
        />
      );
      expect(wrapper.find('span').text()).toEqual('Jonny Greenwood');
    });

    it('should render RenameForm if rename && selectedItem.id === id', () => {
      const wrapper = shallow(
        <File
          selectedItem={{ id: 1 }} id={1}
          renameFlag={true}
          file={{ path: '', name: 'Jonny Greenwood' }}
          dblClickHandler={() => { }}
          clickHandler={() => { }}
        />
      );
      expect(wrapper.find(RenameForm).exists()).toEqual(true);
    });

    it('should not render RenameForm if rename && selectedItem.id === id', () => {
      const wrapper = shallow(
        <File
          selectedItem={{ id: 1 }} id={1}
          renameFlag={false}
          file={{ path: '', name: 'Jonny Greenwood' }}
          dblClickHandler={() => { }}
          clickHandler={() => { }}
        />
      );
      expect(wrapper.find(RenameForm).exists()).toEqual(false);
    });

    it('should have className list-item selected if selectedItem.id === id', () => {
      const wrapper = shallow(
        <File
          selectedItem={{ id: 1 }} id={1}
          renameFlag={false}
          file={{ path: '', name: 'Jonny Greenwood' }}
          dblClickHandler={() => { }}
          clickHandler={() => { }}
        />
      );
      expect(wrapper.find('.selected').exists()).toEqual(true);
    });

    it('should not have className selected if selectedItem.id === id', () => {
      const wrapper = shallow(
        <File
          selectedItem={{ id: 1 }}
          id={2}
          renameFlag={false}
          file={{ path: '', name: 'Jonny Greenwood' }}
          dblClickHandler={() => { }}
          clickHandler={() => { }}
        />
      );
      expect(wrapper.find('.selected').exists()).toEqual(false);
    });
  });

  describe('FileTree', () => {

    it('should render', () => {
      const wrapper = shallow(<FileTree />);
      expect(wrapper.exists()).toEqual(true);
    });

    it('should render file tree if passed to FileTree', () => {
      const wrapper = shallow(
        <FileTree
          fileTree={true}
        />
      );
      const directory = wrapper.find(Directory);
      expect(directory.exists()).toEqual(true);
    });

    it('should not render file tree if not passed to FileTree', () => {
      const wrapper = shallow(
        <FileTree
          fileTree={false}
        />
      );
      const directory = wrapper.find(Directory);
      expect(directory.exists()).toEqual(false);
    });
  });

  describe('Rename Form', () => {
    it('should render', () => {
      const wrapper = shallow(
        <RenameForm
          renameHandler={() => { }}
        />
      );
      expect(wrapper.exists()).toEqual(true);
    })

    it('should call renameHandler on keyPress', () => {
      const spy = sinon.spy();
      const wrapper = shallow(
        <RenameForm
          renameHandler={spy}
        />
      );
      wrapper.find('input').simulate('keyPress');
      expect(spy.called).toEqual(true);
    });
  });

  describe('Tab', () => {

    it('should render', () => {
      const wrapper = shallow(
        <Tab
          setActiveTab={() => { }}
          closeTab={() => { }}
        />
      );
      expect(wrapper.exists()).toEqual(true);
    });

    it('should fire setActiveTab on click', () => {
      const spy = sinon.spy();
      const wrapper = shallow(
        <Tab
          setActiveTab={spy}
          closeTab={() => { }}
        />
      );
      wrapper.find('li').simulate('click');
      expect(spy.called).toEqual(true);
    });

    it('should fire setActiveTab on click', () => {
      const spy = sinon.spy();
      const wrapper = shallow(
        <Tab
          closeTab={spy}
          setActiveTab={() => { }}
        />
      );
      wrapper.find('.close-icon').simulate('click');
      expect(spy.called).toEqual(true);
    });

    it('should render prop name', () => {
      const wrapper = shallow(
        <Tab
          closeTab={() => { }}
          setActiveTab={() => { }}
          name="Reactide"
        />
      );
      expect(wrapper.find('.title').text()).toEqual('Reactide');
    });

    it('should pass id into setActiveTab', () => {
      const spy = sinon.spy();
      const wrapper = shallow(
        <Tab closeTab={() => { }}
          setActiveTab={spy} id={1}
        />
      );
      wrapper.find('li').simulate('click');
      expect(spy.calledWithMatch(1)).toEqual(true);
    });

    it('should pass id into closeTab', () => {
      const spy = sinon.spy();
      const wrapper = shallow(
        <Tab setActiveTab={() => { }}
          closeTab={spy}
          id={1}
        />
      );
      wrapper.find('.close-icon').simulate('click');
      expect(spy.calledWithMatch(1)).toEqual(true);
    });
  });

  describe('TabContainer', () => {

    it('should render', () => {
      const wrapper = shallow(
        <TabContainer
          appState={{ openTabs: [{ name: 'Jonny Greenwood', id: 1 }] }}
        />
      );
      expect(wrapper.exists()).toEqual(true);
    });

    it('should render the right amount of tabs', () => {
      const wrapper = shallow(
        <TabContainer
          appState={{ openTabs: [{ name: 'Jonny Greenwood', id: 1 }, { name: 'Thom Yorke', id: 2 }] }}
          setActiveTab={() => { }}
        />
      );
      expect(wrapper.find(Tab).length).toEqual(2);
    });
  });

  describe('TextEditor', () => {

    it('should render', () => {
      const wrapper = shallow(<TextEditor />);
      expect(wrapper.exists()).toEqual(true);
    });

    it('should render div with class editor-container', () => {
      const wrapper = shallow(<TextEditor />);
      expect(wrapper.find('.editor-container').exists()).toEqual(true);
    });

    it('should render with className \'block\' if id is equal to active tab id', () => {
      const wrapper = shallow(
        <TextEditor
          id={1}
          activeTab={1}
        />
      );
      chai.expect(wrapper.find('.item-views')).to.have.style('display', 'block');
    });

    it('should render with className \'none\' if id is not equal to active tab id', () => {
      const wrapper = shallow(
        <TextEditor
          id={1}
          activeTab={2}
        />
      );
      chai.expect(wrapper.find('.item-views')).to.have.style('display', 'none');
    });
  });

  describe('TextEditorPane', () => {

    it('should render', () => {
      const wrapper = shallow(
        <TextEditorPane
          appState={{ openTabs: () => { } }}
          setActiveTab={() => { }}
          closeTab={() => { }}
        />
      );
      expect(wrapper.exists()).toEqual(true);
    });

    it('should render TextEditor when openTabs.length > 0', () => {
      const wrapper = shallow(
        <TextEditorPane
          appState={{ openTabs: [{ id: 1 }], activeTab: 1 }}
          setActiveTab={() => { }}
          closeTab={() => { }}
        />
      );
      expect(wrapper.find(TextEditor).exists()).toEqual(true);
    });

    it('should render TextEditors for each open tab', () => {
      const wrapper = shallow(
        <TextEditorPane
          appState={{ openTabs: [{ id: 1 }, { id: 2 }], activeTab: 1 }}
          setActiveTab={() => { }}
          closeTab={() => { }}
        />
      );
      expect(wrapper.find(TextEditor).length).toEqual(2);
    })

    it('should not render TextEditor when openTabs.length = 0', () => {
      const wrapper = shallow(
        <TextEditorPane
          appState={{ openTabs: [], activeTab: 1 }}
          setActiveTab={() => { }}
          closeTab={() => { }}
        />
      );
      expect(wrapper.find(TextEditor).exists()).toEqual(false);
    });

    it('should render a TabContainer', () => {
      const wrapper = shallow(
        <TextEditorPane
          appState={{ openTabs: [], activeTab: 1 }}
          setActiveTab={() => { }}
          closeTab={() => { }}
        />
      );
      expect(wrapper.find(TabContainer).exists()).toEqual(true);
    });

    it('should pass props to TabContainer', () => {
      const wrapper = shallow(
        <TextEditorPane
          appState={{ openTabs: [], activeTab: 1 }}
          setActiveTab={() => { return 1 }}
          closeTab={() => { return 1 }}
          addEditorInstance={() => { return 1 }}
        />
      );
      expect(wrapper.find(TabContainer).props().closeTab()).toEqual(1);
      expect(wrapper.find(TabContainer).props().setActiveTab()).toEqual(1);
      expect(wrapper.find(TabContainer).props().appState).toEqual({ openTabs: [], activeTab: 1 })
    });

    it('should pass props to TextEditor', () => {
      const wrapper = shallow(
        <TextEditorPane
          appState={{ openTabs: [{ id: 1 }], activeTab: 1 }}
          activeTab={1}
          setActiveTab={() => { return 1 }}
          closeTab={() => { return 1 }}
          addEditorInstance={() => { return 1 }}
        />
      );
      const TE = wrapper.find(TextEditor);
      expect(TE.props().id).toEqual(1);
      expect(TE.props().tab).toEqual({ id: 1 });
      expect(TE.props().addEditorInstance()).toEqual(1);
      expect(TE.props().activeTab).toEqual(1);
    });
  });
});
