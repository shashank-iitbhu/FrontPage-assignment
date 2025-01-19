# Use the official MySQL image
FROM mysql:8.0

# Set environment variables for MySQL setup
ENV MYSQL_ROOT_PASSWORD=password
ENV MYSQL_DATABASE=hacker_news
ENV MYSQL_USER=admin
ENV MYSQL_PASSWORD=password

# Copy the schema.sql file to initialize the database
COPY schema.sql /docker-entrypoint-initdb.d/

# Expose MySQL default port
EXPOSE 3306
