# node-email-mx-checker

A simple Node.js library to check MX records for domains. Written in TypeScript and built with Vite.

## Installation

```bash
npm install node-email-mx-checker
```

## Usage

### ES Modules

```javascript
import { checkMx } from 'node-email-mx-checker';

async function checkDomain() {
  const result = await checkMx('example.com');
  
  if (result.hasMx) {
    console.log(`Domain ${result.domain} has MX records:`);
    result.mxRecords.forEach(record => {
      console.log(`- ${record.exchange} (priority: ${record.priority})`);
    });
  } else {
    console.log(`Domain ${result.domain} has no MX records`);
    if (result.error) {
      console.log(`Error: ${result.error}`);
    }
  }
}

checkDomain();
```

### CommonJS

```javascript
const { checkMx } = require('node-email-mx-checker');

async function checkDomain() {
  const result = await checkMx('example.com');
  
  if (result.hasMx) {
    console.log(`Domain ${result.domain} has MX records:`);
    result.mxRecords.forEach(record => {
      console.log(`- ${record.exchange} (priority: ${record.priority})`);
    });
  } else {
    console.log(`Domain ${result.domain} has no MX records`);
    if (result.error) {
      console.log(`Error: ${result.error}`);
    }
  }
}

checkDomain();
```

## API

### checkMx(domain, options)

Checks if a domain has MX records and returns the list of MX records.

#### Parameters

- `domain` (string): The domain to check
- `options` (object, optional): Check options
  - `timeout` (number, default: 5000): Timeout in milliseconds for DNS lookups

#### Returns

Promise resolving to an object with the following properties:

- `domain` (string): The domain that was checked
- `hasMx` (boolean): Whether the domain has MX records
- `mxRecords` (array, optional): MX records for the domain
- `error` (string, optional): Error message if check failed

## Examples

### Check MX Records for a Domain

```javascript
import { checkMx } from 'node-email-mx-checker';

async function checkDomainMx() {
  const result = await checkMx('gmail.com');
  
  if (result.hasMx) {
    console.log('MX records found:');
    result.mxRecords.forEach(record => {
      console.log(`- ${record.exchange} (priority: ${record.priority})`);
    });
  } else {
    console.log(`No MX records found: ${result.error || 'Domain has no MX records'}`);
  }
}

checkDomainMx();
```

### Check Multiple Domains

```javascript
import { checkMx } from 'node-email-mx-checker';

async function checkMultipleDomains() {
  const domains = ['gmail.com', 'example.com', 'nonexistentdomain123456.com'];
  
  for (const domain of domains) {
    const result = await checkMx(domain);
    console.log(`${domain}: ${result.hasMx ? 'Has MX records' : 'No MX records'}`);
    
    if (result.hasMx) {
      result.mxRecords.forEach(record => {
        console.log(`  - ${record.exchange} (priority: ${record.priority})`);
      });
    } else if (result.error) {
      console.log(`  Error: ${result.error}`);
    }
  }
}

checkMultipleDomains();
```

### Custom Timeout

```javascript
import { checkMx } from 'node-email-mx-checker';

async function checkWithLongerTimeout() {
  // Use a 10-second timeout
  const result = await checkMx('example.com', { timeout: 10000 });
  console.log(result);
}

checkWithLongerTimeout();
```

## Development

### Building the package

```bash
npm run build
```

### Running tests

```bash
npm test
```

## License

MIT
