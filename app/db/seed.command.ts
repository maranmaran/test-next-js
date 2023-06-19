import { faker } from '@faker-js/faker';
import { Tag, Tweet } from './interfaces';
import { db, tags, tweets, tweetsToTags } from "./schema";

let serialId = 1;

export async function seed() {
    const fakeTweets = faker.helpers.multiple(createTweet, {
        count: 10,
    });

    const simpleTweets = fakeTweets.map(x => {
        return { id: x.id, title: x.title, description: x.description, date: x.date.toISOString() };
    });

    const simpleTags = tagPool;

    const simpleTweetToTags = fakeTweets.flatMap(x => {
        return x.tags.map(y => ({ tagId: y.id, tweetId: x.id }))
    })

    console.log(simpleTweets)
    console.log(simpleTweetToTags)
    console.log(simpleTags)

    await db.transaction(async ts => {
        await ts.delete(tweetsToTags);
        await ts.delete(tweets);
        await ts.delete(tags);

        await ts.insert(tweets).values(simpleTweets);
        await ts.insert(tags).values(simpleTags);
        await ts.insert(tweetsToTags).values(simpleTweetToTags);
    });
}


function createTweet() {
    return <Tweet>{
        id: ++serialId,
        title: faker.word.words({ count: { min: 2, max: 5 } }),
        description: faker.word.sample(),
        date: faker.date.recent(),
        tags: faker.helpers.arrayElements(tagPool, { min: 0, max: 3 }),
    }
}

const tagPool: Tag[] = [
    {
        id: ++serialId,
        name: faker.word.noun(),
    },
    {
        id: ++serialId,
        name: faker.word.noun(),
    },
    {
        id: ++serialId,
        name: faker.word.noun(),
    },
    {
        id: ++serialId,
        name: faker.word.noun(),
    },
    {
        id: ++serialId,
        name: faker.word.noun(),
    },
    {
        id: ++serialId,
        name: faker.word.noun(),
    },
] 
