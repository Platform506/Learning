import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { 
  StoryblokComponent,
  useStoryblokState,
  getStoryblokApi
} from "@storyblok/react";

export default function Home({ story }) {
  story = useStoryblokState(story, {
    resolveRelations: ["featured-recipes.recipes"],
  });
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StoryblokComponent blok={story.content} />
    </div>
  );
  }
  export async function getStaticProps() {
  let slug = "home";
  // load the published content outside of the preview mode
  let sbParams = {
    version: "draft",
    resolve_relations: ["featured-recipes.recipes"], // or 'draft'
  };
  const storyblokApi = getStoryblokApi()
  let { data } = await storyblokApi.get(`cdn/stories/${slug}`, sbParams)
  return {
    props: {
      story: data ? data.story : false,
      key: data ? data.story.id : false,
    },
    revalidate: 3600, // revalidate every hour
  };
  }