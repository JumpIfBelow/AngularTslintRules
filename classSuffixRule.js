"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Lint = require("tslint");
/**
 * Enable the rule in your tslint.json
 * "class-suffix": true,
 *
 * You can use custom prefix, suffix and ignored names:
 *
 * "class-suffix": [true, {
      "prefix": [
        "component",
        "service",
        "module",
        "directive",
        "model",
        "pipe",
        "tools"
      ],
      "suffix": [
        "'ts",
        "spec.ts","
      ],
      "ignore": [
        "public_api.ts"
      ]
    }],
 */
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new TypescriptAngularFilenameWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
// The walker takes care of all the work.
var TypescriptAngularFilenameWalker = (function (_super) {
    __extends(TypescriptAngularFilenameWalker, _super);
    function TypescriptAngularFilenameWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.allAllowed = [];
        _this.failureMessage = 'The filename must end with:';
        _this.computeAllAllowed(options);
        _this.failureMessage = _this.failureMessage + _this.allAllowed.join(' OR ');
        return _this;
    }
    TypescriptAngularFilenameWalker.prototype.visitSourceFile = function (node) {
        var filename = this.getFilenameFromCompletePath(node.fileName);
        var extension = this.getExtension(filename);
        if (extension === 'ts') {
            if (!this.isFilenameAllowed(filename)) {
                this.addFailure(this.createFailure(node.getStart(), node.getEnd(), node.fileName + this.failureMessage));
            }
        }
        // call the base version of this visitor to actually parse this node
        _super.prototype.visitSourceFile.call(this, node);
    };
    TypescriptAngularFilenameWalker.prototype.getFilenameFromCompletePath = function (path) {
        var completeFilename = path;
        var splitted = completeFilename.split('/');
        return splitted.pop();
    };
    TypescriptAngularFilenameWalker.prototype.getExtension = function (filename) {
        var dotSplited = filename.split('.');
        return dotSplited.pop();
    };
    TypescriptAngularFilenameWalker.prototype.isFilenameAllowed = function (filename) {
        for (var index = 0; index < this.allAllowed.length; index++) {
            var allowed = this.allAllowed[index];
            if (filename.includes(allowed)) {
                return true;
            }
        }
        return false;
    };
    TypescriptAngularFilenameWalker.prototype.computeAllAllowed = function (options) {
        var _this = this;
        var prefix = TypescriptAngularFilenameWalker.prefix;
        var suffix = TypescriptAngularFilenameWalker.suffix;
        var ignore = TypescriptAngularFilenameWalker.ignore;
        if (options.ruleArguments[0]) {
            var args = options.ruleArguments[0];
            if (args['prefix']) {
                prefix = args['prefix'];
            }
            if (args['suffix']) {
                suffix = args['suffix'];
            }
            if (args['ignore']) {
                ignore = args['ignore'];
            }
        }
        prefix.forEach(function (prefix) {
            suffix.forEach(function (suffix) {
                _this.allAllowed.push('.' + prefix + '.' + suffix);
            });
        });
        ignore.forEach(function (value) {
            _this.allAllowed.push(value);
        });
    };
    return TypescriptAngularFilenameWalker;
}(Lint.RuleWalker));
TypescriptAngularFilenameWalker.prefix = [
    'component',
    'service',
    'module',
    'directive',
    'model',
    'pipe',
    'tools'
];
TypescriptAngularFilenameWalker.suffix = [
    'ts',
    'spec.ts',
];
TypescriptAngularFilenameWalker.ignore = [
    'public_api.ts'
];
