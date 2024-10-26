from flask import Flask
import os


def create_app() -> Flask:
    app: Flask = Flask(__name__, template_folder='templates')

    try:
        os.makedirs(app.instance_path)
    except OSError:
        print("warn: could not create instance folder!")
        pass

    from routes import bp as main_bp
    app.register_blueprint(main_bp)

    return app
