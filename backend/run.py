"""Run from concertmate/ root: python backend/run.py"""
import subprocess, sys, os

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
subprocess.run([sys.executable, "-m", "uvicorn", "backend.main:app", "--reload", "--port", "8000"])
