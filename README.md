# K8s Ingress Annotation Webhook

A Kubernetes Mutating Webhook that adds annotations to Ingress objects in a given namespace.

## BUILD

```
./crete-cert.sh
docker build . -t containers.hardill.me.uk/testing/web-hook:latest
docker push
```

## Deploy

```
kubectl apply -f template/k8s-webhook.yml
```