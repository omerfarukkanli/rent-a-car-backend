FROM mongo:latest

# MongoDB data directory
VOLUME /data/db

# Expose MongoDB port
EXPOSE 27017

# Start MongoDB with proper network binding
CMD ["mongod", "--auth"]