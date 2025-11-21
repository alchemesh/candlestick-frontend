DOCKER_INSTALL="docker-ce" 

if ! [yum list installed "$DOCKER_INSTALL" &>/dev/null]; then
    sudo yum update -y
    sudo yum install -y yum-utils device-mapper-persistent-data lvm2
    sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
    sudo yum install -y docker-ce docker-ce-cli
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo docker run hello-world
fi