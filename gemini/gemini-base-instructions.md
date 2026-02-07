#Project Idea:

- Finance management for my family and I, only.

#Stack:

- NextJS, Typescript, Tailwind SCSS (FE),

- Superbase (BE)

#Deployment:

- Vercel

#Base instructions when updating / adding / removing / refactoring:

- Always review if the specific change is going to affect any other component, if so, make sure to not affect any other component / functionality other than your task
- Prioritize best practices by reusing logic / functions / hooks across pages/componentes as needed instead of repeating code
- Never read .env files, if you have to add a new variable, ask me to do it.


#After you complete the any task related to code changes, run following commands and fix any issue you see when running them:

-yarn eslint
-yarn build

#Once you complete any task, ask me if I'm satisfied with the implementation. If so, ask me if I would like to push it to the repository or not. If I say YES, then follow steps below:

- Create a branch off of main by running following command (Follow this pattern: fix/[componentName-[keywords]], or feat/[componentName-[keywords]]):
- git checkout main (make sure it is in main branch)
- git checkout -b "fix/transactionItem-scrollBehavior" (example of branch name with component and keywords associated to the task)
- git add .
- git commit -m "breif description of the task"
- git push origin [branchNamee]