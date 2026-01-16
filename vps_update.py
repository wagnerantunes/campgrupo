import pty
import os
import sys
import time

def run_cmd_with_pass(cmd, password):
    print(f"Running: {cmd}")
    pid, fd = pty.fork()
    if pid == 0:
        os.execv('/bin/sh', ['/bin/sh', '-c', cmd])
    else:
        try:
            while True:
                try:
                    chunk = os.read(fd, 1024)
                    if not chunk: break
                    sys.stdout.buffer.write(chunk)
                    sys.stdout.flush()
                    if b"password:" in chunk.lower():
                        os.write(fd, (password + "\n").encode())
                    if b"continue connecting" in chunk.lower():
                        os.write(fd, b"yes\n")
                except OSError: break
        finally:
            os.waitpid(pid, 0)

password = "ServidorMax@2021"
ip = "72.60.139.82"
dest_dir = "/var/www/campgrupo-api"

print("--- Uploading Update Package ---")
run_cmd_with_pass(f"scp -o StrictHostKeyChecking=no update-vps.tar.gz root@{ip}:/root/", password)

print("\n--- Applying Update on VPS ---")
remote_cmds = f"""
mkdir -p {dest_dir}
tar -xzf /root/update-vps.tar.gz -C {dest_dir}
cd {dest_dir}
npm install
npm run build
pm2 start dist/index.js --name api || pm2 restart api
pm2 save
rm /root/update-vps.tar.gz
"""
run_cmd_with_pass(f"ssh -o StrictHostKeyChecking=no root@{ip} '{remote_cmds}'", password)
