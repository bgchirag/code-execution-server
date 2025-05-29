# Code Execution Server

A secure and efficient server for executing code in multiple programming languages. This service provides a REST API for executing code snippets in a sandboxed environment with proper resource limitations and security measures.

## Features

- Supports multiple programming languages (C++, Python, JavaScript)
- Secure code execution with sandboxing
- Input/output handling
- Rate limiting to prevent abuse
- Forbidden pattern detection to block malicious code
- File-based code execution with cleanup

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Dependencies**:
  - express
  - body-parser
  - uuid
  - express-rate-limit
  - shell-escape

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Compilers/Interpreters for supported languages:
  - g++ (for C++)
  - Python 3
  - Node.js (for JavaScript)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd code-execution-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create required directories:
   ```bash
   mkdir codes inputs outputs
   ```

4. Start the server:
   ```bash
   node index.js
   ```
   Or for development with auto-reload:
   ```bash
   npx nodemon index.js
   ```

## API Endpoints

### Execute Code

```
POST /api/run
```

**Request Body:**
```json
{
  "lang": "cpp",
  "code": "#include <iostream>\nint main() { std::cout << \"Hello, World!\" << std::endl; return 0; }",
  "input": ""
}
```

**Response:**
```json
{
  "success": true,
  "output": "Hello, World!\n",
  "error": ""
}
```

## Environment Variables

No environment variables are required for basic operation. However, you can configure the following:

- `PORT`: Server port (default: 3001)

## Security

- Rate limiting (50 requests per minute per IP)
- Input validation
- Forbidden patterns detection
- File cleanup after execution
- Resource limits on execution

## Deployment

### Docker

```bash
docker build -t code-execution-server .
docker run -p 3001:3001 code-execution-server
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the development team.
