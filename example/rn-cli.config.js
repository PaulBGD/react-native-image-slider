// const blacklist = require('react-native/packager/blacklist');
//
// const reactNativeRoot = path.resolve(__dirname, '..', '..');
//
// const config = {
//   getBlacklistRE(platform) {
//     return blacklist([
//       new RegExp(`${reactNativeRoot}/node_modules/react-native/.*`),
//     ]);
//   }
// };
//
// module.exports = config;

const blacklist = require('metro-config/src/defaults/blacklist');

module.exports = {
    resolver: {
        blacklistRE: blacklist([
            /node_modules\/.*\/node_modules\/react-native\/.*/,
        ])
    },
};
