from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import base64
from django.conf import settings

def encrypt(data):
    cipher = AES.new(settings.SECRET_KEY[:32].encode('utf-8'), AES.MODE_ECB)
    encrypted = base64.b64encode(cipher.encrypt(pad(data.encode('utf-8'), AES.block_size)))
    return encrypted.decode('utf-8')

def decrypt(data):
    cipher = AES.new(settings.SECRET_KEY[:32].encode('utf-8'), AES.MODE_ECB)
    decrypted = unpad(cipher.decrypt(base64.b64decode(data)), AES.block_size)
    return decrypted.decode('utf-8')
