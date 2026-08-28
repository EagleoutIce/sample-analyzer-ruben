import { FlowrAnalyzerBuilder } from '@eagleoutice/flowr/project/flowr-analyzer-builder';
import { jsonReplacer } from '@eagleoutice/flowr/util/json';
import { fileProtocol } from '@eagleoutice/flowr/r-bridge/retriever.js';
import fs from 'fs';
import { log, LogLevel } from '@eagleoutice/flowr/util/log';
import { Identifier, Query, SlicingCriterion } from '@eagleoutice/flowr';
import { SourceLocation, SourceRange } from '@eagleoutice/flowr/util/range';
import { NodeId } from '@eagleoutice/flowr/r-bridge/lang-4.x/ast/model/processing/node-id';
import path from 'path';
import { DataflowGraph } from '@eagleoutice/flowr/dataflow/graph/graph';
import { Dataflow } from '@eagleoutice/flowr/dataflow/graph/df-helper';
import { SliceDirection } from '@eagleoutice/flowr/util/slice-direction';

const enabledCategories = ['read', 'write', 'visualize'] as const;
type WhatIWant = [type: typeof enabledCategories[number], id: NodeId, fnName: string | undefined, target: string | undefined, line: number, file: string | undefined]

async function main(fPath: string, outputFile: string) {
   log.updateSettings(s => { s.settings.minLevel = LogLevel.Fatal; });

   const analyzer = await new FlowrAnalyzerBuilder()
      // .configure('project.assumeImplicitEcho', false)
      .setEngine('tree-sitter')
      .build();
   analyzer.addRequest(fileProtocol + fPath);

   try {
      const time = Date.now();
      const { idMap } = await analyzer.normalize();
      const { graph } = await analyzer.dataflow();
      const results = await analyzer.query([{
         type: 'dependencies',
         enabledCategories: enabledCategories.slice()
      }]);
      
      const ctx = analyzer.inspectContext();
      const rootFolderProject = ctx.files.root() ?? '/'
      
      const theWanters: WhatIWant[] = [
         ['type', 'id', 'fnName', 'target', 'line', 'file'] as unknown as WhatIWant
      ]
      
      for(const cat of enabledCategories) {
         const perCat = results.dependencies[cat];
         for(const hit of perCat) {
            /* if(hit.implicit) {
               continue
            } */
            const node = idMap.get(hit.nodeId);
            const loc = SourceLocation.fromNode(node);
            if(loc) {
               theWanters.push([
                  cat, hit.nodeId, Identifier.toString(/* hit.functionName */Dataflow.qualify(hit.nodeId, graph) ?? ''), hit.value, SourceRange.getStartLine(SourceLocation.getRange(loc)), path.relative(rootFolderProject, SourceLocation.getFile(loc) ?? '')
               ] as const)
            }
            const slice = await analyzer.query([{
               type: 'static-slice',
               name: 'foo',
               criteria: [SlicingCriterion.fromId(hit.nodeId)],
               direction: SliceDirection.Backward,
               // perFile: true  
            }])
            console.log(slice['static-slice'].results['foo']);
         }
      }
      
      fs.writeFileSync(outputFile, theWanters.map(t => t.map(t => JSON.stringify(t)).join(',')).join('\n'), 'utf-8');
      console.log(`Results written to ${outputFile} 
   * ${Object.entries(results).length} results
   * considered ${analyzer.inspectContext().files.loadingOrder.getLoadingOrder().length} files
   * took ${Date.now() - time}ms`);
   } finally {
      analyzer.close();
   }
}
if(process.argv.length < 4) {
   console.error('Usage: ts-node src/main.ts <folder> <output-file>');
   process.exit(1);
}

const folder = process.argv[2];
const outputFile = process.argv[3];

void main(folder, outputFile).catch(err => {
   console.error('Error during analysis:', err);
   process.exit(1);
});