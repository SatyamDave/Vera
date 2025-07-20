# VERA Generator Module

This module handles the conversion of natural language prompts into structured file blueprints and code generation plans.

## Purpose

The generator is responsible for:
- Parsing natural language prompts into structured requirements
- Creating file blueprints with proper folder structure
- Generating code templates based on the requirements
- Coordinating with the frontend and backend modules

## Planned Features

- **Prompt Analysis**: Parse user prompts to extract requirements, features, and technical specifications
- **Blueprint Generation**: Create structured file plans with proper architecture
- **Template Selection**: Choose appropriate code templates based on requirements
- **Code Generation**: Generate initial code files with proper structure
- **Validation**: Ensure generated code follows best practices and is functional

## Architecture

```
generator/
├── src/
│   ├── parser/          # Prompt parsing logic
│   ├── blueprint/       # File blueprint generation
│   ├── templates/       # Code templates
│   └── validator/       # Code validation
├── tests/               # Unit tests
└── examples/            # Example prompts and outputs
```

## Integration Points

- **Frontend**: Receives prompts from the UI
- **Backend**: Generates API routes and database models
- **Plop**: Uses plop for scaffolding backend files
- **AI Services**: Integrates with OpenAI/Anthropic for enhanced generation

## Status

🚧 **Work in Progress** - This module is planned but not yet implemented.

## Next Steps

1. Implement prompt parsing logic
2. Create blueprint generation system
3. Build template selection mechanism
4. Add code validation
5. Integrate with AI services for enhanced generation 