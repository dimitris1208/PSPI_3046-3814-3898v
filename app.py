# BEGIN CODE HERE
from flask import Flask, jsonify, request, render_template
from flask_pymongo import PyMongo
from flask_cors import CORS
from pymongo import TEXT
from selenium import webdriver
from selenium.webdriver.common.by import By
import numpy as np

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config["MONGO_URI"] = "mongodb://127.0.0.1:27017/pspi"
CORS(app)
mongo = PyMongo(app)
mongo.db.products.create_index([("name", TEXT)])
app.secret_key="true"


@app.route("/search", methods=["GET"])
def search():
    name = request.args.get('name', '')
    query = {"name": {"$regex": name, "$options": "i"}}
    results = list(mongo.db.products.find(query))
    return render_template('products.html', results=results, keyword=name)


@app.route("/add-product", methods=["POST"])
def add_product():
    collection = mongo.db.products
    data = request.get_json()
    name = data["name"]
    if len(list(collection.find({"name" : name}))) > 0 :
        collection.update_one({"name" : name}, { '$set' : {"production_year" : data["production_year"],"color" : data["color"],"price" : data["price"],"size" : data["size"]}})      
    else:
        data["_id"] = str(int(collection.find().sort('_id', -1).limit(1)[0]["_id"]) + 1)
        collection.insert_one(data)
    results = list(collection.find({"name" : name}))
    return jsonify({"message": f"Product '{name}' added successfully"}), 201


@app.route("/content-based-filtering", methods=["POST"])
def content_based_filtering():
    collection = mongo.db.products
    products = list(collection.find({}))
    query = request.get_json()
    query_vector = np.array([float(query['production_year']), float(query['price']), float(query['color']), float(query['size'])])
    reccomended_products = []
    for doc in products:
        doc_vector = np.array([float(doc['production_year']), float(doc['price']), float(doc['color']), float(doc['size'])])
        dot_product = np.dot(query_vector, doc_vector)
        norm_v1 = np.linalg.norm(query_vector)
        norm_v2 = np.linalg.norm(doc_vector)
        dot_product / (norm_v1 * norm_v2)
        similarity = dot_product / (norm_v1 * norm_v2)
        if similarity >= 0.7:
            reccomended_products.append(doc['name'])
    return reccomended_products


@app.route("/crawler", methods=["GET"])
def crawler():
    semester = request.args.get('semester', '0')
    print(semester)
    subjects = []
    semester = int(semester)
    if semester >= 1 and semester <= 8:
        id = "exam"+str(semester)

        driver = webdriver.Chrome()

        url = "https://qa.auth.gr/el/x/studyguide/600000438/current"
        driver.get(url)
    
        text = driver.find_element(By.ID, id)
        rows = text.find_elements(By.TAG_NAME, "tr")

        for row in rows[1:]:
            subjects.append(row.find_element(By.CLASS_NAME, "title").text)
    return subjects

if __name__ == '__main__':
    app.run(debug=True)