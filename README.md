# Shopify Starter 
Shopify Starter build for Shopify theme development opinionated to be coherent with our Ask Phill standards; Performance, good DX, and conversion-focused.

See live version [here](https://ask-phill-starter.myshopify.com/)


Shopify Starter build for Shopify theme development opinionated to be coherent with our Ask Phill standards; Performance, good DX, and conversion-focused.


# 🌍 Features
- Utility-first CSS with [Tailwind CSS](https://tailwindcss.com/)
- Art directed images, lazy loaded images with Snorlex 🦥 
- Github actions to build the source file to be compliant with the Shopify [Github intergration](https://shopify.dev/themes/tools/github)
- Works out of the box with the new [Shopify CLI✨](https://shopify.dev/themes/tools/cli)

## Setup

### Setup for development 

1. `git clone` this repository
2. Unlink Shopify Starter Github with `rm -rf .git`
3. Create new Github repo for your project
4. Link your project's Github repository with `git remote add origin git@github.com:askphill/REPO_NAME.git`
5. Commit files with super fancy emoji commit 🥷🏻
6. Rename your master branch to main `git branch -M main`
7. Push your commits to the Github repository `git p -u origin main`
8. Add the gitbranch to your shopify store to always have the master live
9. Run the command `npm install` to install the packages
10. Run the command `npm run dev`. If you click the preview link that you see in the terminal you should be able to see a fully functioning webshop

## File structure

One of the biggest changes with the new starter... is the structure of our javascript, by adding components and utility functions, just like in Headless projects.

If you've already worked with the **slater** library, most of this structure, seems familiar to you. However to increase performance of our starter-themes, we have added code splitting, which enables us to only include large js-components, on the page where they're used.

In this example, we categorise our components into 2 categories. `base` and `product` - if you want to add more categories, please read [How to code split](#how-to-code-split).

To add a component to the category, you simply just add the file, to the folder, and import the component in the `components.js` - Not sure on how to create components? Please read [Creating your first component](#creating-your-first-component)

```js
.
├─ components
│  ├─ base
│  │  ├─ // component files
│  │  └─ components.js
│  └─ product
│     ├─ // component files
│     └─ components.js
├─ lib
├─ utils
│  ├─ base.js
│  ├─ product.js
│  └─ vendors.js
├─ index.js
├─ async.js
└─ app.js
```

### Creating your first component

To ensure a better overview of our projects, and more reuseable js, we've shifted over to using a more component-based approach, much like our headless projects.

Let's try to create a new component named `productForm`, being used on the product pages.

**Create a new file in components/product** named `product-form.js` in here we add the basic component structure, which is the following:

```js
export default window.component((node, ctx) => {
  console.log('productForm:mounted', node);
});
```

_If you are using vscode, you can use the predefined snippets called `co` and `comp`_

To include the component on the product pages, we have to add our new component in the `components.js` file, in `components/product`. In here we have to:

1. Import function, from component-file
2. Add function to exported object

```js
import productForm from './product-form';

export default {
  // Exported components
  productForm,
};
```

_If you are using vscode, you can use the predefined snippets called `imc` and `importcomp` and type out the filename, then it automatically translates the name into camelCase_.

### Using your first component

We have now created, and imported our first component, and now we want to mount it, to a HTML-element - to do this, we have to add an attribute, called `data-component`, with the value of our **component name**

**Before**

```html
<div>
  <!-- Content of div -->
</div>
```

**After**

```html
<div data-component="productForm">
  <!-- Content of div -->
</div>
```

### Rules for components

For structure purposes, you should **always** use `kebab-case` for file names, and `camelCase` for component names

### Vendor scripts

Because the new meta is all-in on performance, we've added the possibility of lazyloading vendor scripts, so they don't block the usability of the site.

This is done by adding a event listener, on the window - fired when it loads. This then takes our `util/vendors.js` file and loads the scripts and styles, that should be present on the page.

#### Determine which scripts should load on a page

As mentioned above, you can now determine which scripts should be on each and every page - and this is how you do it.

```js
export const scripts = [
  {
    name: `Swiper`,
    src: getShopifyLink('swiper.min.js'),
    include: document.querySelector('.swiper-wrapper'),
  },
  {
    name: `Keen slider`,
    src: getShopifyLink('keen-slider.min.js'),
    include: document.querySelector('.keen-slider'),
  },
];
```

In this example, the `Swiper` script, will only load on pages, where an element with the class of `.swiper-wrapper` is present. This works because we loop over each script, and make an if-statement, to check if include is defined or not.

#### Other features of vendor scripts

```js
/**
 * Adding a vendor script/stylesheet, being initialised on window.load
 * @type {Object}
 * @param {String} name identify if loaded or not
 * @param {String} src link to to vendor-file
 * @param {Boolean|Element} include if truthy, include on load
 * @param {Boolean} important import before window.load event
 * @param {Function} callback run after load
 */
```

#### Adding your own vendor script

When adding a new vendor script, you have the following 3 options:

1. Using a jsdeliver CDN, to host script
2. Adding script to asset folder, to host on Shopify – **_Recommended_**
3. Adding script to Files, to host on Shopify

_If the script provides it's own CDN, use that - just like the Google scripts_

#### Waiting for a vendor script
Because the loading of vendor scripts, is postponed until the window has loaded, we can't just call vendor function right away.
```js
const slider = new KeenSlider();
// Uncaught ReferenceError: KeenSlider is not defined
```

This is of course because our component javascript, is running before the window has loaded. Therefore we've added the new `waitToLoad` function, making it possible to wait on the script of your choice, from the `vendors.js` file.

**Using the function**
```js
import waitToLoad from '../../lib/waitToLoad';

export default window.component(async (node, ctx) => {
  await waitToLoad('Keen slider');
  const slider = new KeenSlider();
});
```
The `Keen slider` string, is the name defined within `vendors.js`, beaware that to use the `await`, we have to convert the component function, into an async function as in the example.

