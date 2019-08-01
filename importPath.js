
const fs = require('fs');
const path = require('path');
const flowParser = require('flow-parser');

/**
 *  Iterates through AST Object and returns the entry point for the Class or Function Block;
 * @param {Object} obj AST JSON Object
 */
function getClassEntry(obj) {
  let entry = null;
  // Start lookup if Program body has ClassDeclaration or inside ExportDefaultDeclaration has ClassDeclaration
  for (let elem of obj.body) {
    if (elem.type === 'ClassDeclaration') {
      return entry = elem.body;
    }
    else if (elem.type === 'ExportDefaultDeclaration' && elem.declaration.type === 'ClassDeclaration') {
      return entry = elem.declaration.body;
    }
  }
  return entry;
}
/**
 *  grabs state of stateful Component if available;
 * @param {Object} obj AST object created from file at Class Block
 */
function grabState(obj) {
  let ret = [];
  let entry = getClassEntry(obj);
  if (entry) ret = digStateInClassBody(entry);
  return ret;
}
/**
 * traverses through AST object and returns entry point for constructor Object;
 * @param {Object} obj - classBody object from AST 
 */
function digStateInClassBody(obj) {
  if (obj.type !== 'ClassBody')
    return;
  let ret = [];
  obj.body.forEach((elem) => {
    if (elem.type = "MethodDefinition" && elem.key.name === "constructor") {
      ret = digStateInBlockStatement(elem.value.body);
    }
  });
  return ret;
}

function parseNestedObjects(stateValue, nested=false){
  //check if the array is nested. Only use for arrays
  const curr = nested ? stateValue : stateValue.value;
  if(curr.type === 'ObjectExpression'){
    //iterate through object properties and store them in values
    let values = {}
    for(let key in stateValue.value.properties){
      values[key] = parseNestedObjects(stateValue.value.properties[key])
    }
    return values
  }
  else if(curr.type === 'ArrayExpression'){
    let values = []
    let currObj = curr.elements;
    for(let key in currObj){
      values.push(parseNestedObjects(currObj[key],true))
    }
    return values
  }
  else {
    return curr.value;
  }
}
/**
 * traverses through AST BlockStatement object and returns the state of Component;
 * @param {*} obj 
 */
function digStateInBlockStatement(obj) {
  if (obj.type !== 'BlockStatement') return;
  let ret = {};
  obj.body.forEach((element) => {
    if (element.type === "ExpressionStatement" && element.expression.type === "AssignmentExpression")
      if (element.expression.left.property.name === 'state') {
        if (element.expression.right.type === "ObjectExpression"){
           element.expression.right.properties.forEach(elem => {
            //  ret[elem.key.name] = elem.value.value;
            ret[elem.key.name] = parseNestedObjects(elem)
            console.log('parseNestedObjects return value', parseNestedObjects(elem))
          });
        }
      }
  });
  console.log('return' ,ret)
  return ret;
 }

 /**
  *  parses through AST Object and returns an object of props 
  * @param {Array} arrOfAttr - Array of AST Object attributes
  */
function grabAttr(arrOfAttr) {
  return arrOfAttr.reduce((acc, curr) => {
    console.log('this is reduce 104', curr)
    if (curr.value.type === 'JSXExpressionContainer') {
      if (curr.value.expression.type === 'ArrowFunctionExpression' || curr.value.expression.type === 'FunctionExpression') {
        if(curr.value.expression.body.body) {
          console.log('line 108 curr.name.name = ', curr.name.name)
          console.log('line 109 curr.value.expression.body.body[0].expression.callee.name = ', curr.value.expression.body.body[0].expression.callee.name)
          acc[curr.name.name] = curr.value.expression.body.body[0].expression.callee.name
        } else {
          console.log('line 112 curr.name.name = ', curr.name.name)
          console.log('line 113 curr.value.expression.body.callee.name = ', curr.value.expression.body.callee.name)
          acc[curr.name.name] = curr.value.expression.body.callee.name
        }
      } else if (curr.value.expression.type === 'Literal') {
          acc[curr.name.name] = curr.value.expression.value;
      } else if (curr.value.expression.type === 'MemberExpression') {
          acc[curr.name.name] = curr.value.expression.property.name;
      } else if (curr.value.expression.type === 'ConditionalExpression') {
        let condition, consequent, alternate;
          if(curr.value.expression.test.type === 'MemberExpression') {
            condition = curr.value.expression.test.property.name;
          } else{
            condition = curr.value.expression.test.name;
          }
          if(curr.value.expression.consequent.type === 'MemberExpression') {
            consequent = curr.value.expression.consequent.property.name;
          } else{
            consequent = curr.value.expression.consequent.name;
          }
          if(curr.value.expression.alternate.type === 'MemberExpression') {
            alternate = curr.value.expression.alternate.property.name;
          } else{
            alternate = curr.value.expression.consequent.name;
          }
          acc[curr.name.name + 'True'] = {condition: condition, value:consequent};

          acc[curr.name.name + 'False'] = {condition: condition, value: alternate}
      } else {
          acc[curr.name.name] = curr.value.expression.name;
      }
    } else {
      acc[curr.name.name] = curr.value.value;
    }
    return acc;
  },{})
};
/**
 * returns an Array of Objects with the name and path of IMPORT objects
 * @param {Object} json- AST Object
 */
function grabImportNameAndPath(json) {
  console.log('this is json in GINAP', json)
  let output;
  const importObjectArr = json.body.filter((importObj) => {
    if (importObj.type === 'ImportDeclaration') {
      return {
        importObj
      }
    }
  })
  output = importObjectArr.map((importObj) => {
    if (importObj.specifiers[0]) {
      return {
        name: importObj.specifiers[0].local.name,
        path: importObj.source.value,
      }
    }
  })
  output = output.filter((obj) => {
    if (obj) {
      return obj;
    }
  })
  return output;
}
/**
 *  returns an Object with Component name and props from AST Object;
 * @param {Object} returnObj - AST object  
 */
const constructComponentProps = (returnObj) => {
  const output = {};
  output[returnObj.openingElement.name.name] = grabAttr(returnObj.openingElement.attributes)
  return output;
}
/**
 *  returns Object with name and props of current Component;
 * @param {String} jsxPath - Path of file to convert into a AST object
 */
function constructSingleLevel(jsxPath) {
  console.log('this is jsx path l 191', jsxPath);
  let reactObj = {};
  // grabs content from file and creates an AST Object
  const fileContent = fs.readFileSync(jsxPath, { encoding: 'utf-8' });
  let jsonObj = flowParser.parse(fileContent);
  // checks for Components in imports section  
  let imports = grabImportNameAndPath(jsonObj);
  let componentTags = grabChildComponents(imports, fileContent);
  // checks if component is Stateful and grabs state;
  let state = grabState(jsonObj);
  // iterates through components array and creates object with Component name, props and path;
  if (componentTags !== null){
    componentTags.forEach(elem => {
      let ast = flowParser.parse(elem).body[0].expression
      reactObj = Object.assign(reactObj, constructComponentProps(ast));
    });
    imports = imports.filter(comp => {
        comp.props = reactObj[comp.name]
        return Object.keys(reactObj).includes(comp.name);
    });
  } else {
    imports = [];
  }
  let outputObj = {
    name: path.basename(jsxPath).split('.')[0],
    childProps: imports,
    stateProps: state,
    children: []
  }
  return outputObj;
}
/**
 * recursively traverses through all folders given from filePath and creates JSON Object;
 * @param {String} filePath Path to Component folder
 * @param {String} rootPath - name of File
 */
function constructComponentTree(filePath, rootPath) {
  // create object at current level;
  let result = constructSingleLevel(path.join(rootPath, filePath));
  console.log(result, 'this is result l224')
  // checks if current Object has children and traverses through children to create Object;
  if(result && Object.keys(result.childProps).length > 0){
    for(let childProp of result.childProps) {
      console.log(childProp, 'this is childProp line 227 importPath')
      //creates new path for children components - if girootPath doesnt have an extension adds .js extension
      let fullPath = path.join(rootPath, childProp.path);
      let newRootPath = path.dirname(fullPath);
      let newFileName = path.basename(fullPath);
      let childPathSplit = newFileName.split('.');
      if (childPathSplit.length === 1)
        newFileName += '.js';
      let newFullPath = path.join(newRootPath, newFileName);
      //traverses through children 
      result.children.push(constructComponentTree(newFileName, newRootPath));
    }
  }  
  console.log(result, 'this is result line 239 importPath')
  return result;
}
/**
 * returns an array of React Components in String Format, checks imports array and filters fileContent to find Components;
 * @param {Array} imports - Array of Objects with name and path of all Import Objects;
 * @param {String} fileContent - String of File Content;
 */
function grabChildComponents(imports, fileContent) {
  // grab all import object name from import array;
  let compNames = imports.reduce((arr, cur) => {
    // skips <Provider/> component from redux
    if (cur.name !== 'Provider') {
      arr.push(cur.name);
    }
    return arr;
  }, []);
  // format all import names for regex
  compNames = compNames.join('|');
  let pattern = '<\s*(' + compNames + ')(>|(.|[\r\n])*?[^?]>)'
  const regExp = new RegExp(pattern, 'g');
  // finds all components that match imports;
  let matchedComponents = fileContent.match(regExp);

  return matchedComponents;
}
module.exports = {grabChildComponents, constructComponentTree, constructSingleLevel, constructComponentProps, grabImportNameAndPath, grabAttr, digStateInBlockStatement, digStateInClassBody, grabState, getClassEntry}
