# ensure you heroku login and heroku container:login before

docker build -t pbrn-users:v0.0.1 .
docker tag pbrn-users:v0.0.1 registry.heroku.com/pbrn-users/web
docker push registry.heroku.com/pbrn-users/web                  
heroku container:release web -a pbrn-users