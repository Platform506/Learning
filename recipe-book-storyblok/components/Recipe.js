import React from "react";
import {storyblokEditable} from "@storyblok/react";
import { render } from "storyblok-rich-text-react-renderer";

const Recipe = ({ blok }) => {
  return (
    <div {...storyblokEditable(blok)} key={blok._uid}>
      <div className="w-full">
        <div className="max-w-3xl pt-20 flex flex-col items-center">
          <img className="w-1/2 my-16" src={blok.image.filename} alt={blok.image.alt} />
        </div>
      </div>
      <div>
        {render(blok.ingredients)}
      </div>
      <div className="max-w-3xl pt-20 flex flex-col items-center">
        <div className="leading-relaxed text-xl text-left">
          {render(blok.instructions)}
        </div>
      </div>
    </div>
  );
};
 export default Recipe;