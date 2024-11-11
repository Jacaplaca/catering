# Notes

When changing branch for different app make sure you update schema prisma by npx prisma db push

## Creating base image
in deployment 
build on oracle arm64 ``docker build -t dziewan/t3-app-base:22-bullseye -f Dockerfile.base-arm64 .``
on amd64 ex.windows and n710 ``docker build -t dziewan/t3-app-base:22-bullseye -f Dockerfile.base-amd64 .``
push to docker hub ``docker push dziewan/t3-app-base:22-bullseye``
test ``docker run -it dziewan/t3-app-base:22-bullseye bash``