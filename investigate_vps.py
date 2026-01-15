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
            output = b""
            while True:
                try:
                    chunk = os.read(fd, 1024)
                    if not chunk:
                        break
                    output += chunk
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
        return output

password = "ServidorMax@2021"
ip = "72.60.139.82"

print("--- Checking Ports in Use ---")
run_cmd_with_pass(f"ssh -o StrictHostKeyChecking=no root@{ip} 'netstat -tulnp | grep LISTEN'", password)

print("\n--- Checking Nginx Configurations ---")
run_cmd_with_pass(f"ssh -o StrictHostKeyChecking=no root@{ip} 'grep -r \"proxy_pass\" /etc/nginx/sites-enabled/'", password)

print("\n--- Checking PM2 Processes ---")
run_cmd_with_pass(f"ssh -o StrictHostKeyChecking=no root@{ip} 'pm2 list'", password)
