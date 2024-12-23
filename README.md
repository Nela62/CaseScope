# CaseScope
An open-source tool helping legal aid organizations support tenants by analyzing historical hearing records. Uses NLP to extract key issues from legal documents, predict potential outcomes based on past cases, and assist in petition preparation.

- Upload PDFs of past cases
- The app will extract key issues and information from the documents
- The app will predict potential outcomes based on past cases
- The app will assist in petition preparation

- Uses open source models for extraction and prediction
- Built with Next.js, Typescript, Tailwind, Lucide, Shadcn/UI, Supabase, and Vercel
- Using Claude 3.5 Sonnet for data extraction

## Getting Started

- Full setup of uploading custom documents, securing them, extracting data from them, storing them in a database, embedding them and storing that in a database
- Perfect as a starting point for any legal aid organization looking to support tenants by analyzing historical hearing records or anyone looking for a template to build their own extraction tool

- Full setup of uploading custom documents, which get parsed using llama parser, uploaded to supabase and supabase storage, embedded and stored in supabase vector database
- Database and storage have RLS policies setup for ensuring that only the right users have access to the right data
- Supabase for authentication
- Inngest for serverless functions

## How to Set It Up
- [Download docker](https://docs.docker.com/get-started/get-docker/) 
- [Install supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)
- [Create a supabase account and a new project](https://supabase.com/)
  - Get the supabase anon key and url
  - Enable anonymous sign-ins in the supabase dashboard (Settings -> Authentication -> Enable anonymous sign-ins)
  - If you enable captcha, you won't be able to run localhost app unless you're using local supabase inside of Docker
- [Create an aws account](https://aws.amazon.com/)
  - Request access to the Claude 3.5 Sonnet model
  - Give full access to aws bedrock
  - Make sure to create a new IAM user for this project and not use your root account
  - Get the access and secret keys
- Add the required credentials to the `.env.local.example` file and rename it to `.env.local`
- Run `make init PROJECT_ID=<supabase project id>`. You can get <project-id> from your project's dashboard URL: https://supabase.com/dashboard/project/<project-id>. This will  prompt you to login to supabase and link the project to this repository.
- Run `make dev` to start the development server and inngest server

### Local Development
- Run `make supabase` to start the supabase server
- Make sure that `.env.local` contains the local supabase credentials
- Run `make dev` to start the development server and inngest server


## Authors
- Helen Kochetkova
- Julia Yu
- Ashley Kong
- Fatima Lopez

## License
This project is open-sourced under the MIT License - see the LICENSE file for details.
