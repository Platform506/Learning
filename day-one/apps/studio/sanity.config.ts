import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import { structure } from './structure'
import { defaultDocumentNode } from './structure/defaultDocumentNode'

export default defineConfig({
  name: 'default',
  title: 'Day One Content Operations',

  projectId: 'eiaxd2tu',
  dataset: 'production',

  plugins: [structureTool({
    structure: structure,
    defaultDocumentNode: defaultDocumentNode,
  }), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
