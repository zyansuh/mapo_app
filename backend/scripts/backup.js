const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

class DatabaseBackup {
  constructor() {
    this.backupDir = path.join(__dirname, "../backups");
    this.mongoUri =
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/mapo_business_manager";
    this.dbName = this.extractDbName(this.mongoUri);

    // 백업 디렉토리 생성
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  extractDbName(uri) {
    const match = uri.match(/\/([^/?]+)(\?|$)/);
    return match ? match[1] : "mapo_business_manager";
  }

  async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupName = `backup-${timestamp}`;
    const backupPath = path.join(this.backupDir, backupName);

    return new Promise((resolve, reject) => {
      const command = `mongodump --uri="${this.mongoUri}" --out="${backupPath}"`;

      console.log(`Creating backup: ${backupName}`);

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error("Backup failed:", error);
          reject(error);
          return;
        }

        if (stderr) {
          console.warn("Backup warnings:", stderr);
        }

        console.log("Backup completed successfully");
        console.log("Backup location:", backupPath);

        // 백업 압축
        this.compressBackup(backupPath)
          .then(() => {
            resolve(backupPath);
          })
          .catch(reject);
      });
    });
  }

  async compressBackup(backupPath) {
    return new Promise((resolve, reject) => {
      const command = `tar -czf "${backupPath}.tar.gz" -C "${path.dirname(
        backupPath
      )}" "${path.basename(backupPath)}"`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error("Compression failed:", error);
          reject(error);
          return;
        }

        // 원본 디렉토리 삭제
        fs.rmSync(backupPath, { recursive: true, force: true });
        console.log("Backup compressed successfully");
        resolve();
      });
    });
  }

  async restoreBackup(backupPath) {
    return new Promise((resolve, reject) => {
      // 압축 해제
      const extractCommand = `tar -xzf "${backupPath}" -C "${this.backupDir}"`;

      exec(extractCommand, (error) => {
        if (error) {
          console.error("Extraction failed:", error);
          reject(error);
          return;
        }

        const extractedPath = backupPath.replace(".tar.gz", "");
        const command = `mongorestore --uri="${this.mongoUri}" --drop "${extractedPath}"`;

        console.log(`Restoring backup: ${backupPath}`);

        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error("Restore failed:", error);
            reject(error);
            return;
          }

          if (stderr) {
            console.warn("Restore warnings:", stderr);
          }

          console.log("Restore completed successfully");

          // 임시 디렉토리 정리
          fs.rmSync(extractedPath, { recursive: true, force: true });
          resolve();
        });
      });
    });
  }

  async listBackups() {
    return new Promise((resolve, reject) => {
      fs.readdir(this.backupDir, (error, files) => {
        if (error) {
          reject(error);
          return;
        }

        const backups = files
          .filter((file) => file.endsWith(".tar.gz"))
          .map((file) => {
            const filePath = path.join(this.backupDir, file);
            const stats = fs.statSync(filePath);
            return {
              name: file,
              path: filePath,
              size: stats.size,
              created: stats.birthtime,
            };
          })
          .sort((a, b) => b.created - a.created);

        resolve(backups);
      });
    });
  }

  async cleanupOldBackups(keepDays = 30) {
    const backups = await this.listBackups();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - keepDays);

    const oldBackups = backups.filter((backup) => backup.created < cutoffDate);

    for (const backup of oldBackups) {
      try {
        fs.unlinkSync(backup.path);
        console.log(`Deleted old backup: ${backup.name}`);
      } catch (error) {
        console.error(`Failed to delete backup ${backup.name}:`, error);
      }
    }

    console.log(`Cleaned up ${oldBackups.length} old backups`);
  }

  startScheduledBackups() {
    // 매일 새벽 2시에 백업 실행
    cron.schedule("0 2 * * *", async () => {
      try {
        console.log("Starting scheduled backup...");
        await this.createBackup();
        await this.cleanupOldBackups();
        console.log("Scheduled backup completed");
      } catch (error) {
        console.error("Scheduled backup failed:", error);
      }
    });

    console.log("Scheduled backups started (daily at 2:00 AM)");
  }
}

// CLI 사용법
if (require.main === module) {
  const backup = new DatabaseBackup();
  const command = process.argv[2];

  switch (command) {
    case "backup":
      backup
        .createBackup()
        .then(() => process.exit(0))
        .catch((error) => {
          console.error("Backup failed:", error);
          process.exit(1);
        });
      break;

    case "restore":
      const backupPath = process.argv[3];
      if (!backupPath) {
        console.error("Please provide backup path");
        process.exit(1);
      }
      backup
        .restoreBackup(backupPath)
        .then(() => process.exit(0))
        .catch((error) => {
          console.error("Restore failed:", error);
          process.exit(1);
        });
      break;

    case "list":
      backup
        .listBackups()
        .then((backups) => {
          console.log("Available backups:");
          backups.forEach((backup) => {
            console.log(
              `- ${backup.name} (${backup.size} bytes, ${backup.created})`
            );
          });
          process.exit(0);
        })
        .catch((error) => {
          console.error("List failed:", error);
          process.exit(1);
        });
      break;

    case "schedule":
      backup.startScheduledBackups();
      // Keep the process running
      process.on("SIGINT", () => {
        console.log("Stopping scheduled backups...");
        process.exit(0);
      });
      break;

    default:
      console.log(
        "Usage: node backup.js [backup|restore|list|schedule] [backup-path]"
      );
      process.exit(1);
  }
}

module.exports = DatabaseBackup;
