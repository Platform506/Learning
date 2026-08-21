import React from "react";
import { storyblokEditable } from "@storyblok/react";
import Link from "next/link";

const FeaturedRecipes = ({ blok }) => {
return (
  <div
    {...storyblokEditable(blok)}
    key={blok._uid}
    className="py-8 mb-6 container mx-auto text-left"
  >
    <div className="relative">
      <h2 className="relative font-serif text-4xl z-10 text-primary">
        {blok.title}
      </h2>
      <ul className="flex">
       
        {blok.recipes.map((recipe) => {
          return (
            <li key={recipe.slug} className="pr-8 w-1/3">
              <Link href={`recipes/${recipe.slug}`}>
                <a className="py-16 block">
                  <img src={recipe.content.image.filename} className="pb-10 w-full" alt={recipe.content.image.alt} />
                  <h2 className="pb-6 text-lg font-bold">
                    {recipe.content.title}
                  </h2>
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  </div>
);
};

export default FeaturedRecipes;