import * as ts from 'typescript';
import * as Lint from 'tslint';
import { IOptions } from 'tslint/lib/language/rule/rule';

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
export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new TypescriptAngularFilenameWalker(sourceFile, this.getOptions()));
  }
}

// The walker takes care of all the work.
class TypescriptAngularFilenameWalker extends Lint.RuleWalker {
  private allAllowed: string[] = [];
  private failureMessage = 'The filename must end with:';
  private prefix = [
    'component',
    'service',
    'module',
    'directive',
    'model',
    'pipe',
    'tools'
  ];
  private suffix = [
    'ts',
    'spec.ts',
  ];
  private ignore = [
    'public_api.ts'
  ];

  constructor(sourceFile: ts.SourceFile, options: IOptions) {
    super(sourceFile, options);
    this.computeAllAllowed(options);

    this.failureMessage = this.failureMessage + this.allAllowed.join(' OR ');
  }

  public visitSourceFile(node: ts.SourceFile): void {
    const filename = this.getFilenameFromCompletePath(node.fileName);
    const extension = this.getExtension(filename);

    if (extension === 'ts') {
      if (!this.isFilenameAllowed(filename)) {
        this.addFailure(this.createFailure(node.getStart(), node.getEnd(), node.fileName + this.failureMessage));
      }
    }

    // call the base version of this visitor to actually parse this node
    super.visitSourceFile(node);
  }

  private getFilenameFromCompletePath(path: string): string {
    const completeFilename = path;
    const splitted = completeFilename.split('/');

    return splitted.pop();
  }

  private getExtension(filename: string): string {
    const dotSplited = filename.split('.');
    return dotSplited.pop();
  }

  private isFilenameAllowed(filename: string): boolean {
    for (let index = 0; index < this.allAllowed.length; index++) {
      const allowed: string = this.allAllowed[index];
      if (filename.includes(allowed)) {
        return true;
      }
    }

    return false;
  }

  private computeAllAllowed(options: IOptions): void {
    let prefix = this.prefix;
    let suffix = this.suffix;
    let ignore = this.ignore;

    if (options.ruleArguments[0]) {
      const args = options.ruleArguments[0];
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

    prefix.forEach ((prefixEl) => {
      suffix.forEach((suffixEl) => {
        this.allAllowed.push('.' + prefixEl + '.' + suffixEl);
      });
    });

    ignore.forEach((value: string) => {
      this.allAllowed.push(value);
    });
  }
}
