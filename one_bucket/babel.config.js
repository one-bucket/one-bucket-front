module.exports = {
    presets: [
        'module:@react-native/babel-preset',
        // '@babel/preset-typescript',
        // '@babel/preset-react',
        // '@babel/preset-env',
    ],
    plugins: [
        [
            'module-resolver',
            {
                root: ['./src'],
                extensions: [
                    '.ios.ts',
                    '.android.ts',
                    '.ts',
                    '.ios.tsx',
                    '.android.tsx',
                    '.tsx',
                    '.jsx',
                    '.js',
                    '.json',
                ],
                alias: {
                    '@': './src',
                    '@const': './src/const',
                },
            },
        ],
        [
            'module:react-native-dotenv',
            {
                envName: 'APP_ENV',
                moduleName: '@env',
                path: '.env.local',
                blacklist: null,
                whitelist: null,
                safe: false,
                allowUndefined: true,
                verbose: false,
            },
        ],
        'react-native-reanimated/plugin',
    ],
}
