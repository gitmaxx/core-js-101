/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = function t() {
    return this.width * this.height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const s = JSON.parse(json);
  Object.keys(s).forEach((key) => {
    const v = s[key];
    s[key] = { value: 0 };
    s[key].value = v;
    s[key].writable = true;
    s[key].enumerable = true;
    s[key].configurable = true;
  });
  const g = Object.create(proto, s);
  return g;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */


function Selector(str, type) {
  this.types = [type];
  switch (type) {
    case 'class':
      this.str = `.${str}`;
      break;
    case 'id':
      this.str = `#${str}`;
      break;
    case 'attr':
      this.str = `[${str}]`;
      break;
    case 'pseudoClass':
      this.str = `:${str}`;
      break;
    case 'pseudoElement':
      this.str = `::${str}`;
      break;
    default: this.str = str;
  }
  this.stringify = function stringify() {
    return this.str;
  };
  this.id = function id(value) {
    if (this.types.includes('id')) { throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector'); }
    if (this.types[this.types.length - 1] !== 'element') { throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'); }
    this.types.push('id');
    this.str = `${this.str}#${value}`;
    return this;
  };
  this.class = function cl(value) {
    if (this.types[this.types.length - 1] !== 'id' && this.types[this.types.length - 1] !== 'element' && this.types[this.types.length - 1] !== 'class') { throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'); }
    this.str = `${this.str}.${value}`;
    return this;
  };
  this.element = function el(value) {
    if (this.types.includes('element')) { throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector'); }
    if (this.types[this.types.length - 1] !== 'element') { throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'); }
    this.types.push('id');
    this.types.push('element');
    this.str = `${this.str}${value}`;
    return this;
  };
  this.attr = function attr(value) {
    if (this.types[this.types.length - 1] === 'pseudoClass' || this.types[this.types.length - 1] === 'pseudoElement') { throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'); }
    this.str = `${this.str}[${value}]`;
    return this;
  };
  this.pseudoClass = function pseudoClass(value) {
    if (this.types[this.types.length - 1] === 'pseudoElement') { throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'); }
    this.str = `${this.str}:${value}`;
    return this;
  };
  this.pseudoElement = function pseudoElement(value) {
    if (this.types.includes('pseudoElement')) { throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector'); }
    this.types.push('pseudoElement');
    this.str = `${this.str}::${value}`;
    return this;
  };
}

function ComboSelector(s1, s2, combo) {
  this.str = `${s1.str} ${combo} ${s2.str}`;
  this.stringify = function stringify() {
    return this.str;
  };
}

const cssSelectorBuilder = {
  element(value) {
    return new Selector(value, 'element');
  },

  id(value) {
    return new Selector(value, 'id');
  },

  class(value) {
    return new Selector(value, 'class');
  },

  attr(value) {
    return new Selector(value, 'attr');
  },

  pseudoClass(value) {
    return new Selector(value, 'pseudoClass');
  },

  pseudoElement(value) {
    return new Selector(value, 'pseudoElement');
  },

  combine(selector1, combinator, selector2) {
    return new ComboSelector(selector1, selector2, combinator);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
