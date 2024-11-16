# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the ports used by both servers
EXPOSE 8000
EXPOSE 3200

# Start both servers
CMD ["sh", "-c", "python3 -m http.server 8000 & python3 server/server.py"]
