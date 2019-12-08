
const babel = require("@babel/core");
const parser = require('@babel/parser');
const generate = require('@babel/generator');
const codeFrame = require('@babel/code-frame')
const template = require('@babel/template')
const t = require('@babel/types')
const traverse = require('@babel/traverse')

// 转换箭头函数
let code = babel.transform(`const fn = () => {
    console.log('a')
}`, { plugins: ['@babel/plugin-transform-arrow-functions']})

const fn = () => {
    console.log('a')
}

const filename = "example.js";
const source = `const fn = () => {
    console.log('a')
}`;

// 转换生成 ast，map
const { ast, map } = babel.transformSync(source, { filename, ast: true, code: false });
// console.log(`ast: ${ast}, map: ${map}`)

// 解析成 ast
let result = parser.parse(source)
// console.log(result)

// 将 ast 转换成 code
const gen = new generate.CodeGenerator(result)
const output = gen.generate()
console.log(output)

// code-frame，根据 location 标识出对应的代码所在范围
const rawLines = `class Foo {
    constructor() {
        console.log("hello");
    }
}`

const location = { start: { line: 2, column: 16 }, end: { line: 4, column: 4} }
result = codeFrame.codeFrameColumns(rawLines, location, { highlightCode: true })
console.log(result)

// template
const buildRequire = template.default(`
    var %%importName%% = require(%%source%%)
`)

// 设置值
const ast1 = buildRequire({
    importName: t.identifier('myModule'),
    source: t.stringLiteral('my-module')
})

// 输出 ast
console.log(template.default.ast(`var myModule = require("my-module")`))

const gen1 = new generate.CodeGenerator(ast1)
console.log(gen1.generate())

// traverse
const code2 = `
function square(n) {
    return n * n;
}
`

const ast2 = parser.parse(code2)

traverse.default(ast2, {
    enter(path) {
        if (path.isIdentifier({ name: 'n'})) {
            path.node.name = 'x'
        }
    }
})

traverse.default(ast2, {
    FunctionDeclaration: function(path) {
        path.node.id.name = 'x'
    }
})

// types
t.anyTypeAnnotation()
t.arrayExpression([])