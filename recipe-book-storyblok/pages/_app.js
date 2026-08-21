import '../styles/globals.css'
 
import { storyblokInit, apiPlugin } from "@storyblok/react";
import Page from "../components/Page";
import Recipe from "../components/Recipe";
import FeaturedRecipes from "../components/FeaturedRecipes";

const components = {
  page: Page,
  recipe: Recipe,
  "featured-recipes": FeaturedRecipes,
 };

storyblokInit({
 accessToken: import.meta.env.VITE_STORYBLOK_ACCESS_TOKEN,
 components,
 use: [apiPlugin],
});

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
