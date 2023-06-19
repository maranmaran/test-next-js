import { getTweets } from "./db/tweet.query";

/** ADD .env with POSTGRE_URL */

export default async function Home() {
  // false && (await seed());

  const tweets = await getTweets({
    search: null,
    tags: [1],
  });

  return (
    <div>
      {/* Add search input and input to check available tags and such.. */}
      {/* Till then, modify it directly above */}
      <div>Result ({tweets.length}):</div>
      <pre>{JSON.stringify(tweets, null, 2)}</pre>;
    </div>
  );
}
