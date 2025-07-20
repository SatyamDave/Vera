import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function (plop) {
  plop.setGenerator("api", {
    description: "Create a new tRPC API route",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "API route name (e.g., user, post, comment):",
      },
      {
        type: "input",
        name: "description",
        message: "Description of what this API does:",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/server/api/routers/{{name}}.ts",
        templateFile: "plop-templates/api.hbs",
      },
      {
        type: "modify",
        path: "src/server/api/root.ts",
        pattern: /(\/\/ Add new routers here)/,
        template:
          '$1\nimport { {{name}}Router } from "~/server/api/routers/{{name}}";',
      },
      {
        type: "modify",
        path: "src/server/api/root.ts",
        pattern: /(appRouter: createTRPCRouter\({)/,
        template: "$1\n    {{name}}: {{name}}Router,",
      },
    ],
  });

  plop.setGenerator("model", {
    description: "Create a new Prisma model",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Model name (singular, e.g., User, Post):",
      },
      {
        type: "input",
        name: "fields",
        message:
          "Fields (e.g., id String @id, name String, email String @unique):",
      },
    ],
    actions: [
      {
        type: "add",
        path: "prisma/models/{{name}}.prisma",
        templateFile: "plop-templates/model.hbs",
      },
    ],
  });
}
