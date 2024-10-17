# micran-test

##API

python3 -m venv venv
source venv/bin/activate
python setup.py install 
uvicorn server:app --reload

##Client

npm create vite@latest . -- --template react-ts

