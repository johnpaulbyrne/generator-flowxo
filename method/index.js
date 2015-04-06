'use strict';
var util = require('util');
var fs = require('fs');
var path = require('path');
var yeoman = require('yeoman-generator');
var _ = require('lodash');
var chalk = require('chalk');
var FlowXOUtils = require('../utils');

var FlowXOMethodGenerator = module.exports = function FlowXOMethodGenerator(args, options) {
  yeoman.generators.Base.apply(this,arguments);
};

util.inherits(FlowXOMethodGenerator,yeoman.generators.Base);

FlowXOMethodGenerator.prototype.prompts = function prompts(){
  var done = this.async();
  var self = this;

  var onPromptComplete = function(props){
    _.assign(self,props);

    if(props.type === 'action'){
      self.kind = 'task'
    }else{
      self.kind = 'trigger'
    }
    done();
  };

  var prompts = [
    // Name
    {
      type: 'input',
      name: 'name',
      message: 'What is the user-visible name of the method e.g. Add a Document',
      default: self.name
    },
    // Slug
    {
      type: 'input',
      name: 'slug',
      message: 'What slug would you like for the method? e.g. add_a_document',
      default: function(answers){
        return _.snakeCase(answers.name);
      }
    },
    // Type
    {
      type: 'list',
      name: 'type',
      message: 'What type of method is it?',
      choices: ['Poller','Action'],
      filter: function(val){
        return val.toLowerCase()
      }
    },
    // Scripts
    {
      type: 'checkbox',
      name: 'scripts',
      message: 'Select which scripts you would like to generate for the method.',
      choices: [{
        name: 'Custom Input',
        value: 'input',
      },{
        name: 'Custom Output',
        value: 'output'
      }]
    }
  ];

  this.prompt(prompts,onPromptComplete);
};

FlowXOMethodGenerator.prototype.fieldPrompts = function fieldPrompts(){
  var done = this.async();



  done();
};

FlowXOMethodGenerator.prototype.methodFiles = function coreFiles(){
  var methodDir = path.join('methods',this.slug);
  this.mkdir(methodDir);

  // First write the tests ;)
  this.template('_method.spec.js','tests/'+this.slug+'.spec.js');

  this.destinationRoot(methodDir);
  this.template('_config.js','config.js');
  this.template('_run.js','run.js');
  if(this.scripts.indexOf('input')!==-1){
    this.template('_input.js','input.js');
  }
  if(this.scripts.indexOf('output')!==-1){
    this.template('_output.js','output.js');
  }
};
