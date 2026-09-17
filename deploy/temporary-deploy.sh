#!/usr/bin/env bash
set -euo pipefail

site_root=/var/www/serdes-fight-club
archive=/tmp/serdes-fight-club-temp-deploy.tar
nginx_upload=/tmp/nginx-serdes-live.conf
nginx_site=/etc/nginx/sites-available/serdes-fight-club
stamp=$(date -u +%Y%m%dT%H%M%SZ)
staging="/var/www/serdes-fight-club-next-$stamp"
backup="/var/www/serdes-fight-club-backup-$stamp"
nginx_backup="/etc/nginx/sites-available/serdes-fight-club.backup-$stamp"

test "$site_root" = /var/www/serdes-fight-club
test -d "$site_root"
test -s "$archive"
test -s "$nginx_upload"

sudo mkdir -- "$staging"
sudo tar -xf "$archive" -C "$staging"
test -s "$staging/index.html"
test -d "$staging/assets"
test -d "$staging/videos"
sudo chown -R www-data:www-data "$staging"

sudo cp -- "$nginx_site" "$nginx_backup"
sudo install -o root -g root -m 0644 "$nginx_upload" "$nginx_site"
if ! sudo nginx -t; then
  sudo cp -- "$nginx_backup" "$nginx_site"
  sudo nginx -t
  exit 1
fi

sudo mv -- "$site_root" "$backup"
if ! sudo mv -- "$staging" "$site_root"; then
  sudo mv -- "$backup" "$site_root"
  sudo cp -- "$nginx_backup" "$nginx_site"
  exit 1
fi

if ! sudo systemctl reload nginx; then
  sudo mv -- "$site_root" "$staging"
  sudo mv -- "$backup" "$site_root"
  sudo cp -- "$nginx_backup" "$nginx_site"
  sudo systemctl reload nginx
  exit 1
fi

rm -f -- "$archive" "$nginx_upload"
printf 'DEPLOYED=%s\nBACKUP=%s\nNGINX_BACKUP=%s\n' "$site_root" "$backup" "$nginx_backup"
