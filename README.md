# K8s Ingress Annotation Webhook

A Kubernetes Mutating Webhook that adds annotations to Ingress objects in a given namespace.

## BUILD

```
./crete-cert.sh
docker build . -t containers.hardill.me.uk/testing/web-hook:latest
docker push
```

You will also need to replace the `caBundle` value in the template/k8s-webhook.yml file with the output of 

```
base64 -w 0 ca/ca.crt
```

This will ensure the newly created CA is trusted by the kubernetes runtime.

## Deploy

```
kubectl apply -f template/k8s-webhook.yml
```
