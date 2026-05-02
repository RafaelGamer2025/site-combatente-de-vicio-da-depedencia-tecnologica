from flask import Flask, render_template

app = Flask(
    __name__,
    template_folder="aula1/templates",
    static_folder="aula1/static"
)


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/combater")
def combater():
    return render_template("combater.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)