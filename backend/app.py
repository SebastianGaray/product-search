from flask import Flask, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask import request
from elasticsearch import Elasticsearch, helpers
import random
from faker import Faker
import os
import time

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Define MongoDB connection

app.config["MONGO_URI"] = "{}?authSource=admin".format(os.environ.get("MONGO_URI"))
mongo = PyMongo(app)

# Define elastic search connection
# Wait 60 seconds for the connection to the Elasticsearch container.
es = Elasticsearch(
    [os.environ.get("ELASTIC_URI")], retry_on_timeout=True, max_retries=3, timeout=60
)

# Define the mapping for the products index
mapping = {
    "properties": {
        "name": {"type": "text"},
        "description": {"type": "text"},
        "price": {"type": "float"},
        "category": {"type": "keyword"},
    }
}
total_products = 1000000


def insert_data_to_elastic():
    # Index each product in Elasticsearch
    print("Indexing products...")
    products = mongo.db.products.find()
    i = 0
    actions = []
    for product in products:
        i += 1
        print(f"Elasticsearch: Indexing product {i} of {total_products}")
        actions.append(
            {
                "_index": "products",
                "_source": {
                    "name": product["name"],
                    "description": product["description"],
                    "price": product["price"],
                    "category": product["category"],
                    "image": product["image"],
                },
            }
        )
    helpers.bulk(es, actions)
    print("Products indexed successfully.")


def generate_data():
    print("Generating fake data...")
    # Initialize Faker
    fake = Faker()

    # Categories
    categories = [
        "smartphones",
        "clothes",
        "shoes",
        "televisions",
        "laptops",
        "books",
        "watches",
        "cameras",
        "headphones",
        "speakers",
        "video games",
        "accessories",
        "jewelry",
        "toys",
        "food",
        "furniture",
        "beauty",
        "sports",
        "outdoors",
        "industrial",
        "grocery",
        "automotive",
        "other",
    ]

    image_id = 1

    # Check if the products collection is empty
    if mongo.db.products.count_documents({}) == 0:
        # Generate and insert fake data
        for _ in range(total_products):
            product = {
                "name": fake.catch_phrase(),
                "description": fake.text(),
                "price": round(random.uniform(10, 10000), 2),
                "category": random.choice(categories),
                "image": f"https://picsum.photos/id/{image_id}/200/300",
            }
            image_id += 1
            # Reset the image_id to 1 if it reaches 1084
            if image_id == 1084:
                image_id = 1
            mongo.db.products.insert_one(product)
        print("Fake data inserted successfully.")
    else:
        print("Products collection is not empty. No data inserted.")


@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify({"status": "Hello from backend!"})


def search_products(search_query, search_type, page_size, num_products_to_skip):
    products_list = []

    if search_type == "elasticsearch":
        # Use Elasticsearch to search for products
        # Define the Elasticsearch query using the multi_match query
        es_query = {
            "query": {
                "multi_match": {
                    "query": search_query,
                    "fields": ["name", "category", "description"],
                }
            }
        }

        # Execute the Elasticsearch query
        results = es.search(index="products", body=es_query)
        for hit in results["hits"]["hits"]:
            product = hit["_source"]
            products_list.append(
                {
                    "name": product["name"],
                    "description": product["description"],
                    "price": product["price"],
                    "category": product["category"],
                    "image": product["image"],
                }
            )
    else:
        # Use MongoDB to search for products
        for product in (
            mongo.db.products.find(
                {
                    "$or": [
                        {"name": {"$regex": search_query, "$options": "i"}},
                        {"category": {"$regex": search_query, "$options": "i"}},
                        {"description": {"$regex": search_query, "$options": "i"}},
                    ]
                }
            )
            .skip(num_products_to_skip)
            .limit(page_size)
        ):
            products_list.append(
                {
                    "name": product["name"],
                    "description": product["description"],
                    "price": product["price"],
                    "category": product["category"],
                    "image": product["image"],
                }
            )

    return products_list


@app.route("/api/products", methods=["GET"])
def get_mongo_products():
    # Get the page number and page size from the request parameters
    page = int(request.args.get("page", 1))
    page_size = int(request.args.get("page_size", 12))
    # Get the search query from the request parameters
    search_query = request.args.get("search")
    search_type = request.args.get("search_type", "mongo")

    # Calculate the number of products to skip based on the page number and page size
    num_products_to_skip = (page - 1) * page_size

    # Get the total number of products
    total_num_products = mongo.db.products.count_documents({})

    products_list = []

    start_time = time.time()

    if search_query:
        products_list = search_products(
            search_query, search_type, page_size, num_products_to_skip
        )
    else:
        # Get the products for the current page
        for product in (
            mongo.db.products.find().skip(num_products_to_skip).limit(page_size)
        ):
            products_list.append(
                {
                    "name": product["name"],
                    "description": product["description"],
                    "price": product["price"],
                    "category": product["category"],
                    "image": product["image"],
                }
            )

    # Calculate the total number of pages
    total_num_pages = (total_num_products + page_size - 1) // page_size

    end_time = time.time()

    total_time = end_time - start_time

    # Return the products for the current page and pagination information
    return jsonify(
        {
            "products": products_list,
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total_num_products": total_num_products,
                "total_num_pages": total_num_pages,
            },
            "metadata": {
                "total_hits": len(products_list),
                "time_taken": total_time,
            },
        }
    )


if __name__ == "__main__":
    # Run the Flask app
    app.run(host="localhost", port=5000)

# Generate fake data
generate_data()
insert_data_to_elastic()
