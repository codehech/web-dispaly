export default function sum(...arg) {
    console.log('sum1122')
    return arg.reduce((p, c) => p + c, 0)
}