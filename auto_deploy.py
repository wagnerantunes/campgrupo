import pty
import os
import sys
import time

def run_cmd_with_pass(cmd, password):
    print(f"Running: {cmd}")
    pid, fd = pty.fork()
    if pid == 0:
        # Child
        os.execv('/bin/sh', ['/bin/sh', '-c', cmd])
    else:
        # Parent
        try:
            # Simple interaction loop
            output = b""
            while True:
                try:
                    chunk = os.read(fd, 1024)
                    if not chunk:
                        break
                    output += chunk
                    sys.stdout.buffer.write(chunk)
                    sys.stdout.flush()
                    
                    if b"password:" in chunk.lower() or b"passphrase" in chunk.lower():
                        os.write(fd, (password + "\n").encode())
                        # Wait a bit to avoid double sending if prompt repeats or lag
                        time.sleep(1)
                    
                    if b"continue connecting" in chunk.lower():
                        os.write(fd, b"yes\n")
                        time.sleep(1)
                        
                except OSError:
                    break
        except Exception as e:
            print(f"Error: {e}")
        finally:
            os.waitpid(pid, 0)

password = "ServidorMax@2021"
ip = "72.60.139.82"

print("Step 1: Uploading files...")
run_cmd_with_pass(f"scp -o StrictHostKeyChecking=no setup_vps.sh deploy-backend.tar.gz root@{ip}:~/", password)

print("\nStep 2: Executing setup script remotely...")
run_cmd_with_pass(f"ssh -o StrictHostKeyChecking=no root@{ip} 'chmod +x setup_vps.sh && ./setup_vps.sh'", password)
