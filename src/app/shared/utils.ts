

export function filter(src, cmp) {
    const filters = Object.keys(src);
    const filtered = {};
    for (let f = 0; f < filters.length; f++) {
        const filterVal = filters[f];
        filtered[filterVal] = cmp[filterVal];
    }
    return filtered;
}

export function compareObj(source, comp) {
    const k = Object.keys(source);
    for (let i = 0; i < k.length; i++) {
      const s = source[k[i]];
      const c = comp[k[i]];
      if (!Array.isArray(s) && String(s) !== String(c)) {
        return true;
      } else if (Array.isArray(s) && s.length !== c.length) {
      // (s.every(function(element, index) {return element !== c[index]; }))) {
        return true;
      }
    }
    return false;
  }

export function mergeFacetObj(source: Array<any>, incoming: Array<any>) {
  if (source.length === 0) {
    return incoming;
  } else {
    let merged = source,
        cmp = incoming;
    if (incoming.length > source.length) {
      merged = incoming, cmp = source;
    }
    merged.forEach(m => {
      let found = false;
      cmp.forEach((c, ind, a) => {
        if (m._id === c._id) {
          m.count = c.count;
          found = true;
          a.slice(ind, 1);
        }
      });
      if (!found) {
        m.count = 0;
      }
    });
    return merged;
  }
}
