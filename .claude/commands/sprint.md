Ultrathink to generate the next VibeSolver project sprint using this streamlined approach:

1. ANALYSIS PHASE:

   - IMPORTANT: Read and follow the @specs/ folder for understanding the product vision, design requirements, technical stack, and roadmap if it exists.
   - IMPORTANT: Prioritize any features mentioned incomplete in the roadmap.
   - Review files in sprints/ folder if it exists to understand progression and numbering
   - Review the project code to understand the state of the project
   - Review CLAUDE.md if available to understand code generation guidance
   - For the first sprint focus on setting up the project scaffold, configurations, environment settings, virtual environment, installing dependencies, development and testing tooling
   - IMPORTANT: For every subsequent sprint, follow end-to-end feature-slice approach (minimum viable product) based on the roadmap if it exists, which includes adequate frontend UI and backend capabilities to help user evaluate all features released in that sprint using the frontend UI.
   - Determine the next sprint number and logical feature focus

2. PLANNING PHASE:

   - Based on your analysis, draft a comprehensive sprint plan
   - IMPORTANT: Follow test-driven development principles for development workflow
   - IMPORTANT: Follow modularity, maintainability, extensibility, and single responsibility principles for code generation
   - Include all required sections:
     - Title with proper sprint number format (e.g., "Sprint 004: Feature Name")
     - Overview explaining purpose and context
     - Clear goals (3-5 bullet points)
     - Detailed tasks with test examples
     - Specific acceptance criteria
     - Development instructions
   - Ensure the sprint builds logically on previous work
   - Verify the sprint delivers actual user value

3. OUTPUT:
   - Save EXACTLY ONE file named '/sprints/[NUMBER]-[feature-name].md' where:
     - [NUMBER] is the three-digit sprint number (e.g., '003', '004')
     - [feature-name] briefly describes the focus area in kebab-case
   - Confirm the file meets project standards and requirements before saving
