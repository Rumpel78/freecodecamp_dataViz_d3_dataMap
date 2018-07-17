FROM registry.gitlab.com/rumpel78/staticfileserver:latest
COPY ./src/ /app/wwwroot
