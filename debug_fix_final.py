import pty
import os
import sys
import time
import re

def run_cmd_with_pass(cmd, password):
    print(f"Running: {cmd}")
    pid, fd = pty.fork()
    if pid == 0:
        os.execv('/bin/sh', ['/bin/sh', '-c', cmd])
    else:
        output_buffer = b""
        try:
            while True:
                try:
                    chunk = os.read(fd, 1024)
                    if not chunk:
                        break
                    output_buffer += chunk
                    sys.stdout.buffer.write(chunk)
                    sys.stdout.flush()
                    
                    if b"password:" in chunk.lower():
                        os.write(fd, (password + "\n").encode())
                        time.sleep(1)
                    
                    if b"continue connecting" in chunk.lower():
                        os.write(fd, b"yes\n")
                        time.sleep(1)
                except OSError:
                    break
        finally:
            os.waitpid(pid, 0)
        return output_buffer

password = "ServidorMax@2021"
ip = "72.60.139.82"

print("--- Step 1: Check File Structure ---")
# Reset known hosts to avoid issues if needed, or just ignore strict checking
ls_cmd = f"ssh -o StrictHostKeyChecking=no root@{ip} 'ls -F /var/www/campgrupo-api/'"
run_cmd_with_pass(ls_cmd, password)

print("\n--- Step 2: Fix and Restart PM2 ---")
# Logic: Delete existing, find index.js, start it.
fix_cmd = f"ssh -o StrictHostKeyChecking=no root@{ip} \"cd /var/www/campgrupo-api && pm2 delete api; if [ -f index.js ]; then echo 'Found index.js at root'; pm2 start index.js --name api --env production; else echo 'Looking in dist...'; pm2 start dist/index.js --name api --env production; fi; pm2 save\""
run_cmd_with_pass(fix_cmd, password)

print("\n--- Step 3: Verify Status ---")
status_cmd = f"ssh -o StrictHostKeyChecking=no root@{ip} 'pm2 list && pm2 logs api --lines 10 --nostream'"
run_cmd_with_pass(status_cmd, password)
