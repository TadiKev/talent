from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import base64
import os

# Ensure SECRET_KEY is properly fetched and truncated to 32 bytes
SECRET_KEY = os.environ.get('SECRET_KEY')[:32]
iv = get_random_bytes(AES.block_size)

def pad(s):
    return s + (AES.block_size - len(s) % AES.block_size) * chr(AES.block_size - len(s) % AES.block_size)

def unpad(s):
    return s[:-s[-1]]

def decrypt(data):
    if data is None:
        return None  # Handle None gracefully, depending on your application's logic
    cipher = AES.new(SECRET_KEY.encode(), AES.MODE_CBC, iv)
    decrypted = cipher.decrypt(base64.b64decode(data.encode()))
    return unpad(decrypted).decode('utf-8')
