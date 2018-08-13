## Design

Catanie uses the [Angular 2 Material library](https://material.angular.io/) for the design of components and interfaces. This makes it easy to handle responsive design as well as reuse components with consistency. For more information on the Material design, see [here](https://material.io/guidelines/).



## SCSS

With Angular Material \(and Angular CLI\) comes support for SCSS \(Sassy CSS\) and is a superset of CSS. Now, you have the option  for CSS or SCSS in your components \(just make sure the extension is correct in the Typescript file as well\); Angular CLI will automagically handle the extension in this project.

### Themes

This project currently uses 2 themes: light and dark. To access the variables used in these themes, the component must use an SCSS file and import the file directly. You can then access variables directly.

### Mixins

Mixins are a collection of rules that are defined and can be reused by using the `@include`syntax. Using a mixin







