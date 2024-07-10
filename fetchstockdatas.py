from flask import Flask,render_template,request,redirect,url_for,session,jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from flask_mysqldb import MySQL
from flask_cors import CORS
import requests

app=Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

app.secret_key= "your-secret-key"


app.config['MYSQL_HOST']="localhost"
app.config['MYSQL_USER']="root"
app.config['MYSQL_PASSWORD']="Bhuvana01"
app.config['MYSQL_DB']= "usersDetails"
app.config["JWT_SECRET_KEY"]="secret_key"
app.secret_key ="any-string-you-want-just-keep-it-secret"

mysql= MySQL(app)
JWTManager(app)

portfolio = []
api_key="cq5s2j9r01qhs6iu39bgcq5s2j9r01qhs6iu39c0"  

@app.route("/login", methods=['POST','GET'])
def login():
    if request.method == 'POST':
        name = request.form['name']  
        password = request.form['password'] 
        cur = mysql.connection.cursor() 
        cur.execute(f"SELECT id,name,password FROM users WHERE name='{name}'")  
        user = cur.fetchone()
        cur.close()

        if user and password == user[2]:
            session["name"] = user[1]
            user_id=user[0]
            access_token=create_access_token(identity=request.form["name"])
            session["token"]=access_token
            response = jsonify({"status":"success",'access_token':session.get('token'),
                "user_id":user_id,
                "user_name":user[1]
             })
            return response
          
@app.route("/register",methods=['POST','GET'])
def register():
    if request.method=='POST':
        name=request.form['name']
        password=request.form['password']
        cur =mysql.connection.cursor()
        cur.execute(f"insert into users(name,password) values ('{name}','{password}')") 
        mysql.connection.commit()
        cur.close()  
        response = jsonify({"status":"success","data":{
         } })

        return response

@app.route("/userDetails", methods=['POST', 'GET'])
@jwt_required()
def loggedUserDetails():
    if request.method == 'POST':
        id = request.form['id']  
        cur = mysql.connection.cursor() 
        cur.execute(f"SELECT id,name,password FROM users WHERE id='{id}'")  
        user = cur.fetchone()
        cur.close()
        response = jsonify({"status":"success",
                "user_id":user[0],
                "user_name":user[1]
             })
        return response

@app.route('/add_stock',  methods=['POST'])
@jwt_required()
def add_stock():
    stock_symbol = request.form['symbol']  
    if stock_symbol not in portfolio:
        portfolio.append(stock_symbol)
    return jsonify({'message': 'Stock added', 'portfolio': portfolio})

@app.route('/remove_stock', methods=['POST'])
@jwt_required()
def remove_stock():
    stock_symbol = request.form['symbol']  
    if stock_symbol in portfolio:
        portfolio.remove(stock_symbol)
    return jsonify({'message': 'Stock removed', 'portfolio': portfolio })

@app.route('/portfolio', methods=['GET'])
@jwt_required()
def get_portfolio():
    return jsonify({'portfolio':portfolio})


@app.route('/fetch-bestmatch',methods=['POST','GET'])
@jwt_required()
def fetch_bestmatch():
    keyword=request.form['keyword']
    print(keyword)
    url = f"https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={keyword}&apikey={api_key}"
    print(f'Request URL: {url}')
    r = requests.get(url)
    data = r.json()
    return data

@app.route('/get-stock-data', methods=['POST','GET'])
@jwt_required()
def get_stock_data():
    symbol = request.form['symbol']
    print(symbol)
    url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval=5min&apikey={api_key}'
    response = requests.get(url)
    data = response.json()
    return jsonify(data)

if __name__=="__main__":
    app.run(debug=True)