# Brew & Bloom

A retro pixel-art game: pick a drink, watch a matching flower creature grow,
and get an AI film pairing with a brief story overview.

## Flow

Cellar door (pick drink) -> choose type (subtype, sets the flower color) ->
the watering (pour + grow animation) -> in full bloom (mood archetype + film
suggestion).

## Project structure

```
src/
  components/
    ApiKeyGate.jsx       start screen, collects the Anthropic API key
    DrinkPicker.jsx       screen 1: Wine / Beer / Whisky / Spirits / Cocktail
    SubtypePicker.jsx     screen 2: subtype grid (sets flower color)
    WateringStage.jsx     screen 3: pour animation + grow stages
    BloomResult.jsx       screen 4: archetype + film suggestion
    Flower.jsx            reusable flower SVG (icons + bloom result)
    TopBar.jsx            back button + step dots
  data/
    gardenData.js         species map, subtypes, archetypes, colors
  utils/
    flowerArt.js          procedural SVG petal generation per species
    filmApi.js            Anthropic API call for film suggestions
  App.jsx                 screen routing/state
  index.css               retro pixel styling
  main.jsx                entry point
```

## Running locally

```
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

## About the API key

The film suggestion feature calls the Anthropic API directly from the
browser using a key you paste in on the start screen. It's stored in
`localStorage` on your device only.

This is fine for local development and personal use, but **an API key
embedded in client-side code is visible to anyone who opens browser dev
tools**. Don't ship this as-is to a public website where other people will
load the page, since they'd be able to read your key out of localStorage
or the network tab and rack up usage on your account.

For a real deployment, the next step is to move the `fetchFilmSuggestion`
call in `src/utils/filmApi.js` into a small backend or serverless function
(e.g. a Vercel/Netlify function, or a tiny Express server) that holds the
API key as a server-side environment variable, and have the frontend call
that endpoint instead of Anthropic directly. Claude Code can help scaffold
that backend piece when you're ready for it.

## Extending the flower art

All petal/species geometry lives in `src/utils/flowerArt.js` as procedural
SVG generation (so subtype colors can be swapped without redrawing shapes).
Species are: lily (Wine), daisy (Beer), thistle (Whisky), starbloom
(Spirits), peony (Cocktail). Colors per subtype live in
`src/data/gardenData.js`.

## Extending the film logic

Currently every subtype maps to a fixed "mood archetype" (see `archetypes`
in `gardenData.js`), and the archetype + drink get sent to Claude to pick a
genre and film. If you'd rather curate films yourself instead of using live
AI suggestions, swap the body of `fetchFilmSuggestion` in
`src/utils/filmApi.js` for a lookup against your own curated list.
