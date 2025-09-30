# Deployment Guide

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Git

### Quick Start

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd ai-game-builder
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   ```bash
   # Start PostgreSQL and Redis locally
   # Then run database migrations
   cd backend
   npx prisma db push
   npx prisma generate
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1: Backend
   npm run server:dev

   # Terminal 2: Mobile App
   npm start
   ```

## Production Deployment

### Backend (Node.js + Express)

#### Option 1: AWS EC2 + RDS
1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t3.medium or larger
   - Security groups: HTTP (80), HTTPS (443), SSH (22)

2. **Setup Dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm redis-server nginx
   sudo npm install -g pm2
   ```

3. **Database Setup**
   - Create RDS PostgreSQL instance
   - Create Redis ElastiCache instance
   - Update DATABASE_URL and REDIS_URL in .env

4. **Deploy Application**
   ```bash
   git clone <repository>
   cd ai-game-builder/backend
   npm ci --production
   npm run build
   pm2 start dist/index.js --name "ai-game-builder-api"
   ```

5. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

#### Option 2: Docker + Docker Compose
1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Docker Compose**
   ```yaml
   version: '3.8'
   services:
     api:
       build: ./backend
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
       depends_on:
         - postgres
         - redis
     
     postgres:
       image: postgres:14
       environment:
         POSTGRES_DB: ai_game_builder
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: password
       volumes:
         - postgres_data:/var/lib/postgresql/data
     
     redis:
       image: redis:7-alpine
   ```

### Mobile App (React Native + Expo)

#### Option 1: Expo Application Services (EAS)
1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   eas login
   ```

2. **Configure EAS**
   ```bash
   cd mobile
   eas build:configure
   ```

3. **Build for Production**
   ```bash
   # iOS
   eas build --platform ios --profile production
   
   # Android
   eas build --platform android --profile production
   
   # Web
   expo build:web
   ```

4. **Deploy Web Version**
   - Upload `web-build` folder to AWS S3
   - Configure CloudFront distribution
   - Set up custom domain

#### Option 2: Manual Build
1. **iOS (Requires macOS + Xcode)**
   ```bash
   expo run:ios --configuration Release
   ```

2. **Android**
   ```bash
   expo run:android --variant release
   ```

### Infrastructure as Code (AWS CDK)

```typescript
// infrastructure/lib/ai-game-builder-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

export class AIGameBuilderStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 2,
    });

    // PostgreSQL Database
    const database = new rds.DatabaseInstance(this, 'Database', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_14,
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      vpc,
    });

    // Redis Cache
    const cache = new elasticache.CfnCacheCluster(this, 'Cache', {
      cacheNodeType: 'cache.t3.micro',
      engine: 'redis',
      numCacheNodes: 1,
    });

    // S3 Bucket for Assets
    const assetsBucket = new s3.Bucket(this, 'Assets', {
      bucketName: 'ai-game-builder-assets',
      publicReadAccess: false,
    });

    // CloudFront Distribution
    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource: assetsBucket,
        },
        behaviors: [{
          isDefaultBehavior: true,
        }],
      }],
    });
  }
}
```

## Environment Variables

### Required for Production
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db_name
REDIS_URL=redis://host:6379

# Security
JWT_SECRET=super-secure-secret-key-change-in-production
ENCRYPTION_KEY=32-character-encryption-key-here

# AWS
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your-s3-bucket
AWS_CLOUDFRONT_DOMAIN=your-cloudfront-domain.cloudfront.net

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Server
PORT=3000
NODE_ENV=production
```

## Monitoring & Logging

### Application Monitoring
- **PM2 Monitoring**: `pm2 monit`
- **Logs**: `pm2 logs ai-game-builder-api`
- **Health Check**: `curl http://your-domain/health`

### Infrastructure Monitoring
- AWS CloudWatch for metrics
- Application Load Balancer health checks
- Database connection pooling monitoring

## Security Checklist

- [ ] Enable HTTPS with SSL certificates
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable request logging
- [ ] Encrypt sensitive data
- [ ] Use secure session configuration
- [ ] Implement proper error handling
- [ ] Set up database connection limits
- [ ] Configure firewall rules
- [ ] Enable monitoring and alerting

## Backup Strategy

### Database Backups
- **Automated**: RDS automated backups (7-day retention)
- **Manual**: `pg_dump` for specific point-in-time backups

### Asset Backups
- **S3 Versioning**: Enable versioning on S3 buckets
- **Cross-Region Replication**: For critical assets

### Code Backups
- **Git Repository**: Primary source control
- **Docker Images**: Store in ECR/DockerHub

## Scaling Considerations

### Horizontal Scaling
- Multiple API server instances behind load balancer
- Database read replicas
- Redis clustering
- CDN for static assets

### Vertical Scaling
- Increase EC2 instance sizes
- Scale database compute/storage
- Optimize Redis memory allocation

### Auto Scaling
- EC2 Auto Scaling Groups
- Application Load Balancer
- CloudWatch metrics-based scaling