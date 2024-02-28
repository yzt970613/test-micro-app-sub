module.exports = {
  presets: [require('@kt/unity-tailwind-preset')],
  content: [
    './public/**/*.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    // 允许编译 npm 包
    './node_modules/@kt/**/*.{vue,js,ts,jsx,tsx}'
  ],
  plugins: []
};
