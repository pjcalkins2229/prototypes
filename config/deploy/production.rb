server 'prototype.cws.net', roles: %w{app db}

set :deploy_to, '/home/deployer/sites/prototypes'
set :deploy_env, "production"
set :rails_env, "production"
set :branch, "main"
set :rbenv_path, "/home/deployer/.rbenv/bin/rbenv"
