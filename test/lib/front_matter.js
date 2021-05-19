import fs from 'fs';
import readline from 'readline';
import yaml from 'yaml';
import yamllint from 'yaml-lint';

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

export function filterOutFilesWithValidFrontMatterSyntax(filePath, callback) {
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

export function findProblemsWithContentfulOption(filePath, callback) {
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

export function findProblemsWithLayout(filePath, callback) {
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

export function findProblemsWithFragments(filePath, callback) {
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