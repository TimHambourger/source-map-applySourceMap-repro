# source-map-applySourceMap-repro
Repro for issue with source-map package `SourceMapGenerator.prototype.applySourceMap` method.

### Usage
1. ```> node index.js```

   This merges the maps from input/map_intermediate_to_final.json and input/map_original_to_intermediate.json using `applySourceMap`.

1. Inspect the output/ directory.
   - output/map_merged.json -- The merged map.
   - output/parsed_{map-name}.json -- Parsed mappings from the corresponding map, for easy comparison. Mappings are represented with
     properties `generatedLine`, `generatedColumn`, `originalLine`, and `originalColumn`, like the format used by source-map internally.

### About the input maps
input/map_intermediate_to_final.json and input/map_original_to_intermediate.json correspond to the source files
reference/src_original.tsx, reference/src_intermediate.jsx, and reference/src_final.js.
reference/src_original.tsx is a dummy example file that is then run through a real build pipeline using typescript
(with the `"jsx": "preserve"` option) to produce reference/src_intermediate.jsx, followed by the excellent [surplus library](https://github.com/adamhaile/surplus)
to produce reference/src_final.js. The sourcemaps in input/ were constructed with those tools.

### What's the issue?
The mappings in output/map_merged.json and output/parsed_merged.json don't correctly map from reference/src_final.js back to reference/src_original.tsx.
You can see the issue in generated lines 9, 10, 11, and 13.
