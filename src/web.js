function doPost(e) {
  return (new EventsApi(e)).execute();
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^doPost$" }] */
