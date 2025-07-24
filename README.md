# FlowAccount Angular Prototype

A frontend prototype for the new version of FlowAccount.com, built with Angular 20. This project demonstrates new branding, design language, and in-app interface concepts with a comprehensive **Learning Center system** that serves as the central content repository for all user guidance.

## Learning Center - Central Content Repository 🎯

The Learning Center serves as the single source of truth for all learning content in FlowAccount, providing structured guidance through a **Goals → Workflows → Tasks** hierarchy. Other system components can easily integrate with it to provide contextual help, guided experiences, and structured learning paths.

**Current Integrations:**
- ✅ Get Started Dashboard (Quick Guide Categories)
- 🚧 Help Centre Right Panel (Next: task instructions integration)

**📚 Complete Documentation:**
- **Component Overview**: [`src/app/components/learning-center/README.md`](src/app/components/learning-center/README.md)
- **API Reference**: [`src/app/components/learning-center/docs/API_REFERENCE.md`](src/app/components/learning-center/docs/API_REFERENCE.md)
- **Integration Guide**: [`src/app/components/learning-center/docs/INTEGRATION_GUIDE.md`](src/app/components/learning-center/docs/INTEGRATION_GUIDE.md)

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
