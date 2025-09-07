# Spring Boot Actuator Configuration for Comprehensive Monitoring

## Overview

To enable comprehensive system health monitoring in your Sowl Studios admin dashboard, you need to properly configure Spring Boot Actuator endpoints in your backend application.

## Required Configuration

### 1. Application Properties (application.yml)

Add this configuration to your `application.yml` file:

```yaml
management:
  endpoints:
    web:
      exposure:
        # Expose all actuator endpoints for comprehensive monitoring
        include: "*"
        # Alternative: expose specific endpoints only
        # include: health,info,metrics,env,beans,configprops,loggers,threaddump,heapdump
      base-path: /actuator
      cors:
        allowed-origins: 
          - "http://localhost:3000"
          - "https://your-frontend-domain.com"
        allowed-methods: GET,POST
        allowed-headers: "*"
  
  endpoint:
    health:
      show-details: always
      show-components: always
      probes:
        enabled: true
    info:
      enabled: true
    metrics:
      enabled: true
    env:
      enabled: true
      show-values: when-authorized
    beans:
      enabled: true
    configprops:
      enabled: true
      show-values: when-authorized
    loggers:
      enabled: true
    threaddump:
      enabled: true
    heapdump:
      enabled: true

  info:
    # Enable info contributors
    build:
      enabled: true
    git:
      enabled: true
      mode: full
    java:
      enabled: true
    os:
      enabled: true
    env:
      enabled: true

  metrics:
    export:
      # Enable metrics export (optional)
      simple:
        enabled: true
    distribution:
      percentiles-histogram:
        http.server.requests: true
      percentiles:
        http.server.requests: 0.5, 0.95, 0.99
      slo:
        http.server.requests: 10ms, 50ms, 100ms, 200ms, 500ms

# Security configuration for actuator endpoints
spring:
  security:
    user:
      name: admin
      password: ${ADMIN_PASSWORD:admin123}
      roles: ADMIN

# Database configuration for connection pool monitoring
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
      leak-detection-threshold: 60000
```

### 2. Security Configuration

Create or update your security configuration to allow actuator access:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                // Allow public access to main API endpoints
                .requestMatchers("/api/v1/health", "/api/v1/info").permitAll()
                .requestMatchers("/api/v1/bookings").permitAll()
                
                // Secure actuator endpoints - require authentication
                .requestMatchers("/actuator/**").hasRole("ADMIN")
                
                // Secure admin endpoints
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/auth/**").permitAll()
                
                .anyRequest().authenticated()
            )
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:3000",
            "https://*.onrender.com",
            "https://your-domain.com"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### 3. Build Information (build.gradle or pom.xml)

#### For Gradle (build.gradle):
```gradle
plugins {
    id 'org.springframework.boot' version '3.2.0'
    id 'io.spring.dependency-management' version '1.1.4'
    id 'java'
}

// Enable build info generation
springBoot {
    buildInfo()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    // Add micrometer for enhanced metrics
    implementation 'io.micrometer:micrometer-registry-prometheus'
}
```

#### For Maven (pom.xml):
```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <executions>
        <execution>
            <goals>
                <goal>build-info</goal>
            </goals>
        </execution>
    </executions>
</plugin>

<plugin>
    <groupId>pl.project13.maven</groupId>
    <artifactId>git-commit-id-plugin</artifactId>
    <executions>
        <execution>
            <goals>
                <goal>revision</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

### 4. Custom Health Indicators (Optional)

Create custom health indicators for business-specific monitoring:

```java
@Component
public class BookingServiceHealthIndicator implements HealthIndicator {

    @Autowired
    private BookingService bookingService;

    @Override
    public Health health() {
        try {
            long totalBookings = bookingService.getTotalBookings();
            long todayBookings = bookingService.getTodayBookings();
            
            return Health.up()
                .withDetail("totalBookings", totalBookings)
                .withDetail("todayBookings", todayBookings)
                .withDetail("status", "Booking service is operational")
                .build();
        } catch (Exception e) {
            return Health.down()
                .withDetail("error", e.getMessage())
                .withDetail("status", "Booking service is down")
                .build();
        }
    }
}
```

### 5. Custom Metrics (Optional)

Add custom metrics for business monitoring:

```java
@Service
public class BookingMetricsService {

    private final MeterRegistry meterRegistry;
    private final Counter bookingCreatedCounter;
    private final Gauge activeBookingsGauge;

    public BookingMetricsService(MeterRegistry meterRegistry, BookingService bookingService) {
        this.meterRegistry = meterRegistry;
        this.bookingCreatedCounter = Counter.builder("bookings.created")
            .description("Number of bookings created")
            .register(meterRegistry);
            
        this.activeBookingsGauge = Gauge.builder("bookings.active")
            .description("Number of active bookings")
            .register(meterRegistry, bookingService, BookingService::getActiveBookingsCount);
    }

    public void incrementBookingCreated() {
        bookingCreatedCounter.increment();
    }
}
```

## Available Endpoints

After configuration, these endpoints will be available:

### Core Actuator Endpoints
- `GET /actuator` - Actuator root with available endpoints
- `GET /actuator/health` - Application health status
- `GET /actuator/info` - Application information
- `GET /actuator/metrics` - Available metrics list
- `GET /actuator/metrics/{metricName}` - Specific metric details
- `GET /actuator/env` - Environment properties
- `GET /actuator/beans` - Spring beans information
- `GET /actuator/configprops` - Configuration properties

### Performance Monitoring
- `GET /actuator/threaddump` - Thread dump
- `GET /actuator/heapdump` - Heap dump (download)
- `GET /actuator/loggers` - Logger configuration
- `GET /actuator/httptrace` - HTTP request traces (if enabled)

### Key Metrics Available
- **JVM Metrics**: `jvm.memory.used`, `jvm.memory.max`, `jvm.threads.live`
- **System Metrics**: `system.cpu.usage`, `process.cpu.usage`, `system.load.average.1m`
- **HTTP Metrics**: `http.server.requests` (with percentiles)
- **Database Metrics**: `jdbc.connections.active`, `jdbc.connections.max`
- **Custom Metrics**: Any business-specific metrics you define

## Security Considerations

### Production Security
1. **Restrict Access**: Only expose actuator endpoints to admin users
2. **Use HTTPS**: Always use HTTPS in production
3. **Limit Exposure**: Only expose necessary endpoints
4. **Monitor Access**: Log and monitor actuator endpoint access
5. **Sensitive Data**: Use `show-values: when-authorized` for sensitive properties

### Authentication
- Actuator endpoints require admin authentication
- Use JWT tokens for API access
- Implement proper CORS configuration
- Consider IP whitelisting for sensitive endpoints

## Troubleshooting

### Common Issues

1. **Endpoints Not Available**
   - Check `management.endpoints.web.exposure.include` configuration
   - Verify security configuration allows access
   - Ensure actuator dependency is included

2. **Access Denied (403)**
   - Check authentication credentials
   - Verify user has ADMIN role
   - Check CORS configuration

3. **Limited Health Details**
   - Set `management.endpoint.health.show-details: always`
   - Set `management.endpoint.health.show-components: always`

4. **Missing Metrics**
   - Ensure `management.endpoint.metrics.enabled: true`
   - Check if micrometer dependencies are included
   - Verify custom metrics are properly registered

### Testing Configuration

Test your actuator endpoints:

```bash
# Test health endpoint
curl -u admin:admin123 http://localhost:8000/actuator/health

# Test metrics endpoint
curl -u admin:admin123 http://localhost:8000/actuator/metrics

# Test specific metric
curl -u admin:admin123 http://localhost:8000/actuator/metrics/jvm.memory.used

# Test info endpoint
curl -u admin:admin123 http://localhost:8000/actuator/info
```

## Frontend Integration

The enhanced SystemHealth component will automatically detect and display:
- ✅ Comprehensive health status
- ✅ Performance metrics (CPU, Memory, Threads)
- ✅ Database connection pool status
- ✅ HTTP request statistics
- ✅ JVM and system information
- ✅ Environment configuration
- ✅ Build and Git information

With this configuration, your admin dashboard will show comprehensive, real-time monitoring data for your Spring Boot application!
