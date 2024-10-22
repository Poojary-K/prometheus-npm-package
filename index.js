const { Counter, Gauge, register } = require('prom-client');

class PrometheusMetrics {
  constructor(app) {
    // Initialize counters and gauges
    this.httpRequestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests with status codes 4xx and 5xx',
      labelNames: ['method', 'route', 'status']
    });

    this.serverStatusGauge = new Gauge({
      name: 'server_status',
      help: 'Gauge for monitoring server up/down status. 1 means up, 0 means down.'
    });

    this.customGauges = {};
    this.customCounters = {};

    this.serverStatusGauge.set(1); // Set initial server status to up

    // Attach middleware to count HTTP request errors
    app.use((req, res, next) => {
      res.on('finish', () => {
        if (res.statusCode >= 400 && res.statusCode < 600) {
          this.httpRequestCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status: res.statusCode
          });
        }
      });
      next();
    });

    // Expose the metrics endpoint
    app.get('/metrics', async (req, res) => {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    });


  
    // Handle server shutdown
    process.on('SIGINT', () => {
      this.serverStatusGauge.set(0); // Set server status to down
      process.exit(0);
    });
  }

  // Expose a method to manually set the server status (e.g., for custom shutdown handlers)
  setServerStatus(status) {
    this.serverStatusGauge.set(status ? 1 : 0);
  }

  addCustomGauge(name, help, labelNames = []) {
    if (!this.customGauges[name]) {
      this.customGauges[name] = new Gauge({ name, help, labelNames });
    }
    return this.customGauges[name];
  }

  // Method to add a custom counter
  addCustomCounter(name, help, labelNames = []) {
    if (!this.customCounters[name]) {
      this.customCounters[name] = new Counter({ name, help, labelNames });
    }
    return this.customCounters[name];
  }

}

module.exports = PrometheusMetrics;
