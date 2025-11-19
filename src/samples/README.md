# Sample Files for LLM Integration

This directory contains sample files that demonstrate the data formats used when communicating with the LLM service.

## Files Overview

### `sample-llm-request.json`
This file shows the **structured JSON format** that is sent to the LLM provider when making a request. It includes:

- **Child Context**: Name, age, date of birth, medical history
- **Conversation History**: Previous messages in the conversation
- **Current Message**: The user's current question
- **API Configuration**: Provider settings, model, temperature, max tokens
- **System Instructions**: Guidelines for how the LLM should respond

### `sample-llm-response.md`
This file shows the **expected Markdown format** for responses from the LLM. The response should include:

- **Headings** (# ## ###) for structure
- **Bullet points** and **numbered lists** for clarity
- **Tables** for organized data (e.g., meal plans, schedules)
- **Blockquotes** with emoji (> ⚠️ **Important**:) for critical information
- **Code blocks** for special formatting when needed
- **Emphasis** using **bold** and *italics*
- **Horizontal rules** (---) to separate sections
- **Safety considerations** and **additional tips**

## How It Works

### Sending Messages

When a user sends a message:

1. The app gathers context about the child from the profile
2. Collects recent conversation history
3. Builds a structured JSON object (like `sample-llm-request.json`)
4. Sends this to the LLM provider with instructions to respond in Markdown

### Receiving Responses

When the LLM responds:

1. The response comes back in Markdown format (like `sample-llm-response.md`)
2. The app uses `react-markdown` with `remark-gfm` to parse and render it
3. Custom CSS styling is applied for proper formatting
4. The formatted response is displayed in the chat interface

## Implementation Details

### Services

- **`llmService.ts`**: Handles building the JSON context and communicating with LLM APIs
- **`messagingService.ts`**: Manages message flow and conversation history
- **`ChatInterface.tsx`**: Renders messages with Markdown support

### Key Features

1. **Structured Context**: JSON format ensures consistent, parseable data
2. **Rich Formatting**: Markdown allows for readable, well-organized responses
3. **Conversation History**: Previous messages provide context for better responses
4. **Age-Appropriate**: Child's age is calculated and included in every request
5. **Safety First**: Every response includes reminders to consult healthcare providers

## Markdown Styling

The ChatInterface component applies custom styling to Markdown elements:

- Headings have appropriate sizes and spacing
- Lists have proper indentation
- Blockquotes have colored borders and backgrounds
- Code blocks have highlighted backgrounds
- Tables are styled with borders and headers
- Links are colored to match the theme

## Example Usage

When a parent asks: *"What portion sizes should I aim for?"*

The app sends a JSON context including:
- Child's name: "Emma"
- Child's age: "6 months old"
- Medical history
- Previous conversation
- The current question

The LLM responds with a well-formatted Markdown document including:
- A clear title
- Structured sections (portions, guidelines, safety)
- Tables and lists
- Important callouts
- Additional resources

This creates a professional, easy-to-read experience for parents seeking advice.
