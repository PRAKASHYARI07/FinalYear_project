from passlib.context import CryptContext

# Use argon2 which is more modern and has better compatibility
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash password using Argon2"""
    return pwd_context.hash(password)

