from setuptools import setup, find_packages

setup(
    name='micran_test_api',
    version='0.1.0',
    packages=find_packages(),
    python_requires='==3.10.12',
    install_requires=[
        'fastapi',
        'uvicorn',
        'psutil',
    ],
)