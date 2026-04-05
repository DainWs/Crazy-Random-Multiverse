# Code of Conduct

## Language Rules
- All written content must be in English.
- This includes:
  - Commit messages
  - Code comments
  - Variable, function, and class names
  - Documentation

## Documentation Awareness
- Always review and consider the diagrams and documentation inside the `docs/` folder before starting development.
- Ensure that your work is aligned with the existing architecture and design decisions.
- Changes to documented diagrams or architecture are allowed, but:
  - They must be discussed beforehand.
  - A clear and coherent justification must be provided.

## Code Quality Standards
- Code must be:
  - Readable
  - Maintainable
  - Scalable

- Follow best practices whenever possible, especially:
  - SOLID principles
  - Clean Code guidelines

## General Guidelines
- Prefer clarity over complexity.
- Write code that other developers can easily understand and extend.
- Avoid unnecessary abstractions, but design with future changes in mind.
- Keep functions and classes focused on a single responsibility.
- JS or TS exports must be at the end of the file.
- Avoid comments, and use meaningful names instead.

## Tests Guidelines
- Try to avoid mocks, this is why:
  - A good unit test is that who does not need to mock anything.
  - A good integration test is that who does not need to mock only the external dependencies.
  - A good e2e test is that who does not need to mock anything.

## Collaboration
- Write meaningful and descriptive commit messages.
- Ensure your changes are easy to review and understand.
- Respect the existing codebase and improve it when possible.