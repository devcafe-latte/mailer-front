#! /bin/bash
# exit script when any command ran here returns with non-zero exit code
set -e

COMMIT_SHA1=$CIRCLE_SHA1

ENV=$1

if [ -z ${ENV} ]; then 
  echo "Missing Environment: test, staging, prod";
  exit 1
fi

# We must export it so it's available for envsubst
export COMMIT_SHA1=$COMMIT_SHA1

# since the only way for envsubst to work on files is using input/output redirection,
#  it's not possible to do in-place substitution, so we need to save the output to another file
#  and overwrite the original with that one.
envsubst <./deploy/$ENV.yml >./deploy/$ENV.yml.out
mv ./deploy/$ENV.yml.out ./deploy/$ENV.yml

echo "$KUBERNETES_CLUSTER_CERTIFICATE" | base64 --decode > cert.crt

./kubectl \
  --kubeconfig=/dev/null \
  --server=$KUBERNETES_SERVER \
  --certificate-authority=cert.crt \
  --token=$KUBERNETES_TOKEN \
  apply -f ./deploy/$ENV.yml
