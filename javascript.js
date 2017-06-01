// --------------------------------------------------------
// No javascript podemos usar "var", "let", e "const" para declarar variáveis

function varExample () {
  var a = 1
  if (true) {
    var b = 2
  }
  console.log(a, b) // 1, 2
}

// A diferença de "var" e "let" é o escopo da variável declarada. "var" sempre terá
// escopo de uma função, enquanto "let" tem escopo apenas de blocos como "if" e "for"
function letExample () {
  var a = 1
  if (true) {
    let b = 2
  }
  console.log(a, b) // ReferenceError: b is not defined
}

// "const" é a palavra que nós usaremos na maioria dos casos para declarar variáveis.
// O escopo do "const" é igual o do "let", mas o "const" tem uma propriedade a mais:
// ele impossibilita você de referênciar algum outro valor para a variável declarada.

let a = 1
a = 2
a = "potato"
a += 1 // potato1

// Nós podemos fazer o que quisermos com a referência de "a". Mas se tentarmos fazer
// o mesmo usando "const":

const b = 1
b = 2 // TypeError: Assignment to constant variable.
b += 2 // TypeError: Assignment to constant variable.

// Isso pode parecer ruim caso você não esteja acostumado a trabalhar usando
// imutabilidade, mas com um pouco de tempo utilizando um paradigma mais funcional
// essa prática começa a fazer sentido.

// Aviso:
// O const não significa que a variável é imutável, ele apenas previne você de
// dar outro valor para ela usando "=" novamente.


// --------------------------------------------------------
// No javascript qualquer variável pode ser uma função ou o resultado de uma função,
// e tudo que pode receber um valor também pode receber uma função ou o resultado.

function umaFuncao () {
    console.log('faz coisas aqui dentro')
    return 'e sempre deveria retornar alguma coisa'
}

const funcao = umaFuncao

funcao === umaFuncao // true

const resultadoDeUmaFuncao = funcao() // 'e sempre deveria retornar alguma coisa'

function outraFuncao (parametro) {
  return parametro()
}

function tambemPodeSerUsadaComoParametro () {
  return 'confirmado!'
}

outraFuncao(tambemPodeSerUsadaComoParametro) // confirmado!


// --------------------------------------------------------
// No javascript podemos reduzir funções em forma de "arrow functions"

// 'function declaration'
function double (x) {
  return x * 2
}
// 'function expression'
const double = function (x) {
  return x * 2
}
// 'arrow function'
const double = (x) => {
  return x * 2
}
// Arrow functions que teriam apenas um ";" nao precisam de chaves. Por acaso você
// sentiu falta de algum ";" até agora? O ";" é opcional no javascript contanto que
// você não comece uma linha com ( ou [ (mais informações https://mislav.net/2010/05/semicolons/)
const double = (x) => x * 2
// podemos omitir os parênteses
const double = x => x * 2

// Existe uma diferença de comportamento entre 'arrow-function', 'anonymous function'
// que veremos mais pra frente quando falaremos sobre "this"







// --------------------------------------------------------
// daqui pra baixo esta em progresso, ignorem
// --------------------------------------------------------







// Imutabilidade e Funções puras

var contador = 0

const incrementar = () => {
    contador = contador + 1
    return contador
}

incrementar() // 1
incrementar() // 2
incrementar() // 3

const incrementarPuro = counter => counter + 1

incrementarPuro(0) // 1
incrementarPuro(1) // 2
incrementarPuro(2) // 3
incrementarPuro(0) // 1

incrementarPuro(incrementarPuro(incrementarPuro(0))) // 3

const tambemPura = (counter) => {
    // counter não imutável
    counter = incrementarPuro(counter)
    counter = incrementarPuro(counter)
    counter = incrementarPuro(counter)
    return counter
}
tambemPura(0) // 3

const maisUmaPura = (counter) => incrementarPuro(incrementarPuro(incrementarPuro(counter)))
maisUmaPura(0) // 3

// --------------------------------------------------------

// This + Javascript = wtf

function logThis (x, y) {
    console.log(this, x, y)
}
logThis() // Window undefined undefined

function logThisStrict (x, y) {
    'use strict'
    console.log(this, x, y)
}
logThisStrict() // undefined undefined undefined

const logThisBound = logThis.bind('algo')
logThisBound() // 'algo' undefined undefined

const logThat = logThis.bind(null, 'laranja')
logThat() // null laranja undefined

const anotherLogThat = logThat.bind(null, 'verde')
anotherLogThat() // null laranja verde

// --------------------------------------------------------

// Função de soma + bind para fazer aplicação parcial de parâmetros

function addSemArrowFunction (x, y) {
    return x + y
}

const add = (x, y) => x + y
add(2, 3) // 5

const add5 = add.bind(null, 5)
add5(10) // 15

// Sem bind
const addCurried = x => y => x + y
// function addCurried (x) {
//     return function (y) {
//         return x + y
//     }
// }

const add6 = addCurried(6)
add6(10) // 16

addCurried(2)(3) // 5
addCurried(2, 3) // y => x + y
// Seria bom se os 2 funcionassem :)

// --------------------------------------------------------

// Ramda - Todas as funções são puras, não mutam a entrada, e sempre retornam alguma coisa!

import { curry, prop, propEq, filter } from 'ramda'

const add = curry((x, y) => x + y)

const add5 = add(5)
add5(10) // 15

const transaction = { amount: 1000, status: 'paid' }
prop('status', transaction) // 'paid'
propEq('status', 'paid', transaction) // true

const transactions = [
    { amount: 1000, status: 'paid' },
    { amount: 2400, status: 'refunded' },
    { amount: 3000, status: 'paid' },
    { amount: 4000, status: 'paid' },
    { amount: 5500, status: 'refunded' },
]

// Filtrando transações com status paid

// sem ramda
const statusPaid = transaction => transaction.status === 'paid'
const uglyPaidOnly = transactions => transactions.filter(statusPaid)
uglyPaidOnly(transactions)

// usando o filter do ramda
const statusPaid = transaction => transaction.status === 'paid'
const paidOnly = filter(statusPaid) 
paidOnly(transactions) // ou seja, executamos o filter assim: filter(statusPaid, transactions)

// propEq
const statusPaid = propEq('status', 'paid')
const paidOnly = filter(statusPaid)

paidOnly(transactions) 

// --------------------------------------------------------

// Ramda + promises = <3

fetch('rota de transactions')
  .then(transaction => transactions.filter(transaction => transaction.status === 'paid'))

const statusIs = propEq('status')

fetch('rota de transactions')
  .then(transaction => transactions.filter(statusIs('paid')))

fetch('rota de transactions')
  .then(filter(statusIs('paid')))

fetch('rota de transactions')
  .then(filter(statusIs('refunded')))

// --------------------------------------------------------

// Componha funções a partir das que você ja tem

import { pipe, add } from 'ramda'

const double = x => x * 2
const add10AndDouble = pipe(add(10), double)

add10AndDouble(5) // 30

Promise.resolve(5)
  .then(add(10))
  .then(double)
  .then(console.log) // 30
