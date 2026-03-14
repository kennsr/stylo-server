# TODO Before Production

This document lists all items that need to be addressed before deploying to production.

---

## 🗄️ Database & Data

### [ ] Environment Variables
- [ ] Set strong `JWT_SECRET` (currently placeholder)
- [ ] Configure production `DATABASE_URL` (Supabase PostgreSQL)
- [ ] Set appropriate `JWT_EXPIRES_IN` for your use case
- [ ] Add any other production-specific env vars

### [ ] Database Migrations
- [ ] Replace `synchronize: true` with proper migrations in production
- [ ] Set up migration scripts in `package.json`
- [ ] Test migrations on staging environment first

**File:** `src/database/seeds/seed.ts`
```typescript
// Current (development):
synchronize: true,

// Change to (production):
synchronize: false,
migrations: ['dist/database/migrations/*.js'],
```

---

## ☁️ File Storage (Avatar Uploads)

### [ ] Migrate from Local to Cloud Storage

**Current:** Files stored locally in `/uploads/avatars/`

**Required Changes:**

1. **Choose a storage provider:**
   - AWS S3
   - Google Cloud Storage
   - Cloudinary
   - Supabase Storage
   - Other CDN service

2. **Install required packages:**
   ```bash
   # Example for AWS S3
   npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
   npm install --save-dev @types/aws-sdk
   ```

3. **Update `src/profile/profile.service.ts`:**
   - Replace `fs.writeFileSync()` with cloud upload
   - Generate CDN URLs instead of local paths
   - Implement file deletion for old avatars

4. **Update `src/main.ts`:**
   - Remove or conditionally enable `app.useStaticAssets()`
   - Not needed if using CDN

5. **Update `Dockerfile`:**
   - Remove local uploads directory creation
   - Or keep for fallback/caching

6. **Environment variables to add:**
   ```env
   # AWS S3 Example
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_S3_BUCKET=your-bucket-name
   AWS_REGION=us-east-1
   
   # OR Cloudinary
   CLOUDINARY_CLOUD_NAME=xxx
   CLOUDINARY_API_KEY=xxx
   CLOUDINARY_API_SECRET=xxx
   
   # OR Supabase Storage
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_ANON_KEY=xxx
   SUPABASE_STORAGE_BUCKET=avatars
   ```

---

## 🔐 Security

### [ ] Rate Limiting
- [ ] Install and configure `@nestjs/throttler`
- [ ] Set rate limits for authentication endpoints
- [ ] Set rate limits for file uploads
- [ ] Configure different limits for different routes

```bash
npm install @nestjs/throttler
```

### [ ] Helmet (Security Headers)
- [ ] Install and configure `helmet` middleware
- [ ] Configure CSP for your domain
- [ ] Test with security headers checker

### [ ] CORS Configuration
- [ ] Restrict CORS to specific origins (currently allows all)
- [ ] Configure allowed methods and headers

**File:** `src/main.ts`
```typescript
// Current (development):
app.enableCors();

// Change to (production):
app.enableCors({
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

### [ ] Input Validation
- [ ] Review all DTOs for proper validation
- [ ] Add file type validation for uploads (currently basic)
- [ ] Add image dimension validation if needed
- [ ] Consider adding file scanning for malware

---

## 📝 Logging & Monitoring

### [ ] Logging
- [ ] Replace `console.log()` with proper logging library
- [ ] Configure structured logging (JSON format)
- [ ] Set up log levels (error, warn, info, debug)
- [ ] Integrate with logging service (e.g., Winston, Pino)

```bash
npm install nestjs-winston winston
```

### [ ] Error Tracking
- [ ] Integrate error tracking service:
  - Sentry
  - Bugsnag
  - Rollbar
- [ ] Configure global exception filters
- [ ] Set up error notifications

### [ ] Performance Monitoring
- [ ] Add APM (Application Performance Monitoring)
  - New Relic
  - Datadog
  - Elastic APM
- [ ] Monitor database query performance
- [ ] Set up alerts for slow endpoints

---

## 🚀 Performance Optimization

### [ ] Caching
- [ ] Install and configure Redis for caching
- [ ] Cache frequently accessed data:
  - User profiles
  - Product listings
  - Style preferences
  - Categories
- [ ] Implement cache invalidation strategy

```bash
npm install @nestjs/cache-manager cache-manager cache-manager-redis-store
```

### [ ] Database Optimization
- [ ] Add database indexes for frequently queried fields
- [ ] Review and optimize slow queries
- [ ] Implement connection pooling
- [ ] Set up database backups

### [ ] Response Compression
- [ ] Enable gzip/brotli compression
- [ ] Configure compression middleware

```bash
npm install compression
npm install --save-dev @types/compression
```

---

## 🧪 Testing

### [ ] Test Coverage
- [ ] Write unit tests for services
- [ ] Write integration tests for controllers
- [ ] Write E2E tests for critical flows
- [ ] Achieve minimum 80% code coverage

### [ ] Load Testing
- [ ] Test with realistic concurrent users
- [ ] Identify bottlenecks
- [ ] Optimize slow endpoints
- [ ] Test database connection limits

---

## 📦 Deployment Configuration

### [ ] Docker Improvements
- [ ] Use multi-stage builds (✅ already implemented)
- [ ] Add `.dockerignore` entries for all unnecessary files
- [ ] Configure proper health checks
- [ ] Set resource limits (CPU, memory)
- [ ] Use specific Node.js version (currently `node:22-alpine`)

### [ ] Environment-Specific Configs
- [ ] Create separate configs for:
  - Development
  - Staging
  - Production
- [ ] Use `@nestjs/config` for configuration management
- [ ] Validate environment variables on startup

### [ ] CI/CD Pipeline
- [ ] Set up automated testing
- [ ] Configure automated builds
- [ ] Implement deployment strategies:
  - Blue-green deployment
  - Rolling updates
  - Canary releases
- [ ] Add rollback procedures

---

## 🔑 Authentication & Authorization

### [ ] JWT Configuration
- [ ] Use strong secret key (minimum 256 bits)
- [ ] Consider refresh token implementation
- [ ] Set appropriate expiration times
- [ ] Implement token blacklisting for logout

### [ ] Password Security
- [ ] Review bcrypt salt rounds (currently 10)
- [ ] Consider increasing for production (12+)
- [ ] Implement password strength requirements
- [ ] Add password reset functionality

### [ ] Session Management
- [ ] Implement session invalidation
- [ ] Add concurrent session limits if needed
- [ ] Track login attempts

---

## 📊 API Documentation

### [ ] Swagger/OpenAPI
- [ ] Add descriptions to all endpoints
- [ ] Document all request/response schemas
- [ ] Add example values
- [ ] Secure Swagger in production (or disable)

**File:** `src/main.ts`
```typescript
// Consider protecting Swagger in production:
if (process.env.NODE_ENV !== 'production') {
  SwaggerModule.setup('api', app, document);
}
```

### [ ] API Versioning
- [ ] Review versioning strategy (currently `/v1`)
- [ ] Plan for future API versions
- [ ] Document deprecation policies

---

## 🛡️ Compliance & Legal

### [ ] Data Privacy
- [ ] Implement GDPR compliance if serving EU users
- [ ] Add data export functionality
- [ ] Add data deletion functionality
- [ ] Create privacy policy

### [ ] Terms of Service
- [ ] Create terms of service
- [ ] Add user agreement acceptance flow

### [ ] Accessibility
- [ ] Ensure API responses support accessibility
- [ ] Document accessibility features

---

## 📈 Analytics

### [ ] User Analytics
- [ ] Integrate analytics service
- [ ] Track key metrics:
  - Active users
  - Feature usage
  - Conversion rates
- [ ] Set up analytics dashboard

### [ ] API Analytics
- [ ] Track API usage patterns
- [ ] Monitor error rates
- [ ] Track response times
- [ ] Set up usage alerts

---

## 🔧 Infrastructure

### [ ] Load Balancing
- [ ] Configure load balancer if running multiple instances
- [ ] Set up sticky sessions if needed
- [ ] Configure health check endpoints

### [ ] SSL/TLS
- [ ] Ensure HTTPS is enforced
- [ ] Configure SSL certificates
- [ ] Set up automatic certificate renewal

### [ ] Backup & Recovery
- [ ] Set up automated database backups
- [ ] Test backup restoration
- [ ] Create disaster recovery plan
- [ ] Document recovery procedures

### [ ] Scaling Strategy
- [ ] Plan for horizontal scaling
- [ ] Configure auto-scaling rules
- [ ] Test scaling procedures
- [ ] Monitor resource usage

---

## ✅ Pre-Launch Checklist

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Cloud storage configured and tested
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS restricted to production domains
- [ ] Logging and monitoring active
- [ ] Error tracking configured
- [ ] Backups scheduled and tested
- [ ] SSL certificates installed
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Team trained on deployment procedures
- [ ] Rollback plan documented and tested

---

## 📞 Support & Maintenance

- [ ] Set up support ticketing system
- [ ] Create maintenance schedule
- [ ] Document common troubleshooting steps
- [ ] Set up on-call rotation if needed
- [ ] Create runbooks for common issues

---

## Priority Matrix

### 🔴 Critical (Must Have Before Launch)
1. Production database configuration
2. Cloud storage for avatars
3. Strong JWT secret
4. HTTPS/SSL
5. CORS configuration
6. Rate limiting
7. Backups

### 🟡 High Priority (Should Have)
1. Logging and monitoring
2. Error tracking
3. Caching
4. Load testing
5. CI/CD pipeline

### 🟢 Medium Priority (Nice to Have)
1. APM integration
2. Advanced analytics
3. Auto-scaling
4. Advanced caching strategies

---

**Last Updated:** 2026-03-12
**Version:** 1.0
