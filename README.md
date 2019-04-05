# A reporting tool for KOLOLA

This repository contains a library, and example page, for generating reports using the KOLOLA Interchange API.

Provided with a URL to some interchange data (either a live API endpoint, or a saved JSON file) it renders records as customisable HTML elements.

* `bundle.js` contains all of the necessary javascript, pre-built with browserify
* `report-example.html`  shows an example implementation, rendering data from a live eportfolio into a list of activities with selected evidence

This tool uses JSONPath to define how data from the JSON is mapped to each HTML element, you can find out more about JSONPath at https://goessner.net/articles/JsonPath/

## Building

If you want to make alterations to this library, you'll need to rebuilt it. Building requires npm and browserify.
`npm install --dev` followed by `./dev.sh` should do it

Source code for the main library is stored in `src/`

The KOLOLA interchange client is a git submodule, at `kolola-intx/`
