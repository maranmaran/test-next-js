import { and, exists, inArray, like } from 'drizzle-orm';
import { Tweet } from './interfaces';
import { db, tags } from "./schema";

interface Filter {
    search: string;
    tags: string[];
}

export async function getTweets(filter?: Filter) {

    const filterTweets = filter && !!filter.search;
    const filterTags = filter && !!filter.tags && filter.tags.length > 0;

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
                !filterTweets ? true : or(
                    like(tweets.title, `%${filter.search}%`),
                    like(tweets.description, `%${filter.search}%`),
                ),
                // if we will filter tags, filter only tweets that do contain those tags
                !filterTags ? true : (sql`json_array_length(${tweets.tweetsToTags}) > 0`)
            )
    }


    // include tweet tags and filter them, if we have something to filter by
    if (filterTags) {
        relevantQuery = {
            ...relevantQuery,
            with: {
                tweetsToTags: {
                    where: (tweetsToTags, { eq }) => exists(
                        db.select().from(tags).where(
                            and(
                                inArray(tags.name, filter.tags),
                                eq(tweetsToTags.tagId, tags.id)
                            ))
                    )
                }
            },
        };
    }

    const result = await db.query.tweets.findMany(relevantQuery);
    const relevantIds = result.map(x => x.id as number);
    if (result.length == 0) {
        return [];
    }

    console.log(JSON.stringify(result, null, 2));

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