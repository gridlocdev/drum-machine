# Stage 1: Copy static files
FROM busybox:latest AS builder

# Set working directory
WORKDIR /app

# Copy static files
COPY index.html ./
COPY main.js ./
COPY style.css ./
COPY assets/ ./assets/
COPY components/ ./components/

# Stage 2: Serve the static files with BusyBox
FROM busybox:latest

# Create a non-root user
RUN addgroup -g 1001 drumuser && \
    adduser -D -u 1001 -G drumuser drumuser

# Create directory for static files
RUN mkdir -p /home/drumuser/www && \
    chown -R drumuser:drumuser /home/drumuser

# Copy built files from builder stage
COPY --from=builder --chown=drumuser:drumuser /app /home/drumuser/www

# Switch to non-root user
USER drumuser

# Set working directory
WORKDIR /home/drumuser/www

# Expose port
EXPOSE 8080

# Start BusyBox httpd server
CMD ["httpd", "-f", "-v", "-p", "8080", "-h", "/home/drumuser/www"]
