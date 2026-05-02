from flask import Flask, render_template
from pyngrok import ngrok

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/combater")
def combater():
    return render_template("combater.html")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

    app.run(port=5000)