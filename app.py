import os
from flask import Flask, render_template

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "aula1", "templates"),
    static_folder=os.path.join(BASE_DIR, "aula1", "static")
)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/combater")
def combater():
    return render_template("ferramentas.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)