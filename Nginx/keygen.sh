# Create a directory for SSL files
mkdir ssl
cd ssl

# Generate a private key
openssl genrsa -out key.pem 2048

# Generate a certificate signing request (CSR)
openssl req -new -key key.pem -out csr.pem -subj "/C=EL/ST=Attica/L=Athens/O=NTUA/OU=ECE/CN=localhost"

# Generate a self-signed certificate
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem

# Generate a self-signed certificate for subdomain
openssl req -new -key key.pem -out csrdom.pem -subj "/C=EL/ST=Attica/L=Athens/O=NTUA/OU=ECE/CN=solvemyproblem.duckdns.org"

openssl x509 -req -days 365 -in csrdom.pem -signkey key.pem -out certdom.pem
