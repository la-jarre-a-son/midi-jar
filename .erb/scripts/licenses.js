import nlf from 'nlf';
import fs from 'fs';
import path from 'path';

import packageJson from '../../package.json';

import webpackPaths from '../configs/webpack.paths';

const currentPackageName = packageJson.name;

const filename = path.join(webpackPaths.rootPath, 'ThirdPartyLicenses.json');

function formatUrl(repository) {
  if (repository === '(none)') return null;

  const repoName = repository
    .replace('git@github.com:', '')
    .replace('ssh://git@github.com/', '')
    .replace('github:', '');

  if (repoName.startsWith('http://') || repoName.startsWith('https://')) {
    return repoName.replace('http://', 'https://');
  }

  if (repoName.match(/^(@[a-z0-9-_.]+\/)?[a-z0-9-_.]+\/[a-z0-9-_.]+$/i)) {
    return `https://github.com/${repoName}`;
  }

  return null;
}

function sortById(a, b) {
  if (a.id === b.id) return 0;

  return a.id < b.id ? -1 : 1;
}

function deduplicateSortedArray(arr, deduplicateBy = 'id') {
  return arr.reduce((out, current) => {
    if (out.length && current[deduplicateBy] === out[out.length - 1][deduplicateBy]) {
      return out;
    }
    out.push(current);
    return out;
  }, []);
}

function getLicenses(directory, production) {
  return new Promise((resolve, reject) => {
    nlf.find({ directory, production }, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(
        data
          .map((license) => {
            return {
              id: license.id,
              name: license.name,
              version: license.version,
              url: formatUrl(license.repository),
              license: license.licenseSources.package.sources[0]
                ? license.licenseSources.package.sources[0].license
                : null,
              text: license.licenseSources.license.sources[0]
                ? license.licenseSources.license.sources[0].text
                : null,
            };
          })
          .filter((license) => license.name !== currentPackageName)
      );
    });
  });
}

function outputLicenses(production) {
  Promise.all([
    getLicenses(webpackPaths.rootPath, production),
    getLicenses(webpackPaths.appPath, production),
  ])
    .then(([rootPackages, appPackages]) => {
      const output = [].concat(rootPackages, appPackages);
      output.sort(sortById);
      const dedupOut = deduplicateSortedArray(output);

      fs.writeFileSync(filename, JSON.stringify(dedupOut, null, 2));
    })
    .catch((err) => {
      console.error(err);
    });
}

outputLicenses(true);
