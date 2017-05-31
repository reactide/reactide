'use strict'

let uniqueId = 0;

function File(path, name) {
  this.path = path;
  this.type = 'file';
  this.name = name;
  this.id = uniqueId++;
}

function Directory(path, name) {
  this.path = path;
  this.type = 'directory';
  this.name = name;
  this.opened = false;
  this.files = [];
  this.subdirectories = [];
  this.id = uniqueId++;
}
module.exports = {File, Directory};