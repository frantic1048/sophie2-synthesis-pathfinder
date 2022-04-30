// MEMO: pathfinding POC

const ingredientsTable: { [key in string]: { [key in string]: number } } = {
  a: {
    b: 2,
    c: 3,
  },
  b: {
    d: 1,
    e: 1,
    catA: 1,
  },
  c: {
    catA: 1,
  },
  d: {
    a: 1,
    catA: 1,
  },
  catA: {
    d: 1,
  },
}

function printAllPath(start: string, end: string) {
  const paths: string[][] = []

  function visit(from: string, to: string, path: string[], visited: string[]) {
    const _visited = [...visited, from]
    const _path = [...path, from]

    // a path found
    if (from === to) {
      paths.push(_path)
      return
    }

    const next = (() => {
      if (!ingredientsTable[from]) {
        return []
      }
      return Object.keys(ingredientsTable[from]).filter((n) => !_visited.includes(n))
    })()

    console.debug('cur=', from, 'next=', next)

    for (const n of next) {
      visit(n, to, _path, _visited)
    }
  }

  visit(start, end, [], [])

  console.log(start, end)
  console.log(paths)
}

printAllPath('a', 'd')
