# #!/bin/sh -ex

# This file is how Fly starts the server (configured in fly.toml). Before starting
# the server though, we need to run any prisma migrations that haven't yet been
# run, which is why this file exists in the first place.
# Learn more: https://community.fly.io/t/sqlite-not-getting-setup-properly/4386

# npm run start

#!/bin/bash

# Wait for Supabase to be ready
until pg_isready -h supabase -p 5432 -U postgres; do
  echo "Waiting for Supabase to be ready..."
  sleep 2
done

echo "Supabase is ready. Running migrations..."

# Run Prisma migrations
npx prisma migrate deploy

echo "Starting application..."

# Start the application
exec node /src/build

exec npm run start
