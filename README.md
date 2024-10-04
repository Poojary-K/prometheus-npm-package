# Prometheus Metrics Middleware for Node.js

A lightweight, reusable middleware that integrates Prometheus metrics tracking into Node.js applications. This package simplifies tracking HTTP requests, server status, and custom metrics, exposing them via a `/metrics` endpoint for Prometheus scraping. Ideal for Express.js apps where monitoring is required without repetitive code.

## Features

- Automatically tracks total HTTP requests with 4xx and 5xx status codes.
- Monitors server uptime and exposes it as a Prometheus gauge metric.
- Exposes all metrics at `/metrics` endpoint for Prometheus to scrape.
- Handles server shutdown gracefully by updating the server status metric.
- Easily pluggable into any Express.js application.

## Installation

To install the package, run:

```bash
npm install <your-package-name>
```

## Usage

To use this middleware in your Express.js application:

1. Require and initialize the package:

```javascript
import metricsMiddleware from require('prometheus-npm-package/index.js');

const app = express();

// Use the middleware to track HTTP requests and server status
new metricsMiddleware(app);

// Your routes and other middleware here...

// Listen on your desired port
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

2. Ensure that your Prometheus instance scrapes the `/metrics` endpoint:

```yaml
# Example Prometheus scrape configuration
scrape_configs:
  - job_name: 'job_name'
    static_configs:
      - targets: ['<machine_ip>:3000']
```

## API Endpoints

- `/metrics`: Exposes all metrics for Prometheus scraping.

## Metrics Collected

### HTTP Requests Counter

Tracks the total number of HTTP requests with 4xx and 5xx status codes.

- Metric name: `http_requests_bucky`
- Labels: `method`, `route`, `status`

Example:
```
http_requests_bucky{method="GET",route="/api",status="404"} 10
```

### Server Status Gauge

Monitors the server's status (1 for up, 0 for down).

- Metric name: `server_status_bucky`

Example:
```
server_status_bucky 1
```

## Customization

The middleware automatically tracks API requests and server uptime. If you need to extend it with more metrics (e.g., custom application metrics), you can modify the package's internals to add new counters, gauges, or histograms.