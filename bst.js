class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

export class Tree {
    constructor(array = []) {
        this.root = this.buildTree(array);
    }

    // For an array of numbers:
    // Return a sorted array without duplicate values
    static initializeArray(array) {
        const initialized = [...new Set(array)];
        return initialized.sort((a, b) => a - b);
    }

    // Returns the node's next inorder node, its parent node, and a string specifying whether it to the left or right of the parent
    // Returns null if there isn't a next inorder node for the specified node
    static getNextInOrderAndParent(node) {
        if (node.right === null) {
            return null;
        }
        let currentNode = node.right;
        let parentNode = node;
        let lastMove = 'right';

        while (currentNode.left !== null) {
            parentNode = currentNode;
            lastMove = 'left';
            currentNode = currentNode.left;
        }

        return {
            nextInorderNode: currentNode,
            nextInorderParent: parentNode,
            nextInorderLocation: lastMove,
        };
    }

    #sortedToBST(sortedArray, start, end) {
        if (start > end) {
            return null;
        }

        const mid = Math.floor((start + end) / 2);

        const root = new Node(sortedArray[mid]);

        root.left = this.#sortedToBST(sortedArray, start, mid - 1);
        root.right = this.#sortedToBST(sortedArray, mid + 1, end);

        return root;
    }

    buildTree(array) {
        if (array.length === 0) {
            return null;
        }

        const sortedArray = Tree.initializeArray(array);
        return this.#sortedToBST(sortedArray, 0, sortedArray.length - 1);
    }

    // Returns the node representing the value, its parent node, and a string specifying whether it to the left or right of the parent
    // Returns null for an invalid node
    getNodeAndParent(value) {
        let currentNode = this.root;
        let parentNode = this.root;
        let lastMove = '';

        while (currentNode !== null) {
            if (currentNode.data < value) {
                parentNode = currentNode;
                currentNode = currentNode.right;
                lastMove = 'right';
            } else if (currentNode.data > value) {
                parentNode = currentNode;
                currentNode = currentNode.left;
                lastMove = 'left';
            } else {
                return { selectedNode: currentNode, parentNode, lastMove };
            }
        }

        return null;
    }

    // Returns the node with the specified value
    // Returns null if the node wasn't found
    find(value) {
        let currentNode = this.root;

        while (currentNode !== null) {
            if (currentNode.data < value) {
                currentNode = currentNode.right;
            } else if (currentNode.data > value) {
                currentNode = currentNode.left;
            } else {
                return currentNode;
            }
        }

        return null;
    }

    // Inserts a leaf into the BST
    // Duplicate values are not added
    insert(value) {
        let currentNode = this.root;
        let parentNode = this.root;

        // Traverse until parenNode is the parent node of the node to insert
        while (currentNode !== null) {
            if (value > currentNode.data) {
                parentNode = currentNode;
                currentNode = currentNode.right;
            } else if (value < currentNode.data) {
                parentNode = currentNode;
                currentNode = currentNode.left;
            }
            // No duplicate values allowed => exit
            else {
                return;
            }
        }

        // Insert according to value
        if (value < parentNode.data) {
            parentNode.left = new Node(value);
        } else if (value > parentNode.data) {
            parentNode.right = new Node(value);
        }
    }

    // 3 possible cases:
    // (1) Leaf node => point its parent to null instead of the selected node;
    // (2) Node with a singular child => point its parent to the selected node's child
    // (3) Node with two children => get next inorder =>
    //  => replace selected with next inorder value =>
    // => point next inorder parent to the next inorder's right child (null/node)
    deleteItem(value) {
        const nodesObj = this.getNodeAndParent(value);
        if (nodesObj === null) {
            return;
        }

        const { selectedNode, parentNode, lastMove } = nodesObj;

        // Case (1):
        if (selectedNode.left === null && selectedNode.right === null) {
            if (selectedNode.data === this.root.data) {
                this.root = null;
            } else {
                if (lastMove === 'right') {
                    parentNode.right = null;
                } else if (lastMove === 'left') {
                    parentNode.left = null;
                }
            }

            return;
        }

        // Case (2):
        // Selected has left child only
        if (selectedNode.left !== null && selectedNode.right === null) {
            if (lastMove === 'right') {
                parentNode.right = selectedNode.left;
            } else if (lastMove === 'left') {
                parentNode.left = selectedNode.left;
            }
            return;
        }
        // Selected has right child only
        if (selectedNode.right !== null && selectedNode.left === null) {
            if (lastMove === 'right') {
                parentNode.right = selectedNode.right;
            } else if (lastMove === 'left') {
                parentNode.left = selectedNode.right;
            }
            return;
        }

        // Case (3):
        const nextInorderObj = Tree.getNextInOrderAndParent(selectedNode);

        if (nextInorderObj === null) {
            return;
        }

        const { nextInorderNode, nextInorderParent, nextInorderLocation } =
            nextInorderObj;

        // null or Node
        const nextInorderChild = nextInorderNode.right;

        selectedNode.data = nextInorderNode.data;

        if (nextInorderLocation === 'right') {
            nextInorderParent.right = nextInorderChild;
        } else if (nextInorderLocation === 'left') {
            nextInorderParent.left = nextInorderChild;
        }
    }

    // Executes the provided callback on each of the BST's nodes
    // This function uses level order traversal to determine the order of execution
    levelOrder(callback) {
        if (callback === undefined) {
            throw new Error(
                'A callback is required to execute the levelOrder class method',
            );
        }

        const pseudoQueue = [this.root];
        let count = 0;
        while (count <= pseudoQueue.length - 1) {
            const currentNode = pseudoQueue[count];
            callback(currentNode);
            if (currentNode.left !== null) {
                pseudoQueue.push(currentNode.left);
            }
            if (currentNode.right !== null) {
                pseudoQueue.push(currentNode.right);
            }
            count += 1;
        }
    }

    // Traverse the tree in a inorder fashion
    // Execute the callback on the nodes as you're traversing
    inOrder(callback, root = this.root) {
        if (callback === undefined) {
            throw new Error(
                'A callback is required to execute the inOrder class method',
            );
        }

        if (root === null) {
            return;
        }

        this.inOrder(callback, root.left);
        callback(root);
        this.inOrder(callback, root.right);
    }

    // Traverse the tree in a post order fashion
    // Execute the callback on the nodes as you're traversing
    postOrder(callback, root = this.root) {
        if (callback === undefined) {
            throw new Error(
                'A callback is required to execute the inOrder class method',
            );
        }

        if (root === null) {
            return;
        }

        this.postOrder(callback, root.left);
        this.postOrder(callback, root.right);
        callback(root);
    }

    // Traverse the tree in a pre order fashion
    // Execute the callback on the nodes as you're traversing
    preOrder(callback, root = this.root) {
        if (callback === undefined) {
            throw new Error(
                'A callback is required to execute the inOrder class method',
            );
        }

        if (root === null) {
            return;
        }

        callback(root);
        this.preOrder(callback, root.left);
        this.preOrder(callback, root.right);
    }

    // Return the height of the node
    // Return null if the node isn't found
    height(value, optNode = null) {
        const node = optNode !== null ? optNode : this.find(value);
        if (node === null) {
            return null;
        }

        if (node.left === null && node.right === null) {
            return 0;
        }

        // Initialize the array to contain the nodes one level below the selected nodes
        const currentLevel = [];
        if (node.left !== null) {
            currentLevel.push(node.left);
        }
        if (node.right !== null) {
            currentLevel.push(node.right);
        }

        let nextLevel = [];
        let height = 0;

        // Increment height until you reach the furthest leaf node from the selected node
        while (currentLevel.length > 0) {
            height += 1;
            // Get the nodes from the next level
            while (currentLevel.length > 0) {
                const currentNode = currentLevel[currentLevel.length - 1];
                if (currentNode.left !== null) {
                    nextLevel.push(currentNode.left);
                }
                if (currentNode.right !== null) {
                    nextLevel.push(currentNode.right);
                }
                currentLevel.pop();
            }
            // Next level becomes the current
            for (const element of nextLevel) {
                currentLevel.push(element);
            }
            nextLevel = [];
        }
        return height;
    }

    // Return the depth of the node
    // Return null if the node isn't found
    depth(value) {
        let currentNode = this.root;
        let count = 0;

        while (currentNode !== null) {
            if (currentNode.data < value) {
                count += 1;
                currentNode = currentNode.right;
            } else if (currentNode.data > value) {
                count += 1;
                currentNode = currentNode.left;
            } else {
                return count;
            }
        }

        return null;
    }

    // Check if the tree is balanced
    isBalanced(root = this.root) {
        const leftHeight = root.left !== null ? this.isBalanced(root.left) : 0;
        const rightHeight =
            root.right !== null ? this.isBalanced(root.right) : 0;

        // This means the tree or one of the subtrees is not balanced
        if (leftHeight === false || rightHeight === false) {
            return false;
        }

        if (leftHeight === 0 && rightHeight === 0) {
            return 1;
        }

        if (Math.abs(leftHeight - rightHeight) <= 1) {
            // If this is true this means we completed the check for all subtrees and the root node
            // If we don't use this conditional the function will simply return the height of the root node
            if (root.data === this.root.data) {
                return true;
            }

            return leftHeight >= rightHeight ? leftHeight + 1 : rightHeight + 1;
        }

        return false;
    }

    // Rebalance the tree
    rebalance() {
        const sortedArray = [];
        const pushToSorted = (node) => sortedArray.push(node.data);
        // Inorder traversal traverses the tree from the smallest node to the biggest
        // Therefore, we can use it to build a sorted array from the tree's nodes
        this.inOrder(pushToSorted);

        this.root = this.#sortedToBST(sortedArray, 0, sortedArray.length - 1);
    }
}
