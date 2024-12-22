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


## Authors
- Helen Kochetkova
- Julia Yu
- Ashley Kong
- Fatima Lopez

## License
This project is open-sourced under the MIT License - see the LICENSE file for details.
