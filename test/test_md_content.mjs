import assert from 'assert';

const CONTENT_PATH = 'content/';
const LANGUAGES = ['en', 'nl'];

const CONTENTFUL_IMAGE_API_OPTIONS = [
    'fm', 'fl', 'w', 'h', 'fit', 'f', 'r', 'q', 'bg'
];

describe(`content`, function () {

    LANGUAGES.forEach(language => {

        describe(`${language.toUpperCase()}`, function () {

            describe('- Contentful images', function () {

                it('- have valid options', async function () {

                    //assert(false, "Not Implemented");
                });
            });
        });
    });
});