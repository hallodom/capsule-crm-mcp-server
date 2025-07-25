# Capsule CRM MCP Server

A comprehensive [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for integrating with [Capsule CRM](https://capsulecrm.com). This server provides tools for managing contacts, organizations, opportunities, projects, tasks, and more through the Capsule CRM API.

## Features

- **Complete Capsule CRM Integration**: Full support for all major Capsule CRM entities
- **Party Management**: Create, read, update, and delete contacts and organizations  
- **Opportunity Tracking**: Manage sales opportunities with milestones and pipelines
- **Project Management**: Handle projects with stages and assignments
- **Task Management**: Create and track tasks with due dates and completion status
- **Search Capabilities**: Search across parties, opportunities, and projects
- **Custom Fields & Tags**: Support for custom fields and tag management
- **User & Team Management**: List users and manage team assignments
- **Notes & History**: Create entries to track interactions and notes

## Installation

### Prerequisites

- Node.js 18.0.0 or higher
- A Capsule CRM account with API access

### Install Dependencies

```bash
npm install
```

### Get Your Capsule CRM API Token

1. Log in to your Capsule CRM account
2. Go to **My Preferences** > **API Authentication Tokens**
3. Create a new token or use an existing one
4. Save the token securely - you'll need it to authenticate

## Usage

### Running the Server

Start the MCP server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

### Configuration with MCP Clients

Add this server to your MCP client configuration. For example, with Claude Desktop:

```json
{
  "mcpServers": {
    "capsule-crm": {
      "command": "node",
      "args": ["/path/to/capsule-crm-mcp-server/src/index.js"]
    }
  }
}
```

### Authentication

Before using any Capsule CRM tools, you must set your API token:

```javascript
// Use the capsule_set_api_token tool
{
  "name": "capsule_set_api_token", 
  "arguments": {
    "apiToken": "your-capsule-api-token-here"
  }
}
```

Test your connection:

```javascript
// Use the capsule_test_connection tool
{
  "name": "capsule_test_connection",
  "arguments": {}
}
```

## Available Tools

### Authentication & Connection
- `capsule_set_api_token` - Set your Capsule CRM API token
- `capsule_test_connection` - Test API connection

### Party Management (Contacts & Organizations)
- `capsule_list_parties` - List all parties with pagination and filtering
- `capsule_get_party` - Get specific party by ID
- `capsule_search_parties` - Search parties by name, email, phone, etc.
- `capsule_create_person` - Create a new contact/person
- `capsule_create_organization` - Create a new organization
- `capsule_update_party` - Update existing party details
- `capsule_delete_party` - Delete a party
- `capsule_list_employees` - List employees of an organization

### Opportunity Management
- `capsule_list_opportunities` - List all opportunities
- `capsule_get_opportunity` - Get specific opportunity by ID
- `capsule_list_opportunities_by_party` - List opportunities for a party
- `capsule_search_opportunities` - Search opportunities
- `capsule_create_opportunity` - Create new opportunity
- `capsule_update_opportunity` - Update existing opportunity
- `capsule_delete_opportunity` - Delete an opportunity
- `capsule_list_opportunity_parties` - List additional parties on opportunity
- `capsule_add_party_to_opportunity` - Add party to opportunity
- `capsule_remove_party_from_opportunity` - Remove party from opportunity
- `capsule_list_pipelines` - List sales pipelines
- `capsule_list_milestones` - List opportunity milestones/stages

### Project Management
- `capsule_list_projects` - List all projects
- `capsule_get_project` - Get specific project by ID
- `capsule_list_projects_by_party` - List projects for a party
- `capsule_search_projects` - Search projects
- `capsule_create_project` - Create new project
- `capsule_update_project` - Update existing project
- `capsule_delete_project` - Delete a project

### Task Management
- `capsule_list_tasks` - List all tasks
- `capsule_get_task` - Get specific task by ID
- `capsule_create_task` - Create new task
- `capsule_update_task` - Update existing task
- `capsule_delete_task` - Delete a task
- `capsule_mark_task_complete` - Mark task as completed
- `capsule_mark_task_incomplete` - Mark task as incomplete

### Utilities & Metadata
- `capsule_list_tag_definitions` - List all available tags
- `capsule_list_custom_fields` - List custom field definitions
- `capsule_list_users` - List users in the account
- `capsule_create_entry` - Create notes/history entries
- `capsule_list_entries` - List notes/history entries

## Examples

### Create a New Contact

```javascript
{
  "name": "capsule_create_person",
  "arguments": {
    "firstName": "John",
    "lastName": "Doe",
    "jobTitle": "Software Engineer",
    "organizationName": "Tech Company Inc",
    "emailAddresses": [
      {
        "type": "Work",
        "address": "john.doe@techcompany.com"
      }
    ],
    "phoneNumbers": [
      {
        "type": "Mobile",
        "number": "+1-555-123-4567"
      }
    ]
  }
}
```

### Create an Opportunity

```javascript
{
  "name": "capsule_create_opportunity",
  "arguments": {
    "name": "Website Redesign Project",
    "description": "Complete redesign of company website",
    "partyId": 12345,
    "milestoneId": 67890,
    "value": {
      "amount": 15000,
      "currency": "USD"
    },
    "expectedCloseOn": "2024-03-15",
    "probability": 75
  }
}
```

### Search for Parties

```javascript
{
  "name": "capsule_search_parties",
  "arguments": {
    "query": "john@example.com",
    "embed": ["tags", "fields"]
  }
}
```

### Create a Task

```javascript
{
  "name": "capsule_create_task",
  "arguments": {
    "description": "Follow up on proposal",
    "detail": "Call client to discuss the website proposal we sent last week",
    "dueOn": "2024-02-15",
    "partyId": 12345,
    "opportunityId": 67890
  }
}
```

## API Reference

### Data Embedding

Many tools support the `embed` parameter to include additional data:

- `tags` - Include tags assigned to the entity
- `fields` - Include custom field values
- `organisation` - Include extended organization details (for people)
- `party` - Include party details (for opportunities/projects/tasks)
- `milestone` - Include milestone details (for opportunities)
- `opportunity` - Include opportunity details (for projects)
- `missingImportantFields` - Indicate missing important custom fields

### Pagination

List endpoints support pagination:

- `page` - Page number (default: 1)
- `perPage` - Results per page (1-100, default: 50)

### Filtering

Many list endpoints support filtering:

- `since` - ISO8601 date to filter items changed after this date

## Error Handling

The server provides detailed error messages for common issues:

- **401 Unauthorized** - Invalid or expired API token
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Entity not found
- **400 Bad Request** - Invalid request parameters
- **429 Too Many Requests** - Rate limit exceeded

## Development

### Project Structure

```
capsule-crm-mcp-server/
├── src/
│   ├── index.js              # Main server entry point
│   ├── capsule-client.js     # Capsule API client
│   └── tools/
│       ├── party-tools.js    # Party management tools
│       ├── opportunity-tools.js # Opportunity tools
│       ├── project-tools.js  # Project management tools
│       └── task-tools.js     # Task management tools
├── package.json
└── README.md
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Security

- API tokens are not stored persistently
- All API communication uses HTTPS
- Rate limiting is handled automatically
- No sensitive data is logged

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:

1. Check the [Capsule CRM API documentation](https://developer.capsulecrm.com/)
2. Review the [Model Context Protocol specification](https://modelcontextprotocol.io)
3. Open an issue in this repository

## Related Links

- [Capsule CRM](https://capsulecrm.com/)
- [Capsule CRM API Documentation](https://developer.capsulecrm.com/)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [MCP SDK](https://github.com/modelcontextprotocol/sdk) 