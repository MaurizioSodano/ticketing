## Usage

run **skaffold dev** to start kubernetes

run **kubectl get services** to list active services


run **skaffold delete** to clean up kubernetes running resources




## Note Creating a secret in Kubernetes
kubectl create secret generic **jwt-secret** --from-literal=**jwt**=asdf


