#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { CapsuleCRMClient } from './capsule-client.js';
import { createPartyTools } from './tools/party-tools.js';
import { createOpportunityTools } from './tools/opportunity-tools.js';
import { createProjectTools } from './tools/project-tools.js';
import { createTaskTools } from './tools/task-tools.js';

/**
 * Capsule CRM MCP Server
 * 
 * This server provides Model Context Protocol tools for interacting with Capsule CRM.
 * It supports managing parties (contacts/organizations), opportunities, projects, tasks, and more.
 */

class CapsuleCRMServer {
  constructor() {
    this.server = new Server(
      {
        name: 'capsule-crm-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.capsuleClient = null;
    this.tools = new Map();
    
    this.setupHandlers();
    this.setupAuthenticationTools(); // Set up auth tools immediately
    this.setupTools(); // Load all tools upfront
    
    // Initialize client with environment variable if available
    const apiToken = process.env.CAPSULE_API_TOKEN;
    if (apiToken) {
      this.initializeClient(apiToken);
      console.log('Capsule CRM client initialized with environment variable');
    }
  }

  setupHandlers() {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const toolsArray = Array.from(this.tools.values());
      return {
        tools: toolsArray,
      };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      // Allow certain tools to run without client initialization
      const allowedWithoutClient = ['capsule_set_api_token', 'capsule_test_connection'];
      
      if (!this.capsuleClient && !allowedWithoutClient.includes(name)) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: Capsule CRM client not initialized. Please use 'capsule_set_api_token' with your API token first before using ${name}.`,
            },
          ],
          isError: true,
        };
      }

      const tool = this.tools.get(name);
      if (!tool) {
        throw new Error(`Unknown tool: ${name}`);
      }

      try {
        return await tool.execute(args, this.capsuleClient);
      } catch (error) {
        throw new Error(`Tool execution failed: ${error.message}`);
      }
    });
  }

  initializeClient(apiToken) {
    if (!apiToken) {
      throw new Error('API token is required');
    }

    this.capsuleClient = new CapsuleCRMClient(apiToken);
    this.setupTools();
  }

  setupAuthenticationTools() {
    // Add authentication tool
    this.tools.set('capsule_set_api_token', {
      name: 'capsule_set_api_token',
      description: 'Set the Capsule CRM API token for authentication',
      inputSchema: {
        type: 'object',
        properties: {
          apiToken: {
            type: 'string',
            description: 'Your Capsule CRM API token (Bearer token)',
          },
        },
        required: ['apiToken'],
      },
      execute: async (args) => {
        try {
          this.initializeClient(args.apiToken);
          return {
            content: [
              {
                type: 'text',
                text: 'API token set successfully. Capsule CRM client initialized.',
              },
            ],
          };
        } catch (error) {
          throw new Error(`Failed to set API token: ${error.message}`);
        }
      },
    });

    // Add connection test tool
    this.tools.set('capsule_test_connection', {
      name: 'capsule_test_connection',
      description: 'Test the connection to Capsule CRM API',
      inputSchema: {
        type: 'object',
        properties: {
          random_string: {
            type: 'string',
            description: 'Dummy parameter for no-parameter tools',
          },
        },
        required: ['random_string'],
      },
      execute: async (args, client) => {
        if (!client) {
          throw new Error('API token not set. Please use capsule_set_api_token first.');
        }
        try {
          const currentUser = await client.getCurrentUser();
          return {
            content: [
              {
                type: 'text',
                text: `Connection successful! Authenticated as: ${currentUser.name} (${currentUser.username})`,
              },
            ],
          };
        } catch (error) {
          throw new Error(`Connection test failed: ${error.message}`);
        }
      },
    });
  }

  setupTools() {
    // Don't clear existing tools (preserve authentication tools)
    // Clear only non-auth tools if they exist
    const authTools = ['capsule_set_api_token', 'capsule_test_connection'];
    for (const [name, tool] of this.tools.entries()) {
      if (!authTools.includes(name)) {
        this.tools.delete(name);
      }
    }

    // Add party (contacts/organizations) tools
    const partyTools = createPartyTools();
    partyTools.forEach(tool => this.tools.set(tool.name, tool));

    // Add opportunity tools
    const opportunityTools = createOpportunityTools();
    opportunityTools.forEach(tool => this.tools.set(tool.name, tool));

    // Add project tools
    const projectTools = createProjectTools();
    projectTools.forEach(tool => this.tools.set(tool.name, tool));

    // Add task tools
    const taskTools = createTaskTools();
    taskTools.forEach(tool => this.tools.set(tool.name, tool));
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error('Capsule CRM MCP Server running on stdio');
    console.error('Available tools will be loaded after setting API token with capsule_set_api_token');
  }
}

// Start the server
const server = new CapsuleCRMServer();
server.run().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 