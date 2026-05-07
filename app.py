import os
from flask import Flask, render_template

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

print("cavalo")

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "templates"),
    static_folder=os.path.join(BASE_DIR, "static")
)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/info")
def info():
    return render_template("info.html")

@app.route("/combater")
def combater():
    return render_template("combater.html")


@app.route("/ferramentas")
def ferramentas():
    return render_template("ferramentas.html")


@app.route("/privacidade")
def privacidade():
    return render_template("privacidade.html")


@app.route("/termos")
def termos():
    return render_template("termos.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)