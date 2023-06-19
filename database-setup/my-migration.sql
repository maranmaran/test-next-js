
-- Table: public.tweets

-- DROP TABLE IF EXISTS public.tweets;

CREATE TABLE IF NOT EXISTS public.tweets
(
    id integer NOT NULL,
    title text COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    date date,
    CONSTRAINT tweets_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tweets
    OWNER to "default";
    
-- Table: public.tags

-- DROP TABLE IF EXISTS public.tags;

CREATE TABLE IF NOT EXISTS public.tags
(
    id integer NOT NULL,
    name text COLLATE pg_catalog."default",
    CONSTRAINT tags_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tags
    OWNER to "default";

-- Table: public.tweet_tags

-- DROP TABLE IF EXISTS public.tweet_tags;

CREATE TABLE IF NOT EXISTS public.tweet_tags
(
    "tweetId" integer NOT NULL,
    "tagId" integer NOT NULL,
    CONSTRAINT tweet_tags_pkey PRIMARY KEY ("tagId", "tweetId"),
    CONSTRAINT tweet_tag_tag FOREIGN KEY ("tagId")
        REFERENCES public.tags (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT tweet_tag_tweet FOREIGN KEY ("tweetId")
        REFERENCES public.tweets (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tweet_tags
    OWNER to "default";

