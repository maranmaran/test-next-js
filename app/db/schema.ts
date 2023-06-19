import { sql } from '@vercel/postgres';
import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey, serial, text } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/vercel-postgres';

export const tweets = pgTable("tweets", {
  id: serial("id").primaryKey(),
  title: text("title"),
  description: text("description"),
  date: text("date"),
});

export const tweetRelations = relations(tweets, ({ many }) => ({
  tweetsToTags: many(tweetsToTags),
}));

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name"),
});

export const tagsRelations = relations(tags, ({ many }) => ({
  tweetsToTags: many(tweetsToTags),
}));

export const tweetsToTags = pgTable(
  "tweet_tags",
  {
    tweetId: integer("tweetId")
      .notNull()
      .references(() => tweets.id),
    tagId: integer("tagId")
      .notNull()
      .references(() => tags.id),
  },
  (t) => ({
    pk: primaryKey(t.tweetId, t.tagId),
  })
);

export const tweetsToTagsRelations = relations(tweetsToTags, ({ one }) => ({
  tag: one(tags, {
    fields: [tweetsToTags.tagId],
    references: [tags.id],
  }),
  tweet: one(tweets, {
    fields: [tweetsToTags.tweetId],
    references: [tweets.id],
  }),
}));

export const db = drizzle(sql, {
  schema: {
    tweets,
    tweetRelations,
    tags,
    tagsRelations,
    tweetsToTags,
    tweetsToTagsRelations
  }
});
