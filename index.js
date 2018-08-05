const fs = require('fs'),
    path = require('path'),
    { SourceMapConsumer, SourceMapGenerator } = require('source-map');
    mapIntermediateToFinal = require('./input/map_intermediate_to_final'),
    mapOriginaltoIntermediate = require('./input/map_original_to_intermediate');

const OUTPUT = path.resolve(__dirname, 'output');

tryCreateOutputDir();
clearOutputDir();

SourceMapConsumer.with(mapIntermediateToFinal, null, async consumerIntermediateToFinal => {
    writeParsedMappings(consumerIntermediateToFinal, path.resolve(OUTPUT, 'parsed_intermediate_to_final.json'));

    const gen = SourceMapGenerator.fromSourceMap(consumerIntermediateToFinal);
    return await SourceMapConsumer.with(mapOriginaltoIntermediate, null, consumerOriginalToIntermediate => {
        writeParsedMappings(consumerOriginalToIntermediate, path.resolve(OUTPUT, 'parsed_original_to_intermediate.json'));

        gen.applySourceMap(consumerOriginalToIntermediate);
        return JSON.stringify(gen, null, 4);
    });
}).then(merged => {
    fs.writeFileSync(path.resolve(OUTPUT, 'map_merged.json'), merged);
    SourceMapConsumer.with(merged, null, consumerMerged => {
        writeParsedMappings(consumerMerged, path.resolve(OUTPUT, 'parsed_merged.json'));
    });
});

function writeParsedMappings(consumer, filePath) {
    const parsed = JSON.stringify(parsedMappings(consumer), null, 4);
    fs.writeFileSync(filePath, parsed);
}

function parsedMappings(consumer) {
    const mappings = [];
    consumer.eachMapping(({
        generatedLine,
        generatedColumn,
        originalLine,
        originalColumn
    }) => mappings.push({
        generatedLine,
        generatedColumn,
        originalLine,
        originalColumn
    }));
    return mappings;
}

function tryCreateOutputDir() {
    // Make output if doesn't exist
    try {
        fs.mkdirSync(OUTPUT);
    } catch (e) {
        // ignore
    }
}

function clearOutputDir() {
    fs.readdirSync(OUTPUT).forEach(file => {
        fs.unlinkSync(path.resolve(OUTPUT, file));
    });
}
