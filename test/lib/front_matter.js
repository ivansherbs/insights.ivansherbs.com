const fs = require('fs');
const readline = require('readline');
const yaml = require('yaml');
const yamllint = require('yaml-lint');

const CONTENT_PATH = 'content/';
const CONTENTFUL_IMAGE_API_OPTIONS = [
    'fm', 'fl', 'w', 'h', 'fit', 'f', 'r', 'q', 'bg'
];

function readFrontMatter(filePath, callback) {
    const rl = readline.createInterface(fs.createReadStream(filePath));
    var frontMatter = '';
    var readingFrontMatter = false;
    rl.on('line', (line) => {
        if (line.trim() === '---') {
            if (!readingFrontMatter) {
                readingFrontMatter = true;
            } else {
                rl.close();
            }
        } else {
            if (!readingFrontMatter) {
                rl.close();
            } else {
                frontMatter += line + '\n';
            }
        }
    });

    rl.on('close', () => {
        callback(null, frontMatter);
    });

}

function filterOutFilesWithValidFrontMatterSyntax(filePath, callback) {
    readFrontMatter(filePath, (err, frontMatter) => {
        if (!frontMatter) {
            callback(null, false);
            return;
        }
        yamllint.lint(frontMatter)
            .then(() => callback(null, false))
            .catch(error => callback(null, true));
    });
}

function findProblemsWithContentfulOption(filePath, callback) {
    readFrontMatter(filePath, (err, frontMatter) => {
        // no front matter
        if (!frontMatter) {
            callback(null);
            return;
        }

        var frontMatterObject = yaml.parse(frontMatter);

        // no contentful options declared
        if (!frontMatterObject.contentful) {
            callback(null);
            return;
        }

        var errors = [];

        // contentful options defined
        if (frontMatterObject.contentful.imageOptions) {
            for (var option in frontMatterObject.contentful.imageOptions) {
                if (!CONTENTFUL_IMAGE_API_OPTIONS.includes(option)) {
                    errors.push(option);
                }
            }
        }

        if (errors.length) {
            callback(null, errors);
            return;
        }

        callback(null);
    });
}

function findProblemsWithLayout(filePath, callback) {
    readFrontMatter(filePath, (err, frontMatter) => {
        // no front matter
        if (!frontMatter) {
            callback(null);
            return;
        }

        var frontMatterObject = yaml.parse(frontMatter);

        // no layout declared
        if (!frontMatterObject.layout) {
            callback(null, 'missing layout');
            return;
        }

        // layout defined
        try {
            fs.statSync(CONTENT_PATH + '/_includes/' + frontMatterObject.layout);
        } catch (error) {
            callback(null, `layout: ${frontMatterObject.layout}`);
            return;
        }

        callback(null);
    });
}

function findProblemsWithFragments(filePath, callback) {
    readFrontMatter(filePath, (err, frontMatter) => {
        // no front matter
        if (!frontMatter) {
            callback(null);
            return;
        }

        var frontMatterObject = yaml.parse(frontMatter);

        // no fragments declared
        if (!frontMatterObject.fragments) {
            callback(null);
            return;
        }

        var errors = [];

        // header fragment defined
        var header = frontMatterObject.fragments.header;
        if (header) {
            var headerPath = header + '.md';
            try {
                fs.statSync(CONTENT_PATH + headerPath);
            } catch (error) {
                errors.push(`header: ${header}`);
            }
        }

        // footer fragment defined
        var footer = frontMatterObject.fragments.footer;
        if (footer) {
            var footerPath = footer + '.md';
            try {
                fs.statSync(CONTENT_PATH + footerPath);
            } catch (error) {
                errors.push(`footer: ${footer}`);
            }
        }

        if (errors.length) {
            callback(null, errors);
            return;
        }

        callback(null);
    });
}

exports.filterOutFilesWithValidFrontMatterSyntax = filterOutFilesWithValidFrontMatterSyntax;
exports.findProblemsWithFragments = findProblemsWithFragments;
exports.findProblemsWithLayout = findProblemsWithLayout;
exports.findProblemsWithContentfulOption = findProblemsWithContentfulOption;