const expect = require('expect')
const {shallow} = require('enzyme');
const React = require('react');
const sinon = require('sinon');
const chaiEnzyme = require('chai-enzyme');
const chai = require('chai');

chai.use(chaiEnzyme());

import CreateForm from '../renderer/components/CreateForm.jsx';
import FileTree from '../renderer/components/FileTree.jsx';
import Directory from '../renderer/components/Directory.jsx';
import TextEditor from '../renderer/components/TextEditor';
import Tab from '../renderer/components/Tab';
import TextEditorPane from '../renderer/components/TextEditorPane';
import TabContainer from '../renderer/components/TabContainer';
import CreateMenu from '../renderer/components/CreateMenu';
import DeletePrompt from '../renderer/components/DeletePrompt';


describe('React Components', () => {
  describe('CreateForm', () => {

    it('should render', () => {
      const wrapper = shallow(<CreateForm />);
      expect(wrapper.exists()).toEqual(true);
    });

    it('should fire keypress event when key is pressed', () => {
      const spy = sinon.spy();
      const wrapper = shallow(<CreateForm createItem={spy}/>);
      wrapper.find('input').simulate('keyPress');
      expect(spy.called).toEqual(true);
    });
  });

  describe('FileTree', () => {

    it('should render', () => {
      const wrapper = shallow(<FileTree />);
      expect(wrapper.exists()).toEqual(true);
    });

    it('should render file tree if passed to FileTree', () => {
      const wrapper = shallow(<FileTree fileTree={true} />);
      const directory = wrapper.find(Directory);
      expect(directory.exists()).toEqual(true);
    });

    it('should not render file tree if not passed to FileTree', () => {
      const wrapper = shallow(<FileTree fileTree={false} />);
      const directory = wrapper.find(Directory);
      expect(directory.exists()).toEqual(false);
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
      const wrapper = shallow(<TextEditor id={1} activeTab={1} />);
      chai.expect(wrapper.find('.item-views')).to.have.style("display", "block");
    });

    it('should render with className \'none\' if id is not equal to active tab id', () => {
      const wrapper = shallow(<TextEditor id={1} activeTab={2} />);
      chai.expect(wrapper.find('.item-views')).to.have.style("display", "none");
    });
  });

  describe('Tab', () => {
    
    it('should render', () => {
      const wrapper = shallow(<Tab setActiveTab={()=>{}} closeTab={()=>{}}/>);
      expect(wrapper.exists()).toEqual(true);
    });

    it('should fire setActiveTab on click', () => {
      const spy = sinon.spy();
      const wrapper = shallow(<Tab setActiveTab={spy} closeTab={()=>{}} />);
      wrapper.find('li').simulate('click');
      expect(spy.called).toEqual(true);
    });

    it('should fire setActiveTab on click', () => {
      const spy = sinon.spy();
      const wrapper = shallow(<Tab closeTab={spy} setActiveTab={()=>{}} />);
      wrapper.find('.close-icon').simulate('click');
      expect(spy.called).toEqual(true);
    });

    it('should render prop name', () => {
      const wrapper = shallow(<Tab closeTab={()=>{}} setActiveTab={()=>{}} name='Reactide' />);
      expect(wrapper.find('.title').text()).toEqual('Reactide');
    });

    it('should pass id into setActiveTab', () => {
      const spy = sinon.spy();
      const wrapper = shallow(<Tab closeTab={()=>{}} setActiveTab={spy} id={1}/>)
      wrapper.find('li').simulate('click');
      expect(spy.calledWithMatch(1)).toEqual(true);
    });

    it('should pass id into closeTab', () => {
      const spy = sinon.spy();
      const wrapper = shallow(<Tab setActiveTab={()=>{}} closeTab={spy} id={1}/>)
      wrapper.find('.close-icon').simulate('click');
      expect(spy.calledWithMatch(1)).toEqual(true);
    });
  });

  describe('TextEditorPane', () => {

    it('should render', () => {
      const wrapper = shallow(<TextEditorPane appState={{openTabs:()=>{}}}/>);
      expect(wrapper.exists()).toEqual(true);
    });

    it('should render TextEditor when openTabs.length > 0', () => {
      const wrapper = shallow(<TextEditorPane appState={{openTabs:[{id:1}], activeTab:1}}/>);
      expect(wrapper.find(TextEditor).exists()).toEqual(true);
    });

    it('should render TextEditors for each open tab', () => {
      const wrapper = shallow(<TextEditorPane appState={{openTabs:[{id:1}, {id:2}], activeTab:1}}/>);
      expect(wrapper.find(TextEditor).length).toEqual(2);
    })

    it('should not render TextEditor when openTabs.length = 0', () => {
      const wrapper = shallow(<TextEditorPane appState={{openTabs:[], activeTab:1}}/>);
      expect(wrapper.find(TextEditor).exists()).toEqual(false);
    });

    it('should render a TabContainer', () => {
      const wrapper = shallow(<TextEditorPane appState={{openTabs:[], activeTab:1}}/>);
      expect(wrapper.find(TabContainer).exists()).toEqual(true);
    });

    it('should pass props to TabContainer', () => {
      const wrapper = shallow(<TextEditorPane appState={{openTabs:[], activeTab:1}} setActiveTab='setActive' closeTab='closeTab'/>);
      expect(wrapper.find(TabContainer).props().closeTab).toEqual('closeTab');
      expect(wrapper.find(TabContainer).props().setActiveTab).toEqual('setActive');
      expect(wrapper.find(TabContainer).props().appState).toEqual({openTabs:[], activeTab:1})
    });

    it('should pass props to TextEditor', () => {
      const wrapper = shallow(<TextEditorPane appState={{openTabs:[{id:1}], activeTab:1}} setActiveTab='setActive' closeTab='closeTab' addEditorInstance='coolio'/>);
      const TE = wrapper.find(TextEditor);
      expect(TE.props().id).toEqual(1);
      expect(TE.props().tab).toEqual({id:1});
      expect(TE.props().addEditorInstance).toEqual('coolio');
      expect(TE.props().activeTab).toEqual(1);
    });
  });

  describe('CreateMenu', () => {

    it('should render', () => {
      const wrapper = shallow(<CreateMenu createForm={()=>{}}/>);
      expect(wrapper.exists()).toEqual(true);
    });
    
    describe('File create onClick', () => {
      
      it('should fire', () => {
        const spy = sinon.spy();
        const wrapper = shallow(<CreateMenu createForm={spy} />);
        wrapper.find('button').first().simulate('click');
        expect(spy.called).toEqual(true);
      });

      it('should be called with proper params', () => {
        const spy = sinon.spy();
        const wrapper = shallow(<CreateMenu createForm={spy} id={1}/>);
        wrapper.find('button').first().simulate('click');
        expect(spy.calledWith(1, 'file')).toEqual(true);
      });

    });

    describe('Directory create onClick', () => {

      it('should fire', () => {
        const spy = sinon.spy();
        const wrapper = shallow(<CreateMenu createForm={spy} />);
        wrapper.find('button').at(1).simulate('click');
        expect(spy.called).toEqual(true);
      });

      it('should be called with proper params', () => {
        const spy = sinon.spy();
        const wrapper = shallow(<CreateMenu createForm={spy} id={1}/>);
        wrapper.find('button').at(1).simulate('click');
        expect(spy.calledWith(1, 'directory')).toEqual(true);
      });
    });
  });

  describe('DeletePrompt', () => {

    it('should render', () => {
      const wrapper = shallow(<DeletePrompt deletePromptHandler={()=>{}}/>);
      expect(wrapper.exists()).toEqual(true);
    });

    it('should render prop name', () => {
      const wrapper = shallow(<DeletePrompt deletePromptHandler={()=>{}} name='Jonny Greenwood'/>);
      expect(wrapper.find('h1').text()).toEqual('Are you sure you want to delete Jonny Greenwood?');
    });

    it('should be false when no is clicked', () => {
      const spy = sinon.spy();
      const wrapper = shallow(<DeletePrompt deletePromptHandler={spy} name='Jonny Greenwood'/>);
      wrapper.find('button').first().simulate('click');
      expect(spy.calledWith(false)).toEqual(true);
    });

    it('should be true when yes is clicked', () => {
      const spy = sinon.spy();
      const wrapper = shallow(<DeletePrompt deletePromptHandler={spy} name='Jonny Greenwood'/>);
      wrapper.find('button').at(1).simulate('click');
      expect(spy.calledWith(true)).toEqual(true);
    });
  });
});