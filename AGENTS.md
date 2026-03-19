<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

---
applyTo: "**"
---

Coding standards, domain knowledge, and preferences that AI should follow.

# 🧠 Coding Standards & Folder Structure

## 1. Component Design

- Components must be **small**, **modular**, and **reusable**.
- Each component should do one thing well and avoid becoming overly complex.

## 2. Page Structure

- The `page.tsx` file should only **initialize and render the root component**.
- Avoid adding state or logic in the page file.

## 3. Custom Hooks

- State, effects, and functions should be handled in a **custom hook** named using the pattern:  
  `use<ComponentName>Wizard`  
  _Example: `useSignupWizard` for the `Signup` component._

## 4. Component Utilities

- Each component should have its own `util.ts` file for:
  - **Pure functions** that return formatted or derived values.
  - **Validation schemas** (e.g., `zod`, `yup`) specific to the component.

## 5. Local Types

- Each component should maintain its own `type.ts` containing **local types and interfaces**.

## 6. Shared Utilities

- Shared utility functions used across multiple components should be placed in the `lib/util` folder.

## 7. Naming Conventions

- Use `camelCase` for all **variables**, **state**, and **function names**.
- Maintain naming consistency across the codebase.

## 8. API Handling with React Query

- All API calls must be placed inside the `app/api/react-query` directory.
- Use **React Query** for fetching, mutation, and caching of API data.
- Organize API files by feature or module.
- The react query function will always in react-query/<file-name>
  - Example: `app/api/react-query/drillCategories.ts` for all drill category related API calls.

## 9. Form Handling

- Use `react-hook-form` for managing forms.
- Combine with `zod` or `yup` for schema validation when needed.
- Use common fields for input and other fields `/src/components/fields`
- Validation schema should be in the `util.ts` file of the component.

## 10. Control Flow Preferences

- Prefer **early returns** in `if` conditions to reduce nesting and improve readability.
- Avoid using `switch` statements unless absolutely necessary.

## 11. UI Logic Readability

- **Avoid ternary (`? :`) operators** in UI rendering logic—especially inside JSX.
- Avoid combining **multiple conditions in a single line**, to improve clarity and reduce bugs.
- **Use helper functions with early returns** instead of nested ternary operators for conditional rendering.
- Extract complex conditional UI into separate components or functions that use early returns.
- Example:

  ```tsx
  // ❌ Avoid
  {
    items.length === 0 ? (
      <EmptyState />
    ) : (
      items.map(item => <Item key={item.id} item={item} />)
    )
  }

  // ✅ Prefer
  function ItemList({ items }) {
    if (items.length === 0) {
      return <EmptyState />
    }

    return items.map(item => <Item key={item.id} item={item} />)
  }
  ```

## 12. Select Options

- All **default select options** should be defined and exported from the centralized `lib/options.ts` file.

<!-- END:nextjs-agent-rules -->
