
import { DependencyGraph, LinkedList }  from './index';

test('should construct a linked list of size 0', () => {
    let ll = new LinkedList();
    expect(ll.size()).toBe(0);
  });
  
  test('should return null if the list is empty', () => {
      let ll = new LinkedList();
      expect(ll.first()).toBe(null);
  });
  
  test('should return the first element of the list ', () => {
      let ll = new LinkedList<string>();
      ll.insert('a');
      expect(ll.first()).toBe('a');
  });
  
  test('should return the first element of the list ', () => {
      let ll = new LinkedList<string>();
      ll.insert('a');
      ll.insert('b');
      expect(ll.first()).toBe('b');
  });
  
  test('remove should return false when called on an empty list', () => {
      let ll = new LinkedList<string>();
      expect(ll.remove()).toBe(false);
  });
  
  test('remove should remove the first element of the list', () => {
      let ll = new LinkedList<string>();
      ll.insert('a');
      ll.insert('b');
      expect(ll.remove()).toBe(true);
      expect(ll.first()).toBe('a');
  });
  
  test('should be able to create an array from linked list', () => {
      let ll = new LinkedList<string>();
      ll.insert('x');
      ll.insert('y');
      ll.insert('z');
      expect(Array.from(ll)).toEqual(['z','y','x']);
  });
  
  test('should be able to create an array from linked list', () => {
      let ll = new LinkedList<string>();
      ll.insert('x');
      ll.insert('y');
      ll.insert('z');
      ll.remove();
      expect(Array.from(ll)).toEqual(['y','x']);
  });

test('construct dependency graph of size zero', () => {
    let dg = new DependencyGraph<string>();
  expect(dg.size()).toBe(0);
});

test('add single element', () => {
    let dg = new DependencyGraph<string>();
    dg.add('a');
    expect(dg.size()).toBe(1);
    expect(dg.contains('a')).toBe(true);
});

test('add multiple elements', () => {
    let dg = new DependencyGraph<string>();
    dg.add('a');
    dg.add('b');
    dg.add('c');
    expect(dg.size()).toBe(3);
    expect(dg.contains('a')).toBe(true);
    expect(dg.contains('b')).toBe(true);
    expect(dg.contains('c')).toBe(true);
});

test('should do nothing when identical element is added', () => {
    let dg = new DependencyGraph<string>();
    dg.add('a');
    dg.add('a');
    expect(dg.size()).toBe(1);
});

test('remove an element', () => {
    let dg = new DependencyGraph<string>();
    dg.add('a');
    dg.remove('a');
    expect(dg.size()).toBe(0);
});

test('simple dependency', () => {
    let dg = new DependencyGraph<string>();
    dg.add('a');
    dg.add('b');
    dg.addDependency('a', 'b');
    expect(dg.hasDependents('a')).toBe(true);
    expect(dg.getDependents('a')).toContain('b');
});

test('add dependency between non-existent elements', () => {
    let dg = new DependencyGraph<string>();
    dg.addDependency('a', 'b');
    expect(dg.hasDependents('a')).toBe(true);
    expect(dg.getDependents('a')).toContain('b');
});

test('add circular dependency', () => {
    let dg = new DependencyGraph<string>();
    expect(() => { dg.addDependency('a', 'a'); }).toThrowError('circular dependency');
});

test('add circular dependency', () => {
    let dg = new DependencyGraph<string>();
    dg.addDependency('a', 'b')
    expect(() => { dg.addDependency('b', 'a'); }).toThrowError('circular dependency');
});

test('add circular dependency', () => {
    let dg = new DependencyGraph<string>();
    dg.addDependency('a', 'b')
    dg.addDependency('b', 'c')
    expect(() => { dg.addDependency('c', 'a'); }).toThrowError('circular dependency');
});

test('get dependents of empty dependency graph', () => {
    let dg = new DependencyGraph<string>();
    expect(dg.getDependents('a')).toHaveLength(0);
});

test('get dependents of simple dependency graph', () => {
    let dg = new DependencyGraph<string>();
    dg.addDependency('a', 'b')
    dg.addDependency('b', 'c')
    expect(dg.hasDependents('a')).toBeTruthy();
    expect(dg.hasDependents('b')).toBeTruthy();

    expect(dg.getDependents('a')).toContain('b');
    expect(dg.getDependents('a')).toContain('c');
});

test('get dependents of medium size dependency graph', () => {
    let dg = new DependencyGraph();
    dg.addDependency('a','b');
    dg.addDependency('a','c');
    dg.addDependency('a','d');
    dg.addDependency('b','c');
    dg.addDependency('b','d');
    dg.addDependency('c','d');
    expect(dg.hasDependents('a')).toEqual(true);
    expect(dg.hasDependents('b')).toEqual(true);
    expect(dg.hasDependents('c')).toEqual(true);
    expect(dg.hasDependents('d')).toEqual(false);

    expect(Array.from(dg.getDependents('a'))).toEqual(['b', 'c', 'd']);
    expect(Array.from(dg.getDependents('b'))).toEqual(['c', 'd']);
    expect(Array.from(dg.getDependents('c'))).toEqual(['d']);
});

test('should return dependents in topological ordering', () => {
    let dg = new DependencyGraph();
    dg.addDependency('a','b');
    dg.addDependency('a','c');
    dg.addDependency('b','d');
    dg.addDependency('c','d');

    expect(Array.from(dg.getDependents('a'))).toEqual(['c', 'b', 'd']);
});

test('should return dependents in topological ordering', () => {
    let dg = new DependencyGraph();
    dg.addDependency('a','b');
    dg.addDependency('a','c');
    dg.addDependency('c','d');
    dg.addDependency('d','b');
    expect(Array.from(dg.getDependents('a'))).toEqual(['c', 'd', 'b']);
});

test('should return dependents in topological ordering', () => {
    let dg = new DependencyGraph();
    dg.addDependency('d','c');
    dg.addDependency('d','b');
    dg.addDependency('d','a');
    dg.addDependency('c','b');
    dg.addDependency('c','a');
    dg.addDependency('b','a');
    expect(Array.from(dg.getDependents('d'))).toEqual(['c', 'b', 'a']);
});

test('empty dependency graph to string', () => {
    let dg = new DependencyGraph();
    expect(dg.toString()).toEqual('');
});

test('simple dependency graph to string', () => {
    let dg = new DependencyGraph();
    dg.add('a');
    dg.add('b');
    dg.addDependency('a','b');
    expect(dg.toString()).toEqual('a->b\n');
});

test('medium dependency graph to string', () => {
    let dg = new DependencyGraph();
    dg.add('a');
    dg.add('b');
    dg.add('c');
    dg.addDependency('a','b');
    dg.addDependency('b','c');
    dg.addDependency('a','c');
    expect(dg.toString()).toEqual('a->b\na->c\nb->c\n');
});


test('generate dependency graph from string', () => {
    // Create a graph
    let dg = new DependencyGraph();
    dg.add('a');
    dg.add('b');
    dg.addDependency('a','b');

    // Call the generate method and check the generated graph
    let generated = DependencyGraph.Generate(dg.toString());
    expect(generated.contains('a')).toEqual(true);
    expect(generated.contains('b')).toEqual(true);
    expect(generated.hasDependents('a')).toEqual(true);
    expect(Array.from(dg.getDependents('a'))).toEqual(['b']);
});

test('generate dependency graph from string', () => {
    // Create a graph
    let dg = new DependencyGraph();
    dg.add('a');
    dg.add('b');
    dg.addDependency('a','b');

    // Call the generate method and check the generated graph
    let generated = DependencyGraph.Generate(dg.toString());
    expect(generated.contains('a')).toEqual(true);
    expect(generated.contains('b')).toEqual(true);
    expect(generated.hasDependents('a')).toEqual(true);
    expect(Array.from(dg.getDependents('a'))).toEqual(['b']);
});

test('generate dependency graph from string', () => {
    // Create a graph
    let dg = new DependencyGraph();
    dg.add('a');
    dg.add('b');
    dg.add('c');
    dg.addDependency('a','b');
    dg.addDependency('a','c');

    // Call the generate method and check the generated graph
    let generated = DependencyGraph.Generate(dg.toString());
    expect(generated.contains('a')).toEqual(true);
    expect(generated.contains('b')).toEqual(true);
    expect(generated.contains('c')).toEqual(true);
    expect(generated.hasDependents('a')).toEqual(true);
    expect(Array.from(dg.getDependents('a'))).toContain('b');
    expect(Array.from(dg.getDependents('a'))).toContain('c');
});

test('topological sort should return a b c or a c b', () => {
    // Create a graph
    let dg = new DependencyGraph<string>();
    dg.add('a');
    dg.add('b');
    dg.add('c');
    dg.addDependency('a','b');
    dg.addDependency('a','c');
    expect(dg.getTopologicalSort().toString()).toEqual('a c b');
});


test('topological sort should return a b c or a c b', () => {
    // Create a graph
    let dg = new DependencyGraph<string>();
    dg.add('a');
    dg.add('b');
    dg.add('c');
    dg.addDependency('a','b');
    dg.addDependency('b','c');
    dg.addDependency('a','c');
    expect(dg.getTopologicalSort().toString()).toEqual('a b c');
});
