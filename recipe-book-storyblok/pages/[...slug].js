import React from "react";
import Head from "next/head";
import { StoryblokComponent, useStoryblokState, getStoryblokApi } from "@storyblok/react";

export default function Page({ story }) {
 story = useStoryblokState(story, {
  resolveRelations: ["featured-recipes.recipes"],
});

return (
  <div>
    <Head>
      <title>{story ? story.name : "My Site"}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <header>
      <h1 className="text-4xl">{story ? story.name : "My Site"}</h1>
    </header>
    <StoryblokComponent blok={story.content} />
  </div>
);
}
export async function getStaticProps({ params }) {
// join the slug array used in Next.js catch-all routes
let slug = params.slug ? params.slug.join("/") : "home";
let sbParams = {
  // change to `published` to load the published version
  version: "draft", // or published
  resolve_relations: ["featured-recipes.recipes"],
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
export async function getStaticPaths() {
// get all links from Storyblok

const storyblokApi = getStoryblokApi()
let { data } = await storyblokApi.get(`cdn/links/`)

let paths = [];
// create a routes for every link
Object.keys(data.links).forEach((linkKey) => {
  // do not create a route for folders or the home (index) page
  if (data.links[linkKey].is_folder || data.links[linkKey].slug === "home") {
    return;
  }
  // get array for slug because of catch all
  const slug = data.links[linkKey].slug;
  let splittedSlug = slug.split("/");
  // cretes all the routes
  paths.push({ params: { slug: splittedSlug } });
});
return {
  paths: paths,
  fallback: false,
};
}