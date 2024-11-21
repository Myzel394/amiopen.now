ip=$1
user=$2

docker buildx build --platform linux/amd64 . --tag amiopen:latest && 
    docker save -o amiopen.tar amiopen:latest && 
    scp amiopen.tar $user@$ip:~/amiopen/amiopen.tar &&
    ssh $user@$ip "cd ~/amiopen && docker container stop amiopen && docker container rm amiopen && docker load -i amiopen.tar && docker compose up -d"

