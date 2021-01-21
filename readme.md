## Usage

run **skaffold dev** to start kubernetes

run **kubectl get services** to list active services


run **skaffold delete** to clean up kubernetes running resources




## Note Creating a secret in Kubernetes
kubectl create secret generic **jwt-secret** --from-literal=**jwt**=asdf


## secrets
1. jwt:         kubectl create secret generic jwt-secret --from-literal=JWT_KEY=thisShouldBeASecret
2. swipe: 		kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<sk-test…>


## ingress-ngnix local
1. install helm
2. helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx 
3. helm repo update 
4. helm install my-release ingress-nginx/ingress-nginx

... than
5. kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.41.2/deploy/static/provider/cloud/deploy.yaml

## Port 80 problem:
To determine what might be using this port, run:

macOS / Linux
sudo lsof -i tcp:80

Windows:
netstat -aon | findstr :80

 # host
 create a record in hosts file: 127.0.0.1 ticketing.dev


