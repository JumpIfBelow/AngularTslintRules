# AngularTslintRules

Extra rules for tslint with angular

 Enable the rule in your tslint.json:
```
  "class-suffix": true,
 ```

## class-suffix
This rule check that the Typescript files contains a combination  of prefix + '.' + suffix.

Example: 'app.module.ts', 'app.component.ts', 'app.component.spec.ts'


You can use custom the rule:
```
 "class-suffix": [true, {
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
```