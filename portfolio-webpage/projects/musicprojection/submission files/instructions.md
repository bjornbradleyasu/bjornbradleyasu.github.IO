# Replace with your EC2 IP address
EC2_IP = your.ec2.ip.address
PORT = 8080

# Update system and install necessary packages
setup:
	#run ame494 inctruction
    sudo apt-get install gnupg curl

    curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
   --dearmor
   
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list

    sudo apt update

    sudo apt-get install -y mongodb-org

    sudo apt install nodejs npm 

    sudo npm install -g forever http-server n
	
	# Install Git
	sudo apt install git -y
	
	# Clone the repository (replace with your repository URL)
	git clone https://github.com/bjornbradleyasu/AME494598Fall2024.git
	cd AME494598FALL2024/ASSIGNMENTS/projectorfinal/ec2
	
	# Install dependencies
	npm install
	
	# Open the port for the server
	sudo ufw allow $(8080)
	sudo ufw enable

# Start the server
start:
	# Start the server
	cd <project-folder>
	node server.js

# Clean up
clean:
	# Stop PM2 process
	pm2 stop server.js || true
	pm2 delete server.js || true
	
	# Disable the firewall
	sudo ufw disable
	
	# Remove project folder (replace with your project directory name)
	rm -rf <project-folder>