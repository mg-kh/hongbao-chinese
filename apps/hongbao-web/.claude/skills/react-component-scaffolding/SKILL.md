---
name: react-component-scaffolding
description: Use when creating, modifying, or refactoring React components. Enforces the project's folder structure, component organization, naming conventions, and separation of UI from business logic.
---

# React Component Scaffolding

## Folder Structure

- Create one folder per component.
- Folder name must exactly match the component name.
- Do not define multiple components in a single file.
- Use @-aliased paths instead of relative import paths.

## Naming

- Use PascalCase for component files.
- Example: `CustomButton.tsx`

## Business Logic

- Components should only render UI.
- Move state management, business logic, data fetching, and side effects into `useContainer.ts`.
- Components should consume data and actions from `useContainer.ts`.
- Do not create `useContainer.ts` if the component contains only static UI and no business logic.

## Styling & Layout

- Use Tailwind CSS for layout management, including responsive layouts, spacing, positioning, sizing, flexbox, grid, and breakpoints.
- Use Mantine UI for reusable UI components and component-level functionality.
- Prefer Tailwind CSS for responsive behavior rather than Mantine's layout components.
- Do not replace Mantine components with custom implementations when an appropriate Mantine component already exists.

## Components

- Do not embed SVGs directly inside components. Create a reusable icon component in `src/components/icons/` and use it throughout the application.

## Child Components

- If the component is not globally reusable, place it in the parent component's `components/` folder.
- If the component is globally reusable, place it in `src/components/`.
- Each child component must have its own folder and file.

When creating new files, generate them from these templates:

- Component → `templates/ExampleComponent.tsx`
- Container → `templates/useContainer.ts`
- Reusable Hook → `templates/useHook.ts`
