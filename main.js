import { Tree } from './bst.js';

// BST printing algorithm - provided by "The Odin Project"
const prettyPrint = (node, prefix = '', isLeft = true) => {
    if (node === null) {
        return;
    }
    if (node.right !== null) {
        prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null) {
        prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
};

const logNodes = (node) => console.log(node.data);

// BST Showcase:

// Create an array of 10 random numbers from 1 to 100
const inputArray = [];
for (let i = 1; i <= 10; i += 1) {
    const randomNum = Math.floor(Math.random() * 100 + 1);
    inputArray.push(randomNum);
}

// Create a balanced BST from the input array
const bst = new Tree(inputArray);

console.log('Printing Tree:');
prettyPrint(bst.root);
console.log('\n\n\n');

console.log(`Is tree balanced: ${bst.isBalanced()}\n`);

console.log('Level Order (Breadth First) Traversal:');
bst.levelOrder(logNodes);

console.log('\nPre-Order (Depth First) Traversal:');
bst.preOrder(logNodes);

console.log('\nIn-Order (Depth First) Traversal:');
bst.inOrder(logNodes);

console.log('\nPost-Order (Depth First) Traversal:');
bst.postOrder(logNodes);

// Adding an additional 10 elements
for (let i = 1; i <= 10; i += 1) {
    const randomNum = Math.floor(Math.random() * (1000 - 100 + 1) + 100);
    inputArray.push(randomNum);
    bst.insert(randomNum);
    console.log(`Inserted: ${randomNum}`);
}

console.log('\nPrinting Tree:');
prettyPrint(bst.root);
console.log('\n\n\n');

console.log(`Is tree balanced: ${bst.isBalanced()}\n`);

console.log('\nRebalancing Tree:');
bst.rebalance();

console.log('\nPrinting Tree:');
prettyPrint(bst.root);
console.log('\n\n\n');

console.log(`Is tree balanced: ${bst.isBalanced()}\n`);

console.log('Level Order (Breadth First) Traversal:');
bst.levelOrder(logNodes);

console.log('\nPre-Order (Depth First) Traversal:');
bst.preOrder(logNodes);

console.log('\nIn-Order (Depth First) Traversal:');
bst.inOrder(logNodes);

console.log('\nPost-Order (Depth First) Traversal:');
bst.postOrder(logNodes);

// From here, you can use the indexes of 'inputArray' (0-19) to execute various class methods
// Here's an example:

// As a reference
console.log('\nPrinting Tree:');
prettyPrint(bst.root);
console.log('\n\n\n');

console.log(`The Height of ${inputArray[7]} is: ${bst.height(inputArray[7])}`);
console.log(`The Depth of ${inputArray[7]} is: ${bst.depth(inputArray[7])}\n`);

console.log(`The Height of ${inputArray[18]} is: ${bst.height(inputArray[18])}`);
console.log(`The Depth of ${inputArray[18]} is: ${bst.depth(inputArray[18])}\n`);

console.log(`Is ${inputArray[3]} a node in the tree: ${bst.find(inputArray[3]) !== null ? true : false}`);
console.log(`Is 1773 a node in the tree: ${bst.find(1773) === null ? false : true}`);