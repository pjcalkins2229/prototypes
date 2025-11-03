# config valid for current version and patch releases of Capistrano
lock "~> 3.19.2"

set :application, "prototypes"
set :repo_url, "git@github.com:pjcalkins2229/prototypes"

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, "/var/www/my_app_name"

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# append :linked_files, "config/database.yml", 'config/master.key'

# Default value for linked_dirs is []
# append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system", "vendor", "storage"

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for local_user is ENV['USER']
# set :local_user, -> { `git config user.name`.chomp }

# Default value for keep_releases is 5
# set :keep_releases, 5

# Uncomment the following to require manually verifying the host key before first deploy.
# set :ssh_options, verify_host_key: :secure

# Use deployer user for SSH with agent forwarding
set :ssh_options, { user: 'deployer', forward_agent: true }

set :rbenv_type, :user
set :linked_files, %w{config/secrets.yml config/credentials.yml.enc config/master.key}
set :linked_dirs, %w{log tmp/pids tmp/cache tmp/sockets vendor/bundle public/uploads, storage}

namespace :deploy do

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      rails_env = fetch(:rails_env)
      rbenv_path = fetch(:rbenv_path)

      execute("cd #{release_path} && ( export RBENV_ROOT=\"#{rbenv_path}\" RBENV_VERSION=\"\" RAILS_ENV=\"#{rails_env}\" ;  #{rbenv_path}/bin/rbenv exec bundle exec rails assets:precompile )")

      execute("find #{release_path} -type f -exec chmod g+rw {} \\;")
      execute("find #{release_path} -type d -exec chmod g+rw {} \\;")

      execute("sudo /usr/bin/systemctl restart nginx")

    end
  end

  after :publishing, 'deploy:restart'
  after :finishing, 'deploy:cleanup'

end
