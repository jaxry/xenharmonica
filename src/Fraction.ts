export default class Fraction {
  numerator: number
  denominator: number

  constructor (numerator = 1, denominator = 1) {
    this.numerator = numerator
    this.denominator = denominator
  }

  get number () {
    return this.numerator / this.denominator
  }

  simplify () {
    const gcd = computeGcd(this.numerator, this.denominator)
    this.numerator /= gcd
    this.denominator /= gcd
  }

  multiply (x: Fraction) {
    this.numerator *= x.numerator
    this.denominator *= x.denominator
    this.simplify()
  }

  add (x: Fraction) {
    this.numerator =
        this.numerator * x.denominator + this.denominator * x.numerator
    this.denominator = this.denominator * x.denominator
    this.simplify()
  }

  toString () {
    if (this.denominator !== 1) {
      return `${this.numerator} / ${this.denominator}`
    } else {
      return this.numerator.toString()
    }
  }
}

function computeGcd (a: number, b: number) {
  while (b !== 0) {
    const t = b
    b = a % b
    a = t
  }
  return a
}