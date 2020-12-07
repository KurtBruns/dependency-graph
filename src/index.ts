/*
* Author: Kurt Bruns
* Date: 2020 12 05
*/

/**
* A node class contains data and a recursive next point.
*/
class Node<T> {

	/**
	* Pointer to the next node in the list
	*/
	next : Node<T>;

	/**
	* Internal type
	*/
	data: T;

	/**
	Constructs a new node with the provided data and sets next to be null.
	*/
	constructor( data: T) {
		this.data = data;
		this.next = null;
	}

	/**
	* Returns the string representation of the data.
	*/
	toString() : string {
		return this.data.toString();
	}
}

/**
* A dynamic, singlely linked list.
*/
export class LinkedList<T> implements Iterable<T> {
  
	// Contains head of linked list
	private head: Node<T>;

	/**
	 * The number of elements within the linked list
	 */
	private count: number;

	/**
	Consstructs an empty linked list.
	*/
	constructor() {
		this.head = null;
		this.count = 0;
	}

	/**
	Inserts a node at the beginning of the list
	*/
	insert( element:T ) {
		if( this.head == null ) {
			this.head = new Node(element);
		} else {
			let temp = this.head;
			this.head = new Node(element);
			this.head.next = temp;
		}
		this.count++;
	}

	/**
	Returns the first element in the list, or null if the list is empty.
	*/
	first() : T {
		if( this.head != null) {
			return this.head.data;
		} else {
			return null;
		}
	}

	/**
	* Removes the first element in the list. Returns true if element was successfully removed, 
	* false otherwise.
	*/
	remove() : boolean {
		if( this.head != null ) {
			this.head = this.head.next;
			this.count--;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Returns the number of elements contained within the linked list.
	 */
	size() : number {
		return this.count;
	}

	/**
	* Prints out the string reprsentation of this linked list.
	*/
	toString() : string {
		let current = this.head;
		let str = '';
		while( current != null) {
			str += current.toString() + ' ';
			current = current.next;
		}
		return str.substr(0, str.length - 1);
	}

	/**
	Returns an iterator over the elements in the list
	*/
	[Symbol.iterator](): Iterator<T> {
		let current = this.head;

		const iterator = {
			next() {
				if( current == null) {
					return {
						done: true,
						value: undefined
					}
				} else {
					let data = current.data;
					current = current.next;
					return {
						done: false,
						value: data
					}
				}
			}
		}

		return iterator;
	}
}

/**
A dependency graph models relationships between nodes. The graph is directed and asyclic, throwing 
* a circular dependency exception if circular dependencies are added.
*/
export class DependencyGraph<T> {

	// Stores the relationships between nodes
	private relationships : Map< T, Set<T>>;

	// Keeps track of the number of nodes in this dependency graph
	private _size : number;

	/**
	Constructs an empty dependency graph.
	*/
	constructor() {
		this.relationships = new Map<T, Set<T>>();
		this._size = 0;
	}

	/**
	* Adds a node into the dependency graph. If the node already exists within the graph, does
	* nothing.
	*/
	add( node:T ) : void {
		if( !this.contains(node) ) {
			this.relationships.set( node, new Set<T>());
			this._size++;
		}
	}

	/**
	Returns true if the node exists within the dependency graph.
	*/
	contains( node:T ) : boolean {
		return this.relationships.has(node);
	}

	/**
	Removes the node from the dependency graph. If the node does not exist does nothing.
	*/
	remove( node:T ) : void {
		if (this.relationships.delete(node))
		{
			this._size--;
		}
	}

	/**
	Returns the number of vertices in the dependency graph.
	*/
	size() : number {
		return this._size;
	}

	/**
	Adds a dependency between two nodes. If either of the nodes do not exist within the dependency 
	* graph, throws an exception.
	*/
	addDependency( from:T, to:T) : void {
		// Make sure the nodes exist
		this.add(from);
		this.add(to);

		// Add the dependency
		this.relationships.get(from).add(to);

		// Check for circular dependencies
		this.traverse( from, from);
	}

	/**
	Traverses the graph structuring checking for circular dependecies. If a circular dependency is 
	* added, throws an error.
	*/
	private traverse( current:T, node:T, visited:Set<T> = new Set<T>()) : void {
		// Mark this node as visited
		visited.add(current);

		// Recursively call this method on dependents of the argument node
		let dependents = this.getDependents( current, true);
		for( let d of dependents ) {
			// Check if this dependency causes a circular dependency
			if( d == node ) {
				throw new Error("circular dependency");
			}

			// Continue traversing un-explored nodes
			if(!visited.has(d)) {
				this.traverse(d, node, visited);
			}
		}
	}

	/**
	Returns true if a node has dependents.
	*/
	hasDependents( node:T ) : boolean {
		return this.contains(node) && this.relationships.get( node).size != 0;
	}

	/**
	* Returns the adjacent dependent nodes.
	*/
	getAdjacentNodes( node:T ) : Set<T> {
		return this.relationships.get(node);
	}

	/**
	* Returns an iterator to the dependents of the node.
	*/
	getDependents( node:T, shallow:boolean = false ) : Iterable<T> {
		// If the node does not exist return an empty iterable
		if( !this.relationships.has(node)) {
			return [];
		}

		// If shallow, return adjacent dependencies.
		if( shallow ) {
			return this.relationships.get(node).keys();
		} else {
			// Get the dependents including the original node.
			let list : LinkedList<T> = this.getTopologicalDependents( node );

			// Remove the starting node and return the dependents.
			list.remove();
			return list;
		}
	}

	/**
	* Returns a topological sort of this dependency
	*/
	getTopologicalSort() : LinkedList<T> {

		let list = new LinkedList<T>();
		let visited = new Set<T>();
		for (let node of this.getNodes()) {
			if( !visited.has(node)) {
				this.getTopologicalDependents(node, visited, list);
			}
		}

		return list;
	}

	/**
	Returns a list of the arguent node and all of its dependents in topological order.
	*/
	private getTopologicalDependents( node:T, visited:Set<T> = new Set<T>(), list:LinkedList<T> = new LinkedList<T>()) : LinkedList<T> {
		// Mark this node as visited
		visited.add(node);

		// Recursively call this method on dependents of the argument node
		let dependents = this.getDependents( node, true);
		for( let d of dependents ) {
			if(!visited.has(d)) {
				this.getTopologicalDependents(d, visited, list);
			}
		}

		// Insert node to the front of iterator to retain Topological ordering
		list.insert(node);
		return list;
	}

	/**
	Returns the nodes within this dependency graph.
	*/
	getNodes() : Iterable<T> {
		return this.relationships.keys();
	}

	/**
	Returns a string representation of this dependency graph.
	*/
	toString() : string {
		// Build a string of dependencies in the form of from->to
		let result = "";
		for( let from of this.getNodes() ) {
			for( let to of this.getDependents(from, true) ) {
				result += from.toString() + '->' + to.toString() + '\n';
			}
		}
		return result;
	}

	/**
	Generates a DependenyGraph object from a string representation.
	*/
	static Generate( str:string ) : DependencyGraph<string> {
		let graph = new DependencyGraph<string>();

		// Prime the loop
		let start = 0;
		let index = str.indexOf('->', start);
		while( index > 0) {

			// Get the first part of the dependency
			let from = str.substring(start, index);

			// Get the second part of the dependency
			start = index + 1;
			index = str.indexOf('\n', index);
			let to = str.substring(start + 1, index );

			// Add the dependency to the graph
			graph.addDependency(from, to);

			// Get the next string if there is one
			start = index + 1;
			index = str.indexOf('->', start);
		}

		return graph;
	}
}
