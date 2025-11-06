from flask import Flask, request         
app = Flask(__name__)                    
@app.route('/greeting/')                 
def hello():                             
    name = request.args.get('name')      
    return f"Hello, {name}!"       