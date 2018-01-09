let _ = require('./util');

/**
 * Virtual-dom Element.
 * @param {String} tagName 标签名
 * @param {Object} props 节点属性队列
 *                       - Element's properties,
 *                       - using object to store key-value pair
 * @param {Array<Element|String>} 该节点子节点
 *                                - This element's children elements.
 *                                - Can be Element instance or just a piece plain text.
 */
function Element (tagName, props, children) {
    if (!(this instanceof Element)) {
        if (!_.isArray(children) && children !== null) {
            children = _.slice(arguments, 2).filter(_.truthy)
        }
        return new Element(tagName, props, children)
    }

    if (_.isArray(props)) {
        children = props;
        props = {};
    }

    this.tagName = tagName;
    this.props = props || {};
    this.children = children || [];
    this.key = props
        ? props.key
        : void 666;

    let count = 0;

    _.each(this.children, function (child, i) {
        if (child instanceof Element) {
            count += child.count
        } else {
            children[i] = '' + child
        }
        count++
    });

    this.count = count;
}

/**
 * Render the hold element tree.
 */
Element.prototype.render = function () {
    let el = document.createElement(this.tagName); // 根据tagName构建
    let props = this.props;

    for (let propName in props) { // 设置节点的DOM属性
        let propValue = props[propName];
        el.setAttribute(propName, propValue)
    }

    let children = this.children || [];

    children.forEach(function (child) {
        let childEl = (child instanceof Element)
            ? child.render() // 如果子节点也是虚拟DOM，递归构建DOM节点
            : document.createTextNode(child); // 如果字符串，只构建文本节点
        el.appendChild(childEl)
    });

    return el
};

module.exports = Element;