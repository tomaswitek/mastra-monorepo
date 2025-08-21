import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { ragieRetrievalAgent } from './ragie-retrieval-agent';

const outputSchema = z.object({
  result: z.string().describe('The response from the Ragie Retrieval Agent'),
  documents: z
    .array(
      z.object({
        id: z.string().optional(),
        title: z.string().optional(),
        content: z.string().optional(),
        score: z.number().optional(),
        metadata: z.record(z.any()).optional(),
      }),
    )
    .optional()
    .describe('Array of retrieved documents'),
  summary: z
    .string()
    .optional()
    .describe('Summary of the retrieved information'),
  error: z
    .string()
    .optional()
    .describe('Any error that occurred during retrieval'),
});

export const ragieAgentTool = createTool({
  id: 'ragie-agent-tool',
  description:
    'Use this tool to search and retrieve information from RAGIE document database. The Ragie Agent can perform semantic search, list documents, get document content, summaries, and metadata. Ideal for finding warehouse documentation, manuals, SOPs, and knowledge base articles.',
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        'The search query or request for the Ragie Agent (e.g., "Find documentation about conveyor systems", "Search for warehouse safety procedures", "Get all documents about automation ROI")',
      ),
    action: z
      .enum(['search', 'list', 'get_content', 'get_summary'])
      .optional()
      .default('search')
      .describe('The type of action to perform'),
    documentId: z
      .string()
      .optional()
      .describe('Document ID for specific document operations'),
    topK: z
      .number()
      .optional()
      .default(5)
      .describe('Number of results to return for search queries'),
  }),
  outputSchema,
  execute: async ({ context, threadId, resourceId, runtimeContext }) => {
    try {
      let prompt = '';

      switch (context.action) {
        case 'search':
          prompt = `Search for: ${context.query}. Return top ${context.topK} results.`;
          break;
        case 'list':
          prompt = `List available documents. ${context.query}`;
          break;
        case 'get_content':
          if (!context.documentId) {
            return {
              result: 'Error: documentId is required for get_content action',
              error: 'Missing documentId parameter',
            };
          }
          prompt = `Get the full content of document ${context.documentId}. ${context.query}`;
          break;
        case 'get_summary':
          if (!context.documentId) {
            return {
              result: 'Error: documentId is required for get_summary action',
              error: 'Missing documentId parameter',
            };
          }
          prompt = `Get AI-generated summary of document ${context.documentId}. ${context.query}`;
          break;
        default:
          prompt = context.query;
      }

      const response = await ragieRetrievalAgent.generate(prompt, {
        threadId: threadId!,
        resourceId: resourceId!,
        runtimeContext: runtimeContext,
        experimental_output: outputSchema,
      });

      return {
        ...response.object,
        result: response.text,
      };
    } catch (error) {
      console.error('Error calling Ragie Agent:', error);
      return {
        result: `Error executing Ragie agent: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});
