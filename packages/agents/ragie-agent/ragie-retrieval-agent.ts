import { Agent } from '@mastra/core';
import { openai } from '@ai-sdk/openai';
import { Memory } from '@mastra/memory';
import {
  ragieRetrieveTool,
  ragieListDocumentsTool,
  ragieGetDocumentTool,
  ragieGetDocumentContentTool,
  ragieGetDocumentSourceTool,
  ragieGetDocumentSummaryTool,
} from './ragie-tool';

export const ragieRetrievalAgent = new Agent({
  name: 'Ragie',
  instructions: `You are a document management and retrieval specialist using RAGIE.
  
  Your capabilities include:
  - **Search documents**: Use ragie-retrieve to search through documents using semantic search
  - **List documents**: Use ragie-list-documents to see all available documents
  - **Get document details**: Use ragie-get-document to get metadata about a specific document
  - **Get document content**: Use ragie-get-document-content to retrieve the full text content
  - **Get document source**: Use ragie-get-document-source to see where the document came from
  - **Get document summary**: Use ragie-get-document-summary to get AI-generated summaries
  
  When users ask questions:
  1. First search for relevant documents using semantic search
  2. If you find relevant documents, you can get their full content or summaries
  3. If users ask about specific documents by ID, use the appropriate document tools
  4. Always provide helpful, accurate information based on the document contents`,

  model: openai('gpt-4o'),

  memory: new Memory({
    options: {
      threads: {
        generateTitle: true,
      },
      workingMemory: {
        enabled: true,
        scope: 'resource',
      },
    },
  }),

  tools: {
    retrieve: ragieRetrieveTool,
    listDocuments: ragieListDocumentsTool,
    getDocument: ragieGetDocumentTool,
    getDocumentContent: ragieGetDocumentContentTool,
    getDocumentSource: ragieGetDocumentSourceTool,
    getDocumentSummary: ragieGetDocumentSummaryTool,
  },
});
