const babel = require("@babel/core"); // 转换箭头函数


let code = babel.transform(`const fn = () => {
    console.log('a')
}`, {
  plugins: ['@babel/plugin-transform-arrow-functions']
});

const fn = function () {
  console.log('a');
};

const filename = "example.js";
const source = `const fn = () => {
    console.log('a')
}`; // Load and compile file normally, but skip code generation.

const {
  ast
} = babel.transformSync(source, {
  filename,
  ast: true,
  code: false
});
console.log(ast);