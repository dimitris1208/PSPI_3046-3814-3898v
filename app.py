# BEGIN CODE HERE
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from pymongo import TEXT
from selenium import webdriver
from selenium.webdriver.common.by import By
import numpy as np

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://127.0.0.1:27017/pspi"
CORS(app)
mongo = PyMongo(app)
mongo.db.products.create_index([("name", TEXT)])


@app.route("/search", methods=["GET"])
def search():
    name = request.args.get('name', 'No Name')
    query = {"name": {"$regex": name, "$options": "i"}}
    return jsonify(list(mongo.db.products.find(query)))


@app.route("/add-product", methods=["POST"])
def add_product():
    collection = mongo.db.products
    data = request.get_json()
    name = data["name"]
    if len(list(collection.find({"name" : name}))) > 0 :
        collection.update_one({"name" : name}, { '$set' : {"production_year" : data["production_year"],"color" : data["color"],"price" : data["price"],"size" : data["size"]}})      
    else:
        collection.insert_one(data)
    return jsonify(list(collection.find({"name" : name})))


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
