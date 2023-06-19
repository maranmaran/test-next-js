import { inArray, like } from 'drizzle-orm';
import { Tweet } from './interfaces';
import { db } from "./schema";

interface Filter {
    search: string;
    tags: string[];
}

export async function getTweets(filter?: Filter) {

    const filterTweets = filter && !!filter.search;
    const filterTags = filter && !!filter.tags;

    // idk type...
    let relevantQuery: any = {
        // limit: 10,
        // offset: 0,
        columns: {
            id: true
        },
        where: (tweets, { or, sql, and }) =>
            and(
                // apply filter only if we have something to filter by
                filterTweets && or(
                    like(tweets.title, `%${filter.search}%`),
                    like(tweets.description, `%${filter.search}%`),
                ),
                // if we will filter tags, filter only tweets that do contain those tags
                filterTags && (sql`json_array_length(${tweets.tweetsToTags}) > 0`)
            )
    }

    // include tweet tags and filter them, if we have something to filter by
    if (filterTags) {
        relevantQuery = {
            ...relevantQuery,
            with: {
                tweetsToTags: {
                    where: (tweetsToTags, { }) => inArray(tweetsToTags.tagId, filter.tags)
                }
            },
        };
    }

    const relevantIds = (await db.query.tweets.findMany(relevantQuery)).map(x => x.id as number);
    if (relevantIds.length == 0) {
        return [];
    }

    // get tweets with tags
    const relevantTweets = await db.query.tweets.findMany({
        with: {
            tweetsToTags: {
                with: {
                    tag: true
                }
            }
        },
        where: (tweets, { }) => inArray(tweets.id, relevantIds),
    })

    return toTweets(relevantTweets); // shape, flatten, map etc..
}

// figure type saftey here..
function toTweets(relevantTweets: any[]) {
    const tweets: Tweet[] = [];

    for (const rTweet of relevantTweets) {
        // same as above for type saftey
        const tags = (rTweet.tweetsToTags as any[]).flatMap(x => x.tag);
        tweets.push({
            id: rTweet.id,
            title: rTweet.title,
            description: rTweet.description,
            date: rTweet.date,
            tags: tags
        });
    }

    return tweets;
}