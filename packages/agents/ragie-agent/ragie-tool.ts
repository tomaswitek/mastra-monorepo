import { Tool } from '@mastra/core/tools';
import { z } from 'zod';
import { Ragie } from 'ragie';

// Initialize RAGIE client
const ragie = new Ragie({
  auth: process.env.RAGIE_API_KEY!,
});

// Schema for retrieve tool
const retrieveSchema = z.object({
  query: z.string().describe('The search query to find relevant documents'),
  topK: z.number().optional().default(5).describe('Number of results to return (default: 5)'),
});

// Schema for list documents tool
const listDocumentsSchema = z.object({
  limit: z.number().optional().default(10).describe('Number of documents to return (default: 10)'),
  offset: z.number().optional().default(0).describe('Number of documents to skip (default: 0)'),
});

// Schema for get document tool
const getDocumentSchema = z.object({
  documentId: z.string().describe('ID of the document to retrieve'),
});

// Schema for get document content tool
const getDocumentContentSchema = z.object({
  documentId: z.string().describe('ID of the document to get content for'),
});

// Schema for get document source tool
const getDocumentSourceSchema = z.object({
  documentId: z.string().describe('ID of the document to get source for'),
});

// Schema for get document summary tool
const getDocumentSummarySchema = z.object({
  documentId: z.string().describe('ID of the document to get summary for'),
});

export const ragieRetrieveTool = new Tool({
  id: 'ragie-retrieve',
  description: 'Search through RAGIE documents using semantic search',
  inputSchema: retrieveSchema,
  execute: async ({ context }) => {
    try {
      const { query, topK } = context;
      const results = await ragie.retrievals.retrieve({
        query,
        topK,
      });
      return results;
    } catch (error) {
      return { error: `Failed to retrieve documents: ${error}` };
    }
  },
});

export const ragieListDocumentsTool = new Tool({
  id: 'ragie-list-documents',
  description: 'List all documents in RAGIE',
  inputSchema: listDocumentsSchema,
  execute: async ({ context }) => {
    try {
      const results = await ragie.documents.list({});
      return results;
    } catch (error) {
      return { error: `Failed to list documents: ${error}` };
    }
  },
});

export const ragieGetDocumentTool = new Tool({
  id: 'ragie-get-document',
  description: 'Get detailed information about a specific document',
  inputSchema: getDocumentSchema,
  execute: async ({ context }) => {
    try {
      const { documentId } = context;
      const results = await ragie.documents.get({ documentId });
      return results;
    } catch (error) {
      return { error: `Failed to get document: ${error}` };
    }
  },
});

export const ragieGetDocumentContentTool = new Tool({
  id: 'ragie-get-document-content',
  description: 'Get the content of a specific document',
  inputSchema: getDocumentContentSchema,
  execute: async ({ context }) => {
    try {
      const { documentId } = context;
      const results = await ragie.documents.getContent({ documentId });
      return results;
    } catch (error) {
      return { error: `Failed to get document content: ${error}` };
    }
  },
});

export const ragieGetDocumentSourceTool = new Tool({
  id: 'ragie-get-document-source',
  description: 'Get the source information of a specific document',
  inputSchema: getDocumentSourceSchema,
  execute: async ({ context }) => {
    try {
      const { documentId } = context;
      const results = await ragie.documents.getSource({ documentId });
      return results;
    } catch (error) {
      return { error: `Failed to get document source: ${error}` };
    }
  },
});

export const ragieGetDocumentSummaryTool = new Tool({
  id: 'ragie-get-document-summary',
  description: 'Get AI-generated summary of a specific document',
  inputSchema: getDocumentSummarySchema,
  execute: async ({ context }) => {
    try {
      const { documentId } = context;
      const results = await ragie.documents.getSummary({ documentId });
      return results;
    } catch (error) {
      return { error: `Failed to get document summary: ${error}` };
    }
  },
});