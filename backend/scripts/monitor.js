const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

class DatabaseMonitor {
  constructor() {
    this.mongoUri =
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/mapo_business_manager";
    this.logFile = path.join(__dirname, "../logs/monitor.log");
    this.isConnected = false;
  }

  async connect() {
    try {
      await mongoose.connect(this.mongoUri);
      this.isConnected = true;
      this.log("Database connected successfully");
    } catch (error) {
      this.log(`Database connection failed: ${error.message}`, "ERROR");
      this.isConnected = false;
    }
  }

  async checkHealth() {
    const health = {
      timestamp: new Date().toISOString(),
      database: {
        connected: this.isConnected,
        status: "unknown",
      },
      collections: {},
      performance: {},
    };

    if (!this.isConnected) {
      health.database.status = "disconnected";
      return health;
    }

    try {
      // 데이터베이스 상태 확인
      const admin = mongoose.connection.db.admin();
      const serverStatus = await admin.serverStatus();

      health.database.status = "healthy";
      health.performance = {
        uptime: serverStatus.uptime,
        connections: serverStatus.connections,
        memory: serverStatus.mem,
        operations: serverStatus.opcounters,
      };

      // 컬렉션별 통계
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();

      for (const collection of collections) {
        const stats = await mongoose.connection.db
          .collection(collection.name)
          .stats();
        health.collections[collection.name] = {
          count: stats.count,
          size: stats.size,
          avgObjSize: stats.avgObjSize,
          storageSize: stats.storageSize,
          indexes: stats.nindexes,
        };
      }
    } catch (error) {
      health.database.status = "error";
      health.error = error.message;
      this.log(`Health check failed: ${error.message}`, "ERROR");
    }

    return health;
  }

  async checkIndexes() {
    const indexReport = {
      timestamp: new Date().toISOString(),
      collections: {},
    };

    if (!this.isConnected) {
      return indexReport;
    }

    try {
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();

      for (const collection of collections) {
        const indexes = await mongoose.connection.db
          .collection(collection.name)
          .indexes();
        indexReport.collections[collection.name] = {
          indexes: indexes.map((index) => ({
            name: index.name,
            key: index.key,
            unique: index.unique || false,
            sparse: index.sparse || false,
          })),
        };
      }
    } catch (error) {
      this.log(`Index check failed: ${error.message}`, "ERROR");
      indexReport.error = error.message;
    }

    return indexReport;
  }

  async checkSlowQueries() {
    const slowQueries = {
      timestamp: new Date().toISOString(),
      queries: [],
    };

    if (!this.isConnected) {
      return slowQueries;
    }

    try {
      // MongoDB Profiler에서 느린 쿼리 조회
      const profilerCollection =
        mongoose.connection.db.collection("system.profile");
      const queries = await profilerCollection
        .find({ millis: { $gt: 100 } }) // 100ms 이상 걸린 쿼리
        .sort({ ts: -1 })
        .limit(10)
        .toArray();

      slowQueries.queries = queries.map((query) => ({
        command: query.command,
        millis: query.millis,
        timestamp: query.ts,
        namespace: query.ns,
      }));
    } catch (error) {
      this.log(`Slow query check failed: ${error.message}`, "ERROR");
      slowQueries.error = error.message;
    }

    return slowQueries;
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      health: await this.checkHealth(),
      indexes: await this.checkIndexes(),
      slowQueries: await this.checkSlowQueries(),
    };

    // 리포트를 파일로 저장
    const reportFile = path.join(__dirname, "../logs/db-report.json");
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

    this.log(`Database report generated: ${reportFile}`);
    return report;
  }

  log(message, level = "INFO") {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;

    console.log(logMessage.trim());

    // 로그 파일에 기록
    fs.appendFileSync(this.logFile, logMessage);
  }

  async startMonitoring(intervalMs = 60000) {
    this.log("Starting database monitoring...");

    setInterval(async () => {
      try {
        const health = await this.checkHealth();

        if (health.database.status === "healthy") {
          this.log("Database health check: OK");
        } else {
          this.log(`Database health check: ${health.database.status}`, "WARN");
        }

        // 느린 쿼리 확인
        const slowQueries = await this.checkSlowQueries();
        if (slowQueries.queries.length > 0) {
          this.log(`Found ${slowQueries.queries.length} slow queries`, "WARN");
        }
      } catch (error) {
        this.log(`Monitoring error: ${error.message}`, "ERROR");
      }
    }, intervalMs);
  }
}

// CLI 사용법
if (require.main === module) {
  const monitor = new DatabaseMonitor();
  const command = process.argv[2];

  (async () => {
    await monitor.connect();

    switch (command) {
      case "health":
        const health = await monitor.checkHealth();
        console.log(JSON.stringify(health, null, 2));
        break;

      case "indexes":
        const indexes = await monitor.checkIndexes();
        console.log(JSON.stringify(indexes, null, 2));
        break;

      case "slow":
        const slowQueries = await monitor.checkSlowQueries();
        console.log(JSON.stringify(slowQueries, null, 2));
        break;

      case "report":
        const report = await monitor.generateReport();
        console.log("Report generated successfully");
        break;

      case "monitor":
        await monitor.startMonitoring();
        // Keep the process running
        process.on("SIGINT", () => {
          console.log("Stopping monitoring...");
          process.exit(0);
        });
        break;

      default:
        console.log(
          "Usage: node monitor.js [health|indexes|slow|report|monitor]"
        );
        process.exit(1);
    }

    process.exit(0);
  })().catch((error) => {
    console.error("Monitor failed:", error);
    process.exit(1);
  });
}

module.exports = DatabaseMonitor;
