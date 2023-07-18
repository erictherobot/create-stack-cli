#!/usr/bin/env node

import inquirer from "inquirer";
import { execSync } from "child_process";
import path from "path";

const createStack = async () => {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "What should we call the project?",
    },
    {
      type: "list",
      name: "framework",
      message: "What framework do you want to use?",
      choices: ["Next.js", "Vue.js"],
    },
    {
      type: "checkbox",
      name: "libraries",
      message: "Select the libraries you want to use:",
      choices: ["Tailwind", "Prisma", "Supabase", "Bootstrap", "tRPC"],
    },
  ]);

  let { framework, libraries, projectName } = answers;
  let projectPath = path.resolve(process.cwd(), projectName);

  if (framework === "Next.js") {
    execSync(`npx create-next-app ${projectPath}`, { stdio: "inherit" });
  } else if (framework === "Vue.js") {
    execSync(`npx create-nuxt-app ${projectPath}`, { stdio: "inherit" });
  }

  process.chdir(projectPath);

  // Initialize git repository
  execSync("git init", { stdio: "inherit" });

  // Create a .gitignore file
  const gitignoreContent = `
  # dependencies
  /node_modules
  
  # testing
  /coverage
  
  # production
  /build
  /dist
  
  # misc
  .DS_Store
  .env
  npm-debug.log*
  yarn-debug.log*
  yarn-error.log*
  `;
  execSync(`echo "${gitignoreContent}" > .gitignore`, { stdio: "inherit" });

  for (let library of libraries) {
    switch (library) {
      case "Tailwind":
        execSync("npm install tailwindcss postcss autoprefixer", {
          stdio: "inherit",
        });
        break;
      case "Prisma":
        execSync("npm install prisma", { stdio: "inherit" });
        execSync("npx prisma init", { stdio: "inherit" });
        break;
      case "Supabase":
        execSync("npm install @supabase/supabase-js", { stdio: "inherit" });
        break;
      case "Bootstrap":
        execSync("npm install bootstrap", { stdio: "inherit" });
        break;
      case "tRPC":
        execSync("npm install @trpc/client @trpc/server", { stdio: "inherit" });
        break;
    }
  }

  console.log(
    `Created a new ${framework} project named "${projectName}" with ${libraries.join(
      ", "
    )}`
  );
};

createStack();
