- Download pgAdmin (latest)
- Get your vercel PGSQL environment variables
- Run pgAdmin, Connect to server
- Go to:
  - vercel db
  - schemas
  - public
  - tables
- Make new query
- C/P `database-setup/my-migration.sql`
  - Execute
- Refresh
  - see 3 tables
- tweets table
  - right click
  - import
  - from `database-setup/tweets.csv`
- tags table
  - right click
  - import
  - from `database-setup/tags.csv`
- tweet_tags table
  - right click
  - import
  - from `database-setup/tweet_tags.csv`

You have your data now :thumbs:

`npm run dev`

GO to page.jsx - play with filter, observe result
