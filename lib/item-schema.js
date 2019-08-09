'use strict'

let uniqueId = 0;

function getExt(name) {
  let arr = name.split('.');
  if (arr.length == 1)
    return '';
  else
    return arr[arr.length - 1];
}
function File(path, name) {
  this.path = path;
  this.type = 'file';
  this.name = name;
  this.ext = getExt(name);
  this.id = uniqueId++;
}

function Directory(path, name, opened = false) {
  this.path = path;
  this.type = 'directory';
  this.name = name;
  this.opened = opened;
  this.files = [];
  this.subdirectories = [];
  this.id = uniqueId++;
}
module.exports = {File, Directory};