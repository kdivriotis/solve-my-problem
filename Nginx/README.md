# MICROSERVICE

## NGINX

The Nginx microservice acts as a reverse proxy for a set of Node.js microservices and the Next.js frontend application. It handles routing and load balancing across multiple services and ensures secure HTTPS communication by terminating SSL connections.

## Features

- **Reverse Proxy**: Routes incoming HTTP/HTTPS requests to the appropriate backend service.
- **SSL Termination**: Handles HTTPS requests and forwards them as HTTP to the backend services.
- **Routing**: Configures custom paths for different microservices.

## Usage

### Prerequisites

- OpenSSL installed for SSL certificate generation.

### Setup

Run the provided `keygen.sh` script to generate the SSL certificate and key files.

```bash
./keygen.sh
```
This script will:
- Create a `ssl` directory.
- Generate a private key (`key.pem`).
- Generate a certificate signing request (CSR).
- Create a self-signed certificate (`cert.pem`).

**Note:** The `keygen.sh` script is designed for development purposes and auto-fills CSR details. If you're running this in a production environment, consider using a valid SSL certificate from a trusted certificate authority.


### Managing SSL Certificates

- **Generating New Certificates:**

  SSL certificates have an expiration date (in this case, 365 days). When the certificate expires, you can regenerate it by rerunning the `keygen.sh` script:

  ```bash
  ./keygen.sh
  ```

  This will overwrite the existing `cert.pem` and `key.pem` files with new ones. After generating new certificates, restart the Nginx service to apply the changes:

  ```bash
  docker-compose restart nginx
  ```

- **Using Certificates from a Trusted CA:**

  For production environments, replace the self-signed certificates with those from a trusted Certificate Authority (CA). Update the `ssl_certificate` and `ssl_certificate_key` paths in the `nginx.conf` file accordingly.

### Configuration

The Nginx configuration is defined in the `nginx.conf` file. Key sections include:

- **Upstream Servers**: Define the backend services and their respective ports.
- **Proxy Pass**: Specify how requests are routed to different services.
- **SSL Configuration**: Configure the SSL certificate and key paths.

You can modify the `nginx.conf` file to adjust routing, load balancing, or other Nginx features as needed.

### Maintenance

- **Monitoring and Logs**: Check Nginx logs for errors or access logs by connecting to the Nginx container:

  ```bash
  docker logs nginx
  ```

- **Certificate Renewal**: Monitor the expiration of your SSL certificates and renew them as necessary using the provided script.
