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

password = "ServidorMax@2021"
ip = "72.60.139.82"

print("Checking backend on port 3001...")
run_cmd_with_pass(f"ssh -o StrictHostKeyChecking=no root@{ip} 'curl -v http://localhost:3001/api/config'", password)
